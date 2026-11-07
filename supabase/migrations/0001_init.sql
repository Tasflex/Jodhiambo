-- Jodhiambo e-learning: orders, access passes (entitlements) and course materials.
-- Run once in the Supabase SQL editor (or with `supabase db push`).

create type public.order_status as enum ('pending', 'paid', 'failed');

-- ---------------------------------------------------------------------------
-- Orders: one per Paystack transaction. Line items are snapshotted at checkout.
-- ---------------------------------------------------------------------------
create table public.orders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  reference   text not null unique,              -- Paystack transaction reference
  items       jsonb not null,                    -- [{ id, title, priceKes, scope, accessDays }]
  amount_kes  integer not null check (amount_kes > 0),
  currency    text not null default 'KES',
  status      public.order_status not null default 'pending',
  created_at  timestamptz not null default now(),
  paid_at     timestamptz
);
create index orders_user_idx on public.orders (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Entitlements: time-limited access. scope is 'all' (All-Access pass)
-- or 'course:<slug>' (a single course).
-- ---------------------------------------------------------------------------
create table public.entitlements (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  scope       text not null check (scope = 'all' or scope like 'course:%'),
  starts_at   timestamptz not null,
  expires_at  timestamptz not null,
  order_id    uuid references public.orders (id) on delete set null,
  created_at  timestamptz not null default now(),
  check (expires_at > starts_at)
);
create index entitlements_lookup_idx on public.entitlements (user_id, scope, expires_at desc);

-- ---------------------------------------------------------------------------
-- Materials: PDFs stored in the private "materials" bucket.
-- Add rows in the Supabase dashboard after uploading each file.
-- ---------------------------------------------------------------------------
create table public.materials (
  id            uuid primary key default gen_random_uuid(),
  course_slug   text not null,                   -- must match a slug in src/data/courses.ts
  title         text not null,
  storage_path  text not null unique,            -- path inside the "materials" bucket
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);
create index materials_course_idx on public.materials (course_slug, sort_order);

-- ---------------------------------------------------------------------------
-- Row level security: users can read only their own orders and passes.
-- All writes go through the server using the service role key.
-- ---------------------------------------------------------------------------
alter table public.orders       enable row level security;
alter table public.entitlements enable row level security;
alter table public.materials    enable row level security;

create policy "Users read their own orders"
  on public.orders for select to authenticated using (auth.uid() = user_id);

create policy "Users read their own entitlements"
  on public.entitlements for select to authenticated using (auth.uid() = user_id);

-- Titles are not secret (they are listed on course pages); the files are.
create policy "Material titles are public"
  on public.materials for select to anon, authenticated using (true);

-- ---------------------------------------------------------------------------
-- Private bucket for the PDFs. No storage policies are created, so only the
-- server (service role) can read files; there are no public or signed URLs.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('materials', 'materials', false)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- fulfil_order: marks a pending order paid and grants its access, atomically.
-- Returns false if the order is unknown, already fulfilled, or the paid amount
-- or currency does not match, so webhook retries and the browser redirect can
-- both call it safely. Repeat purchases extend access from the current expiry.
-- ---------------------------------------------------------------------------
create or replace function public.fulfil_order(p_reference text, p_amount_kes integer, p_currency text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  o        public.orders;
  item     jsonb;
  v_scope  text;
  v_days   integer;
  v_start  timestamptz;
begin
  update public.orders
     set status = 'paid', paid_at = now()
   where reference = p_reference
     and status = 'pending'
     and amount_kes = p_amount_kes
     and currency = p_currency
  returning * into o;

  if not found then
    return false;
  end if;

  for item in select * from jsonb_array_elements(o.items) loop
    v_scope := item ->> 'scope';
    v_days  := (item ->> 'accessDays')::integer;

    select greatest(now(), coalesce(max(e.expires_at), now()))
      into v_start
      from public.entitlements e
     where e.user_id = o.user_id and e.scope = v_scope;

    insert into public.entitlements (user_id, scope, starts_at, expires_at, order_id)
    values (o.user_id, v_scope, v_start, v_start + make_interval(days => v_days), o.id);
  end loop;

  return true;
end;
$$;

revoke execute on function public.fulfil_order(text, integer, text) from public, anon, authenticated;
grant execute on function public.fulfil_order(text, integer, text) to service_role;
