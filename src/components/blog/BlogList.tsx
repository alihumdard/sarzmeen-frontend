"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import BlogCard from "@/components/blog/BlogCard";
import BlogListRow from "@/components/blog/BlogListRow";
import { GridViewIcon, ListViewIcon } from "@/components/ui/Icons";
import Dropdown from "@/components/ui/Dropdown";
import Pagination from "@/components/ui/Pagination";
import type { BlogPost } from "@/types/blog";

type BlogListProps = {
  posts: BlogPost[];
  /** Total published posts, used for the "Showing x-y of z" line. */
  total: number;
};

/** Posts per page — matches the nine cards the listing shows at a time. */
const PAGE_SIZE = 9;

/** Must match BlogSearch's MIN_SEARCH_LENGTH. */
const MIN_SEARCH_LENGTH = 3;

const sortOptions = [
  { label: "Latest First", value: "latest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Most Popular", value: "popular" },
];

/**
 * Toolbar plus the post grid. View mode and sort are local state in V1 —
 * sorting is applied to the mock array rather than requested from an API.
 * The `q` URL param (set by BlogSearch once 3+ characters are typed)
 * filters posts by title, excerpt and category client-side.
 */
export default function BlogList({ posts, total }: BlogListProps) {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();
  const isSearching = query.length >= MIN_SEARCH_LENGTH;

  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!isSearching) return posts;

    const needle = query.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(needle) ||
        post.excerpt.toLowerCase().includes(needle) ||
        post.category.toLowerCase().includes(needle),
    );
  }, [posts, query, isSearching]);

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "oldest") {
      return a.publishedAt.localeCompare(b.publishedAt);
    }
    if (sort === "popular") {
      return b.readTime - a.readTime;
    }
    return b.publishedAt.localeCompare(a.publishedAt);
  });

  /*
   * Pages are derived from the full published count so the control matches
   * what the API will return; only the mock page is actually rendered.
   * While searching, the filtered count is the source of truth instead.
   */
  const effectiveTotal = isSearching ? sorted.length : total;
  const totalPages = Math.max(1, Math.ceil(effectiveTotal / PAGE_SIZE));
  const firstItem = sorted.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastItem = Math.min(firstItem + sorted.length - 1, effectiveTotal);

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const toggleClasses =
    "flex h-9 w-9 items-center justify-center rounded-md border transition-colors";

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-[13px] text-text">
          {sorted.length === 0 ? (
            <>
              No blogs found for{" "}
              <span className="font-semibold text-heading">
                &ldquo;{query}&rdquo;
              </span>
            </>
          ) : (
            <>
              Showing{" "}
              <span className="font-semibold text-heading">
                {firstItem}-{lastItem}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-heading">
                {effectiveTotal}
              </span>{" "}
              {isSearching ? (
                <>
                  Blogs for{" "}
                  <span className="font-semibold text-heading">
                    &ldquo;{query}&rdquo;
                  </span>
                </>
              ) : (
                "Blogs"
              )}
            </>
          )}
        </p>

        <div className="flex items-center gap-3">
          <span className="text-[12px] text-muted">Sort by:</span>

          <Dropdown
            label="Sort by"
            options={sortOptions}
            value={sort}
            onChange={setSort}
            triggerClassName="flex items-center justify-between gap-2 rounded-md border border-border bg-white py-2 pl-3 pr-2.5 text-[12px] text-heading outline-none transition-colors hover:border-primary focus:border-primary"
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
              className={`${toggleClasses} ${
                view === "grid"
                  ? "border-primary bg-primary-light text-primary"
                  : "border-border text-muted hover:text-primary"
              }`}
            >
              <GridViewIcon className="h-4 w-4" />
            </button>

            <button
              type="button"
              aria-label="List view"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
              className={`${toggleClasses} ${
                view === "list"
                  ? "border-primary bg-primary-light text-primary"
                  : "border-border text-muted hover:text-primary"
              }`}
            >
              <ListViewIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Posts */}
      {sorted.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-border bg-white py-16 text-center">
          <p className="text-[14px] font-semibold text-heading">
            No blogs match your search.
          </p>
          <p className="mt-1.5 text-[12px] text-muted">
            Try a different keyword or browse all categories.
          </p>
        </div>
      ) : view === "grid" ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {sorted.map((post) => (
            <BlogCard key={post.id} post={post} variant="full" />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {sorted.map((post) => (
            <BlogListRow key={post.id} post={post} />
          ))}
        </div>
      )}

      <div className="mt-8">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
