import { z } from "zod";

// Esquema de registro de usuário
export const RegisterSchema = z.object({
  nome: z
    .string()
    .min(1, { message: "O campo 'nome' é obrigatório." })
    .max(255, { message: "O campo 'nome' deve ter no máximo 255 caracteres." }),
  email: z
    .string()
    .email({ message: "O campo 'email' deve conter um endereço de e-mail válido." }),
  senha: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  confirmSenha: z
    .string()
    .min(6, { message: "A confirmação de senha deve ter pelo menos 6 caracteres." }),
  apelido: z
    .string()
    .max(100, { message: "O campo 'apelido' deve ter no máximo 100 caracteres." })
    .optional(),
  dataNascimento: z
    .string()
    .refine((val) => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return !isNaN(date.getTime()) && date <= today;
    }, { message: "O campo 'data de nascimento' deve ser uma data válida e não pode ser no futuro." }),
});

// Exporte outros schemas conforme necessário, por exemplo:
// export const LoginSchema = ...
// export const FilmeSchema = ...