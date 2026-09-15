"use client";

import { useState } from "react";
import { LocationPinIcon } from "@/components/ui/Icons";
import Dropdown from "@/components/ui/Dropdown";
import type { SelectOption } from "@/constants/searchOptions";

/** Optional leading glyph, looked up by name so this stays easy to extend. */
const leadingIcons = {
  pin: LocationPinIcon,
} as const;

type HeroSelectProps = {
  /** Submitted field name, e.g. "city". */
  name: string;
  /** Shown when nothing is chosen; doubles as the accessible name. */
  placeholder: string;
  options: SelectOption[];
  /** Draws an icon inside the control, before the value. */
  icon?: keyof typeof leadingIcons;
};

/**
 * One dropdown inside the hero search panel.
 *
 * Unlike the listing filters these carry no visible label — the placeholder
 * is the label, matching the compact hero design.
 */
export default function HeroSelect({
  name,
  placeholder,
  options,
  icon,
}: HeroSelectProps) {
  const [value, setValue] = useState("");
  const Icon = icon ? leadingIcons[icon] : null;

  return (
    <div className="relative min-w-0">
      {Icon && (
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
      )}

      <Dropdown
        name={name}
        label={placeholder}
        placeholder={placeholder}
        options={options}
        value={value}
        onChange={setValue}
        triggerClassName={`flex h-[46px] w-full items-center justify-between gap-2 truncate rounded-md border border-border bg-white pr-4 text-[14px] text-heading outline-none transition-colors hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/15 ${
          Icon ? "pl-11" : "pl-4"
        }`}
      />
    </div>
  );
}
