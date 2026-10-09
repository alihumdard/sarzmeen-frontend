import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import BlogList from "@/components/blog/BlogList";
import BlogSearch from "@/components/blog/BlogSearch";
import BlogSidebar from "@/components/blog/BlogSidebar";
import PageBanner from "@/components/layout/PageBanner";
import { serverApi } from "@/lib/api/server";
import { blogUrl } from "@/lib/blogFilters";
import type { BlogPost } from "@/types/blog";

export const metadata: Metadata = {
  title: "Our Blogs",
  description:
    "Stay updated with the latest real estate news, market trends, investment tips and property guides from across Pakistan.",
};

const PAGE_SIZE = 9;
const SORTS = ["latest", "oldest", "popular"];

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  const search = one(sp.q);
  const category = one(sp.category);
  const tag = one(sp.tag);
  const sortRaw = one(sp.sort);
  const sort = SORTS.includes(sortRaw) ? sortRaw : "latest";
  const page = Math.max(1, Number(one(sp.page)) || 1);

  const query = new URLSearchParams({
    page: String(page),
    per_page: String(PAGE_SIZE),
    sort,
  });
  if (search) query.set("search", search);
  if (category) query.set("category", category);
  if (tag) query.set("tag", tag);

  let posts: BlogPost[] = [];
  let total = 0;
  let lastPage = 1;

  try {
    const res = await serverApi<{
      data: BlogPost[];
      meta: { total: number; last_page: number };
    }>(`/blogs?${query.toString()}`);
    posts = res.data;
    total = res.meta.total;
    lastPage = res.meta.last_page;
  } catch {
    // fallback empty
  }

  // A page past the end would render an impossible "Showing 10-9 of 9" range.
  if (page > lastPage && total > 0) {
    redirect(blogUrl({ q: search, category, tag, sort, page: lastPage }));
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
          <BlogSidebar activeCategory={category} activeTag={tag} />
          <Suspense fallback={null}>
            <BlogList
              posts={posts}
              total={total}
              page={page}
              lastPage={lastPage}
              pageSize={PAGE_SIZE}
              sort={sort}
              search={search}
              category={category}
              tag={tag}
            />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
