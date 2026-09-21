"use client";

import { ReactNode } from "react";

type FilterOption = {
  label: string;
  value: string;
};

type AdminFilterBarProps = {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;

  filters?: {
    label: string;
    value: string;
    options: FilterOption[];
    onChange?: (value: string) => void;
  }[];

  onReset?: () => void;
  onExport?: () => void;

  viewMode?: "list" | "grid";
  onViewModeChange?: (mode: "list" | "grid") => void;

  moreFilters?: ReactNode;
  className?: string;
};

export default function AdminFilterBar({
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  filters = [],
  onReset,
  onExport,
  viewMode,
  onViewModeChange,
  moreFilters,
  className = "",
}: AdminFilterBarProps) {
  return (
    <div
      className={[
        "rounded-lg border border-gray-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]",
        className,
      ].join(" ")}
    >
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        {/* Search */}
        <div className="relative min-w-0 flex-1 xl:max-w-[320px]">
          <SearchIcon />

          <input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-10 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-[12px] text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-primary"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <select
              key={filter.label}
              value={filter.value}
              onChange={(event) =>
                filter.onChange?.(event.target.value)
              }
              className="h-10 min-w-[130px] rounded-md border border-gray-200 bg-white px-3 text-[11px] text-gray-600 outline-none transition-colors focus:border-primary"
              aria-label={filter.label}
            >
              <option value="">{filter.label}</option>

              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}

          {moreFilters}

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="h-10 rounded-md px-3 text-[11px] font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              Reset
            </button>
          )}
        </div>

        {/* Export */}
        <div className="flex shrink-0 items-center gap-2">
          {onExport && (
            <button
              type="button"
              onClick={onExport}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-[11px] font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
            >
              <DownloadIcon />
              Export
            </button>
          )}

          {onViewModeChange && (
            <div className="flex h-10 shrink-0 items-center gap-0.5 rounded-md border border-gray-200 bg-white p-1">
              <button
                type="button"
                aria-label="List view"
                onClick={() => onViewModeChange("list")}
                className={[
                  "flex h-7 w-7 items-center justify-center rounded transition-colors",
                  viewMode === "list"
                    ? "bg-primary text-white"
                    : "text-gray-400 hover:text-gray-700",
                ].join(" ")}
              >
                <ListIcon />
              </button>

              <button
                type="button"
                aria-label="Grid view"
                onClick={() => onViewModeChange("grid")}
                className={[
                  "flex h-7 w-7 items-center justify-center rounded transition-colors",
                  viewMode === "grid"
                    ? "bg-primary text-white"
                    : "text-gray-400 hover:text-gray-700",
                ].join(" ")}
              >
                <GridIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="10.8" cy="10.8" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

function ListIcon() {
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
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}

function GridIcon() {
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
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
    </svg>
  );
}

function DownloadIcon() {
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
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}