import { serverApi } from "@/lib/api/server";

export type PublicSettings = Record<string, string | number | boolean>;

/**
 * Reads a public settings group for Server Components.
 *
 * Only `homepage`, `seo`, `appearance` and `general` are exposed without
 * authentication; anything else returns empty. Never throws, so a settings
 * outage degrades to built-in defaults rather than a broken page.
 */
export async function getPublicSettings(
  group: string,
): Promise<PublicSettings> {
  try {
    const res = await serverApi<{ data: PublicSettings }>(
      `/site-settings/${group}`,
      30,
    );
    return res.data ?? {};
  } catch {
    return {};
  }
}
