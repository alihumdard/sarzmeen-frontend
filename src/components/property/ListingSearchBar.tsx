"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDownIcon, SearchIcon } from "@/components/ui/Icons";

/**
 * Compact search bar sitting inside the listing page banner: a purpose
 * dropdown, a free-text field and the submit button.
 */
export default function ListingSearchBar() {
  const [purpose, setPurpose] = useState("buy");
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const term = String(formData.get("q") ?? "").trim();

    const params = new URLSearchParams({ purpose });
    if (term) params.set("q", term);

    router.push(`/properties?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex flex-col gap-2 rounded-md bg-white p-2 shadow-lg sm:flex-row sm:items-center"
    >
      <div className="relative shrink-0 sm:border-r sm:border-border sm:pr-2">
        <label htmlFor="listing-purpose" className="sr-only">
          Purpose
        </label>
        <select
          id="listing-purpose"
          value={purpose}
          onChange={(event) => setPurpose(event.target.value)}
          className="w-full cursor-pointer appearance-none rounded-md bg-transparent py-2.5 pl-3 pr-8 text-[13px] font-medium text-heading outline-none sm:w-[100px]"
        >
          <option value="buy">Buy</option>
          <option value="rent">Rent</option>
        </select>

        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted sm:right-4" />
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <SearchIcon className="ml-1 h-4 w-4 shrink-0 text-muted" />

        <label htmlFor="listing-search" className="sr-only">
          Search by city, area, society or project
        </label>
        <input
          id="listing-search"
          name="q"
          type="search"
          placeholder="Search by city, area, society or project"
          className="min-w-0 flex-1 bg-transparent py-2 text-[13px] text-heading outline-none placeholder:text-muted"
        />
      </div>

      <button
        type="submit"
        className="flex shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-6 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        <SearchIcon className="h-4 w-4" />
        Search
      </button>
    </form>
  );
}
