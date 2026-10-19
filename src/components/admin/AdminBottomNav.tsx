"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

  return (
    <nav
      aria-label="Admin sections"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-sm lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="flex items-stretch">
        {visible.map((item) => {
          const active = isActive(item.href);

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "flex flex-col items-center justify-center gap-1 px-1 pb-2 pt-2.5 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-gray-500",
                ].join(" ")}
              >
                {/* The curved highlight marks the open section. */}
                <span
                  className={[
                    "flex h-7 w-12 items-center justify-center rounded-full transition-colors",
                    active ? "bg-primary/10" : "bg-transparent",
                  ].join(" ")}
                >
                  <item.Icon className="h-[18px] w-[18px]" />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
