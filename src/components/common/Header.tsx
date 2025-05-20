import { useRouter, usePathname } from "next/navigation";

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname(); // Obtém a rota atual

  const handleButtonClick = () => {
    if (pathname === "/register") {
      router.push("/login"); // Redireciona para login se estiver na página de registro
    } else {
      router.push("/register"); // Redireciona para registro se estiver em outra página
    }
  };

  return (
    <header className="bg-red-600 py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-3xl font-bold tracking-wide">{title}</h1>
        <nav>
          <button
            onClick={handleButtonClick}
            className="bg-white text-red-600 py-2 px-4 rounded hover:bg-gray-200 transition font-bold"
          >
            {pathname === "/register" ? "Login" : "Registrar"}
          </button>
        </nav>
      </div>
    </header>
  );
}