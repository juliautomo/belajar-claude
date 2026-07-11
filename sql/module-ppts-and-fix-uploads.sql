-- ─────────────────────────────────────────────────────────────────────────
-- Belajar Claude — PPT-per-module feature + fix for "Dokumen Praktik" upload
-- Run this ONCE in Supabase Dashboard → SQL Editor (project: ctqtdqbsucbhikwnagvl)
--
-- Fixes: "Gagal unggah: new row violates row-level security policy" on the
-- Dokumen Praktik card in admin.html. Root cause: the `course-documents`
-- storage bucket was never created (flagged as a known limitation in
-- CONTEXT.md), so every insert into storage.objects for that bucket_id was
-- rejected by RLS since no policy could ever match a non-existent bucket.
-- This script creates both buckets via SQL (no manual dashboard clicking
-- needed) and (re)applies every policy idempotently.
-- ─────────────────────────────────────────────────────────────────────────

-- 1) Create the storage buckets (safe to re-run; no-op if they already exist)
insert into storage.buckets (id, name, public)
values ('course-documents', 'course-documents', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('course-ppts', 'course-ppts', true)
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────────────────
-- 2) Table: module_ppts — one PPT/PPTX per course module (mirrors
--    module_videos). Uploading a new file for the same course+module
--    replaces the previous one (upsert on course_slug+module_num).
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists module_ppts (
  course_slug text not null,
  module_num int not null,
  ppt_url text,
  ppt_label text,
  updated_at timestamptz default now(),
  updated_by text,
  primary key (course_slug, module_num)
);

alter table module_ppts enable row level security;

drop policy if exists "public read module_ppts" on module_ppts;
create policy "public read module_ppts"
  on module_ppts for select
  using (true);

drop policy if exists "admin insert module_ppts" on module_ppts;
create policy "admin insert module_ppts"
  on module_ppts for insert
  with check (auth.jwt() ->> 'email' in ('julia.utomo@gmail.com', 'tiffany.utomo@gmail.com'));

drop policy if exists "admin update module_ppts" on module_ppts;
create policy "admin update module_ppts"
  on module_ppts for update
  using (auth.jwt() ->> 'email' in ('julia.utomo@gmail.com', 'tiffany.utomo@gmail.com'));

-- ─────────────────────────────────────────────────────────────────────────
-- 3) Storage policies for the course-ppts bucket
-- ─────────────────────────────────────────────────────────────────────────
drop policy if exists "Public read course-ppts" on storage.objects;
create policy "Public read course-ppts"
  on storage.objects for select
  using (bucket_id = 'course-ppts');

drop policy if exists "Admin upload course-ppts" on storage.objects;
create policy "Admin upload course-ppts"
  on storage.objects for insert
  with check (bucket_id = 'course-ppts' and auth.jwt() ->> 'email' in ('julia.utomo@gmail.com', 'tiffany.utomo@gmail.com'));

drop policy if exists "Admin update course-ppts" on storage.objects;
create policy "Admin update course-ppts"
  on storage.objects for update
  using (bucket_id = 'course-ppts' and auth.jwt() ->> 'email' in ('julia.utomo@gmail.com', 'tiffany.utomo@gmail.com'));

drop policy if exists "Admin delete course-ppts" on storage.objects;
create policy "Admin delete course-ppts"
  on storage.objects for delete
  using (bucket_id = 'course-ppts' and auth.jwt() ->> 'email' in ('julia.utomo@gmail.com', 'tiffany.utomo@gmail.com'));

-- ─────────────────────────────────────────────────────────────────────────
-- 4) Re-apply storage policies for course-documents (idempotent — this is
--    the actual fix for the upload error, now that the bucket exists above)
-- ─────────────────────────────────────────────────────────────────────────
drop policy if exists "Public read course-documents" on storage.objects;
create policy "Public read course-documents"
  on storage.objects for select
  using (bucket_id = 'course-documents');

drop policy if exists "Admin upload course-documents" on storage.objects;
create policy "Admin upload course-documents"
  on storage.objects for insert
  with check (bucket_id = 'course-documents' and auth.jwt() ->> 'email' in ('julia.utomo@gmail.com', 'tiffany.utomo@gmail.com'));

drop policy if exists "Admin delete course-documents" on storage.objects;
create policy "Admin delete course-documents"
  on storage.objects for delete
  using (bucket_id = 'course-documents' and auth.jwt() ->> 'email' in ('julia.utomo@gmail.com', 'tiffany.utomo@gmail.com'));
