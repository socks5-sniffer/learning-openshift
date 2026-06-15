import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Module42() {
  const [selectedNode, setSelectedNode] = useState<'node1' | 'node2' | 'node3'>('node1');
  const [showTaints, setShowTaints] = useState(false);

  const nodes = {
    node1: {
      name: 'node-1',
      labels: ['environment=production', 'disk=ssd', 'gpu=none'],
      taints: [],
      color: '#22c55e',
      bg: '#f0fdf4'
    },
    node2: {
      name: 'node-2',
      labels: ['environment=production', 'disk=hdd', 'gpu=nvidia-v100'],
      taints: [],
      color: '#0ea5e9',
      bg: '#f0f9ff'
    },
    node3: {
      name: 'node-3-gpu',
      labels: ['environment=ml', 'disk=ssd', 'gpu=nvidia-a100'],
      taints: ['gpu=true:NoSchedule'],
      color: '#f59e0b',
      bg: '#fef3c7'
    }
  };

  const current = nodes[selectedNode];

  return (
    <div className={styles.container}>
      <Head>
        <title>Module 4.2: Node Scheduling</title>
        <meta name="description" content="Understanding labels, taints, tolerations, and affinity in Kubernetes" />
      </Head>

      {/* Home link in top right */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 30,
        zIndex: 10
      }}>
        <Link href="/learning-modules" style={{
            textDecoration: 'none',
            color: '#9c0606ff',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            background: 'rgba(255,255,255,0.85)',
            padding: '8px 16px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>All Modules</Link>
      </div>

      <main className={styles.main}>
        <h1 className={styles.title}>Module 4.2: Node Scheduling</h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280', marginTop: '-10px' }}>
          Labels, Taints, Tolerations, and Affinity
        </p>
        
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/module-4-1" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>← Previous: Resource Requests & Limits</Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/learning-modules" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>All Modules</Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/module-4-3" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>Next: Horizontal Pod Autoscaling →</Link>
        </div>
        
        <section className={styles.spotlight}>
          <h2>The Scheduling Problem</h2>
          <p>
            You have a cluster with 50 nodes. Some have SSDs, some have GPUs, some are in different 
            regions. How do you ensure your GPU-intensive machine learning Pod lands on a node with 
            a GPU, not a cheap VM with spinning disks?
          </p>

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#0369a1' }}>💡 The Kubernetes Scheduler</h3>
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
          </div>

          <p>
            This module covers the tools for controlling <em>where</em> Pods run.
          </p>
        </section>

        <section className={styles.spotlight}>
          <h2>Labels and Selectors: The Foundation</h2>
          <p>
            <strong>Labels</strong> are key-value pairs attached to Kubernetes objects (Nodes, Pods, 
            Services, etc.). <strong>Selectors</strong> query objects by their labels.
          </p>

          <h3>Labeling Nodes</h3>
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
            <div style={{ color: '#64748b' }}># Add labels to a node</div>
            <div style={{ color: '#22c55e' }}>kubectl label nodes node-1 disk=ssd</div>
            <div style={{ color: '#22c55e' }}>kubectl label nodes node-1 gpu=nvidia-v100</div>
            <div style={{ color: '#22c55e' }}>kubectl label nodes node-1 environment=production</div>
            <br/>
            <div style={{ color: '#64748b' }}># View node labels</div>
            <div style={{ color: '#22c55e' }}>kubectl get nodes --show-labels</div>
            <br/>
            <div style={{ color: '#64748b' }}># Remove a label</div>
            <div style={{ color: '#ef4444' }}>kubectl label nodes node-1 gpu-  # Dash removes the label</div>
          </div>

          <h3>Selecting Nodes with nodeSelector</h3>
          <p>
            The simplest way to schedule Pods on specific nodes is <code>nodeSelector</code>:
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
              <strong>Result:</strong> This Pod will <strong>only</strong> run on nodes with 
              <code>gpu=nvidia-v100</code> <strong>AND</strong> <code>disk=ssd</code>. If no nodes 
              match, the Pod stays in <code>Pending</code> state.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Interactive: Node Labels and Selection</h2>
          <p>
            Click on different nodes to see their labels and which Pods can schedule on them:
          </p>

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            margin: '20px 0'
          }}>
            <button
              onClick={() => setSelectedNode('node1')}
              style={{
                padding: '12px 24px',
                background: selectedNode === 'node1' ? '#22c55e' : '#334155',
                color: selectedNode === 'node1' ? '#fff' : '#f8fafc',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'all 0.2s'
              }}
            >
              Node 1 (SSD)
            </button>
            <button
              onClick={() => setSelectedNode('node2')}
              style={{
                padding: '12px 24px',
                background: selectedNode === 'node2' ? '#0ea5e9' : '#334155',
                color: selectedNode === 'node2' ? '#fff' : '#f8fafc',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'all 0.2s'
              }}
            >
              Node 2 (GPU)
            </button>
            <button
              onClick={() => setSelectedNode('node3')}
              style={{
                padding: '12px 24px',
                background: selectedNode === 'node3' ? '#f59e0b' : '#334155',
                color: selectedNode === 'node3' ? '#fff' : '#f8fafc',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'all 0.2s'
              }}
            >
              Node 3 (ML Tainted)
            </button>
          </div>

          <div style={{
            background: current.bg,
            border: `3px solid ${current.color}`,
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            transition: 'all 0.3s'
          }}>
            <h3 style={{ marginTop: 0, color: current.color, textTransform: 'uppercase' }}>
              {current.name}
            </h3>
            
            <h4 style={{ color: '#1e293b' }}>Labels:</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {current.labels.map((label, idx) => (
                <span
                  key={idx}
                  style={{
                    background: current.color,
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontFamily: 'monospace'
                  }}
                >
                  {label}
                </span>
              ))}
            </div>

            {current.taints.length > 0 && (
              <>
                <h4 style={{ color: '#1e293b' }}>Taints:</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {current.taints.map((taint, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: '#ef4444',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontFamily: 'monospace'
                      }}
                    >
                      {taint}
                    </span>
                  ))}
                </div>
              </>
            )}

            <h4 style={{ color: '#1e293b' }}>Can Schedule:</h4>
            <ul style={{ color: '#1e293b', fontSize: '0.9rem' }}>
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
              Labels are <strong>attraction</strong> ("I want to run on nodes with SSDs").<br/>
              Taints are <strong>repulsion</strong> ("Don't schedule regular Pods here, this is a GPU node").
            </p>
          </div>

          <h3>Adding Taints to Nodes</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># Taint a node to prevent regular Pods from scheduling</div>
            <div style={{ color: '#ef4444' }}>kubectl taint nodes node-3 gpu=true:NoSchedule</div>
            <br/>
            <div style={{ color: '#64748b' }}># Taint effects:</div>
            <div style={{ color: '#64748b' }}># NoSchedule - Don't schedule new Pods (existing Pods stay)</div>
            <div style={{ color: '#64748b' }}># PreferNoSchedule - Try to avoid, but not hard rule</div>
            <div style={{ color: '#64748b' }}># NoExecute - Evict existing Pods without toleration</div>
            <br/>
            <div style={{ color: '#64748b' }}># Remove taint</div>
            <div style={{ color: '#22c55e' }}>kubectl taint nodes node-3 gpu=true:NoSchedule-</div>
          </div>

          <h3>Adding Tolerations to Pods</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
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
              <strong>Result:</strong> This Pod <strong>tolerates</strong> the <code>gpu=true:NoSchedule</code> 
              taint, so it <em>can</em> be scheduled on node-3. Regular Pods without this toleration 
              cannot run on node-3.
            </p>
          </div>

          <h3>Common Use Cases for Taints</h3>
          <div style={{
            background: '#f9fafb',
            border: '2px solid #475569',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <ul>
              <li><strong>Dedicated nodes:</strong> Reserve expensive GPU/TPU nodes for ML workloads</li>
              <li><strong>Maintenance:</strong> Taint nodes before upgrading to prevent new Pods</li>
              <li><strong>Isolation:</strong> Separate production from dev workloads</li>
              <li><strong>Hardware-specific:</strong> Nodes with special hardware (FPGA, Infiniband)</li>
            </ul>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Node Affinity: Advanced Scheduling Rules</h2>
          <p>
            <code>nodeSelector</code> is simple but limited (exact matches only). <strong>Node Affinity</strong> 
            provides more flexible scheduling rules with operators like <code>In</code>, <code>NotIn</code>, 
            <code>Exists</code>, <code>DoesNotExist</code>.
          </p>

          <h3>Example: Require SSD, Prefer Production Region</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
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
          </div>

          <h3>Breaking Down the Rules</h3>
          <div style={{
            background: '#f9fafb',
            border: '2px solid #475569',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h4 style={{ marginTop: 0, color: '#0ea5e9' }}>
              requiredDuringSchedulingIgnoredDuringExecution (Hard Rule)
            </h4>
            <p>
              <strong>Must</strong> be satisfied for the Pod to be scheduled. If no nodes match, 
              Pod stays <code>Pending</code>.
            </p>

            <h4 style={{ color: '#f59e0b' }}>
              preferredDuringSchedulingIgnoredDuringExecution (Soft Rule)
            </h4>
            <p>
              Scheduler <strong>tries</strong> to honor this preference but will ignore it if no 
              nodes match. The <code>weight</code> (1-100) indicates priority.
            </p>

            <h4 style={{ color: '#6b7280' }}>IgnoredDuringExecution</h4>
            <p style={{ marginBottom: 0 }}>
              If a node's labels change after the Pod is running, the Pod is <strong>not</strong> 
              evicted. Affinity is only checked at scheduling time.
            </p>
          </div>

          <h3>Affinity Operators</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#22c55e' }}>In         # Label value must be in the list</div>
            <div style={{ color: '#22c55e' }}>NotIn      # Label value must NOT be in the list</div>
            <div style={{ color: '#22c55e' }}>Exists     # Label key must exist (value doesn't matter)</div>
            <div style={{ color: '#22c55e' }}>DoesNotExist  # Label key must NOT exist</div>
            <div style={{ color: '#22c55e' }}>Gt         # Numeric label value greater than</div>
            <div style={{ color: '#22c55e' }}>Lt         # Numeric label value less than</div>
          </div>
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

          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
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
              <strong>Result:</strong> Web app Pods will <strong>only</strong> be scheduled on nodes 
              that already have a Pod with label <code>app=redis</code>. The <code>topologyKey</code> 
              defines the scope (same node, same zone, same region, etc).
            </p>
          </div>

          <h3>Pod Anti-Affinity: "Spread Pods Apart"</h3>
          <p>
            Use case: Your database replicas should run on <strong>different nodes</strong> for 
            high availability.
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
              <strong>Result:</strong> Each postgres Pod will be scheduled on a <strong>different 
              node</strong>. If you have 5 replicas but only 3 nodes, 2 Pods will stay <code>Pending</code>.
            </p>
          </div>

          <h3>Common topologyKey Values</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#22c55e' }}>kubernetes.io/hostname          # Same/different node</div>
            <div style={{ color: '#22c55e' }}>topology.kubernetes.io/zone     # Same/different availability zone</div>
            <div style={{ color: '#22c55e' }}>topology.kubernetes.io/region   # Same/different region</div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Comparison: When to Use Each</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '16px',
            margin: '20px 0'
          }}>
            <div style={{
              border: '2px solid #22c55e',
              borderRadius: '8px',
              padding: '16px',
              background: '#f0fdf4'
            }}>
              <h4 style={{ marginTop: 0, color: '#22c55e' }}>nodeSelector</h4>
              <p style={{ color: '#1e293b', margin: 0, fontSize: '0.9rem' }}>
                <strong>Use when:</strong> Simple exact label matching ("disk=ssd")<br/>
                <strong>Pros:</strong> Easy to understand, simple syntax<br/>
                <strong>Cons:</strong> Limited flexibility (no OR, no preferences)
              </p>
            </div>

            <div style={{
              border: '2px solid #0ea5e9',
              borderRadius: '8px',
              padding: '16px',
              background: '#f0f9ff'
            }}>
              <h4 style={{ marginTop: 0, color: '#0ea5e9' }}>Node Affinity</h4>
              <p style={{ color: '#1e293b', margin: 0, fontSize: '0.9rem' }}>
                <strong>Use when:</strong> Complex node selection (operators, preferences, soft rules)<br/>
                <strong>Pros:</strong> Very flexible, supports soft/hard rules<br/>
                <strong>Cons:</strong> Verbose YAML, more complex to understand
              </p>
            </div>

            <div style={{
              border: '2px solid #f59e0b',
              borderRadius: '8px',
              padding: '16px',
              background: '#fef3c7'
            }}>
              <h4 style={{ marginTop: 0, color: '#f59e0b' }}>Taints & Tolerations</h4>
              <p style={{ color: '#1e293b', margin: 0, fontSize: '0.9rem' }}>
                <strong>Use when:</strong> Reserving nodes (dedicated GPU nodes, maintenance)<br/>
                <strong>Pros:</strong> Prevents unwanted Pods from scheduling<br/>
                <strong>Cons:</strong> Requires coordination (node admins + Pod owners)
              </p>
            </div>

            <div style={{
              border: '2px solid #6b7280',
              borderRadius: '8px',
              padding: '16px',
              background: '#f9fafb'
            }}>
              <h4 style={{ marginTop: 0, color: '#6b7280' }}>Pod Affinity/Anti-Affinity</h4>
              <p style={{ color: '#1e293b', margin: 0, fontSize: '0.9rem' }}>
                <strong>Use when:</strong> Pod placement relative to other Pods (co-location, spreading)<br/>
                <strong>Pros:</strong> High availability, latency optimization<br/>
                <strong>Cons:</strong> Complex, can create scheduling deadlocks
              </p>
            </div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Real-World Example: Complete Scheduling Strategy</h2>
          
          <h3>Multi-Tier Application</h3>
          <div style={{
            background: '#f9fafb',
            border: '2px solid #475569',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h4 style={{ marginTop: 0, color: '#9c0606ff' }}>Requirements</h4>
            <ul>
              <li>Frontend: Run anywhere, spread across nodes for HA</li>
              <li>Backend: Must be on SSD nodes, prefer production region</li>
              <li>Database: Must spread across zones, guaranteed resources</li>
              <li>ML Jobs: Only on GPU nodes (tainted)</li>
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
            <div style={{ color: '#64748b' }}># Frontend: Anti-affinity for spreading</div>
            <div style={{ color: '#22c55e' }}>affinity:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;podAntiAffinity:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;preferredDuringSchedulingIgnoredDuringExecution:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;- weight: 100</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;podAffinityTerm:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;labelSelector:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;matchLabels: {'{app: frontend}'}</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;topologyKey: kubernetes.io/hostname</div>
            <br/>
            <div style={{ color: '#64748b' }}># Backend: Node affinity for SSD</div>
            <div style={{ color: '#0ea5e9' }}>affinity:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;nodeAffinity:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;requiredDuringSchedulingIgnoredDuringExecution:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nodeSelectorTerms:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- matchExpressions:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- {'{key: disk, operator: In, values: [ssd]}'}</div>
            <br/>
            <div style={{ color: '#64748b' }}># ML Jobs: Tolerations for tainted GPU nodes</div>
            <div style={{ color: '#f59e0b' }}>tolerations:</div>
            <div style={{ color: '#f59e0b' }}>- {'{key: gpu, operator: Equal, value: "true", effect: NoSchedule}'}</div>
          </div>
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
          <Link href="/module-4-1" style={{
              textDecoration: 'none',
              color: '#94a3b8',
              fontWeight: 600,
              padding: '12px 24px',
              border: '2px solid #475569',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>← Previous: Resource Requests & Limits</Link>
          
          <Link href="/module-4-3" style={{
              textDecoration: 'none',
              color: '#fff',
              background: '#9c0606ff',
              fontWeight: 600,
              padding: '12px 24px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>Next: Horizontal Pod Autoscaling →</Link>
        </div>
      </main>
    </div>
  );
}
