import { testimonials as publicTestimonials } from "@/constants/mockTestimonials";
import type {
  AdminTestimonial,
  TestimonialInput,
} from "@/types/testimonial";

/**
 * Testimonial API.
 *
 * This is the only file that knows where testimonials come from. Each
 * function is async and returns what the Laravel endpoint is expected to
 * return, so wiring the real backend means replacing the body of each
 * function with a `fetch` — the page and modal calling them do not change.
 *
 *   listTestimonials()        GET    /api/testimonials
 *   createTestimonial(input)  POST   /api/testimonials
 *   updateTestimonial(id, …)  PUT    /api/testimonials/{id}
 *   deleteTestimonial(id)     DELETE /api/testimonials/{id}
 *
 * Seeded from the same reviews shown on the public home page, so the admin
 * list and what visitors see start in sync.
 */

const seed: AdminTestimonial[] = publicTestimonials.map((review, index) => ({
  id: review.id,
  name: review.name,
  city: review.city,
  avatar: review.avatar,
  rating: review.rating,
  purchase: review.purchase,
  quote: review.quote,
  status: "published",
  featured: index < 2,
  createdAt: "2026-04-01",
}));

/** Stands in for the database until the API exists. */
let testimonials: AdminTestimonial[] = [...seed];

/** Simulates request latency so loading states are exercised. */
const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listTestimonials(): Promise<AdminTestimonial[]> {
  await delay();
  return [...testimonials];
}

export async function createTestimonial(
  input: TestimonialInput,
): Promise<AdminTestimonial> {
  await delay();

  const created: AdminTestimonial = {
    ...input,
    id: `t-${Date.now()}`,
    createdAt: new Date().toISOString().slice(0, 10),
  };

  testimonials = [created, ...testimonials];
  return created;
}

export async function updateTestimonial(
  id: string,
  input: TestimonialInput,
): Promise<AdminTestimonial> {
  await delay();

  const existing = testimonials.find((item) => item.id === id);
  if (!existing) throw new Error(`Testimonial not found: ${id}`);

  const updated: AdminTestimonial = { ...existing, ...input };
  testimonials = testimonials.map((item) => (item.id === id ? updated : item));
  return updated;
}

export async function deleteTestimonial(id: string): Promise<void> {
  await delay();
  testimonials = testimonials.filter((item) => item.id !== id);
}
