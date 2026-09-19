import { useState } from 'react';
import styles from '../styles/Home.module.css';
import moduleStyles from '../styles/Module.module.css';
import ModuleShell from '../components/module/ModuleShell';
import Callout from '../components/module/Callout';
import TermBox from '../components/module/TermBox';

const sliderLabel: React.CSSProperties = {
  display: 'block',
  fontWeight: 'bold',
  marginBottom: '8px',
  color: 'var(--color-text-primary)',
};

export default function Module41() {
  const [cpuRequest, setCpuRequest] = useState(0.5);
  const [memRequest, setMemRequest] = useState(512);
  const [cpuLimit, setCpuLimit] = useState(1.0);
  const [memLimit, setMemLimit] = useState(1024);

  const nodeCapacity = { cpu: 4, memory: 8192 }; // 4 CPU, 8GB RAM
  const overCapacity = cpuLimit > nodeCapacity.cpu || memLimit > nodeCapacity.memory;

  return (
    <ModuleShell id="4-1" subtitle="CPU and Memory Basics">
      <section className={styles.spotlight}>
        <h2>The Problem: The Tragedy of the Commons</h2>
        <p>
          Imagine a shared apartment with five roommates. If everyone uses unlimited hot water, the
          person who showers last gets a cold surprise. Kubernetes clusters face the same problem:
          multiple Pods sharing finite CPU and memory.
        </p>

        <Callout variant="danger" icon="❌" title="Without Resource Management">
          <ul>
            <li>One Pod can consume all CPU, starving others</li>
            <li>Memory leaks can crash the entire node</li>
            <li>Unpredictable performance ("it was fast yesterday")</li>
            <li>Critical services get killed when the node runs out of memory</li>
            <li>No way to guarantee capacity for important workloads</li>
          </ul>
        </Callout>

        <Callout variant="success" icon="✅" title="With Resource Requests & Limits">
          <ul>
            <li>Pods declare their resource needs upfront</li>
            <li>Kubernetes makes informed scheduling decisions</li>
            <li>Fair resource allocation across all Pods</li>
            <li>Protection against resource starvation</li>
            <li>Predictable performance and capacity planning</li>
          </ul>
        </Callout>

        <Callout variant="info" icon="💡" title="Key Concepts">
          <p><strong>Requests:</strong> Guaranteed minimum resources (used for scheduling)</p>
          <p><strong>Limits:</strong> Maximum resources a Pod can use (enforced by the kernel)</p>
          <p>Think of requests as "reserved seats" and limits as "you can't stand in the aisle."</p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>CPU vs Memory: Different Rules</h2>
        <p>
          CPU and memory are managed differently in Kubernetes because they behave differently at
          the operating system level.
        </p>

        <div className={moduleStyles.grid}>
          <Callout variant="info" title="CPU (Compressible)">
            <p><strong>Nature:</strong> Time-sliced, can be throttled</p>
            <p><strong>What happens at limit:</strong> Pod gets throttled (slowed down), never killed</p>
            <p><strong>Unit:</strong> Cores (or millicores, 1000m = 1 core)</p>
            <p><strong>Example:</strong> <code>500m</code> = 0.5 cores = 50% of one CPU</p>
          </Callout>

          <Callout variant="danger" title="Memory (Incompressible)">
            <p><strong>Nature:</strong> Fixed allocation, cannot be throttled</p>
            <p><strong>What happens at limit:</strong> Pod gets killed (OOMKilled)</p>
            <p><strong>Unit:</strong> Bytes (Mi = Mebibyte, Gi = Gibibyte)</p>
            <p><strong>Example:</strong> <code>512Mi</code> = 512 MiB ≈ 537 MB</p>
          </Callout>
        </div>

        <Callout variant="warning" icon="🔑" title="Critical Difference">
          <p>
            <strong>CPU:</strong> Exceeding the limit makes your Pod slow.<br />
            <strong>Memory:</strong> Exceeding the limit <strong>kills your Pod</strong> (OOMKilled).<br />
            This is why memory limits are more dangerous than CPU limits.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Setting Resource Requests & Limits</h2>

        <h3>Example Deployment with Resources</h3>
        <TermBox>
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
        </TermBox>

        <h3>What This Means</h3>
        <Callout variant="neutral">
          <ul style={{ lineHeight: '1.8' }}>
            <li><strong>Scheduling:</strong> Kubernetes finds a node with at least 500m CPU and 512Mi RAM available</li>
            <li><strong>CPU guarantee:</strong> Pod always gets 0.5 cores, even under heavy load</li>
            <li><strong>CPU burst:</strong> Pod can use up to 1 full core if available</li>
            <li><strong>Memory guarantee:</strong> Pod gets 512Mi reserved</li>
            <li><strong>Memory limit:</strong> Pod is killed if it tries to use more than 1Gi</li>
          </ul>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Interactive: Resource Allocation Simulator</h2>
        <p>Adjust the sliders to see how requests and limits affect scheduling and runtime behavior:</p>

        <div
          style={{
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            margin: '20px 0',
          }}
        >
          <h3 style={{ marginTop: 0, color: 'var(--color-text-accent)' }}>Pod Resource Configuration</h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={sliderLabel}>CPU Request: {cpuRequest} cores</label>
            <input type="range" min="0.1" max="2" step="0.1" value={cpuRequest} onChange={(e) => setCpuRequest(parseFloat(e.target.value))} style={{ width: '100%' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={sliderLabel}>CPU Limit: {cpuLimit} cores</label>
            <input type="range" min={cpuRequest} max="4" step="0.1" value={cpuLimit} onChange={(e) => setCpuLimit(parseFloat(e.target.value))} style={{ width: '100%' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={sliderLabel}>Memory Request: {memRequest} Mi</label>
            <input type="range" min="128" max="4096" step="128" value={memRequest} onChange={(e) => setMemRequest(parseInt(e.target.value))} style={{ width: '100%' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={sliderLabel}>Memory Limit: {memLimit} Mi</label>
            <input type="range" min={memRequest} max="8192" step="128" value={memLimit} onChange={(e) => setMemLimit(parseInt(e.target.value))} style={{ width: '100%' }} />
          </div>

          <TermBox copyable={false}>
            <div style={{ color: '#f59e0b' }}>resources:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;requests:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;cpu: "{cpuRequest}"</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "{memRequest}Mi"</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;limits:</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;cpu: "{cpuLimit}"</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "{memLimit}Mi"</div>
          </TermBox>

          <Callout variant={overCapacity ? 'danger' : 'success'}>
            <p style={{ fontWeight: 'bold' }}>
              {overCapacity ? '❌ This Pod cannot be scheduled on the node!' : '✅ This Pod can be scheduled'}
            </p>
            <p style={{ fontSize: '0.9rem' }}>
              Node capacity: {nodeCapacity.cpu} CPU, {nodeCapacity.memory}Mi RAM
            </p>
            {cpuLimit > nodeCapacity.cpu && (
              <p style={{ fontSize: '0.9rem' }}>CPU limit ({cpuLimit}) exceeds node capacity ({nodeCapacity.cpu})</p>
            )}
            {memLimit > nodeCapacity.memory && (
              <p style={{ fontSize: '0.9rem' }}>Memory limit ({memLimit}Mi) exceeds node capacity ({nodeCapacity.memory}Mi)</p>
            )}
          </Callout>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>Why Your Pod Gets OOMKilled</h2>
        <p>
          <strong>OOMKilled</strong> = "Out Of Memory Killed." This is the most common and frustrating
          issue with memory limits.
        </p>

        <h3>How It Happens</h3>
        <Callout variant="danger">
          <ol style={{ lineHeight: '1.8' }}>
            <li>You set a memory limit: <code>memory: 512Mi</code></li>
            <li>Your application uses more than 512Mi (memory leak, large dataset, etc.)</li>
            <li>Linux kernel's OOM killer detects this</li>
            <li>Kernel kills the process (your container crashes)</li>
            <li>Pod status shows: <code>OOMKilled</code></li>
            <li>Kubernetes restarts the Pod (which will likely OOMKill again)</li>
          </ol>
        </Callout>

        <h3>How to Diagnose OOMKilled Pods</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># Check Pod status</div>
          <div style={{ color: '#22c55e' }}>kubectl get pods</div>
          <div style={{ color: '#64748b' }}># Look for: CrashLoopBackOff, OOMKilled in READY column</div>
          <br />
          <div style={{ color: '#64748b' }}># Describe the Pod</div>
          <div style={{ color: '#22c55e' }}>kubectl describe pod myapp-xyz</div>
          <div style={{ color: '#64748b' }}># Look for: "Last State: Terminated, Reason: OOMKilled"</div>
          <br />
          <div style={{ color: '#64748b' }}># Check logs (if available before crash)</div>
          <div style={{ color: '#22c55e' }}>kubectl logs myapp-xyz --previous</div>
        </TermBox>

        <h3>Solutions</h3>
        <Callout variant="success" title="Option 1: Increase Memory Limit">
          <p>If your app legitimately needs more memory:</p>
          <TermBox>
            <div style={{ color: '#f59e0b' }}>resources:</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;limits:</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "1Gi"  # Increased from 512Mi</div>
          </TermBox>

          <h4>Option 2: Fix Memory Leak</h4>
          <p>Profile your application to find and fix memory leaks.</p>

          <h4>Option 3: Optimize Application</h4>
          <p>
            Reduce memory footprint (smaller data structures, streaming instead of loading
            everything into memory, etc.)
          </p>
        </Callout>

        <Callout variant="warning" icon="⚠️" title="Common Mistake">
          <p>
            Setting memory limits too low "just to be safe" often causes more problems than it solves.
            Your app needs room to breathe. Start with generous limits, monitor actual usage, then
            tune down gradually.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Quality of Service (QoS) Classes</h2>
        <p>
          Kubernetes assigns every Pod a <strong>QoS class</strong> based on its resource configuration.
          This determines priority during resource pressure.
        </p>

        <div style={{ display: 'grid', gap: '1rem', margin: '1.5rem 0' }}>
          <Callout variant="success" title="Guaranteed (Highest Priority)">
            <p><strong>Condition:</strong> Requests = Limits for all resources</p>
            <TermBox>
              <div style={{ color: '#f59e0b' }}>resources:</div>
              <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;requests:</div>
              <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;cpu: "1"</div>
              <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "1Gi"</div>
              <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;limits:</div>
              <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;cpu: "1"      # Same as request</div>
              <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "1Gi"  # Same as request</div>
            </TermBox>
            <p><strong>Eviction:</strong> Last to be killed during resource pressure. Use for critical services.</p>
          </Callout>

          <Callout variant="info" title="Burstable (Medium Priority)">
            <p><strong>Condition:</strong> Requests {'<'} Limits (or only requests set)</p>
            <TermBox>
              <div style={{ color: '#f59e0b' }}>resources:</div>
              <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;requests:</div>
              <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;cpu: "500m"</div>
              <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "512Mi"</div>
              <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;limits:</div>
              <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;cpu: "2"       # Higher than request</div>
              <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "2Gi"   # Higher than request</div>
            </TermBox>
            <p><strong>Eviction:</strong> Killed before Guaranteed, after BestEffort. Most common QoS class.</p>
          </Callout>

          <Callout variant="danger" title="BestEffort (Lowest Priority)">
            <p><strong>Condition:</strong> No requests or limits set</p>
            <TermBox>
              <div style={{ color: '#64748b' }}># No resources block at all</div>
              <div style={{ color: '#ef4444' }}>containers:</div>
              <div style={{ color: '#ef4444' }}>- name: app</div>
              <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;image: myapp:1.0</div>
              <div style={{ color: '#64748b' }}>&nbsp;&nbsp;# No resources: section</div>
            </TermBox>
            <p><strong>Eviction:</strong> First to be killed. Only use for non-critical batch jobs.</p>
          </Callout>
        </div>

        <Callout variant="info" icon="💡" title="Recommendation">
          <p>
            <strong>Burstable</strong> is the sweet spot for most workloads. It gives you scheduling
            guarantees (requests) while allowing bursts (limits). Use <strong>Guaranteed</strong> only
            for critical services that need absolute priority.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Fairness and Starvation</h2>

        <h3>Resource Starvation (The Noisy Neighbor Problem)</h3>
        <p>
          Without proper resource management, a single Pod can monopolize cluster resources,
          starving other Pods.
        </p>

        <Callout variant="danger" title="Scenario: The Memory Hog">
          <ol style={{ lineHeight: '1.8' }}>
            <li>Pod A has no memory limit</li>
            <li>Pod A has a memory leak and grows to 6GB</li>
            <li>Node has 8GB total, now only 2GB free</li>
            <li>Pods B, C, D get OOMKilled because the node is out of memory</li>
            <li>Your production API is down because a batch job leaked memory</li>
          </ol>
        </Callout>

        <h3>How Kubernetes Ensures Fairness</h3>
        <Callout variant="success" title="Fairness Mechanisms">
          <h4>1. Requests Guarantee Minimum Resources</h4>
          <p>
            If Pod A requests 500m CPU, it's <strong>guaranteed</strong> 500m even if other Pods
            try to use all CPU.
          </p>

          <h4>2. Limits Prevent Monopolization</h4>
          <p>
            If Pod A has a 1Gi memory limit, it <strong>cannot</strong> consume more than 1Gi,
            protecting other Pods.
          </p>

          <h4>3. QoS-Based Eviction</h4>
          <p>
            During resource pressure, Kubernetes kills BestEffort Pods first, then Burstable,
            then Guaranteed.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Common Resource Patterns</h2>

        <h3>Web Application (Burstable)</h3>
        <TermBox>
          <div style={{ color: '#f59e0b' }}>resources:</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;requests:</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;cpu: "100m"      # Low baseline</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "256Mi"  # Typical web app</div>
          <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;limits:</div>
          <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;cpu: "500m"      # Can burst during traffic spikes</div>
          <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "512Mi"  # Prevent memory leaks</div>
        </TermBox>

        <h3>Database (Guaranteed)</h3>
        <TermBox>
          <div style={{ color: '#f59e0b' }}>resources:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;requests:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;cpu: "2"</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "4Gi"</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;limits:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;cpu: "2"         # Same = Guaranteed QoS</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "4Gi"    # Critical, needs priority</div>
        </TermBox>

        <h3>Batch Job (Burstable, Low Priority)</h3>
        <TermBox>
          <div style={{ color: '#f59e0b' }}>resources:</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;requests:</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;cpu: "500m"</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "1Gi"</div>
          <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;limits:</div>
          <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;cpu: "4"          # Use idle CPU if available</div>
          <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;memory: "4Gi"     # Can use more memory</div>
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>Monitoring Resource Usage</h2>

        <TermBox>
          <div style={{ color: '#64748b' }}># Check node resource usage</div>
          <div style={{ color: '#22c55e' }}>kubectl top nodes</div>
          <br />
          <div style={{ color: '#64748b' }}># Check Pod resource usage</div>
          <div style={{ color: '#22c55e' }}>kubectl top pods</div>
          <div style={{ color: '#22c55e' }}>kubectl top pods --all-namespaces</div>
          <br />
          <div style={{ color: '#64748b' }}># Describe node to see allocatable resources</div>
          <div style={{ color: '#22c55e' }}>kubectl describe node my-node</div>
          <div style={{ color: '#64748b' }}># Look for "Allocated resources" section</div>
        </TermBox>

        <Callout variant="warning">
          <p>
            ⚠️ <code>kubectl top</code> requires <strong>Metrics Server</strong> to be installed
            in your cluster. Most cloud providers enable it by default.
          </p>
        </Callout>
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
    </ModuleShell>
  );
}
