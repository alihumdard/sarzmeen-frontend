"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BuildingIcon,
  HomeStatIcon,
  PlusCircleIcon,
  SearchIcon,
  UserCircleIcon,
} from "@/components/ui/Icons";

type NavItem = {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  /** Also treat these path prefixes as this tab being active. */
  match?: string[];
};

const items: NavItem[] = [
  { href: "/", label: "Home", Icon: HomeStatIcon },
  {
    href: "/properties",
    label: "Buy",
    Icon: SearchIcon,
    match: ["/properties", "/rent"],
  },
  { href: "/properties/add", label: "Sell", Icon: PlusCircleIcon },
  { href: "/projects", label: "Projects", Icon: BuildingIcon },
  { href: "/login", label: "Account", Icon: UserCircleIcon },
];

/**
 * App-style navigation fixed to the bottom of the screen on phones.
 *
 * The header collapses to a single hamburger on a phone, which buries the
 * main sections two taps deep. This keeps them one tap away, as a native app
 * would. Hidden from lg: up, where the full header is already visible.
 */
export default function MobileBottomNav() {
  const pathname = usePathname();

  // The admin panel has its own chrome and shouldn't carry the public bar.
  if (pathname.startsWith("/admin")) return null;

  function isActive(item: NavItem): boolean {
    const paths = item.match ?? [item.href];

    return paths.some((p) =>
      p === "/" ? pathname === "/" : pathname.startsWith(p),
    );
  }

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 backdrop-blur-sm lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="flex items-stretch">
        {items.map((item) => {
          const active = isActive(item);

          return (
            <li key={item.href} className="relative flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "flex flex-col items-center justify-center gap-1 px-1 pb-2 pt-2.5 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted",
                ].join(" ")}
              >
                {/* The curved highlight sits behind the icon of the open tab. */}
                <span
                  className={[
                    "flex h-7 w-12 items-center justify-center rounded-full transition-colors",
                    active ? "bg-primary-light" : "bg-transparent",
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
