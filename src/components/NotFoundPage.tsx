"use client";

import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="bg-red-600 py-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-3xl font-bold tracking-wide">🎥 Boscov</h1>
          <nav>
            <Link href="/" className="text-white hover:underline">
              Voltar para Home
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <p className="text-2xl font-semibold mb-6">
          Oops! Página não encontrada.
        </p>
        <p className="text-gray-300 mb-8">
          Parece que você se perdeu no mundo do cinema. Vamos voltar para a tela inicial?
        </p>
        <Link
          href="/"
          className="bg-red-600 text-white py-3 px-6 rounded-lg text-lg font-bold hover:bg-red-700 transition"
        >
          Voltar para Home
        </Link>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-4">
        <div className="container mx-auto text-center text-gray-400">
          <p>🎬 Boscov - Todos os direitos reservados © 2025</p>
          <p>Desenvolvido com ❤️ para amantes de cinema.</p>
        </div>
      </footer>
    </div>
  );
}