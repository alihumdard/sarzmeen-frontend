/**
 * Two-way payment-plan engine.
 *
 * A developer advertises round instalments ("Rs 35,625 / month"), not round
 * percentages. So a component can be driven from either side:
 *
 *   - set a percentage  -> the amount follows
 *   - set an amount     -> the percentage follows
 *
 * Whichever side the admin sets is "pinned". Components left unpinned share
 * whatever percentage is still unallocated, which keeps the plan at exactly
 * 100% without overwriting a figure the admin typed on purpose.
 */

export type Frequency =
  | "once"
  | "monthly"
  | "quarterly"
  | "biannual"
  | "annual"
  | "balloon";

export const FREQUENCIES: { value: Frequency; label: string; months: number }[] = [
  { value: "once", label: "One-off", months: 0 },
  { value: "monthly", label: "Monthly", months: 1 },
  { value: "quarterly", label: "Quarterly", months: 3 },
  { value: "biannual", label: "Bi-Annual", months: 6 },
  { value: "annual", label: "Annual", months: 12 },
  { value: "balloon", label: "Balloon", months: 6 },
];

export type ComponentKey =
  | "booking"
  | "confirmation"
  | "downPayment"
  | "monthly"
  | "quarterly"
  | "biannual"
  | "annual"
  | "balloon"
  | "grey"
  | "possession";

export type PlanComponent = {
  key: ComponentKey;
  label: string;
  /** Percentage of the total price, when the admin drives it from this side. */
  percent?: number;
  /** Per-instalment amount, when the admin drives it from this side. */
  amount?: number;
  /** Number of instalments. 1 for one-off components. */
  count: number;
  frequency: Frequency;
  /**
   * Which side the admin set. "none" means this component absorbs a share of
   * whatever percentage is left over.
   */
  pinned: "percent" | "amount" | "none";
};

export type ComputedComponent = PlanComponent & {
  /** Resolved share of the total price. */
  resolvedPercent: number;
  /** Resolved total for this component across all its instalments. */
  resolvedTotal: number;
  /** Resolved per-instalment amount. */
  resolvedEach: number;
  /** True when this value was derived rather than typed. */
  derived: boolean;
};

export type PlanUnit = {
  id: string;
  unitType: string;
  area: number;
  ratePerSqft: number;
};

export type ComputedPlan = {
  components: ComputedComponent[];
  /** Sum of every component's percentage. Should land on 100. */
  percentTotal: number;
  pinnedPercent: number;
  /** Percentage shared out between the unpinned components. */
  unallocatedPercent: number;
  valid: boolean;
  /** No component was pinned beyond 100% in total. */
  overAllocated: boolean;
};

export const DEFAULT_COMPONENTS: PlanComponent[] = [
  { key: "booking", label: "Booking", percent: 10, count: 1, frequency: "once", pinned: "percent" },
  { key: "confirmation", label: "Confirmation", percent: 10, count: 1, frequency: "once", pinned: "percent" },
  { key: "monthly", label: "Monthly", count: 40, frequency: "monthly", pinned: "none" },
  { key: "balloon", label: "Balloon", count: 8, frequency: "balloon", pinned: "none" },
  { key: "grey", label: "Grey Structure", percent: 0, count: 1, frequency: "once", pinned: "percent" },
  { key: "possession", label: "Possession", percent: 20, count: 1, frequency: "once", pinned: "percent" },
];

export function unitTotal(unit: Pick<PlanUnit, "area" | "ratePerSqft">): number {
  return Math.max(0, unit.area) * Math.max(0, unit.ratePerSqft);
}

/** Rounds to 4 dp so derived percentages stay readable (29.1671, not 29.16710000002). */
function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

/**
 * Resolves every component against a total price.
 *
 * Pinned components keep exactly what the admin set. Unpinned ones split the
 * remaining percentage evenly between themselves.
 */
export function computePlan(
  components: PlanComponent[],
  totalPrice: number,
): ComputedPlan {
  const safeTotal = totalPrice > 0 ? totalPrice : 0;

  // 1. Resolve the percentage each pinned component accounts for.
  let pinnedPercent = 0;

  const withPinned = components.map((c) => {
    const count = Math.max(1, Math.round(c.count || 1));
    let percent: number | null = null;

    if (c.pinned === "percent" && c.percent != null) {
      percent = c.percent;
    } else if (c.pinned === "amount" && c.amount != null && safeTotal > 0) {
      // An amount is per-instalment, so the component's share is amount x count.
      percent = ((c.amount * count) / safeTotal) * 100;
    }

    if (percent != null) pinnedPercent += percent;
    return { component: c, count, percent };
  });

  // 2. Share whatever is left between the components the admin has not set.
  const unpinnedCount = withPinned.filter((w) => w.percent == null).length;
  const unallocated = 100 - pinnedPercent;
  const share = unpinnedCount > 0 ? unallocated / unpinnedCount : 0;

  const computed: ComputedComponent[] = withPinned.map((w) => {
    const derived = w.percent == null;
    const exactPercent = derived ? share : w.percent!;

    /*
     * Amounts come from the exact percentage, never the rounded one — rounding
     * first drifts each instalment by paisa that compound across the schedule.
     * resolvedPercent is for display only.
     */
    const resolvedTotal = (safeTotal * exactPercent) / 100;

    // A pinned amount is authoritative: echo it back untouched.
    const resolvedEach =
      w.component.pinned === "amount" && w.component.amount != null
        ? w.component.amount
        : resolvedTotal / w.count;

    return {
      ...w.component,
      count: w.count,
      resolvedPercent: round4(exactPercent),
      resolvedTotal,
      resolvedEach,
      derived,
    };
  });

  // Sum from resolvedTotal so float drift in the displayed percentages
  // cannot make a valid plan look invalid.
  const percentTotal = safeTotal > 0
    ? round4((computed.reduce((sum, c) => sum + c.resolvedTotal, 0) / safeTotal) * 100)
    : round4(computed.reduce((sum, c) => sum + c.resolvedPercent, 0));

  return {
    components: computed,
    percentTotal,
    pinnedPercent: round4(pinnedPercent),
    unallocatedPercent: round4(unallocated),
    // Tolerate float drift rather than demanding exactness.
    valid: Math.abs(percentTotal - 100) < 0.01,
    overAllocated: pinnedPercent > 100.01,
  };
}

/** A readable schedule line for the buyer-facing table. */
export type ScheduleRow = {
  label: string;
  each: number;
  count: number;
  total: number;
  percent: number;
  schedule: string;
};

export function buildSchedule(plan: ComputedPlan): ScheduleRow[] {
  return plan.components
    .filter((c) => c.resolvedTotal > 0.005)
    .map((c) => ({
      label: c.label,
      each: c.resolvedEach,
      count: c.count,
      total: c.resolvedTotal,
      percent: c.resolvedPercent,
      schedule: describeSchedule(c),
    }));
}

function describeSchedule(c: ComputedComponent): string {
  if (c.count <= 1) {
    if (c.key === "booking") return "On booking";
    if (c.key === "confirmation") return "On confirmation";
    if (c.key === "possession") return "At possession";
    return "One-off";
  }

  const freq = FREQUENCIES.find((f) => f.value === c.frequency);
  const unit = freq && freq.months > 0 ? freq.label.toLowerCase() : "payments";

  if (c.frequency === "balloon") {
    return `${c.count} payments, every ${freq?.months ?? 6} months`;
  }

  return `${c.count} ${unit} payments`;
}

/** Total months the plan runs for, used to show the duration. */
export function planDurationMonths(plan: ComputedPlan): number {
  return plan.components.reduce((max, c) => {
    const freq = FREQUENCIES.find((f) => f.value === c.frequency);
    if (!freq || freq.months === 0) return max;
    return Math.max(max, freq.months * c.count);
  }, 0);
}

export function formatPKR(amount: number): string {
  if (!Number.isFinite(amount) || amount === 0) return "Rs 0";
  return `Rs ${Math.round(amount).toLocaleString("en-PK")}`;
}

/** Keeps the paisa, for per-instalment figures where rounding misleads. */
export function formatExact(amount: number): string {
  if (!Number.isFinite(amount)) return "Rs 0";
  return `Rs ${amount.toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
