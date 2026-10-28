import { Suspense } from "react";
import type { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Set a New Password",
  description: "Choose a new password for your Sarzameen.com account.",
};

export default function ResetPasswordPage() {
  return (
    <main className="bg-surface py-10 sm:py-14">
      <div className="container-page">
        <div className="mx-auto max-w-[560px]">
          <div className="text-center">
            <p className="text-[13px] font-bold uppercase tracking-wide text-primary">
              Account Recovery
            </p>

            <h1 className="mt-2 text-[26px] font-bold text-heading sm:text-[30px]">
              Set a New Password
            </h1>
          </div>

          <div className="mt-8 rounded-xl border border-border bg-white p-6 shadow-[0_4px_24px_rgba(15,35,28,0.06)] sm:p-9">
            {/* The form reads the token from the query string. */}
            <Suspense
              fallback={
                <p className="text-center text-[13px] text-muted">Loading...</p>
              }
            >
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
