# Trà Vũ — Landing Page

Converting a 20-page portfolio deck (Vietnamese tea artist "Trà Vũ") into a
single-scroll landing page. The deck pages are the source of truth for visual
style; they live in `design-refs/page-01.png` … `page-20.png`.

## Non-negotiable design rules

1. **Three colors only.** `--green #216C53`, `--cream #FFFEF2`, `--gold #C2A878`.
   Green is both a background AND the body text color on cream. Cream is both a
   background AND the body text color on green. Gold is for headings, labels,
   hairline rules, frames, and the leaf badge. Never introduce new colors,
   shadows with color, or gradients. All tokens are in `css/tokens.css` — use
   the CSS variables, never hardcode hex.
2. **Alternating section modes.** Sections alternate `.section-light` (cream)
   and `.section-dark` (green), like the deck alternates page backgrounds.
3. **Typography.** Playfair Display (italic) for display titles and headings in
   gold; Quicksand for body. Both loaded from Google Fonts **with the
   `vietnamese` subset** — the copy is Vietnamese with diacritics; verify
   glyphs like ữ, ề, ẩ render in the chosen weight before committing.
4. **Recurring motifs** (reuse the same component, don't restyle per section):
   - Leaf badge: gold rounded-leaf shape holding a number (deck page numbers →
     can become section markers).
   - Hairline gold frames: 1px gold rounded rectangles (radius ~32px) inset
     around imagery/blocks.
   - Photo cards: rounded corners (~24px) with a 1px gold border.
   - Section label pattern: gold label (e.g. "Bối Cảnh", "Hoạt Động",
     "Vai Trò") with a short gold rule floated right — see page-06/07.
   - Italic gold caption footer: `· Hồ sơ dự án tiêu biểu ·`
5. **Content language is Vietnamese.** Copy text exactly from the refs (it is
   also extractable from the source PDFs); do not machine-translate or "fix"
   the copy without being asked.

## Page → section mapping

| Deck pages | Landing section |
|---|---|
| 01 | Hero (logo, name, tagline, ink-wash mountain art) |
| 02 | Intro / invitation letter |
| 03–04 | Credentials (certificates) |
| 05, 11 | Philosophy ("Trà Chân", tradition/contemporary) |
| 06–10, 12–13, 15–16, 18–19 | Project case studies (repeatable card layout: Bối Cảnh / Hoạt Động / Vai Trò) |
| 14 | Process (5-step: Brief → Contract → Design → Delivery → Reflection) |
| 17 | Services / experience menu |
| 20 | Contact (tel, website, email, address, QR) |

## Workflow

- One section per task. Always open the matching `design-refs/page-NN.png`
  before and after implementing.
- After changes, screenshot the rendered section (Playwright) and visually
  diff against the ref; iterate until layout, spacing, and color match.
- Case studies share ONE component/partial with data varying — never fork the
  markup per project.
- Static HTML + CSS first (`index.html`, `css/`). Keep JS minimal; no
  framework unless we later decide to migrate to Astro.
- Images: photos must be exported/cropped from the source PDFs
  (`pdfimages -j`), not screenshots of full pages. Decorative ink-wash art can
  be used as section backgrounds.
- Responsive: the deck is 16:9 desktop-first; design mobile as stacked
  (image above text), keeping the alternating light/dark rhythm.

## Commands

- Rasterize refs (already done): `pdftoppm -png -r 120 <pdf> design-refs/page`
- Extract photos: `pdfimages -j -f <page> -l <page> <pdf> assets/img/raw`
