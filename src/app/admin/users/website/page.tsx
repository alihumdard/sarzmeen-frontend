import AccountManager from "@/components/admin/AccountManager";

export default function WebsiteUsersPage() {
  return (
    <AccountManager
      role="user"
      title="Website Users"
      description="Buyers and sellers who registered on the public site."
      breadcrumbLabel="Website Users"
      nameLabel="User"
      searchPlaceholder="Search users by name, email or phone..."
    />
  );
}
