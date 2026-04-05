import Head from 'next/head';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function LearningModules() {
  // 1. The Data: "The Database of Truth"
  // kept inside the component for simplicity, can be moved to a separate file later
  const modules = [
    {
      title: "Part 0: Foundations (Before Kubernetes Makes Sense)",
      id: "part-0",
      topics: [
        { title: "0.1 Why Kubernetes Exists", points: ["The problem K8s solves", "Monoliths vs microservices", "Pets vs cattle", "When K8s is overkill"] },
        { title: "0.2 Containers 101", points: ["Container vs VM (See Diagram)", "Images vs containers", "Why 'it works on my machine' is a crime", "Building a simple container"] }
      ]
    },
    {
      title: "Part 1: Kubernetes Architecture (The Big Picture)",
      id: "part-1",
      topics: [
        { title: "1.1 The Cluster", points: ["Nodes", "Control plane vs worker nodes", "Cluster as a promise"] },
        { title: "1.2 Control Plane", points: ["API Server (Front door)", "etcd (The brain)", "Scheduler", "Controller Manager"] },
        { title: "1.3 Worker Node", points: ["kubelet", "container runtime", "kube-proxy"] },
        { title: "Key Lesson", points: ["Everything talks to the API server. Even Kubernetes itself."] }
      ]
    },
    {
      title: "Part 2: Core Objects (The Vocabulary)",
      id: "part-2",
      topics: [
        { title: "2.1 Pods", points: ["Smallest unit of pain", "Single vs multi-container", "Why you never create Pods directly"] },
        { title: "2.2 Controllers", points: ["ReplicaSets", "Deployments (Best Friend)", "Rolling updates"] },
        { title: "2.3 Services", points: ["ClusterIP, NodePort, LoadBalancer", "Service Discovery", "Ephemeral IPs"] }
      ]
    },
    {
      title: "Part 3: Configuration & Secrets",
      id: "part-3",
      topics: [
        { title: "3.1 ConfigMaps", points: ["Config vs Code", "Env vars strategy"] },
        { title: "3.2 Secrets", points: ["Base64 is NOT encryption", "External secret stores"] },
        { title: "3.3 Environments", points: ["Dev/Stage/Prod parity", "Drift detection"] }
      ]
    },
    {
      title: "Part 4: Scheduling & Resources",
      id: "part-4",
      topics: [
        { title: "4.1 Resources", points: ["Requests vs Limits", "The OOMKill", "Fairness"] },
        { title: "4.2 Scheduling", points: ["Labels/Selectors", "Taints/Tolerations", "Affinity"] },
        { title: "4.3 Autoscaling", points: ["HPA", "Metrics Server"] }
      ]
    },
    {
      title: "Part 5: Storage",
      id: "part-5",
      topics: [
        { title: "5.1 Volumes", points: ["Ephemeral storage", "The disposable mindset"] },
        { title: "5.2 Persistence", points: ["PVs and PVCs", "StorageClasses", "Dynamic Provisioning"] },
        { title: "5.3 StatefulSets", points: ["Databases in K8s", "Stable Network IDs"] }
      ]
    },
    {
      title: "Part 6: Networking",
      id: "part-6",
      topics: [
        { title: "6.1 The Model", points: ["Flat network", "Pod-to-Pod", "CNI Plugins"] },
        { title: "6.2 Ingress", points: ["Ingress Controllers", "TLS Termination", "Routing Rules"] }
      ]
    },
    {
      title: "Part 7: Security",
      id: "part-7",
      topics: [
        { title: "7.1 RBAC", points: ["ServiceAccounts", "Roles/Bindings", "Least Privilege"] },
        { title: "7.2 Pod Security", points: ["SecurityContext", "Privileged containers (Don't do it)"] },
        { title: "7.3 Network Policies", points: ["Firewalling the cluster", "Deny-all default"] }
      ]
    },
    {
      title: "Part 8: Observability",
      id: "part-8",
      topics: [
        { title: "8.1 Logging", points: ["stdout/stderr", "Log aggregation"] },
        { title: "8.2 Monitoring", points: ["Prometheus", "Grafana", "Alert fatigue"] },
        { title: "8.3 Debugging", points: ["kubectl exec/logs/describe", "Event analysis"] }
      ]
    },
    {
      title: "Part 9: CI/CD & GitOps",
      id: "part-9",
      topics: [
        { title: "9.1 Deployment", points: ["Image tagging", "Immutability"] },
        { title: "9.2 GitOps", points: ["ArgoCD", "Flux", "Git as source of truth"] }
      ]
    },
    {
      title: "Part 10: Real World",
      id: "part-10",
      topics: [
        { title: "10.1 Failures", points: ["CrashLoopBackOff", "DNS Latency", "Node pressure"] },
        { title: "10.2 Managed K8s", points: ["Cloud providers", "Shared responsibility model"] },
        { title: "10.3 Reality Check", points: ["When to use Serverless instead", "Cost analysis"] }
      ]
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Learning Modules | K8s</title>
        <meta name="description" content="Kubernetes: A Friendly, Slightly Sarcastic Introduction" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Kubernetes: A Deep-Dive</h1>

        {/* SECTION 1: The Intro (Static) */}
        <section className={styles.spotlight}>
          <h2>What is Kubernetes?</h2>
          <p>
            Kubernetes (often abbreviated as K8s, because engineers hate typing but love complexity) is a system for running applications at scale—whether that scale is “three users and a dream” or “half the internet.”
          </p>
          <p>At its core, Kubernetes answers questions developers used to avoid:</p>
          <ul>
            <li>What happens when my app crashes?</li>
            <li>How do I run five copies of it?</li>
            <li>How do I update it without everything catching fire?</li>
            <li>Why does this YAML hate me?</li>
          </ul>
          <p>
            Before Kubernetes, deploying an app meant carefully SSH-ing into servers and whispering “please don’t break” before restarting services. Kubernetes replaces that with a declarative model: you describe what you want, and Kubernetes figures out how to make reality comply.
          </p>
          <p>
            This sounds magical. It is not magic. It is a large collection of well-designed components arguing with each other until your app runs.
          </p>
          <ul>
            <li>A container orchestrator</li>
            <li>A control plane for distributed systems</li>
            <li>A lesson in humility</li>
            <li>A career accelerator, if you survive long enough</li>
          </ul>
          <p>
            You don’t “install Kubernetes and relax.” You learn Kubernetes by building things that fail in interesting ways, then understanding why.
          </p>
        </section>

        {/* SECTION 2: The Curriculum (Dynamic) */}
        <section className={styles.spotlight}>
          <h2>The Curriculum</h2>
          <p className={styles.subtitle}>The following information will be updated as I learn...</p>
          
          <div className="curriculum-list">
            {modules.map((module) => (
              <details key={module.id} className={styles.moduleCard}>
                <summary className={styles.moduleHeader}>
                  <strong>{module.title}</strong>
                  <span className={styles.arrow}>▼</span>
                </summary>
                
                <div className={styles.moduleContent}>
                  {module.topics.map((topic, index) => (
                    <div key={index} className={styles.topicBlock}>
                      <h4>{topic.title}</h4>
                      <ul>
                        {topic.points.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}