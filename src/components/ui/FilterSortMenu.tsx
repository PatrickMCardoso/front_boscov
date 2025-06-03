import React, { useState, useRef, useEffect } from "react";
import { FunnelIcon, BarsArrowDownIcon } from "@heroicons/react/24/outline";

type FilterSortMenuProps = {
  onFilterChange: (filters: Record<string, string>) => void;
  selected: { order: string; genero: string };
};

const generos = [
  { value: "acao", label: "Ação" },
  { value: "comedia", label: "Comédia" },
  { value: "terror", label: "Terror" },
  { value: "drama", label: "Drama" },
  { value: "aventura", label: "Aventura" },
  { value: "romance", label: "Romance" },
  { value: "suspense", label: "Suspense" },
  { value: "musical", label: "Musical" },
  { value: "ficcao-cientifica", label: "Ficção Científica" },
  { value: "historico", label: "Histórico" },
  { value: "documentario", label: "Documentário" },
  { value: "animacao", label: "Animação" },
];

const sortOptions = [
  { value: "recentes", label: "Mais recentes" },
  { value: "antigos", label: "Mais antigos" },
  { value: "a-z", label: "A-Z" },
  { value: "z-a", label: "Z-A" },
];

export default function FilterSortMenu({ onFilterChange, selected }: FilterSortMenuProps) {
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sortRef.current &&
        !sortRef.current.contains(event.target as Node)
      ) {
        setShowSort(false);
      }
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSortChange = (value: string) => {
    onFilterChange({ order: value });
    setShowSort(false);
  };

  const handleGeneroChange = (value: string) => {
    onFilterChange({ genero: value });
    setShowFilter(false);
  };

  return (
    <div className="flex items-center gap-4 relative">
      {/* Ordenar */}
      <div ref={sortRef} className="relative">
        <button
          type="button"
          className="flex items-center gap-1 p-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition"
          onClick={() => setShowSort((v) => !v)}
          aria-label="Ordenar"
        >
          <BarsArrowDownIcon className="w-5 h-5" />
          <span className="hidden sm:inline text-sm">{selected.order ? sortOptions.find(o => o.value === selected.order)?.label : "Ordenar"}</span>
        </button>
        {showSort && (
          <div className="absolute right-0 mt-2 w-44 bg-gray-800 rounded shadow-lg z-20">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                className={`block w-full text-left px-4 py-2 hover:bg-gray-700 text-white ${selected.order === opt.value ? "bg-gray-700 font-bold" : ""}`}
                onClick={() => handleSortChange(opt.value)}
              >
                {opt.label}
              </button>
            ))}
            <button
              className={`block w-full text-left px-4 py-2 hover:bg-gray-700 text-white ${!selected.order ? "bg-gray-700 font-bold" : ""}`}
              onClick={() => handleSortChange("")}
            >
              Limpar ordenação
            </button>
          </div>
        )}
      </div>
      {/* Filtro de gênero */}
      <div ref={filterRef} className="relative">
        <button
          type="button"
          className="flex items-center gap-1 p-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition"
          onClick={() => setShowFilter((v) => !v)}
          aria-label="Filtrar por gênero"
        >
          <FunnelIcon className="w-5 h-5" />
          <span className="hidden sm:inline text-sm">{selected.genero ? generos.find(g => g.value === selected.genero)?.label : "Gênero"}</span>
        </button>
        {showFilter && (
          <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded shadow-lg z-20 max-h-72 overflow-y-auto">
            <button
              className={`block w-full text-left px-4 py-2 hover:bg-gray-700 text-white ${!selected.genero ? "bg-gray-700 font-bold" : ""}`}
              onClick={() => handleGeneroChange("")}
            >
              Todos os gêneros
            </button>
            {generos.map((g) => (
              <button
                key={g.value}
                className={`block w-full text-left px-4 py-2 hover:bg-gray-700 text-white ${selected.genero === g.value ? "bg-gray-700 font-bold" : ""}`}
                onClick={() => handleGeneroChange(g.value)}
              >
                {g.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}