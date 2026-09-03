-- Audit log for course_pricing changes. course_pricing itself only ever holds
-- the single current row per course_slug (upserted on every save via admin.html),
-- so there was previously no way to see what a price/discount used to be or when
-- it changed. This table gets one new row appended every time savePricing() in
-- admin.html successfully saves, capturing a snapshot of what was just saved.
--
-- Already applied directly to production (ctqtdqbsucbhikwnagvl) via Supabase MCP,
-- Checkpoint 193 (Aug 13, 2026).

create table if not exists course_pricing_history (
  id uuid primary key default gen_random_uuid(),
  course_slug text not null,
  base_price int not null,
  discount_price int,
  discount_start timestamptz,
  discount_end timestamptz,
  -- Snapshot of course_pricing.discount_paused at the moment this row was written -- see
  -- that column's comment in course-pricing.sql. Added Checkpoint 231 (Sep 2, 2026).
  discount_paused boolean not null default false,
  changed_by text not null,
  changed_at timestamptz default now()
);

create index if not exists course_pricing_history_slug_idx
  on course_pricing_history (course_slug, changed_at desc);

alter table course_pricing_history enable row level security;

-- Admin-only, both directions — this is an internal audit trail, not public data
-- like course_pricing itself (which needs public SELECT for the live pricing page).
create policy "Admin read course_pricing_history" on course_pricing_history
  for select using (
    (auth.jwt() ->> 'email') = ANY (ARRAY['julia.utomo@gmail.com', 'tiffany.utomo@gmail.com'])
  );

create policy "Admin insert course_pricing_history" on course_pricing_history
  for insert with check (
    (auth.jwt() ->> 'email') = ANY (ARRAY['julia.utomo@gmail.com', 'tiffany.utomo@gmail.com'])
  );
