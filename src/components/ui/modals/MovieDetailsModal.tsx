import { useEffect, useState } from "react";
import api from "@/services/api";

type MovieDetailsModalProps = {
    movieId: number;
    onClose: () => void;
};

type Filme = {
    id: number;
    nome: string;
    diretor: string;
    anoLancamento: number;
    generos?: { genero: { descricao: string } }[];
    duracao: number;
    produtora: string;
    classificacao: string;
    poster: string;
    mediaAvaliacoes?: number;
};

type Avaliacao = {
    nota: number;
    comentario: string;
    usuario: {
        nome: string;
        apelido?: string;
    };
};

export default function MovieDetailsModal({ movieId, onClose }: MovieDetailsModalProps) {
    const [filme, setFilme] = useState<Filme | null>(null);
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.get(`/filme/${movieId}`)
            .then(res => setFilme(res.data))
            .catch(() => setFilme(null));

        // Busca avaliações do filme
        api.get(`/avaliacoes/filme/${movieId}`)
            .then(res => setAvaliacoes(res.data))
            .catch(() => setAvaliacoes([]))
            .finally(() => setLoading(false));
    }, [movieId]);

    function renderStaticStars(media = 0) {
        const safeMedia = Math.max(0, Math.min(10, media));
        const fullStars = Math.floor(safeMedia / 2);
        const halfStar = safeMedia % 2 >= 1;
        const totalStars = 5;

        return (
            <span className="flex items-center gap-1">
                {[...Array(totalStars)].map((_, i) => {
                    if (i < fullStars) {
                        return (
                            <span key={i} className="relative w-5 h-5 inline-block">
                                <svg className="w-5 h-5 text-gray-500 absolute left-0 top-0" fill="currentColor" viewBox="0 0 20 20">
                                    <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36" />
                                </svg>
                                <svg className="w-5 h-5 text-yellow-400 absolute left-0 top-0" fill="currentColor" viewBox="0 0 20 20">
                                    <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36" />
                                </svg>
                            </span>
                        );
                    } else if (i === fullStars && halfStar) {
                        return (
                            <span key={i} className="relative w-5 h-5 inline-block">
                                <svg className="w-5 h-5 text-gray-500 absolute left-0 top-0" fill="currentColor" viewBox="0 0 20 20">
                                    <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36" />
                                </svg>
                                <svg className="w-5 h-5 text-yellow-400 absolute left-0 top-0" fill="currentColor" viewBox="0 0 20 20" style={{ clipPath: "inset(0 50% 0 0)" }}>
                                    <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36" />
                                </svg>
                            </span>
                        );
                    } else {
                        return (
                            <span key={i} className="relative w-5 h-5 inline-block">
                                <svg className="w-5 h-5 text-gray-500 absolute left-0 top-0" fill="currentColor" viewBox="0 0 20 20">
                                    <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36" />
                                </svg>
                            </span>
                        );
                    }
                })}
            </span>
        );
    }

    let content;
    if (loading) {
        content = <div className="text-white text-center py-10">Carregando...</div>;
    } else if (!filme) {
        content = <div className="text-red-400 text-center py-10">Filme não encontrado.</div>;
    } else {
        content = (
            <>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0 w-full md:w-48 mx-auto">
                        <img
                            src={filme.poster || "/default-poster.png"}
                            alt={filme.nome}
                            className="rounded-lg object-cover w-full h-72 bg-gray-700"
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <h2 className="text-2xl font-bold text-white">{filme.nome}</h2>
                        <div className="flex items-center gap-2">
                            {renderStaticStars(filme.mediaAvaliacoes ?? 0)}
                            <span className="text-yellow-300 font-semibold text-lg">
                                {filme.mediaAvaliacoes !== undefined ? filme.mediaAvaliacoes.toFixed(1) : "--"}
                            </span>
                            <span className="text-gray-400 text-sm">(média)</span>
                        </div>
                        <div className="text-gray-300 mt-4">
                            <div><span className="font-semibold">Diretor:</span> {filme.diretor}</div>
                            <div className="mt-2"><span className="font-semibold">Ano:</span> {filme.anoLancamento}</div>
                            <div className="mt-2">
                                <span className="font-semibold">Gênero:</span>{" "}
                                {filme.generos && filme.generos.length > 0
                                    ? filme.generos.map(g => g.genero.descricao).join(", ")
                                    : "Não informado"}
                            </div>
                            <div className="mt-2"><span className="font-semibold">Duração:</span> {filme.duracao} min</div>
                            <div className="mt-2"><span className="font-semibold">Produtora:</span> {filme.produtora}</div>
                            <div className="mt-2"><span className="font-semibold">Classificação:</span> {filme.classificacao}</div>
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <h3 className="text-lg font-bold text-white mb-2">Avaliações</h3>
                    {avaliacoes.length === 0 ? (
                        <div className="text-gray-400 italic">Nenhuma avaliação para este filme ainda.</div>
                    ) : (
                        <div className="flex flex-col gap-4 max-h-60 overflow-y-auto pr-2">
                            {avaliacoes.map((a, idx) => (
                                <div key={idx} className="bg-gray-800 rounded p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-white">{a.usuario.apelido || a.usuario.nome}</span>
                                        {renderStaticStars(a.nota)}
                                        <span className="text-yellow-300 font-semibold">{a.nota.toFixed(1)}</span>
                                    </div>
                                    {a.comentario && (
                                        <div className="text-gray-300 text-sm mt-1">{a.comentario}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl cursor-pointer"
                >
                    ✕
                </button>
                {content}
            </div>
        </div>
    );
}