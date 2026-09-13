"use client";

import { useState } from "react";
import { EnvelopeIcon } from "@/components/ui/Icons";

/**
 * Newsletter sign-up in the blog sidebar.
 *
 * V1 only acknowledges the submission — there is no endpoint to post to yet,
 * so the address is not sent anywhere.
 */
export default function NewsletterBox() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="rounded-lg bg-primary p-5 text-white">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/15">
          <EnvelopeIcon className="h-[18px] w-[18px]" />
        </span>

        <div className="min-w-0">
          <h2 className="text-[14px] font-bold leading-snug">
            Subscribe to our Newsletter
          </h2>
          <p className="mt-1.5 text-[11px] leading-relaxed text-white/80">
            Get the latest property updates and blog articles.
          </p>
        </div>
      </div>

      {submitted ? (
        <p
          role="status"
          className="mt-4 rounded-md bg-white/15 px-3 py-3 text-center text-[12px] font-medium"
        >
          Thanks for subscribing!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            placeholder="Enter your email address"
            className="w-full rounded-md border border-white/25 bg-white/10 px-3 py-2.5 text-[12px] text-white outline-none transition-colors placeholder:text-white/60 focus:border-white/60"
          />

          <button
            type="submit"
            className="mt-3 w-full rounded-md bg-white py-2.5 text-[12px] font-semibold text-primary transition-colors hover:bg-primary-light"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}
