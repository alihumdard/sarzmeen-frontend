import Link from "next/link";
import { popularSearches } from "@/constants/mockProperties";

/** Quick-link chips shown under the listing search bar. */
export default function PopularSearches() {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="text-[11px] font-medium text-white/70">
        Popular Searches:
      </span>

      {popularSearches.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[11px] font-medium text-white/85 transition-colors hover:border-white hover:bg-white/15 hover:text-white"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
