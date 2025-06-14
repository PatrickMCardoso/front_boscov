import { useState } from "react";
import MovieCard from "@/components/ui/MovieCard";
import api from "@/services/api";

type Movie = {
  id: number;
  nome: string;
  poster?: string;
  mediaAvaliacoes?: number;
};

export default function MovieList({ movies }: { movies: Movie[] }) {
  const [movieList, setMovieList] = useState(movies);

  // Busca o filme atualizado do backend e substitui o objeto inteiro no array
  const handleMediaChange = async (id: number, _newMedia: number) => {
    const res = await api.get(`/filme/${id}`);
    setMovieList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...res.data } : m))
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {movieList.map((movie) => (
        <MovieCard
          key={movie.id + '-' + (movie.mediaAvaliacoes ?? 0)} // força re-render
          movie={movie}
          onMediaChange={(media) => handleMediaChange(movie.id, media)}
        />
      ))}
    </div>
  );
}