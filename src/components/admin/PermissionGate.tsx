"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { canAny } from "@/lib/permissions";

type Props = {
  /** The user needs at least one of these to see the page. */
  anyPermission: string[];
  children: React.ReactNode;
};

/**
 * Blocks an admin page when the role lacks the permission.
 *
 * The API enforces the same names, so this exists to show a clear message
 * instead of a screen of failed requests.
 */
export default function PermissionGate({ anyPermission, children }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!canAny(user, anyPermission)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-500">
            <svg
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h2 className="text-[17px] font-bold text-gray-900">
            You do not have access
          </h2>
          <p className="mt-2 text-[13px] leading-6 text-gray-500">
            Your role does not include the permission needed for this section.
            An administrator can grant it under Roles &amp; Permissions.
          </p>

          <Link
            href="/admin"
            className="mt-5 inline-flex h-9 items-center rounded-md bg-primary px-5 text-[12px] font-semibold text-white hover:opacity-90"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
