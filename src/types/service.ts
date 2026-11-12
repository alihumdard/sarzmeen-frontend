/**
 * Service shapes for the public Services page and the admin screen that
 * manages it. Mirrors the Laravel API's response.
 */

export type ServiceStatus = "published" | "hidden";

/** The icon keys the shared icon library can render. */
export const SERVICE_ICONS = [
  "handshake",
  "document",
  "search",
  "globe",
  "camera",
  "chart",
] as const;

export type ServiceIcon = (typeof SERVICE_ICONS)[number];

/**
 * How much of a summary the hero shows before clipping it.
 *
 * Measured against the banner itself: on a phone this is three lines of
 * the hero's 14px type, which sits over the photograph without burying
 * it. Past it the text runs to four lines and crowds the image. The admin
 * form counts against the same number, so what it warns about and what
 * the page does cannot drift apart.
 */
export const SUMMARY_HERO_LIMIT = 170;

export type Service = {
  id: string;
  slug: string;
  title: string;
  /** One-line result, printed above the title on the card. */
  outcome: string;
  /** The short line, printed in the hero and above the points. */
  summary: string;
  /** The fuller account for the service's own page; falls back to summary. */
  description?: string | null;
  /** What the client actually receives. */
  points: string[];
  icon: ServiceIcon;
  status: ServiceStatus;
  /** The few led with, which take a wider card at the top of the grid. */
  featured: boolean;
  /** Hand-set order, so the client can arrange the grid. */
  position: number;
};

/** Fields the create/edit form submits — the server owns the rest. */
export type ServiceInput = {
  slug: string;
  title: string;
  outcome: string;
  summary: string;
  description: string;
  points: string[];
  icon: ServiceIcon;
  status: ServiceStatus;
  featured: boolean;
  position: number;
};
