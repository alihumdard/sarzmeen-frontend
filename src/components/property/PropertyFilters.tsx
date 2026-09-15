"use client";

import { useState } from "react";
import FilterSection from "@/components/property/FilterSection";
import SearchSelect from "@/components/ui/SearchSelect";
import { ResetIcon } from "@/components/ui/Icons";
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
};

/**
 * Filter sidebar for the properties listing.
 *
 * V1 keeps every selection in local state - nothing is applied to the results
 * until the Laravel API is wired up and the listing reads real query params.
 * The one exception is the initial Property Type checkbox, which mirrors
 * whatever type the hero search or listing search bar was submitted with.
 */
export default function PropertyFilters({ initialType }: PropertyFiltersProps) {
  const [types, setTypes] = useState<string[]>(() => {
    const mapped = initialType ? HERO_TYPE_TO_FILTER[initialType] : undefined;
    return mapped ? [mapped] : [];
  });
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [beds, setBeds] = useState<string | null>(null);
  const [baths, setBaths] = useState<string | null>(null);
  const [features, setFeatures] = useState<string[]>([]);
  const [showAllTypes, setShowAllTypes] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  function toggle(list: string[], value: string) {
    return list.includes(value)
      ? list.filter((item) => item !== value)
      : [...list, value];
  }

  function handleReset() {
    setTypes([]);
    setMaxPrice(MAX_PRICE);
    setBeds(null);
    setBaths(null);
    setFeatures([]);
  }

  const visibleTypes = showAllTypes
    ? propertyTypeFilters
    : propertyTypeFilters.slice(0, 5);

  const visibleFeatures = showAllFeatures
    ? propertyFeatureFilters
    : propertyFeatureFilters.slice(0, 7);

  const chipClasses =
    "flex h-8 min-w-8 items-center justify-center rounded border px-2.5 text-[11px] transition-colors";

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
        <h2 className="text-[13px] font-bold text-heading">Filters</h2>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 text-[11px] font-medium text-primary transition-opacity hover:opacity-75"
        >
          <ResetIcon className="h-3.5 w-3.5" />
          Reset All
        </button>
      </div>

      <FilterSection title="Property Type">
        <ul className="flex flex-col gap-2.5">
          {visibleTypes.map((type) => (
            <li key={type.value}>
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={types.includes(type.value)}
                  onChange={() => setTypes(toggle(types, type.value))}
                  className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-[var(--color-primary)]"
                />
                <span className="flex-1 text-[11px] text-text">
                  {type.label}
                </span>
                <span className="text-[10px] text-muted">{type.count}</span>
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
                onClick={() => setBeds(beds === count ? null : count)}
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
                onClick={() => setBaths(baths === count ? null : count)}
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

      <div className="p-4">
        <button
          type="button"
          className="w-full rounded-md border border-primary py-2.5 text-[12px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
