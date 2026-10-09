import { api } from "./client";

export type FieldKind =
  | "int"
  | "decimal"
  | "bool"
  | "text"
  | "select"
  | "multiselect";

export type SchemaOption = { value: string; label: string };

export type SchemaField = {
  key: string;
  label: string;
  kind: FieldKind;
  min?: number;
  max?: number;
  options?: SchemaOption[];
};

export type SchemaGroup = {
  label: string;
  fields: SchemaField[];
  /** Shown for every type, regardless of which groups the type lists. */
  always?: boolean;
  /** Shown only when the chosen purpose matches. */
  purpose?: string;
};

export type SchemaType = {
  /** Built-in columns this type shows — a plot gets none of the room fields. */
  core: string[];
  groups: string[];
};

export type PropertySchema = {
  groups: Record<string, SchemaGroup>;
  types: Record<string, SchemaType>;
};

export async function fetchPropertySchema(): Promise<PropertySchema> {
  const res = await api<{ data: PropertySchema }>("/property-schema");
  return res.data;
}

/**
 * Groups to render for a type + purpose: the type's own groups, plus any
 * `always` group, plus the group gated on this purpose (payment plan, rental).
 */
export function groupsFor(
  schema: PropertySchema,
  typeSlug: string,
  purpose: string,
): Array<{ name: string; group: SchemaGroup }> {
  const definition = schema.types[typeSlug];
  if (!definition) return [];

  const names = Object.entries(schema.groups)
    .filter(([name, group]) => {
      if (group.always) return true;
      if (group.purpose) return group.purpose === purpose;
      return definition.groups.includes(name);
    })
    .map(([name]) => name);

  // Keep the type's own ordering, then always/purpose groups after it.
  const ordered = [
    ...definition.groups.filter((n) => names.includes(n)),
    ...names.filter((n) => !definition.groups.includes(n)),
  ];

  return ordered.map((name) => ({ name, group: schema.groups[name] }));
}

/** Whether a built-in column (beds, baths…) applies to this type. */
export function showsCore(
  schema: PropertySchema,
  typeSlug: string,
  field: string,
): boolean {
  return schema.types[typeSlug]?.core.includes(field) ?? false;
}
