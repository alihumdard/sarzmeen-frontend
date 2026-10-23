"use client";

import { useState } from "react";

type Props = {
  /** Names the lister has added. */
  values: string[];
  onChange: (next: string[]) => void;
  /** Wording for the add box, e.g. "feature" or "amenity". */
  noun?: string;
  /** Matches the backend's array limit. */
  max?: number;
  /** Characters per entry, matching the backend. */
  maxLength?: number;
};

/**
 * Lets a lister record something the fixed checkbox lists do not cover.
 *
 * The checkbox groups come from a schema that cannot anticipate every
 * building, so anything missing would otherwise be lost — the backend
 * already stores these as free text, it simply had no way in.
 */
export default function CustomFeatureList({
  values,
  onChange,
  noun = "feature",
  max = 30,
  maxLength = 100,
}: Props) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  const full = values.length >= max;

  function add() {
    const name = draft.trim();

    if (name === "") return;

    if (name.length > maxLength) {
      setError(`Keep it under ${maxLength} characters.`);
      return;
    }

    // Case-insensitive, so "Jacuzzi" is not added next to "jacuzzi".
    if (values.some((v) => v.toLowerCase() === name.toLowerCase())) {
      setError(`"${name}" is already on the list.`);
      return;
    }

    if (full) {
      setError(`You can add up to ${max}.`);
      return;
    }

    onChange([...values, name]);
    setDraft("");
    setError(null);
  }

  function remove(name: string) {
    onChange(values.filter((v) => v !== name));
    setError(null);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            setError(null);
          }}
          onKeyDown={(event) => {
            // Enter adds the entry rather than submitting the whole form.
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
          placeholder={`Add your own ${noun}...`}
          disabled={full}
          className="h-9 min-w-0 flex-1 rounded-md border border-gray-300 px-3 text-[12px] outline-none focus:border-primary disabled:bg-gray-50"
        />

        <button
          type="button"
          onClick={add}
          disabled={full || draft.trim() === ""}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-primary px-3.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <PlusIcon />
          Add
        </button>
      </div>

      {error && (
        <p className="mt-1.5 text-[11px] font-medium text-red-600">{error}</p>
      )}

      {values.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {values.map((name) => (
            <li
              key={name}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-light py-1 pl-3 pr-1.5 text-[11.5px] font-medium text-primary"
            >
              {name}
              <button
                type="button"
                onClick={() => remove(name)}
                aria-label={`Remove ${name}`}
                className="flex h-4 w-4 items-center justify-center rounded-full text-primary/70 transition-colors hover:bg-primary hover:text-white"
              >
                <CloseIcon />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-2 text-[11px] text-gray-400">
        {full
          ? `That is the limit of ${max}.`
          : `Anything the list above does not cover. ${values.length}/${max} added.`}
      </p>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-2.5 w-2.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
