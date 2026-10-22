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

/**
 * Spells a rupee amount the way it is spoken in Pakistan, e.g.
 * 12500000 -> "1 Crore 25 Lakh".
 *
 * Shown under a price field as the person types, so a mistyped digit is
 * caught before saving: 2,50,000 and 25,00,000 look alike at a glance but
 * read as "2 Lakh 50 Thousand" and "25 Lakh".
 *
 * Only the two largest units are named — "1 Crore 25 Lakh" is how the number
 * is said, where the full "1 Crore 25 Lakh 36 Thousand 400" is not.
 */
export function priceInWords(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return "";

  const units = [
    { value: 10000000, label: "Crore" },
    { value: 100000, label: "Lakh" },
    { value: 1000, label: "Thousand" },
  ];

  const parts: string[] = [];
  let left = Math.floor(amount);

  for (const unit of units) {
    const count = Math.floor(left / unit.value);
    if (count > 0) {
      parts.push(`${count} ${unit.label}`);
      left -= count * unit.value;
    }
    if (parts.length === 2) break;
  }

  // Under a thousand there is no unit to name, so the figure stands alone.
  if (parts.length === 0) return String(left);

  // A remainder below the smallest named unit is noise at this scale.
  if (parts.length === 1 && left > 0 && left < 1000) {
    parts.push(String(left));
  }

  return parts.join(" ");
}
