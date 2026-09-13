import { ChevronDownIcon, LocationPinIcon } from "@/components/ui/Icons";
import type { SelectOption } from "@/constants/searchOptions";

/** Optional leading glyph, looked up by name so this stays a server component. */
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
 * is the label, matching the compact hero design — so the real <label> is
 * kept for screen readers only.
 */
export default function HeroSelect({
  name,
  placeholder,
  options,
  icon,
}: HeroSelectProps) {
  const Icon = icon ? leadingIcons[icon] : null;

  return (
    <div className="relative min-w-0">
      <label htmlFor={name} className="sr-only">
        {placeholder}
      </label>

      {Icon && (
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
      )}

      <select
        id={name}
        name={name}
        defaultValue=""
        className={`h-[46px] w-full cursor-pointer appearance-none truncate rounded-md border border-border bg-white pr-10 text-[14px] text-heading outline-none transition-colors hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/15 ${
          Icon ? "pl-11" : "pl-4"
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
    </div>
  );
}
