import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Module41() {
  const [cpuRequest, setCpuRequest] = useState(0.5);
  const [memRequest, setMemRequest] = useState(512);
  const [cpuLimit, setCpuLimit] = useState(1.0);
  const [memLimit, setMemLimit] = useState(1024);

  const nodeCapacity = { cpu: 4, memory: 8192 }; // 4 CPU, 8GB RAM

  return (
    <div className={styles.container}>
      <Head>
        <title>Module 4.1: Resource Requests & Limits</title>
        <meta name="description" content="Understanding CPU and memory management in Kubernetes" />
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
        <h1 className={styles.title}>Module 4.1: Resource Requests & Limits</h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280', marginTop: '-10px' }}>
          CPU and Memory Basics
        </p>
        
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/module-3-3" legacyBehavior>
            <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              ← Previous: Environment Strategy
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/learning-modules" legacyBehavior>
            <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              All Modules
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/module-4-2" legacyBehavior>
            <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              Next: Node Scheduling →
            </a>
          </Link>
        </div>
        
        <section className={styles.spotlight}>
          <h2>The Problem: The Tragedy of the Commons</h2>
          <p>
            Imagine a shared apartment with five roommates. If everyone uses unlimited hot water, the 
            person who showers last gets a cold surprise. Kubernetes clusters face the same problem: 
            multiple Pods sharing finite CPU and memory.
          </p>

          <div style={{
            background: '#fef2f2',
            border: '2px solid #ef4444',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#dc2626' }}>❌ Without Resource Management</h3>
            <ul>
              <li>One Pod can consume all CPU, starving others</li>
              <li>Memory leaks can crash the entire node</li>
              <li>Unpredictable performance ("it was fast yesterday")</li>
              <li>Critical services get killed when the node runs out of memory</li>
              <li>No way to guarantee capacity for important workloads</li>
            </ul>
          </div>

          <div style={{
            background: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#15803d' }}>✅ With Resource Requests & Limits</h3>
            <ul>
              <li>Pods declare their resource needs upfront</li>
              <li>Kubernetes makes informed scheduling decisions</li>
              <li>Fair resource allocation across all Pods</li>
              <li>Protection against resource starvation</li>
              <li>Predictable performance and capacity planning</li>
            </ul>
          </div>

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#0369a1' }}>💡 Key Concepts</h3>
            <p><strong>Requests:</strong> Guaranteed minimum resources (used for scheduling)</p>
            <p><strong>Limits:</strong> Maximum resources a Pod can use (enforced by the kernel)</p>
            <p style={{ marginBottom: 0 }}>
              Think of requests as "reserved seats" and limits as "you can't stand in the aisle."
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>CPU vs Memory: Different Rules</h2>
          <p>
            CPU and memory are managed differently in Kubernetes because they behave differently at 
            the operating system level.
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
              padding: '20px',
              background: '#f0f9ff'
            }}>
              <h4 style={{ marginTop: 0, color: '#0ea5e9' }}>CPU (Compressible)</h4>
              <p style={{ color: '#1e293b', fontSize: '0.95rem' }}>
                <strong>Nature:</strong> Time-sliced, can be throttled
              </p>
              <p style={{ color: '#1e293b', fontSize: '0.95rem' }}>
                <strong>What happens at limit:</strong> Pod gets throttled (slowed down), never killed
              </p>
              <p style={{ color: '#1e293b', fontSize: '0.95rem' }}>
                <strong>Unit:</strong> Cores (or millicores, 1000m = 1 core)
              </p>
              <p style={{ color: '#1e293b', fontSize: '0.95rem', marginBottom: 0 }}>
                <strong>Example:</strong> <code>500m</code> = 0.5 cores = 50% of one CPU
              </p>
            </div>

            <div style={{
              border: '2px solid #ef4444',
              borderRadius: '12px',
              padding: '20px',
              background: '#fef2f2'
            }}>
              <h4 style={{ marginTop: 0, color: '#ef4444' }}>Memory (Incompressible)</h4>
              <p style={{ color: '#1e293b', fontSize: '0.95rem' }}>
                <strong>Nature:</strong> Fixed allocation, cannot be throttled
              </p>
              <p style={{ color: '#1e293b', fontSize: '0.95rem' }}>
                <strong>What happens at limit:</strong> Pod gets killed (OOMKilled)
              </p>
              <p style={{ color: '#1e293b', fontSize: '0.95rem' }}>
                <strong>Unit:</strong> Bytes (Mi = Mebibyte, Gi = Gibibyte)
              </p>
              <p style={{ color: '#1e293b', fontSize: '0.95rem', marginBottom: 0 }}>
                <strong>Example:</strong> <code>512Mi</code> = 512 MiB ≈ 537 MB
              </p>
            </div>
          </div>

          <div style={{
            background: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#b45309' }}>🔑 Critical Difference</h3>
            <p style={{ marginBottom: 0 }}>
              <strong>CPU:</strong> Exceeding the limit makes your Pod slow.<br/>
              <strong>Memory:</strong> Exceeding the limit <strong>kills your Pod</strong> (OOMKilled).<br/>
              This is why memory limits are more dangerous than CPU limits.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Setting Resource Requests & Limits</h2>
          
          <h3>Example Deployment with Resources</h3>
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
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: myapp</div>
            <div style={{ color: '#f59e0b' }}>spec:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;template:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;spec:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;containers:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: app</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;image: myapp:1.0</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;resources:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;requests:  # Guaranteed minimum (used for scheduling)</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cpu: "500m"      # 0.5 CPU cores</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;memory: "512Mi"  # 512 MiB RAM</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;limits:    # Maximum allowed (enforced)</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cpu: "1"         # 1 full CPU core</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;memory: "1Gi"    # 1 GiB RAM</div>
          </div>

          <h3>What This Means</h3>
          <div style={{
            background: '#f9fafb',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <ul style={{ lineHeight: '1.8' }}>
              <li><strong>Scheduling:</strong> Kubernetes finds a node with at least 500m CPU and 512Mi RAM available</li>
              <li><strong>CPU guarantee:</strong> Pod always gets 0.5 cores, even under heavy load</li>
              <li><strong>CPU burst:</strong> Pod can use up to 1 full core if available</li>
              <li><strong>Memory guarantee:</strong> Pod gets 512Mi reserved</li>
              <li><strong>Memory limit:</strong> Pod is killed if it tries to use more than 1Gi</li>
            </ul>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Interactive: Resource Allocation Simulator</h2>
          <p>
            Adjust the sliders to see how requests and limits affect scheduling and runtime behavior:
          </p>

          <div style={{
            background: '#f9fafb',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0'
          }}>
            <h3 style={{ marginTop: 0, color: '#9c0606ff' }}>Pod Resource Configuration</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#1e293b' }}>
                CPU Request: {cpuRequest} cores
              </label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={cpuRequest}
                onChange={(e) => setCpuRequest(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#1e293b' }}>
                CPU Limit: {cpuLimit} cores
              </label>
              <input
                type="range"
                min={cpuRequest}
                max="4"
                step="0.1"
                value={cpuLimit}
                onChange={(e) => setCpuLimit(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#1e293b' }}>
                Memory Request: {memRequest} Mi
              </label>
              <input
                type="range"
                min="128"
                max="4096"
                step="128"
                value={memRequest}
                onChange={(e) => setMemRequest(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#1e293b' }}>
                Memory Limit: {memLimit} Mi
              </label>
              <input
                type="range"
                min={memRequest}
                max="8192"
                step="128"
                value={memLimit}
                onChange={(e) => setMemLimit(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{
              background: '#1e293b',
              color: '#e2e8f0',
              padding: '20px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              marginTop: '24px'
            }}>
              <div style={{ color: '#f59e0b' }}>resources:</div>
              <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;requests:</div>
              <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;cpu: "{cpuRequest}"</div>
              <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "{memRequest}Mi"</div>
              <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;limits:</div>
              <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;cpu: "{cpuLimit}"</div>
              <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "{memLimit}Mi"</div>
            </div>

            <div style={{
              background: cpuLimit > nodeCapacity.cpu || memLimit > nodeCapacity.memory 
                ? '#fef2f2' 
                : '#f0fdf4',
              border: `2px solid ${cpuLimit > nodeCapacity.cpu || memLimit > nodeCapacity.memory ? '#ef4444' : '#22c55e'}`,
              borderRadius: '8px',
              padding: '16px',
              marginTop: '20px',
              color: '#1e293b'
            }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>
                {cpuLimit > nodeCapacity.cpu || memLimit > nodeCapacity.memory 
                  ? '❌ This Pod cannot be scheduled on the node!' 
                  : '✅ This Pod can be scheduled'}
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem' }}>
                Node capacity: {nodeCapacity.cpu} CPU, {nodeCapacity.memory}Mi RAM
              </p>
              {cpuLimit > nodeCapacity.cpu && (
                <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: '#ef4444' }}>
                  CPU limit ({cpuLimit}) exceeds node capacity ({nodeCapacity.cpu})
                </p>
              )}
              {memLimit > nodeCapacity.memory && (
                <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: '#ef4444' }}>
                  Memory limit ({memLimit}Mi) exceeds node capacity ({nodeCapacity.memory}Mi)
                </p>
              )}
            </div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Why Your Pod Gets OOMKilled</h2>
          <p>
            <strong>OOMKilled</strong> = "Out Of Memory Killed." This is the most common and frustrating 
            issue with memory limits.
          </p>

          <h3>How It Happens</h3>
          <div style={{
            background: '#fef2f2',
            border: '2px solid #ef4444',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <ol style={{ lineHeight: '1.8' }}>
              <li>You set a memory limit: <code>memory: 512Mi</code></li>
              <li>Your application uses more than 512Mi (memory leak, large dataset, etc.)</li>
              <li>Linux kernel's OOM killer detects this</li>
              <li>Kernel kills the process (your container crashes)</li>
              <li>Pod status shows: <code>OOMKilled</code></li>
              <li>Kubernetes restarts the Pod (which will likely OOMKill again)</li>
            </ol>
          </div>

          <h3>How to Diagnose OOMKilled Pods</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># Check Pod status</div>
            <div style={{ color: '#22c55e' }}>kubectl get pods</div>
            <div style={{ color: '#64748b' }}># Look for: CrashLoopBackOff, OOMKilled in READY column</div>
            <br/>
            <div style={{ color: '#64748b' }}># Describe the Pod</div>
            <div style={{ color: '#22c55e' }}>kubectl describe pod myapp-xyz</div>
            <div style={{ color: '#64748b' }}># Look for: "Last State: Terminated, Reason: OOMKilled"</div>
            <br/>
            <div style={{ color: '#64748b' }}># Check logs (if available before crash)</div>
            <div style={{ color: '#22c55e' }}>kubectl logs myapp-xyz --previous</div>
          </div>

          <h3>Solutions</h3>
          <div style={{
            background: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h4 style={{ marginTop: 0, color: '#15803d' }}>Option 1: Increase Memory Limit</h4>
            <p>If your app legitimately needs more memory:</p>
            <div style={{
              background: '#1e293b',
              color: '#e2e8f0',
              padding: '16px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              margin: '12px 0'
            }}>
              <div style={{ color: '#f59e0b' }}>resources:</div>
              <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;limits:</div>
              <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "1Gi"  # Increased from 512Mi</div>
            </div>

            <h4 style={{ color: '#15803d' }}>Option 2: Fix Memory Leak</h4>
            <p>Profile your application to find and fix memory leaks.</p>

            <h4 style={{ color: '#15803d' }}>Option 3: Optimize Application</h4>
            <p>
              Reduce memory footprint (smaller data structures, streaming instead of loading 
              everything into memory, etc.)
            </p>
          </div>

          <div style={{
            background: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#b45309' }}>⚠️ Common Mistake</h3>
            <p style={{ marginBottom: 0 }}>
              Setting memory limits too low "just to be safe" often causes more problems than it solves. 
              Your app needs room to breathe. Start with generous limits, monitor actual usage, then 
              tune down gradually.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Quality of Service (QoS) Classes</h2>
          <p>
            Kubernetes assigns every Pod a <strong>QoS class</strong> based on its resource configuration. 
            This determines priority during resource pressure.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '16px',
            margin: '20px 0'
          }}>
            <div style={{
              border: '2px solid #22c55e',
              borderRadius: '12px',
              padding: '20px',
              background: '#f0fdf4'
            }}>
              <h4 style={{ marginTop: 0, color: '#22c55e' }}>Guaranteed (Highest Priority)</h4>
              <p style={{ color: '#1e293b', fontSize: '0.95rem' }}>
                <strong>Condition:</strong> Requests = Limits for all resources
              </p>
              <div style={{
                background: '#1e293b',
                color: '#e2e8f0',
                padding: '12px',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                margin: '12px 0'
              }}>
                <div style={{ color: '#f59e0b' }}>resources:</div>
                <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;requests:</div>
                <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;cpu: "1"</div>
                <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "1Gi"</div>
                <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;limits:</div>
                <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;cpu: "1"      # Same as request</div>
                <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "1Gi"  # Same as request</div>
              </div>
              <p style={{ color: '#1e293b', fontSize: '0.9rem', marginBottom: 0 }}>
                <strong>Eviction:</strong> Last to be killed during resource pressure. Use for critical services.
              </p>
            </div>

            <div style={{
              border: '2px solid #0ea5e9',
              borderRadius: '12px',
              padding: '20px',
              background: '#f0f9ff'
            }}>
              <h4 style={{ marginTop: 0, color: '#0ea5e9' }}>Burstable (Medium Priority)</h4>
              <p style={{ color: '#1e293b', fontSize: '0.95rem' }}>
                <strong>Condition:</strong> Requests {'<'} Limits (or only requests set)
              </p>
              <div style={{
                background: '#1e293b',
                color: '#e2e8f0',
                padding: '12px',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                margin: '12px 0'
              }}>
                <div style={{ color: '#f59e0b' }}>resources:</div>
                <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;requests:</div>
                <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;cpu: "500m"</div>
                <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "512Mi"</div>
                <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;limits:</div>
                <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;cpu: "2"       # Higher than request</div>
                <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "2Gi"   # Higher than request</div>
              </div>
              <p style={{ color: '#1e293b', fontSize: '0.9rem', marginBottom: 0 }}>
                <strong>Eviction:</strong> Killed before Guaranteed, after BestEffort. Most common QoS class.
              </p>
            </div>

            <div style={{
              border: '2px solid #ef4444',
              borderRadius: '12px',
              padding: '20px',
              background: '#fef2f2'
            }}>
              <h4 style={{ marginTop: 0, color: '#ef4444' }}>BestEffort (Lowest Priority)</h4>
              <p style={{ color: '#1e293b', fontSize: '0.95rem' }}>
                <strong>Condition:</strong> No requests or limits set
              </p>
              <div style={{
                background: '#1e293b',
                color: '#e2e8f0',
                padding: '12px',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                margin: '12px 0'
              }}>
                <div style={{ color: '#64748b' }}># No resources block at all</div>
                <div style={{ color: '#ef4444' }}>containers:</div>
                <div style={{ color: '#ef4444' }}>- name: app</div>
                <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;image: myapp:1.0</div>
                <div style={{ color: '#64748b' }}>&nbsp;&nbsp;# No resources: section</div>
              </div>
              <p style={{ color: '#1e293b', fontSize: '0.9rem', marginBottom: 0 }}>
                <strong>Eviction:</strong> First to be killed. Only use for non-critical batch jobs.
              </p>
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
            <h3 style={{ marginTop: 0, color: '#0369a1' }}>💡 Recommendation</h3>
            <p style={{ marginBottom: 0 }}>
              <strong>Burstable</strong> is the sweet spot for most workloads. It gives you scheduling 
              guarantees (requests) while allowing bursts (limits). Use <strong>Guaranteed</strong> only 
              for critical services that need absolute priority.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Fairness and Starvation</h2>
          
          <h3>Resource Starvation (The Noisy Neighbor Problem)</h3>
          <p>
            Without proper resource management, a single Pod can monopolize cluster resources, 
            starving other Pods.
          </p>

          <div style={{
            background: '#fef2f2',
            border: '2px solid #ef4444',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h4 style={{ marginTop: 0, color: '#dc2626' }}>Scenario: The Memory Hog</h4>
            <ol style={{ lineHeight: '1.8' }}>
              <li>Pod A has no memory limit</li>
              <li>Pod A has a memory leak and grows to 6GB</li>
              <li>Node has 8GB total, now only 2GB free</li>
              <li>Pods B, C, D get OOMKilled because the node is out of memory</li>
              <li>Your production API is down because a batch job leaked memory</li>
            </ol>
          </div>

          <h3>How Kubernetes Ensures Fairness</h3>
          <div style={{
            background: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h4 style={{ marginTop: 0, color: '#15803d' }}>1. Requests Guarantee Minimum Resources</h4>
            <p>
              If Pod A requests 500m CPU, it's <strong>guaranteed</strong> 500m even if other Pods 
              try to use all CPU.
            </p>

            <h4 style={{ color: '#15803d' }}>2. Limits Prevent Monopolization</h4>
            <p>
              If Pod A has a 1Gi memory limit, it <strong>cannot</strong> consume more than 1Gi, 
              protecting other Pods.
            </p>

            <h4 style={{ color: '#15803d' }}>3. QoS-Based Eviction</h4>
            <p>
              During resource pressure, Kubernetes kills BestEffort Pods first, then Burstable, 
              then Guaranteed.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Common Resource Patterns</h2>
          
          <h3>Web Application (Burstable)</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#f59e0b' }}>resources:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;requests:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;cpu: "100m"      # Low baseline</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "256Mi"  # Typical web app</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;limits:</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;cpu: "500m"      # Can burst during traffic spikes</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "512Mi"  # Prevent memory leaks</div>
          </div>

          <h3>Database (Guaranteed)</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#f59e0b' }}>resources:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;requests:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;cpu: "2"</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "4Gi"</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;limits:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;cpu: "2"         # Same = Guaranteed QoS</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "4Gi"    # Critical, needs priority</div>
          </div>

          <h3>Batch Job (Burstable, Low Priority)</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#f59e0b' }}>resources:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;requests:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;cpu: "500m"</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "1Gi"</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;limits:</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;cpu: "4"          # Use idle CPU if available</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "4Gi"     # Can use more memory</div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Monitoring Resource Usage</h2>
          
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># Check node resource usage</div>
            <div style={{ color: '#22c55e' }}>kubectl top nodes</div>
            <br/>
            <div style={{ color: '#64748b' }}># Check Pod resource usage</div>
            <div style={{ color: '#22c55e' }}>kubectl top pods</div>
            <div style={{ color: '#22c55e' }}>kubectl top pods --all-namespaces</div>
            <br/>
            <div style={{ color: '#64748b' }}># Describe node to see allocatable resources</div>
            <div style={{ color: '#22c55e' }}>kubectl describe node my-node</div>
            <div style={{ color: '#64748b' }}># Look for "Allocated resources" section</div>
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
              ⚠️ <code>kubectl top</code> requires <strong>Metrics Server</strong> to be installed 
              in your cluster. Most cloud providers enable it by default.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Key Takeaways</h2>
          <ul>
            <li><strong>Requests:</strong> Guaranteed minimum resources, used for scheduling decisions</li>
            <li><strong>Limits:</strong> Maximum resources, enforced by the kernel</li>
            <li><strong>CPU</strong> is compressible (throttled), <strong>memory</strong> is incompressible (OOMKilled)</li>
            <li><strong>OOMKilled</strong> happens when a Pod exceeds its memory limit</li>
            <li><strong>QoS classes:</strong> Guaranteed (requests = limits), Burstable (requests {'<'} limits), BestEffort (no resources set)</li>
            <li>Use <strong>Burstable</strong> for most workloads, <strong>Guaranteed</strong> for critical services</li>
            <li>Set <strong>generous memory limits</strong> to avoid OOMKills, then tune based on monitoring</li>
            <li>Resource management prevents starvation and ensures fairness</li>
            <li>Monitor with <code>kubectl top nodes/pods</code></li>
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
          <Link href="/module-3-3" legacyBehavior>
            <a style={{
              textDecoration: 'none',
              color: '#4b5563',
              fontWeight: 600,
              padding: '12px 24px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>← Previous: Environment Strategy</a>
          </Link>
          
          <Link href="/module-4-2" legacyBehavior>
            <a style={{
              textDecoration: 'none',
              color: '#fff',
              background: '#9c0606ff',
              fontWeight: 600,
              padding: '12px 24px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>Next: Node Scheduling →</a>
          </Link>
        </div>
      </main>
    </div>
  );
}
