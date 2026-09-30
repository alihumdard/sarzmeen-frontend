import Link from "next/link";
import { ChevronRightIcon } from "@/components/ui/Icons";
import InvestPromo from "@/components/blog/InvestPromo";
import NewsletterBox from "@/components/blog/NewsletterBox";
import { serverApi } from "@/lib/api/server";
import type { BlogCategory, BlogTag } from "@/types/blog";

type BlogSidebarProps = {
  activeCategory?: string;
};

export default async function BlogSidebar({ activeCategory }: BlogSidebarProps) {
  const isAllActive = !activeCategory;

  let blogCategories: BlogCategory[] = [];
  let blogTags: BlogTag[] = [];

  try {
    const [catsRes, tagsRes] = await Promise.all([
      serverApi<{ data: BlogCategory[] }>("/blog-categories"),
      serverApi<{ data: BlogTag[] }>("/blog-tags"),
    ]);
    blogCategories = catsRes.data;
    blogTags = tagsRes.data;
  } catch {
    // fallback empty
  }

  return (
    <aside className="flex flex-col gap-6">
      {/* Categories */}
      <div className="rounded-lg border border-border bg-white p-5">
        <h2 className="text-[15px] font-bold text-heading">Categories</h2>

        <ul className="mt-4 flex flex-col gap-1">
          <li>
            <Link
              href="/blog"
              aria-current={isAllActive ? "page" : undefined}
              className={`flex items-center justify-between rounded-md px-3 py-2.5 text-[12px] transition-colors ${
                isAllActive
                  ? "bg-primary-light font-semibold text-primary"
                  : "text-text hover:bg-surface hover:text-primary"
              }`}
            >
              All Categories
              <ChevronRightIcon className="h-3.5 w-3.5 shrink-0" />
            </Link>
          </li>

          {blogCategories.map((category) => {
            const isActive = category.slug === activeCategory;

            return (
              <li key={category.id}>
                <Link
                  href={`/blog/category/${category.slug}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center justify-between gap-3 rounded-md px-3 py-2.5 text-[12px] transition-colors ${
                    isActive
                      ? "bg-primary-light font-semibold text-primary"
                      : "text-text hover:bg-surface hover:text-primary"
                  }`}
                >
                  <span className="truncate">{category.name}</span>
                  <span className="shrink-0 text-muted">{category.count}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Popular tags */}
      {blogTags.length > 0 && (
        <div className="rounded-lg border border-border bg-white p-5">
          <h2 className="text-[15px] font-bold text-heading">Popular Tags</h2>

          <ul className="mt-4 flex flex-wrap gap-2">
            {blogTags.map((tag) => (
              <li key={tag.id}>
                <Link
                  href={`/blog?tag=${tag.slug}`}
                  className="block rounded-md border border-border px-3 py-1.5 text-[11px] text-text transition-colors hover:border-primary hover:text-primary"
                >
                  {tag.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <NewsletterBox />
      <InvestPromo />
    </aside>
  );
}
