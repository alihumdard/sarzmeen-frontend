"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Messenger from "@/components/messages/Messenger";

/**
 * The buyer's side of messaging: replies from the agent or agency they
 * asked about a property.
 */
export default function MessagesPage() {
  const { user, loading } = useAuth();

  return (
    <main className="bg-surface py-10 sm:py-14">
      <div className="container-page">
        <div className="mx-auto max-w-[1000px]">
          <div className="mb-6">
            <h1 className="text-[24px] font-bold text-heading sm:text-[28px]">
              Messages
            </h1>
            <p className="mt-1 text-[13px] text-muted">
              Your conversations with agents, agencies and the Sarzameen team.
            </p>
          </div>

          {loading ? (
            <p className="rounded-xl border border-border bg-white py-16 text-center text-[13px] text-muted">
              Loading...
            </p>
          ) : !user ? (
            <div className="rounded-xl border border-border bg-white py-16 text-center">
              <p className="text-[14px] font-bold text-heading">Please log in</p>
              <p className="mx-auto mt-1 max-w-[380px] text-[13px] text-muted">
                Log in to read and reply to your messages.
              </p>
              <Link
                href="/login"
                className="mt-5 inline-flex h-11 items-center rounded-full bg-primary px-7 text-[13px] font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Log in
              </Link>
            </div>
          ) : (
            <Messenger />
          )}
        </div>
      </div>
    </main>
  );
}
