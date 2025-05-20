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
  
    return (
      <div className="bg-gray-800 p-4 rounded shadow-lg flex flex-col gap-2">
        <img
          src={movie.poster || "/default-poster.png"}
          alt={movie.nome}
          className="w-full h-48 object-cover rounded"
        />
        <h3 className="text-lg font-bold">{movie.nome}</h3>
        <p className="text-sm text-gray-400">Média: {movie.mediaAvaliacoes || "N/A"}</p>
        <button
          onClick={handleEvaluate}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Avaliar
        </button>
      </div>
    );
  }