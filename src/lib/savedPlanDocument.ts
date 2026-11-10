/**
 * Rebuilds a saved plan into the figures a printout needs.
 *
 * The calculator derives these from its own live state. Printing a plan from
 * the saved list has no calculator on the page, so the same derivation lives
 * here and both sides call it -- a printed plan and the plan on screen cannot
 * then disagree.
 */

import type { SavedPlanInputs } from "@/lib/api/savedPlans";
import {
  applyDiscount,
  AREA_UNITS,
  computePlan,
  netPlan,
  type AreaUnit,
  type ComputedPlan,
  type DiscountTarget,
  type Frequency,
  type PlanComponent,
} from "@/lib/paymentPlanBuilder";

/** The components a plan can be split across, in the order they fall due. */
export const PLAN_FIELDS = [
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

function num(value: string | null | undefined): number {
  if (!value || String(value).trim() === "") return 0;
  const n = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/*
 * Null-tolerant on purpose: a blank field is an empty string in the form but
 * comes back as null through JSON, so a reopened plan would crash on .trim().
 */
function has(value: string | null | undefined): boolean {
  return !!value && String(value).trim() !== "";
}

/**
 * Instalment count implied by the plan duration — a 3-year plan paid monthly
 * is 36 instalments — so the duration is set once rather than counted by hand.
 */
function deriveCount(componentKey: string, years: number): number | null {
  const months = FREQ_MONTHS[componentKey];
  if (!months || years <= 0) return null;
  return Math.max(1, Math.round((years * 12) / months));
}

export type PlanDocument = {
  plan: ComputedPlan;
  totalPrice: number;
  /** Null when the buyer worked from a total price rather than an area. */
  area: number | null;
  unit: AreaUnit;
  rate: number;
  startDate: Date | null;
  discount: number;
  discountLabel: string;
  netTotal: number;
  /** The unit written the way it is read: "sq ft", not "sqft". */
  unitShort: string;
};

const DISCOUNT_LABELS: Record<string, string> = {
  total: "the total",
  booking: "Booking",
  confirmation: "Confirmation",
  monthly: "Monthly",
  quarterly: "Quarterly",
  biannual: "Bi-Annual",
  balloon: "Balloon",
  grey: "Grey Structure",
  possession: "Possession",
};

/** Builds everything a printout needs from the inputs a plan was saved with. */
export function buildPlanDocument(inputs: SavedPlanInputs): PlanDocument {
  /* A unit the app no longer offers falls back rather than breaking the page. */
  const unit: AreaUnit =
    AREA_UNITS.find((u) => u.value === inputs.unit)?.value ?? "sqft";
  const area = num(inputs.area);
  const rate = num(inputs.rate);

  /*
   * A plan saved in "price" mode has no area or rate to multiply, so the
   * typed total is the price; otherwise it is area x rate.
   */
  const totalPrice =
    inputs.mode === "price" ? num(inputs.price) : area * rate;

  const durationYears = num(inputs.duration);

  const components: PlanComponent[] = PLAN_FIELDS.map((f) => {
    const row = inputs.rows?.[f.key] ?? { percent: "", amount: "", count: "" };
    const pctSet = has(row.percent);
    const amtSet = has(row.amount);

    return {
      key: f.key as PlanComponent["key"],
      label: f.label,
      percent: pctSet ? num(row.percent) : undefined,
      amount: amtSet ? num(row.amount) : undefined,
      count: !f.countable
        ? 1
        : has(row.count)
          ? Math.max(1, num(row.count))
          : (deriveCount(f.key, durationYears) ?? 1),
      frequency: DEFAULT_FREQ[f.key],
      pinned: pctSet ? "percent" : amtSet ? "amount" : "none",
    };
  });

  const plan = computePlan(components, totalPrice);

  const discounted = applyDiscount(
    plan,
    num(inputs.discount),
    inputs.discountTarget as DiscountTarget,
  );

  /* Net figures in, so the printout needs no discount logic of its own. */
  const netted = netPlan(plan, discounted);

  return {
    plan: netted,
    totalPrice,
    area: inputs.mode === "price" || area <= 0 ? null : area,
    unit,
    rate,
    startDate: parseDate(inputs.startDate),
    discount: discounted.applied,
    discountLabel: DISCOUNT_LABELS[inputs.discountTarget] ?? "",
    netTotal: discounted.netTotal,
    unitShort: AREA_UNITS.find((u) => u.value === unit)?.short ?? "sq ft",
  };
}

/** Dates are stored as yyyy-mm-dd; parse as local rather than UTC. */
function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const [y, m, d] = String(value).split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}
