// Single source of truth for the module catalog.
// Used by the module list page, the landing page, and the progress system.

export interface ModuleInfo {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface SectionInfo {
  key: string;
  heading: string;
  blurb: string;
  badgeLabel: string;
  badgeClass: string;
  modules: ModuleInfo[];
}

export const sections: SectionInfo[] = [
  {
    key: 'foundation',
    heading: '🏛️ Part 0: The Foundation',
    blurb: "Before Kubernetes makes sense - understanding containers and the problems we're solving",
    badgeLabel: 'Foundation',
    badgeClass: 'status-foundation',
    modules: [
      {
        id: '0-1',
        title: 'Why Kubernetes Exists',
        description: 'The problem Kubernetes solves, monoliths vs microservices, and when Kubernetes is overkill',
        icon: '🎯',
      },
      {
        id: '0-2',
        title: 'Containers 101',
        description: 'Just enough Docker - what containers are, images vs containers, and why "it works on my machine" is a crime',
        icon: '🐳',
      },
    ],
  },
  {
    key: 'architecture',
    heading: '🏗️ Part 1: Architecture',
    blurb: 'The big picture - how Kubernetes actually works under the hood',
    badgeLabel: 'Architecture',
    badgeClass: 'status-architecture',
    modules: [
      {
        id: '1-1',
        title: 'What Is a Kubernetes Cluster?',
        description: 'Nodes, control plane vs worker nodes, and the cluster as a promise',
        icon: '🏗️',
      },
      {
        id: '1-2',
        title: 'Control Plane Components',
        description: 'API Server, etcd, Scheduler, and Controller Manager - the brains of the operation',
        icon: '🧠',
      },
      {
        id: '1-3',
        title: 'Worker Node Components',
        description: 'kubelet, container runtime, and kube-proxy - where the work happens',
        icon: '⚙️',
      },
    ],
  },
  {
    key: 'core',
    heading: '📦 Parts 2-3: Core Concepts',
    blurb: 'The vocabulary of Kubernetes - Pods, Deployments, Services, Config, and Secrets',
    badgeLabel: 'Core',
    badgeClass: 'status-core',
    modules: [
      {
        id: '2-1',
        title: 'Pods',
        description: 'The smallest unit of pain - what a Pod really is and why you almost never create them directly',
        icon: '📦',
      },
      {
        id: '2-2',
        title: 'ReplicaSets & Deployments',
        description: 'Desired state, scaling, rolling updates, and why Deployments are your best friend',
        icon: '🔄',
      },
      {
        id: '2-3',
        title: 'Services',
        description: 'Networking without tears - ClusterIP, NodePort, LoadBalancer, and ephemeral IPs',
        icon: '🌐',
      },
      {
        id: '3-1',
        title: 'ConfigMaps',
        description: 'Separating config from code - environment variables vs mounted files',
        icon: '⚙️',
      },
      {
        id: '3-2',
        title: 'Secrets',
        description: 'What Kubernetes Secrets are (and are not) - Base64 ≠ encryption',
        icon: '🔒',
      },
      {
        id: '3-3',
        title: 'Environment Strategy',
        description: 'Dev vs staging vs production, and avoiding configuration drift',
        icon: '🌍',
      },
    ],
  },
  {
    key: 'scheduling',
    heading: '⚙️ Part 4: Scheduling & Resources',
    blurb: 'Making Kubernetes smart about where and how to run your workloads',
    badgeLabel: 'Advanced',
    badgeClass: 'status-advanced',
    modules: [
      {
        id: '4-1',
        title: 'Resource Requests & Limits',
        description: 'CPU and memory basics, why your Pod gets OOMKilled, and fairness',
        icon: '⚖️',
      },
      {
        id: '4-2',
        title: 'Node Scheduling',
        description: 'Labels, selectors, taints, tolerations, affinity, and anti-affinity',
        icon: '🎯',
      },
      {
        id: '4-3',
        title: 'Horizontal Pod Autoscaling',
        description: 'Metrics-based scaling - when autoscaling helps and when it lies',
        icon: '📈',
      },
    ],
  },
  {
    key: 'storage',
    heading: '💾 Part 5: Storage',
    blurb: 'Data is always the hard part - handling state in Kubernetes',
    badgeLabel: 'Advanced',
    badgeClass: 'status-advanced',
    modules: [
      {
        id: '5-1',
        title: 'Volumes',
        description: 'Ephemeral vs persistent storage - why containers are disposable',
        icon: '💾',
      },
      {
        id: '5-2',
        title: 'PersistentVolumes & Claims',
        description: 'Abstracting storage, dynamic provisioning, and StorageClasses',
        icon: '🗄️',
      },
      {
        id: '5-3',
        title: 'StatefulSets',
        description: "When stateless isn't an option - databases in Kubernetes (carefully)",
        icon: '🎲',
      },
    ],
  },
  {
    key: 'networking',
    heading: '🌐 Part 6: Networking Deep Dive',
    blurb: 'How Pods talk to each other and the outside world',
    badgeLabel: 'Advanced',
    badgeClass: 'status-advanced',
    modules: [
      {
        id: '6-1',
        title: 'Kubernetes Networking Model',
        description: 'Pod-to-Pod communication, no NAT, and CNI plugins explained simply',
        icon: '🔌',
      },
      {
        id: '6-2',
        title: 'Ingress',
        description: "What Ingress is (and isn't), controllers, TLS termination, and real-world traffic flow",
        icon: '🚪',
      },
    ],
  },
  {
    key: 'security',
    heading: '🔒 Part 7: Security',
    blurb: 'Where adults start paying attention - keeping your cluster safe',
    badgeLabel: 'Advanced',
    badgeClass: 'status-advanced',
    modules: [
      {
        id: '7-1',
        title: 'RBAC',
        description: 'Users vs ServiceAccounts, Roles and RoleBindings, and least privilege in practice',
        icon: '🔐',
      },
      {
        id: '7-2',
        title: 'Pod Security',
        description: 'SecurityContext, Pod Security Standards, and why "privileged" is scary',
        icon: '🛡️',
      },
      {
        id: '7-3',
        title: 'Network Policies',
        description: 'Zero trust inside the cluster and blocking east-west traffic',
        icon: '🚧',
      },
    ],
  },
  {
    key: 'observability',
    heading: '📊 Part 8: Observability & Debugging',
    blurb: "Understanding what's happening and fixing what's broken",
    badgeLabel: 'Advanced',
    badgeClass: 'status-advanced',
    modules: [
      {
        id: '8-1',
        title: 'Logging',
        description: 'stdout/stderr philosophy and centralized logging patterns',
        icon: '📝',
      },
      {
        id: '8-2',
        title: 'Monitoring',
        description: 'Metrics, Prometheus basics, and what to alert on (and what not to)',
        icon: '📊',
      },
      {
        id: '8-3',
        title: 'Debugging Kubernetes',
        description: 'kubectl describe, logs, exec, and reading events like a crime scene',
        icon: '🔍',
      },
    ],
  },
  {
    key: 'cicd',
    heading: '🚀 Part 9: CI/CD & GitOps',
    blurb: 'Deploying to Kubernetes the professional way',
    badgeLabel: 'Advanced',
    badgeClass: 'status-advanced',
    modules: [
      {
        id: '9-1',
        title: 'Deploying the Right Way',
        description: 'Image tagging strategies and immutable deployments',
        icon: '🚀',
      },
      {
        id: '9-2',
        title: 'GitOps',
        description: 'Declarative infrastructure, Argo CD / Flux, and Git as source of truth',
        icon: '🔀',
      },
    ],
  },
  {
    key: 'reality',
    heading: '🔥 Part 10: Real-World Kubernetes',
    blurb: 'The truth about running Kubernetes in production',
    badgeLabel: 'Advanced',
    badgeClass: 'status-advanced',
    modules: [
      {
        id: '10-1',
        title: 'Common Failure Scenarios',
        description: 'Crash loops, misconfigured probes, resource exhaustion, and DNS issues',
        icon: '🔥',
      },
      {
        id: '10-2',
        title: 'Managed Kubernetes',
        description: "EKS, GKE, AKS, OpenShift - what they handle and what they don't",
        icon: '☁️',
      },
      {
        id: '10-3',
        title: 'When to Say "No" to Kubernetes',
        description: 'Simpler alternatives and cost/complexity trade-offs',
        icon: '🚫',
      },
    ],
  },
];

// Flattened, in curriculum order
export const allModules: ModuleInfo[] = sections.flatMap((s) => s.modules);

export const moduleCount = allModules.length;

export function getModuleById(id: string): ModuleInfo | undefined {
  return allModules.find((m) => m.id === id);
}
