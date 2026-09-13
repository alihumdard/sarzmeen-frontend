"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import HeroSelect from "@/components/home/HeroSelect";
import { SearchIcon } from "@/components/ui/Icons";
import {
  areaOptions,
  bedOptions,
  cities,
  priceRanges,
  propertyTypes,
} from "@/constants/searchOptions";

type Purpose = "buy" | "rent" | "projects";

const tabs: { label: string; value: Purpose }[] = [
  { label: "Buy", value: "buy" },
  { label: "Rent", value: "rent" },
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
    <div className="mx-auto w-full max-w-[860px]">
      {/* Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg bg-white p-1.5 shadow-lg">
          {tabs.map((tab) => {
            const isActive = purpose === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setPurpose(tab.value)}
                className={`rounded-md px-7 py-2.5 text-[14px] font-semibold transition-colors sm:px-10 ${
                  isActive
                    ? "bg-primary-light text-primary"
                    : "text-heading hover:text-primary"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <form
        onSubmit={handleSubmit}
        className="mt-4 rounded-lg bg-white p-3.5 shadow-xl sm:p-4"
      >
        {/* Row 1 — where and what */}
        <div className="grid gap-3 lg:grid-cols-[1fr_1.6fr_1fr]">
          <HeroSelect
            name="city"
            placeholder="Select City"
            options={cities}
            icon="pin"
          />

          <div className="relative min-w-0">
            <label htmlFor="hero-location" className="sr-only">
              Search by location
            </label>
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
            <input
              id="hero-location"
              name="location"
              type="search"
              placeholder="Search by Location"
              className="h-[46px] w-full rounded-md border border-border bg-white pl-11 pr-4 text-[14px] text-heading outline-none transition-colors placeholder:text-muted hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>

          <HeroSelect
            name="type"
            placeholder="Property Type"
            options={propertyTypes}
          />
        </div>

        {/* Row 2 — narrowing filters and submit */}
        <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1fr_1fr_1.15fr]">
          <HeroSelect
            name="area"
            placeholder="Area (Marla)"
            options={areaOptions}
          />
          <HeroSelect name="beds" placeholder="Beds" options={bedOptions} />
          <HeroSelect
            name="price"
            placeholder="Price (PKR)"
            options={priceRanges}
          />

          <button
            type="submit"
            className="flex h-[46px] items-center justify-center gap-2 rounded-md bg-primary text-[14px] font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            <SearchIcon className="h-4 w-4 text-white" />
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
