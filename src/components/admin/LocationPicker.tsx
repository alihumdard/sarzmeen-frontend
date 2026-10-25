"use client";

import { useCallback, useMemo, useRef, useState } from "react";

type Option = {
  id: string;
  name: string;
  slug: string;
  type: string;
  parent: string | null;
};

type Props = {
  locations: Option[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
  placeholder?: string;
};

/** Rendered at once; the rest wait for a narrower search. */
const VISIBLE = 40;

/**
 * Type-to-search location field.
 *
 * A plain <select> held every locality at once, which is thousands of
 * options once the city lists are imported — slow to render and hopeless
 * to scroll. This keeps the full list in memory but puts only the matches
 * in the DOM, and shows each match's parent because names repeat between
 * cities ("DHA Phase 6" exists in Lahore, Karachi and Islamabad).
 */
export default function LocationPicker({
  locations,
  value,
  onChange,
  className = "",
  placeholder = "Search a city, area or society...",
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /*
   * The API gives `parent` as a slug, so map it back to a readable name.
   * Without this the hint under a match reads "lahore" or
   * "johar-town-phase-1" rather than the place it refers to.
   */
  const nameBySlug = useMemo(() => {
    const map = new Map<string, string>();
    for (const l of locations) map.set(l.slug, l.name);
    return map;
  }, [locations]);

  const parentName = useCallback(
    (option: Option) =>
      option.parent ? nameBySlug.get(option.parent) ?? option.parent : null,
    [nameBySlug],
  );

  const selected = useMemo(
    () => locations.find((l) => l.id === value) ?? null,
    [locations, value],
  );

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    // The pre-filled name is the current choice, not a search for it.
    const isPrefill =
      selected && q === label(selected, parentName(selected)).toLowerCase();

    if (!q || isPrefill) {
      // Cities first when nothing is typed, as a sensible starting point.
      return locations.filter((l) => l.type === "city").slice(0, VISIBLE);
    }

    const starts: Option[] = [];
    const contains: Option[] = [];

    for (const l of locations) {
      const name = l.name.toLowerCase();
      if (name.startsWith(q)) starts.push(l);
      else if (name.includes(q)) contains.push(l);
      if (starts.length >= VISIBLE) break;
    }

    return [...starts, ...contains].slice(0, VISIBLE);
  }, [locations, query, selected, parentName]);

  function choose(option: Option) {
    onChange(option.id);
    setQuery("");
    setOpen(false);
  }

  return (
    <div className="relative">
      <input
        value={open ? query : selected ? label(selected, parentName(selected)) : query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={(event) => {
          setOpen(true);
          /*
             Keep the chosen name in the box and select it, rather than
             blanking to a grey placeholder — that read as if the choice
             had been lost. Typing still replaces it.
          */
          if (selected) {
            const text = label(selected, parentName(selected));
            setQuery(text);
            requestAnimationFrame(() => event.target.select());
          } else {
            setQuery("");
          }
        }}
        onBlur={() => {
          // Let a click on an option land before the list closes.
          blurTimer.current = setTimeout(() => setOpen(false), 150);
        }}
        placeholder={selected ? label(selected, parentName(selected)) : placeholder}
        className={className}
        autoComplete="off"
      />

      {selected && !open && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            setQuery("");
          }}
          aria-label="Clear location"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[14px] leading-none text-gray-400 hover:text-red-600"
        >
          &times;
        </button>
      )}

      {open && (
        <ul
          onMouseDown={(event) => {
            // Keeps focus on the input, so the click always lands.
            event.preventDefault();
            if (blurTimer.current) clearTimeout(blurTimer.current);
          }}
          className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg"
        >
          {locations.length === 0 ? (
            /* The list is fetched after the form paints, so an early click
               would otherwise be told nothing matches. */
            <li className="px-3 py-2 text-[12px] text-gray-400">
              Loading locations&hellip;
            </li>
          ) : matches.length === 0 ? (
            <li className="px-3 py-2 text-[12px] text-gray-400">
              Nothing matches &ldquo;{query}&rdquo;
            </li>
          ) : (
            matches.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  onClick={() => choose(option)}
                  className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-[12px] text-gray-700 hover:bg-primary-light hover:text-primary"
                >
                  <span className="min-w-0 truncate">{option.name}</span>
                  {parentName(option) && (
                    <span className="shrink-0 text-[10.5px] text-gray-400">
                      {parentName(option)}
                    </span>
                  )}
                </button>
              </li>
            ))
          )}

          {matches.length >= VISIBLE && (
            <li className="border-t border-gray-100 px-3 py-1.5 text-[10.5px] text-gray-400">
              Showing the first {VISIBLE} — keep typing to narrow it down.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

function label(option: Option, parent: string | null): string {
  return parent ? `${option.name} — ${parent}` : option.name;
}
