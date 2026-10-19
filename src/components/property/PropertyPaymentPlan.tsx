"use client";

import { useMemo } from "react";
import {
  buildPlan,
  formatExact,
  formatPKR,
  yearlyBreakdown,
} from "@/lib/paymentPlan";

type Props = {
  specs: Record<string, unknown>;
  price: number;
};

/** Buyer-facing view of the instalment plan the seller entered. */
export default function PropertyPaymentPlan({ specs, price }: Props) {
  const plan = useMemo(() => buildPlan(specs, price), [specs, price]);
  const schedule = useMemo(() => yearlyBreakdown(plan), [plan]);

  // A row of zeros reads as broken; hide it until instalments are published.
  const scheduleHasAmounts = schedule.some((row) => row.amount > 0);

  if (plan.lines.length === 0) {
    return (
      <p className="py-8 text-center text-[12px] text-muted">
        No payment plan has been published for this property.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="Total Price" value={formatPKR(plan.totalPrice)} highlight />
        {plan.lines[0] && (
          <Tile label={plan.lines[0].label} value={formatPKR(plan.lines[0].each)} />
        )}
        {plan.durationYears > 0 && (
          <Tile
            label="Plan Duration"
            value={`${plan.durationYears} year${plan.durationYears === 1 ? "" : "s"}`}
          />
        )}
        {plan.charges > 0 && (
          <Tile label="Extra Charges" value={formatPKR(plan.charges)} />
        )}
      </div>

      {/*
        Four columns of rupee figures need more width than a phone has.
        `overflow-hidden` clipped the last column with no way to reach it;
        this lets the table scroll sideways instead.
      */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[460px] text-[12.5px]">
          <thead className="bg-surface">
            <tr className="text-left text-[11px] uppercase tracking-wide text-muted">
              <th className="px-4 py-2.5 font-medium">Payment</th>
              <th className="px-4 py-2.5 text-right font-medium">Amount</th>
              <th className="px-4 py-2.5 text-right font-medium">Instalments</th>
              <th className="px-4 py-2.5 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {plan.lines.map((line) => (
              <tr key={line.label} className="border-t border-border">
                <td className="px-4 py-2.5 text-heading">{line.label}</td>
                <td className="px-4 py-2.5 text-right text-text">
                  PKR {formatExact(line.each)}
                </td>
                <td className="px-4 py-2.5 text-right text-muted">
                  {line.recurring ? `× ${line.count}` : "—"}
                </td>
                <td className="px-4 py-2.5 text-right font-semibold text-heading">
                  PKR {formatExact(line.total)}
                </td>
              </tr>
            ))}
            <tr className="border-t border-border bg-surface">
              <td className="px-4 py-2.5 font-semibold text-heading">Total</td>
              <td />
              <td />
              <td className="px-4 py-2.5 text-right font-bold text-primary">
                PKR {formatExact(plan.scheduled)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {scheduleHasAmounts && (
        <div>
          <h4 className="mb-2 text-[13px] font-semibold text-heading">
            Yearly Instalment Schedule
          </h4>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
            {schedule.map((row) => (
              <div key={row.year} className="bg-white px-4 py-3">
                <p className="text-[10.5px] uppercase tracking-wide text-muted">
                  Year {row.year}
                </p>
                <p className="mt-0.5 text-[13px] font-semibold text-heading">
                  PKR {formatExact(row.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {plan.charges > 0 && (
        <p className="text-[11.5px] text-muted">
          Development and other charges of PKR {formatExact(plan.charges)} are payable
          in addition to the price shown.
        </p>
      )}
    </div>
  );
}

function Tile({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-lg border px-4 py-3",
        highlight ? "border-primary/30 bg-primary/5" : "border-border bg-white",
      ].join(" ")}
    >
      <p className="text-[10.5px] uppercase tracking-wide text-muted">{label}</p>
      <p
        className={[
          "mt-1 text-[14px] font-bold",
          highlight ? "text-primary" : "text-heading",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}
