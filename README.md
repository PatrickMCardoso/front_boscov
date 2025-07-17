# FRONT_BOSCOV

A interface web moderna para o sistema de avaliações de filmes Boscov.

> **Atenção:** Este repositório é o frontend do sistema. Para o backend (API e banco de dados), utilize também o repositório [back_boscov](../back_boscov) — ambos se complementam para a experiência completa!

---

## Índice

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura e Estrutura](#arquitetura-e-estrutura)
- [Como Rodar o Projeto](#como-rodar-o-projeto)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Execução](#execução)
- [Boas Práticas Adotadas](#boas-práticas-adotadas)
- [Complemento Backend](#complemento-backend)
- [Licença](#licença)

---

## Visão Geral

O `front_boscov` é uma aplicação web desenvolvida em Next.js e React, com autenticação, rotas protegidas, componentes reutilizáveis e integração total com a API do backend. Permite que usuários avaliem filmes, visualizem avaliações, cadastrem-se e façam login de forma segura.

---

## Tecnologias Utilizadas

- **Next.js** — Framework React para SSR/SSG e rotas automáticas
- **React** — Componentização e hooks
- **TypeScript** — Tipagem estática
- **Axios** — Requisições HTTP
- **ESLint** — Padronização de código
- **PostCSS** — Processamento de CSS
- **Tailwind CSS** (ou classes utilitárias) — Estilização moderna
- **LocalStorage** — Persistência de autenticação
- **Componentes customizados** — UI, modais, formulários, etc.

---

## Arquitetura e Estrutura

```
front_boscov/
│
├── public/                # Imagens, ícones e assets estáticos
├── src/
│   ├── app/               # Páginas e rotas do Next.js
│   ├── components/        # Componentes reutilizáveis (UI, modais, auth, comuns)
│   ├── hooks/             # Hooks customizados (ex: useAuth)
│   ├── services/          # Serviços de API (ex: api.ts)
│   ├── styles/            # Estilos globais
│   └── utils/             # Funções utilitárias (ex: validação)
├── package.json
├── tsconfig.json
└── ...
```

---

## Como Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- Backend rodando ([back_boscov](../back_boscov))

### Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/front_boscov.git
   cd front_boscov
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente (opcional):**
   - Por padrão, a API espera o backend em `http://localhost:3030`.  
     Se necessário, edite o arquivo `src/services/api.ts` para alterar o endereço.

### Execução

```bash
npm run dev
```
O frontend estará disponível em `http://localhost:3000`.

---

## Boas Práticas Adotadas

- **Componentização e reutilização:** UI modular e fácil de manter.
- **Hooks customizados:** lógica de autenticação centralizada (`useAuth`).
- **Tipagem forte:** uso de TypeScript em todo o projeto.
- **Padronização de código:** ESLint, organização de pastas e nomes claros.
- **Persistência segura:** autenticação via JWT e armazenamento local.
- **Tratamento de erros:** interceptação de respostas HTTP e redirecionamento automático.
- **Estilização moderna:** uso de classes utilitárias e responsividade.
- **Rotas protegidas:** controle de acesso por tipo de usuário.

---

## Complemento Backend

> **Importante:** Para funcionamento completo, utilize também o repositório [back_boscov](../back_boscov).  
> Os dois projetos se integram para fornecer a experiência completa de avaliação de filmes.

---

## Licença

Este projeto está sob a licença MIT.

