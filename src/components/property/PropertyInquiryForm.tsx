"use client";

import { FormEvent, useState } from "react";
import { SendIcon } from "@/components/ui/Icons";
import { submitInquiry, InquiryError } from "@/lib/api/inquiries";

type Props = {
  propertyId?: number | string;
  projectId?: number | string;
  /** Shown in the default message so the agent knows what the lead is about. */
  title?: string;
  heading?: string;
};

const fieldClasses =
  "w-full rounded-md border border-border bg-white px-3.5 py-2.5 text-[13px] text-heading outline-none transition-colors placeholder:text-muted focus:border-primary";

export default function PropertyInquiryForm({
  propertyId,
  projectId,
  title,
  heading = "Request Information",
}: Props) {
  const defaultMessage = title
    ? `I am interested in "${title}". Please share more details.`
    : "I am interested in this listing. Please share more details.";

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Captured before awaiting — React nulls currentTarget after the await.
    const form = event.currentTarget;
    const fd = new FormData(form);

    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setError("Please fill in your name, email and message.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await submitInquiry({
        name,
        email,
        phone: phone || undefined,
        message,
        propertyId,
        projectId,
      });
      form.reset();
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof InquiryError
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-center">
        <p className="text-[14px] font-bold text-emerald-700">Inquiry sent</p>
        <p className="mt-1 text-[12px] leading-5 text-emerald-600">
          Our agent will contact you shortly.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-3 text-[12px] font-semibold text-primary hover:underline"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-white p-5">
      <h2 className="text-[15px] font-bold text-heading">{heading}</h2>
      <p className="mt-1 text-[11px] text-muted">
        Fill the form and our agent will get back to you.
      </p>

      <form className="mt-4 space-y-3" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="inq-name" className="sr-only">
            Your name
          </label>
          <input
            id="inq-name"
            name="name"
            type="text"
            required
            placeholder="Your name *"
            className={fieldClasses}
          />
        </div>

        <div>
          <label htmlFor="inq-email" className="sr-only">
            Your email
          </label>
          <input
            id="inq-email"
            name="email"
            type="email"
            required
            placeholder="Your email *"
            className={fieldClasses}
          />
        </div>

        <div>
          <label htmlFor="inq-phone" className="sr-only">
            Your phone
          </label>
          <input
            id="inq-phone"
            name="phone"
            type="tel"
            placeholder="Your phone"
            className={fieldClasses}
          />
        </div>

        <div>
          <label htmlFor="inq-message" className="sr-only">
            Message
          </label>
          <textarea
            id="inq-message"
            name="message"
            rows={4}
            required
            defaultValue={defaultMessage}
            className={`${fieldClasses} resize-none`}
          />
        </div>

        {error && (
          <p role="alert" className="text-[12px] font-medium text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-[13px] font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {submitting ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Sending...
            </>
          ) : (
            <>
              <SendIcon className="h-4 w-4" />
              Send Inquiry
            </>
          )}
        </button>
      </form>
    </div>
  );
}
