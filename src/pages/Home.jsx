// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import GerarLink from "../components/gerarLink.jsx";
import MeusLinks from "../components/meusLinks.jsx";
import { fetchLinks, updateLink, deleteLink } from "../lib/api";

export default function Home() {
  const [links, setLinks] = useState(() => {
    try {
      const raw = localStorage.getItem("meus-links");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  // quando links mudam, guarda no localStorage (cache)
  useEffect(() => {
    try {
      localStorage.setItem("meus-links", JSON.stringify(links));
    } catch {
      // ignore
    }
  }, [links]);

  // busca do backend ao montar
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchLinks(); // retorna array do backend
        // mapear campo created_at -> createdAt e criar shortUrl
        const mapped = (Array.isArray(data) ? data : []).map((it) => ({
          id: (it.id ?? it.code) + "",
          legenda: it.legenda,
          url: it.url,
          code: it.code,
          clicks: it.clicks ?? 0,
          createdAt: it.created_at ?? it.createdAt ?? new Date().toISOString(),
          shortUrl: `${BACKEND_ORIGIN}/${it.code}`, 
        }));
        if (!cancelled) setLinks(mapped);
      } catch (err) {
        console.warn("Falha ao buscar links do servidor:", err);
        // manter localStorage se existir
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreate = async (novoLink) => {
    // novoLink já vem mapeado pelo GerarLink (shortUrl e createdAt)
    setLinks((prev) => [novoLink, ...prev]);
    return novoLink;
  };

  const handleUpdate = async (atualizado) => {
    try {
      // enviar para o backend (backend espera id numérico)
      const idToSend = atualizado.id;
      // monta payload que backend espera (legenda, url)
      await updateLink(idToSend, { legenda: atualizado.legenda, url: atualizado.url });
      setLinks((prev) => prev.map((l) => (l.id === atualizado.id ? { ...l, ...atualizado } : l)));
    } catch (err) {
      console.error("Erro ao atualizar no servidor:", err);
      throw err;
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteLink(id);
      setLinks((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error("Erro ao deletar no servidor:", err);
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <main className="max-w-5xl mx-auto space-y-8">
        <section className="bg-transparent">
          <GerarLink onCreate={handleCreate} />
        </section>

        <section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-transparent">
                <MeusLinks links={links} onUpdate={handleUpdate} onDelete={handleDelete} />
              </div>
            </div>

            <aside className="space-y-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-600">Resumo</h3>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-gray-900">{links.length}</p>
                  <p className="text-xs text-gray-500">links criados</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-600">Ações rápidas</h3>
                <div className="mt-3 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      if (window.confirm("Deseja remover todos os links salvos localmente?")) setLinks([]);
                    }}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  >
                    Limpar links locais
                  </button>

                  <button
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(links, null, 2)], {
                        type: "application/json",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "meus-links.json";
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  >
                    Exportar JSON
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <footer className="text-center text-xs text-gray-400">
          Desenvolvido por{" "}
          <a href="https://github.com/Dudxxx/" className="underline">
            Dudxxx
          </a>{" "}
          e{" "}
          <a href="https://github.com/brunpena" className="underline">
            Brunpena
          </a>
          .
        </footer>
      </main>
    </div>
  );
}
