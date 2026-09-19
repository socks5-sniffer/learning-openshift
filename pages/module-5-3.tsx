import { useState } from 'react';
import styles from '../styles/Home.module.css';
import moduleStyles from '../styles/Module.module.css';
import ModuleShell from '../components/module/ModuleShell';
import Callout from '../components/module/Callout';
import TermBox from '../components/module/TermBox';

export default function Module53() {
  const [showScale, setShowScale] = useState(false);
  const [replicas, setReplicas] = useState(3);

  return (
    <ModuleShell id="5-3" subtitle="When Stateless Isn't an Option (Databases in Kubernetes, Carefully)">
      <section className={styles.spotlight}>
        <h2>The Stateless vs Stateful Problem</h2>
        <p>
          We've been designing for <strong>stateless</strong> applications (Module 5.1). Web servers
          are easy: any Pod can handle any request, Pods are interchangeable, you can scale up/down
          freely. But what about databases?
        </p>

        <Callout variant="warning" title="The Database Problem">
          <ul>
            <li><strong>Identity matters:</strong> PostgreSQL primary is different from replica</li>
            <li><strong>Startup order matters:</strong> Replica must connect to primary (primary first!)</li>
            <li><strong>Storage is tied to identity:</strong> postgres-0's data ≠ postgres-1's data</li>
            <li><strong>Network identity is stable:</strong> Clients connect to primary by name</li>
            <li><strong>Shutdown order matters:</strong> Gracefully stop primary last</li>
          </ul>
        </Callout>

        <p>
          <strong>Deployments</strong> (Module 2.2) don't provide these guarantees. They create Pods
          with random names (<code>web-app-abc123</code>), any Pod can be killed first, and there's
          no persistent network identity. This is fine for stateless apps, catastrophic for databases.
        </p>

        <Callout variant="info" icon="✅" title="Enter StatefulSets">
          <p>A <strong>StatefulSet</strong> is like a Deployment, but provides:</p>
          <ul>
            <li><strong>Stable network identity:</strong> Pods get predictable names (<code>postgres-0</code>, <code>postgres-1</code>)</li>
            <li><strong>Ordered deployment:</strong> Pods start in order (0, 1, 2...)</li>
            <li><strong>Ordered scaling:</strong> Pods terminate in reverse order (2, 1, 0...)</li>
            <li><strong>Persistent storage per Pod:</strong> Each Pod gets its own PVC</li>
          </ul>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>StatefulSet vs Deployment</h2>

        <div className={moduleStyles.grid}>
          <Callout variant="success" title="Deployment (Stateless)">
            <ul>
              <li><strong>Pod names:</strong> Random (<code>web-abc123</code>)</li>
              <li><strong>Scaling:</strong> Any order</li>
              <li><strong>Storage:</strong> Shared or no persistent storage</li>
              <li><strong>Network:</strong> No stable DNS name per Pod</li>
              <li><strong>Use case:</strong> Web servers, APIs, workers</li>
            </ul>
          </Callout>
          <Callout variant="warning" title="StatefulSet (Stateful)">
            <ul>
              <li><strong>Pod names:</strong> Ordered (<code>db-0</code>, <code>db-1</code>)</li>
              <li><strong>Scaling:</strong> Sequential order</li>
              <li><strong>Storage:</strong> Each Pod gets its own PVC</li>
              <li><strong>Network:</strong> Stable DNS: <code>db-0.svc.ns</code></li>
              <li><strong>Use case:</strong> Databases, Kafka, ZooKeeper</li>
            </ul>
          </Callout>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>Interactive: StatefulSet Scaling Behavior</h2>
        <p>Adjust the number of replicas and observe how StatefulSets scale predictably:</p>

        <div style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '24px', margin: '20px 0' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-primary)' }}>Replicas: {replicas}</label>
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

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', margin: '20px 0' }}>
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--radius-lg)',
                  background: i < replicas ? '#22c55e' : 'var(--color-bg-tertiary)',
                  border: `2px solid ${i < replicas ? '#16a34a' : 'var(--color-border)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                  opacity: i < replicas ? 1 : 0.5,
                }}
              >
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: i < replicas ? '#fff' : 'var(--color-text-muted)' }}>
                  {i < replicas ? '✓' : '○'}
                </div>
                <div style={{ fontSize: '0.75rem', color: i < replicas ? '#fff' : 'var(--color-text-muted)', fontFamily: 'monospace', marginTop: '4px' }}>
                  db-{i}
                </div>
              </div>
            ))}
          </div>

          {showScale && (
            <Callout variant="info">
              <p>
                <strong>Scaling behavior:</strong> StatefulSets scale <strong>one Pod at a time</strong>
                in order. Scaling up: db-0 → db-1 → db-2. Scaling down: db-2 → db-1 → db-0.
              </p>
            </Callout>
          )}

          <TermBox copyable={false}>
            <div style={{ color: '#64748b' }}># Current Pods:</div>
            {Array.from({ length: replicas }, (_, i) => (
              <div key={i} style={{ color: '#22c55e', marginTop: '4px' }}>
                db-{i}.postgres-service.default.svc.cluster.local (Running)
              </div>
            ))}
            {replicas === 0 && <div style={{ color: '#6b7280', fontStyle: 'italic' }}>No Pods running</div>}
          </TermBox>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>Creating a StatefulSet</h2>
        <p>
          StatefulSets require a <strong>Headless Service</strong> to provide stable network
          identities for each Pod.
        </p>

        <h3>Step 1: Create Headless Service</h3>
        <TermBox>
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
        </TermBox>

        <Callout variant="info">
          <p>
            <strong>Headless Service:</strong> <code>clusterIP: None</code> means no virtual IP.
            DNS returns the actual Pod IPs instead. This gives each Pod a stable DNS name:
            <code>postgres-0.postgres-service.default.svc.cluster.local</code>
          </p>
        </Callout>

        <h3>Step 2: Create StatefulSet</h3>
        <TermBox>
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
        </TermBox>

        <h3>What Gets Created</h3>
        <TermBox>
          <div style={{ color: '#22c55e' }}>kubectl apply -f statefulset.yaml</div>
          <br />
          <div style={{ color: '#0ea5e9' }}>kubectl get pods</div>
          <div style={{ color: '#64748b' }}>NAME         READY   STATUS</div>
          <div style={{ color: '#22c55e' }}>postgres-0   1/1     Running  # Created first</div>
          <div style={{ color: '#22c55e' }}>postgres-1   1/1     Running  # Then this</div>
          <div style={{ color: '#22c55e' }}>postgres-2   1/1     Running  # Then this</div>
          <br />
          <div style={{ color: '#0ea5e9' }}>kubectl get pvc</div>
          <div style={{ color: '#64748b' }}>NAME             STATUS   VOLUME</div>
          <div style={{ color: '#f59e0b' }}>data-postgres-0  Bound    pvc-abc123  # Each Pod gets its own PVC</div>
          <div style={{ color: '#f59e0b' }}>data-postgres-1  Bound    pvc-def456</div>
          <div style={{ color: '#f59e0b' }}>data-postgres-2  Bound    pvc-ghi789</div>
        </TermBox>

        <Callout variant="success" title="Key Point">
          <p>
            Each Pod gets its <strong>own</strong> PersistentVolumeClaim.
            <code>postgres-0</code> always uses <code>data-postgres-0</code>, even if the Pod is
            deleted and recreated. The storage is tied to the Pod's identity.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Stable Network Identity</h2>
        <p>StatefulSet Pods get predictable DNS names that other Pods can rely on:</p>

        <TermBox>
          <div style={{ color: '#22c55e' }}># DNS format:</div>
          <div style={{ color: '#22c55e' }}>{"<pod-name>.<service-name>.<namespace>.svc.cluster.local"}</div>
          <br />
          <div style={{ color: '#0ea5e9' }}># Examples:</div>
          <div style={{ color: '#0ea5e9' }}>postgres-0.postgres-service.default.svc.cluster.local</div>
          <div style={{ color: '#0ea5e9' }}>postgres-1.postgres-service.default.svc.cluster.local</div>
          <div style={{ color: '#0ea5e9' }}>postgres-2.postgres-service.default.svc.cluster.local</div>
          <br />
          <div style={{ color: '#64748b' }}># Connect from another Pod:</div>
          <div style={{ color: '#f59e0b' }}>psql -h postgres-0.postgres-service -U postgres</div>
        </TermBox>

        <Callout variant="info">
          <p>
            <strong>Use case:</strong> PostgreSQL primary-replica setup. Configure replica to
            connect to <code>postgres-0</code> (primary). Even if <code>postgres-0</code> dies
            and is recreated, the DNS name stays the same.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Ordered Startup and Shutdown</h2>

        <h3>Startup Order</h3>
        <Callout variant="neutral">
          <ol>
            <li>StatefulSet creates <code>postgres-0</code></li>
            <li>Waits for <code>postgres-0</code> to be <code>Running</code> and <code>Ready</code></li>
            <li>Then creates <code>postgres-1</code></li>
            <li>Waits for <code>postgres-1</code> to be <code>Ready</code></li>
            <li>Then creates <code>postgres-2</code></li>
          </ol>
        </Callout>

        <h3>Shutdown Order (Scaling Down)</h3>
        <Callout variant="neutral">
          <ol>
            <li>Scale down: <code>kubectl scale statefulset postgres --replicas=1</code></li>
            <li>StatefulSet deletes <code>postgres-2</code> (highest index first)</li>
            <li>Waits for <code>postgres-2</code> to terminate completely</li>
            <li>Then deletes <code>postgres-1</code></li>
            <li><code>postgres-0</code> remains running</li>
          </ol>
        </Callout>

        <Callout variant="warning">
          <p>
            <strong>💡 Why this matters:</strong> Database replicas should shut down before the
            primary. StatefulSet's reverse-order termination ensures <code>postgres-0</code>
            (usually the primary) is shut down last.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Parallel vs Ordered Deployment</h2>
        <p>By default, StatefulSets deploy Pods <strong>one at a time</strong>. You can change this:</p>

        <TermBox>
          <div style={{ color: '#f59e0b' }}>spec:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;podManagementPolicy: OrderedReady  # Default: one at a time</div>
          <div style={{ color: '#64748b' }}>&nbsp;&nbsp;# OR</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;podManagementPolicy: Parallel  # Create all Pods at once</div>
        </TermBox>

        <Callout variant="info">
          <p>
            <strong>Parallel:</strong> Faster startup, but loses ordering guarantees. Use when
            Pods don't depend on each other (e.g., Kafka brokers that discover each other).
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Database Example: PostgreSQL Primary-Replica</h2>
        <p>Let's design a real-world PostgreSQL deployment with primary-replica replication:</p>

        <Callout variant="neutral" title="Architecture">
          <ul>
            <li><code>postgres-0</code>: Primary (read/write)</li>
            <li><code>postgres-1</code>, <code>postgres-2</code>: Replicas (read-only)</li>
            <li>Replicas stream WAL logs from primary</li>
            <li>App writes to primary, reads from any replica</li>
          </ul>
        </Callout>

        <TermBox>
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
        </TermBox>

        <h3>Services for Read/Write Separation</h3>
        <TermBox>
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
          <br />
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
        </TermBox>

        <Callout variant="info">
          <p>
            <strong>Usage:</strong> App writes to <code>postgres-primary:5432</code> (only postgres-0).
            App reads from <code>postgres-replicas:5432</code> (load-balanced across all Pods).
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Should You Run Databases in Kubernetes?</h2>

        <Callout variant="danger" icon="⚠️" title="The Honest Answer: It's Complicated">
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
        </Callout>

        <h3>When to Run Databases in Kubernetes</h3>
        <div className={moduleStyles.grid}>
          <Callout variant="success" title="✅ Good Fit">
            <ul>
              <li>Development/staging environments</li>
              <li>Stateful apps you already manage (Kafka, Redis)</li>
              <li>Kubernetes-native databases (CockroachDB, YugabyteDB)</li>
              <li>Small-scale production (if you have expertise)</li>
              <li>Using operators (Percona, Zalando Postgres Operator)</li>
            </ul>
          </Callout>
          <Callout variant="danger" title="❌ Use Managed Service">
            <ul>
              <li>Production critical data</li>
              <li>When you lack database expertise</li>
              <li>Large-scale databases (multi-TB)</li>
              <li>Compliance requirements (SOC2, HIPAA)</li>
              <li>When uptime is critical (AWS RDS, Cloud SQL)</li>
            </ul>
          </Callout>
        </div>

        <Callout variant="info" icon="💡" title="The Middle Ground: Operators">
          <p>
            <strong>Kubernetes Operators</strong> automate database management (backups, failovers,
            upgrades). Examples: <strong>Percona Operator</strong> (MySQL/MongoDB),
            <strong>Zalando Postgres Operator</strong>, <strong>CrunchyData Postgres Operator</strong>.
            They reduce the operational burden significantly.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>StatefulSet Gotchas</h2>

        <div style={{ display: 'grid', gap: '0.75rem', margin: '1.5rem 0' }}>
          <Callout variant="warning" title="⚠️ Deleting StatefulSet Doesn't Delete PVCs">
            <p>
              <strong>Behavior:</strong> <code>kubectl delete statefulset postgres</code> deletes
              Pods but keeps PVCs (and their data)<br />
              <strong>Why:</strong> Safety - prevents accidental data loss<br />
              <strong>Fix:</strong> Delete PVCs manually: <code>kubectl delete pvc -l app=postgres</code>
            </p>
          </Callout>
          <Callout variant="warning" title='⚠️ Pod Stuck in "Pending" After Node Failure'>
            <p>
              <strong>Cause:</strong> RWO volume still attached to failed node<br />
              <strong>Fix:</strong> Manually delete the old Pod: <code>kubectl delete pod postgres-0 --force --grace-period=0</code><br />
              <strong>Better:</strong> Use Cluster Autoscaler or Pod Disruption Budgets
            </p>
          </Callout>
          <Callout variant="warning" title="⚠️ Slow Scaling (Sequential Startup)">
            <p>
              <strong>Problem:</strong> Scaling from 3 to 10 replicas takes time (one Pod at a time)<br />
              <strong>Workaround:</strong> Use <code>podManagementPolicy: Parallel</code> if Pods are independent<br />
              <strong>Trade-off:</strong> Loses ordering guarantees
            </p>
          </Callout>
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
    </ModuleShell>
  );
}
