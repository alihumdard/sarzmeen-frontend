"use client";

import { useMemo, useState } from "react";
import {
  computePlan,
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

/**
 * Buyer-facing payment calculator.
 *
 * Mirrors the admin plan builder exactly — same engine, same components, same
 * two-way behaviour — so a buyer's estimate and the published plan cannot
 * drift apart. Set either a percentage or an instalment amount on any row;
 * whatever is left blank shares the remainder so the plan totals 100%.
 */

/** The components a plan can be split across, in the order they fall due. */
const FIELDS = [
  { key: "booking", label: "Booking", countable: false },
  { key: "confirmation", label: "Confirmation", countable: false },
  { key: "monthly", label: "Monthly", countable: true },
  { key: "quarterly", label: "Quarterly", countable: true },
  { key: "biannual", label: "Bi-Annual", countable: true },
  { key: "balloon", label: "Balloon", countable: true },
  { key: "grey", label: "Grey Structure", countable: false },
  { key: "possession", label: "Possession", countable: false },
] as const;

/** How many months apart each component's instalments fall. */
const FREQ_MONTHS: Record<string, number> = {
  monthly: 1,
  quarterly: 3,
  biannual: 6,
  balloon: 6,
};

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

/**
 * Instalment count implied by the plan duration — a 3-year plan paid monthly
 * is 36 instalments, quarterly is 12 — so the duration is set once rather
 * than counted by hand.
 */
function deriveCount(componentKey: string, years: number): number | null {
  const months = FREQ_MONTHS[componentKey];
  if (!months || years <= 0) return null;
  return Math.max(1, Math.round((years * 12) / months));
}

function num(value: string): number {
  if (value.trim() === "") return 0;
  const n = Number(value.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function has(value: string): boolean {
  return value.trim() !== "";
}

/** One row's two inputs plus its count, all held as typed text. */
type RowState = { percent: string; amount: string; count: string };

const emptyRow: RowState = { percent: "", amount: "", count: "" };

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
  const [duration, setDuration] = useState("");

  const [rows, setRows] = useState<Record<string, RowState>>(() =>
    Object.fromEntries(FIELDS.map((f) => [f.key, { ...emptyRow }])),
  );

  const totalPrice =
    mode === "area" ? num(area) * num(rate) : num(price);
  const hasPrice = totalPrice > 0;
  const durationYears = num(duration);

  const components: PlanComponent[] = useMemo(
    () =>
      FIELDS.map((f) => {
        const row = rows[f.key] ?? emptyRow;
        const pctSet = has(row.percent);
        const amtSet = has(row.amount);

        // A typed percentage wins; otherwise a typed amount drives the split.
        const pinned: PlanComponent["pinned"] = pctSet
          ? "percent"
          : amtSet
            ? "amount"
            : "none";

        return {
          key: f.key as PlanComponent["key"],
          label: f.label,
          percent: pctSet ? num(row.percent) : undefined,
          amount: amtSet ? num(row.amount) : undefined,
          // A typed count wins; otherwise the duration decides how many.
          count: !f.countable
            ? 1
            : has(row.count)
              ? Math.max(1, num(row.count))
              : (deriveCount(f.key, durationYears) ?? 1),
          frequency: DEFAULT_FREQ[f.key],
          pinned,
        };
      }),
    [rows, durationYears],
  );

  const plan = useMemo(
    () => computePlan(components, totalPrice),
    [components, totalPrice],
  );
  const months = planDurationMonths(plan);

  /** Clearing the other side lets one drive, so the two never fight. */
  const setPercent = (key: string, value: string) =>
    setRows((prev) => ({
      ...prev,
      [key]: { ...prev[key], percent: value, amount: "" },
    }));

  const setAmount = (key: string, value: string) =>
    setRows((prev) => ({
      ...prev,
      [key]: { ...prev[key], amount: value, percent: "" },
    }));

  const setCount = (key: string, value: string) =>
    setRows((prev) => ({ ...prev, [key]: { ...prev[key], count: value } }));

  const resetAll = () =>
    setRows(Object.fromEntries(FIELDS.map((f) => [f.key, { ...emptyRow }])));

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      {/* Price inputs */}
      <div className="rounded-lg border border-border bg-white p-5">
        <h2 className="text-[15px] font-bold text-heading">
          {title ? `Plan for ${title}` : "Your details"}
        </h2>

        <div className="mt-4 flex rounded-md border border-border p-1">
          {(["area", "price"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={[
                "flex-1 rounded px-3 py-1.5 text-[12px] font-semibold transition-colors",
                mode === m
                  ? "bg-primary text-white"
                  : "text-muted hover:text-heading",
              ].join(" ")}
            >
              {m === "area" ? "Area × Rate" : "Total price"}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {mode === "area" ? (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Area (sq ft)">
                <input
                  type="number"
                  min={0}
                  step="any"
                  inputMode="decimal"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="329"
                  className={inputClass}
                />
              </Field>
              <Field label="Rate / sq ft">
                <input
                  type="number"
                  min={0}
                  step="any"
                  inputMode="decimal"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="14850"
                  className={inputClass}
                />
              </Field>
            </div>
          ) : (
            <Field label="Total price (PKR)">
              <input
                type="number"
                min={0}
                step="any"
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="4885650"
                className={inputClass}
              />
            </Field>
          )}

          <div className="rounded-md bg-primary-light px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">
              Total price
            </p>
            <p className="mt-0.5 text-[17px] font-bold text-primary">
              {hasPrice ? formatPKR(totalPrice) : "—"}
            </p>
            {mode === "area" && hasPrice && (
              <p className="mt-0.5 text-[10.5px] text-primary/70">
                {num(area).toLocaleString()} × {num(rate).toLocaleString()}
              </p>
            )}
          </div>

          <Field label="Plan duration (years)">
            <input
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="4"
              className={inputClass}
            />
            <p className="mt-1 text-[10px] text-muted">
              {durationYears > 0
                ? "Sets the instalment counts"
                : "Fills the counts automatically"}
            </p>
          </Field>
        </div>
      </div>

      {/* Plan table */}
      <div className="rounded-lg border border-border bg-white p-5">
        <h2 className="text-[15px] font-bold text-heading">Your payment plan</h2>
        <p className="mt-1 text-[11.5px] leading-5 text-muted">
          Set <strong>either</strong> a percentage <strong>or</strong> an
          instalment amount for each component. Anything left blank shares the
          remainder automatically so the plan totals 100%.
        </p>

        <div className="mt-4 overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[640px] text-[12px]">
            <thead>
              <tr className="bg-surface text-left text-[10px] uppercase tracking-wide text-muted">
                <th className="px-3 py-2 font-medium">Component</th>
                <th className="px-3 py-2 font-medium">Percentage</th>
                <th className="px-3 py-2 font-medium">Amount each</th>
                <th className="px-3 py-2 font-medium">Count</th>
                <th className="px-3 py-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {FIELDS.map((f, i) => {
                const c = plan.components[i];
                const row = rows[f.key] ?? emptyRow;
                const auto = c?.derived ?? false;

                return (
                  <tr key={f.key} className="border-t border-border">
                    <td className="whitespace-nowrap px-3 py-2 font-medium text-heading">
                      {f.label}
                      {auto && hasPrice && (
                        <span className="ml-1.5 rounded bg-primary-light px-1.5 py-0.5 text-[9px] font-semibold uppercase text-primary">
                          auto
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-1.5">
                      <input
                        type="number"
                        min={0}
                        step="any"
                        inputMode="decimal"
                        value={row.percent}
                        onChange={(e) => setPercent(f.key, e.target.value)}
                        placeholder={
                          auto && hasPrice && c
                            ? c.resolvedPercent.toFixed(2)
                            : "—"
                        }
                        className={inputClass}
                      />
                    </td>

                    <td className="px-3 py-1.5">
                      <input
                        type="number"
                        min={0}
                        step="any"
                        inputMode="decimal"
                        value={row.amount}
                        onChange={(e) => setAmount(f.key, e.target.value)}
                        placeholder={
                          hasPrice && c ? String(Math.round(c.resolvedEach)) : "—"
                        }
                        className={inputClass}
                      />
                    </td>

                    <td className="px-3 py-1.5">
                      {f.countable ? (
                        <input
                          type="number"
                          min={1}
                          step={1}
                          inputMode="numeric"
                          value={row.count}
                          onChange={(e) => setCount(f.key, e.target.value)}
                          placeholder={String(
                            deriveCount(f.key, durationYears) ?? 1,
                          )}
                          className={inputClass}
                        />
                      ) : (
                        <span className="text-muted">1</span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-3 py-2 text-right font-semibold text-heading">
                      {hasPrice && c && c.resolvedTotal > 0
                        ? formatPKR(c.resolvedTotal)
                        : "—"}
                    </td>
                  </tr>
                );
              })}

              <tr className="border-t border-border bg-surface font-bold text-heading">
                <td className="px-3 py-2">Total</td>
                <td className="px-3 py-2">{plan.percentTotal.toFixed(2)}%</td>
                <td className="px-3 py-2" />
                <td className="px-3 py-2" />
                <td className="whitespace-nowrap px-3 py-2 text-right text-primary">
                  {hasPrice
                    ? formatPKR(
                        plan.components.reduce((s, c) => s + c.resolvedTotal, 0),
                      )
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
              ? "bg-surface text-muted"
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
                  ? `Adds up to 100%${
                      months > 0
                        ? ` over roughly ${Math.ceil(months / 12)} year${months > 12 ? "s" : ""}`
                        : ""
                    } — good to go.`
                  : `${plan.percentTotal.toFixed(2)}% assigned — set a value for at least one more component.`}
          </span>

          <button
            type="button"
            onClick={resetAll}
            className="rounded border border-border bg-white px-2.5 py-1 text-[11px] font-semibold text-muted transition-colors hover:text-heading"
          >
            Reset
          </button>
        </div>

        <p className="mt-3 text-[11px] leading-5 text-muted">
          An estimate only. Actual plans vary by developer and project —
          contact the agent for the published schedule.
        </p>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-border bg-white px-3 py-2 text-[12.5px] text-heading outline-none transition-colors focus:border-primary";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-medium text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}
