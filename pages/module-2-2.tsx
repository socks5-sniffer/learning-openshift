import { useState } from 'react';
import styles from '../styles/Home.module.css';
import moduleStyles from '../styles/Module.module.css';
import ModuleShell from '../components/module/ModuleShell';
import Callout from '../components/module/Callout';
import TermBox from '../components/module/TermBox';

export default function Module22() {
  const [replicaCount, setReplicaCount] = useState(3);
  const [currentReplicas, setCurrentReplicas] = useState(3);

  const handleScale = (newCount: number) => {
    setReplicaCount(newCount);
    // Simulate gradual scaling
    setTimeout(() => setCurrentReplicas(newCount), 500);
  };

  return (
    <ModuleShell id="2-2" subtitle="Why Deployments Are Your Best Friend">
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

        <Callout variant="info" icon="💡" title="The Hierarchy">
          <p>
            <strong>Deployment</strong> → manages → <strong>ReplicaSet</strong> → manages → <strong>Pods</strong><br /><br />
            In practice, you create Deployments. Deployments create ReplicaSets. ReplicaSets create Pods.
            You rarely interact with ReplicaSets directly.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>ReplicaSets: Ensuring Desired State</h2>
        <p>
          A <strong>ReplicaSet</strong> is a controller that ensures a specified number of Pod replicas
          are running at any time. If a Pod dies, the ReplicaSet creates a new one. If there are too
          many Pods, it deletes extras.
        </p>

        <h3>How It Works</h3>
        <Callout variant="neutral" title="The ReplicaSet Control Loop">
          <ol style={{ lineHeight: '1.8' }}>
            <li>Check the desired replica count (e.g., 3)</li>
            <li>Count the current running Pods matching its selector</li>
            <li>If current &lt; desired: Create new Pods</li>
            <li>If current &gt; desired: Delete excess Pods</li>
            <li>Repeat continuously</li>
          </ol>
        </Callout>

        <h3>Example: ReplicaSet YAML</h3>
        <TermBox>
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
        </TermBox>

        <Callout variant="warning" icon="⚠️" title="Why You Don't Use ReplicaSets Directly">
          <p>
            ReplicaSets are great at maintaining replica counts, but they're bad at updates. If you
            need to update your application (change the container image), a ReplicaSet will delete
            all Pods and create new ones simultaneously—causing downtime. This is where Deployments
            come in.
          </p>
        </Callout>
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

        <Callout variant="success" icon="✅" title="Rule of Thumb">
          <p>
            <strong>Always use Deployments, not ReplicaSets.</strong> Deployments give you everything
            ReplicaSets do, plus smart update capabilities. There's almost never a reason to create
            a ReplicaSet directly.
          </p>
        </Callout>

        <h3>Example: Deployment YAML</h3>
        <TermBox>
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
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>Desired State vs Current State</h2>
        <p>
          This is the core philosophy of Kubernetes: you declare what you <em>want</em> (desired state),
          and Kubernetes works to make reality match it (current state).
        </p>

        <div className={moduleStyles.grid}>
          <Callout variant="info" title="Desired State">
            <p>What you declare in your YAML:</p>
            <ul>
              <li>"I want 3 replicas"</li>
              <li>"Using nginx:1.21 image"</li>
              <li>"Each with 512MB memory"</li>
            </ul>
          </Callout>

          <Callout variant="success" title="Current State">
            <p>What's actually running:</p>
            <ul>
              <li>2 Pods running (one crashed)</li>
              <li>Using nginx:1.21</li>
              <li>Resources as specified</li>
            </ul>
          </Callout>
        </div>

        <Callout variant="neutral" icon="⚙️" title="Kubernetes continuously works to reconcile the difference">
          <p>(In this case: creates a new Pod to bring count back to 3)</p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Scaling Applications</h2>
        <p>
          Scaling with Deployments is trivial. You just change the replica count, and Kubernetes
          handles the rest.
        </p>

        <h3>Interactive Scaling Demo</h3>
        <div
          style={{
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            margin: '20px 0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <label style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Desired Replicas:</label>
            <button
              onClick={() => handleScale(Math.max(1, replicaCount - 1))}
              style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600 }}
            >
              −
            </button>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text-accent)', minWidth: '40px', textAlign: 'center' }}>
              {replicaCount}
            </span>
            <button
              onClick={() => handleScale(Math.min(10, replicaCount + 1))}
              style={{ padding: '8px 16px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600 }}
            >
              +
            </button>
          </div>

          <div style={{ marginBottom: '10px', color: 'var(--color-text-secondary)' }}>
            <strong style={{ color: 'var(--color-text-primary)' }}>Current State:</strong> {currentReplicas} / {replicaCount} Pods running
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              padding: '20px',
              background: '#0f172a',
              borderRadius: 'var(--radius-md)',
              minHeight: '100px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {Array.from({ length: currentReplicas }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: '60px',
                  height: '60px',
                  background: '#22c55e',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  animation: currentReplicas !== replicaCount ? 'pulse 0.5s' : 'none',
                }}
              >
                Pod {i + 1}
              </div>
            ))}
          </div>
        </div>

        <h3>Scaling Methods</h3>

        <h4 style={{ color: 'var(--color-text-accent)' }}>1. Imperative Scaling (Quick &amp; Dirty)</h4>
        <TermBox>
          <div style={{ color: '#22c55e' }}>kubectl scale deployment nginx-deployment --replicas=5</div>
        </TermBox>

        <h4 style={{ color: 'var(--color-text-accent)' }}>2. Declarative Scaling (Recommended)</h4>
        <p>Edit your YAML file and apply it:</p>
        <TermBox>
          <div style={{ color: '#64748b' }}># Change replicas: 3 to replicas: 5 in deployment.yaml</div>
          <div style={{ color: '#22c55e' }}>kubectl apply -f deployment.yaml</div>
        </TermBox>

        <h4 style={{ color: 'var(--color-text-accent)' }}>3. Autoscaling (Advanced)</h4>
        <p>Let Kubernetes scale automatically based on CPU/memory:</p>
        <TermBox>
          <div style={{ color: '#22c55e' }}>kubectl autoscale deployment nginx-deployment \</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--min=3 --max=10 --cpu-percent=80</div>
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>Rolling Updates: Zero-Downtime Deployments</h2>
        <p>
          This is where Deployments shine. When you update your application (e.g., new container image),
          Kubernetes performs a <strong>rolling update</strong>—gradually replacing old Pods with new ones.
        </p>

        <h3>How Rolling Updates Work</h3>
        <Callout variant="neutral" title="Update Process">
          <ol style={{ lineHeight: '1.8' }}>
            <li>You update the Deployment (e.g., change image from <code>nginx:1.21</code> to <code>nginx:1.22</code>)</li>
            <li>Deployment creates a new ReplicaSet with the new Pod template</li>
            <li>New ReplicaSet gradually scales up</li>
            <li>Old ReplicaSet gradually scales down</li>
            <li>Traffic shifts to new Pods as they become ready</li>
            <li>Old Pods are deleted once new ones are healthy</li>
          </ol>
        </Callout>

        <h3>Visual: Rolling Update</h3>
        <TermBox copyable={false}>
          <div style={{ color: '#64748b' }}>// Initial state: 3 Pods v1.21</div>
          <div style={{ color: '#22c55e' }}>[Pod v1.21] [Pod v1.21] [Pod v1.21]</div>
          <br />
          <div style={{ color: '#64748b' }}>// Step 1: Create first new Pod</div>
          <div style={{ color: '#22c55e' }}>[Pod v1.21] [Pod v1.21] [Pod v1.21]</div>
          <div style={{ color: '#0ea5e9' }}>[Pod v1.22] (starting...)</div>
          <br />
          <div style={{ color: '#64748b' }}>// Step 2: New Pod ready, delete one old Pod</div>
          <div style={{ color: '#22c55e' }}>[Pod v1.21] [Pod v1.21]</div>
          <div style={{ color: '#0ea5e9' }}>[Pod v1.22] ✓</div>
          <br />
          <div style={{ color: '#64748b' }}>// Step 3: Create second new Pod</div>
          <div style={{ color: '#22c55e' }}>[Pod v1.21] [Pod v1.21]</div>
          <div style={{ color: '#0ea5e9' }}>[Pod v1.22] ✓ [Pod v1.22] (starting...)</div>
          <br />
          <div style={{ color: '#64748b' }}>// Step 4: Continue until all updated</div>
          <div style={{ color: '#0ea5e9' }}>[Pod v1.22] ✓ [Pod v1.22] ✓ [Pod v1.22] ✓</div>
          <br />
          <div style={{ color: '#64748b' }}>// Result: Zero downtime! Traffic always served.</div>
        </TermBox>

        <h3>Triggering an Update</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># Update the image</div>
          <div style={{ color: '#22c55e' }}>kubectl set image deployment/nginx-deployment \</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;nginx=nginx:1.22</div>
          <br />
          <div style={{ color: '#64748b' }}># Watch the rollout</div>
          <div style={{ color: '#22c55e' }}>kubectl rollout status deployment/nginx-deployment</div>
        </TermBox>

        <Callout variant="info" icon="💡" title="Key Benefit">
          <p>
            During a rolling update, your application never goes down. There are always Pods serving
            traffic. This is how you deploy to production without maintenance windows.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Rollbacks: Undo Bad Deployments</h2>
        <p>
          Made a mistake? Deployed a buggy version? No problem. Deployments keep a revision history,
          so you can roll back to a previous version instantly.
        </p>

        <h3>Rollback Commands</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># View rollout history</div>
          <div style={{ color: '#22c55e' }}>kubectl rollout history deployment/nginx-deployment</div>
          <br />
          <div style={{ color: '#64748b' }}># Undo the latest deployment (rollback)</div>
          <div style={{ color: '#ef4444' }}>kubectl rollout undo deployment/nginx-deployment</div>
          <br />
          <div style={{ color: '#64748b' }}># Rollback to a specific revision</div>
          <div style={{ color: '#ef4444' }}>kubectl rollout undo deployment/nginx-deployment \</div>
          <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;--to-revision=2</div>
          <br />
          <div style={{ color: '#64748b' }}># Pause a rollout (if things go wrong)</div>
          <div style={{ color: '#f59e0b' }}>kubectl rollout pause deployment/nginx-deployment</div>
          <br />
          <div style={{ color: '#64748b' }}># Resume a paused rollout</div>
          <div style={{ color: '#22c55e' }}>kubectl rollout resume deployment/nginx-deployment</div>
        </TermBox>

        <Callout variant="success" icon="✅" title="Safety Net">
          <p>
            Rollbacks use the same rolling update strategy. Old Pods gradually come back while new
            ones are removed. This means even rollbacks are zero-downtime.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Update Strategies</h2>
        <p>Deployments support different strategies for rolling out changes:</p>

        <h3>1. RollingUpdate (Default)</h3>
        <Callout variant="info">
          <p><strong>How it works:</strong> Gradually replaces old Pods with new ones</p>
          <ul>
            <li><strong>maxUnavailable:</strong> Maximum number of Pods that can be unavailable during update</li>
            <li><strong>maxSurge:</strong> Maximum number of extra Pods that can be created during update</li>
          </ul>
          <p><strong>Use when:</strong> You need zero downtime (most cases)</p>
        </Callout>

        <h3>2. Recreate</h3>
        <Callout variant="danger">
          <p><strong>How it works:</strong> Deletes all old Pods, then creates all new Pods</p>
          <ul>
            <li>Causes downtime</li>
            <li>Simpler than rolling updates</li>
          </ul>
          <p><strong>Use when:</strong> Your app can't handle multiple versions running simultaneously (rare)</p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Why Deployments Are Your Best Friend</h2>
        <p>Deployments solve nearly every operational challenge in running applications:</p>

        <div className={moduleStyles.grid}>
          <Callout variant="success" title="✅ Self-Healing">
            <p>Pods crash? Automatically replaced.</p>
          </Callout>
          <Callout variant="success" title="✅ Easy Scaling">
            <p>Change replica count, done.</p>
          </Callout>
          <Callout variant="success" title="✅ Zero-Downtime Updates">
            <p>Deploy new versions without service interruption.</p>
          </Callout>
          <Callout variant="success" title="✅ Easy Rollbacks">
            <p>Revert to previous versions in seconds.</p>
          </Callout>
          <Callout variant="success" title="✅ Declarative">
            <p>Describe what you want, not how to get there.</p>
          </Callout>
          <Callout variant="success" title="✅ Revision History">
            <p>Track all changes, audit deployments.</p>
          </Callout>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>Common Deployment Commands</h2>

        <TermBox>
          <div style={{ color: '#64748b' }}># Create a deployment</div>
          <div style={{ color: '#22c55e' }}>kubectl create deployment nginx --image=nginx:1.21</div>
          <br />
          <div style={{ color: '#64748b' }}># List deployments</div>
          <div style={{ color: '#22c55e' }}>kubectl get deployments</div>
          <br />
          <div style={{ color: '#64748b' }}># Get detailed info</div>
          <div style={{ color: '#22c55e' }}>kubectl describe deployment nginx</div>
          <br />
          <div style={{ color: '#64748b' }}># Scale deployment</div>
          <div style={{ color: '#22c55e' }}>kubectl scale deployment nginx --replicas=5</div>
          <br />
          <div style={{ color: '#64748b' }}># Update image (triggers rollout)</div>
          <div style={{ color: '#22c55e' }}>kubectl set image deployment/nginx nginx=nginx:1.22</div>
          <br />
          <div style={{ color: '#64748b' }}># Watch rollout status</div>
          <div style={{ color: '#22c55e' }}>kubectl rollout status deployment/nginx</div>
          <br />
          <div style={{ color: '#64748b' }}># Rollback</div>
          <div style={{ color: '#ef4444' }}>kubectl rollout undo deployment/nginx</div>
          <br />
          <div style={{ color: '#64748b' }}># Delete deployment (deletes all Pods)</div>
          <div style={{ color: '#ef4444' }}>kubectl delete deployment nginx</div>
        </TermBox>
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
    </ModuleShell>
  );
}
