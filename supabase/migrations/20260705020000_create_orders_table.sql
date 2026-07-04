-- Orders table backing the checkout / payment flow (confirm-order edge function).
-- Rows are written by the edge function using the service role key, which
-- bypasses RLS, so no anon insert policy is needed here.

create type order_status as enum ('paid', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  order_type text not null check (order_type = any (array['dine-in', 'takeaway', 'delivery'])),
  address text,
  items jsonb not null,
  total integer not null check (total >= 0),
  status order_status not null default 'paid',
  razorpay_order_id text not null,
  razorpay_payment_id text not null unique
);

create index idx_orders_created on public.orders using btree (created_at desc);
create index idx_orders_status on public.orders using btree (status);

alter table public.orders enable row level security;

create policy auth_select on public.orders
  for select to authenticated
  using (true);

create policy auth_update on public.orders
  for update to authenticated
  using (true)
  with check (true);

create policy auth_delete on public.orders
  for delete to authenticated
  using (true);
