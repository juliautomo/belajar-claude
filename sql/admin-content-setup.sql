-- ─────────────────────────────────────────────────────────────────────────
-- Belajar Claude — Admin Content Manager setup
-- Run this ONCE in Supabase Dashboard → SQL Editor (project: ctqtdqbsucbhikwnagvl)
-- Creates tables for admin-managed PDFs + module videos, with RLS locked
-- down to the two admin emails for writes, public read for everyone.
-- ─────────────────────────────────────────────────────────────────────────

-- 1) Table: course_resources — one PDF per course
create table if not exists course_resources (
  course_slug text primary key,
  pdf_url text,
  pdf_label text,
  updated_at timestamptz default now(),
  updated_by text
);

alter table course_resources enable row level security;

drop policy if exists "public read course_resources" on course_resources;
create policy "public read course_resources"
  on course_resources for select
  using (true);

drop policy if exists "admin insert course_resources" on course_resources;
create policy "admin insert course_resources"
  on course_resources for insert
  with check (auth.jwt() ->> 'email' in ('julia.utomo@gmail.com', 'tiffany.utomo@gmail.com'));

drop policy if exists "admin update course_resources" on course_resources;
create policy "admin update course_resources"
  on course_resources for update
  using (auth.jwt() ->> 'email' in ('julia.utomo@gmail.com', 'tiffany.utomo@gmail.com'));

-- 2) Table: module_videos — one video per course module
create table if not exists module_videos (
  course_slug text not null,
  module_num int not null,
  video_url text,
  updated_at timestamptz default now(),
  updated_by text,
  primary key (course_slug, module_num)
);

alter table module_videos enable row level security;

drop policy if exists "public read module_videos" on module_videos;
create policy "public read module_videos"
  on module_videos for select
  using (true);

drop policy if exists "admin insert module_videos" on module_videos;
create policy "admin insert module_videos"
  on module_videos for insert
  with check (auth.jwt() ->> 'email' in ('julia.utomo@gmail.com', 'tiffany.utomo@gmail.com'));

drop policy if exists "admin update module_videos" on module_videos;
create policy "admin update module_videos"
  on module_videos for update
  using (auth.jwt() ->> 'email' in ('julia.utomo@gmail.com', 'tiffany.utomo@gmail.com'));

-- ─────────────────────────────────────────────────────────────────────────
-- 3) Storage buckets — create these manually first (see steps below), THEN
--    run the policies underneath. Dashboard → Storage → New bucket:
--      - name: course-pdfs     | Public bucket: ON
--      - name: course-videos   | Public bucket: ON
-- ─────────────────────────────────────────────────────────────────────────

drop policy if exists "Public read course-pdfs" on storage.objects;
create policy "Public read course-pdfs"
  on storage.objects for select
  using (bucket_id = 'course-pdfs');

drop policy if exists "Admin upload course-pdfs" on storage.objects;
create policy "Admin upload course-pdfs"
  on storage.objects for insert
  with check (bucket_id = 'course-pdfs' and auth.jwt() ->> 'email' in ('julia.utomo@gmail.com', 'tiffany.utomo@gmail.com'));

drop policy if exists "Admin update course-pdfs" on storage.objects;
create policy "Admin update course-pdfs"
  on storage.objects for update
  using (bucket_id = 'course-pdfs' and auth.jwt() ->> 'email' in ('julia.utomo@gmail.com', 'tiffany.utomo@gmail.com'));

drop policy if exists "Public read course-videos" on storage.objects;
create policy "Public read course-videos"
  on storage.objects for select
  using (bucket_id = 'course-videos');

drop policy if exists "Admin upload course-videos" on storage.objects;
create policy "Admin upload course-videos"
  on storage.objects for insert
  with check (bucket_id = 'course-videos' and auth.jwt() ->> 'email' in ('julia.utomo@gmail.com', 'tiffany.utomo@gmail.com'));

drop policy if exists "Admin update course-videos" on storage.objects;
create policy "Admin update course-videos"
  on storage.objects for update
  using (bucket_id = 'course-videos' and auth.jwt() ->> 'email' in ('julia.utomo@gmail.com', 'tiffany.utomo@gmail.com'));
