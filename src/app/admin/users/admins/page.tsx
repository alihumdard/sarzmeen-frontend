import AccountManager from "@/components/admin/AccountManager";

export default function AdminUsersPage() {
  return (
    <AccountManager
      role="admin"
      title="Admin Users"
      description="Staff accounts with access to this admin panel."
      breadcrumbLabel="Admin Users"
      nameLabel="Admin"
      searchPlaceholder="Search admins by name, email or phone..."
    />
  );
}
