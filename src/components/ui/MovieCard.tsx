type Movie = {
  id: number;
  nome: string;
  poster?: string;
  mediaAvaliacoes?: number;
};

export default function MovieCard({ movie }: { movie: Movie }) {
  const handleEvaluate = () => {
    // Abrir modal para avaliar
    console.log(`Avaliar filme: ${movie.nome}`);
  };

  // Exemplo de estrelas (fixo, só para visual)
  const renderStars = (media = 0) => {
    // Garante que media fique entre 0 e 5
    const safeMedia = Math.max(0, Math.min(5, media));
    const fullStars = Math.floor(safeMedia);
    const halfStar = safeMedia % 1 >= 0.5;
    const emptyStars = Math.max(0, 5 - fullStars - (halfStar ? 1 : 0));
    return (
      <span className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36" />
          </svg>
        ))}
        {halfStar && (
          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" stopOpacity="1" />
              </linearGradient>
            </defs>
            <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36" fill="url(#half)" />
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36" />
          </svg>
        ))}
      </span>
    );
  };

  return (
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
        {renderStars(movie.mediaAvaliacoes || 0)}
        <span className="text-yellow-300 font-semibold text-sm">
          {movie.mediaAvaliacoes !== undefined ? movie.mediaAvaliacoes.toFixed(1) : "--"}
        </span>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleEvaluate}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 font-semibold transition w-full cursor-pointer"
        >
          Avaliar
        </button>
        <button
          // onClick={handleDetails} // Implemente depois
          className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 font-semibold transition w-full cursor-pointer"
          disabled
        >
          Detalhes
        </button>
      </div>
    </div>
  );
}