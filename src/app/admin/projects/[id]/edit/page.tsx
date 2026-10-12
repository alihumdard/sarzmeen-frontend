"use client";

import { useParams } from "next/navigation";
import AddProjectForm from "@/components/admin/AddProjectForm";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

export default function EditProjectPage() {
  const params = useParams();
  const projectId = String(params.id);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Project"
        description="Update the project details, units and payment plan."
        breadcrumbs={[
          { label: "Projects", href: "/admin/projects" },
          { label: "Edit Project" },
        ]}
      />

      {/* Bottom padding clears the fixed "Need Help?" widget, which would
          otherwise sit over the form's Next Step button. */}
      <div className="pb-20 lg:pb-24">
        <AddProjectForm projectId={projectId} />
      </div>
    </div>
  );
}
