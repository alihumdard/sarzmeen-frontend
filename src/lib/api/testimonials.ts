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

function buildFormData(input: TestimonialInput): FormData {
  const fd = new FormData();
  fd.append("name", input.name);
  fd.append("city", input.city);
  fd.append("avatar", input.avatar);
  fd.append("rating", String(input.rating));
  fd.append("purchase", input.purchase);
  fd.append("quote", input.quote);
  fd.append("status", input.status);
  fd.append("featured", input.featured ? "1" : "0");
  if (input.avatarFile) {
    fd.append("avatarFile", input.avatarFile);
  }
  return fd;
}

export async function createTestimonial(
  input: TestimonialInput,
): Promise<AdminTestimonial> {
  const res = await api<{ data: AdminTestimonial }>("/admin/testimonials", {
    method: "POST",
    body: buildFormData(input),
  });
  return res.data;
}

export async function updateTestimonial(
  id: string,
  input: TestimonialInput,
): Promise<AdminTestimonial> {
  const fd = buildFormData(input);
  fd.append("_method", "PUT");
  const res = await api<{ data: AdminTestimonial }>(
    `/admin/testimonials/${id}`,
    {
      method: "POST",
      body: fd,
    },
  );
  return res.data;
}

export async function deleteTestimonial(id: string): Promise<void> {
  await api(`/admin/testimonials/${id}`, { method: "DELETE" });
}
