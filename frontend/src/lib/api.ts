const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

let refreshPromise: Promise<boolean> | null = null;

export async function refreshTokens(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/api/v1/auth/refreshToken`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.ok)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  retryOnUnauthorized = true,
): Promise<Response> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (
    res.status === 401 &&
    retryOnUnauthorized &&
    !path.includes("/refreshToken")
  ) {
    const refreshed = await refreshTokens();

    if (refreshed) {
      return apiFetch(path, options, false);
    }
  }

  return res;
}

export { API_URL };
