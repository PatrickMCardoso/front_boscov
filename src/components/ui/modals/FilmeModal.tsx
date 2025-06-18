import { useState, useEffect, useMemo } from "react";
import { FilmeSchema } from "@/utils/validation";

type Genero = {
    id: number;
    descricao: string;
};

type Filme = {
    id?: number;
    nome: string;
    diretor: string;
    anoLancamento: number | undefined;
    duracao: number | undefined;
    produtora: string;
    classificacao: string;
    poster: string;
    generoIds: number[];
};

type Props = {
    open: boolean;
    onClose: () => void;
    onSave: (filme: Partial<Filme> & { generoIds: number[] }) => void | Promise<void>;
    filme?: Partial<Filme> & { generos?: any[] };
    generos: Genero[];
    isEdit?: boolean;
};

export default function FilmeModal({ open, onClose, onSave, filme, generos, isEdit }: Props) {
    const initialForm = filme
        ? {
            nome: filme.nome ?? "",
            diretor: filme.diretor ?? "",
            anoLancamento:
                filme.anoLancamento !== undefined && filme.anoLancamento !== null
                    ? String(filme.anoLancamento)
                    : "",
            duracao:
                filme.duracao !== undefined && filme.duracao !== null
                    ? String(filme.duracao)
                    : "",
            produtora: filme.produtora ?? "",
            classificacao: filme.classificacao ?? "",
            poster: filme.poster ?? "",
            generoIds: (filme.generos ?? []).map((g: any) => g.genero.id),
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

    const [form, setForm] = useState<typeof initialForm>(initialForm);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setForm(initialForm);
        setError("");
        setSuccess(false);
        setFieldErrors({});
        setIsSaving(false);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setError("");
        setFieldErrors({});
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setFieldErrors({});
        setSuccess(false);

        try {
            // Converta para number ou undefined antes de validar e salvar
            const dataToValidate: Filme = {
                ...form,
                anoLancamento:
                    form.anoLancamento !== "" && form.anoLancamento !== undefined
                        ? Number(form.anoLancamento)
                        : undefined,
                duracao:
                    form.duracao !== "" && form.duracao !== undefined
                        ? Number(form.duracao)
                        : undefined,
            };
            FilmeSchema.parse(dataToValidate);

            setIsSaving(true);
            await onSave({
                ...dataToValidate,
                anoLancamento: dataToValidate.anoLancamento,
                duracao: dataToValidate.duracao,
            });
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setIsSaving(false);
                onClose();
            }, 1200);
        } catch (err: any) {
            setIsSaving(false);
            if (err.errors) {
                const errors: { [key: string]: string } = {};
                err.errors.forEach((e: any) => {
                    errors[e.path[0]] = e.message;
                });
                setFieldErrors(errors);
            } else {
                setError("Preencha todos os campos obrigatórios corretamente.");
            }
        }
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
                {fieldErrors.nome && <span className="text-red-400 text-xs">{fieldErrors.nome}</span>}
                <input
                    name="diretor"
                    value={form.diretor}
                    onChange={handleChange}
                    placeholder="Diretor*"
                    className="p-2 rounded bg-gray-800 text-white"
                />
                {fieldErrors.diretor && <span className="text-red-400 text-xs">{fieldErrors.diretor}</span>}
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
                {fieldErrors.anoLancamento && <span className="text-red-400 text-xs">{fieldErrors.anoLancamento}</span>}
                <input
                    name="duracao"
                    value={form.duracao}
                    onChange={handleChange}
                    placeholder="Duração (min)*"
                    type="number"
                    min={1}
                    className="p-2 rounded bg-gray-800 text-white"
                />
                {fieldErrors.duracao && <span className="text-red-400 text-xs">{fieldErrors.duracao}</span>}
                <input
                    name="produtora"
                    value={form.produtora}
                    onChange={handleChange}
                    placeholder="Produtora*"
                    className="p-2 rounded bg-gray-800 text-white"
                />
                {fieldErrors.produtora && <span className="text-red-400 text-xs">{fieldErrors.produtora}</span>}
                <input
                    name="classificacao"
                    value={form.classificacao}
                    onChange={handleChange}
                    placeholder="Classificação* (ex: Livre, 12+)"
                    className="p-2 rounded bg-gray-800 text-white"
                />
                {fieldErrors.classificacao && <span className="text-red-400 text-xs">{fieldErrors.classificacao}</span>}
                <input
                    name="poster"
                    value={form.poster}
                    onChange={handleChange}
                    placeholder="URL do Poster*"
                    className="p-2 rounded bg-gray-800 text-white"
                />
                {fieldErrors.poster && <span className="text-red-400 text-xs">{fieldErrors.poster}</span>}
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
                    {fieldErrors.generoIds && <span className="text-red-400 text-xs">{fieldErrors.generoIds}</span>}
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
                        disabled={isSaving}
                    >
                        Cancelar
                    </button>
                    {(!isEdit || hasChanged) && (
                        <button
                            type="submit"
                            className={`cursor-pointer px-4 py-2 rounded bg-blue-700 hover:bg-blue-600 ${isSaving || (isEdit && !hasChanged) ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={isSaving || (isEdit && !hasChanged)}
                        >
                            {isSaving ? "Salvando..." : "Salvar"}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}