import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import ModuleCompletion from '../components/ModuleCompletion';

export default function Logging() {
  const [selectedApp, setSelectedApp] = useState<'frontend' | 'backend' | 'database'>('frontend')
  const [logLevel, setLogLevel] = useState<'debug' | 'info' | 'warn' | 'error'>('info')
  const [showStructured, setShowStructured] = useState(false)
  const [selectedPattern, setSelectedPattern] = useState<'sidecar' | 'daemonset' | 'direct'>('sidecar')

  const apps = {
    frontend: {
      name: 'Frontend (React)',
      color: '#3b82f6',
      logs: {
        debug: ['[DEBUG] Component mounted: UserProfile', '[DEBUG] State updated: isLoading=false', '[DEBUG] Cache hit for user/123'],
        info: ['[INFO] User logged in: user@example.com', '[INFO] API request: GET /api/users/123', '[INFO] Page rendered: /dashboard'],
        warn: ['[WARN] Slow API response: 2.5s', '[WARN] Deprecated prop used: legacyMode', '[WARN] High memory usage: 85%'],
        error: ['[ERROR] Failed to fetch user data: 500', '[ERROR] Uncaught exception: Cannot read property', '[ERROR] Network timeout after 30s']
      }
    },
    backend: {
      name: 'Backend (Node.js)',
      color: '#10b981',
      logs: {
        debug: ['[DEBUG] Database query: SELECT * FROM users', '[DEBUG] Cache miss: user:123', '[DEBUG] Middleware executed: auth'],
        info: ['[INFO] Server started on port 3000', '[INFO] Request: POST /api/orders', '[INFO] Database connection established'],
        warn: ['[WARN] Connection pool at 80% capacity', '[WARN] Rate limit approaching: 950/1000', '[WARN] Old API version used: v1'],
        error: ['[ERROR] Database connection lost', '[ERROR] Authentication failed: invalid token', '[ERROR] Unhandled promise rejection']
      }
    },
    database: {
      name: 'Database (PostgreSQL)',
      color: '#8b5cf6',
      logs: {
        debug: ['[DEBUG] Query plan: Seq Scan on users', '[DEBUG] Index used: idx_user_email', '[DEBUG] Vacuum started on table orders'],
        info: ['[INFO] Database ready to accept connections', '[INFO] Checkpoint completed', '[INFO] Connection received: 10.0.1.5'],
        warn: ['[WARN] Long-running query: 5.2s', '[WARN] Disk usage at 75%', '[WARN] Too many connections: 95/100'],
        error: ['[ERROR] Could not write to disk: no space', '[ERROR] Deadlock detected', '[ERROR] Corruption detected in table']
      }
    }
  }

  const loggingPatterns = {
    sidecar: {
      name: 'Sidecar Pattern',
      description: 'Separate container in Pod reads app logs and forwards to aggregator',
      pros: ['App-agnostic', 'No code changes', 'Easy to update logging config'],
      cons: ['Extra container per Pod', 'More resource usage', 'Network overhead'],
      useCase: 'When you can\'t modify application code'
    },
    daemonset: {
      name: 'DaemonSet Pattern',
      description: 'One logging agent per node collects from all containers',
      pros: ['Resource efficient', 'Node-level insights', 'Centralized per node'],
      cons: ['Node failure = lost logs', 'Harder to scale', 'Complex routing'],
      useCase: 'Cost-effective for large clusters'
    },
    direct: {
      name: 'Direct Shipping',
      description: 'Application sends logs directly to logging backend',
      pros: ['Lowest latency', 'No intermediaries', 'Guaranteed delivery'],
      cons: ['Tight coupling', 'App complexity', 'Network dependency'],
      useCase: 'Critical business logs that can\'t be lost'
    }
  }

  const getCurrentLogs = () => {
    const app = apps[selectedApp]
    return app.logs[logLevel]
  }

  const getStructuredLog = (log: string) => {
    const timestamp = new Date().toISOString()
    const match = log.match(/\[(.*?)\](.*)/)
    if (!match) return log

    const level = match[1]
    const message = match[2].trim()

    return JSON.stringify({
      timestamp,
      level,
      message,
      service: apps[selectedApp].name,
      pod: `${selectedApp}-7b8f9d-xk2p9`,
      node: 'worker-01',
      trace_id: '4bf92f3577b34da6a3ce929d0e0e4736'
    }, null, 2)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>8.1 Logging - Kubernetes Learning</title>
      </Head>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/learning-modules" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem' }}>← Back to Learning Modules</Link>
        </div>

        <div style={{ 
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'inline-block',
            background: '#9c0606',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: 6,
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '1rem'
          }}>
            Part 8: Observability & Debugging
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>
            8.1 Logging
          </h1>
          <div style={{ marginBottom: '1.5rem' }}>
            <Link href="/module-7-3" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>← Previous: Network Policies</Link>
            <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
            <Link href="/learning-modules" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>All Modules</Link>
            <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
            <Link href="/module-8-2" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>Next: Metrics & Monitoring →</Link>
          </div>
          <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.6 }}>
            In Kubernetes, containers write to stdout/stderr. That's it. No log files to manage,
            no rotation policies, no disk to fill up. Just print to the console and let the platform
            handle the rest. Simple, elegant, and surprisingly powerful.
          </p>
        </div>

        {/* Interactive Log Viewer */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
            📊 Interactive Log Viewer
          </h2>

          <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {/* Application Selector */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#1e293b' }}>
                Select Application
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(Object.keys(apps) as Array<keyof typeof apps>).map(app => (
                  <button
                    key={app}
                    onClick={() => setSelectedApp(app)}
                    style={{
                      padding: '0.75rem',
                      background: selectedApp === app ? apps[app].color : '#f8fafc',
                      color: selectedApp === app ? 'white' : '#1e293b',
                      border: selectedApp === app ? 'none' : '2px solid #e2e8f0',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                  >
                    {apps[app].name}
                  </button>
                ))}
              </div>
            </div>

            {/* Log Level Selector */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#1e293b' }}>
                Log Level
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(['debug', 'info', 'warn', 'error'] as const).map(level => (
                  <button
                    key={level}
                    onClick={() => setLogLevel(level)}
                    style={{
                      padding: '0.75rem',
                      background: logLevel === level 
                        ? level === 'error' ? '#ef4444' 
                          : level === 'warn' ? '#f59e0b'
                          : level === 'info' ? '#10b981'
                          : '#64748b'
                        : '#f8fafc',
                      color: logLevel === level ? 'white' : '#1e293b',
                      border: logLevel === level ? 'none' : '2px solid #e2e8f0',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Structured Toggle */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: 'fit-content' }}>
              <input
                type="checkbox"
                checked={showStructured}
                onChange={(e) => setShowStructured(e.target.checked)}
                style={{ marginRight: '0.5rem', width: 18, height: 18, cursor: 'pointer' }}
              />
              <span style={{ fontWeight: 600, color: '#1e293b' }}>Show Structured JSON Format</span>
            </label>
          </div>

          {/* Log Output */}
          <div style={{
            background: '#1e293b',
            borderRadius: 8,
            padding: '1.5rem',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            color: '#e2e8f0',
            overflowX: 'auto',
            maxHeight: 400,
            overflowY: 'auto'
          }}>
            {getCurrentLogs().map((log, idx) => (
              <div key={idx} style={{ marginBottom: '0.5rem' }}>
                {showStructured ? (
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{getStructuredLog(log)}</pre>
                ) : (
                  <div>
                    <span style={{ color: '#64748b' }}>{new Date().toISOString()}</span>
                    {' '}
                    <span style={{ color: apps[selectedApp].color }}>[{apps[selectedApp].name}]</span>
                    {' '}
                    {log}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            background: '#fef3c7', 
            borderLeft: '4px solid #f59e0b',
            borderRadius: 4
          }}>
            <strong style={{ color: '#92400e' }}>Why Structured Logs?</strong>
            <p style={{ color: '#92400e', marginTop: '0.5rem', marginBottom: 0 }}>
              JSON logs can be parsed, filtered, and aggregated by log aggregators like Elasticsearch, Loki, or CloudWatch.
              Plain text is for humans, JSON is for machines (and the machines are doing the searching).
            </p>
          </div>
        </div>

        {/* stdout/stderr Philosophy */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
            🖥️ The stdout/stderr Philosophy
          </h2>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem' }}>
              Why No Log Files?
            </h3>
            <p style={{ color: '#64748b', lineHeight: 1.6 }}>
              In traditional deployments, apps write to /var/log/app.log. You need log rotation, 
              disk monitoring, backup strategies, and SSH access to read them. In containers, that's all gone:
            </p>
            <ul style={{ color: '#64748b', lineHeight: 1.8, marginTop: '1rem' }}>
              <li><strong style={{ color: '#1e293b' }}>Containers are ephemeral</strong> - Logs in the filesystem die with the container</li>
              <li><strong style={{ color: '#1e293b' }}>stdout is universal</strong> - Every language can print to stdout (console.log, print, echo)</li>
              <li><strong style={{ color: '#1e293b' }}>Kubernetes captures it</strong> - kubectl logs reads what your app prints</li>
              <li><strong style={{ color: '#1e293b' }}>No special libraries</strong> - No need for log4j, winston, or complex configs</li>
            </ul>
          </div>

          <div style={{ 
            background: '#f8fafc', 
            border: '2px solid #e2e8f0',
            borderRadius: 8,
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>The Rule:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div>
                <div style={{ 
                  color: '#10b981', 
                  fontWeight: 600, 
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>✓</span>
                  <span>stdout</span>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                  Normal operational logs, info, debug messages
                </p>
              </div>
              <div>
                <div style={{ 
                  color: '#ef4444', 
                  fontWeight: 600, 
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>✗</span>
                  <span>stderr</span>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                  Errors, warnings, exceptions, stack traces
                </p>
              </div>
            </div>
          </div>

          <div style={{
            background: '#1e293b',
            borderRadius: 8,
            padding: '1.5rem',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            color: '#e2e8f0'
          }}>
            <div style={{ color: '#64748b', marginBottom: '0.5rem' }}># Node.js example</div>
            <div style={{ color: '#10b981' }}>console.log(<span style={{ color: '#fbbf24' }}>'Server started on port 3000'</span>); <span style={{ color: '#64748b' }}>// stdout</span></div>
            <div style={{ color: '#ef4444' }}>console.error(<span style={{ color: '#fbbf24' }}>'Database connection failed'</span>); <span style={{ color: '#64748b' }}>// stderr</span></div>
            <br />
            <div style={{ color: '#64748b', marginBottom: '0.5rem' }}># Python example</div>
            <div style={{ color: '#10b981' }}>print(<span style={{ color: '#fbbf24' }}>'Processing request...'</span>) <span style={{ color: '#64748b' }}># stdout</span></div>
            <div style={{ color: '#ef4444' }}>print(<span style={{ color: '#fbbf24' }}>'Error:'</span>, e, file=sys.stderr) <span style={{ color: '#64748b' }}># stderr</span></div>
            <br />
            <div style={{ color: '#64748b', marginBottom: '0.5rem' }}># Go example</div>
            <div style={{ color: '#10b981' }}>fmt.Println(<span style={{ color: '#fbbf24' }}>"Service ready"</span>) <span style={{ color: '#64748b' }}>// stdout</span></div>
            <div style={{ color: '#ef4444' }}>fmt.Fprintln(os.Stderr, <span style={{ color: '#fbbf24' }}>"Panic!"</span>) <span style={{ color: '#64748b' }}>// stderr</span></div>
          </div>
        </div>

        {/* Centralized Logging Patterns */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
            🏗️ Centralized Logging Patterns
          </h2>

          <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Your apps print to stdout, but where do those logs actually go? kubectl logs only shows 
            what's currently in the container. If it restarts, logs are gone. You need centralized logging.
          </p>

          {/* Pattern Selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {(Object.keys(loggingPatterns) as Array<keyof typeof loggingPatterns>).map(pattern => (
                <button
                  key={pattern}
                  onClick={() => setSelectedPattern(pattern)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: selectedPattern === pattern ? '#9c0606' : '#f8fafc',
                    color: selectedPattern === pattern ? 'white' : '#1e293b',
                    border: selectedPattern === pattern ? 'none' : '2px solid #e2e8f0',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                >
                  {loggingPatterns[pattern].name}
                </button>
              ))}
            </div>

            <div style={{ 
              background: '#f8fafc', 
              border: '2px solid #e2e8f0',
              borderRadius: 8,
              padding: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem' }}>
                {loggingPatterns[selectedPattern].name}
              </h3>
              <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                {loggingPatterns[selectedPattern].description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ color: '#10b981', fontSize: '1rem', marginBottom: '0.5rem' }}>Pros</h4>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#64748b' }}>
                    {loggingPatterns[selectedPattern].pros.map((pro, idx) => (
                      <li key={idx} style={{ marginBottom: '0.25rem' }}>{pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 style={{ color: '#ef4444', fontSize: '1rem', marginBottom: '0.5rem' }}>Cons</h4>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#64748b' }}>
                    {loggingPatterns[selectedPattern].cons.map((con, idx) => (
                      <li key={idx} style={{ marginBottom: '0.25rem' }}>{con}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ 
                padding: '1rem', 
                background: '#fef3c7', 
                borderRadius: 6,
                borderLeft: '4px solid #f59e0b'
              }}>
                <strong style={{ color: '#92400e' }}>Use Case:</strong>
                <span style={{ color: '#92400e' }}> {loggingPatterns[selectedPattern].useCase}</span>
              </div>
            </div>
          </div>

          {/* Visual Diagrams */}
          {selectedPattern === 'sidecar' && (
            <div style={{ 
              background: '#f8fafc', 
              border: '2px dashed #9c0606',
              borderRadius: 8,
              padding: '1.5rem',
              marginTop: '1rem'
            }}>
              <h4 style={{ marginTop: 0, color: '#1e293b' }}>Sidecar Architecture:</h4>
              <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: '#64748b' }}>
                <pre style={{ margin: 0 }}>{`
┌─────────────────────────────────────────┐
│              Pod                         │
│  ┌─────────────────┐  ┌──────────────┐  │
│  │   App Container │  │   Fluentd    │  │
│  │                 │  │   Sidecar    │  │
│  │  stdout/stderr ─┼─→│              │  │
│  │                 │  │     ↓        │  │
│  └─────────────────┘  └──────┼───────┘  │
└───────────────────────────────┼──────────┘
                                ↓
                      Elasticsearch / Loki
`}</pre>
              </div>
            </div>
          )}

          {selectedPattern === 'daemonset' && (
            <div style={{ 
              background: '#f8fafc', 
              border: '2px dashed #9c0606',
              borderRadius: 8,
              padding: '1.5rem',
              marginTop: '1rem'
            }}>
              <h4 style={{ marginTop: 0, color: '#1e293b' }}>DaemonSet Architecture:</h4>
              <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: '#64748b' }}>
                <pre style={{ margin: 0 }}>{`
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
            Centralized Logging
`}</pre>
              </div>
            </div>
          )}

          {selectedPattern === 'direct' && (
            <div style={{ 
              background: '#f8fafc', 
              border: '2px dashed #9c0606',
              borderRadius: 8,
              padding: '1.5rem',
              marginTop: '1rem'
            }}>
              <h4 style={{ marginTop: 0, color: '#1e293b' }}>Direct Shipping Architecture:</h4>
              <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: '#64748b' }}>
                <pre style={{ margin: 0 }}>{`
┌────────────────────────────────────┐
│            Pod                      │
│  ┌──────────────────────┐          │
│  │   App Container      │          │
│  │                      │          │
│  │  Winston / Logrus   ─┼──────────┼─────→ Elasticsearch
│  │  with HTTP transport │          │       / Loki / Datadog
│  │                      │          │
│  └──────────────────────┘          │
└────────────────────────────────────┘
`}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Popular Logging Stacks */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
            🛠️ Popular Logging Stacks
          </h2>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              {
                name: 'ELK Stack',
                components: 'Elasticsearch + Logstash + Kibana',
                description: 'The OG. Powerful search, beautiful dashboards, resource hungry.',
                color: '#f59e0b'
              },
              {
                name: 'EFK Stack',
                components: 'Elasticsearch + Fluentd + Kibana',
                description: 'Replaces Logstash with Fluentd. More Kubernetes-native.',
                color: '#3b82f6'
              },
              {
                name: 'PLG Stack',
                components: 'Promtail + Loki + Grafana',
                description: 'Lightweight, cost-effective. Logs are indexed by labels, not content.',
                color: '#10b981'
              },
              {
                name: 'CloudWatch Logs',
                components: 'AWS CloudWatch + Fluent Bit',
                description: 'Fully managed, integrates with AWS services. Pay per GB ingested.',
                color: '#8b5cf6'
              }
            ].map((stack, idx) => (
              <div key={idx} style={{
                background: '#f8fafc',
                border: '2px solid #e2e8f0',
                borderLeft: `4px solid ${stack.color}`,
                borderRadius: 8,
                padding: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
                  {stack.name}
                </h3>
                <div style={{ color: stack.color, fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  {stack.components}
                </div>
                <p style={{ color: '#64748b', margin: 0 }}>
                  {stack.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
            ✅ Logging Best Practices
          </h2>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              {
                title: 'Use Structured Logging',
                description: 'JSON > plain text. Makes parsing, filtering, and aggregation trivial.',
                example: '{"level":"error","msg":"DB timeout","user_id":123,"duration_ms":5000}'
              },
              {
                title: 'Include Context',
                description: 'request_id, user_id, trace_id help correlate logs across services.',
                example: 'Every log line in a request should share the same request_id'
              },
              {
                title: 'Log Levels Matter',
                description: 'DEBUG for development, INFO for production events, WARN for issues, ERROR for failures.',
                example: 'Don\'t log DEBUG in production unless you hate your log bill'
              },
              {
                title: 'Don\'t Log Secrets',
                description: 'Never log passwords, tokens, API keys, or PII. Redact them.',
                example: 'Log "user authenticated" not "user logged in with password: hunter2"'
              },
              {
                title: 'Keep It Brief',
                description: 'Logs cost money. Don\'t log every single thing. High-cardinality data kills.',
                example: 'Log "payment processed" not the entire 5KB payment JSON'
              },
              {
                title: 'Use Correlation IDs',
                description: 'Trace requests across microservices with a shared ID.',
                example: 'X-Request-ID header passed through all services'
              }
            ].map((practice, idx) => (
              <div key={idx} style={{
                background: '#f8fafc',
                border: '2px solid #e2e8f0',
                borderRadius: 8,
                padding: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
                  {practice.title}
                </h3>
                <p style={{ color: '#64748b', marginBottom: '0.75rem' }}>
                  {practice.description}
                </p>
                <div style={{
                  background: '#1e293b',
                  borderRadius: 6,
                  padding: '0.75rem',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  color: '#10b981'
                }}>
                  💡 {practice.example}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* kubectl logs Commands */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
            ⚡ Essential kubectl logs Commands
          </h2>

          <div style={{
            background: '#1e293b',
            borderRadius: 8,
            padding: '1.5rem',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            color: '#e2e8f0'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ color: '#64748b', marginBottom: '0.5rem' }}># View logs from a Pod</div>
              <div style={{ color: '#10b981' }}>kubectl logs frontend-7b8f9d-xk2p9</div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ color: '#64748b', marginBottom: '0.5rem' }}># Follow logs in real-time (like tail -f)</div>
              <div style={{ color: '#10b981' }}>kubectl logs -f frontend-7b8f9d-xk2p9</div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ color: '#64748b', marginBottom: '0.5rem' }}># Logs from specific container in multi-container Pod</div>
              <div style={{ color: '#10b981' }}>kubectl logs frontend-7b8f9d-xk2p9 -c app-container</div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ color: '#64748b', marginBottom: '0.5rem' }}># Logs from previous crashed container</div>
              <div style={{ color: '#10b981' }}>kubectl logs frontend-7b8f9d-xk2p9 --previous</div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ color: '#64748b', marginBottom: '0.5rem' }}># Last 100 lines</div>
              <div style={{ color: '#10b981' }}>kubectl logs frontend-7b8f9d-xk2p9 --tail=100</div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ color: '#64748b', marginBottom: '0.5rem' }}># Logs since 1 hour ago</div>
              <div style={{ color: '#10b981' }}>kubectl logs frontend-7b8f9d-xk2p9 --since=1h</div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ color: '#64748b', marginBottom: '0.5rem' }}># Logs from all Pods with label</div>
              <div style={{ color: '#10b981' }}>kubectl logs -l app=frontend</div>
            </div>

            <div>
              <div style={{ color: '#64748b', marginBottom: '0.5rem' }}># Logs with timestamps</div>
              <div style={{ color: '#10b981' }}>kubectl logs frontend-7b8f9d-xk2p9 --timestamps</div>
            </div>
          </div>

          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            background: '#fef3c7', 
            borderLeft: '4px solid #f59e0b',
            borderRadius: 4
          }}>
            <strong style={{ color: '#92400e' }}>⚠️ Remember:</strong>
            <p style={{ color: '#92400e', marginTop: '0.5rem', marginBottom: 0 }}>
              kubectl logs only shows logs that are currently in the container. If the Pod restarts,
              you lose them unless you have centralized logging. Always use --previous to see logs
              from the crashed container.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          paddingTop: '2rem',
          borderTop: '2px solid #e2e8f0'
        }}>
          <Link href="/module-7-3" style={{
              padding: '0.75rem 1.5rem',
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: 8,
              color: '#1e293b',
              textDecoration: 'none',
              fontWeight: 600
            }}>← 7.3 Network Policies</Link>
          <Link href="/module-8-2" style={{
              padding: '0.75rem 1.5rem',
              background: '#9c0606',
              borderRadius: 8,
              color: 'white',
              textDecoration: 'none',
              fontWeight: 600
            }}>8.2 Monitoring →</Link>
        </div>

        <ModuleCompletion moduleId="8-1" />
      </div>
    </div>
  )
}
