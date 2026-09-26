import type { Faq, FaqInput } from "@/types/faq";

/**
 * FAQ API.
 *
 * This is the only file that knows where FAQs come from. Each function is
 * async and returns what the Laravel endpoint is expected to return, so
 * wiring the real backend means replacing the body of each function with a
 * `fetch` — the page and modal calling them do not change.
 *
 *   listFaqs()        GET    /api/faqs
 *   createFaq(input)   POST   /api/faqs
 *   updateFaq(id, …)   PUT    /api/faqs/{id}
 *   deleteFaq(id)      DELETE /api/faqs/{id}
 *
 * Seeded from the same questions shown on the public contact page (see
 * app/(public)/contact/page.tsx), so the admin list and what visitors see
 * start in sync.
 */

const seed: Faq[] = [
  {
    id: "faq-1",
    question: "How can I list my property on Sarzameen.com?",
    answer:
      'Create an account, go to "Add Property" and fill in your listing details. Our team reviews and publishes it within 24 hours.',
    category: "Selling",
    status: "published",
    order: 1,
    createdAt: "2026-01-10",
  },
  {
    id: "faq-2",
    question: "How long does it take to sell a property?",
    answer:
      "It varies by location and price, but verified listings on Sarzameen.com typically get inquiries within the first week.",
    category: "Selling",
    status: "published",
    order: 2,
    createdAt: "2026-01-10",
  },
  {
    id: "faq-3",
    question: "Is there any fee for listing a property?",
    answer:
      "Basic listings are free. Featured placements have a small fee — details are shown before you confirm.",
    category: "Selling",
    status: "published",
    order: 3,
    createdAt: "2026-01-10",
  },
  {
    id: "faq-4",
    question: "Do you provide property verification?",
    answer:
      "Yes, our team verifies ownership documents and listing details before a property is marked as Verified.",
    category: "Buying",
    status: "published",
    order: 4,
    createdAt: "2026-01-10",
  },
  {
    id: "faq-5",
    question: "How can I contact customer support?",
    answer:
      "Use the form on this page, call or WhatsApp us directly, or email info@sarzameen.com — we typically reply within a few hours.",
    category: "Support",
    status: "published",
    order: 5,
    createdAt: "2026-01-10",
  },
  {
    id: "faq-6",
    question: "In which cities is Sarzameen.com available?",
    answer:
      "We currently cover Lahore, Islamabad, Karachi, Rawalpindi, Faisalabad and Multan, with more cities being added regularly.",
    category: "General",
    status: "published",
    order: 6,
    createdAt: "2026-01-10",
  },
];

/** Stands in for the database until the API exists. */
let faqs: Faq[] = [...seed];

/** Simulates request latency so loading states are exercised. */
const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listFaqs(): Promise<Faq[]> {
  await delay();
  return [...faqs].sort((a, b) => a.order - b.order);
}

export async function createFaq(input: FaqInput): Promise<Faq> {
  await delay();

  const created: Faq = {
    ...input,
    id: `faq-${Date.now()}`,
    createdAt: new Date().toISOString().slice(0, 10),
  };

  faqs = [...faqs, created];
  return created;
}

export async function updateFaq(id: string, input: FaqInput): Promise<Faq> {
  await delay();

  const existing = faqs.find((faq) => faq.id === id);
  if (!existing) throw new Error(`FAQ not found: ${id}`);

  const updated: Faq = { ...existing, ...input };
  faqs = faqs.map((faq) => (faq.id === id ? updated : faq));
  return updated;
}

export async function deleteFaq(id: string): Promise<void> {
  await delay();
  faqs = faqs.filter((faq) => faq.id !== id);
}
