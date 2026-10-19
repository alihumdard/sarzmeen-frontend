"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Sends a signed-in visitor away from the login and register pages.
 *
 * Without this, following a bookmark or the header's Login link while already
 * signed in showed the form again — asking for credentials the session
 * already has.
 *
 * Destination matches what LoginForm does after a successful sign-in: a plain
 * user has no admin panel, so they go to the public site.
 */
export default function RedirectIfAuthenticated() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // `loading` is true until the session check resolves; redirecting before
    // then would bounce a signed-out visitor who is simply still waiting.
    if (loading || !user) return;

    router.replace(user.role === "user" ? "/" : "/admin");
  }, [user, loading, router]);

  return null;
}
