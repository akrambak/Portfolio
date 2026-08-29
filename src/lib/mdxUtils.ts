import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PostFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  category?: string;
  tags?: string[];
  readingMinutes: number;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
}

export interface PostWithSource extends Post {
  content: string;
}

const postsDirectory = path.join(process.cwd(), "content/blog");

const WORDS_PER_MINUTE = 220;

function readPost(slug: string) {
  const fileContents = fs.readFileSync(path.join(postsDirectory, `${slug}.mdx`), "utf8");
  const { data, content } = matter(fileContents);
  const words = content.trim().split(/\s+/).length;

  const frontmatter: PostFrontmatter = {
    title: data.title,
    date: new Date(data.date).toISOString(),
    excerpt: data.excerpt,
    category: data.category,
    tags: data.tags,
    readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
  };

  return { slug, frontmatter, content };
}

export function getAllPostSlugs(): string[] {
  try {
    return fs
      .readdirSync(postsDirectory)
      .filter((name) => name.endsWith(".mdx"))
      .map((name) => name.replace(/\.mdx$/, ""));
  } catch {
    return [];
  }
}

export function getSortedPostsData(): Post[] {
  return getAllPostSlugs()
    .map((slug) => {
      const { frontmatter } = readPost(slug);
      return { slug, frontmatter };
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime(),
    );
}

export function getPostData(slug: string): PostWithSource | null {
  try {
    return readPost(slug);
  } catch {
    return null;
  }
}

export function getAdjacentPosts(slug: string): { previous: Post | null; next: Post | null } {
  const posts = getSortedPostsData();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: posts[index + 1] ?? null,
    next: posts[index - 1] ?? null,
  };
}
