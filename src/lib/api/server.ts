const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function serverApi<T = unknown>(
  path: string,
  /** Seconds to cache. Pass a smaller value for CMS-driven content. */
  revalidate = 60,
): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }

  return res.json();
}
