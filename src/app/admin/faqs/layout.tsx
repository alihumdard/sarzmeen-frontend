import PermissionGate from "@/components/admin/PermissionGate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PermissionGate anyPermission={["faqs.manage"]}>
      {children}
    </PermissionGate>
  );
}
