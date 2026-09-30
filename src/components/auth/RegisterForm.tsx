"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthField from "@/components/auth/AuthField";
import RoleSelect from "@/components/auth/RoleSelect";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";
import { UserPlusIcon } from "@/components/ui/Icons";
import { useAuth } from "@/context/AuthContext";

export default function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setBusy(true);

    const form = new FormData(e.currentTarget);

    try {
      await register({
        name: form.get("fullName") as string,
        email: form.get("email") as string,
        phone: (form.get("phone") as string) || undefined,
        password: form.get("newPassword") as string,
        password_confirmation: form.get("confirmPassword") as string,
        role: form.get("role") as string,
        agencyName: (form.get("agencyName") as string) || undefined,
      });
      router.push("/admin");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "errors" in err) {
        setFieldErrors(
          (err as { errors: Record<string, string[]> }).errors ?? {},
        );
      }
      const msg =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  const firstError = Object.values(fieldErrors).flat()[0];

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {(error || firstError) && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            {firstError ?? error}
          </div>
        )}

        <RoleSelect />

        <div className="grid gap-5 sm:grid-cols-2">
          <AuthField
            label="Full Name"
            name="fullName"
            type="text"
            placeholder="Enter your full name"
            icon="user"
            autoComplete="name"
            required
          />

          <AuthField
            label="Email Address"
            name="email"
            type="email"
            placeholder="Enter your email"
            icon="email"
            autoComplete="email"
            required
          />
        </div>

        <AuthField
          label="Phone Number"
          name="phone"
          type="tel"
          placeholder="03XX-XXXXXXX"
          icon="phone"
          autoComplete="tel"
          required
        />

        <AuthField
          label="Password"
          name="newPassword"
          type="password"
          placeholder="Create a password"
          icon="lock"
          autoComplete="new-password"
          required
        />

        <AuthField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          icon="lock"
          autoComplete="new-password"
          required
        />

        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            name="terms"
            required
            className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer accent-[var(--color-primary)]"
          />
          <span className="text-[12px] leading-relaxed text-text">
            I agree to the{" "}
            <Link
              href="/terms"
              className="font-semibold text-primary hover:underline"
            >
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-semibold text-primary hover:underline"
            >
              Privacy Policy
            </Link>
          </span>
        </label>

        <button
          type="submit"
          disabled={busy}
          className="mt-1 flex items-center justify-center gap-2.5 rounded-full bg-primary py-[13px] text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          <UserPlusIcon className="h-[18px] w-[18px] text-white" />
          {busy ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="mt-7">
        <SocialAuthButtons action="Sign up" />
      </div>

      <p className="mt-7 border-t border-border pt-6 text-center text-[13px] text-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
