import { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileModal from "../ProfileModal";

type SidebarProps = {
  user: { id: number; nome: string; apelido?: string; email: string; dataNascimento: string; tipoUsuario: string } | null;
  logout: () => void;
};

export default function Sidebar({ user, logout }: SidebarProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (updatedUser: Partial<typeof user>) => {
    console.log("Dados atualizados:", updatedUser);
    // Aqui você pode enviar os dados atualizados para o backend
  };

  return (
    <>
      <aside className="w-64 bg-gray-800 p-4 flex flex-col gap-4">
        <h2 className="text-xl font-bold">Bem-vindo, {user?.apelido || "Usuário"}!</h2>
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-left bg-gray-700 p-2 rounded hover:bg-gray-600"
          >
            Perfil
          </button>
          <button
            onClick={() => router.push("/minhas-avaliacoes")}
            className="text-left bg-gray-700 p-2 rounded hover:bg-gray-600"
          >
            Minhas Avaliações
          </button>
          <button
            onClick={logout}
            className="text-left bg-red-600 p-2 rounded hover:bg-red-500"
          >
            Logout
          </button>
        </nav>
      </aside>
      {isModalOpen && user && (
        <ProfileModal user={user} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
      )}
    </>
  );
}