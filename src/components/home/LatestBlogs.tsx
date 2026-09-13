import Link from "next/link";
import BlogCard from "@/components/blog/BlogCard";
import Carousel from "@/components/ui/Carousel";
import { latestPosts } from "@/constants/mockBlogs";

export default function LatestBlogs() {
  return (
    <section className="bg-white py-14">
      <div className="container-page">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-[26px] font-bold text-heading">
              Expert Tips &amp; Market Insights
            </h2>
            <p className="mt-1 text-[13px] text-muted">
              Stay updated with real estate trends and expert advice
            </p>
          </div>

          <Link
            href="/blog"
            className="rounded-md border border-primary px-4 py-2 text-[12px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            View All Blogs
          </Link>
        </div>

        <Carousel
          itemCount={latestPosts.length}
          itemsPerPage={4}
          label="articles"
          showDots={false}
        >
          {latestPosts.map((post) => (
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
