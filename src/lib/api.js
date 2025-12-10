// src/lib/api.js
const BASE_RAW = import.meta.env.VITE_API_URL;
const BASE = (BASE_RAW ? String(BASE_RAW).replace(/\/+$/, "") : "https://backend-encurtador.onrender.com/api");
const BACKEND_ORIGIN = BASE.replace(/\/api\/?$/, "");

async function request(path, options = {}) {
  const cleanedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${BASE}${cleanedPath}`;

  const headers = options.body
    ? { "Content-Type": "application/json", ...(options.headers || {}) }
    : (options.headers || {});

  // Use 'omit' by default (safer para cross-origin sem cookies)
  // Se o backend usar cookies de sessão, troque para 'include' e configure CORS credentials no backend.
  const fetchOptions = {
    credentials: "omit",
    headers,
    ...options,
  };

  console.debug("[API] fetch", url, fetchOptions);

  const res = await fetch(url, fetchOptions);
  const text = await res.text();

  try {
    const json = text ? JSON.parse(text) : null;
    if (!res.ok) {
      const msg = json?.message ?? json ?? text ?? `HTTP ${res.status}`;
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }
    return json;
  } catch (err) {
    if (!res.ok) throw err;
    return text;
  }
}

export async function fetchLinks() {
  return await request("/links", { method: "GET" });
}

export async function createLink({ legenda, url }) {
  return await request("/links", {
    method: "POST",
    body: JSON.stringify({ legenda, url }),
  });
}

export async function updateLink(id, payload) {
  return await request(`/links/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteLink(idOrCode) {
  return await request(`/links/${encodeURIComponent(String(idOrCode))}`, { method: "DELETE" });
}

export { BASE as API_BASE, BACKEND_ORIGIN };
