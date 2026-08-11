-- ─────────────────────────────────────────────────────────────────────────
-- Belajar Claude — Community feed v2: category, pinned posts, image upload
-- Run this ONCE in Supabase Dashboard → SQL Editor (project: ctqtdqbsucbhikwnagvl)
-- Requires community-feed.sql to already be applied (community_posts must exist).
-- Search itself needs no schema change — done client-side over loaded posts.
-- ─────────────────────────────────────────────────────────────────────────

alter table community_posts add column if not exists category text;
alter table community_posts add column if not exists pinned boolean not null default false;
alter table community_posts add column if not exists image_url text;
alter table community_posts add column if not exists image_path text;

-- Pin/unpin is the only UPDATE this table needs — restricted to admins only,
-- same two hardcoded emails used everywhere else in this codebase (ADMIN_EMAILS).
drop policy if exists "admin update community_posts" on community_posts;
create policy "admin update community_posts"
  on community_posts for update
  using (auth.jwt() ->> 'email' in ('julia.utomo@gmail.com', 'tiffany.utomo@gmail.com'));

-- ─────────────────────────────────────────────────────────────────────────
-- Storage bucket — create manually first, THEN run the policies below.
-- Dashboard → Storage → New bucket:
--   - name: community-images  | Public bucket: ON
--
-- Upload path convention: '<uploader-email>/<timestamp>-<filename>' — lets
-- the insert/delete policies below verify a member can only write into
-- their own folder, by checking the first path segment against their own
-- JWT email (same idea Supabase's own docs use for user-scoped storage).
-- ─────────────────────────────────────────────────────────────────────────

drop policy if exists "Public read community-images" on storage.objects;
create policy "Public read community-images"
  on storage.objects for select
  using (bucket_id = 'community-images');

drop policy if exists "Own upload community-images" on storage.objects;
create policy "Own upload community-images"
  on storage.objects for insert
  with check (bucket_id = 'community-images' and (storage.foldername(name))[1] = auth.jwt() ->> 'email');

drop policy if exists "Own or admin delete community-images" on storage.objects;
create policy "Own or admin delete community-images"
  on storage.objects for delete
  using (bucket_id = 'community-images' and (
    (storage.foldername(name))[1] = auth.jwt() ->> 'email'
    or auth.jwt() ->> 'email' in ('julia.utomo@gmail.com', 'tiffany.utomo@gmail.com')
  ));
