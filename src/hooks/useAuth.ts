import { useState, useEffect } from "react";

export default function useAuth() {
  const [user, setUser] = useState<{
    id: number;
    nome: string;
    apelido?: string;
    email: string;
    dataNascimento: string;
    tipoUsuario: string;
  } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega o token e os dados do usuário do localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Erro ao analisar o JSON do usuário:", error);
        localStorage.removeItem("user");
      }
    }

    setIsLoading(false);
  }, []);

  // Salva o token e os dados do usuário no localStorage
  const login = (userData: any, token: string) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Remove o token e os dados do usuário do localStorage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return { user, token, isLoading, login, logout };
}