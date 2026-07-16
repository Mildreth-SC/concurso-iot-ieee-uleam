-- =====================================================================
-- I Concurso Nacional IoT ULEAM 2026 — Esquema Supabase
-- Ejecutar TODO en Supabase → SQL Editor → New query → Run
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) Inscripciones
-- ---------------------------------------------------------------------
drop table if exists registrations;

create table registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  team_name text not null,
  category text not null,
  belongs_to_ieee_branch boolean not null,
  representing_institution text not null,
  other_institution text,
  team_size integer not null,
  members jsonb not null,
  contact_email text not null,
  ieee_membership_codes text not null,
  payment_proof_url text,
  hear_about text not null,
  comments text,
  accepts_terms boolean not null default true
);

create index registrations_created_at_idx on registrations (created_at desc);
create index registrations_category_idx on registrations (category);

alter table registrations enable row level security;

create policy "Service role full access registrations"
  on registrations
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ---------------------------------------------------------------------
-- 2) Contenido del sitio (organizadores + sponsors gestionados en /admin)
-- ---------------------------------------------------------------------
create table if not exists site_content (
  id text primary key default 'main',
  organizers jsonb not null default '[]'::jsonb,
  sponsors jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table site_content enable row level security;

create policy "Service role full access site_content"
  on site_content
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

insert into site_content (id, organizers, sponsors)
values ('main', '[]'::jsonb, '[]'::jsonb)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- 3) Storage: bucket público para logos, sponsors y comprobantes
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('site-assets', 'site-assets', true, 10485760)
on conflict (id) do update set public = excluded.public;

-- Limpia policies previas para poder re-ejecutar el script
drop policy if exists "Public read site-assets" on storage.objects;
drop policy if exists "Service role write site-assets" on storage.objects;

-- Lectura pública de los archivos del bucket
create policy "Public read site-assets"
  on storage.objects
  for select
  using (bucket_id = 'site-assets');

-- Subida/actualización/borrado solo con service role (desde el backend)
create policy "Service role write site-assets"
  on storage.objects
  for all
  to service_role
  using (bucket_id = 'site-assets')
  with check (bucket_id = 'site-assets');
