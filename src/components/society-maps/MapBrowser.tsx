"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import SubmitMapDialog from "@/components/society-maps/SubmitMapDialog";
import type { MapCity, SocietyMap } from "@/types/societyMap";

/**
 * The society maps, filtered by city.
 *
 * Every map is on the page already, so a city is chosen in the browser
 * rather than by asking the server again — the list is short enough that
 * a round trip per click would only add a wait.
 */
export default function MapBrowser({
  maps,
  cities,
}: {
  maps: SocietyMap[];
  cities: MapCity[];
}) {
  /* The breadcrumbs and the city list below the grid link in with
     ?city=, so the chip they name starts chosen.

     Read once, here, rather than through useSearchParams: that hook
     would make this page render on the client and leave the cards out
     of the HTML altogether. On the server there is no window, so it
     starts unfiltered and settles on the first client render. */
  const [city, setCity] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("city");
  });
  const [search, setSearch] = useState("");

  const shown = useMemo(() => {
    const term = search.trim().toLowerCase();

    return maps.filter((map) => {
      if (city && map.city?.slug !== city) return false;
      if (!term) return true;

      return (
        map.title.toLowerCase().includes(term) ||
        map.society?.name.toLowerCase().includes(term) ||
        map.summary?.toLowerCase().includes(term)
      );
    });
  }, [maps, city, search]);

  const activeCity = cities.find((c) => c.slug === city) ?? null;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4">
        {/* Cities. A chip each: there are a handful, and a dropdown would
            hide the one thing a reader came here to choose. */}
        {cities.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCity(null)}
              className={`rounded-full px-4 py-2 text-[12.5px] font-semibold transition-colors ${
                city === null
                  ? "bg-primary text-white"
                  : "border border-border bg-white text-heading hover:border-primary"
              }`}
            >
              All cities
              <span className="ml-1.5 opacity-70">{maps.length}</span>
            </button>

            {cities.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCity(c.slug)}
                className={`rounded-full px-4 py-2 text-[12.5px] font-semibold transition-colors ${
                  city === c.slug
                    ? "bg-primary text-white"
                    : "border border-border bg-white text-heading hover:border-primary"
                }`}
              >
                {c.name}
                <span className="ml-1.5 opacity-70">{c.mapCount}</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
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
            placeholder="Search a society…"
            aria-label="Search society maps"
            className="h-12 w-full rounded-2xl border border-border bg-white pl-11 pr-4 text-[13.5px] text-heading outline-none transition-colors focus:border-primary"
          />
        </div>

        {/* Beside the search: somebody who could not find their society
            is exactly the person with its map. */}
        <SubmitMapDialog />
        </div>
      </div>

      <p className="mb-5 text-[13px] text-muted">
        <span className="font-bold text-heading">{shown.length}</span>{" "}
        {shown.length === 1 ? "map" : "maps"}
        {activeCity && <> in {activeCity.name}</>}
        {search.trim() && <> for &ldquo;{search.trim()}&rdquo;</>}
      </p>

      {shown.length === 0 ? (
        <p className="rounded-2xl border border-border bg-white py-20 text-center text-[13px] text-muted">
          {maps.length === 0
            ? "No society maps have been published yet."
            : "No map matched. Try another name, or pick a different city."}
        </p>
      ) : (
        <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((map) => (
            <Link
              key={map.id}
              href={`/society-maps/${map.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_10px_28px_rgba(15,23,42,0.10)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                <SafeImage
                  src={map.image}
                  alt={map.title}
                  fill
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  fallbackText="No map"
                />

                {map.city && (
                  <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                    {map.city.name}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-2 text-[14px] font-bold leading-snug text-heading transition-colors group-hover:text-primary">
                  {map.society?.name ?? map.title}
                </h3>

                {map.summary && (
                  <p className="mt-1.5 line-clamp-2 text-[12px] leading-5 text-muted">
                    {map.summary}
                  </p>
                )}

                <span className="mt-auto flex items-center gap-1.5 pt-3 text-[11.5px] font-semibold text-primary">
                  View Map
                  <svg
                    className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
