"use client";

import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/ui/Icons";

/**
 * Compact search bar sitting inside the projects listing banner: a free-text
 * field and the submit button, mirroring the properties ListingSearchBar.
 */
export default function ProjectSearchBar() {
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const term = String(formData.get("q") ?? "").trim();

    const params = new URLSearchParams();
    if (term) params.set("location", term);

    router.push(`/projects?${params.toString()}`);
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
