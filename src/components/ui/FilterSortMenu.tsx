import React from "react";

type FilterSortMenuProps = {
  onFilterChange: (filters: Record<string, string>) => void; // Define o tipo da função
};

export default function FilterSortMenu({ onFilterChange }: FilterSortMenuProps) {
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value }); // Atualiza os filtros diretamente
  };

  return (
    <div className="flex items-center gap-4">
      <select
        name="order"
        onChange={handleFilterChange}
        className="p-2 rounded bg-gray-700 text-white"
      >
        <option value="">Ordenar</option>
        <option value="recentes">Mais recentes</option>
        <option value="antigos">Mais antigos</option>
        <option value="a-z">A-Z</option>
        <option value="z-a">Z-A</option>
      </select>
      <select
        name="genero"
        onChange={handleFilterChange}
        className="p-2 rounded bg-gray-700 text-white"
      >
        <option value="">Filtrar por gênero</option>
        <option value="acao">Ação</option>
        <option value="comedia">Comédia</option>
        <option value="drama">Drama</option>
      </select>
    </div>
  );
}