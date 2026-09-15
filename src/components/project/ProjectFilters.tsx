"use client";

import { useEffect, useState } from "react";
import FilterSection from "@/components/property/FilterSection";
import {
  CloseIcon,
  FilterIcon,
  ResetIcon,
} from "@/components/ui/Icons";

const areaOptions = [
  "DHA",
  "Bahria Town",
  "Gulberg",
  "Johar Town",
  "Model Town",
  "Wapda Town",
  "Cantt",
];

const statusOptions = [
  "Under Construction",
  "Ready to Move",
  "Launching Soon",
];

const categoryOptions = [
  "Residential Project",
  "Commercial Project",
  "Mixed-Use Project",
  "Farmhouse Society",
  "Overseas Housing Scheme",
];

export default function ProjectFilters() {
  const [areas, setAreas] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeFilterCount =
    areas.length +
    statuses.length +
    categories.length +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const toggle = (
    value: string,
    currentValues: string[],
    setValues: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setValues(
      currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value]
    );
  };

  const handleReset = () => {
    setAreas([]);
    setStatuses([]);
    setCategories([]);
    setMinPrice("");
    setMaxPrice("");
  };

  const filterSections = (
    <>
      {/* Area */}
      <FilterSection title="Area">
        <div className="space-y-2.5">
          {areaOptions.map((area) => (
            <label
              key={area}
              className="flex min-h-8 cursor-pointer items-center gap-3"
            >
              <input
                type="checkbox"
                checked={areas.includes(area)}
                onChange={() => toggle(area, areas, setAreas)}
                className="h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 accent-primary"
              />

              <span className="text-[13px] leading-5 text-gray-700">
                {area}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="project-min-price"
              className="mb-1.5 block text-[12px] font-medium text-muted"
            >
              Min Price
            </label>

            <input
              id="project-min-price"
              type="number"
              min="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min"
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-[13px] text-heading outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <div>
            <label
              htmlFor="project-max-price"
              className="mb-1.5 block text-[12px] font-medium text-muted"
            >
              Max Price
            </label>

            <input
              id="project-max-price"
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max"
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-[13px] text-heading outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </div>
      </FilterSection>

      {/* Project Status */}
      <FilterSection title="Project Status">
        <div className="space-y-2.5">
          {statusOptions.map((status) => (
            <label
              key={status}
              className="flex min-h-8 cursor-pointer items-center gap-3"
            >
              <input
                type="checkbox"
                checked={statuses.includes(status)}
                onChange={() => toggle(status, statuses, setStatuses)}
                className="h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 accent-primary"
              />

              <span className="text-[13px] leading-5 text-gray-700">
                {status}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-2.5">
          {categoryOptions.map((category) => (
            <label
              key={category}
              className="flex min-h-8 cursor-pointer items-center gap-3"
            >
              <input
                type="checkbox"
                checked={categories.includes(category)}
                onChange={() =>
                  toggle(category, categories, setCategories)
                }
                className="h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 accent-primary"
              />

              <span className="text-[13px] leading-5 text-gray-700">
                {category}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
    </>
  );

  const filterHeader = (
    <div className="flex items-center justify-between border-b border-border px-4 py-4">
      <div className="flex items-center gap-2">
        <FilterIcon className="h-4 w-4 shrink-0 text-primary" />

        <h3 className="text-[15px] font-semibold text-heading">
          Filters
        </h3>

        {activeFilterCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">
            {activeFilterCount}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-[11px] font-medium text-muted transition-colors hover:text-primary"
          >
            <ResetIcon className="h-3.5 w-3.5 shrink-0" />
            <span>Reset</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setDrawerOpen(false)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-heading lg:hidden"
          aria-label="Close filters"
        >
          <CloseIcon className="h-4 w-4 shrink-0" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-4 text-[13px] font-semibold text-heading shadow-sm transition-colors hover:border-primary hover:text-primary lg:hidden"
      >
        <FilterIcon className="h-4 w-4 shrink-0" />

        <span>Filters</span>

        {activeFilterCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden w-full max-w-[280px] overflow-hidden rounded-xl border border-border bg-white lg:block">
        {filterHeader}

        <div className="divide-y divide-border">
          {filterSections}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-black/40 backdrop-blur-[1px]"
          />

          {/* Drawer */}
          <aside className="absolute right-0 top-0 flex h-full w-[88%] max-w-[380px] flex-col bg-white shadow-2xl">
            {/* Header */}
            {filterHeader}

            {/* Scrollable filters */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="divide-y divide-border">
                {filterSections}
              </div>
            </div>

            {/* Bottom action */}
            <div className="border-t border-border bg-white p-4">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
              >
                <span>Apply Filters</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}