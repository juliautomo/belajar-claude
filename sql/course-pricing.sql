-- ─────────────────────────────────────────────────────────────────────────
-- Belajar Claude — Admin-controlled pricing + scheduled discount (all-access)
-- Run this ONCE in Supabase Dashboard → SQL Editor (project: ctqtdqbsucbhikwnagvl)
-- Lets admin.html edit the all-access price/discount without a code deploy.
-- Backend (/create-payment) and all-access.html both read this table; both
-- fall back to the hardcoded Rp 399,000 default if no row exists yet.
-- ─────────────────────────────────────────────────────────────────────────

create table if not exists course_pricing (
  course_slug text primary key,
  base_price int not null,
  discount_price int,
  discount_start timestamptz,
  discount_end timestamptz,
  updated_at timestamptz default now(),
  updated_by text
);

alter table course_pricing enable row level security;

drop policy if exists "public read course_pricing" on course_pricing;
create policy "public read course_pricing"
  on course_pricing for select
  using (true);

drop policy if exists "admin insert course_pricing" on course_pricing;
create policy "admin insert course_pricing"
  on course_pricing for insert
  with check (auth.jwt() ->> 'email' in ('julia.utomo@gmail.com', 'tiffany.utomo@gmail.com'));

drop policy if exists "admin update course_pricing" on course_pricing;
create policy "admin update course_pricing"
  on course_pricing for update
  using (auth.jwt() ->> 'email' in ('julia.utomo@gmail.com', 'tiffany.utomo@gmail.com'));

-- Seed the current live price so admin.html has something to show/edit immediately.
insert into course_pricing (course_slug, base_price)
values ('all-access', 399000)
on conflict (course_slug) do nothing;
