"use client";

import { useMemo, useState } from "react";
import { derivePlan, formatExact, formatPKR } from "@/lib/paymentPlan";
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

function LegacyPlan({ project }: ProjectPaymentPlanProps) {
  if (project.paymentPlan.length === 0) {
    return (
      <p className="py-8 text-center text-[12px] text-muted">
        No payment plan has been published for this project.
      </p>
    );
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
