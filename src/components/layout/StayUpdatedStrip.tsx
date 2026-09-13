"use client";

import { useState } from "react";
import { EnvelopeIcon } from "@/components/ui/Icons";

type StayUpdatedStripProps = {
  /**
   * "light" — pale green panel (blog listing).
   * "dark" — solid brand green panel (about page).
   */
  theme?: "light" | "dark";
  /** Background colour behind the panel, matching the section above it. */
  background?: "surface" | "white";
};

/**
 * Wide newsletter strip used at the foot of the inner pages.
 *
 * V1 only acknowledges the submission — there is no endpoint to post to yet,
 * so the address is not sent anywhere.
 */
export default function StayUpdatedStrip({
  theme = "light",
  background = "surface",
}: StayUpdatedStripProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  const isDark = theme === "dark";

  const styles = isDark
    ? {
        panel: "bg-primary",
        skyline: "text-white/10",
        iconBox: "bg-white/15 text-white",
        heading: "text-white",
        body: "text-white/80",
        input:
          "border-white/25 bg-white text-heading placeholder:text-muted focus:border-white",
        button: "bg-[#22A24C] text-white hover:bg-primary-dark",
        confirmation: "bg-white/15 text-white",
      }
    : {
        panel: "bg-primary-light",
        skyline: "text-primary/10",
        iconBox: "bg-primary text-white",
        heading: "text-heading",
        body: "text-text",
        input:
          "border-border bg-white text-heading placeholder:text-muted focus:border-primary",
        button: "bg-primary text-white hover:bg-primary-dark",
        confirmation: "bg-primary text-white",
      };

  return (
    <section className={background === "white" ? "bg-white pb-12" : "bg-surface pb-12"}>
      <div className="container-page">
        <div
          className={`relative isolate overflow-hidden rounded-lg px-6 py-7 sm:px-8 ${styles.panel}`}
        >
          {/* Faint skyline sitting behind the copy on the right. */}
          <svg
            viewBox="0 0 420 120"
            aria-hidden="true"
            className={`pointer-events-none absolute -right-4 bottom-0 -z-10 hidden h-full w-[420px] lg:block ${styles.skyline}`}
            fill="currentColor"
          >
            <rect x="10" y="62" width="34" height="58" />
            <rect x="52" y="40" width="28" height="80" />
            <rect x="88" y="72" width="30" height="48" />
            <rect x="126" y="28" width="32" height="92" />
            <rect x="166" y="58" width="26" height="62" />
            <rect x="200" y="44" width="34" height="76" />
            <rect x="242" y="68" width="28" height="52" />
            <rect x="278" y="34" width="30" height="86" />
            <rect x="316" y="60" width="32" height="60" />
            <rect x="356" y="48" width="28" height="72" />
          </svg>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${styles.iconBox}`}
              >
                <EnvelopeIcon className="h-5 w-5" />
              </span>

              <div className="min-w-0">
                <h2 className={`text-[17px] font-bold ${styles.heading}`}>
                  Stay Updated with Sarzameen
                </h2>
                <p className={`mt-1 text-[12px] leading-relaxed ${styles.body}`}>
                  Subscribe to get the latest property updates, market insights
                  and exclusive deals.
                </p>
              </div>
            </div>

            {submitted ? (
              <p
                role="status"
                className={`shrink-0 rounded-md px-6 py-3 text-center text-[12px] font-semibold ${styles.confirmation}`}
              >
                Thanks for subscribing!
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex w-full shrink-0 flex-col gap-3 sm:flex-row lg:w-auto"
              >
                <label htmlFor="stay-updated-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="stay-updated-email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email address"
                  className={`min-w-0 rounded-md border px-4 py-2.5 text-[12px] outline-none transition-colors sm:w-[230px] ${styles.input}`}
                />

                <button
                  type="submit"
                  className={`shrink-0 rounded-md px-6 py-2.5 text-[12px] font-semibold transition-colors ${styles.button}`}
                >
                  Subscribe Now
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
