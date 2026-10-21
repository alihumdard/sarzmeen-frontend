"use client";

import { useState } from "react";
import PropertyDescription from "@/components/property/PropertyDescription";
import PropertyDetailsTable from "@/components/property/PropertyDetailsTable";
import PropertyLocation from "@/components/property/PropertyLocation";
import PropertyPaymentPlan from "@/components/property/PropertyPaymentPlan";
import PropertySpecs from "@/components/property/PropertySpecs";
import { CheckIcon } from "@/components/ui/Icons";
import type { PropertyDetail } from "@/types/property";

type PropertyTabsProps = {
  property: PropertyDetail;
};

const tabs = [
  "Overview",
  "Features & Amenities",
  "Location",
  "Payment Plan",
  "Video Tour",
];

export default function PropertyTabs({ property }: PropertyTabsProps) {
  const [active, setActive] = useState("Overview");

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      <div
        role="tablist"
        aria-label="Property details"
        className="flex overflow-x-auto border-b border-border bg-surface/40 px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active === tab}
            onClick={() => setActive(tab)}
            className={`shrink-0 border-b-2 px-4 py-3.5 text-[12px] font-semibold transition-colors ${
              active === tab
                ? "border-primary bg-white text-primary"
                : "border-transparent text-muted hover:text-heading"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="p-6">
        {active === "Overview" && (
          <div className="space-y-7">
            {/* Description */}
            <PropertyDescription property={property} />

            {/* Property Details — full width table */}
            <div className="rounded-lg border border-border">
              <PropertyDetailsTable property={property} />
            </div>

            {/* Type-specific specs */}
            <PropertySpecs
              specs={property.specs ?? {}}
              typeSlug={property.typeSlug ?? ""}
              purpose={property.purpose}
            />
          </div>
        )}

        {active === "Features & Amenities" && (
          <div className="space-y-7">
            {/*
             * This tab used to repeat the Overview table and never showed
             * property.features at all, so a listing with amenities recorded
             * looked identical to one without.
             */}
            {property.features && property.features.length > 0 ? (
              <div>
                <h3 className="mb-4 text-[15px] font-bold text-heading">
                  Features &amp; Amenities
                </h3>
                <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                  {property.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2.5 text-[12.5px] text-text"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                        <CheckIcon className="h-3 w-3" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="py-8 text-center text-[12px] text-muted">
                No features have been listed for this property.
              </p>
            )}

            <PropertySpecs
              specs={property.specs ?? {}}
              typeSlug={property.typeSlug ?? ""}
              purpose={property.purpose}
            />
          </div>
        )}

        {active === "Location" && (
          <PropertyLocation property={property} fullWidth />
        )}

        {active === "Payment Plan" && (
          <PropertyPaymentPlan
            specs={property.specs ?? {}}
            price={property.price}
            title={property.title}
          />
        )}

        {active === "Video Tour" && (
          <p className="py-8 text-center text-[12px] text-muted">
            Video Tour is not available for this property.
          </p>
        )}
      </div>
    </div>
  );
}
