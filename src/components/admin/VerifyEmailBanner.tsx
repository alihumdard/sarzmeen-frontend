"use client";

import { useState } from "react";
import { api } from "@/lib/api/client";

/**
 * A way back for anyone whose verification mail never arrived.
 *
 * Registration does send one, but nothing in the panel said the address was
 * still unverified or offered another copy — so an agent who missed the mail
 * had no route forward at all.
 */
export default function VerifyEmailBanner() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">(
    "idle",
  );

  async function resend() {
    setState("sending");
    try {
      await api("/email/verification-notification", { method: "POST" });
      setState("sent");
    } catch {
      setState("failed");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 bg-sky-50 px-4 py-3 text-sky-900 sm:px-6">
      <svg
        className="h-4 w-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>

      <p className="text-[12px] leading-relaxed">
        <span className="font-semibold">Your email is not verified yet.</span>{" "}
        {state === "sent"
          ? "A fresh link is on its way — check your inbox and spam folder."
          : "Open the link we emailed you to confirm this address."}
      </p>

      {state !== "sent" && (
        <button
          type="button"
          onClick={resend}
          disabled={state === "sending"}
          className="rounded-md border border-sky-300 bg-white px-3 py-1 text-[11.5px] font-semibold text-sky-800 transition-colors hover:bg-sky-100 disabled:opacity-50"
        >
          {state === "sending" ? "Sending..." : "Send it again"}
        </button>
      )}

      {state === "failed" && (
        <span className="text-[11.5px] font-medium text-red-700">
          Could not send it — please try again shortly.
        </span>
      )}
    </div>
  );
}
