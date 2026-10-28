"use client";

import { useState } from "react";
import Link from "next/link";
import AuthField from "@/components/auth/AuthField";
import { api } from "@/lib/api/client";

/**
 * Asks for the reset link.
 *
 * The login page has always offered "Forgot Password?" and the API has
 * always had the endpoint, but the page behind the link did not exist —
 * so an agent locked out had no way back in.
 */
export default function ForgotPasswordForm() {
  /* Kept only to name the address back in the confirmation. */
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const address = String(form.get("email") ?? "").trim();

    setBusy(true);
    setError("");
    setEmail(address);

    try {
      await api("/forgot-password", {
        method: "POST",
        body: { email: address },
      });
      setSent(true);
    } catch (err: unknown) {
      const e = err as Error & { errors?: Record<string, string[]> };
      const first = e.errors ? Object.values(e.errors).flat()[0] : null;
      setError(first || e.message || "Could not send the reset link.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary">
          <MailIcon />
        </span>

        <h2 className="mt-4 text-[16px] font-bold text-heading">
          Check your email
        </h2>

        <p className="mx-auto mt-2 max-w-[380px] text-[13px] leading-relaxed text-muted">
          If an account exists for <strong>{email}</strong>, a link to set a
          new password is on its way. It expires in an hour.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-7 text-[13px] font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          {error}
        </div>
      )}

      <p className="text-[13px] leading-relaxed text-muted">
        Enter the email address on your account and we will send a link to
        set a new password.
      </p>

      <AuthField
        label="Email Address"
        name="email"
        type="email"
        icon="email"
        placeholder="you@example.com"
        autoComplete="email"
        required
      />

      <button
        type="submit"
        disabled={busy}
        className="mt-1 flex items-center justify-center gap-2.5 rounded-full bg-primary py-[13px] text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark disabled:opacity-60"
      >
        {busy ? "Sending..." : "Send reset link"}
      </button>

      <p className="text-center text-[12px] text-muted">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Back to login
        </Link>
      </p>
    </form>
  );
}

function MailIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
