"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BlogCard from "@/components/blog/BlogCard";
import BlogListRow from "@/components/blog/BlogListRow";
import { GridViewIcon, ListViewIcon } from "@/components/ui/Icons";
import Dropdown from "@/components/ui/Dropdown";
import Pagination from "@/components/ui/Pagination";
import { blogUrl } from "@/lib/blogFilters";
import type { BlogPost } from "@/types/blog";

type BlogListProps = {
  posts: BlogPost[];
  /** Total posts matching the active filters, from the API. */
  total: number;
  page: number;
  lastPage: number;
  pageSize: number;
  sort: string;
  search: string;
  category: string;
  tag: string;
};

const sortOptions = [
  { label: "Latest First", value: "latest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Most Popular", value: "popular" },
];

/**
 * Toolbar plus the post grid. Every filter is held in the URL and resolved
 * by the server, so sorting and pagination run across all posts rather than
 * only the ones already on screen. View mode stays local since it is purely
 * presentational.
 */
export default function BlogList({
  posts,
  total,
  page,
  lastPage,
  pageSize,
  sort,
  search,
  category,
  tag,
}: BlogListProps) {
  const router = useRouter();
  const [view, setView] = useState<"grid" | "list">("grid");

  const hasFilters = Boolean(search || category || tag);
  const firstItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(firstItem + posts.length - 1, total);

  function go(next: { sort?: string; page?: number }) {
    router.push(
      blogUrl({
        q: search,
        category,
        tag,
        sort: next.sort ?? sort,
        page: next.page,
      }),
      { scroll: false },
    );
  }

  function handleSort(value: string) {
    go({ sort: value, page: 1 });
  }

  function handlePageChange(nextPage: number) {
    go({ page: nextPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const toggleClasses =
    "flex h-9 w-9 items-center justify-center rounded-md border transition-colors";

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-[13px] text-text">
          {total === 0 ? (
            "No blogs found"
          ) : (
            <>
              Showing{" "}
              <span className="font-semibold text-heading">
                {firstItem}-{lastItem}
              </span>{" "}
              of <span className="font-semibold text-heading">{total}</span>{" "}
              Blogs
            </>
          )}
        </p>

        <div className="flex items-center gap-3">
          <span className="text-[12px] text-muted">Sort by:</span>

          <Dropdown
            label="Sort by"
            options={sortOptions}
            value={sort}
            onChange={handleSort}
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

      {/* Active filters */}
      {hasFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[12px] text-muted">Filters:</span>

          {search && (
            <FilterChip
              label={`Search: ${search}`}
              href={blogUrl({ category, tag, sort })}
            />
          )}
          {category && (
            <FilterChip
              label={`Category: ${category.replace(/-/g, " ")}`}
              href={blogUrl({ q: search, tag, sort })}
            />
          )}
          {tag && (
            <FilterChip
              label={`Tag: ${tag.replace(/-/g, " ")}`}
              href={blogUrl({ q: search, category, sort })}
            />
          )}

          <Link
            href="/blog"
            className="text-[12px] font-semibold text-primary hover:underline"
          >
            Clear all
          </Link>
        </div>
      )}

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-border bg-white py-16 text-center">
          <p className="text-[14px] font-semibold text-heading">
            No blogs match your filters.
          </p>
          <p className="mt-1.5 text-[12px] text-muted">
            Try a different keyword or browse all categories.
          </p>
          {hasFilters && (
            <Link
              href="/blog"
              className="mt-4 inline-block rounded-md bg-primary px-5 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Clear filters
            </Link>
          )}
        </div>
      ) : view === "grid" ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} variant="full" />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {posts.map((post) => (
            <BlogListRow key={post.id} post={post} />
          ))}
        </div>
      )}

      {lastPage > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={lastPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1.5 text-[11px] font-medium capitalize text-primary transition-colors hover:bg-primary hover:text-white"
    >
      {label}
      <span aria-hidden="true">✕</span>
      <span className="sr-only">Remove filter</span>
    </Link>
  );
}
