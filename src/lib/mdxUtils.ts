import "server-only";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'; // Import the result type
// Import remark/rehype plugins if needed (e.g., for syntax highlighting with Prism)
// import remarkPrism from 'remark-prism'; // Example

// Define the structure of your frontmatter
export interface PostFrontmatter {
  title: string;
  date: string; // Keep as string for serialization
  excerpt: string;
  category?: string;
  tags?: string[];
  [key: string]: string | string[] | undefined; // More specific type instead of any
}

export interface Post<TFrontmatter> {
  slug: string;
  frontmatter: TFrontmatter;
}

export interface PostWithSource<TFrontmatter> extends Post<TFrontmatter> {
  source: MDXRemoteSerializeResult; // Use the imported type
}

const postsDirectory = path.join(process.cwd(), 'content/blog');

// Get all filenames/slugs from the blog directory
export function getAllPostSlugs() {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => fileName.replace(/\.mdx$/, ''));
  } catch (error) {
    console.error("Error reading blog directory:", error);
    return []; // Return empty array if directory doesn't exist or error occurs
  }
}

// Get sorted posts data (slug + frontmatter)
export function getSortedPostsData(): Post<PostFrontmatter>[] {
  const slugs = getAllPostSlugs();
  const allPostsData = slugs.map((slug) => {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    // Ensure date is treated correctly
    const frontmatter = { ...data, date: data.date.toISOString() } as PostFrontmatter;

    return {
      slug,
      frontmatter,
    };
  });

  // Sort posts by date (newest first)
  return allPostsData.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date);
    const dateB = new Date(b.frontmatter.date);
    return dateB.getTime() - dateA.getTime();
  });
}

// Get individual post data and serialize MDX
export async function getPostData(slug: string): Promise<PostWithSource<PostFrontmatter> | null> {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const mdxSource = await serialize(content, {
      // Optionally pass remark/rehype plugins
      mdxOptions: {
        // remarkPlugins: [remarkPrism], // Enable Prism remark plugin if installed
        rehypePlugins: [],
      },
      parseFrontmatter: false, // We already parsed it with gray-matter
    });

    // Convert date to string for serialization
    const frontmatter = { ...data, date: data.date.toISOString() } as PostFrontmatter;

    return {
      slug,
      frontmatter,
      source: mdxSource,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null; // Return null if file not found or error occurs
  }
} 