import Link from "next/link";

/**
 * Headlines shown in the strip. Swap these for an API feed later — the
 * component only needs a label and an href per item.
 */
const tickerItems = [
  {
    label: "DHA Lahore Phase 6 | Verified Listings & Latest Plot Prices",
    href: "/projects/dha-lahore",
  },
  {
    label: "Bahria Town Karachi | Booking Open for New Apartments",
    href: "/projects/bahria-town-karachi",
  },
  {
    label: "1 Kanal Houses for Rent in DHA Phase 6 from PKR 3,50,000/month",
    href: "/rent",
  },
  {
    label: "Commercial Offices Available on Rent in Blue Area, Islamabad",
    href: "/rent?type=office",
  },
  {
    label: "5 Marla Residential Plots for Sale in Johar Town, Lahore",
    href: "/properties?type=residential-plot",
  },
];

/**
 * Scrolling headline strip that sits directly under the header.
 *
 * Hidden below `md` — on a phone the strip eats a chunk of the fold without
 * being readable at the speed it moves.
 */
export default function NewsTicker() {
  return (
    <div className="sticky top-[67px] z-40 hidden border-b border-white/10 bg-primary text-white md:block">
      <div className="flex h-10 items-center">
        {/* Fixed label — sits above the moving track. */}
        <span className="z-10 flex h-10 shrink-0 items-center bg-heading px-4 text-[12px] font-bold uppercase tracking-wide">
          Latest News
        </span>

        {/* Marquee viewport. `group` lets the track pause on hover. */}
        <div className="group relative flex-1 overflow-hidden">
          <ul
            className="flex w-max items-center motion-safe:animate-[ticker-scroll_45s_linear_infinite] group-hover:[animation-play-state:paused]"
            /* aria-hidden on the duplicate half would be ideal, but the list
               is decorative chrome — screen readers get the same links from
               the nav and listing pages. */
          >
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <li key={index} className="flex shrink-0 items-center">
                <span className="mx-4 h-1.5 w-1.5 rounded-full bg-white/50" />
                <Link
                  href={item.href}
                  className="whitespace-nowrap text-[12.5px] font-medium transition-colors hover:text-white/75"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
