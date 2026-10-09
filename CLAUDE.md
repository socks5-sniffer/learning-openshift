# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Kubernetes/OpenShift learning platform built with Next.js and TypeScript, intended for Red Hat OpenShift Dev Spaces. It contains 30 learning modules covering the Kubernetes curriculum from containers basics through GitOps and failure scenarios, with per-module quizzes, localStorage-based progress tracking, and interactive labs.

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Development server on :3000
npm run build      # Production build (uses the Windows compatibility wrapper on Windows)
npm run lint       # ESLint check
npm run typecheck  # TypeScript check
npx playwright install chromium --only-shell  # One-time setup for headless Chromium
npm run test:e2e   # After npm run build: production checks (Chromium desktop and mobile)
npm start          # Start production server
```

CI targets pushes and pull requests to `main`. Build, lint, and type-check jobs use Node.js 22 and 24; the production browser job uses Node.js 22. The browser suite runs Chromium at desktop and mobile viewport sizes and does not validate Kubernetes manifests or behavior against a live cluster. Local build, lint, and type-check pass; remote CI status must be checked for the commit under review.

## Architecture

**Router**: Next.js Pages Router (not App Router). All pages live in `pages/`. `_app.tsx` has a custom `getInitialProps` to support per-request CSP nonces; this disables automatic static optimization, so pages are served on demand.

**Theme system**: `components/ThemeContext.tsx` provides a React context for dark/light mode with `localStorage` persistence. Dark mode is the default. `useTheme()` returns `theme` (`'dark'` or `'light'`) and `toggleTheme()`.

**Learning modules**: 30 page files named `pages/module-[0-10]-[1-3].tsx`. Each module uses `components/module/ModuleShell.tsx` for shared page structure and navigation, with reusable `Callout` and `TermBox` components. Shared visual tokens and module styles live in `styles/Module.module.css`; lesson content can still contain local inline styles. New modules follow this naming convention and must be added to `data/modules.ts` (the module list page renders from it).

**Module catalog**: `data/modules.ts` is the single source of truth for module ids, titles, descriptions, and section grouping. `pages/learning-modules.tsx` and the landing page render from it.

**Progress system**: `components/ProgressContext.tsx` tracks completed modules and last-visited module in `localStorage` (keys `kubelearn-progress`, `kubelearn-last-visited`). Every module page renders `components/ModuleCompletion.tsx` at the bottom, which records the visit, shows a mark-complete card, and auto-renders the module's quiz when one exists.

**Quizzes**: `data/quizzes.ts` maps module id → questions. `components/Quiz.tsx` renders them with instant feedback; scoring ≥70% marks the module complete via ProgressContext. No per-page wiring needed — ModuleCompletion picks quizzes up automatically.

**Code copy buttons**: `components/CodeCopy.tsx` (mounted in `_app.tsx`) attaches copy buttons to `<pre>` and monospace-styled blocks via DOM enhancement on route change. Opt an element out with `data-codecopy="skip"` (used by the Terminal animation and Pod Builder's YAML pane).

**Interactive labs**: linked from `pages/interactive-learning.tsx`. `pages/pod-builder.tsx` is a client-side Pod/Deployment YAML builder with live validation hints; `pages/rbac-simulator.tsx` is a Role/RoleBinding builder with a `kubectl auth can-i` tester that traces each authorization step; `pages/service-discovery.tsx` visualizes label-selector → endpoint routing with simulated requests; `pages/flashcards.tsx` is the quiz-bank flashcard deck.

**Module ribbon**: `components/ModuleRibbon.tsx` (mounted in `_app.tsx`) renders a fixed bottom navigation bar on every `/module-*` route — prev/next links, "X of 30" position, section, estimated reading time, and completion state. No per-page wiring; it activates by route match.

**Cheat sheet**: `pages/kubectl-cheatsheet.tsx` is a grouped kubectl command reference with links back to the modules that teach each topic. Linked from all navbars.

**Flashcards**: `pages/flashcards.tsx` builds a self-graded flip-card deck from `data/quizzes.ts` (question → correct answer + explanation), with section filters and keyboard shortcuts (space/1/2). Adding quiz questions automatically adds flashcards.

**Security headers**: Static headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`) are defined in `next.config.js` via `headers()`. `middleware.ts` creates a per-request nonce and puts it in both the request's CSP and `x-nonce` headers, including requests with prefetch headers. The CSP uses `'nonce-…' 'strict-dynamic'` for scripts: the nonce authorizes Next.js bootstrap scripts, and `strict-dynamic` lets those trusted scripts load their own scripts. `'unsafe-inline'` remains for styles. `_app.tsx` calls the default App `getInitialProps` so each page request can receive a unique nonce. This disables automatic static optimization: pages render on demand, which trades static delivery/caching for per-request nonce support. Targeted production Chromium checks at desktop and mobile sizes verified nonce matching on rendered scripts, fresh nonces for prefetch requests despite untrusted caller headers, consistent nonce use on 404 responses, and blocking of an untrusted parser-inserted inline script while hydration succeeds. Fonts are self-hosted via `@fontsource` — do not add external font CDN references.

**Lint toolchain compatibility**: The project currently pairs Next.js 15.5.27 with `eslint-config-next` 14.2.35 and ESLint 8.57.1. This temporary choice stays within the config's supported ESLint 8 peer range and avoids the newer config's vulnerable `braces` dependency path through `fast-glob`. Local lint and build pass. Monitor upstream for a patched compatible release before changing this combination.

**API routes**: Currently only `pages/api/hello.ts` exists as a reference. It demonstrates the pattern: GET-only guard, security headers on the response, JSON response.

**`components/Terminal.tsx`**: Animates a sequence of kubectl commands character-by-character. Used on the landing page hero section.

**Styling**: `styles/globals.css` defines CSS custom properties for the design system (colors, spacing, typography). `styles/Home.module.css` contains shared layout styles, while `styles/Module.module.css` and `components/module/` provide module-specific tokens and reusable presentation components.

## Key Constraints

- **No `dangerouslySetInnerHTML`** — enforced by security policy.
- **No external font CDNs** — fonts are self-hosted via `@fontsource` packages to avoid third-party data leakage.
- **No secrets in code** — OpenShift Dev Spaces is ephemeral and non-persistent; treat the environment as disposable.
- TypeScript strict mode is enabled (`tsconfig.json`). Use `npm run typecheck` to run the project's explicit type check.
- ESLint rules disable `react/no-unescaped-entities` and `react/jsx-no-comment-textnodes` — these are intentional for the content-heavy module pages.
