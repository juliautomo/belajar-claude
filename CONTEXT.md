# Belajar Claude — Project Context & Checkpoint
_Last updated: July 24, 2026 (checkpoint 46)_

## What is Belajar Claude
Indonesian-language Claude AI learning platform (formerly Klaud.id). Users sign up, enroll in courses, complete modules, and earn badges. Hosted on **Cloudflare** (`belajar-claude.belajarclaude-id.workers.dev`) — migrated off Vercel July 24, 2026.

---

## Tech Stack
- **Frontend**: Plain HTML/CSS/JS (no framework)
- **Backend**: Supabase (auth, database, RLS)
- **Config**: `supabase-config.js` — shared across all pages
- **Hosting**: Cloudflare Workers (static assets) — `belajar-claude.belajarclaude-id.workers.dev`. Previously Vercel, before that GitHub Pages. Vercel project deleted July 24, 2026.
- **GitHub repo**: `juliautomo/belajar-claude` (renamed from `klaud-id`)
- **Backend repo**: `juliautomo/belajar-claude-backend** (Node.js — `index.js`, `mailer.js`, `sheets.js`)

---

## Git / Claude Workflow
- **belajar-claude push**: PAT (ask Julia for current token) embedded in remote URL. Claude clones to `/tmp/bc-push`, edits there, and pushes. Windows-mounted `.git/` folder blocks lock file writes so direct git from mount doesn't work.
- **belajar-claude-backend push**: Same PAT, clones to `/tmp/belajar-claude-backend`. Local folder at `C:\Users\julia\GitHub\belajar-claude-backend\`.
- **Local file sync**: Claude edits files directly on the Windows mount via file tools AND in `/tmp` clone before pushing. Both stay in sync.
- **K2 files**: All K2-related files are in `C:\Users\julia\GitHub\belajar-claude\K2-Produktivitas\` (moved July 11, 2026)
- **Pulling latest**: Claude can't `git pull` on Windows mounts. Workaround: `git clone --depth=1` to `/tmp`, then copy files as needed.

## Local Folder Structure (as of June 2026)
- `C:\Users\julia\GitHub\belajar-claude\` — frontend project files
- `C:\Users\julia\GitHub\belajar-claude-backend\` — Node.js backend
- **Cowork**: Mount `belajar-claude` and `belajar-claude-backend` separately in each session.

---

## SHIPPED (Checkpoint 32, July 23, 2026): Payment Restructure — Per-Course → One-Time Platform-Wide Access

**Status: live.** Julia decided: all-access price **Rp 399,000**, launch immediately (only `produktivitas` + `content-marketing` are actually built, rest are "coming soon" — sentinel-row design means they auto-unlock later with no backfill), and **grandfather existing paying customers** in free.

**What actually shipped:**
- Backend `index.js`: added `'all-access'` SKU (Rp 399,000) to `COURSES`. No expansion logic needed in the webhook — `all-access` is deliberately *not* listed in `PAKET_COURSES`, so a purchase inserts exactly one sentinel `enrollments` row (`course_slug: 'all-access'`). Comment added in the code explaining why, for future maintainers.
- `mailer.js`: `sendAccessEmail()` takes a new `isAllAccess` flag (set from `courseSlug === 'all-access'` in the webhook call) and swaps in generic "semua kursus" copy for subject line, hero text, and intro line instead of naming one course.
- `sheets.js`: no code change needed — it already took `course` as a passthrough string, so All Access purchases log as their own "All Access — Semua Kursus" line in the Pembeli tab automatically.
- Access gates updated to accept **`all-access` OR the specific course slug** in: `produktivitas-content.html`, `content-marketing-content.html` (the hard redirect-if-not-enrolled checks), plus the softer "already own this, show Buka Kursus button" checks on `produktivitas.html`, `content-marketing.html`, `mulai-claude.html`, `kursus-karyawan.html`, `kursus-mahasiswa.html`, `kursus-ukm.html`, `paket-content-creator.html`, and the returning-user subtext on `index.html`.
- `dashboard.html`: added an all-access expansion block right after the existing `PAKET_COURSES` expansion — if the user has an `all-access` row, every slug in `ALL_COURSES` not already present gets synthesized into their enrollment list (same pattern/precedent as paket expansion, which already did this for `comingSoon` slugs like `analisis-data`). This makes "has all-access" behave as "enrolled in everything," automatically covering courses added later since it re-derives from `ALL_COURSES` on every page load rather than snapshotting at purchase time.
- New page **`all-access.html`** — dedicated sales/checkout page for the SKU, same visual template as `produktivitas.html`, wired to real `/create-payment` with `courseSlug: 'all-access'`. Lists all courses (live + coming soon) with status tags, a value/FAQ section, and the standard Duitku payment modal.
- `index.html`: added a dark promo banner inside the `#kursus` section ("Mau semua kursus?") linking to `all-access.html`, plus `.allaccess-banner`/`.allaccess-btn` CSS.
- `sql/grandfather-all-access.sql`: idempotent migration (safe to re-run) that gives every email with an existing `type = 'paid'` enrollment a free `all-access` sentinel row. **Already run against production** `ctqtdqbsucbhikwnagvl` this checkpoint — at run time there was exactly one distinct paying email (`julia.utomo@gmail.com`, 3 paid rows), now also has an `all-access` row (`reference: 'GRANDFATHERED'`, `amount: 0`).
- No database schema migration — reuses the existing `enrollments` table as planned.

**Deliberately not touched / flagged for a future pass:**
- `paket.html` is a separate, stale, **unwired mockup** (buttons link to `login.html`, no real `/create-payment` call, prices don't match the real `COURSES` catalog at all — e.g. it advertises "All Access — Rp 999K" for a fake "9-course" bundle). It's a different artifact from the 4 real `paket-*` sales pages (`kursus-karyawan.html` etc., which *are* wired to real backend SKUs). Left alone this pass to avoid scope creep; Julia may want to retire/redirect it later so it stops advertising a conflicting All Access price.
- The 4 real `paket-*` bundle sales pages (`kursus-karyawan.html`, `kursus-mahasiswa.html`, `kursus-ukm.html`, `paket-content-creator.html`) still work as before and were only touched to also recognize `all-access` as granting access — not retired, since they were already unlinked from nav per Checkpoint 12 and retiring them is a separate call.
- The RLS "Allow all" finding from the original research pass (real tables have `USING (true)` policies, so the anon key could theoretically insert fake enrollments client-side) is still unaddressed — independent of this payment-model work, flagged again here as a follow-up.

## SHIPPED (Checkpoint 33, July 23, 2026): Admin-Controlled Pricing + Scheduled Discount for All Access

**Status: live.** Follow-up to Checkpoint 32. Julia wanted admin.html control over the all-access price, scoped to just the `all-access` SKU (not every course/paket), with a scheduled (start/end date) discount rather than a simple on/off toggle, and sales-page prices that reflect it live rather than staying static text.

**What shipped:**
- New table `course_pricing` (`sql/course-pricing.sql`, already run against production `ctqtdqbsucbhikwnagvl`): `course_slug` PK, `base_price`, `discount_price`, `discount_start`, `discount_end`, `updated_at`, `updated_by`. RLS: public read, write restricted to the two admin emails (same pattern as `course_resources`). Seeded with `all-access` @ Rp 399,000.
- `admin.html`: new "Harga All Access" card above the course-tabs section (not tied to the per-course tab system, since only `all-access` has pricing control right now) — inputs for base price, discount price, discount start/end (`datetime-local`), a live indicator showing whether the discount is currently active and what the effective sell price is right now, and a save button that upserts to `course_pricing`.
- `index.js`: new `supabaseSelect()` GET helper + `getEffectivePrice(slug, fallback)` — computes `discount_price` if `discount_price` is set and `now()` falls inside `[discount_start, discount_end]` (either bound can be null/open-ended), else `base_price`, else the hardcoded catalog price as a last-resort fallback so a pricing-table outage never blocks checkout. `/create-payment` calls this for `courseSlug === 'all-access'` before creating the Duitku invoice, so the actual amount charged is always in sync with the admin panel. The webhook needed no change — it already trusts the `amount` Duitku echoes back from invoice creation, which is already the dynamic value.
- `all-access.html`: on load, fetches the `course_pricing` row (public read, anon key) and computes the same effective-price logic client-side to update the hero price, a strikethrough original price + "Hemat RpXXK" badge when a discount is active, the price subtext, the buy button label, and the payment modal's price line. Falls back to the static Rp 399K already in the HTML if the row is missing or the fetch fails.
- Verified the discount-window math (no row / base only / always-on discount / active window / expired window / future window) against the exact formula used in both `index.js` and `admin.html` — all 6 cases pass.

**Deliberately out of scope this pass:** per-course/paket pricing control (only `all-access` is admin-editable), any kind of promo-code system, and automatic email/notification when a discount starts or ends.

## SHIPPED (Checkpoint 34, July 23, 2026): All Access Is Now the Only Paid Path

**Status: live.** Follow-up to Checkpoints 32/33. Julia's direction: "no more single price... the rest should be included in the all course bundle." Single-course and paket purchases are fully retired — **All Access (Rp 399K, admin-editable) is the only thing for sale.** Only "20 Prompt Gratis" stays genuinely free/standalone.

**Key decision: "Dasar Claude AI" (`mulai-claude`) moved from free to All-Access-only.** It was previously open to any logged-in user (auto-enrolled with a free `enrollments` row on first visit). Julia chose to gate it behind All Access rather than keep it as a second free course.

**What shipped:**
- `index.js`: `/create-payment` now rejects any `courseSlug` other than `'all-access'` (HTTP 410, Indonesian error message pointing to All Access). The `COURSES` catalog object itself is untouched — other slugs stay in it as inert historical metadata (name/price lookups for old enrollment rows), they're just no longer purchasable through the endpoint.
- `mulai-claude-content.html`: removed the auto free-enrollment upsert in `init()`. Added a real access gate — **checks only for an `all-access` enrollment row**, not the legacy free `mulai-claude` row, so old auto-granted access no longer counts. Admins bypass as usual. Redirects to `all-access.html` if missing.
- `dashboard.html`: added a filter so a legacy free `mulai-claude` row (from before this change) is dropped from `rawEnrollments` unless the user also has a real `all-access` row — otherwise the dashboard would show "enrolled" for a course the content-page gate now blocks. Real all-access owners still get `mulai-claude` back automatically via the existing all-access expansion. `ALL_COURSES` entries for `mulai-claude`/`produktivitas`/`content-marketing` now have `salesLink: 'all-access.html'` (direct, skips the redirect-stub hop) and `price: 'Termasuk All Access'`; the 5 coming-soon courses got the same price-label treatment for consistency (they were never individually purchasable via the UI, but the explore-card price text was stale).
- **8 pages replaced with redirect stubs** (`<meta http-equiv="refresh">` + `window.location.replace`, both pointing to `all-access.html`): `mulai-claude.html`, `produktivitas.html`, `content-marketing.html`, `kursus-karyawan.html`, `kursus-mahasiswa.html`, `kursus-ukm.html`, `paket-content-creator.html`, and the stale unwired `paket.html` mockup flagged in Checkpoint 32 (now cleaned up rather than left dangling with a conflicting fake price). Old bookmarked/shared links to any of these still resolve, just via one extra hop.
- `index.html`: course carousel badges for "Dasar Claude AI" / "Produktivitas Kantor" / "Content & Marketing" changed from FREE/priced to a purple "ALL ACCESS" badge + "✨ Termasuk All Access" footer text, all three linking straight to `all-access.html`. `section-sub` copy rewritten. The All Access promo banner's price (`#allaccessBannerPrice`) now fetches live from `course_pricing` on page load instead of a hardcoded "Rp 399K" string, same discount-window logic as `all-access.html`/`admin.html`.
- Cross-sell "Lanjutkan Belajar" cards updated across content pages: `prompt-gratis-content.html`'s card to "Mulai dengan Claude AI" now points to `all-access.html` (it's a genuine upsell — most visitors here don't own all-access yet) with copy no longer claiming it's free. `mulai-claude-content.html`'s and `produktivitas-content.html`'s next-course cards now link straight to the *content* pages (`produktivitas-content.html`, `content-marketing-content.html`) instead of sales pages, since anyone reaching those cards already has access (worst case, an unauthorized visitor just bounces through the content page's own gate back to `all-access.html` — no broken state either way).
- Verified with a repo-wide grep: **zero remaining references** to any of the 8 retired page filenames anywhere in the codebase outside the stubs' own self-referential meta tags, and zero remaining `courseSlug: 'produktivitas'`/`'content-marketing'`/`'mulai-claude'`/`'paket-*'` payment calls.

**Deliberately not done — flagged for Julia:** existing legacy free `mulai-claude` enrollment rows (auto-granted to anyone who ever visited the course before this change) were **not deleted from the database** — they're just no longer honored for access. This is the safer, reversible choice; if Julia wants a full data cleanup (e.g. to keep the `enrollments` table tidy or for reporting accuracy), that's a separate, explicit ask since it touches user data.

**Original architecture notes (still accurate, kept for reference):**
- Payment gateway: Duitku (not Stripe/Midtrans/Xendit — confirmed from `belajar-claude-backend/index.js`).
- Backend `COURSES` catalog (slug → name/price/link/tag) in `index.js` is the single source of truth for what's purchasable.
- `POST /create-payment` takes a `courseSlug`; the Duitku webhook (`/webhook/duitku`) grants access by inserting a row into Supabase `enrollments` (columns: `email, course_slug, course_name, type, amount, reference, enrolled_at, name`).
- A bundle precedent already exists: 4 `paket-*` SKUs (karyawan/mahasiswa/pengusaha/creator) each expand into 2-4 constituent courses at purchase time via a `PAKET_COURSES` map (duplicated in `index.js` and `dashboard.html`) — one enrollment row gets inserted per constituent course. This is the closest working analog to "buy once, get many," but it enumerates courses at purchase time rather than a flag, so it wouldn't auto-cover courses added after purchase.
- Every paid content page (`produktivitas-content.html`, `content-marketing-content.html`) independently checks client-side for an `enrollments` row matching its own exact `course_slug` before granting access.
- `dashboard.html` expands `paket-*` enrollments into constituent courses via the same hardcoded map, then filters against a hardcoded `ALL_COURSES` catalog.

**What needs to change:**
1. Backend `index.js` — add one new SKU (e.g. `all-access`) with its own price. Change the webhook so a successful `all-access` payment inserts a **single sentinel row** (`course_slug: 'all-access'`) rather than enumerating every course — this way anyone who buys in automatically gets access to courses added later, no backfill needed. (Reusing the `PAKET_COURSES`-style per-course expansion was considered but rejected for this reason.)
2. `mailer.js` — new confirmation email copy that doesn't reference one specific course.
3. `sheets.js` — handle "All Access" as its own line item in the "Pembeli" ledger tab.
4. Every paid content page's access check — accept "has `all-access` row" OR "has this specific course row," not just the latter.
5. Checkout/sales pages — point at the new single SKU. Likely means consolidating to one pricing page; the 4 existing `paket-*` bundle sales pages would probably be retired/redirected once all-access supersedes them (they're currently live but already unlinked from site nav per Checkpoint 12).
6. `dashboard.html` — treat "has all-access" as "enrolled in everything in `ALL_COURSES`," same logic update as #4.
7. Database — **no schema migration is strictly required**; the sentinel-row approach reuses the existing `enrollments` table as-is.

**Separate but related finding, surfaced while researching this (own decision on whether to bundle together):** the real `enrollments`, `profiles`, `module_completions`, and `waitlist` tables in the production Supabase project have RLS *enabled* but with a policy literally named "Allow all" (`USING (true)`, `WITH CHECK (true)`) — functionally no protection. Since the anon key ships in every page, anyone could currently insert a fake paid enrollment via browser devtools. Confirmed real Supabase Auth is in use (`signInWithPassword` in `login-modal.js`), so a proper per-user-email RLS policy is straightforward to write whenever Julia wants it done — independent of the payment-model decision above, but touches the same table so could be done in the same pass.

---

## SHIPPED (Checkpoint 35, July 23, 2026): index.html Redesign + "20 Prompt Gratis" Gated Too

**Status: live.** Two changes, previewed as an HTML mockup in-chat before implementation (per Julia's request) and approved before building.

**1. `index.html` hero + course section redesigned.** Replaced the old single-column hero + paginated 2-page course carousel with a new layout (structure borrowed from a reference file Julia provided, reskinned with our actual fonts/colors — Instrument Serif headlines, Geist body, `#6C47FF` purple, existing `--bg`/`--surface`/`--border` variables, no new fonts introduced):
- Hero is now a 2-column split: headline + actions on the left, an All Access pricing card on the right (price synced live from `course_pricing`, same pattern as the old banner it replaces).
- New 3-column "value strip" (Semua kursus / Sekali bayar / Kursus baru termasuk) between hero and course library.
- Course library is now a single non-paginated grid (5 cards: 20 Prompt Gratis, Dasar Claude AI, Produktivitas Kantor, Content & Marketing, all tagged "ALL ACCESS", plus one generic "Kursus Berikutnya" card covering the coming-soon courses **without a specific count** — Julia explicitly didn't want a number like "+4" committed in copy since the coming-soon lineup isn't fixed). The old carousel pagination (`gotoCoursePage`, prev/next buttons, dots, 2-page split) was removed entirely since everything now fits in one grid.
- Bottom CTA changed from a full-bleed dark section to a contained rounded dark card, plus a new 2-item "reassurance" section beneath it. Personalization JS (logged-in users see "Buka Dashboard" + progress-aware subtext) is unchanged, just re-pointed at the new markup.

**2. "20 Prompt Gratis" (`prompt-gratis`) moved from free to All-Access-only** — the last remaining free course, following the same pattern as `mulai-claude` in Checkpoint 34. The platform now has **zero free course content**; only account creation/signup itself stays free (confirmed with Julia — signup still works via the shared login modal's Daftar tab, independent of any single page).
- `index.js` `/signup`: removed the auto-enrollment insert into `prompt-gratis` (account creation via `createSupabaseUser` is untouched).
- `dashboard.html`: removed the per-visit auto-upsert of a free `prompt-gratis` enrollment row that ran in `_init()` on every dashboard load. Extended the "drop legacy free rows unless real all-access" filter (introduced in Checkpoint 34 for `mulai-claude`) to also cover `prompt-gratis` — `LEGACY_FREE_SLUGS = ['mulai-claude', 'prompt-gratis']`. `ALL_COURSES.prompt-gratis` now has `salesLink: 'all-access.html'` and `price: 'Termasuk All Access'`.
- `prompt-gratis-content.html`: added a real access gate (previously had none beyond requiring login) — checks only for a real `all-access` enrollment row, not legacy free `prompt-gratis` rows, admins bypass. Redirects to `all-access.html` if missing.
- `prompt-gratis.html` replaced with a redirect stub → `all-access.html`, same pattern as the 8 pages retired in Checkpoint 34.
- **Admin entry-point check**: `prompt-gratis.html` used to be documented as the site's only path to `admin.html` (hidden nav link, admin-email-gated). Verified before retiring the page that `index.html` already has its own independent, working `navAdminLink` with the same admin-email check — so admin access was not lost. (`dashboard.html` also has its own admin nav item.) This was a stale cross-reference in CONTEXT.md's Pages table, corrected here.

**Deliberately not done — same as Checkpoint 34:** legacy free `prompt-gratis` enrollment rows (and now there could be a lot of them, since the dashboard auto-granted one on every visit for a long time) were **not deleted from the database**, only no longer honored for access. Flagging again in case Julia wants a cleanup pass at some point.

---

## SHIPPED (Checkpoint 36, July 23, 2026): all-access.html Cleanup + admin.html Sidebar Redesign + Social Links

**Status: live.** Based on 3 screenshots Julia shared of `all-access.html`'s course grid, the dark "compare box" section, and the footer social links — plus a request to redesign `admin.html` with a sidebar.

**1. `all-access.html` course grid cleaned up.**
- Removed the 5 individual "Segera Hadir" (coming-soon) cards (Analisis Data & Laporan, Automasi Workflow, Build AI App Sederhana, Claude API untuk Developer, Build & Monetisasi Produk AI) — confirmed with Julia these should not show up on the sales page at all, not even as non-clickable teasers.
- Also added the two courses that were missing from this grid since it was first built (Checkpoint 32, before `mulai-claude`/`prompt-gratis` were gated behind All Access in Checkpoints 34/35): **20 Prompt Gratis** and **Dasar Claude AI**, both tagged "Tersedia". Grid is now: 20 Prompt Gratis, Dasar Claude AI, Produktivitas Kantor, Content & Marketing (all "Tersedia") + one generic "Semua Kursus Baru" card ("Otomatis").
- Removed the entire dark `.compare-box` section ("Satu-satunya Cara Akses Kursus Belajar Claude") per Julia's screenshot callout.

**2. `admin.html` redesigned with a sidebar.** Previously a single scrolling page (pricing card → course tabs → PDF card → module matrix, all stacked). Now a fixed left sidebar with 4 sections, each its own panel (`switchPanel()` toggles `.panel.active` / `.sidebar-link.active`, no page reload):
- **Pricing** — the existing "Harga All Access" card (base/discount price, scheduled discount window), unchanged logic, just moved into its own panel.
- **Course Content** — the existing course tabs + PDF card + per-module video/PPT/doc matrix, unchanged logic, moved into its own panel.
- **Social Media Links** (new) — 4 text inputs (TikTok, YouTube, Instagram, WhatsApp Community), loads/saves to a new `social_links` table (single row, `id='main'`). Empty field = link hidden on the live site.
- **Who Has Access to Admin** (new) — **read-only** display of the two hardcoded admin emails (`julia.utomo@gmail.com`, `tiffany.utomo@gmail.com`). Confirmed with Julia this should NOT be a DB-backed/editable admin-management system for now, to avoid touching the ~6+ hardcoded `ADMIN_EMAILS` gate-check arrays scattered across the codebase. A hint on the panel says changes require a code change.
- Sidebar collapses to a horizontal scrollable tab row on screens ≤780px.

**3. Social links now live-editable, wired into `index.html`'s footer.** New `social_links` table (SQL run directly against production via Supabase MCP):
```sql
create table social_links (
  id text primary key default 'main',
  tiktok_url text, youtube_url text, instagram_url text, whatsapp_url text,
  updated_at timestamptz default now(), updated_by text
);
-- RLS: public read, admin-only write (same two admin emails, via auth.jwt()->>'email')
```
`index.html`'s footer "Ikuti Kami" block was hardcoded `href="#"` for all 4 platforms — now fetches the single `social_links` row on page load and only shows a link (and reveals the whole "Ikuti Kami" block) if that platform's URL is filled in AND its visibility toggle is on. Other pages' footers were checked (`grep` across the repo) and don't have real social links to wire up — only `index.html` did.

**Follow-up same day:** added an explicit show/hide toggle per platform (`tiktok_visible`, `youtube_visible`, `instagram_visible`, `whatsapp_visible` — all boolean, default `true`), since Julia wanted to be able to hide a link temporarily without clearing its URL. Each field in `admin.html`'s Social Media Links panel now has a toggle switch next to its label; flipping it off greys out (disables) the input and the field is excluded from the footer even if a URL is saved. `index.html`'s footer logic checks both `url` and `visible !== false` before rendering a link.

**Second follow-up same day:** added a contact **Email** field to the same panel (`contact_email` + `contact_email_visible`, same toggle pattern as the other 4). Basic email-format validation on save. Renders in `index.html`'s footer as `mailto:` link (no `target="_blank"`, unlike the social links).

**Not done / scope check:** Only `index.html`'s footer was wired to `social_links` — no other page currently renders a social-links footer, so nothing else needed updating. If a shared footer gets added to more pages later, point it at the same table.

**More follow-ups same day:**
- Split the contact email out of "Ikuti Kami" into its own "Hubungi Kami" (Contact Us) footer column in `index.html` — same visibility-toggle pattern, but a `mailto:` link instead of `target="_blank"`, and its own `<h4>`/`<ul>` block that only appears when the email is set + visible.
- Removed the generic "Kursus Berikutnya" catch-all card from `index.html`'s course library grid — Julia didn't want it there at all, not even as a teaser.

---

## SHIPPED (Checkpoint 37, July 23, 2026): Admin Course Placeholders + Explicit Dashboard Enrollment

**Status: live.**

**1. `admin.html` Course Content panel now lists all 9 courses, not just the 4 live ones.** Added the 5 coming-soon courses (`analisis-data`, `build-automation`, `ai-powered-app`, `claude-api-dev`, `jual-produk-ai` — slugs/module counts matched to `ALL_COURSES` in `dashboard.html`) to the `COURSES` array as regular entries (`comingSoon: true` used only for grouping/labeling, not for restricting functionality) so Julia can start prepping PDFs/videos/PPTs/docs for a course ahead of its public launch.
- The old horizontal `course-tabs` row was replaced with a grouped vertical sub-navigation (`course-subnav`) inside the Course Content panel — "Tersedia" and "Segera Hadir" sections, each course a `subnav-item` button, coming-soon ones tagged with a small pill. Sits beside the PDF/matrix cards in a two-column `content-split` layout (collapses to a horizontal scrollable row above the content on screens ≤860px). `content-area` max-width widened to 940px for this panel only (other panels stay at 760px) to give the two-column layout room.

**2. All Access purchase no longer auto-populates every course into "Kursus Kamu."** Previously (since Checkpoint 32), one `all-access` sentinel enrollment row caused `dashboard.html` to synthesize a fake per-course enrollment for every live course on every page load — so buying All Access instantly filled "Kursus Kamu" with all 4 courses, no extra action needed. Julia asked whether an explicit enroll step was possible instead, confirmed she wanted it built, so:
- Removed the sentinel-expansion loop in `dashboard.html`'s `_init()` that pushed a synthetic entry per live course into `paketExpanded`/"Kursus Kamu". "Kursus Kamu" now reflects **only real `enrollments` rows** (the sentinel row itself is filtered out via `ALL_COURSES[e.course_slug]` since `'all-access'` isn't a key in that object).
- "Jelajahi Kursus" (the unenrolled-courses grid) CTA now branches three ways: comingSoon → "Beritahu saya" (unchanged waitlist flow); live course + user has the `all-access` sentinel → new **"Mulai Kursus →"** button that calls `enrollCourse(slug)`, inserting a real `enrollments` row (`type:'paid'`, tied to the user's own session email) and reloading the dashboard so the course moves into "Kursus Kamu"; live course + no all-access → unchanged "Lihat Kursus →" link to `all-access.html` (still needs to purchase).
- **Access to course content itself is unaffected** — `*-content.html` gate checks (e.g. `produktivitas-content.html` line ~1521) already check for `course_slug in (COURSE_SLUG, 'all-access')`, so an all-access holder can still open any course directly by URL without first clicking "Mulai Kursus." This change only affects what auto-appears on the dashboard home screen, not what's actually unlocked — enrolling is now about dashboard organization, not access control.

**Not done:** Legacy `paket-*` bundle expansion logic (`PAKET_COURSES` in `dashboard.html`, for pre-migration paket-karyawan/mahasiswa/pengusaha/creator customers) was left untouched — unrelated to this change and no new purchases can create those rows anymore (backend locks `/create-payment` to `all-access` only since Checkpoint 34).

**Also checked, already working:** Julia asked to "add error message for wrong password" — verified this was already implemented (both `login.html` and the shared `login-modal.js` catch `Invalid login credentials` and show a red error box with a prompt to use "Lupa password?"). No change needed.

---

## SHIPPED (Checkpoint 38, July 23, 2026): "Welcome Back" Home for Logged-In All Access Holders

**Status: live.** Julia uploaded a reference file (`belajarclaude_enrolled_landing_simple.html`) showing a "welcome back" style landing — greeting hero, a dark "continue where you left off" card, and a course grid tagged by status (belum dimulai / sedang dipelajari / selesai / segera hadir). Asked to adopt the layout/design on `index.html` for paid students, keeping our fonts (Geist + Instrument Serif). Clarified via question that this should apply to `index.html`'s logged-in state specifically (not `dashboard.html`, which stays as-is). Previewed as an HTML mockup in-chat before building, approved, then implemented for real with live data instead of the mockup's placeholder content.

**What changed:**
- Wrapped the existing marketing hero + value-strip + course-library grid in a new `#marketingHome` div (unchanged for logged-out visitors and logged-in users without all-access).
- Added a new `#loggedInHome` div (hidden by default) directly after it: a greeting hero ("Selamat datang kembali, *[first name]* 👋"), a "Lanjut dari Terakhir Kamu Belajar" dark card showing whichever course has the most recent `module_completions` row (empty/hidden if the user has no progress yet), and a "Pilih apa yang ingin kamu pelajari" grid covering all 9 courses (4 live + 5 coming-soon) with real per-course status.
- The personalization script (same block that already fetches enrollments for the bottom CTA) now branches on `hasAllAccess`: toggles `#marketingHome` off / `#loggedInHome` on, fetches `module_completions` for the session email, and renders the course grid. Each card's tag/CTA is computed per course: `SEGERA HADIR` (disabled) for coming-soon courses, `SELESAI` + "Ulangi →" when `doneCount >= modules`, `SEDANG KAMU PELAJARI` + "Lanjutkan →" when partially done, `BELUM DIMULAI` + "Mulai →" otherwise.
- New global `lihEnrollAndGo(slug, link, alreadyEnrolled)` function — clicking "Mulai →" on a course with no enrollment row yet inserts one first (same explicit-enroll pattern shipped in Checkpoint 37 for `dashboard.html`), then navigates to the course reader. Already-enrolled courses skip straight to the link.
- **Footer is untouched** — both `#marketingHome` and `#loggedInHome` sit above the existing `cta-section`/reassurance/footer markup, which render exactly as before regardless of login state (Julia explicitly asked to keep the existing footer as part of this request).
- New `LIH_COURSES` map (lightweight, index.html-local — title/icon/desc/modules/contentLink/comingSoon) mirrors `dashboard.html`'s `ALL_COURSES` but only carries what this view needs; not the source of truth, `dashboard.html` remains that.

**Not done / known gap:** The old small-scale hero-card personalization from earlier the same day (green "ALL ACCESS AKTIF" tag swap, hiding just the pricing block) was superseded by this — that logic was removed since the entire `#marketingHome` (including the hero card) is now hidden for all-access holders in favor of `#loggedInHome`. The "continue learning" card shows only course title + done/total count, not a specific module title or number (no per-index module-title map exists on `index.html`, unlike `admin.html`'s `MODULE_TITLES`) — acceptable simplification, can be revisited if Julia wants module-level detail there.

**Also fixed same day:** wrong-password error wasn't showing in the login modal (used site-wide via `login-modal.js`, e.g. the popup opened from `index.html`'s nav). Root cause: `openLoginModal()` set an inline `el.style.display = 'none'` on the `.m-msg` message box every time the modal opened; `mShowMsg()` only changed the CSS class (`m-msg error`, which has `display: block` in the injected stylesheet) but never cleared that inline style, so the browser's inline style silently won and the error box stayed invisible forever. Fixed by having `mShowMsg()` reset `el.style.display = ''` and having the modal-open reset use `''` instead of `'none'`. (`login.html`'s standalone full-page login was never affected — it doesn't set any inline `display` on its message box.)

---

## SHIPPED (Checkpoint 39, July 23, 2026): Course Preview Pages Restored

**Status: live.** Julia asked to bring back "preview content of the courses" — specifically, clicking "Lihat" on a course card (e.g. Content & Marketing) used to show a real marketing page with the course's curriculum before the single-course-purchase retirement in Checkpoint 34 turned `produktivitas.html`, `content-marketing.html`, `mulai-claude.html`, and `prompt-gratis.html` into `all-access.html` redirect stubs — that curriculum content was lost when the redirect happened. Clarified via question that this should be a **full restoration** (hero + module curriculum + skills grid + case studies), not just a lightweight module list or a modal.

**What was restored:** Used `git show <commit>:<file>` to pull each page's last real content before it became a redirect stub (`produktivitas.html` @ `e35e63d`, `content-marketing.html`/`prompt-gratis.html` @ `a909545`, `mulai-claude.html` @ `0f27436`). Rebuilt all 4 as real pages again, keeping the original hero copy, `Kurikulum` module list, `Yang Akan Kamu Kuasai` skills grid, and `Contoh Nyata Indonesia` case-study sections verbatim (same CSS classes: `.modules-list`/`.module-item`, `.skills-grid`/`.skill-card`, `.cases-grid`/`.case-card`, `.output-box`) — this is the actual "preview" content Julia meant.

**What was deliberately changed vs. the old pages** (since single-course purchase is permanently retired, not un-retired):
- Removed the old per-course buy flow entirely: the `.cta-box`/hero CTA, bottom CTA, `buyCourse()`/`submitPayment()` functions, the payment modal HTML, and the Duitku `<script>` tag.
- Replaced with a single dynamic CTA (`#ctaBtn` in the hero, `#bottomCtaBtn` at the page bottom): defaults to "Dapatkan All Access →" linking to `all-access.html`; if the logged-in session already has access to that course (a real per-course enrollment row **or** the `all-access` sentinel), both buttons swap to "Buka Kursus →" linking straight to the `*-content.html` reader.
- `prompt-gratis.html` specifically: the old page had a different layout (a lead-magnet-style "20 prompt cards" grid + email-signup box, from when it was a free lead magnet). Rebuilt it using the same `Kurikulum`-module-list template as the other 3 pages instead, mapped to the 5 real category modules `prompt-gratis-content.html` actually has today (Produktivitas Kerja, Bisnis & Marketing, Karir & CV, Komunikasi Profesional, Belajar & Riset) — this keeps all 4 preview pages structurally consistent and accurate to what's actually in the course reader now, rather than resurrecting stale "signup for a free PDF" copy that no longer reflects the all-access-only model. Kept a smaller 3-card "Preview Isi" teaser section with locked prompt snippets as a nod to the original design.
- All 4 pages keep the plain one-line footer (`© 2025 Belajar Claude — ...`), matching `all-access.html`'s convention — **not** the richer social-links footer that only lives on `index.html`.

**Wiring updated to point at these pages instead of straight to `all-access.html`:**
- `index.html`'s course-library grid: each course's "Lihat →" link now points to its own page (`prompt-gratis.html`, `mulai-claude.html`, `produktivitas.html`, `content-marketing.html`) instead of `all-access.html`.
- `dashboard.html`'s `ALL_COURSES`: `salesLink` for these same 4 courses updated to match (used by "Jelajahi Kursus" for users without all-access — clicking "Lihat Kursus →" now shows the curriculum preview before they decide to buy, instead of dropping them straight on the checkout page). Coming-soon courses' `salesLink` (`coming-soon.html`) untouched.

**Not done:** No changes to `all-access.html`'s own course grid (still just icon/title/desc, no per-card "Lihat" links) or to the `*-content.html` reader pages — this checkpoint only touched the 4 marketing/preview pages plus the two places that link to them.

---

## SHIPPED (Checkpoint 40, July 23, 2026): Welcome Back Home — 3 Layout/Visibility Bugs Fixed

**Status: live.** Julia flagged 3 issues from screenshots of the Checkpoint 38 "Welcome Back" home in production:

1. **Margin/layout misalignment.** The course-grid section's wrapper had `<div class="container" style="padding:40px 0 64px;">` — the inline `padding` **shorthand** overrides all four sides of the `.container` class's own `padding: 0 40px`, wiping out the horizontal padding and knocking that section out of alignment with the hero above it (which only set `padding-top` inline, so it never touched the class's left/right values). Fixed by switching to the non-shorthand `padding-top:40px;padding-bottom:64px;`, which extends the class instead of replacing it.
2. **Coming-soon courses reappearing.** The `#loggedInHome` course grid was looping over all 9 entries in `LIH_COURSE_ORDER`, including the 5 not-yet-built `comingSoon` courses (rendered with a "SEGERA HADIR" tag) — this broke the site-wide convention (established Checkpoint 36 for `all-access.html`) that unreleased courses stay out of course-library-style grids. Fixed by filtering them out before the loop: `LIH_COURSE_ORDER.filter(function(slug){ return !LIH_COURSES[slug].comingSoon; }).forEach(...)`, and removed the now-dead `comingSoon` branch from the tag/CTA if-else chain.
3. **"Sekali bayar" reassurance section showing for All Access holders.** The 2-column reassurance strip ("Sekali bayar, bukan langganan." / "Belajar sesuai kebutuhanmu.") sits as a `<section>` sibling *outside* both `#marketingHome` and `#loggedInHome`, right before `<footer>` — so it rendered unconditionally regardless of login state, even though "you still need to pay once" messaging doesn't apply to someone who already has all-access. Fixed by giving that section `id="reassuranceSection"` and adding `document.getElementById('reassuranceSection').style.display = 'none';` inside the same `if (hasAllAccess) {...}` block that swaps in `#loggedInHome`.

All three fixes are in `index.html` only. Verified with the standard syntax check (`new Function()` over every inline `<script>` block — passed) and a div open/close tag-count balance check (88/88).

**Commits this checkpoint**: one commit covering `index.html`.

---

## SHIPPED (Checkpoint 41, July 23, 2026): Real Enrollment Now Required for Course Content Access

**Status: live.** Julia tested the explicit-enroll flow herself (after deleting her own `content-marketing` enrollment row in an earlier checkpoint) and found clicking into the course still dropped her straight into the lesson reader with old progress intact — not the preview page she expected. This surfaced a real gap: Checkpoint 37's "explicit enroll" change only affected whether a course auto-populated dashboard's "Kursus Kamu" list — the actual content-page access gates still treated holding the `all-access` sentinel row as sufficient for direct access on its own, and two click paths (index.html's Welcome Back grid, dashboard's "Jelajahi Kursus" all-access button) either silently auto-enrolled-and-redirected or auto-enrolled-and-reloaded without ever showing a preview/CTA step.

**Root cause, precisely:** `content-marketing-content.html`'s access check queried `enrollments` for `course_slug in ('content-marketing', 'all-access')` — so a bare sentinel row (no real per-course row) still passed. The same pattern existed in `produktivitas-content.html`. `mulai-claude-content.html` and `prompt-gratis-content.html` only ever checked for `'all-access'`, never the specific course, a leftover from when those were free/legacy-gated pages. Separately, index.html's `#loggedInHome` course grid called `lihEnrollAndGo()` which — for courses with any historical `module_completions` progress (`doneCount > 0`) — hardcoded `alreadyEnrolled = true` regardless of whether a real enrollment row actually existed, so old progress alone was enough to skip straight to the lesson reader.

**Fix — content now requires a real, course-specific enrollment row everywhere:**
- All 4 content-page gates (`content-marketing-content.html`, `produktivitas-content.html`, `mulai-claude-content.html`, `prompt-gratis-content.html`) now check `.eq('course_slug', <this course only>)` — holding `all-access` alone no longer grants direct entry. Redirect-when-missing target updated to each course's own preview page (previously `mulai-claude-content.html`/`prompt-gratis-content.html` redirected to `all-access.html`).
- All 4 preview pages (`produktivitas.html`, `content-marketing.html`, `mulai-claude.html`, `prompt-gratis.html`) now compute a 3-state CTA instead of a binary hasAccess check: no access at all → "Dapatkan All Access →" (unchanged); holds all-access but no real per-course row → new "Mulai Kursus →" state, a button (not a link) that inserts a real `enrollments` row for that course (`type:'paid'`) then redirects to the content reader — this is a free, instant, one-click enroll since all-access already covers the cost; has a real per-course row already → "Buka Kursus →" straight to the reader (unchanged).
- `index.html`'s `#loggedInHome` course grid: removed `lihEnrollAndGo()` entirely. The grid now branches on `isEnrolled` (real row) first — if not enrolled, the card always links to the course's own preview page (new `previewLink` field added to each `LIH_COURSES` entry) regardless of past progress, never straight to the lesson reader and never with a silent background enroll. Only truly-enrolled courses link straight to the content reader, with the existing SELESAI/SEDANG KAMU PELAJARI/BELUM DIMULAI badge logic preserved for informational display.
- The "continue learning" dark card at the top of `#loggedInHome` (built from the most recent `module_completions` row) is now only shown if the user has a real enrollment row for that course — old progress with no current enrollment no longer surfaces a direct-to-lesson card.
- `dashboard.html`'s "Jelajahi Kursus" one-click `enrollCourse()` button (Checkpoint 37) was deliberately left as-is: it enrolls and reloads the dashboard (course moves into "Kursus Kamu"), it does not jump straight into the lesson reader, so it doesn't reproduce the bug Julia hit.

**Known caveat, flagged to Julia rather than silently changed:** `ADMIN_EMAILS` (`julia.utomo@gmail.com`, `tiffany.utomo@gmail.com`) still bypasses every content-page gate unconditionally, same as before this checkpoint. This means Julia herself can never observe the real customer gate while logged in as herself — navigating directly to a `*-content.html` URL always works for her regardless of enrollment state. The preview-page CTA (Mulai Kursus / Buka Kursus / Dapatkan All Access) still reflects her true enrollment state correctly and is the reliable way for her to verify this flow; only a direct/typed URL to the content page bypasses it, by admin design.

Verified with the standard syntax check (`new Function()` over every inline `<script>` block across all 9 touched files — passed).

**Commits this checkpoint**: one commit covering `index.html`, `content-marketing.html`, `produktivitas.html`, `mulai-claude.html`, `prompt-gratis.html`, `content-marketing-content.html`, `produktivitas-content.html`, `mulai-claude-content.html`, `prompt-gratis-content.html`.

---

## SHIPPED (Checkpoint 42, July 24, 2026): Content & Marketing (K3) — Full Restructure to 7 Modules, Design-System Refresh, New Image-Gen + Multi-Platform-Ads Content

**Status: live.** Multi-session piece of work, planned across several turns before any implementation: reviewed the existing 9-module K3 course, discussed combining modules, researched image-generation options (Nano Banana Pro vs ChatGPT — concluded ChatGPT Free is sufficient, no Plus needed), designed a "Prompt Enhancer" teaching pattern, scoped what Claude can/can't do for Meta/TikTok/Google Ads, produced a full target-structure table, then implemented module-by-module.

**1. Course restructured from 9 modules to 7** (`content-marketing-content.html`):
- Old M5 (WhatsApp Business CS) + old M6 (Email & Promosi) **merged** into one new Modul 5, "Template Komunikasi Pelanggan (WhatsApp + Email)" — shared info-grid/mistake-list, two side-by-side "Contoh Prompt" blocks (one per channel), two "Cara Kerja" step-rows, one combined Latihan + output-box referencing both `cm-template-wa.txt` and `cm-template-email.txt`.
- Old M8 (Content OS / Notion) + old M9 (Case Study capstone) **merged** into one new Modul 7, "Content OS + Peluncuran Produk (Capstone)" — "Bagian 1 — Bangun Content OS" (system-building, framed as "· Persiapan Sistem" rather than a numbered day) followed by "Bagian 2 — Peluncuran Garang Asem Frozen: 1 Minggu Kerja Nyata" (the original 5-day launch scenario, day-block labels/rekap table renumbered to match the new module numbers).
- Old M7 (Performance Marketing) renumbered down to Modul 6 with no content change beyond ID/breadcrumb/nav-counter updates and a continuity note pointing back at the (now-merged) Modul 4 ad campaigns.
- Full sidebar (7 `nav-mod` items + feedback), panel IDs (`panel1`-`panel8`, 8th = feedback), video/ppt/doc-slot IDs (1-7), `check1`-`check8`, and JS `TOTAL` constant (10 → 8) all renumbered sequentially — verified via grep with zero gaps/duplicates, plus a script-syntax check (`new Function()` over every inline `<script>` block, 2/2 passed) and a div/section open-close tag-balance check (451/451, 0/0).
- **Safety-checked before renumbering**: queried Supabase `module_completions` directly — only `julia.utomo@gmail.com` had rows for `content-marketing` (module_num 1 and 2), both unaffected by the merge, so zero data-migration risk.

**2. Whole-course design-system refresh** — `content-marketing-content.html`'s CSS was fully replaced with the newer, more polished system already live on `produktivitas-content.html` (`:root` variables, `.hero`, `.module-desc-box`, `.prompt-section`/`.prompt-box`/`.copy-btn`, `.case-box` + new `.persona` modifier, `.output-box`, `.tip-box` + `.warn`/`.bonus`/`.connector` variants, `.mistake-list`, `.step-row`/`.step-card`, `.two-col`/`.col-card`, `.info-grid`/`.info-card`, `.section-heading`, `.nav-bottom`/`.nav-btn`/`.nav-counter`) — while keeping/restyling K3-specific extras (`.metric-table` for ROAS tables, `.day-block`/`.day-label` for the capstone's day-by-day scenario, `.mod-feedback`). Font import switched from Instrument Serif + Geist to Inter (400–800 weights), matching produktivitas' body font.

**3. New content added, not just reorganized:**
- **Modul 3 (Konten Instagram)**: new "Level Up: Foto Produk dengan AI Image Generator" section teaching a **Prompt Enhancer** pattern — Claude can't generate/edit images directly, but turns a rough student description into a detailed, ready-to-paste prompt for **Nano Banana Pro** (Gemini, free 3 images/day) or **ChatGPT** (free plan sufficient, confirmed with Julia no Plus needed) — with a worked example prompt.
- **Modul 4 (renamed "Copy Iklan Multi-Platform + Canva Connector")**: new "Copy Beda Platform, Bukan Copy-Paste yang Sama" section — a 3-column breakdown (Meta/Instagram, TikTok, Google Search Ads) explaining why each platform needs differently-written copy, plus a "📋 Bonus: Targeting Brief" tip-box where Claude drafts a plain-language targeting brief (age/interest/location/lookalike ideas) for the student to manually enter into each platform's own Ads Manager — with an explicit "Claude tidak punya koneksi ke Meta/TikTok/Google Ads" caveat built into the copy itself, not just discussed with Julia.
- **Modul 6 (Performance Marketing)**: continuity note added explicitly linking the ad campaigns being analyzed back to the ones written/launched in Modul 4.

**4. PDF markdown draft content written for all 7 modules** (`Content-Marketing/Course-Level/content-marketing-improved-content.md`) — Module 1 was drafted first (own pass), Modules 2-7 added this checkpoint, transcribed to match each module's final HTML wording exactly (per the standing "HTML and PDF must be consistent, more depth than PPT" rule) rather than paraphrased. Actual rendered PDF and additional PPTX decks for Modules 2-7 explicitly deferred to a later pass per Julia ("ppt and pdf generator comes later") — only Module 1 has a built PPTX so far (`K3-M01-Positioning-Kompetitor.pptx`, 4 slides, terracotta/amber palette, passed the standard `validate.py` + `markitdown` + LibreOffice visual-QA pipeline).

**5. `Content-Marketing/` folder reorganized into per-module subfolders**, mirroring `K2-Produktivitas/`'s structure — first pass mistakenly mirrored the *old* 9-module layout, caught by Julia ("wait we only have 7 modules right?") and corrected to match the *target* 7-module structure:
```
Content-Marketing/
  Course-Level/                    — Content-Marketing-Panduan-Belajar.pdf, content-marketing-improved-content.md
  M01-Positioning-Kompetitor/       — cm-template-kompetitor.txt, K3-M01-Positioning-Kompetitor.pptx
  M02-Deskripsi-Produk/             — cm-data-produk.csv
  M03-Konten-Instagram/             — cm-kalender-konten.csv
  M04-Iklan-Canva/                  — (no file — Canva Connector only)
  M05-Komunikasi-Pelanggan/         — cm-template-wa.txt, cm-template-email.txt (merged M5+M6)
  M06-Performance-Marketing/        — cm-performance-ads.xlsx
  M07-Content-OS-Capstone/          — cm-m9-starter-peluncuran.txt (merged M8+M9)
```
Confirmed via grep that supporting-file names only ever appear as plain text in lesson copy (never a hardcoded `<a href>` download link), so the folder move couldn't break any live download functionality.

**6. Four other files fixed for consistency with the new 7-module count** (not explicitly requested, flagged as necessary side effects and fixed proactively): `index.html`'s `LIH_COURSES['content-marketing'].modules` and `dashboard.html`'s `ALL_COURSES['content-marketing'].modules` both changed 9→7 (both feed progress-percentage math); `admin.html`'s `COURSES` array `modules: 9→7` plus its per-module title array trimmed/renamed from 9 titles to 7; `content-marketing.html` (the preview/sales page) — "9 Modul" → "7 Modul" in the hero tag and section title, a dangling "Modul 9" hero-sub reference removed, and its 9 `.module-item` curriculum blocks merged/renumbered down to 7 to match. Left `content-marketing.html`'s unrelated "9 Skill Pemasaran dengan Claude" skills-grid (9 skill chips) untouched — skill count is independent of module count.

**Verified live** after push: fetched `content-marketing-content.html` with a cache-busting query param — confirmed 7 module panels + feedback (`8/8` counter), correct titles in the sidebar, and the merged Modul 5 (WA+Email) and Modul 7 (Content OS+Capstone) sections both render with all their sub-sections intact.

**Commits this checkpoint**: `0ddc92e` (folder reorg corrected to 7-module target structure), `8ce9d0b` (HTML restructure to 7 modules + PDF markdown content for Modules 2-7 + cross-file module-count fixes in `index.html`/`dashboard.html`/`admin.html`/`content-marketing.html`).

**Not yet done, explicitly deferred by Julia**: PPTX decks for Modules 2-7, and generating the actual rendered PDF file from the now-complete markdown draft ("ppt and pdf generator comes later").

---

## SHIPPED (Checkpoints 43–44, July 24, 2026): Vercel → Cloudflare Migration (Frontend Only)

**Status: complete. Vercel project deleted.** Julia migrated hosting off Vercel onto Cloudflare. Scoped to frontend only — the Node/Express backend stays on Railway untouched. `https://belajar-claude.belajarclaude-id.workers.dev` is now the sole production frontend URL.

**What shipped:**
- Connected Julia's separate Cloudflare account (`belajarclaude.id@gmail.com`, distinct from the `julia.utomo@gmail.com` account that owns GitHub/Vercel/this Claude session — confirmed no conflict, since Cloudflare's Git-connect flow authenticates to GitHub independently of which account owns the Cloudflare side) to the `mcp__cloudflare` connector.
- Cloudflare's dashboard has unified "Pages" into "Workers with static assets" — no separate Pages product anymore, and the Git-repo-connect step is dashboard-only (no API/MCP tool exists for it), so Julia did that part herself: **Workers & Pages → Create application → Import a repository → `juliautomo/belajar-claude`**, framework preset None, build command empty, deploy command `npx wrangler deploy` (auto-filled by Cloudflare's new unified flow).
- Added `wrangler.jsonc` to the repo root (`{"name":"belajar-claude","compatibility_date":"2025-06-05","assets":{"directory":"."}}`) — required because the deploy command assumes a Wrangler project; Worker name must exactly match this dashboard project name or the build fails.
- Result: **`https://belajar-claude.belajarclaude-id.workers.dev`** — live, auto-deploys on every push to `main`, confirmed serving the full site correctly (verified via direct fetch: nav, course content, all pages render).
- **5+ hardcoded `vercel.app` URLs updated to the new `workers.dev` domain** (frontend commits `394d813`→`7ed47f7`, backend commits `ca32e79`→`045b823`): `login-modal.js` + `login.html` password-reset redirect; backend `index.js`'s 3 course access-link fields in `COURSES`, the Duitku `returnUrl` (post-payment redirect), and the `sendAccessEmail` fallback link.
- **2 even-older dead links found and fixed while auditing** — `mailer.js`'s welcome email and the Duitku `returnUrl` were pointing at `juliautomo.github.io/belajar-claude`, the pre-Vercel GitHub Pages URL, apparently broken since that migration and unrelated to today's Cloudflare work. Both now point to `workers.dev`.
- **Welcome email content rewrite** (`mailer.js`): the "Download 20 Prompt Gratis" hook and dead-link CTA replaced with an All Access pitch + working link; the stale 4-course/old-price list (referencing courses/prices that don't exist anymore, e.g. "Claude untuk Karyawan Indonesia Rp 299K") replaced with the real current catalog (20 Prompt Gratis / Dasar Claude AI / Produktivitas Kantor / Content & Marketing, each "✓ Termasuk" under All Access rather than priced individually).
- **Discovered `sendWelcomeEmail`'s only trigger (`coming-soon.html`'s "notify me" waitlist form) is orphaned** — `dashboard.html` line ~416 filters `comingSoon` courses out of "Jelajahi Kursus" entirely, so nothing in the live product links to `coming-soon.html` anymore. Meanwhile the actual signup path (login modal's "Daftar" tab, real `sbClient.auth.signUp()`) never fired the branded welcome email at all — only Supabase's bare default "Confirm sign up" template. Fixed by wiring a fire-and-forget `POST /signup` call into both `login-modal.js` and `login.html`'s register handlers, right after a successful `signUp()` — reuses the existing backend `/signup` logic (ConvertKit tag, Sheets log, `sendWelcomeEmail`) rather than a new endpoint. No name field exists on the register form, so the email's name is derived from the email's local-part (`email.split('@')[0]`), same fallback the coming-soon form already used.
- **Supabase config**: `https://belajar-claude.belajarclaude-id.workers.dev/**` added to Authentication → URL Configuration → Redirect URLs. **Site URL flipped** from `https://belajar-claude.vercel.app` to `https://belajar-claude.belajarclaude-id.workers.dev` (Julia did this in-dashboard, confirmed via screenshot) — this was the last piece keeping Vercel load-bearing, since Site URL is the fallback base for Supabase's own auth emails. Confirmed both the "Confirm sign up" and "Reset password" Supabase email templates use the dynamic `{{ .ConfirmationURL }}` variable, not a hardcoded domain, so no template edits were needed.
- **End-to-end tested twice via Claude-in-Chrome** (not just code review) — once right after the `workers.dev` cutover, then re-run in full after the Site URL flip to confirm nothing broke: (1) real signup through the actual register form — created a real Supabase user (`julia.utomo+cftest@gmail.com`, confirmed via direct SQL query against `auth.users`), no error on either pass, confirming Supabase builds the confirmation email correctly off the new Site URL; (2) real password-reset request through the actual forgot-password form — succeeded both times with no "redirect not allowed" error; (3) called `/create-payment` directly for `all-access` — returned `200 OK` with a real Duitku order ID + reference, confirming catalog lookup, admin-configurable pricing, and Duitku invoice creation (with the updated `returnUrl`) all work; deliberately did not complete the actual payment.
- **Vercel project deleted** (Julia, July 24, 2026) — repo-wide grep confirmed zero remaining `vercel.app` references anywhere in frontend or backend code before deletion.

**Follow-up found, not a migration blocker, flagged for later**: all of the test emails (SendGrid welcome email + Supabase's own confirm-signup and reset-password emails) landed in Gmail's **Spam** folder, not the inbox — confirmed via screenshot. Likely cause: SendGrid's sender (`belajarclaude.id@gmail.com`) isn't domain-authenticated (SPF/DKIM), and Supabase Auth is presumably still on its default/shared sending domain rather than custom SMTP — both classic spam triggers when sending "from" a Gmail-style address via a third-party API. Sensible to bundle with whatever domain gets registered next, since proper SPF/DKIM setup wants a real custom domain to attach to. Not yet scheduled — Julia said "put in plan," not "do now."

**Explicitly deferred by Julia ("I will update later")**: registering `belajarclaude.id`. Confirmed via DNS lookup the domain currently doesn't resolve at all (NXDOMAIN — not registered, or registered with zero DNS configured). Confirmed via Cloudflare's docs search that Cloudflare Registrar doesn't list `.id` among supported TLDs — Indonesian ccTLDs need a PANDI-accredited local registrar (KTP/NPWP verification), so this isn't a Cloudflare-side task regardless. `workers.dev` is the production URL indefinitely until this is decided.

**What's left, whenever Julia is ready (no blocker, all optional/future):**
1. Register `belajarclaude.id` via a PANDI-accredited registrar (Julia's call, deferred) — or decide to just keep `workers.dev` permanently.
2. If a domain is registered: point it at Cloudflare (nameservers or DNS + add as custom domain on the Worker), then repeat the URL-swap pass (5+ spots, same list as this checkpoint) from `workers.dev` to the final domain.
3. Flip Supabase's Site URL to the final domain at that point.
4. SendGrid domain authentication + Supabase custom SMTP to fix the spam-folder deliverability issue — sensible to bundle with step 2 since it also wants a real domain attached.

---

## SHIPPED (Checkpoint 45, July 24, 2026): K1 (Mulai dengan Claude AI) — Folder Reorg, Framework-Consistency Fixes, Module 5 (Claude Projects) Removed Course-Wide

**Status: live — pushed to GitHub July 24, 2026** (commit `c7dae34`).

**1. `K1-Mulai-Claude/` reorganized into per-module subfolders**, mirroring the `K2-Produktivitas/`/`Content-Marketing/` pattern (the 5 loose `K1_ModulN_*.pptx` files at the folder root, plus the pre-existing `M02-Anatomi-Prompt/` subfolder, were the trigger — Julia had just added the missing module PPTs and asked for them organized to match). Created `M01-Apa-itu-Claude-dan-Setup-Akun/`, `M03-Role-Prompting/`, `M04-Claude-Artifacts/`, `M05-Praktek-End-to-End/` (originally `M06-...`, see below), each holding its renamed `K1-M0X-...pptx`. Verified each pptx's title slide text actually matches its corresponding module in `mulai-claude-content.html` before filing it (all 6 matched at the time).

**2. HTML↔PPT↔PDF consistency audit, two real issues found:**
- **Module 1 PPT** is missing the "Cowork & Claude Code" slide/section that HTML has (both mention Cowork/Claude Code as bonus areas beyond the core 4 Claude.ai features) — flagged to Julia, not fixed this checkpoint (everything else in Modul 1–6 checked out consistent across HTML/PPT).
- **The whole-course PDF** (`belajarclaude - Mulai dengan Claude AI (Modul 1-6).pdf`, 16 pages, no source file existed anywhere in the repo/sandbox) still taught the *old, retired* prompt framework in its Module 2 section — **K-I-F (Konteks → Instruksi → Format)** with a "Konteks, Peran, Tugas, Format" (K-P-T-F) element list — while the HTML lesson, Module 2's standalone PPT, and Module 2's standalone PDF panduan (`M02-Anatomi-Prompt/K1-M02-Anatomi-Prompt-Panduan.pdf`) had all already been fixed to the canonical **R-K-T-F (Role → Konteks → Tugas → Format)** framework back in Checkpoint 12. This 16-page course guide was evidently never regenerated after that fix. Found via a full page-by-page `pdftotext` extraction and side-by-side comparison against the live HTML.

**3. Whole-course PDF rebuilt from scratch with WeasyPrint** (HTML/CSS → PDF), reverse-engineering the house style from screenshots of the existing Module 2 standalone PDF and the (stale) whole-course PDF itself — navy cover/header (`#0D1321`/`#6849F6` purple accent), purple-pill module badges, left-purple-border section headings, color-coded callout boxes (green Exercise, purple Output, yellow Tips/Kesalahan Umum, dark "digabung jadi satu prompt" boxes), matching the palette already documented in `belajarclaude-pptx-style-spec.md`. Fixed the K-I-F→R-K-T-F issue in 4 spots (TOC "Fokus" column, Module 2's element list/framework-callout/summary/exercise/output-box, closing recap card). All pages rendered to image and visually inspected for overflow/clipping — clean.

**4. Julia then asked to remove the stale "GRATIS" cover badge, then separately asked to remove Module 5 (Claude Projects) from the course entirely** — clarified via question that this meant a full course-wide removal (not just the PDF), with Module 6 (Praktek: Workflow End-to-End) renumbered to Module 5 and rewritten to no longer depend on Projects (its original design combined "Projects (saved context) + Artifacts (structured output)"; the capstone now teaches combining **R-K-T-F + Role Prompting + Artifacts** into one prompt instead — same meeting-notes-to-report case study, same exercise, just no `Project` step). Applied everywhere:
- **`mulai-claude-content.html`** (live lesson reader): `panel5` (Claude Projects) deleted outright; old `panel6` renumbered to `panel5` with the rewritten capstone content; sidebar `nav-mod5`/`nav-mod6` renumbered, `Claude Projects` tool-chip removed from the tools list; feedback panel renumbered `panel7`→`panel6`; JS `TOTAL` (7→6) and every `nav-counter` (`n/6`, `n/7`→`n/5`, `6/6`) updated. Verified: 6 `module-panel`s remain, div tag count balanced (264/264), both inline `<script>` blocks parse via `new Function()`.
- **PPTX**: `M05-Claude-Projects/` folder deleted; `M06-Praktek-End-to-End/` renamed to `M05-Praktek-End-to-End/`, its pptx renamed and edited in place (python-pptx run-level text replacement, not rebuilt from scratch) to match the rewritten capstone — badge/breadcrumbs renumbered "MODUL 6"→"MODUL 5", "MENYATUKAN ARTIFACTS + PROJECTS"→"MENYATUKAN SEMUA YANG SUDAH DIPELAJARI", the "(Di dalam Project...)" prompt example rewritten to open with a Role-Prompting line instead, "Buka Project pekerjaan yang relevan" step → "Buka chat baru di Claude.ai". Passed the standard `validate.py` + `markitdown` placeholder-sweep + LibreOffice-render visual-QA pipeline (all 4 slides clean).
- **`mulai-claude.html`** (public sales/preview page): Kurikulum module list — Claude Projects module-item removed, Praktek item renumbered 06→05, description reworded; "6 Modul"→"5 Modul" (hero level-tag + curriculum `<h2>`); "6 Skill Claude Inti"→"5 Skill Claude Inti" with the `Claude Projects` skill-chip removed; hero subtext and tool-list (`🛠 Claude.ai · Projects · Artifacts · Google Docs`→`🛠 Claude.ai · Artifacts · Google Docs`) updated; the two case-study copy lines referencing "Claude Projects" (Freelancer card + closing output-box) reworded to not reference the removed module.
- **`admin.html`**: `COURSES` entry for `mulai-claude` — `modules: 6` → `5`; `MODULE_TITLES.mulai-claude` array — "Claude Projects — Memori Pekerjaan Kamu" entry removed (now 5 items, matching the count).
- **Full course PDF**: rebuilt again (same WeasyPrint source) — GRATIS badge removed from the cover entirely (Julia's final call, after a brief detour where it was first swapped to an "ALL ACCESS" pill to match site convention, then explicitly told to just remove it), Module 5 pages cut, old Module 6 pages renumbered to Module 5 with the same rewritten capstone content as HTML/PPT, cover module-grid/TOC table/closing recap grid all updated to 5 modules, all page footers renumbered (16 pages → 14 pages). File itself renamed from `...(Modul 1-6).pdf` to `...(Modul 1-5).pdf` to match (used `mcp__cowork__allow_cowork_file_delete` — the workspace folder blocks direct delete/rename without that explicit grant). Repo-wide `pdftotext` sweep confirmed zero remaining "Claude Projects"/"Modul 6"/"/ 16" references in the final PDF.
- **Repo-wide grep sweep** caught 3 more stale spots outside the above files: `index.html`'s `LIH_COURSES.mulai-claude.modules` (6→5), `dashboard.html`'s `ALL_COURSES.mulai-claude.modules` (6→5), and a "6 modul" mention in `prompt-gratis-content.html`'s cross-sell card to Mulai dengan Claude AI (→5 modul). Confirmed via grep that all *other* remaining "Claude Projects"/"modules: 6" hits in the repo belong to unrelated courses (`produktivitas` genuinely teaches Claude Projects as its own Module 2; `analisis-data` is an unrelated coming-soon course that happens to also have 6 modules) — left untouched.

**5. Missing Module 5 supporting file added (July 24, 2026 follow-up).** The HTML lesson's Module 5 exercise (`panel5`) references a fallback practice file for students without their own real meeting notes — `contoh-catatan-meeting-berantakan.txt` — but the file didn't actually exist anywhere in the repo. Created it at `K1-Mulai-Claude/M05-Praktek-End-to-End/contoh-catatan-meeting-berantakan.txt`: a deliberately messy, unstructured Indonesian marketing-team meeting-notes text (stream-of-consciousness style, no headers/bullets) covering Instagram engagement, ad budget, testimonial content, content calendar gaps, a customer complaint, a giveaway, and a weekly report ask — written so it maps cleanly onto the module's R-K-T-F exercise (raw input → structured summary + action-items table via one prompt). Pushed alongside the rest of this checkpoint's K1 work.

**Not done / explicitly out of scope this checkpoint**: Module 1 PPT's missing Cowork/Claude Code slide (flagged above, Julia hasn't said whether to fix it yet).

---

## SHIPPED (Checkpoint 46, July 24, 2026): Progress-Percentage Overcounting Fixed Course-Wide

**Status: live** (commit `487a44e`). Julia spotted her own "Terakhir Dibuka" card on `index.html` showing **"120%" / "6/5 modul"** for `mulai-claude`. Root cause: `module_completions` rows are keyed by `module_num` and never cleaned up when a course is restructured to fewer modules — Julia (an admin, so bypasses the enrollment gate) had completed all 6 modules of the *old* `mulai-claude` course before Checkpoint 45 dropped it to 5, leaving a stale `module_num: 6` row that `index.html` counted toward her progress against the new 5-module total (6/5 = 120%). Same latent bug exists for `content-marketing`, restructured 9→7 modules in Checkpoint 42.

**Fix applied in two layers, across every course-reader page:**
- **`index.html`**: both the "last opened" banner and the course-grid cards now clamp `doneCount` to `Math.min(rawCount, meta.modules)` before computing the percentage, so it can never read above 100%/`modules`-of-`modules`.
- **`mulai-claude-content.html`, `content-marketing-content.html`, `produktivitas-content.html`, `prompt-gratis-content.html`**: when restoring progress from Supabase on load, any `module_num` greater than that course's current total (`TOTAL` / `CONTENT_MODULES`) is now skipped entirely (not added to the `done` set, no stale checkmark rendered) — this also prevents a latent `getElementById(...).textContent` crash in `prompt-gratis-content.html`, which had no null-check and would have thrown on a stale out-of-range module number. `updateProgress()` in all four also now clamps `pct` to `Math.min(100, ...)` as a defensive floor, so any future course restructure can't reintroduce this class of bug even if the load-time filter is ever bypassed.
- `dashboard.html` was already safe — `getProgress()` clamps `pct` and the card label separately clamps `done` with `Math.min(done, total)`. No changes needed there.

**Follow-up cleanup (same day)**: queried `module_completions` for any row exceeding its course's current module count — only 2 existed in the whole table, both `mulai-claude` / `module_num: 6` (Julia's and Tiffany's admin accounts, the only ones old enough to have finished the pre-Checkpoint-45 6-module version). No real customer data was affected. Both rows deleted directly in Supabase.

**Second follow-up (same day)**: a full table scan turned up 6 more `module_completions` rows under the legacy slug `bisnis-ukm` (the pre-Checkpoint-11 name for `content-marketing`) — all Julia's own admin test-completion data from July 16, orphaned since `bisnis-ukm` isn't referenced anywhere in the live codebase. Confirmed no other tables (`enrollments`, `course_feedback`, `waitlist`) had matching `bisnis-ukm` rows, then deleted all 6. `module_completions` is now fully clean — every row belongs to a real, currently-existing course_slug and sits within that course's module count.

---

## Design System (as of June 2026)
All pages use these CSS variables:
```css
--bg: #FAFAFA;
--surface: #FFFFFF;
--surface-2: #F5F5F7;
--border: #E8E8E8;
--border-strong: #D0D0D0;
--ink: #111111;        /* primary text */
--ink-2: #777777;
--ink-3: #BBBBBB;
--accent: #6C47FF;     /* purple */
--accent-2: #9B7DFF;
--accent-dim: rgba(108,71,255,0.08);
--accent-glow: rgba(108,71,255,0.18);
--green: #16A34A;
--green-dim: rgba(22,163,74,0.08);
--green-border: rgba(22,163,74,0.2);
--r: 14px;
```
- **Fonts**: `Geist` (body/UI, `--font`) + `Instrument Serif` (headings, `--serif`). Loaded from Google Fonts with weights 300–700.
- **Nav**: `rgba(250,250,250,0.88)` frosted glass, `height: 58px`, `padding: 0 40px`, `backdrop-filter: blur(16px)`, `border-bottom: 1px solid var(--border)`. Fixed position on all pages.
- **Nav logout dropdown** (added July 11, 2026): All 9 marketing/sales pages (`index.html`, `bisnis-ukm.html`, `kerja-sehari-hari.html`, `kursus-karyawan.html`, `kursus-mahasiswa.html`, `kursus-ukm.html`, `mulai-claude.html`, `paket-content-creator.html`, `prompt-gratis.html`) have a `.nav-user-pill` that shows logged-in user name/email. Now clickable — opens a dropdown with "Dashboard" link and "Keluar" button. Keluar calls `sbClient.auth.signOut()` then redirects to `index.html`. JS functions: `toggleUserMenu(e)`, `doSignOut(e)`. Dropdown closes on outside click.
- **Logo**: `<a class="logo">belajar<span>claude</span></a>` — `font-family: var(--font)` (Geist), `font-size: 17px`, `font-weight: 700`, `letter-spacing: -0.4px`. Span `claude` uses `color: var(--accent)` (purple).
- **Cards**: White surface, `1px solid var(--border)`, `border-radius: 14-16px`, subtle shadow
- **Body**: `-webkit-font-smoothing: antialiased`

---

## Supabase Project
- **Project**: "Belajar-Claude" — `ctqtdqbsucbhikwnagvl`
- **Region**: ap-southeast-2
- **Site URL**: `https://belajar-claude.vercel.app`
- **Redirect URLs**: `https://belajar-claude.vercel.app/**` (GitHub Pages URL removed July 11, 2026)
- **SMTP**: Custom SMTP configured → SendGrid (`smtp.sendgrid.net:587`, username `apikey`) so auth emails (password reset, signup confirmation) bypass Supabase's 3/hour free-tier limit
- **Auth method**: Email + password (switched from magic link, July 11, 2026). `signInWithPassword` / `signUp` / `resetPasswordForEmail` with `redirectTo: https://belajar-claude.vercel.app/reset-password.html`

### Tables
| Table | Key Columns | Notes |
|-------|-------------|-------|
| `profiles` | email (PK), full_name, role, goal, experience | Filled via profile modal on dashboard |
| `enrollments` | email, course_slug, type (free/paid), enrolled_at | No more free auto-enroll as of Checkpoint 35 — only a real `all-access` row grants course access; legacy free `prompt-gratis`/`mulai-claude` rows from before Checkpoints 34/35 still exist but aren't honored |
| `module_completions` | email, course_slug, module_num | Tracks per-module progress |
| `course_feedback` | email, course_slug, rating (1-5), comment | Unique per email+course |
| `waitlist` | email, course_slug | "Beritahu saya" signups for coming-soon courses |
| `course_resources` | course_slug (PK), pdf_url, pdf_label, updated_by | Admin-managed PDF resource per course |
| `module_videos` | course_slug, module_num (PK), video_url, updated_by | Admin-managed video per course module |
| `module_documents` | id (PK), course_slug, module_num, doc_url, doc_path, doc_label | Admin-managed practice-session document(s) per module — multiple allowed |
| `course_pricing` | course_slug (PK), base_price, discount_price, discount_start, discount_end, updated_by | Admin-editable price/scheduled discount, currently only an `all-access` row — added Checkpoint 33 |
| `social_links` | id (PK, always `'main'`), tiktok_url/youtube_url/instagram_url/whatsapp_url/contact_email, tiktok_visible/youtube_visible/instagram_visible/whatsapp_visible/contact_email_visible (bool, default true), updated_by | Single-row table for footer social links + contact email + per-field show/hide toggle, admin-editable via `admin.html`'s Social Media Links panel — added Checkpoint 36 |

---

## Pages & Their Purpose

### Marketing / Sales
| File | Purpose |
|------|---------|
| `index.html` | Landing page — hero, jalur belajar grid, course carousel, CTA |
| `mulai-claude.html` | **Redirect stub → `all-access.html`** as of Checkpoint 34 (was: sales page for the now-retired free "Mulai dengan Claude AI") |
| `produktivitas.html` | **Redirect stub → `all-access.html`** as of Checkpoint 34 (was: sales page — K2 · Produktivitas Kantor, Rp 149K individually; M8 Case Study archive history still applies to `produktivitas-content.html`, see Checkpoint 25) |
| `kerja-sehari-hari.html` | DELETED from repo (July 14, 2026) |
| `content-marketing.html` | **Redirect stub → `all-access.html`** as of Checkpoint 34 (was: sales page — Content & Marketing, Rp 149K individually; renamed from bisnis-ukm.html checkpoint 11) |
| `prompt-gratis.html` | **Redirect stub → `all-access.html`** as of Checkpoint 35 (was: sales page for the now-retired free "20 Prompt Gratis" guide) |
| `kursus-karyawan.html` | **Redirect stub → `all-access.html`** as of Checkpoint 34 (was: Jalur Profesional paket page) |
| `kursus-mahasiswa.html` | **Redirect stub → `all-access.html`** as of Checkpoint 34 (was: Jalur Mahasiswa paket page) |
| `kursus-ukm.html` | **Redirect stub → `all-access.html`** as of Checkpoint 34 (was: Jalur UKM paket page) |
| `paket.html` | **Redirect stub → `all-access.html`** as of Checkpoint 34 (was: stale unwired mockup pricing page flagged in Checkpoint 32) |
| `paket-content-creator.html` | **Redirect stub → `all-access.html`** as of Checkpoint 34 (was: Paket Content Creator page) |
| `all-access.html` | The only checkout page now — sales/checkout for the one-time all-access SKU, added Checkpoint 32; price/discount fetched live from `course_pricing` as of Checkpoint 33 (default Rp 399K) |
| `coming-soon.html` | Placeholder for unreleased courses |

### App
| File | Purpose |
|------|---------|
| `login.html` | Auth page — email + password (Masuk / Daftar tabs + Lupa password? view). Replaced magic link July 11, 2026. |
| `reset-password.html` | Password recovery page — handles both PKCE (`?code=` in URL) and implicit (`#access_token`) flows. Calls `updateUser({ password })`. Added + fixed July 11, 2026. |
| `dashboard.html` | Main user dashboard |
| `prompt-gratis-content.html` | Course reader — 5 modules + feedback panel. **Gated to `all-access` enrollment only as of Checkpoint 35** (previously open to any logged-in user via a now-removed server-side auto-enroll on signup) |
| `mulai-claude-content.html` | Course reader — 6 modules + feedback panel. **Gated to `all-access` enrollment only as of Checkpoint 34** (previously open to any logged-in user, auto-enrolled free) |
| `produktivitas-content.html` | Course reader — K2, 7 active modules + feedback panel (COURSE_SLUG='produktivitas'); M8 Case Study content preserved but archived/unreachable, see Checkpoint 25 |
| `kerja-sehari-hari-content.html` | DELETED from repo (July 14, 2026) |
| `content-marketing-content.html` | Course reader — **7 modules + feedback panel as of Checkpoint 42** (was 9; M5+M6 merged into "Template Komunikasi Pelanggan (WhatsApp + Email)", old M8+M9 merged into "Content OS + Peluncuran Produk (Capstone)") (COURSE_SLUG='content-marketing'; renamed from bisnis-ukm-content.html checkpoint 11) |
| `payment-success.html` | Post-payment confirmation |
| `admin.html` | Admin-only content manager — upload course PDFs + per-module videos to Supabase Storage, plus the "Harga All Access" pricing/discount panel (Checkpoint 33). Gated to `julia.utomo@gmail.com` / `tiffany.utomo@gmail.com` via session email check. Entry point: hidden "Admin" nav item on `index.html` and `dashboard.html` (shown only to those emails) — both already existed independently of `prompt-gratis.html`'s old nav link, confirmed working before that page was retired to a redirect stub in Checkpoint 35. |

### Assets
| File | Purpose |
|------|---------|
| `login-modal.js` | Shared login modal — email+password (Masuk/Daftar tabs + forgot password view). Intercepts all `<a href="login.html">` clicks. Public API: `window.openLoginModal(tab)` / `window.closeLoginModal()`. Rewritten July 11, 2026. |
| `payment-success-modal.js` | Post-payment modal logic |
| `supabase-config.js` | Shared Supabase client config |
| `20-prompt-claude-terbaik.pdf` | Free PDF download |
| `course-video.js` | Shared script on all 4 course content pages — fetches `module_videos`/`course_resources`/`module_documents` for `COURSE_SLUG` and injects `<video>` players into `#video-slot-N`, a bold sidebar PDF link into `#pdf-download-slot`, a prominent always-visible PDF banner into `#pdf-banner-slot` (top of main content, above module panels), and a practice-document list into `#doc-slot-N` |
| `sql/admin-content-setup.sql` | One-time Supabase SQL migration for `course_resources` + `module_videos` tables, RLS, and `course-pdfs`/`course-videos` storage bucket policies |

---

## Dashboard Features (dashboard.html)
- **Nav**: Uses `.brand` class (not `.logo`) — same Geist 700 styling. Has avatar + name on right, "Keluar" button.
- **Sidebar**: Initials avatar (dark square), name/email, join date, "Edit profil" button, stats (kursus diikuti / selesai)
- **Greeting**: `font-family: var(--serif)` (Instrument Serif), uses first name + time-of-day
- **Kursus Kamu**: Grouped list with numbered index, progress bar, Mulai/Lanjutkan button. Completed courses move to Pencapaian.
- **Pencapaian**: Badge cards — checkmark icon top-left, "Selesai" pill top-right, completion date
- **Jelajahi Kursus**: Horizontal carousel. Available courses → "Lihat Kursus". Coming soon → "Beritahu saya" (saves to `waitlist` table, turns green on click)
- **Profile modal**: 3-step questionnaire (role, goal, experience). Has X close button. Saves to `profiles` table. Freelancer, Karir, and Jarang pakai options removed.

## Course Content Pages Features
**⚠️ July 2026 bug fix note**: `kerja-sehari-hari-content.html` and `bisnis-ukm-content.html` were found to have been truncated mid-file since before this engagement started (missing back half of `submitFeedback()` + no closing `</script></body></html>`) — this meant their trailing `<script>` block (containing `init()`) never executed at all in the browser, so those two course pages were **permanently stuck on the loading screen** for every user, always. `prompt-gratis-content.html` and `mulai-claude-content.html` were unaffected. Fixed July 2026 by restoring the missing code from the known-good `mulai-claude-content.html` pattern. If a course content page ever shows a blank/stuck-loading page again, check `grep -c "</script>" file.html` matches the number of `<script` tags before looking anywhere else.

- Left sidebar nav with module items + separate "Feedback" item at bottom (★ icon)
- Progress bar + completion tracking per module → saved to `module_completions`
- Last panel = feedback panel: star rating (1-5) + optional comment → saved to `course_feedback`
- "Ke Dashboard" on last content module → navigates to feedback panel first

### mulai-claude-content.html — content history, July 2026
Course has gone through two PDF-driven restructures in July 2026. Current state: **7 panels (6 content + feedback)**, matching the source PDF "Mulai dengan Claude AI (Modul 1-6)".

1. First pass: modules 1-3 (Apa itu Claude & Setup Akun / Anatomi Prompt K-I-F / Role Prompting) rewritten to follow a "Modul 1-3" PDF — same case study throughout (usaha kecil membalas chat pelanggan), same analogies, comparison tables, and exercises. New reusable CSS box classes introduced: `.tip-box` (gold, analogies/tips/catatan/kesalahan), `.summary-box` (Ringkasan Modul bullets), `.compare-table`/`.compare-table-wrap`, `.step-row`/`.step-card`, `.two-col`/`.col-card`, `.info-grid`/`.info-card`, `.section-heading`, `.body-text`.
2. The course was then temporarily trimmed to just those 3 modules (panel4 = feedback, TOTAL = 4) because that PDF only covered 3 modules.
3. A follow-up "Modul 1-6" PDF arrived adding 3 more modules, so panels 4-6 were added back: **Modul 4 — Claude Artifacts** (generate/edit dokumen terstruktur, `.mistake-list`/`.tip-box.warn` for "Kesalahan Umum" sections), **Modul 5 — Claude Projects** (menyimpan konteks kerja), **Modul 6 — PRAKTEK: Workflow End-to-End** (capstone menggabungkan Artifacts + Projects). Feedback panel renumbered back to `panel7`/`nav-mod7`/`check7`, `TOTAL` back to 7, sidebar tool chips restored to all 4 (Claude.ai, Claude Projects, Claude Artifacts, Google Docs).
- The course-completion treatment ("Kursus Selesai!" box + "Lanjutkan Belajar" next-course cards linking to kerja-sehari-hari/bisnis-ukm) always lives on whichever module is currently last before feedback — moved from module 3 to module 6 in this restructure. That module's nav-bottom button jumps straight to `showModule(7)` instead of generic `nextModule()`.
- `admin.html`'s `COURSES` config for `mulai-claude` tracks this: `modules: 6` (currently).
- Video/PDF/document mapping (course_slug + module_num) is content-agnostic, so nothing needed to change there — re-adding modules 4-6 just means those module numbers are valid targets again in the admin dropdowns.

### produktivitas-content.html — K2 course (July 14, 2026)
> **⚠️ Superseded July 22, 2026 (Checkpoint 25)**: M8 Case Study was archived out of the active flow — course is now **7 active modules** (`TOTAL = 8`, `CONTENT_MODULES = 7`), M8's content preserved but unreachable under `id="panel-casestudy-archived"`. The description below is the original as-built state; see Checkpoint 25 for what changed and why.

New content page for the upgraded K2 course. Created from `K2-Produktivitas/K2-improved-content.md`. Key constants (original, pre-Checkpoint-25):
```javascript
const TOTAL = 9;           // 8 content panels + 1 feedback
const CONTENT_MODULES = 8;
const COURSE_SLUG = 'produktivitas';
```
**8 modules (original)**: M01 Role Prompting → M02 Claude Projects → M03 Gmail+Claude → M04 Google Sheets → M05 Batch Prompting → M06 Prompt Chaining → M07 Dokumen & Riset → M08 Case Study (Satu Hari dengan Claude). Personas used throughout: Rina (UMKM fashion "Kasual Studio") and Budi (konsultan freelance). M08 includes completion badge + "Lanjutkan Belajar" card linking to `bisnis-ukm.html`. 30+ copyable prompt boxes with Salin/copy buttons.

**Files replaced/deleted across the codebase (July 14, 2026)**:
- `kerja-sehari-hari.html` + `kerja-sehari-hari-content.html` — **deleted from repo**
- `produktivitas.html` — new landing page (8 modul, 2 jam)
- `admin.html` — removed `kerja-sehari-hari` entry, `produktivitas` entry has `modules: 8`
- `index.html` — K2 card now links to `produktivitas.html`, shows 8 modul
- `dashboard.html` — ALL_COURSES, PAKET_COURSES, COURSE_ORDER, PAKET_TRACKS all updated
- `mulai-claude-content.html` — "Lanjutkan Belajar" card → `produktivitas.html`
- `bisnis-ukm-content.html` — cross-sell card → `produktivitas.html`
- `kursus-karyawan.html` — `hasAccess` check uses `produktivitas` slug

**produktivitas-content.html bugs fixed (July 14, 2026)**:
- `window._supabase` → `sbClient` (progress was not saving at all — completions silently failed)
- M08 scenario cards made clickable (Skenario A/B toggle via `showScenario()`)
- Video placeholder shown in empty `video-slot-N` divs (dashed box, 1.5s timeout after `course-video.js`)
- **Truncated file bug (July 14, 2026, checkpoint 7)**: file was pushed truncated at 79326 bytes, ending with `comment: comment |` (half of `|| null`). Everything from there to end of file was missing — `doLogout()`, `init()`, setTimeout placeholder, `showScenario()`, and closing `</script></body></html>`. This caused a JS syntax error so NO functions were registered: buttons did nothing, Selanjutnya was unresponsive. Root cause: push workflow copied from Linux mount of Windows directory, which had a stale cache of an older file version while the Windows-layer file was already complete. Fixed by rewriting the correct tail directly via Python in bash, then pushed as commit `5091a3d`. **Diagnostic tip**: if a content page renders HTML but all buttons are dead, run `python3 -c "data=open('file.html','rb').read(); print(repr(data[-100:]))"` — a truncated file will show incomplete JS at the end rather than `</html>`.

**Supabase MCP note**: MCP is connected to `pyuvofppbfuytkcazgwh` ("Personal"), NOT the live project `ctqtdqbsucbhikwnagvl`. The live project is owned by a different account — MCP cannot query it. Use Supabase dashboard directly for DB queries on the live project.

**Backend (index.js) updated July 14, 2026 (checkpoint 8)** — `kerja-sehari-hari` replaced with `produktivitas` in both `COURSES` and `PAKET_COURSES`. K2 access link updated to `https://belajar-claude.vercel.app/produktivitas-content.html`. Pushed as commit `992a1dc` to `belajar-claude-backend`. No remaining references to `kerja-sehari-hari` anywhere in the codebase.

### bisnis-ukm-content.html — rewritten per K3 PDF, July 2026 (SUPERSEDED, see Checkpoint 10)
All 6 content panels rewritten to follow the uploaded PDF "K3 · Konten & Pemasaran Bisnis" (course "Claude untuk Bisnis & UKM"), replacing the old generic per-tool tutorials. Panel count/TOTAL unchanged (already 7 = 6 content + feedback), just content + order + sidebar titles replaced.
- **New module order/titles**: 1) Analisis Kompetitor & Positioning, 2) Deskripsi Produk & Listing yang Menjual, 3) Sistem Konten Instagram, 4) Iklan & Promosi: Claude Tulis, Kamu Design, 5) Template CS WhatsApp yang On-Brand, 6) Content Operating System di Notion (capstone — carries the "Kursus Selesai!" box + "Lanjutkan Belajar" next-card, nav-bottom jumps to `showModule(7)`).
- **Throughline**: Modul 1 produces a one-sentence "positioning" that every subsequent module explicitly reuses (listing copy, IG captions, ad copy, CS tone, Notion calendar) — this is the PDF's core structure, "Satu Positioning, Enam Kanal."
- Same CSS box vocabulary as `mulai-claude-content.html` was added to this file (`.tip-box`, `.tip-box.warn` + `.mistake-list`, `.two-col`/`.col-card`, `.info-grid`/`.info-card`, `.step-row`/`.step-card`, `.section-heading`, `.body-text`), but tuned to this file's existing palette: `.tip-box` uses accent purple (this file's pre-existing `.case-box` already occupied gold, used for "Contoh Skenario"/example callouts, left as-is).
- Sidebar tool chips updated to match the PDF's tool list exactly: Tokopedia/Shopee, Notion, WhatsApp Business, Instagram, Canva.
- `admin.html` already had `bisnis-ukm: modules: 6` configured — no change needed there.

---

## Admin Content Manager (admin.html) — added July 2026 (live, verified working)
- **Access**: gated to `julia.utomo@gmail.com` and `tiffany.utomo@gmail.com` only, checked client-side against the Supabase session email (`ADMIN_EMAILS` array in `admin.html`, `index.html`, and `dashboard.html`). Not logged in → prompt to log in. Logged in but not an admin email → "Akses ditolak".
- **Entry point**: hidden "Admin" link in `index.html`'s and `dashboard.html`'s nav dropdown, shown only when the logged-in session email matches an admin email. (Historically also lived in `prompt-gratis.html`'s nav — that page became a redirect stub in Checkpoint 35, but `index.html`/`dashboard.html` already had their own independent copies of this link, so nothing was lost.)
- **PDF upload**: pick a course → upload a PDF → stored in the `course-pdfs` Supabase Storage bucket, public URL saved to `course_resources` (one row per `course_slug`, upsert). Content pages show a "📄 Unduh [filename]" link in the sidebar (`#pdf-download-slot`) via `course-video.js` if a resource exists for that course.
- **Video (YouTube link)**: pick a course + module number → paste a YouTube URL (watch/share/shorts/embed formats all work) → the raw URL is upserted straight into `module_videos` (`course_slug` + `module_num`), no file upload / storage bucket involved. `extractYoutubeId()` (duplicated in `admin.html` and `course-video.js`) pulls the 11-char video ID via regex. Content pages render a responsive 16:9 YouTube `<iframe>` embed at the very top of the matching module panel — above the breadcrumb/title, not after the subtitle — via `#video-slot-N` populated by `course-video.js`. If a saved `video_url` isn't recognizable as YouTube, it falls back to a plain "▶ Tonton Video Modul" link. The `course-videos` storage bucket created earlier is no longer used for anything and can be left empty or removed. Selecting a course/module in the admin video card now shows a live indicator (`#currentVideoInfo`, `checkCurrentVideo()`) — green "✓ Video sudah ada..." with the existing link if one's saved, gray "Belum ada video..." if not, and pre-fills the input with the existing URL so it doubles as an edit field. Runs on page load and on every course/module selection change.
- **Practice document upload**: pick a course + module number → upload one or more PDF/DOC/DOCX files at once (`docFileInput` now has the `multiple` attribute; `uploadDoc()` loops through `fileInput.files` sequentially, uploading + inserting each and reporting an "N/M berhasil" summary if any fail) → stored in the `course-documents` bucket, rows inserted (not upserted — multiple docs per module allowed) into `module_documents`. Each doc has a "Hapus" delete button in the admin overview table (removes both the storage object and the DB row).
- **PPT per module upload** (added July 2026): pick a course + module number → upload a PPT/PPTX file → stored in the `course-ppts` bucket, public URL upserted into `module_ppts` (`course_slug` + `module_num`, one PPT per module — new upload replaces the old one, mirrors the video card's UX including a live `#currentPptInfo` indicator via `checkCurrentPpt()`). Applies to every course (K1 `mulai-claude` and onward), not just one.
- **Content page layout (both changed July 2026)**: the old `#pdf-banner-slot` (full-width purple PDF banner above the video, at the very top of `.main-inner`) has been **removed** from all 4 content pages and from `course-video.js` — the course-level PDF is still available via the sidebar `#pdf-download-slot` link, just no longer duplicated as a banner. In its place, every module panel now has `#ppt-slot-N` and `#doc-slot-N` positioned **directly below the module title/subtitle** (moved up from the old end-of-module position, right before the Sebelumnya/Selanjutnya nav). Order per module: title → subtitle → PPT link (if any) → Materi Praktik doc list (if any) → rest of module content. `course-video.js` populates `#ppt-slot-N` from `module_ppts` the same way it populates `#video-slot-N` from `module_videos`.
- **Overview table**: shows current PDF, all module videos, all module PPTs, and all practice documents (with delete) across all 4 courses.
- **Course/module mapping guarantee**: `COURSES` slug+module-count config is identical across `admin.html` and all 4 content pages' `COURSE_SLUG`/slot IDs (traced July 2026) — upload dropdowns can't produce a course_slug/module_num combination that doesn't map to a real slot, and `onConflict` keys (`course_slug` for PDFs, `course_slug,module_num` for videos and PPTs) match each table's actual primary key.
- **Setup status**: `sql/admin-content-setup.sql` has been run in the Supabase SQL editor (tables + RLS confirmed in Table Editor), and the `course-pdfs` / `course-videos` public storage buckets have been created. Admin login + nav link confirmed working as of July 7, 2026 (originally on `prompt-gratis.html`, now via `index.html`/`dashboard.html` per Checkpoint 35).
- **RLS fix + PPT feature (July 11, 2026) — RESOLVED**: the "Dokumen Praktik" upload was failing with "new row violates row-level security policy" because the `course-documents` storage bucket had never been created in the *correct* Supabase project. Root cause turned out to be a **two-project mix-up**: Julia had been running SQL/creating buckets in an unrelated Supabase project (`pyuvofppbfuytkcazgwh`), while `supabase-config.js` actually points the live site at `ctqtdqbsucbhikwnagvl` ("Belajar-Claude"). Artifacts created in the wrong project (a `module_ppts` table, `course-documents`/`course-ppts` buckets) were left in place there since they're inert and don't affect the live site — cleanup is optional, not required. Fix: ran `sql/admin-content-setup.sql` + `sql/module-ppts-and-fix-uploads.sql` (concatenated as `run-this-in-belajar-claude-project.sql`, given directly to Julia) in the correct project `ctqtdqbsucbhikwnagvl`. **Confirmed working as of this checkpoint** — PDF, PPT, and multi-file Dokumen Praktik uploads all succeed in production.
- **Practice document file types (July 11, 2026)**: `docFileInput` now also accepts `.md` in addition to PDF/DOC/DOCX (`accept` attribute + the extension whitelist in `uploadDoc()`).
- **Multi-file upload success message (July 11, 2026)**: `uploadDoc()` now lists the uploaded filenames in the success status when more than one file is uploaded in a batch, e.g. "2 dokumen berhasil diunggah untuk ... ✓ (a.pdf, b.pdf)" — purely cosmetic, the underlying count (`okCount`) was already accurate.
- **Known limitation**: practice documents and PPTs are uploaded as raw files to Supabase Storage, subject to Supabase's per-file upload size limit and total storage/bandwidth quota. Videos remain link-based (YouTube) so they're not affected by this.
- **Supabase project gotcha to remember**: there are (at least) two Supabase projects in play — `ctqtdqbsucbhikwnagvl` ("Belajar-Claude", the real one, referenced in `supabase-config.js`) and `pyuvofppbfuytkcazgwh` (unrelated, has stray leftover objects from this incident). Always confirm the project ID in the dashboard URL before giving SQL to run.

---

## Index.html Key Details
- **Hero section title**: "Pilih jalur sesuai tujuanmu" — single line (no `<br>`)
- **Jalur grid**: Individual white cards with `1.5px solid #D5D5D2` border + drop shadow. 3-column grid, `gap: 16px`. Featured (All Access) card = dark background.
- **Course carousel**: Horizontal scroll, individual cards with border+shadow. Tags use `align-items: flex-start` on card to prevent stretching.
- **"Segera Hadir"** on jalur links: Developer → `coming-soon.html`, Mahasiswa → `kursus-mahasiswa.html`

---

## Backend (klaud-backend — Node.js/Express)
Hosted on Railway (`https://klaud-backend-production.up.railway.app`). Handles payments and signups.
- **GitHub repo**: `juliautomo/belajar-claude-backend` (renamed from `klaud-backend`)
- **Railway service name**: still shows `klaud-backend` (cosmetic only, URL unchanged)

### API Endpoints
| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/` | Health check |
| `POST` | `/signup` | Free account creation — adds to ConvertKit, Google Sheets, creates Supabase user, sends welcome email. No longer auto-enrolls into `prompt-gratis` as of Checkpoint 35 — course content is gated behind `all-access` regardless of how the account was created |
| `POST` | `/create-payment` | Creates Duitku invoice, returns `reference` + `orderId` |
| `POST` | `/webhook/duitku` | Payment confirmation — saves enrollment to Supabase + Google Sheets, adds ConvertKit tag, sends access email |

### Course Catalog (COURSES in index.js)
Updated July 14, 2026 — `kerja-sehari-hari` fully replaced with `produktivitas`. `all-access` added Checkpoint 32 (July 23, 2026).

| Slug | Name | Price |
|------|------|-------|
| `all-access` | All Access — Semua Kursus | Rp 399,000 |
| `produktivitas` | Produktivitas Kantor | Rp 149,000 |
| `content-marketing` | Content & Marketing | Rp 149,000 |
| `konten-copywriting` | Copywriting & Konten Digital | Rp 199,000 |
| `analisis-data` | Analisis Data & Laporan | Rp 199,000 |
| `build-automation` | Automasi Workflow | Rp 299,000 |
| `ai-powered-app` | Build AI App Sederhana | Rp 299,000 |
| `claude-api-dev` | Claude API untuk Developer | Rp 399,000 |
| `jual-produk-ai` | Build & Monetisasi Produk AI | Rp 499,000 |
| `paket-mahasiswa` | Claude untuk Mahasiswa | Rp 249,000 |
| `paket-karyawan` | Claude untuk Karyawan & Profesional | Rp 299,000 |
| `paket-pengusaha` | Claude untuk Pengusaha | Rp 499,000 |
| `paket-creator` | Claude untuk Content Creator | Rp 299,000 |

### Package → Course Enrollment Map (PAKET_COURSES)
Updated July 14, 2026 — fully in sync with frontend.

| Package | Constituent Courses |
|---------|-------------------|
| `paket-karyawan` | mulai-claude, produktivitas, analisis-data |
| `paket-mahasiswa` | mulai-claude, konten-copywriting, analisis-data |
| `paket-pengusaha` | mulai-claude, content-marketing, konten-copywriting, build-automation |
| `paket-creator` | mulai-claude, content-marketing, konten-copywriting |

### Backend Integrations
- **Duitku**: Payment gateway (sandbox: `api-sandbox.duitku.com`). Signature: SHA256 for invoice creation, MD5 for webhook verification. Merchant code + API key stored as Railway env vars. Webhook endpoint `/webhook/duitku` verifies signature, updates Supabase `enrollments`, sends access email via SendGrid, logs to Google Sheets.
- **ConvertKit**: Email marketing. Tags applied on signup and on course purchase.
- **Google Sheets**: Logs signups and purchases for tracking. Credentials stored as Railway env var (`GOOGLE_CREDENTIALS_JSON`).

---

## Checkpoint 9 (July 14, 2026) — GitHub PAT rotated, ConvertKit call-signature bug fixed, CONTEXT.md truncation fixed
- **GitHub PAT expired**: the token previously embedded in the `belajar-claude`/`belajar-claude-backend` remote URLs stopped working ("Invalid username or token"). Julia generated a new one; Claude should ask her for the current token if push fails with that error, then embed it in the remote URL the same way as before (`https://<token>@github.com/juliautomo/<repo>.git`) — cloning to `/tmp` and pushing from there, since the Windows-mounted `.git/` still blocks lock file writes for direct pushes from the mount.
- **`addToConvertKit` bug fixed (backend)**: `index.js`'s webhook handler was calling `addToConvertKit({ name, email, courseSlug })` (single object) but the function itself is defined as `addToConvertKit(name, email, tags = [])` (three positional args) — the object was being silently assigned to `name`, `email` came through `undefined`, and `tags` defaulted to `[]`. This meant ConvertKit tagging on every paid purchase was silently broken. Fixed the call site to pass positional args with the correct tags (`course?.tag`, `'Pembeli: Semua Kursus'`), matching the working pattern already used in `/signup`. Pushed as commits `f9c678d` and `0ff0d5f` to `belajar-claude-backend`.
- **False alarm, corrected**: this session initially misdiagnosed `index.js` as having a truncated webhook handler (missing `app.listen()`, error handling, etc.) — that diagnosis was based on a stale `origin/main` git cache on the mount (from the dead PAT never successfully fetching). The real GitHub file (`992a1dc`) was already complete and correct from checkpoint 8. A corrective commit (`0ff0d5f`) restored the `produktivitas` course link to `https://belajar-claude.vercel.app/produktivitas-content.html` after an intermediate commit accidentally reverted it to the stale `github.io` pattern. Net effect after both commits: catalog is correct, only the real ConvertKit bug was fixed.
- **`CONTEXT.md` was truncated on GitHub**: the checkpoint-8 push of this file (commit `5636bd5`) cut off mid-sentence at "e.g. \"2 dokumen" and was missing ~60 lines (Known limitation, Supabase project gotcha, Index.html Key Details, Backend/API Endpoints, Course Catalog table, PAKET_COURSES map, Backend Integrations — everything from that point through checkpoint 8). The Windows-mount-to-`/tmp`-clone copy step likely raced with a not-yet-flushed write, same class of bug as the earlier `produktivitas-content.html` truncation. This checkpoint 9 push restores the full file. **Lesson**: after copying a file mount → `/tmp` clone for push, diff the copied file's line count / tail against the mount source before committing, don't assume the copy completed.
- **SendGrid**: Transactional email (welcome email on signup, access email on purchase). API key in Railway env.


---

## Checkpoint 10 (July 16, 2026) — New 9-module K3 course built, migrated into `bisnis-ukm` slug, header bug fixed, truncation bug hit repeatedly

**New K3 course content built**: A new, larger K3 curriculum ("Content & Marketing") was built from `Content-Marketing/Content-Marketing-Panduan-Belajar.pdf` — 9 modules instead of the old 6: 01 Positioning & Analisis Kompetitor, 02 Deskripsi Produk Marketplace, 03 Sistem Konten Instagram, 04 Copy Iklan + Canva Connector, 05 WhatsApp Business CS System, 06 Email & Promosi Bisnis (Gmail Connector), 07 Performance Marketing, 08 Content OS di Notion, 09 Case Study: Peluncuran Produk Baru (capstone, new — mirrors K2's Modul 08 pattern). Running persona: "Dapur Rara," a fictional frozen-food UMKM, launching "Garang Asem Frozen" in Modul 9. Supporting starter file: `Content-Marketing/cm-m9-starter-peluncuran.txt` (5-day Senin–Jumat launch-week scenario covering all 8 prior modules, ends in a Rekap savings table).

**Slug collision discovered and resolved**: the new course was initially built under a brand-new `course_slug = 'konten-marketing'` with its own page (`konten-marketing-content.html`). This turned out to be wrong — `dashboard.html`'s `ALL_COURSES` catalog, `admin.html`'s `COURSES` config, and the backend's `COURSES` catalog already had a **half-finished rename in place**: the `bisnis-ukm` slug's *title* had already been changed to "K3 · Konten & Pemasaran Bisnis" everywhere, but the underlying page content was still the old 6-module curriculum. Asked Julia directly; confirmed the new 9-module content should **replace `bisnis-ukm` in place** (same slug, so existing Rp149K buyers keep access under the same enrollment record) rather than exist as a separate course. Migrated accordingly:
- `bisnis-ukm-content.html` overwritten with the new 9-module lesson page (`course_slug` rewritten from `konten-marketing` → `bisnis-ukm` throughout: `COURSE_SLUG` const, `enrollments`/`module_completions`/`course_feedback` queries, `localStorage` key).
- `bisnis-ukm.html` (sales page) — curriculum, hero copy, tool chips, skills grid, and case studies all rewritten to describe the 9 modules instead of the old 6.
- `dashboard.html` and `admin.html` — `bisnis-ukm` entry's `modules` count bumped 6 → 9.
- Backend `index.js` — `bisnis-ukm` catalog link corrected from a stale `juliautomo.github.io` URL to `https://belajar-claude.vercel.app/bisnis-ukm-content.html` (same class of bug as the `produktivitas` link fixed in checkpoint 9).
- Superseded `Content-Marketing/konten-marketing-content.html` deleted from the repo.
- **Important**: since course content pages auto-`upsert` an enrollment row for any logged-in visitor on page load (no payment gate client-side — see `init()` in every `*-content.html`), no manual SQL enrollment was needed. Visiting `bisnis-ukm-content.html` while logged in is sufficient to make the course appear on the dashboard.

**Dashboard/catalog architecture note (important, easy to re-trip on)**: `dashboard.html`'s `_init()` does `enrollments = paketExpanded.filter(e => ALL_COURSES[e.course_slug])` — any enrollment row whose `course_slug` isn't a key in the hardcoded `ALL_COURSES` object is **silently dropped**, not shown, no error. If a new course is ever added under a new slug, it must be registered in `ALL_COURSES` (dashboard.html), `COURSES` (admin.html), and `COURSES` (backend index.js) before enrollments under that slug will show up anywhere.

**`bisnis-ukm.html` nav dropdown bug fixed**: the user-account dropdown (`.nav-user-pill` → `.nav-user-dropdown`) was rendering permanently open/unstyled (showing "Dashboard" and "Keluar" as plain stacked links next to the pill at all times) because of two stacked bugs left over from an earlier incomplete edit: (1) the CSS for `.nav-user-dropdown`, `.nav-user-chevron`, and related hover/open states was missing entirely from this file's `<style>` block (present on `index.html` but never copied here), so the dropdown had no `display:none` default; (2) the `<script src="https://app-sandbox.duitku.com/lib/js/duitku.js">` tag had inline JS (`toggleUserMenu`, `doSignOut`, outside-click handler) nested *inside* it instead of a separate `<script>` block — browsers ignore all child content of a `<script src=...>` tag, so those functions were never defined at all, meaning clicking the pill threw a silent reference error. Fixed both: copied the correct dropdown CSS from `index.html`, and split the Duitku script tag from the inline handlers into two separate `<script>` elements.

**Truncation bug hit repeatedly this session, worse than before**: the known Windows-mount Edit-tool truncation bug (see checkpoint 9 note re: `produktivitas-content.html`) recurred multiple times on `bisnis-ukm.html` and `dashboard.html` specifically — and this time the cut always landed at the **absolute end of the file**, regardless of where in the file the `Edit` call's `old_string`/`new_string` actually were (e.g. editing the `<title>` tag near the top of `bisnis-ukm.html` truncated the file's closing `</script></body></html>` at the bottom). `wc -c` immediately after an `Edit` call is not sufficient to catch this if the byte count coincidentally looks plausible — must `tail -c 100` and confirm the file actually ends with `</html>` after every Edit on these two files. Repairs were done by diffing against the last known-good pushed copy (in the `/tmp` git clone) and either restoring from that clone or appending the correct tail via a Python heredoc, then re-verifying with `tail`/`diff` before the next edit. **Established practice going forward for `bisnis-ukm.html` and `dashboard.html` specifically**: prefer Python `str.replace()` via `mcp__workspace__bash` over the `Edit` tool for these two files, since every Python-based edit this session completed cleanly while multiple `Edit`-tool calls truncated.

**Commits this checkpoint**:
- `belajar-claude`: `c9c6d76` (initial Content-Marketing course + starter file, later superseded), `0bab627` + `a3ff581` (nav dropdown CSS/script fix, first attempt truncated the file, second commit repaired it), `562824e` (migrate 9-module course into `bisnis-ukm` slug — content page, sales page, dashboard.html, admin.html), `55e2f22` (remove superseded `konten-marketing-content.html` duplicate — first attempt at removal wasn't staged, had to be re-committed).
- `belajar-claude-backend`: `69daa4b` (fix `bisnis-ukm` catalog link to `vercel.app` domain).

**Verification method used**: after every push, did a fresh `git clone` to a new `/tmp` directory (never trusted the `/tmp/bc_push` working clone's local state alone) and grepped/tailed the cloned copy to confirm what's actually live on GitHub — this caught the un-staged deletion of `konten-marketing-content.html` that would otherwise have gone unnoticed.


---

## Checkpoint 11 (July 17, 2026) — K1-K9 prefixes stripped, nav dropdown bug found on 7 more pages, module previews audited, `bisnis-ukm` renamed to `content-marketing`, two dead offerings removed

**K1-K9 course code prefixes removed site-wide**: every user-facing course title (dashboard cards, sales page eyebrows/titles/H1s, content page cross-sell "Lanjutkan Belajar" cards, index.html's jalur-belajar lists and course-card grid, backend catalog `name` fields used in payment emails) had its "K1 · ", "K2 · " etc. prefix stripped, e.g. "K2 · Produktivitas Kantor" → "Produktivitas Kantor". Internal ConvertKit `tag:` fields in the backend catalog were deliberately left untouched (not user-visible, and changing them risks breaking existing ConvertKit segment filters). `index.html` also had a sentence referencing "K1" by code in a post-login CTA subtext — changed to plain prose ("Kamu sudah mulai belajar...") instead of a course code.

**Nav dropdown bug (see checkpoint 10) found on 7 more pages, not just `bisnis-ukm.html`**: the same root cause — `.nav-user-dropdown` CSS never added when the dropdown feature shipped — turned out to affect `produktivitas.html`, `mulai-claude.html`, `kursus-karyawan.html`, `kursus-mahasiswa.html`, `kursus-ukm.html`, `paket-content-creator.html`, and `prompt-gratis.html` (10 total pages have the dropdown markup; only `index.html` had correct CSS from the start). `produktivitas.html` additionally had the second bug from checkpoint 10 (inline JS nested inside a `<script src=...>` tag, never executing) — fixed the same way, splitting into two script tags. All 7 fixed and verified via fresh clone in one commit.

**Module preview audit**: compared each of the 4 live course's landing-page "curriculum" section against its actual lesson page (source of truth), since they're hand-maintained separately and drift over time.
- `mulai-claude.html` was stale for modules 4-6 — still described an older course structure (generic Artifacts/Projects copy, a "Google Docs Export" module that no longer exists) instead of the current "Claude Artifacts — Output Langsung Jadi Dokumen" / "Claude Projects — Memori Pekerjaan Kamu" / "PRAKTEK: Workflow End-to-End Pertamamu" restructure from earlier work. Fixed all three, including changing module 6's tool-chip from "Google Docs" to "Praktek".
- `prompt-gratis.html`'s category breakdown grid was worse than stale — 6 categories totaling only 14 prompts, while the actual content page groups all 20 prompts into 5 categories (Produktivitas Kerja 4, Bisnis & Marketing 5, Karir & CV 4, Komunikasi Profesional 4, Belajar & Riset 3). Replaced the whole grid.
- `produktivitas.html` and `bisnis-ukm.html`/`content-marketing.html` were already aligned — no changes needed (the latter was built directly from the lesson content this session, so no drift had occurred yet).
- **Lesson for future course edits**: whenever a lesson page's module structure changes, the corresponding landing page's module-preview section needs a matching update — nothing enforces this automatically, it's two independently-maintained blocks of copy.

**`bisnis-ukm` renamed to `content-marketing`** (slug, both filenames, and display title "Konten & Pemasaran Bisnis" → "Content & Marketing", per explicit instruction — the earlier half-Indonesian branding from checkpoint 10's migration was reverted in favor of the English name matching the original source PDF):
- `bisnis-ukm.html` → `content-marketing.html`, `bisnis-ukm-content.html` → `content-marketing-content.html` (renamed via `git mv`, content also text-substituted: `course_slug`, `COURSE_SLUG` const, all Supabase query filters, `localStorage` key, title tags, breadcrumbs, sidebar course name, completion badge text).
- Cross-link fixups required in 7 more files: `dashboard.html` (`ALL_COURSES` key/title/links, `PAKET_COURSES`, `COURSE_ORDER`, `PAKET_TRACKS`), `admin.html` (`COURSES` config), backend `index.js` (`COURSES` catalog + `PAKET_COURSES`), `kursus-ukm.html` + `paket-content-creator.html` (`hasAccess` arrays gating bundle content), `index.html` (course card — also fixed unrelated stale copy still claiming "6 modul · 1.5 jam" and Tokopedia/Notion-focused description, missed during the checkpoint 10 migration), `mulai-claude-content.html` + `produktivitas-content.html` (cross-sell "Lanjutkan Belajar" next-cards).
- **Pattern confirmed again**: any time a course's identity changes, the full checklist is: both HTML files (if renamed) → `dashboard.html` (4 separate places) → `admin.html` → backend `index.js` (2 places) → any `hasAccess`/`PAKET_COURSES` gating on bundle pages → any other course's cross-sell "next card" pointing at it → `index.html`'s course grid. Missing any one of these leaves a dangling reference or an invisible enrollment (see checkpoint 10's `ALL_COURSES` filter note).
- Existing enrollment/progress data under the old `bisnis-ukm` slug does not carry over automatically (Supabase rows are keyed by `course_slug` as literal text) — since content pages auto-enroll on visit with no payment gate, this only matters for module *progress*, not access; a fresh visit to the renamed page re-enrolls instantly but starts progress at 0/9 again.

**Two offerings taken offline entirely**: `workshop-zoom.html` and `coaching-1on1.html` deleted from the repo, and their `workshop-zoom`/`coaching-1on1` entries removed from the backend `COURSES` catalog (so `/create-payment` can no longer process them even via a direct/bookmarked link). Both pages were already unlinked from anywhere else on the live site (no nav, no course grid, no cross-sell) before deletion — confirmed via full-repo grep before removing, so no dangling links were created.

**Sandbox note**: the `/tmp` working directory was wiped mid-session (all previous `/tmp/bc_push` and `/tmp/backend_push` clones vanished without warning). Recovered by re-cloning fresh from GitHub and confirming the prior commits were already safely pushed before continuing — the "always verify via fresh clone after pushing" habit from checkpoint 10 is what made this a non-event rather than a lost-work incident.

**Commits this checkpoint**:
- `belajar-claude`: `c5ba0c6` (strip K1-K9 prefixes), `d823e67` (nav dropdown fix on 7 pages), `1758c7a` (align mulai-claude.html + prompt-gratis.html module previews with lesson content), `bcded6c` (rename bisnis-ukm → content-marketing across 9 files), `38ba90c` (remove workshop-zoom.html + coaching-1on1.html).
- `belajar-claude-backend`: `0109361` (strip K1-K9 prefixes from catalog names), `70c64d8` (rename bisnis-ukm → content-marketing in catalog), `b7dd35c` (remove workshop-zoom + coaching-1on1 from catalog).

---

## Checkpoint 12 (July 17, 2026) — Payment gate security fix, local mount was 38 commits stale, bundle promotion removed, course cards redesigned, two pre-existing production bugs found and fixed, R-K-T-F framework standardized, K2-Produktivitas reorganized

**Payment-gating security fix**: `content-marketing-content.html` and `produktivitas-content.html` previously granted full course access to *any* logged-in user, no payment check — `content-marketing-content.html` additionally auto-`upsert`ed a bogus `type:'paid'` enrollment row on every visit. Anyone who found/shared the content-page URL got free access. Fixed both: `init()` now checks for a real `enrollments` row (`email` + `course_slug`) before showing content, redirecting to the sales page otherwise; `ADMIN_EMAILS = ['julia.utomo@gmail.com', 'tiffany.utomo@gmail.com']` bypasses the check. The bogus auto-upsert was removed entirely from `content-marketing-content.html`. **Caveat**: pre-existing bogus enrollment rows created before this fix (including Julia's own) are not retroactively cleaned up — only new unauthorized rows are now prevented. Commit `d9e45ab`.

**Local mount discovered 38 commits behind GitHub**: while investigating why `kerja-sehari-hari.html` still existed on disk, `git status` on the Windows-mounted local folder revealed it was 38 commits behind `origin/main` — it still had stale local (uncommitted) copies of files already deleted from the real site (`kerja-sehari-hari.html`/`-content.html`, `bisnis-ukm.html`/`-content.html`, `workshop-zoom.html`, `coaching-1on1.html`), while also having many newer files as untracked copies (`admin.html`, `content-marketing.html`, `produktivitas.html`, etc. — byte-identical to origin, just never `git add`ed locally). Root cause: this session's entire push workflow only ever touched a separate `/tmp` clone, never the mount's own `.git` metadata. Fixed via `git fetch && git reset --hard origin/main` on the mount (verified first that every "modified/untracked" file was byte-identical to origin, so nothing real was lost) plus one `git clean -fd` pass, which incidentally deleted a handful of genuinely-untracked local-only scratch files (Python build scripts, a couple of reference `.txt` files, a superseded PDF — see K2-Produktivitas note below for the consequence). **New standing habit**: after every push this session onward, also ran `git fetch origin && git reset --hard origin/main` directly on the mount (not just a separate verification clone) so the local folder Julia actually sees never drifts again.

**`kerja-sehari-hari` resolved**: turned out to be an already-retired near-duplicate of Produktivitas Kantor (6 overlapping modules, same Rp 149K price) that GitHub history showed was deleted in a past commit (`4321b7b`, before this session). It only still appeared locally because of the stale-mount issue above. No repo action was needed once the mount was synced; a leftover `enrollments` row under that slug for Julia (and Tiffany, under both her `tiffany.utomo@gmail.com` and `tiffanyutomo@gmail.com` accounts) was flagged with cleanup SQL for Julia to run herself (DB access constraint — see below).

**Leftover K-badges found on bundle pages**: the checkpoint-11 K1–K9 prefix strip only matched text like "K1 · ", missing standalone monospace badge `<div>`s (just "K1", "K2", etc., no separator) in the "included courses" list on `kursus-karyawan.html`, `kursus-mahasiswa.html`, `kursus-ukm.html`, `paket-content-creator.html`. Removed. Commit `b81cd44`.

**Bundle/paket promotion removed from front page + header** (not launching bundles until all individual courses are ready): deleted the entire `#jalur` "Pilih jalur sesuai tujuanmu" section and its dead CSS from `index.html`, changed the hero CTA from `#jalur` to `#kursus` ("Lihat Kursus →"), and removed the "Jalur Belajar" nav link from all 9 pages that had it. The 4 bundle sales pages (`kursus-karyawan.html`, `kursus-mahasiswa.html`, `kursus-ukm.html`, `paket-content-creator.html`) and `paket.html` were **not deleted** — they still exist and work if visited directly, just fully unlinked from anywhere on the site now. Commit `a909545`.

**Course cards on `index.html` redesigned** (iterative, several rounds of feedback): replaced the old horizontal-scroll carousel (small 290px cards) with a bigger-card paginated grid (3 columns × 2 rows, prev/next arrows + dot indicator, 6 cards page 1 / remaining 3 page 2) — gradient banner with a floating icon badge, tier pill (FREE/BEGINNER/INTERMEDIATE/ADVANCED), bold title, description, divider, price + button footer. New CSS classes: `.course-grid-wrap`, `.course-page`, `.course-card-v2`, `.ccv2-*`. Old `.carousel`/`.course-card`/`.course-tag` classes and `scrollCarousel()` JS fully removed, replaced with `gotoCoursePage()`. Follow-up refinements from Julia's feedback, each its own commit:
- `c57d01f` — divider/price/button footer wasn't bottom-aligned across a row when one card's title wrapped to 2 lines (`margin-top: auto` on `.ccv2-divider` fixes it for good, regardless of content length).
- `5b04a54` — coming-soon cards showed a price that isn't real yet; replaced with bold "Segera Hadir" in the price slot.
- `ed1c3f1` — coming-soon cards then had "Segera Hadir" appearing twice (price slot + button); collapsed to a single full-width disabled button.
- `1f84f84` — button label was inconsistently "Pelajari →" (free) vs "Lihat →" (paid) for no real reason; standardized to "Pelajari →" everywhere.
- `31a46a2` — price subtext was inconsistently "One-time payment" vs "Lifetime access" for the two paid courses, even though both are literally the same purchase type; standardized to "Lifetime access".
- `9281002` — removed the modul-count/duration/tag meta row entirely per Julia's request ("remove these descriptions for all courses").

**Two pre-existing production bugs found and fixed (unrelated to this session's other work, both were already broken on `origin/main` before today)**:
- `reset-password.html` was truncated mid-`<script>` (cut off inside a string literal, `'Pas`) since commit `d98f1be` — a syntax error that silently broke the *entire* script block, including the `onAuthStateChange` listener and its 4-second fallback timeout. Symptom: the page hung on "Memverifikasi..." forever for every user trying to reset their password, with no error shown. Fixed by reconstructing the missing tail (success message, redirect to dashboard, `showMsg()` helper, closing tags). Commit `52adb59`. **Diagnostic pattern reinforced again**: `tail -c 300 file.html` to check the file actually ends with `</html>` before assuming a broken flow is a logic bug rather than a truncation.
- Discovered while investigating: this bug predates this session and was not something Claude caused — flagged clearly to Julia as such.

**Prompt framework inconsistency fixed** (`mulai-claude-content.html` Module 2 vs. `produktivitas-content.html` Module 1, both teach "Role Prompting"): Produktivitas Kantor's version — **R-K-T-F** (Role → Konteks → Tugas → Format) — is the correct, canonical one: fuller treatment (info-grid, before/after example, cheat sheet), explicitly framed as the foundation for every later module. Mulai dengan Claude's Module 2 actually taught **two conflicting frameworks in the same summary box**: a 4-element list "Konteks, Peran, Tugas, Format" (K-P-T-F) as one bullet, then "Gunakan urutan K-I-F" (a different, 3-element framework dropping Role/Peran entirely and renaming Tugas to "Instruksi") two bullets later. Fixed 8 separate spots in that module (subtitle, section heading, example cards + their order, combined prompt example, tip box, summary bullets, exercise text, output box wording) to consistently teach R-K-T-F and say "Role" (not "Peran"), matching Produktivitas Kantor. Commit `112d6c8`. **Pending**: the PDF panduan belajar and module PPT for Mulai Claude Module 2 still reflect the old inconsistent framework and need regenerating to match (tracked as an open task).

**`K2-Produktivitas/` folder reorganized into per-module subfolders**, per Julia's request: created `M01-Role-Prompting/` through `M08-Case-Study/` plus `Course-Level/`, moved each existing supporting file into its matching module folder (`K2-M1-preview.pptx` → M01, `k2-m2-referensi-project.txt` → M02, `k2-claude-sheets-helper.js` + `k2-data-latihan-sheets.csv` → M04, `k2-m5-latihan-batch.txt` → M05), moved course-level materials (Outline-Script.docx, 3 versions of the Panduan Belajar PDF, improved-content.md) into `Course-Level/`. Empty module folders (M03, M06, M07, M08 — no supporting files existed) got a `.gitkeep` so they'd actually persist on GitHub (git doesn't track empty directories). Commits `7915d6b` + `0fdd8e2`.
- **Important discovery made during this reorg**: the actual module PPT files (`K2-M01` through `K2-M08`, 8 files) that tasks earlier in this session record as "generated" were believed **never actually committed to git** — `git log --all` showed zero history for them anywhere in the repo. Only `K2-M1-preview.pptx` (a preview file, not a full module deck) survived. **Correction (checkpoint 13)**: this diagnosis was wrong — the 7 "missing" files were sitting on disk the whole time, just not yet visible to `ls` due to the same Windows-mount caching delay that caused other false alarms this session. They were found intact, validated non-corrupt, and pushed in checkpoint 13 before any regeneration was needed. Superseded entirely in checkpoint 13 anyway, since all 8 decks were rebuilt from scratch for unrelated reasons (style-spec compliance).

**Enrollment data cleanup (deferred to Julia — DB access constraint)**: the connected Supabase MCP tool only reaches an unrelated project (`pyuvofppbfuytkcazgwh`), not the real live project (`ctqtdqbsucbhikwnagvl`), so all DB fixes this checkpoint were handed to Julia as SQL to run herself in the Supabase SQL editor, not executed directly:
- Julia's own stray rows: `DELETE FROM enrollments WHERE email='julia.utomo@gmail.com' AND course_slug IN ('kerja-sehari-hari','konten-marketing','bisnis-ukm')` (orphaned/pre-rename-duplicate slugs).
- Tiffany has **two separate accounts** from a typo — `tiffany.utomo@gmail.com` and `tiffanyutomo@gmail.com` (missing dot; Gmail treats these as the same inbox, Postgres doesn't) — each with its own duplicate `prompt-gratis`/`mulai-claude`/`kerja-sehari-hari`/`bisnis-ukm` rows. Same cleanup SQL given for both emails; the deeper duplicate-account merge was explicitly deferred ("leave for now").
- "Analisis Data & Laporan" showing on Julia's dashboard is not a direct enrollment — it's synthesized client-side by `dashboard.html`'s `PAKET_COURSES` bundle-expansion logic from her real `paket-karyawan` enrollment row. Removing it from view would require dropping the whole `paket-karyawan` enrollment, not a targeted delete — left as-is per Julia's choice.

**Open tasks tracked at end of checkpoint 12 (both resolved in checkpoint 13, see below)**:
1. ~~Regenerate the Mulai Claude Module 2 PDF panduan + PPT to reflect the R-K-T-F fix.~~
2. ~~Regenerate all 8 Produktivitas Kantor module PPTs (M01–M08).~~

**Commits this checkpoint**:
- `belajar-claude`: `d9e45ab` (payment gate fix), `b81cd44` (remove leftover K-badges on bundle pages), `a909545` (remove bundle promotion from front page + header), `624feec`+`c57d01f`+`5b04a54`+`ed1c3f1`+`1f84f84`+`31a46a2`+`9281002` (course card redesign, 7 iterative commits), `52adb59` (fix truncated reset-password.html), `112d6c8` (standardize R-K-T-F framework), `7915d6b`+`0fdd8e2` (K2-Produktivitas folder reorg).

---

## Checkpoint 13 (July 18, 2026) — All 8 K2 PPTs rebuilt per brand style spec (2 real overflow bugs found + fixed), Mulai Claude Module 2 PPT + PDF built fresh, R-K-T-F standardization finished

**`belajarclaude-pptx-style-spec.md` saved to repo root**: uploaded by Julia this checkpoint with a note that she'd asked for it to be saved once before — confirmed it had never actually been saved anywhere in the repo despite that earlier instruction (lost to context compaction). Saved at repo root (cross-course spec, not nested under one course folder). Commit `23b631e`.

**All 8 Produktivitas Kantor (K2) module PPTs rebuilt from scratch** to strictly follow the style spec (Helvetica, navy `0D1321`/purple `6849F6` palette, header bar pattern, component library, §6 spacing rules) — triggered by Julia flagging a specific bug: an overflowing dark "TEMPLATE SYSTEM INSTRUCTIONS" box on M02's "Setup dalam 3 Langkah" slide that ran past the slide's visible bottom edge.
- Built a reusable pptxgenjs component library (`lib.js` — not committed to this repo, lives in the build sandbox) implementing the spec's header bar, cover slide, numbered step row, 2-up compare cards, tier strip, icon grid, exercise/tip callouts, dark code/template box, chip row, and a simple table helper — all **self-sizing**: each component measures its own text content and returns the height it actually used, so the caller chains `y += component(...) + gap` instead of hand-picking box heights. This was a deliberate fix for the exact class of bug Julia reported (oversized/mismatched containers).
- Content for all 8 decks was preserved by extracting the existing PPTs with `markitdown` before rebuilding the visual layer — no Indonesian-language instructional content was lost or rewritten, only the layout/styling.
- **Two real overflow/overlap bugs were caught and fixed during QA** (both were flaws in the line-height estimation formula shared by every component, not one-off mistakes):
  1. The estimator counted wrapped-line count from raw character length but ignored explicit `\n` line breaks in multi-line bullet text — an 8-item checklist was estimated at ~4 lines instead of 8, so a green callout box below it was positioned too high and visibly clipped the last items. Fixed by splitting on `\n` first, then estimating wrap-lines per hard line and summing.
  2. Even after that fix, actual LibreOffice/PowerPoint rendered line-height ran measurably taller than the naive `fontSize × lineSpacingMultiple / 72` formula the spec itself specifies — added an empirical ~18% safety buffer to the shared `heightFor()` used by every component (one card in M03 was still clipping its last bullet by about one line before this).
- Every one of the 37 slides across all 8 decks was rendered to an image (LibreOffice → PDF → `pdftoppm`) and visually inspected for overlap/overflow/clipping before pushing — including a second full pass after each of the two bug fixes above, per the spec's own QA guidance ("run full QA after every edit, not just the first build").
- M01's file was renamed from `K2-M1-preview.pptx` to `K2-M01-Role-Prompting.pptx` to match the M02–M08 naming convention.
- Pushed as commit `62e765d`. Verified via independent fresh clone + local mount `git reset --hard origin/main` sync (standing habit from checkpoint 12, continued).

**Mulai Claude (K1) Module 2 PPT + PDF built fresh** to close out the last item from checkpoint 12's open-tasks list: `mulai-claude-content.html`'s Module 2 lesson content was already fixed to R-K-T-F back in commit `112d6c8`, but the standalone slide deck and study-guide PDF for that module were still outstanding.
- **No prior version of either file existed anywhere in the git repo** — searched thoroughly, found nothing. Given how `admin.html`'s upload flow works (PPTs/PDFs go straight to Supabase Storage via `module_ppts`/`module_documents`/`course_resources`, never touching git), the old versions almost certainly only ever existed as direct admin-panel uploads, outside version control. Built new versions from scratch rather than editing anything.
- PPT built with the same `lib.js` component library as the K2 decks (added two new reusable components in the process: a purple-toned "tip" callout preset alongside the existing green "exercise" preset, and a "scenario list" component for stacked Buruk/Baik/Kenapa comparison cards — used for the module's 3-situation before/after examples). 6 slides: cover, 4-elemen-prompt overview, "kenapa prompt umum gagal" + framework tip, 3-situasi scenario comparison, ringkasan + kesalahan umum, latihan & output.
- PDF panduan built separately with WeasyPrint (HTML/CSS → PDF, `Liberation Sans` as the metric-compatible Helvetica/Arial substitute available in the build sandbox) rather than reportlab, deliberately matching the existing `K2-Produktivitas-Kantor.pdf`'s visual pattern (navy cover with a purple ring decoration, purple-pill module badge, left-purple-border callout boxes, matching header bar) for visual consistency across the two courses' study guides. 4 pages.
- Both saved to a new `K1-Mulai-Claude/M02-Anatomi-Prompt/` folder (mirrors the K2 per-module folder structure) as the git-tracked source of truth going forward. Pushed as commit `c5b5f31`.
- **Action needed from Julia**: since these can't be pushed into Supabase Storage directly (no write access to the live project), the new PPTX and PDF need to be manually uploaded through `admin.html`'s Module 2 PPT/document upload for the `mulai-claude` course, replacing whatever old (pre-R-K-T-F-fix) versions are currently live there.

**R-K-T-F standardization finished — 2 leftover mentions found and fixed**: while updating the lesson page, re-swept the repo for any remaining old-framework references and found two spots the original `112d6c8` fix had missed (it only touched the Module 2 content panel itself, not preview/nav copy elsewhere): `mulai-claude-content.html`'s sidebar module-list item title, and `mulai-claude.html`'s public module-preview card on the sales page — both still read "Prompt Anatomy — Konteks + Instruksi + Format" (the old K-I-F name). Both changed to "Prompt Anatomy — Role + Konteks + Tugas + Format". Re-swept the full repo afterward for any other `K-I-F`/`K-P-T-F`/`Konteks + Instruksi` patterns — none found. Commit `0f27436`.

**Commits this checkpoint**:
- `belajar-claude`: `23b631e` (save pptx style spec to repo root), `62e765d` (rebuild all 8 K2 module PPTs, fix real overflow bugs), `c5b5f31` (new Mulai Claude M02 PPT + PDF panduan), `0f27436` (fix 2 leftover K-I-F framework mentions).

---

## Checkpoint 14 (July 18, 2026) — Content & Marketing (K3) module plan documented, "build something real" artifact bonuses added to M3/M7/M9, Canva Connector scoped away from photo editing, Claude Free plan compatibility highlighted

> **⚠️ Superseded July 24, 2026 (Checkpoint 42)**: the course was restructured from 9 modules down to **7** — old M5 (WhatsApp) + M6 (Email) merged into one module, old M8 (Content OS) + M9 (Case Study capstone) merged into one module. The table below is the original 9-module plan, kept for historical record; see Checkpoint 42 for the current 7-module structure and mapping.

**Full 9-module structure of `content-marketing-content.html` (Content & Marketing / K3) recapped and documented** — persona "Dapur Rara" (fictional frozen-food UMKM) runs through all 9 modules + a feedback panel (10 total). Module-by-module plan:

| # | Module | Focus | Tool/Integration | Supporting File | Artifact/Output |
|---|--------|-------|-------------------|------------------|--------------------|
| 1 | Positioning & Analisis Kompetitor | SWOT + positioning statement | Claude Projects (persists into M2–M9) | `cm-template-kompetitor.txt` | Text: positioning sentence + SWOT |
| 2 | Deskripsi Produk Marketplace | SEO product listings | none | `cm-data-produk.csv` | Text: 5+ product descriptions |
| 3 | Sistem Konten Instagram | 30-day content calendar | Claude Artifacts (bonus) | `cm-kalender-konten.csv` | Spreadsheet + **bonus: HTML calendar dashboard** (checkboxes, progress bar) |
| 4 | Copy Iklan + Canva Connector | Ad copy + design | Canva Connector; remove.bg (non-Claude, photo edit) | none | Text (copy) + Canva design file |
| 5 | WhatsApp Business CS System | CS reply templates | Claude Project | `cm-template-wa.txt` | Text: 10 CS templates |
| 6 | Email & Promosi Bisnis | Launch/promo emails | Gmail Connector | `cm-template-email.txt` | Text: 2 email drafts (live in Gmail if connected) |
| 7 | Performance Marketing | ROAS-based ad decisions | Spreadsheet upload; Claude Artifacts (bonus) | `cm-performance-ads.xlsx` (3 sheets) | Text (recommendations) + **bonus: HTML ROAS dashboard** (color-coded, auto stop/scale/hold) |
| 8 | Content OS di Notion | Central marketing system tying M1–M7 together | Claude Projects + Notion | none | Notion workspace: 5 connected pages/databases |
| 9 | Case Study: Peluncuran Produk Baru | Capstone — 5-day launch using M1–M8 | Canva + Gmail + Notion (all reused) | `cm-m9-starter-peluncuran.txt` | Day-by-day outputs + time-saved recap table + **bonus: "Launch Command Center" HTML dashboard** combining positioning, calendar, ROAS table, and time-saved recap into 1 reusable file |

**Artifact-type assessment (why the bonuses were added)**: audited all 9 modules through an "is this a real produceable artifact or just prompt-and-paste text" lens. Verdict: modules 1, 2, 5, 6, 8, 9 were text/system output only; only M3 and M7 had natural "build a tool" potential (a calendar and a performance dashboard, respectively) that wasn't being used. Julia confirmed she wants the course to produce real things, not just chat/prompt output.

**M3 and M7 "Level Up" bonuses added** (commit `b6d022a`, done pre-checkpoint but included here for the full plan record): each gets a `.tip-box.connector` callout + a `.prompt-box` teaching students to ask Claude to turn their spreadsheet/calendar data into a standalone, reusable HTML tool (Claude Artifacts) — no coding required. Two real sample dashboards were hand-built and verified this session (`sample-kalender-konten-dashboard.html`, `sample-performance-dashboard.html`) using the actual course data files (`cm-kalender-konten.csv`, `cm-performance-ads.xlsx`) to confirm the prompts produce genuinely usable output before shipping the idea into the lesson content. Delivered to Julia via `present_files` and as live interactive chat previews (Playwright screenshot automation was attempted for a more rigorous headless-browser verification but blocked by the sandbox's network allowlist on `cdn.playwright.dev`).

**M4 scoped**: added a `.tip-box` clarifying Claude cannot edit photos directly (crop/retouch/background removal) — that work stays in Canva's own editor (or `remove.bg` for quick background removal). Claude's role in M4 is creative direction + copy, not pixel editing. Same commit `b6d022a`.

**M9 "Launch Command Center" bonus added** (commit `66cd616`): the capstone previously ended in a static time-saved recap table with no unifying artifact. Added a Level-Up bonus, placed right after the existing "Rekap: Waktu yang Dihemat" table (kept as a bonus alongside it, not a replacement), combining the M3 calendar concept and M7 dashboard concept plus the recap table into one prompt for a single reusable "Launch Command Center" HTML file. Exercise and Output-box text updated to reference it.

**Claude Free plan compatibility researched and highlighted directly in the lesson content** (commit `7870449`): confirmed via `support.claude.com` that Projects (5 on Free), Artifacts, file uploads, and *directory* connectors (Gmail, Canva, Notion — as opposed to *custom* connectors, which Free caps at 1) are all available on the Free plan. The only real constraint is Free's lower daily usage capacity ("Limited" vs Pro's "Standard"), which matters most on connector-heavy sessions like K3 M9. Added a one-line Free-plan note to each connector tip-box: K3 M4 (Canva), M6 (Gmail), M8 (Notion), a dedicated "💳 Paket Claude yang Dipakai" tip-box at the top of K3 M9, and K2 (Produktivitas Kantor) M3's existing Gmail Connector bonus box.

**K2 (Produktivitas Kantor) artifact assessment (research only, not yet acted on)**: audited `produktivitas-content.html`'s 8 modules (Role Prompting, Claude Projects, Gmail + Claude, Google Sheets + Claude, Batch Prompting, Prompt Chaining, Dokumen & Riset, Case Study). Unlike K3, **K2 has zero "build a tool" bonuses** — every module's output is text (email drafts, Sheets formulas/analysis, batch outputs, chained outputs, SWOT/SOP documents). Candidate spots for a similar Level-Up bonus, flagged but not yet built or approved: M4 (Google Sheets + Claude) could get an M7-style dashboard bonus from spreadsheet data; M8 (Case Study, the capstone) could get an M9-style combined "Daily Command Center" artifact. Awaiting Julia's direction before touching K2's content.

**Commits this checkpoint**:
- `belajar-claude`: `66cd616` (M9 Launch Command Center bonus), `7870449` (highlight Claude Free plan compatibility next to connector callouts in K2 and K3).

---

## Checkpoint 15 (July 18, 2026) — K2 (Produktivitas Kantor) brought up to parity with K3: 3 new supporting files, orphaned files surfaced, 6 artifact bonuses added to lesson content + PPTs, full study-guide PDF rebuilt

**Full re-audit of K2's existing supporting files found 2 were built but never wired into the lesson content**, caught after Julia flagged a file she saw in the folder that wasn't in the module recap table. Cross-referenced every file physically in `K2-Produktivitas/` against every filename mentioned in `produktivitas-content.html`:
- `M02-Claude-Projects/k2-m2-referensi-project.txt` — a complete example System Instructions doc (fictional agency "PT Kreatif Digital") — existed on disk, zero mentions in the lesson text.
- `M04-Google-Sheets/k2-claude-sheets-helper.js` — a real Google Apps Script adding a "Claude AI" menu to Sheets (5 functions: analyze selection, generate formula, summarize table, fill column, debug formula) — existed on disk, zero mentions in the lesson text. This was the closest thing K2 already had to a real "build something" artifact, and it was completely invisible to students.
- `M04-Google-Sheets/k2-data-latihan-sheets.csv` — exists, but the lesson's exercise text named a different, non-existent filename (`k2-data-penjualan.csv`). Fixed the text to match the real file.
- `M05-Batch-Prompting/k2-m5-latihan-batch.txt` — exists, correlates content-wise with the lesson's built-in examples but was never explicitly named/linked either.
- Caveat noted to Julia: the site also delivers files via a separate `doc-slot`/`module_documents` Supabase system driven by `admin.html` uploads, which isn't reachable from this session (different Supabase project than the live one) — so it's possible these were already attached as downloads there even though absent from the static HTML. Not confirmed either way.

**5 "build something real" artifact ideas brainstormed for K2** (mirroring the K3 M3/M7/M9 pattern, at Julia's request after the "just a dashboard, what else" prompt): Inbox Triage Board (M3), Batch Output Tracker (M5), Team Wiki (M7), Polished Document Output via native docx/pdf file creation (M6), Daily Command Center (M8, capstone). Confirmed via `support.claude.com` that all five run on the Free plan — Projects, Artifacts, directory connectors, and code execution/file creation (rolled out to Free Feb 2026) are all available Free-tier; only Free's lower daily usage cap is a constraint, not a feature gate.

**3 new supporting files built** (all pushed, none existed before):
- `M03-Gmail-Claude/k2-m3-contoh-inbox.txt` — 12 mock inbox emails (mixed complaint/reseller/supplier/payment types) for Inbox Triage Board practice without needing Gmail Connector set up.
- `M07-Dokumen-Riset/k2-m7-contoh-dokumen.txt` — 4-part bundle (meeting notes, a proposal to summarize, SWOT observations, a process to turn into an SOP) matching M7's 4 existing sub-skills, for Team Wiki practice.
- `M08-Case-Study/k2-m8-starter-hari-kerja.txt` — a full day's data bundle (emails, sales data, meeting notes, task list) mirroring Scenario A, for Daily Command Center practice.

**`produktivitas-content.html` updated** — same "Level Up" `.tip-box.connector` + `.prompt-box` pattern used in K3: M2 (links referensi file), M3 (Inbox Triage Board), M4 (fixed CSV filename reference, surfaced the Apps Script helper as its own bonus box, added Dashboard Performa Produk bonus), M5 (linked latihan-batch.txt in the exercise text, added Batch Output Tracker bonus), M6 (Polished Document Output — native docx/pdf file creation, no new supporting file needed), M7 (linked new contoh-dokumen.txt, added Team Wiki bonus), M8 (linked new starter file, added Daily Command Center bonus as the course's true capstone artifact). Integrity-checked (div/script tag balance, proper `</html>` ending) before push.

**All 7 affected PPTs (M02–M08) got a new bonus slide each**, built with the same `lib.js` component library from checkpoint 13 (still live in the build sandbox at `k2build/`, pptxgenjs + node_modules intact from the same session) — reused `addTipCallout` and `addCodeTemplateBox` for a consistent "Level Up" slide layout. All 8 new slides rendered via LibreOffice → PDF → image and visually inspected — no overflow/clipping.

**Full course-level PDF rebuilt from scratch**: the existing `K2-Produktivitas-Kantor.pdf` (27 pages) turned out to be ReportLab-built with no source file anywhere in the repo or sandbox — couldn't be edited, only replaced. Built a new 11-page WeasyPrint HTML/CSS version matching the established house style (navy cover with purple ring, purple-pill module badges, left-purple-border tip bars, dark code/template boxes) reused from the K1 M02 PDF template. Deliberately more concise than the original per-module deep-dives (1 page per module instead of 2-3) to keep the new "Level Up" bonus box visible on every module page without the guide ballooning past ~15 pages. Hit the same emoji-glyph rendering bug as the PPT work (📎/🛠️ rendered as `.notdef` tofu boxes in Liberation Sans) — stripped emoji from labels entirely rather than substituting a Unicode symbol this time, since plain text labels ("REFERENSI LENGKAP", "LEVEL UP: ...") read cleanly at this font size. All 11 pages rendered to image and visually inspected — clean.

**Action needed from Julia**: same as checkpoint 13's outstanding item — none of this can be pushed into Supabase Storage directly (no live-project write access from this session). The updated `K2-Produktivitas-Kantor.pdf`, the 7 updated PPTs, and the 3 new .txt supporting files all need manual re-upload via `admin.html` for the `produktivitas` course if the site actually serves downloadable module materials from Supabase Storage rather than (or in addition to) direct GitHub-repo links. Worth confirming which mechanism `admin.html` actually uses before re-uploading everything blind.

**Commits this checkpoint**:
- `belajar-claude`: `aca3192` (K2 artifact bonuses in lesson content + 3 new supporting files + M4 filename fix + surface Sheets helper), `cb02d11` (Level-Up bonus slides added to K2 M02-M08 PPTs), `5805dc3` (full K2 study guide PDF rebuilt with WeasyPrint, reflecting all bonuses).

---

## Checkpoint 16 (July 20, 2026) — K2 M1-M4 content-accuracy pass, admin page rebuilt as matrix table, M4 Sheets bonus swapped from paid API to free Apps Script, PPT↔HTML↔PDF wording consistency enforced across M1-M3, Admin nav link added

**New standing rule established this checkpoint (applies going forward to all K2/K3 work)**: the PPT deck is the wording *floor*, not the ceiling. Any fact, label, template, or number that appears in a module's PPT must also appear in that module's HTML lesson page and PDF source with **matching wording** — but HTML/PDF are free to (and should) carry additional context, worked examples, and depth that the PPT has no room for. When the three formats drift, the fix direction is "make HTML/PDF follow PPT's wording" for shared content, not the reverse — confirmed explicitly by Julia after an earlier attempt (this checkpoint) to instead edit PPT to match HTML's fuller wording was reverted back.

**Admin nav link added**: `index.html`'s account dropdown and `dashboard.html`'s sidebar both got a hidden "Admin" link, shown only when the logged-in session email is in `ADMIN_EMAILS` — `admin.html` existed and worked but had no discoverable entry point from the main site nav before this. Commit `92724ce`.

**`admin.html` fully redesigned from 4 separate upload forms into a matrix-table UI**: course tabs across the top, one row per named module (module titles now shown via a new `MODULE_TITLES` lookup instead of generic "Modul N"), columns for Video / PPT / Dokumen, click-a-cell-to-open-upload-modal interaction pattern. Validated with a Node+jsdom logic-level test harness (stubbed `sbClient`/`dataCache`, exercised every render path — tab switching, cell states, modal open/close, doc delete) since a real headless-browser screenshot wasn't available in the sandbox (`puppeteer install` failed — no network route to `storage.googleapis.com` to fetch Chromium). Commits `657f494` (module titles) + `5613365` (full matrix rewrite).

**K2 M4 Google Sheets bonus rebuilt end-to-end** — this was the most substantial content change this checkpoint, triggered by Julia asking for a free alternative to the existing bonus (`k2-claude-sheets-helper.js`, a Google Apps Script that called the paid Claude API directly, requiring students to bring their own API key and incur billing):
- Replaced with `k2-pdf-export-helper.js` — a genuinely free Apps Script (zero external API calls, only `SpreadsheetApp`/`DriveApp`/`UrlFetchApp`/`ScriptApp`) adding an "Export PDF" menu to Sheets: Rupiah number formatting, a report-header inserter, a simple column-chart builder, and PDF export of the active sheet or a selection. Old file deleted. Lesson content (HTML/PPT/PDF) rewritten to be explicit that **Claude generated this script via a shown prompt** (not a black-box tool) and to give numbered install steps (Extensions → Apps Script → paste → save → allow permissions). Commits `200cb21` (initial swap) + `9246eb8` (v1.1 enhancement: Rupiah formatting, header, chart).
- **Real data-accuracy bug caught while mocking up the exercise**: `k2-data-latihan-sheets.csv` (M4's practice file) contained employee salary/personal-info records — completely different from what the lesson describes (product sales data) and a direct contradiction of the module's own "data karyawan dengan info personal" privacy warning listed under *Hindari Dibagikan*. Rebuilt as proper 10-product sales data (Nama Produk/Jan/Feb/Mar/Target/Revenue Q1/Unit Terjual/Stok) matching the lesson's exact column references and reusing the "Kasual Studio" product line established elsewhere in the course. Commit `9246eb8`.
- **Real PPT bug caught via side-by-side screenshot comparison**: `build_m04.js`'s "Data Aman vs. Data Sensitif" slide had the shared `addCompareCards()` component's unconditional gray-vs-purple-highlight styling backwards — "Hindari Dibagikan" (bad data) was getting the purple highlight instead of "Aman Dibagikan" (good data), because the two argument objects were passed in the wrong order. Fixed by reordering the call-site arguments in `build_m04.js` only (scoped per Julia's "only update m4 for now"), not by adding conditional logic to the shared `lib.js` component, which would have silently affected every other module's deck. Commit `65513cd`.

**Rina-specific narrative claims removed from M1-M4 intros, replaced with generic framing**: across several rounds, every module's `module-desc-box` intro that opened with a fictional stat about "Rina" (Kasual Studio's persona) doing a specific task in a specific amount of time was found to either (a) not match the actual exercise mechanics, or (b) directly contradict another number stated later on the same page. Concrete cases fixed:
- **M1**: intro replaced with a generic explanation of *why* role prompting works (the "briefing a new colleague" analogy) instead of a Rina productivity claim. Commit `7420b86`.
- **M2**: intro replaced with generic chat-memory-vs-Projects framing; separately, the "Chat Biasa vs. Claude Projects" comparison cards and a "Contoh yang Bisa Disimpan di Project" chip row were found to have diverged from the PPT's wording — resynced to match exactly. Commit `18cbcd5`.
- **M3**: intro replaced with generic "why AI-assisted email replies save time" framing (no more "Rina has 15 emails a day" claim). The exercise itself was also reworked to actually use the module's existing (but previously unused in the main exercise) practice file `k2-m3-contoh-inbox.txt`. This module went through several consistency passes — see below.
- **M4**: intro's "6 bulan, 12 produk, 300+ transaksi" Rina claim was caught contradicting the module's own exercise text ("data penjualan 3 bulan terakhir") two paragraphs later — removed entirely in favor of generic Sheets+Claude framing rather than patched to match, since the specific numbers weren't load-bearing for anything else. Commit `65513cd`.

**M3 (Gmail + Claude) wording-consistency pass, multiple rounds** — this module had the most drift between its three formats and went through several corrections:
1. Synced the Workflow steps, "3 Elemen Wajib" framework, the 4 email templates (converted from hardcoded Kasual-Studio-specific example prompts to PPT's generic `[nama]`/`[topik]`/`[masalah]` placeholder templates), and the 6-item pre-send checklist to match PPT's exact wording (PPT's checklist included two items HTML was missing: a "not a Claude hallucination" check and a "no sensitive info pasted" check). Commit `47faffa`.
2. Per the new "PPT floor, HTML/PDF can add more" rule, added a "Contoh Pengisian" reference block (HTML + PDF only, not PPT) mapping each of the 4 generic templates to a specific real email number in `k2-m3-contoh-inbox.txt`, so the abstract placeholders have a concrete worked example without changing the templates' actual wording. Commit `8b92768`.
3. Reordered the module so the "Level Up: Inbox Triage Board" bonus (PPT's actual final slide) comes right after the core exercise, with the "Gmail Connector (MCP)" aside moved to the very bottom of the page — previously HTML had MCP before Level Up, PPT's structure implied the opposite. Also restructured the Level Up section into PPT's two-level heading pattern ("Bonus — Papan Prioritas..." sub-label + a "Kapan Dipakai" callout, rather than one merged box title). At this point the Latihan exercise's email count was also bumped from 1 to 3 (to match the Output box's "3 draft balasan" claim) and PPT's Contoh Prompt text was expanded to match HTML's fuller version. Commit `5ba2b76`.
4. **Reverted per Julia's explicit correction**: the direction in step 3 was backwards — PPT should not have been edited to match HTML. Reverted `build_m03.js` back to its original "pilih 1 email" wording and shorter Contoh Prompt text, rebuilt the PPTX, and instead brought HTML + PDF's Latihan/Output-box/Contoh-Prompt text down to match PPT's original (smaller) scope. This is the change that produced the standing rule stated at the top of this checkpoint. Commit `d0093d3`.

**GitHub PAT had to be re-supplied mid-session**: the sandbox environment reset partway through (no `.git-credentials`/`.netrc`/env var survived), so the previously-working push workflow silently had no stored token. Asked Julia for a fresh PAT and continued the same clone-to-`/tmp`-and-push pattern from there — same class of issue as prior checkpoints' "token rotated" notes, just from a sandbox reset rather than an actual GitHub-side expiry this time.

**⚠️ PDF binary is now stale relative to source, more than in past checkpoints**: `K2-Produktivitas-Kantor.pdf` was last regenerated and pushed at commit `106c327` (mid-checkpoint, covering the M1 exercise fix only). Every change after that — M2's comparison-card resync, all of M3's multiple rounds, M4's Sheets-bonus rebuild and Rina-intro removal — was made to the WeasyPrint HTML *source* (`k2_full_pdf.html`, sandbox-only, never committed per standing practice) and kept in wording parity with the live HTML, but **the PDF binary itself was deliberately not re-rendered**, per Julia's repeated explicit instruction to hold off until she asks. Do not assume the PDF Julia can currently download reflects any of this checkpoint's M2-M4 content changes — it doesn't, except for M1.

**Action needed from Julia**: (1) regenerate + push `K2-Produktivitas-Kantor.pdf` whenever ready — source is fully caught up, just needs the render step; (2) `k2-claude-sheets-helper.js` was deleted from the repo and replaced by `k2-pdf-export-helper.js` — if the old paid-API script was ever separately uploaded to Supabase Storage via `admin.html` for the `produktivitas` course M4 slot, that stale copy should be replaced with the new one so students don't find two conflicting versions; (3) same manual-reupload caveat as prior checkpoints applies to the rebuilt M2/M3/M4 PPTs and the updated `k2-data-latihan-sheets.csv` if `admin.html`'s Storage-backed delivery is in active use alongside (or instead of) direct repo/GitHub links.

**Commits this checkpoint**:
- `belajar-claude`: `66a611b` + `106c327` (M1 exercise-accuracy fixes, HTML+PPT+PDF, PDF binary regenerated), `efde739` (M2 exercise uses referensi file directly), `92724ce` (Admin nav link), `657f494` (admin module titles + M4 Pro-plan note), `5613365` (admin matrix-table redesign), `200cb21` + `9246eb8` (M4 Sheets helper swapped to free Apps Script, CSV data fix, script enhancement), `65513cd` (M4 Rina-intro removal + PPT compare-card color bug fix), `decff60` (M3 Rina-intro removal, MCP bonus shrink, exercise uses contoh-inbox file), `18cbcd5` (M2 PPT-wording sync), `7420b86` (M1 Rina-intro removal), `47faffa` (M3 PPT-wording sync: workflow/elements/templates/checklist), `8b92768` (M3 placeholder-mapping example, HTML+PDF only), `5ba2b76` (M3 Level Up restructure + PPT edited to match HTML — later reverted), `d0093d3` (M3 revert — PPT restored, HTML/PDF brought in line with PPT instead), `9f905e1` (M4 consistency+relevance pass: Sheets cards/section-titles/prompt-steps/bonus-openings synced to PPT, PPT filename bug fixed, helper script renamed .js→.txt with beginner install steps), `da84203` (checkpoint 17, described below).

---

## Checkpoint 17 (July 20, 2026)

**M4 renamed and restructured: "Google Sheets + Claude" → "Spreadsheet & Claude"**. After the checkpoint-16 consistency pass, Julia asked to broaden the module's scope to cover Excel alongside Google Sheets, and to redesign the case study around a more realistic dataset. This was a multi-round planning conversation ("dont build yet, tell me your plan") before any files were touched — final agreed scope below, all built and pushed in commit `da84203`.

**Scope decisions from the planning conversation** (for future reference if this module comes up again):
- Module renamed to **"Spreadsheet & Claude"** everywhere (sidebar nav, breadcrumb comment, `h1`, PPT cover/headers, PDF badge/title/label/footer, modlist + Peta Belajar entries in the PDF intro pages). The internal folder path `K2-Produktivitas/M04-Google-Sheets/` was deliberately **left unrenamed** — Julia confirmed "it's ok to keep as is" to avoid breaking any Storage/admin links.
- Module intro (`module-desc-box`) rewritten to explicitly frame Google Sheets and Excel as interchangeable for everything except 1 bonus (Apps Script, which is Sheets-only).
- Apps Script "Export PDF" bonus kept functionally unchanged (script itself untouched), but: (a) "100% Gratis" removed from its title/label in HTML, PDF, and PPT (the free/no-API-key explanation stays in body text and the separate "Soal Biaya" box), (b) "Automasi Workflow" added to the title (`Bonus — Automasi Workflow: Menu "Export PDF" di Google Sheets`), (c) a new line added explicitly flagging it as Google-Sheets-only with a pointer to ask Claude for a VBA-macro equivalent in Excel — no VBA script was actually built.
- "Claude in Chrome" bonus moved from its old spot (right after the Output box) to the bottom of the module (after the Level Up Dashboard section), downgraded from a `.tip-box.bonus` to a plain `.tip-box`, and its copy updated to mention Excel Online alongside Sheets.
- Level Up Dashboard bonus kept as a one-time/static snapshot — a live Google-Sheets-"Publish to web"-CSV-fetch version was discussed and explicitly deferred by Julia to a later course ("keep the live for later courses, for now maybe just drop excel sheet").

**Case study fully redesigned around a new dataset shape**: the old `k2-data-latihan-sheets.csv` was a 10-row pre-aggregated product-summary table (Produk × Jan/Feb/Mar/Target/Revenue/Units/Stok). Julia asked for something that "seems like an actual sales file" instead — regenerated as a **184-row transactional log** (`Tanggal, Order ID, Produk, Region, Sales, Qty, Harga Satuan, Total`), covering April 1 – July 19, 2026, 10 Kasual Studio linen-fashion products, 5 regions (Jabodetabek, Jawa Barat, Jawa Tengah & DIY, Jawa Timur, Luar Jawa), 3 sales/admin names (Sari, Dimas, Putri). Generated via a Python script with `assert Total == Qty * HargaSatuan` on every row, plus aggregate stats printed and spot-checked (e.g. top seller "Setelan Linen Two Piece" at Rp 12.375.000 total revenue — this exact figure was then used in the "Contoh Hasil" tip-box in HTML/PDF/PPT so the illustrative numbers are accurate, not made up).

**Alur Prompt (the 3-step prompt flow) rewritten** to (a) be generic — no "Rina, Kasual Studio" naming in the abstract template (previously present in both HTML's Step 2 body and PPT's sub-label) — and (b) match the new transactional data shape and add a genuinely new capability step:
1. **Formula** — SUMIF total revenue per Produk and per Region (previously: static Jan/Feb/Mar column sum).
2. **Analisis & Rekomendasi** (merged from the old separate "Analisis" + "Keputusan Bisnis" steps) — paste sample transactions, ask for top/bottom performers, trend, and a recommendation, all in one chat exchange.
3. **Bikin File Excel Ringkasan** (brand new) — ask Claude to produce an actual downloadable `.xlsx` summary file (multi-sheet: per-produk, per-region, insight/rekomendasi) using Claude's native file-creation capability. This is a new deliverable type for the module, distinct from both "formula in the sheet" and "HTML dashboard bonus."
The concrete Kasual Studio-specific worked example was moved out of the abstract Alur Prompt template and into the **Latihan** callout instead (which now describes the real CSV, its real column list, and the exact 3-step exercise flow using it) — this follows the same "generic template + concrete Latihan example" pattern established for M3 in checkpoint 16.

**Output box, Cara Pakai steps, and Level Up prompt all updated for the new data shape**: the Apps Script "Cara Pakai" section referenced a "Revenue Q1" column from the old CSV — updated to "kolom hasil SUMIF (Total Revenue per Produk)" since the new file has no pre-rolled-up revenue column. The Level Up Dashboard's example prompt referenced a "Stok" column (inventory) that doesn't exist in the new transactional file — rewritten to color-code by revenue relative to the average across products instead of a stock threshold.

**Stale content bug also fixed in the PDF source while in this section**: the PDF intro page's "Paket Claude yang Dibutuhkan" paragraph still referenced the old paid `k2-claude-sheets-helper.js` (deleted back in checkpoint 15/16, replaced by the free `k2-pdf-export-helper.txt`) as a second paid-plan exception alongside Claude in Chrome. This was stale — rewrote the paragraph down to the one real exception (Claude in Chrome, Pro+) and corrected the Apps Script bonus description to note it's free with no API key, matching current reality.

**All three formats rebuilt and visually verified**: HTML (div-balance-checked, 514/514, `</html>` intact), PDF source `k2_full_pdf.html` (div-balance-checked, 222/222), and `build_m04.js` rebuilt via `node build_m04.js` → LibreOffice → PDF → PNG, all 7 slides read back and visually confirmed clean (no text overflow, correct titles, "100% Gratis" absent, Claude in Chrome correctly repositioned to the last slide as a plain tip below the Level Up prompt box).

**Action needed from Julia**: same standing PDF-binary-staleness note as checkpoint 16 — `K2-Produktivitas-Kantor.pdf` still only reflects the M1 fix from commit `106c327`; this checkpoint's M4 changes (like all of checkpoint 16's M2/M3/M4 changes) are caught up in the WeasyPrint *source* only, not re-rendered, per standing instruction to hold off until asked.

**Commits this checkpoint**: `da84203` (M4: rename to Spreadsheet & Claude, Excel-aware intro, new transactional CSV, generic Alur Prompt + new Excel-file-output step, Latihan carries the concrete example, "100% Gratis" removed, "Automasi Workflow" added to Apps Script title, Claude in Chrome moved to bottom as plain tip, Apps Script labeled Sheets-only with VBA pointer, stale PDF-intro paid-script reference fixed, PPT rebuilt).

---

## Checkpoint 18 (July 20, 2026)

**Admin panel: added delete for Video/PPT cells + expanded Dokumen file types.** In the `admin.html` "Konten per Modul" matrix, Video and PPT cells only ever had "Ganti" (replace) — no way to remove an uploaded video link or PPT entirely. Docs already had a working "Hapus" (via `deleteDocModal`). Added `deleteVideoModal(moduleNum)` and `deletePptModal(moduleNum)`, wired to new red "Hapus" buttons next to "Ganti" in both cells (`renderMatrix()`). PPT delete also removes the file from the `course-ppts` storage bucket, via a new `extractStoragePath(publicUrl, bucket)` helper that parses the storage path out of the Supabase public URL (module_ppts has no stored `path` column like `module_documents.doc_path` does, so this was the only option without a schema change). Separately, Dokumen uploads were restricted to PDF/DOC/DOCX/MD only — expanded the `accept` attribute and the extension-validation array to also allow TXT, CSV, and XLSX. Commit `981912c`.

**Bug found and fixed: Hapus silently did nothing for Video/PPT.** After the above shipped, Julia reported the new Hapus buttons didn't work. Root cause: `module_videos` and `module_ppts` were created (in `sql/admin-content-setup.sql` and `sql/module-ppts-and-fix-uploads.sql` respectively) with RLS policies for SELECT/INSERT/UPDATE only — no DELETE policy was ever added for either table, unlike `module_documents` which has one ("admin delete module_documents"). With RLS enabled and no matching DELETE policy, Supabase/Postgres doesn't throw an error on delete — it just matches zero rows, so the button appeared to do nothing (no JS error, no console noise, just a no-op). Wrote `sql/fix-video-ppt-delete-policies.sql` adding the two missing DELETE policies (same email-allowlist pattern as the existing policies), pushed to the repo. Julia ran it manually in the Supabase Dashboard SQL Editor (project `ctqtdqbsucbhikwnagvl`) and confirmed it fixed the issue — no code changes were needed, `admin.html`'s delete logic was already correct.

**Note for future RLS-related admin features**: when adding delete (or any new operation) to a table that predates the feature, check whether a matching RLS policy actually exists before assuming a code bug — Supabase's default-deny-via-missing-policy behavior fails silently (0 rows affected, no error) rather than throwing, which makes it easy to mistake for a frontend bug.

**Commits this checkpoint**: `981912c` (admin.html: delete buttons for Video/PPT, TXT/CSV/XLSX added to Dokumen uploads), `f59ff9c` (sql/fix-video-ppt-delete-policies.sql — the actual fix, run manually by Julia in Supabase Dashboard).

---

## Checkpoint 19 (July 20, 2026)

**K2 M4 further restructured based on PPT review feedback.** Julia reviewed the rebuilt PPT from checkpoint 17 and flagged 5 issues, all fixed across HTML + PDF source + PPT (scope confirmed as "all 3 formats" via AskUserQuestion before starting):

1. **"This alur should be part of latihan"** — the standalone "Alur Prompt: Data → Keputusan" section (an abstract 3-step template) was a separate concept from the "Latihan" exercise that followed it, creating redundancy (the Latihan callout basically re-described the same 3 prompts in prose). Merged them into one section, **"Latihan — Langkah demi Langkah,"** across all 3 formats.
2. **"Be very clear, like download, then drag and drop excel file to claude"** — the merged Latihan now opens with a literal 3-card mechanical walkthrough before the prompts: (1) download `k2-data-latihan-sheets.csv`, (2) open claude.ai, drag & drop the CSV into the chat (or click the attach icon), (3) send the 3 prompts one at a time in the same chat (Claude retains context, no re-upload needed). The 3 prompts (Formula / Analisis & Rekomendasi / File Excel Ringkasan) follow directly, each in its own copyable prompt-box (HTML), codebox (PDF), or code-template block (PPT). A closing tip now explicitly distinguishes the two prompt outcomes: Prompt 1's formula must be copied manually into the user's own sheet, while Prompt 3 produces an actual downloadable `.xlsx` attachment in the chat.
3. **"No need this bonus here"** — PPT's old "Latihan & Output" slide had a small teaser paragraph pointing to the next slide's Apps Script bonus ("Untuk otomatisasi berulang... lihat detailnya di slide berikut"). Removed — HTML/PDF never had this teaser (they link to the bonus section directly), so this was PPT-only cleanup.
4. **"Remove level up dashboard section from this module"** — the "Level Up: Dashboard Performa Produk" section (HTML tip-box + prompt-section, PDF bonus block, PPT's 7th slide) was removed entirely from all 3 formats. The "Claude in Chrome" tip that had been living right after/inside that section was preserved and now sits at the very bottom of the module (after the Apps Script bonus content) in all 3 formats — HTML/PDF needed no repositioning since it was already the last block before nav; PPT's tip was moved onto the end of the Bonus slide (formerly its own final slide).
5. **"Apps script 1 2 3, it's not a step, that's the requirement for apps script, change the style"** — PPT's Bonus slide displayed the 3 Apps Script menu items ("Rapikan & Beri Judul" / "Buat Grafik" / "Export PDF") using the same numbered-circle `addStepRow` component used for genuine sequential-action flows elsewhere in the deck, which misleadingly implied "do this now, in this exact order" rather than "here's what the script's menu contains." Swapped to `addTierStrip` — a plain card style with no numbered badge — under a relabeled section heading "Yang Ada di Menu Export PDF (bukan langkah berurutan)." HTML/PDF's parallel content (`.step-row` numbered cards for "Cara Install — 6 Langkah" / "Cara Pakai — 4 Langkah") was left untouched since those genuinely are sequential user actions, not a menu-contents list — the critique was specific to PPT's condensed version.

**PPT slide count dropped from 7 to 6**: Cover, Yang Bisa Claude Bantu, Data Aman vs Sensitif, Latihan (Part 1: mechanics + Prompt 1 & 2), Latihan (Part 2: Prompt 3 + Tip + Output), Bonus (Apps Script + relocated Claude-in-Chrome tip). Rebuilt via `node build_m04.js`, LibreOffice-converted, all 6 slides rendered to PNG and visually verified clean — no overflow, tier-strip cards render without number badges as intended.

**HTML div-balance**: 510/510 (down from 514, net removal of content). **PDF source div-balance**: 217/217.

**Commits this checkpoint**: `0a9ec75` (produktivitas-content.html + K2-M04-Google-Sheets.pptx: merge Alur Prompt into Latihan with concrete steps, remove Level Up Dashboard, restyle Apps Script menu list, relocate Claude in Chrome tip). PDF source (`k2_full_pdf.html`) updated in sandbox only, per standing practice — not committed, kept in wording parity with HTML.

---

## Checkpoint 20 (July 21, 2026)

**Three separate pieces of work: M3 PPT file swap, a small M4 fact fix, and a full visual redesign of the K2 lesson page.**

1. **M3 PPT replaced with Julia's own file.** Julia edited `K2-M03-Gmail-Claude.pptx` locally and said "this is the latest file, please keep this file for m3" — pushed as-is, no content verification performed beyond confirming it's a valid, different pptx (`991eee8`).
2. **M4 fact fix.** Removed a stray "(bukan langkah berurutan)" parenthetical from a PPT section label, and added a factual note distinguishing **Claude in Chrome** (browser extension, works inside Google Sheets/Excel Online) from **Claude for Excel** (separate native Office add-in for Excel Desktop, installed via Microsoft Marketplace, also Pro+ only) — verified via web search against `support.claude.com` before writing the claim into course material. Applied to HTML + PDF source + PPT (new 7th PPT slide, split out to avoid text overflow). Commit `e4b0aff`.
3. **Full visual redesign of `produktivitas-content.html`.** Julia uploaded a new lesson-page mockup (purple/Inter design system: hero cards, kicker+heading sections, card-based components, dark "pro tip" panels). Standalone previews were built and approved for M4 and M2 first (`m4-preview.html`, `m2-preview.html` — sandbox only, never committed). Julia then asked to apply the new look to **all modules**, with an explicit constraint: **"dont change the context / wording yet, just the design and layout."**

   Given that constraint and the size of the file (8 modules + feedback panel, ~1570 lines), the redesign was implemented as a **CSS-only reskin plus one small structural addition**, not a full DOM rewrite:
   - Rewrote the shared `<style>` block: every existing CSS variable name and class name was kept exactly as-is (so `copyPrompt()`, `showModule()`, `showScenario()`, `markDone()`, and course-video.js's slot injection — all of which reference specific class/ID names and some of which write inline `style="...var(--accent)..."` — needed zero changes). Only the *values* changed: Inter font, purple `#6c4df6` accent, larger radii (14–18px), softer borders/shadows, bigger spacing. `.prompt-box`/`.prompt-label` were restyled (header-strip look) to visually match the mockup's "prompt-card" component without changing their DOM shape, so the copy button and `copyPrompt()`'s `.closest('.prompt-box')` lookup still work unmodified.
   - Added one new class, `.hero`, and wrapped `<h1 class="module-title">` + `<p class="module-subtitle">` + the `video-slot` div in it, in each of the 8 module panels (breadcrumb stays outside, matching the mockup). This is a markup change but touches zero text and zero JS-relevant IDs/classes (`video-slot-N` still found by `getElementById` regardless of parent).
   - Font import switched from Instrument Serif + Geist to Inter only.

   **Verification**: div-balance 518/518. CSS brace-balance 145/145. Programmatically diffed all visible text (tags/style/script stripped, whitespace-normalized) between the pre- and post-redesign file — **0 lines differed**, confirming no wording changed. The JS `<script>` block was byte-for-byte identical before and after. No live-render/screenshot QA was possible in this sandbox (no headless browser available), so the visual result hasn't been eyeballed by Claude — Julia should sanity-check it live.

**Commit this checkpoint**: `721b8f5` (produktivitas-content.html: redesign — purple/Inter visual system, hero cards, restyled components, no content changes).

**Still not covered by this reskin**: the feedback panel (panel9) and sidebar/topbar got CSS-only restyling (same IDs/classes), not the mockup's literal shell markup — acceptable since they're functionally driven by JS. The PDF source and PPTs were **not** touched by this redesign (it's HTML-only, purely visual).

---

## Checkpoint 21 (July 22, 2026)

**Follow-up bug fixes and structural refinement on top of Checkpoint 20's redesign, plus a real functional bug fix in M4's bonus Apps Script.**

1. **CSS bug: `.tip-box` missing left border.** Julia reported callout boxes looked "cut off on the left." First hypothesis (horizontal overflow from the new CSS Grid components at in-between viewport widths) was addressed defensively — `min-width:0` added to all grid/flex card children (`.learn-card`, `.install`, `.pro-tip-card`, `.info-card`, `.col-card`), and the grid-collapse breakpoint unified from 600px to 900px so it triggers before the sidebar hides at 768px (closing a pre-existing gap where 3-column grids could squeeze into a narrower pane). That fix was real but not the actual cause — Julia's next screenshot showed a normal-looking box, and she pointed out the literal missing left border. Root cause: `.tip-box{border:1px solid #ead9a8;border-left:0;...}` — a stray `border-left:0` left over from converting the old colored-left-accent tip-box style, which zeroed out that side of the shorthand border entirely. Removed. Both fixes pushed (`b22e601`, `1b833b7`).

2. **M4 ported to match `m4-preview.html`'s exact component set**, not just the general CSS reskin from Checkpoint 20: the 3-item info-grid ("Yang Bisa Claude Bantu di Spreadsheet") became a numbered `.learn-grid`; the Apps Script bonus box became `.bonus` with the corner "BONUS" tag; the 6-step "Cara Install" became a numbered `.install-grid`; the 4-step "Cara Pakai" became a `<details>` accordion (summary labels reuse exact quoted phrases already in the body text, e.g. `"1. Rapikan Angka (Rp)"`); the final Claude-in-Chrome/Claude-for-Excel tip became the dark two-card `.pro-tip-section` (card `<h4>` titles reuse exact product-name substrings already present — "Claude in Chrome", "Claude for Excel" — no invented wording). Verified via text-diff (tags/CSS/JS stripped) against the prior commit: only reused/split substrings and position numbers appeared as new "text," zero new sentences. Commit `484606e`.

3. **Same M4-style components extended to M3 and M7 wherever content genuinely matched the shape** (not forced everywhere — M1/M2/M5/M6/M8 don't have an install-list, accordion-worthy steps, or a standalone final tool-tip, so they were left as the Checkpoint 20 CSS reskin): M3's final "Bonus — Gmail Langsung dari Claude (MCP Connector)" tip-box → dark `.pro-tip-section` (single card, no grid needed), matching M4's treatment and dropping the redundant "🚀 Bonus —" prefix since the TIP badge already conveys it; M3's "3 Elemen Wajib Prompt Email" info-grid → `.learn-grid` reusing the existing A/B/C labels; M7's top overview info-grid → `.learn-grid` reusing the existing verbatim 01–04 labels (added a `.learn-grid.cols-4` modifier + matching responsive rules for the 4-item case). Commit `2907aeb`.

4. **Real functional bug in the M4 bonus Apps Script.** Julia tested `k2-pdf-export-helper.txt` live in Google Sheets and reported "Rapikan Angka doesn't work," "chart also not working," and asked to simplify from the original 3-format-menu + 2-export-menu + about-menu (6 items) down to just 2: (1) a formatting step, (2) export. Root cause of the failures was almost certainly the original design's reliance on the user manually pre-selecting the exact right range before running each of 3 separate menu items — easy to get wrong, silently produces no visible change if the selection doesn't line up. **Rewrote the script**: `onOpen()` now registers only 2 menu items — "1. Update Formatting" (auto-detects the table by reading the header row, finds columns literally named "Total" and "Harga Satuan," inserts/refreshes a title row, number-formats those columns as Rupiah, and applies a purple gradient **conditional formatting** rule to the Total column — replacing the old standalone, also-reportedly-broken chart feature) and "2. Export ke PDF" (unchanged export logic — was not reported broken). Removed `formatAsRupiah`, `addReportHeader`, `insertSimpleChart`, `exportSelection`, and `showAbout` as separate functions, consolidating the first two into `updateFormatting()`, which is idempotent (re-running it updates the existing title row and replaces any prior Total-column conditional-format rule rather than stacking duplicates). Verified syntactically via Node (`new Function(...)` parse check).
   Updated everywhere this script's behavior is described, to stay in sync: HTML's Bonus intro paragraph, the "Prompt yang Dipakai untuk Generate Script Ini" prompt-box (now asks for the 2-menu design), the "Cara Pakai" section (heading changed from "4 Langkah" to "2 Langkah," accordion collapsed to 2 items), and "Contoh Hasil" (dropped the now-nonexistent chart reference, added conditional-formatting mention). Same changes mirrored into the PDF source (`k2_full_pdf.html`, sandbox-only) and the PPT bonus slide (`build_m04.js`'s tierstrip, now 2 tiers instead of 3) — PPT rebuilt via `node build_m04.js`, LibreOffice-rendered, visually confirmed no overflow with the shorter 2-tier layout. Commits: `b1b6b4d` (HTML + .txt script), `1e92b9c` (rebuilt PPTX).

**Commits this checkpoint**: `b22e601`, `1b833b7`, `484606e`, `2907aeb`, `b1b6b4d`, `1e92b9c`.

---

## Checkpoint 22 (July 22, 2026)

**M4 Google-Drive-native-Sheet tip added (previously unrecorded), plus a full M5 (Batch Prompting) content review that surfaced and fixed two real inconsistencies.**

1. **M4: added a tip-box on saving Claude-generated files as native Google Sheets.** Julia asked whether Claude can produce a Google Sheet directly on Drive (not just an .xlsx) once Drive is connected. Initial web research (Anthropic's general connectors marketing page) suggested no — that page's disclaimer is about converting an *already-existing* xlsx in Drive. Julia then supplied two chat screenshots proving the opposite happens in practice. Reconciled by fetching two official support articles directly (`.../10166901-use-google-workspace-connectors`, `.../12111783-create-and-edit-files-with-claude`): with Drive connected AND "Code execution and file creation" enabled (on by default, Free/Pro/Max), Claude can save a generated file straight to Drive, and Drive's own upload-time auto-convert turns it into a native Sheet — a different, more capable path than the read-only disclaimer describes. Added a tip-box to M4 (HTML only, scoped to HTML+PDF per Julia's instruction, not PPT) explaining this. Commit `3996fcc`.

2. **M5 review surfaced two real problems, both fixed:**
   - **Named persona ("Rina") in the module-desc-box read oddly out of place** since M5's own 4 worked examples don't otherwise lean on the Rina/Kasual Studio narrative as heavily as M2-M4 do. Removed "Rina punya" framing from both the HTML intro box and the parallel PPT slide (`build_m05.js` line 31, which had the same phrasing) — reworded to a generic scenario statement. PDF source didn't have the Rina phrasing to begin with (already generic), so no change needed there. PPTX rebuilt via `node build_m05.js`, LibreOffice-rendered and visually confirmed no overflow.
   - **Supporting file's 4 practice sets didn't line up with the lesson's "4 Contoh Langsung Pakai."** Old file: A) caption/deskripsi (conflated two task types), B) ringkasan email, C) klasifikasi DM/WA, D) balasan email batch (no matching lesson example at all) — while the lesson's ④ "5 Variasi Caption dari 1 Konsep" had no corresponding practice set. Per Julia's direction, realigned to exactly 4, matching the lesson 1:1: **A) Deskripsi Produk** (rewritten to the Tokopedia name/deskripsi/highlight format, same 8 beverage-shop products, since "different business [persona] is fine" — full personal-name unification across modules wasn't requested), **B) Ringkasan Email** (unchanged), **C) Klasifikasi Pesan (DM/WA)** (kept at position C unchanged, since the module's Level Up bonus prompt references "Latihan C" by name — repositioning would have broken that cross-reference), **D) Variasi Caption dari 1 Konsep** (new — replaces the old "Balasan Email Batch," reuses one of Latihan A's own products for a single-concept 5-variation exercise, matching contoh ④'s exact instruction pattern). Updated the "4 set latihan: ..." description text in both `produktivitas-content.html` (line ~872) and the PDF source's filebox line to describe the new 4 sets; PPT's Latihan callout doesn't enumerate the sets by name, so needed no change there. Commit `867162f`.

3. **Verified all 8 modules share one identical design system**, not 8 separate ones: confirmed exactly one `<style>` block in the whole file, every shared component class (`.tip-box`, `.prompt-section`, `.case-box`, `.output-box`, `.section-heading`, `.hero`, `.nav-bottom`, `.module-desc-box`, `.mistake-list`, etc.) defined exactly once, and no inline style overrides using pre-reskin hardcoded colors. Confirmed for Julia that only M3/M4/M7 use the *extra* M4-style structural components (learn-grid, install-grid, pro-tip-section, details-accordion) because only their content naturally fits those shapes — M1/M2/M5/M6/M8 correctly don't have them, but every class they *do* use is pixel-identical to M4's version of the same class, since it's the same shared stylesheet.

4. **Nested double-box CSS bug found and fixed on all 5 "Latihan" boxes** (M1/M2/M3/M5/M6): `.case-box` was nested inside `.prompt-section`, and both had their own full border/background/radius — rendering as two overlapping rounded rectangles. Added `.prompt-section .case-box{background:transparent;border:0;border-radius:0;margin-top:0;padding:20px}` so the nested case-box becomes plain padded text (matching how `.prompt-box` already behaves when nested there). M2's standalone "Contoh Rina" case-box (not nested in a prompt-section) is unaffected. Commit `a3cf5c8`.

5. **Follow-up: lesson's Contoh #2 was still the old "Kategori Review Pelanggan," inconsistent with the just-realigned latihan file.** Julia's "use these 4: deskripsi, ringkasan email, DM/WA classification, variasi caption" instruction applied to the *lesson's* 4 Contoh Langsung Pakai too, not just the practice file — the PPT slide made this visible (still showed "Kategori Review" as card 2). Changed Contoh ② from review-sentiment classification (POSITIF/NEGATIF/NETRAL) to message classification (KOMPLAIN/PERTANYAAN/PUJIAN/PERMINTAAN + urgency), reusing Latihan C's actual sample messages for consistency. Updated in HTML, PPT (`build_m05.js`, rebuilt + LibreOffice-verified no overflow), and PDF source. Commit `ad8edbf`.

6. **M5 intro reworked, then re-synced across HTML/PPT/PDF after a Julia catch.** Julia asked to make the intro box more generic (drop the Tokopedia-specific framing) and fold the "Apa itu Batch Prompting?" definition into it as one combined introduction — done in HTML (commit `1fe233b`), and the now-redundant standalone "Apa itu Batch Prompting?" heading/body-text was removed since the intro box covers it. This was only applied to HTML at first; Julia caught that the PPT still had its old, separately-structured "Apa itu Batch Prompting?" slide (old definition wording + a leftover "20 produk → 5 menit" line sitting awkwardly below the template box). Fixed by rewriting the PPT slide's body text to the same merged wording used in HTML and removing the now-duplicate closing line, and updating the PDF source's matching body-text paragraph too, so all three now carry identical intro wording. PPT rebuilt, LibreOffice-rendered, visually confirmed clean. Commit `b7ce4ca`.

7. **M3's "Level Up" section was the only one with a redundant subtitle line.** All 5 modules with a Level Up bonus (M3, M5, M6, M7, M8) follow the same pattern in HTML: `section-heading` → one `tip-box` labeled "🛠️ Bonus: ...". M3 alone still had a leftover `.sub-heading` ("Bonus — Papan Prioritas, Bukan Cuma Draft Balasan") between the section-heading and the tip-box, plus a generic "🛠️ Kapan Dipakai" tip-label — a pre-reskin artifact. Removed the subtitle and merged its text into the tip-label ("🛠️ Bonus: Papan Prioritas, Bukan Cuma Draft Balasan"), matching the other four exactly. Made the same fix to the PDF source (dropped the compound blabel and the "Kapan dipakai:" prefix, which the other 4 modules' PDF entries never had either). Left the PPT untouched — checked it and every Level Up slide there (M3/M5/M6/M7) already uniformly uses a subtitle + "Kapan Dipakai" tip label, so it wasn't inconsistent to begin with; that's a PPT-specific layout convention, not a wording mismatch. Commit `5871eda`.

**Commits this checkpoint**: `867162f` (M5 Rina removal + latihan file realignment + PPT rebuild), `a3cf5c8` (Latihan double-box CSS fix), `ad8edbf` (Contoh #2 realignment to DM/WA classification), `1fe233b` (M5 intro merge, HTML), `b7ce4ca` (M5 intro merge synced to PPT + PDF), `5871eda` (M3 Level Up subtitle/label cleanup). Note: commit `3996fcc` (Google Drive tip) was made in the previous session but not recorded in CONTEXT.md until now.

8. **Two more real content bugs found via Julia's own reading, both fixed:** M5 Latihan B's instruction asked Claude to identify "siapa pengirim" (who the sender is) per email, but every one of the 7 practice emails just said generic "Klien" — no distinct sender existed to extract. Fixed by giving each email a distinct client business name (Toko Kopi Nusantara, Bengkel Motor Jaya, etc.). Then Julia caught a second, related problem: the email "content" in that same exercise was already a pre-compressed one-liner (e.g. "Klien tanya kapan presentasi bisa dijadwalkan..."), so the instruction "ringkas dalam 1 kalimat" had nothing left to actually summarize — output would just be a reformat of already-summarized input. Rewrote all 7 as realistic, verbose multi-sentence email bodies (greeting, rambling, closing) so the summarization exercise has genuine compression work to do. Commits `bd977ad`, `6d23d5f`. Confirmed neither fix touched HTML/PPT/PDF, since none of them quote this specific email content — they only reference the file generically.

9. **Full read-through verification of M1–M5 content, cross-checking HTML against the PDF source line by line.** Result: all 5 modules' wording already matches between HTML and PDF (differences are only the expected format adaptation — PDF flattens cards/grids into flowing prose, HTML keeps the card layout — never a factual contradiction). Additionally spot-checked specific numeric/factual claims against their real source data rather than trusting the prose: M3's "Contoh Pengisian" tip-box references specific email numbers/senders from `k2-m3-contoh-inbox.txt` (email #1 Dinda, #2 reseller.bdg, #3 Supplier Kain Jaya, #4 Sarah with exact Rp 245.000 figure) — confirmed byte-for-byte accurate against the actual file. M4's claimed "Rp 12.375.000" (top-selling product revenue), "~180 baris," and "April–Juli 2026" date range were all verified directly against `k2-data-latihan-sheets.csv` via a quick Python aggregation — all three checked out exactly. No fixes were needed from this pass; it surfaced zero new issues (the two real bugs found this session, items 8 above, were caught by Julia's own reading, not by this cross-check pass).

**Commits this checkpoint (9)**: none (research/verification only, no code changed).

---

## Checkpoint 24 (July 22, 2026)

**Payment-restructure research (Julia is considering per-course → one-time platform-wide access) plus a full M6 content/design pass, same treatment as M5's.**

1. **Payment restructuring research — plan documented, nothing built yet.** Julia is weighing a move from per-course payment to a single one-time payment granting access to every course. Researched the current architecture (Duitku gateway, `enrollments` table, the existing `paket-*` bundle-expansion precedent) via a subagent, then confirmed key facts directly against the **real production Supabase project** (`ctqtdqbsucbhikwnagvl`, "Belajar-Claude" — found via `list_projects` in the same org as a decoy "Personal" project that does *not* match the site's real architecture and should not be confused with it). Full plan — business decisions needed, backend/frontend/DB changes required, migration risk assessment — written into a new "PLANNED" section near the top of CONTEXT.md (not a numbered checkpoint, since nothing was implemented; explicitly marked not-to-build-without-go-ahead).
   **Separate, more urgent finding surfaced during this research**: the real `enrollments`, `profiles`, `module_completions`, and `waitlist` tables have RLS *enabled* but with a policy literally named "Allow all" (`USING (true)`, `WITH CHECK (true)`) — i.e. no actual protection. Since the anon key ships client-side, anyone could currently insert a fake paid enrollment via devtools. Confirmed real Supabase Auth is in use (`signInWithPassword`), so a proper per-user RLS policy is straightforward once Julia wants it done — flagged, not fixed (no schema change made without her go-ahead, per standing safety rule on database/security changes).

2. **M6 (Prompt Chaining) given the same review + fix pass as M5**, per Julia's explicit "apply the same feedback" request, confirmed before executing:
   - **Real content bug**: the "Apa itu Prompt Chaining?" info-grid had 3 of 4 cards all titled identically "Kapan dibutuhkan" (a copy-paste artifact — only the description text differed per card). Confirmed via the PPT/PDF sources that the intended structure was one shared "Kapan Dibutuhkan" heading over 3 distinct reasons, not 3 duplicate titles. Fixed by giving each its own short title (Output Kompleks / Tahapan Logis / Hasil Dangkal), reusing existing body text — no new wording invented.
   - **Structural**: "Ide Chain untuk Bisnismu" (4 short numbered ideas: Konten Bulanan, Laporan Performa, Onboarding Karyawan, Pitch atau Proposal) converted from `.info-grid` to `.learn-grid.cols-4`, matching M7's established precedent for this exact shape (short concept cards, not full prompt-boxes) — M1/M2/M5/M8 still correctly left as base classes since nothing in them matches this shape.
   - **Rina persona removed** from M6's module-desc-box intro and the "Contoh Nyata" section-heading (HTML + PDF), and from the PPT's section-label — mirroring the M5 fix. The worked-example prompts themselves still reference "Kasual Studio" as the business (a company name, not a person), which was already established as fine to keep.
   - **New house rule surfaced and applied**: Julia clarified that HTML and PDF should carry the *same depth* of content, while the PPT is allowed to be less detailed (fewer items) but whatever it does include must use the *same wording*, not a paraphrase. Applied here: restored dropped words in the PDF's "Ide Chain" line (`& finalisasi`, `Buat narasi`, `Pitch atau Proposal` instead of `Pitch/Proposal`) so PDF matches HTML's full depth; in the PPT (which still only lists 2 of the 4 ideas — accepted as "less deep"), fixed the wording of those 2 items to match HTML exactly (capitalization, restored dropped words) rather than adding the missing 2. Also fixed a genuine word-choice drift in the PPT's step titles ("Struktur Proposal" → "Kerangka Proposal", matching HTML/PDF's actual term) and a numeral inconsistency ("satu prompt" → "1 prompt"). PPTX rebuilt, LibreOffice-rendered, all 3 affected slides visually confirmed clean.

**Commits this checkpoint**: `2aa82df` (M6 HTML + PPTX: duplicate-label fix, learn-grid conversion, Rina removal, wording alignment). CONTEXT.md's new payment-plan section was pushed separately as `665073c`.

---

## Checkpoint 25 (July 22, 2026)

**M6 intro made generic + more introductory.** Julia flagged that M6's module-desc-box opened with "Butuh buat proposal kerjasama untuk reseller potensial di Bandung..." — jumping straight into the specific worked example instead of explaining the concept first (same class of issue fixed for M5 earlier). Fixed by folding the separate "Apa itu Prompt Chaining?" section (definition + the 4-reason "kapan dibutuhkan" info-grid) directly into the module-desc-box as a proper generic introduction, then reframing the Bandung reseller scenario as an illustrative "Contohnya:" example rather than the user's literal situation. The standalone "Apa itu Prompt Chaining?" heading/paragraph/info-grid was removed since its content now lives in the intro box (mirrors M5's precedent exactly). Propagated the same wording to the PDF's M6 intro paragraph (full depth match) and to the PPT's slide 2 body text + "Kapan Dibutuhkan" bullets (same wording, still condensed — no "Contohnya" comparison since slide 3 already covers that example in full). PPTX rebuilt and visually confirmed clean. Commit: `a93772d`.

**M8 (Case Study) hidden from the active lesson flow.** Julia is considering a separate future "case studies" section, so asked to remove M8 from the 7-module course while keeping its content intact for reuse — not deleting it. Scope, clarified via question before executing:
- `produktivitas-content.html`: sidebar `nav-mod8` (Case Study) entry removed; the Feedback panel renumbered from `panel9`/`nav-mod9` to `panel8`/`nav-mod8`. The old panel8's `id` changed to `panel-casestudy-archived` (breadcrumb also updated) — it's now unreachable via any `showModule()` call or sidebar link, but every bit of its content (both Rina/Budi scenarios, all prompts) is untouched in the file for future reuse. The "Kursus Selesai!" completion banner + "Lanjutkan Belajar → Content Marketing" cross-sell card, which used to live at the end of panel8, was moved to the end of panel7 (now the last active module) with its text updated from "menguasai 8 modul" to "menguasai 7 modul" and its "Beri Feedback →" button retargeted to the renumbered feedback panel. JS constants `TOTAL` (9→8) and `CONTENT_MODULES` (8→7) updated; all `nav-counter` labels and the sidebar progress label changed from "/8" to "/7"; the hardcoded module-8 safety-net in `submitFeedback()` genericized to use `CONTENT_MODULES` instead of a literal `8`. Div balance verified (519 open / 519 close) after all edits.
- `produktivitas.html` (sales page): "8 Modul" → "7 Modul" (hero tag + curriculum heading), the module-08 Case Study curriculum card removed, "8 Workflow Skill Praktis" → "7 Workflow Skill Praktis" with the tied-to-case-study "Workflow Integration" skill card removed to match.
- `dashboard.html`: `produktivitas` course entry `modules:8` → `modules:7`.
- `admin.html`: `produktivitas` course entry `modules: 8` → `7`; "Case Study" removed from the `MODULE_TITLES.produktivitas` array (now 7 items, matching the count).
- The M8 PPT file (`K2-M08-Case-Study.pptx`) was left untouched — not referenced by any of the above, so no action needed there.
- Repo-wide grep confirmed no remaining "8 Modul"/"Modul 8"/"modules: 8"/"CONTENT_MODULES = 8"/"TOTAL = 9" stray references across all 4 edited files after the change.

**Commits this checkpoint**: `a93772d` (M6 intro), plus one commit covering all 4 M8-restructure files (`produktivitas-content.html`, `produktivitas.html`, `dashboard.html`, `admin.html`).

---

## Checkpoint 26 (July 22, 2026)

**M7 reviewed** (Dokumen & Riset): 4 sub-skills (Meeting Notes, Summarizing, Riset & SWOT, SOP Writing) + Level Up (Team Wiki). Confirmed it's fine for M7 to have a different structure than other modules — no unified "📝 Latihan" case-box was added, since Julia was okay leaving that as-is (the PPT already has its own explicit Latihan slide; HTML/PDF intentionally stay example-driven).

**Found and fixed a real content mismatch**: the supporting file `k2-m7-contoh-dokumen.txt`'s Bagian 4 (meant for the SOP Writing sub-skill) described a customer-complaint-handling process, while the worked SOP example baked into HTML, PDF, and PPT is entirely about packing pesanan. Fixed by rewriting Bagian 4 to describe the packing process instead, matching the established example across all 3 formats.

**Added a new "SWOT → Slide Presentasi" section** to M7, per Julia's idea to add PowerPoint/Google Slides content: positioned right after the "03 — Riset & Analisis (SWOT)" sub-skill (reusing the same tas-kanvas SWOT example, no new file needed). Teaches asking Claude to turn a completed SWOT/summary into an actual `.pptx` file (mirroring M6's Level Up pattern of "Claude bisa membuat Word/PDF asli"), with a fallback tip noting the same prompt also works as a plain-text slide outline if file creation isn't available. Added to HTML (new section-heading + tip-box + prompt-section + tip-box + output-box), PDF (matching codebox/tipbar/callout), and PPT (new slide inserted between the SWOT/SOP compare-cards slide and the Latihan & Output slide; the Latihan slide's SWOT bullet also updated to mention "lalu ubah jadi slide presentasi"). Module subtitle/time estimate bumped 15→18 menit in HTML and PDF to reflect the added content. Learn-grid card 03's description lightly extended ("...siap jadi slide presentasi"). PPTX rebuilt (now 8 slides, was 7) and visually confirmed clean via LibreOffice render. Div balance verified (530/530) after HTML edits.

**Commits this checkpoint**: one commit covering `produktivitas-content.html`, `K2-Produktivitas/M07-Dokumen-Riset/k2-m7-contoh-dokumen.txt`, and `K2-Produktivitas/M07-Dokumen-Riset/K2-M07-Dokumen-Riset.pptx`.

---

## Checkpoint 27 (July 22, 2026)

**House rule clarified and applied strictly**: Julia clarified the HTML/PDF/PPT depth rule precisely — HTML and PDF must be *identical* (not just "same depth"), PPT may simplify but must use consistent wording (not paraphrase) for whatever it does include, and every fact/claim that appears in PPT must also be covered somewhere in HTML/PDF.

**Full M7 HTML↔PDF harmonization pass** (found via a line-by-line cross-check requested by Julia, using a script to diff normalized text of the two versions side by side):
- Intro paragraph: PDF was a thin 1-sentence summary; rewritten to be byte-identical to HTML's full 3-example version (rapat 1 jam, dokumen 15 halaman, SOP tidak ditulis), plus added a new closing clause to *both* HTML and PDF ("bukan karena Claude berpikir untuk kamu, tapi karena Claude membantu menstrukturkan dan mengeksekusi prosesnya") to cover a claim that previously existed only in the PPT's slide 2, per the "all PPT info must be covered in HTML/PDF" rule.
- Section 03 (SWOT) tip-box: added an identical sentence to both HTML and PDF about "competitive brief" as an alternative deliverable — this fact previously existed only in the PPT (slide 5) and was missing from HTML/PDF entirely.
- Section 01 Tips: PDF was missing HTML's third sentence ("Minta Claude kirim ulang dalam format 'siap dishare ke tim' kalau perlu") — added.
- Section 02 "4 Variasi Siap Pakai": all 4 quotes had drifted between HTML and PDF (dropped clauses, one item reworded outright) — PDF rewritten to match HTML word-for-word.
- Section 02 Output: HTML said "confident" (English), PDF said "percaya diri" — standardized to "percaya diri" in HTML to match PDF and the site's Indonesian-language convention.
- Section 03 SWOT prompt: PDF's bracketed placeholder hints had drifted from HTML's wording (dropped "yang kamu..." phrasing throughout) — PDF rewritten to match HTML exactly.
- Section 04 SOP prompt: PDF was missing several concrete details HTML has ("(tidak ada cacat, warna sesuai)", "untuk produk yang mudah kusut", "pembelian"/"kecil", "dengan lakban bening") — PDF rewritten to full HTML detail.
- "Proses Lain yang Bisa Didokumentasikan": PDF listed only names with no descriptions; HTML's 4 info-cards each have a description — PDF rewritten to include all 4 descriptions.
- PDF's rollup callout ("■ Output per Sub-skill") was stale after the SWOT→Slide addition (checkpoint 26) — added "1 slide deck presentasi" to the list.
- Level Up: Team Wiki bonus paragraph had drifted into a differently-worded paraphrase in PDF — rewritten to match HTML's tip-box text exactly.
- One accepted structural asymmetry, flagged rather than silently resolved: PDF's single combined "■ Output per Sub-skill" rollup line has no direct HTML equivalent — HTML instead conveys the same information via 5 separate per-section output-boxes throughout the module. Judged acceptable since no information is actually missing from HTML, only organized differently (same precedent as the `filebox` vs `tip-box` pattern). Flagged to Julia for override if she disagrees.
- Confirmed the PPT's consolidated "Latihan & Output" slide (which HTML/PDF don't have as a single element) is an accepted, Julia-approved structural difference — not something needing to be added to HTML/PDF.

No PPT changes needed this checkpoint — the two previously PPT-only facts are now also covered in HTML/PDF, and all other wording differences in the PPT were confirmed to be acceptable simplifications of content already present in HTML/PDF, not new information.

**Commits this checkpoint**: one commit covering `produktivitas-content.html` (3 small text additions/fixes). The `k2_full_pdf.html` and `build_m07.js` files live only in the sandbox `outputs/k2build/` working directory (never committed to git, per established project convention), so this checkpoint's PDF/PPT-source fixes aren't tracked in git history beyond this note.

---

## Checkpoint 28 (July 22, 2026)

**Fixed an inaccurate product claim in M7.** The SWOT section's "Yang Perlu Dipahami" tip-box (HTML/PDF) and the PPT's "Riset & SWOT" compare-card both said "Claude tidak punya akses ke data pasar terkini" / "Claude tidak browsing internet real-time" — Julia flagged this is misleading since Claude does have web search capability. Reworded to drop the capability claim entirely and instead make the actually durable teaching point: your own first-hand observations (competitor prices you've seen, customer feedback, market signals specific to your business) produce sharper analysis than generic search results, regardless of what Claude can or can't browse. New wording applied identically to HTML and PDF, and condensed consistently into the PPT card. PPTX rebuilt and visually confirmed clean.

**Commits this checkpoint**: one commit covering `produktivitas-content.html` and `K2-Produktivitas/M07-Dokumen-Riset/K2-M07-Dokumen-Riset.pptx`.

---

## Checkpoint 29 (July 22, 2026)

**Added a new "Perkuat Riset dengan Web Search" section to M7**, following directly from the prior checkpoint's fix (removing the inaccurate "Claude can't browse the internet" claim) — Julia asked to also show what Claude *can* do for research now that the module is specifically about Dokumen & Riset. Positioned between the SWOT sub-skill and the "SWOT → Slide Presentasi" section, so the flow is: bring your own observations → optionally enrich with web search → turn the finished SWOT into slides.

Content: a "Kapan Dipakai" tip (your own observations are still sharpest for business-specific detail, web search fills in general market/competitor context you might not have), a worked prompt reusing the same "tas kanvas" / "Kanvas Kita" / "Totewear.id" example already established in the module and its supporting file, a caveat tip (web search complements but doesn't replace direct observation, with a manual-search fallback for accounts without web search), and an output description. Added identically to HTML and PDF (verified via script — 7 key phrases present in both), plus a matching new PPT slide (now 9 slides, was 8) — visually confirmed clean via LibreOffice render. Learn-grid card 03 and the module time estimate (18→20 menit) updated in both HTML and PDF to reflect the addition. Div balance verified (541/541).

**Supporting file checked, no changes needed**: `k2-m7-contoh-dokumen.txt`'s Bagian 3 (SWOT observations) already contains the exact competitor names ("Kanvas Kita," "Totewear.id") the new prompt references — the web-search step builds directly on existing file content rather than requiring new data.

**Commits this checkpoint**: one commit covering `produktivitas-content.html` and `K2-Produktivitas/M07-Dokumen-Riset/K2-M07-Dokumen-Riset.pptx`.

---

## Checkpoint 30 (July 23, 2026)

**Plan-requirement claims verified against current Anthropic documentation.** Julia asked for a check of any "requires Pro plan" type claims across K2. Researched via support.claude.com: web search, file creation (.docx/.pptx/.pdf/.xlsx), Claude Projects, and connectors are all confirmed available on the Free plan today (Pro only raises usage limits) — so the course's blanket claim ("hampir seluruh panduan ini... jalan penuh di paket Claude Free") is accurate. Separately confirmed "Claude in Chrome" and "Claude for Excel" (both bonus items in M4) genuinely do require Pro or higher — also correctly stated. No changes needed to the core claims; they check out.

**Found and fixed stale content in the PDF-only source** (`k2_full_pdf.html`, sandbox-only, never committed to git) that was missed during the M8-restructure work (checkpoint 25): the front-matter overview still described the old 8-module structure — "Modul 8 menggabungkan semuanya dalam satu hari kerja nyata" in the intro paragraph, "M08 Case Study" in both the cover-page table of contents and the "Peta Belajar" roadmap, and a live Modul 08 page still presented as an active, counted module. Fixed: intro paragraph now ends at Modul 7 ("sekaligus penutup kursus"), M08 removed from the cover TOC and roadmap list, and the M08 page itself is kept (per "preserve the content" precedent from checkpoint 25) but now marked with an explicit archival HTML comment mirroring `produktivitas-content.html`'s `panel-casestudy-archived` treatment — present in the file, not counted anywhere as part of the active 7 modules. Also corrected the Pro-plan disclaimer from "1 pengecualian" to "2 pengecualian" since M4 actually has two separate Pro-gated bonus tools (Claude in Chrome *and* Claude for Excel), not one. Per Julia's instruction, actual PDF regeneration/rendering is deferred — only the underlying content was brought back in sync with the live site.

**Design-system consistency re-audited across all panels** after the recent M6/M7 additions: confirmed structurally (via a script counting component-class usage per panel) that every module uses only the shared, single-stylesheet component classes (`tip-box`, `prompt-section`, `output-box`, `section-heading`, `learn-grid`, `info-grid`, etc.) — no new/one-off classes were introduced by the M6 intro rewrite or M7's two new sections (SWOT→Slide, web search). `learn-grid` usage confirmed present in M3, M4, M6, M7 (modules where a multi-skill overview grid fits the content) and correctly absent from M1, M2, M5, and the archived M8 panel — consistent with the established pattern from earlier checkpoints.

**M7 PPTX: local file adopted as canonical**, per Julia's instruction. The working-tree copy in `K2-Produktivitas/M07-Dokumen-Riset/K2-M07-Dokumen-Riset.pptx` had diverged from the last sandbox-built/pushed version (different file size/hash, most likely from PowerPoint recompacting the file when opened locally). Extracted and checked all 9 slides' text via python-pptx to confirm the content is identical to what was built in checkpoint 29 (includes "Perkuat Riset dengan Web Search" and "SWOT → Slide Presentasi" in the correct order) — no content was lost. This local version is now committed as the source of truth going forward; the sandbox `outputs/k2build/` copy is no longer authoritative for M7.

**Commits this checkpoint**: one commit covering `CONTEXT.md` and the M7 PPTX (local version). The PDF-source fixes live only in the sandbox working directory per established convention and aren't tracked in git.

---

## Checkpoint 31 (July 23, 2026) — CONTEXT.md accuracy pass

Julia asked for the overall CONTEXT.md to be brought up to date. Did a targeted pass rather than a full rewrite (the file is a chronological log — old checkpoints stay as accurate records of their own time, not something to retroactively rewrite):

- **Fixed genuinely stale "current state" references** (as opposed to dated historical narrative): the "Pages & Their Purpose" table's entries for `produktivitas.html` and `produktivitas-content.html` still said "8 modules" with no date qualifier — these read as living reference docs, not history, so they were wrong as of today. Updated both to "7 modules" with a pointer to Checkpoint 25 (the M8 archival).
- **Added a superseded-notice banner** to the original "produktivitas-content.html — K2 course (July 14, 2026)" section, which documents the course's original 8-module build in detail (`TOTAL=9`/`CONTENT_MODULES=8` constants, full module list) — left the historical content intact (accurate for July 14) but flagged at the top that it's superseded by Checkpoint 25, so a future reader doesn't mistake it for current state.
- **Left dated historical mentions of "8 modules" alone** (checkpoints 7, 14, 16, 22, and the artifact-assessment note) — each is clearly timestamped narrative describing what was true *at that point in the project*, and checkpoint 25 already documents the change; adding a correction footnote to every single one would clutter the log without adding real accuracy, since the chronological structure itself makes clear which checkpoint is most recent.
- **Verified `index.html` has no stale module-count text** — checkpoint 12 already removed the modul-count/duration meta row from all course cards site-wide, so there was nothing to fix there.
- **Confirmed all of this session's checkpoints (24–30) are present and in order** in the log, covering: M6 intro rewrite, the M8 archival, three rounds of M7 additions (SWOT→Slide, HTML/PDF harmonization, the web-browsing-claim fix, the web-search section), and the Pro-plan/PDF-sync/design-audit/PPTX-adoption pass.

No code files changed this checkpoint — CONTEXT.md only.

**Commits this checkpoint**: one commit covering `CONTEXT.md`.
