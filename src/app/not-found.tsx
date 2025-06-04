"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
      <header className="bg-red-600 py-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-3xl font-bold tracking-wide">🎥 Boscov</h1>
          <nav>
            <Link href="/login" className="text-white hover:underline">
              Ir para Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <p className="text-2xl font-semibold mb-6">
          Oops! Página não encontrada.
        </p>
        <p className="text-gray-300 mb-8">
          Parece que você se perdeu no mundo do cinema. Vamos voltar para a tela anterior?
        </p>
        <button
          onClick={() => router.back()}
          className="bg-red-600 text-white py-3 px-6 rounded-lg text-lg font-bold hover:bg-red-700 transition cursor-pointer"
        >
          Voltar para a página anterior
        </button>
      </main>

      <footer className="bg-gray-900 py-4">
        <div className="container mx-auto text-center text-gray-400">
          <p>🎬 Boscov - Todos os direitos reservados © 2025</p>
          <p>Desenvolvido com ❤️ para amantes de cinema.</p>
        </div>
      </footer>
    </div>
  );
}