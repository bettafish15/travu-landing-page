# Trà Vũ landing page — starter kit

Generated from the 20-page portfolio PDF. Contents:

- `design-refs/` — all 20 deck pages as PNG (the visual source of truth)
- `css/tokens.css` — the extracted design system (3-color palette, type, shape)
- `CLAUDE.md` — conventions + page→section map for Claude Code sessions
- `index.html` — minimal hero skeleton proving the tokens load

## Getting started with Claude Code

```bash
git init && git add -A && git commit -m "design refs + tokens"
claude
```

First prompt suggestion:
> Read CLAUDE.md. Build the "Lời mời hợp tác" intro section from
> design-refs/page-02.png using tokens.css. Screenshot and compare.
