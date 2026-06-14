import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Module21() {
  const [showSingleContainer, setShowSingleContainer] = useState(true);

  return (
    <div className={styles.container}>
      <Head>
        <title>Module 2.1: Pods (The Smallest Unit of Pain)</title>
        <meta name="description" content="Understanding Kubernetes Pods" />
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
        <h1 className={styles.title}>Module 2.1: Pods</h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280', marginTop: '-10px' }}>
          The Smallest Unit of Pain (and Deployment)
        </p>
        
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/module-1-3" legacyBehavior>
            <a style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>
              ← Previous: Worker Node Components
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/learning-modules" legacyBehavior>
            <a style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>
              All Modules
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/module-2-2" legacyBehavior>
            <a style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>
              Next: ReplicaSets & Deployments →
            </a>
          </Link>
        </div>

        <section className={styles.spotlight}>
          <h2>What a Pod Really Is</h2>
          <p>
            A <strong>Pod</strong> is the smallest deployable unit in Kubernetes. It's not a container—it's 
            a wrapper around one or more containers that share the same network namespace, storage volumes, 
            and lifecycle.
          </p>
          <p>
            Think of a Pod as a "logical host"—a unit that groups containers that need to work together 
            very closely. Containers in the same Pod can communicate via localhost, share volumes, and 
            are always scheduled together on the same node.
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
              <strong>Pod ≠ Container</strong><br/>
              A Pod can contain multiple containers, but most Pods contain just one. The Pod is the 
              abstraction Kubernetes uses for deployment, scaling, and networking—not the container itself.
            </p>
          </div>

          <h3>Why Pods Exist</h3>
          <p>Why not just deploy containers directly? Because Pods provide:</p>
          <ul>
            <li><strong>Shared networking:</strong> All containers in a Pod share the same IP address and port space</li>
            <li><strong>Shared storage:</strong> Volumes can be mounted and shared between containers</li>
            <li><strong>Co-location:</strong> Containers that need to be on the same machine are guaranteed to be together</li>
            <li><strong>Lifecycle management:</strong> All containers in a Pod start and stop together</li>
          </ul>
        </section>

        <section className={styles.spotlight}>
          <h2>Anatomy of a Pod</h2>
          <p>Here's what a Pod contains:</p>

          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '24px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            overflowX: 'auto',
            margin: '20px 0'
          }}>
            <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>┌─────── POD ───────────────────────────┐</div>
            <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>│  IP: 10.244.1.5                       │</div>
            <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>│  Hostname: my-app-xyz123              │</div>
            <div style={{ color: '#e2e8f0' }}>│                                        │</div>
            <div style={{ color: '#0ea5e9' }}>│  ┌─── Container 1 (main app) ───┐    │</div>
            <div style={{ color: '#0ea5e9' }}>│  │  Image: nginx:1.21          │    │</div>
            <div style={{ color: '#0ea5e9' }}>│  │  Port: 80                   │    │</div>
            <div style={{ color: '#0ea5e9' }}>│  └─────────────────────────────┘    │</div>
            <div style={{ color: '#e2e8f0' }}>│                                        │</div>
            <div style={{ color: '#22c55e' }}>│  ┌─── Container 2 (sidecar) ────┐    │</div>
            <div style={{ color: '#22c55e' }}>│  │  Image: log-collector       │    │</div>
            <div style={{ color: '#22c55e' }}>│  │  (reads logs, sends to DB)  │    │</div>
            <div style={{ color: '#22c55e' }}>│  └─────────────────────────────┘    │</div>
            <div style={{ color: '#e2e8f0' }}>│                                        │</div>
            <div style={{ color: '#ef4444' }}>│  Shared Volumes:                       │</div>
            <div style={{ color: '#ef4444' }}>│  • /var/log (both containers)          │</div>
            <div style={{ color: '#ef4444' }}>│  • /config (read-only)                 │</div>
            <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>└────────────────────────────────────────┘</div>
          </div>

          <p>Important characteristics:</p>
          <ul>
            <li><strong>One IP per Pod:</strong> All containers share the same network interface</li>
            <li><strong>Containers can talk via localhost:</strong> Container 1 can reach Container 2 at <code>localhost:port</code></li>
            <li><strong>Shared fate:</strong> If the Pod dies, all containers die</li>
            <li><strong>Ephemeral:</strong> Pods are disposable and replaceable</li>
          </ul>
        </section>

        <section className={styles.spotlight}>
          <h2>Single-Container vs Multi-Container Pods</h2>
          
          <div style={{ marginTop: '20px' }}>
            <div style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <button
                onClick={() => setShowSingleContainer(true)}
                style={{
                  padding: '10px 20px',
                  background: showSingleContainer ? '#9c0606ff' : '#334155',
                  color: showSingleContainer ? '#fff' : '#4b5563',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Single Container (Most Common)
              </button>
              <button
                onClick={() => setShowSingleContainer(false)}
                style={{
                  padding: '10px 20px',
                  background: !showSingleContainer ? '#9c0606ff' : '#334155',
                  color: !showSingleContainer ? '#fff' : '#4b5563',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Multi-Container (Advanced)
              </button>
            </div>

            {showSingleContainer ? (
              <div style={{
                background: '#f0f9ff',
                border: '2px solid #0ea5e9',
                borderRadius: '12px',
                padding: '24px',
                color: '#1e293b'
              }}>
                <h3 style={{ marginTop: 0, color: '#0ea5e9' }}>Single-Container Pod (95% of use cases)</h3>
                <p>
                  Most Pods contain just one container. This is the standard pattern for deploying 
                  applications in Kubernetes.
                </p>
                
                <h4>Example: Web Application</h4>
                <div style={{
                  background: '#1e293b',
                  color: '#e2e8f0',
                  padding: '20px',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  overflowX: 'auto',
                  margin: '16px 0'
                }}>
                  <div style={{ color: '#64748b' }}># pod.yaml</div>
                  <div style={{ color: '#f59e0b' }}>apiVersion: v1</div>
                  <div style={{ color: '#f59e0b' }}>kind: Pod</div>
                  <div style={{ color: '#f59e0b' }}>metadata:</div>
                  <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: nginx-pod</div>
                  <div style={{ color: '#f59e0b' }}>spec:</div>
                  <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;containers:</div>
                  <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;- name: nginx</div>
                  <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;image: nginx:1.21</div>
                  <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;ports:</div>
                  <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;- containerPort: 80</div>
                </div>

                <p><strong>When to use:</strong></p>
                <ul>
                  <li>Standard application deployment</li>
                  <li>Microservices</li>
                  <li>Most web applications</li>
                  <li>Databases</li>
                </ul>
              </div>
            ) : (
              <div style={{
                background: '#fef3c7',
                border: '2px solid #f59e0b',
                borderRadius: '12px',
                padding: '24px',
                color: '#1e293b'
              }}>
                <h3 style={{ marginTop: 0, color: '#b45309' }}>Multi-Container Pod (Special Cases)</h3>
                <p>
                  Multi-container Pods are used when containers need to be tightly coupled—they must 
                  run on the same node and share resources.
                </p>

                <h4>Common Patterns:</h4>
                
                <div style={{ marginBottom: '16px' }}>
                  <h5 style={{ color: '#9c0606ff' }}>1. Sidecar Pattern</h5>
                  <p>A helper container that extends the main container's functionality.</p>
                  <p><strong>Example:</strong> Log collector that reads app logs and ships them to a central logging system.</p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <h5 style={{ color: '#9c0606ff' }}>2. Ambassador Pattern</h5>
                  <p>A proxy container that handles network connections for the main container.</p>
                  <p><strong>Example:</strong> Database proxy that handles connection pooling and encryption.</p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <h5 style={{ color: '#9c0606ff' }}>3. Adapter Pattern</h5>
                  <p>A container that transforms the main container's output.</p>
                  <p><strong>Example:</strong> Monitoring agent that converts app metrics to Prometheus format.</p>
                </div>

                <h4>Example: Web App + Log Sidecar</h4>
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
                  <div style={{ color: '#64748b' }}># multi-container-pod.yaml</div>
                  <div style={{ color: '#f59e0b' }}>apiVersion: v1</div>
                  <div style={{ color: '#f59e0b' }}>kind: Pod</div>
                  <div style={{ color: '#f59e0b' }}>metadata:</div>
                  <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: web-with-logging</div>
                  <div style={{ color: '#f59e0b' }}>spec:</div>
                  <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;containers:</div>
                  <div style={{ color: '#64748b' }}>&nbsp;&nbsp;# Main application container</div>
                  <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;- name: web-app</div>
                  <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;image: my-web-app:1.0</div>
                  <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;volumeMounts:</div>
                  <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;- name: shared-logs</div>
                  <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mountPath: /var/log</div>
                  <br/>
                  <div style={{ color: '#64748b' }}>&nbsp;&nbsp;# Sidecar: log collector</div>
                  <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;- name: log-sidecar</div>
                  <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;image: fluentd:latest</div>
                  <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;volumeMounts:</div>
                  <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;- name: shared-logs</div>
                  <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mountPath: /var/log</div>
                  <br/>
                  <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;volumes:</div>
                  <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;- name: shared-logs</div>
                  <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;emptyDir: {'{}'}</div>
                </div>

                <p><strong>When to use multi-container Pods:</strong></p>
                <ul>
                  <li>Containers must share the same lifecycle</li>
                  <li>Containers need to communicate via localhost</li>
                  <li>Containers need to share files/volumes</li>
                  <li>Tight coupling is necessary</li>
                </ul>
              </div>
            )}
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Why You Almost Never Create Pods Directly</h2>
          <p>
            Here's a crucial lesson: <strong>you should rarely create Pods directly</strong>. Instead, 
            you use higher-level controllers like Deployments, StatefulSets, or DaemonSets.
          </p>

          <h3>The Problem with Naked Pods</h3>
          <p>If you create a Pod directly and it dies, it's gone forever. Kubernetes won't restart it or create a new one. You're on your own.</p>

          <div style={{
            background: '#fef2f2',
            border: '2px solid #ef4444',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#b91c1c' }}>🚨 What Happens Without a Controller</h3>
            <div style={{
              background: '#1e293b',
              color: '#e2e8f0',
              padding: '16px',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              margin: '12px 0'
            }}>
              <div style={{ color: '#22c55e' }}>$ kubectl create -f pod.yaml</div>
              <div style={{ color: '#e2e8f0' }}>pod/my-app created</div>
              <br/>
              <div style={{ color: '#64748b' }}># Pod crashes or node fails...</div>
              <br/>
              <div style={{ color: '#ef4444' }}>$ kubectl get pods</div>
              <div style={{ color: '#ef4444' }}>No resources found.</div>
              <br/>
              <div style={{ color: '#64748b' }}># Your app is gone. No automatic recovery.</div>
            </div>
            <p style={{ marginBottom: 0 }}>
              Naked Pods have no self-healing. They're useful for debugging or one-off tasks, but 
              terrible for production workloads.
            </p>
          </div>

          <h3>The Right Way: Use Controllers</h3>
          <p>Controllers manage Pods for you, providing:</p>
          <ul>
            <li><strong>Self-healing:</strong> If a Pod dies, the controller creates a new one</li>
            <li><strong>Scaling:</strong> Easily run multiple replicas</li>
            <li><strong>Rolling updates:</strong> Update apps without downtime</li>
            <li><strong>Rollbacks:</strong> Revert to previous versions if updates fail</li>
          </ul>

          <div style={{
            background: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#15803d' }}>✅ The Deployment Way</h3>
            <div style={{
              background: '#1e293b',
              color: '#e2e8f0',
              padding: '16px',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              margin: '12px 0'
            }}>
              <div style={{ color: '#22c55e' }}>$ kubectl create deployment my-app --image=nginx</div>
              <div style={{ color: '#e2e8f0' }}>deployment.apps/my-app created</div>
              <br/>
              <div style={{ color: '#64748b' }}># Pod crashes or node fails...</div>
              <br/>
              <div style={{ color: '#22c55e' }}>$ kubectl get pods</div>
              <div style={{ color: '#22c55e' }}>NAME                      READY   STATUS    RESTARTS</div>
              <div style={{ color: '#22c55e' }}>my-app-7f8d9c-abc12       1/1     Running   0</div>
              <div style={{ color: '#64748b' }}># Kubernetes automatically created a new Pod!</div>
            </div>
            <p style={{ marginBottom: 0 }}>
              The Deployment controller watches your Pods. If one dies, it immediately creates a 
              replacement. You get automatic recovery with no intervention.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Pod Lifecycle</h2>
          <p>Pods go through several phases during their lifecycle:</p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            margin: '20px 0'
          }}>
            <div style={{ border: '2px solid #475569', borderRadius: '8px', padding: '16px' }}>
              <h4 style={{ margin: 0, color: '#6b7280' }}>Pending</h4>
              <p style={{ fontSize: '0.9rem', color: '#1e293b' }}>
                Pod has been accepted but containers aren't running yet. Waiting for scheduling or image pull.
              </p>
            </div>

            <div style={{ border: '2px solid #22c55e', borderRadius: '8px', padding: '16px' }}>
              <h4 style={{ margin: 0, color: '#22c55e' }}>Running</h4>
              <p style={{ fontSize: '0.9rem', color: '#1e293b' }}>
                Pod is bound to a node and at least one container is running.
              </p>
            </div>

            <div style={{ border: '2px solid #0ea5e9', borderRadius: '8px', padding: '16px' }}>
              <h4 style={{ margin: 0, color: '#0ea5e9' }}>Succeeded</h4>
              <p style={{ fontSize: '0.9rem', color: '#1e293b' }}>
                All containers have terminated successfully. Typical for batch jobs.
              </p>
            </div>

            <div style={{ border: '2px solid #ef4444', borderRadius: '8px', padding: '16px' }}>
              <h4 style={{ margin: 0, color: '#ef4444' }}>Failed</h4>
              <p style={{ fontSize: '0.9rem', color: '#1e293b' }}>
                All containers have terminated, and at least one failed (non-zero exit code).
              </p>
            </div>

            <div style={{ border: '2px solid #f59e0b', borderRadius: '8px', padding: '16px' }}>
              <h4 style={{ margin: 0, color: '#f59e0b' }}>Unknown</h4>
              <p style={{ fontSize: '0.9rem', color: '#1e293b' }}>
                Pod state cannot be determined, usually due to communication errors with the node.
              </p>
            </div>

            <div style={{ border: '2px solid #6b7280', borderRadius: '8px', padding: '16px' }}>
              <h4 style={{ margin: 0, color: '#6b7280' }}>CrashLoopBackOff</h4>
              <p style={{ fontSize: '0.9rem', color: '#1e293b' }}>
                Container keeps crashing and restarting. Kubernetes backs off between restarts.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Pod Characteristics to Remember</h2>
          
          <h3>1. Pods Are Ephemeral</h3>
          <p>
            Pods are designed to be disposable. They can be deleted and recreated at any time. Never 
            rely on a specific Pod instance—they're cattle, not pets.
          </p>

          <h3>2. Pod IPs Are Unstable</h3>
          <p>
            Each Pod gets its own IP address, but when a Pod is recreated, it gets a new IP. This is 
            why you use <strong>Services</strong> (next module) to provide stable endpoints.
          </p>

          <h3>3. Pods Run on One Node</h3>
          <p>
            A Pod cannot span multiple nodes. All containers in a Pod run on the same machine. If you 
            need more compute, you scale by creating more Pods, not by making Pods bigger.
          </p>

          <h3>4. Pods Are the Unit of Scaling</h3>
          <p>
            Kubernetes doesn't scale individual containers—it scales Pods. Want 10 instances of your 
            app? You create 10 Pods.
          </p>

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#0369a1' }}>💡 Mental Model</h3>
            <p style={{ marginBottom: 0 }}>
              Think of Pods as temporary workers. They show up, do their job, and can be replaced at 
              any moment. You don't build infrastructure around specific Pods—you build it around the 
              abstraction (Services, Deployments) that manages them.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Common Pod Commands</h2>
          
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># List all Pods</div>
            <div style={{ color: '#22c55e' }}>kubectl get pods</div>
            <br/>
            <div style={{ color: '#64748b' }}># Get detailed info about a Pod</div>
            <div style={{ color: '#22c55e' }}>kubectl describe pod my-pod</div>
            <br/>
            <div style={{ color: '#64748b' }}># View Pod logs</div>
            <div style={{ color: '#22c55e' }}>kubectl logs my-pod</div>
            <br/>
            <div style={{ color: '#64748b' }}># View logs from specific container in multi-container Pod</div>
            <div style={{ color: '#22c55e' }}>kubectl logs my-pod -c container-name</div>
            <br/>
            <div style={{ color: '#64748b' }}># Execute command inside a Pod</div>
            <div style={{ color: '#22c55e' }}>kubectl exec -it my-pod -- /bin/bash</div>
            <br/>
            <div style={{ color: '#64748b' }}># Delete a Pod</div>
            <div style={{ color: '#ef4444' }}>kubectl delete pod my-pod</div>
            <br/>
            <div style={{ color: '#64748b' }}># Watch Pods in real-time</div>
            <div style={{ color: '#22c55e' }}>kubectl get pods --watch</div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Key Takeaways</h2>
          <ul>
            <li>A <strong>Pod</strong> is the smallest deployable unit in Kubernetes (not a container)</li>
            <li>Most Pods contain <strong>one container</strong>; multi-container Pods are for special cases</li>
            <li>Pods share networking (same IP) and storage (shared volumes)</li>
            <li><strong>Never create Pods directly</strong> in production—use Deployments or other controllers</li>
            <li>Pods are <strong>ephemeral</strong>—they can be deleted and recreated at any time</li>
            <li>Pod IPs are <strong>unstable</strong>—use Services for stable networking</li>
            <li>Pods are the unit of scaling in Kubernetes</li>
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
          <Link href="/module-1-3" legacyBehavior>
            <a style={{
              textDecoration: 'none',
              color: '#94a3b8',
              fontWeight: 600,
              padding: '12px 24px',
              border: '2px solid #475569',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>← Previous: Worker Node Components</a>
          </Link>
          
          <Link href="/module-2-2" legacyBehavior>
            <a style={{
              textDecoration: 'none',
              color: '#fff',
              background: '#9c0606ff',
              fontWeight: 600,
              padding: '12px 24px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>Next: ReplicaSets & Deployments →</a>
          </Link>
        </div>
      </main>
    </div>
  );
}
