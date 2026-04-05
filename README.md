# Developer Learning Journey – Next.js on OpenShift

🧪 **Deployed to Red Hat OpenShift using OpenShift Dev Spaces (development sandbox environment).**

This application runs inside an OpenShift-managed container and is accessible while the Dev Spaces environment is active. The deployment is intentionally non-persistent and used for learning, experimentation, and understanding OpenShift workflows.

---

## Overview

This project is a learning playground for cloud-native development, deployed on OpenShift. It uses the modern [Next.js](https://nextjs.org/) stack with TypeScript and React, and is intended to document and demonstrate a developer's journey in public.

The goal is not perfection, but iteration, experimentation, and understanding how real applications move from local development to a managed Kubernetes platform.

---

## Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** TypeScript
- **UI Library:** React
- **Linting:** ESLint (with Next.js config)
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
    npm start
    ```

---

## Project Structure

- `pages/` – Next.js pages (including API routes)
- `public/` – Static assets
- `styles/` – CSS modules and global styles
- `tsconfig.json` – TypeScript configuration
- `eslint.config.mjs` – ESLint configuration

---

## API Example

This project includes a sample API route at `/api/hello` which returns a simple JSON response, demonstrating how Next.js API routes work alongside the front-end pages.

---

## Learning Modules

The site includes an interactive Kubernetes learning curriculum split across 29 modules in 10 topic areas. Each module is a standalone page with explanations, diagrams, and interactive elements.

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

All modules are accessible from the `/learning-modules` page when running locally, or via the navigation bar on the deployed site.
