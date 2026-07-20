-- ─────────────────────────────────────────────────────────────────────────
-- Belajar Claude — fix for "Hapus" (delete) not working on Video/PPT cells
-- Run this ONCE in Supabase Dashboard → SQL Editor (project: ctqtdqbsucbhikwnagvl)
--
-- Root cause: module_videos and module_ppts were created with SELECT/INSERT/
-- UPDATE row-level-security policies only — no DELETE policy was ever added
-- (module_documents got one, these two didn't). With RLS enabled and no
-- matching DELETE policy, Postgres/Supabase doesn't throw an error — it just
-- matches zero rows, so the admin panel's "Hapus" button silently does
-- nothing and the row stays. This adds the missing DELETE policies, same
-- pattern as the existing "admin delete module_documents" policy.
-- ─────────────────────────────────────────────────────────────────────────

drop policy if exists "admin delete module_videos" on module_videos;
create policy "admin delete module_videos"
  on module_videos for delete
  using (auth.jwt() ->> 'email' in ('julia.utomo@gmail.com', 'tiffany.utomo@gmail.com'));

drop policy if exists "admin delete module_ppts" on module_ppts;
create policy "admin delete module_ppts"
  on module_ppts for delete
  using (auth.jwt() ->> 'email' in ('julia.utomo@gmail.com', 'tiffany.utomo@gmail.com'));
