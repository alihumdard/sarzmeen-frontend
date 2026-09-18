"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  SearchIcon,
} from "@/components/ui/Icons";

const companiesList = [
  "Sarzmeen Estate",
  "Capital Property Advisors",
  "Prime Estate",
  "City Realtors",
  "Pak Property Consultants",
  "Apex Consultants",
  "Beacon Property Group",
  "Elite Realtors",
  "Visionary Estates",
  "Summit Properties",
  "Royal Heritage Estate",
  "Pine Valley Properties",
];

type CompanyDropdownProps = {
  value: string;
  onChange: (val: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export default function CompanyDropdown({
  value,
  onChange,
  isOpen,
  onToggle,
  onClose,
}: CompanyDropdownProps) {
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

  const filteredCompanies = companiesList.filter((comp) =>
    comp.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative flex flex-col gap-1" ref={containerRef}>
      <label className="text-[11px] font-semibold text-muted">Company Name</label>
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-11 w-full items-center justify-between rounded-md border bg-white px-3 text-[13px] text-heading outline-none transition-colors ${
          isOpen ? "border-primary ring-2 ring-primary/15 shadow-sm" : "border-border hover:border-primary"
        }`}
      >
        <span className="truncate font-medium">{value || "Select Company"}</span>
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
              placeholder="Search company..."
              className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-[13px] text-heading outline-none focus:border-primary focus:bg-white"
              autoFocus
            />
          </div>

          {/* Companies List */}
          <div className="max-h-[240px] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                onChange("");
                onClose();
                setSearchQuery("");
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors ${
                !value ? "bg-primary-light text-primary font-semibold" : "text-heading hover:bg-surface"
              }`}
            >
              <span>All Companies</span>
            </button>

            {filteredCompanies.map((comp) => {
              const isSelected = value.toLowerCase() === comp.toLowerCase();
              return (
                <button
                  key={comp}
                  type="button"
                  onClick={() => {
                    onChange(comp);
                    onClose();
                    setSearchQuery("");
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors ${
                    isSelected ? "bg-primary-light text-primary font-semibold" : "text-heading hover:bg-surface"
                  }`}
                >
                  <span className="truncate">{comp}</span>
                </button>
              );
            })}

            {filteredCompanies.length === 0 && (
              <div className="py-4 text-center text-[12px] text-muted">No companies found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
