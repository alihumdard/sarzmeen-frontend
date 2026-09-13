"use client";

import { useState, type ReactNode } from "react";
import { ChevronDownIcon } from "@/components/ui/Icons";

type FilterSectionProps = {
  title: string;
  children: ReactNode;
  /** Sections start open; pass false to collapse one by default. */
  defaultOpen?: boolean;
};

/** One collapsible block inside the properties filter sidebar. */
export default function FilterSection({
  title,
  children,
  defaultOpen = true,
}: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border px-4 py-3.5 last:border-b-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="text-[12px] font-semibold text-heading">{title}</span>
        <ChevronDownIcon
          className={`h-3.5 w-3.5 shrink-0 text-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}
