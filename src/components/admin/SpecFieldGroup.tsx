"use client";

import type { SchemaField, SchemaGroup } from "@/lib/api/propertySchema";
import {
  adminInputClass,
  adminSelectClass,
} from "@/components/admin/AdminFormField";

export type SpecValue = string | number | boolean | string[];

type Props = {
  group: SchemaGroup;
  values: Record<string, SpecValue>;
  onChange: (key: string, value: SpecValue) => void;
  errors?: Record<string, string[]>;
};

/**
 * Renders one schema-defined field group. The form composes these from
 * GET /api/property-schema, so adding a field server-side needs no change here.
 */
export default function SpecFieldGroup({ group, values, onChange, errors }: Props) {
  const booleans = group.fields.filter((f) => f.kind === "bool");
  const inputs = group.fields.filter((f) => f.kind !== "bool");

  return (
    <fieldset className="rounded-lg border border-gray-200 p-4">
      <legend className="px-1.5 text-[12px] font-semibold text-gray-700">
        {group.label}
      </legend>

      {inputs.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {inputs.map((field) => (
            <SpecInput
              key={field.key}
              field={field}
              value={values[field.key]}
              onChange={onChange}
              error={errors?.[`specs.${field.key}`]?.[0]}
            />
          ))}
        </div>
      )}

      {booleans.length > 0 && (
        <div className={inputs.length > 0 ? "mt-4" : ""}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {booleans.map((field) => (
              <label
                key={field.key}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-[11.5px] text-gray-600 transition-colors hover:border-gray-300"
              >
                <input
                  type="checkbox"
                  checked={values[field.key] === true}
                  onChange={(e) => onChange(field.key, e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary/40"
                />
                {field.label}
              </label>
            ))}
          </div>
        </div>
      )}
    </fieldset>
  );
}

function SpecInput({
  field,
  value,
  onChange,
  error,
}: {
  field: SchemaField;
  value: SpecValue | undefined;
  onChange: (key: string, value: SpecValue) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-gray-600">
        {field.label}
      </label>

      {field.kind === "select" && (
        <select
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(field.key, e.target.value)}
          className={adminSelectClass}
        >
          <option value="">Select...</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}

      {field.kind === "multiselect" && (
        <div className="flex flex-wrap gap-1.5">
          {field.options?.map((o) => {
            const list = Array.isArray(value) ? value : [];
            const on = list.includes(o.value);
            return (
              <button
                key={o.value}
                type="button"
                onClick={() =>
                  onChange(
                    field.key,
                    on ? list.filter((v) => v !== o.value) : [...list, o.value],
                  )
                }
                className={[
                  "rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors",
                  on
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 text-gray-500 hover:border-gray-300",
                ].join(" ")}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      )}

      {(field.kind === "int" || field.kind === "decimal") && (
        <input
          type="number"
          step={field.kind === "decimal" ? "any" : "1"}
          min={field.min}
          max={field.max}
          value={typeof value === "number" || typeof value === "string" ? String(value) : ""}
          onChange={(e) => onChange(field.key, e.target.value)}
          className={adminInputClass}
        />
      )}

      {field.kind === "text" && (
        <input
          type="text"
          maxLength={field.max}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(field.key, e.target.value)}
          className={adminInputClass}
        />
      )}

      {error && <p className="mt-1 text-[10.5px] text-red-600">{error}</p>}
    </div>
  );
}
