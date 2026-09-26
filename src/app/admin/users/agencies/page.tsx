import AccountManager from "@/components/admin/AccountManager";

export default function AgenciesPage() {
  return (
    <AccountManager
      role="agency"
      title="Agencies"
      description="Registered agencies. Approve them to list their firm and team publicly."
      breadcrumbLabel="Agencies"
      nameLabel="Agency"
      searchPlaceholder="Search agencies by name, owner or email..."
    />
  );
}
