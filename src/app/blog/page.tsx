"use client"; // Make it a client component for state

import { useState, useMemo } from "react";
import PostCard from "@/components/PostCard";
import { getSortedPostsData, Post, PostFrontmatter } from "@/lib/mdxUtils";

// Fetch data outside component if possible, or ensure it's memoized/stable
// For simplicity in this example, fetching inside, but consider implications

export default function BlogPage() {
  // Fetch all posts (consider fetching once and passing down if layout structure allows)
  const allPosts = useMemo(() => getSortedPostsData(), []);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const categories = useMemo(() => Array.from(new Set(allPosts.map(p => p.frontmatter.category).filter(Boolean))), [allPosts]);
  const tags = useMemo(() => Array.from(new Set(allPosts.flatMap(p => p.frontmatter.tags || []))), [allPosts]);

  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      const categoryMatch = !selectedCategory || post.frontmatter.category === selectedCategory;
      const tagMatch = !selectedTag || (post.frontmatter.tags && post.frontmatter.tags.includes(selectedTag));
      return categoryMatch && tagMatch;
    });
  }, [allPosts, selectedCategory, selectedTag]);

  const handleFilterClear = () => {
    setSelectedCategory(null);
    setSelectedTag(null);
  };

  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold tracking-tight">Blog</h1>
      <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
        Thoughts and updates on web development, PrestaShop, Flutter, and more.
      </p>

      {/* Filtering Controls */}
      <div className="mb-10 space-y-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-medium text-gray-700 dark:text-gray-300">Filter by:</span>
          {/* Category Filters */}
          {categories.map(category => (
            <button
              key={category}
              onClick={() => { 
                  // Ensure category is defined before setting state
                  if (category) {
                      setSelectedCategory(category);
                      setSelectedTag(null);
                  }
              }}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${selectedCategory === category ? 'bg-accent-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
            >
              {category}
            </button>
          ))}
          {/* Tag Filters */}
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => { setSelectedTag(tag); setSelectedCategory(null); }}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${selectedTag === tag ? 'bg-accent-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
            >
              #{tag}
            </button>
          ))}
          {/* Clear Filter Button */}
          {(selectedCategory || selectedTag) && (
            <button
              onClick={handleFilterClear}
              className="text-sm text-gray-500 hover:text-accent-600 dark:text-gray-400 dark:hover:text-accent-400"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-1">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-10">
            No posts found matching your filters. { (selectedCategory || selectedTag) && <button onClick={handleFilterClear} className="text-accent-600 dark:text-accent-400 hover:underline ml-2">Clear filter?</button>}
          </p>
        )}
      </div>
    </div>
  );
} 