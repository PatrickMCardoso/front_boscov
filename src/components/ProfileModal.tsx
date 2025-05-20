import { useState } from "react";

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
  const [formData, setFormData] = useState<Partial<User>>(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData); // Envia os dados atualizados para o backend
    onClose(); // Fecha o modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Editar Perfil</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
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
              Apelido
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
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition font-bold"
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}