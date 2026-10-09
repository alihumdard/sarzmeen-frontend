import Link from "next/link";
import { ChevronRightIcon } from "@/components/ui/Icons";
import InvestPromo from "@/components/blog/InvestPromo";
import NewsletterBox from "@/components/blog/NewsletterBox";
import { serverApi } from "@/lib/api/server";
import { blogUrl } from "@/lib/blogFilters";
import type { BlogCategory, BlogTag } from "@/types/blog";

type BlogSidebarProps = {
  activeCategory?: string;
  activeTag?: string;
  /**
   * Set on the dedicated /blog/category/[slug] route, where categories are
   * paths rather than query filters and the tag list should link back to
   * the main listing.
   */
  useCategoryRoutes?: boolean;
};

export default async function BlogSidebar({
  activeCategory = "",
  activeTag = "",
  useCategoryRoutes = false,
}: BlogSidebarProps) {
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
              href={blogUrl({ tag: activeTag })}
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

            // Clicking the active category clears it, so it works as a toggle.
            const href = useCategoryRoutes
              ? `/blog/category/${category.slug}`
              : blogUrl({
                  category: isActive ? undefined : category.slug,
                  tag: activeTag,
                });

            return (
              <li key={category.id}>
                <Link
                  href={href}
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
            {blogTags.map((tag) => {
              const isActive = tag.slug === activeTag;

              return (
                <li key={tag.id}>
                  <Link
                    href={blogUrl({
                      tag: isActive ? undefined : tag.slug,
                      category: useCategoryRoutes ? undefined : activeCategory,
                    })}
                    aria-current={isActive ? "page" : undefined}
                    className={`block rounded-md border px-3 py-1.5 text-[11px] transition-colors ${
                      isActive
                        ? "border-primary bg-primary-light font-semibold text-primary"
                        : "border-border text-text hover:border-primary hover:text-primary"
                    }`}
                  >
                    {tag.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <NewsletterBox />
      <InvestPromo />
    </aside>
  );
}
