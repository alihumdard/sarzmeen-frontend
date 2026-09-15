"use client";

import { useEffect, useState } from "react";
import FilterSection from "@/components/property/FilterSection";
import {
  ChevronRightIcon,
  CloseIcon,
  FilterIcon,
  ResetIcon,
} from "@/components/ui/Icons";

const cityOptions = ["Lahore", "Karachi", "Islamabad"];
const statusOptions = ["Under Construction", "Ready to Move", "Launching Soon"];
const categoryOptions = ["Residential Project", "Commercial Project"];

/**
 * Filter sidebar for the projects listing — same structure and mobile
 * drawer behaviour as PropertyFilters, with fields relevant to a
 * development (city, status, category) rather than an individual listing.
 */
export default function ProjectFilters() {
  const [cities, setCities] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeCount = cities.length + statuses.length + categories.length;

  useEffect(() => {
    if (!drawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen]);

  function toggle(list: string[], value: string, setList: (list: string[]) => void) {
    setList(
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value],
    );
  }

  function handleReset() {
    setCities([]);
    setStatuses([]);
    setCategories([]);
  }

  const filterSections = (
    <>
      <FilterSection title="City">
        <ul className="flex flex-col gap-2.5">
          {cityOptions.map((city) => (
            <li key={city}>
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={cities.includes(city)}
                  onChange={() => toggle(cities, city, setCities)}
                  className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-[var(--color-primary)]"
                />
                <span className="flex-1 text-[11px] text-text">{city}</span>
              </label>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Project Status">
        <ul className="flex flex-col gap-2.5">
          {statusOptions.map((status) => (
            <li key={status}>
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={statuses.includes(status)}
                  onChange={() => toggle(statuses, status, setStatuses)}
                  className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-[var(--color-primary)]"
                />
                <span className="flex-1 text-[11px] text-text">{status}</span>
              </label>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Category">
        <ul className="flex flex-col gap-2.5">
          {categoryOptions.map((category) => (
            <li key={category}>
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={categories.includes(category)}
                  onChange={() => toggle(categories, category, setCategories)}
                  className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-[var(--color-primary)]"
                />
                <span className="flex-1 text-[11px] text-text">
                  {category}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </FilterSection>
    </>
  );

  const filterHeader = (
    <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
      <h2 className="text-[13px] font-bold text-heading">Filters</h2>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 text-[11px] font-medium text-primary transition-opacity hover:opacity-75"
        >
          <ResetIcon className="h-3.5 w-3.5" />
          Reset All
        </button>

        <button
          type="button"
          aria-label="Close filters"
          onClick={() => setDrawerOpen(false)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:text-heading lg:hidden"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-white px-4 py-3 text-[13px] font-semibold text-heading lg:hidden"
      >
        <span className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-primary" />
          Filters
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronRightIcon className="h-4 w-4 text-muted" />
      </button>

      <div className="hidden overflow-hidden rounded-lg border border-border bg-white lg:block">
        {filterHeader}
        {filterSections}
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-heading/50"
          />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-[340px] flex-col bg-white shadow-xl">
            {filterHeader}

            <div className="min-h-0 flex-1 overflow-y-auto bg-surface">
              {filterSections}
            </div>

            <div className="shrink-0 border-t border-border bg-white p-4">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="w-full rounded-md bg-primary py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
