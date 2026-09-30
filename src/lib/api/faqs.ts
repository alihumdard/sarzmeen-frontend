import type { Faq, FaqInput } from "@/types/faq";
import { api } from "./client";

export async function listFaqs(): Promise<Faq[]> {
  const res = await api<{ data: Faq[] }>("/admin/faqs");
  return res.data;
}

export async function createFaq(input: FaqInput): Promise<Faq> {
  const res = await api<{ data: Faq }>("/admin/faqs", {
    method: "POST",
    body: input as unknown as Record<string, unknown>,
  });
  return res.data;
}

export async function updateFaq(id: string, input: FaqInput): Promise<Faq> {
  const res = await api<{ data: Faq }>(`/admin/faqs/${id}`, {
    method: "PUT",
    body: input as unknown as Record<string, unknown>,
  });
  return res.data;
}

export async function deleteFaq(id: string): Promise<void> {
  await api(`/admin/faqs/${id}`, { method: "DELETE" });
}
