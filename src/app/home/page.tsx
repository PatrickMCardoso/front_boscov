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
};

export default function HomePage() {
    const { user, token, logout } = useAuth();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Record<string, string>>({}); // Tipagem do estado de filtros

    // Redireciona para login se o token não estiver presente
    useEffect(() => {
        if (!token) {
            window.location.href = "/login";
        }
    }, [token]);

    // Busca os filmes
    useEffect(() => {
        if (token) {
            api
                .get("/filmes", {
                    params: { search: searchQuery, ...filters },
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => setMovies(response.data))
                .catch((error) => console.error(error));
        }
    }, [searchQuery, filters, token]);

    const handleFilterChange = (newFilter: Record<string, string>) => {
        setFilters((prevFilters) => ({ ...prevFilters, ...newFilter })); // Combina os filtros anteriores com os novos
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
            {/* Sidebar */}
            <Sidebar user={user} logout={logout} />

            {/* Main Content */}
            <div className="flex-grow flex flex-col">
                {/* Header */}
                <Header user={user} />

                {/* Search and Filter */}
                <div className="p-4 flex items-center justify-between">
                    <SearchBar onSearch={(query) => setSearchQuery(query)} />
                    <FilterSortMenu onFilterChange={handleFilterChange} />
                </div>

                {/* Movie List */}
                <main className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </main>
            </div>
        </div>
    );
}