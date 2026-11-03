"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import MyReports from "@/components/reports/MyReports";

export default function MyReportsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Report to Admin"
        description="Report a problem, request a change to your profile or listings, or suggest an improvement."
        breadcrumbs={[{ label: "Report to Admin" }]}
      />

      <MyReports />
    </div>
  );
}
