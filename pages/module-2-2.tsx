import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Module22() {
  const [replicaCount, setReplicaCount] = useState(3);
  const [currentReplicas, setCurrentReplicas] = useState(3);

  const handleScale = (newCount: number) => {
    setReplicaCount(newCount);
    // Simulate gradual scaling
    setTimeout(() => setCurrentReplicas(newCount), 500);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Module 2.2: ReplicaSets & Deployments</title>
        <meta name="description" content="Managing and scaling applications in Kubernetes" />
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
        <h1 className={styles.title}>Module 2.2: ReplicaSets & Deployments</h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280', marginTop: '-10px' }}>
          Why Deployments Are Your Best Friend
        </p>
        
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/module-2-1" legacyBehavior>
            <a style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>
              ← Previous: Pods
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/learning-modules" legacyBehavior>
            <a style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>
              All Modules
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/module-2-3" legacyBehavior>
            <a style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>
              Next: Services →
            </a>
          </Link>
        </div>
        
        <section className={styles.spotlight}>
          <h2>The Problem: Naked Pods Don't Scale</h2>
          <p>
            In the previous module, we learned that creating Pods directly is a bad idea—they don't 
            self-heal or scale. This is where <strong>ReplicaSets</strong> and <strong>Deployments</strong> 
            come in.
          </p>
          <p>
            These controllers ensure your application is always running the desired number of replicas, 
            automatically replacing failed Pods and enabling easy scaling.
          </p>

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#0369a1' }}>💡 The Hierarchy</h3>
            <p style={{ marginBottom: 0 }}>
              <strong>Deployment</strong> → manages → <strong>ReplicaSet</strong> → manages → <strong>Pods</strong><br/><br/>
              In practice, you create Deployments. Deployments create ReplicaSets. ReplicaSets create Pods. 
              You rarely interact with ReplicaSets directly.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>ReplicaSets: Ensuring Desired State</h2>
          <p>
            A <strong>ReplicaSet</strong> is a controller that ensures a specified number of Pod replicas 
            are running at any time. If a Pod dies, the ReplicaSet creates a new one. If there are too 
            many Pods, it deletes extras.
          </p>

          <h3>How It Works</h3>
          <div style={{
            background: '#f9fafb',
            border: '2px solid #475569',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h4 style={{ marginTop: 0, color: '#9c0606ff' }}>The ReplicaSet Control Loop</h4>
            <ol style={{ lineHeight: '1.8' }}>
              <li>Check the desired replica count (e.g., 3)</li>
              <li>Count the current running Pods matching its selector</li>
              <li>If current &lt; desired: Create new Pods</li>
              <li>If current &gt; desired: Delete excess Pods</li>
              <li>Repeat continuously</li>
            </ol>
          </div>

          <h3>Example: ReplicaSet YAML</h3>
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
            <div style={{ color: '#64748b' }}># replicaset.yaml</div>
            <div style={{ color: '#f59e0b' }}>apiVersion: apps/v1</div>
            <div style={{ color: '#f59e0b' }}>kind: ReplicaSet</div>
            <div style={{ color: '#f59e0b' }}>metadata:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: nginx-replicaset</div>
            <div style={{ color: '#f59e0b' }}>spec:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;replicas: 3  # Desired state</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;selector:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;matchLabels:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;app: nginx</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;template:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;metadata:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;labels:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;app: nginx</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;spec:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;containers:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: nginx</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;image: nginx:1.21</div>
          </div>

          <div style={{
            background: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#b45309' }}>⚠️ Why You Don't Use ReplicaSets Directly</h3>
            <p style={{ marginBottom: 0 }}>
              ReplicaSets are great at maintaining replica counts, but they're bad at updates. If you 
              need to update your application (change the container image), a ReplicaSet will delete 
              all Pods and create new ones simultaneously—causing downtime. This is where Deployments 
              come in.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Deployments: The Better Way</h2>
          <p>
            A <strong>Deployment</strong> is a higher-level controller that manages ReplicaSets. It 
            provides everything a ReplicaSet does, plus:
          </p>
          <ul>
            <li><strong>Rolling updates:</strong> Update Pods gradually with zero downtime</li>
            <li><strong>Rollback capability:</strong> Revert to previous versions if updates fail</li>
            <li><strong>Update strategies:</strong> Control how updates are applied</li>
            <li><strong>Revision history:</strong> Track changes over time</li>
          </ul>

          <div style={{
            background: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#15803d' }}>✅ Rule of Thumb</h3>
            <p style={{ marginBottom: 0 }}>
              <strong>Always use Deployments, not ReplicaSets.</strong> Deployments give you everything 
              ReplicaSets do, plus smart update capabilities. There's almost never a reason to create 
              a ReplicaSet directly.
            </p>
          </div>

          <h3>Example: Deployment YAML</h3>
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
            <div style={{ color: '#64748b' }}># deployment.yaml</div>
            <div style={{ color: '#f59e0b' }}>apiVersion: apps/v1</div>
            <div style={{ color: '#f59e0b' }}>kind: Deployment</div>
            <div style={{ color: '#f59e0b' }}>metadata:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: nginx-deployment</div>
            <div style={{ color: '#f59e0b' }}>spec:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;replicas: 3</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;selector:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;matchLabels:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;app: nginx</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;template:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;metadata:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;labels:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;app: nginx</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;spec:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;containers:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: nginx</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;image: nginx:1.21</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ports:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- containerPort: 80</div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Desired State vs Current State</h2>
          <p>
            This is the core philosophy of Kubernetes: you declare what you <em>want</em> (desired state), 
            and Kubernetes works to make reality match it (current state).
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            margin: '20px 0'
          }}>
            <div style={{
              border: '2px solid #0ea5e9',
              borderRadius: '12px',
              padding: '24px',
              background: '#f0f9ff'
            }}>
              <h3 style={{ marginTop: 0, color: '#0ea5e9' }}>Desired State</h3>
              <p style={{ color: '#1e293b' }}>
                What you declare in your YAML:
              </p>
              <ul style={{ color: '#1e293b' }}>
                <li>"I want 3 replicas"</li>
                <li>"Using nginx:1.21 image"</li>
                <li>"Each with 512MB memory"</li>
              </ul>
            </div>

            <div style={{
              border: '2px solid #22c55e',
              borderRadius: '12px',
              padding: '24px',
              background: '#f0fdf4'
            }}>
              <h3 style={{ marginTop: 0, color: '#22c55e' }}>Current State</h3>
              <p style={{ color: '#1e293b' }}>
                What's actually running:
              </p>
              <ul style={{ color: '#1e293b' }}>
                <li>2 Pods running (one crashed)</li>
                <li>Using nginx:1.21</li>
                <li>Resources as specified</li>
              </ul>
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            margin: '20px 0',
            padding: '20px',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '2px solid #475569',
            color: '#1e293b'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>⚙️</div>
            <p style={{ fontWeight: 'bold', marginBottom: 0 }}>
              Kubernetes continuously works to reconcile the difference
            </p>
            <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>
              (In this case: creates a new Pod to bring count back to 3)
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Scaling Applications</h2>
          <p>
            Scaling with Deployments is trivial. You just change the replica count, and Kubernetes 
            handles the rest.
          </p>

          <h3>Interactive Scaling Demo</h3>
          <div style={{
            background: '#f9fafb',
            border: '2px solid #475569',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
              <label style={{ fontWeight: 600, color: '#1e293b' }}>Desired Replicas:</label>
              <button
                onClick={() => handleScale(Math.max(1, replicaCount - 1))}
                style={{
                  padding: '8px 16px',
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                −
              </button>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#9c0606ff', minWidth: '40px', textAlign: 'center' }}>
                {replicaCount}
              </span>
              <button
                onClick={() => handleScale(Math.min(10, replicaCount + 1))}
                style={{
                  padding: '8px 16px',
                  background: '#22c55e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                +
              </button>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <strong style={{ color: '#1e293b' }}>Current State:</strong> {currentReplicas} / {replicaCount} Pods running
            </div>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              padding: '20px',
              background: '#1e293b',
              borderRadius: '8px',
              minHeight: '100px',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {Array.from({ length: currentReplicas }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '60px',
                    height: '60px',
                    background: '#22c55e',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    animation: currentReplicas !== replicaCount ? 'pulse 0.5s' : 'none'
                  }}
                >
                  Pod {i + 1}
                </div>
              ))}
            </div>
          </div>

          <h3>Scaling Methods</h3>
          
          <h4 style={{ color: '#9c0606ff' }}>1. Imperative Scaling (Quick & Dirty)</h4>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '16px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            margin: '12px 0'
          }}>
            <div style={{ color: '#22c55e' }}>kubectl scale deployment nginx-deployment --replicas=5</div>
          </div>

          <h4 style={{ color: '#9c0606ff' }}>2. Declarative Scaling (Recommended)</h4>
          <p style={{ color: '#1e293b' }}>Edit your YAML file and apply it:</p>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '16px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            margin: '12px 0'
          }}>
            <div style={{ color: '#64748b' }}># Change replicas: 3 to replicas: 5 in deployment.yaml</div>
            <div style={{ color: '#22c55e' }}>kubectl apply -f deployment.yaml</div>
          </div>

          <h4 style={{ color: '#9c0606ff' }}>3. Autoscaling (Advanced)</h4>
          <p style={{ color: '#1e293b' }}>Let Kubernetes scale automatically based on CPU/memory:</p>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '16px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            margin: '12px 0'
          }}>
            <div style={{ color: '#22c55e' }}>kubectl autoscale deployment nginx-deployment \</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--min=3 --max=10 --cpu-percent=80</div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Rolling Updates: Zero-Downtime Deployments</h2>
          <p>
            This is where Deployments shine. When you update your application (e.g., new container image), 
            Kubernetes performs a <strong>rolling update</strong>—gradually replacing old Pods with new ones.
          </p>

          <h3>How Rolling Updates Work</h3>
          <div style={{
            background: '#f9fafb',
            border: '2px solid #475569',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h4 style={{ marginTop: 0, color: '#9c0606ff' }}>Update Process</h4>
            <ol style={{ lineHeight: '1.8' }}>
              <li>You update the Deployment (e.g., change image from <code>nginx:1.21</code> to <code>nginx:1.22</code>)</li>
              <li>Deployment creates a new ReplicaSet with the new Pod template</li>
              <li>New ReplicaSet gradually scales up</li>
              <li>Old ReplicaSet gradually scales down</li>
              <li>Traffic shifts to new Pods as they become ready</li>
              <li>Old Pods are deleted once new ones are healthy</li>
            </ol>
          </div>

          <h3>Visual: Rolling Update</h3>
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
            <div style={{ color: '#64748b' }}>// Initial state: 3 Pods v1.21</div>
            <div style={{ color: '#22c55e' }}>[Pod v1.21] [Pod v1.21] [Pod v1.21]</div>
            <br/>
            <div style={{ color: '#64748b' }}>// Step 1: Create first new Pod</div>
            <div style={{ color: '#22c55e' }}>[Pod v1.21] [Pod v1.21] [Pod v1.21]</div>
            <div style={{ color: '#0ea5e9' }}>[Pod v1.22] (starting...)</div>
            <br/>
            <div style={{ color: '#64748b' }}>// Step 2: New Pod ready, delete one old Pod</div>
            <div style={{ color: '#22c55e' }}>[Pod v1.21] [Pod v1.21]</div>
            <div style={{ color: '#0ea5e9' }}>[Pod v1.22] ✓</div>
            <br/>
            <div style={{ color: '#64748b' }}>// Step 3: Create second new Pod</div>
            <div style={{ color: '#22c55e' }}>[Pod v1.21] [Pod v1.21]</div>
            <div style={{ color: '#0ea5e9' }}>[Pod v1.22] ✓ [Pod v1.22] (starting...)</div>
            <br/>
            <div style={{ color: '#64748b' }}>// Step 4: Continue until all updated</div>
            <div style={{ color: '#0ea5e9' }}>[Pod v1.22] ✓ [Pod v1.22] ✓ [Pod v1.22] ✓</div>
            <br/>
            <div style={{ color: '#64748b' }}>// Result: Zero downtime! Traffic always served.</div>
          </div>

          <h3>Triggering an Update</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '16px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            margin: '12px 0'
          }}>
            <div style={{ color: '#64748b' }}># Update the image</div>
            <div style={{ color: '#22c55e' }}>kubectl set image deployment/nginx-deployment \</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;nginx=nginx:1.22</div>
            <br/>
            <div style={{ color: '#64748b' }}># Watch the rollout</div>
            <div style={{ color: '#22c55e' }}>kubectl rollout status deployment/nginx-deployment</div>
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
              During a rolling update, your application never goes down. There are always Pods serving 
              traffic. This is how you deploy to production without maintenance windows.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Rollbacks: Undo Bad Deployments</h2>
          <p>
            Made a mistake? Deployed a buggy version? No problem. Deployments keep a revision history, 
            so you can roll back to a previous version instantly.
          </p>

          <h3>Rollback Commands</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '16px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            margin: '12px 0'
          }}>
            <div style={{ color: '#64748b' }}># View rollout history</div>
            <div style={{ color: '#22c55e' }}>kubectl rollout history deployment/nginx-deployment</div>
            <br/>
            <div style={{ color: '#64748b' }}># Undo the latest deployment (rollback)</div>
            <div style={{ color: '#ef4444' }}>kubectl rollout undo deployment/nginx-deployment</div>
            <br/>
            <div style={{ color: '#64748b' }}># Rollback to a specific revision</div>
            <div style={{ color: '#ef4444' }}>kubectl rollout undo deployment/nginx-deployment \</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;--to-revision=2</div>
            <br/>
            <div style={{ color: '#64748b' }}># Pause a rollout (if things go wrong)</div>
            <div style={{ color: '#f59e0b' }}>kubectl rollout pause deployment/nginx-deployment</div>
            <br/>
            <div style={{ color: '#64748b' }}># Resume a paused rollout</div>
            <div style={{ color: '#22c55e' }}>kubectl rollout resume deployment/nginx-deployment</div>
          </div>

          <div style={{
            background: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#15803d' }}>✅ Safety Net</h3>
            <p style={{ marginBottom: 0 }}>
              Rollbacks use the same rolling update strategy. Old Pods gradually come back while new 
              ones are removed. This means even rollbacks are zero-downtime.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Update Strategies</h2>
          <p>Deployments support different strategies for rolling out changes:</p>

          <h3>1. RollingUpdate (Default)</h3>
          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <p><strong>How it works:</strong> Gradually replaces old Pods with new ones</p>
            <ul>
              <li><strong>maxUnavailable:</strong> Maximum number of Pods that can be unavailable during update</li>
              <li><strong>maxSurge:</strong> Maximum number of extra Pods that can be created during update</li>
            </ul>
            <p><strong>Use when:</strong> You need zero downtime (most cases)</p>
          </div>

          <h3>2. Recreate</h3>
          <div style={{
            background: '#fef2f2',
            border: '2px solid #ef4444',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <p><strong>How it works:</strong> Deletes all old Pods, then creates all new Pods</p>
            <ul>
              <li>Causes downtime</li>
              <li>Simpler than rolling updates</li>
            </ul>
            <p><strong>Use when:</strong> Your app can't handle multiple versions running simultaneously (rare)</p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Why Deployments Are Your Best Friend</h2>
          <p>Deployments solve nearly every operational challenge in running applications:</p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            margin: '20px 0'
          }}>
            <div style={{ border: '2px solid #22c55e', borderRadius: '8px', padding: '20px', background: '#f0fdf4' }}>
              <h4 style={{ marginTop: 0, color: '#22c55e' }}>✅ Self-Healing</h4>
              <p style={{ fontSize: '0.9rem', color: '#1e293b' }}>Pods crash? Automatically replaced.</p>
            </div>

            <div style={{ border: '2px solid #22c55e', borderRadius: '8px', padding: '20px', background: '#f0fdf4' }}>
              <h4 style={{ marginTop: 0, color: '#22c55e' }}>✅ Easy Scaling</h4>
              <p style={{ fontSize: '0.9rem', color: '#1e293b' }}>Change replica count, done.</p>
            </div>

            <div style={{ border: '2px solid #22c55e', borderRadius: '8px', padding: '20px', background: '#f0fdf4' }}>
              <h4 style={{ marginTop: 0, color: '#22c55e' }}>✅ Zero-Downtime Updates</h4>
              <p style={{ fontSize: '0.9rem', color: '#1e293b' }}>Deploy new versions without service interruption.</p>
            </div>

            <div style={{ border: '2px solid #22c55e', borderRadius: '8px', padding: '20px', background: '#f0fdf4' }}>
              <h4 style={{ marginTop: 0, color: '#22c55e' }}>✅ Easy Rollbacks</h4>
              <p style={{ fontSize: '0.9rem', color: '#1e293b' }}>Revert to previous versions in seconds.</p>
            </div>

            <div style={{ border: '2px solid #22c55e', borderRadius: '8px', padding: '20px', background: '#f0fdf4' }}>
              <h4 style={{ marginTop: 0, color: '#22c55e' }}>✅ Declarative</h4>
              <p style={{ fontSize: '0.9rem', color: '#1e293b' }}>Describe what you want, not how to get there.</p>
            </div>

            <div style={{ border: '2px solid #22c55e', borderRadius: '8px', padding: '20px', background: '#f0fdf4' }}>
              <h4 style={{ marginTop: 0, color: '#22c55e' }}>✅ Revision History</h4>
              <p style={{ fontSize: '0.9rem', color: '#1e293b' }}>Track all changes, audit deployments.</p>
            </div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Common Deployment Commands</h2>
          
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># Create a deployment</div>
            <div style={{ color: '#22c55e' }}>kubectl create deployment nginx --image=nginx:1.21</div>
            <br/>
            <div style={{ color: '#64748b' }}># List deployments</div>
            <div style={{ color: '#22c55e' }}>kubectl get deployments</div>
            <br/>
            <div style={{ color: '#64748b' }}># Get detailed info</div>
            <div style={{ color: '#22c55e' }}>kubectl describe deployment nginx</div>
            <br/>
            <div style={{ color: '#64748b' }}># Scale deployment</div>
            <div style={{ color: '#22c55e' }}>kubectl scale deployment nginx --replicas=5</div>
            <br/>
            <div style={{ color: '#64748b' }}># Update image (triggers rollout)</div>
            <div style={{ color: '#22c55e' }}>kubectl set image deployment/nginx nginx=nginx:1.22</div>
            <br/>
            <div style={{ color: '#64748b' }}># Watch rollout status</div>
            <div style={{ color: '#22c55e' }}>kubectl rollout status deployment/nginx</div>
            <br/>
            <div style={{ color: '#64748b' }}># Rollback</div>
            <div style={{ color: '#ef4444' }}>kubectl rollout undo deployment/nginx</div>
            <br/>
            <div style={{ color: '#64748b' }}># Delete deployment (deletes all Pods)</div>
            <div style={{ color: '#ef4444' }}>kubectl delete deployment nginx</div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Key Takeaways</h2>
          <ul>
            <li><strong>ReplicaSets</strong> ensure a desired number of Pods are running</li>
            <li><strong>Deployments</strong> manage ReplicaSets and provide update capabilities</li>
            <li><strong>Always use Deployments</strong> instead of ReplicaSets or bare Pods</li>
            <li><strong>Desired state vs current state:</strong> Kubernetes reconciles the difference automatically</li>
            <li><strong>Scaling</strong> is as simple as changing the replica count</li>
            <li><strong>Rolling updates</strong> enable zero-downtime deployments</li>
            <li><strong>Rollbacks</strong> provide instant recovery from bad deployments</li>
            <li>Deployments are your best friend for running stateless applications</li>
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
          <Link href="/module-2-1" legacyBehavior>
            <a style={{
              textDecoration: 'none',
              color: '#94a3b8',
              fontWeight: 600,
              padding: '12px 24px',
              border: '2px solid #475569',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>← Previous: Pods</a>
          </Link>
          
          <Link href="/module-2-3" legacyBehavior>
            <a style={{
              textDecoration: 'none',
              color: '#fff',
              background: '#9c0606ff',
              fontWeight: 600,
              padding: '12px 24px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>Next: Services →</a>
          </Link>
        </div>
      </main>
    </div>
  );
}
