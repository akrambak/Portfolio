import { getSortedPostsData } from "@/lib/mdxUtils";
import BlogClientPage from "./BlogClientPage"; // Import the renamed client component

export default async function BlogPageServer() {
  // Fetch data on the server
  const allPosts = getSortedPostsData();

  // Render the client component, passing the data as props
  return <BlogClientPage allPosts={allPosts} />;
} 