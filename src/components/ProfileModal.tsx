import { useState, useMemo } from "react";
import api from "@/services/api";
import useAuth from "@/hooks/useAuth";

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
  const { token } = useAuth();

  const initialForm = {
    nome: user.nome,
    apelido: user.apelido || "",
    email: user.email,
    dataNascimento: user.dataNascimento.split("T")[0],
  };

  const [formData, setFormData] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // Novo estado para erro

  const hasChanged = useMemo(() => {
    return (
      formData.nome !== initialForm.nome ||
      formData.apelido !== initialForm.apelido ||
      formData.email !== initialForm.email ||
      formData.dataNascimento !== initialForm.dataNascimento
    );
  }, [formData, initialForm]);

  const isValid =
    formData.nome.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.dataNascimento.trim() !== "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(""); // Limpa erro ao editar
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setErrorMsg("Preencha todos os campos obrigatórios.");
      return;
    }
    setIsSaving(true);
    setErrorMsg("");
    try {
      const response = await api.put(
        `/usuario/${user.id}`,
        {
          nome: formData.nome,
          apelido: formData.apelido === "" ? null : formData.apelido,
          email: formData.email,
          dataNascimento: formData.dataNascimento,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onSave(response.data);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (error: any) {
      console.error("Erro ao atualizar o usuário:", error);
      setErrorMsg(
        error?.response?.data?.error ||
        "Ocorreu um erro ao salvar as alterações. Tente novamente."
      );
    } finally {
      setIsSaving(false);
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
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white"
              required
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
              value={formData.apelido}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-300">
              Data de Nascimento <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dataNascimento"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white"
              required
            />
          </div>
          {success && (
            <div className="text-green-400 text-center font-semibold">
              Alterações salvas com sucesso!
            </div>
          )}
          {errorMsg && (
            <div className="text-red-400 text-center font-semibold">
              {errorMsg}
            </div>
          )}
          {hasChanged && !success && (
            <button
              type="submit"
              className={`w-full py-2 px-4 rounded cursor-pointer font-bold transition ${
                isSaving || !isValid
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
              disabled={isSaving || !isValid}
            >
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}