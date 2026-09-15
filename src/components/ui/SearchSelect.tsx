"use client";

import { useState } from "react";
import Dropdown from "@/components/ui/Dropdown";
import type { SelectOption } from "@/constants/searchOptions";

type SearchSelectProps = {
  /**
   * Small grey label shown above the control. Omit it where the design has
   * no visible label — the placeholder is then used as the accessible name.
   */
  label?: string;
  /** Submitted field name, e.g. "city". */
  name: string;
  /** Text shown when nothing is chosen yet. */
  placeholder: string;
  options: SelectOption[];
};

/** One labelled dropdown used by the hero search bar and the listing filters. */
export default function SearchSelect({
  label,
  name,
  placeholder,
  options,
}: SearchSelectProps) {
  const [value, setValue] = useState("");

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      {label && (
        <span className="text-[11px] font-medium text-muted">{label}</span>
      )}

      <Dropdown
        name={name}
        label={label || placeholder}
        placeholder={placeholder}
        options={options}
        value={value}
        onChange={setValue}
        className="w-full"
        triggerClassName="flex w-full items-center justify-between gap-2 truncate rounded-md border border-border bg-white py-2.5 pl-3 pr-3 text-[13px] text-heading outline-none transition-colors hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
    </div>
  );
}
