import type { PropertyPurpose } from "@/types/property";

/**
 * Formats a PKR amount using the South Asian digit grouping
 * (e.g. 125000000 -> "12,50,00,000") that Pakistani listings use.
 */
export function formatPrice(amount: number): string {
  return `PKR ${new Intl.NumberFormat("en-IN").format(amount)}`;
}

/**
 * Price as shown on a listing card.
 *
 * Rentals are quoted monthly, so they carry a "/month" suffix; sale prices
 * are shown as-is.
 */
export function formatListingPrice(
  amount: number,
  purpose: PropertyPurpose = "sale",
): string {
  const price = formatPrice(amount);
  return purpose === "rent" ? `${price}/month` : price;
}

/**
 * Publish date as shown on a blog card, e.g. "May 15, 2024".
 *
 * The timezone is pinned to UTC so the server and client render the same
 * string — otherwise a date near midnight hydrates with a mismatch.
 */
export function formatPostDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(isoDate));
}
