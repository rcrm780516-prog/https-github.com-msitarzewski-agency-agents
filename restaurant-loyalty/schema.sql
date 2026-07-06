-- =====================================================================
--  Base de datos del Programa de Lealtad (Supabase / PostgreSQL)
--  Cómo usar:
--   1. Entra a tu proyecto en https://supabase.com
--   2. Menú lateral → "SQL Editor" → "New query"
--   3. Pega TODO este archivo y presiona "Run".
--  Listo: se crean las tablas y los permisos necesarios.
-- =====================================================================

-- Tabla de clientes -----------------------------------------------------
create table if not exists public.customers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text,
  created_at  timestamptz not null default now()
);

-- Tabla de visitas ------------------------------------------------------
create table if not exists public.visits (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid not null references public.customers(id) on delete cascade,
  note         text,
  created_at   timestamptz not null default now()
);

create index if not exists idx_visits_customer on public.visits(customer_id);

-- Seguridad (RLS) -------------------------------------------------------
-- La app es un sitio estático que usa la "anon key" (pública). Para que
-- funcione debemos permitir a ese rol leer/escribir. Esto es adecuado
-- para un negocio pequeño. Si más adelante quieres restringir por
-- usuario/empleado, se añade autenticación de Supabase.

alter table public.customers enable row level security;
alter table public.visits    enable row level security;

-- Permitir operaciones al rol anónimo (y autenticado)
drop policy if exists "loyalty customers all" on public.customers;
create policy "loyalty customers all" on public.customers
  for all to anon, authenticated
  using (true) with check (true);

drop policy if exists "loyalty visits all" on public.visits;
create policy "loyalty visits all" on public.visits
  for all to anon, authenticated
  using (true) with check (true);
