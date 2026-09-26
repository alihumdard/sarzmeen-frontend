import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create a Sarzameen.com account as a user, agent or agency — save properties, list them, or register your firm and manage your team.",
};

/**
 * Register page.
 *
 * Plain centered auth page, matching the login page.
 */
export default function RegisterPage() {
  return (
    <main className="bg-surface py-10 sm:py-14">
      <div className="container-page">
        <div className="mx-auto max-w-[720px]">
          <div className="text-center">
            <p className="text-[13px] font-bold uppercase tracking-wide text-primary">
              Get Started
            </p>

            <h1 className="mt-2 text-[26px] font-bold text-heading sm:text-[30px]">
              Create Your Account
            </h1>

            <p className="mx-auto mt-3 max-w-[460px] text-[13px] leading-relaxed text-muted">
              Register as a buyer, an agent, or an agency — list properties,
              manage your team and reach thousands of buyers.
            </p>
          </div>

          <div className="mt-8 rounded-xl border border-border bg-white p-6 shadow-[0_4px_24px_rgba(15,35,28,0.06)] sm:p-9">
            <RegisterForm />
          </div>
        </div>
      </div>
    </main>
  );
}
