import React, { useState } from "react";
import { Link2, Check, Loader2 } from "lucide-react";

export default function GerarLink({ onCreate }) {
    const [legenda, setLegenda] = useState("");
    const [url, setUrl] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    function validarUrl(value) {
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!legenda.trim()) {
            setError("Preencha a legenda do link.");
            return;
        }
        if (!url.trim() || !validarUrl(url.trim())) {
            setError("Insira uma URL válida (ex: https://exemplo.com).");
            return;
        }

        setLoading(true);

        const novoLink = {
            id: Date.now().toString(36),
            legenda: legenda.trim(),
            url: url.trim(),
            createdAt: new Date().toISOString(),
            clicks: 0,
            shortUrl: null,
        };

        try {
            await Promise.resolve(onCreate?.(novoLink));
            setLegenda("");
            setUrl("");
        } catch (err) {
            setError("Erro ao criar link. Tente novamente.");
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
                    <p className="text-sm text-gray-500">
                    Transforme links longos em URLs curtas e fáceis de compartilhar
                    </p>
                </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Legenda do link *
                    </label>
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
                        <label className="block text-sm font-medium mb-2">
                        URL para encurtar *
                        </label>
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
