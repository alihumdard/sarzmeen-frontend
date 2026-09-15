"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import HeroSelect from "@/components/home/HeroSelect";
import { SearchIcon } from "@/components/ui/Icons";
import { priceRanges, propertyTypes } from "@/constants/searchOptions";

/** Only city covered at launch — search defaults to it instead of asking. */
const DEFAULT_CITY = "lahore";

type Purpose = "buy" | "projects";

const tabs: { label: string; value: Purpose }[] = [
  { label: "Buy/Sell", value: "buy" },
  { label: "Projects", value: "projects" },
];

/**
 * Hero search panel: a pill of purpose tabs above a white card holding the
 * filters and the search button.
 *
 * Submitting builds a query string and pushes to the matching listing page.
 * No API call — those pages read the params once the backend is wired up.
 */
export default function HeroSearch() {
  const [purpose, setPurpose] = useState<Purpose>("buy");
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      if (typeof value === "string" && value) params.set(key, value);
    }

    // Projects live on their own route; buy and rent share the listing page.
    if (purpose === "projects") {
      router.push(`/projects?${params.toString()}`);
      return;
    }

    params.set("purpose", purpose);
    router.push(`/properties?${params.toString()}`);
  }

  return (
    <div className="w-full max-w-[900px]">
      {/* Purpose toggle — a standalone segmented control, not a tab strip.
          Full width on mobile so it matches the search card below it;
          shrinks back to a compact pill from sm: up. */}
      <div className="mb-3 flex w-full rounded-full bg-white/95 p-1 shadow-lg sm:inline-flex sm:w-auto">
        {tabs.map((tab) => {
          const isActive = purpose === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => setPurpose(tab.value)}
              className={`flex-1 rounded-full px-6 py-2 text-[13px] font-semibold transition-colors sm:flex-initial sm:px-8 ${
                isActive
                  ? "bg-primary text-white"
                  : "text-heading hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <form
        onSubmit={handleSubmit}
        className="rounded-lg bg-white p-3.5 shadow-xl sm:p-4"
      >
        <input type="hidden" name="city" value={DEFAULT_CITY} />

        <div className="grid gap-3 lg:grid-cols-[2.2fr_1.3fr_1.3fr_1.2fr]">
          <div className="relative min-w-0">
            <label htmlFor="hero-location" className="sr-only">
              Search by location
            </label>
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              id="hero-location"
              name="location"
              type="search"
              placeholder="Search by Location, Area or Society"
              className="h-[46px] w-full rounded-md border border-border bg-white pl-12 pr-4 text-[15px] text-heading outline-none transition-colors placeholder:text-muted hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>

          <HeroSelect
            name="type"
            placeholder="Property Type"
            options={propertyTypes}
          />

          <HeroSelect
            name="price"
            placeholder="Price Range"
            options={priceRanges}
          />

          <button
            type="submit"
            className="flex h-[46px] items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-5 text-[14px] font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            <SearchIcon className="h-4 w-4 text-white" />
            Search Property
          </button>
        </div>
      </form>
    </div>
  );
}
