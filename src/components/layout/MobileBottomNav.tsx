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
 *
 * The open tab lifts out of the bar into a raised circle, so the current
 * section is readable at a glance rather than only by colour.
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
    <div
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 lg:hidden"
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom, 0px))" }}
    >
      <nav
        aria-label="Primary"
        className="rounded-2xl bg-primary shadow-[0_8px_28px_rgba(31,122,77,0.35)]"
      >
        <ul className="flex items-end">
          {items.map((item) => {
            const active = isActive(item);

            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="flex flex-col items-center justify-end pb-2.5 pt-2"
                >
                  {/*
                    The active tab rises above the bar in a white circle. The
                    ring matches the bar colour so the lift reads as a notch
                    cut out of it rather than a badge sitting on top.
                  */}
                  <span
                    className={[
                      "flex items-center justify-center rounded-full transition-all",
                      active
                        ? "-mt-6 h-12 w-12 bg-white text-primary shadow-md ring-[5px] ring-primary"
                        : "h-9 w-9 text-white/90",
                    ].join(" ")}
                  >
                    <item.Icon className="h-[19px] w-[19px]" />
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
