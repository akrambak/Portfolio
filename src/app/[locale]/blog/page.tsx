import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSortedPostsData } from "@/lib/mdxUtils";
import type { Locale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import BlogClientPage from "./BlogClientPage"; // Import the renamed client component

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata({
    locale,
    path: "/blog",
    title: t("blogPage.title"),
    description: t("blogPage.lede"),
  });
}

export default async function BlogPageServer({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch data on the server
  const allPosts = getSortedPostsData();

  // Render the client component, passing the data as props
  return <BlogClientPage allPosts={allPosts} />;
} 