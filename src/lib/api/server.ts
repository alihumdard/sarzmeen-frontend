const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function serverApi<T = unknown>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }

  return res.json();
}
