/**
 * Testimonial shapes for the admin's content management screen.
 *
 * Mirrors the Laravel API's expected response so swapping the mock source
 * for real requests does not require touching the components.
 */

export type TestimonialStatus = "published" | "hidden";

export type AdminTestimonial = {
  id: string;
  name: string;
  city: string;
  avatar: string;
  rating: number;
  /** What they bought/rented — shown as context above the quote. */
  purchase: string;
  quote: string;
  status: TestimonialStatus;
  /** Shown first on the home page when true. */
  featured: boolean;
  /** ISO date the review was submitted. */
  createdAt: string;
};

/** Fields the create/edit form submits — the server owns the rest. */
export type TestimonialInput = {
  name: string;
  city: string;
  avatar: string;
  rating: number;
  purchase: string;
  quote: string;
  status: TestimonialStatus;
  featured: boolean;
};
