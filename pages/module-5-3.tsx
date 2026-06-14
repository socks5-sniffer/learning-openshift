import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Module53() {
  const [showScale, setShowScale] = useState(false);
  const [replicas, setReplicas] = useState(3);

  return (
    <div className={styles.container}>
      <Head>
        <title>Module 5.3: StatefulSets</title>
        <meta name="description" content="Understanding StatefulSets and running stateful applications in Kubernetes" />
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
        <h1 className={styles.title}>Module 5.3: StatefulSets</h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280', marginTop: '-10px' }}>
          When Stateless Isn't an Option (Databases in Kubernetes, Carefully)
        </p>
        
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/module-5-2" legacyBehavior>
            <a style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>
              ← Previous: PVs & PVCs
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/learning-modules" legacyBehavior>
            <a style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>
              All Modules
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/module-6-1" legacyBehavior>
            <a style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>
              Next: Networking Model →
            </a>
          </Link>
        </div>
        
        <section className={styles.spotlight}>
          <h2>The Stateless vs Stateful Problem</h2>
          <p>
            We've been designing for <strong>stateless</strong> applications (Module 5.1). Web servers 
            are easy: any Pod can handle any request, Pods are interchangeable, you can scale up/down 
            freely. But what about databases?
          </p>

          <div style={{
            background: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#b45309' }}>The Database Problem</h3>
            <ul style={{ marginBottom: 0 }}>
              <li><strong>Identity matters:</strong> PostgreSQL primary is different from replica</li>
              <li><strong>Startup order matters:</strong> Replica must connect to primary (primary first!)</li>
              <li><strong>Storage is tied to identity:</strong> postgres-0's data ≠ postgres-1's data</li>
              <li><strong>Network identity is stable:</strong> Clients connect to primary by name</li>
              <li><strong>Shutdown order matters:</strong> Gracefully stop primary last</li>
            </ul>
          </div>

          <p>
            <strong>Deployments</strong> (Module 2.2) don't provide these guarantees. They create Pods 
            with random names (<code>web-app-abc123</code>), any Pod can be killed first, and there's 
            no persistent network identity. This is fine for stateless apps, catastrophic for databases.
          </p>

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#0369a1' }}>✅ Enter StatefulSets</h3>
            <p style={{ marginBottom: 0 }}>
              A <strong>StatefulSet</strong> is like a Deployment, but provides:
            </p>
            <ul style={{ marginBottom: 0 }}>
              <li><strong>Stable network identity:</strong> Pods get predictable names (<code>postgres-0</code>, <code>postgres-1</code>)</li>
              <li><strong>Ordered deployment:</strong> Pods start in order (0, 1, 2...)</li>
              <li><strong>Ordered scaling:</strong> Pods terminate in reverse order (2, 1, 0...)</li>
              <li><strong>Persistent storage per Pod:</strong> Each Pod gets its own PVC</li>
            </ul>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>StatefulSet vs Deployment</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            margin: '20px 0'
          }}>
            <div style={{
              border: '2px solid #22c55e',
              borderRadius: '12px',
              padding: '20px',
              background: '#f0fdf4'
            }}>
              <h3 style={{ marginTop: 0, color: '#22c55e' }}>Deployment (Stateless)</h3>
              <ul style={{ color: '#1e293b', fontSize: '0.9rem', marginBottom: 0 }}>
                <li><strong>Pod names:</strong> Random (<code>web-abc123</code>)</li>
                <li><strong>Scaling:</strong> Any order</li>
                <li><strong>Storage:</strong> Shared or no persistent storage</li>
                <li><strong>Network:</strong> No stable DNS name per Pod</li>
                <li><strong>Use case:</strong> Web servers, APIs, workers</li>
              </ul>
            </div>

            <div style={{
              border: '2px solid #f59e0b',
              borderRadius: '12px',
              padding: '20px',
              background: '#fef3c7'
            }}>
              <h3 style={{ marginTop: 0, color: '#f59e0b' }}>StatefulSet (Stateful)</h3>
              <ul style={{ color: '#1e293b', fontSize: '0.9rem', marginBottom: 0 }}>
                <li><strong>Pod names:</strong> Ordered (<code>db-0</code>, <code>db-1</code>)</li>
                <li><strong>Scaling:</strong> Sequential order</li>
                <li><strong>Storage:</strong> Each Pod gets its own PVC</li>
                <li><strong>Network:</strong> Stable DNS: <code>db-0.svc.ns</code></li>
                <li><strong>Use case:</strong> Databases, Kafka, ZooKeeper</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Interactive: StatefulSet Scaling Behavior</h2>
          <p>
            Adjust the number of replicas and observe how StatefulSets scale predictably:
          </p>

          <div style={{
            background: '#f9fafb',
            border: '2px solid #475569',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontWeight: 600,
                marginBottom: '8px',
                color: '#1e293b'
              }}>
                Replicas: {replicas}
              </label>
              <input
                type="range"
                min="0"
                max="5"
                value={replicas}
                onChange={(e) => {
                  setReplicas(Number(e.target.value));
                  setShowScale(true);
                  setTimeout(() => setShowScale(false), 3000);
                }}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              margin: '20px 0'
            }}>
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '12px',
                    background: i < replicas ? '#22c55e' : '#334155',
                    border: `3px solid ${i < replicas ? '#16a34a' : '#d1d5db'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s',
                    opacity: i < replicas ? 1 : 0.3
                  }}
                >
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: i < replicas ? '#fff' : '#9ca3af'
                  }}>
                    {i < replicas ? '✓' : '○'}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: i < replicas ? '#fff' : '#9ca3af',
                    fontFamily: 'monospace',
                    marginTop: '4px'
                  }}>
                    db-{i}
                  </div>
                </div>
              ))}
            </div>

            {showScale && (
              <div style={{
                background: '#f0f9ff',
                border: '2px solid #0ea5e9',
                borderRadius: '8px',
                padding: '16px',
                margin: '16px 0',
                color: '#1e293b',
                animation: 'fadeIn 0.3s'
              }}>
                <p style={{ margin: 0 }}>
                  <strong>Scaling behavior:</strong> StatefulSets scale <strong>one Pod at a time</strong> 
                  in order. Scaling up: db-0 → db-1 → db-2. Scaling down: db-2 → db-1 → db-0.
                </p>
              </div>
            )}

            <div style={{
              background: '#1e293b',
              color: '#e2e8f0',
              padding: '20px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              marginTop: '20px'
            }}>
              <div style={{ color: '#64748b' }}># Current Pods:</div>
              {Array.from({ length: replicas }, (_, i) => (
                <div key={i} style={{ color: '#22c55e', marginTop: '4px' }}>
                  db-{i}.postgres-service.default.svc.cluster.local (Running)
                </div>
              ))}
              {replicas === 0 && (
                <div style={{ color: '#6b7280', fontStyle: 'italic' }}>No Pods running</div>
              )}
            </div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Creating a StatefulSet</h2>
          <p>
            StatefulSets require a <strong>Headless Service</strong> to provide stable network 
            identities for each Pod.
          </p>

          <h3>Step 1: Create Headless Service</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># headless-service.yaml</div>
            <div style={{ color: '#f59e0b' }}>apiVersion: v1</div>
            <div style={{ color: '#f59e0b' }}>kind: Service</div>
            <div style={{ color: '#f59e0b' }}>metadata:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: postgres-service</div>
            <div style={{ color: '#f59e0b' }}>spec:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;clusterIP: None  # Headless = no load balancing</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;selector:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;app: postgres</div>
            <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;ports:</div>
            <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;- port: 5432</div>
          </div>

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '16px',
            margin: '16px 0',
            color: '#1e293b'
          }}>
            <p style={{ margin: 0 }}>
              <strong>Headless Service:</strong> <code>clusterIP: None</code> means no virtual IP. 
              DNS returns the actual Pod IPs instead. This gives each Pod a stable DNS name: 
              <code>postgres-0.postgres-service.default.svc.cluster.local</code>
            </p>
          </div>

          <h3>Step 2: Create StatefulSet</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># statefulset.yaml</div>
            <div style={{ color: '#f59e0b' }}>apiVersion: apps/v1</div>
            <div style={{ color: '#f59e0b' }}>kind: StatefulSet</div>
            <div style={{ color: '#f59e0b' }}>metadata:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: postgres</div>
            <div style={{ color: '#f59e0b' }}>spec:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;serviceName: postgres-service  # Links to headless service</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;replicas: 3</div>
            <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;selector:</div>
            <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;matchLabels:</div>
            <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;app: postgres</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;template:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;metadata:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;labels:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;app: postgres</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;spec:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;containers:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: postgres</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;image: postgres:14</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;volumeMounts:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: data</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mountPath: /var/lib/postgresql/data</div>
            <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;volumeClaimTemplates:  # Auto-create PVC per Pod</div>
            <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;- metadata:</div>
            <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: data</div>
            <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;spec:</div>
            <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;accessModes: ["ReadWriteOnce"]</div>
            <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;storageClassName: fast-ssd</div>
            <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;resources:</div>
            <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;requests:</div>
            <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;storage: 10Gi</div>
          </div>

          <h3>What Gets Created</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '16px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#22c55e' }}>kubectl apply -f statefulset.yaml</div>
            <br/>
            <div style={{ color: '#0ea5e9' }}>kubectl get pods</div>
            <div style={{ color: '#64748b' }}>NAME         READY   STATUS</div>
            <div style={{ color: '#22c55e' }}>postgres-0   1/1     Running  # Created first</div>
            <div style={{ color: '#22c55e' }}>postgres-1   1/1     Running  # Then this</div>
            <div style={{ color: '#22c55e' }}>postgres-2   1/1     Running  # Then this</div>
            <br/>
            <div style={{ color: '#0ea5e9' }}>kubectl get pvc</div>
            <div style={{ color: '#64748b' }}>NAME             STATUS   VOLUME</div>
            <div style={{ color: '#f59e0b' }}>data-postgres-0  Bound    pvc-abc123  # Each Pod gets its own PVC</div>
            <div style={{ color: '#f59e0b' }}>data-postgres-1  Bound    pvc-def456</div>
            <div style={{ color: '#f59e0b' }}>data-postgres-2  Bound    pvc-ghi789</div>
          </div>

          <div style={{
            background: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '8px',
            padding: '16px',
            margin: '16px 0',
            color: '#1e293b'
          }}>
            <p style={{ margin: 0 }}>
              <strong>Key Point:</strong> Each Pod gets its <strong>own</strong> PersistentVolumeClaim. 
              <code>postgres-0</code> always uses <code>data-postgres-0</code>, even if the Pod is 
              deleted and recreated. The storage is tied to the Pod's identity.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Stable Network Identity</h2>
          <p>
            StatefulSet Pods get predictable DNS names that other Pods can rely on:
          </p>

          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#22c55e' }}># DNS format:</div>
            <div style={{ color: '#22c55e' }}>{"<pod-name>.<service-name>.<namespace>.svc.cluster.local"}</div>
            <br/>
            <div style={{ color: '#0ea5e9' }}># Examples:</div>
            <div style={{ color: '#0ea5e9' }}>postgres-0.postgres-service.default.svc.cluster.local</div>
            <div style={{ color: '#0ea5e9' }}>postgres-1.postgres-service.default.svc.cluster.local</div>
            <div style={{ color: '#0ea5e9' }}>postgres-2.postgres-service.default.svc.cluster.local</div>
            <br/>
            <div style={{ color: '#64748b' }}># Connect from another Pod:</div>
            <div style={{ color: '#f59e0b' }}>psql -h postgres-0.postgres-service -U postgres</div>
          </div>

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '16px',
            margin: '16px 0',
            color: '#1e293b'
          }}>
            <p style={{ margin: 0 }}>
              <strong>Use case:</strong> PostgreSQL primary-replica setup. Configure replica to 
              connect to <code>postgres-0</code> (primary). Even if <code>postgres-0</code> dies 
              and is recreated, the DNS name stays the same.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Ordered Startup and Shutdown</h2>

          <h3>Startup Order</h3>
          <div style={{
            background: '#f9fafb',
            border: '2px solid #475569',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <ol>
              <li>StatefulSet creates <code>postgres-0</code></li>
              <li>Waits for <code>postgres-0</code> to be <code>Running</code> and <code>Ready</code></li>
              <li>Then creates <code>postgres-1</code></li>
              <li>Waits for <code>postgres-1</code> to be <code>Ready</code></li>
              <li>Then creates <code>postgres-2</code></li>
            </ol>
          </div>

          <h3>Shutdown Order (Scaling Down)</h3>
          <div style={{
            background: '#f9fafb',
            border: '2px solid #475569',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <ol>
              <li>Scale down: <code>kubectl scale statefulset postgres --replicas=1</code></li>
              <li>StatefulSet deletes <code>postgres-2</code> (highest index first)</li>
              <li>Waits for <code>postgres-2</code> to terminate completely</li>
              <li>Then deletes <code>postgres-1</code></li>
              <li><code>postgres-0</code> remains running</li>
            </ol>
          </div>

          <div style={{
            background: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '8px',
            padding: '16px',
            margin: '16px 0',
            color: '#1e293b'
          }}>
            <p style={{ margin: 0 }}>
              <strong>💡 Why this matters:</strong> Database replicas should shut down before the 
              primary. StatefulSet's reverse-order termination ensures <code>postgres-0</code> 
              (usually the primary) is shut down last.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Parallel vs Ordered Deployment</h2>
          <p>
            By default, StatefulSets deploy Pods <strong>one at a time</strong>. You can change this:
          </p>

          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#f59e0b' }}>spec:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;podManagementPolicy: OrderedReady  # Default: one at a time</div>
            <div style={{ color: '#64748b' }}>&nbsp;&nbsp;# OR</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;podManagementPolicy: Parallel  # Create all Pods at once</div>
          </div>

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '16px',
            margin: '16px 0',
            color: '#1e293b'
          }}>
            <p style={{ margin: 0 }}>
              <strong>Parallel:</strong> Faster startup, but loses ordering guarantees. Use when 
              Pods don't depend on each other (e.g., Kafka brokers that discover each other).
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Database Example: PostgreSQL Primary-Replica</h2>
          <p>
            Let's design a real-world PostgreSQL deployment with primary-replica replication:
          </p>

          <div style={{
            background: '#f9fafb',
            border: '2px solid #475569',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#9c0606ff' }}>Architecture</h3>
            <ul>
              <li><code>postgres-0</code>: Primary (read/write)</li>
              <li><code>postgres-1</code>, <code>postgres-2</code>: Replicas (read-only)</li>
              <li>Replicas stream WAL logs from primary</li>
              <li>App writes to primary, reads from any replica</li>
            </ul>
          </div>

          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># Init container: Configure replica or primary</div>
            <div style={{ color: '#f59e0b' }}>initContainers:</div>
            <div style={{ color: '#f59e0b' }}>- name: init-postgres</div>
            <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;image: postgres:14</div>
            <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;command:</div>
            <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;- bash</div>
            <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;- -c</div>
            <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;- |</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;if [[ $HOSTNAME == *-0 ]]; then</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;echo "I am primary"</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Initialize as primary</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;else</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;echo "I am replica"</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# pg_basebackup from postgres-0</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pg_basebackup -h postgres-0.postgres-service -D /data -U replicator</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;fi</div>
          </div>

          <h3>Services for Read/Write Separation</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># Primary service (write traffic)</div>
            <div style={{ color: '#f59e0b' }}>apiVersion: v1</div>
            <div style={{ color: '#f59e0b' }}>kind: Service</div>
            <div style={{ color: '#f59e0b' }}>metadata:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: postgres-primary</div>
            <div style={{ color: '#f59e0b' }}>spec:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;selector:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;app: postgres</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;statefulset.kubernetes.io/pod-name: postgres-0  # Only postgres-0</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;ports:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;- port: 5432</div>
            <br/>
            <div style={{ color: '#64748b' }}># Replica service (read traffic, load balanced)</div>
            <div style={{ color: '#0ea5e9' }}>apiVersion: v1</div>
            <div style={{ color: '#0ea5e9' }}>kind: Service</div>
            <div style={{ color: '#0ea5e9' }}>metadata:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: postgres-replicas</div>
            <div style={{ color: '#0ea5e9' }}>spec:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;selector:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;app: postgres  # All Pods</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;ports:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;- port: 5432</div>
          </div>

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '16px',
            margin: '16px 0',
            color: '#1e293b'
          }}>
            <p style={{ margin: 0 }}>
              <strong>Usage:</strong> App writes to <code>postgres-primary:5432</code> (only postgres-0). 
              App reads from <code>postgres-replicas:5432</code> (load-balanced across all Pods).
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Should You Run Databases in Kubernetes?</h2>

          <div style={{
            background: '#fef2f2',
            border: '3px solid #ef4444',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#dc2626' }}>⚠️ The Honest Answer: It's Complicated</h3>
            <p>
              Running databases in Kubernetes is <strong>possible</strong> with StatefulSets, but 
              comes with challenges:
            </p>
            <ul>
              <li><strong>Complexity:</strong> StatefulSets + PVs + backups + monitoring + disaster recovery</li>
              <li><strong>Performance:</strong> Network-attached storage is slower than local SSDs</li>
              <li><strong>Operational burden:</strong> You're responsible for upgrades, failovers, backups</li>
              <li><strong>Brain damage:</strong> Debugging storage issues at 3am is not fun</li>
            </ul>
          </div>

          <h3>When to Run Databases in Kubernetes</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            margin: '20px 0'
          }}>
            <div style={{
              border: '2px solid #22c55e',
              borderRadius: '8px',
              padding: '20px',
              background: '#f0fdf4'
            }}>
              <h4 style={{ marginTop: 0, color: '#22c55e' }}>✅ Good Fit</h4>
              <ul style={{ color: '#1e293b', fontSize: '0.9rem', marginBottom: 0 }}>
                <li>Development/staging environments</li>
                <li>Stateful apps you already manage (Kafka, Redis)</li>
                <li>Kubernetes-native databases (CockroachDB, YugabyteDB)</li>
                <li>Small-scale production (if you have expertise)</li>
                <li>Using operators (Percona, Zalando Postgres Operator)</li>
              </ul>
            </div>

            <div style={{
              border: '2px solid #ef4444',
              borderRadius: '8px',
              padding: '20px',
              background: '#fef2f2'
            }}>
              <h4 style={{ marginTop: 0, color: '#ef4444' }}>❌ Use Managed Service</h4>
              <ul style={{ color: '#1e293b', fontSize: '0.9rem', marginBottom: 0 }}>
                <li>Production critical data</li>
                <li>When you lack database expertise</li>
                <li>Large-scale databases (multi-TB)</li>
                <li>Compliance requirements (SOC2, HIPAA)</li>
                <li>When uptime is critical (AWS RDS, Cloud SQL)</li>
              </ul>
            </div>
          </div>

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#0369a1' }}>💡 The Middle Ground: Operators</h3>
            <p style={{ marginBottom: 0 }}>
              <strong>Kubernetes Operators</strong> automate database management (backups, failovers, 
              upgrades). Examples: <strong>Percona Operator</strong> (MySQL/MongoDB), 
              <strong>Zalando Postgres Operator</strong>, <strong>CrunchyData Postgres Operator</strong>. 
              They reduce the operational burden significantly.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>StatefulSet Gotchas</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '12px',
            margin: '20px 0'
          }}>
            <div style={{
              border: '2px solid #f59e0b',
              borderRadius: '8px',
              padding: '16px',
              background: '#fef3c7'
            }}>
              <h4 style={{ marginTop: 0, color: '#f59e0b', fontSize: '0.95rem' }}>
                ⚠️ Deleting StatefulSet Doesn't Delete PVCs
              </h4>
              <p style={{ color: '#1e293b', margin: 0, fontSize: '0.85rem' }}>
                <strong>Behavior:</strong> <code>kubectl delete statefulset postgres</code> deletes 
                Pods but keeps PVCs (and their data)<br/>
                <strong>Why:</strong> Safety - prevents accidental data loss<br/>
                <strong>Fix:</strong> Delete PVCs manually: <code>kubectl delete pvc -l app=postgres</code>
              </p>
            </div>

            <div style={{
              border: '2px solid #f59e0b',
              borderRadius: '8px',
              padding: '16px',
              background: '#fef3c7'
            }}>
              <h4 style={{ marginTop: 0, color: '#f59e0b', fontSize: '0.95rem' }}>
                ⚠️ Pod Stuck in "Pending" After Node Failure
              </h4>
              <p style={{ color: '#1e293b', margin: 0, fontSize: '0.85rem' }}>
                <strong>Cause:</strong> RWO volume still attached to failed node<br/>
                <strong>Fix:</strong> Manually delete the old Pod: <code>kubectl delete pod postgres-0 --force --grace-period=0</code><br/>
                <strong>Better:</strong> Use Cluster Autoscaler or Pod Disruption Budgets
              </p>
            </div>

            <div style={{
              border: '2px solid #f59e0b',
              borderRadius: '8px',
              padding: '16px',
              background: '#fef3c7'
            }}>
              <h4 style={{ marginTop: 0, color: '#f59e0b', fontSize: '0.95rem' }}>
                ⚠️ Slow Scaling (Sequential Startup)
              </h4>
              <p style={{ color: '#1e293b', margin: 0, fontSize: '0.85rem' }}>
                <strong>Problem:</strong> Scaling from 3 to 10 replicas takes time (one Pod at a time)<br/>
                <strong>Workaround:</strong> Use <code>podManagementPolicy: Parallel</code> if Pods are independent<br/>
                <strong>Trade-off:</strong> Loses ordering guarantees
              </p>
            </div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Key Takeaways</h2>
          <ul>
            <li><strong>StatefulSets</strong> provide stable identities for Pods (ordered names, persistent storage)</li>
            <li><strong>Predictable names:</strong> <code>postgres-0</code>, <code>postgres-1</code> (not random)</li>
            <li><strong>Ordered deployment:</strong> Pods start sequentially (0 → 1 → 2)</li>
            <li><strong>Ordered shutdown:</strong> Pods terminate in reverse (2 → 1 → 0)</li>
            <li><strong>volumeClaimTemplates:</strong> Each Pod gets its own PVC</li>
            <li><strong>Headless Service:</strong> Required for stable DNS names (<code>pod.service.namespace</code>)</li>
            <li><strong>Use cases:</strong> Databases, message queues, distributed systems (Kafka, ZooKeeper)</li>
            <li><strong>Not for everything:</strong> Most apps should be stateless (use Deployments)</li>
            <li><strong>Database in K8s:</strong> Possible with StatefulSets, but consider managed services (RDS, Cloud SQL)</li>
            <li><strong>Operators help:</strong> Automate database management (Percona, Zalando Postgres Operator)</li>
            <li>Deleting StatefulSet keeps PVCs (manual cleanup required)</li>
            <li>StatefulSets are complex - only use when you truly need statefulness</li>
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
          <Link href="/module-5-2" legacyBehavior>
            <a style={{
              textDecoration: 'none',
              color: '#94a3b8',
              fontWeight: 600,
              padding: '12px 24px',
              border: '2px solid #475569',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>← Previous: PersistentVolumes & Claims</a>
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
            }}>Part 5 Complete! →</a>
          </Link>
        </div>
      </main>
    </div>
  );
}
