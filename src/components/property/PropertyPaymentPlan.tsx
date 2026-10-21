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
  /** Names the downloaded file so a buyer comparing plans can tell them apart. */
  title?: string;
};

/** Buyer-facing view of the instalment plan the seller entered. */
export default function PropertyPaymentPlan({ specs, price, title }: Props) {
  const plan = useMemo(() => buildPlan(specs, price), [specs, price]);
  const schedule = useMemo(() => yearlyBreakdown(plan), [plan]);

  /**
   * Saves the plan as a CSV the buyer can open in Excel.
   *
   * A plan is something people take away and compare against other projects,
   * so it has to leave the page as a file rather than a screenshot.
   */
  function download() {
    const rows: string[][] = [
      ["Payment", "Amount (PKR)", "Instalments", "Total (PKR)"],
      ...plan.lines.map((line) => [
        line.label,
        formatExact(line.each),
        line.recurring ? String(line.count) : "1",
        formatExact(line.total),
      ]),
      ["Total", "", "", formatExact(plan.scheduled)],
    ];

    // Quote every field: labels and amounts both contain commas.
    const csv = rows
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\r\n");

    // A BOM, or Excel reads the rupee figures as ANSI.
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(title ?? "payment-plan").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-payment-plan.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[15px] font-bold text-heading">Payment Plan</h3>

        <button
          type="button"
          onClick={download}
          className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-primary px-4 text-[12px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download plan
        </button>
      </div>

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
