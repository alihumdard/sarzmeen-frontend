"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/Icons";

type AgentsPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function AgentsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: AgentsPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const buttonBase =
    "flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-[12px] font-medium transition-colors";

  return (
    <nav aria-label="Agents Pagination" className="flex flex-col items-center gap-3 py-6">
      {/* Mobile view info */}
      <p className="text-[13px] text-muted sm:hidden">
        Page <span className="font-semibold text-heading">{currentPage}</span> of{" "}
        <span className="font-semibold text-heading">{totalPages}</span>
      </p>

      {/* Desktop / Full pagination controls */}
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
            <span className="hidden sm:inline ml-1">Previous</span>
          </button>
        </li>

        {pages.map((page) => (
          <li key={page} className="hidden sm:block">
            <button
              type="button"
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
              onClick={() => onPageChange(page)}
              className={`${buttonBase} ${
                page === currentPage
                  ? "border-primary bg-primary text-white font-semibold"
                  : "border-border text-heading hover:border-primary hover:text-primary"
              }`}
            >
              {page}
            </button>
          </li>
        ))}

        <li>
          <button
            type="button"
            aria-label="Next page"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className={`${buttonBase} border-border text-heading hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40`}
          >
            <span className="hidden sm:inline mr-1">Next</span>
            <ChevronRightIcon className="h-3.5 w-3.5" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
