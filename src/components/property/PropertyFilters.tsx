"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FilterSection from "@/components/property/FilterSection";
import SearchSelect from "@/components/ui/SearchSelect";
import {
  ChevronRightIcon,
  CloseIcon,
  FilterIcon,
  ResetIcon,
} from "@/components/ui/Icons";
import {
  areaUnits,
  locations,
  propertyFeatureFilters,
  propertyTypeFilters,
  roomCountOptions,
} from "@/constants/searchOptions";
import { formatPrice } from "@/lib/utils/format";

/** Upper bound of the price slider, in PKR. */
const MAX_PRICE = 500000000;

/**
 * Maps the hero-search `type` value (from constants/searchOptions'
 * propertyTypes) to its matching sidebar checkbox value (propertyTypeFilters)
 * so a hero-search selection shows as pre-checked here too.
 */
/**
 * Each sidebar group maps to the API type slugs it covers. Must stay in step
 * with the grouping in PropertyController::facets().
 */
const FILTER_TO_API_SLUGS: Record<string, string[]> = {
  house: ["house", "villa", "townhouse", "duplex", "upper-portion", "lower-portion", "farm-house"],
  plot: ["residential-plot", "commercial-plot", "agricultural-land", "industrial-land", "plot-file"],
  flat: ["flat-apartment", "penthouse", "room"],
  commercial: ["shop", "office", "showroom", "factory", "warehouse", "building", "commercial-plaza", "commercial-floor", "commercial-unit", "corporate-office", "high-rise-office", "high-rise-shop", "high-rise-showroom", "restaurant", "food-court"],
  apartment: ["studio-apartment", "two-bed-apartment", "three-bed-apartment", "3-bed-apartment", "four-bed-apartment", "luxury-apartment", "serviced-apartment", "hotel-apartment", "high-rise-penthouse", "duplex-penthouse"],
};

const HERO_TYPE_TO_FILTER: Record<string, string> = {
  house: "house",
  flat: "flat",
  "upper-portion": "house",
  "lower-portion": "house",
  "farm-house": "house",
  "residential-plot": "plot",
  "commercial-plot": "commercial",
  shop: "commercial",
  office: "commercial",
};

type PropertyFiltersProps = {
  /** Pre-checks the matching sidebar type, e.g. from the hero search. */
  initialType?: string;
  /** Live per-group listing counts from the API, keyed by filter value. */
  counts?: Record<string, number>;
};

/**
 * Filter sidebar for the properties listing.
 *
 * Selections are written to the URL, which the listing page reads server-side
 * to query the API. Keeping the state in the URL means a filtered view can be
 * shared or reloaded and still show the same results.
 */
export default function PropertyFilters({
  initialType,
  counts,
}: PropertyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  /*
   * Seeded from the URL so a shared or reloaded link shows the same boxes
   * ticked as the results it produced. `type` carries API slugs, which are
   * mapped back to the sidebar group that covers them.
   */
  const [types, setTypes] = useState<string[]>(() => {
    const fromUrl = searchParams.get("type");
    if (fromUrl) {
      const slugs = fromUrl.split(",");
      const groups = Object.entries(FILTER_TO_API_SLUGS)
        .filter(([, covered]) => covered.some((slug) => slugs.includes(slug)))
        .map(([group]) => group);
      if (groups.length) return groups;
    }
    const mapped = initialType ? HERO_TYPE_TO_FILTER[initialType] : undefined;
    return mapped ? [mapped] : [];
  });
  const [maxPrice, setMaxPrice] = useState(() => {
    const price = searchParams.get("price");
    const max = price?.split("-")[1];
    return max ? Number(max) : MAX_PRICE;
  });
  const [beds, setBeds] = useState<string | null>(
    () => searchParams.get("beds"),
  );
  const [baths, setBaths] = useState<string | null>(
    () => searchParams.get("baths"),
  );
  const [features, setFeatures] = useState<string[]>([]);
  const [showAllTypes, setShowAllTypes] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  /** Below `lg:` the sidebar lives in a slide-in drawer instead of the page flow. */
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activeCount =
    types.length +
    features.length +
    (beds ? 1 : 0) +
    (baths ? 1 : 0) +
    (maxPrice < MAX_PRICE ? 1 : 0);

  // Lock the page behind the drawer so only the drawer itself scrolls.
  useEffect(() => {
    if (!drawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen]);

  function toggle(list: string[], value: string) {
    return list.includes(value)
      ? list.filter((item) => item !== value)
      : [...list, value];
  }

  /**
   * Writes the current selection to the URL. The listing page reads these
   * params server-side and queries the API with them, so navigating is what
   * actually applies a filter.
   */
  function applyFilters(next?: {
    types?: string[];
    maxPrice?: number;
    beds?: string | null;
    baths?: string | null;
  }) {
    const chosenTypes = next?.types ?? types;
    const chosenMax = next?.maxPrice ?? maxPrice;
    const chosenBeds = next?.beds !== undefined ? next.beds : beds;
    const chosenBaths = next?.baths !== undefined ? next.baths : baths;

    const params = new URLSearchParams(searchParams.toString());

    // Each sidebar group covers several API slugs.
    const slugs = chosenTypes.flatMap((value) => FILTER_TO_API_SLUGS[value] ?? []);
    if (slugs.length) params.set("type", slugs.join(","));
    else params.delete("type");

    if (chosenMax < MAX_PRICE) params.set("price", `0-${chosenMax}`);
    else params.delete("price");

    if (chosenBeds) params.set("beds", chosenBeds.replace("+", ""));
    else params.delete("beds");

    if (chosenBaths) params.set("baths", chosenBaths.replace("+", ""));
    else params.delete("baths");

    const qs = params.toString();
    router.push(qs ? `/properties?${qs}` : "/properties", { scroll: false });
  }

  function handleReset() {
    setTypes([]);
    setMaxPrice(MAX_PRICE);
    setBeds(null);
    setBaths(null);
    setFeatures([]);
    router.push("/properties", { scroll: false });
  }

  const visibleTypes = showAllTypes
    ? propertyTypeFilters
    : propertyTypeFilters.slice(0, 5);

  const visibleFeatures = showAllFeatures
    ? propertyFeatureFilters
    : propertyFeatureFilters.slice(0, 7);

  const chipClasses =
    "flex h-8 min-w-8 items-center justify-center rounded border px-2.5 text-[11px] transition-colors";

  const filterSections = (
    <>
      <FilterSection title="Property Type">
        <ul className="flex flex-col gap-2.5">
          {visibleTypes.map((type) => (
            <li key={type.value}>
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={types.includes(type.value)}
                  onChange={() => {
                    const nextTypes = toggle(types, type.value);
                    setTypes(nextTypes);
                    applyFilters({ types: nextTypes });
                  }}
                  className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-[var(--color-primary)]"
                />
                <span className="flex-1 text-[11px] text-text">
                  {type.label}
                </span>
                <span className="text-[10px] text-muted">
                  {counts?.[type.value] ?? 0}
                </span>
              </label>
            </li>
          ))}
        </ul>

        {propertyTypeFilters.length > 5 && (
          <button
            type="button"
            onClick={() => setShowAllTypes(!showAllTypes)}
            className="mt-3 text-[11px] font-medium text-primary"
          >
            {showAllTypes ? "- Show Less" : "+ Show More"}
          </button>
        )}
      </FilterSection>

      <FilterSection title="Location">
        <div className="flex flex-col gap-3">
          <SearchSelect
            name="filter-area"
            placeholder="Select Area"
            options={locations}
          />
          <SearchSelect
            name="filter-society"
            placeholder="Select Society"
            options={locations}
          />
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <label htmlFor="price-range" className="sr-only">
          Maximum price
        </label>
        <input
          id="price-range"
          type="range"
          min={0}
          max={MAX_PRICE}
          step={1000000}
          value={maxPrice}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          onMouseUp={() => applyFilters()}
          onTouchEnd={() => applyFilters()}
          className="w-full cursor-pointer accent-[var(--color-primary)]"
        />

        <div className="mt-2 flex items-center justify-between text-[10px] text-muted">
          <span>PKR 0</span>
          <span>
            {maxPrice >= MAX_PRICE
              ? `${formatPrice(MAX_PRICE)}+`
              : formatPrice(maxPrice)}
          </span>
        </div>
      </FilterSection>

      <FilterSection title="Area (Marla)">
        <div className="flex items-center gap-2">
          <SearchSelect
            name="area-min"
            placeholder="Min"
            options={areaUnits}
          />
          <SearchSelect
            name="area-max"
            placeholder="Max"
            options={areaUnits}
          />
        </div>
      </FilterSection>

      <FilterSection title="Bedrooms">
        <ul className="flex flex-wrap gap-2">
          {roomCountOptions.map((count) => (
            <li key={count}>
              <button
                type="button"
                aria-pressed={beds === count}
                onClick={() => {
                  const nextBeds = beds === count ? null : count;
                  setBeds(nextBeds);
                  applyFilters({ beds: nextBeds });
                }}
                className={`${chipClasses} ${
                  beds === count
                    ? "border-primary bg-primary text-white"
                    : "border-border text-text hover:border-primary hover:text-primary"
                }`}
              >
                {count}
              </button>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Bathrooms">
        <ul className="flex flex-wrap gap-2">
          {roomCountOptions.map((count) => (
            <li key={count}>
              <button
                type="button"
                aria-pressed={baths === count}
                onClick={() => {
                  const nextBaths = baths === count ? null : count;
                  setBaths(nextBaths);
                  applyFilters({ baths: nextBaths });
                }}
                className={`${chipClasses} ${
                  baths === count
                    ? "border-primary bg-primary text-white"
                    : "border-border text-text hover:border-primary hover:text-primary"
                }`}
              >
                {count}
              </button>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Property Features">
        <ul className="flex flex-col gap-2.5">
          {visibleFeatures.map((feature) => (
            <li key={feature.value}>
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={features.includes(feature.value)}
                  onChange={() => setFeatures(toggle(features, feature.value))}
                  className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-[var(--color-primary)]"
                />
                <span className="text-[11px] text-text">{feature.label}</span>
              </label>
            </li>
          ))}
        </ul>

        {propertyFeatureFilters.length > 7 && (
          <button
            type="button"
            onClick={() => setShowAllFeatures(!showAllFeatures)}
            className="mt-3 text-[11px] font-medium text-primary"
          >
            {showAllFeatures ? "- Show Less" : "+ Show More"}
          </button>
        )}
      </FilterSection>
    </>
  );

  const filterHeader = (
    <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
      <h2 className="text-[13px] font-bold text-heading">Filters</h2>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 text-[11px] font-medium text-primary transition-opacity hover:opacity-75"
        >
          <ResetIcon className="h-3.5 w-3.5" />
          Reset All
        </button>

        <button
          type="button"
          aria-label="Close filters"
          onClick={() => setDrawerOpen(false)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:text-heading lg:hidden"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile/tablet toggle — the panel itself lives in a slide-in drawer
          below `lg:`, since the full filter list is too long to sit inline
          above the results without pushing them far down the page. */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-white px-4 py-3 text-[13px] font-semibold text-heading lg:hidden"
      >
        <span className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-primary" />
          Filters
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronRightIcon className="h-4 w-4 text-muted" />
      </button>

      {/* Desktop sidebar — the page itself scrolls here, so the whole panel
          can just sit in normal flow with no internal scroll container. */}
      <div className="hidden overflow-hidden rounded-lg border border-border bg-white lg:block">
        {filterHeader}
        {filterSections}
      </div>

      {/* Mobile/tablet drawer — a fixed-height flex column so the header and
          "Apply Filters" footer stay put while only the filter list between
          them scrolls. `min-h-0` on the scroll area is required: without it
          a flex child won't shrink below its content height and the drawer
          just grows past the viewport instead of scrolling. */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-heading/50"
          />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-[340px] flex-col bg-white shadow-xl">
            {filterHeader}

            <div className="min-h-0 flex-1 overflow-y-auto bg-surface">
              {filterSections}
            </div>

            <div className="shrink-0 border-t border-border bg-white p-4">
              <button
                type="button"
                onClick={() => {
                  applyFilters();
                  setDrawerOpen(false);
                }}
                className="w-full rounded-md bg-primary py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
