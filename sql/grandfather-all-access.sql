-- ─────────────────────────────────────────────────────────────────────────
-- Belajar Claude — Grandfather existing paying customers into All Access
-- Run this ONCE in Supabase Dashboard → SQL Editor (project: ctqtdqbsucbhikwnagvl)
-- Part of the one-time-payment restructure (see CONTEXT.md "PLANNED: Restructure
-- Payment" section). Gives every email with at least one existing PAID
-- enrollment a free 'all-access' sentinel row, so they don't have to pay again
-- under the new pricing model. Free-only accounts (prompt-gratis) are untouched.
-- Safe to re-run: only inserts for emails that don't already have all-access.
-- ─────────────────────────────────────────────────────────────────────────

insert into enrollments (email, name, course_slug, course_name, type, amount, reference, enrolled_at)
select
  paid.email,
  (
    select e2.name from enrollments e2
    where e2.email = paid.email and e2.name is not null and e2.name <> ''
    order by e2.enrolled_at desc limit 1
  ) as name,
  'all-access' as course_slug,
  'All Access — Semua Kursus' as course_name,
  'paid' as type,
  0 as amount,
  'GRANDFATHERED' as reference,
  now() as enrolled_at
from (
  select distinct email
  from enrollments
  where type = 'paid' and course_slug <> 'all-access'
) paid
where not exists (
  select 1 from enrollments ex
  where ex.email = paid.email and ex.course_slug = 'all-access'
);

-- Verify afterwards:
-- select email, course_slug, course_name, type, amount, reference, enrolled_at
-- from enrollments where course_slug = 'all-access' order by enrolled_at desc;
