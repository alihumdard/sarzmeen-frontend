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
    /*
     * A 401 here means the server session has gone while the page stayed
     * open — the cached user keeps the admin UI looking signed in, so
     * "Unauthenticated." reads as a bug rather than an expired login.
     * Say what actually happened, and leave the form filled so the work
     * survives a log-in in another tab.
     */
    const message =
      res.status === 401 && !/^\/(login|register|me|logout)$/.test(path)
        ? "Your session has expired. Open Sarzameen in another tab, log in again, then press save here — your details are still filled in."
        : (json.message ?? "Request failed");

    const error = new Error(message) as Error & {
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
