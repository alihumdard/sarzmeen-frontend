import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Log in to your Sarzameen.com account to access saved properties, inquiries and property alerts.",
};

/** Plain centered auth page, matching the register page. */
export default function LoginPage() {
  return (
    <main className="bg-surface py-10 sm:py-14">
      <div className="container-page">
        <div className="mx-auto max-w-[720px]">
          <div className="text-center">
            <p className="text-[13px] font-bold uppercase tracking-wide text-primary">
              Welcome Back
            </p>

            <h1 className="mt-2 text-[26px] font-bold text-heading sm:text-[30px]">
              Login to Your Account
            </h1>

            <p className="mx-auto mt-3 max-w-[460px] text-[13px] leading-relaxed text-muted">
              Access your saved properties, inquiries, alerts and much more.
            </p>
          </div>

          <div className="mt-8 rounded-xl border border-border bg-white p-6 shadow-[0_4px_24px_rgba(15,35,28,0.06)] sm:p-9">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
