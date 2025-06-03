import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import ProfileModal from "../ui/modals/ProfileModal";

type HeaderProps = {
  title?: string;
  user?: { nome: string; avatar?: string; id: number; apelido?: string; email: string; dataNascimento: string; tipoUsuario: string } | null;
  setUser?: (user: any) => void; // Adicione se quiser atualizar o usuário após editar o perfil
};

export default function Header({ title = "🎥 Filmes BOSCOV", user, setUser }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleButtonClick = () => {
    if (pathname === "/register") {
      router.push("/login");
    } else {
      router.push("/register");
    }
  };

  const handleSave = (updatedUser: Partial<typeof user>) => {
    if (user && setUser) setUser({ ...user, ...updatedUser });
  };

  return (
    <header className={`py-4 shadow-lg ${user ? "bg-gray-900" : "bg-red-600"}`}>
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Título */}
        <h1 className={`text-2xl font-bold ${user ? "" : "text-white"}`}>{title}</h1>

        {/* Se o usuário estiver logado, exibe as informações do usuário */}
        {user ? (
          <div className="flex items-center gap-4">
            <p>Olá, {user.nome}!</p>
            <button
              type="button"
              className="p-0 bg-transparent border-none focus:outline-none"
              onClick={() => setIsProfileOpen(true)}
              aria-label="Abrir perfil"
            >
              <img
                src={user.avatar || "/icons/default-avatar3.png"}
                alt="Avatar"
                className="w-10 h-10 rounded-full cursor-pointer"
              />
            </button>
            {isProfileOpen && (
              <ProfileModal
                user={user}
                onClose={() => setIsProfileOpen(false)}
                onSave={handleSave}
              />
            )}
          </div>
        ) : (
          // Caso contrário, exibe o botão de login/registro
          <nav>
            <button
              onClick={handleButtonClick}
              className="bg-white text-red-600 py-2 px-4 rounded hover:bg-gray-200 transition font-bold"
            >
              {pathname === "/register" ? "Login" : "Registrar"}
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}