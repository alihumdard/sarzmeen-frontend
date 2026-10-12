"use client";

import { useMemo } from "react";
import {
  PERCENT_COMPONENTS,
  derivePlan,
  derivedSpecPatch,
  formatExact,
  formatPKR,
} from "@/lib/paymentPlan";
import type { SpecValue } from "@/components/admin/SpecFieldGroup";
import { adminInputClass } from "@/components/admin/AdminFormField";

type Props = {
  specs: Record<string, SpecValue>;
  onChange: (key: string, value: SpecValue) => void;
  /** Applies many keys at once, so filling the builder below is a single update. */
  onApply: (patch: Record<string, string>) => void;
};

/**
 * Derives a payment plan from area x rate and a percentage split, then writes
 * the resulting amounts into the instalment builder underneath.
 *
 * Percentages are never auto-balanced: an admin who types 30 keeps 30, and the
 * banner tells them what is still missing. Auto-adjusting the untouched fields
 * produces figures like 29.1671% and amounts that no longer match the
 * developer's published plan.
 */
export default function PaymentPlanCalculator({ specs, onChange, onApply }: Props) {
  const plan = useMemo(() => derivePlan(specs), [specs]);

  const value = (key: string) => {
    const v = specs[key];
    return typeof v === "string" || typeof v === "number" ? String(v) : "";
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange(key, e.target.value);

  const apply = () => onApply(derivedSpecPatch(plan));

  const reset = () => {
    const cleared: Record<string, string> = {};
    for (const c of PERCENT_COMPONENTS) cleared[c.key] = "";
    onApply(cleared);
  };

  const canApply = plan.hasPrice && plan.valid;

  return (
    <fieldset className="rounded-lg border border-primary/30 bg-primary/[0.02] p-4">
      <legend className="px-1.5 text-[12px] font-semibold text-primary">
        Payment Plan Calculator
      </legend>
      <p className="mb-3 text-[10.5px] text-gray-500">
        Enter the unit size and rate, split the price into percentages, then fill the plan below automatically.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Num label="Area (SQFT)" value={value("unitArea")} onChange={set("unitArea")} placeholder="329" />
        <Num label="Rate / SQFT (PKR)" value={value("ratePerSqft")} onChange={set("ratePerSqft")} placeholder="14850" />
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-gray-600">Total Price</label>
          <div className="flex h-[38px] items-center rounded-md border border-gray-200 bg-gray-50 px-3 text-[13px] font-bold text-gray-900">
            {plan.hasPrice ? formatPKR(plan.totalPrice) : "—"}
          </div>
          {plan.hasPrice && (
            <p className="mt-1 text-[10px] text-gray-400">{formatExact(plan.totalPrice)}</p>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {PERCENT_COMPONENTS.map((c) => (
          <Num
            key={c.key}
            label={`${c.label} %`}
            value={value(c.key)}
            onChange={set(c.key)}
            placeholder="0"
          />
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Num label="Monthly Count" value={value("monthlyCount")} onChange={set("monthlyCount")} placeholder="40" />
        <Num label="Balloon Count" value={value("balloonCount")} onChange={set("balloonCount")} placeholder="8" />
        <Num label="Balloon Every (months)" value={value("balloonFrequency")} onChange={set("balloonFrequency")} placeholder="6" />
        <Num label="Plan Duration (years)" value={value("planDurationYears")} onChange={set("planDurationYears")} placeholder="4" />
      </div>

      <div
        className={[
          "mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md px-3 py-2 text-[11.5px] font-medium",
          plan.percentTotal === 0
            ? "bg-gray-50 text-gray-500"
            : plan.valid
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700",
        ].join(" ")}
      >
        <span>
          {plan.percentTotal === 0
            ? "Enter the percentages for each payment component."
            : plan.valid
              ? `Percentages add up to 100% — good to go.`
              : `Percentages add up to ${plan.percentTotal.toFixed(2)}% — must equal 100%. ${
                  plan.percentTotal < 100
                    ? `${(100 - plan.percentTotal).toFixed(2)}% still unassigned.`
                    : `Over by ${(plan.percentTotal - 100).toFixed(2)}%.`
                }`}
        </span>
        <span className="flex gap-2">
          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-gray-300 bg-white px-3 py-1 text-[11px] font-semibold text-gray-600 hover:bg-gray-50"
          >
            Reset %
          </button>
          <button
            type="button"
            onClick={apply}
            disabled={!canApply}
            className="rounded-md bg-primary px-3 py-1 text-[11px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Fill plan below
          </button>
        </span>
      </div>

      {plan.hasPrice && plan.percentTotal > 0 && (
        <div className="mt-4 overflow-x-auto rounded-md border border-gray-200">
          <table className="w-full text-[11.5px]">
            <thead>
              <tr className="bg-gray-50 text-left text-[10px] uppercase tracking-wide text-gray-500">
                <th className="px-3 py-2 font-medium">Payment</th>
                <th className="px-3 py-2 text-right font-medium">%</th>
                <th className="px-3 py-2 text-right font-medium">Each</th>
                <th className="px-3 py-2 text-right font-medium">Count</th>
                <th className="px-3 py-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {plan.lines.map((line) => (
                <tr key={line.label} className="border-t border-gray-100 text-gray-700">
                  <td className="px-3 py-2">{line.label}</td>
                  <td className="px-3 py-2 text-right text-gray-500">{line.percent || 0}%</td>
                  <td className="px-3 py-2 text-right">
                    {line.total > 0 ? formatExact(line.each) : "—"}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-500">
                    {line.total > 0 ? line.count : "—"}
                  </td>
                  <td className="px-3 py-2 text-right font-semibold text-gray-900">
                    {line.total > 0 ? formatExact(line.total) : "—"}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-gray-200 bg-gray-50/70 font-bold text-gray-900">
                <td className="px-3 py-2">Total</td>
                <td className="px-3 py-2 text-right">{plan.percentTotal.toFixed(2)}%</td>
                <td className="px-3 py-2" />
                <td className="px-3 py-2" />
                <td className="px-3 py-2 text-right">
                  {formatExact(plan.lines.reduce((s, l) => s + l.total, 0))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
