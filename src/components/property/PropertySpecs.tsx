"use client";

import { useEffect, useState } from "react";
import {
  fetchPropertySchema,
  groupsFor,
  type PropertySchema,
  type SchemaField,
} from "@/lib/api/propertySchema";

export type CustomFieldValue = {
  label: string;
  kind: "text" | "number" | "checkbox";
  value: string | boolean;
};

type Props = {
  specs: Record<string, unknown>;
  typeSlug: string;
  purpose: string;
  /** Rows the lister added themselves, beyond the schema groups. */
  customFields?: CustomFieldValue[];
};

export default function PropertySpecs({
  specs,
  typeSlug,
  purpose,
  customFields = [],
}: Props) {
  const [schema, setSchema] = useState<PropertySchema | null>(null);

  useEffect(() => {
    fetchPropertySchema().then(setSchema).catch(() => {});
  }, []);

  const extras = customFields.filter((f) => f.label?.trim());

  if (!schema || !typeSlug) return null;

  const groups = groupsFor(schema, typeSlug, purpose).filter(
    ({ name }) => name !== "paymentPlan",
  );

  const filled = groups
    .map(({ name, group }) => ({
      name,
      label: group.label,
      fields: group.fields.filter((f) => hasValue(specs[f.key])),
    }))
    .filter((g) => g.fields.length > 0);

  if (filled.length === 0 && extras.length === 0) return null;

  return (
    <div className="space-y-6">
      {filled.map((group) => (
        <div key={group.name}>
          <h4 className="mb-3 text-[14px] font-bold text-heading">{group.label}</h4>
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="grid sm:grid-cols-2">
              {group.fields.map((field, i) => (
                <div
                  key={field.key}
                  className={[
                    "flex items-center justify-between gap-4 px-5 py-3",
                    i % 2 === 0 ? "bg-white" : "bg-surface/30",
                    "sm:border-b sm:border-border/50",
                    i % 2 === 0 ? "sm:border-r sm:border-r-border/50" : "",
                  ].join(" ")}
                >
                  <span className="text-[12px] text-muted">{field.label}</span>
                  <span className="text-right text-[12px] font-semibold text-heading">
                    {display(field, specs[field.key])}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Whatever the lister added that the schema has no field for. */}
      {extras.length > 0 && (
        <div>
          <h4 className="mb-3 text-[14px] font-bold text-heading">
            Additional Details
          </h4>
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="grid sm:grid-cols-2">
              {extras.map((field, i) => (
                <div
                  key={`${field.label}-${i}`}
                  className={[
                    "flex items-center justify-between gap-4 px-5 py-3",
                    i % 2 === 0 ? "bg-white" : "bg-surface/30",
                    "sm:border-b sm:border-border/50",
                    i % 2 === 0 ? "sm:border-r sm:border-r-border/50" : "",
                  ].join(" ")}
                >
                  <span className="text-[12px] text-muted">{field.label}</span>
                  <span className="text-right text-[12px] font-semibold text-heading">
                    {field.kind === "checkbox"
                      ? field.value === true || field.value === "true"
                        ? "Yes"
                        : "No"
                      : String(field.value ?? "")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function hasValue(value: unknown): boolean {
  if (value === null || value === undefined || value === "") return false;
  if (value === false) return false;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function display(field: SchemaField, value: unknown): string {
  if (field.kind === "bool") return value ? "Yes" : "No";

  if (field.kind === "multiselect" && Array.isArray(value)) {
    return value
      .map((v) => field.options?.find((o) => o.value === v)?.label ?? String(v))
      .join(", ");
  }

  if (field.kind === "select") {
    return field.options?.find((o) => o.value === value)?.label ?? String(value);
  }

  if (typeof value === "number") return value.toLocaleString("en-US");

  return String(value);
}
