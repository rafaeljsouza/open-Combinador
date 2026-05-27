# Combinador (Open-Source Edition)

## English

Combinador connects public managers and researchers to co-create open solutions for real public-sector challenges.

Originally done using Firebase, This edition is fully migrated away from Firebase/Google runtime services and uses a self-hostable open-source stack with Supabase.

### Repository

- Main repository: `[https://github.com/your-org/combinador](https://github.com/rafaeljsouza/open-Combinador)` 
- Creator: Rafael Souza

### Stack

- Frontend: React + Vite
- Backend: Supabase (Auth + Postgres + RLS)
- Styling: Tailwind CSS

### Local setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and set:

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_<your_key>
```

3. Run SQL schema in Supabase SQL Editor:

- `supabase/schema.sql`

4. Start the app:

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Contributing

- Read `CONTRIBUTING.md`
- Read `CODE_OF_CONDUCT.md`
- Follow the open-source/self-hostable direction
- Run `npm run build` before opening a PR

### Security notes

- Frontend must use only `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Never expose `SUPABASE_SECRET_KEY` in frontend environment variables.

## Português

O Combinador conecta gestores públicos e pesquisadores para co-criar soluções abertas para desafios reais do setor público.

Originalmente feito com Firebase, esta edição foi totalmente migrada para fora de serviços Google/Firebase em runtime e usa uma stack open-source auto-hospedável com Supabase.

### Repositório

- Repositório principal: `[https://github.com/your-org/combinador`](https://github.com/rafaeljsouza/open-Combinador) (placeholder)
- Criador: Rafael Souza

### Stack

- Frontend: React + Vite
- Backend: Supabase (Auth + Postgres + RLS)
- Estilização: Tailwind CSS

### Configuração local

1. Instale dependências:

```bash
npm install
```

2. Crie o `.env` a partir de `.env.example` e configure:

```env
VITE_SUPABASE_URL=https://<seu-project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_<sua_chave>
```

3. Execute o schema SQL no Supabase SQL Editor:

- `supabase/schema.sql`

4. Inicie a aplicação:

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Contribuição

- Leia `CONTRIBUTING.md`
- Leia `CODE_OF_CONDUCT.md`
- Siga a direção open-source e auto-hospedável do projeto
- Execute `npm run build` antes de abrir PR

### Notas de segurança

- O frontend deve usar apenas `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Nunca exponha `SUPABASE_SECRET_KEY` em variáveis de ambiente do frontend.
