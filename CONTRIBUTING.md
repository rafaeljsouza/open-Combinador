# Contributing / Contribuicao

## English

Thanks for helping improve Combinador.

### Ground rules

- Keep the project fully open-source and self-hostable.
- Do not reintroduce Google/Firebase runtime dependencies.
- Prefer small, focused pull requests.

### Development setup

1. Fork the repository.
2. Clone your fork.
3. Install dependencies:

```bash
npm install
```

4. Create your local `.env` using `.env.example`.
5. Apply `supabase/schema.sql` to your Supabase project.
6. Start dev server:

```bash
npm run dev
```

### Branch and commit style

- Create a branch from `main`:
  - `feat/<short-topic>`
  - `fix/<short-topic>`
  - `docs/<short-topic>`
- Write clear commit messages in imperative form.
- Keep unrelated refactors out of feature/fix PRs.

### Pull request checklist

- [ ] Feature/fix is scoped and documented
- [ ] `npm run build` passes locally
- [ ] No secrets/keys committed
- [ ] Supabase schema changes included in `supabase/schema.sql` when needed
- [ ] UI changes include screenshots (desktop + mobile) when relevant

### Reporting bugs

Please include:

- what you expected
- what happened
- reproduction steps
- browser/OS info
- relevant console/network errors

### Security

- Never expose secret keys in frontend env vars.
- Use only `VITE_SUPABASE_PUBLISHABLE_KEY` in browser code.

If you discover a sensitive issue, report it privately to the maintainers first.

## Portugues

Obrigado por contribuir com o Combinador.

### Regras gerais

- Mantenha o projeto totalmente open-source e auto-hospedavel.
- Nao reintroduza dependencias de runtime Google/Firebase.
- Prefira pull requests pequenas e focadas.

### Configuracao de desenvolvimento

1. Faca fork do repositorio.
2. Clone seu fork.
3. Instale dependencias:

```bash
npm install
```

4. Crie seu `.env` local usando `.env.example`.
5. Aplique `supabase/schema.sql` no seu projeto Supabase.
6. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

### Padrao de branch e commit

- Crie branch a partir de `main`:
  - `feat/<topico-curto>`
  - `fix/<topico-curto>`
  - `docs/<topico-curto>`
- Escreva commits claros no imperativo.
- Evite refactors nao relacionados no mesmo PR.

### Checklist de pull request

- [ ] Feature/correcao esta delimitada e documentada
- [ ] `npm run build` passa localmente
- [ ] Nenhum segredo/chave foi commitado
- [ ] Mudancas de schema Supabase estao em `supabase/schema.sql` quando necessario
- [ ] Mudancas de UI incluem screenshots (desktop + mobile) quando relevante

### Reporte de bugs

Inclua:

- o que voce esperava
- o que aconteceu
- passos de reproducao
- navegador/SO
- erros relevantes de console/rede

### Seguranca

- Nunca exponha chaves secretas em variaveis de frontend.
- Use apenas `VITE_SUPABASE_PUBLISHABLE_KEY` no codigo do navegador.

Se descobrir uma vulnerabilidade sensivel, reporte primeiro em canal privado para os mantenedores.
