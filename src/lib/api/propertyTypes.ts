import type {
  PropertyTypeInput,
  PropertyTypeRecord,
} from "@/types/propertyType";
import { api } from "./client";

export async function listPropertyTypes(): Promise<PropertyTypeRecord[]> {
  const res = await api<{ data: PropertyTypeRecord[] }>("/property-types");
  return res.data;
}

export async function createPropertyType(
  input: PropertyTypeInput,
): Promise<PropertyTypeRecord> {
  const res = await api<{ data: PropertyTypeRecord }>("/admin/property-types", {
    method: "POST",
    body: input as unknown as Record<string, unknown>,
  });
  return res.data;
}

export async function updatePropertyType(
  id: string,
  input: PropertyTypeInput,
): Promise<PropertyTypeRecord> {
  const res = await api<{ data: PropertyTypeRecord }>(
    `/admin/property-types/${id}`,
    {
      method: "PUT",
      body: input as unknown as Record<string, unknown>,
    },
  );
  return res.data;
}

export async function deletePropertyType(id: string): Promise<void> {
  await api(`/admin/property-types/${id}`, { method: "DELETE" });
}
