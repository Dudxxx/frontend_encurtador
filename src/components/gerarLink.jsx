
import React, { useState } from "react";
import { Link2, Check, Loader2 } from "lucide-react";
import { createLink, BACKEND_ORIGIN } from "../lib/api";

export default function GerarLink({ onCreate }) {
  const [legenda, setLegenda] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function validarUrl(value) {
  if (!value) return false;
  const cleaned = String(value).trim();
  if (!cleaned) return false;

  // primeira tentativa: URL como foi passada
  try {
    new URL(cleaned);
    return true;
  } catch {}

  // segunda tentativa: adiciona https:// se o usuário esqueceu o esquema
  try {
    new URL("https://" + cleaned);
    return true;
  } catch {}

  return false;
}

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  const legendaTrim = legenda.trim();
  const urlTrim = url.trim();

  if (!legendaTrim) {
    setError("Preencha a legenda do link.");
    return;
  }
  if (!urlTrim || !validarUrl(urlTrim)) {
    setError("Insira uma URL válida (ex: https://exemplo.com).");
    return;
  }

  setLoading(true);

  try {
    // garanta que quem for receber sempre tenha o esquema
    const urlToSend = /^https?:\/\//i.test(urlTrim) ? urlTrim : `https://${urlTrim}`;

    const created = await createLink({ legenda: legendaTrim, url: urlToSend });

    try {
      const created = await createLink({ legenda: legenda.trim(), url: url.trim() });

      const mapped = {
        id: (created.id ?? created.code) + "",
        legenda: created.legenda ?? legenda.trim(),
        url: created.url ?? url.trim(),
        code: created.code,
        clicks: created.clicks ?? 0,
        createdAt: created.created_at ?? created.createdAt ?? new Date().toISOString(),

        shortUrl: `${BACKEND_ORIGIN}/${created.code}`,
      };

      await Promise.resolve(onCreate?.(mapped));

      setLegenda("");
      setUrl("");
    } catch (err) {
      console.error("Erro ao criar link (UI):", err);
      setError(err.message ?? "Erro ao criar link. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-3">
          <div className="p-3 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600">
            <Link2 size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold">Encurtador de Links</h1>
            <p className="text-sm text-gray-500">Transforme links longos em URLs curtas e fáceis de compartilhar</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Legenda do link *</label>
          <input
            value={legenda}
            onChange={(e) => setLegenda(e.target.value)}
            placeholder="Ex: Meu portfólio, Site da empresa..."
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            disabled={loading}
          />
        </div>

        <div className="flex gap-4 items-start">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">URL para encurtar *</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://exemplo.com/sua-url-muito-longa..."
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              disabled={loading}
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-medium shadow-md hover:brightness-105 disabled:opacity-60 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Encurtando...
                </>
              ) : (
                <>
                  <Check size={16} /> Encurtar
                </>
              )}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}
