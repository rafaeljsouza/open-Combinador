-- Combinador mock seed data
--
-- How to use:
-- 1) Create at least 3 real users in the app (1 manager + 2 researchers).
-- 2) In Supabase SQL Editor, get their IDs:
--      select id, email from auth.users order by created_at desc;
-- 3) Replace the UUID placeholders below.
-- 4) Run this script.
--
-- Safe rerun behavior:
-- - Uses deterministic IDs for challenges/matches/solutions/events.
-- - Deletes previous mock records with same IDs before inserting.

begin;

-- Replace these IDs
-- manager user
--   338f4e35-ea20-4e09-a38d-a3e286e2634b
-- researcher A user
--   e9f58b3b-8bdf-4b03-b0a7-01c2f0315e96
-- researcher B user
--   d1a4a145-a34a-4345-b6d0-1f51746603d7

-- deterministic IDs for mock entities
-- challenge 1
--   aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1
-- challenge 2
--   aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2
-- match 1
--   bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1
-- match 2
--   bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2
-- solution 1
--   cccccccc-cccc-cccc-cccc-ccccccccccc1

-- cleanup (child -> parent order)
delete from public.notification_digest_queue
where notification_id in (
  'dddddddd-dddd-dddd-dddd-ddddddddddd1',
  'dddddddd-dddd-dddd-dddd-ddddddddddd2'
);

delete from public.notifications
where id in (
  'dddddddd-dddd-dddd-dddd-ddddddddddd1',
  'dddddddd-dddd-dddd-dddd-ddddddddddd2'
);

delete from public.match_join_requests
where id in (
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2'
);

delete from public.match_events
where id in (
  'f1111111-1111-1111-1111-111111111111',
  'f2222222-2222-2222-2222-222222222222',
  'f3333333-3333-3333-3333-333333333333',
  'f4444444-4444-4444-4444-444444444444',
  'f5555555-5555-5555-5555-555555555555',
  'f6666666-6666-6666-6666-666666666666'
);

delete from public.solutions
where id = 'cccccccc-cccc-cccc-cccc-ccccccccccc1';

delete from public.matches
where id in (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2'
);

delete from public.challenge_details
where challenge_id in (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2'
);

delete from public.challenges
where id in (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2'
);

-- optional profile enrichment for demo users
update public.profiles
set
  user_type = 'gestor',
  name = coalesce(name, 'Gestor Ficticio'),
  institution = coalesce(institution, 'Prefeitura Exemplo'),
  bio = coalesce(bio, 'Gestor de inovação pública e dados urbanos.'),
  interest_tags = coalesce(interest_tags, '{}'::text[]),
  notify_email_enabled = false,
  notify_email_frequency = 'daily',
  updated_at = now()
where id = '338f4e35-ea20-4e09-a38d-a3e286e2634b';

update public.profiles
set
  user_type = 'pesquisador',
  name = coalesce(name, 'Pesquisador Ficticio A'),
  institution = coalesce(institution, 'Universidade Exemplo'),
  research_line = coalesce(research_line, 'Logística e eficiência operacional'),
  interest_tags = array['logistica','filas','eficiencia','otimizacao'],
  notify_email_enabled = true,
  notify_email_frequency = 'daily',
  updated_at = now()
where id = 'e9f58b3b-8bdf-4b03-b0a7-01c2f0315e96';

update public.profiles
set
  user_type = 'pesquisador',
  name = coalesce(name, 'Pesquisador Ficticio B'),
  institution = coalesce(institution, 'Instituto de Pesquisa Exemplo'),
  research_line = coalesce(research_line, 'Saúde pública e ciência de dados'),
  interest_tags = array['saude-publica','analise-dados','predicao','eficiencia'],
  notify_email_enabled = true,
  notify_email_frequency = 'daily',
  updated_at = now()
where id = 'd1a4a145-a34a-4345-b6d0-1f51746603d7';

-- tag catalog (for selector suggestions)
insert into public.tag_catalog(tag, usage_count, updated_at)
values
  ('logistica', 10, now()),
  ('filas', 8, now()),
  ('eficiencia', 12, now()),
  ('otimizacao', 9, now()),
  ('saude-publica', 6, now()),
  ('analise-dados', 7, now()),
  ('predicao', 4, now())
on conflict (tag)
do update set usage_count = greatest(public.tag_catalog.usage_count, excluded.usage_count), updated_at = now();

-- challenge 1 (logistics)
insert into public.challenges(
  id, title, area, description, author_id, status, tags, created_at, updated_at
)
values (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  'Problema exemplo: filas em unidades de atendimento',
  'Logistica',
  'A prefeitura precisa reduzir o tempo médio de espera em unidades de atendimento sem aumentar equipe.',
  '338f4e35-ea20-4e09-a38d-a3e286e2634b',
  'aberto',
  array['filas','eficiencia','logistica'],
  now() - interval '20 days',
  now() - interval '20 days'
);

insert into public.challenge_details(
  challenge_id, private_details, author_id, created_at, updated_at
)
values (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  'Dados internos incluem fluxo horário e categorias de atendimento. Dados pessoais devem permanecer anonimizados.',
  '338f4e35-ea20-4e09-a38d-a3e286e2634b',
  now() - interval '20 days',
  now() - interval '20 days'
);

-- challenge 2 (health)
insert into public.challenges(
  id, title, area, description, author_id, status, tags, created_at, updated_at
)
values (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
  'Problema exemplo: previsão de demanda em UBS',
  'Saude Publica',
  'Necessidade de prever demanda semanal para reduzir falta de insumos e melhorar escala.',
  '338f4e35-ea20-4e09-a38d-a3e286e2634b',
  'aberto',
  array['saude-publica','predicao','analise-dados'],
  now() - interval '12 days',
  now() - interval '12 days'
);

insert into public.challenge_details(
  challenge_id, private_details, author_id, created_at, updated_at
)
values (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
  'Bases de consumo e agendamento com granularidade diária. Dados sensíveis precisam de mascaramento.',
  '338f4e35-ea20-4e09-a38d-a3e286e2634b',
  now() - interval '12 days',
  now() - interval '12 days'
);

-- match 1 + timeline + solution (completed)
insert into public.matches(
  id, challenge_id, manager_id, lead_researcher_id, participant_ids, status, created_at, updated_at
)
values (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  '338f4e35-ea20-4e09-a38d-a3e286e2634b',
  'e9f58b3b-8bdf-4b03-b0a7-01c2f0315e96',
  array[
    '338f4e35-ea20-4e09-a38d-a3e286e2634b'::uuid,
    'e9f58b3b-8bdf-4b03-b0a7-01c2f0315e96'::uuid,
    'd1a4a145-a34a-4345-b6d0-1f51746603d7'::uuid
  ],
  'bem_sucedido',
  now() - interval '18 days',
  now() - interval '2 days'
);

insert into public.match_events(id, match_id, challenge_id, type, content, tags, is_public, author_id, created_at)
values
  (
    'f1111111-1111-1111-1111-111111111111',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'mensagem_inicial',
    'Hipótese inicial: redistribuir janelas de atendimento e separar fila rápida para demandas simples.',
    array['hipotese','filas'],
    true,
    'e9f58b3b-8bdf-4b03-b0a7-01c2f0315e96',
    now() - interval '18 days'
  ),
  (
    'f2222222-2222-2222-2222-222222222222',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'analise_dados',
    'Análise de 6 meses de dados anonimizados indicou pico entre 9h e 11h.',
    array['dados','analise-dados'],
    true,
    'e9f58b3b-8bdf-4b03-b0a7-01c2f0315e96',
    now() - interval '15 days'
  ),
  (
    'f3333333-3333-3333-3333-333333333333',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'experimento',
    'Teste A/B em duas unidades por 2 semanas mostrou redução média de 21 por cento no tempo de espera.',
    array['experimento','eficiencia'],
    true,
    'd1a4a145-a34a-4345-b6d0-1f51746603d7',
    now() - interval '10 days'
  ),
  (
    'f4444444-4444-4444-4444-444444444444',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'decisao_metodologica',
    'Decisão: priorizar algoritmo simples e explicável para adoção rápida pela equipe operacional.',
    array['metodologia','governanca'],
    true,
    '338f4e35-ea20-4e09-a38d-a3e286e2634b',
    now() - interval '8 days'
  ),
  (
    'f5555555-5555-5555-5555-555555555555',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'solucao_bem_sucedida',
    'Solução validada e publicada com documentação de API e licenças abertas.',
    array['resultado','open-science'],
    true,
    'e9f58b3b-8bdf-4b03-b0a7-01c2f0315e96',
    now() - interval '2 days'
  );

insert into public.solutions(
  id,
  challenge_id,
  challenge_title,
  summary,
  repo_url,
  api_docs_url,
  license_code,
  license_data,
  manager_id,
  lead_researcher_id,
  participant_ids,
  published_at
)
values (
  'cccccccc-cccc-cccc-cccc-ccccccccccc1',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  'Problema exemplo: filas em unidades de atendimento',
  'Pipeline de priorização e distribuição de atendimento com painel operacional e simulador de fila.',
  'https://github.com/exemplo/combinador-filas',
  'https://api.exemplo.gov/docs/fila-atendimento',
  'MIT',
  'CC-BY-4.0',
  '338f4e35-ea20-4e09-a38d-a3e286e2634b',
  'e9f58b3b-8bdf-4b03-b0a7-01c2f0315e96',
  array[
    '338f4e35-ea20-4e09-a38d-a3e286e2634b'::uuid,
    'e9f58b3b-8bdf-4b03-b0a7-01c2f0315e96'::uuid,
    'd1a4a145-a34a-4345-b6d0-1f51746603d7'::uuid
  ],
  now() - interval '2 days'
);

-- match 2 (ongoing)
insert into public.matches(
  id, challenge_id, manager_id, lead_researcher_id, participant_ids, status, created_at, updated_at
)
values (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
  '338f4e35-ea20-4e09-a38d-a3e286e2634b',
  'd1a4a145-a34a-4345-b6d0-1f51746603d7',
  array[
    '338f4e35-ea20-4e09-a38d-a3e286e2634b'::uuid,
    'd1a4a145-a34a-4345-b6d0-1f51746603d7'::uuid
  ],
  'contato_inicial',
  now() - interval '10 days',
  now() - interval '1 day'
);

insert into public.match_events(id, match_id, challenge_id, type, content, tags, is_public, author_id, created_at)
values
  (
    'f6666666-6666-6666-6666-666666666666',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    'mensagem_inicial',
    'Proposta inicial para modelo de previsão de demanda semanal com variáveis sazonais.',
    array['predicao','saude-publica'],
    true,
    'd1a4a145-a34a-4345-b6d0-1f51746603d7',
    now() - interval '10 days'
  );

-- join requests mock
insert into public.match_join_requests(
  id, match_id, challenge_id, requester_id, message,
  manager_approved, lead_approved, status, created_at, updated_at
)
values
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    'e9f58b3b-8bdf-4b03-b0a7-01c2f0315e96',
    'Posso contribuir com avaliação de qualidade de dados e validação de métricas.',
    false,
    false,
    'pending',
    now() - interval '3 days',
    now() - interval '3 days'
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'd1a4a145-a34a-4345-b6d0-1f51746603d7',
    'Contribuição em análise estatística e visualização de resultados.',
    true,
    true,
    'approved',
    now() - interval '14 days',
    now() - interval '13 days'
  );

-- notification mock
insert into public.notifications(id, user_id, type, title, message, payload, is_read, created_at)
values
  (
    'dddddddd-dddd-dddd-dddd-ddddddddddd1',
    'e9f58b3b-8bdf-4b03-b0a7-01c2f0315e96',
    'challenge_match',
    'Novo desafio compatível com suas tags',
    'O desafio de previsão em UBS pode ser relevante para você.',
    '{"challengeId":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2","matchedTags":["analise-dados","eficiencia"]}'::jsonb,
    false,
    now() - interval '2 days'
  ),
  (
    'dddddddd-dddd-dddd-dddd-ddddddddddd2',
    'd1a4a145-a34a-4345-b6d0-1f51746603d7',
    'challenge_match',
    'Novo desafio compatível com suas tags',
    'O desafio de filas em atendimento combina com suas competências.',
    '{"challengeId":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1","matchedTags":["eficiencia"]}'::jsonb,
    true,
    now() - interval '16 days'
  );

insert into public.notification_digest_queue(id, user_id, notification_id, status, created_at, sent_at)
values (
  '99999999-9999-9999-9999-999999999991',
  'e9f58b3b-8bdf-4b03-b0a7-01c2f0315e96',
  'dddddddd-dddd-dddd-dddd-ddddddddddd1',
  'pending',
  now() - interval '2 days',
  null
)
on conflict (id) do update set status = excluded.status, sent_at = excluded.sent_at;

commit;
