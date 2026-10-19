"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/ui/Icons";

/**
 * Compact search bar sitting inside the projects listing banner: a free-text
 * field and the submit button, mirroring the properties ListingSearchBar.
 */
type ProjectSearchBarProps = {
  /** Keeps the field filled when arriving on an already-searched page. */
  initialTerm?: string;
};

export default function ProjectSearchBar({ initialTerm }: ProjectSearchBarProps) {
  const router = useRouter();
  const [term, setTerm] = useState(initialTerm ?? "");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    /*
     * The term went out as `location`, which the projects API has no filter
     * for, so every search returned the full list. Existing filters in the
     * URL are kept, so searching narrows the current view instead of
     * discarding it.
     */
    const params = new URLSearchParams(window.location.search);

    const trimmed = term.trim();
    if (trimmed) params.set("search", trimmed);
    else params.delete("search");

    const query = params.toString();
    router.push(query ? `/projects?${query}` : "/projects", { scroll: false });

    requestAnimationFrame(() => {
      document
        .getElementById("project-results")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex flex-col gap-2 rounded-lg bg-white p-2.5 shadow-xl sm:flex-row sm:items-center"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 px-1">
        <SearchIcon className="h-[18px] w-[18px] shrink-0 text-muted" />

        <label htmlFor="project-search" className="sr-only">
          Search by project name or city
        </label>
        <input
          id="project-search"
          name="q"
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Search by project name or city"
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
