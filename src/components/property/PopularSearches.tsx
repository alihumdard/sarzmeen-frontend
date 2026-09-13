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
          className="rounded border border-white/25 px-2.5 py-1 text-[11px] text-white/85 transition-colors hover:border-white hover:text-white"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
