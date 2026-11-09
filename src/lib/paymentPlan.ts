/**
 * Payment-plan maths shared by the listing form and the property detail page,
 * so the schedule a seller enters is the schedule a buyer sees.
 */

import { computePlan, type PlanComponent } from "@/lib/paymentPlanBuilder";

export type PlanInput = Record<string, unknown>;

export type PlanLine = {
  label: string;
  /** Per-instalment amount. */
  each: number;
  count: number;
  total: number;
  /** Instalments repeat; one-off payments do not. */
  recurring: boolean;
  /**
   * Months between instalments (1 monthly, 3 quarterly, 6 bi-annual).
   * 0 for one-off payments. Needed to place each instalment in the right
   * year rather than smearing them across the whole plan.
   */
  intervalMonths: number;
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
  { key: "pctBiAnnual", label: "Bi-Annual", amountKey: "biAnnualInstallment", countKey: "biAnnualCount" },
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
    if (each > 0) lines.push({ label, each, count: 1, total: each, recurring: false, intervalMonths: 0 });
  }

  const recurring: Array<[string, string, string, number]> = [
    ["Monthly Instalment", "monthlyInstallment", "monthlyCount", 1],
    ["Quarterly Instalment", "quarterlyInstallment", "quarterlyCount", 3],
    ["Bi-Annual Instalment", "biAnnualInstallment", "biAnnualCount", 6],
    ["Balloon Payment", "balloonPayment", "balloonCount", 6],
  ];

  for (const [label, amountKey, countKey, intervalMonths] of recurring) {
    const each = num(specs[amountKey]);
    const count = num(specs[countKey]);
    if (each > 0 && count > 0) {
      lines.push({ label, each, count, total: each * count, recurring: true, intervalMonths });
    }
  }

  const grey = num(specs.greyStructureAmount);
  if (grey > 0) {
    lines.push({ label: "Grey Structure", each: grey, count: 1, total: grey, recurring: false, intervalMonths: 0 });
  }

  const possession = num(specs.possessionPayment);
  if (possession > 0) {
    lines.push({ label: "On Possession", each: possession, count: 1, total: possession, recurring: false, intervalMonths: 0 });
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

    /*
     * Walk the instalments in time rather than dividing by the duration:
     * 12 monthly payments on a 2-year plan all land in year one, so year two
     * is genuinely zero. Dividing by the duration would wrongly show half in
     * each year.
     */
    const interval = line.intervalMonths > 0 ? line.intervalMonths : 1;

    for (let i = 0; i < line.count; i++) {
      const monthOffset = i * interval;
      const yearIndex = Math.min(Math.floor(monthOffset / 12), years - 1);
      perYear[yearIndex] += line.each;
    }
  }

  return perYear.map((amount, i) => ({ year: i + 1, amount }));
}


/**
 * Fills in the percentages the admin left blank.
 *
 * Blank components are shown with their derived share as a placeholder,
 * which looks settled on screen but is not in `terms` — so saving used to
 * count them as zero and refuse the plan for not reaching 100%. This
 * resolves them with the same engine the form displays, so what was shown
 * is what is saved.
 */
/**
 * Whether a field carries a percentage to honour.
 *
 * Only a value that reads as a number counts. A saved plan can arrive with
 * nulls where the API left a component unset, and a field can hold something
 * no number can be made of -- a stray "." mid-type, or text the browser
 * restored. Treating any of those as a typed figure pinned the component at
 * zero and left nothing to share out the remaining percentage, so a plan the
 * form showed as complete was refused for totalling 0%.
 */
export function typedPercent(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null;

  /* A comma is how a decimal is often typed here, as the input treats it. */
  const text = String(raw).trim().replace(/,/g, ".");
  if (text === "") return null;

  const value = Number(text);
  return Number.isFinite(value) ? value : null;
}

export function resolveTerms(
  terms: Record<string, string>,
): Record<string, string> {
  const components: PlanComponent[] = PERCENT_COMPONENTS.map((c) => {
    const typed = typedPercent(terms[c.key]);
    const countKey = "countKey" in c ? (c.countKey as string) : null;

    return {
      key: c.key as PlanComponent["key"],
      label: c.label,
      percent: typed ?? undefined,
      count: countKey ? Math.max(1, Number(terms[countKey]) || 1) : 1,
      frequency: "once" as const,
      pinned: typed === null ? ("none" as const) : ("percent" as const),
    };
  });

  // 100 as the base makes resolvedPercent read directly as a percentage.
  const plan = computePlan(components, 100);
  const filled: Record<string, string> = { ...terms };

  /*
   * Rounding each derived share on its own does not add up: seven blank
   * components each take 100/7 = 14.2857, which rounds to 14.29 and totals
   * 100.03 -- enough for the save check to reject a form nobody had even
   * typed in. So every share but the last is rounded, and the last takes
   * whatever is left, which makes the printed figures sum to exactly 100.
   */
  const blanks: number[] = [];
  PERCENT_COMPONENTS.forEach((component, i) => {
    if (typedPercent(terms[component.key]) === null) blanks.push(i);
  });

  const typedTotal = PERCENT_COMPONENTS.reduce((sum, component) => {
    return sum + (typedPercent(terms[component.key]) ?? 0);
  }, 0);

  /*
   * Counted in hundredths of a percent, as whole numbers. Adding the
   * rounded shares as decimals left the total a hair under 100
   * (99.99999999999999), which the save check reads as short.
   */
  const typedCents = Math.round(typedTotal * 100);
  let assignedCents = 0;

  // Shares worth nothing take no part, so the last payer is the last of
  // those that actually receive something.
  const paying = blanks.filter((i) => (plan.components[i]?.resolvedPercent ?? 0) > 0);

  paying.forEach((i, position) => {
    const component = PERCENT_COMPONENTS[i];
    const share = plan.components[i]?.resolvedPercent ?? 0;

    const isLast = position === paying.length - 1;
    // The last payer absorbs the rounding drift the others left behind.
    const cents = isLast
      ? Math.max(0, 10000 - typedCents - assignedCents)
      : Math.round(share * 100);

    assignedCents += cents;
    filled[component.key] = String(cents / 100);
  });

  return filled;
}
