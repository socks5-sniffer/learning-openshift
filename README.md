# Developer Learning Journey – Next.js on OpenShift

🧪 **A learning sandbox developed in Red Hat OpenShift Dev Spaces and deployed to OpenShift.**

The ClusterFoundry sandbox deployment was verified on **October 9, 2026**.
Retrieve your own deployment's HTTPS address with the Route lookup command in the
[operating guide](openshift/README.md#deploy-the-checked-in-template).
The app runs as its own OpenShift Deployment, separate from the Dev Spaces
workspace. Availability depends on the app being running and the sandbox remaining
active; this dated record does not guarantee that the URL is currently available.
See the [deployment record and operating guide](openshift/README.md) for deployment,
everyday stop/resume, and full cleanup instructions.

---

## Overview

This project is a learning playground for cloud-native development, intended to run locally and in OpenShift Dev Spaces. It uses Next.js with TypeScript and React, and documents a developer's journey in public.

The goal is not perfection, but iteration, experimentation, and understanding how real applications move from local development to a managed Kubernetes platform.

---

## Stack

- **Framework:** [Next.js](https://nextjs.org/) 15.5.27
- **Language:** TypeScript
- **UI Library:** React
- **Linting:** ESLint 8 with a temporarily retained `eslint-config-next` 14.2.35 configuration; see [SECURITY.md](SECURITY.md) for the compatibility reason
- **Deployment Platform:** Red Hat OpenShift

---

## Project Purpose

This site is a personal learning project, focused on:

- Practicing cloud-native development concepts
- Deploying real applications to OpenShift
- Understanding build pipelines, pods, and services
- Documenting mistakes, fixes, and progress
- Building in public as an aspiring solutions architect

---

## Getting Started

For a public sandbox deployment or a browser-based development workspace, see
[the OpenShift and Dev Spaces setup](openshift/README.md).

1. **Install dependencies:**
    ```bash
    npm install
    ```

2. **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view in your browser.

3. **Build for production:**
    ```bash
    npm run build
    ```
    Both `dev` and `build` use the same launcher, which loads the filesystem compatibility shim on non-C: Windows drives, including in Next.js workers.
    To serve the production build manually, run `npm start` after the build.

4. **Run checks:**
    ```bash
    npm run lint
    npm run typecheck
    npx playwright install chromium --only-shell
    npm run build
    npm run test:e2e
    ```
    Install Chromium's headless shell once per environment. Build before running `test:e2e`; Playwright starts the production server for its checks. The suite exercises Chromium at desktop and mobile viewport sizes but does not validate Kubernetes configuration against a live cluster. CI targets pushes and pull requests to `main`: build/lint/type-check jobs use Node.js 22 and 24, while the browser job uses Node.js 22. CI also checks the Dev Spaces image's tools and the production container under an arbitrary non-root user ID. See the dated [module and verification review](MODULE-REVIEW.md) and [sandbox verification](openshift/README.md#validation) for recorded results, and check CI for the current commit.

---

## Project Structure

- `pages/` – Next.js pages (including API routes and interactive labs)
- `components/` – Shared React components (theme, progress tracking, quizzes, navigation)
- `data/` – Module catalog and quiz question bank (single source of truth)
- `lib/` – Small shared utilities
- `public/` – Static assets
- `styles/` – CSS modules and global styles
- `middleware.ts` – per-request Content-Security-Policy nonce handling
- `playwright.config.ts` – production browser test configuration
- `tsconfig.json` – TypeScript configuration
- `.eslintrc.json` – ESLint configuration
- `Dockerfile` and `.dockerignore` – production standalone container build
- `devfile.yaml` – Dev Spaces workspace image, tools, tasks, and endpoint
- `openshift/` – deployment template, verified sandbox record, and operating guide
- `scripts/container-smoke.cjs` – health, page, CSP, and packaged-asset checks

---

## Features

Beyond the module content itself, the platform includes:

- **Progress tracking** – Mark modules complete, resume where you left off, and see per-section completion on the module list, all stored in `localStorage` (no account needed).
- **Knowledge-check quizzes** – Every module ends with a short quiz; scoring 70%+ automatically marks it complete.
- **Interactive labs** (`/interactive-learning`) – A client-side **Pod Builder** (YAML with live validation), an **RBAC Simulator** (`kubectl auth can-i`-style permission testing), a **Service Discovery** visualizer (label selectors → live endpoints), and a **Flashcards** deck built from the quiz bank.
- **kubectl cheat sheet** (`/kubectl-cheatsheet`) – Commands grouped by task, each linking back to the module that teaches it.
- **Module navigation ribbon** – A fixed bottom bar on every module page showing your position in the curriculum, section, estimated reading time, and completion state.
- **Copy-to-clipboard** – Every code block across the modules and cheat sheet gets a copy button automatically.

---

## API Example

This project includes a sample API route at `/api/hello` which returns a simple JSON response, demonstrating how Next.js API routes work alongside the front-end pages.

---

## Learning Modules

The site includes an interactive Kubernetes learning curriculum split across 30 modules in 10 topic areas. Each module is a standalone page with explanations, diagrams, a knowledge-check quiz, and interactive elements.

### 🎯 Module 0 – Foundation

| Module | Title | Description |
|--------|-------|-------------|
| 0.1 | **Why Kubernetes Exists** | The problem Kubernetes solves, monoliths vs microservices, and when Kubernetes is overkill |
| 0.2 | **Containers 101** | Just enough Docker – what containers are, images vs containers, and why "it works on my machine" is a crime |

### 🏗️ Module 1 – Architecture

| Module | Title | Description |
|--------|-------|-------------|
| 1.1 | **What Is a Kubernetes Cluster?** | Nodes, control plane vs worker nodes, and the cluster as a promise |
| 1.2 | **Control Plane Components** | API Server, etcd, Scheduler, and Controller Manager – the brains of the operation |
| 1.3 | **Worker Node Components** | kubelet, container runtime, and kube-proxy – where the work actually happens |

### 📦 Module 2–3 – Core Concepts

| Module | Title | Description |
|--------|-------|-------------|
| 2.1 | **Pods** | The smallest unit of pain – what a Pod really is and why you almost never create them directly |
| 2.2 | **ReplicaSets & Deployments** | Desired state, scaling, rolling updates, and why Deployments are your best friend |
| 2.3 | **Services** | Networking without tears – ClusterIP, NodePort, LoadBalancer, and ephemeral IPs |
| 3.1 | **ConfigMaps** | Separating config from code – environment variables vs mounted files |
| 3.2 | **Secrets** | What Kubernetes Secrets are (and are not) – Base64 ≠ encryption |
| 3.3 | **Environment Strategy** | Dev vs staging vs production, and avoiding configuration drift |

### ⚖️ Module 4 – Scheduling & Resources

| Module | Title | Description |
|--------|-------|-------------|
| 4.1 | **Resource Requests & Limits** | CPU and memory basics, why your Pod gets OOMKilled, and fairness |
| 4.2 | **Node Scheduling** | Labels, selectors, taints, tolerations, affinity, and anti-affinity |
| 4.3 | **Horizontal Pod Autoscaling** | Metrics-based scaling – when autoscaling helps and when it lies |

### 💾 Module 5 – Storage

| Module | Title | Description |
|--------|-------|-------------|
| 5.1 | **Volumes** | Ephemeral vs persistent storage – why containers are disposable |
| 5.2 | **PersistentVolumes & Claims** | Abstracting storage, dynamic provisioning, and StorageClasses |
| 5.3 | **StatefulSets** | When stateless isn't an option – databases in Kubernetes (carefully) |

### 🔌 Module 6 – Networking

| Module | Title | Description |
|--------|-------|-------------|
| 6.1 | **Kubernetes Networking Model** | Pod-to-Pod communication, no NAT, and CNI plugins explained simply |
| 6.2 | **Ingress** | What Ingress is (and isn't), controllers, TLS termination, and real-world traffic flow |

### 🔐 Module 7 – Security

| Module | Title | Description |
|--------|-------|-------------|
| 7.1 | **RBAC** | Users vs ServiceAccounts, Roles and RoleBindings, and least privilege in practice |
| 7.2 | **Pod Security** | SecurityContext, Pod Security Standards, and why "privileged" is scary |
| 7.3 | **Network Policies** | Zero trust inside the cluster and blocking east-west traffic |

### 📊 Module 8 – Observability

| Module | Title | Description |
|--------|-------|-------------|
| 8.1 | **Logging** | stdout/stderr philosophy and centralized logging patterns |
| 8.2 | **Monitoring** | Metrics, Prometheus basics, and what to alert on (and what not to) |
| 8.3 | **Debugging Kubernetes** | kubectl describe, logs, exec, and reading events like a crime scene |

### 🚀 Module 9 – CI/CD

| Module | Title | Description |
|--------|-------|-------------|
| 9.1 | **Deploying the Right Way** | Image tagging strategies and immutable deployments |
| 9.2 | **GitOps** | Declarative infrastructure, Argo CD / Flux, and Git as source of truth |

### 🔥 Module 10 – Reality Check

| Module | Title | Description |
|--------|-------|-------------|
| 10.1 | **Common Failure Scenarios** | Crash loops, misconfigured probes, resource exhaustion, and DNS issues |
| 10.2 | **Managed Kubernetes** | EKS, GKE, AKS, OpenShift – what they handle and what they don't |
| 10.3 | **When to Say "No" to Kubernetes** | Simpler alternatives and cost/complexity trade-offs |

---

All modules are accessible from the `/learning-modules` page when running locally, or from the site's navigation when deployed.
