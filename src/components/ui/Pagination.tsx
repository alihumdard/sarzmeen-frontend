"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/Icons";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

/**
 * Builds the page list with gaps, e.g. [1, 2, 3, 4, 5, "…", 8].
 *
 * The first and last page are always shown; a run of pages around the current
 * one fills the middle, and an ellipsis stands in for whatever is skipped.
 */
function buildPages(current: number, total: number): (number | "gap")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "gap")[] = [];
  const start = Math.max(2, Math.min(current - 1, total - 4));
  const end = Math.min(total - 1, Math.max(current + 1, 5));

  pages.push(1);
  if (start > 2) pages.push("gap");

  for (let page = start; page <= end; page += 1) pages.push(page);

  if (end < total - 1) pages.push("gap");
  pages.push(total);

  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPages(currentPage, totalPages);

  const buttonBase =
    "flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-[12px] font-medium transition-colors";

  return (
    <nav aria-label="Pagination" className="flex justify-center">
      <ul className="flex flex-wrap items-center gap-2">
        <li>
          <button
            type="button"
            aria-label="Previous page"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={`${buttonBase} border-border text-heading hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40`}
          >
            <ChevronLeftIcon className="h-3.5 w-3.5" />
          </button>
        </li>

        {pages.map((page, index) =>
          page === "gap" ? (
            <li
              key={`gap-${index}`}
              aria-hidden="true"
              className="px-1 text-[12px] text-muted"
            >
              …
            </li>
          ) : (
            <li key={page}>
              <button
                type="button"
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
                onClick={() => onPageChange(page)}
                className={`${buttonBase} ${
                  page === currentPage
                    ? "border-primary bg-primary text-white"
                    : "border-border text-heading hover:border-primary hover:text-primary"
                }`}
              >
                {page}
              </button>
            </li>
          ),
        )}

        <li>
          <button
            type="button"
            aria-label="Next page"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className={`${buttonBase} border-border text-heading hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40`}
          >
            <ChevronRightIcon className="h-3.5 w-3.5" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
