import { useState } from "react";
import MovieEvaluateModal from "./modals/MovieEvaluateModal";
import MovieDetailsModal from "./modals/MovieDetailsModal";

type Movie = {
  id: number;
  nome: string;
  poster?: string;
  mediaAvaliacoes?: number;
};

export default function MovieCard({ movie, onMediaChange }: { movie: Movie, onMediaChange?: (media: number) => void }) {
  const [isEvaluateOpen, setIsEvaluateOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [media, setMedia] = useState(movie.mediaAvaliacoes ?? 0);

  // Exemplo de estrelas (fixo, só para visual)
  function renderStaticStars(media = 0) {
    const safeMedia = Math.max(0, Math.min(10, media));
    const fullStars = Math.floor(safeMedia / 2);
    const halfStar = safeMedia % 2 >= 1;
    const totalStars = 5;

    return (
      <span className="flex items-center gap-1">
        {[...Array(totalStars)].map((_, i) => {
          if (i < fullStars) {
            return (
              <span key={i} className="relative w-5 h-5 inline-block">
                <svg className="w-5 h-5 text-gray-500 absolute left-0 top-0" fill="currentColor" viewBox="0 0 20 20">
                  <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400 absolute left-0 top-0" fill="currentColor" viewBox="0 0 20 20">
                  <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36" />
                </svg>
              </span>
            );
          } else if (i === fullStars && halfStar) {
            return (
              <span key={i} className="relative w-5 h-5 inline-block">
                <svg className="w-5 h-5 text-gray-500 absolute left-0 top-0" fill="currentColor" viewBox="0 0 20 20">
                  <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400 absolute left-0 top-0" fill="currentColor" viewBox="0 0 20 20" style={{ clipPath: "inset(0 50% 0 0)" }}>
                  <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36" />
                </svg>
              </span>
            );
          } else {
            return (
              <span key={i} className="relative w-5 h-5 inline-block">
                <svg className="w-5 h-5 text-gray-500 absolute left-0 top-0" fill="currentColor" viewBox="0 0 20 20">
                  <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36" />
                </svg>
              </span>
            );
          }
        })}
      </span>
    );
  }

  // Atualiza a média local e notifica o MovieList/HomePage
  const handleMediaChange = (newMedia: number) => {
    setMedia(newMedia);
    if (onMediaChange) onMediaChange(newMedia);
  };

  return (
    <>
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col gap-3 transition-transform hover:scale-105">
        <div className="w-full max-w-[150px] mx-auto aspect-[2/3] bg-gray-700 rounded overflow-hidden flex items-center justify-center">
          <img
            src={movie.poster || "/default-poster.png"}
            alt={movie.nome}
            className="object-cover w-full h-full"
          />
        </div>
        <h3 className="text-lg font-bold truncate" title={movie.nome}>
          {movie.nome}
        </h3>
        <div className="flex items-center gap-2">
          {renderStaticStars(media)}
          <span className="text-yellow-300 font-semibold text-sm">
            {media !== undefined ? media.toFixed(1) : "--"}
          </span>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setIsEvaluateOpen(true)}
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 font-semibold transition w-full cursor-pointer"
          >
            Avaliar
          </button>
          <button
            onClick={() => setIsDetailsOpen(true)}
            className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 font-semibold transition w-full cursor-pointer"
          >
            Detalhes
          </button>
        </div>
      </div>
      {isEvaluateOpen && (
        <MovieEvaluateModal
          movie={movie}
          onClose={() => setIsEvaluateOpen(false)}
          onSuccess={handleMediaChange}
        />
      )}
      {isDetailsOpen && (
        <MovieDetailsModal
          movieId={movie.id}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}
    </>
  );
}