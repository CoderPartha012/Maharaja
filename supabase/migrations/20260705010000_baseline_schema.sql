-- Baseline migration reconstructed from the live remote schema (adopted via
-- MCP inspection since Docker was unavailable for `supabase db pull`'s shadow DB).
-- Represents the schema as it existed on the remote project at adoption time;
-- it is marked "applied" without being re-run against the remote database.

create type reservation_status as enum ('pending', 'confirmed', 'cancelled', 'no_show');

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text,
  phone text not null,
  date date not null,
  time text not null,
  party_size integer not null check (party_size >= 1 and party_size <= 8),
  special_requests text,
  status reservation_status not null default 'pending'
);

create index idx_reservations_created on public.reservations using btree (created_at desc);
create index idx_reservations_date on public.reservations using btree (date);
create index idx_reservations_email on public.reservations using btree (email) where (email is not null and email <> '');
create index idx_reservations_status on public.reservations using btree (status);

alter table public.reservations enable row level security;

create policy anon_insert on public.reservations
  for insert to anon
  with check (true);

create policy auth_select on public.reservations
  for select to authenticated
  using (true);

create policy auth_update on public.reservations
  for update to authenticated
  using (true)
  with check (true);

create policy auth_delete on public.reservations
  for delete to authenticated
  using (true);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'unread' check (status = any (array['unread', 'read', 'replied']))
);

alter table public.contact_messages enable row level security;

create policy anon_insert_contact_messages on public.contact_messages
  for insert to anon
  with check (true);

create policy admin_all_contact_messages on public.contact_messages
  for all to authenticated
  using (true)
  with check (true);
