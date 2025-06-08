"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import useAuth from "@/hooks/useAuth";
import { TrashIcon, PencilIcon, ArrowUpIcon, PlusIcon } from "@heroicons/react/24/outline";
import ConfirmModal from "@/components/ui/modals/ConfirmModal";
import FilmeModal from "@/components/ui/modals/FilmeModal";
import RequireAdmin from "@/components/auth/RequireAdmin";
import FilterSortMenu from "@/components/ui/FilterSortMenu";

type Genero = {
  id: number;
  descricao: string;
};

type Filme = {
  id: number;
  nome: string;
  diretor: string;
  anoLancamento: number;
  duracao: number;
  produtora: string;
  classificacao: string;
  poster: string;
  status: number;
  generos: { genero: Genero }[];
};

export default function GerenciarFilmesPage() {
  const auth = useAuth();
  const { user, logout, token } = auth;
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editFilme, setEditFilme] = useState<Filme | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [filmeToDelete, setFilmeToDelete] = useState<number | null>(null);
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [search, setSearch] = useState(""); 
  const [filters, setFilters] = useState<{ order: string; genero: string; status: string }>({
    order: "",
    genero: "",
    status: "todos"
  });

  useEffect(() => {
    if (user?.tipoUsuario !== "admin") return;
    fetchFilmes();
    fetchGeneros();
    // eslint-disable-next-line
  }, [user]);

  const fetchFilmes = () => {
    setIsLoading(true);
    api
      .get("/filmes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setFilmes(res.data))
      .finally(() => setIsLoading(false));
  };

  const fetchGeneros = () => {
    api
      .get("/generos", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setGeneros(res.data));
  };

  const askDelete = (id: number) => {
    setFilmeToDelete(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!filmeToDelete) return;
    await api.delete(`/filme/${filmeToDelete}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setConfirmOpen(false);
    setFilmeToDelete(null);
    fetchFilmes();
  };

  const handleReactivate = async (id: number) => {
    await api.patch(`/filme/${id}/reativar`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchFilmes();
  };

  const handleSave = async (filme: Partial<Filme> & { generoIds: number[] }) => {
    if (editFilme) {
      // Editar
      await api.put(`/filme/${editFilme.id}`, filme, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      // Criar
      await api.post("/filme", filme, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    setModalOpen(false);
    setEditFilme(null);
    fetchFilmes();
  };

  // FILTRO E ORDENAÇÃO
  let filmesFiltrados = filmes.filter(f =>
    f.nome.toLowerCase().includes(search.trim().toLowerCase())
  );
  if (filters.genero) {
    filmesFiltrados = filmesFiltrados.filter(f =>
      f.generos.some(g => g.genero.descricao.toLowerCase().replace(/\s/g, "-") === filters.genero)
    );
  }
  if (filters.status === "ativos") {
    filmesFiltrados = filmesFiltrados.filter(f => f.status === 1);
  } else if (filters.status === "inativos") {
    filmesFiltrados = filmesFiltrados.filter(f => f.status !== 1);
  }
  if (filters.order === "a-z") {
    filmesFiltrados = [...filmesFiltrados].sort((a, b) => a.nome.localeCompare(b.nome));
  } else if (filters.order === "z-a") {
    filmesFiltrados = [...filmesFiltrados].sort((a, b) => b.nome.localeCompare(a.nome));
  } else if (filters.order === "recentes") {
    filmesFiltrados = [...filmesFiltrados].sort((a, b) => b.anoLancamento - a.anoLancamento);
  } else if (filters.order === "antigos") {
    filmesFiltrados = [...filmesFiltrados].sort((a, b) => a.anoLancamento - b.anoLancamento);
  }

  return (
    <RequireAdmin>
      <div className="flex min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
        <Sidebar user={user} setUser={() => { }} logout={logout} />
        <div className="flex-grow flex flex-col">
          <Header user={user} />
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold">Gerenciar Filmes</h1>
              <div className="flex flex-col md:flex-row gap-2 md:items-center w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Buscar por nome do filme..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                  style={{ minWidth: 220 }}
                />
                <FilterSortMenu
                  onFilterChange={f => setFilters(prev => ({ ...prev, ...f }))}
                  selected={filters}
                />
                <select
                  value={filters.status}
                  onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none cursor-pointer"
                >
                  <option value="todos">Todos</option>
                  <option value="ativos">Ativos</option>
                  <option value="inativos">Inativos</option>
                </select>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded hover:bg-green-500 cursor-pointer"
                  onClick={() => { setEditFilme(null); setModalOpen(true); }}
                  title="Criar novo filme"
                >
                  <PlusIcon className="w-5 h-5 cursor-pointer" /> Novo Filme
                </button>
              </div>
            </div>
            {isLoading ? (
              <div>Carregando...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-gray-800 rounded border border-gray-700">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="p-2 border-r border-gray-700">ID</th>
                      <th className="p-2 border-r border-gray-700">Nome</th>
                      <th className="p-2 border-r border-gray-700">Diretor</th>
                      <th className="p-2 border-r border-gray-700">Ano</th>
                      <th className="p-2 border-r border-gray-700">Duração</th>
                      <th className="p-2 border-r border-gray-700">Produtora</th>
                      <th className="p-2 border-r border-gray-700">Classificação</th>
                      <th className="p-2 border-r border-gray-700">Gêneros</th>
                      <th className="p-2 border-r border-gray-700">Status</th>
                      <th className="p-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filmesFiltrados.map((f) => (
                      <tr key={f.id} className="border-b border-gray-700">
                        <td className="p-2 border-r border-gray-700">{f.id}</td>
                        <td className="p-2 border-r border-gray-700">{f.nome}</td>
                        <td className="p-2 border-r border-gray-700">{f.diretor}</td>
                        <td className="p-2 border-r border-gray-700">{f.anoLancamento}</td>
                        <td className="p-2 border-r border-gray-700">{f.duracao} min</td>
                        <td className="p-2 border-r border-gray-700">{f.produtora}</td>
                        <td className="p-2 border-r border-gray-700">{f.classificacao}</td>
                        <td className="p-2 border-r border-gray-700">
                          {f.generos.map((g) => g.genero.descricao).join(", ")}
                        </td>
                        <td className="p-2 border-r border-gray-700">
                          {f.status === 1 ? (
                            <span className="text-green-400 font-bold">Ativo</span>
                          ) : (
                            <span className="text-red-400 font-bold">Inativo</span>
                          )}
                        </td>
                        <td className="p-2 flex gap-2">
                          <button
                            className="p-1 rounded hover:bg-yellow-600"
                            title="Editar"
                            onClick={() => { setEditFilme(f); setModalOpen(true); }}
                          >
                            <PencilIcon className="w-5 h-5 text-yellow-400 cursor-pointer" />
                          </button>
                          {f.status === 1 ? (
                            <button
                              className="p-1 rounded hover:bg-red-600"
                              title="Excluir"
                              onClick={() => askDelete(f.id)}
                            >
                              <TrashIcon className="w-5 h-5 text-red-400 cursor-pointer" />
                            </button>
                          ) : (
                            <button
                              className="p-1 rounded hover:bg-green-600"
                              title="Reativar"
                              onClick={() => handleReactivate(f.id)}
                            >
                              <ArrowUpIcon className="w-5 h-5 text-green-400 cursor-pointer" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filmesFiltrados.length === 0 && (
                  <div className="text-center text-gray-400 py-8">Nenhum filme encontrado para este filtro.</div>
                )}
              </div>
            )}
          </div>
          <FilmeModal
            open={modalOpen}
            onClose={() => { setModalOpen(false); setEditFilme(null); }}
            onSave={handleSave}
            filme={editFilme}
            generos={generos}
            isEdit={!!editFilme}
          />
          <ConfirmModal
            open={confirmOpen}
            title="Excluir filme"
            message="Tem certeza que deseja excluir este filme?"
            onConfirm={handleDelete}
            onCancel={() => { setConfirmOpen(false); setFilmeToDelete(null); }}
            confirmText="Excluir"
            cancelText="Cancelar"
          />
        </div>
      </div>
    </RequireAdmin>
  );
}