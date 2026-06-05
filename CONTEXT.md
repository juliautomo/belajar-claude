# Klaud.id — Project Context & Checkpoint
_Last updated: June 2026_

## What is Klaud.id
Indonesian-language Claude AI learning platform. Users sign up, enroll in courses, complete modules, and earn badges. Hosted on GitHub Pages (`juliautomo.github.io/klaud-id`).

---

## Tech Stack
- **Frontend**: Plain HTML/CSS/JS (no framework)
- **Backend**: Supabase (auth, database, RLS)
- **Config**: `supabase-config.js` — shared across all pages
- **Hosting**: GitHub Pages (`juliautomo/klaud-id`)
- **Backend repo**: `juliautomo/klaud-backend` (Node.js — `index.js`, `mailer.js`, `sheets.js`)
- **Git push**: Token embedded in remote URL, push via `/tmp/klaud-id-fresh` clone (lock files on mounted folder prevent direct push)

---

## Design System (as of June 2026)
All pages use these CSS variables:
```css
--bg: #FAFAFA;
--surface: #FFFFFF;
--surface-2: #F5F5F7;
--border: #E8E8E8;
--border-strong: #D0D0D0;
--ink: #111111;        /* primary text — NOT var(--ink), must be literal #111111 */
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
- **Logo**: `<a class="logo">Klaud<span>.id</span></a>` — `font-family: var(--font)` (Geist), `font-size: 17px`, `font-weight: 700`, `letter-spacing: -0.4px`. Span `.id` uses `color: var(--accent)` (purple).
- **Cards**: White surface, `1px solid var(--border)`, `border-radius: 14-16px`, subtle shadow
- **Body**: `-webkit-font-smoothing: antialiased`

---

## Supabase Project
- **Project**: "Klaud Id" — `ctqtdqbsucbhikwnagvl`
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

---

## Dashboard Features (dashboard.html)
- **Sidebar**: Initials avatar (dark square), name/email, join date, "Edit profil" button, stats (kursus diikuti / selesai)
- **Greeting**: DM Serif Display, uses first name + time-of-day
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
- **Jalur grid**: Individual white cards with `1.5px solid #D5D5D2` border + drop shadow. 3-column grid, `gap: 16px`. Featured (All Access) card = dark background.
- **Course carousel**: Horizontal scroll, individual cards with border+shadow. Tags use `align-items: flex-start` on card to prevent stretching.
- **"Segera Hadir"** on jalur links: Developer → `coming-soon.html`, Mahasiswa → `kursus-mahasiswa.html`

---

## Known Decisions
- No emoji in UI (removed throughout)
- No DM Mono font anywhere; no Plus Jakarta Sans (replaced by Geist)
- No "Freelancer", "Tingkatkan karir", "Pernah coba/jarang" options in profile modal
- No "Navigasi" sidebar section on dashboard
- No "Diikuti/date" meta on enrolled cards
- Courses marked 100% complete are moved OUT of "Kursus Kamu" into "Pencapaian"
- `buildJourney()` function exists but is disabled (returns immediately)
- Git push workaround: clone to `/tmp/klaud-id-fresh`, copy files, commit, push (lock files on mounted folder prevent direct push)
- `--ink` must always be set as `--ink: #111111` (literal value). Never `--ink: var(--ink)` — that's a self-referential bug that was fixed across all pages June 2026.

---

## How to Push in a New Session
```bash
cd /tmp && git clone https://<GH_TOKEN>@github.com/juliautomo/klaud-id.git klaud-id-fresh
# Token is stored in the git remote URL of the mounted repo:
# git -C /sessions/.../mnt/klaud-id remote get-url origin
cp /sessions/.../mnt/klaud-id/*.html /tmp/klaud-id-fresh/
cd /tmp/klaud-id-fresh
git config user.email "julia.utomo@gmail.com" && git config user.name "Julia"
git add -A && git commit -m "..." && git push origin main
