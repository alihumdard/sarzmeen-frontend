/**
 * FAQ shapes for the admin's content management screen.
 *
 * Mirrors the Laravel API's expected response so swapping the mock source
 * for real requests does not require touching the components.
 */

export type FaqStatus = "published" | "hidden";

export type Faq = {
  id: string;
  question: string;
  answer: string;
  /** Groups related questions, e.g. "Buying", "Selling", "Support". */
  category: string;
  status: FaqStatus;
  /** Display order on the public page — lower shows first. */
  order: number;
  /** ISO date the record was created. */
  createdAt: string;
};

/** Fields the create/edit form submits — the server owns the rest. */
export type FaqInput = {
  question: string;
  answer: string;
  category: string;
  status: FaqStatus;
  order: number;
};
