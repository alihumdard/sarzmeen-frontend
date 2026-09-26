import Link from "next/link";
import AuthField from "@/components/auth/AuthField";
import RoleSelect from "@/components/auth/RoleSelect";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";
import { UserPlusIcon } from "@/components/ui/Icons";

/**
 * Sign-up half of the auth page.
 *
 * V1 renders the form only — there is no endpoint to submit to until the
 * Laravel API is in place.
 */
export default function RegisterForm() {
  return (
    <div className="flex flex-col">
      <form className="flex flex-col gap-5">
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
          className="mt-1 flex items-center justify-center gap-2.5 rounded-full bg-primary py-[13px] text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
        >
          <UserPlusIcon className="h-[18px] w-[18px] text-white" />
          Create Account
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
