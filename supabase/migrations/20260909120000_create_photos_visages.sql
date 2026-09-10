-- Galerie photo de l'après-mariage + index des visages détectés.
--
-- Les 126 membres ne sont pas en base : ce sont les cartes statiques de
-- src/data/membres.ts, référencées par leur numéro (membre_id 1..126).

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  -- chemins dans le bucket "photos" (version web + vignette)
  chemin text not null unique,
  chemin_vignette text not null,
  largeur int not null,
  hauteur int not null,
  -- true dès que la détection de visages a tourné sur cette photo
  indexee boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.visages (
  id uuid primary key default gen_random_uuid(),
  photo_id uuid not null references public.photos(id) on delete cascade,
  -- boîte englobante en fractions de l'image (0..1), pour recadrer côté client
  x real not null,
  y real not null,
  l real not null,
  h real not null,
  score real not null default 0,
  -- descripteur facial FaceRes (1024 flottants), comparé avec la mesure Human
  empreinte jsonb not null,
  -- carte membre associée, null tant que le visage n'est rattaché à personne
  membre_id int,
  -- true = association manuelle (sert de référence), false = propagée automatiquement
  ancre boolean not null default false,
  similarite real,
  created_at timestamptz not null default now()
);

create index if not exists visages_membre_id_idx on public.visages (membre_id);
create index if not exists visages_photo_id_idx on public.visages (photo_id);
create index if not exists photos_indexee_idx on public.photos (indexee);

-- RLS activé sans policy : ces tables ne sont accessibles que via la clé
-- service_role (routes serveur), jamais avec la clé anon depuis le navigateur.
alter table public.photos enable row level security;
alter table public.visages enable row level security;

-- Mise à jour en masse des associations visage → membre, en un seul aller-retour.
-- Utilisée par la propagation automatique de l'admin, qui recalcule des milliers
-- de lignes avec chacune son propre score de similarité.
create or replace function public.associer_visages(associations jsonb)
returns int
language sql
as $$
  with maj as (
    update public.visages v
    set membre_id = nullif(a->>'membreId', '')::int,
        ancre = coalesce((a->>'ancre')::boolean, false),
        similarite = nullif(a->>'similarite', '')::real
    from jsonb_array_elements(associations) a
    where v.id = (a->>'id')::uuid
    returning 1
  )
  select count(*)::int from maj;
$$;

revoke execute on function public.associer_visages(jsonb) from anon, authenticated;
