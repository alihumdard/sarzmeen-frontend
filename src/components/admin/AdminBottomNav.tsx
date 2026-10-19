"use client";

import { usePathname } from "next/navigation";
import BottomNavBar from "@/components/layout/BottomNavBar";
import { useAuth } from "@/context/AuthContext";
import { canAny } from "@/lib/permissions";
import {
  BuildingIcon,
  EnvelopeIcon,
  GridViewIcon,
  HomeStatIcon,
  UsersIcon,
} from "@/components/ui/Icons";

type NavItem = {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  /** Shown only when the user holds one of these; empty means always. */
  anyPermission?: string[];
};

const items: NavItem[] = [
  { href: "/admin", label: "Dashboard", Icon: GridViewIcon },
  {
    href: "/admin/properties",
    label: "Properties",
    Icon: HomeStatIcon,
    anyPermission: ["properties.edit.own", "properties.edit.any"],
  },
  {
    href: "/admin/projects",
    label: "Projects",
    Icon: BuildingIcon,
    anyPermission: ["projects.edit.own", "projects.edit.any"],
  },
  {
    href: "/admin/inquiries",
    label: "Inquiries",
    Icon: EnvelopeIcon,
    anyPermission: ["inquiries.view.own", "inquiries.view.any"],
  },
  {
    href: "/admin/users/agents",
    label: "Users",
    Icon: UsersIcon,
    anyPermission: ["users.view", "agents.manage.own"],
  },
];

/**
 * App-style navigation fixed to the bottom of the admin panel on phones.
 *
 * The sidebar is a drawer below lg:, so moving between sections took two taps
 * every time. This keeps the sections a role can actually reach one tap away.
 *
 * Permission-filtered like the sidebar: an agent sees Properties and
 * Inquiries, not Users. That is convenience, not security — the API enforces
 * the same names.
 */
export default function AdminBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const visible = items.filter(
    (item) => !item.anyPermission || canAny(user, item.anyPermission),
  );

  // Fewer than two tabs is not navigation worth the screen space.
  if (visible.length < 2) return null;

  function isActive(href: string): boolean {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

  const activeIndex = visible.findIndex((item) => isActive(item.href));

  return (
    <BottomNavBar
      items={visible}
      activeIndex={activeIndex}
      ariaLabel="Admin sections"
    />
  );
}
