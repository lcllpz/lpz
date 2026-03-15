# Repo Conventions For `vuepress-theme-plume`

Use this repository's local files as the source of truth:

- Example Markdown page: `docs/blog/preview/markdown.md`
- Home page pattern: `docs/README.md`
- VuePress config: `docs/.vuepress/config.ts`
- Theme config: `docs/.vuepress/plume.config.ts`

## 1. Current Repo Characteristics

- Theme: `vuepress-theme-plume`
- Theme version in `package.json`: `1.0.0-rc.192`
- The repo enables `autoFrontmatter` in `docs/.vuepress/plume.config.ts`
- `autoFrontmatter` currently fills:
  - `title`
  - `createTime`
  - `permalink`
- Ordinary notes do not need large frontmatter blocks unless they require explicit overrides

## 2. Frontmatter Patterns Seen In This Repo

### Regular blog note

```md
---
title: Markdown
tags:
  - markdown
createTime: 2026/03/14 18:06:20
permalink: /blog/9qtibm60/
---
```

Use this shape for migrated blog posts when explicit metadata is needed.

### Home page / landing page

```md
---
pageLayout: home
externalLinkIcon: false
config:
  - type: hero
    full: true
    forceDark: true
    effect: lightning
    hero:
      name: Blog
      tagline: ...
      actions:
        - theme: brand
          text: 博客
          link: /blog/
---
```

Use special layout frontmatter only for landing pages or highly custom pages.

## 3. Markdown Features Confirmed By Local Example

The file `docs/blog/preview/markdown.md` shows these plume-compatible patterns already used in the repo:

- Headings `##` to `######`
- `Badge` component inline in headings or lists
- `Icon` component
- emphasis, strong, delete, mark
- math inline and block
- superscript `19^th^`
- subscript `H~2~O`
- alignment containers:
  - `::: center`
  - `::: right`
- unordered lists
- ordered lists
- task lists
- tables
- blockquotes
- normal links
- fenced code blocks
- code block highlighting markers such as:
  - `[!code highlight]`
  - `[!code ++]`
  - `[!code --]`
  - `[!code error]`
  - `[!code warning]`
  - `[!code focus]`
- code tabs container:

````md
::: code-tabs
@tab tab1

```js
...
```

@tab tab2

```ts
...
```
:::
````

- admonition containers:
  - `::: note`
  - `::: info`
  - `::: tip`
  - `::: warning`
  - `::: caution`
  - `::: important`
- demo/window container:
  - `::: window title="..." height="..."`

## 4. Migration Rules

Prefer plain Markdown first:

- headings
- lists
- task lists
- tables
- links
- images
- blockquotes
- fenced code

Upgrade to plume syntax only when it clearly maps from the source:

- "注意 / 提示 / 警告 / 重要" blocks -> admonition containers
- side-by-side language examples -> `code-tabs`
- short inline status text -> `Badge`
- formulas -> math
- presentation/demo snippets -> `window` or another plume container

Do not force every note to use plume features. Most migrated notes should remain mostly standard Markdown plus a small frontmatter block.

## 5. Safe Defaults For Migration

For a normal note, start from:

```md
---
title: 页面标题
tags:
  - 标签1
---
```

Then add `createTime` or `permalink` only if the user wants explicit control.

For a plain section index, prefer a simple `README.md` with headings and links, and avoid blog-post metadata unless the page is meant to appear as a post.

## 6. Practical Advice For This Repo

- Because `autoFrontmatter` is enabled, duplicated `title/createTime/permalink` fields are optional unless you need exact values.
- The local preview page is the fastest syntax reference inside the repo.
- If a migrated note renders strangely, first simplify it back to plain Markdown, then add plume features one by one.
