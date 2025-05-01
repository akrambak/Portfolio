"use client"; // Keep as client component if using hooks like useDateFormatter

import Link from "next/link";
import { Post, PostFrontmatter } from "@/lib/mdxUtils"; // Import types

// Basic date formatting, consider a library like date-fns for more robust formatting
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface PostCardProps {
  post: Post<PostFrontmatter>;
}

export default function PostCard({ post }: PostCardProps) {
  const { slug, frontmatter } = post;
  const { title, date, excerpt, category, tags } = frontmatter;

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <time dateTime={date}>{formatDate(date)}</time>
        {category && (
          <span className="inline-block rounded bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-800 dark:bg-accent-900 dark:text-accent-200">
            {category}
          </span>
        )}
      </div>
      <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        <Link href={`/blog/${slug}`} className="hover:underline">
          {title}
        </Link>
      </h2>
      <p className="mb-4 font-light text-gray-600 dark:text-gray-300">
        {excerpt}
      </p>
      {tags && tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              #{tag}
            </span>
          ))}
        </div>
      )}
      <Link
        href={`/blog/${slug}`}
        className="inline-flex items-center font-medium text-accent-600 hover:text-accent-800 dark:text-accent-400 dark:hover:text-accent-300"
      >
        Read more
        <svg className="ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
      </Link>
    </article>
  );
} 