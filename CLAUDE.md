# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Kubernetes/OpenShift learning platform built with Next.js and TypeScript, deployed on Red Hat OpenShift Dev Spaces. It contains 30 comprehensive learning modules covering the full Kubernetes curriculum from containers basics through GitOps and failure scenarios, with per-module quizzes, localStorage-based progress tracking, and interactive labs.

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

**Learning modules**: 30 page files named `pages/module-[0-10]-[1-3].tsx`. Each module is a self-contained page with inline styles derived from the theme context. New modules follow this naming convention and must be added to `data/modules.ts` (the module list page renders from it).

**Module catalog**: `data/modules.ts` is the single source of truth for module ids, titles, descriptions, and section grouping. `pages/learning-modules.tsx` and the landing page render from it.

**Progress system**: `components/ProgressContext.tsx` tracks completed modules and last-visited module in `localStorage` (keys `kubelearn-progress`, `kubelearn-last-visited`). Every module page renders `components/ModuleCompletion.tsx` at the bottom, which records the visit, shows a mark-complete card, and auto-renders the module's quiz when one exists.

**Quizzes**: `data/quizzes.ts` maps module id → questions. `components/Quiz.tsx` renders them with instant feedback; scoring ≥70% marks the module complete via ProgressContext. No per-page wiring needed — ModuleCompletion picks quizzes up automatically.

**Code copy buttons**: `components/CodeCopy.tsx` (mounted in `_app.tsx`) attaches copy buttons to `<pre>` and monospace-styled blocks via DOM enhancement on route change. Opt an element out with `data-codecopy="skip"` (used by the Terminal animation and Pod Builder's YAML pane).

**Interactive labs**: `pages/pod-builder.tsx` is a client-side Pod/Deployment YAML builder with live validation hints that cross-reference modules. Labs are linked from `pages/interactive-learning.tsx`.

**Module ribbon**: `components/ModuleRibbon.tsx` (mounted in `_app.tsx`) renders a fixed bottom navigation bar on every `/module-*` route — prev/next links, "X of 30" position, section, estimated reading time, and completion state. No per-page wiring; it activates by route match.

**Cheat sheet**: `pages/kubectl-cheatsheet.tsx` is a grouped kubectl command reference with links back to the modules that teach each topic. Linked from all navbars.

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
