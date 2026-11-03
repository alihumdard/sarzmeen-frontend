import { api } from "./client";

/**
 * Payment plans a buyer worked out on the calculator and kept.
 *
 * `inputs` is the calculator's own state, stored and handed back as-is:
 * the components a plan splits a price across are this app's list and keep
 * changing, so the API treats the whole thing as opaque.
 */
export type SavedPlanInputs = {
  mode: "area" | "price";
  area: string;
  unit: string;
  rate: string;
  price: string;
  startDate: string;
  duration: string;
  discount: string;
  discountTarget: string;
  rows: Record<string, { percent: string; amount: string; count: string }>;
};

export type SavedPlan = {
  id: string;
  title: string;
  totalPrice: number;
  netTotal: number;
  savedAt: string;
  updatedAt: string;
  /** Only present when one plan is fetched; the list leaves it out. */
  inputs?: SavedPlanInputs;
};

export async function listSavedPlans(): Promise<{ data: SavedPlan[] }> {
  return api("/my/payment-plans");
}

export async function getSavedPlan(id: string): Promise<{ data: SavedPlan }> {
  return api(`/my/payment-plans/${id}`);
}

export async function createSavedPlan(body: {
  title: string;
  inputs: SavedPlanInputs;
  totalPrice: number;
  netTotal: number;
}): Promise<{ data: SavedPlan }> {
  // The client serialises the body itself; stringifying here double-encodes it.
  return api("/my/payment-plans", { method: "POST", body });
}

export async function deleteSavedPlan(id: string): Promise<void> {
  await api(`/my/payment-plans/${id}`, { method: "DELETE" });
}
