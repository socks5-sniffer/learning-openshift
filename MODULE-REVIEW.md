# Module review (September 2026)

This is a source-level audit of the 30 lessons, their routes, quizzes, examples, and interactive controls. Every catalog entry has a page, matching completion ID, and four quiz questions with valid answer indexes. Literal links between modules resolve. ESLint and TypeScript pass. These checks do **not** prove every control works in a browser or that every example can be applied to a live cluster. A production build could not finish in this Windows environment: the existing `.next/trace` was inaccessible, and a retry using a separate output directory failed when Next.js tried to spawn a process (`EPERM`).

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
