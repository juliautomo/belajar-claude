# Course PDF Style Guide

Reference doc for regenerating any Belajar Claude course PDF (20-Prompt, K1 Mulai Claude, K2 Produktivitas, K3 Content Marketing, and any future course). Read this before writing a new build script — it saves re-discovering the same weasyprint quirks and CSS patterns every time.

Established across: `20-prompt-claude-terbaik.pdf`, `K1-Mulai-Claude/...pdf`, `K2-Produktivitas.../K2-Produktivitas-Kantor.pdf`, `Content-Marketing/.../Content-Marketing-Panduan-Belajar.pdf`.

---

## 1. Toolchain

- **Python + weasyprint** renders a self-contained HTML/CSS file to PDF. No external HTML file dependencies — build a single string and write it, then `HTML(filename=...).write_pdf(...)`.
- **BeautifulSoup** parses the live course's `*-content.html` source file to extract module panel content — never hand-write module content, always pull it from the actual site source so the PDF can't drift out of sync with the live course.
- **pdf2image** + manual visual review (render every page to PNG, `Read` each one) is the verification step — never ship a regenerated PDF without looking at every page.

## 2. Build pipeline (repeat for every course)

1. **Parse** — write a `parse_<course>.py` that:
   - Loads the course's `<course>-content.html`.
   - Finds each `module-panel` / `panelN` div (check the actual id/class pattern per course — some use `panel1..panelN`, confirm exact ids).
   - Extracts `module-title` / `module-subtitle` — check whether they're wrapped in a `.hero` div (K2, K3 pattern) or sit directly in the panel (K1, 20-Prompt pattern). Decompose whichever wrapper exists after pulling title/sub text out of it.
   - Strips duration suffixes from subtitles: `re.sub(r"\s*—\s*\d+\s*menit\s*$", "", sub).strip()` — the PDF never shows per-module duration.
   - Removes non-content chrome: `video-slot`, `ppt-slot`, `doc-slot`, `nav-bottom`, `breadcrumb`, and `button.copy-btn`.
   - Runs the emoji-strip pass (see §4) over the whole panel.
   - Converts `<details>` blocks to plain `<div class="details-block">` / `<div class="details-summary">` (weasyprint doesn't render native `<details>` disclosure semantics meaningfully in print).
   - If the source has any inline `style="display:grid;..."` divs, strip the inline style and add `class="grid3"` (or whatever grid width you need) instead — see §5 for why.
   - If any `.step-row` has a card count other than 5, stamp `data-cols="<n>"` on it so the CSS can size cards correctly (see §5).
   - Pickle the parsed modules (`{"num", "title", "sub", "body"}` list) plus any standalone chrome you need (e.g. a completion badge living outside the module panels, in a feedback-only panel).
2. **Build** — write a `build_<course>_pdf.py` that assembles a cover page + one block per module + any closing block, wraps it in the shared CSS (§3), and writes the final HTML string to disk.
3. **Render** — `weasyprint.HTML(filename=...).write_pdf(...)`.
4. **Verify** — `pdf2image.convert_from_path(..., dpi=100)`, save every page as PNG, `Read` each one back and visually check: no overlapping shapes, no orphaned section headers at the bottom of a page, grids/tables didn't collapse to one column, emoji-only icons didn't leave visible tofu boxes.
5. **Ship** — copy the finished PDF over the existing file at its established path in the repo (same filename, don't rename), push via the `/tmp` clone + PAT workflow, log a CONTEXT.md checkpoint.

## 3. Design tokens & page setup

```css
:root {
  --green: #2F7A3B;
  --green-dim: #F0F9F1;
  --accent: #6C47FF;
  --accent-dim: #F1EEFF;
  --accent-glow: #D9CFFF;
  --accent-2: #8067FF;
  --ink: #111111;
  --ink-2: #777777;
  --serif: 'Instrument Serif', Georgia, serif;
}
@page {
  size: A4;
  margin: 20mm 16mm 18mm 16mm;
  @bottom-center { content: "belajarclaude.id — <Course Name>"; font-family:'Geist',sans-serif; font-size:8.5px; color:#BBBBBB; }
  @bottom-right { content: counter(page) " / " counter(pages); font-family:'Geist',sans-serif; font-size:8.5px; color:#BBBBBB; }
}
@page cover {
  margin: 0;
  @bottom-center { content: ""; }
  @bottom-right { content: ""; }
}
```

`--accent:#6C47FF` is the canonical purple used across every PDF, even though K2's live site CSS uses a very slightly different `#6C4DF6` and K3's live site uses `#6C4DF6` too — **always normalize to `#6C47FF` in the PDF** regardless of the source course's exact live-site accent, for cross-PDF visual consistency. Don't copy the course's own `--accent` value verbatim.

Body font is Geist, headings/cover title use Instrument Serif. Load both from Google Fonts in the `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Cover page
Full-bleed A4 page, `page: cover` (so the default `@page` footer boxes don't bleed onto the gradient — this bit that easily without the dedicated named page). Dark purple gradient:
```css
background: linear-gradient(160deg, #2A1B5E 0%, #4A2FA8 45%, #6C47FF 100%);
```
Contents top-to-bottom: brand wordmark, spacer, eyebrow pill ("TERMASUK ALL ACCESS · BELAJAR CLAUDE"), Instrument Serif title (2 lines), subtitle paragraph, stat row (module count / "100% Bahasa Indonesia"), a translucent "Daftar Modul" card listing all modules with numbered circles, footer domain text.

### Module header
```css
.mod-header { break-after: avoid-page; break-inside: avoid; margin-bottom:14px; padding-bottom:10px; border-bottom:2px solid #6C47FF; }
.mod-header + * { break-before: avoid-page; }
```
This pairing is what prevents a header from being orphaned alone at the bottom of a page — always keep both rules together.

## 4. Emoji handling (critical — this sandbox's weasyprint has no color emoji font)

Pictograph emoji render as tofu/missing-glyph boxes. Confirmed empirically (not guessed) across dozens of real characters used in course content. Strip rule:
```python
_STRIP_EXPLICIT = {0x2705, 0x274C, 0xFE0F, 0x200D}  # ✅ ❌ variation-selector zero-width-joiner
def _should_strip(ch):
    return ord(ch) > 0xFFFF or ord(ch) in _STRIP_EXPLICIT
```
Confirmed **safe to keep** (render correctly, BMP range, not in the explicit-strip set): `①②③④` (U+2460–2463), `☐` (U+2610), `⚠` (U+26A0), `✏` (U+270F), `✦` (U+2726). Everything else pictographic should be treated as unsafe until individually verified.

When stripping leaves a text node's leading/trailing space dangling (e.g. `"✅ Output: "` → `" Output: "`), only trim with `.lstrip(" ")` / `.rstrip(" ")` when the node is the first/last child of its parent — trimming unconditionally corrupts legitimate inter-tag spacing (e.g. `</strong> kamu` → `</strong>kamu`).

Inline `<svg>` elements (not text-based emoji) render fine — confirmed with a checkmark `<polyline>` icon in K3's completion badge. Don't strip real SVGs.

## 5. Known weasyprint bugs & the fixes to reuse

**Flex shorthand + calc() + block children collapses to one column.** Any grid built with `flex: N N calc(...)` (or `flex: 0 0 46%`-style shorthand) on items containing a block-level child with real text content will fail to wrap into multiple columns despite `flex-wrap: wrap` on the parent — it silently renders single-column. Root cause is specifically the `flex` shorthand property. Fix: **never use `flex` on grid items in these PDFs.** Use `display:flex;flex-wrap:wrap` on the container and plain `width: calc(...); box-sizing: border-box;` on each item instead. This is why every multi-column class below (`.info-card`, `.two-col .col-card`, `.step-card`, `.package-item`, `.grid3 .col-card`) uses explicit width, never `flex`.

**Inline `display:grid` in source HTML** — rather than trust weasyprint's CSS Grid engine (untested, possible quirks), the parser rewrites any `div[style*="display:grid"]` found in source content to `class="grid3"` with the style attribute removed, and `.grid3` is implemented with the same flex+width pattern as everything else. Don't leave raw grid declarations in parsed content.

**Cover page footer bleed** — the default `@page` rule's `@bottom-center`/`@bottom-right` margin boxes will bleed onto a full-bleed cover unless the cover uses a separate named page (`page: cover`) with its own empty margin-box overrides.

**Forced page breaks waste pages** — don't use `break-before: page` on section/category blocks just to "keep things tidy." It produces near-empty pages. Prefer `break-after: avoid-page` on headers + `break-before: avoid-page` on the header's very next sibling, which only prevents orphaning without forcing an unnecessary break.

**Undefined CSS custom properties in inline styles** — if source HTML has inline `style="color:var(--accent)"` etc. (seen in completion/output boxes), the PDF's own `:root` block must define matching values, or the styled element renders unstyled/invisible. Always grep the parsed body for `var(--` before finalizing a build script.

## 6. Reusable component CSS (canonical, copy from `build_k3_pdf.py` — most complete version)

Every course build script should start from this set and only add new classes for genuinely new component types found in that course's content:

- `.module-desc-box` — intro paragraph box, light gray background.
- `.body-text` — plain paragraph, no box.
- `.section-heading` / `.sub-heading` — headings with `break-after: avoid-page`.
- `.info-grid` / `.info-card` — 2-col card grid, `width: calc(50% - 4px)`.
- `.col-card` (base, no width) + `.two-col .col-card` (50% width) + `.grid3 .col-card` (33% width) + `.col-card.highlight` variant — split this way because `.col-card` appears both inside `.two-col` and standalone inside ad-hoc grids; don't hardcode width onto the bare class.
- `.col-card .context-note` — small italic note inside a col-card, accent-2 color.
- `.step-row` / `.step-card` / `.step-num` — numbered step cards. Default width assumes 5 columns; use `.step-row[data-cols="3"]` / `="4"` overrides when a course has shorter step rows (confirmed necessary in K3, where step counts varied 3/4/5 across modules — don't assume 5 is universal).
- `.prompt-section` / `.prompt-label` / `.prompt-box` (monospace, `white-space:pre-wrap`) / `.mini-output` (green, for compact inline "Output:" lines distinct from the full `.output-box`).
- `.case-box` / `.case-role` — case-study callouts; `.prompt-section .case-box` variant has no border/background of its own (nests inside the prompt-section's own border).
- `.output-box` — green "Output yang Diharapkan" box.
- `.tip-box` + `.warn` (red) + `.connector` (purple) variants.
- `.mistake-list` — red "×" marker list, used inside `.tip-box.warn`.
- `.summary-box` / `.summary-label` — "Ringkasan Modul" recap box.
- `.compare-table` / `.compare-table-wrap` — real `<table>`, `table-layout:fixed`, `tr { break-inside: avoid }` so rows don't split across a page boundary.
- `.details-block` / `.details-summary` — converted from `<details>`/`<summary>`.
- `.anatomy-flow` / `.anatomy-item` / `.anatomy-num` — numbered vertical breakdown (first seen K3). Simplified from the live site by dropping the connecting vertical line (an absolutely-positioned `::after`) — not worth the risk of weasyprint positioning quirks for a purely decorative connector.
- `.package-flow` / `.package-inputs` / `.package-item` / `.package-plus` / `.package-arrow` / `.package-result` / `.package-final` — input-chain-to-result diagram (first seen K3, Modul 4 ad-assembly). Package items use fixed pixel width, no `flex` property (see §5).
- `.completion-badge` / `.badge-check` (with inline SVG checkmark) — course-completion block. Note: some courses embed this inline at the end of the last module's body (K1); others put it in a separate feedback-only panel (K3) — check both places before assuming it's missing.
- `.next-label` / `a.next-card` — cross-sell block linking to other courses, appears at the end of the last module in some courses.
- `.content-chip` / `.tool-chip` — small pill tags, identical styling, just different literal class names between courses.

## 7. File conventions

- Never rename the target PDF — always overwrite the existing file at its established path so links elsewhere in the site/course platform keep working.
- Scratch build artifacts (`parse_*.py`, `build_*_pdf.py`, `*.pkl`, intermediate `*-source.html`, page-by-page PNGs) live only in the outputs scratch directory, never committed to the repo.
- Push workflow: clone `juliautomo/belajar-claude` to a `/tmp` scratch dir with the PAT embedded in the HTTPS URL, copy the finished PDF (and any CONTEXT.md edit) in, commit, push, delete the `/tmp` clone. Never write the PAT into any tracked file.
- Log a CONTEXT.md checkpoint for every regenerated PDF: what changed, page count, what new CSS/classes were added and why, confirmation that all pages were visually reviewed.
