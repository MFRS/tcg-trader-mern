// src/api.js
const API =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL) ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:5050";

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    cache: "no-store",            // avoid stale cached responses in prod
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}`);
  // Return JSON if present, else null (for DELETEs with no body)
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export default API;
