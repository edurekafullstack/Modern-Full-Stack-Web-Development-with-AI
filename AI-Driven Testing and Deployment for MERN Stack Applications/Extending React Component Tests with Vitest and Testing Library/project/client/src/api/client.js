const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    // A 401 from login just means bad credentials; anywhere else the token is expired or invalid.
    if (response.status === 401 && !path.startsWith("/auth/login")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth:logout"));
    }

    const error = new Error(body?.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.errors = body?.errors || [];
    throw error;
  }

  return body?.data;
}
