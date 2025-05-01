import { getAllPostSlugs, getPostData, PostFrontmatter } from "@/lib/mdxUtils";
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Link from "next/link";
import type { Metadata } from 'next';

// Generate static paths for all posts
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for the page
export async function generateMetadata({ params: { slug } }: { params: { slug: string } }): Promise<Metadata> {
  const postData = await getPostData(slug);
  if (!postData) {
    return {
      title: 'Post Not Found',
    };
  }
  return {
    title: `${postData.frontmatter.title} - Blog`,
    description: postData.frontmatter.excerpt,
    // Add other metadata like open graph tags if needed
  };
}

// Format date function (can be moved to a shared util)
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// The main page component
export default async function BlogPostPage({ params: { slug } }: { params: { slug: string } }) {
  const postData = await getPostData(slug);

  if (!postData) {
    notFound(); // Trigger 404 if post doesn't exist
  }

  const { source, frontmatter } = postData;
  const { title, date, category, tags } = frontmatter as PostFrontmatter;

  return (
    <article>
      {/* Post Header */}
      <header className="mb-8 border-b border-gray-200 pb-6 dark:border-gray-700">
        <h1 className="mb-4 text-center text-3xl font-extrabold leading-tight text-gray-900 dark:text-white lg:mb-6 lg:text-4xl">
          {title}
        </h1>
        <div className="mb-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
          <time dateTime={date}>Published on {formatDate(date)}</time>
          {category && (
            <span>
              In <Link href={`/blog?category=${category}`} className="font-medium text-accent-600 hover:underline dark:text-accent-400">{category}</Link>
            </span>
          )}
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${tag}`}
                className="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Post Content - Apply typography styles */}
      <div className="prose prose-lg max-w-none dark:prose-invert">
        {/* Render the MDX content */}
        {/* You can pass custom components here if needed */}
        <MDXRemote source={source} components={{}} />
      </div>
    </article>
  );
}

// Note: For Prism.js syntax highlighting to work, you need to:
// 1. Install Prism.js themes (e.g., `npm install prism-themes`)
// 2. Import the chosen theme CSS in `src/app/globals.css` (e.g., `@import 'prism-themes/themes/prism-vsc-dark-plus.css';`)
// 3. Potentially install and configure `remark-prism` or a similar rehype plugin within `mdxUtils.ts` serialize options.
//    The current setup uses basic MDX rendering without explicit Prism integration yet. 