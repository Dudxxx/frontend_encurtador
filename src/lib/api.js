
const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const BACKEND_ORIGIN = BASE.replace(/\/api\/?$/, "") ;

async function request(path, options = {}) {
  const url = `${BASE}${path}`;

  const headers = options.body
    ? { "Content-Type": "application/json", ...(options.headers || {}) }
    : (options.headers || {});

  const res = await fetch(url, {
    credentials: "same-origin",
    headers,
    ...options,
  });

  const text = await res.text();
  try {
    const json = text ? JSON.parse(text) : null;
    if (!res.ok) {
      throw new Error(json?.message ?? json ?? text ?? `HTTP ${res.status}`);
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
