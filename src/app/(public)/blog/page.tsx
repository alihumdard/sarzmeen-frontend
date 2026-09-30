import type { Metadata } from "next";
import { Suspense } from "react";
import BlogList from "@/components/blog/BlogList";
import BlogSearch from "@/components/blog/BlogSearch";
import BlogSidebar from "@/components/blog/BlogSidebar";
import PageBanner from "@/components/layout/PageBanner";
import { serverApi } from "@/lib/api/server";
import type { BlogPost } from "@/types/blog";

export const metadata: Metadata = {
  title: "Our Blogs",
  description:
    "Stay updated with the latest real estate news, market trends, investment tips and property guides from across Pakistan.",
};

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  let total = 0;

  try {
    const res = await serverApi<{
      data: BlogPost[];
      meta: { total: number };
    }>("/blogs");
    posts = res.data;
    total = res.meta.total;
  } catch {
    // fallback empty
  }

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
            <BlogList posts={posts} total={total} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
