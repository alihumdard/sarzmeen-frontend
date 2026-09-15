"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "@/components/ui/Icons";

type DropdownOption = {
  label: string;
  value: string;
};

type DropdownProps = {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  /** Accessible name — visually hidden if no label is shown beside the control. */
  label: string;
  className?: string;
  /** Classes for the trigger button, so callers can match surrounding sizing. */
  triggerClassName?: string;
  /** Shown in the trigger and as a disabled first option when nothing is selected. */
  placeholder?: string;
  /**
   * Submits the value as part of a native <form> — pairs this with a hidden
   * input under `name`, the same as a <select>'s own value would.
   */
  name?: string;
  required?: boolean;
};

/**
 * Custom-styled single-select listbox.
 *
 * Native <select> hands mobile browsers their own full-width OS picker
 * (a plain white sheet with big text, no site styling), which reads as
 * broken next to everything else that follows the design system. This
 * renders the same choices as a small themed panel instead, while staying
 * keyboard- and screen-reader-accessible via the ARIA listbox pattern.
 */
export default function Dropdown({
  options,
  value,
  onChange,
  label,
  className,
  triggerClassName,
  placeholder,
  name,
  required,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.value === value);
  const allOptions = placeholder
    ? [{ label: placeholder, value: "" }, ...options]
    : options;

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className ?? ""}`}>
      {name && (
        <input type="hidden" name={name} value={value} required={required} />
      )}

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen(!open)}
        className={
          triggerClassName ??
          "flex w-full items-center justify-between gap-2 rounded-md border border-border bg-white py-2 pl-3 pr-2.5 text-[11px] text-heading outline-none transition-colors hover:border-primary focus:border-primary"
        }
      >
        <span className={`truncate ${selected ? "" : "text-muted"}`}>
          {selected?.label ?? placeholder ?? label}
        </span>
        <ChevronDownIcon
          className={`h-3.5 w-3.5 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute right-0 top-full z-30 mt-1.5 max-h-72 w-max min-w-full overflow-y-auto overflow-x-hidden rounded-md border border-border bg-white py-1 shadow-lg"
        >
          {allOptions.map((option) => {
            const isPlaceholder = placeholder !== undefined && option.value === "";
            const isSelected = !isPlaceholder && option.value === value;

            return (
              <li key={option.value || "__placeholder"} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  disabled={isPlaceholder}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 whitespace-nowrap px-3.5 py-2.5 text-left text-[12px] transition-colors disabled:cursor-default disabled:text-muted ${
                    isSelected
                      ? "bg-primary-light font-semibold text-primary"
                      : "text-text hover:bg-surface"
                  }`}
                >
                  {option.label}
                  {isSelected && <CheckIcon className="h-3.5 w-3.5 shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
