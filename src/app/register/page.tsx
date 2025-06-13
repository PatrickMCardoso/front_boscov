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
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      return !isNaN(date.getTime()) && date <= today;
    }, { message: "O campo 'data de nascimento' deve ser uma data válida e não pode ser no futuro." }),
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
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    try {
      RegisterSchema.parse(formData);

      if (formData.senha !== formData.confirmSenha) {
        setFieldErrors({ confirmSenha: "As senhas não coincidem." });
        return;
      }

      await api.post("/usuario", {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        apelido: formData.apelido || undefined,
        dataNascimento: new Date(formData.dataNascimento),
      });

      router.push("/login");
    } catch (err: any) {
      if (err.errors) {
        // Erros de validação do Zod
        const errors: { [key: string]: string } = {};
        err.errors.forEach((e: any) => {
          errors[e.path[0]] = e.message;
        });
        setFieldErrors(errors);
      } else if (err.response?.data?.errors) {
        // Erros vindos do backend (array)
        const errors: { [key: string]: string } = {};
        err.response.data.errors.forEach((e: any) => {
          errors[e.field] = e.message;
        });
        setFieldErrors(errors);
      } else if (err.response?.data?.error) {
        // Erro geral do backend
        setError(err.response.data.error);
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
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
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
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 ${fieldErrors.nome ? "border-red-500" : "border-gray-600"}`}
                required
              />
              {fieldErrors.nome && <span className="text-red-400 text-xs">{fieldErrors.nome}</span>}
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
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 ${fieldErrors.email ? "border-red-500" : "border-gray-600"}`}
                required
              />
              {fieldErrors.email && <span className="text-red-400 text-xs">{fieldErrors.email}</span>}
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
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 ${fieldErrors.senha ? "border-red-500" : "border-gray-600"}`}
                required
              />
              {fieldErrors.senha && <span className="text-red-400 text-xs">{fieldErrors.senha}</span>}
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
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 ${fieldErrors.confirmSenha ? "border-red-500" : "border-gray-600"}`}
                required
              />
              {fieldErrors.confirmSenha && <span className="text-red-400 text-xs">{fieldErrors.confirmSenha}</span>}
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
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 ${fieldErrors.apelido ? "border-red-500" : "border-gray-600"}`}
              />
              {fieldErrors.apelido && <span className="text-red-400 text-xs">{fieldErrors.apelido}</span>}
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
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 ${fieldErrors.dataNascimento ? "border-red-500" : "border-gray-600"}`}
                required
              />
              {fieldErrors.dataNascimento && <span className="text-red-400 text-xs">{fieldErrors.dataNascimento}</span>}
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition font-bold cursor-pointer"
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