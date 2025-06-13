import { useState, useEffect, useMemo } from "react";
import { UsuarioAdminSchema } from "@/utils/validation";

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
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        setForm(initialForm);
        setError("");
        setSuccess(false);
        setFieldErrors({});
        // eslint-disable-next-line
    }, [usuario, open]);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setError("");
        setFieldErrors({});
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setFieldErrors({});
        try {
            const dataToValidate: { [key: string]: any } = { ...form };
            if (isEdit) delete dataToValidate.senha;
            UsuarioAdminSchema.parse(dataToValidate);

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
        } catch (err: any) {
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
                {fieldErrors.nome && <span className="text-red-400 text-xs">{fieldErrors.nome}</span>}
                <input
                    name="apelido"
                    value={form.apelido || ""}
                    onChange={handleChange}
                    placeholder="Apelido"
                    className="p-2 rounded bg-gray-800 text-white"
                />
                {fieldErrors.apelido && <span className="text-red-400 text-xs">{fieldErrors.apelido}</span>}
                <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email*"
                    type="email"
                    className="p-2 rounded bg-gray-800 text-white"
                />
                {fieldErrors.email && <span className="text-red-400 text-xs">{fieldErrors.email}</span>}
                <input
                    name="dataNascimento"
                    value={form.dataNascimento}
                    onChange={handleChange}
                    placeholder="Data de Nascimento*"
                    type="date"
                    className="p-2 rounded bg-gray-800 text-white"
                />
                {fieldErrors.dataNascimento && <span className="text-red-400 text-xs">{fieldErrors.dataNascimento}</span>}
                <select
                    name="tipoUsuario"
                    value={form.tipoUsuario}
                    onChange={handleChange}
                    className="p-2 rounded bg-gray-800 text-white"
                >
                    <option value="comum">Comum</option>
                    <option value="admin">Admin</option>
                </select>
                {fieldErrors.tipoUsuario && <span className="text-red-400 text-xs">{fieldErrors.tipoUsuario}</span>}
                {!isEdit && (
                    <>
                        <input
                            name="senha"
                            value={form.senha || ""}
                            onChange={handleChange}
                            placeholder="Senha*"
                            type="password"
                            className="p-2 rounded bg-gray-800 text-white"
                        />
                        {fieldErrors.senha && <span className="text-red-400 text-xs">{fieldErrors.senha}</span>}
                    </>
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
                        className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 cursor-pointer"
                    >
                        Cancelar
                    </button>
                    {(!isEdit || hasChanged) && (
                        <button
                            type="submit"
                            className={`px-4 py-2 cursor-pointer rounded bg-blue-700 hover:bg-blue-600 ${(!form.nome || !form.email || !form.dataNascimento || (!isEdit && !form.senha) || (isEdit && !hasChanged)) ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            disabled={!form.nome || !form.email || !form.dataNascimento || (!isEdit && !form.senha) || (isEdit && !hasChanged)}
                        >
                            Salvar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}