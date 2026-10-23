"use client";

import Image from "next/image";
import {
  areaUnit,
  buildDatedSchedule,
  formatDueDate,
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
}: Props) {
  const rows = buildDatedSchedule(plan, startDate);
  const unitInfo = areaUnit(unit);
  const printedOn = formatDueDate(new Date());

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

      <h1 className="pp-title">Payment Schedule</h1>
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
            <td className="pp-l pp-strong">Total</td>
            <td className="pp-r pp-strong">{formatExact(totalPrice)}</td>
            <td className="pp-c" colSpan={2}>
              {rows.length} payment{rows.length === 1 ? "" : "s"}
            </td>
          </tr>
        </tfoot>
      </table>

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

function capitalise(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
