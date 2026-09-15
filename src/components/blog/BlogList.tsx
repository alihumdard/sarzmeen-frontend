"use client";

import { useState } from "react";
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

const sortOptions = [
  { label: "Latest First", value: "latest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Most Popular", value: "popular" },
];

/**
 * Toolbar plus the post grid. View mode and sort are local state in V1 —
 * sorting is applied to the mock array rather than requested from an API.
 */
export default function BlogList({ posts, total }: BlogListProps) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);

  const sorted = [...posts].sort((a, b) => {
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
   */
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const firstItem = (page - 1) * PAGE_SIZE + 1;
  const lastItem = Math.min(firstItem + sorted.length - 1, total);

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
          Showing{" "}
          <span className="font-semibold text-heading">
            {firstItem}-{lastItem}
          </span>{" "}
          of <span className="font-semibold text-heading">{total}</span> Blogs
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
      {view === "grid" ? (
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
