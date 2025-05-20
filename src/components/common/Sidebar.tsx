import { useRouter } from "next/navigation";

type SidebarProps = {
  user: any;
  logout: () => void; 
};

export default function Sidebar({ user, logout }: SidebarProps) {
  const router = useRouter();

  return (
    <aside className="w-64 bg-gray-800 p-4 flex flex-col gap-4">
      <h2 className="text-xl font-bold">Bem-vindo, {user?.nome || "Usuário"}!</h2>
      <nav className="flex flex-col gap-2">
        <button
          onClick={() => router.push("/perfil")}
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
          onClick={logout} // Usa a prop logout
          className="text-left bg-red-600 p-2 rounded hover:bg-red-500"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}