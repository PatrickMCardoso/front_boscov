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
    const { user, token, isLoading, logout } = useAuth();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!isLoading && !token) {
            window.location.href = "/login";
        }
    }, [isLoading, token]);

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
        setFilters((prevFilters) => ({ ...prevFilters, ...newFilter }));
    };

    if (isLoading) {
        return <div className="text-white text-center">Carregando...</div>;
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
            <Sidebar user={user} logout={logout} />
            <div className="flex-grow flex flex-col">
                <Header user={user} />
                <div className="p-4 flex items-center justify-between">
                    <SearchBar onSearch={(query) => setSearchQuery(query)} />
                    <FilterSortMenu onFilterChange={handleFilterChange} />
                </div>
                <main className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </main>
            </div>
        </div>
    );
}