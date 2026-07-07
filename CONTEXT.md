# Belajar Claude — Project Context & Checkpoint
_Last updated: July 7, 2026_

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
- **belajar-claude push**: PAT `ghp_YOUR_PAT_HERE` embedded in remote URL. Claude clones to `/tmp/bc-push`, edits there, and pushes. Windows-mounted `.git/` folder blocks lock file writes so direct git from mount doesn't work.
- **belajar-claude-backend push**: Same PAT, clones to `/tmp/belajar-claude-backend`. Local folder at `C:\Users\julia\GitHub\belajar-claude-backend\`.
- **Local file sync**: Claude edits files directly on the Windows mount via file tools AND in `/tmp` clone before pushing. Both stay in sync.
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
- **Logo**: `<a class="logo">belajar<span>claude</span></a>` — `font-family: var(--font)` (Geist), `font-size: 17px`, `font-weight: 700`, `letter-spacing: -0.4px`. Span `claude` uses `color: var(--accent)` (purple).
- **Cards**: White surface, `1px solid var(--border)`, `border-radius: 14-16px`, subtle shadow
- **Body**: `-webkit-font-smoothing: antialiased`

---

## Supabase Project
- **Project**: "Belajar-Claude" — `ctqtdqbsucbhikwnagvl`
- **Region**: ap-southeast-2
- **Site URL**: `https://belajar-claude.vercel.app`
- **Redirect URLs**: `https://belajar-claude.vercel.app/**`, `https://juliautomo.github.io/belajar-claude/**`
- **Magic link template**: Updated to Belajar Claude branding (confirm signup also updated)

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
| `kerja-sehari-hari.html` | Sales page — Rp 149K |
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
| `login.html` | Auth page (Supabase magic link) |
| `dashboard.html` | Main user dashboard |
| `prompt-gratis-content.html` | Course reader — 5 modules + feedback panel |
| `mulai-claude-content.html` | Course reader — 6 modules + feedback panel |
| `kerja-sehari-hari-content.html` | Course reader — 6 modules + feedback panel |
| `bisnis-ukm-content.html` | Course reader — 6 modules + feedback panel |
| `payment-success.html` | Post-payment confirmation |
| `admin.html` | Admin-only content manager — upload course PDFs + per-module videos to Supabase Storage. Gated to `julia.utomo@gmail.com` / `tiffany.utomo@gmail.com` via session email check. Linked from a hidden "Admin" nav item on `prompt-gratis.html` (shown only to those emails). |

### Assets
| File | Purpose |
|------|---------|
| `login-modal.js` | Shared login modal logic |
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
- Left sidebar nav with module items + separate "Feedback" item at bottom (★ icon)
- Progress bar + completion tracking per module → saved to `module_completions`
- Last panel = feedback panel: star rating (1-5) + optional comment → saved to `course_feedback`
- "Ke Dashboard" on last content module → navigates to feedback panel first

### mulai-claude-content.html — Modul 1-3 rewritten July 2026
Modules 1, 2, and 3 (Apa itu Claude & Setup Akun / Anatomi Prompt K-I-F / Role Prompting) were rewritten to follow the source PDF "Mulai dengan Claude AI (Modul 1-3)" uploaded via admin.html — same case study throughout (usaha kecil membalas chat pelanggan), same analogies, comparison tables, and exercises as the PDF. New reusable CSS box classes added for this: `.tip-box` (gold, analogies/tips/catatan/kesalahan), `.summary-box` (Ringkasan Modul bullets), `.compare-table`/`.compare-table-wrap` (prompt buruk vs baik tables), `.step-row`/`.step-card` (numbered setup steps), `.two-col`/`.col-card` (Gratis vs Pro, Tanpa Role vs Dengan Role), `.info-grid`/`.info-card` (interface areas, 4 prompt elements, 5 roles), `.section-heading`, `.body-text`. Modules 4-7 (Artifacts, Projects, Google Docs, Feedback) were left untouched — only 1-3 matched the uploaded PDF's scope.

---

## Admin Content Manager (admin.html) — added July 2026 (live, verified working)
- **Access**: gated to `julia.utomo@gmail.com` and `tiffany.utomo@gmail.com` only, checked client-side against the Supabase session email (`ADMIN_EMAILS` array in `admin.html` and in the nav script of `prompt-gratis.html`). Not logged in → prompt to log in. Logged in but not an admin email → "Akses ditolak".
- **Entry point**: hidden "Admin" link in `prompt-gratis.html` nav, shown only when the logged-in session email matches an admin email.
- **PDF upload**: pick a course → upload a PDF → stored in the `course-pdfs` Supabase Storage bucket, public URL saved to `course_resources` (one row per `course_slug`, upsert). Content pages show a "📄 Unduh [filename]" link in the sidebar (`#pdf-download-slot`) via `course-video.js` if a resource exists for that course.
- **Video upload**: pick a course + module number → upload a video file → stored in the `course-videos` bucket, public URL saved to `module_videos` (`course_slug` + `module_num` upsert). Content pages render a `<video>` player at the top of the matching module panel (`#video-slot-N`) via `course-video.js`.
- **Practice document upload**: pick a course + module number → upload a PDF/DOC/DOCX → stored in the `course-documents` bucket, row inserted (not upserted — multiple docs per module allowed) into `module_documents`. Rendered as a "Materi Praktik" download list at the *end* of the matching module (right before the Sebelumnya/Selanjutnya nav, `#doc-slot-N`), via `course-video.js`. Each doc has a "Hapus" delete button in the admin overview table (removes both the storage object and the DB row).
- **Overview table**: shows current PDF, all module videos, and all practice documents (with delete) across all 4 courses.
- **Course/module mapping guarantee**: `COURSES` slug+module-count config is identical across `admin.html` and all 4 content pages' `COURSE_SLUG`/slot IDs (traced July 2026) — upload dropdowns can't produce a course_slug/module_num combination that doesn't map to a real slot, and `onConflict` keys (`course_slug` for PDFs, `course_slug,module_num` for videos) match each table's actual primary key.
- **Setup status**: `sql/admin-content-setup.sql` has been run in the Supabase SQL editor (tables + RLS confirmed in Table Editor), and the `course-pdfs` / `course-videos` public storage buckets have been created. Admin login + nav link confirmed working on `prompt-gratis.html` as of July 7, 2026. `course-documents` bucket still needs to be created the same way for the practice-document feature to work.
- **Known limitation**: videos and documents are uploaded as raw files to Supabase Storage (not YouTube/Vimeo embeds or Google Drive links) — subject to Supabase's per-file upload size limit and total storage/bandwidth quota on the current plan. Large course videos may need plan upgrades or external hosting later.

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
| `POST` | `/signup` | Free signup — adds to ConvertKit, Google Sheets, creates Supabase user, enrolls in `prompt-gratis`, sends welcome email |
| `POST` | `/create-payment` | Creates Duitku invoice, returns `reference` + `orderId` |
| `POST` | `/webhook/duitku` | Payment confirmation — saves enrollment to Supabase + Google Sheets, adds ConvertKit tag, sends access email |

### Course Catalog (COURSES in index.js)
| Slug | Name | Price |
|------|------|-------|
| `kerja-sehari-hari` | K2: Produktivitas Kantor | Rp 149,000 |
| `bisnis-ukm` | K3: Konten & Pemasaran Bisnis | Rp 149,000 |
| `konten-copywriting` | K4: Copywriting & Konten Digital | Rp 199,000 |
| `analisis-data` | K5: Analisis Data & Laporan | Rp 199,000 |
| `build-automation` | K6: Automasi Workflow | Rp 299,000 |
| `ai-powered-app` | K7: Build AI App Sederhana | Rp 299,000 |
| `claude-api-dev` | K8: Claude API untuk Developer | Rp 399,000 |
| `jual-produk-ai` | K9: Build & Monetisasi Produk AI | Rp 499,000 |
| `paket-mahasiswa` | Claude untuk Mahasiswa | Rp 249,000 |
| `paket-karyawan` | Claude untuk Karyawan & Profesional | Rp 299,000 |
| `paket-pengusaha` | Claude untuk Pengusaha | Rp 499,000 |
| `paket-creator` | Claude untuk Content Creator | Rp 299,000 |
| `workshop-zoom` | Workshop Bulanan via Zoom | Rp 149,000 |
| `coaching-1on1` | Coaching 1-on-1 | Rp 1,500,000 |

### Package → Course Enrollment Map (PAKET_COURSES)
| Package | Constituent Courses |
|---------|-------------------|
| `paket-karyawan` | mulai-claude, kerja-sehari-hari, analisis-data |
| `paket-mahasiswa` | mulai-claude, konten-copywriting, analisis-data |
| `paket-pengusaha` | mulai-claude, bisnis-ukm, konten-copywriting, build-automation |
| `paket-creator` | mulai-claude, bisnis-ukm, konten-copywriting |

### Backend Integrations
- **Duitku**: Payment gateway (sandbox: `api-sandbox.duitku.com`). Signature: SHA256 for invoice creation, M