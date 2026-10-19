"use client";

import Link from "next/link";

export type BottomNavItem = {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
};

type BottomNavBarProps = {
  items: BottomNavItem[];
  /** Index of the open tab, or -1 when none matches. */
  activeIndex: number;
  ariaLabel: string;
};

/** Height of the coloured bar, excluding the part the notch lifts into. */
const BAR_HEIGHT = 58;
/** How far the active circle rises above the bar's top edge. */
const LIFT = 22;
/** Radius of the dip cut into the bar. */
const NOTCH_RADIUS = 30;

const VIEW_W = 1000;
const VIEW_H = BAR_HEIGHT + LIFT;

/**
 * Builds the bar outline with a rounded dip under the active tab.
 *
 * A circle laid over a straight bar reads as a badge stuck on top; the bar
 * has to curve away around it for the icon to look like it is rising out of
 * the bar. That outline is only expressible as a path, so the background is
 * an SVG rather than a div.
 */
function barPath(centre: number): string {
  const top = LIFT;
  const r = NOTCH_RADIUS;

  // No active tab: a plain rectangle.
  if (centre < 0) {
    return `M0,${top} H${VIEW_W} V${VIEW_H} H0 Z`;
  }

  const left = centre - r * 1.6;
  const right = centre + r * 1.6;

  return [
    `M0,${top}`,
    `H${left}`,
    // Up and over the circle, then back down to the bar.
    `C${left + r * 0.5},${top} ${centre - r},${top - LIFT} ${centre},${top - LIFT}`,
    `C${centre + r},${top - LIFT} ${right - r * 0.5},${top} ${right},${top}`,
    `H${VIEW_W}`,
    `V${VIEW_H}`,
    `H0`,
    "Z",
  ].join(" ");
}

export default function BottomNavBar({
  items,
  activeIndex,
  ariaLabel,
}: BottomNavBarProps) {
  const slot = VIEW_W / items.length;
  const centre = activeIndex >= 0 ? slot * (activeIndex + 0.5) : -1;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <nav aria-label={ariaLabel} className="relative">
        {/* The bar itself, drawn so the notch follows the open tab. */}
        <svg
          className="absolute inset-x-0 bottom-0 h-[80px] w-full"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d={barPath(centre)} className="fill-primary" />
        </svg>

        <ul className="relative flex h-[80px] items-end">
          {items.map((item, index) => {
            const active = index === activeIndex;

            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="flex h-[80px] flex-col items-center justify-end pb-2"
                >
                  <span
                    className={[
                      "flex items-center justify-center rounded-full transition-all duration-200",
                      active
                        ? "mb-1 h-12 w-12 -translate-y-5 bg-white text-primary shadow-[0_3px_10px_rgba(0,0,0,0.18)]"
                        : "h-8 w-8 text-white/85",
                    ].join(" ")}
                  >
                    <item.Icon className="h-[19px] w-[19px]" />
                  </span>

                  <span
                    className={[
                      "text-[10px] font-medium transition-colors",
                      active ? "-mt-3 text-white" : "mt-0.5 text-white/70",
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
