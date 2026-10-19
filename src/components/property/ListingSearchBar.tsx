"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/ui/Icons";

/** Suggestions that fill the field, so the term stays visible and editable. */
const POPULAR_SEARCHES = [
  "DHA Lahore",
  "Bahria Town",
  "5 Marla House",
  "10 Marla Plot",
  "1 Kanal House",
  "Commercial Property",
];

type ListingSearchBarProps = {
  /** Keeps the field filled when arriving on an already-searched page. */
  initialTerm?: string;
  /** Where a search lands — the rent page searches its own listing. */
  basePath?: string;
};

/**
 * Search bar in the listing page banner, with the popular-search chips.
 *
 * The chips used to be links that navigated straight to a filtered URL,
 * leaving the field empty — so the page showed results with no sign of what
 * had been searched. Picking one now fills the field, replacing whatever was
 * there, and searches.
 */
export default function ListingSearchBar({
  initialTerm,
  basePath = "/properties",
}: ListingSearchBarProps) {
  const router = useRouter();
  const [term, setTerm] = useState(initialTerm ?? "");

  function runSearch(value: string) {
    const trimmed = value.trim();

    /*
     * The typed term went out as `location`, which the API has no filter
     * for, so every search returned the full listing. It also sent
     * `purpose=buy`, which is not one of the purposes (sale/rent/
     * installment) — ignored by the listing but enough to zero the
     * sidebar counts.
     */
    const params = new URLSearchParams();
    if (trimmed) params.set("search", trimmed);

    const query = params.toString();
    router.push(query ? `${basePath}?${query}` : basePath);

    /*
     * The banner fills the screen, so new results land below the fold and a
     * search can look like nothing happened. Scroll them into view once the
     * navigation has rendered.
     */
    requestAnimationFrame(() => {
      document
        .getElementById("listing-results")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runSearch(term);
  }

  function handleChipClick(label: string) {
    setTerm(label);
    runSearch(label);
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        role="search"
        className="flex flex-col gap-2 rounded-lg bg-white p-2.5 shadow-xl sm:flex-row sm:items-center"
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 px-1">
          <SearchIcon className="h-[18px] w-[18px] shrink-0 text-muted" />

          <label htmlFor="listing-search" className="sr-only">
            Search by city, area, society or project
          </label>
          <input
            id="listing-search"
            name="q"
            type="search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search by city, area, society or project"
            className="min-w-0 flex-1 bg-transparent py-2.5 text-[14px] text-heading outline-none placeholder:text-muted"
          />
        </div>

        <button
          type="submit"
          className="flex h-[46px] shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-6 text-[14px] font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <SearchIcon className="h-4 w-4" />
          Search
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-medium text-white/70">
          Popular Searches:
        </span>

        {POPULAR_SEARCHES.map((label) => {
          const active = term.trim().toLowerCase() === label.toLowerCase();

          return (
            <button
              key={label}
              type="button"
              onClick={() => handleChipClick(label)}
              className={[
                "rounded-full border px-3.5 py-1.5 text-[11px] font-medium transition-colors",
                active
                  ? "border-white bg-white text-heading"
                  : "border-white/25 bg-white/10 text-white/85 hover:border-white hover:bg-white/15 hover:text-white",
              ].join(" ")}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
