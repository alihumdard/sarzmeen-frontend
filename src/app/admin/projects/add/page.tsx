import AddProjectForm from "@/components/admin/AddProjectForm";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

export default function AddProjectPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Add New Project"
        description="Fill in the details below to create a new project."
        breadcrumbs={[
          { label: "Projects", href: "/admin/projects" },
          { label: "Add New Project" },
        ]}
      />

      {/* Bottom padding clears the fixed "Need Help?" widget, which would
          otherwise sit over the form's Next Step button. */}
      <div className="pb-20 lg:pb-24">
        <AddProjectForm />
      </div>
    </div>
  );
}
