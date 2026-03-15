---
name: plume-note-migration
description: Migrate or normalize Markdown notes for a vuepress-theme-plume blog. Use when converting existing notes into this blog's format, adding compatible frontmatter, choosing plume-specific Markdown syntax, preserving plain Markdown where possible, or checking whether a note should use badges, tips, code tabs, math, icons, or custom containers in vuepress-theme-plume.
---

# Plume Note Migration

Follow the existing blog setup in this repository instead of generic VuePress assumptions.

Use [references/repo-conventions.md](references/repo-conventions.md) before editing notes. It contains:

- The frontmatter patterns already used in this repo
- The plume Markdown features visible in local example files
- Rules for when to keep plain Markdown and when to use plume-only syntax

## Workflow

1. Inspect the source note and identify its intent:
   - blog post
   - knowledge-base page
   - section index / README
   - demo content
2. Preserve standard Markdown when it already renders cleanly.
3. Add or normalize frontmatter only when it helps this blog:
   - `title`
   - `tags`
   - `createTime`
   - `permalink`
   - layout fields such as `pageLayout` or `config` only for special pages
4. Prefer repo-consistent conventions over adding many plume features.
5. Use plume syntax only when the source content clearly benefits from it:
   - admonitions for warnings, notes, tips
   - `Badge` for short status labels
   - `Icon` only when the page is already using iconized UI language
   - `code-tabs` only for true multi-language or multi-variant examples
   - math syntax only for real formulas
6. Keep file paths, links, and headings stable unless the migration requires a structural change.
7. Preserve the author's original meaning, wording, ordering, and level of detail by default.
8. Treat frontmatter, link fixes, image paths, heading normalization, and syntax wrappers as safe migration edits.
9. Do not summarize, rewrite, polish, expand, compress, or reorganize the note unless the user explicitly asks for that level of editing.
10. If a possible improvement would change content expression rather than syntax compatibility, stop and ask the user for confirmation first.
11. If the user asks for migration work, perform the conversion directly and keep edits minimal.

## Frontmatter Rules

- For ordinary notes, keep frontmatter small.
- If the repo already auto-generates fields, do not duplicate them unless the file needs explicit values.
- For blog posts, prefer explicit `title` and `tags`.
- Add `permalink` only when the user wants stable blog URLs or the repo already uses explicit permalinks for that content area.
- Do not invent metadata fields unless the repo already uses them.

## Conversion Heuristics

- Convert blockquotes like "Note:", "Tip:", "Warning:" into plume admonition containers when that improves readability.
- Keep normal fenced code blocks unless grouped tabs or line-highlighting adds real value.
- Keep tables, task lists, inline code, links, and images as standard Markdown unless plume enhancement is clearly useful.
- Avoid decorative components in migrated notes unless the original note was presentation-heavy.
- Preserve paragraph text and list content verbatim unless a syntax fix is required for rendering.
- If wording changes seem helpful, propose them separately instead of silently applying them.

## Output Style

- Produce valid UTF-8 Markdown.
- Keep Chinese content in Chinese unless the source is English.
- Do not rewrite the author's wording unless needed for syntax correctness or an explicitly approved structural fix.
- Preserve code blocks verbatim unless the syntax wrapper itself must change.
- When uncertain whether an edit is "content" or "format", treat it as content and ask first.

## Verification

- Check the edited note against [references/repo-conventions.md](references/repo-conventions.md).
- If local build verification is requested, run the repo's VuePress commands after editing.
