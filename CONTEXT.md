# Belajar Claude — Project Context & Checkpoint
_Last updated: July 14, 2026 (checkpoint 6)_

## What is Belajar Claude
Indonesian-language Claude AI learning platform (formerly Klaud.id). Users sign up, enroll in courses, complete modules, and earn badges. Being migrated from GitHub Pages to **Vercel** (belajarclaude.id).

---

## Tech Stack
- **Frontend**: Plain HTML/CSS/JS (no framework)
- **Backend**: Supabase (auth, database, RLS)
- **Config**: `supabase-config.js` — shared across all pages
- **Hosting**: Vercel (migrating to `belajarclaude.id`; previously GitHub Pages)
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
| `enrollments` | email, course_slug, type (free/paid), enrolled_at | Auto-enroll to `prompt-gratis` on login |
| `module_completions` | email, course_slug, module_num | Tracks per-module progress |
| `course_feedback` | email, course_slug, rating (1-5), comment | Unique per email+course |
| `waitlist` | email, course_slug | "Beritahu saya" signups for coming-soon courses |
| `course_resources` | course_slug (PK), pdf_url, pdf_label, updated_by | Admin-managed PDF resource per course |
| `module_videos` | course_slug, module_num (PK), video_url, updated_by | Admin-managed video per course module |
| `module_documents` | id (PK), course_slug, module_num, doc_url, doc_path, doc_label | Admin-managed practice-session document(s) per module — multiple allowed |

---

## Pages & Their Purpose

### Marketing / Sales
| File | Purpose |
|------|---------|
| `index.html` | Landing page — hero, jalur belajar grid, course carousel, CTA |
| `mulai-claude.html` | Sales page for "Mulai dengan Claude AI" (free) |
| `produktivitas.html` | Sales page — K2 · Produktivitas Kantor — Rp 149K (8 modules) |
| `kerja-sehari-hari.html` | DELETED from repo (July 14, 2026) |
| `bisnis-ukm.html` | Sales page — Rp 149K |
| `prompt-gratis.html` | Sales page for free prompt guide |
| `kursus-karyawan.html` | Jalur Profesional page |
| `kursus-mahasiswa.html` | Jalur Mahasiswa page |
| `kursus-ukm.html` | Jalur UKM page |
| `paket.html` | Pricing/packages page |
| `paket-content-creator.html` | Paket Content Creator page |
| `coaching-1on1.html` | 1-on-1 coaching page |
| `workshop-zoom.html` | Workshop page |
| `coming-soon.html` | Placeholder for unreleased courses |

### App
| File | Purpose |
|------|---------|
| `login.html` | Auth page — email + password (Masuk / Daftar tabs + Lupa password? view). Replaced magic link July 11, 2026. |
| `reset-password.html` | Password recovery page — handles both PKCE (`?code=` in URL) and implicit (`#access_token`) flows. Calls `updateUser({ password })`. Added + fixed July 11, 2026. |
| `dashboard.html` | Main user dashboard |
| `prompt-gratis-content.html` | Course reader — 5 modules + feedback panel |
| `mulai-claude-content.html` | Course reader — 6 modules + feedback panel |
| `produktivitas-content.html` | Course reader — K2, 8 modules + feedback panel (COURSE_SLUG='produktivitas') |
| `kerja-sehari-hari-content.html` | DELETED from repo (July 14, 2026) |
| `bisnis-ukm-content.html` | Course reader — 6 modules + feedback panel |
| `payment-success.html` | Post-payment confirmation |
| `admin.html` | Admin-only content manager — upload course PDFs + per-module videos to Supabase Storage. Gated to `julia.utomo@gmail.com` / `tiffany.utomo@gmail.com` via session email check. Linked from a hidden "Admin" nav item on `prompt-gratis.html` (shown only to those emails). |

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
New content page for the upgraded K2 course. Created from `K2-Produktivitas/K2-improved-content.md`. Key constants:
```javascript
const TOTAL = 9;           // 8 content panels + 1 feedback
const CONTENT_MODULES = 8;
const COURSE_SLUG = 'produktivitas';
```
**8 modules**: M01 Role Prompting → M02 Claude Projects → M03 Gmail+Claude → M04 Google Sheets → M05 Batch Prompting → M06 Prompt Chaining → M07 Dokumen & Riset → M08 Case Study (Satu Hari dengan Claude). Personas used throughout: Rina (UMKM fashion "Kasual Studio") and Budi (konsultan freelance). M08 includes completion badge + "Lanjutkan Belajar" card linking to `bisnis-ukm.html`. 30+ copyable prompt boxes with Salin/copy buttons.

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

**Supabase MCP note**: MCP is connected to `pyuvofppbfuytkcazgwh` ("Personal"), NOT the live project `ctqtdqbsucbhikwnagvl`. The live project is owned by a different account — MCP cannot query it. Use Supabase dashboard directly for DB queries on the live project.

**Backend (index.js) NOT yet updated** — still has `kerja-sehari-hari` as K2 slug. Needs to be updated to `produktivitas` for the payment webhook to enroll correctly.

### bisnis-ukm-content.html — rewritten per K3 PDF, July 2026
All 6 content panels rewritten to follow the uploaded PDF "K3 · Konten & Pemasaran Bisnis" (course "Claude untuk Bisnis & UKM"), replacing the old generic per-tool tutorials. Panel count/TOTAL unchanged (already 7 = 6 content + feedback), just content + order + sidebar titles replaced.
- **New module order/titles**: 1) Analisis Kompetitor & Positioning, 2) Deskripsi Produk & Listing yang Menjual, 3) Sistem Konten Instagram, 4) Iklan & Promosi: Claude Tulis, Kamu Design, 5) Template CS WhatsApp yang On-Brand, 6) Content Operating System di Notion (capstone — carries the "Kursus Selesai!" box + "Lanjutkan Belajar" next-card, nav-bottom jumps to `showModule(7)`).
- **Throughline**: Modul 1 produces a one-sentence "positioning" that every subsequent module explicitly reuses (listing copy, IG captions, ad copy, CS tone, Notion calendar) — this is the PDF's core structure, "Satu Positioning, Enam Kanal."
- Same CSS box vocabulary as `mulai-claude-content.html` was added to this file (`.tip-box`, `.tip-box.warn` + `.mistake-list`, `.two-col`/`.col-card`, `.info-grid`/`.info-card`, `.step-row`/`.step-card`, `.section-heading`, `.body-text`), but tuned to this file's existing palette: `.tip-box` uses accent purple (this file's pre-existing `.case-box` already occupied gold, used for "Contoh Skenario"/example callouts, left as-is).
- Sidebar tool chips updated to match the PDF's tool list exactly: Tokopedia/Shopee, Notion, WhatsApp Business, Instagram, Canva.
- `admin.html` already had `bisnis-ukm: modules: 6` configured — no change needed there.

---

## Admin Content Manager (admin.html) — added July 2026 (live, verified working)
- **Access**: gated to `julia.utomo@gmail.com` and `tiffany.utomo@gmail.com` only, checked client-side against the Supabase session email (`ADMIN_EMAILS` array in `admin.html` and in the nav script of `prompt-gratis.html`). Not logged in → prompt to log in. Logged in but not an admin email → "Akses ditolak".
- **Entry point**: hidden "Admin" link in `prompt-gratis.html` nav, shown only when the logged-in session email matches an admin email.
- **PDF upload**: pick a course → upload a PDF → stored in the `course-pdfs` Supabase Storage bucket, public URL saved to `course_resources` (one row per `course_slug`, upsert). Content pages show a "📄 Unduh [filename]" link in the sidebar (`#pdf-download-slot`) via `course-video.js` if a resource exists for that course.
- **Video (YouTube link)**: pick a course + module number → paste a YouTube URL (watch/share/shorts/embed formats all work) → the raw URL is upserted straight into `module_videos` (`course_slug` + `module_num`), no file upload / storage bucket involved. `extractYoutubeId()` (duplicated in `admin.html` and `course-video.js`) pulls the 11-char video ID via regex. Content pages render a responsive 16:9 YouTube `<iframe>` embed at the very top of the matching module panel — above the breadcrumb/title, not after the subtitle — via `#video-slot-N` populated by `course-video.js`. If a saved `video_url` isn't recognizable as YouTube, it falls back to a plain "▶ Tonton Video Modul" link. The `course-videos` storage bucket created earlier is no longer used for anything and can be left empty or removed. Selecting a course/module in the admin video card now shows a live indicator (`#currentVideoInfo`, `checkCurrentVideo()`) — green "✓ Video sudah ada..." with the existing link if one's saved, gray "Belum ada video..." if not, and pre-fills the input with the existing URL so it doubles as an edit field. Runs on page load and on every course/module selection change.
- **Practice document upload**: pick a course + module number → upload one or more PDF/DOC/DOCX files at once (`docFileInput` now has the `multiple` attribute; `uploadDoc()` loops through `fileInput.files` sequentially, uploading + inserting each and reporting an "N/M berhasil" summary if any fail) → stored in the `course-documents` bucket, rows inserted (not upserted — multiple docs per module allowed) into `module_documents`. Each doc has a "Hapus" delete button in the admin overview table (removes both the storage object and the DB row).
- **PPT per module upload** (added July 2026): pick a course + module number → upload a PPT/PPTX file → stored in the `course-ppts` bucket, public URL upserted into `module_ppts` (`course_slug` + `module_num`, one PPT per module — new upload replaces the old one, mirrors the video card's UX including a live `#currentPptInfo` indicator via `checkCurrentPpt()`). Applies to every course (K1 `mulai-claude` and onward), not just one.
- **Content page layout (both changed July 2026)**: the old `#pdf-banner-slot` (full-width purple PDF banner above the video, at the very top of `.main-inner`) has been **removed** from all 4 content pages and from `course-video.js` — the course-level PDF is still available via the sidebar `#pdf-download-slot` link, just no longer duplicated as a banner. In its place, every module panel now has `#ppt-slot-N` and `#doc-slot-N` positioned **directly below the module title/subtitle** (moved up from the old end-of-module position, right before the Sebelumnya/Selanjutnya nav). Order per module: title → subtitle → PPT link (if any) → Materi Praktik doc list (if any) → rest of module content. `course-video.js` populates `#ppt-slot-N` from `module_ppts` the same way it populates `#video-slot-N` from `module_videos`.
- **Overview table**: shows current PDF, all module videos, all module PPTs, and all practice documents (with delete) across all 4 courses.
- **Course/module mapping guarantee**: `COURSES` slug+module-count config is identical across `admin.html` and all 4 content pages' `COURSE_SLUG`/slot IDs (traced July 2026) — upload dropdowns can't produce a course_slug/module_num combination that doesn't map to a real slot, and `onConflict` keys (`course_slug` for PDFs, `course_slug,module_num` for videos and PPTs) match each table's actual primary key.
- **Setup status**: `sql/admin-content-setup.sql` has been run in the Supabase SQL editor (tables + RLS confirmed in Table Editor), and the `course-pdfs` / `course-videos` public storage buckets have been created. Admin login + nav link confirmed working on `prompt-gratis.html` as of July 7, 2026.
- **RLS fix + PPT feature (July 11, 2026) — RESOLVED**: the "Dokumen Praktik" upload was failing with "new row violates row-level security policy" because the `course-documents` storage bucket had never been created in the *correct* Supabase project. Root cause turned out to be a **two-project mix-up**: Julia had been running SQL/creating buckets in an unrelated Supabase project (`pyuvofppbfuytkcazgwh`), while `supabase-config.js` actually points the live site at `ctqtdqbsucbhikwnagvl` ("Belajar-Claude"). Artifacts created in the wrong project (a `module_ppts` table, `course-documents`/`course-ppts` buckets) were left in place there since they're inert and don't affect the live site — cleanup is optional, not required. Fix: ran `sql/admin-content-setup.sql` + `sql/module-ppts-and-fix-uploads.sql` (concatenated as `run-this-in-belajar-claude-project.sql`, given directly to Julia) in the correct project `ctqtdqbsucbhikwnagvl`. **Confirmed working as of this checkpoint** — PDF, PPT, and multi-file Dokumen Praktik uploads all succeed in production.
- **Practice document file types (July 11, 2026)**: `docFileInput` now also accepts `.md` in addition to PDF/DOC/DOCX (`accept` attribute + the extension whitelist in `uploadDoc()`).
- **Multi-file upload success message (July 11, 2026)**: `uploadDoc()` now lists the uploaded filenames in the success status when more than one file is uploaded in a batch, e.g. "2 dokumen berhasil diunggah untuk ... ✓ (a.pdf, b.pdf)" — purely cosmetic, the underlying count (`okCount`) was already accurate.
- **Known limitation**: practice documents and PPTs are uploaded as raw files to Supabase Storage, subject to Supabase's per-file upload size limit and total storage/bandwidth quota. Videos remain link-based (YouTube) so they're not affected by this.
- **Supabase project gotcha to remember**: there are (at least) two Supabase projects in play — `ctqtdqbsucbhikwnagvl` ("Belajar-Claude", the real one, referenced in `supabase-config.js`) and `pyuvofppbfuytkcazgwh` (unrelated, has stray leftover objects from this incident). Always confirm the project ID in the dashboard URL before giving SQL to run.

---

## Index.html Key Details
- **Hero section title**: "Pilih jalur sesuai tujuanmu" — single line (no `<br>`)
- **Jalur grid**: Individual white cards with `1.5px solid #D5D5D2` border + drop shadow. 3-column grid, `gap: 16px`. Featured (All Access) card = dark background.
- **Course carousel**: Horizontal scroll, individual cards with border+shadow. Tags use `align-items: flex-start` on card to