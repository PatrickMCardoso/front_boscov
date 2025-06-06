"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import useAuth from "@/hooks/useAuth";
import { TrashIcon } from "@heroicons/react/24/outline";
import ConfirmModal from "@/components/ui/modals/ConfirmModal";
import RequireAdmin from "@/components/auth/RequireAdmin";

type Avaliacao = {
    idUsuario: number;
    idFilme: number;
    nota: number;
    comentario?: string;
    usuario?: { nome: string; apelido?: string };
    filme?: { nome: string };
};

type EditAvaliacao = {
    idUsuario: number;
    idFilme: number;
    nota: number;
    comentario?: string;
};

export default function GerenciarAvaliacoesPage() {
    const auth = useAuth();
    const { user, logout, token } = auth;
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toDelete, setToDelete] = useState<{ idUsuario: number; idFilme: number } | null>(null);

    useEffect(() => {
        if (user?.tipoUsuario !== "admin") return;
        fetchAvaliacoes();
        // eslint-disable-next-line
    }, [user]);

    const fetchAvaliacoes = () => {
        setIsLoading(true);
        api
            .get("/avaliacoes", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setAvaliacoes(res.data))
            .finally(() => setIsLoading(false));
    };

    const askDelete = (idUsuario: number, idFilme: number) => {
        setToDelete({ idUsuario, idFilme });
        setConfirmOpen(true);
    };

    const handleDelete = async () => {
        if (!toDelete) return;
        await api.delete(`/avaliacao/${toDelete.idUsuario}/${toDelete.idFilme}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setConfirmOpen(false);
        setToDelete(null);
        fetchAvaliacoes();
    };

    return (
        <RequireAdmin>
            <div className="flex min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
                <Sidebar user={user} setUser={() => { }} logout={logout} />
                <div className="flex-grow flex flex-col">
                    <Header user={user} />
                    <div className="p-8">
                        <h1 className="text-2xl font-bold mb-6">Gerenciar Avaliações</h1>
                        {isLoading ? (
                            <div>Carregando...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full bg-gray-800 rounded border border-gray-700">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="p-2 border-r border-gray-700">Usuário</th>
                                            <th className="p-2 border-r border-gray-700">Filme</th>
                                            <th className="p-2 border-r border-gray-700">Nota</th>
                                            <th className="p-2 border-r border-gray-700">Comentário</th>
                                            <th className="p-2">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {avaliacoes.map((a) => (
                                            <tr key={`${a.idUsuario}-${a.idFilme}`} className="border-b border-gray-700">
                                                <td className="p-2 border-r border-gray-700">
                                                    {a.usuario?.nome || a.idUsuario}
                                                </td>
                                                <td className="p-2 border-r border-gray-700">
                                                    {a.filme?.nome || a.idFilme}
                                                </td>
                                                <td className="p-2 border-r border-gray-700">{a.nota}</td>
                                                <td className="p-2 border-r border-gray-700">{a.comentario}</td>
                                                <td className="p-2 flex justify-center items-center">
                                                    <button
                                                        className="p-1 rounded hover:bg-red-600"
                                                        title="Excluir"
                                                        onClick={() => askDelete(a.idUsuario, a.idFilme)}
                                                    >
                                                        <TrashIcon className="w-5 h-5 text-red-400 cursor-pointer" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    <ConfirmModal
                        open={confirmOpen}
                        title="Excluir avaliação"
                        message="Tem certeza que deseja excluir esta avaliação?"
                        onConfirm={handleDelete}
                        onCancel={() => { setConfirmOpen(false); setToDelete(null); }}
                        confirmText="Excluir"
                        cancelText="Cancelar"
                    />
                </div>
            </div>
        </RequireAdmin>
    );
}