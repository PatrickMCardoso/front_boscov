import { useState, useEffect, useMemo } from "react";

type Genero = {
    id: number;
    descricao: string;
};

type Filme = {
    id?: number;
    nome: string;
    diretor: string;
    anoLancamento: number;
    duracao: number;
    produtora: string;
    classificacao: string;
    poster: string;
    generoIds: number[];
};

type Props = {
    open: boolean;
    onClose: () => void;
    onSave: (filme: Partial<Filme> & { generoIds: number[] }) => void;
    filme?: any;
    generos: Genero[];
    isEdit?: boolean;
};

export default function FilmeModal({ open, onClose, onSave, filme, generos, isEdit }: Props) {
    const initialForm: Filme = filme
        ? {
            nome: filme.nome,
            diretor: filme.diretor,
            anoLancamento: filme.anoLancamento,
            duracao: filme.duracao,
            produtora: filme.produtora,
            classificacao: filme.classificacao,
            poster: filme.poster,
            generoIds: filme.generos.map((g: any) => g.genero.id),
        }
        : {
            nome: "",
            diretor: "",
            anoLancamento: "",
            duracao: "",
            produtora: "",
            classificacao: "",
            poster: "",
            generoIds: [],
        };

    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setForm(initialForm);
        setError("");
        setSuccess(false);
        // eslint-disable-next-line
    }, [filme, open]);

    // Detecta se houve alteração
    const hasChanged = useMemo(() => {
        if (!isEdit) return true;
        return (
            form.nome !== initialForm.nome ||
            form.diretor !== initialForm.diretor ||
            String(form.anoLancamento) !== String(initialForm.anoLancamento) ||
            String(form.duracao) !== String(initialForm.duracao) ||
            form.produtora !== initialForm.produtora ||
            form.classificacao !== initialForm.classificacao ||
            form.poster !== initialForm.poster ||
            JSON.stringify(form.generoIds.sort()) !== JSON.stringify((initialForm.generoIds || []).sort())
        );
    }, [form, initialForm, isEdit]);

    const isValid =
        form.nome.trim() !== "" &&
        form.diretor.trim() !== "" &&
        form.anoLancamento &&
        form.duracao > 0 &&
        form.produtora.trim() !== "" &&
        form.classificacao.trim() !== "" &&
        form.poster.trim() !== "" &&
        form.generoIds.length > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setError("");
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleGeneroChange = (id: number) => {
        setForm((prev) => ({
            ...prev,
            generoIds: prev.generoIds.includes(id)
                ? prev.generoIds.filter((gid) => gid !== id)
                : [...prev.generoIds, id],
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) {
            setError("Preencha todos os campos obrigatórios.");
            return;
        }
        setError("");
        const dataToSend = {
            ...form,
            anoLancamento: Number(form.anoLancamento),
            duracao: Number(form.duracao),
        };
        onSave(dataToSend);
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            onClose();
        }, 1200);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-900 p-6 rounded-lg w-full max-w-lg flex flex-col gap-4"
            >
                <h2 className="text-xl font-bold mb-2">{isEdit ? "Editar Filme" : "Criar Filme"}</h2>
                {error && <div className="text-red-400">{error}</div>}
                <input
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    placeholder="Nome*"
                    className="p-2 rounded bg-gray-800 text-white"
                />
                <input
                    name="diretor"
                    value={form.diretor}
                    onChange={handleChange}
                    placeholder="Diretor*"
                    className="p-2 rounded bg-gray-800 text-white"
                />
                <input
                    name="anoLancamento"
                    value={form.anoLancamento}
                    onChange={handleChange}
                    placeholder="Ano de Lançamento*"
                    type="number"
                    min={1888}
                    max={new Date().getFullYear()}
                    className="p-2 rounded bg-gray-800 text-white"
                />
                <input
                    name="duracao"
                    value={form.duracao}
                    onChange={handleChange}
                    placeholder="Duração (min)*"
                    type="number"
                    min={1}
                    className="p-2 rounded bg-gray-800 text-white"
                />
                <input
                    name="produtora"
                    value={form.produtora}
                    onChange={handleChange}
                    placeholder="Produtora*"
                    className="p-2 rounded bg-gray-800 text-white"
                />
                <input
                    name="classificacao"
                    value={form.classificacao}
                    onChange={handleChange}
                    placeholder="Classificação* (ex: Livre, 12+)"
                    className="p-2 rounded bg-gray-800 text-white"
                />
                <input
                    name="poster"
                    value={form.poster}
                    onChange={handleChange}
                    placeholder="URL do Poster*"
                    className="p-2 rounded bg-gray-800 text-white"
                />
                <div>
                    <label className="block text-gray-300 mb-1">Gêneros*</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {generos.map((g) => (
                            <label key={g.id} className="flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    checked={form.generoIds.includes(g.id)}
                                    onChange={() => handleGeneroChange(g.id)}
                                    className="accent-red-600"
                                />
                                <span>{g.descricao}</span>
                            </label>
                        ))}
                    </div>
                </div>
                {success && (
                    <div className="text-green-400 text-center font-semibold">
                        Alterações salvas com sucesso!
                    </div>
                )}
                <div className="flex gap-2 justify-end mt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 cursor-pointer"
                    >
                        Cancelar
                    </button>
                    {(!isEdit || hasChanged) && (
                        <button
                            type="submit"
                            className={`cursor-pointer px-4 py-2 rounded bg-blue-700 hover:bg-blue-600 ${!isValid || (isEdit && !hasChanged) ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={!isValid || (isEdit && !hasChanged)}
                        >
                            Salvar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}