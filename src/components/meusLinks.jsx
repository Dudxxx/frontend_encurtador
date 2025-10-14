import React, { useState } from "react";
import {
    Copy,
    Edit2,
    Trash2,
    ExternalLink,
    Calendar,
    BarChart2,
} from "lucide-react";

export default function MeusLinks({ links = [], onUpdate, onDelete }) {
    const [editingId, setEditingId] = useState(null);
    const [editLegenda, setEditLegenda] = useState("");
    const [editUrl, setEditUrl] = useState("");

    function formatDate(iso) {
        try {
            return new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
            }).format(new Date(iso));
        } catch {
            return iso;
        }
    }

    const copiarParaAreaTransferencia = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            const el = document.createElement("div");
            el.textContent = "Copiado!";
            el.className =
                "fixed bottom-6 right-6 bg-black text-white text-sm px-3 py-2 rounded-md shadow copy-toast";
            document.body.appendChild(el);
            setTimeout(() => document.body.removeChild(el), 1400);
        } catch {
            alert("Não foi possível copiar. Tente manualmente.");
        }
    };

    const iniciarEdicao = (link) => {
        setEditingId(link.id);
        setEditLegenda(link.legenda);
        setEditUrl(link.url);
    };

    const cancelarEdicao = () => {
        setEditingId(null);
        setEditLegenda("");
        setEditUrl("");
    };

    const salvarEdicao = async (id) => {
        if (!editLegenda.trim()) return alert("Legenda não pode ficar vazia.");
        if (!editUrl.trim()) return alert("URL não pode ficar vazia.");

        const atualizado = { id, legenda: editLegenda.trim(), url: editUrl.trim() };
        try {
            await Promise.resolve(onUpdate?.(atualizado));
            cancelarEdicao();
        } catch {
            alert("Erro ao atualizar link.");
        }
    };

    const confirmarExcluir = async (id) => {
        if (!window.confirm("Deseja realmente excluir este link?")) return;
        try {
            await Promise.resolve(onDelete?.(id));
        } catch {
            alert("Erro ao excluir link.");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">Meus Links</h3>
                <span className="text-sm text-gray-400">
                    {links.length} link{links.length !== 1 ? "s" : ""}
                </span>
            </div>

            {links.length === 0 ? (
                <p className="text-sm text-gray-600">Nenhum link criado ainda.</p>
            ) : (
                <ul className="space-y-4">
                {links.map((link) => (
                    <li
                    key={link.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    {editingId === link.id ? (
                                    <div className="space-y-2">
                                        <input
                                        value={editLegenda}
                                        onChange={(e) => setEditLegenda(e.target.value)}
                                        className="w-full rounded-md border px-3 py-2"
                                        />
                                        <input
                                        value={editUrl}
                                        onChange={(e) => setEditUrl(e.target.value)}
                                        className="w-full rounded-md border px-3 py-2"
                                        />
                                    </div>
                                    ) : (
                                    <>
                                        <div className="flex items-center gap-3 justify-between">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <h4 className="text-lg font-semibold truncate">{link.legenda}</h4>

                                                <div className="ml-2 text-gray-400 text-sm flex items-center gap-2 shrink-0">
                                                <BarChart2 size={14} />
                                                <span className="text-sm">{link.clicks ?? 0}</span>
                                                </div>
                                            </div>

                                            <div className="hidden sm:flex items-center gap-2">
                                                <button
                                                    onClick={() => iniciarEdicao(link)}
                                                    title="Editar"
                                                    className="p-2 rounded-lg border hover:bg-gray-50"
                                                    >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => confirmarExcluir(link.id)}
                                                    title="Excluir"
                                                    className="p-2 rounded-lg border hover:bg-gray-50 text-red-600"
                                                    >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-2 flex items-center gap-2 min-w-0">
                                            <a
                                                href={link.shortUrl ?? link.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 font-medium truncate max-w-[75%] min-w-0"
                                                title={link.shortUrl ?? link.url}
                                            >
                                                {(link.shortUrl ?? link.url)}
                                            </a>
                                            <ExternalLink size={14} className="inline-block text-gray-400 shrink-0" />
                                        </div>

                                        <p className="text-xs text-gray-500 mt-2 truncate">{link.url}</p>

                                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-3">
                                            <Calendar size={14} /> Criado em {formatDate(link.createdAt)}
                                        </div>
                                    </>
                                    )}
                                </div>

                                <div className="flex flex-col sm:items-end gap-3 sm:gap-4">
                                    {editingId === link.id ? (
                                    <div className="flex gap-2">
                                            <button
                                            onClick={() => salvarEdicao(link.id)}
                                            className="px-3 py-2 rounded-md border"
                                            >
                                            Salvar
                                        </button>
                                        <button
                                            onClick={cancelarEdicao}
                                            className="px-3 py-2 rounded-md border"
                                            >
                                            Cancelar
                                        </button>
                                    </div>
                                    ) : (
                                    <>
                                        <button
                                            onClick={() =>
                                                copiarParaAreaTransferencia(link.shortUrl ?? link.url)
                                            }
                                            className="w-full sm:w-48 flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-gray-50"
                                            >
                                            <Copy size={16} /> Copiar
                                        </button>

                                        <div className="flex items-center gap-2 mt-0 sm:mt-2">
                                            <button
                                                onClick={() => iniciarEdicao(link)}
                                                title="Editar"
                                                className="p-2 rounded-lg border hover:bg-gray-50 sm:hidden"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => confirmarExcluir(link.id)}
                                                title="Excluir"
                                                className="p-2 rounded-lg border hover:bg-gray-50 text-red-600 sm:hidden"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
                </ul>
            )}
        </div>
    );
}
