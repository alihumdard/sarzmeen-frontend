import AccountManager from "@/components/admin/AccountManager";

export default function AgentsPage() {
  return (
    <AccountManager
      role="agent"
      title="Agents"
      description="Agents added by agency owners. Approve them to let their listings go live."
      breadcrumbLabel="Agents"
      nameLabel="Agent"
      searchPlaceholder="Search agents by name, email or agency..."
    />
  );
}
