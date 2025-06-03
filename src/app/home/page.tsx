"use client";

import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";
import MovieCard from "@/components/ui/MovieCard";
import SearchBar from "@/components/ui/SearchBar";
import FilterSortMenu from "@/components/ui/FilterSortMenu";
import api from "@/services/api";
import useAuth from "@/hooks/useAuth";

type Movie = {
  id: number;
  nome: string;
  poster?: string;
  mediaAvaliacoes?: number;
  anoLancamento: number;
  generos?: { genero: { descricao: string } }[]; // para filtro de gênero
};

export default function HomePage() {
  const auth = useAuth();
  const [user, setUser] = useState(auth.user);
  const { token, isLoading, logout } = auth;
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{ order: string; genero: string }>({ order: "", genero: "" });

  // Atualiza o user local se mudar no contexto (ex: ao logar)
  useEffect(() => {
    setUser(auth.user);
  }, [auth.user]);

  useEffect(() => {
    if (token) {
      api
        .get("/filmes", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setMovies(response.data);
          console.log(response.data); // Veja no console do navegador
        })
        .catch((error) => console.error("Erro ao buscar filmes:", error));
    }
  }, [token]);

  const handleFilterChange = (newFilter: Record<string, string>) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilter }));
  };

  // Filtro e ordenação frontend
  function slugify(str: string) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }

  const filteredMovies = movies
    .filter((movie) =>
      movie.nome.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((movie) => {
      if (!filters.genero) return true;
      if (!movie.generos || movie.generos.length === 0) return false;
      return movie.generos.some((g) =>
        slugify(g.genero.descricao) === filters.genero
      );
    });

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (filters.order) {
      case "recentes":
        return b.anoLancamento - a.anoLancamento;
      case "antigos":
        return a.anoLancamento - b.anoLancamento;
      case "a-z":
        return a.nome.localeCompare(b.nome);
      case "z-a":
        return b.nome.localeCompare(a.nome);
      default:
        return 0;
    }
  });

  // Atualiza a média de avaliações de um filme no array local
  const handleMediaChange = (id: number, newMedia: number) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, mediaAvaliacoes: newMedia } : m))
    );
  };

  if (isLoading) {
    return <div className="text-white text-center">Carregando...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
      <Sidebar user={user} setUser={setUser} logout={logout} />
      <div className="flex-grow flex flex-col">
        <Header user={user} />
        <div className="p-4 flex items-center justify-between">
          <SearchBar onSearch={setSearchQuery} />
          <FilterSortMenu onFilterChange={handleFilterChange} selected={filters} />
        </div>
        <main className="p-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {sortedMovies.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 text-lg py-10">
              Nenhum filme encontrado para o filtro selecionado.
            </div>
          ) : (
            sortedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onMediaChange={(newMedia) => handleMediaChange(movie.id, newMedia)}
              />
            ))
          )}
        </main>
      </div>
    </div>
  );
}