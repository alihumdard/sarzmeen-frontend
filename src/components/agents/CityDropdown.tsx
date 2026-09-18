"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  SearchIcon,
  MapPinIcon,
} from "@/components/ui/Icons";

const citiesList = [
  "Islamabad",
  "Lahore",
  "Karachi",
  "Rawalpindi",
  "Faisalabad",
  "Peshawar",
  "Multan",
  "Gujranwala",
  "Sialkot",
  "Hyderabad",
  "Bahawalpur",
  "Sargodha",
  "Quetta",
  "Mardan",
  "Abbottabad",
  "Gujrat",
  "Swat",
];

type CityDropdownProps = {
  value: string;
  onChange: (val: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export default function CityDropdown({
  value,
  onChange,
  isOpen,
  onToggle,
  onClose,
}: CityDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const filteredCities = citiesList.filter((c) =>
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative flex flex-col gap-1" ref={containerRef}>
      <label className="text-[11px] font-semibold text-muted">City</label>
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-11 w-full items-center justify-between rounded-md border bg-white px-3 text-[13px] text-heading outline-none transition-colors ${
          isOpen ? "border-primary ring-2 ring-primary/15 shadow-sm" : "border-border hover:border-primary"
        }`}
      >
        <span className="truncate font-medium">{value || "City"}</span>
        {isOpen ? <ChevronUpIcon className="h-4 w-4 text-primary" /> : <ChevronDownIcon className="h-4 w-4 text-muted" />}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-full min-w-[280px] sm:w-[320px] rounded-xl border border-border bg-white p-3 shadow-xl">
          {/* Search Input */}
          <div className="relative mb-2">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city..."
              className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-[13px] text-heading outline-none focus:border-primary focus:bg-white"
              autoFocus
            />
          </div>

          {/* Cities List */}
          <div className="max-h-[240px] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                onChange("");
                onClose();
                setSearchQuery("");
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors ${
                !value ? "bg-primary-light text-primary font-semibold" : "text-heading hover:bg-surface"
              }`}
            >
              <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span>All Cities</span>
            </button>

            {filteredCities.map((c) => {
              const isSelected = value.toLowerCase() === c.toLowerCase();
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    onChange(c);
                    onClose();
                    setSearchQuery("");
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors ${
                    isSelected ? "bg-primary-light text-primary font-semibold" : "text-heading hover:bg-surface"
                  }`}
                >
                  <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="truncate">{c}</span>
                </button>
              );
            })}

            {filteredCities.length === 0 && (
              <div className="py-4 text-center text-[12px] text-muted">No cities found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
