// src/lib/api.js
const BASE_RAW = import.meta.env.VITE_API_URL;
const BASE = (BASE_RAW ? String(BASE_RAW).replace(/\/+$/, "") : "https://backend-encurtador.onrender.com/api");

// Garante que BACKEND_ORIGIN tenha protocolo quando possível
const rawOrigin = BASE.replace(/\/api\/?$/, "");
const BACKEND_ORIGIN = /^https?:\/\//i.test(rawOrigin) ? rawOrigin : (rawOrigin ? `https://${rawOrigin}` : rawOrigin);

async function request(path, options = {}) {
  const cleanedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${BASE}${cleanedPath}`;

  const headers = options.body
    ? { "Content-Type": "application/json", ...(options.headers || {}) }
    : (options.headers || {});

  const fetchOptions = {
    credentials: "omit",
    headers,
    ...options,
  };

  console.debug("[API] fetch", url, fetchOptions);

  const res = await fetch(url, fetchOptions);
  const text = await res.text();

  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (err) {
    // texto não-JSON — mantemos como text
    json = text;
  }

  if (!res.ok) {
    const msg = (json && json.message) || json || text || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  // Se a API usar o wrapper { success: true, data: ..., shortUrl: "..." }
  if (json && typeof json === "object" && "data" in json) {
    // mescla data + shortUrl (se existir) para compatibilidade com o frontend atual
    const merged = { ...(json.data || {}) };
    if ("shortUrl" in json && json.shortUrl) merged.shortUrl = json.shortUrl;
    return merged;
  }

  return json;
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
