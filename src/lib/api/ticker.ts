import { api } from "./client";
import { defaultTicker, type TickerSettings } from "@/lib/homepageSettings";

type RawItem = { label?: string; href?: string };

type RawTicker = {
  enabled?: boolean;
  label?: string;
  speed?: number;
  items?: RawItem[];
};

/** Reads the ticker from the homepage settings group. */
export async function getTicker(): Promise<TickerSettings> {
  const res = await api<{ data: { ticker?: RawTicker } }>(
    "/site-settings/homepage",
  );
  const t = res.data?.ticker;
  if (!t) return defaultTicker;

  return {
    enabled: t.enabled ?? true,
    label: t.label || defaultTicker.label,
    speed: Number(t.speed) > 0 ? Number(t.speed) : defaultTicker.speed,
    items: (Array.isArray(t.items) ? t.items : [])
      .filter((i) => i?.label)
      .map((i, index) => ({
        // The API stores no ids; generate stable ones for React keys.
        id: `t-${index}-${Date.now()}`,
        label: i.label ?? "",
        href: i.href ?? "",
      })),
  };
}

export async function saveTicker(ticker: TickerSettings): Promise<void> {
  await api("/admin/settings/homepage/ticker", {
    method: "PUT",
    body: {
      value: {
        enabled: ticker.enabled,
        label: ticker.label.trim() || defaultTicker.label,
        speed: ticker.speed,
        // ids are UI-only; strip them before persisting.
        items: ticker.items
          .filter((i) => i.label.trim())
          .map((i) => ({ label: i.label.trim(), href: i.href.trim() })),
      },
    } as unknown as Record<string, unknown>,
  });
}
