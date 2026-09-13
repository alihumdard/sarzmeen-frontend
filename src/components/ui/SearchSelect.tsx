import { ChevronDownIcon } from "@/components/ui/Icons";
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

/**
 * One labelled dropdown used by the hero search bar and the listing filters.
 *
 * A native <select> is used on purpose: it is keyboard and screen-reader
 * friendly out of the box, and on mobile it opens the OS picker. The native
 * arrow is hidden so the chevron matches the rest of the design.
 */
export default function SearchSelect({
  label,
  name,
  placeholder,
  options,
}: SearchSelectProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <label
        htmlFor={name}
        className={
          label ? "text-[11px] font-medium text-muted" : "sr-only"
        }
      >
        {label || placeholder}
      </label>

      <div className="relative">
        <select
          id={name}
          name={name}
          defaultValue=""
          className="w-full cursor-pointer appearance-none truncate rounded-md border border-border bg-white py-2.5 pl-3 pr-9 text-[13px] text-heading outline-none transition-colors hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/15"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      </div>
    </div>
  );
}
