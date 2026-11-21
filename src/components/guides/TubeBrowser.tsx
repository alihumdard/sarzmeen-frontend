"use client";

import { useMemo, useState } from "react";
import VideoCard from "@/components/guides/VideoCard";
import type { Video, VideoCategoryGroup } from "@/types/video";

/**
 * Search and category filtering over the whole video library.
 *
 * Filtered here rather than by asking the server on every keystroke: the
 * page already holds the videos, and a request per letter typed would
 * make the results lag behind the box.
 *
 * Categories arrive grouped by owner — the site's own first, then each
 * agency — because ten agencies with five groupings each is fifty chips
 * in a row, and the site's own would be lost among them.
 */
export default function TubeBrowser({
  videos,
  groups,
}: {
  videos: Video[];
  groups: VideoCategoryGroup[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  /* Collapsed: regulars know how it works, and an open block would push
     the categories themselves down the sidebar. */
  const [helpOpen, setHelpOpen] = useState(false);

  const shown = useMemo(() => {
    const term = search.trim().toLowerCase();

    return videos.filter((video) => {
      if (category && video.category?.slug !== category) return false;
      if (!term) return true;

      /* Tags too: they are written to be found by and shown nowhere. */
      return (
        video.title.toLowerCase().includes(term) ||
        video.description?.toLowerCase().includes(term) ||
        video.owner?.name.toLowerCase().includes(term) ||
        (video.tags ?? []).some((tag) => tag.toLowerCase().includes(term))
      );
    });
  }, [videos, search, category]);

  const activeName = useMemo(() => {
    if (!category) return null;
    for (const group of groups) {
      const found = group.categories.find((c) => c.slug === category);
      if (found) return found.name;
    }
    return null;
  }, [groups, category]);

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <aside className="w-full shrink-0 lg:w-[248px]">
          {/* Categories, grouped by who made them. */}
          {groups.length > 0 && (
            <div className="rounded-2xl border border-border bg-white p-4">
              <button
                type="button"
                onClick={() => {
                  setCategory(null);
                  setSearch("");
                }}
                className={`w-full rounded-md px-3 py-2 text-left text-[12.5px] font-semibold transition-colors ${
                  category === null && !search.trim()
                    ? "bg-primary text-white"
                    : "text-heading hover:bg-surface"
                }`}
              >
                All videos
              </button>

              {groups.map((group) => (
                <div
                  key={group.key}
                  className="mt-4 border-t border-border pt-3 first-of-type:mt-3"
                >
                  {/* Two owners may share a name, so the heading says which
                      kind each one is rather than repeating the name alone. */}
                  <p className="flex items-baseline gap-1.5 px-3">
                    <span className="min-w-0 truncate text-[11px] font-bold uppercase tracking-wide text-heading">
                      {group.label}
                    </span>
                    {group.kind && group.kind !== "site" && (
                      <span className="shrink-0 text-[9.5px] font-semibold uppercase tracking-wide text-muted">
                        {group.kind}
                      </span>
                    )}
                  </p>
                  <ul className="mt-1.5 space-y-0.5">
                    {group.categories.map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => setCategory(c.slug)}
                          className={`flex w-full items-center justify-between gap-2 rounded-md px-3 py-1.5 text-left text-[12.5px] transition-colors ${
                            category === c.slug
                              ? "bg-primary-light font-semibold text-primary"
                              : "text-text hover:bg-surface"
                          }`}
                        >
                          <span className="min-w-0 truncate">{c.name}</span>
                          <span className="shrink-0 text-[11px] text-muted">
                            {c.videoCount}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 rounded-2xl border border-border bg-white first:mt-0">
            <button
              type="button"
              onClick={() => setHelpOpen(!helpOpen)}
              aria-expanded={helpOpen}
              className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
            >
              <span className="text-[12px] font-bold text-heading">
                How to use this page
              </span>
              <span
                aria-hidden="true"
                className={`text-[11px] text-muted transition-transform ${
                  helpOpen ? "rotate-180" : ""
                }`}
              >
                &#9662;
              </span>
            </button>

            {helpOpen && (
              <ul className="space-y-2.5 border-t border-border px-4 py-3.5 text-[12px] leading-relaxed text-muted">
                <li>
                  <span className="font-semibold text-heading">Search</span> as
                  you type &mdash; it matches a video&rsquo;s title, its
                  description and the agency or agent who posted it.
                </li>
                <li>
                  <span className="font-semibold text-heading">Categories</span>{" "}
                  are grouped by who made them: ours first, then each agency and
                  agent&rsquo;s own.
                </li>
                <li>
                  <span className="font-semibold text-heading">
                    Open a video
                  </span>{" "}
                  to watch it and, where an agency or agent posted it, to reach
                  their profile and the rest of their listings.
                </li>
              </ul>
            )}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="relative mb-4">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="search"
              placeholder="Search videos…"
              aria-label="Search videos"
              className="h-12 w-full rounded-2xl border border-border bg-white pl-11 pr-4 text-[13.5px] text-heading outline-none transition-colors focus:border-primary"
            />
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-2 text-[13px] text-muted">
            <p>
              <span className="font-bold text-heading">{shown.length}</span>{" "}
              {shown.length === 1 ? "video" : "videos"}
              {activeName && <> in {activeName}</>}
              {search.trim() && <> for “{search.trim()}”</>}
            </p>

            {/* A way back that does not mean hunting for the sidebar. */}
            {(activeName || search.trim()) && (
              <button
                type="button"
                onClick={() => {
                  setCategory(null);
                  setSearch("");
                }}
                className="rounded-full border border-border px-2.5 py-0.5 text-[11.5px] font-semibold text-primary transition-colors hover:bg-primary-light"
              >
                Clear
              </button>
            )}
          </div>

          {shown.length === 0 ? (
            <p className="rounded-2xl border border-border bg-white py-20 text-center text-[13px] text-muted">
              {videos.length === 0
                ? "No videos have been published yet."
                : "Nothing matched. Try another word, or pick a different category."}
            </p>
          ) : (
            <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {shown.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
