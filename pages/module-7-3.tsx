import { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Module73() {
  const [selectedPod, setSelectedPod] = useState('frontend');
  const [policyEnabled, setPolicyEnabled] = useState(false);
  const [allowDNS, setAllowDNS] = useState(false);
  const [allowBackend, setAllowBackend] = useState(false);
  const [allowExternal, setAllowExternal] = useState(false);

  const pods = {
    frontend: {
      name: 'Frontend',
      color: '#3b82f6',
      needs: ['backend', 'dns', 'external'],
      description: 'Web server that talks to backend API'
    },
    backend: {
      name: 'Backend API',
      color: '#10b981',
      needs: ['database', 'dns'],
      description: 'Application server that queries database'
    },
    database: {
      name: 'Database',
      color: '#f59e0b',
      needs: ['dns'],
      description: 'PostgreSQL that should only accept connections from backend'
    }
  };

  const connections = {
    frontend: {
      backend: { allowed: policyEnabled ? allowBackend : true, critical: true },
      database: { allowed: policyEnabled ? false : true, critical: false },
      dns: { allowed: policyEnabled ? allowDNS : true, critical: true },
      external: { allowed: policyEnabled ? allowExternal : true, critical: true }
    },
    backend: {
      frontend: { allowed: policyEnabled ? false : true, critical: false },
      database: { allowed: policyEnabled ? true : true, critical: true },
      dns: { allowed: policyEnabled ? allowDNS : true, critical: true },
      external: { allowed: policyEnabled ? false : true, critical: false }
    },
    database: {
      frontend: { allowed: policyEnabled ? false : true, critical: false },
      backend: { allowed: policyEnabled ? false : true, critical: false },
      dns: { allowed: policyEnabled ? allowDNS : true, critical: true },
      external: { allowed: policyEnabled ? false : true, critical: false }
    }
  };

  const getConnectionCount = (pod: string) => {
    const conns = connections[pod as keyof typeof connections];
    const allowed = Object.values(conns).filter((c: any) => c.allowed).length;
    const total = Object.keys(conns).length;
    return { allowed, total };
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title} style={{ color: '#1e293b' }}>
          7.3 Network Policies
        </h1>

        <div style={{ marginBottom: '2rem' }}>
          <Link href="/module-7-2" legacyBehavior>
            <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              ← Previous: Pod Security
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/learning-modules" legacyBehavior>
            <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              All Modules
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/module-8-1" legacyBehavior>
            <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              Next: Logging →
            </a>
          </Link>
        </div>

        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#1e293b', maxWidth: '800px' }}>
          By default, any Pod can talk to any other Pod in your cluster. NetworkPolicies let you implement
          firewall rules—zero trust networking where every connection must be explicitly allowed. Essential
          for defense in depth.
        </p>

        <div style={{
          background: 'linear-gradient(to right, #fee2e2, #fecaca)',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '2rem',
          borderLeft: '4px solid #ef4444'
        }}>
          <p style={{ margin: 0, color: '#1e293b', lineHeight: '1.6' }}>
            <strong>The Default is Scary:</strong> Without NetworkPolicies, a compromised frontend Pod can
            directly connect to your database. An attacker in one Pod can scan the entire cluster. Zero
            segmentation. NetworkPolicies fix this.
          </p>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>How NetworkPolicies Work</h2>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b' }}>
          NetworkPolicies select Pods (via labels) and define allowed ingress (incoming) and egress (outgoing)
          connections. Once you apply <em>any</em> NetworkPolicy that selects a Pod, it becomes deny-by-default.
        </p>

        <div style={{
          background: '#f8fafc',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ marginTop: 0, color: '#1e293b' }}>The Selection Model</h3>
          <div style={{ fontSize: '1.05rem', color: '#1e293b', lineHeight: '1.8' }}>
            <strong>1. podSelector:</strong> Which Pods this policy applies to<br />
            <strong>2. policyTypes:</strong> Ingress, Egress, or both<br />
            <strong>3. ingress rules:</strong> Who can connect TO these Pods<br />
            <strong>4. egress rules:</strong> Where these Pods can connect TO
          </div>
        </div>

        <div style={{
          background: '#fef3c7',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          borderLeft: '4px solid #f59e0b'
        }}>
          <p style={{ margin: 0, color: '#1e293b', lineHeight: '1.6' }}>
            <strong>Critical:</strong> NetworkPolicies require a CNI plugin that supports them (Calico, Cilium,
            Weave). Flannel does NOT support NetworkPolicies by default. Check your CNI before relying on these!
          </p>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Interactive: Zero Trust Demo</h2>

        <div style={{
          background: '#f8fafc',
          padding: '2rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          border: '2px solid #e2e8f0'
        }}>
          <p style={{ color: '#1e293b', marginBottom: '1rem' }}>
            See how NetworkPolicies restrict traffic in a 3-tier application:
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={policyEnabled}
                onChange={(e) => setPolicyEnabled(e.target.checked)}
                style={{ width: '20px', height: '20px' }}
              />
              <span style={{ color: '#1e293b', fontWeight: 600 }}>
                Enable NetworkPolicies (Zero Trust)
              </span>
            </label>
          </div>

          {policyEnabled && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'white', borderRadius: '6px' }}>
              <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
                Configure Allowed Traffic:
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={allowDNS}
                  onChange={(e) => setAllowDNS(e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                <span style={{ color: '#1e293b' }}>Allow DNS (kube-system)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={allowBackend}
                  onChange={(e) => setAllowBackend(e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                <span style={{ color: '#1e293b' }}>Allow Frontend → Backend</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={allowExternal}
                  onChange={(e) => setAllowExternal(e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                <span style={{ color: '#1e293b' }}>Allow External (Internet)</span>
              </label>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {Object.entries(pods).map(([key, pod]) => {
              const { allowed, total } = getConnectionCount(key);
              return (
                <button
                  key={key}
                  onClick={() => setSelectedPod(key)}
                  style={{
                    padding: '1rem',
                    border: selectedPod === key ? `3px solid ${pod.color}` : '2px solid #cbd5e1',
                    borderRadius: '8px',
                    background: selectedPod === key ? `${pod.color}22` : 'white',
                    cursor: 'pointer',
                    flex: '1',
                    minWidth: '150px'
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
                    {pod.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    {allowed}/{total} connections
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{
            padding: '1.5rem',
            background: 'white',
            borderRadius: '8px',
            border: `3px solid ${pods[selectedPod].color}`
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>
              {pods[selectedPod].name}
            </h4>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              {pods[selectedPod].description}
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem' }}>
                Outgoing Connections:
              </div>
              {Object.entries(connections[selectedPod as keyof typeof connections]).map(([target, info]: [string, any]) => (
                <div
                  key={target}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    background: info.allowed ? '#f0fdf4' : '#fef2f2',
                    border: `2px solid ${info.allowed ? '#10b981' : '#ef4444'}`,
                    borderRadius: '6px'
                  }}
                >
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: info.allowed ? '#10b981' : '#ef4444'
                  }}>
                    {info.allowed ? '✓' : '✗'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>
                      → {target}
                    </div>
                    {!info.allowed && info.critical && (
                      <div style={{ fontSize: '0.85rem', color: '#ef4444', marginTop: '0.25rem' }}>
                        ⚠️ This connection is required for the app to work!
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {policyEnabled && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '6px'
              }}>
                <strong style={{ color: '#1e293b' }}>NetworkPolicy Applied:</strong>
                <span style={{ color: '#1e293b', marginLeft: '0.5rem' }}>
                  {!allowDNS && 'DNS blocked! '}
                  {selectedPod === 'frontend' && !allowBackend && 'Backend blocked! '}
                  {selectedPod === 'frontend' && !allowExternal && 'Internet blocked! '}
                  {allowDNS && (selectedPod !== 'frontend' || allowBackend) && 'Connections restricted to minimum required.'}
                </span>
              </div>
            )}
          </div>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Basic NetworkPolicy Examples</h2>

        <div style={{ marginTop: '1.5rem' }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Example 1: Deny All (Starting Point)</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6' }}>
              Apply this first to make the namespace deny-by-default. Then add allow rules.
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: '#1e293b',
              color: '#10b981',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflowX: 'auto'
            }}>
              {"apiVersion: networking.k8s.io/v1"}<br />
              {"kind: NetworkPolicy"}<br />
              {"metadata:"}<br />
              {"  name: deny-all"}<br />
              {"  namespace: production"}<br />
              {"spec:"}<br />
              {"  podSelector: {}  # Selects all Pods"}<br />
              {"  policyTypes:"}<br />
              {"  - Ingress"}<br />
              {"  - Egress"}<br />
              {"  # No ingress or egress rules = deny all"}
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Example 2: Allow DNS</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6' }}>
              Without DNS, nothing works. Always allow egress to kube-system on port 53.
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: '#1e293b',
              color: '#10b981',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflowX: 'auto'
            }}>
              {"apiVersion: networking.k8s.io/v1"}<br />
              {"kind: NetworkPolicy"}<br />
              {"metadata:"}<br />
              {"  name: allow-dns"}<br />
              {"  namespace: production"}<br />
              {"spec:"}<br />
              {"  podSelector: {}  # All Pods"}<br />
              {"  policyTypes:"}<br />
              {"  - Egress"}<br />
              {"  egress:"}<br />
              {"  - to:"}<br />
              {"    - namespaceSelector:"}<br />
              {"        matchLabels:"}<br />
              {"          name: kube-system"}<br />
              {"    ports:"}<br />
              {"    - protocol: UDP"}<br />
              {"      port: 53"}<br />
              {"    - protocol: TCP"}<br />
              {"      port: 53"}
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Example 3: Frontend → Backend Only</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6' }}>
              Allow frontend Pods to connect to backend, but nothing else.
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: '#1e293b',
              color: '#10b981',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflowX: 'auto'
            }}>
              {"apiVersion: networking.k8s.io/v1"}<br />
              {"kind: NetworkPolicy"}<br />
              {"metadata:"}<br />
              {"  name: backend-allow-frontend"}<br />
              {"  namespace: production"}<br />
              {"spec:"}<br />
              {"  podSelector:"}<br />
              {"    matchLabels:"}<br />
              {"      app: backend"}<br />
              {"  policyTypes:"}<br />
              {"  - Ingress"}<br />
              {"  ingress:"}<br />
              {"  - from:"}<br />
              {"    - podSelector:"}<br />
              {"        matchLabels:"}<br />
              {"          app: frontend"}<br />
              {"    ports:"}<br />
              {"    - protocol: TCP"}<br />
              {"      port: 8080"}
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Example 4: Database Isolation</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6' }}>
              Database only accepts connections from backend, nowhere else.
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: '#1e293b',
              color: '#10b981',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflowX: 'auto'
            }}>
              {"apiVersion: networking.k8s.io/v1"}<br />
              {"kind: NetworkPolicy"}<br />
              {"metadata:"}<br />
              {"  name: db-allow-backend-only"}<br />
              {"  namespace: production"}<br />
              {"spec:"}<br />
              {"  podSelector:"}<br />
              {"    matchLabels:"}<br />
              {"      app: database"}<br />
              {"  policyTypes:"}<br />
              {"  - Ingress"}<br />
              {"  - Egress  # Deny all outgoing except DNS"}<br />
              {"  ingress:"}<br />
              {"  - from:"}<br />
              {"    - podSelector:"}<br />
              {"        matchLabels:"}<br />
              {"          app: backend"}<br />
              {"    ports:"}<br />
              {"    - protocol: TCP"}<br />
              {"      port: 5432"}<br />
              {"  egress:"}<br />
              {"  - to:"}<br />
              {"    - namespaceSelector:"}<br />
              {"        matchLabels:"}<br />
              {"          name: kube-system"}<br />
              {"    ports:"}<br />
              {"    - protocol: UDP"}<br />
              {"      port: 53"}
            </div>
          </div>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Advanced Selectors</h2>

        <div style={{ marginTop: '1.5rem' }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>CIDR Blocks (External IPs)</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6' }}>
              Allow egress to specific external IPs or ranges.
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: '#1e293b',
              color: '#10b981',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflowX: 'auto'
            }}>
              {"egress:"}<br />
              {"- to:"}<br />
              {"  - ipBlock:"}<br />
              {"      cidr: 0.0.0.0/0  # All internet"}<br />
              {"      except:"}<br />
              {"      - 10.0.0.0/8  # But not internal IPs"}<br />
              {"      - 172.16.0.0/12"}<br />
              {"      - 192.168.0.0/16"}
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Cross-Namespace Communication</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6' }}>
              Allow Pods in 'frontend' namespace to reach Pods in 'backend' namespace.
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: '#1e293b',
              color: '#10b981',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflowX: 'auto'
            }}>
              {"ingress:"}<br />
              {"- from:"}<br />
              {"  - namespaceSelector:"}<br />
              {"      matchLabels:"}<br />
              {"        name: frontend"}<br />
              {"    podSelector:"}<br />
              {"      matchLabels:"}<br />
              {"        app: web"}
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Multiple Rules (OR Logic)</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6' }}>
              Multiple items in the same rule are ANDed. Multiple rules are ORed.
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: '#1e293b',
              color: '#10b981',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflowX: 'auto'
            }}>
              {"ingress:"}<br />
              {"# Rule 1: Allow from frontend Pods"}<br />
              {"- from:"}<br />
              {"  - podSelector:"}<br />
              {"      matchLabels:"}<br />
              {"        app: frontend"}<br />
              {"# Rule 2: OR allow from monitoring namespace"}<br />
              {"- from:"}<br />
              {"  - namespaceSelector:"}<br />
              {"      matchLabels:"}<br />
              {"        name: monitoring"}
            </div>
          </div>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Testing NetworkPolicies</h2>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b' }}>
          NetworkPolicies fail silently—blocked connections just timeout. Use these techniques to debug:
        </p>

        <div style={{
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          background: '#1e293b',
          color: '#10b981',
          padding: '1rem',
          borderRadius: '6px',
          marginTop: '1rem',
          overflowX: 'auto'
        }}>
          {"# Test connectivity from a Pod"}<br />
          kubectl run test --rm -it --image=nicolaka/netshoot -- bash<br />
          <br />
          {"# Inside the Pod:"}<br />
          curl http://backend-service:8080  # Should work or timeout<br />
          dig backend-service.production.svc.cluster.local  # Test DNS<br />
          nc -zv backend-service 8080  # Test TCP connection<br />
          <br />
          {"# Check if NetworkPolicy exists"}<br />
          kubectl get networkpolicy -n production<br />
          kubectl describe networkpolicy backend-allow-frontend<br />
          <br />
          {"# View CNI plugin logs (Calico example)"}<br />
          kubectl logs -n kube-system -l k8s-app=calico-node
        </div>

        <div style={{
          background: '#dbeafe',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          borderLeft: '4px solid #3b82f6'
        }}>
          <p style={{ margin: 0, color: '#1e293b', lineHeight: '1.6' }}>
            <strong>Pro Tip:</strong> Start with <code style={{ background: 'white', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>policyTypes: [Ingress]</code> only.
            Get ingress rules working before adding egress rules. Egress + DNS issues are painful to debug.
          </p>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Real-World Pattern: 3-Tier App</h2>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b' }}>
          Here's a complete NetworkPolicy setup for a typical web app:
        </p>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          border: '2px solid #e2e8f0'
        }}>
          <h4 style={{ marginTop: 0, color: '#1e293b' }}>Architecture</h4>
          <div style={{ fontSize: '1.05rem', color: '#1e293b', lineHeight: '1.8' }}>
            <strong>Internet</strong> → Ingress → <strong>Frontend</strong> → <strong>Backend</strong> → <strong>Database</strong>
          </div>
        </div>

        <div style={{
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          background: '#1e293b',
          color: '#10b981',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1rem',
          overflowX: 'auto'
        }}>
          {"---"}<br />
          {"# 1. Deny all by default"}<br />
          {"apiVersion: networking.k8s.io/v1"}<br />
          {"kind: NetworkPolicy"}<br />
          {"metadata:"}<br />
          {"  name: deny-all"}<br />
          {"spec:"}<br />
          {"  podSelector: {}"}<br />
          {"  policyTypes: [Ingress, Egress]"}<br />
          <br />
          {"---"}<br />
          {"# 2. Allow DNS for everyone"}<br />
          {"apiVersion: networking.k8s.io/v1"}<br />
          {"kind: NetworkPolicy"}<br />
          {"metadata:"}<br />
          {"  name: allow-dns"}<br />
          {"spec:"}<br />
          {"  podSelector: {}"}<br />
          {"  policyTypes: [Egress]"}<br />
          {"  egress:"}<br />
          {"  - to:"}<br />
          {"    - namespaceSelector:"}<br />
          {"        matchLabels: {name: kube-system}"}<br />
          {"    ports:"}<br />
          {"    - {protocol: UDP, port: 53}"}<br />
          <br />
          {"---"}<br />
          {"# 3. Frontend: Allow from Ingress, allow to Backend"}<br />
          {"apiVersion: networking.k8s.io/v1"}<br />
          {"kind: NetworkPolicy"}<br />
          {"metadata:"}<br />
          {"  name: frontend-policy"}<br />
          {"spec:"}<br />
          {"  podSelector:"}<br />
          {"    matchLabels: {app: frontend}"}<br />
          {"  policyTypes: [Ingress, Egress]"}<br />
          {"  ingress:"}<br />
          {"  - from:"}<br />
          {"    - namespaceSelector:"}<br />
          {"        matchLabels: {name: ingress-nginx}"}<br />
          {"    ports:"}<br />
          {"    - {protocol: TCP, port: 80}"}<br />
          {"  egress:"}<br />
          {"  - to:"}<br />
          {"    - podSelector:"}<br />
          {"        matchLabels: {app: backend}"}<br />
          {"    ports:"}<br />
          {"    - {protocol: TCP, port: 8080}"}<br />
          <br />
          {"---"}<br />
          {"# 4. Backend: Allow from Frontend, allow to Database"}<br />
          {"apiVersion: networking.k8s.io/v1"}<br />
          {"kind: NetworkPolicy"}<br />
          {"metadata:"}<br />
          {"  name: backend-policy"}<br />
          {"spec:"}<br />
          {"  podSelector:"}<br />
          {"    matchLabels: {app: backend}"}<br />
          {"  policyTypes: [Ingress, Egress]"}<br />
          {"  ingress:"}<br />
          {"  - from:"}<br />
          {"    - podSelector:"}<br />
          {"        matchLabels: {app: frontend}"}<br />
          {"    ports:"}<br />
          {"    - {protocol: TCP, port: 8080}"}<br />
          {"  egress:"}<br />
          {"  - to:"}<br />
          {"    - podSelector:"}<br />
          {"        matchLabels: {app: database}"}<br />
          {"    ports:"}<br />
          {"    - {protocol: TCP, port: 5432}"}<br />
          <br />
          {"---"}<br />
          {"# 5. Database: Allow from Backend only"}<br />
          {"apiVersion: networking.k8s.io/v1"}<br />
          {"kind: NetworkPolicy"}<br />
          {"metadata:"}<br />
          {"  name: database-policy"}<br />
          {"spec:"}<br />
          {"  podSelector:"}<br />
          {"    matchLabels: {app: database}"}<br />
          {"  policyTypes: [Ingress]"}<br />
          {"  ingress:"}<br />
          {"  - from:"}<br />
          {"    - podSelector:"}<br />
          {"        matchLabels: {app: backend}"}<br />
          {"    ports:"}<br />
          {"    - {protocol: TCP, port: 5432}"}
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Common Gotchas</h2>

        <div style={{ marginTop: '1.5rem' }}>
          <div style={{
            background: '#fef2f2',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            borderLeft: '4px solid #ef4444'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Gotcha 1: Forgetting DNS</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
              If you apply an egress policy without allowing DNS, service discovery breaks. Always allow
              egress to kube-system on UDP/TCP port 53.
            </p>
          </div>

          <div style={{
            background: '#fef2f2',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            borderLeft: '4px solid #ef4444'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Gotcha 2: Label Mismatches</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
              NetworkPolicies use label selectors. If your Pod labels don't match, the policy won't apply.
              Use <code style={{ background: 'white', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>kubectl get pods --show-labels</code> to
              verify.
            </p>
          </div>

          <div style={{
            background: '#fef2f2',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            borderLeft: '4px solid #ef4444'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Gotcha 3: CNI Plugin Doesn't Support It</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
              Flannel doesn't support NetworkPolicies. If you're using Flannel, you need to add Calico
              (Canal = Flannel + Calico) or switch to a different CNI entirely.
            </p>
          </div>

          <div style={{
            background: '#fef2f2',
            padding: '1.5rem',
            borderRadius: '8px',
            borderLeft: '4px solid #ef4444'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Gotcha 4: Policies Are Additive</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
              Multiple NetworkPolicies that select the same Pod are combined (ORed). You can't "deny"
              with one policy after "allowing" with another. To deny, simply don't create an allow rule.
            </p>
          </div>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Monitoring & Auditing</h2>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b' }}>
          How do you know if your NetworkPolicies are working? Use these tools:
        </p>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1rem',
          border: '1px solid #e2e8f0'
        }}>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#1e293b', lineHeight: '1.8' }}>
            <li>
              <strong>Calico:</strong> <code style={{ background: '#f1f5f9', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>calicoctl get networkpolicy -o yaml</code>
            </li>
            <li>
              <strong>Cilium:</strong> Hubble UI for real-time flow visualization
            </li>
            <li>
              <strong>Weave:</strong> Weave Scope shows network connections graphically
            </li>
            <li>
              <strong>Generic:</strong> Enable audit logging and grep for "NetworkPolicy" events
            </li>
          </ul>
        </div>

        <div style={{
          background: 'linear-gradient(to right, #fef3c7, #fde68a)',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '2rem',
          borderLeft: '4px solid #f59e0b'
        }}>
          <p style={{ margin: 0, color: '#1e293b', lineHeight: '1.6' }}>
            <strong>Remember:</strong> NetworkPolicies are your firewall inside the cluster. Start with
            deny-all, then explicitly allow what's needed. This is zero trust: every connection is denied
            unless proven necessary. Combined with RBAC and Pod Security, you've got defense in depth.
          </p>
        </div>

        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/module-7-2" legacyBehavior>
            <a style={{ color: '#9c0606ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              ← Previous: Pod Security
            </a>
          </Link>
          <Link href="/learning-modules" legacyBehavior>
            <a style={{
              background: '#9c0606ff',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: 600
            }}>
              Complete Part 7 →
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
}
