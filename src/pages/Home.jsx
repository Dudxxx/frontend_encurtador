import React, { useEffect, useState } from "react";
import GerarLink from "../components/gerarLink.jsx";
import MeusLinks from "../components/meusLinks.jsx";

export default function Home() {
    const [links, setLinks] = useState(() => {
        try {
            const raw = localStorage.getItem("meus-links");
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem("meus-links", JSON.stringify(links));
        } catch {
            // Ignorar erros de localStorage
        }
    }, [links]);

    const gerarShortUrl = (id) => {
        try {
            const origin = window?.location?.origin || "https://short.ly";
            return `${origin}/s/${id}`;
        } catch {
            return `https://short.ly/${id}`;
        }
    };

    const handleCreate = async (novoLink) => {
        const shortUrl = gerarShortUrl(novoLink.id);
        const toSave = { ...novoLink, shortUrl };
        setLinks((prev) => [toSave, ...prev]);
        return toSave;
    };

    const handleUpdate = async (atualizado) => {
        setLinks((prev) =>
        prev.map((l) => (l.id === atualizado.id ? { ...l, ...atualizado } : l))
        );
    };

    const handleDelete = async (id) => {
        setLinks((prev) => prev.filter((l) => l.id !== id));
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
                                        if (
                                            window.confirm("Deseja remover todos os links salvos localmente?")
                                        )
                                            setLinks([]);
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
                    Desenvolvido por <a href="https://github.com/Dudxxx/" className="underline">Dudxxx</a> e <a href="https://github.com/brunpena" className="underline">Brunpena</a>.
                </footer>
            </main>
        </div>
    );
}
