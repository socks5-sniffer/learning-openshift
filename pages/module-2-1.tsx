import { useState } from 'react';
import styles from '../styles/Home.module.css';
import moduleStyles from '../styles/Module.module.css';
import ModuleShell from '../components/module/ModuleShell';
import Callout from '../components/module/Callout';
import TermBox from '../components/module/TermBox';

function tabStyle(active: boolean): React.CSSProperties {
  return {
    padding: '10px 20px',
    background: active ? 'var(--color-primary)' : 'var(--color-bg-tertiary)',
    color: active ? '#fff' : 'var(--color-text-secondary)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  };
}

export default function Module21() {
  const [showSingleContainer, setShowSingleContainer] = useState(true);

  return (
    <ModuleShell id="2-1" subtitle="The Smallest Unit of Pain (and Deployment)">
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

        <Callout variant="info" icon="💡" title="Key Concept">
          <p>
            <strong>Pod ≠ Container</strong><br />
            A Pod can contain multiple containers, but most Pods contain just one. The Pod is the
            abstraction Kubernetes uses for deployment, scaling, and networking—not the container itself.
          </p>
        </Callout>

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

        <TermBox copyable={false}>
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
        </TermBox>

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
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button onClick={() => setShowSingleContainer(true)} style={tabStyle(showSingleContainer)}>
              Single Container (Most Common)
            </button>
            <button onClick={() => setShowSingleContainer(false)} style={tabStyle(!showSingleContainer)}>
              Multi-Container (Advanced)
            </button>
          </div>

          {showSingleContainer ? (
            <Callout variant="info" title="Single-Container Pod (95% of use cases)">
              <p>
                Most Pods contain just one container. This is the standard pattern for deploying
                applications in Kubernetes.
              </p>

              <h4>Example: Web Application</h4>
              <TermBox>
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
              </TermBox>

              <p><strong>When to use:</strong></p>
              <ul>
                <li>Standard application deployment</li>
                <li>Microservices</li>
                <li>Most web applications</li>
                <li>Databases</li>
              </ul>
            </Callout>
          ) : (
            <Callout variant="warning" title="Multi-Container Pod (Special Cases)">
              <p>
                Multi-container Pods are used when containers need to be tightly coupled—they must
                run on the same node and share resources.
              </p>

              <h4>Common Patterns:</h4>

              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ color: 'var(--color-text-accent)' }}>1. Sidecar Pattern</h5>
                <p>A helper container that extends the main container's functionality.</p>
                <p><strong>Example:</strong> Log collector that reads app logs and ships them to a central logging system.</p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ color: 'var(--color-text-accent)' }}>2. Ambassador Pattern</h5>
                <p>A proxy container that handles network connections for the main container.</p>
                <p><strong>Example:</strong> Database proxy that handles connection pooling and encryption.</p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ color: 'var(--color-text-accent)' }}>3. Adapter Pattern</h5>
                <p>A container that transforms the main container's output.</p>
                <p><strong>Example:</strong> Monitoring agent that converts app metrics to Prometheus format.</p>
              </div>

              <h4>Example: Web App + Log Sidecar</h4>
              <TermBox>
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
                <br />
                <div style={{ color: '#64748b' }}>&nbsp;&nbsp;# Sidecar: log collector</div>
                <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;- name: log-sidecar</div>
                <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;image: fluentd:latest</div>
                <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;volumeMounts:</div>
                <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;- name: shared-logs</div>
                <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mountPath: /var/log</div>
                <br />
                <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;volumes:</div>
                <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;- name: shared-logs</div>
                <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;emptyDir: {'{}'}</div>
              </TermBox>

              <p><strong>When to use multi-container Pods:</strong></p>
              <ul>
                <li>Containers must share the same lifecycle</li>
                <li>Containers need to communicate via localhost</li>
                <li>Containers need to share files/volumes</li>
                <li>Tight coupling is necessary</li>
              </ul>
            </Callout>
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

        <Callout variant="danger" icon="🚨" title="What Happens Without a Controller">
          <TermBox copyable={false}>
            <div style={{ color: '#22c55e' }}>$ kubectl create -f pod.yaml</div>
            <div style={{ color: '#e2e8f0' }}>pod/my-app created</div>
            <br />
            <div style={{ color: '#64748b' }}># Pod crashes or node fails...</div>
            <br />
            <div style={{ color: '#ef4444' }}>$ kubectl get pods</div>
            <div style={{ color: '#ef4444' }}>No resources found.</div>
            <br />
            <div style={{ color: '#64748b' }}># Your app is gone. No automatic recovery.</div>
          </TermBox>
          <p>
            Naked Pods have no self-healing. They're useful for debugging or one-off tasks, but
            terrible for production workloads.
          </p>
        </Callout>

        <h3>The Right Way: Use Controllers</h3>
        <p>Controllers manage Pods for you, providing:</p>
        <ul>
          <li><strong>Self-healing:</strong> If a Pod dies, the controller creates a new one</li>
          <li><strong>Scaling:</strong> Easily run multiple replicas</li>
          <li><strong>Rolling updates:</strong> Update apps without downtime</li>
          <li><strong>Rollbacks:</strong> Revert to previous versions if updates fail</li>
        </ul>

        <Callout variant="success" icon="✅" title="The Deployment Way">
          <TermBox copyable={false}>
            <div style={{ color: '#22c55e' }}>$ kubectl create deployment my-app --image=nginx</div>
            <div style={{ color: '#e2e8f0' }}>deployment.apps/my-app created</div>
            <br />
            <div style={{ color: '#64748b' }}># Pod crashes or node fails...</div>
            <br />
            <div style={{ color: '#22c55e' }}>$ kubectl get pods</div>
            <div style={{ color: '#22c55e' }}>NAME                      READY   STATUS    RESTARTS</div>
            <div style={{ color: '#22c55e' }}>my-app-7f8d9c-abc12       1/1     Running   0</div>
            <div style={{ color: '#64748b' }}># Kubernetes automatically created a new Pod!</div>
          </TermBox>
          <p>
            The Deployment controller watches your Pods. If one dies, it immediately creates a
            replacement. You get automatic recovery with no intervention.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Pod Lifecycle</h2>
        <p>Pods go through several phases during their lifecycle:</p>

        <div className={moduleStyles.grid}>
          <Callout variant="neutral" title="Pending">
            <p>Pod has been accepted but containers aren't running yet. Waiting for scheduling or image pull.</p>
          </Callout>
          <Callout variant="success" title="Running">
            <p>Pod is bound to a node and at least one container is running.</p>
          </Callout>
          <Callout variant="info" title="Succeeded">
            <p>All containers have terminated successfully. Typical for batch jobs.</p>
          </Callout>
          <Callout variant="danger" title="Failed">
            <p>All containers have terminated, and at least one failed (non-zero exit code).</p>
          </Callout>
          <Callout variant="warning" title="Unknown">
            <p>Pod state cannot be determined, usually due to communication errors with the node.</p>
          </Callout>
          <Callout variant="neutral" title="CrashLoopBackOff">
            <p>Container keeps crashing and restarting. Kubernetes backs off between restarts.</p>
          </Callout>
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

        <Callout variant="info" icon="💡" title="Mental Model">
          <p>
            Think of Pods as temporary workers. They show up, do their job, and can be replaced at
            any moment. You don't build infrastructure around specific Pods—you build it around the
            abstraction (Services, Deployments) that manages them.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Common Pod Commands</h2>

        <TermBox>
          <div style={{ color: '#64748b' }}># List all Pods</div>
          <div style={{ color: '#22c55e' }}>kubectl get pods</div>
          <br />
          <div style={{ color: '#64748b' }}># Get detailed info about a Pod</div>
          <div style={{ color: '#22c55e' }}>kubectl describe pod my-pod</div>
          <br />
          <div style={{ color: '#64748b' }}># View Pod logs</div>
          <div style={{ color: '#22c55e' }}>kubectl logs my-pod</div>
          <br />
          <div style={{ color: '#64748b' }}># View logs from specific container in multi-container Pod</div>
          <div style={{ color: '#22c55e' }}>kubectl logs my-pod -c container-name</div>
          <br />
          <div style={{ color: '#64748b' }}># Execute command inside a Pod</div>
          <div style={{ color: '#22c55e' }}>kubectl exec -it my-pod -- /bin/bash</div>
          <br />
          <div style={{ color: '#64748b' }}># Delete a Pod</div>
          <div style={{ color: '#ef4444' }}>kubectl delete pod my-pod</div>
          <br />
          <div style={{ color: '#64748b' }}># Watch Pods in real-time</div>
          <div style={{ color: '#22c55e' }}>kubectl get pods --watch</div>
        </TermBox>
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
    </ModuleShell>
  );
}
