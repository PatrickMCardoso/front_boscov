"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import useAuth from "@/hooks/useAuth";
import MovieEvaluateModal from "@/components/ui/modals/MovieEvaluateModal";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import RequireAuth from "@/components/auth/RequireAuth";
import ConfirmModal from "@/components/ui/modals/ConfirmModal";

type Avaliacao = {
  idFilme: number;
  nota: number;
  comentario: string;
  filme: {
    id: number;
    nome: string;
    poster?: string;
    anoLancamento: number;
  };
};

export default function MinhasAvaliacoesPage() {
  const auth = useAuth();
  const { user, token, logout } = auth;
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [selected, setSelected] = useState<Avaliacao | null>(null);
  const [toDelete, setToDelete] = useState<Avaliacao | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!user || !token) return;
    api
      .get(`/avaliacoes/usuario/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAvaliacoes(res.data))
      .catch(() => setAvaliacoes([]));
  }, [user, token]);

  const handleSuccess = (newMedia: number) => {
    if (!selected) return;
    setAvaliacoes((prev) =>
      prev.map((a) =>
        a.idFilme === selected.idFilme
          ? { ...a, nota: newMedia }
          : a
      )
    );
    setSelected(null);
  };

  const handleDelete = async () => {
    if (!user || !token || !toDelete) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await api.delete(`/avaliacao/${user.id}/${toDelete.idFilme}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvaliacoes((prev) => prev.filter((a) => a.idFilme !== toDelete.idFilme));
      setToDelete(null);
    } catch (error: any) {
      setDeleteError(
        error?.response?.data?.error ||
        "Ocorreu um erro ao excluir a avaliação. Tente novamente."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <RequireAuth>
      <div className="flex min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
        <Sidebar user={user} setUser={() => { }} logout={logout} />
        <div className="flex-grow flex flex-col">
          <Header user={user} />
          <div className="p-8 flex-1">
            <h1 className="text-2xl font-bold mb-6">Minhas Avaliações</h1>
            {avaliacoes.length === 0 ? (
              <div className="text-gray-400 text-center py-10">
                Você ainda não avaliou nenhum filme.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {avaliacoes.map((a) => (
                  <div key={a.idFilme} className="bg-gray-800 rounded-lg p-4 flex gap-4 items-center relative">
                    <img
                      src={a.filme.poster || "/default-poster.png"}
                      alt={a.filme.nome}
                      className="w-20 h-28 object-cover rounded bg-gray-700"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">{a.filme.nome}</h2>
                        <div className="flex flex-col gap-2">
                          <button
                            className="p-1 rounded hover:bg-gray-700"
                            title="Editar avaliação"
                            onClick={() => setSelected(a)}
                          >
                            <PencilIcon className="w-5 h-5 text-blue-400 cursor-pointer" />
                          </button>
                          <button
                            className="p-1 rounded hover:bg-gray-700"
                            title="Excluir avaliação"
                            onClick={() => setToDelete(a)}
                          >
                            <TrashIcon className="w-5 h-5 text-red-400 cursor-pointer" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-yellow-300 font-bold">{a.nota}</span>
                        <span className="text-gray-400 text-sm">/ 10</span>
                      </div>
                      {a.comentario && (
                        <div className="text-gray-300 text-sm mt-2 italic">"{a.comentario}"</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {selected && (
              <MovieEvaluateModal
                movie={{ id: selected.filme.id, nome: selected.filme.nome }}
                onClose={() => setSelected(null)}
                onSuccess={handleSuccess}
              />
            )}
            {toDelete && (
              <ConfirmModal
                open={!!toDelete}
                title="Excluir avaliação"
                message={`Tem certeza que deseja excluir sua avaliação para "${toDelete.filme.nome}"?`}
                onConfirm={handleDelete}
                onCancel={() => setToDelete(null)}
                confirmText={deleteLoading ? "Excluindo..." : "Excluir"}
                cancelText="Cancelar"
                loading={deleteLoading}
                error={deleteError}
              />
            )}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}