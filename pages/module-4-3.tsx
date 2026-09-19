import { useState } from 'react';
import styles from '../styles/Home.module.css';
import ModuleShell from '../components/module/ModuleShell';
import Callout from '../components/module/Callout';
import TermBox from '../components/module/TermBox';

const sliderLabel: React.CSSProperties = {
  display: 'block',
  fontWeight: 600,
  marginBottom: '8px',
  color: 'var(--color-text-primary)',
};

export default function Module43() {
  const [currentLoad, setCurrentLoad] = useState(30);
  const [targetCPU, setTargetCPU] = useState(70);
  const [minReplicas, setMinReplicas] = useState(2);
  const [maxReplicas, setMaxReplicas] = useState(10);

  const calculateReplicas = () => {
    if (currentLoad <= targetCPU) {
      return minReplicas;
    }
    const desired = Math.ceil((currentLoad / targetCPU) * minReplicas);
    return Math.min(Math.max(desired, minReplicas), maxReplicas);
  };

  const desiredReplicas = calculateReplicas();
  const isScalingUp = currentLoad > targetCPU;
  const isScalingDown = currentLoad < targetCPU && desiredReplicas > minReplicas;
  const accent = isScalingUp ? '#ef4444' : isScalingDown ? '#3b82f6' : '#22c55e';

  return (
    <ModuleShell id="4-3" subtitle="When Autoscaling Helps (and When It Lies to You)">
      <section className={styles.spotlight}>
        <h2>The Scaling Problem</h2>
        <p>
          It's Black Friday. Your e-commerce site normally handles 100 requests/second. Today,
          you're seeing 10,000 req/s. Your 3 Pods are at 98% CPU. Users are seeing 503 errors.
          Can Kubernetes automatically spin up more Pods?
        </p>

        <Callout variant="success" icon="✅" title="Yes: Horizontal Pod Autoscaler (HPA)">
          <p>
            HPA automatically adjusts the number of Pod replicas based on observed metrics like
            CPU usage, memory usage, or custom metrics (requests/second, queue length, etc).
          </p>
        </Callout>

        <Callout variant="danger" icon="⚠️" title="When HPA Can't Save You">
          <p>
            HPA scales <strong>Pods</strong>, not <strong>nodes</strong>. If your cluster is
            out of CPU/memory capacity, new Pods will be <code>Pending</code>. You need
            <strong>Cluster Autoscaler</strong> (adds nodes) or <strong>Vertical Pod
            Autoscaler</strong> (adjusts resource requests).
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Interactive: HPA Simulation</h2>
        <p>Adjust the current CPU load and observe how HPA scales the number of replicas:</p>

        <div
          style={{
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            margin: '20px 0',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <label style={sliderLabel}>Current CPU Usage: {currentLoad}%</label>
            <input type="range" min="10" max="100" value={currentLoad} onChange={(e) => setCurrentLoad(Number(e.target.value))} style={{ width: '100%' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={sliderLabel}>Target CPU: {targetCPU}%</label>
            <input type="range" min="50" max="90" value={targetCPU} onChange={(e) => setTargetCPU(Number(e.target.value))} style={{ width: '100%' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={sliderLabel}>Min Replicas: {minReplicas}</label>
              <input type="range" min="1" max="5" value={minReplicas} onChange={(e) => setMinReplicas(Number(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div>
              <label style={sliderLabel}>Max Replicas: {maxReplicas}</label>
              <input type="range" min="5" max="20" value={maxReplicas} onChange={(e) => setMaxReplicas(Number(e.target.value))} style={{ width: '100%' }} />
            </div>
          </div>

          <div
            style={{
              background: 'var(--color-bg-secondary)',
              border: `2px solid ${accent}`,
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: accent, marginBottom: '12px' }}>{desiredReplicas}</div>
            <div style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', fontWeight: 600, marginBottom: '8px' }}>Desired Replicas</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              {isScalingUp && `🔥 Scaling UP (CPU ${currentLoad}% > target ${targetCPU}%)`}
              {isScalingDown && `❄️ Scaling DOWN (CPU ${currentLoad}% < target ${targetCPU}%)`}
              {!isScalingUp && !isScalingDown && `✅ Stable (CPU within target)`}
            </div>
          </div>

          <TermBox copyable={false}>
            <div style={{ color: '#64748b' }}># Calculated formula:</div>
            <div>desiredReplicas = ceil((currentLoad / targetCPU) * currentReplicas)</div>
            <div>desiredReplicas = ceil(({currentLoad} / {targetCPU}) * {minReplicas}) = <span style={{ color: '#22c55e' }}>{desiredReplicas}</span></div>
            <div style={{ marginTop: '8px', color: '#64748b' }}># Constrained: {minReplicas} ≤ replicas ≤ {maxReplicas}</div>
          </TermBox>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>How HPA Works</h2>

        <Callout variant="neutral" title="The Control Loop">
          <ol>
            <li><strong>Metrics Server</strong> collects CPU/memory from kubelet every 15s</li>
            <li><strong>HPA Controller</strong> queries metrics every 15s (configurable)</li>
            <li>HPA calculates: <code>desiredReplicas = ceil(currentReplicas * (currentMetric / targetMetric))</code></li>
            <li>If desired ≠ current, HPA updates the Deployment/ReplicaSet <code>spec.replicas</code></li>
            <li>ReplicaSet creates/deletes Pods</li>
            <li>Wait for cooldown period (scale-up: 3 min, scale-down: 5 min default)</li>
          </ol>
        </Callout>

        <h3>Prerequisites</h3>
        <Callout variant="warning">
          <p>
            <strong>⚠️ CRITICAL:</strong> HPA requires the <strong>Metrics Server</strong> to be
            installed in your cluster. Without it, HPA cannot read CPU/memory metrics.
          </p>
          <TermBox>
            <div style={{ color: '#64748b' }}># Check if metrics-server is running</div>
            <div style={{ color: '#22c55e' }}>kubectl get deployment metrics-server -n kube-system</div>
            <br />
            <div style={{ color: '#64748b' }}># Install metrics-server (if missing)</div>
            <div style={{ color: '#22c55e' }}>kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml</div>
          </TermBox>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Creating an HPA</h2>

        <h3>Method 1: kubectl Command</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># Autoscale a Deployment based on CPU</div>
          <div style={{ color: '#22c55e' }}>kubectl autoscale deployment web-app \</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--cpu-percent=70 \</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--min=2 \</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--max=10</div>
          <br />
          <div style={{ color: '#64748b' }}># Check HPA status</div>
          <div style={{ color: '#0ea5e9' }}>kubectl get hpa</div>
          <div style={{ color: '#64748b' }}>NAME      REFERENCE            TARGETS   MINPODS   MAXPODS   REPLICAS</div>
          <div style={{ color: '#e2e8f0' }}>web-app   Deployment/web-app   45%/70%   2         10        3</div>
        </TermBox>

        <h3>Method 2: YAML Manifest</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># hpa.yaml</div>
          <div style={{ color: '#f59e0b' }}>apiVersion: autoscaling/v2</div>
          <div style={{ color: '#f59e0b' }}>kind: HorizontalPodAutoscaler</div>
          <div style={{ color: '#f59e0b' }}>metadata:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: web-app-hpa</div>
          <div style={{ color: '#f59e0b' }}>spec:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;scaleTargetRef:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;apiVersion: apps/v1</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;kind: Deployment</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;name: web-app</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;minReplicas: 2</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;maxReplicas: 10</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;metrics:</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;- type: Resource</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;resource:</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: cpu</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;target:</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type: Utilization</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;averageUtilization: 70  # Target 70% CPU</div>
        </TermBox>

        <Callout variant="info">
          <p>
            <strong>💡 How to read this:</strong> Keep CPU usage around 70% by adjusting replicas
            between 2 and 10. If CPU goes above 70%, scale up. If below, scale down (but never
            below 2).
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Multiple Metrics</h2>
        <p>
          HPA can scale based on <strong>multiple metrics</strong> simultaneously. It calculates
          desired replicas for each metric and picks the <strong>highest</strong> value.
        </p>

        <TermBox>
          <div style={{ color: '#f59e0b' }}>apiVersion: autoscaling/v2</div>
          <div style={{ color: '#f59e0b' }}>kind: HorizontalPodAutoscaler</div>
          <div style={{ color: '#f59e0b' }}>metadata:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: multi-metric-hpa</div>
          <div style={{ color: '#f59e0b' }}>spec:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;scaleTargetRef:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;apiVersion: apps/v1</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;kind: Deployment</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;name: api-server</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;minReplicas: 3</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;maxReplicas: 50</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;metrics:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;- type: Resource  # CPU</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;resource:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: cpu</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;target:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type: Utilization</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;averageUtilization: 70</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;- type: Resource  # Memory</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;resource:</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: memory</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;target:</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type: Utilization</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;averageUtilization: 80</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;- type: Pods  # Custom metric</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;pods:</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;metric:</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: http_requests_per_second</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;target:</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type: AverageValue</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;averageValue: "1000"  # 1000 req/s per Pod</div>
        </TermBox>

        <Callout variant="info">
          <p>
            <strong>Scaling Logic:</strong> If CPU says "need 5 replicas", memory says "need 7 replicas",
            and custom metric says "need 10 replicas", HPA will scale to <strong>10 replicas</strong>
            (the maximum).
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Custom Metrics</h2>
        <p>CPU and memory are <strong>resource metrics</strong>. But what if you want to scale based on:</p>
        <ul>
          <li>HTTP requests per second</li>
          <li>Queue length (RabbitMQ, Kafka)</li>
          <li>Database connection pool usage</li>
          <li>Custom business metrics (orders/minute)</li>
        </ul>

        <h3>Custom Metrics Architecture</h3>
        <Callout variant="neutral">
          <ol>
            <li><strong>Application</strong> exposes metrics (Prometheus format)</li>
            <li><strong>Prometheus</strong> scrapes and stores metrics</li>
            <li><strong>Prometheus Adapter</strong> translates Prometheus metrics to Kubernetes API</li>
            <li><strong>HPA</strong> queries custom metrics via Kubernetes API</li>
          </ol>
        </Callout>

        <TermBox>
          <div style={{ color: '#64748b' }}># Install Prometheus + Adapter (Helm)</div>
          <div style={{ color: '#22c55e' }}>helm install prometheus-adapter prometheus-community/prometheus-adapter</div>
          <br />
          <div style={{ color: '#64748b' }}># HPA using custom metric</div>
          <div style={{ color: '#f59e0b' }}>metrics:</div>
          <div style={{ color: '#f59e0b' }}>- type: Pods</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;pods:</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;metric:</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: rabbitmq_queue_messages_ready</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;target:</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type: AverageValue</div>
          <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;averageValue: "30"  # Max 30 messages per Pod</div>
        </TermBox>

        <Callout variant="warning">
          <p>
            <strong>💡 Use Case:</strong> Worker Pods processing a queue. If queue length grows,
            scale up workers. If queue is empty, scale down. This is more accurate than CPU-based
            scaling for batch workloads.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>When HPA Fails (and How to Fix It)</h2>

        <div style={{ display: 'grid', gap: '1rem', margin: '1.5rem 0' }}>
          <Callout variant="danger" title="❌ Problem: HPA Shows &quot;unknown&quot; Metrics">
            <p>
              <strong>Cause:</strong> Metrics server not installed, or Pods missing resource requests<br />
              <strong>Fix:</strong> Install metrics-server, add <code>resources.requests</code> to Pod spec (Module 4.1)
            </p>
          </Callout>
          <Callout variant="danger" title="❌ Problem: Pods Stay Pending After Scale-Up">
            <p>
              <strong>Cause:</strong> Cluster out of capacity (no nodes with available CPU/memory)<br />
              <strong>Fix:</strong> Enable Cluster Autoscaler (adds nodes) or reduce resource requests
            </p>
          </Callout>
          <Callout variant="danger" title="❌ Problem: HPA Flapping (Rapid Scale Up/Down)">
            <p>
              <strong>Cause:</strong> Target metric too sensitive, or cooldown period too short<br />
              <strong>Fix:</strong> Increase cooldown periods, use multiple metrics, adjust target threshold
            </p>
          </Callout>
          <Callout variant="danger" title="❌ Problem: HPA Scales Too Slowly">
            <p>
              <strong>Cause:</strong> Default cooldown (3 min scale-up, 5 min scale-down) too slow<br />
              <strong>Fix:</strong> Tune <code>--horizontal-pod-autoscaler-downscale-stabilization</code> and
              <code>--horizontal-pod-autoscaler-sync-period</code> flags
            </p>
          </Callout>
          <Callout variant="danger" title="❌ Problem: Cold Start Latency">
            <p>
              <strong>Cause:</strong> New Pods take 30s+ to start (container pull, app initialization)<br />
              <strong>Fix:</strong> Predictive scaling (scale up before traffic hits), keep <code>minReplicas</code>
              higher, use readiness probes properly
            </p>
          </Callout>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>HPA Best Practices</h2>

        <Callout variant="success" icon="✅" title="Do This">
          <ul>
            <li><strong>Set resource requests:</strong> HPA needs CPU/memory requests to calculate percentages</li>
            <li><strong>Start conservative:</strong> Begin with <code>minReplicas=2</code>, <code>maxReplicas=10</code></li>
            <li><strong>Monitor HPA behavior:</strong> Use <code>kubectl get hpa --watch</code> and Grafana dashboards</li>
            <li><strong>Use multiple metrics:</strong> Combine CPU with custom metrics (requests/s, queue length)</li>
            <li><strong>Test under load:</strong> Use load testing tools (k6, Locust) to validate HPA behavior</li>
            <li><strong>Set appropriate targets:</strong> CPU target 70-80% (not 95% - leaves no headroom)</li>
            <li><strong>Consider readiness probes:</strong> Don't send traffic to Pods until they're ready</li>
          </ul>
        </Callout>

        <Callout variant="danger" icon="❌" title="Don't Do This">
          <ul>
            <li><strong>Don't use HPA with StatefulSets:</strong> Stateful apps (databases) don't scale horizontally easily</li>
            <li><strong>Don't scale too aggressively:</strong> <code>maxReplicas=1000</code> will bankrupt your cloud bill</li>
            <li><strong>Don't use memory-based scaling alone:</strong> Memory doesn't drop after requests finish (unlike CPU)</li>
            <li><strong>Don't forget cluster capacity:</strong> HPA can't add nodes, only Pods</li>
            <li><strong>Don't ignore cold start time:</strong> If Pods take 2 minutes to start, users will wait 2 minutes</li>
            <li><strong>Don't set target too low:</strong> <code>targetCPU=30%</code> wastes resources</li>
          </ul>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Vertical Pod Autoscaler (VPA) - Bonus</h2>
        <p>
          HPA scales <strong>horizontally</strong> (more Pods). <strong>VPA</strong> scales
          <strong>vertically</strong> (bigger Pods by adjusting CPU/memory requests).
        </p>

        <Callout variant="neutral" title="When to Use VPA vs HPA">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <h4 style={{ color: '#22c55e' }}>HPA (More Pods)</h4>
              <ul style={{ fontSize: '0.9rem' }}>
                <li>Stateless workloads</li>
                <li>Web servers, APIs</li>
                <li>Variable load patterns</li>
                <li>Fast to scale</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#0ea5e9' }}>VPA (Bigger Pods)</h4>
              <ul style={{ fontSize: '0.9rem' }}>
                <li>Stateful workloads</li>
                <li>Databases, caches</li>
                <li>Single large instance</li>
                <li>Requires Pod restart</li>
              </ul>
            </div>
          </div>
        </Callout>

        <Callout variant="warning">
          <p>
            <strong>⚠️ Don't use HPA and VPA together on the same metric!</strong> They will fight
            each other. You can use them together if they target <em>different</em> metrics
            (e.g., HPA on requests/s, VPA on memory).
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Cluster Autoscaler - Bonus</h2>
        <p>
          HPA adds Pods, VPA resizes Pods. <strong>Cluster Autoscaler</strong> adds <strong>nodes</strong>
          when Pods are <code>Pending</code> due to insufficient cluster capacity.
        </p>

        <TermBox>
          <div style={{ color: '#64748b' }}># Cluster Autoscaler watches for Pending Pods</div>
          <div style={{ color: '#22c55e' }}>kubectl get pods</div>
          <div style={{ color: '#e2e8f0' }}>NAME          READY   STATUS    RESTARTS</div>
          <div style={{ color: '#ef4444' }}>web-app-xyz   0/1     Pending   0  # Insufficient CPU</div>
          <br />
          <div style={{ color: '#64748b' }}># Cluster Autoscaler adds a new node (cloud provider API)</div>
          <div style={{ color: '#0ea5e9' }}>kubectl get nodes</div>
          <div style={{ color: '#e2e8f0' }}>NAME     STATUS   AGE</div>
          <div style={{ color: '#e2e8f0' }}>node-1   Ready    10d</div>
          <div style={{ color: '#22c55e' }}>node-4   Ready    30s  # New node!</div>
        </TermBox>

        <Callout variant="info">
          <p>
            <strong>💡 Complete Autoscaling Stack:</strong> HPA scales Pods → Pods become Pending
            → Cluster Autoscaler adds nodes → Pods are scheduled. Works seamlessly together.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Debugging HPA</h2>

        <TermBox>
          <div style={{ color: '#64748b' }}># Check HPA status</div>
          <div style={{ color: '#22c55e' }}>kubectl get hpa</div>
          <div style={{ color: '#22c55e' }}>kubectl describe hpa web-app-hpa</div>
          <br />
          <div style={{ color: '#64748b' }}># View HPA events (scaling decisions)</div>
          <div style={{ color: '#0ea5e9' }}>kubectl get events --sort-by='.lastTimestamp' | grep HorizontalPodAutoscaler</div>
          <br />
          <div style={{ color: '#64748b' }}># Check if metrics are available</div>
          <div style={{ color: '#f59e0b' }}>kubectl top pods</div>
          <div style={{ color: '#f59e0b' }}>kubectl top nodes</div>
          <br />
          <div style={{ color: '#64748b' }}># View HPA controller logs</div>
          <div style={{ color: '#ef4444' }}>kubectl logs -n kube-system -l app=kube-controller-manager | grep -i hpa</div>
          <br />
          <div style={{ color: '#64748b' }}># Check metrics-server health</div>
          <div style={{ color: '#22c55e' }}>kubectl get apiservice v1beta1.metrics.k8s.io -o yaml</div>
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>Key Takeaways</h2>
        <ul>
          <li><strong>HPA</strong> automatically adjusts Pod replica count based on metrics</li>
          <li><strong>Requires metrics-server</strong> for CPU/memory-based scaling</li>
          <li>Scaling formula: <code>desiredReplicas = ceil(currentReplicas * currentMetric / targetMetric)</code></li>
          <li><strong>Multiple metrics:</strong> HPA picks the highest desired replica count</li>
          <li><strong>Custom metrics:</strong> Scale on requests/s, queue length, etc (via Prometheus Adapter)</li>
          <li><strong>Cooldown periods</strong> prevent flapping (default: 3 min scale-up, 5 min scale-down)</li>
          <li><strong>HPA scales Pods</strong>, not nodes (use Cluster Autoscaler for nodes)</li>
          <li><strong>VPA scales Pod size</strong> (vertical), HPA scales Pod count (horizontal)</li>
          <li>Always set <code>resources.requests</code> in Pod spec for HPA to work</li>
          <li><strong>Test under load</strong> to validate HPA behavior before production</li>
          <li>HPA works best for <strong>stateless, horizontally scalable</strong> workloads</li>
          <li>Don't use HPA on the same metric as VPA (they will fight)</li>
        </ul>
      </section>
    </ModuleShell>
  );
}
