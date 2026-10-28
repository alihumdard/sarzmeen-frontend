import PermissionGate from "@/components/admin/PermissionGate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PermissionGate anyPermission={["properties.publish", "users.approve"]}>
      {children}
    </PermissionGate>
  );
}
