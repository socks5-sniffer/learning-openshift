import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Module23() {
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [pods, setPods] = useState([
    { id: 1, ip: '10.244.1.5', healthy: true },
    { id: 2, ip: '10.244.1.6', healthy: true },
    { id: 3, ip: '10.244.1.7', healthy: true }
  ]);
  const serviceIP = '10.96.0.100';

  const simulateIPChange = () => {
    setSimulationRunning(true);
    // Simulate a pod crash and recreation
    setTimeout(() => {
      setPods(prev => prev.map(pod => 
        pod.id === 2 ? { ...pod, healthy: false } : pod
      ));
    }, 1000);

    setTimeout(() => {
      setPods(prev => prev.map(pod => 
        pod.id === 2 ? { ...pod, ip: '10.244.1.99', healthy: true } : pod
      ));
      setSimulationRunning(false);
    }, 2500);
  };

  const resetSimulation = () => {
    setPods([
      { id: 1, ip: '10.244.1.5', healthy: true },
      { id: 2, ip: '10.244.1.6', healthy: true },
      { id: 3, ip: '10.244.1.7', healthy: true }
    ]);
    setSimulationRunning(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Module 2.3: Services (Networking Without Tears)</title>
        <meta name="description" content="Understanding Kubernetes Services and networking" />
      </Head>

      {/* Home link in top right */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 30,
        zIndex: 10
      }}>
        <Link href="/learning-modules" legacyBehavior>
          <a style={{
            textDecoration: 'none',
            color: '#9c0606ff',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            background: 'rgba(255,255,255,0.85)',
            padding: '8px 16px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>All Modules</a>
        </Link>
      </div>

      <main className={styles.main}>
        <h1 className={styles.title}>Module 2.3: Services</h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280', marginTop: '-10px' }}>
          Networking Without Tears
        </p>
        
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/module-2-2" legacyBehavior>
            <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              ← Previous: ReplicaSets & Deployments
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/learning-modules" legacyBehavior>
            <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              All Modules
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/module-3-1" legacyBehavior>
            <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              Next: ConfigMaps →
            </a>
          </Link>
        </div>
        
        <section className={styles.spotlight}>
          <h2>The Problem: Pod IPs Are Ephemeral</h2>
          <p>
            In the previous modules, we learned that Pods are disposable. When a Pod dies and is replaced, 
            it gets a new IP address. This creates a problem:
          </p>
          <ul>
            <li>How do other Pods find your application if the IP keeps changing?</li>
            <li>How do you load-balance traffic across multiple Pod replicas?</li>
            <li>How do external clients access your application?</li>
          </ul>
          <p>
            This is where <strong>Services</strong> come in. A Service provides a stable network endpoint 
            (IP address and DNS name) that routes traffic to a set of Pods, even as those Pods come and go.
          </p>

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#0369a1' }}>💡 Key Concept</h3>
            <p style={{ marginBottom: 0 }}>
              A <strong>Service</strong> is an abstraction that defines a logical set of Pods and a 
              policy for accessing them. Think of it as a load balancer with a stable IP address and 
              DNS name that sits in front of your Pods.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Interactive: Pod IPs Change, Services Don't</h2>
          
          <div style={{
            background: '#f9fafb',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                background: '#9c0606ff', 
                color: '#fff', 
                padding: '16px', 
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                marginBottom: '20px'
              }}>
                Service: my-app
                <div style={{ fontSize: '0.9rem', marginTop: '8px' }}>
                  ClusterIP: {serviceIP} (STABLE - never changes)
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '20px'
              }}>
                {pods.map(pod => (
                  <div
                    key={pod.id}
                    style={{
                      background: pod.healthy ? '#22c55e' : '#ef4444',
                      color: '#fff',
                      padding: '16px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      transition: 'all 0.3s',
                      opacity: pod.healthy ? 1 : 0.5
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>Pod {pod.id}</div>
                    <div style={{ fontSize: '0.9rem', marginTop: '8px' }}>
                      IP: {pod.ip}
                    </div>
                    {!pod.healthy && (
                      <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                        ⚠️ Crashed
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={simulateIPChange}
                  disabled={simulationRunning}
                  style={{
                    padding: '12px 24px',
                    background: simulationRunning ? '#9ca3af' : '#9c0606ff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: simulationRunning ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    fontSize: '1rem'
                  }}
                >
                  {simulationRunning ? 'Simulating...' : '🔄 Simulate Pod Crash & Restart'}
                </button>
                <button
                  onClick={resetSimulation}
                  style={{
                    padding: '12px 24px',
                    background: '#6b7280',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '1rem'
                  }}
                >
                  Reset
                </button>
              </div>
            </div>

            <div style={{
              background: '#f0f9ff',
              border: '2px solid #0ea5e9',
              borderRadius: '8px',
              padding: '16px',
              color: '#1e293b'
            }}>
              <p style={{ marginTop: 0, fontWeight: 'bold' }}>What happens:</p>
              <ul style={{ marginBottom: 0 }}>
                <li>When a Pod crashes, it gets a <strong>new IP address</strong> upon restart</li>
                <li>The Service IP <strong>stays the same</strong></li>
                <li>Traffic automatically routes to healthy Pods</li>
                <li>Other Pods always connect to the Service IP, not individual Pod IPs</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>How Services Work</h2>
          <p>
            Services use <strong>labels</strong> and <strong>selectors</strong> to determine which 
            Pods they route traffic to.
          </p>

          <h3>Example: Service Definition</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            overflowX: 'auto',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># service.yaml</div>
            <div style={{ color: '#f59e0b' }}>apiVersion: v1</div>
            <div style={{ color: '#f59e0b' }}>kind: Service</div>
            <div style={{ color: '#f59e0b' }}>metadata:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: my-app-service</div>
            <div style={{ color: '#f59e0b' }}>spec:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;selector:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;app: my-app  # Matches Pods with label app=my-app</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;ports:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;- protocol: TCP</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;port: 80        # Service port (what clients connect to)</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;targetPort: 8080 # Pod port (where containers listen)</div>
          </div>

          <div style={{
            background: '#f9fafb',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h4 style={{ marginTop: 0, color: '#9c0606ff' }}>How Matching Works</h4>
            <ol style={{ lineHeight: '1.8' }}>
              <li>You create a Service with <code>selector: app=my-app</code></li>
              <li>Kubernetes finds all Pods with the label <code>app=my-app</code></li>
              <li>Service routes traffic to those Pods (load-balanced)</li>
              <li>As Pods are created/destroyed, the Service automatically updates its endpoints</li>
            </ol>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Types of Services</h2>
          <p>
            Kubernetes has four main Service types, each designed for different use cases:
          </p>

          <h3>1. ClusterIP (Default)</h3>
          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h4 style={{ marginTop: 0, color: '#0ea5e9' }}>Internal Cluster Networking</h4>
            <p><strong>What it does:</strong> Exposes the Service on an internal IP within the cluster</p>
            <p><strong>Access:</strong> Only accessible from within the cluster</p>
            <p><strong>Use case:</strong> Backend services, databases, internal APIs</p>
            
            <div style={{
              background: '#1e293b',
              color: '#e2e8f0',
              padding: '16px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              margin: '12px 0'
            }}>
              <div style={{ color: '#f59e0b' }}>apiVersion: v1</div>
              <div style={{ color: '#f59e0b' }}>kind: Service</div>
              <div style={{ color: '#f59e0b' }}>metadata:</div>
              <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: backend-service</div>
              <div style={{ color: '#f59e0b' }}>spec:</div>
              <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;type: ClusterIP  # Default, can be omitted</div>
              <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;selector:</div>
              <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;app: backend</div>
              <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;ports:</div>
              <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;- port: 80</div>
              <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;targetPort: 8080</div>
            </div>

            <p><strong>DNS name:</strong> <code>backend-service.default.svc.cluster.local</code></p>
            <p><strong>Short name:</strong> <code>backend-service</code> (within same namespace)</p>
          </div>

          <h3>2. NodePort</h3>
          <div style={{
            background: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h4 style={{ marginTop: 0, color: '#b45309' }}>Expose on Node IPs</h4>
            <p><strong>What it does:</strong> Exposes the Service on each Node's IP at a static port (30000-32767)</p>
            <p><strong>Access:</strong> From outside the cluster via <code>{'<NodeIP>:<NodePort>'}</code></p>
            <p><strong>Use case:</strong> Quick external access for testing, small deployments</p>
            
            <div style={{
              background: '#1e293b',
              color: '#e2e8f0',
              padding: '16px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              margin: '12px 0'
            }}>
              <div style={{ color: '#f59e0b' }}>apiVersion: v1</div>
              <div style={{ color: '#f59e0b' }}>kind: Service</div>
              <div style={{ color: '#f59e0b' }}>metadata:</div>
              <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: web-service</div>
              <div style={{ color: '#f59e0b' }}>spec:</div>
              <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;type: NodePort</div>
              <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;selector:</div>
              <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;app: web</div>
              <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;ports:</div>
              <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;- port: 80</div>
              <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;targetPort: 8080</div>
              <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;nodePort: 30080  # Optional, auto-assigned if omitted</div>
            </div>

            <p><strong>Access:</strong> <code>http://any-node-ip:30080</code></p>
            
            <div style={{
              background: '#fef2f2',
              border: '1px solid #ef4444',
              borderRadius: '6px',
              padding: '12px',
              marginTop: '12px'
            }}>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                ⚠️ <strong>Not recommended for production.</strong> Requires firewall rules, doesn't provide load balancing across nodes.
              </p>
            </div>
          </div>

          <h3>3. LoadBalancer</h3>
          <div style={{
            background: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h4 style={{ marginTop: 0, color: '#15803d' }}>Cloud Provider Load Balancer</h4>
            <p><strong>What it does:</strong> Provisions an external load balancer (AWS ELB, GCP LB, Azure LB)</p>
            <p><strong>Access:</strong> From anywhere via the load balancer's public IP or DNS</p>
            <p><strong>Use case:</strong> Production web applications, public-facing APIs</p>
            
            <div style={{
              background: '#1e293b',
              color: '#e2e8f0',
              padding: '16px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              margin: '12px 0'
            }}>
              <div style={{ color: '#f59e0b' }}>apiVersion: v1</div>
              <div style={{ color: '#f59e0b' }}>kind: Service</div>
              <div style={{ color: '#f59e0b' }}>metadata:</div>
              <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: frontend-service</div>
              <div style={{ color: '#f59e0b' }}>spec:</div>
              <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;type: LoadBalancer</div>
              <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;selector:</div>
              <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;app: frontend</div>
              <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;ports:</div>
              <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;- port: 80</div>
              <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;targetPort: 8080</div>
            </div>

            <p><strong>Result:</strong> Cloud provider provisions a load balancer, gives you an external IP</p>
            <p><strong>Access:</strong> <code>http://load-balancer-external-ip</code></p>
            
            <div style={{
              background: '#f0f9ff',
              border: '1px solid #0ea5e9',
              borderRadius: '6px',
              padding: '12px',
              marginTop: '12px'
            }}>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                💡 <strong>Only works on cloud providers.</strong> On local clusters (minikube, kind), LoadBalancer behaves like NodePort.
              </p>
            </div>
          </div>

          <h3>4. ExternalName</h3>
          <div style={{
            background: '#f9fafb',
            border: '2px solid #6b7280',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h4 style={{ marginTop: 0, color: '#6b7280' }}>DNS Alias (Advanced)</h4>
            <p><strong>What it does:</strong> Maps a Service to an external DNS name</p>
            <p><strong>Use case:</strong> Accessing external services (e.g., external database) with Kubernetes DNS</p>
            
            <div style={{
              background: '#1e293b',
              color: '#e2e8f0',
              padding: '16px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              margin: '12px 0'
            }}>
              <div style={{ color: '#f59e0b' }}>apiVersion: v1</div>
              <div style={{ color: '#f59e0b' }}>kind: Service</div>
              <div style={{ color: '#f59e0b' }}>metadata:</div>
              <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: external-db</div>
              <div style={{ color: '#f59e0b' }}>spec:</div>
              <div style={{ color: '#6b7280' }}>&nbsp;&nbsp;type: ExternalName</div>
              <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;externalName: my-database.amazonaws.com</div>
            </div>

            <p><strong>Usage:</strong> Pods can connect to <code>external-db</code> instead of the full external DNS name</p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>How Pods Find Each Other</h2>
          <p>
            Kubernetes provides automatic <strong>DNS service discovery</strong>. Every Service gets 
            a DNS name that other Pods can use to connect.
          </p>

          <h3>DNS Naming Convention</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#22c55e' }}>{'<service-name>.<namespace>.svc.cluster.local'}</div>
            <br/>
            <div style={{ color: '#64748b' }}>// Example:</div>
            <div style={{ color: '#e2e8f0' }}>my-app-service.default.svc.cluster.local</div>
            <br/>
            <div style={{ color: '#64748b' }}>// Within the same namespace, you can use short name:</div>
            <div style={{ color: '#e2e8f0' }}>my-app-service</div>
          </div>

          <h3>Example: Frontend → Backend Communication</h3>
          <div style={{
            background: '#f9fafb',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h4 style={{ marginTop: 0, color: '#9c0606ff' }}>Scenario</h4>
            <p>Frontend Pod needs to call Backend API</p>
            
            <div style={{
              background: '#1e293b',
              color: '#e2e8f0',
              padding: '16px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              margin: '12px 0'
            }}>
              <div style={{ color: '#64748b' }}>// In frontend code (any language):</div>
              <div style={{ color: '#22c55e' }}>const apiUrl = "http://backend-service/api/data";</div>
              <div style={{ color: '#e2e8f0' }}>fetch(apiUrl)</div>
              <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;.then(response =&gt; response.json())</div>
              <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;.then(data =&gt; console.log(data));</div>
            </div>

            <p><strong>What happens:</strong></p>
            <ol style={{ lineHeight: '1.8' }}>
              <li>Frontend resolves <code>backend-service</code> via DNS → gets Service IP (e.g., 10.96.0.100)</li>
              <li>Traffic goes to the Service</li>
              <li>Service load-balances to one of the backend Pods</li>
              <li>Pod processes request and responds</li>
            </ol>
          </div>

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#0369a1' }}>💡 Key Benefit</h3>
            <p style={{ marginBottom: 0 }}>
              Frontend doesn't need to know Pod IPs, how many backend instances exist, or when they 
              change. It just talks to the Service by name. Kubernetes handles all the routing.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Why IPs Are Ephemeral (And That's Okay)</h2>
          
          <h3>The Old Way (Bad)</h3>
          <div style={{
            background: '#fef2f2',
            border: '2px solid #ef4444',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <p><strong>Without Services:</strong></p>
            <ul>
              <li>You hardcode Pod IPs in your application</li>
              <li>Pod crashes, gets new IP</li>
              <li>Your app breaks because it's pointing to the old IP</li>
              <li>You manually update config files</li>
              <li>You deploy updates, restart everything</li>
              <li>This is painful and error-prone</li>
            </ul>
          </div>

          <h3>The Kubernetes Way (Good)</h3>
          <div style={{
            background: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <p><strong>With Services:</strong></p>
            <ul>
              <li>You reference the Service name (<code>backend-service</code>)</li>
              <li>Service has a stable IP and DNS name</li>
              <li>Pods crash and restart with new IPs? <strong>No problem.</strong></li>
              <li>Service automatically routes to healthy Pods</li>
              <li>Your application code never changes</li>
              <li>Everything just works</li>
            </ul>
          </div>

          <div style={{
            background: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#b45309' }}>🔑 Mental Model</h3>
            <p style={{ marginBottom: 0 }}>
              Pods are like temporary workers with name badges that change daily. The Service is like 
              the receptionist who always knows where everyone is. You don't ask for workers by name—you 
              ask the receptionist, who routes you to an available worker.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Service Load Balancing</h2>
          <p>
            Services automatically load-balance traffic across all matching Pods. The distribution 
            is done by kube-proxy (remember from Module 1.3?) using iptables or IPVS rules.
          </p>

          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            overflowX: 'auto',
            margin: '16px 0'
          }}>
            <div style={{ color: '#f59e0b' }}>┌─ Service: my-app (10.96.0.100) ─┐</div>
            <div style={{ color: '#e2e8f0' }}>│   Load balances traffic:         │</div>
            <div style={{ color: '#f59e0b' }}>└──────────┬───────────────────────┘</div>
            <div style={{ color: '#64748b' }}>           │</div>
            <div style={{ color: '#64748b' }}>    ┌──────┴──────┬──────────┐</div>
            <div style={{ color: '#64748b' }}>    │             │          │</div>
            <div style={{ color: '#22c55e' }}>┌───▼───┐   ┌───▼───┐   ┌──▼────┐</div>
            <div style={{ color: '#22c55e' }}>│ Pod 1 │   │ Pod 2 │   │ Pod 3 │</div>
            <div style={{ color: '#22c55e' }}>│ .1.5  │   │ .1.6  │   │ .1.7  │</div>
            <div style={{ color: '#22c55e' }}>└───────┘   └───────┘   └───────┘</div>
            <br/>
            <div style={{ color: '#64748b' }}>// Each request goes to a random Pod</div>
            <div style={{ color: '#64748b' }}>// If a Pod is unhealthy, it's removed</div>
          </div>

          <p><strong>Load balancing algorithm:</strong> Round-robin or random (depending on kube-proxy mode)</p>
        </section>

        <section className={styles.spotlight}>
          <h2>Common Service Commands</h2>
          
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># List all Services</div>
            <div style={{ color: '#22c55e' }}>kubectl get services</div>
            <div style={{ color: '#22c55e' }}>kubectl get svc  # Short form</div>
            <br/>
            <div style={{ color: '#64748b' }}># Get detailed info about a Service</div>
            <div style={{ color: '#22c55e' }}>kubectl describe service my-app-service</div>
            <br/>
            <div style={{ color: '#64748b' }}># Create a Service from a Deployment</div>
            <div style={{ color: '#22c55e' }}>kubectl expose deployment my-app --port=80 --target-port=8080</div>
            <br/>
            <div style={{ color: '#64748b' }}># Get Service endpoints (which Pods it routes to)</div>
            <div style={{ color: '#22c55e' }}>kubectl get endpoints my-app-service</div>
            <br/>
            <div style={{ color: '#64748b' }}># Delete a Service</div>
            <div style={{ color: '#ef4444' }}>kubectl delete service my-app-service</div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Service vs Ingress</h2>
          <p>
            You might wonder: if LoadBalancer Services expose apps externally, why do we need Ingress? 
            Good question.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            margin: '20px 0'
          }}>
            <div style={{
              border: '2px solid #22c55e',
              borderRadius: '12px',
              padding: '20px',
              background: '#f0fdf4'
            }}>
              <h4 style={{ marginTop: 0, color: '#22c55e' }}>LoadBalancer Service</h4>
              <ul style={{ color: '#1e293b', fontSize: '0.9rem' }}>
                <li>Layer 4 (TCP/UDP) load balancing</li>
                <li>One load balancer per Service</li>
                <li>Expensive (cloud LBs cost money)</li>
                <li>Simple, works out of the box</li>
              </ul>
            </div>

            <div style={{
              border: '2px solid #0ea5e9',
              borderRadius: '12px',
              padding: '20px',
              background: '#f0f9ff'
            }}>
              <h4 style={{ marginTop: 0, color: '#0ea5e9' }}>Ingress</h4>
              <ul style={{ color: '#1e293b', fontSize: '0.9rem' }}>
                <li>Layer 7 (HTTP/HTTPS) routing</li>
                <li>One load balancer for many Services</li>
                <li>Cost-effective at scale</li>
                <li>Advanced features (path routing, TLS, auth)</li>
              </ul>
            </div>
          </div>

          <p style={{ color: '#1e293b' }}>
            <strong>Rule of thumb:</strong> Use LoadBalancer for simple cases or non-HTTP protocols. 
            Use Ingress for HTTP/HTTPS apps in production (covered in Module 6.2).
          </p>
        </section>

        <section className={styles.spotlight}>
          <h2>Key Takeaways</h2>
          <ul>
            <li><strong>Services</strong> provide stable networking for ephemeral Pods</li>
            <li>Pod IPs change; Service IPs don't</li>
            <li><strong>ClusterIP:</strong> Internal cluster access (most common)</li>
            <li><strong>NodePort:</strong> External access via node IPs (testing only)</li>
            <li><strong>LoadBalancer:</strong> Cloud provider load balancer (production)</li>
            <li><strong>ExternalName:</strong> DNS alias for external services</li>
            <li>Services use <strong>labels and selectors</strong> to match Pods</li>
            <li>Kubernetes provides <strong>automatic DNS</strong> for service discovery</li>
            <li>Services <strong>load-balance</strong> traffic across healthy Pods</li>
            <li>Services make microservices communication simple and reliable</li>
          </ul>
        </section>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginTop: '60px',
          paddingTop: '30px',
          borderTop: '2px solid #e5e7eb',
          gap: '20px'
        }}>
          <Link href="/module-2-2" legacyBehavior>
            <a style={{
              textDecoration: 'none',
              color: '#4b5563',
              fontWeight: 600,
              padding: '12px 24px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>← Previous: ReplicaSets & Deployments</a>
          </Link>
          
          <Link href="/learning-modules" legacyBehavior>
            <a style={{
              textDecoration: 'none',
              color: '#fff',
              background: '#9c0606ff',
              fontWeight: 600,
              padding: '12px 24px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>Back to All Modules</a>
          </Link>
        </div>
      </main>
    </div>
  );
}
