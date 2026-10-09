# Module review (September 2026)

This is a source-level audit of the 30 lessons, their routes, quizzes, examples, and interactive controls. Every catalog entry has a page, matching completion ID, and four quiz questions with valid answer indexes. Literal links between modules resolve. ESLint, TypeScript, and the production build pass; the build generated all 41 pages. These checks do **not** prove every control works in a browser or that every example can be applied to a live cluster.

| Module | Static review result |
| --- | --- |
| [0.1 Why Kubernetes Exists](pages/module-0-1.tsx) | Route and quiz present; no issue found in static scan. |
| [0.2 Containers 101](pages/module-0-2.tsx) | Route and quiz present; no issue found in static scan. |
| [1.1 Kubernetes Cluster](pages/module-1-1.tsx) | Route and quiz present; no issue found in static scan. |
| [1.2 Control Plane](pages/module-1-2.tsx) | Route and quiz present; no issue found in static scan. |
| [1.3 Worker Nodes](pages/module-1-3.tsx) | Route and quiz present; no issue found in static scan. |
| [2.1 Pods](pages/module-2-1.tsx) | Route and quiz present; no issue found in static scan. |
| [2.2 ReplicaSets & Deployments](pages/module-2-2.tsx) | Fixed pending animation timers after reset/unmount. |
| [2.3 Services](pages/module-2-3.tsx) | Fixed pending timers; clarified ClusterIP lifetime and local LoadBalancer options. |
| [3.1 ConfigMaps](pages/module-3-1.tsx) | Corrected Deployment selector/Pod labels in examples; removed unused state. |
| [3.2 Secrets](pages/module-3-2.tsx) | Clarified `data` Base64 encoding versus `stringData`. |
| [3.3 Environment Strategy](pages/module-3-3.tsx) | Route and quiz present; no issue found in static scan. |
| [4.1 Requests & Limits](pages/module-4-1.tsx) | Corrected request, memory reservation, and QoS eviction explanations. |
| [4.2 Node Scheduling](pages/module-4-2.tsx) | Route and quiz present; no issue found in static scan. |
| [4.3 HPA](pages/module-4-3.tsx) | Simulator now scales from current replicas, supports scale-down, and applies tolerance; corrected autoscaling prerequisites. |
| [5.1 Volumes](pages/module-5-1.tsx) | Route and quiz present; no issue found in static scan. |
| [5.2 PVs & PVCs](pages/module-5-2.tsx) | Route and quiz present; no issue found in static scan. |
| [5.3 StatefulSets](pages/module-5-3.tsx) | Fixed pending animation timers after reset/unmount. |
| [6.1 Networking](pages/module-6-1.tsx) | Corrected direction-specific NetworkPolicy behavior; removed unpinned CNI installation commands. |
| [6.2 Ingress](pages/module-6-2.tsx) | Updated for community Ingress-NGINX retirement; marked its remaining annotations as historical and controller-specific. |
| [7.1 RBAC](pages/module-7-1.tsx) | Wired the action selector, corrected ServiceAccount token description, and completed role/binding examples. |
| [7.2 Pod Security](pages/module-7-2.tsx) | Corrected Baseline versus Restricted requirements and optional read-only filesystem hardening. |
| [7.3 Network Policies](pages/module-7-3.tsx) | Clarified demo prerequisites and DNS/controller namespace examples. |
| [8.1 Logging](pages/module-8-1.tsx) | Corrected direct-delivery claim and `kubectl logs --previous` retention explanation. |
| [8.2 Monitoring](pages/module-8-2.tsx) | Fixed chart coordinates and memory/error units; removed unused controls and aligned alert thresholds with metrics. |
| [8.3 Debugging](pages/module-8-3.tsx) | Route and quiz present; no issue found in static scan. |
| [9.1 Deploying](pages/module-9-1.tsx) | Route and quiz present; no issue found in static scan. |
| [9.2 GitOps](pages/module-9-2.tsx) | Route and quiz present; no issue found in static scan. |
| [10.1 Failure Scenarios](pages/module-10-1.tsx) | Route and quiz present; no issue found in static scan. |
| [10.2 Managed Kubernetes](pages/module-10-2.tsx) | Removed stale fixed prices, version-lag figures, and unsupported “best” rankings; explained pricing tiers. |
| [10.3 When to Say No](pages/module-10-3.tsx) | Route and quiz present; no issue found in static scan. |

The examples remain teaching material, not deployment recipes. In particular, the managed-service setup commands and controller-specific Ingress snippets still depend on a provider, installed versions, cluster policy, and current vendor documentation. A useful next pass is to run each interactive lesson in a browser at desktop and mobile widths and validate representative YAML against a disposable Kubernetes cluster. No browser or cluster execution is claimed here.

Primary references used for the corrected content: [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/), [resource management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/), [NetworkPolicy](https://kubernetes.io/docs/concepts/services-networking/network-policies/), [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/), [HPA](https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/), [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/), [EKS pricing](https://aws.amazon.com/eks/pricing/), [GKE pricing](https://cloud.google.com/kubernetes-engine/pricing), and [AKS tiers](https://learn.microsoft.com/en-us/azure/aks/free-standard-pricing-tiers).

## October 8, 2026: reconciliation and production browser verification

Integrated `main`'s shared `ModuleShell`, `Callout`, and `TermBox` components while retaining the September lesson corrections and simulator fixes. Updated the runtime and dependency lockfile, corrected per-request CSP nonce propagation, removed the prefetch-header bypass, and fixed Unicode handling in the Secret encoder. Pages now render on demand so the response policy and initial script nonces agree; this replaces automatic static optimization and static HTML caching. Inline styles remain an explicitly documented CSP tradeoff.

Local verification on Windows with Node.js 25.2.1:

- `npm run lint`, `npm run typecheck`, and `npm run build` passed.
- `npm ci --dry-run --ignore-scripts` confirmed package/lockfile consistency.
- `npm audit` reported zero vulnerabilities at the time of this check.
- `npm run test:e2e`: **88 passed**, using production Chromium at desktop and mobile viewport sizes.

The browser suite checks all 30 lessons for loading, quiz availability, navigation, visit tracking, and horizontal viewport overflow. It also exercises quiz completion and persistence, client navigation, malformed/unavailable storage, search, Pod Builder validation, RBAC scope, Service Discovery endpoints, flashcard keyboard controls, HPA scaling, and UTF-8/Base64 encoding. Security checks verify server-script nonce consistency, nonce uniqueness and caller-header rejection for both prefetch markers, the 404 response, HTTP/API headers, and rejection of an untrusted parser-inserted inline script while trusted scripts hydrate normally.

CI now targets `main`, checks builds on Node.js 22 and 24, and runs the production browser suite on Node.js 22. Audit and TypeScript failures are no longer ignored. The local results above do not assert remote CI success or a live deployment.

These checks do not exercise every lesson control or validate manifests against a Kubernetes cluster. Representative YAML and provider-specific setup still need validation in a disposable cluster; other browser engines and the deployed HTTPS/OpenShift environment remain outside this verification.

## October 9, 2026: Copilot review follow-up

Verified the previously fixed Read-Only Viewer render failure and Node.js 22 Dependabot configuration. Added service and deployment read permissions to both admin roles, with browser checks for viewer/admin authorization, denied actions, and the generated Deployment API group. All DNS egress examples in lessons 6.1 and 7.3 now permit UDP and TCP port 53. The accompanying text explains that a namespace selector alone allows port 53 to every Pod in that namespace; a Pod selector in the same destination entry narrows that scope. See the [Kubernetes NetworkPolicy selector documentation](https://kubernetes.io/docs/concepts/services-networking/network-policies/#behavior-of-to-and-from-selectors).

Associated every HPA range input and the monitoring alert threshold with its visible label. Corrected the home progress panel's light-theme contrast, including its emphasized completion count. Development and production builds now use `scripts/next.cjs`, which applies the non-C: Windows filesystem shim to either command and its worker processes. A temporary development server on D: served the RBAC lesson successfully.

Restored home-page navigation to the last unfinished lesson even before any module is completed. Monitoring charts ignore alert thresholds for metrics that do not support alerts. Added regressions for both cases. Replaced unsupported provider rankings with capability descriptions informed by the [AKS Windows limitations](https://learn.microsoft.com/en-us/azure/aks/windows-vs-linux-containers) and [GKE Autopilot overview](https://docs.cloud.google.com/kubernetes-engine/docs/concepts/autopilot-overview).

Final local validation on Windows with Node.js 25.2.1: lint, strict TypeScript, production build, and `git diff --check` passed; `npm audit` reported zero vulnerabilities; all **98** production Chromium checks passed at desktop and mobile viewport sizes. Live-cluster manifest execution, other browser engines, and deployed HTTPS/OpenShift checks remain outside this result.
