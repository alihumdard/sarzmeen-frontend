"use client";

type AdminPaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export default function AdminPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  className = "",
}: AdminPaginationProps) {
  if (totalPages <= 1 && !totalItems) {
    return null;
  }

  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const startItem =
    totalItems && totalItems > 0
      ? (safeCurrentPage - 1) * itemsPerPage + 1
      : 0;

  const endItem = totalItems
    ? Math.min(safeCurrentPage * itemsPerPage, totalItems)
    : 0;

  const pages = getPageNumbers(safeCurrentPage, totalPages);

  return (
    <div
      className={[
        "flex flex-col gap-3 border-t border-gray-100 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      ].join(" ")}
    >
      <p className="text-[11px] text-gray-500">
        {totalItems
          ? `Showing ${startItem}–${endItem} of ${totalItems}`
          : `Page ${safeCurrentPage} of ${totalPages}`}
      </p>

      <div className="flex items-center gap-1">
        <PaginationButton
          disabled={safeCurrentPage === 1}
          onClick={() => onPageChange(safeCurrentPage - 1)}
          ariaLabel="Previous page"
        >
          <ChevronLeftIcon />
        </PaginationButton>

        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-8 min-w-8 items-center justify-center text-[11px] text-gray-400"
            >
              ...
            </span>
          ) : (
            <PaginationButton
              key={page}
              active={page === safeCurrentPage}
              onClick={() => onPageChange(page)}
              ariaLabel={`Page ${page}`}
            >
              {page}
            </PaginationButton>
          ),
        )}

        <PaginationButton
          disabled={safeCurrentPage === totalPages}
          onClick={() => onPageChange(safeCurrentPage + 1)}
          ariaLabel="Next page"
        >
          <ChevronRightIcon />
        </PaginationButton>
      </div>
    </div>
  );
}

function PaginationButton({
  children,
  active = false,
  disabled = false,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={[
        "flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[11px] font-medium transition-colors",
        active
          ? "bg-primary text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        disabled ? "cursor-not-allowed opacity-40 hover:bg-transparent" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function getPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "ellipsis",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ];
}

function ChevronLeftIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}