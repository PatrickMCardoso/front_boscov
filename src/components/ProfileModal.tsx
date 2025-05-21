import { useState } from "react";
import api from "@/services/api"; // Certifique-se de que o serviço API está configurado
import useAuth from "@/hooks/useAuth"; // Importa o hook de autenticação

type User = {
  id: number;
  nome: string;
  apelido?: string;
  email: string;
  dataNascimento: string;
  tipoUsuario: string;
};

type ProfileModalProps = {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: Partial<User>) => void;
};

export default function ProfileModal({ user, onClose, onSave }: ProfileModalProps) {
  const { token } = useAuth(); // Obtém o token do estado global
  const [formData, setFormData] = useState<Partial<User>>({
    ...user,
    dataNascimento: user.dataNascimento.split("T")[0], // Formata a data para o formato YYYY-MM-DD
  });
  const [isSaving, setIsSaving] = useState(false); // Estado para indicar o salvamento

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true); // Indica que o salvamento está em andamento

    try {
      // Envia os dados atualizados para o backend com o token de autenticação
      const response = await api.put(
        `/usuario/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
          },
        }
      );
      onSave(response.data); // Atualiza os dados no estado global
      onClose(); // Fecha o modal
    } catch (error) {
      console.error("Erro ao atualizar o usuário:", error);
      alert("Ocorreu um erro ao salvar as alterações. Tente novamente.");
    } finally {
      setIsSaving(false); // Finaliza o estado de salvamento
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Editar Perfil</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-300">
              Nome
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
              disabled
            />
          </div>
          <div>
            <label htmlFor="apelido" className="block text-sm font-medium text-gray-300">
              Apelido (opcional)
            </label>
            <input
              type="text"
              id="apelido"
              name="apelido"
              value={formData.apelido || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
              disabled
            />
          </div>
          <div>
            <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-300">
              Data de Nascimento
            </label>
            <input
              type="date"
              id="dataNascimento"
              name="dataNascimento"
              value={formData.dataNascimento || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded cursor-pointer font-bold transition ${
              isSaving ? "bg-gray-500 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 text-white"
            }`}
            disabled={isSaving}
          >
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}