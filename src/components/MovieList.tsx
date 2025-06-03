import { useState } from "react";
import MovieCard from "@/components/ui/MovieCard";

type Movie = {
  id: number;
  nome: string;
  poster?: string;
  mediaAvaliacoes?: number;
};

export default function MovieList({ movies }: { movies: Movie[] }) {
  const [movieList, setMovieList] = useState(movies);

  // Atualiza a média de um filme no array sem reordenar
  const handleMediaChange = (id: number, newMedia: number) => {
    setMovieList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, mediaAvaliacoes: newMedia } : m))
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {movieList.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onMediaChange={(media) => handleMediaChange(movie.id, media)}
        />
      ))}
    </div>
  );
}