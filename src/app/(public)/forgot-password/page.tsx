import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import RedirectIfAuthenticated from "@/components/auth/RedirectIfAuthenticated";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Send yourself a link to set a new password for your Sarzameen.com account.",
};

/** Plain centered auth page, matching login and register. */
export default function ForgotPasswordPage() {
  return (
    <>
      <RedirectIfAuthenticated />

      <main className="bg-surface py-10 sm:py-14">
        <div className="container-page">
          <div className="mx-auto max-w-[560px]">
            <div className="text-center">
              <p className="text-[13px] font-bold uppercase tracking-wide text-primary">
                Account Recovery
              </p>

              <h1 className="mt-2 text-[26px] font-bold text-heading sm:text-[30px]">
                Forgot Your Password?
              </h1>
            </div>

            <div className="mt-8 rounded-xl border border-border bg-white p-6 shadow-[0_4px_24px_rgba(15,35,28,0.06)] sm:p-9">
              <ForgotPasswordForm />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
