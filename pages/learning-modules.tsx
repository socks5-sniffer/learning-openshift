import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

// Module data with icons and descriptions
const modules = {
  foundation: [
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
  architecture: [
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
  core: [
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
  scheduling: [
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
  storage: [
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
      description: 'When stateless isn\'t an option - databases in Kubernetes (carefully)',
      icon: '🎲',
    },
  ],
  networking: [
    {
      id: '6-1',
      title: 'Kubernetes Networking Model',
      description: 'Pod-to-Pod communication, no NAT, and CNI plugins explained simply',
      icon: '🔌',
    },
    {
      id: '6-2',
      title: 'Ingress',
      description: 'What Ingress is (and isn\'t), controllers, TLS termination, and real-world traffic flow',
      icon: '🚪',
    },
  ],
  security: [
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
  observability: [
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
  cicd: [
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
  reality: [
    {
      id: '10-1',
      title: 'Common Failure Scenarios',
      description: 'Crash loops, misconfigured probes, resource exhaustion, and DNS issues',
      icon: '🔥',
    },
    {
      id: '10-2',
      title: 'Managed Kubernetes',
      description: 'EKS, GKE, AKS, OpenShift - what they handle and what they don\'t',
      icon: '☁️',
    },
    {
      id: '10-3',
      title: 'When to Say "No" to Kubernetes',
      description: 'Simpler alternatives and cost/complexity trade-offs',
      icon: '🚫',
    },
  ],
};

export default function LearningModules() {
  const [showArrow, setShowArrow] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setShowArrow(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.container} style={{ position: 'relative' }}>
      <Head>
        <title>Learning Modules</title>
        <meta name="description" content="Kubernetes: A Friendly, Slightly Sarcastic Introduction" />
      </Head>
      
      {/* Home link in top right */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 30,
        zIndex: 10
      }}>
        <Link href="/" legacyBehavior>
          <a style={{
            textDecoration: 'none',
            color: '#636060ff',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            background: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>← Home</a>
        </Link>
      </div>

      <main className={styles.main} style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 className={styles.title}>Kubernetes: A Deep-Dive</h1>
        
        <section className={styles.spotlight}>
          <h2>What is Kubernetes?</h2>
          <p>Kubernetes (often abbreviated as K8s, because engineers hate typing but love complexity) is a system for running applications at scale—whether that scale is "three users and a dream" or "half the internet."</p>
          <p>At its core, Kubernetes answers questions developers used to avoid:</p>
          <ul>
            <li>What happens when my app crashes?</li>
            <li>How do I run five copies of it?</li>
            <li>How do I update it without everything catching fire?</li>
            <li>Why does this YAML hate me?</li>
          </ul>
          <p>This tutorial is about exactly that. Learn by building things that fail in interesting ways, then understanding why.</p>
        </section>

        {/* Search Bar */}
        <div style={{ marginBottom: '2rem', marginTop: '2rem' }}>
          <input
            type="text"
            placeholder="🔍 Search modules (e.g., 'Security', 'Pods', 'Networking')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              fontSize: '1rem',
              borderRadius: '12px',
              border: '2px solid #e2e8f0',
              outline: 'none',
              transition: 'all 0.2s ease',
              background: 'white',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#636060ff';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
            }}
          />
        </div>

        {/* Section 1: Foundation */}
        {(() => {
          const filtered = modules.foundation.filter(m => 
            m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
          if (filtered.length === 0) return null;
          return (
            <>
              <div className="section-header">
                <h2>🏛️ Part 0: The Foundation</h2>
                <p>Before Kubernetes makes sense - understanding containers and the problems we're solving</p>
              </div>
              <div className="module-grid">
                {filtered.map((module) => (
            <Link key={module.id} href={`/module-${module.id}`} legacyBehavior>
              <a className="module-card">
                <div className="module-card-icon">{module.icon}</div>
                <h3 className="module-card-title">{module.title}</h3>
                <p className="module-card-description">{module.description}</p>
                <span className="module-card-status status-foundation">Foundation</span>
              </a>
            </Link>
          ))}
              </div>
            </>
          );
        })()}

        {/* Section 2: Architecture */}
        {(() => {
          const filtered = modules.architecture.filter(m => 
            m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
          if (filtered.length === 0) return null;
          return (
            <>
              <div className="section-header">
                <h2>🏗️ Part 1: Architecture</h2>
                <p>The big picture - how Kubernetes actually works under the hood</p>
              </div>
              <div className="module-grid">
                {filtered.map((module) => (
            <Link key={module.id} href={`/module-${module.id}`} legacyBehavior>
              <a className="module-card">
                <div className="module-card-icon">{module.icon}</div>
                <h3 className="module-card-title">{module.title}</h3>
                <p className="module-card-description">{module.description}</p>
                <span className="module-card-status status-architecture">Architecture</span>
              </a>
            </Link>
          ))}
              </div>
            </>
          );
        })()}

        {/* Section 3: Core Concepts */}
        {(() => {
          const filtered = modules.core.filter(m => 
            m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
          if (filtered.length === 0) return null;
          return (
            <>
              <div className="section-header">
                <h2>📦 Parts 2-3: Core Concepts</h2>
                <p>The vocabulary of Kubernetes - Pods, Deployments, Services, Config, and Secrets</p>
              </div>
              <div className="module-grid">
                {filtered.map((module) => (
            <Link key={module.id} href={`/module-${module.id}`} legacyBehavior>
              <a className="module-card">
                <div className="module-card-icon">{module.icon}</div>
                <h3 className="module-card-title">{module.title}</h3>
                <p className="module-card-description">{module.description}</p>
                <span className="module-card-status status-core">Core</span>
              </a>
            </Link>
          ))}
              </div>
            </>
          );
        })()}

        {/* Section 4: Scheduling & Resources */}
        {(() => {
          const filtered = modules.scheduling.filter(m => 
            m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
          if (filtered.length === 0) return null;
          return (
            <>
              <div className="section-header">
                <h2>⚙️ Part 4: Scheduling & Resources</h2>
                <p>Making Kubernetes smart about where and how to run your workloads</p>
              </div>
              <div className="module-grid">
                {filtered.map((module) => (
            <Link key={module.id} href={`/module-${module.id}`} legacyBehavior>
              <a className="module-card">
                <div className="module-card-icon">{module.icon}</div>
                <h3 className="module-card-title">{module.title}</h3>
                <p className="module-card-description">{module.description}</p>
                <span className="module-card-status status-advanced">Advanced</span>
              </a>
            </Link>
          ))}
              </div>
            </>
          );
        })()}

        {/* Section 5: Storage */}
        {(() => {
          const filtered = modules.storage.filter(m => 
            m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
          if (filtered.length === 0) return null;
          return (
            <>
              <div className="section-header">
                <h2>💾 Part 5: Storage</h2>
                <p>Data is always the hard part - handling state in Kubernetes</p>
              </div>
              <div className="module-grid">
                {filtered.map((module) => (
            <Link key={module.id} href={`/module-${module.id}`} legacyBehavior>
              <a className="module-card">
                <div className="module-card-icon">{module.icon}</div>
                <h3 className="module-card-title">{module.title}</h3>
                <p className="module-card-description">{module.description}</p>
                <span className="module-card-status status-advanced">Advanced</span>
              </a>
            </Link>
          ))}
              </div>
            </>
          );
        })()}

        {/* Section 6: Networking */}
        {(() => {
          const filtered = modules.networking.filter(m => 
            m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
          if (filtered.length === 0) return null;
          return (
            <>
              <div className="section-header">
                <h2>🌐 Part 6: Networking Deep Dive</h2>
                <p>How Pods talk to each other and the outside world</p>
              </div>
              <div className="module-grid">
                {filtered.map((module) => (
            <Link key={module.id} href={`/module-${module.id}`} legacyBehavior>
              <a className="module-card">
                <div className="module-card-icon">{module.icon}</div>
                <h3 className="module-card-title">{module.title}</h3>
                <p className="module-card-description">{module.description}</p>
                <span className="module-card-status status-advanced">Advanced</span>
              </a>
            </Link>
          ))}
              </div>
            </>
          );
        })()}

        {/* Section 7: Security */}
        {(() => {
          const filtered = modules.security.filter(m => 
            m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
          if (filtered.length === 0) return null;
          return (
            <>
              <div className="section-header">
                <h2>🔒 Part 7: Security</h2>
                <p>Where adults start paying attention - keeping your cluster safe</p>
              </div>
              <div className="module-grid">
                {filtered.map((module) => (
            <Link key={module.id} href={`/module-${module.id}`} legacyBehavior>
              <a className="module-card">
                <div className="module-card-icon">{module.icon}</div>
                <h3 className="module-card-title">{module.title}</h3>
                <p className="module-card-description">{module.description}</p>
                <span className="module-card-status status-advanced">Advanced</span>
              </a>
            </Link>
          ))}
              </div>
            </>
          );
        })()}

        {/* Section 8: Observability */}
        {(() => {
          const filtered = modules.observability.filter(m => 
            m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
          if (filtered.length === 0) return null;
          return (
            <>
              <div className="section-header">
                <h2>📊 Part 8: Observability & Debugging</h2>
                <p>Understanding what's happening and fixing what's broken</p>
              </div>
              <div className="module-grid">
                {filtered.map((module) => (
            <Link key={module.id} href={`/module-${module.id}`} legacyBehavior>
              <a className="module-card">
                <div className="module-card-icon">{module.icon}</div>
                <h3 className="module-card-title">{module.title}</h3>
                <p className="module-card-description">{module.description}</p>
                <span className="module-card-status status-advanced">Advanced</span>
              </a>
            </Link>
          ))}
              </div>
            </>
          );
        })()}

        {/* Section 9: CI/CD */}
        {(() => {
          const filtered = modules.cicd.filter(m => 
            m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
          if (filtered.length === 0) return null;
          return (
            <>
              <div className="section-header">
                <h2>🚀 Part 9: CI/CD & GitOps</h2>
                <p>Deploying to Kubernetes the professional way</p>
              </div>
              <div className="module-grid">
                {filtered.map((module) => (
            <Link key={module.id} href={`/module-${module.id}`} legacyBehavior>
              <a className="module-card">
                <div className="module-card-icon">{module.icon}</div>
                <h3 className="module-card-title">{module.title}</h3>
                <p className="module-card-description">{module.description}</p>
                <span className="module-card-status status-advanced">Advanced</span>
              </a>
            </Link>
          ))}
              </div>
            </>
          );
        })()}

        {/* Section 10: Reality Check */}
        {(() => {
          const filtered = modules.reality.filter(m => 
            m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
          if (filtered.length === 0) return null;
          return (
            <>
              <div className="section-header">
                <h2>🔥 Part 10: Real-World Kubernetes</h2>
                <p>The truth about running Kubernetes in production</p>
              </div>
              <div className="module-grid">
                {filtered.map((module) => (
            <Link key={module.id} href={`/module-${module.id}`} legacyBehavior>
              <a className="module-card">
                <div className="module-card-icon">{module.icon}</div>
                <h3 className="module-card-title">{module.title}</h3>
                <p className="module-card-description">{module.description}</p>
                <span className="module-card-status status-advanced">Advanced</span>
              </a>
            </Link>
          ))}
              </div>
            </>
          );
        })()}
      </main>

      {/* Back to top arrow */}
      {showArrow && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            width: 50,
            height: 50,
            borderRadius: '50%',
            border: 'none',
            background: '#636060ff',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ↑
        </button>
      )}
    </div>
  );
}
