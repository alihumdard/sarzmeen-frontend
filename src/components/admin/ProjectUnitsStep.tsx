"use client";

import { useMemo } from "react";
import {
  PERCENT_COMPONENTS,
  derivePlan,
  formatExact,
  formatPKR,
} from "@/lib/paymentPlan";
import { adminInputClass, adminSelectClass } from "@/components/admin/AdminFormField";
import type {
  InventoryCategory,
  ProjectPaymentTerms,
  UnitAvailability,
} from "@/types/project";

export type UnitDraft = {
  unitType: string;
  unitName: string;
  category: InventoryCategory;
  area: string;
  minArea: string;
  maxArea: string;
  areaUnit: string;
  ratePerSqft: string;
  maxPrice: string;
  availability: UnitAvailability;
  details: Record<string, string>;
};

export const emptyUnit: UnitDraft = {
  unitType: "",
  unitName: "",
  category: "residential",
  area: "",
  minArea: "",
  maxArea: "",
  areaUnit: "sqft",
  ratePerSqft: "",
  maxPrice: "",
  availability: "available",
  details: {},
};

const AVAILABILITY = [
  { value: "available", label: "Available" },
  { value: "limited", label: "Limited" },
  { value: "sold_out", label: "Sold Out" },
  { value: "coming_soon", label: "Coming Soon" },
];

/** Detail fields per inventory category (spec sections 6, 7 and 8). */
const DETAIL_FIELDS: Record<InventoryCategory, { key: string; label: string }[]> = {
  residential: [
    { key: "bedrooms", label: "Bedrooms" },
    { key: "bathrooms", label: "Bathrooms" },
    { key: "kitchen", label: "Kitchen" },
    { key: "livingRoom", label: "Living Room" },
    { key: "balcony", label: "Balcony" },
    { key: "servantRoom", label: "Servant Room" },
    { key: "parking", label: "Parking" },
    { key: "view", label: "View" },
  ],
  commercial: [
    { key: "floor", label: "Floor" },
    { key: "unitNumber", label: "Unit Number" },
    { key: "frontWidth", label: "Front Width" },
    { key: "depth", label: "Depth" },
    { key: "washroom", label: "Washroom" },
    { key: "parking", label: "Parking" },
    { key: "mainRoadFacing", label: "Main Road Facing" },
    { key: "corner", label: "Corner" },
  ],
  hospitality: [
    { key: "suiteType", label: "Suite Type" },
    { key: "bedType", label: "Bed Type" },
    { key: "kitchenette", label: "Kitchenette" },
    { key: "view", label: "View" },
    { key: "furnishedStatus", label: "Furnished Status" },
    { key: "hotelManagement", label: "Hotel Management" },
    { key: "expectedRentalIncome", label: "Expected Rental Income" },
    { key: "serviceCharges", label: "Service Charges" },
  ],
  other: [],
};

type Props = {
  units: UnitDraft[];
  onUnitsChange: (units: UnitDraft[]) => void;
  terms: Record<string, string>;
  onTermChange: (key: string, value: string) => void;
  error?: string;
};

const COUNT_FIELDS = [
  { key: "monthlyCount", label: "Monthly Count", placeholder: "40" },
  { key: "balloonCount", label: "Balloon Count", placeholder: "8" },
  { key: "balloonFrequency", label: "Balloon Every (months)", placeholder: "6" },
  { key: "planDurationYears", label: "Plan Duration (years)", placeholder: "4" },
];

/**
 * Unit types plus the percentage split shared by all of them.
 *
 * Percentages belong to the project, not the unit: the developer publishes one
 * structure and every unit is divided the same way, so only area and rate
 * change between them.
 */
export default function ProjectUnitsStep({
  units,
  onUnitsChange,
  terms,
  onTermChange,
  error,
}: Props) {
  const percentTotal = useMemo(
    () => PERCENT_COMPONENTS.reduce((sum, c) => sum + (Number(terms[c.key]) || 0), 0),
    [terms],
  );

  const valid = Math.abs(percentTotal - 100) < 0.01;
  const untouched = percentTotal === 0;

  const updateUnit = (index: number, patch: Partial<UnitDraft>) =>
    onUnitsChange(units.map((u, i) => (i === index ? { ...u, ...patch } : u)));

  const removeUnit = (index: number) =>
    onUnitsChange(units.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">
          {error}
        </div>
      )}

      <fieldset className="rounded-lg border border-gray-200 p-4">
        <legend className="px-1.5 text-[12px] font-semibold text-gray-700">
          Payment Structure
        </legend>
        <p className="mb-3 text-[10.5px] text-gray-400">
          One split for the whole project — every unit below is divided the same way.
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {PERCENT_COMPONENTS.map((c) => (
            <Num
              key={c.key}
              label={`${c.label} %`}
              value={terms[c.key] ?? ""}
              onChange={(v) => onTermChange(c.key, v)}
              placeholder="0"
            />
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COUNT_FIELDS.map((f) => (
            <Num
              key={f.key}
              label={f.label}
              value={terms[f.key] ?? ""}
              onChange={(v) => onTermChange(f.key, v)}
              placeholder={f.placeholder}
            />
          ))}
        </div>

        <div
          className={[
            "mt-3 rounded-md px-3 py-2 text-[11.5px] font-medium",
            untouched
              ? "bg-gray-50 text-gray-500"
              : valid
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700",
          ].join(" ")}
        >
          {untouched
            ? "Enter the percentages for each payment component."
            : valid
              ? "Percentages add up to 100% — good to go."
              : `Percentages add up to ${percentTotal.toFixed(2)}% — must equal 100%. ${
                  percentTotal < 100
                    ? `${(100 - percentTotal).toFixed(2)}% still unassigned.`
                    : `Over by ${(percentTotal - 100).toFixed(2)}%.`
                }`}
        </div>
      </fieldset>

      <fieldset className="rounded-lg border border-gray-200 p-4">
        <legend className="px-1.5 text-[12px] font-semibold text-gray-700">Unit Types</legend>
        <p className="mb-3 text-[10.5px] text-gray-400">
          Each unit needs only its area and rate — the price is worked out for you.
        </p>

        {units.length === 0 && (
          <p className="rounded-md bg-gray-50 px-3 py-4 text-center text-[11.5px] text-gray-400">
            No units yet. Add one to generate its payment plan.
          </p>
        )}

        <div className="space-y-3">
          {units.map((unit, i) => {
            const total = (Number(unit.area) || 0) * (Number(unit.ratePerSqft) || 0);

            return (
              <div key={i} className="rounded-md border border-gray-100 bg-gray-50/40 p-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
                  <Text
                    label="Unit Type"
                    value={unit.unitType}
                    onChange={(v) => updateUnit(i, { unitType: v })}
                    placeholder="e.g. 1 Bed"
                  />
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-gray-600">
                      Category
                    </label>
                    <select
                      value={unit.category}
                      onChange={(e) =>
                        // Details belong to the old category, so start fresh.
                        updateUnit(i, { category: e.target.value as InventoryCategory, details: {} })
                      }
                      className={adminSelectClass}
                    >
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="hospitality">Hospitality</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <Num
                    label="Area (SQFT)"
                    value={unit.area}
                    onChange={(v) => updateUnit(i, { area: v })}
                    placeholder="329"
                  />
                  <Num
                    label="Rate / SQFT"
                    value={unit.ratePerSqft}
                    onChange={(v) => updateUnit(i, { ratePerSqft: v })}
                    placeholder="14850"
                  />
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-gray-600">
                      Total Price
                    </label>
                    <div className="flex h-[38px] items-center justify-between gap-2 rounded-md border border-gray-200 bg-white px-3">
                      <span className="text-[12px] font-bold text-gray-900">
                        {total > 0 ? formatPKR(total) : "—"}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeUnit(i)}
                        className="text-[11px] font-semibold text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  <Text
                    label="Unit Name"
                    value={unit.unitName}
                    onChange={(v) => updateUnit(i, { unitName: v })}
                    placeholder="e.g. Executive 2 Bed"
                  />
                  <Num
                    label="Min Area"
                    value={unit.minArea}
                    onChange={(v) => updateUnit(i, { minArea: v })}
                    placeholder="1050"
                  />
                  <Num
                    label="Max Area"
                    value={unit.maxArea}
                    onChange={(v) => updateUnit(i, { maxArea: v })}
                    placeholder="1200"
                  />
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-gray-600">Area Unit</label>
                    <select
                      value={unit.areaUnit}
                      onChange={(e) => updateUnit(i, { areaUnit: e.target.value })}
                      className={adminSelectClass}
                    >
                      <option value="sqft">Sq. Ft.</option>
                      <option value="sqyd">Sq. Yards</option>
                      <option value="marla">Marla</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-gray-600">Availability</label>
                    <select
                      value={unit.availability}
                      onChange={(e) => updateUnit(i, { availability: e.target.value as UnitAvailability })}
                      className={adminSelectClass}
                    >
                      {AVAILABILITY.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                    </select>
                  </div>
                </div>

                {DETAIL_FIELDS[unit.category].length > 0 && (
                  <div className="mt-3 rounded-md border border-gray-100 bg-white p-3">
                    <p className="mb-2 text-[11px] font-semibold text-gray-600">
                      {unit.category === "residential" ? "Residential" : unit.category === "commercial" ? "Commercial" : "Hospitality"} Details
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {DETAIL_FIELDS[unit.category].map((f) => (
                        <Text
                          key={f.key}
                          label={f.label}
                          value={unit.details[f.key] ?? ""}
                          onChange={(v) =>
                            updateUnit(i, { details: { ...unit.details, [f.key]: v } })
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onUnitsChange([...units, { ...emptyUnit }])}
          className="mt-3 text-[11px] font-semibold text-primary hover:underline"
        >
          + Add unit
        </button>
      </fieldset>

      {valid && units.some((u) => Number(u.area) > 0 && Number(u.ratePerSqft) > 0) && (
        <UnitPreview units={units} terms={terms} />
      )}
    </div>
  );
}

function UnitPreview({ units, terms }: { units: UnitDraft[]; terms: Record<string, string> }) {
  const rows = units
    .filter((u) => Number(u.area) > 0 && Number(u.ratePerSqft) > 0)
    .map((u) => ({
      unit: u.unitType || "(unnamed unit)",
      plan: derivePlan({ ...terms, unitArea: u.area, ratePerSqft: u.ratePerSqft }),
    }));

  return (
    <fieldset className="rounded-lg border border-primary/30 bg-primary/[0.02] p-4">
      <legend className="px-1.5 text-[12px] font-semibold text-primary">Preview</legend>
      <p className="mb-3 text-[10.5px] text-gray-500">
        What buyers will see for each unit.
      </p>

      <div className="space-y-4">
        {rows.map(({ unit, plan }) => (
          <div key={unit} className="overflow-x-auto rounded-md border border-gray-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-3 py-2">
              <span className="text-[12px] font-bold text-gray-900">{unit}</span>
              <span className="text-[12px] font-bold text-primary">
                {formatPKR(plan.totalPrice)}
              </span>
            </div>
            <table className="w-full text-[11.5px]">
              <tbody>
                {plan.lines
                  .filter((l) => l.total > 0)
                  .map((line) => (
                    <tr key={line.label} className="border-t border-gray-50 text-gray-700">
                      <td className="px-3 py-1.5">{line.label}</td>
                      <td className="px-3 py-1.5 text-right text-gray-500">{line.percent}%</td>
                      <td className="px-3 py-1.5 text-right">
                        {formatExact(line.each)}
                        {line.count > 1 && (
                          <span className="text-gray-400"> × {line.count}</span>
                        )}
                      </td>
                      <td className="px-3 py-1.5 text-right font-semibold text-gray-900">
                        {formatExact(line.total)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </fieldset>
  );
}

function Num({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-gray-600">{label}</label>
      <input
        type="number"
        min={0}
        step="any"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={adminInputClass}
      />
    </div>
  );
}

function Text({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-gray-600">{label}</label>
      <input
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={adminInputClass}
      />
    </div>
  );
}

/** Shapes the drafts for the API, dropping rows the admin never filled in. */
export function unitsPayload(units: UnitDraft[]) {
  return units
    .filter((u) => u.unitType.trim() && Number(u.area) > 0 && Number(u.ratePerSqft) > 0)
    .map((u) => ({
      unitType: u.unitType.trim(),
      unitName: u.unitName.trim() || undefined,
      category: u.category,
      area: Number(u.area),
      minArea: u.minArea ? Number(u.minArea) : undefined,
      maxArea: u.maxArea ? Number(u.maxArea) : undefined,
      areaUnit: u.areaUnit,
      ratePerSqft: Number(u.ratePerSqft),
      maxPrice: u.maxPrice ? Number(u.maxPrice) : undefined,
      availability: u.availability,
      // Blank boxes would otherwise store empty strings against every key.
      details: Object.fromEntries(
        Object.entries(u.details).filter(([, v]) => v.trim() !== ""),
      ),
    }));
}

/** Numeric terms for the API; omitted entirely when nothing was entered. */
export function termsPayload(terms: Record<string, string>): ProjectPaymentTerms | undefined {
  const out: Record<string, number> = {};
  let any = false;

  for (const key of [...PERCENT_COMPONENTS.map((c) => c.key), ...COUNT_FIELDS.map((f) => f.key)]) {
    const n = Number(terms[key]);
    if (terms[key] !== undefined && terms[key] !== "" && Number.isFinite(n)) {
      out[key] = n;
      if (n > 0) any = true;
    }
  }

  return any ? (out as ProjectPaymentTerms) : undefined;
}
