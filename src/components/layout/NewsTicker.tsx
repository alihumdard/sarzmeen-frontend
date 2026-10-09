import Link from "next/link";
import { serverApi } from "@/lib/api/server";

export type TickerItem = {
  label: string;
  href: string;
};

export type TickerSettings = {
  enabled: boolean;
  label: string;
  /** Seconds for one full scroll of the track. */
  speed: number;
  items: TickerItem[];
};

const fallback: TickerSettings = {
  enabled: true,
  label: "Latest News",
  speed: 45,
  items: [],
};

async function getTicker(): Promise<TickerSettings> {
  try {
    // Short cache: CMS edits should appear quickly after saving.
    const res = await serverApi<{ data: { ticker?: Partial<TickerSettings> } }>(
      "/site-settings/homepage",
      10,
    );
    const t = res.data?.ticker;
    if (!t) return fallback;

    return {
      enabled: t.enabled ?? true,
      label: t.label || fallback.label,
      speed: Number(t.speed) > 0 ? Number(t.speed) : fallback.speed,
      items: Array.isArray(t.items) ? t.items.filter((i) => i?.label) : [],
    };
  } catch {
    return fallback;
  }
}

/**
 * Scrolling headline strip that sits directly under the header.
 *
 * Content comes from the `homepage.ticker` site setting, editable in the
 * admin Homepage CMS.
 *
 * Hidden below `md` — on a phone the strip eats a chunk of the fold without
 * being readable at the speed it moves.
 */
export default async function NewsTicker() {
  const ticker = await getTicker();

  if (!ticker.enabled || ticker.items.length === 0) return null;

  return (
    <div className="sticky top-[67px] z-40 hidden border-b border-white/10 bg-primary text-white md:block">
      <div className="flex h-10 items-center">
        {/* Fixed label — sits above the moving track. */}
        <span className="z-10 flex h-10 shrink-0 items-center bg-heading px-4 text-[12px] font-bold uppercase tracking-wide">
          {ticker.label}
        </span>

        {/* Marquee viewport. `group` lets the track pause on hover. */}
        <div className="group relative flex-1 overflow-hidden">
          <ul
            className="flex w-max items-center motion-safe:animate-[ticker-scroll_45s_linear_infinite] group-hover:[animation-play-state:paused]"
            style={{ animationDuration: `${ticker.speed}s` }}
            /* aria-hidden on the duplicate half would be ideal, but the list
               is decorative chrome — screen readers get the same links from
               the nav and listing pages. */
          >
            {[...ticker.items, ...ticker.items].map((item, index) => (
              <li key={index} className="flex shrink-0 items-center">
                <span className="mx-4 h-1.5 w-1.5 rounded-full bg-white/50" />
                {item.href ? (
                  <Link
                    href={item.href}
                    className="whitespace-nowrap text-[12.5px] font-medium transition-colors hover:text-white/75"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="whitespace-nowrap text-[12.5px] font-medium">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
