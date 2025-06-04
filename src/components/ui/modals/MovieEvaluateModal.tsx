import { useState, useEffect } from "react";
import api from "@/services/api";
import useAuth from "@/hooks/useAuth";

type Movie = {
    id: number;
    nome: string;
};

type MovieEvaluateModalProps = {
    movie: Movie;
    onClose: () => void;
    onSuccess: (newMedia: number) => void;
};

type Avaliacao = {
    nota: number;
    comentario: string;
};

export default function MovieEvaluateModal({ movie, onClose, onSuccess }: MovieEvaluateModalProps) {
    const { user, token } = useAuth();
    const [nota, setNota] = useState(0);
    const [hoverNota, setHoverNota] = useState<number | null>(null);
    const [comentario, setComentario] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [minhaAvaliacao, setMinhaAvaliacao] = useState<Avaliacao | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Busca avaliação do usuário para o filme
    useEffect(() => {
        if (!user || !user.id || !token) return;
        api.get(`/avaliacoes/usuario/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                const avaliacao = res.data.find((a: any) => a.idFilme === movie.id);
                if (avaliacao) {
                    setMinhaAvaliacao({ nota: avaliacao.nota, comentario: avaliacao.comentario || "" });
                    setNota(avaliacao.nota);
                    setComentario(avaliacao.comentario || "");
                } else {
                    setMinhaAvaliacao(null);
                    setNota(0);
                    setComentario("");
                }
                setIsEditing(false);
            })
            .catch(() => { });
    }, [user, token, movie.id]);

    // Renderização das estrelas
    const renderStars = (disabled = false) => {
        const stars = [];
        const value = hoverNota ?? nota;
        for (let i = 1; i <= 5; i++) {
            const starValue = i * 2;
            const isFull = value >= starValue;
            const isHalf = value === starValue - 1;
            stars.push(
                <span key={i} className="relative w-8 h-8 inline-block">
                    {/* Fundo cinza */}
                    <svg
                        className="w-8 h-8 text-gray-500 absolute left-0 top-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36" />
                    </svg>
                    {/* Frente amarela */}
                    <button
                        type="button"
                        disabled={disabled}
                        onMouseEnter={() => !disabled && setHoverNota(isHalf ? starValue - 1 : starValue)}
                        onMouseLeave={() => !disabled && setHoverNota(null)}
                        onClick={() => !disabled && setNota(isHalf ? starValue - 1 : starValue)}
                        className={`focus:outline-none p-0 m-0 absolute left-0 top-0 w-8 h-8 cursor-pointer ${disabled ? "cursor-not-allowed" : ""}`}
                        style={{ display: "inline-block" }}
                    >
                        <svg
                            className={`w-8 h-8 ${isFull || isHalf ? "text-yellow-400" : "text-transparent"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            style={
                                isFull
                                    ? {}
                                    : isHalf
                                        ? { clipPath: "inset(0 50% 0 0)" }
                                        : {}
                            }
                        >
                            <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36" />
                        </svg>
                    </button>
                    {/* Área clicável para meia estrela */}
                    {!isFull && !disabled && (
                        <button
                            type="button"
                            onMouseEnter={() => setHoverNota(starValue - 1)}
                            onMouseLeave={() => setHoverNota(null)}
                            onClick={() => setNota(starValue - 1)}
                            className="focus:outline-none p-0 m-0 absolute left-0 top-0 w-4 h-8 cursor-pointer"
                            style={{ display: "inline-block", zIndex: 2, background: "transparent" }}
                        />
                    )}
                </span>
            );
        }
        return stars;
    };

    // Salvar ou editar avaliação
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setErrorMsg("Usuário não autenticado.");
            return;
        }
        setIsSaving(true);
        setErrorMsg("");
        try {
            let res;
            if (minhaAvaliacao) {
                // UPDATE
                res = await api.put(
                    `/avaliacao/${user.id}/${movie.id}`,
                    {
                        nota,
                        comentario,
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                // CREATE
                res = await api.post(
                    "/avaliacao",
                    {
                        idUsuario: user.id,
                        idFilme: movie.id,
                        nota,
                        comentario,
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            setSuccess(true);
            setMinhaAvaliacao({ nota, comentario });
            setIsEditing(false);
            setTimeout(() => {
                setSuccess(false);
                onSuccess(res.data.filme?.mediaAvaliacoes ?? nota);
                onClose();
            }, 1200);
        } catch (error: any) {
            setErrorMsg(
                error?.response?.data?.error ||
                "Ocorreu um erro ao salvar a avaliação. Tente novamente."
            );
        } finally {
            setIsSaving(false);
        }
    };

    // Excluir avaliação
    const handleDelete = async () => {
        if (!user || !user.id || !movie.id) return;
        setIsSaving(true);
        setErrorMsg("");
        try {
            const res = await api.delete(`/avaliacao/${user.id}/${movie.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMinhaAvaliacao(null);
            setNota(0);
            setComentario("");
            setSuccess(true);
            setIsEditing(false);
            setTimeout(() => {
                setSuccess(false);
                // Use a média retornada pelo backend, se existir
                onSuccess(res.data.mediaAvaliacoes ?? 0);
                onClose();
            }, 1200);
        } catch (error: any) {
            if (error?.response?.status === 404) {
                setErrorMsg("Avaliação já foi excluída ou não existe.");
            } else {
                setErrorMsg(
                    error?.response?.data?.error ||
                    "Ocorreu um erro ao excluir a avaliação. Tente novamente."
                );
            }
        } finally {
            setIsSaving(false);
        }
    };

    // Habilita edição
    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Avaliar: {movie.nome}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center gap-2 justify-center">
                        {renderStars(!!minhaAvaliacao && !isEditing)}
                        <span className="text-yellow-300 font-bold text-lg ml-2">{nota}</span>
                    </div>
                    <div>
                        <label htmlFor="comentario" className="block text-sm font-medium text-gray-300">
                            Comentário (opcional)
                        </label>
                        <textarea
                            id="comentario"
                            name="comentario"
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white resize-none"
                            rows={3}
                            maxLength={500}
                            placeholder="Escreva um comentário sobre o filme..."
                            disabled={!!minhaAvaliacao && !isEditing}
                        />
                    </div>
                    {success && (
                        <div className="text-green-400 text-center font-semibold">
                            Avaliação salva com sucesso!
                        </div>
                    )}
                    {errorMsg && (
                        <div className="text-red-400 text-center font-semibold">
                            {errorMsg}
                        </div>
                    )}
                    <div className="flex gap-2">
                        {/* Se não tem avaliação, mostra botão de salvar */}
                        {!minhaAvaliacao && (
                            <button
                                type="submit"
                                className={`w-full py-2 px-4 rounded cursor-pointer font-bold transition ${isSaving || nota === 0
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-red-600 hover:bg-red-700 text-white"
                                    }`}
                                disabled={isSaving || nota === 0}
                            >
                                {isSaving ? "Salvando..." : "Salvar Avaliação"}
                            </button>
                        )}
                        {/* Se já tem avaliação */}
                        {minhaAvaliacao && !isEditing && (
                            <>
                                <button
                                    type="button"
                                    className="w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold transition cursor-pointer"
                                    onClick={handleEdit}
                                    disabled={isSaving}
                                >
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    className="w-full py-2 px-4 rounded bg-red-600 hover:bg-red-700 text-white font-bold transition cursor-pointer"
                                    onClick={handleDelete}
                                    disabled={isSaving}
                                >
                                    Excluir
                                </button>
                            </>
                        )}
                        {/* Se está editando uma avaliação existente */}
                        {minhaAvaliacao && isEditing && (
                            <button
                                type="submit"
                                className={`w-full py-2 px-4 rounded cursor-pointer font-bold transition ${isSaving || nota === 0
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                                    }`}
                                disabled={isSaving || nota === 0}
                            >
                                {isSaving ? "Salvando..." : "Salvar Alteração"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}