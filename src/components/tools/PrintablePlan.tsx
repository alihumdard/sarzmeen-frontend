"use client";

import Image from "next/image";
import {
  areaUnit,
  buildDatedSchedule,
  formatDueDate,
  FREQUENCIES,
  formatExact,
  type AreaUnit,
  type ComputedPlan,
} from "@/lib/paymentPlanBuilder";

type Props = {
  plan: ComputedPlan;
  totalPrice: number;
  /** Null when the buyer is working from a total price rather than an area. */
  area: number | null;
  unit: AreaUnit;
  rate: number;
  startDate: Date | null;
  /** Shown in the header when the plan came from a listing. */
  title?: string;
  /** Money off the list price. 0 when no discount was entered. */
  discount?: number;
  /** Which part of the plan the discount came off, spelled out. */
  discountLabel?: string;
  /** What is actually payable. Equals `totalPrice` without a discount. */
  netTotal?: number;
  /**
   * "full" prints every instalment with its own due date — the statement a
   * buyer checks against a developer's ledger. "summary" prints one line per
   * component, which is the one-page version to hand over or file.
   */
  mode?: "summary" | "full";
};

/**
 * The statement laid out for paper.
 *
 * Hidden on screen and revealed only while printing, so the buyer sees the
 * interactive calculator and the printer gets a clean document — with the
 * Sarzameen header, a repeating table head and a footer on every page.
 */
export default function PrintablePlan({
  plan,
  totalPrice,
  area,
  unit,
  rate,
  startDate,
  title,
  discount = 0,
  discountLabel,
  netTotal,
  mode = "full",
}: Props) {
  /*
   * `plan` already carries the discounted figures, so every row below is
   * what is payable; the list price is shown separately for the record.
   */
  const rows = buildDatedSchedule(plan, startDate);
  const unitInfo = areaUnit(unit);
  const printedOn = formatDueDate(new Date());
  const hasDiscount = discount > 0.005;
  const payable = netTotal ?? totalPrice;

  /* One line per component, for the summary sheet. */
  const groups = plan.components.filter((c) => c.resolvedTotal > 0.005);

  return (
    <div className="printable-plan" aria-hidden="true">
      <header className="pp-head">
        <div className="pp-brand">
          <Image
            src="/logos/sarzmeen-icon.png"
            alt=""
            width={40}
            height={40}
            className="pp-logo"
          />
          <div>
            <p className="pp-name">Sarzameen.com</p>
            <p className="pp-tagline">Your Property, Our Priority</p>
          </div>
        </div>

        <div className="pp-meta">
          <p>
            <span>Printed</span> {printedOn}
          </p>
          {startDate && (
            <p>
              <span>Booking date</span> {formatDueDate(startDate)}
            </p>
          )}
        </div>
      </header>

      <h1 className="pp-title">
        {mode === "summary" ? "Payment Plan Summary" : "Payment Schedule"}
      </h1>
      {title && <p className="pp-subtitle">{title}</p>}

      {/* Summary of what the schedule was worked out from. */}
      <table className="pp-summary">
        <tbody>
          <tr>
            {area ? (
              <>
                <th>Property Size</th>
                <th>Rate Per {unitInfo.short}</th>
              </>
            ) : null}
            <th>Total Price (PKR)</th>
          </tr>
          <tr>
            {area ? (
              <>
                <td>
                  {area.toLocaleString()} {unitInfo.short}
                </td>
                <td>{formatExact(rate)}</td>
              </>
            ) : null}
            <td className="pp-strong">{formatExact(totalPrice)}</td>
          </tr>
        </tbody>
      </table>

      {hasDiscount && (
        <table className="pp-summary">
          <tbody>
            <tr>
              <th>Discount</th>
              <th>Applied To</th>
              <th>Net Payable (PKR)</th>
            </tr>
            <tr>
              <td>− {formatExact(discount)}</td>
              <td>{discountLabel ?? "Total Amount"}</td>
              <td className="pp-strong">{formatExact(payable)}</td>
            </tr>
          </tbody>
        </table>
      )}

      {mode === "summary" ? (
        <table className="pp-schedule">
          <thead>
            <tr>
              <th className="pp-l">Payment</th>
              <th className="pp-r">Amount Each (PKR)</th>
              <th className="pp-c">Payments</th>
              <th className="pp-r">Total (PKR)</th>
            </tr>
          </thead>

          <tbody>
            {groups.map((c) => (
              <tr key={c.key}>
                <td className="pp-l">{c.label}</td>
                <td className="pp-r">{formatExact(c.resolvedEach)}</td>
                <td className="pp-c">
                  {c.count > 1
                    ? `${c.count} × ${frequencyLabel(c.frequency)}`
                    : "Once"}
                </td>
                <td className="pp-r">{formatExact(c.resolvedTotal)}</td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <td className="pp-l pp-strong" colSpan={3}>
                {hasDiscount ? "Net Payable" : "Total"}
              </td>
              <td className="pp-r pp-strong">{formatExact(payable)}</td>
            </tr>
          </tfoot>
        </table>
      ) : (
        <table className="pp-schedule">
          <thead>
            <tr>
              <th className="pp-l">Payment</th>
              <th className="pp-r">Amount (PKR)</th>
              <th className="pp-c">Due Date</th>
              <th className="pp-c">Type</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.label}-${index}`}>
                <td className="pp-l">{row.label}</td>
                <td className="pp-r">{formatExact(row.amount)}</td>
                <td className="pp-c">{formatDueDate(row.dueDate)}</td>
                <td className="pp-c">
                  {row.frequency === "once" ? "—" : capitalise(row.frequency)}
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <td className="pp-l pp-strong">
                {hasDiscount ? "Net Payable" : "Total"}
              </td>
              <td className="pp-r pp-strong">{formatExact(payable)}</td>
              <td className="pp-c" colSpan={2}>
                {rows.length} payment{rows.length === 1 ? "" : "s"}
              </td>
            </tr>
          </tfoot>
        </table>
      )}

      <p className="pp-note">
        An estimate only. Actual plans vary by developer and project — contact
        the agent for the published schedule.
      </p>

      <footer className="pp-foot">
        <span>Sarzameen.com — Pakistan&apos;s trusted property marketplace</span>
        <span>info@sarzmeen.com · +92 300 1234567</span>
      </footer>
    </div>
  );
}

/** "Bi-Annual", not the raw "biannual" the key spells. */
function frequencyLabel(value: string): string {
  return (
    FREQUENCIES.find((f) => f.value === value)?.label ?? capitalise(value)
  );
}

function capitalise(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
