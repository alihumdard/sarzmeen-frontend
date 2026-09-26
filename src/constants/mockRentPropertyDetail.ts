import { propertyDetail } from "@/constants/mockPropertyDetail";
import type { PropertyDetail } from "@/types/property";

/**
 * Mock rental detail record — the rent-side twin of `propertyDetail`.
 *
 * It starts from the sale record and overrides only what genuinely differs
 * for a rental, so the two stay in sync as the base record grows fields.
 * Replaced by the Laravel API in Phase 4.
 */
export const rentPropertyDetail: PropertyDetail = {
  ...propertyDetail,
  id: "r1",
  slug: "1-kanal-house-for-rent-dha-phase-6-lahore",
  title: "1 Kanal House for Rent",
  headline: "1 Kanal House for Rent in DHA Phase 6, Lahore",
  propertyId: "SZ-R10245",
  purpose: "rent",
  /** Monthly rent in PKR. */
  price: 350000,
  negotiable: true,
  propertyStatus: "Available Now",
  furnishing: "Semi Furnished",
  views: 862,
  listedAgo: "1 day ago",
  description:
    "A well-maintained 1 Kanal house available on rent in the heart of DHA Phase 6, Lahore.",
  descriptionParagraphs: [
    "A well-maintained 1 Kanal house available on rent in the heart of DHA Phase 6, Lahore.",
    "The house has been recently repainted and is offered semi-furnished, so a family can move in with minimal setup.",
    "Rent is payable monthly with a standard two-month security deposit, and maintenance of the lawn is included.",
  ],
  highlights: [
    "Available for immediate possession",
    "Spacious bedrooms with attached bathrooms",
    "Recently repainted throughout",
    "Beautifully designed TV lounge and drawing room",
    "Lush green lawn with maintenance included",
    "Servant quarter with independent entrance",
  ],
};
