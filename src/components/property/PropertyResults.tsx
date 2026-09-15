"use client";

import { useState } from "react";
import PropertyCard from "@/components/property/PropertyCard";
import PropertyListRow from "@/components/property/PropertyListRow";
import { GridViewIcon, ListViewIcon } from "@/components/ui/Icons";
import Dropdown from "@/components/ui/Dropdown";
import Pagination from "@/components/ui/Pagination";
import type { Property } from "@/types/property";

type PropertyResultsProps = {
  properties: Property[];
  /** Total matching listings, used for the count line and pagination. */
  total: number;
};

/** Listings per page, matching what the API will return. */
const PAGE_SIZE = 10;

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Area: Large to Small", value: "area-desc" },
];

/**
 * Results toolbar and list. View mode and sort are local state in V1 —
 * sorting is applied to the mock array rather than requested from an API.
 */
export default function PropertyResults({
  properties,
  total,
}: PropertyResultsProps) {
  const [view, setView] = useState<"list" | "grid">("list");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const sorted = [...properties].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const toggleClasses =
    "flex items-center gap-1.5 rounded-md border px-2.5 py-2 text-[11px] font-medium transition-colors sm:px-3";

  return (
    <div className="min-w-0">
      {/* Toolbar — stays on one line at every width: the count is the only
          part allowed to truncate, since Grid/List/Sort are the controls
          people actually need to reach without scrolling. */}
      <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3">
        <p className="min-w-0 shrink truncate text-[11px] text-text sm:text-[12px]">
          <span className="font-semibold text-heading">
            {total.toLocaleString("en-US")}
          </span>{" "}
          <span className="hidden sm:inline">Properties Found</span>
          <span className="sm:hidden">Found</span>
        </p>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Grid vs list only matters once there's room for multiple
              columns — on phones the two layouts look nearly identical, so
              the toggle is hidden and list view (the default) is used. */}
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
              className={`${toggleClasses} ${
                view === "grid"
                  ? "border-primary bg-primary-light text-primary"
                  : "border-border text-muted hover:text-primary"
              }`}
            >
              <GridViewIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>

            <button
              type="button"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
              className={`${toggleClasses} ${
                view === "list"
                  ? "border-primary bg-primary-light text-primary"
                  : "border-border text-muted hover:text-primary"
              }`}
            >
              <ListViewIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="hidden text-[11px] text-muted sm:inline">
              Sort by:
            </span>

            <Dropdown
              label="Sort by"
              options={sortOptions}
              value={sort}
              onChange={setSort}
              className="w-[100px] sm:w-[168px]"
              triggerClassName="flex w-full items-center justify-between gap-2 rounded-md border border-border bg-white py-2 pl-2.5 pr-2 text-[11px] text-heading outline-none transition-colors hover:border-primary focus:border-primary sm:pl-3"
            />
          </div>
        </div>
      </div>

      {/* Listings — below `sm:` this always renders as the list layout
          regardless of `view`, since a grid/list toggle has little to show
          for on a single-column phone width. */}
      <div
        className={
          view === "grid" ? "mt-5 flex flex-col gap-4 sm:hidden" : "mt-5 flex flex-col gap-4"
        }
      >
        {sorted.map((property) => (
          <PropertyListRow key={property.id} property={property} />
        ))}
      </div>

      {view === "grid" && (
        <div className="hidden gap-5 sm:mt-5 sm:grid sm:grid-cols-2 xl:grid-cols-3">
          {sorted.map((property) => (
            <PropertyCard key={property.id} property={property} />
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
