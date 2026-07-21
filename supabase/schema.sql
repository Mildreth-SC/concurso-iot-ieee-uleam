-- =====================================================================
-- I Concurso Nacional IoT ULEAM 2026 — Esquema Supabase
-- Ejecutar TODO en Supabase → SQL Editor → New query → Run
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) Inscripciones
-- (Asegúrate de NO tener 'drop table' aquí para evitar pérdida de datos)

create table if not exists registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  registration_code text not null unique,
  team_name text not null,
  category text not null,
  belongs_to_ieee_branch boolean not null,
  representing_institution text not null,
  other_institution text,
  project_topic text,
  tutor_name text,
  team_size integer not null,
  members jsonb not null,
  contact_email text not null,
  ieee_membership_codes text not null,
  payment_proof_url text,
  paper_url text,
  hear_about text not null,
  comments text,
  accepts_terms boolean not null default true
);

alter table registrations add column if not exists registration_code text;
alter table registrations add column if not exists project_topic text;
alter table registrations add column if not exists tutor_name text;
alter table registrations add column if not exists paper_url text;

create unique index if not exists registrations_registration_code_key on registrations (registration_code);

create index registrations_created_at_idx on registrations (created_at desc);
create index registrations_category_idx on registrations (category);

alter table registrations enable row level security;

-- Acceso total para el service role (backend)
create policy "Service role full access registrations"
  on registrations
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Lectura pública de columnas no sensibles por registration_code
-- (el portal de equipo usa el service role desde el backend,
--  pero esta policy permite acceso anónimo si alguna vez se expone como API pública)
create policy "Public read by registration_code"
  on registrations
  for select
  using (true);

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
-- 3) Storage: bucket público para logos, sponsors, comprobantes y papers
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
