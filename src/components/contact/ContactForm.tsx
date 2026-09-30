"use client";

import { FormEvent, useState } from "react";
import Dropdown from "@/components/ui/Dropdown";
import { SendIcon } from "@/components/ui/Icons";
import { submitInquiry } from "@/lib/api/inquiries";

const interestOptions = [
  { label: "Buying a property", value: "buying" },
  { label: "Selling a property", value: "selling" },
  { label: "Project investment", value: "investment" },
  { label: "General support", value: "support" },
];

const fieldClasses =
  "w-full rounded-md border border-border bg-white px-4 py-3 text-[13px] text-heading outline-none transition-colors placeholder:text-muted focus:border-primary";

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: string;
}) {
  return (
    <label htmlFor={htmlFor} className="text-[12px] font-semibold text-heading">
      {children}
    </label>
  );
}

export default function ContactForm() {
  const [interest, setInterest] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") as string).trim();
    const email = (fd.get("email") as string).trim();
    const phone = (fd.get("phone") as string).trim();
    const message = (fd.get("message") as string).trim();

    if (!name || !email || !message) {
      setError("Please fill in all required fields.");
      setSubmitting(false);
      return;
    }

    try {
      await submitInquiry({
        name,
        email,
        phone: phone || undefined,
        message: `[${interest || "general"}] ${message}`,
      });
      setSuccess(true);
      e.currentTarget.reset();
      setInterest("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-[15px] font-semibold text-emerald-700">
          Thank you for your message!
        </p>
        <p className="mt-1 text-[13px] text-emerald-600">
          Our team will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-4 text-[12px] font-semibold text-primary hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel htmlFor="name">Your Name</FieldLabel>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your Name"
            required
            className={fieldClasses}
          />
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="email">Your Email</FieldLabel>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Your Email"
            required
            className={fieldClasses}
          />
        </div>
      </div>

      <div className="space-y-2">
        <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="Phone Number"
          className={fieldClasses}
        />
      </div>

      <div className="space-y-2">
        <FieldLabel htmlFor="interest">I&apos;m interested in</FieldLabel>
        <Dropdown
          name="interest"
          label="I'm interested in"
          placeholder="Select an option"
          options={interestOptions}
          value={interest}
          onChange={setInterest}
          triggerClassName={fieldClasses}
        />
      </div>

      <div className="space-y-2">
        <FieldLabel htmlFor="message">Your Message</FieldLabel>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Type your message here..."
          required
          className={`${fieldClasses} resize-y`}
        />
      </div>

      {error && (
        <p className="text-[12px] font-medium text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-[13px] font-semibold text-white shadow-[0_10px_22px_rgba(31,122,77,0.24)] transition-colors hover:bg-primary-dark disabled:opacity-50"
      >
        <SendIcon className="h-4 w-4" />
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
