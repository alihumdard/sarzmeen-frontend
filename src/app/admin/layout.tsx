"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminFooter from "@/components/admin/AdminFooter";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminBottomNav from "@/components/admin/AdminBottomNav";
import AdminHelpFloating from "@/components/admin/AdminHelpFloating";
import { useAuth } from "@/context/AuthContext";

/**
 * Every `user` role starts with these 4 self-service permissions, which are
 * not admin-panel access. More than that means something was granted.
 */
const ALWAYS_GRANTED = 4;

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Desktop collapse is separate from the mobile drawer: the same button
  // drives whichever one the current screen width is showing.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Redirects belong in an effect: navigating during render makes React warn
  // about updating Router while rendering AdminLayout.
  /*
   * Admin, agency and agent always have a panel. A plain `user` only gets in
   * when a permission was granted to their role, so permissions alone can
   * open the panel without changing anyone's role.
   */
  const mayEnter =
    !!user &&
    (user.role !== "user" || (user.permissions ?? []).length > ALWAYS_GRANTED);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else if (!mayEnter) {
      router.replace("/");
    }
  }, [loading, user, mayEnter, router]);

  if (loading || !user || !mayEnter) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8fa]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (user.status !== "approved" && user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-4">
        <div className="max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-500">
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Account Pending</h2>
          <p className="mt-2 text-sm text-gray-500">
            Your account is currently <span className="font-medium text-amber-600">{user.status}</span>. An admin will review and approve your account shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <AdminSidebar
        mobileOpen={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
      />

      <div
        className={[
          "flex min-h-screen flex-col transition-[padding] duration-300",
          sidebarCollapsed ? "lg:pl-0" : "lg:pl-[260px]",
        ].join(" ")}
      >
        <AdminTopbar
          onMenuClick={() => {
            // Below lg the drawer slides in; at lg and above the fixed
            // sidebar collapses instead.
            if (window.matchMedia("(min-width: 1024px)").matches) {
              setSidebarCollapsed((c) => !c);
            } else {
              setSidebarOpen(true);
            }
          }}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-7">
          {children}
        </main>

        <AdminFooter />

        {/* Clears the fixed bottom bar so the footer is never under it. */}
        <div className="h-[72px] lg:hidden" aria-hidden="true" />
      </div>

      <AdminBottomNav />

      <AdminHelpFloating />
    </div>
  );
}
