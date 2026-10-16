import type { AuthUser } from "@/types/auth";

/**
 * Whether a user holds a permission.
 *
 * This mirrors the API, which enforces the same names via `permission:`
 * middleware — hiding a menu item here is convenience, not security.
 */
export function can(user: AuthUser | null, permission: string): boolean {
  if (!user) return false;
  return (user.permissions ?? []).includes(permission);
}

/** True when the user holds at least one of the listed permissions. */
export function canAny(user: AuthUser | null, permissions: string[]): boolean {
  if (!user) return false;
  if (permissions.length === 0) return true;
  const held = user.permissions ?? [];
  return permissions.some((p) => held.includes(p));
}
