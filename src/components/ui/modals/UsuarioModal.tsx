import { useState, useEffect, useMemo } from "react";

type Usuario = {
    id?: number;
    nome: string;
    apelido?: string;
    email: string;
    dataNascimento: string;
    tipoUsuario: string;
    status?: number;
    senha?: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    onSave: (usuario: Partial<Usuario>) => void;
    usuario?: Usuario | null;
    isEdit?: boolean;
};

export default function UsuarioModal({ open, onClose, onSave, usuario, isEdit }: Props) {
    // Estado inicial para edição
    const initialForm = usuario
        ? {
            nome: usuario.nome,
            apelido: usuario.apelido || "",
            email: usuario.email,
            dataNascimento: usuario.dataNascimento?.slice(0, 10) || "",
            tipoUsuario: usuario.tipoUsuario,
            senha: "",
        }
        : {
            nome: "",
            apelido: "",
            email: "",
            dataNascimento: "",
            tipoUsuario: "comum",
            senha: "",
        };

    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Atualiza o form ao abrir para editar outro usuário
    useEffect(() => {
        setForm(initialForm);
        setError("");
        setSuccess(false);
        // eslint-disable-next-line
    }, [usuario, open]);

    // Detecta se houve alteração
    const hasChanged = useMemo(() => {
        if (!isEdit) return true;
        return (
            form.nome !== initialForm.nome ||
            form.apelido !== initialForm.apelido ||
            form.email !== initialForm.email ||
            form.dataNascimento !== initialForm.dataNascimento ||
            form.tipoUsuario !== initialForm.tipoUsuario
        );
    }, [form, initialForm, isEdit]);

    // Validação dos campos obrigatórios
    const isValid =
        form.nome.trim() !== "" &&
        form.email.trim() !== "" &&
        form.dataNascimento.trim() !== "" &&
        (isEdit || form.senha.trim() !== "");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setError("");
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) {
            setError("Preencha todos os campos obrigatórios.");
            return;
        }
        setError("");
        // Não envie senha vazia no update
        const dataToSend: Partial<Usuario> = { ...form };
        if (isEdit && !form.senha) {
            delete dataToSend.senha;
        }
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
                className="bg-gray-900 p-6 rounded-lg w-full max-w-md flex flex-col gap-4"
            >
                <h2 className="text-xl font-bold mb-2">{isEdit ? "Editar Usuário" : "Criar Usuário"}</h2>
                {error && <div className="text-red-400">{error}</div>}
                <input
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    placeholder="Nome*"
                    className="p-2 rounded bg-gray-800 text-white"
                />
                <input
                    name="apelido"
                    value={form.apelido || ""}
                    onChange={handleChange}
                    placeholder="Apelido"
                    className="p-2 rounded bg-gray-800 text-white"
                />
                <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email*"
                    type="email"
                    className="p-2 rounded bg-gray-800 text-white"
                />
                <input
                    name="dataNascimento"
                    value={form.dataNascimento}
                    onChange={handleChange}
                    placeholder="Data de Nascimento*"
                    type="date"
                    className="p-2 rounded bg-gray-800 text-white"
                />
                <select
                    name="tipoUsuario"
                    value={form.tipoUsuario}
                    onChange={handleChange}
                    className="p-2 rounded bg-gray-800 text-white"
                >
                    <option value="comum">Comum</option>
                    <option value="admin">Admin</option>
                </select>
                {!isEdit && (
                    <input
                        name="senha"
                        value={form.senha || ""}
                        onChange={handleChange}
                        placeholder="Senha*"
                        type="password"
                        className="p-2 rounded bg-gray-800 text-white"
                    />
                )}
                {success && (
                    <div className="text-green-400 text-center font-semibold">
                        Alterações salvas com sucesso!
                    </div>
                )}
                <div className="flex gap-2 justify-end mt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
                    >
                        Cancelar
                    </button>
                    {(!isEdit || hasChanged) && (
                        <button
                            type="submit"
                            className={`px-4 py-2 rounded bg-blue-700 hover:bg-blue-600 ${(!isValid || (isEdit && !hasChanged)) ? "opacity-50 cursor-not-allowed" : ""
                                }`}
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