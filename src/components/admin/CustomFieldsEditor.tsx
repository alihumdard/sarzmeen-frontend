"use client";

import { adminInputClass, adminSelectClass } from "@/components/admin/AdminFormField";

export type CustomFieldKind = "text" | "number" | "checkbox";

export type CustomField = {
  label: string;
  kind: CustomFieldKind;
  /** Kept as text for text and number; "true"/"false" for a checkbox. */
  value: string;
};

type Props = {
  fields: CustomField[];
  onChange: (next: CustomField[]) => void;
  /** Matches the backend's array limit. */
  max?: number;
};

const KINDS: { value: CustomFieldKind; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "checkbox", label: "Yes / No" },
];

const BLANK: CustomField = { label: "", kind: "text", value: "" };

/**
 * Lets a lister add details the schema does not cover.
 *
 * The fixed groups come from config/property_schema.php, which cannot
 * anticipate every property — a shop with a mezzanine, a plot with a
 * particular road width. Each row is a label, what kind of value it
 * holds, and the value itself.
 */
export default function CustomFieldsEditor({
  fields,
  onChange,
  max = 20,
}: Props) {
  const full = fields.length >= max;

  function update(index: number, patch: Partial<CustomField>) {
    onChange(
      fields.map((f, i) => {
        if (i !== index) return f;

        const next = { ...f, ...patch };

        // Switching kind keeps the row but drops a value that no longer fits.
        if (patch.kind && patch.kind !== f.kind) {
          next.value = patch.kind === "checkbox" ? "false" : "";
        }

        return next;
      }),
    );
  }

  return (
    <fieldset className="rounded-lg border border-gray-200 p-4">
      <legend className="px-1.5 text-[12px] font-semibold text-gray-700">
        Your Own Details
      </legend>

      <p className="mb-3 text-[11px] text-gray-500">
        Anything the groups above do not cover. Give it a name, pick what
        kind of value it holds, then fill it in.
      </p>

      {fields.length > 0 && (
        <div className="mb-3 flex flex-col gap-2">
          {fields.map((field, index) => (
            <div
              key={index}
              className="grid grid-cols-1 items-start gap-2 sm:grid-cols-[1fr_120px_1fr_auto]"
            >
              <input
                value={field.label}
                onChange={(event) =>
                  update(index, { label: event.target.value })
                }
                placeholder="e.g. Ceiling Height (ft)"
                className={adminInputClass}
                autoComplete="off"
              />

              <select
                value={field.kind}
                onChange={(event) =>
                  update(index, {
                    kind: event.target.value as CustomFieldKind,
                  })
                }
                className={adminSelectClass}
              >
                {KINDS.map((k) => (
                  <option key={k.value} value={k.value}>
                    {k.label}
                  </option>
                ))}
              </select>

              {field.kind === "checkbox" ? (
                <label className="flex h-[38px] cursor-pointer items-center gap-2 rounded-md border border-gray-200 px-3">
                  <input
                    type="checkbox"
                    checked={field.value === "true"}
                    onChange={(event) =>
                      update(index, {
                        value: event.target.checked ? "true" : "false",
                      })
                    }
                    className="h-4 w-4 cursor-pointer accent-[var(--color-primary)]"
                  />
                  <span className="text-[12px] text-gray-600">
                    {field.value === "true" ? "Yes" : "No"}
                  </span>
                </label>
              ) : (
                <input
                  type={field.kind === "number" ? "number" : "text"}
                  value={field.value}
                  onChange={(event) =>
                    update(index, { value: event.target.value })
                  }
                  placeholder={field.kind === "number" ? "e.g. 12" : "Value"}
                  className={adminInputClass}
                  autoComplete="off"
                />
              )}

              <button
                type="button"
                onClick={() => onChange(fields.filter((_, i) => i !== index))}
                aria-label={`Remove ${field.label || "field"}`}
                className="flex h-[38px] w-9 items-center justify-center rounded-md border border-gray-200 text-gray-400 transition-colors hover:border-red-200 hover:text-red-600"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => onChange([...fields, { ...BLANK }])}
        disabled={full}
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-dashed border-primary/50 px-3.5 text-[12px] font-semibold text-primary transition-colors hover:bg-primary-light disabled:opacity-50"
      >
        <PlusIcon />
        Add New
      </button>

      <p className="mt-2 text-[10.5px] text-gray-400">
        {full
          ? `That is the limit of ${max}.`
          : `${fields.length}/${max} added. Rows left without a name are ignored.`}
      </p>
    </fieldset>
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
