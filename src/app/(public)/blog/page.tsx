import type { Metadata } from "next";
import { Suspense } from "react";
import BlogList from "@/components/blog/BlogList";
import BlogSearch from "@/components/blog/BlogSearch";
import BlogSidebar from "@/components/blog/BlogSidebar";
import PageBanner from "@/components/layout/PageBanner";
import { latestPosts, totalBlogCount } from "@/constants/mockBlogs";

export const metadata: Metadata = {
  title: "Our Blogs",
  description:
    "Stay updated with the latest real estate news, market trends, investment tips and property guides from across Pakistan.",
};

export default function BlogPage() {
  return (
    <main>
      <PageBanner
        title="Our Blogs"
        description="Stay updated with the latest real estate news, market trends, investment tips and property guides."
        crumbs={[{ label: "Home", href: "/" }, { label: "Blogs" }]}
        image="/images/blog-banner.jpg"
      >
        <Suspense fallback={null}>
          <BlogSearch />
        </Suspense>
      </PageBanner>

      <section className="bg-surface py-10">
        <div className="container-page grid items-start gap-6 lg:grid-cols-[250px_1fr]">
          <BlogSidebar />
          <Suspense fallback={null}>
            <BlogList posts={latestPosts} total={totalBlogCount} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
