# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Kubernetes/OpenShift learning platform built with Next.js and TypeScript, deployed on Red Hat OpenShift Dev Spaces. It contains 29 comprehensive learning modules covering the full Kubernetes curriculum from containers basics through GitOps and failure scenarios.

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Development server on :3000
npm run build      # Production build
npm run lint       # ESLint check
npm start          # Start production server
```

CI runs `npm ci && npm run build && npm run lint` on Node 18.x, 20.x, and 22.x. There is no test suite beyond build and lint.

For TypeScript type checking (used in CI on dependabot PRs): `npx tsc --noEmit`

## Architecture

**Router**: Next.js Pages Router (not App Router). All pages live in `pages/`.

**Theme system**: `components/ThemeContext.tsx` provides a React context for dark/light mode with `localStorage` persistence. Dark mode is the default. Wrap new pages in `useTheme()` to access `isDarkMode`.

**Learning modules**: 29 page files named `pages/module-[0-10]-[1-3].tsx`. Each module is a self-contained page with inline styles derived from the theme context. New modules follow this naming convention and must be linked from `pages/learning-modules.tsx`.

**Security headers**: Defined in `next.config.js` via `headers()`. The CSP allows `'unsafe-inline'` for scripts (documented trade-off in `SECURITY.md`). The policy self-hosts fonts via `@fontsource` — do not add external font CDN references.

**API routes**: Currently only `pages/api/hello.ts` exists as a reference. It demonstrates the pattern: GET-only guard, security headers on the response, JSON response.

**`components/Terminal.tsx`**: Animates a sequence of kubectl commands character-by-character. Used on the landing page hero section.

**Styling**: `styles/globals.css` defines CSS custom properties for the design system (colors, spacing, typography). `styles/Home.module.css` contains the bulk of layout and component styles. Module pages use inline styles driven by the theme context rather than CSS modules.

## Key Constraints

- **No `dangerouslySetInnerHTML`** — enforced by security policy.
- **No external font CDNs** — fonts are self-hosted via `@fontsource` packages to avoid third-party data leakage.
- **No secrets in code** — OpenShift Dev Spaces is ephemeral and non-persistent; treat the environment as disposable.
- TypeScript strict mode is **off** (`tsconfig.json`), so type errors won't always surface at compile time — rely on `tsc --noEmit` in CI for stricter checks.
- ESLint rules disable `react/no-unescaped-entities` and `react/jsx-no-comment-textnodes` — these are intentional for the content-heavy module pages.
