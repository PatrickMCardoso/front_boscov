type SearchBarProps = {
    onSearch: (query: string) => void; // Define o tipo da função onSearch
  };
  
  export default function SearchBar({ onSearch }: SearchBarProps) {
    return (
      <input
        type="text"
        placeholder="Buscar filmes..."
        onChange={(e) => onSearch(e.target.value)} // Chama a função onSearch com o valor digitado
        className="w-full max-w-md p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    );
  }