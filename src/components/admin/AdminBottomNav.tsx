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
    <div
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 lg:hidden"
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom, 0px))" }}
    >
      <nav
        aria-label="Admin sections"
        className="rounded-2xl bg-primary shadow-[0_8px_28px_rgba(31,122,77,0.35)]"
      >
        <ul className="flex items-end">
          {visible.map((item) => {
            const active = isActive(item.href);

            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="flex flex-col items-center justify-end pb-2.5 pt-2"
                >
                  {/*
                    The open section rises out of the bar in a white circle,
                    ringed in the bar colour so it reads as a notch rather
                    than a badge laid over the top.
                  */}
                  <span
                    className={[
                      "flex items-center justify-center rounded-full transition-all",
                      active
                        ? "-mt-6 h-12 w-12 bg-white text-primary shadow-md ring-[5px] ring-primary"
                        : "h-9 w-9 text-white/90",
                    ].join(" ")}
                  >
                    <item.Icon className="h-[18px] w-[18px]" />
                  </span>

                  <span
                    className={[
                      "mt-1 text-[10px] font-medium transition-colors",
                      active ? "text-white" : "text-white/70",
                    ].join(" ")}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
