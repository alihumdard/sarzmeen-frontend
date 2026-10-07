import Link from "next/link";

const popularSearches = [
  { label: "DHA Lahore", href: "/properties?city=lahore&location=dha" },
  { label: "Bahria Town", href: "/properties?location=bahria-town" },
  { label: "5 Marla House", href: "/properties?type=house&area=5-marla" },
  { label: "10 Marla Plot", href: "/properties?type=residential-plot" },
  { label: "1 Kanal House", href: "/properties?type=house&area=1-kanal" },
  { label: "Commercial Property", href: "/properties?type=commercial-plot" },
];

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
