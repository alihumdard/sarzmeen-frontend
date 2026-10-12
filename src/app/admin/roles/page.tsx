"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  listPermissionGroups,
  listRoles,
  updateRolePermissions,
  type PermissionGroup,
  type Role,
} from "@/lib/api/roles";

/**
 * Roles are fixed (admin, agency, agent, user) because the API routes gate on
 * them by name; what an administrator edits here is which permissions each
 * role carries.
 */
export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [groups, setGroups] = useState<PermissionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [activeRoleId, setActiveRoleId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [r, g] = await Promise.all([listRoles(), listPermissionGroups()]);
      setRoles(r);
      setGroups(g);
      setActiveRoleId((cur) => cur ?? r[0]?.id ?? null);
      setError("");
    } catch {
      setError("Could not load roles. Check that you are signed in as an administrator.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const activeRole = roles.find((r) => r.id === activeRoleId) ?? null;

  // Reset the draft whenever a different role is opened.
  useEffect(() => {
    setDraft(new Set(activeRole?.permissions ?? []));
    setNotice("");
  }, [activeRole]);

  const dirty = useMemo(() => {
    if (!activeRole) return false;
    const original = activeRole.permissions;
    return (
      original.length !== draft.size || original.some((p) => !draft.has(p))
    );
  }, [activeRole, draft]);

  const toggle = (name: string) =>
    setDraft((cur) => {
      const next = new Set(cur);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  const toggleGroup = (group: PermissionGroup) => {
    const names = group.permissions.map((p) => p.name);
    const allOn = names.every((n) => draft.has(n));
    setDraft((cur) => {
      const next = new Set(cur);
      names.forEach((n) => (allOn ? next.delete(n) : next.add(n)));
      return next;
    });
  };

  const save = async () => {
    if (!activeRole) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await updateRolePermissions(activeRole.id, [...draft]);
      setNotice(`Saved. ${activeRole.label} now has ${draft.size} permissions.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save permissions.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Roles & Permissions"
        description="Choose what each role is allowed to do. Changes apply immediately."
        breadcrumbs={[{ label: "Access & Security" }, { label: "Roles & Permissions" }]}
      />

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">
          {error}
        </div>
      )}
      {notice && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] text-emerald-700">
          {notice}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center text-[13px] text-gray-500">
          Loading roles…
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setActiveRoleId(role.id)}
                className={[
                  "rounded-xl border p-4 text-left transition",
                  role.id === activeRoleId
                    ? "border-primary bg-primary/[0.03] ring-1 ring-primary/20"
                    : "border-gray-200 bg-white hover:border-primary/40",
                ].join(" ")}
              >
                <p className="text-[13.5px] font-bold text-gray-900">{role.label}</p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-gray-500">
                  {role.description}
                </p>
                <div className="mt-3 flex items-center gap-3 border-t border-gray-100 pt-2.5 text-[11px]">
                  <span className="font-semibold text-gray-700">
                    {role.usersCount} {role.usersCount === 1 ? "user" : "users"}
                  </span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-500">{role.permissions.length} permissions</span>
                </div>
              </button>
            ))}
          </div>

          {activeRole && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
                <div>
                  <h2 className="text-[14px] font-bold text-gray-900">
                    {activeRole.label} permissions
                  </h2>
                  <p className="mt-0.5 text-[11.5px] text-gray-500">
                    {draft.size} of{" "}
                    {groups.reduce((n, g) => n + g.permissions.length, 0)} selected
                    {dirty && <span className="ml-2 text-amber-600">· unsaved changes</span>}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDraft(new Set(activeRole.permissions))}
                    disabled={!dirty || saving}
                    className="h-9 rounded-md border border-gray-300 bg-white px-4 text-[11px] font-semibold text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={save}
                    disabled={!dirty || saving}
                    className="h-9 rounded-md bg-primary px-4 text-[11px] font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {groups.map((group) => {
                  const names = group.permissions.map((p) => p.name);
                  const on = names.filter((n) => draft.has(n)).length;

                  return (
                    <div key={group.group} className="px-5 py-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-[12.5px] font-semibold text-gray-800">
                          {group.label}
                          <span className="ml-2 text-[11px] font-normal text-gray-400">
                            {on}/{names.length}
                          </span>
                        </p>
                        <button
                          type="button"
                          onClick={() => toggleGroup(group)}
                          className="text-[11px] font-semibold text-primary hover:underline"
                        >
                          {on === names.length ? "Clear all" : "Select all"}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {group.permissions.map((permission) => (
                          <label
                            key={permission.name}
                            className="flex cursor-pointer items-center gap-2.5 rounded-md border border-gray-100 bg-gray-50/40 px-3 py-2 hover:border-primary/30"
                          >
                            <input
                              type="checkbox"
                              checked={draft.has(permission.name)}
                              onChange={() => toggle(permission.name)}
                              className="h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 accent-primary"
                            />
                            <span className="min-w-0">
                              <span className="block truncate text-[12px] text-gray-700">
                                {permission.label}
                              </span>
                              <span className="block truncate text-[10px] text-gray-400">
                                {permission.name}
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
