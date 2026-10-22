"use client";

import { useMemo } from "react";
import {
  computePlan,
  FREQUENCIES,
  formatExact,
  formatPKR,
  planDurationMonths,
  type Frequency,
  type PlanComponent,
} from "@/lib/paymentPlanBuilder";
import type { SpecValue } from "@/components/admin/SpecFieldGroup";
import { adminInputClass } from "@/components/admin/AdminFormField";
import PriceInWords from "@/components/ui/PriceInWords";

type Props = {
  specs: Record<string, SpecValue>;
  onChange: (key: string, value: SpecValue) => void;
  /** Applies many keys at once, so filling the builder below is a single update. */
  onApply: (patch: Record<string, string>) => void;
};

/**
 * Builds a payment plan from area x rate, driven from either side:
 * set a percentage and the amount follows, or set an instalment amount and the
 * percentage follows. Components left blank absorb whatever is unallocated, so
 * the plan always totals 100% without overwriting a figure typed on purpose.
 *
 * A developer advertises "Rs 35,625 / month", not "29.1671%" — the odd
 * percentage is the honest consequence of a round instalment, not an error.
 */

/** Spec keys each component reads and writes, keeping the saved shape stable. */
const FIELDS = [
  { key: "booking", label: "Booking", pct: "pctBooking", amt: "bookingAmount", countKey: null, freq: null },
  { key: "confirmation", label: "Confirmation", pct: "pctConfirmation", amt: "confirmationAmount", countKey: null, freq: null },
  { key: "monthly", label: "Monthly", pct: "pctMonthly", amt: "monthlyInstallment", countKey: "monthlyCount", freq: "monthlyFrequency" },
  { key: "quarterly", label: "Quarterly", pct: "pctQuarterly", amt: "quarterlyInstallment", countKey: "quarterlyCount", freq: null },
  { key: "biannual", label: "Bi-Annual", pct: "pctBiAnnual", amt: "biAnnualInstallment", countKey: "biAnnualCount", freq: null },
  { key: "balloon", label: "Balloon", pct: "pctBalloon", amt: "balloonPayment", countKey: "balloonCount", freq: "balloonFrequency" },
  { key: "grey", label: "Grey Structure", pct: "pctGrey", amt: "greyStructureAmount", countKey: null, freq: null },
  { key: "possession", label: "Possession", pct: "pctPossession", amt: "possessionPayment", countKey: null, freq: null },
] as const;

/** How many months apart each component's instalments fall. */
const FREQ_MONTHS: Record<string, number> = {
  monthly: 1,
  quarterly: 3,
  biannual: 6,
  balloon: 6,
};

/**
 * Instalment count implied by the plan duration.
 *
 * A 3-year plan paid monthly is 36 instalments, quarterly is 12, bi-annually
 * is 6 — so the admin sets the duration once instead of counting by hand.
 */
function deriveCount(componentKey: string, years: number): number | null {
  const months = FREQ_MONTHS[componentKey];
  if (!months || years <= 0) return null;
  return Math.max(1, Math.round((years * 12) / months));
}

const DEFAULT_FREQ: Record<string, Frequency> = {
  booking: "once",
  confirmation: "once",
  monthly: "monthly",
  quarterly: "quarterly",
  biannual: "biannual",
  balloon: "balloon",
  grey: "once",
  possession: "once",
};

function num(v: unknown): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v.replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function has(v: unknown): boolean {
  return v !== undefined && v !== null && String(v).trim() !== "";
}

export default function PaymentPlanCalculator({ specs, onChange, onApply }: Props) {
  const area = num(specs.unitArea);
  const rate = num(specs.ratePerSqft);
  const totalPrice = area * rate;
  const hasPrice = totalPrice > 0;
  const durationYears = num(specs.planDurationYears);



  const components: PlanComponent[] = useMemo(
    () =>
      FIELDS.map((f) => {
        const pctSet = has(specs[f.pct]);
        const amtSet = has(specs[f.amt]);

        // A typed percentage wins; otherwise a typed amount drives the split.
        const pinned: PlanComponent["pinned"] = pctSet
          ? "percent"
          : amtSet
            ? "amount"
            : "none";

        return {
          key: f.key as PlanComponent["key"],
          label: f.label,
          percent: pctSet ? num(specs[f.pct]) : undefined,
          amount: amtSet ? num(specs[f.amt]) : undefined,
          // A typed count wins; otherwise the duration decides how many.
          count: !f.countKey
            ? 1
            : has(specs[f.countKey])
              ? Math.max(1, num(specs[f.countKey]))
              : (deriveCount(f.key, durationYears) ?? 1),
          frequency: DEFAULT_FREQ[f.key],
          pinned,
        };
      }),
    [specs, durationYears],
  );

  const plan = useMemo(() => computePlan(components, totalPrice), [components, totalPrice]);
  const months = planDurationMonths(plan);

  const value = (key: string) => {
    const v = specs[key];
    return typeof v === "string" || typeof v === "number" ? String(v) : "";
  };

  const setKey = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange(key, e.target.value);

  /** Clearing one side lets the other drive, so the two never fight. */
  const setPercent = (f: (typeof FIELDS)[number]) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onApply({ [f.pct]: e.target.value, [f.amt]: "" });
  };

  const setAmount = (f: (typeof FIELDS)[number]) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onApply({ [f.amt]: e.target.value, [f.pct]: "" });
  };

  /** Writes the derived figures into the saved fields. */
  const applyDerived = () => {
    const patch: Record<string, string> = {};
    FIELDS.forEach((f, i) => {
      const c = plan.components[i];
      if (!c || c.resolvedTotal <= 0) return;
      patch[f.amt] = String(Math.round(c.resolvedEach * 100) / 100);
      /*
       * The percentage is saved as well as the amount. Without it the public
       * page had only instalment figures and no split to render, so a plan
       * the admin had filled in showed as nothing at all.
       */
      patch[f.pct] = String(Math.round(c.resolvedPercent * 10000) / 10000);
      if (f.countKey) patch[f.countKey] = String(c.count);
    });
    // Only fill the duration if the admin has not set one.
    if (months > 0 && durationYears <= 0) {
      patch.planDurationYears = String(Math.ceil(months / 12));
    }
    onApply(patch);
  };

  const resetAll = () => {
    const cleared: Record<string, string> = {};
    for (const f of FIELDS) {
      cleared[f.pct] = "";
      cleared[f.amt] = "";
    }
    onApply(cleared);
  };

  return (
    <fieldset className="rounded-lg border border-primary/30 bg-primary/[0.02] p-4">
      <legend className="px-1.5 text-[12px] font-semibold text-primary">
        Payment Plan Calculator
      </legend>
      <p className="mb-3 text-[10.5px] leading-4 text-gray-500">
        Enter the unit size and rate, then set <strong>either</strong> a percentage{" "}
        <strong>or</strong> an instalment amount for each component. Anything you
        leave blank shares the remainder automatically so the plan totals 100%.
      </p>

      {/* Price + duration — these drive everything below. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Num label="Area (SQFT)" value={value("unitArea")} onChange={setKey("unitArea")} placeholder="329" />
        <Num label="Rate / SQFT (PKR)" value={value("ratePerSqft")} onChange={setKey("ratePerSqft")} placeholder="14850" />
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-gray-600">
            Plan Duration (years)
          </label>
          <input
            type="number" min={0} step="any" autoComplete="off"
            value={value("planDurationYears")}
            onChange={setKey("planDurationYears")}
            placeholder="4"
            className={adminInputClass}
          />
          <p className="mt-1 text-[10px] text-gray-400">
            {durationYears > 0
              ? `Sets the instalment counts below`
              : "Fills the counts automatically"}
          </p>
        </div>
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-gray-600">Total Price</label>
          <div className="flex h-[38px] items-center rounded-md border border-gray-200 bg-gray-50 px-3 text-[13px] font-bold text-gray-900">
            {hasPrice ? formatPKR(totalPrice) : "—"}
          </div>
          {hasPrice && (
            <>
              <PriceInWords value={totalPrice} className="mt-1 text-[10.5px] font-medium text-primary" />
              <p className="mt-0.5 text-[10px] text-gray-400">{area.toLocaleString()} × {rate.toLocaleString()}</p>
            </>
          )}
        </div>
      </div>

      {/* Components */}
      <div className="mt-4 overflow-x-auto rounded-md border border-gray-200 bg-white">
        <table className="w-full min-w-[720px] text-[11.5px]">
          <thead>
            <tr className="bg-gray-50 text-left text-[10px] uppercase tracking-wide text-gray-500">
              <th className="px-3 py-2 font-medium">Component</th>
              <th className="px-3 py-2 font-medium">Percentage</th>
              <th className="px-3 py-2 font-medium">Amount each</th>
              <th className="px-3 py-2 font-medium">Count</th>
              <th className="px-3 py-2 text-right font-medium">Component total</th>
            </tr>
          </thead>
          <tbody>
            {FIELDS.map((f, i) => {
              const c = plan.components[i];
              const auto = c?.derived ?? false;

              return (
                <tr key={f.key} className="border-t border-gray-100">
                  <td className="whitespace-nowrap px-3 py-2 font-medium text-gray-700">
                    {f.label}
                    {auto && hasPrice && (
                      <span className="ml-1.5 rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-blue-600">
                        auto
                      </span>
                    )}
                  </td>

                  <td className="px-3 py-1.5">
                    <input
                      type="number" min={0} step="any" autoComplete="off"
                      value={value(f.pct)}
                      onChange={setPercent(f)}
                      placeholder={auto && hasPrice ? c.resolvedPercent.toFixed(4) : "—"}
                      className={`${adminInputClass} ${auto ? "placeholder:text-blue-400" : ""}`}
                    />
                  </td>

                  <td className="px-3 py-1.5">
                    <input
                      type="number" min={0} step="any" autoComplete="off"
                      value={value(f.amt)}
                      onChange={setAmount(f)}
                      placeholder={hasPrice && c ? String(Math.round(c.resolvedEach)) : "—"}
                      className={`${adminInputClass} ${auto ? "placeholder:text-blue-400" : ""}`}
                    />
                  </td>

                  <td className="px-3 py-1.5">
                    {f.countKey ? (
                      <input
                        type="number" min={1} step={1} autoComplete="off"
                        value={value(f.countKey)}
                        onChange={setKey(f.countKey!)}
                        placeholder={String(deriveCount(f.key, durationYears) ?? 1)}
                        className={`${adminInputClass} ${
                          !has(specs[f.countKey]) && deriveCount(f.key, durationYears)
                            ? "placeholder:text-blue-400"
                            : ""
                        }`}
                      />
                    ) : (
                      <span className="text-gray-400">1</span>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-3 py-2 text-right font-semibold text-gray-900">
                    {hasPrice && c && c.resolvedTotal > 0 ? formatPKR(c.resolvedTotal) : "—"}
                  </td>
                </tr>
              );
            })}

            <tr className="border-t border-gray-200 bg-gray-50/70 font-bold text-gray-900">
              <td className="px-3 py-2">Total</td>
              <td className="px-3 py-2">{plan.percentTotal.toFixed(2)}%</td>
              <td className="px-3 py-2" />
              <td className="px-3 py-2" />
              <td className="px-3 py-2 text-right">
                {hasPrice
                  ? formatPKR(plan.components.reduce((s, c) => s + c.resolvedTotal, 0))
                  : "—"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Balance banner */}
      <div
        className={[
          "mt-3 flex flex-wrap items-center justify-between gap-3 rounded-md px-3 py-2 text-[11.5px] font-medium",
          !hasPrice
            ? "bg-gray-50 text-gray-500"
            : plan.overAllocated
              ? "bg-red-50 text-red-700"
              : plan.valid
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700",
        ].join(" ")}
      >
        <span>
          {!hasPrice
            ? "Enter the area and rate to start."
            : plan.overAllocated
              ? `Over-allocated by ${(plan.pinnedPercent - 100).toFixed(2)}% — reduce one of the values you set.`
              : plan.valid
                ? `Adds up to 100%${months > 0 ? ` over roughly ${Math.ceil(months / 12)} year${months > 12 ? "s" : ""}` : ""} — good to go.`
                : `${plan.percentTotal.toFixed(2)}% assigned — set a value for at least one more component.`}
        </span>
        <span className="flex gap-2">
          <button
            type="button"
            onClick={resetAll}
            className="rounded-md border border-gray-300 bg-white px-3 py-1 text-[11px] font-semibold text-gray-600 hover:bg-gray-50"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={applyDerived}
            disabled={!hasPrice || !plan.valid}
            className="rounded-md bg-primary px-3 py-1 text-[11px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Fill plan below
          </button>
        </span>
      </div>

      {/*
        Collapsed by default: the table above already shows every amount, so
        this is a final check of the buyer's wording rather than daily reading.
      */}
      {hasPrice && plan.valid && (
        <details className="mt-3 group">
          <summary className="cursor-pointer list-none text-[10.5px] font-semibold text-primary hover:underline">
            <span className="group-open:hidden">▸ Preview what the buyer will see</span>
            <span className="hidden group-open:inline">▾ Hide buyer preview</span>
          </summary>
          <div className="mt-2 overflow-x-auto rounded-md border border-gray-200 bg-white">
            <table className="w-full text-[11.5px]">
              <thead>
                <tr className="bg-gray-50 text-left text-[10px] uppercase tracking-wide text-gray-500">
                  <th className="px-3 py-2 font-medium">Payment</th>
                  <th className="px-3 py-2 text-right font-medium">Amount</th>
                  <th className="px-3 py-2 font-medium">Schedule</th>
                </tr>
              </thead>
              <tbody>
                {plan.components
                  .filter((c) => c.resolvedTotal > 0.005)
                  .map((c) => (
                    <tr key={c.key} className="border-t border-gray-100 text-gray-700">
                      <td className="px-3 py-2">{c.label}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-right font-semibold">
                        {formatExact(c.resolvedEach)}
                      </td>
                      <td className="px-3 py-2 text-gray-500">
                        {c.count > 1
                          ? `× ${c.count} ${FREQUENCIES.find((x) => x.value === c.frequency)?.label.toLowerCase() ?? ""}`
                          : "One payment"}
                      </td>
                    </tr>
                  ))}
                <tr className="border-t border-gray-200 bg-gray-50/70 font-bold text-gray-900">
                  <td className="px-3 py-2">Total</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">{formatPKR(totalPrice)}</td>
                  <td className="px-3 py-2">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>
      )}
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
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
        onChange={onChange}
        placeholder={placeholder}
        className={adminInputClass}
      />
    </div>
  );
}
