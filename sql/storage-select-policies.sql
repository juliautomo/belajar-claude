-- Fixes "new row violates row-level security policy" on every admin.html
-- upload to course-pdfs / course-ppts / course-videos / course-documents.
--
-- Root cause: Supabase Storage's upload endpoint always performs an internal
-- INSERT ... RETURNING *, and RETURNING requires the just-inserted row to be
-- visible under SELECT RLS. These 4 buckets had INSERT/UPDATE policies but
-- no SELECT policy at all, so the RETURNING clause's own visibility check
-- failed — and Postgres reports that as the same generic "row violates
-- row-level security policy" error, even though the INSERT itself was
-- correctly permitted. Confirmed directly: the exact same INSERT succeeded
-- without a RETURNING clause and failed with one, under identical JWT claims.
--
-- All 4 buckets are public (content already served via getPublicUrl
-- regardless of RLS), so this matches the existing "Public read
-- community-images" policy's pattern: open SELECT scoped only by bucket_id.
--
-- Already applied directly to production (ctqtdqbsucbhikwnagvl) via
-- Supabase MCP, Checkpoint 186 (Aug 10, 2026). Idempotent guard included
-- for anyone re-running this against a fresh/staging project.

do $$
begin
  if not exists (
    select 1 from pg_policy where polrelid = 'storage.objects'::regclass and polname = 'Public read course-pdfs'
  ) then
    create policy "Public read course-pdfs" on storage.objects
      for select using (bucket_id = 'course-pdfs');
  end if;

  if not exists (
    select 1 from pg_policy where polrelid = 'storage.objects'::regclass and polname = 'Public read course-ppts'
  ) then
    create policy "Public read course-ppts" on storage.objects
      for select using (bucket_id = 'course-ppts');
  end if;

  if not exists (
    select 1 from pg_policy where polrelid = 'storage.objects'::regclass and polname = 'Public read course-videos'
  ) then
    create policy "Public read course-videos" on storage.objects
      for select using (bucket_id = 'course-videos');
  end if;

  if not exists (
    select 1 from pg_policy where polrelid = 'storage.objects'::regclass and polname = 'Public read course-documents'
  ) then
    create policy "Public read course-documents" on storage.objects
      for select using (bucket_id = 'course-documents');
  end if;
end $$;
