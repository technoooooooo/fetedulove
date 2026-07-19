-- Livre d'or de la cagnotte : petits mots laissés par les invités.
create table if not exists public.livre_or (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nom text not null,
  message text not null
);

-- RLS activé sans policy publique : la table n'est accessible que via la clé
-- service_role (route serveur /api/livre-or) et le dashboard. Les mots ne sont
-- donc jamais lisibles publiquement avec la clé anon.
alter table public.livre_or enable row level security;
