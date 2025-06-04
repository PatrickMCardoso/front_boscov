"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import useAuth from "@/hooks/useAuth";
import UsuarioModal from "@/components/ui/modals/UsuarioModal";
import { TrashIcon, PencilIcon, ArrowUpIcon, PlusIcon } from "@heroicons/react/24/outline";
import ConfirmModal from "@/components/ui/modals/ConfirmModal";

type User = {
    id: number;
    nome: string;
    apelido?: string;
    email: string;
    dataNascimento: string;
    tipoUsuario: string;
    status?: number;
};

export default function GerenciarPerfisPage() {
    const auth = useAuth();
    const { user, logout, token } = auth;
    const [usuarios, setUsuarios] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);

    useEffect(() => {
        if (user?.tipoUsuario !== "admin") return;
        fetchUsuarios();
        // eslint-disable-next-line
    }, [user]);

    const fetchUsuarios = () => {
        api
            .get("/usuarios", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setUsuarios(res.data))
            .finally(() => setIsLoading(false));
    };

    const askDelete = (id: number) => {
        setUserToDelete(id);
        setConfirmOpen(true);
    };

    const handleDelete = async () => {
        if (!userToDelete) return;
        await api.delete(`/usuario/${userToDelete}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setConfirmOpen(false);
        setUserToDelete(null);
        fetchUsuarios();
    };

    const handleReactivate = async (id: number) => {
        await api.patch(`/usuario/${id}/reativar`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsuarios();
    };

    const handleSave = async (usuario: Partial<User>) => {
        if (editUser) {
            // Editar
            await api.put(`/usuario/${editUser.id}`, usuario, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } else {
            // Criar
            await api.post("/usuario", usuario, {
                headers: { Authorization: `Bearer ${token}` },
            });
        }
        setModalOpen(false);
        setEditUser(null);
        fetchUsuarios();
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
            <Sidebar user={user} setUser={() => { }} logout={logout} />
            <div className="flex-grow flex flex-col">
                <Header user={user} />
                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">Gerenciar Perfis</h1>
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded hover:bg-green-500 cursor-pointer"
                            onClick={() => { setEditUser(null); setModalOpen(true); }}
                            title="Criar novo perfil"
                        >
                            <PlusIcon className="w-5 h-5 cursor-pointer" /> Novo Perfil
                        </button>
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
                                        <th className="p-2 border-r border-gray-700">Apelido</th>
                                        <th className="p-2 border-r border-gray-700">Email</th>
                                        <th className="p-2 border-r border-gray-700">Data de Nascimento</th>
                                        <th className="p-2 border-r border-gray-700">Tipo</th>
                                        <th className="p-2 border-r border-gray-700">Status</th>
                                        <th className="p-2">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map((u) => (
                                        <tr key={u.id} className="border-b border-gray-700">
                                            <td className="p-2 border-r border-gray-700">{u.id}</td>
                                            <td className="p-2 border-r border-gray-700">{u.nome}</td>
                                            <td className="p-2 border-r border-gray-700">{u.apelido}</td>
                                            <td className="p-2 border-r border-gray-700">{u.email}</td>
                                            <td className="p-2 border-r border-gray-700">{u.dataNascimento?.slice(0, 10)}</td>
                                            <td className="p-2 border-r border-gray-700">{u.tipoUsuario}</td>
                                            <td className="p-2 border-r border-gray-700">
                                                {u.status === 1 ? (
                                                    <span className="text-green-400 font-bold">Ativo</span>
                                                ) : (
                                                    <span className="text-red-400 font-bold">Inativo</span>
                                                )}
                                            </td>
                                            <td className="p-2 flex gap-2">
                                                <button
                                                    className="p-1 rounded hover:bg-yellow-600"
                                                    title="Editar"
                                                    onClick={() => { setEditUser(u); setModalOpen(true); }}
                                                >
                                                    <PencilIcon className="w-5 h-5 text-yellow-400 cursor-pointer" />
                                                </button>
                                                {u.status === 1 ? (
                                                    <button
                                                        className="p-1 rounded hover:bg-red-600"
                                                        title="Excluir"
                                                        onClick={() => askDelete(u.id)}
                                                    >
                                                        <TrashIcon className="w-5 h-5 text-red-400 cursor-pointer" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="p-1 rounded hover:bg-green-600"
                                                        title="Reativar"
                                                        onClick={() => handleReactivate(u.id)}
                                                    >
                                                        <ArrowUpIcon className="w-5 h-5 text-green-400 cursor-pointer" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <UsuarioModal
                    open={modalOpen}
                    onClose={() => { setModalOpen(false); setEditUser(null); }}
                    onSave={handleSave}
                    usuario={editUser}
                    isEdit={!!editUser}
                />
                <ConfirmModal
                    open={confirmOpen}
                    title="Excluir perfil"
                    message="Tem certeza que deseja excluir este perfil?"
                    onConfirm={handleDelete}
                    onCancel={() => { setConfirmOpen(false); setUserToDelete(null); }}
                    confirmText="Excluir"
                    cancelText="Cancelar"
                />
            </div>
        </div>
    );
}