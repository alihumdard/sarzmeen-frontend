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
  const definition = schema.types[typeSlug] ?? fallbackDefinition(schema);

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
  const definition = schema.types[typeSlug] ?? fallbackDefinition(schema);
  return definition.core.includes(field);
}

/**
 * What to show for a type the schema has no entry for.
 *
 * The schema is a fixed config keyed by slug, but an admin can add a
 * property type through the panel at any time. Such a type used to render
 * step 2 with no fields at all and no explanation, which read as a broken
 * page -- the listing could not describe itself and the form looked dead.
 *
 * A generic set is wrong for some types (a plot has no bedrooms) but it is
 * always better than nothing, and the seller can leave what does not apply
 * blank. Giving a new type its own entry in config/property_schema.php is
 * still the right fix; this only stops the form breaking until then.
 */
export function hasSchemaEntry(
  schema: PropertySchema,
  typeSlug: string,
): boolean {
  return Boolean(schema.types[typeSlug]);
}

function fallbackDefinition(schema: PropertySchema): SchemaType {
  return {
    core: ['carParking', 'furnishing', 'propertyCondition'],
    // Only groups the schema actually defines, so nothing renders undefined.
    groups: ['building', 'buildingAmenities', 'utilities', 'comfort'].filter(
      (name) => name in schema.groups,
    ),
  };
}
