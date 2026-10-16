"use client";

import { useMemo, useState } from "react";
import {
  computePlan,
  formatExact,
  formatPKR,
  planDurationMonths,
  type Frequency,
  type PlanComponent,
} from "@/lib/paymentPlanBuilder";

type Props = {
  /** Pre-fills from a listing, so "Calculate" on a property lands ready to use. */
  initialArea?: number;
  initialRate?: number;
  initialPrice?: number;
  title?: string;
};

const FREQUENCY_OPTIONS: { value: Frequency; label: string; months: number }[] = [
  { value: "monthly", label: "Monthly", months: 1 },
  { value: "quarterly", label: "Quarterly", months: 3 },
  { value: "biannual", label: "Bi-Annual", months: 6 },
];

/**
 * Buyer-facing payment calculator.
 *
 * Uses the same engine as the admin builder, so a buyer's estimate and the
 * published plan cannot drift apart. Price can be entered directly or derived
 * from area x rate, since listings quote it both ways.
 */
export default function PaymentCalculator({
  initialArea,
  initialRate,
  initialPrice,
  title,
}: Props) {
  const [mode, setMode] = useState<"area" | "price">(
    initialPrice && !initialArea ? "price" : "area",
  );
  const [area, setArea] = useState(initialArea ? String(initialArea) : "");
  const [rate, setRate] = useState(initialRate ? String(initialRate) : "");
  const [price, setPrice] = useState(initialPrice ? String(initialPrice) : "");

  const [booking, setBooking] = useState("10");
  const [confirmation, setConfirmation] = useState("10");
  const [possession, setPossession] = useState("20");
  const [years, setYears] = useState("4");
  const [frequency, setFrequency] = useState<Frequency>("monthly");

  const totalPrice = useMemo(() => {
    if (mode === "price") return Number(price) || 0;
    return (Number(area) || 0) * (Number(rate) || 0);
  }, [mode, area, rate, price]);

  const durationYears = Number(years) || 0;
  const freqMonths = FREQUENCY_OPTIONS.find((f) => f.value === frequency)?.months ?? 1;
  const instalments = durationYears > 0
    ? Math.max(1, Math.round((durationYears * 12) / freqMonths))
    : 1;

  const plan = useMemo(() => {
    const components: PlanComponent[] = [
      { key: "booking", label: "Booking", percent: Number(booking) || 0, count: 1, frequency: "once", pinned: "percent" },
      { key: "confirmation", label: "Confirmation", percent: Number(confirmation) || 0, count: 1, frequency: "once", pinned: "percent" },
      // Unpinned: instalments absorb whatever the upfront payments leave.
      { key: frequency as PlanComponent["key"], label: FREQUENCY_OPTIONS.find((f) => f.value === frequency)!.label, count: instalments, frequency, pinned: "none" },
      { key: "possession", label: "On Possession", percent: Number(possession) || 0, count: 1, frequency: "once", pinned: "percent" },
    ];

    return computePlan(components, totalPrice);
  }, [booking, confirmation, possession, frequency, instalments, totalPrice]);

  const months = planDurationMonths(plan);
  const ready = totalPrice > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      {/* Inputs */}
      <div className="rounded-lg border border-border bg-white p-5">
        <h2 className="text-[15px] font-bold text-heading">
          {title ? `Plan for ${title}` : "Your details"}
        </h2>

        {/* Price source */}
        <div className="mt-4 flex gap-1 rounded-md bg-surface p-1">
          {(["area", "price"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 rounded px-3 py-1.5 text-[11.5px] font-semibold transition-colors ${
                mode === m ? "bg-white text-primary shadow-sm" : "text-muted hover:text-heading"
              }`}
            >
              {m === "area" ? "Area × Rate" : "Total price"}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {mode === "area" ? (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Area (sq ft)">
                <input type="number" min={0} value={area} onChange={(e) => setArea(e.target.value)} placeholder="329" className={inputClass} />
              </Field>
              <Field label="Rate / sq ft">
                <input type="number" min={0} value={rate} onChange={(e) => setRate(e.target.value)} placeholder="14850" className={inputClass} />
              </Field>
            </div>
          ) : (
            <Field label="Total price (PKR)">
              <input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="4885650" className={inputClass} />
            </Field>
          )}

          <div className="rounded-md bg-primary-light px-3 py-2.5">
            <p className="text-[10.5px] uppercase tracking-wide text-primary/70">Total price</p>
            <p className="text-[18px] font-bold text-primary">
              {ready ? formatPKR(totalPrice) : "—"}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Booking %">
              <input type="number" min={0} max={100} value={booking} onChange={(e) => setBooking(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Confirm %">
              <input type="number" min={0} max={100} value={confirmation} onChange={(e) => setConfirmation(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Possession %">
              <input type="number" min={0} max={100} value={possession} onChange={(e) => setPossession(e.target.value)} className={inputClass} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Duration (years)">
              <input type="number" min={1} max={30} value={years} onChange={(e) => setYears(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Instalments">
              <select value={frequency} onChange={(e) => setFrequency(e.target.value as Frequency)} className={inputClass}>
                {FREQUENCY_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </Field>
          </div>

          {plan.overAllocated && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-[11.5px] font-medium text-red-700">
              Booking, confirmation and possession add up to more than 100%.
              Reduce one of them.
            </p>
          )}
        </div>
      </div>

      {/* Result */}
      <div className="rounded-lg border border-border bg-white p-5">
        <h2 className="text-[15px] font-bold text-heading">Your payment plan</h2>

        {!ready ? (
          <p className="py-16 text-center text-[12.5px] text-muted">
            Enter {mode === "area" ? "the area and rate" : "a total price"} to
            see the breakdown.
          </p>
        ) : (
          <>
            <p className="mt-1 text-[12px] text-muted">
              {instalments} {FREQUENCY_OPTIONS.find((f) => f.value === frequency)?.label.toLowerCase()} payments
              {months > 0 ? ` over ${Math.ceil(months / 12)} year${months > 12 ? "s" : ""}` : ""}.
            </p>

            <div className="mt-4 overflow-x-auto rounded-md border border-border">
              <table className="w-full text-[12.5px]">
                <thead className="bg-surface">
                  <tr className="text-left text-[11px] uppercase tracking-wide text-muted">
                    <th className="px-4 py-2.5 font-medium">Payment</th>
                    <th className="px-4 py-2.5 text-right font-medium">Amount</th>
                    <th className="px-4 py-2.5 text-right font-medium">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.components
                    .filter((c) => c.resolvedTotal > 0.005)
                    .map((c) => (
                      <tr key={c.key} className="border-t border-border">
                        <td className="px-4 py-2.5 text-heading">
                          {c.label}
                          {c.count > 1 && (
                            <span className="text-muted"> × {c.count}</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2.5 text-right font-semibold text-heading">
                          {formatExact(c.resolvedEach)}
                        </td>
                        <td className="px-4 py-2.5 text-right text-muted">
                          {c.resolvedPercent.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  <tr className="border-t border-border bg-surface font-bold">
                    <td className="px-4 py-2.5 text-heading">Total</td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-right text-primary">
                      {formatPKR(totalPrice)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-[11px] leading-5 text-muted">
              An estimate only. Actual plans vary by developer and project —
              contact the agent for the published schedule.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-border bg-white px-3 py-2 text-[13px] text-heading outline-none transition-colors focus:border-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-medium text-muted">{label}</label>
      {children}
    </div>
  );
}
