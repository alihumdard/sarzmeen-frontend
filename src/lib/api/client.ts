const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: Record<string, unknown> | FormData;
};

let csrfReady = false;

async function ensureCsrf(): Promise<void> {
  if (csrfReady) return;
  const res = await fetch(`${API_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to initialize session");
  csrfReady = true;
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : undefined;
}

export async function api<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers: extraHeaders, method, ...rest } = options;

  const isGet = !method || method === "GET";

  if (!isGet) {
    await ensureCsrf();
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(extraHeaders as Record<string, string>),
  };

  const xsrfToken = getCookie("XSRF-TOKEN");
  if (xsrfToken) {
    headers["X-XSRF-TOKEN"] = xsrfToken;
  }

  let fetchBody: BodyInit | undefined;

  if (body instanceof FormData) {
    fetchBody = body;
  } else if (body) {
    headers["Content-Type"] = "application/json";
    fetchBody = JSON.stringify(body);
  }

  let res = await fetch(`${API_URL}/api${path}`, {
    method: method ?? "GET",
    headers,
    credentials: "include",
    body: fetchBody,
    ...rest,
  });

  if (res.status === 419 && !isGet) {
    csrfReady = false;
    await ensureCsrf();
    const retryToken = getCookie("XSRF-TOKEN");
    if (retryToken) headers["X-XSRF-TOKEN"] = retryToken;
    res = await fetch(`${API_URL}/api${path}`, {
      method: method ?? "GET",
      headers,
      credentials: "include",
      body: fetchBody,
      ...rest,
    });
  }

  if (res.status === 204) return undefined as T;

  const json = await res.json();

  if (!res.ok) {
    const error = new Error(json.message ?? "Request failed") as Error & {
      status: number;
      errors?: Record<string, string[]>;
    };
    error.status = res.status;
    error.errors = json.errors;
    throw error;
  }

  return json;
}

export function resetCsrf(): void {
  csrfReady = false;
}
