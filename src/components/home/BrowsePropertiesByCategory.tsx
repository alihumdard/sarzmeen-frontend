"use client";

import { useRef, useState } from "react";
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const HouseIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M9 21v-6h6v6" />
  </svg>
);

const PlotIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 19c3-7 5-11 7-14" />
    <path d="M12 5c2 1 4 2 7 2" />
    <path d="M7 17c3-1 6 0 10 2" />
    <path d="M4 21h16" />
  </svg>
);

const BuildingIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 21V5l10-2v18" />
    <path d="M14 8h6v13" />
    <path d="M7 8h2M7 12h2M7 16h2" />
    <path d="M17 12h1M17 16h1" />
    <path d="M2 21h20" />
  </svg>
);

const ApartmentIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="5" y="3" width="14" height="18" rx="1" />
    <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" />
    <path d="M11 21v-3h2v3" />
  </svg>
);

const CommercialIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 21V8l9-4 9 4v13" />
    <path d="M7 21v-6h10v6" />
    <path d="M7 10h2M15 10h2M7 13h2M15 13h2" />
  </svg>
);

const ShopIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 10h16" />
    <path d="m5 10 1-6h12l1 6" />
    <path d="M5 10v10h14V10" />
    <path d="M9 20v-6h6v6" />
  </svg>
);

const OfficeIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="4" y="3" width="16" height="18" rx="1" />
    <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" />
    <path d="M10 21v-3h4v3" />
  </svg>
);

const FarmHouseIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m3 11 9-7 9 7" />
    <path d="M5 10v10h14V10" />
    <path d="M9 20v-5h6v5" />
    <path d="M3 20h18" />
    <path d="M16 7V4h2v4" />
  </svg>
);

const categories = [
  {
    title: "Houses",
    icon: HouseIcon,
  },
  {
    title: "Plots",
    icon: PlotIcon,
  },
  {
    title: "Flats",
    icon: BuildingIcon,
  },
  {
    title: "Apartments",
    icon: ApartmentIcon,
  },
  {
    title: "Commercial",
    icon: CommercialIcon,
  },
  {
    title: "Shops",
    icon: ShopIcon,
  },
  {
    title: "Offices",
    icon: OfficeIcon,
  },
  {
    title: "Farm Houses",
    icon: FarmHouseIcon,
  },
];

export default function BrowsePropertiesByCategory() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white pt-10 sm:pt-12 pb-4 sm:pb-6">
      <div className="container-page">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-bold leading-tight text-[#17201B] sm:text-[24px]">
              Browse Properties{" "}
              <span className="text-[#3DBB6E]">by Category</span>
            </h2>

            <p className="mt-1 text-[11px] text-gray-500 sm:text-[12px]">
              Find properties that match your lifestyle and needs.
            </p>
          </div>

          {/* Arrows */}
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Previous categories"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-[#3DBB6E] hover:text-[#3DBB6E]"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Next categories"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-[#3DBB6E] hover:text-[#3DBB6E]"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile: 4 rows grid (2 columns) without scrollbar */}
        <div
          className="grid grid-cols-2 gap-2.5 sm:hidden"
        >
          {categories.map(({ title, icon: Icon }) => (
            <button
              key={title}
              type="button"
              className="group flex w-full flex-col items-center justify-center rounded-lg border border-gray-100 bg-white px-3 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-[#3DBB6E]/30 hover:shadow-[0_5px_18px_rgba(61,187,110,0.12)]"
            >
              <Icon className="h-7 w-7 text-[#3DBB6E] transition-transform duration-200 group-hover:scale-105" />

              <span className="mt-1.5 text-[11px] font-bold text-[#17201B]">
                {title}
              </span>

              <span className="mt-0.5 text-[9px] text-gray-500">
                For Sale / Rent
              </span>
            </button>
          ))}
        </div>

        {/* Desktop: original flex row */}
        <div
          ref={scrollRef}
          className="scrollbar-hide hidden sm:flex gap-3 overflow-x-auto pt-2 pb-3"
        >
          {categories.map(({ title, icon: Icon }) => (
            <button
              key={title}
              type="button"
              className="group flex min-w-[118px] flex-1 flex-col items-center justify-center rounded-lg border border-gray-100 bg-white px-3 py-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-[#3DBB6E]/30 hover:shadow-[0_5px_18px_rgba(61,187,110,0.12)]"
            >
              <Icon className="h-8 w-8 text-[#3DBB6E] transition-transform duration-200 group-hover:scale-105" />

              <span className="mt-2 text-[11px] font-bold text-[#17201B]">
                {title}
              </span>

              <span className="mt-1 text-[9px] text-gray-500">
                For Sale / Rent
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
