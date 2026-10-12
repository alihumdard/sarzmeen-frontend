/**
 * Payment-plan maths shared by the listing form and the property detail page,
 * so the schedule a seller enters is the schedule a buyer sees.
 */

export type PlanInput = Record<string, unknown>;

export type PlanLine = {
  label: string;
  /** Per-instalment amount. */
  each: number;
  count: number;
  total: number;
  /** Instalments repeat; one-off payments do not. */
  recurring: boolean;
};

export type PlanSummary = {
  lines: PlanLine[];
  /** Everything the buyer pays across the plan. */
  scheduled: number;
  totalPrice: number;
  /** totalPrice - scheduled. Negative means the plan overshoots the price. */
  remaining: number;
  /** Extras quoted on top of the price rather than inside it. */
  charges: number;
  durationYears: number;
  balanced: boolean;
};

function num(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const n = Number(value.replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

/** The six components whose percentages must add up to 100%. */
export const PERCENT_COMPONENTS = [
  { key: "pctBooking", label: "Booking", amountKey: "bookingAmount" },
  { key: "pctConfirmation", label: "Confirmation", amountKey: "confirmationAmount" },
  { key: "pctMonthly", label: "Monthly", amountKey: "monthlyInstallment", countKey: "monthlyCount" },
  { key: "pctBalloon", label: "Balloon", amountKey: "balloonPayment", countKey: "balloonCount" },
  { key: "pctGrey", label: "Grey Structure", amountKey: "greyStructureAmount" },
  { key: "pctPossession", label: "Possession", amountKey: "possessionPayment" },
] as const;

export type DerivedLine = {
  label: string;
  percent: number;
  /** Share of the total price this component accounts for. */
  total: number;
  /** Per-instalment amount; equals `total` for one-off payments. */
  each: number;
  count: number;
};

export type DerivedPlan = {
  area: number;
  rate: number;
  /** area x rate, the figure every percentage is applied to. */
  totalPrice: number;
  lines: DerivedLine[];
  percentTotal: number;
  /** Percentages add up to exactly 100 (within a rounding tolerance). */
  valid: boolean;
  /** True once there is a price to split, i.e. both area and rate are set. */
  hasPrice: boolean;
};

/**
 * Turns area + rate + percentages into per-component amounts.
 *
 * Kept separate from `buildPlan` because this derives the amounts while
 * `buildPlan` sums whatever amounts are already on the listing — the derived
 * figures are written into those same spec keys, so the two stay in agreement.
 */
export function derivePlan(specs: PlanInput): DerivedPlan {
  const area = num(specs.unitArea);
  const rate = num(specs.ratePerSqft);
  const totalPrice = area * rate;

  let percentTotal = 0;
  const lines: DerivedLine[] = [];

  for (const component of PERCENT_COMPONENTS) {
    const percent = num(specs[component.key]);
    percentTotal += percent;

    const total = (totalPrice * percent) / 100;
    const count = "countKey" in component ? Math.max(1, Math.round(num(specs[component.countKey]))) : 1;

    lines.push({
      label: component.label,
      percent,
      total,
      each: total / count,
      count,
    });
  }

  return {
    area,
    rate,
    totalPrice,
    lines,
    percentTotal,
    // Tolerate float drift (e.g. 33.33 x 3) rather than demanding exactness.
    valid: Math.abs(percentTotal - 100) < 0.01,
    hasPrice: totalPrice > 0,
  };
}

/**
 * The spec patch that pushes a derived plan down into the amount fields the
 * instalment builder below it reads.
 */
export function derivedSpecPatch(plan: DerivedPlan): Record<string, string> {
  const patch: Record<string, string> = {};

  PERCENT_COMPONENTS.forEach((component, i) => {
    const line = plan.lines[i];
    patch[component.amountKey] = line.each > 0 ? String(Math.round(line.each * 100) / 100) : "";
    if ("countKey" in component) {
      patch[component.countKey] = line.total > 0 ? String(line.count) : "";
    }
  });

  return patch;
}

export function buildPlan(specs: PlanInput, totalPrice: number): PlanSummary {
  const lines: PlanLine[] = [];

  const oneOff: Array<[string, string]> = [
    ["Booking", "bookingAmount"],
    ["Confirmation", "confirmationAmount"],
    ["Down Payment", "downPayment"],
  ];

  for (const [label, key] of oneOff) {
    const each = num(specs[key]);
    if (each > 0) lines.push({ label, each, count: 1, total: each, recurring: false });
  }

  const recurring: Array<[string, string, string]> = [
    ["Monthly Instalment", "monthlyInstallment", "monthlyCount"],
    ["Quarterly Instalment", "quarterlyInstallment", "quarterlyCount"],
    ["Bi-Annual Instalment", "biAnnualInstallment", "biAnnualCount"],
    ["Balloon Payment", "balloonPayment", "balloonCount"],
  ];

  for (const [label, amountKey, countKey] of recurring) {
    const each = num(specs[amountKey]);
    const count = num(specs[countKey]);
    if (each > 0 && count > 0) {
      lines.push({ label, each, count, total: each * count, recurring: true });
    }
  }

  const grey = num(specs.greyStructureAmount);
  if (grey > 0) {
    lines.push({ label: "Grey Structure", each: grey, count: 1, total: grey, recurring: false });
  }

  const possession = num(specs.possessionPayment);
  if (possession > 0) {
    lines.push({ label: "On Possession", each: possession, count: 1, total: possession, recurring: false });
  }

  const scheduled = lines.reduce((sum, l) => sum + l.total, 0);
  const charges = num(specs.developmentCharges) + num(specs.otherCharges);
  const remaining = totalPrice - scheduled;

  return {
    lines,
    scheduled,
    totalPrice,
    remaining,
    charges,
    durationYears: num(specs.planDurationYears),
    // Within one rupee, to absorb rounding rather than demanding exactness.
    balanced: totalPrice > 0 && Math.abs(remaining) < 1,
  };
}

/** PKR in the crore / lac shorthand Pakistani listings use. */
export function formatPKR(amount: number): string {
  if (!Number.isFinite(amount) || amount === 0) return "PKR 0";
  const abs = Math.abs(amount);
  if (abs >= 10_000_000) return `PKR ${(amount / 10_000_000).toFixed(2)} Cr`;
  if (abs >= 100_000) return `PKR ${(amount / 100_000).toFixed(2)} Lac`;
  return `PKR ${Math.round(amount).toLocaleString("en-US")}`;
}

export function formatExact(amount: number): string {
  return Math.round(amount).toLocaleString("en-US");
}

/**
 * Year-by-year view of the recurring lines, for the schedule table buyers
 * expect on a payment plan.
 */
export function yearlyBreakdown(plan: PlanSummary): Array<{ year: number; amount: number }> {
  if (plan.durationYears <= 0) return [];

  const years = Math.min(Math.ceil(plan.durationYears), 30);
  const perYear = new Array(years).fill(0);

  for (const line of plan.lines) {
    if (!line.recurring) continue;

    // Spread this line's instalments evenly across the plan duration.
    const perYearCount = line.count / years;
    for (let y = 0; y < years; y++) {
      perYear[y] += perYearCount * line.each;
    }
  }

  return perYear.map((amount, i) => ({ year: i + 1, amount }));
}
