import Link from "next/link";
import AuthField from "@/components/auth/AuthField";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";
import { LoginArrowIcon, ShieldLockIcon } from "@/components/ui/Icons";

/**
 * Sign-in half of the auth page.
 *
 * V1 renders the form only — there is no endpoint to submit to until the
 * Laravel API and Sanctum session handling are in place.
 */
export default function LoginForm() {
  return (
    <div className="flex flex-col">
      <div className="text-center">
        <h2 className="text-[19px] font-bold text-heading">
          Login to Your Account
        </h2>
        <p className="mt-2 text-[12px] text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>

      <form className="mt-7 flex flex-col gap-5">
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
          className="flex items-center justify-center gap-2.5 rounded-md bg-primary py-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <LoginArrowIcon className="h-[18px] w-[18px] text-white" />
          Login
        </button>
      </form>

      <div className="mt-7">
        <SocialAuthButtons action="Sign in" />
      </div>

      <p className="mt-7 flex items-start justify-center gap-2 text-center text-[11px] leading-relaxed text-muted">
        <ShieldLockIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span className="max-w-[280px]">
          Your data is secure with us and will never be shared with third
          parties.
        </span>
      </p>
    </div>
  );
}
