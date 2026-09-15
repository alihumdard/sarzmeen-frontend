"use client";

import { useState } from "react";
import Dropdown from "@/components/ui/Dropdown";
import { SendIcon } from "@/components/ui/Icons";

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

/** "Send Us a Message" form on the Contact page. */
export default function ContactForm() {
  const [interest, setInterest] = useState("");

  return (
    <form className="mt-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel htmlFor="name">Your Name</FieldLabel>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your Name"
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
          className={`${fieldClasses} resize-y`}
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-[13px] font-semibold text-white shadow-[0_10px_22px_rgba(31,122,77,0.24)] transition-colors hover:bg-primary-dark"
      >
        <SendIcon className="h-4 w-4" />
        Send Message
      </button>
    </form>
  );
}
