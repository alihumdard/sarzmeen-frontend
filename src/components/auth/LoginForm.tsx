"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthField from "@/components/auth/AuthField";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";
import { LoginArrowIcon, ShieldLockIcon } from "@/components/ui/Icons";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("identifier") as string;
    const password = form.get("password") as string;

    try {
      await login(email, password);
      router.push("/admin");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            {error}
          </div>
        )}

        <AuthField
          label="Email Address or Phone Number"
          name="identifier"
          type="text"
          placeholder="Enter your email or phone number"
          icon="user"
          autoComplete="username"
          required
        />

        <div>
          <AuthField
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            icon="lock"
            autoComplete="current-password"
            required
          />

          <div className="mt-2 flex justify-end">
            <Link
              href="/forgot-password"
              className="text-[11px] font-semibold text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            name="remember"
            className="h-3.5 w-3.5 cursor-pointer accent-[var(--color-primary)]"
          />
          <span className="text-[12px] text-text">Remember Me</span>
        </label>

        <button
          type="submit"
          disabled={busy}
          className="mt-1 flex items-center justify-center gap-2.5 rounded-full bg-primary py-[13px] text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          <LoginArrowIcon className="h-[18px] w-[18px] text-white" />
          {busy ? "Signing in..." : "Login"}
        </button>
      </form>

      <div className="mt-7">
        <SocialAuthButtons action="Sign in" />
      </div>

      <p className="mt-6 flex items-start justify-center gap-2 text-center text-[11px] leading-relaxed text-muted">
        <ShieldLockIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span className="max-w-[280px]">
          Your data is secure with us and will never be shared with third
          parties.
        </span>
      </p>

      <p className="mt-6 border-t border-border pt-6 text-center text-[13px] text-muted">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
