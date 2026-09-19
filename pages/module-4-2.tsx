import { useState } from 'react';
import styles from '../styles/Home.module.css';
import moduleStyles from '../styles/Module.module.css';
import ModuleShell from '../components/module/ModuleShell';
import Callout from '../components/module/Callout';
import TermBox from '../components/module/TermBox';

const nodes = {
  node1: { name: 'node-1', labels: ['environment=production', 'disk=ssd', 'gpu=none'], taints: [] as string[], color: '#22c55e' },
  node2: { name: 'node-2', labels: ['environment=production', 'disk=hdd', 'gpu=nvidia-v100'], taints: [] as string[], color: '#0ea5e9' },
  node3: { name: 'node-3-gpu', labels: ['environment=ml', 'disk=ssd', 'gpu=nvidia-a100'], taints: ['gpu=true:NoSchedule'], color: '#f59e0b' },
};

export default function Module42() {
  const [selectedNode, setSelectedNode] = useState<'node1' | 'node2' | 'node3'>('node1');
  const current = nodes[selectedNode];

  const nodeButton = (node: keyof typeof nodes): React.CSSProperties => ({
    padding: '12px 24px',
    background: selectedNode === node ? nodes[node].color : 'var(--color-bg-tertiary)',
    color: selectedNode === node ? '#fff' : 'var(--color-text-secondary)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '1rem',
    transition: 'all var(--transition-fast)',
  });

  const chip = (bg: string): React.CSSProperties => ({
    background: bg,
    color: '#fff',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.85rem',
    fontFamily: "'JetBrains Mono', monospace",
  });

  return (
    <ModuleShell id="4-2" subtitle="Labels, Taints, Tolerations, and Affinity">
      <section className={styles.spotlight}>
        <h2>The Scheduling Problem</h2>
        <p>
          You have a cluster with 50 nodes. Some have SSDs, some have GPUs, some are in different
          regions. How do you ensure your GPU-intensive machine learning Pod lands on a node with
          a GPU, not a cheap VM with spinning disks?
        </p>

        <Callout variant="info" icon="💡" title="The Kubernetes Scheduler">
          <p>
            The <strong>kube-scheduler</strong> (from Module 1.2) watches for Pods without a node
            assignment and picks the best node based on:
          </p>
          <ul>
            <li>Resource availability (CPU, memory from Module 4.1)</li>
            <li><strong>Labels and selectors</strong> (matching criteria)</li>
            <li><strong>Taints and tolerations</strong> (repulsion and permission)</li>
            <li><strong>Affinity rules</strong> (attraction and anti-attraction)</li>
          </ul>
        </Callout>

        <p>This module covers the tools for controlling <em>where</em> Pods run.</p>
      </section>

      <section className={styles.spotlight}>
        <h2>Labels and Selectors: The Foundation</h2>
        <p>
          <strong>Labels</strong> are key-value pairs attached to Kubernetes objects (Nodes, Pods,
          Services, etc.). <strong>Selectors</strong> query objects by their labels.
        </p>

        <h3>Labeling Nodes</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># Add labels to a node</div>
          <div style={{ color: '#22c55e' }}>kubectl label nodes node-1 disk=ssd</div>
          <div style={{ color: '#22c55e' }}>kubectl label nodes node-1 gpu=nvidia-v100</div>
          <div style={{ color: '#22c55e' }}>kubectl label nodes node-1 environment=production</div>
          <br />
          <div style={{ color: '#64748b' }}># View node labels</div>
          <div style={{ color: '#22c55e' }}>kubectl get nodes --show-labels</div>
          <br />
          <div style={{ color: '#64748b' }}># Remove a label</div>
          <div style={{ color: '#ef4444' }}>kubectl label nodes node-1 gpu-  # Dash removes the label</div>
        </TermBox>

        <h3>Selecting Nodes with nodeSelector</h3>
        <p>The simplest way to schedule Pods on specific nodes is <code>nodeSelector</code>:</p>

        <TermBox>
          <div style={{ color: '#64748b' }}># deployment.yaml</div>
          <div style={{ color: '#f59e0b' }}>apiVersion: apps/v1</div>
          <div style={{ color: '#f59e0b' }}>kind: Deployment</div>
          <div style={{ color: '#f59e0b' }}>metadata:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: ml-training</div>
          <div style={{ color: '#f59e0b' }}>spec:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;template:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;spec:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nodeSelector:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gpu: nvidia-v100  # Only schedule on nodes with this label</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;disk: ssd         # AND this label</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;containers:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: trainer</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;image: ml-trainer:1.0</div>
        </TermBox>

        <Callout variant="info">
          <p>
            <strong>Result:</strong> This Pod will <strong>only</strong> run on nodes with
            <code>gpu=nvidia-v100</code> <strong>AND</strong> <code>disk=ssd</code>. If no nodes
            match, the Pod stays in <code>Pending</code> state.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Interactive: Node Labels and Selection</h2>
        <p>Click on different nodes to see their labels and which Pods can schedule on them:</p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', margin: '20px 0', flexWrap: 'wrap' }}>
          <button onClick={() => setSelectedNode('node1')} style={nodeButton('node1')}>Node 1 (SSD)</button>
          <button onClick={() => setSelectedNode('node2')} style={nodeButton('node2')}>Node 2 (GPU)</button>
          <button onClick={() => setSelectedNode('node3')} style={nodeButton('node3')}>Node 3 (ML Tainted)</button>
        </div>

        <div
          style={{
            background: 'var(--color-bg-elevated)',
            border: `2px solid ${current.color}`,
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            margin: '20px 0',
            transition: 'all 0.3s',
          }}
        >
          <h3 style={{ marginTop: 0, color: current.color, textTransform: 'uppercase' }}>{current.name}</h3>

          <h4 style={{ color: 'var(--color-text-primary)' }}>Labels:</h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {current.labels.map((label, idx) => (
              <span key={idx} style={chip(current.color)}>{label}</span>
            ))}
          </div>

          {current.taints.length > 0 && (
            <>
              <h4 style={{ color: 'var(--color-text-primary)' }}>Taints:</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {current.taints.map((taint, idx) => (
                  <span key={idx} style={chip('#ef4444')}>{taint}</span>
                ))}
              </div>
            </>
          )}

          <h4 style={{ color: 'var(--color-text-primary)' }}>Can Schedule:</h4>
          <ul style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            {selectedNode === 'node1' && (
              <>
                <li>✅ Pods with nodeSelector: <code>disk=ssd</code></li>
                <li>✅ Pods with nodeSelector: <code>environment=production</code></li>
                <li>❌ Pods requiring GPU (no gpu label)</li>
              </>
            )}
            {selectedNode === 'node2' && (
              <>
                <li>✅ Pods with nodeSelector: <code>gpu=nvidia-v100</code></li>
                <li>✅ Pods with nodeSelector: <code>environment=production</code></li>
                <li>❌ Pods requiring SSD (has disk=hdd)</li>
              </>
            )}
            {selectedNode === 'node3' && (
              <>
                <li>✅ Pods with nodeSelector: <code>gpu=nvidia-a100</code> AND toleration for <code>gpu=true:NoSchedule</code></li>
                <li>❌ Regular Pods (tainted, requires toleration)</li>
                <li>⚠️ This node is reserved for ML workloads only</li>
              </>
            )}
          </ul>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>Taints and Tolerations: Repulsion and Permission</h2>
        <p>
          <strong>Taints</strong> repel Pods from nodes. <strong>Tolerations</strong> allow Pods
          to be scheduled on tainted nodes despite the repulsion.
        </p>

        <Callout variant="warning" icon="🔑" title="Mental Model">
          <p>
            Labels are <strong>attraction</strong> ("I want to run on nodes with SSDs").<br />
            Taints are <strong>repulsion</strong> ("Don't schedule regular Pods here, this is a GPU node").
          </p>
        </Callout>

        <h3>Adding Taints to Nodes</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># Taint a node to prevent regular Pods from scheduling</div>
          <div style={{ color: '#ef4444' }}>kubectl taint nodes node-3 gpu=true:NoSchedule</div>
          <br />
          <div style={{ color: '#64748b' }}># Taint effects:</div>
          <div style={{ color: '#64748b' }}># NoSchedule - Don't schedule new Pods (existing Pods stay)</div>
          <div style={{ color: '#64748b' }}># PreferNoSchedule - Try to avoid, but not hard rule</div>
          <div style={{ color: '#64748b' }}># NoExecute - Evict existing Pods without toleration</div>
          <br />
          <div style={{ color: '#64748b' }}># Remove taint</div>
          <div style={{ color: '#22c55e' }}>kubectl taint nodes node-3 gpu=true:NoSchedule-</div>
        </TermBox>

        <h3>Adding Tolerations to Pods</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># deployment.yaml for ML workload</div>
          <div style={{ color: '#f59e0b' }}>apiVersion: apps/v1</div>
          <div style={{ color: '#f59e0b' }}>kind: Deployment</div>
          <div style={{ color: '#f59e0b' }}>metadata:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: ml-training</div>
          <div style={{ color: '#f59e0b' }}>spec:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;template:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;spec:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tolerations:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- key: "gpu"</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;operator: "Equal"</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;value: "true"</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;effect: "NoSchedule"  # Must match the taint</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;containers:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: trainer</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;image: ml-trainer:1.0</div>
        </TermBox>

        <Callout variant="info">
          <p>
            <strong>Result:</strong> This Pod <strong>tolerates</strong> the <code>gpu=true:NoSchedule</code>
            taint, so it <em>can</em> be scheduled on node-3. Regular Pods without this toleration
            cannot run on node-3.
          </p>
        </Callout>

        <h3>Common Use Cases for Taints</h3>
        <Callout variant="neutral">
          <ul>
            <li><strong>Dedicated nodes:</strong> Reserve expensive GPU/TPU nodes for ML workloads</li>
            <li><strong>Maintenance:</strong> Taint nodes before upgrading to prevent new Pods</li>
            <li><strong>Isolation:</strong> Separate production from dev workloads</li>
            <li><strong>Hardware-specific:</strong> Nodes with special hardware (FPGA, Infiniband)</li>
          </ul>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Node Affinity: Advanced Scheduling Rules</h2>
        <p>
          <code>nodeSelector</code> is simple but limited (exact matches only). <strong>Node Affinity</strong>
          provides more flexible scheduling rules with operators like <code>In</code>, <code>NotIn</code>,
          <code>Exists</code>, <code>DoesNotExist</code>.
        </p>

        <h3>Example: Require SSD, Prefer Production Region</h3>
        <TermBox>
          <div style={{ color: '#f59e0b' }}>apiVersion: apps/v1</div>
          <div style={{ color: '#f59e0b' }}>kind: Deployment</div>
          <div style={{ color: '#f59e0b' }}>metadata:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: web-app</div>
          <div style={{ color: '#f59e0b' }}>spec:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;template:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;spec:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;affinity:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nodeAffinity:</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;requiredDuringSchedulingIgnoredDuringExecution:</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nodeSelectorTerms:</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- matchExpressions:</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- key: disk</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;operator: In</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;values: ["ssd"]  # MUST be on SSD</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;preferredDuringSchedulingIgnoredDuringExecution:</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- weight: 80</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;preference:</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;matchExpressions:</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- key: region</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;operator: In</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;values: ["us-east-1"]  # Prefer, but not required</div>
        </TermBox>

        <h3>Breaking Down the Rules</h3>
        <Callout variant="neutral">
          <h4 style={{ color: '#0ea5e9' }}>requiredDuringSchedulingIgnoredDuringExecution (Hard Rule)</h4>
          <p>
            <strong>Must</strong> be satisfied for the Pod to be scheduled. If no nodes match,
            Pod stays <code>Pending</code>.
          </p>

          <h4 style={{ color: '#f59e0b' }}>preferredDuringSchedulingIgnoredDuringExecution (Soft Rule)</h4>
          <p>
            Scheduler <strong>tries</strong> to honor this preference but will ignore it if no
            nodes match. The <code>weight</code> (1-100) indicates priority.
          </p>

          <h4 style={{ color: 'var(--color-text-muted)' }}>IgnoredDuringExecution</h4>
          <p>
            If a node's labels change after the Pod is running, the Pod is <strong>not</strong>
            evicted. Affinity is only checked at scheduling time.
          </p>
        </Callout>

        <h3>Affinity Operators</h3>
        <TermBox>
          <div style={{ color: '#22c55e' }}>In         # Label value must be in the list</div>
          <div style={{ color: '#22c55e' }}>NotIn      # Label value must NOT be in the list</div>
          <div style={{ color: '#22c55e' }}>Exists     # Label key must exist (value doesn't matter)</div>
          <div style={{ color: '#22c55e' }}>DoesNotExist  # Label key must NOT exist</div>
          <div style={{ color: '#22c55e' }}>Gt         # Numeric label value greater than</div>
          <div style={{ color: '#22c55e' }}>Lt         # Numeric label value less than</div>
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>Pod Affinity and Anti-Affinity</h2>
        <p>
          So far we've controlled <em>node</em> placement. <strong>Pod affinity</strong> controls
          placement relative to <em>other Pods</em>.
        </p>

        <h3>Pod Affinity: "Schedule Near Other Pods"</h3>
        <p>
          Use case: Your web app should run on the same node (or zone) as your caching layer
          for low latency.
        </p>

        <TermBox>
          <div style={{ color: '#f59e0b' }}>apiVersion: apps/v1</div>
          <div style={{ color: '#f59e0b' }}>kind: Deployment</div>
          <div style={{ color: '#f59e0b' }}>metadata:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: web-app</div>
          <div style={{ color: '#f59e0b' }}>spec:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;template:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;spec:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;affinity:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;podAffinity:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;requiredDuringSchedulingIgnoredDuringExecution:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- labelSelector:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;matchExpressions:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- key: app</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;operator: In</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;values: ["redis"]</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;topologyKey: kubernetes.io/hostname  # Same node</div>
        </TermBox>

        <Callout variant="info">
          <p>
            <strong>Result:</strong> Web app Pods will <strong>only</strong> be scheduled on nodes
            that already have a Pod with label <code>app=redis</code>. The <code>topologyKey</code>
            defines the scope (same node, same zone, same region, etc).
          </p>
        </Callout>

        <h3>Pod Anti-Affinity: "Spread Pods Apart"</h3>
        <p>
          Use case: Your database replicas should run on <strong>different nodes</strong> for
          high availability.
        </p>

        <TermBox>
          <div style={{ color: '#f59e0b' }}>apiVersion: apps/v1</div>
          <div style={{ color: '#f59e0b' }}>kind: StatefulSet</div>
          <div style={{ color: '#f59e0b' }}>metadata:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: postgres</div>
          <div style={{ color: '#f59e0b' }}>spec:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;template:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;spec:</div>
          <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;affinity:</div>
          <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;podAntiAffinity:</div>
          <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;requiredDuringSchedulingIgnoredDuringExecution:</div>
          <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- labelSelector:</div>
          <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;matchExpressions:</div>
          <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- key: app</div>
          <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;operator: In</div>
          <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;values: ["postgres"]</div>
          <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;topologyKey: kubernetes.io/hostname</div>
        </TermBox>

        <Callout variant="info">
          <p>
            <strong>Result:</strong> Each postgres Pod will be scheduled on a <strong>different
            node</strong>. If you have 5 replicas but only 3 nodes, 2 Pods will stay <code>Pending</code>.
          </p>
        </Callout>

        <h3>Common topologyKey Values</h3>
        <TermBox>
          <div style={{ color: '#22c55e' }}>kubernetes.io/hostname          # Same/different node</div>
          <div style={{ color: '#22c55e' }}>topology.kubernetes.io/zone     # Same/different availability zone</div>
          <div style={{ color: '#22c55e' }}>topology.kubernetes.io/region   # Same/different region</div>
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>Comparison: When to Use Each</h2>

        <div style={{ display: 'grid', gap: '1rem', margin: '1.5rem 0' }}>
          <Callout variant="success" title="nodeSelector">
            <p>
              <strong>Use when:</strong> Simple exact label matching ("disk=ssd")<br />
              <strong>Pros:</strong> Easy to understand, simple syntax<br />
              <strong>Cons:</strong> Limited flexibility (no OR, no preferences)
            </p>
          </Callout>
          <Callout variant="info" title="Node Affinity">
            <p>
              <strong>Use when:</strong> Complex node selection (operators, preferences, soft rules)<br />
              <strong>Pros:</strong> Very flexible, supports soft/hard rules<br />
              <strong>Cons:</strong> Verbose YAML, more complex to understand
            </p>
          </Callout>
          <Callout variant="warning" title="Taints & Tolerations">
            <p>
              <strong>Use when:</strong> Reserving nodes (dedicated GPU nodes, maintenance)<br />
              <strong>Pros:</strong> Prevents unwanted Pods from scheduling<br />
              <strong>Cons:</strong> Requires coordination (node admins + Pod owners)
            </p>
          </Callout>
          <Callout variant="neutral" title="Pod Affinity/Anti-Affinity">
            <p>
              <strong>Use when:</strong> Pod placement relative to other Pods (co-location, spreading)<br />
              <strong>Pros:</strong> High availability, latency optimization<br />
              <strong>Cons:</strong> Complex, can create scheduling deadlocks
            </p>
          </Callout>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>Real-World Example: Complete Scheduling Strategy</h2>

        <h3>Multi-Tier Application</h3>
        <Callout variant="neutral" title="Requirements">
          <ul>
            <li>Frontend: Run anywhere, spread across nodes for HA</li>
            <li>Backend: Must be on SSD nodes, prefer production region</li>
            <li>Database: Must spread across zones, guaranteed resources</li>
            <li>ML Jobs: Only on GPU nodes (tainted)</li>
          </ul>
        </Callout>

        <TermBox>
          <div style={{ color: '#64748b' }}># Frontend: Anti-affinity for spreading</div>
          <div style={{ color: '#22c55e' }}>affinity:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;podAntiAffinity:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;preferredDuringSchedulingIgnoredDuringExecution:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;- weight: 100</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;podAffinityTerm:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;labelSelector:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;matchLabels: {'{app: frontend}'}</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;topologyKey: kubernetes.io/hostname</div>
          <br />
          <div style={{ color: '#64748b' }}># Backend: Node affinity for SSD</div>
          <div style={{ color: '#0ea5e9' }}>affinity:</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;nodeAffinity:</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;requiredDuringSchedulingIgnoredDuringExecution:</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nodeSelectorTerms:</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- matchExpressions:</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- {'{key: disk, operator: In, values: [ssd]}'}</div>
          <br />
          <div style={{ color: '#64748b' }}># ML Jobs: Tolerations for tainted GPU nodes</div>
          <div style={{ color: '#f59e0b' }}>tolerations:</div>
          <div style={{ color: '#f59e0b' }}>- {'{key: gpu, operator: Equal, value: "true", effect: NoSchedule}'}</div>
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>Key Takeaways</h2>
        <ul>
          <li><strong>Labels</strong> are key-value pairs for categorizing nodes and Pods</li>
          <li><strong>nodeSelector:</strong> Simple exact-match node selection</li>
          <li><strong>Node Affinity:</strong> Advanced node selection with operators and soft/hard rules</li>
          <li><strong>Taints</strong> repel Pods from nodes, <strong>tolerations</strong> allow Pods to tolerate taints</li>
          <li><strong>Pod Affinity:</strong> Schedule Pods near other Pods (co-location)</li>
          <li><strong>Pod Anti-Affinity:</strong> Spread Pods apart (high availability)</li>
          <li><strong>topologyKey</strong> defines the scope: node, zone, or region</li>
          <li>Use taints to <strong>reserve expensive nodes</strong> (GPU, high-mem)</li>
          <li>Use anti-affinity to <strong>spread replicas</strong> for fault tolerance</li>
          <li>Combine strategies for complex scheduling requirements</li>
        </ul>
      </section>
    </ModuleShell>
  );
}
