# Belajar Claude — Project Context & Checkpoint
_Last updated: June 2026_

## What is Belajar Claude
Indonesian-language Claude AI learning platform (formerly Klaud.id). Users sign up, enroll in courses, complete modules, and earn badges. Being migrated from GitHub Pages to **Vercel** (belajarclaude.id).

---

## Tech Stack
- **Frontend**: Plain HTML/CSS/JS (no framework)
- **Backend**: Supabase (auth, database, RLS)
- **Config**: `supabase-config.js` — shared across all pages
- **Hosting**: Vercel (migrating to `belajarclaude.id`; previously GitHub Pages)
- **GitHub repo**: `juliautomo/belajar-claude` (renamed from `klaud-id`)
- **Backend repo**: `juliautomo/klaud-backend` (Node.js — `index.js`, `mailer.js`, `sheets.js`)

---

## Git / Claude Workflow
- **belajar-claude push**: PAT token embedded in remote URL (`https://ghp_TOKEN@github.com/juliautomo/belajar-claude.git`). Claude clones to `/tmp/klaud-fresh`, edits there, and pushes. Windows-mounted `.git/` folder blocks lock file writes so direct git from mount doesn't work.
- **klaud-backend push**: No token in remote URL — Claude cannot push. To fix: `git remote set-url origin https://YOUR_PAT@github.com/juliautomo/klaud-backend.git`
- **Local file sync**: Claude edits files directly on the Windows mount via file tools AND in `/tmp` clone before pushing. Both stay in sync.
- **Pulling latest**: Claude can't `git pull` on Windows mounts. Workaround: `git clone --depth=1` to `/tmp`, then `rsync` to mounted folder.

## Local Folder Structure (as of June 2026)
- `C:\Users\julia\GitHub\belajar-claude\` — parent folder (rename `klaud-id` → `belajar-claude` after closing Cowork session)
  - `belajar-claude\` — the actual project files (renamed from `Klaud Id`)
  - `klaud-backend\` — Node.js backend (separate)
- **Remount note**: After renaming parent folder, remount both `belajar-claude` and `klaud-backend` in Cowork.

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
- **Project**: "Klaud Id" — `ctqtdqbsucbhikwnagvl` (Supabase project name unchanged)
- **Region**: ap-southeast-2

### Tables
| Table | Key Columns | Notes |
|-------|-------------|-------|
| `profiles` | email (PK), full_name, role, goal, experience | Filled via profile modal on dashboard |
| `enrollments` | email, course_slug, type (free/paid), enrolled_at | Auto-enroll to `prompt-gratis` on login |
| `module_completions` | email, course_slug, module_num | Tracks per-module progress |
| `course_feedback` | email, course_slug, rating (1-5), comment | Unique per email+course |
| `waitlist` | email, course_slug | "Beritahu saya" signups for coming-soon courses |

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

### Assets
| File | Purpose |
|------|---------|
| `login-modal.js` | Shared login modal logic |
| `payment-success-modal.js` | Post-payment modal logic |
| `supabase-config.js` | Shared Supabase client config |
| `20-prompt-claude-terbaik.pdf` | Free PDF download |

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

---

## Index.html Key Details
- **Hero section title**: "Pilih jalur sesuai tujuanmu" — single line (no `<br>`)
- **Jalur grid**: Individual white cards with `1.5px solid #D5D5D2` border + drop shadow. 3-column grid, `gap: 16px`. Featured (All Access) card = dark background.
- **Course carousel**: Horizontal scroll, individual cards with border+shadow. Tags use `align-items: flex-start` on card to prevent stretching.
- **"Segera Hadir"** on jalur links: Developer → `coming-soon.html`, Mahasiswa → `kursus-mahasiswa.html`

---

## Backend (klaud-backend — Node.js/Express)
Hosted on Railway (`https://klaud-backend-production.up.railway.app`). Handles payments and signups.

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
- **Duitku**: Payment gateway (sandbox: `api-sandbox.duitku.com`). Signature: SHA256 for invoice creation, MD5 for webhook verificatio