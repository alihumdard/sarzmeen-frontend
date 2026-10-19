"use client";

import { usePathname } from "next/navigation";
import BottomNavBar from "@/components/layout/BottomNavBar";
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

  const activeIndex = items.findIndex(isActive);

  return (
    <BottomNavBar items={items} activeIndex={activeIndex} ariaLabel="Primary" />
  );
}
