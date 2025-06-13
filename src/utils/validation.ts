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

export const UsuarioAdminSchema = z.object({
  nome: z
    .string()
    .min(1, { message: "O campo 'nome' é obrigatório." })
    .max(255, { message: "O campo 'nome' deve ter no máximo 255 caracteres." }),
  email: z
    .string()
    .email({ message: "O campo 'email' deve conter um endereço de e-mail válido." }),
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
  tipoUsuario: z.enum(["admin", "comum"]),
  senha: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." })
    .optional(), 
});

export const FilmeSchema = z.object({
  nome: z.string()
    .min(1, { message: 'O campo "nome" é obrigatório e deve conter pelo menos 1 caractere.' })
    .max(255, { message: 'O campo "nome" deve conter no máximo 255 caracteres.' }),

  diretor: z.string()
    .min(1, { message: 'O campo "diretor" é obrigatório e deve conter pelo menos 1 caractere.' })
    .max(255, { message: 'O campo "diretor" deve conter no máximo 255 caracteres.' }),

  anoLancamento: z.coerce.number()
    .int({ message: 'O campo "anoLancamento" deve ser um número inteiro.' })
    .min(1888, { message: 'O campo "anoLancamento" deve ser maior ou igual a 1888.' })
    .max(new Date().getFullYear(), { message: 'O campo "anoLancamento" não pode ser maior que o ano atual.' }),

  generoIds: z.array(z.number().int({ message: 'Cada gênero deve ser um número inteiro.' }))
    .min(1, { message: 'Selecione pelo menos um gênero.' }),

  duracao: z.coerce.number()
    .int({ message: 'O campo "duracao" deve ser um número inteiro.' })
    .min(1, { message: 'O campo "duracao" deve ser maior que 0.' }),

  produtora: z.string()
    .min(1, { message: 'O campo "produtora" é obrigatório e deve conter pelo menos 1 caractere.' })
    .max(255, { message: 'O campo "produtora" deve conter no máximo 255 caracteres.' }),

  classificacao: z.string()
    .refine((val) => /^(Livre|\d{1,2}\+)$/.test(val), {
      message: 'A classificação deve estar no formato "Livre", "10+", "18+", etc.',
    }),

  poster: z.string()
    .url({ message: 'O campo "poster" deve ser uma URL válida.' }),
});

