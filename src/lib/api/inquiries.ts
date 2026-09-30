import { api } from "./client";

type InquiryInput = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  propertyId?: number;
  projectId?: number;
};

export async function submitInquiry(input: InquiryInput): Promise<void> {
  await api("/inquiries", {
    method: "POST",
    body: input as unknown as Record<string, unknown>,
  });
}
