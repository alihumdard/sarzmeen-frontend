"use client";

import { useMemo, useState } from "react";
import { derivePlan } from "@/lib/paymentPlan";
import {
  computePlan,
  formatExact,
  formatPKR,
  planDurationMonths,
  type PlanComponent,
} from "@/lib/paymentPlanBuilder";
import type { ProjectDetail, ProjectUnit } from "@/types/project";

type ProjectPaymentPlanProps = {
  project: ProjectDetail;
};

const SCHEDULE_LABEL: Record<string, string> = {
  Booking: "On Booking",
  Confirmation: "On Confirmation",
  Monthly: "Monthly",
  Balloon: "Balloon",
  "Grey Structure": "At Grey Structure",
  Possession: "At Possession",
};

/**
 * Payment Plan tab.
 *
 * Projects that have unit types get a plan derived from each unit's area and
 * rate; everything else falls back to the label/value rows entered before
 * units existed, so older listings keep working.
 */
export default function ProjectPaymentPlan({ project }: ProjectPaymentPlanProps) {
  const units = project.units ?? [];
  const terms = project.paymentTerms;

  if (units.length === 0 || !terms) {
    return <LegacyPlan project={project} />;
  }

  return <UnitPlan units={units} terms={terms} />;
}

function UnitPlan({
  units,
  terms,
}: {
  units: ProjectUnit[];
  terms: NonNullable<ProjectDetail["paymentTerms"]>;
}) {
  const [selectedId, setSelectedId] = useState(units[0].id);
  const unit = units.find((u) => u.id === selectedId) ?? units[0];

  const plan = useMemo(
    () =>
      derivePlan({
        ...terms,
        unitArea: unit.area,
        ratePerSqft: unit.ratePerSqft,
      }),
    [terms, unit],
  );

  const lines = plan.lines.filter((l) => l.total > 0);

  return (
    <div className="max-w-[640px]">
      <h2 className="text-[16px] font-bold text-heading">Payment Plan</h2>
      <p className="mt-1.5 text-[12px] text-muted">
        Indicative breakdown — contact us for the full schedule.
      </p>

      {units.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {units.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => setSelectedId(u.id)}
              className={[
                "rounded-md border px-3 py-1.5 text-[12px] font-semibold transition",
                u.id === unit.id
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-muted hover:border-primary/40 hover:text-heading",
              ].join(" ")}
            >
              {u.unitType}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 rounded-lg border border-border bg-surface px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[13px] font-bold text-heading">{unit.unitType}</p>
            <p className="mt-0.5 text-[11.5px] text-muted">
              {formatExact(unit.area)} sqft · PKR {formatExact(unit.ratePerSqft)} / sqft
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10.5px] uppercase tracking-wide text-muted">Total Price</p>
            <p className="mt-0.5 text-[16px] font-bold text-primary">
              {formatPKR(plan.totalPrice)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-border">
        <table className="w-full text-[12.5px]">
          <thead className="bg-surface">
            <tr className="text-left text-[11px] uppercase tracking-wide text-muted">
              <th className="px-4 py-2.5 font-medium">Payment</th>
              <th className="px-4 py-2.5 text-right font-medium">Amount</th>
              <th className="px-4 py-2.5 text-right font-medium">Schedule</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr key={line.label} className="border-t border-border">
                <td className="px-4 py-2.5 text-heading">{line.label}</td>
                <td className="px-4 py-2.5 text-right text-text">
                  PKR {formatExact(line.each)}
                </td>
                <td className="px-4 py-2.5 text-right text-muted">
                  {line.count > 1
                    ? `× ${line.count} ${line.label === "Monthly" ? "Months" : "Payments"}`
                    : (SCHEDULE_LABEL[line.label] ?? "—")}
                </td>
              </tr>
            ))}
            <tr className="border-t border-border bg-surface">
              <td className="px-4 py-2.5 font-semibold text-heading">Total</td>
              <td className="px-4 py-2.5 text-right font-bold text-primary">
                PKR {formatExact(plan.totalPrice)}
              </td>
              <td className="px-4 py-2.5 text-right text-muted">
                {plan.percentTotal.toFixed(0)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {Number(terms.planDurationYears) > 0 && (
        <p className="mt-3 text-[11.5px] text-muted">
          Plan duration: {terms.planDurationYears} years
          {Number(terms.balloonFrequency) > 0 &&
            ` · Balloon every ${terms.balloonFrequency} months`}
        </p>
      )}
    </div>
  );
}

/** Reads a rupee figure out of a display string like "Starting from PKR 45 Lac". */
function parsePrice(input: string | number | null | undefined): number {
  if (typeof input === "number") return Number.isFinite(input) ? input : 0;
  if (!input) return 0;

  const text = String(input).replace(/,/g, "");
  const match = text.match(/([\d.]+)\s*(crore|cr|lac|lakh|million|m|k)?/i);
  if (!match) return 0;

  const value = Number(match[1]);
  if (!Number.isFinite(value)) return 0;

  switch ((match[2] ?? "").toLowerCase()) {
    case "crore":
    case "cr":
      return value * 10_000_000;
    case "lac":
    case "lakh":
      return value * 100_000;
    case "million":
    case "m":
      return value * 1_000_000;
    case "k":
      return value * 1_000;
    default:
      return value;
  }
}

/** Calculates a real schedule from the structured plan rows. */
function StructuredPlan({
  rows,
  price,
  extras,
}: {
  rows: ProjectDetail["paymentPlan"];
  price: number;
  extras: ProjectDetail["paymentPlan"];
}) {
  const plan = useMemo(
    () =>
      computePlan(
        rows.map((r) => ({
          key: (r.component ?? "booking") as PlanComponent["key"],
          label: r.label,
          percent: r.percent ?? undefined,
          amount: r.amount ?? undefined,
          count: r.count && r.count > 0 ? r.count : 1,
          frequency: (r.frequency ?? "once") as PlanComponent["frequency"],
          pinned: (r.pinned ?? "none") as PlanComponent["pinned"],
        })),
        price,
      ),
    [rows, price],
  );

  const months = planDurationMonths(plan);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[16px] font-bold text-heading">Payment Plan</h2>
        <p className="mt-1.5 text-[12px] text-muted">
          Calculated on the starting price of {formatPKR(price)}
          {months > 0 ? ` over roughly ${Math.ceil(months / 12)} year${months > 12 ? "s" : ""}` : ""}.
          Final figures depend on the unit you choose.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-[12.5px]">
          <thead className="bg-surface">
            <tr className="text-left text-[11px] uppercase tracking-wide text-muted">
              <th className="px-4 py-2.5 font-medium">Payment</th>
              <th className="px-4 py-2.5 text-right font-medium">Amount</th>
              <th className="px-4 py-2.5 font-medium">Schedule</th>
            </tr>
          </thead>
          <tbody>
            {plan.components
              .filter((c) => c.resolvedTotal > 0.005)
              .map((c) => (
                <tr key={c.label} className="border-t border-border">
                  <td className="px-4 py-2.5 text-heading">{c.label}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-right font-semibold text-heading">
                    {formatExact(c.resolvedEach)}
                  </td>
                  <td className="px-4 py-2.5 text-muted">
                    {c.count > 1 ? `\u00d7 ${c.count} payments` : "One payment"}
                  </td>
                </tr>
              ))}
            <tr className="border-t border-border bg-surface font-bold">
              <td className="px-4 py-2.5 text-heading">Total</td>
              <td className="whitespace-nowrap px-4 py-2.5 text-right text-primary">
                {formatPKR(price)}
              </td>
              <td className="px-4 py-2.5 text-muted">100%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {extras.length > 0 && (
        <dl className="overflow-hidden rounded-md border border-border">
          {extras.map((row, i) => (
            <div
              key={row.label}
              className={`flex items-center justify-between gap-3 px-3 py-2.5 ${
                i % 2 === 0 ? "bg-surface" : "bg-white"
              }`}
            >
              <dt className="text-[12px] font-medium text-muted">{row.label}</dt>
              <dd className="text-[12.5px] font-semibold text-heading">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

function LegacyPlan({ project }: ProjectPaymentPlanProps) {
  if (project.paymentPlan.length === 0) {
    return (
      <p className="py-8 text-center text-[12px] text-muted">
        No payment plan has been published for this project.
      </p>
    );
  }

  /*
   * Rows carrying a `component` can be calculated against the starting price.
   * Rows that are still free text fall through to the plain list below.
   */
  const structured = project.paymentPlan.filter((r) => r.component);

  /*
   * priceFrom is display prose ("Starting from PKR 45 Lac"), so read a number
   * out of it: a plain figure, or one followed by Lac/Crore/Million. Without a
   * usable price the structured rows cannot be turned into amounts, and the
   * plain list below is shown instead.
   */
  const price = parsePrice(project.priceFrom);

  if (structured.length > 0 && price > 0) {
    return <StructuredPlan rows={structured} price={price} extras={project.paymentPlan.filter((r) => !r.component)} />;
  }

  return (
    <div className="max-w-[520px]">
      <h2 className="text-[16px] font-bold text-heading">Payment Plan</h2>
      <p className="mt-1.5 text-[12px] text-muted">
        Indicative installment breakdown — contact us for the full schedule.
      </p>

      <dl className="mt-4 overflow-hidden rounded-md border border-border">
        {project.paymentPlan.map((row, index) => (
          <div
            key={row.label}
            className={`flex items-center justify-between gap-3 px-3 py-3 ${
              index % 2 === 0 ? "bg-surface" : "bg-white"
            }`}
          >
            <dt className="text-[12px] font-medium text-muted">{row.label}</dt>
            <dd className="text-[13px] font-bold text-primary">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
