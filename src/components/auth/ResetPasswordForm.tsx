"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthField from "@/components/auth/AuthField";
import { api } from "@/lib/api/client";

/**
 * Sets a new password from the emailed link.
 *
 * The token and address ride in the query string, which is how Laravel's
 * reset mail is built, so the form only asks for the new password.
 */
export default function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();

  const token = params.get("token") ?? "";
  const email = params.get("email") ?? "";

  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("password_confirmation") ?? "");

    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      await api("/reset-password", {
        method: "POST",
        body: {
          token,
          email,
          password,
          password_confirmation: confirm,
        },
      });

      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: unknown) {
      const e = err as Error & { errors?: Record<string, string[]> };
      const first = e.errors ? Object.values(e.errors).flat()[0] : null;
      setError(first || e.message || "Could not set the new password.");
    } finally {
      setBusy(false);
    }
  }

  if (!token || !email) {
    return (
      <div className="text-center">
        <h2 className="text-[16px] font-bold text-heading">
          This link is not complete
        </h2>
        <p className="mx-auto mt-2 max-w-[380px] text-[13px] leading-relaxed text-muted">
          Open the link from the email exactly as it was sent, or ask for a
          new one.
        </p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-7 text-[13px] font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Send a new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <h2 className="text-[16px] font-bold text-heading">
          Your password is set
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Taking you to the login page...
        </p>
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
        Setting a new password for <strong>{email}</strong>.
      </p>

      <AuthField
        label="New Password"
        name="password"
        type="password"
        icon="lock"
        placeholder="At least 8 characters"
        autoComplete="new-password"
        required
      />

      <AuthField
        label="Confirm New Password"
        name="password_confirmation"
        type="password"
        icon="lock"
        placeholder="Type it again"
        autoComplete="new-password"
        required
      />

      <button
        type="submit"
        disabled={busy}
        className="mt-1 flex items-center justify-center gap-2.5 rounded-full bg-primary py-[13px] text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark disabled:opacity-60"
      >
        {busy ? "Saving..." : "Set new password"}
      </button>
    </form>
  );
}
