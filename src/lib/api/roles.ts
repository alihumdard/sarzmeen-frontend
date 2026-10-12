import { api } from "./client";

export type Role = {
  id: number;
  name: string;
  label: string;
  description: string;
  usersCount: number;
  permissions: string[];
  /** Distinct modules the role can touch, for the summary chips. */
  modules: string[];
  createdAt: string | null;
};

export type PermissionGroup = {
  group: string;
  label: string;
  permissions: { name: string; label: string }[];
};

export async function listRoles(): Promise<Role[]> {
  const res = await api<{ data: Role[] }>("/admin/roles");
  return res.data;
}

export async function listPermissionGroups(): Promise<PermissionGroup[]> {
  const res = await api<{ data: PermissionGroup[] }>("/admin/permissions");
  return res.data;
}

export async function updateRolePermissions(
  roleId: number,
  permissions: string[],
): Promise<void> {
  await api(`/admin/roles/${roleId}/permissions`, {
    method: "PUT",
    body: { permissions },
  });
}
