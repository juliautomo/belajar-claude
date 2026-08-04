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

## What each of us needs, technically

- Both of us have our own GitHub login with access to the project (already done).
- Each Claude session pushes using its own login — so changes are traceable to whoever actually asked for them.
- Neither of us needs to install anything, use the command line, or understand git. Just talk to Claude normally and follow the "say it if you mean production" rule above.

---

*This file lives in the project's GitHub repo so either Claude session can read it at the start of a conversation. If anything here changes, update this file so we both stay in sync — don't just remember it verbally.*
