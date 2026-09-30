import type {
  AdminTestimonial,
  TestimonialInput,
} from "@/types/testimonial";
import { api } from "./client";

export async function listTestimonials(): Promise<AdminTestimonial[]> {
  const res = await api<{ data: AdminTestimonial[] }>(
    "/admin/testimonials",
  );
  return res.data;
}

export async function createTestimonial(
  input: TestimonialInput,
): Promise<AdminTestimonial> {
  const res = await api<{ data: AdminTestimonial }>("/admin/testimonials", {
    method: "POST",
    body: input as unknown as Record<string, unknown>,
  });
  return res.data;
}

export async function updateTestimonial(
  id: string,
  input: TestimonialInput,
): Promise<AdminTestimonial> {
  const res = await api<{ data: AdminTestimonial }>(
    `/admin/testimonials/${id}`,
    {
      method: "PUT",
      body: input as unknown as Record<string, unknown>,
    },
  );
  return res.data;
}

export async function deleteTestimonial(id: string): Promise<void> {
  await api(`/admin/testimonials/${id}`, { method: "DELETE" });
}
