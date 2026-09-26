import AddPropertyForm from "@/components/admin/AddPropertyForm";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

export default function AddPropertyPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Add New Property"
        description="Fill in the details below to add a new property to your listings."
        breadcrumbs={[
          { label: "Properties", href: "/admin/properties" },
          { label: "Add New Property" },
        ]}
      />

      {/* Bottom padding clears the fixed "Need Help?" widget, which would
          otherwise sit over the form's Next Step button. */}
      <div className="pb-20 lg:pb-24">
        <AddPropertyForm />
      </div>
    </div>
  );
}
