# Combinador (Open-Source Edition)

## English

Combinador connects public managers and researchers to co-create open solutions for real public-sector challenges.

This edition is fully migrated away from Firebase/Google runtime services and uses a self-hostable open-source stack with Supabase.

### Repository

- Main repository: `https://github.com/your-org/combinador` (placeholder)
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

### Migration notes

- See `docs/MIGRATION_TO_OPEN_SOURCE.md`

## Portugues

O Combinador conecta gestores publicos e pesquisadores para co-criar solucoes abertas para desafios reais do setor publico.

Esta edicao foi totalmente migrada para fora de servicos Google/Firebase em runtime e usa uma stack open-source auto-hospedavel com Supabase.

### Repositorio

- Repositorio principal: `https://github.com/your-org/combinador` (placeholder)
- Criador: Rafael Souza

### Stack

- Frontend: React + Vite
- Backend: Supabase (Auth + Postgres + RLS)
- Estilizacao: Tailwind CSS

### Configuracao local

1. Instale dependencias:

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

4. Inicie a aplicacao:

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Contribuicao

- Leia `CONTRIBUTING.md`
- Leia `CODE_OF_CONDUCT.md`
- Siga a direcao open-source e auto-hospedavel do projeto
- Execute `npm run build` antes de abrir PR

### Notas de seguranca

- O frontend deve usar apenas `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Nunca exponha `SUPABASE_SECRET_KEY` em variaveis de ambiente do frontend.

### Notas de migracao

- Veja `docs/MIGRATION_TO_OPEN_SOURCE.md`
