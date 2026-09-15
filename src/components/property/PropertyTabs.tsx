"use client";

import { useState } from "react";
import PropertyDescription from "@/components/property/PropertyDescription";
import PropertyDetailsTable from "@/components/property/PropertyDetailsTable";
import PropertyLocation from "@/components/property/PropertyLocation";
import type { PropertyDetail } from "@/types/property";

type PropertyTabsProps = {
  property: PropertyDetail;
};

const tabs = [
  "Overview",
  "Features & Amenities",
  "Location",
  "Floor Plan",
  "Payment Plan",
  "Nearby Places",
  "Video Tour",
];

/**
 * Tabbed detail panel. Overview carries the full layout; the remaining tabs
 * reuse the pieces that belong to them, and the two with no V1 content say so
 * rather than rendering an empty panel.
 */
export default function PropertyTabs({ property }: PropertyTabsProps) {
  const [active, setActive] = useState("Overview");

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      {/* Tab bar */}
      <div
        role="tablist"
        aria-label="Property details"
        className="flex gap-1 overflow-x-auto border-b border-border px-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active === tab}
            onClick={() => setActive(tab)}
            className={`shrink-0 border-b-2 px-3.5 py-3.5 text-[12px] font-medium transition-colors ${
              active === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-heading"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="p-5">
        {active === "Overview" && (
          <div className="grid gap-8 lg:grid-cols-3 lg:divide-x lg:divide-border lg:gap-0">
            <PropertyDescription property={property} />
            <div className="lg:px-6">
              <PropertyDetailsTable property={property} />
            </div>
            <div className="lg:pl-6">
              <PropertyLocation property={property} />
            </div>
          </div>
        )}

        {active === "Features & Amenities" && (
          <PropertyDescription property={property} />
        )}

        {(active === "Location" || active === "Nearby Places") && (
          <div className="max-w-[380px]">
            <PropertyLocation property={property} />
          </div>
        )}

        {(active === "Floor Plan" ||
          active === "Payment Plan" ||
          active === "Video Tour") && (
          <p className="py-8 text-center text-[12px] text-muted">
            {active} is not available for this property.
          </p>
        )}
      </div>
    </div>
  );
}
