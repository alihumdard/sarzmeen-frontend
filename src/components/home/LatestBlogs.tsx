import Link from "next/link";
import BlogCard from "@/components/blog/BlogCard";
import Carousel from "@/components/ui/Carousel";
import { serverApi } from "@/lib/api/server";
import type { BlogPost } from "@/types/blog";

export default async function LatestBlogs() {
  let posts: BlogPost[] = [];

  try {
    const res = await serverApi<{ data: BlogPost[] }>("/blogs?per_page=8");
    posts = res.data;
  } catch {
    // fallback empty
  }

  if (posts.length === 0) return null;

  return (
    <section className="bg-white py-6 sm:py-8">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[26px] font-bold text-heading sm:text-[30px]">
              Expert Tips &amp; Market Insights
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              Stay updated with real estate trends and expert advice
            </p>
          </div>

          <Link
            href="/blog"
            className="rounded-md border-2 border-primary px-5 py-2.5 text-[13px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            View All Blogs
          </Link>
        </div>

        <Carousel
          itemCount={posts.length}
          itemsPerPage={4}
          label="articles"
          showDots={false}
        >
          {posts.map((post) => (
            <div
              key={post.id}
              className="w-[270px] shrink-0 snap-start sm:w-[300px] lg:w-[calc((100%-60px)/4)]"
            >
              <BlogCard post={post} />
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
