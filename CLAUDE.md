# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

This is **Notionic**, a Next.js (Pages Router, v13) blog that uses a public Notion page as its CMS/database. It also proxies a separate Craft.do document as a "Notes" section. It is deployed on Vercel. This fork is customized for `ywsrock` (see `blog.config.js`); upstream project is `izuolan/notionic`.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml` / `.npmrc`).

```bash
pnpm install       # install deps
./dev.sh           # kills stray pnpm/next processes, then `pnpm dev`
pnpm dev           # start dev server directly
pnpm build         # next build (postbuild runs next-sitemap automatically)
pnpm start         # serve production build
pnpm lint          # next lint (eslint-config-next/core-web-vitals)
pnpm format        # prettier --write . (singleQuote, no semi, no trailing comma — see .prettierrc)
```

There is no test suite in this repo. `prepare` runs `husky install` on `pnpm install`.

Required env vars (see `.env.example`): `NOTION_PAGE_ID` (required — the shared Notion page acting as the posts database), `NOTION_SPACES_ID`, `TELEGRAM_TOKEN`.

## Architecture

### Content source: Notion as a database

There is no local content/markdown — all posts/pages live in a single public Notion page (a Notion "collection"/database), fetched via `notion-client`/`notion-utils` (unofficial Notion API, no auth token needed unless the page is private).

- `lib/notion/getAllPosts.js` — entry point. Calls `NotionAPI.getPage(BLOG.notionPageId)`, walks the collection's `collection_query` to get row IDs (`getAllPageIds.js`), extracts each row's properties (`getPageProperties.js`), then filters/sorts.
- `lib/notion/getPageProperties.js` — maps a Notion row's raw schema-typed properties (`date`, `select`, `multi_select`, `person`, text) into a flat JS object; also resolves the post's cover image.
- `lib/notion/filterPublishedPosts.js` — the single gate for what's publicly visible: requires `status === 'Published'`, a non-empty `title`/`slug`, `date <= now`, and `type` matching one of `Post` / `Page` / `Hidden` / `Newsletter` depending on which `only*` flag the caller passed. **Every Notion row needs `Title`, `Slug`, `Status`, `Date`, and `Type` columns for this to work.**
- `lib/notion/getPostBlocks.js` — fetches the actual block content (body) for a single page ID, used by `getStaticProps` on post/page routes.
- `lib/notion.js` re-exports the public surface: `getAllPosts`, `getAllTagsFromPosts`, `getPostBlocks`.
- The `type` property on a Notion row is overloaded to mean "which section this content belongs to" — `Post` (blog), `Page` (standalone e.g. `/about`), `Hidden` (referenced by slug directly, e.g. the homepage hero uses slug `index`), `Newsletter`.

Pages use ISR (`getStaticProps` + `revalidate: 1`, `getStaticPaths` + `fallback: true`) so new/edited Notion content shows up without a redeploy — this is the "static blog that updates in real time" feature from the README.

`pages/[slug].js` is the catch-all for posts/pages: it fetches all posts filtered to `{onlyPost, onlyPage, onlyNewsletter}` and matches by `slug` client-side rather than querying Notion by slug directly.

### Craft.do "Notes" proxy (separate content source)

The `/notes/*` section is unrelated to Notion — it reverse-proxies a Craft.do shared document so Craft docs render under this site's own domain/design, driven by `next.config.js` `rewrites()`:

- `pages/api/htmlrewrite.js` — fetches the real Craft.do HTML for a given pathname, strips Craft branding/meta tags, injects a custom nav bar (built from a Craft.do "config" table) and analytics script, then serves it as this site's HTML.
- `pages/api/jsrewrite.js` / `pages/api/apirewrite.js` — proxy Craft's JS bundles and API calls respectively, patching JS output to hide Craft's own UI chrome (corner logo, title bar).
- `lib/getBlocksMaps.js` — parses two Craft.do tables (a "pages" table mapping slug → Craft share URL, and a "site config" table for nav copy/branding) out of Craft's block/`pluginData` JSON structure via `BLOG.craftConfigShareUrl`. This is brittle: it depends on Craft.do's internal block/table format and exact column names (`Title`, `Craft Share URL`, `Slug`, `Setting Name`, `Value`).

Treat the Notion pipeline and the Craft.do proxy as two independent systems that happen to share one Next.js app — don't assume patterns from one apply to the other.

### Configuration

`blog.config.js` is the single source of truth for site behavior — title/author/social links, theme/appearance, which nav sections are enabled (`pagesShow`), comment provider config (`supacomments` or `utterances`), analytics provider (`ga`/`ackee`/`umami`/`cf`), Telegram bot settings, and env-var-backed Notion credentials. Read it before changing anything feature-flag-like; most "is X enabled" checks in components come from here rather than from routing.

`next.config.js` configures `i18n` (locales `en`/`ja`, default `ja`, no auto-detection — matches `blog.config.js` `lang` intent), allowed remote image domains, and the Craft.do rewrite rules described above.

### Rendering

- `layouts/layout.js` is the shared post/page shell: renders Notion `blockMap` via `components/Post/Content.js` (which wraps `react-notion-x`'s renderer, see `components/Post/NotionRenderer.js`) plus a sidebar `Aside` (TOC), footer, and comments.
- `components/Container.js` is the outer page wrapper (SEO/meta, nav, theme).
- i18n copy lives in `lib/lang.js` (a hand-written dict keyed by locale, not `next-i18next`/JSON files) — update this file for any user-facing string, in both `zh` and other locale blocks it defines.
- `lib/cjk.js` maps `BLOG.lang` to a CJK font variant (`SC`/`TC`/`JP`/`KR`) used for typography.
- `lib/day.js` centralizes `dayjs` with the `BLOG.timezone` default applied — use this import instead of raw `dayjs` for any date handling so timezone stays consistent.

### Comments & other integrations

Comment system is pluggable (`components/Post/SupaComments.js` vs `components/Post/Utterances.js`) selected by `BLOG.comment.provider`. `pages/api/sendtotg.js` is a simple relay endpoint for the contact form to post messages to a Telegram bot/chat (`BLOG.telegramToken`/`telegramChatId`).
