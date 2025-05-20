import { useRouter, usePathname } from "next/navigation";

type HeaderProps = {
  title?: string; // O título é opcional
  user?: { nome: string; avatar?: string } | null; 
};

export default function Header({ title = "🎥 Filmes BOSCOV", user }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname(); // Obtém a rota atual

  const handleButtonClick = () => {
    if (pathname === "/register") {
      router.push("/login"); 
    } else {
      router.push("/register"); 
    }
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
            <img
              src={user.avatar || "/icons/default-avatar3.png"}
              alt="Avatar"
              className="w-10 h-10 rounded-full"
            />
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