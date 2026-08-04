# Belajar Claude — How We Work Together (Read This First)

This explains how Julia and [friend] collaborate on this project, each from our own laptop, each through our own Claude session — without stepping on each other's work, and without accidentally breaking the live website.

Neither of us writes code by hand. Claude writes and pushes all changes for us. This doc is really a set of instructions for **Claude**, written so both of us can tell our sessions the same thing and get consistent behavior.

---

## The two environments

There are two versions of this project living on GitHub:

- **`dev`** — the practice/testing version. This is where all normal work happens. Nothing here is visible to real customers.
- **`main`** — the real, live website (belajarclaude.id). Only finished, checked work goes here.

Think of `dev` as a shared draft, and `main` as "published."

## The default rule

**Unless you say otherwise, tell your Claude session to work on `dev`.** That's the safe default for everyday changes — new content, fixes, tweaks, anything you're still checking.

**Only ask Claude to push to `main` / "make it live" / "ship it" when you're sure it's ready.** Say it explicitly, in plain words — there's no special command needed, just say things like:
- "push this to production"
- "make this live"
- "ship it"

If you don't say one of those, Claude should assume `dev`.

**For anything involving prices, payments, or the database**, Claude should ask before pushing either way, even if you sound sure — those are the expensive-to-fix-if-wrong changes.

Claude will always tell you clearly which one it did — "pushed to dev" or "pushed to main (now live)" — at the end of its response. If that's ever missing or unclear, ask.

## How to check your work before it's live

Once a change is pushed to `dev`, there's a preview link (separate from the real site) where you can click around and see it for real before deciding it's ready. Ask Claude for the current dev preview link if you're not sure what it is.

## Merging — moving finished work from `dev` to `main`

When a batch of changes on `dev` has been checked and both of us are happy with it, either of us can just tell our Claude session: **"merge dev into main."** Claude handles the git mechanics. This is meant to happen occasionally and deliberately — at the end of a work session, or once a related set of changes is done — not after every single small edit.

## Working at the same time without colliding

Since we're both directing Claude independently, the main risk isn't "merge conflicts" in the technical sense — it's two sessions touching the same page/file around the same time without knowing it. To avoid that:

1. **Give each other a quick heads-up** (WhatsApp or wherever) before starting a session — "I'm about to work on the admin page" or "touching the pricing page for a bit." Same as you'd do with a coworker at a shared desk.
2. **Claude should always pull the latest version right before pushing**, never push from something it fetched a while ago in a long conversation. This is Claude's responsibility, not something either of us has to remember.
3. If Claude ever hits a real conflict (both of us changed the exact same thing), it should stop and show us both versions rather than guessing which one to keep.

## What `dev` does NOT protect you from (important — read this)

The dev/prod split only separates the *website code* — layout, copy, features. It does **not** separate the data or the backend behind it. Both the dev preview link and the real live site talk to the exact same real systems underneath. Concretely:

- **The admin page (`admin.html`)** reads and writes the one real database, no matter which link you opened it from. Uploading a PDF, changing a video, editing pricing, or touching social links there is always a real, live change — even on the dev link. There is currently no separate "practice" database to test in.
- **Checkout and sign-up are now split — dev is genuinely sandbox.** As of the second Railway environment set up for the backend, the `dev` link talks to its own separate backend service using Duitku's sandbox (no real money moves, no real charge). The real live site still talks to the real backend. See "Payments: dev vs. production" below for exactly how this works and what to double-check before relying on it.
- **Course files (PDFs, videos, slides)** live in one shared storage location too — same file, whichever link you're viewing it from.
- **The automatic check (CI)** only catches broken code (typos, broken links) — it doesn't check whether a change actually works correctly, and it doesn't block a merge by itself (nothing stops a merge from happening even if the check fails; it's a heads-up, not a lock).

Bottom line: `dev` is genuinely safe for trying out page content, layout, and copy changes. It is **not** safe for testing anything involving the admin page, purchases, sign-ups, or file uploads — those are always real, on either link. Treat that category of change as "always production" and be extra careful with it regardless of which URL you're looking at.

## Payments: dev vs. production (Duitku)

Our payment provider is Duitku. It has two completely separate environments — sandbox (fake money, for testing) and production (real money) — each with its own separate merchant login, not just a setting you flip.

**How to check which one we're actually using right now:** log into `passport.duitku.com/merchant/Project` and look at which project the merchant code currently set in Railway belongs to — it'll say Sandbox or Production. This is the only fully reliable way to check; don't assume based on whether things "look real," because Duitku's sandbox is a genuine working system, not a stub — it gives real-looking responses even though no money moves.

**What's set up now**: a second Railway environment ("dev," under the same `belajar-claude-backend` project) tracks the `dev` branch, on its own public URL (`belajar-claude-backend-dev.up.railway.app`), with sandbox Duitku credentials and `DUITKU_ENV` left unset (= sandbox by default). The frontend's `backend-config.js` routes production traffic (belajarclaude.id) to the real backend and everything else to this dev backend. Both dev environments (Cloudflare's frontend preview and Railway's dev backend) now talk to each other, not to production.

**Going to real production, when Duitku approves**: two things need to happen on the **production** Railway environment specifically (never the dev one) — set `DUITKU_MERCHANT_CODE`/`DUITKU_API_KEY` to the real production credentials, and add `DUITKU_ENV=production`. Nothing on the dev side needs to change when that happens; it stays on sandbox regardless.

**One caveat that's still true**: both Railway environments (dev and production) still write to the same real Supabase database — there's no separate staging database (deferred earlier, blocked by Supabase's free-tier 2-project cap). So a sandbox test purchase that's manually completed all the way through Duitku's fake-payment simulator will still create a real row in the live `enrollments` table, just with no real money involved. Harmless, but worth knowing so a sandbox test doesn't get confused for a genuine signup later.

## What each of us needs, technically

- Both of us have our own GitHub login with access to the project (already done).
- Each Claude session pushes using its own login — so changes are traceable to whoever actually asked for them.
- Neither of us needs to install anything, use the command line, or understand git. Just talk to Claude normally and follow the "say it if you mean production" rule above.

---

*This file lives in the project's GitHub repo so either Claude session can read it at the start of a conversation. If anything here changes, update this file so we both stay in sync — don't just remember it verbally.*
