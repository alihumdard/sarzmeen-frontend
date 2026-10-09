import { buildPlan, formatPKR } from "@/lib/paymentPlan";

type Props = {
  specs: Record<string, unknown>;
  price: number;
};

export default function PropertyPaymentSummary({ specs, price }: Props) {
  const plan = buildPlan(specs, price);

  if (plan.lines.length === 0) return null;

  const booking = plan.lines.find((l) => l.label === "Booking");
  const monthly = plan.lines.find((l) => l.label === "Monthly Instalment");

  return (
    <div className="rounded-lg border border-border bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
          <svg
            className="h-4 w-4 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </div>
        <h3 className="text-[14px] font-bold text-heading">Payment Plan</h3>
      </div>

      <div className="space-y-3">
        {booking && (
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-muted">Booking</span>
            <span className="text-[13px] font-semibold text-heading">
              {formatPKR(booking.each)}
            </span>
          </div>
        )}

        {monthly && (
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-muted">
              Monthly ({monthly.count} months)
            </span>
            <span className="text-[13px] font-semibold text-heading">
              {formatPKR(monthly.each)}
            </span>
          </div>
        )}

        {plan.lines
          .filter(
            (l) =>
              l.label !== "Booking" && l.label !== "Monthly Instalment",
          )
          .map((line) => (
            <div key={line.label} className="flex items-center justify-between">
              <span className="text-[12px] text-muted">
                {line.label}
                {line.recurring ? ` (${line.count}x)` : ""}
              </span>
              <span className="text-[13px] font-semibold text-heading">
                {formatPKR(line.each)}
              </span>
            </div>
          ))}
      </div>

      <div className="mt-4 border-t border-border pt-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium text-muted">Total Price</span>
          <span className="text-[14px] font-bold text-primary">
            {formatPKR(price)}
          </span>
        </div>
        {plan.durationYears > 0 && (
          <p className="mt-1 text-right text-[11px] text-muted">
            {plan.durationYears} year plan
          </p>
        )}
      </div>
    </div>
  );
}
