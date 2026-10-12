"use client";

import { useState } from "react";
import { formatPKR } from "@/lib/paymentPlan";
import type { InventoryCategory, ProjectDetail, ProjectUnit } from "@/types/project";

type Props = {
  project: ProjectDetail;
};

const GROUPS: { key: InventoryCategory; label: string }[] = [
  { key: "residential", label: "Apartments" },
  { key: "commercial", label: "Commercial" },
  { key: "hospitality", label: "Hospitality" },
  { key: "other", label: "Other" },
];

const AVAILABILITY_STYLE: Record<string, string> = {
  available: "bg-emerald-50 text-emerald-700",
  limited: "bg-amber-50 text-amber-700",
  sold_out: "bg-red-50 text-red-700",
  coming_soon: "bg-blue-50 text-blue-700",
};

/** Available inventory, grouped by category (spec sections 5 and 16). */
export default function ProjectInventory({ project }: Props) {
  const units = project.units ?? [];
  const groups = GROUPS.filter((g) => units.some((u) => u.category === g.key));
  const [active, setActive] = useState(groups[0]?.key);

  if (units.length === 0) {
    return (
      <p className="py-8 text-center text-[12px] text-muted">
        No inventory has been published for this project.
      </p>
    );
  }

  const shown = units.filter((u) => u.category === (active ?? groups[0]?.key));

  return (
    <div className="max-w-[760px]">
      <h2 className="text-[16px] font-bold text-heading">Available Inventory</h2>
      <p className="mt-1.5 text-[12px] text-muted">
        Unit types on offer. Prices are indicative and start from the figures shown.
      </p>

      {groups.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {groups.map((g) => (
            <button
              key={g.key}
              type="button"
              onClick={() => setActive(g.key)}
              className={[
                "rounded-md border px-3 py-1.5 text-[12px] font-semibold transition",
                g.key === active
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-muted hover:border-primary/40 hover:text-heading",
              ].join(" ")}
            >
              {g.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {shown.map((unit) => (
          <UnitCard key={unit.id} unit={unit} />
        ))}
      </div>
    </div>
  );
}

function UnitCard({ unit }: { unit: ProjectUnit }) {
  const area =
    unit.minArea && unit.maxArea && unit.minArea !== unit.maxArea
      ? `${unit.minArea.toLocaleString("en-US")} – ${unit.maxArea.toLocaleString("en-US")}`
      : (unit.minArea ?? unit.area).toLocaleString("en-US");

  const details = Object.entries(unit.details ?? {});

  return (
    <div className="rounded-lg border border-border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-bold text-heading">
            {unit.unitName || unit.unitType}
          </p>
          <p className="mt-0.5 text-[11.5px] text-muted">
            {area} {unit.areaUnit === "sqft" ? "Sq. Ft." : unit.areaUnit === "sqyd" ? "Sq. Yards" : "Marla"}
          </p>
        </div>
        {unit.availability && (
          <span
            className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold ${
              AVAILABILITY_STYLE[unit.availability] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {unit.availabilityLabel}
          </span>
        )}
      </div>

      <p className="mt-2.5 text-[14px] font-bold text-primary">
        {formatPKR(unit.startingPrice ?? unit.totalPrice)}
        {unit.maxPrice ? (
          <span className="text-[11.5px] font-medium text-muted"> – {formatPKR(unit.maxPrice)}</span>
        ) : null}
      </p>

      {details.length > 0 && (
        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-border pt-3">
          {details.map(([key, value]) => (
            <div key={key} className="flex items-baseline justify-between gap-2">
              <dt className="truncate text-[11px] text-muted">{humanise(key)}</dt>
              <dd className="shrink-0 text-[11.5px] font-semibold text-heading">
                {String(value)}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/** "frontWidth" -> "Front Width" */
function humanise(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}
