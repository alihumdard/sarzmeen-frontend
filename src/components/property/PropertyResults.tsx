"use client";

import { useState } from "react";
import PropertyCard from "@/components/property/PropertyCard";
import PropertyListRow from "@/components/property/PropertyListRow";
import {
  ChevronDownIcon,
  GridViewIcon,
  ListViewIcon,
} from "@/components/ui/Icons";
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
    "flex items-center gap-1.5 rounded-md border px-3 py-2 text-[11px] font-medium transition-colors";

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-white px-4 py-3">
        <p className="text-[12px] text-text">
          <span className="font-semibold text-heading">
            {total.toLocaleString("en-US")}
          </span>{" "}
          Properties Found
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
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
              Grid
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
              List
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="property-sort" className="text-[11px] text-muted">
              Sort by:
            </label>

            <div className="relative">
              <select
                id="property-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="cursor-pointer appearance-none rounded-md border border-border bg-white py-2 pl-3 pr-8 text-[11px] text-heading outline-none transition-colors hover:border-primary focus:border-primary"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      {view === "list" ? (
        <div className="mt-5 flex flex-col gap-4">
          {sorted.map((property) => (
            <PropertyListRow key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
