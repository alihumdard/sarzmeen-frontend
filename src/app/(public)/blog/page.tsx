import type { Metadata } from "next";
import BlogList from "@/components/blog/BlogList";
import BlogSearch from "@/components/blog/BlogSearch";
import BlogSidebar from "@/components/blog/BlogSidebar";
import PageBanner from "@/components/layout/PageBanner";
import StayUpdatedStrip from "@/components/layout/StayUpdatedStrip";
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
      >
        <BlogSearch />
      </PageBanner>

      <section className="bg-surface py-10">
        <div className="container-page grid items-start gap-6 lg:grid-cols-[250px_1fr]">
          <BlogSidebar />
          <BlogList posts={latestPosts} total={totalBlogCount} />
        </div>
      </section>

      <StayUpdatedStrip />
    </main>
  );
}
