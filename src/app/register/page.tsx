"use client";

import { useState } from "react";
import { z } from "zod";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import api from "@/services/api";
import { useRouter } from "next/navigation";

// Esquema de validação com Zod
const RegisterSchema = z.object({
  nome: z
    .string()
    .min(1, { message: "O campo 'nome' é obrigatório." })
    .max(255, { message: "O campo 'nome' deve ter no máximo 255 caracteres." }),
  email: z
    .string()
    .email({ message: "O campo 'email' deve conter um endereço de e-mail válido." }),
  senha: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  confirmSenha: z
    .string()
    .min(6, { message: "A confirmação de senha deve ter pelo menos 6 caracteres." }),
  apelido: z
    .string()
    .max(100, { message: "O campo 'apelido' deve ter no máximo 100 caracteres." })
    .optional(),
  dataNascimento: z
    .string()
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, { message: "O campo 'data de nascimento' deve ser uma data válida." }),
});

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmSenha: "",
    apelido: "",
    dataNascimento: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Valida os dados do formulário
      RegisterSchema.parse({
        ...formData,
      });

      if (formData.senha !== formData.confirmSenha) {
        throw new Error("As senhas não coincidem.");
      }

      // Envia os dados para o backend
      await api.post("/usuario", {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        apelido: formData.apelido || undefined,
        dataNascimento: new Date(formData.dataNascimento), // Converte para Date
      });

      // Redireciona para a página de login após o registro
      router.push("/login");
    } catch (err: any) {
      if (err.errors) {
        // Erros de validação do Zod
        setError(err.errors[0].message);
      } else {
        setError(err.message || "Ocorreu um erro inesperado. Tente novamente.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
      {/* Header */}
      <Header title="🎥 BOSCOV" />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Registrar-se</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-300">
                Nome
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-300">
                Senha
              </label>
              <input
                type="password"
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmSenha" className="block text-sm font-medium text-gray-300">
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmSenha"
                name="confirmSenha"
                value={formData.confirmSenha}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-300">
                Data de Nascimento
              </label>
              <input
                type="date"
                id="dataNascimento"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition font-bold"
            >
              Registrar
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}