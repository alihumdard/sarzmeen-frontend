"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SearchIcon } from "@/components/ui/Icons";

/**
 * Search bar inside the agencies page banner.
 *
 * Matches `ListingSearchBar` on the property pages so both banners read the
 * same. Typing filters as you go — the term is pushed into the URL after a
 * short pause, so the server component still does the filtering and the
 * result stays shareable.
 */
export default function AgencySearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams.get("q") ?? "");

  /** Skips the debounce on first render, which would re-push the same URL. */
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const term = value.trim();

      if (term) {
        params.set("q", term);
      } else {
        params.delete("q");
      }

      const queryString = params.toString();
      router.replace(queryString ? `/agencies?${queryString}` : "/agencies", {
        scroll: false,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [value, router, searchParams]);

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      role="search"
      className="flex flex-col gap-2 rounded-lg bg-white p-2.5 shadow-xl sm:flex-row sm:items-center"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 px-1">
        <SearchIcon className="h-[18px] w-[18px] shrink-0 text-muted" />

        <label htmlFor="agency-search" className="sr-only">
          Search by agency, owner, city or area
        </label>
        <input
          id="agency-search"
          name="q"
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search by agency, owner, city or area"
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
  );
}
