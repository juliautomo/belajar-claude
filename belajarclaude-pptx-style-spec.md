# belajarclaude — PPTX Slide Deck Template Spec

Reference doc for generating course slide decks consistent with the K1 Modul 1 deck.
Built with **pptxgenjs** (Node.js). Widescreen 16:9.

---

## 1. Brand Colors (exact hex — same palette as the PDF spec)

| Token | Hex | Used for |
|---|---|---|
| Navy (primary dark bg) | `0D1321` | Cover background, slide header bar |
| Navy secondary | `141D33` | Cover side panel accent (subtle two-tone bg) |
| Purple (accent) | `6849F6` | Buttons, badge pill, step-number circles, icon circles, bullets |
| Purple light (on dark bg) | `8B7CF6` | "claude" wordmark on navy, chip/label text on dark |
| Purple dark (on light bg) | `4B36C7` | Section labels, card headings on white/tint backgrounds |
| Light purple tint (bg) | `F3F0FF` | Setup card, Pro card, note backgrounds |
| Light purple tint (border) | `DCD3FB` | Border for the boxes above |
| Body text | `23283A` | Default paragraph/list text |
| Muted text | `6B7280` / `9AA2B4` | Captions, descriptions, secondary text |
| Green (exercise box) | bg `EAFAF0`, border `B8E6C9`, text `1A7A44` | Exercise / action callouts |
| Gray box | bg `F4F6FB`, border `D6DCEB` | Neutral cards (Gratis card, interface grid cards) |
| White | `FFFFFF` | Card backgrounds, text on dark |

**Never** use `#` prefix or 8-digit hex in pptxgenjs — `"6849F6"` not `"#6849F6"`, and never bake alpha into the hex string (corrupts the file). Use `transparency` (fills/images) or `opacity` (shadows) instead.

**Logo wordmark:** `belajar` in default color (white on navy, navy on white) + `claude` in `8B7CF6`, bold, no space, no separator. Same two-run text object every time — never a single string.

---

## 2. Canvas & Typography

```js
const pres = new pptxgen();
pres.defineLayout({ name: "WIDE", width: 13.333, height: 7.5 });
pres.layout = "WIDE";
```
Set the layout **before** adding any slide — the pptxgenjs default canvas is `10 × 5.625`, and coordinates past that edge are written but never clamped, so a shape just silently fails to appear.

- Font family: `Helvetica` everywhere — no serif, no Google Fonts (matches the PDF's system-font approach for reliable rendering)
- Cover title: 44pt bold, white, `lineSpacing: 50`
- Cover subtitle: 15.5pt, `B7C0D8`
- Slide title (H1-equivalent, white-bg slides): 22pt bold, navy
- Section label (small purple caps, like the PDF's `h3.subhead`): 12.5pt bold, `4B36C7`, `charSpacing: 0.3–0.5`, uppercase in the string itself (pptxgenjs has no CSS text-transform)
- Body paragraph: 13.5pt, `23283A`, `lineSpacingMultiple: 1.25`
- Card/box small print: 11–11.5pt, muted gray
- **Always set `margin: 0`** on text boxes that must align precisely with a shape or another text box — pptxgenjs textboxes carry built-in internal padding otherwise, which silently throws off alignment math.

---

## 3. The Header Bar Pattern (every content slide except the cover)

```js
function addHeader(slide, label) {
  slide.addShape("rect", { x: 0, y: 0, w: 13.333, h: 1.05, fill: { color: "0D1321" } });
  slide.addShape("rect", { x: 0, y: 1.05, w: 13.333, h: 0.045, fill: { color: "6849F6" } });
  slide.addText([
    { text: "belajar", options: { color: "FFFFFF", bold: true } },
    { text: "claude", options: { color: "8B7CF6", bold: true } },
  ], { x: 0.55, y: 0.28, w: 4, h: 0.5, fontSize: 20, fontFace: "Helvetica", margin: 0 });
  slide.addText(label, {
    x: 6.5, y: 0.3, w: 6.3, h: 0.45, align: "right",
    fontSize: 12.5, color: "9AA2B4", fontFace: "Helvetica", margin: 0,
  });
}
```
This mirrors the PDF's `.page-header` exactly: dark navy bar, thin purple bottom border, brand wordmark left, breadcrumb-style module label right (e.g. `"Modul 1 — Apa itu Claude & Setup Akun"`). Call this first on every non-cover slide, then place all content starting at `y: 1.35` or below.

---

## 4. Cover Slide

- Full-bleed navy background (`0D1321`), with a second, slightly lighter panel (`141D33`) covering roughly the right third for subtle depth — **not** a visible hard edge in the content area, just a background variation
- Top row: wordmark top-left, a purple pill badge top-right (`MODUL N`, white bold text, `rectRadius: 0.1`)
- Big title (44pt) roughly vertically centered, two short lines max
- One subtitle line below (15.5pt, muted lavender `B7C0D8`)
- **Keep the cover minimal.** Earlier drafts added topic-preview chips and a footer credit line — both were cut because they added visual clutter without adding information the content slides don't already carry. Default to: wordmark, badge, title, subtitle. Nothing else unless the deck specifically needs it.

---

## 5. Content Slide Anatomy

Every content slide after the header follows this shape:

1. **Slide title** (22pt bold navy) directly under the header, only on slides introducing a new topic — not required on every slide if two slides share one topic
2. **Section label** (12.5pt bold purple caps) directly above each content block, sitting close to its own text (near-zero gap is correct here — this is a label-to-content relationship, not two independent blocks)
3. **Body content** — paragraph, list, or card grid
4. Repeat 2–3 for each subsection

### Component library

| Component | Structure | When to use |
|---|---|---|
| **Numbered step card** | Purple filled circle (0.42×0.42) with white bold number, text vertically centered beside it | Sequential instructions (setup steps, workflow steps) |
| **Compare cards (2-up)** | Two `roundRect`s side by side, one neutral (`F4F6FB`/`D6DCEB`), one purple-tinted (`F3F0FF`/`DCD3FB`) for the "upgraded" option | Free vs Paid, Before vs After |
| **Tier strip (3-up)** | Three narrow white cards with gray border in a row, each with a bold name + 1–2 line description | Plan tiers, category breakdowns |
| **Icon grid (2×2)** | Purple circle with a single bold letter/glyph + bold label + short description, in a `F4F6FB` card | Feature overview (Chat/Projects/Memory/Artifacts-style) |
| **Exercise callout** | Full-width green (`EAFAF0`/`B8E6C9`) `roundRect`, `■ EXERCISE` label in `1A7A44`, body text directly below | End-of-slide action item, mirrors the PDF's exercise box |

All cards use `rectRadius: 0.1–0.12` and a 1pt border in the matching border-tone color.

---

## 6. Spacing Rules (learned the hard way)

This is the section most likely to drift, and the one that caused the most rework — capture it precisely:

1. **Never allocate a text box taller than its actual content.** pptxgenjs does not autofit or clip — an oversized `h` just leaves dead space, and every element positioned after it (at a fixed `y`) inherits a gap that looks unintentional. Estimate actual line count (`chars_per_line ≈ box_width_in_points / (fontSize × 0.5)`, then `lines = ceil(text_length / chars_per_line)`, `height = lines × fontSize × lineSpacingMultiple / 72`) and size the box to that, not to a round number.
2. **Card/box containers must be sized to their content**, not to a uniform arbitrary height for visual "consistency." A card with 2 lines of body text and a card with 5 lines should be different heights — pad each by a consistent ~0.15–0.25in, not force them to match.
3. **Gap between a label and its own content:** near-zero (labels sit directly above their text, ~0.03–0.05in).
4. **Gap between one content block and the next label:** ~0.2–0.25in, consistently, computed from the *actual* rendered height of the previous block — not the allocated box height.
5. **Bottom padding inside a card:** ~0.15–0.3in between the last line of content and the card's bottom edge. More than that reads as an oversized, half-empty box (this was the exact bug in the first draft: tier cards and the exercise box were allocated 1.5–1.7in of height for content that only needed 0.85–1.0in).
6. When in doubt, err toward a **shorter box and more bottom-of-slide whitespace** rather than a taller box with internal dead space — bottom-of-slide breathing room reads as intentional; dead space between a label and its content reads as a bug.

---

## 7. pptxgenjs Technical Gotchas (project-specific, on top of the skill's general list)

- Every `roundRect` used as a card needs an explicit `line: { color, width: 1 }` — omitting it can default to no border and cards blend into the white background.
- Number/letter badges (step circles, icon-grid circles) are two stacked objects: an `ellipse` shape, then a separate `addText` with **identical `x/y/w/h`** and `align: "center", valign: "middle"` — there's no native "shape with centered label" primitive.
- Build each slide in its own `{ ... }` block scope in the generator script — keeps `const` variable names (`lx`, `rx`, `cardY`, etc.) from colliding across slides when the file is edited slide-by-slide later.

---

## 8. Build & QA Process

```bash
npm install -g pptxgenjs          # if not already installed
node build.js                     # generates the .pptx

python scripts/office/validate.py output.pptx      # schema/relationship/content-type check
markitdown output.pptx                              # content dump — check for missing/placeholder text
markitdown output.pptx | grep -iE "\bx{3,}\b|lorem|ipsum|\bTODO|\[insert"   # placeholder sweep

python scripts/office/soffice.py --headless --convert-to pdf output.pptx
pdftoppm -jpeg -r 150 output.pdf slide
# view every slide-N.jpg — check first for text overflow/cutoff, then overlaps,
# uneven gaps, and low-contrast text
```

Run the full QA pass after **every** edit, not just the first build — a spacing fix on one slide can silently overflow a box that was previously fine.

---

## 9. Known Failure Modes to Avoid

1. **Oversized containers causing "gap" complaints** — see §6. This was the actual root cause the first time a "spacing looks inconsistent" note came back; it wasn't inconsistent margins, it was boxes sized larger than their content.
2. **Coordinates past the canvas edge fail silently** — always confirm `pres.layout = "WIDE"` (13.333×7.5) is set before the first `addSlide()`.
3. **Hex colors with `#` or alpha baked in corrupt the file** — plain 6-digit hex only.
4. **Reusing one options object across two `add*` calls** — pptxgenjs mutates option objects in place (e.g. converts to EMU on first use); always build a fresh object per call.
5. **Skipping the QA image render** — text overflow and overlap are only reliably caught by looking at the rendered slide, not by reasoning about coordinates alone.
