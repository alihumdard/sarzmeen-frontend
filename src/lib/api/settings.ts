import { api } from "./client";

export type SettingsGroup = Record<string, string | number | boolean>;

/** Reads one settings group, e.g. "seo" or "appearance". */
export async function getSettings(group: string): Promise<SettingsGroup> {
  const res = await api<{ data: SettingsGroup }>(`/admin/settings/${group}`);
  return res.data ?? {};
}

/** Saves a whole group in one request. */
export async function saveSettings(
  group: string,
  values: SettingsGroup,
): Promise<void> {
  await api(`/admin/settings/${group}`, {
    method: "PUT",
    body: {
      settings: Object.entries(values).map(([key, value]) => ({ key, value })),
    } as unknown as Record<string, unknown>,
  });
}
