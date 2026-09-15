"use client";

import { useEffect, useState } from "react";
import FilterSection from "@/components/property/FilterSection";
import {
  ChevronRightIcon,
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
      <FilterSection title="Area">
        <div className="space-y-3">
          {areaOptions.map((area) => (
            <label
              key={area}
              className="flex cursor-pointer items-center gap-3"
            >
              <input
                type="checkbox"
                checked={areas.includes(area)}
                onChange={() => toggle(area, areas, setAreas)}
                className="h-4 w-4 rounded border-gray-300"
              />

              <span className="text-sm text-gray-700">{area}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-gray-500">
                Min Price
              </label>

              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-500">
                Max Price
              </label>

              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Project Status">
        <div className="space-y-3">
          {statusOptions.map((status) => (
            <label
              key={status}
              className="flex cursor-pointer items-center gap-3"
            >
              <input
                type="checkbox"
                checked={statuses.includes(status)}
                onChange={() => toggle(status, statuses, setStatuses)}
                className="h-4 w-4 rounded border-gray-300"
              />

              <span className="text-sm text-gray-700">{status}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Category">
        <div className="space-y-3">
          {categoryOptions.map((category) => (
            <label
              key={category}
              className="flex cursor-pointer items-center gap-3"
            >
              <input
                type="checkbox"
                checked={categories.includes(category)}
                onChange={() =>
                  toggle(category, categories, setCategories)
                }
                className="h-4 w-4 rounded border-gray-300"
              />

              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </>
  );

  const filterHeader = (
    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
      <h3 className="text-lg font-semibold">Filters</h3>

      <div className="flex items-center gap-3">
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-black"
          >
            <ResetIcon />
            Reset All
          </button>
        )}

        <button
          type="button"
          onClick={() => setDrawerOpen(false)}
          className="lg:hidden"
          aria-label="Close filters"
        >
          <CloseIcon />
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
        className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm lg:hidden"
      >
        <FilterIcon />
        Filters

        {activeFilterCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-xs text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden w-full max-w-[280px] lg:block">
        {filterHeader}

        <div className="mt-5 space-y-6">
          {filterSections}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-[90%] max-w-[380px] overflow-y-auto bg-white p-5">
            {filterHeader}

            <div className="mt-5 space-y-6">
              {filterSections}
            </div>

            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-md bg-black px-4 py-3 text-sm font-medium text-white"
            >
              Apply Filters
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
}