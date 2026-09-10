-- Rattachement manuel d'un membre à une photo, sans passer par un visage.
--
-- Sert aux cas que la détection ne peut pas couvrir : quelqu'un de dos, flou,
-- coupé au bord du cadre, ou simplement présent sans être reconnaissable. La
-- photo apparaît alors dans sa galerie au même titre qu'un visage reconnu.

create table if not exists public.photos_membres (
  photo_id uuid not null references public.photos(id) on delete cascade,
  -- carte membre (1..126), même référentiel que visages.membre_id
  membre_id int not null,
  created_at timestamptz not null default now(),
  primary key (photo_id, membre_id)
);

create index if not exists photos_membres_membre_id_idx
  on public.photos_membres (membre_id);

-- Comme photos et visages : lisible uniquement avec la clé service_role.
alter table public.photos_membres enable row level security;
