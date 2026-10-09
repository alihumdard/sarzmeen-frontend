"use client";

import { useMemo } from "react";
import {
  buildPlan,
  formatExact,
  formatPKR,
  yearlyBreakdown,
} from "@/lib/paymentPlan";
import type { SpecValue } from "@/components/admin/SpecFieldGroup";
import { adminInputClass } from "@/components/admin/AdminFormField";

type Props = {
  specs: Record<string, SpecValue>;
  onChange: (key: string, value: SpecValue) => void;
  totalPrice: number;
};

/**
 * Instalment builder: upfront payments, repeating instalments with counts,
 * and a live total that tells the seller whether the plan adds up to the price.
 */
export default function PaymentPlanStep({ specs, onChange, totalPrice }: Props) {
  const plan = useMemo(() => buildPlan(specs, totalPrice), [specs, totalPrice]);
  const schedule = useMemo(() => yearlyBreakdown(plan), [plan]);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange(key, e.target.value);

  const value = (key: string) => {
    const v = specs[key];
    return typeof v === "string" || typeof v === "number" ? String(v) : "";
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-gray-50/60 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-gray-500">Total Price</p>
            <p className="mt-0.5 text-[17px] font-bold text-gray-900">
              {totalPrice > 0 ? formatPKR(totalPrice) : "Set a price on step 1"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide text-gray-500">Plan Covers</p>
            <p className="mt-0.5 text-[17px] font-bold text-gray-900">{formatPKR(plan.scheduled)}</p>
          </div>
        </div>

        {totalPrice > 0 && (
          <div
            className={[
              "mt-3 rounded-md px-3 py-2 text-[11.5px] font-medium",
              plan.balanced
                ? "bg-emerald-50 text-emerald-700"
                : plan.remaining > 0
                  ? "bg-amber-50 text-amber-700"
                  : "bg-red-50 text-red-700",
            ].join(" ")}
          >
            {plan.balanced
              ? "Plan matches the total price."
              : plan.remaining > 0
                ? `PKR ${formatExact(plan.remaining)} still unallocated — add instalments or a possession payment.`
                : `Plan exceeds the price by PKR ${formatExact(Math.abs(plan.remaining))}.`}
          </div>
        )}
      </div>

      <Section title="Upfront Payments" hint="Paid before the instalments begin.">
        <Money label="Booking Amount" value={value("bookingAmount")} onChange={set("bookingAmount")} total={totalPrice} />
        <Money label="Confirmation Amount" value={value("confirmationAmount")} onChange={set("confirmationAmount")} total={totalPrice} />
        <Money label="Down Payment" value={value("downPayment")} onChange={set("downPayment")} total={totalPrice} />
      </Section>

      <Section title="Instalments" hint="Amount per instalment and how many of them.">
        <Installment
          label="Monthly"
          amount={value("monthlyInstallment")}
          count={value("monthlyCount")}
          onAmount={set("monthlyInstallment")}
          onCount={set("monthlyCount")}
        />
        <Installment
          label="Quarterly"
          amount={value("quarterlyInstallment")}
          count={value("quarterlyCount")}
          onAmount={set("quarterlyInstallment")}
          onCount={set("quarterlyCount")}
        />
        <Installment
          label="Bi-Annual"
          amount={value("biAnnualInstallment")}
          count={value("biAnnualCount")}
          onAmount={set("biAnnualInstallment")}
          onCount={set("biAnnualCount")}
        />
        <Installment
          label="Balloon"
          amount={value("balloonPayment")}
          count={value("balloonCount")}
          onAmount={set("balloonPayment")}
          onCount={set("balloonCount")}
        />
      </Section>

      <Section title="Possession & Charges" hint="Development charges sit on top of the price.">
        <Money label="Possession Payment" value={value("possessionPayment")} onChange={set("possessionPayment")} total={totalPrice} />
        <Money label="Development Charges" value={value("developmentCharges")} onChange={set("developmentCharges")} total={0} />
        <Money label="Other Charges" value={value("otherCharges")} onChange={set("otherCharges")} total={0} />
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-gray-600">
            Plan Duration (Years)
          </label>
          <input
            type="number"
            min={0}
            max={30}
            step="0.5"
            value={value("planDurationYears")}
            onChange={set("planDurationYears")}
            className={adminInputClass}
          />
        </div>
      </Section>

      {plan.lines.length > 0 && (
        <div className="rounded-lg border border-gray-200">
          <div className="border-b border-gray-100 px-4 py-2.5">
            <h4 className="text-[12px] font-semibold text-gray-700">Plan Summary</h4>
          </div>
          <table className="w-full text-[11.5px]">
            <thead>
              <tr className="border-b border-gray-100 text-left text-[10px] uppercase tracking-wide text-gray-500">
                <th className="px-4 py-2 font-medium">Payment</th>
                <th className="px-4 py-2 text-right font-medium">Each</th>
                <th className="px-4 py-2 text-right font-medium">Count</th>
                <th className="px-4 py-2 text-right font-medium">Total</th>
                <th className="px-4 py-2 text-right font-medium">% of Price</th>
              </tr>
            </thead>
            <tbody>
              {plan.lines.map((line) => (
                <tr key={line.label} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-2 text-gray-700">{line.label}</td>
                  <td className="px-4 py-2 text-right text-gray-600">{formatExact(line.each)}</td>
                  <td className="px-4 py-2 text-right text-gray-500">{line.count}</td>
                  <td className="px-4 py-2 text-right font-semibold text-gray-800">{formatExact(line.total)}</td>
                  <td className="px-4 py-2 text-right text-gray-400">
                    {totalPrice > 0 ? `${((line.total / totalPrice) * 100).toFixed(1)}%` : "—"}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50/60">
                <td className="px-4 py-2 font-semibold text-gray-800">Plan Total</td>
                <td />
                <td />
                <td className="px-4 py-2 text-right font-bold text-gray-900">{formatExact(plan.scheduled)}</td>
                <td className="px-4 py-2 text-right text-gray-500">
                  {totalPrice > 0 ? `${((plan.scheduled / totalPrice) * 100).toFixed(1)}%` : "—"}
                </td>
              </tr>
              {plan.charges > 0 && (
                <tr>
                  <td className="px-4 py-2 text-gray-500">Charges (on top of price)</td>
                  <td />
                  <td />
                  <td className="px-4 py-2 text-right text-gray-600">{formatExact(plan.charges)}</td>
                  <td />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {schedule.length > 0 && (
        <div className="rounded-lg border border-gray-200">
          <div className="border-b border-gray-100 px-4 py-2.5">
            <h4 className="text-[12px] font-semibold text-gray-700">
              Yearly Instalment Schedule
            </h4>
            <p className="mt-0.5 text-[10.5px] text-gray-400">
              Recurring instalments spread across {plan.durationYears} year
              {plan.durationYears === 1 ? "" : "s"}. Upfront and possession payments are not included.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-gray-100 sm:grid-cols-4">
            {schedule.map((row) => (
              <div key={row.year} className="bg-white px-4 py-2.5">
                <p className="text-[10px] uppercase tracking-wide text-gray-400">Year {row.year}</p>
                <p className="mt-0.5 text-[12px] font-semibold text-gray-800">
                  {formatExact(row.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-lg border border-gray-200 p-4">
      <legend className="px-1.5 text-[12px] font-semibold text-gray-700">{title}</legend>
      {hint && <p className="mb-3 text-[10.5px] text-gray-400">{hint}</p>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
    </fieldset>
  );
}

function Money({
  label,
  value,
  onChange,
  total,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  total: number;
}) {
  const amount = Number(value) || 0;
  const pct = total > 0 && amount > 0 ? ((amount / total) * 100).toFixed(1) : null;

  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-gray-600">{label}</label>
      <input
        type="number"
        min={0}
        value={value}
        onChange={onChange}
        placeholder="0"
        className={adminInputClass}
      />
      {pct && <p className="mt-1 text-[10px] text-gray-400">{pct}% of price</p>}
    </div>
  );
}

function Installment({
  label,
  amount,
  count,
  onAmount,
  onCount,
}: {
  label: string;
  amount: string;
  count: string;
  onAmount: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCount: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const total = (Number(amount) || 0) * (Number(count) || 0);

  return (
    <div className="rounded-md border border-gray-100 bg-gray-50/40 p-3">
      <p className="mb-2 text-[11px] font-semibold text-gray-700">{label}</p>
      <div className="space-y-2">
        <input
          type="number"
          min={0}
          value={amount}
          onChange={onAmount}
          placeholder="Amount each"
          className={adminInputClass}
        />
        <input
          type="number"
          min={0}
          value={count}
          onChange={onCount}
          placeholder="How many"
          className={adminInputClass}
        />
      </div>
      {total > 0 && (
        <p className="mt-2 text-[10.5px] font-medium text-primary">
          = {formatExact(total)}
        </p>
      )}
    </div>
  );
}
