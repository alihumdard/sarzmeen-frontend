import { api } from "./client";

export type InquiryInput = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  propertyId?: number | string;
  projectId?: number | string;
};

type FieldErrors = Record<string, string[]>;

export class InquiryError extends Error {
  readonly fields: FieldErrors;

  constructor(message: string, fields: FieldErrors = {}) {
    super(message);
    this.name = "InquiryError";
    this.fields = fields;
  }
}

/**
 * Submits a public inquiry. Validation failures from the API are rethrown as
 * InquiryError so forms can surface per-field messages instead of a generic one.
 */
export async function submitInquiry(input: InquiryInput): Promise<void> {
  try {
    await api("/inquiries", {
      method: "POST",
      body: input as unknown as Record<string, unknown>,
    });
  } catch (err: unknown) {
    const e = err as { message?: string; errors?: FieldErrors; status?: number };

    if (e.status === 422 && e.errors) {
      const first = Object.values(e.errors)[0]?.[0];
      throw new InquiryError(first ?? "Please check the form and try again.", e.errors);
    }

    throw new InquiryError(
      e.message ?? "Something went wrong. Please try again.",
    );
  }
}
