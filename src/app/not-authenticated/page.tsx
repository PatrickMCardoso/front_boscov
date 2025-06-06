"use client";
import Link from "next/link";

export default function NotAuthenticated() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
      <header className="bg-red-600 py-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-3xl font-bold tracking-wide">🎥 Boscov</h1>
        </div>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl font-bold text-red-500 mb-4">401</h1>
        <p className="text-2xl font-semibold mb-6">Não autenticado</p>
        <p className="text-gray-300 mb-8">
          Você precisa estar logado para acessar esta página.
        </p>
        <Link href="/login">
          <button className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-red-700 transition cursor-pointer">
            Ir para Login
          </button>
        </Link>
      </main>
      <footer className="bg-gray-900 py-4">
        <div className="container mx-auto text-center text-gray-400">
          <p>🎬 Boscov - Todos os direitos reservados © 2025</p>
        </div>
      </footer>
    </div>
  );
}