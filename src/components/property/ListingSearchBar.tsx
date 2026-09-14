"use client";

import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/ui/Icons";

/**
 * Compact search bar sitting inside the listing page banner: a free-text
 * field and the submit button.
 */
export default function ListingSearchBar() {
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const term = String(formData.get("q") ?? "").trim();

    const params = new URLSearchParams({ purpose: "buy" });
    if (term) params.set("q", term);

    router.push(`/properties?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex flex-col gap-2 rounded-md bg-white p-2 shadow-lg sm:flex-row sm:items-center"
    >
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
