"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Messenger from "@/components/messages/Messenger";

export default function AdminMessagesPage() {
  return (
    <div>
      <AdminPageHeader
        title="Messages"
        description="Direct messages with agents, agencies and buyers."
        breadcrumbs={[{ label: "Messages" }]}
      />

      <Messenger />
    </div>
  );
}
