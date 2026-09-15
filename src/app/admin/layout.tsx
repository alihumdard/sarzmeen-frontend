"use client";

import { useState } from "react";
import AdminFooter from "@/components/admin/AdminFooter";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminHelpFloating from "@/components/admin/AdminHelpFloating";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <AdminSidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-h-screen flex-col lg:pl-[260px]">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-7">
          {children}
        </main>

        <AdminFooter />
      </div>

      <AdminHelpFloating />
    </div>
  );
}