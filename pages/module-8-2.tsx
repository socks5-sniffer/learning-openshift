import { useState } from 'react';
import styles from '../styles/Home.module.css';
import ModuleShell from '../components/module/ModuleShell';
import Callout from '../components/module/Callout';
import TermBox from '../components/module/TermBox';

const services = {
  frontend: { name: 'Frontend Service', color: '#3b82f6', metrics: { cpu: [45, 52, 48, 65, 72, 68, 55, 50, 58, 62], memory: [1.2, 1.3, 1.25, 1.5, 1.6, 1.55, 1.4, 1.35, 1.45, 1.5], requests: [120, 145, 180, 220, 250, 230, 190, 160, 175, 200], errors: [2, 1, 3, 5, 4, 2, 1, 2, 3, 2] } },
  backend: { name: 'Backend API', color: '#10b981', metrics: { cpu: [65, 70, 75, 82, 88, 85, 78, 72, 68, 75], memory: [2.1, 2.3, 2.5, 2.8, 3.0, 2.9, 2.6, 2.4, 2.5, 2.7], requests: [450, 520, 600, 680, 720, 690, 620, 580, 610, 650], errors: [5, 8, 12, 15, 18, 14, 10, 8, 9, 11] } },
  database: { name: 'PostgreSQL', color: '#8b5cf6', metrics: { cpu: [30, 35, 38, 42, 45, 43, 40, 36, 38, 40], memory: [3.5, 3.6, 3.7, 3.9, 4.0, 3.95, 3.8, 3.7, 3.75, 3.85], requests: [850, 920, 1000, 1100, 1150, 1120, 1050, 980, 1020, 1080], errors: [0, 1, 0, 2, 1, 0, 1, 0, 0, 1] } },
};

const metricInfo = {
  cpu: { name: 'CPU Usage', unit: '%', icon: '📊', description: 'Percentage of CPU cores being used', goodRange: '< 70%', warningRange: '70-85%', criticalRange: '> 85%' },
  memory: { name: 'Memory Usage', unit: 'GB', icon: '💾', description: 'RAM consumption in gigabytes', goodRange: '< 75%', warningRange: '75-90%', criticalRange: '> 90%' },
  requests: { name: 'Request Rate', unit: 'req/s', icon: '🔄', description: 'HTTP requests per second', goodRange: 'Steady', warningRange: 'Spiking', criticalRange: 'Dropping to 0' },
  errors: { name: 'Error Rate', unit: 'errors/min', icon: '⚠️', description: 'Number of errors per minute', goodRange: '< 1%', warningRange: '1-5%', criticalRange: '> 5%' },
};

const metricTypes = [
  { type: 'Counter', description: 'Only goes up. Reset to zero on restart. Use for: requests, errors, bytes sent.', example: 'http_requests_total (counter) → 1543', color: '#3b82f6' },
  { type: 'Gauge', description: 'Can go up or down. Use for: current CPU, memory, connections, queue size.', example: 'memory_usage_bytes (gauge) → 1234567890', color: '#10b981' },
  { type: 'Histogram', description: 'Observations in buckets. Use for: request duration, response size.', example: 'http_request_duration_seconds_bucket{le="0.5"} → 924', color: '#f59e0b' },
  { type: 'Summary', description: 'Like histogram but calculates percentiles on client. Use for: latency.', example: 'http_request_duration_seconds{quantile="0.95"} → 0.245', color: '#8b5cf6' },
];

const goldenSignals = [
  { signal: 'Latency', description: 'How long does a request take? Measure both successful and failed requests separately.', why: 'A slow 200 OK is worse than a fast 500 for UX. Track p50, p95, p99.', alert: 'p95 latency > 500ms for 5 minutes', color: '#3b82f6' },
  { signal: 'Traffic', description: 'How much demand is your service getting? Requests per second, transactions per second.', why: 'Sudden drops = something broke. Sudden spikes = attack or viral content.', alert: 'Traffic drops by 50% in 5 minutes', color: '#10b981' },
  { signal: 'Errors', description: 'Rate of failed requests. HTTP 5xx, exceptions, failed DB queries.', why: 'Even 0.1% error rate can mean thousands of angry users.', alert: 'Error rate > 1% for 2 minutes', color: '#ef4444' },
  { signal: 'Saturation', description: 'How "full" is your service? CPU, memory, disk, network, connection pools.', why: 'At 100% saturation, your service stops working. Alert before that.', alert: 'CPU > 80% for 10 minutes', color: '#f59e0b' },
];

const severities = [
  { level: 'Critical', color: '#ef4444', action: 'Page on-call engineer immediately', examples: 'Service down, data loss, security breach, payment processing broken', response: 'Drop everything and fix now' },
  { level: 'Warning', color: '#f59e0b', action: 'Slack notification to team channel', examples: 'Error rate elevated, latency increasing, disk at 85%, high memory', response: 'Investigate during business hours' },
  { level: 'Info', color: '#3b82f6', action: 'Dashboard or log only, no notification', examples: 'Deployment completed, Pod restarted, autoscaler triggered, cache cleared', response: 'FYI, no action needed' },
];

const tools = [
  { tool: 'Prometheus + Grafana', description: 'Open-source standard. Prometheus scrapes metrics, Grafana visualizes them.', pros: 'Free, powerful, huge community', cons: 'Setup complexity, scaling challenges', color: '#f59e0b' },
  { tool: 'Datadog', description: 'SaaS monitoring platform. Agent on each node, beautiful dashboards.', pros: 'Zero config, gorgeous UI, APM included', cons: 'Expensive ($$$), vendor lock-in', color: '#8b5cf6' },
  { tool: 'New Relic', description: 'Application Performance Monitoring (APM) with infrastructure monitoring.', pros: 'Deep insights, traces, easy setup', cons: 'Pricey, complex pricing model', color: '#10b981' },
  { tool: 'CloudWatch (AWS)', description: 'Native AWS monitoring. Auto-collects EC2, EKS, RDS metrics.', pros: 'Built-in, no agents, integrates with AWS', cons: 'AWS-only, limited PromQL support', color: '#3b82f6' },
];

export default function Module82() {
  const [selectedMetric, setSelectedMetric] = useState<keyof typeof metricInfo>('cpu');
  const [selectedService, setSelectedService] = useState<keyof typeof services>('frontend');
  const [alertThreshold, setAlertThreshold] = useState(80);
  const [enableAlert, setEnableAlert] = useState(false);

  const data = services[selectedService].metrics[selectedMetric];
  const current = data[data.length - 1];
  const isAlerting = enableAlert && (selectedMetric === 'cpu' || selectedMetric === 'memory') && current > alertThreshold;

  const renderChart = () => {
    const max = Math.max(...data);
    const height = 200;
    return (
      <div style={{ position: 'relative', height, background: '#0f172a', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
        <svg width="100%" height={height - 32} style={{ position: 'relative' }}>
          {[0, 25, 50, 75, 100].map((p) => (
            <line key={p} x1="0" y1={(height - 32) * (1 - p / 100)} x2="100%" y2={(height - 32) * (1 - p / 100)} stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />
          ))}
          <polyline points={data.map((v, idx) => `${(idx / (data.length - 1)) * 100}%,${(1 - v / max) * (height - 32)}`).join(' ')} fill="none" stroke={services[selectedService].color} strokeWidth="3" />
          {data.map((v, idx) => (
            <circle key={idx} cx={`${(idx / (data.length - 1)) * 100}%`} cy={(1 - v / max) * (height - 32)} r="4" fill={services[selectedService].color} />
          ))}
          {enableAlert && (selectedMetric === 'cpu' || selectedMetric === 'memory') && (
            <line x1="0" y1={(height - 32) * (1 - alertThreshold / max)} x2="100%" y2={(height - 32) * (1 - alertThreshold / max)} stroke="#ef4444" strokeWidth="2" strokeDasharray="8,4" />
          )}
        </svg>
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: services[selectedService].color, color: 'white', padding: '0.5rem 1rem', borderRadius: 6, fontWeight: 600, fontSize: '1.2rem' }}>
          {current}{metricInfo[selectedMetric].unit}
        </div>
      </div>
    );
  };

  return (
    <ModuleShell id="8-2" subtitle="Part 8: Observability & Debugging">
      <section className={styles.spotlight}>
        <h2>📈 Interactive Metrics Dashboard</h2>
        <p>
          Logs tell you what happened. Metrics tell you how healthy your system is right now.
          CPU, memory, request rates, error rates—these are the vital signs. Prometheus is
          the de facto standard for collecting and querying these metrics in Kubernetes.
        </p>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Select Service</label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {(Object.keys(services) as Array<keyof typeof services>).map((service) => (
              <button key={service} onClick={() => setSelectedService(service)}
                style={{ padding: '0.75rem 1.5rem', background: selectedService === service ? services[service].color : 'var(--color-bg-secondary)', color: selectedService === service ? 'white' : 'var(--color-text-primary)', border: selectedService === service ? 'none' : '1px solid var(--color-border)', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                {services[service].name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Select Metric</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
            {(Object.keys(metricInfo) as Array<keyof typeof metricInfo>).map((metric) => (
              <button key={metric} onClick={() => setSelectedMetric(metric)}
                style={{ padding: '1rem', background: selectedMetric === metric ? 'var(--color-primary)' : 'var(--color-bg-secondary)', color: selectedMetric === metric ? 'white' : 'var(--color-text-primary)', border: selectedMetric === metric ? 'none' : '1px solid var(--color-border)', borderRadius: 8, cursor: 'pointer', fontWeight: 600, textAlign: 'left' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{metricInfo[metric].icon}</div>
                <div style={{ fontSize: '0.875rem' }}>{metricInfo[metric].name}</div>
              </button>
            ))}
          </div>
        </div>

        {renderChart()}

        <div style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ marginTop: 0 }}>{metricInfo[selectedMetric].icon} {metricInfo[selectedMetric].name}</h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>{metricInfo[selectedMetric].description}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Good</div>
              <div style={{ color: '#22c55e', fontWeight: 600 }}>{metricInfo[selectedMetric].goodRange}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Warning</div>
              <div style={{ color: '#f59e0b', fontWeight: 600 }}>{metricInfo[selectedMetric].warningRange}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Critical</div>
              <div style={{ color: '#ef4444', fontWeight: 600 }}>{metricInfo[selectedMetric].criticalRange}</div>
            </div>
          </div>
        </div>

        {(selectedMetric === 'cpu' || selectedMetric === 'memory') && (
          <div style={{ background: 'var(--color-bg-elevated)', border: `2px solid ${isAlerting ? '#ef4444' : 'var(--color-border)'}`, borderRadius: 8, padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ margin: 0 }}>🚨 Alert Configuration</h3>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" checked={enableAlert} onChange={(e) => setEnableAlert(e.target.checked)} style={{ marginRight: '0.5rem', width: 18, height: 18, cursor: 'pointer' }} />
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Enable Alert</span>
              </label>
            </div>

            {enableAlert && (
              <>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Alert Threshold: {alertThreshold}{metricInfo[selectedMetric].unit}
                </label>
                <input type="range" min="50" max="100" value={alertThreshold} onChange={(e) => setAlertThreshold(Number(e.target.value))} style={{ width: '100%', marginBottom: '1rem' }} />
                {isAlerting && (
                  <div style={{ background: '#ef4444', color: 'white', padding: '1rem', borderRadius: 6, fontWeight: 600, marginTop: '1rem' }}>
                    🚨 ALERT: {metricInfo[selectedMetric].name} is {current}{metricInfo[selectedMetric].unit}, exceeding threshold of {alertThreshold}{metricInfo[selectedMetric].unit}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </section>

      <section className={styles.spotlight}>
        <h2>📊 Prometheus Basics</h2>
        <p>
          Prometheus is an open-source monitoring system that scrapes metrics from targets (your apps),
          stores them in a time-series database, and lets you query them with PromQL. It's the standard
          in Kubernetes because it understands Pods, Services, and Namespaces natively.
        </p>

        <h3>How Prometheus Works</h3>
        <TermBox copyable={false}>
          <pre style={{ margin: 0 }}>{`┌────────────────────────────────────────────────┐
│              Your Application                   │
│  App exposes metrics at /metrics                │
│    http_requests_total{path="/api"} 1543        │
│    cpu_usage_percent 72.5                        │
│    memory_bytes 1234567890                       │
└─────────────────┬──────────────────────────────┘
                  │ Scrapes every 15s
                  ↓
      ┌───────────────────────┐
      │    Prometheus Server   │
      │  1. Scrapes targets    │
      │  2. Stores metrics     │
      │  3. Evaluates alerts   │
      │  4. Serves PromQL API  │
      └───────────┬───────────┘
                  ↓
      ┌───────────────────────┐
      │       Grafana         │
      │  (Visualization)      │
      └───────────────────────┘`}</pre>
        </TermBox>

        <h3>Metric Types</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {metricTypes.map((m, idx) => (
            <div key={idx} style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderLeft: `4px solid ${m.color}`, borderRadius: 8, padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', marginTop: 0 }}>{m.type}</h4>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>{m.description}</p>
              <div style={{ background: '#0f172a', borderRadius: 6, padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.875rem', color: m.color }}>{m.example}</div>
            </div>
          ))}
        </div>

        <h3>Common PromQL Queries</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># Current CPU usage for a Pod</div>
          <div style={{ color: '#10b981' }}>rate(container_cpu_usage_seconds_total{'{'}pod="frontend-abc"{'}'}[5m])</div>
          <br />
          <div style={{ color: '#64748b' }}># Memory usage in GB</div>
          <div style={{ color: '#10b981' }}>container_memory_usage_bytes{'{'}pod="backend-xyz"{'}'} / 1024 / 1024 / 1024</div>
          <br />
          <div style={{ color: '#64748b' }}># Request rate (requests per second)</div>
          <div style={{ color: '#10b981' }}>rate(http_requests_total[5m])</div>
          <br />
          <div style={{ color: '#64748b' }}># Error rate (percentage)</div>
          <div style={{ color: '#10b981' }}>rate(http_requests_total{'{'}status=~"5.."{'}'}[5m]) / rate(http_requests_total[5m]) * 100</div>
          <br />
          <div style={{ color: '#64748b' }}># 95th percentile latency</div>
          <div style={{ color: '#10b981' }}>histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))</div>
          <br />
          <div style={{ color: '#64748b' }}># Pods using more than 1GB memory</div>
          <div style={{ color: '#10b981' }}>container_memory_usage_bytes &gt; 1073741824</div>
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>🎯 The Four Golden Signals (Google SRE)</h2>
        <p>
          Google's SRE book recommends monitoring these four metrics for every service. If you monitor
          nothing else, monitor these. They tell you everything you need to know about user experience.
        </p>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {goldenSignals.map((s, idx) => (
            <div key={idx} style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: s.color }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 600, margin: 0 }}>{s.signal}</h3>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}><strong>What:</strong> {s.description}</p>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}><strong>Why:</strong> {s.why}</p>
              <div style={{ background: s.color, color: 'white', padding: '0.75rem', borderRadius: 6, fontFamily: 'monospace', fontSize: '0.875rem' }}>🚨 Example Alert: {s.alert}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>🚨 What to Alert On (and What Not To)</h2>
        <p>
          Alert fatigue is real. Too many alerts and you'll ignore them all. The goal is:
          <strong> Only alert on things that require immediate human action.</strong>
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#22c55e', marginBottom: '1rem' }}>✓ DO Alert On</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Service is completely down', 'Error rate > 5% for 5 minutes', 'p99 latency > 2 seconds', 'Disk usage > 90%', 'SSL certificate expiring in 7 days', 'Database replication lag > 1 minute', 'Payment processing failing'].map((item, idx) => (
                <div key={idx} style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: 6, padding: '0.75rem', color: 'var(--color-text-primary)' }}>{item}</div>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ef4444', marginBottom: '1rem' }}>✗ DON'T Alert On</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Single request failed (noise)', 'CPU briefly spiked to 90%', 'One Pod restarted (Kubernetes handles it)', 'Disk usage > 50% (too early)', 'p50 latency increased 10ms', 'Non-critical background job failed', 'INFO level log line appeared'].map((item, idx) => (
                <div key={idx} style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.4)', borderRadius: 6, padding: '0.75rem', color: 'var(--color-text-primary)' }}>{item}</div>
              ))}
            </div>
          </div>
        </div>

        <Callout variant="warning" title="The Golden Rule of Alerting">
          <p>
            <strong>Every alert should be actionable.</strong> If you can't do anything about it at 3am,
            don't wake someone up for it. Use dashboards for awareness, alerts for emergencies.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>📢 Alert Severity Levels</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {severities.map((s, idx) => (
            <div key={idx} style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderLeft: `6px solid ${s.color}`, borderRadius: 8, padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ background: s.color, color: 'white', padding: '0.5rem 1rem', borderRadius: 6, fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase' }}>{s.level}</div>
                <div style={{ color: 'var(--color-text-secondary)', flex: 1 }}>{s.action}</div>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}><strong>Examples:</strong> {s.examples}</p>
              <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}><strong>Response:</strong> {s.response}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>🛠️ Popular Monitoring Tools</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {tools.map((t, idx) => (
            <div key={idx} style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderLeft: `4px solid ${t.color}`, borderRadius: 8, padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', marginTop: 0 }}>{t.tool}</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>{t.description}</p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 150 }}>
                  <div style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 600, marginBottom: '0.25rem' }}>PROS</div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{t.pros}</div>
                </div>
                <div style={{ flex: 1, minWidth: 150 }}>
                  <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600, marginBottom: '0.25rem' }}>CONS</div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{t.cons}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </ModuleShell>
  );
}
