"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "@/components/ui/Icons";

/** Minimum characters typed before search filters the listing. */
const MIN_SEARCH_LENGTH = 3;

/**
 * Search field shown inside the blog page banner.
 *
 * Typing 3+ characters live-filters the listing below (via the `q` URL
 * param, debounced); fewer characters clears the filter back to all posts.
 * Submitting the form searches immediately without waiting for the debounce.
 */
export default function BlogSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [term, setTerm] = useState(searchParams.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function pushTerm(value: string) {
    const trimmed = value.trim();
    router.push(
      trimmed.length >= MIN_SEARCH_LENGTH
        ? `/blog?q=${encodeURIComponent(trimmed)}`
        : "/blog",
    );
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setTerm(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => pushTerm(value), 300);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    pushTerm(term);
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
        value={term}
        onChange={handleChange}
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
