import MovieCard from "@/components/ui/MovieCard";

type Movie = {
  id: number;
  nome: string;
  poster?: string;
  mediaAvaliacoes?: number;
};

export default function MovieList({ movies }: { movies: Movie[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}