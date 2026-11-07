-- Jodhiambo: site content managed from the admin dashboard.
-- Run once in the Supabase SQL editor, after 0001_init.sql.
-- Content rows are then loaded with: node scripts/seed-content.mjs

-- ---------------------------------------------------------------------------
-- Courses (the store catalogue)
-- ---------------------------------------------------------------------------
create table public.courses (
  slug           text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title          text not null,
  category       text not null check (category in ('actuarial', 'finance', 'data')),
  level          text not null default 'Intermediate' check (level in ('Beginner', 'Intermediate', 'Advanced')),
  icon           text not null default 'book',
  summary        text not null default '',
  overview       text not null default '',
  outcomes       text[] not null default '{}',
  topics         text[] not null default '{}',
  prerequisites  text not null default '',
  audience       text[] not null default '{}',
  price_kes      integer not null check (price_kes >= 0),
  access_days    integer not null default 365 check (access_days > 0),
  published      boolean not null default true,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- All-Access plans
-- ---------------------------------------------------------------------------
create table public.plans (
  id           text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name         text not null,
  access_days  integer not null check (access_days > 0),
  price_kes    integer not null check (price_kes > 0),
  blurb        text not null default '',
  featured     boolean not null default false,
  active       boolean not null default true,
  sort_order   integer not null default 0,
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Publications and gallery
-- ---------------------------------------------------------------------------
create table public.research_papers (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  venue       text not null,
  year        integer not null check (year between 1950 and 2100),
  doi         text,
  tags        text[] not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.media_articles (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  outlet        text not null,
  published_on  date not null,
  url           text not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.books (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  image_url   text not null,
  amazon_url  text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.gallery_items (
  id          uuid primary key default gen_random_uuid(),
  image_url   text not null,
  alt         text not null,
  title       text not null,
  caption     text not null default '',
  category    text not null check (category in ('teaching', 'presentations', 'awards', 'events')),
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Existing tables: link materials to courses, remember the customer's email
-- ---------------------------------------------------------------------------
alter table public.materials add column if not exists size_bytes bigint;
alter table public.materials
  add constraint materials_course_fk foreign key (course_slug) references public.courses (slug) on delete cascade;

alter table public.orders add column if not exists customer_email text;

-- ---------------------------------------------------------------------------
-- Row level security: the public can read what is published; all writes go
-- through the server (service role) after an admin check.
-- ---------------------------------------------------------------------------
alter table public.courses         enable row level security;
alter table public.plans           enable row level security;
alter table public.research_papers enable row level security;
alter table public.media_articles  enable row level security;
alter table public.books           enable row level security;
alter table public.gallery_items   enable row level security;

create policy "Published courses are public" on public.courses
  for select to anon, authenticated using (published);
create policy "Active plans are public" on public.plans
  for select to anon, authenticated using (active);
create policy "Research is public" on public.research_papers
  for select to anon, authenticated using (true);
create policy "Articles are public" on public.media_articles
  for select to anon, authenticated using (true);
create policy "Books are public" on public.books
  for select to anon, authenticated using (true);
create policy "Gallery is public" on public.gallery_items
  for select to anon, authenticated using (true);

-- ---------------------------------------------------------------------------
-- Storage
--  - materials: private PDFs (already created in 0001); restrict to PDFs, 100 MB
--  - site-media: public images for books and the gallery, 10 MB
-- Uploads use one-time signed URLs issued by the server to admins only.
-- ---------------------------------------------------------------------------
update storage.buckets
   set file_size_limit = 104857600, allowed_mime_types = array['application/pdf']
 where id = 'materials';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;
