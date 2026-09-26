"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type AdminSidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

type IconName =
  | "dashboard"
  | "property"
  | "project"
  | "location"
  | "agent"
  | "inquiry"
  | "blog"
  | "media"
  | "testimonial"
  | "faq"
  | "home"
  | "roles"
  | "users"
  | "activity"
  | "seo"
  | "appearance"
  | "settings";

type MenuItem = {
  label: string;
  href: string;
  icon: IconName;
  /** True once a real page exists at `href`. False renders it inert with a "Soon" tag. */
  implemented?: boolean;
};

type MenuGroup = {
  title: string;
  items: MenuItem[];
};

/**
 * `implemented` is hand-maintained against the actual routes under
 * src/app/admin/ — there's no build-time link between this list and the
 * filesystem, so when a new admin page ships, flip its entry here too.
 */
const menuGroups: MenuGroup[] = [
  {
    title: "MAIN",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: "dashboard",
        implemented: true,
      },
      {
        label: "Properties",
        href: "/admin/properties",
        icon: "property",
        implemented: true,
      },
      {
        label: "Projects",
        href: "/admin/projects",
        icon: "project",
        implemented: true,
      },
      {
        label: "Locations",
        href: "/admin/locations",
        icon: "location",
        implemented: true,
      },
      {
        label: "Users",
        href: "/admin/users/website",
        icon: "users",
        implemented: true,
      },
      {
        label: "Inquiries",
        href: "/admin/inquiries",
        icon: "inquiry",
        implemented: true,
      },
    ],
  },
  {
    title: "CONTENT MANAGEMENT",
    items: [
      {
        label: "Blogs",
        href: "/admin/blogs",
        icon: "blog",
        implemented: true,
      },
      {
        label: "Homepage CMS",
        href: "/admin/homepage",
        icon: "home",
        implemented: true,
      },
      {
        label: "Media Library",
        href: "/admin/media",
        icon: "media",
        implemented: true,
      },
      {
        label: "Testimonials",
        href: "/admin/testimonials",
        icon: "testimonial",
        implemented: true,
      },
      {
        label: "FAQs",
        href: "/admin/faqs",
        icon: "faq",
        implemented: true,
      },
    ],
  },
  {
    title: "ACCESS & SECURITY",
    items: [
      {
        label: "Roles & Permissions",
        href: "/admin/roles",
        icon: "roles",
        implemented: true,
      },
      {
        label: "Activity Logs",
        href: "/admin/activity-logs",
        icon: "activity",
        implemented: true,
      },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      {
        label: "SEO Settings",
        href: "/admin/settings/seo",
        icon: "seo",
        implemented: false,
      },
      {
        label: "Appearance",
        href: "/admin/settings/appearance",
        icon: "appearance",
        implemented: false,
      },
      {
        label: "System Settings",
        href: "/admin/settings",
        icon: "settings",
        implemented: true,
      },
    ],
  },
];

function AdminIcon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  const commonProps = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...commonProps}>
          <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
        </svg>
      );

    case "property":
      return (
        <svg {...commonProps}>
          <path d="M4 10.5 12 4l8 6.5" />
          <path d="M6 9.5V20h12V9.5" />
          <path d="M10 20v-5h4v5" />
        </svg>
      );

    case "project":
      return (
        <svg {...commonProps}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M8 20V9h8v11" />
          <path d="M8 13h8M8 16h8M10 7h4" />
        </svg>
      );

    case "location":
      return (
        <svg {...commonProps}>
          <path d="M12 21s6.5-5.4 6.5-10.2a6.5 6.5 0 1 0-13 0C5.5 15.6 12 21 12 21Z" />
          <circle cx="12" cy="10.8" r="2.4" />
        </svg>
      );

    case "agent":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
        </svg>
      );

    case "inquiry":
      return (
        <svg {...commonProps}>
          <rect x="3.5" y="5" width="17" height="14" rx="2" />
          <path d="m4.5 7 7.5 6 7.5-6" />
        </svg>
      );

    case "blog":
      return (
        <svg {...commonProps}>
          <path d="M5 3.5h10l4 4V20H5z" />
          <path d="M15 3.5V8h4M8 12h8M8 15.5h6" />
        </svg>
      );

    case "media":
      return (
        <svg {...commonProps}>
          <rect x="3.5" y="4" width="17" height="16" rx="2" />
          <circle cx="8.5" cy="9" r="1.5" />
          <path d="m5 17 4.5-4 3 2.5 2.5-2.5 4 4" />
        </svg>
      );

    case "testimonial":
      return (
        <svg {...commonProps}>
          <path d="M6 5.5h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 3v-3H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z" />
          <path d="M8 10h8M8 13h5" />
        </svg>
      );

    case "faq":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9a2.6 2.6 0 1 1 4.2 2c-1.2.9-1.7 1.3-1.7 2.5" />
          <path d="M12 17h.01" />
        </svg>
      );

    case "home":
      return (
        <svg {...commonProps}>
          <path d="m3.5 10.5 8.5-7 8.5 7" />
          <path d="M5.5 9.5V20h13V9.5" />
          <path d="M9.5 20v-5h5v5" />
        </svg>
      );

    case "roles":
      return (
        <svg {...commonProps}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
          <path d="m16 11 1.5 1.5L21 9" />
        </svg>
      );

    case "users":
      return (
        <svg {...commonProps}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
          <path d="M16 5.5a3 3 0 0 1 0 5.8M17 14.5a5.5 5.5 0 0 1 3.5 5" />
        </svg>
      );

    case "activity":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "seo":
      return (
        <svg {...commonProps}>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 4 4M8 10.5h5M10.5 8v5" />
        </svg>
      );

    case "appearance":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      );

    case "settings":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.1h-2.6V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.6-1H6v-2.6h.4A1.7 1.7 0 0 0 8 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.1H15V5a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v2.6H21a1.7 1.7 0 0 0-1.6 1Z" />
        </svg>
      );

    default:
      return null;
  }
}

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebar({
  mobileOpen = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const [openMenus, setOpenMenus] = useState<string[]>([
    "Properties",
    "Projects",
    "Users",
  ]);

  const toggleMenu = (label: string) => {
    setOpenMenus((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    );
  };

  const renderItem = (item: MenuItem) => {
    const active = isActivePath(pathname, item.href);

    const hasChildren =
      item.label === "Properties" ||
      item.label === "Projects" ||
      item.label === "Users" ||
      item.label === "Blogs";

    const isOpen = openMenus.includes(item.label);

    if (item.implemented === false) {
      return (
        <div
          key={item.label}
          title="Coming soon — this admin page hasn't been built yet"
          aria-disabled="true"
          className="flex min-h-[38px] cursor-not-allowed items-center gap-3 rounded-[6px] px-3 py-2.5 text-[13px] font-medium text-white/30"
        >
          <AdminIcon name={item.icon} className="h-[17px] w-[17px] shrink-0 text-white/25" />
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/30">
            Soon
          </span>
        </div>
      );
    }

    return (
      <div key={item.label}>
        <div
          className={[
            "group flex min-h-[38px] items-center rounded-[6px] border-l-[3px] transition-colors",
            active
              ? "border-[#3DBB6E] bg-primary text-white"
              : "border-transparent text-white/70 hover:bg-white/[0.06] hover:text-white",
          ].join(" ")}
        >
          <Link
            href={item.href}
            onClick={onClose}
            className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-[13px] font-medium"
          >
            <AdminIcon
              name={item.icon}
              className={[
                "h-[17px] w-[17px] shrink-0",
                active ? "text-white" : "text-white/60",
              ].join(" ")}
            />

            <span className="truncate">{item.label}</span>
          </Link>

          {hasChildren && (
            <button
              type="button"
              onClick={() => toggleMenu(item.label)}
              aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.label}`}
              className={[
                "mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] transition-colors",
                active
                  ? "text-white/80 hover:bg-white/15"
                  : "text-white/40 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              <svg
                className={[
                  "h-3.5 w-3.5 transition-transform",
                  isOpen ? "rotate-180" : "",
                ].join(" ")}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          )}
        </div>

        {hasChildren && isOpen && (
          <div className="ml-[27px] mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
            {item.label === "Properties" && (
              <>
                <SidebarSubLink
                  href="/admin/properties"
                  label="All Properties"
                  pathname={pathname}
                  onClose={onClose}
                  implemented
                />
                <SidebarSubLink
                  href="/admin/properties/add"
                  label="Add New Property"
                  pathname={pathname}
                  onClose={onClose}
                  implemented
                />
                <SidebarSubLink
                  href="/admin/categories"
                  label="Categories"
                  pathname={pathname}
                  onClose={onClose}
                  implemented
                />
                <SidebarSubLink
                  href="/admin/properties/types"
                  label="Property Types"
                  pathname={pathname}
                  onClose={onClose}
                  implemented
                />
              </>
            )}

            {item.label === "Projects" && (
              <>
                <SidebarSubLink
                  href="/admin/projects"
                  label="All Projects"
                  pathname={pathname}
                  onClose={onClose}
                  implemented
                />
                <SidebarSubLink
                  href="/admin/projects/add"
                  label="Add New Project"
                  pathname={pathname}
                  onClose={onClose}
                  implemented
                />
                <SidebarSubLink
                  href="/admin/projects/categories"
                  label="Project Categories"
                  pathname={pathname}
                  onClose={onClose}
                  implemented
                />
              </>
            )}

            {item.label === "Users" && (
              <>
                <SidebarSubLink
                  href="/admin/users/website"
                  label="Website Users"
                  pathname={pathname}
                  onClose={onClose}
                  implemented
                />
                <SidebarSubLink
                  href="/admin/users/agents"
                  label="Agents"
                  pathname={pathname}
                  onClose={onClose}
                  implemented
                />
                <SidebarSubLink
                  href="/admin/users/agencies"
                  label="Agencies"
                  pathname={pathname}
                  onClose={onClose}
                  implemented
                />
                <SidebarSubLink
                  href="/admin/users/admins"
                  label="Admin Users"
                  pathname={pathname}
                  onClose={onClose}
                  implemented
                />
              </>
            )}

            {item.label === "Blogs" && (
              <>
                <SidebarSubLink
                  href="/admin/blogs"
                  label="All Blogs"
                  pathname={pathname}
                  onClose={onClose}
                  implemented
                />
                <SidebarSubLink
                  href="/admin/blogs/new"
                  label="Add New Blog"
                  pathname={pathname}
                  onClose={onClose}
                />
                <SidebarSubLink
                  href="/admin/categories"
                  label="Categories"
                  pathname={pathname}
                  onClose={onClose}
                  implemented
                />
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <div className="flex h-full min-h-0 flex-col">
      {/* Logo */}
      <div className="flex h-[72px] shrink-0 items-center border-b border-white/10 px-5">
        <Link
          href="/admin"
          onClick={onClose}
          className="flex items-center gap-2"
        >
          <Image
            src="/logos/sarzmeen-icon.png"
            alt="Sarzameen"
            width={38}
            height={38}
            className="h-9 w-9 object-contain"
          />

          <div className="leading-none">
            <div className="text-[18px] font-bold tracking-tight text-white">
              SARZAMEEN
            </div>

            <div className="mt-1 text-[7px] font-semibold tracking-[0.08em] text-white/55">
              YOUR PROPERTY, OUR PRIORITY
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-track]:bg-transparent">
        <div className="space-y-6">
          {menuGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-2 px-3 text-[9px] font-semibold tracking-[0.12em] text-white/40">
                {group.title}
              </p>

              <div className="space-y-1">
                {group.items.map(renderItem)}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Help Card */}
      {/* <div className="shrink-0 px-4 pb-4">
        <div className="rounded-lg border border-primary/40 bg-primary/10 p-4">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 13a8 8 0 0 1 16 0v4a2 2 0 0 1-2 2h-2v-6h4" />
              <path d="M4 13v6H3a2 2 0 0 1-2-2v-4h3" />
              <path d="M9 19h6" />
            </svg>
          </div>

          <h3 className="text-sm font-semibold text-white">
            Need Help?
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-white/55">
            Check our documentation or contact support team.
          </p>

          {/* <button
            type="button"
            className="mt-3 w-full rounded-md bg-primary px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Visit Help Center
          </button> 
        </div>
      </div> */}

      {/* Footer */}
      <div className="shrink-0 border-t border-white/10 px-5 py-4">
        <p className="text-[11px] font-medium text-white/75">
          Sarzameen Admin Panel
        </p>

        <p className="mt-1 text-[9px] text-white/40">
          © 2024 All Rights Reserved.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] bg-[#031c20] lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-[285px] bg-[#031c20] shadow-2xl transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

function SidebarSubLink({
  href,
  label,
  pathname,
  onClose,
  implemented = false,
}: {
  href: string;
  label: string;
  pathname: string;
  onClose?: () => void;
  /** True once a real page exists at `href`. False renders it inert. */
  implemented?: boolean;
}) {
  const active = isActivePath(pathname, href);

  if (!implemented) {
    return (
      <div
        title="Coming soon — this admin page hasn't been built yet"
        aria-disabled="true"
        className="flex cursor-not-allowed items-center justify-between rounded-md px-3 py-2 text-[12px] text-white/25"
      >
        <span className="truncate">{label}</span>
        <span className="ml-2 shrink-0 text-[9px] font-semibold uppercase tracking-wide text-white/25">
          Soon
        </span>
      </div>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClose}
      className={[
        "block rounded-md px-3 py-2 text-[12px] transition-colors",
        active
          ? "font-medium text-white"
          : "text-white/50 hover:text-white/85",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}