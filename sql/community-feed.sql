-- ─────────────────────────────────────────────────────────────────────────
-- Belajar Claude — Community feed (minimal v1: post, like, comment)
-- Run this ONCE in Supabase Dashboard → SQL Editor (project: ctqtdqbsucbhikwnagvl)
-- Powers community.html. Members-only: read/write requires a logged-in
-- session (auth.uid() is not null) — logged-out / anon visitors see nothing.
-- author_name is denormalized onto each row at write time (from the
-- poster's own session), so the feed never needs to look up other users'
-- profiles — avoids exposing profile data through RLS.
-- No category column in v1 — deliberately dropped from scope, easy to add
-- later (`alter table community_posts add column category text;`) if wanted.
-- ─────────────────────────────────────────────────────────────────────────

create table if not exists community_posts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  author_name text not null,
  content text not null,
  created_at timestamptz default now()
);

create table if not exists community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references community_posts(id) on delete cascade,
  email text not null,
  author_name text not null,
  content text not null,
  created_at timestamptz default now()
);

create table if not exists community_likes (
  post_id uuid not null references community_posts(id) on delete cascade,
  email text not null,
  created_at timestamptz default now(),
  primary key (post_id, email)
);

create index if not exists community_comments_post_id_idx on community_comments(post_id);
create index if not exists community_likes_post_id_idx on community_likes(post_id);

alter table community_posts enable row level security;
alter table community_comments enable row level security;
alter table community_likes enable row level security;

-- Posts: any logged-in member can read all posts; write/delete restricted to own row (+ admins can delete for moderation).
drop policy if exists "members read community_posts" on community_posts;
create policy "members read community_posts"
  on community_posts for select
  using (auth.uid() is not null);

drop policy if exists "own insert community_posts" on community_posts;
create policy "own insert community_posts"
  on community_posts for insert
  with check (auth.jwt() ->> 'email' = email);

drop policy if exists "own or admin delete community_posts" on community_posts;
create policy "own or admin delete community_posts"
  on community_posts for delete
  using (auth.jwt() ->> 'email' = email or auth.jwt() ->> 'email' in ('julia.utomo@gmail.com', 'tiffany.utomo@gmail.com'));

-- Comments: same pattern as posts.
drop policy if exists "members read community_comments" on community_comments;
create policy "members read community_comments"
  on community_comments for select
  using (auth.uid() is not null);

drop policy if exists "own insert community_comments" on community_comments;
create policy "own insert community_comments"
  on community_comments for insert
  with check (auth.jwt() ->> 'email' = email);

drop policy if exists "own or admin delete community_comments" on community_comments;
create policy "own or admin delete community_comments"
  on community_comments for delete
  using (auth.jwt() ->> 'email' = email or auth.jwt() ->> 'email' in ('julia.utomo@gmail.com', 'tiffany.utomo@gmail.com'));

-- Likes: read all (to show counts + who-liked state), insert/delete own only (toggle).
drop policy if exists "members read community_likes" on community_likes;
create policy "members read community_likes"
  on community_likes for select
  using (auth.uid() is not null);

drop policy if exists "own insert community_likes" on community_likes;
create policy "own insert community_likes"
  on community_likes for insert
  with check (auth.jwt() ->> 'email' = email);

drop policy if exists "own delete community_likes" on community_likes;
create policy "own delete community_likes"
  on community_likes for delete
  using (auth.jwt() ->> 'email' = email);
