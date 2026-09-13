"use client";

import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/ui/Icons";

/**
 * Search field shown inside the blog page banner.
 *
 * Submitting pushes the term onto the URL; the listing will read it once the
 * API is wired up.
 */
export default function BlogSearch() {
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const term = String(formData.get("q") ?? "").trim();

    router.push(term ? `/blog?q=${encodeURIComponent(term)}` : "/blog");
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex items-center gap-2 rounded-md bg-white p-2 shadow-lg"
    >
      <SearchIcon className="ml-2 h-4 w-4 shrink-0 text-muted" />

      <label htmlFor="blog-search" className="sr-only">
        Search blogs
      </label>
      <input
        id="blog-search"
        name="q"
        type="search"
        placeholder="Search blogs, categories or keywords..."
        className="min-w-0 flex-1 bg-transparent py-2 text-[13px] text-heading outline-none placeholder:text-muted"
      />

      <button
        type="submit"
        className="shrink-0 rounded-md bg-primary px-6 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        Search
      </button>
    </form>
  );
}
