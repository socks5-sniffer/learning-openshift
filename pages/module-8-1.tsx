import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import ModuleShell from '../components/module/ModuleShell';
import Callout from '../components/module/Callout';
import TermBox from '../components/module/TermBox';

const apps = {
  frontend: {
    name: 'Frontend (React)', color: '#3b82f6',
    logs: {
      debug: ['[DEBUG] Component mounted: UserProfile', '[DEBUG] State updated: isLoading=false', '[DEBUG] Cache hit for user/123'],
      info: ['[INFO] User logged in: user@example.com', '[INFO] API request: GET /api/users/123', '[INFO] Page rendered: /dashboard'],
      warn: ['[WARN] Slow API response: 2.5s', '[WARN] Deprecated prop used: legacyMode', '[WARN] High memory usage: 85%'],
      error: ['[ERROR] Failed to fetch user data: 500', '[ERROR] Uncaught exception: Cannot read property', '[ERROR] Network timeout after 30s'],
    },
  },
  backend: {
    name: 'Backend (Node.js)', color: '#10b981',
    logs: {
      debug: ['[DEBUG] Database query: SELECT * FROM users', '[DEBUG] Cache miss: user:123', '[DEBUG] Middleware executed: auth'],
      info: ['[INFO] Server started on port 3000', '[INFO] Request: POST /api/orders', '[INFO] Database connection established'],
      warn: ['[WARN] Connection pool at 80% capacity', '[WARN] Rate limit approaching: 950/1000', '[WARN] Old API version used: v1'],
      error: ['[ERROR] Database connection lost', '[ERROR] Authentication failed: invalid token', '[ERROR] Unhandled promise rejection'],
    },
  },
  database: {
    name: 'Database (PostgreSQL)', color: '#8b5cf6',
    logs: {
      debug: ['[DEBUG] Query plan: Seq Scan on users', '[DEBUG] Index used: idx_user_email', '[DEBUG] Vacuum started on table orders'],
      info: ['[INFO] Database ready to accept connections', '[INFO] Checkpoint completed', '[INFO] Connection received: 10.0.1.5'],
      warn: ['[WARN] Long-running query: 5.2s', '[WARN] Disk usage at 75%', '[WARN] Too many connections: 95/100'],
      error: ['[ERROR] Could not write to disk: no space', '[ERROR] Deadlock detected', '[ERROR] Corruption detected in table'],
    },
  },
};

const loggingPatterns = {
  sidecar: { name: 'Sidecar Pattern', description: 'Separate container in Pod reads app logs and forwards to aggregator', pros: ['App-agnostic', 'No code changes', 'Easy to update logging config'], cons: ['Extra container per Pod', 'More resource usage', 'Network overhead'], useCase: "When you can't modify application code" },
  daemonset: { name: 'DaemonSet Pattern', description: 'One logging agent per node collects from all containers', pros: ['Resource efficient', 'Node-level insights', 'Centralized per node'], cons: ['Node failure = lost logs', 'Harder to scale', 'Complex routing'], useCase: 'Cost-effective for large clusters' },
  direct: { name: 'Direct Shipping', description: 'Application sends logs directly to logging backend', pros: ['Lowest latency', 'No intermediaries', 'Guaranteed delivery'], cons: ['Tight coupling', 'App complexity', 'Network dependency'], useCase: "Critical business logs that can't be lost" },
};

const diagrams: Record<keyof typeof loggingPatterns, string> = {
  sidecar: `
┌─────────────────────────────────────────┐
│              Pod                         │
│  ┌─────────────────┐  ┌──────────────┐  │
│  │   App Container │  │   Fluentd    │  │
│  │  stdout/stderr ─┼─→│   Sidecar    │  │
│  └─────────────────┘  └──────┼───────┘  │
└───────────────────────────────┼──────────┘
                                ↓
                      Elasticsearch / Loki`,
  daemonset: `
┌─────────────────────────────────────────────────┐
│                    Node                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Pod A    │  │ Pod B    │  │ Pod C    │       │
│  │ stdout   │  │ stdout   │  │ stdout   │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       └─────────────┼─────────────┘              │
│                     ↓                             │
│              ┌──────────────┐                     │
│              │  Fluentd     │                     │
│              │  DaemonSet   │                     │
│              └──────┬───────┘                     │
└─────────────────────┼────────────────────────────┘
                      ↓
            Centralized Logging`,
  direct: `
┌────────────────────────────────────┐
│            Pod                      │
│  ┌──────────────────────┐          │
│  │   App Container      │          │
│  │  Winston / Logrus   ─┼──────────┼─→ Elasticsearch
│  │  with HTTP transport │          │   / Loki / Datadog
│  └──────────────────────┘          │
└────────────────────────────────────┘`,
};

const stacks = [
  { name: 'ELK Stack', components: 'Elasticsearch + Logstash + Kibana', description: 'The OG. Powerful search, beautiful dashboards, resource hungry.', color: '#f59e0b' },
  { name: 'EFK Stack', components: 'Elasticsearch + Fluentd + Kibana', description: 'Replaces Logstash with Fluentd. More Kubernetes-native.', color: '#3b82f6' },
  { name: 'PLG Stack', components: 'Promtail + Loki + Grafana', description: 'Lightweight, cost-effective. Logs are indexed by labels, not content.', color: '#10b981' },
  { name: 'CloudWatch Logs', components: 'AWS CloudWatch + Fluent Bit', description: 'Fully managed, integrates with AWS services. Pay per GB ingested.', color: '#8b5cf6' },
];

const practices = [
  { title: 'Use Structured Logging', description: 'JSON > plain text. Makes parsing, filtering, and aggregation trivial.', example: '{"level":"error","msg":"DB timeout","user_id":123,"duration_ms":5000}' },
  { title: 'Include Context', description: 'request_id, user_id, trace_id help correlate logs across services.', example: 'Every log line in a request should share the same request_id' },
  { title: 'Log Levels Matter', description: 'DEBUG for development, INFO for production events, WARN for issues, ERROR for failures.', example: "Don't log DEBUG in production unless you hate your log bill" },
  { title: "Don't Log Secrets", description: 'Never log passwords, tokens, API keys, or PII. Redact them.', example: 'Log "user authenticated" not "user logged in with password: hunter2"' },
  { title: 'Keep It Brief', description: "Logs cost money. Don't log every single thing. High-cardinality data kills.", example: 'Log "payment processed" not the entire 5KB payment JSON' },
  { title: 'Use Correlation IDs', description: 'Trace requests across microservices with a shared ID.', example: 'X-Request-ID header passed through all services' },
];

export default function Module81() {
  const [selectedApp, setSelectedApp] = useState<keyof typeof apps>('frontend');
  const [logLevel, setLogLevel] = useState<'debug' | 'info' | 'warn' | 'error'>('info');
  const [showStructured, setShowStructured] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<keyof typeof loggingPatterns>('sidecar');
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const levelColor = (l: string) => (l === 'error' ? '#ef4444' : l === 'warn' ? '#f59e0b' : l === 'info' ? '#10b981' : '#64748b');

  const getStructuredLog = (log: string) => {
    const match = log.match(/\[(.*?)\](.*)/);
    if (!match) return log;
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level: match[1],
      message: match[2].trim(),
      service: apps[selectedApp].name,
      pod: `${selectedApp}-7b8f9d-xk2p9`,
      node: 'worker-01',
      trace_id: '4bf92f3577b34da6a3ce929d0e0e4736',
    }, null, 2);
  };

  const pat = loggingPatterns[selectedPattern];

  return (
    <ModuleShell id="8-1" subtitle="Part 8: Observability & Debugging">
      <section className={styles.spotlight}>
        <h2>📊 Interactive Log Viewer</h2>
        <p>
          In Kubernetes, containers write to stdout/stderr. That's it. No log files to manage,
          no rotation policies, no disk to fill up. Just print to the console and let the platform
          handle the rest. Simple, elegant, and surprisingly powerful.
        </p>

        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Select Application</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(Object.keys(apps) as Array<keyof typeof apps>).map((app) => (
                <button
                  key={app}
                  onClick={() => setSelectedApp(app)}
                  style={{
                    padding: '0.75rem',
                    background: selectedApp === app ? apps[app].color : 'var(--color-bg-secondary)',
                    color: selectedApp === app ? 'white' : 'var(--color-text-primary)',
                    border: selectedApp === app ? 'none' : '1px solid var(--color-border)',
                    borderRadius: 8, cursor: 'pointer', fontWeight: 600,
                  }}
                >
                  {apps[app].name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Log Level</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(['debug', 'info', 'warn', 'error'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setLogLevel(level)}
                  style={{
                    padding: '0.75rem',
                    background: logLevel === level ? levelColor(level) : 'var(--color-bg-secondary)',
                    color: logLevel === level ? 'white' : 'var(--color-text-primary)',
                    border: logLevel === level ? 'none' : '1px solid var(--color-border)',
                    borderRadius: 8, cursor: 'pointer', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.875rem',
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: 'fit-content' }}>
            <input type="checkbox" checked={showStructured} onChange={(e) => setShowStructured(e.target.checked)} style={{ marginRight: '0.5rem', width: 18, height: 18, cursor: 'pointer' }} />
            <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Show Structured JSON Format</span>
          </label>
        </div>

        <div style={{ background: '#0f172a', borderRadius: 8, padding: '1.5rem', fontFamily: 'monospace', fontSize: '0.875rem', color: '#e2e8f0', overflowX: 'auto', maxHeight: 400, overflowY: 'auto' }}>
          {apps[selectedApp].logs[logLevel].map((log, idx) => (
            <div key={idx} style={{ marginBottom: '0.5rem' }}>
              {showStructured ? (
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{getStructuredLog(log)}</pre>
              ) : (
                <div>
                  <span style={{ color: '#64748b' }}>{mounted ? new Date().toISOString() : ''}</span>{' '}
                  <span style={{ color: apps[selectedApp].color }}>[{apps[selectedApp].name}]</span>{' '}
                  {log}
                </div>
              )}
            </div>
          ))}
        </div>

        <Callout variant="warning" title="Why Structured Logs?">
          <p>
            JSON logs can be parsed, filtered, and aggregated by log aggregators like Elasticsearch, Loki, or CloudWatch.
            Plain text is for humans, JSON is for machines (and the machines are doing the searching).
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>🖥️ The stdout/stderr Philosophy</h2>

        <h3>Why No Log Files?</h3>
        <p>
          In traditional deployments, apps write to /var/log/app.log. You need log rotation,
          disk monitoring, backup strategies, and SSH access to read them. In containers, that's all gone:
        </p>
        <ul>
          <li><strong>Containers are ephemeral</strong> - Logs in the filesystem die with the container</li>
          <li><strong>stdout is universal</strong> - Every language can print to stdout (console.log, print, echo)</li>
          <li><strong>Kubernetes captures it</strong> - kubectl logs reads what your app prints</li>
          <li><strong>No special libraries</strong> - No need for log4j, winston, or complex configs</li>
        </ul>

        <Callout variant="neutral" title="The Rule">
          <p><strong style={{ color: '#22c55e' }}>✓ stdout</strong> — Normal operational logs, info, debug messages</p>
          <p><strong style={{ color: '#ef4444' }}>✗ stderr</strong> — Errors, warnings, exceptions, stack traces</p>
        </Callout>

        <TermBox>
          <div style={{ color: '#64748b' }}># Node.js example</div>
          <div style={{ color: '#10b981' }}>console.log('Server started on port 3000'); // stdout</div>
          <div style={{ color: '#ef4444' }}>console.error('Database connection failed'); // stderr</div>
          <br />
          <div style={{ color: '#64748b' }}># Python example</div>
          <div style={{ color: '#10b981' }}>print('Processing request...') # stdout</div>
          <div style={{ color: '#ef4444' }}>print('Error:', e, file=sys.stderr) # stderr</div>
          <br />
          <div style={{ color: '#64748b' }}># Go example</div>
          <div style={{ color: '#10b981' }}>fmt.Println("Service ready") // stdout</div>
          <div style={{ color: '#ef4444' }}>fmt.Fprintln(os.Stderr, "Panic!") // stderr</div>
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>🏗️ Centralized Logging Patterns</h2>
        <p>
          Your apps print to stdout, but where do those logs actually go? kubectl logs only shows
          what's currently in the container. If it restarts, logs are gone. You need centralized logging.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {(Object.keys(loggingPatterns) as Array<keyof typeof loggingPatterns>).map((pattern) => (
            <button
              key={pattern}
              onClick={() => setSelectedPattern(pattern)}
              style={{
                padding: '0.75rem 1.5rem',
                background: selectedPattern === pattern ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
                color: selectedPattern === pattern ? 'white' : 'var(--color-text-primary)',
                border: selectedPattern === pattern ? 'none' : '1px solid var(--color-border)',
                borderRadius: 8, cursor: 'pointer', fontWeight: 600,
              }}
            >
              {loggingPatterns[pattern].name}
            </button>
          ))}
        </div>

        <Callout variant="neutral" title={pat.name}>
          <p>{pat.description}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <h4 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '0.5rem' }}>Pros</h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>{pat.pros.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>
            <div>
              <h4 style={{ color: '#ef4444', fontSize: '1rem', marginBottom: '0.5rem' }}>Cons</h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>{pat.cons.map((c, i) => <li key={i}>{c}</li>)}</ul>
            </div>
          </div>
          <p><strong>Use Case:</strong> {pat.useCase}</p>
        </Callout>

        <TermBox copyable={false}>
          <pre style={{ margin: 0 }}>{diagrams[selectedPattern]}</pre>
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>🛠️ Popular Logging Stacks</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {stacks.map((stack, idx) => (
            <div key={idx} style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderLeft: `4px solid ${stack.color}`, borderRadius: 8, padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', marginTop: 0 }}>{stack.name}</h3>
              <div style={{ color: stack.color, fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{stack.components}</div>
              <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>{stack.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>✅ Logging Best Practices</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {practices.map((practice, idx) => (
            <div key={idx} style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', marginTop: 0 }}>{practice.title}</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>{practice.description}</p>
              <div style={{ background: '#0f172a', borderRadius: 6, padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.875rem', color: '#10b981' }}>💡 {practice.example}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>⚡ Essential kubectl logs Commands</h2>
        <TermBox>
          <div style={{ color: '#64748b' }}># View logs from a Pod</div>
          <div style={{ color: '#10b981' }}>kubectl logs frontend-7b8f9d-xk2p9</div>
          <br />
          <div style={{ color: '#64748b' }}># Follow logs in real-time (like tail -f)</div>
          <div style={{ color: '#10b981' }}>kubectl logs -f frontend-7b8f9d-xk2p9</div>
          <br />
          <div style={{ color: '#64748b' }}># Logs from specific container in multi-container Pod</div>
          <div style={{ color: '#10b981' }}>kubectl logs frontend-7b8f9d-xk2p9 -c app-container</div>
          <br />
          <div style={{ color: '#64748b' }}># Logs from previous crashed container</div>
          <div style={{ color: '#10b981' }}>kubectl logs frontend-7b8f9d-xk2p9 --previous</div>
          <br />
          <div style={{ color: '#64748b' }}># Last 100 lines</div>
          <div style={{ color: '#10b981' }}>kubectl logs frontend-7b8f9d-xk2p9 --tail=100</div>
          <br />
          <div style={{ color: '#64748b' }}># Logs since 1 hour ago</div>
          <div style={{ color: '#10b981' }}>kubectl logs frontend-7b8f9d-xk2p9 --since=1h</div>
          <br />
          <div style={{ color: '#64748b' }}># Logs from all Pods with label</div>
          <div style={{ color: '#10b981' }}>kubectl logs -l app=frontend</div>
          <br />
          <div style={{ color: '#64748b' }}># Logs with timestamps</div>
          <div style={{ color: '#10b981' }}>kubectl logs frontend-7b8f9d-xk2p9 --timestamps</div>
        </TermBox>

        <Callout variant="warning" title="⚠️ Remember">
          <p>
            kubectl logs only shows logs that are currently in the container. If the Pod restarts,
            you lose them unless you have centralized logging. Always use --previous to see logs
            from the crashed container.
          </p>
        </Callout>
      </section>
    </ModuleShell>
  );
}
