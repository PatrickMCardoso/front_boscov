"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import LoginForm from "@/components/Auth/LoginForm";

export default function LoginPage() {
  const [token, setToken] = useState<string | null>(null);

  const handleLoginSuccess = (token: string) => {
    setToken(token);
    localStorage.setItem("token", token); // Armazena o token no localStorage
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
      {/* Header */}
      <Header title="🎥 BOSCOV" />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Bem-vindo ao Boscov</h2>
          <p className="text-center mb-6 text-gray-300">
            Faça login para acessar sua conta e explorar o mundo do cinema!
          </p>
          {token ? (
            <p className="text-green-500 text-center">Login realizado com sucesso!</p>
          ) : (
            <LoginForm onSuccess={handleLoginSuccess} />
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}