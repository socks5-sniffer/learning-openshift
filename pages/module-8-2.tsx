import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import ModuleCompletion from '../components/ModuleCompletion';

export default function Monitoring() {
  const [selectedMetric, setSelectedMetric] = useState<'cpu' | 'memory' | 'requests' | 'errors'>('cpu')
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('1h')
  const [selectedService, setSelectedService] = useState<'frontend' | 'backend' | 'database'>('frontend')
  const [alertThreshold, setAlertThreshold] = useState(80)
  const [enableAlert, setEnableAlert] = useState(false)

  const services = {
    frontend: {
      name: 'Frontend Service',
      color: '#3b82f6',
      metrics: {
        cpu: [45, 52, 48, 65, 72, 68, 55, 50, 58, 62],
        memory: [1.2, 1.3, 1.25, 1.5, 1.6, 1.55, 1.4, 1.35, 1.45, 1.5],
        requests: [120, 145, 180, 220, 250, 230, 190, 160, 175, 200],
        errors: [2, 1, 3, 5, 4, 2, 1, 2, 3, 2]
      }
    },
    backend: {
      name: 'Backend API',
      color: '#10b981',
      metrics: {
        cpu: [65, 70, 75, 82, 88, 85, 78, 72, 68, 75],
        memory: [2.1, 2.3, 2.5, 2.8, 3.0, 2.9, 2.6, 2.4, 2.5, 2.7],
        requests: [450, 520, 600, 680, 720, 690, 620, 580, 610, 650],
        errors: [5, 8, 12, 15, 18, 14, 10, 8, 9, 11]
      }
    },
    database: {
      name: 'PostgreSQL',
      color: '#8b5cf6',
      metrics: {
        cpu: [30, 35, 38, 42, 45, 43, 40, 36, 38, 40],
        memory: [3.5, 3.6, 3.7, 3.9, 4.0, 3.95, 3.8, 3.7, 3.75, 3.85],
        requests: [850, 920, 1000, 1100, 1150, 1120, 1050, 980, 1020, 1080],
        errors: [0, 1, 0, 2, 1, 0, 1, 0, 0, 1]
      }
    }
  }

  const metricInfo = {
    cpu: {
      name: 'CPU Usage',
      unit: '%',
      icon: '📊',
      description: 'Percentage of CPU cores being used',
      goodRange: '< 70%',
      warningRange: '70-85%',
      criticalRange: '> 85%'
    },
    memory: {
      name: 'Memory Usage',
      unit: 'GB',
      icon: '💾',
      description: 'RAM consumption in gigabytes',
      goodRange: '< 75%',
      warningRange: '75-90%',
      criticalRange: '> 90%'
    },
    requests: {
      name: 'Request Rate',
      unit: 'req/s',
      icon: '🔄',
      description: 'HTTP requests per second',
      goodRange: 'Steady',
      warningRange: 'Spiking',
      criticalRange: 'Dropping to 0'
    },
    errors: {
      name: 'Error Rate',
      unit: 'errors/min',
      icon: '⚠️',
      description: 'Number of errors per minute',
      goodRange: '< 1%',
      warningRange: '1-5%',
      criticalRange: '> 5%'
    }
  }

  const getCurrentValue = () => {
    const data = services[selectedService].metrics[selectedMetric]
    return data[data.length - 1]
  }

  const getMaxValue = () => {
    const data = services[selectedService].metrics[selectedMetric]
    return Math.max(...data)
  }

  const isAlerting = () => {
    if (!enableAlert) return false
    const value = getCurrentValue()
    return selectedMetric === 'cpu' || selectedMetric === 'memory'
      ? value > alertThreshold
      : false
  }

  const renderChart = () => {
    const data = services[selectedService].metrics[selectedMetric]
    const max = Math.max(...data)
    const height = 200

    return (
      <div style={{
        position: 'relative',
        height: height,
        background: '#1e293b',
        borderRadius: 8,
        padding: '1rem',
        marginBottom: '1rem'
      }}>
        <svg width="100%" height={height - 32} style={{ position: 'relative' }}>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(percent => (
            <line
              key={percent}
              x1="0"
              y1={(height - 32) * (1 - percent / 100)}
              x2="100%"
              y2={(height - 32) * (1 - percent / 100)}
              stroke="#334155"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          ))}

          {/* Data line */}
          <polyline
            points={data.map((value, idx) => {
              const x = (idx / (data.length - 1)) * 100
              const y = (1 - value / max) * (height - 32)
              return `${x}%,${y}`
            }).join(' ')}
            fill="none"
            stroke={services[selectedService].color}
            strokeWidth="3"
          />

          {/* Data points */}
          {data.map((value, idx) => {
            const x = (idx / (data.length - 1)) * 100
            const y = (1 - value / max) * (height - 32)
            return (
              <circle
                key={idx}
                cx={`${x}%`}
                cy={y}
                r="4"
                fill={services[selectedService].color}
              />
            )
          })}

          {/* Threshold line */}
          {enableAlert && (selectedMetric === 'cpu' || selectedMetric === 'memory') && (
            <line
              x1="0"
              y1={(height - 32) * (1 - alertThreshold / max)}
              x2="100%"
              y2={(height - 32) * (1 - alertThreshold / max)}
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="8,4"
            />
          )}
        </svg>

        {/* Current value display */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: services[selectedService].color,
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: 6,
          fontWeight: 600,
          fontSize: '1.2rem'
        }}>
          {getCurrentValue()}{metricInfo[selectedMetric].unit}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>8.2 Monitoring - Kubernetes Learning</title>
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
        <h1 className={styles.title}>Module 8.2: Monitoring</h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280', marginTop: '-10px' }}>
          Part 8: Observability & Debugging
        </p>

        <div style={{ marginBottom: '2rem' }}>
          <Link href="/module-8-1" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>← Previous: Logging</Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/learning-modules" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>All Modules</Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/module-8-3" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>Next: Debugging Kubernetes →</Link>
        </div>

        {/* Interactive Metrics Dashboard */}
        <section className={styles.spotlight}>
          <div style={{ background: 'white', borderRadius: 12, padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
              📈 Interactive Metrics Dashboard
            </h2>

            <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.6 }}>
              Logs tell you what happened. Metrics tell you how healthy your system is right now.
              CPU, memory, request rates, error rates—these are the vital signs. Prometheus is
              the de facto standard for collecting and querying these metrics in Kubernetes.
            </p>

            {/* Service Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#1e293b' }}>
                Select Service
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {(Object.keys(services) as Array<keyof typeof services>).map(service => (
                  <button
                    key={service}
                    onClick={() => setSelectedService(service)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: selectedService === service ? services[service].color : '#f8fafc',
                      color: selectedService === service ? 'white' : '#1e293b',
                      border: selectedService === service ? 'none' : '2px solid #e2e8f0',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                  >
                    {services[service].name}
                  </button>
                ))}
              </div>
            </div>

            {/* Metric Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#1e293b' }}>
                Select Metric
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
                {(Object.keys(metricInfo) as Array<keyof typeof metricInfo>).map(metric => (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric)}
                    style={{
                      padding: '1rem',
                      background: selectedMetric === metric ? '#9c0606' : '#f8fafc',
                      color: selectedMetric === metric ? 'white' : '#1e293b',
                      border: selectedMetric === metric ? 'none' : '2px solid #e2e8f0',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                      {metricInfo[metric].icon}
                    </div>
                    <div style={{ fontSize: '0.875rem' }}>
                      {metricInfo[metric].name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chart */}
            {renderChart()}

            {/* Metric Info */}
            <div style={{
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: 8,
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem' }}>
                {metricInfo[selectedMetric].icon} {metricInfo[selectedMetric].name}
              </h3>
              <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                {metricInfo[selectedMetric].description}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Good
                  </div>
                  <div style={{ color: '#10b981', fontWeight: 600 }}>
                    {metricInfo[selectedMetric].goodRange}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Warning
                  </div>
                  <div style={{ color: '#f59e0b', fontWeight: 600 }}>
                    {metricInfo[selectedMetric].warningRange}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Critical
                  </div>
                  <div style={{ color: '#ef4444', fontWeight: 600 }}>
                    {metricInfo[selectedMetric].criticalRange}
                  </div>
                </div>
              </div>
            </div>

            {/* Alert Configuration */}
            {(selectedMetric === 'cpu' || selectedMetric === 'memory') && (
              <div style={{
                background: isAlerting() ? '#fee2e2' : '#f8fafc',
                border: `2px solid ${isAlerting() ? '#ef4444' : '#e2e8f0'}`,
                borderRadius: 8,
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                    🚨 Alert Configuration
                  </h3>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={enableAlert}
                      onChange={(e) => setEnableAlert(e.target.checked)}
                      style={{ marginRight: '0.5rem', width: 18, height: 18, cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>Enable Alert</span>
                  </label>
                </div>

                {enableAlert && (
                  <>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#1e293b' }}>
                      Alert Threshold: {alertThreshold}{metricInfo[selectedMetric].unit}
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={alertThreshold}
                      onChange={(e) => setAlertThreshold(Number(e.target.value))}
                      style={{ width: '100%', marginBottom: '1rem' }}
                    />

                    {isAlerting() && (
                      <div style={{
                        background: '#ef4444',
                        color: 'white',
                        padding: '1rem',
                        borderRadius: 6,
                        fontWeight: 600,
                        marginTop: '1rem'
                      }}>
                        🚨 ALERT: {metricInfo[selectedMetric].name} is {getCurrentValue()}{metricInfo[selectedMetric].unit},
                        exceeding threshold of {alertThreshold}{metricInfo[selectedMetric].unit}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Prometheus Basics */}
        <section className={styles.spotlight}>
          <div style={{ background: 'white', borderRadius: 12, padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
              📊 Prometheus Basics
            </h2>

            <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Prometheus is an open-source monitoring system that scrapes metrics from targets (your apps),
              stores them in a time-series database, and lets you query them with PromQL. It's the standard
              in Kubernetes because it understands Pods, Services, and Namespaces natively.
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem' }}>
                How Prometheus Works
              </h3>
              <div style={{
                background: '#f8fafc',
                border: '2px solid #e2e8f0',
                borderRadius: 8,
                padding: '1.5rem',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                color: '#64748b'
              }}>
                <pre style={{ margin: 0, whiteSpace: 'pre' }}>{`
┌────────────────────────────────────────────────┐
│              Your Application                   │
│  ┌──────────────────────────────────────────┐  │
│  │  App exposes metrics at /metrics         │  │
│  │                                          │  │
│  │  http_requests_total{"{"}path="/api"{"}"} 1543  │  │
│  │  cpu_usage_percent 72.5                 │  │
│  │  memory_bytes 1234567890                │  │
│  └──────────────┬───────────────────────────┘  │
└─────────────────┼──────────────────────────────┘
                  │
                  │ Scrapes every 15s
                  ↓
      ┌───────────────────────┐
      │    Prometheus Server   │
      │                       │
      │  1. Scrapes targets   │
      │  2. Stores metrics    │
      │  3. Evaluates alerts  │
      │  4. Serves PromQL API │
      └───────────┬───────────┘
                  │
                  ↓
      ┌───────────────────────┐
      │       Grafana         │
      │  (Visualization)      │
      └───────────────────────┘
`}</pre>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem' }}>
                Metric Types
              </h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {[
                  {
                    type: 'Counter',
                    description: 'Only goes up. Reset to zero on restart. Use for: requests, errors, bytes sent.',
                    example: 'http_requests_total{"{"} counter{"}"} → 1543',
                    color: '#3b82f6'
                  },
                  {
                    type: 'Gauge',
                    description: 'Can go up or down. Use for: current CPU, memory, connections, queue size.',
                    example: 'memory_usage_bytes{"{"} gauge{"}"} → 1234567890',
                    color: '#10b981'
                  },
                  {
                    type: 'Histogram',
                    description: 'Observations in buckets. Use for: request duration, response size.',
                    example: 'http_request_duration_seconds_bucket{"{"}le="0.5"{"}"} → 924',
                    color: '#f59e0b'
                  },
                  {
                    type: 'Summary',
                    description: 'Like histogram but calculates percentiles on client. Use for: latency.',
                    example: 'http_request_duration_seconds{"{"}quantile="0.95"{"}"} → 0.245',
                    color: '#8b5cf6'
                  }
                ].map((metric, idx) => (
                  <div key={idx} style={{
                    background: '#f8fafc',
                    border: '2px solid #e2e8f0',
                    borderLeft: `4px solid ${metric.color}`,
                    borderRadius: 8,
                    padding: '1.5rem'
                  }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
                      {metric.type}
                    </h4>
                    <p style={{ color: '#64748b', marginBottom: '0.75rem' }}>
                      {metric.description}
                    </p>
                    <div style={{
                      background: '#1e293b',
                      borderRadius: 6,
                      padding: '0.75rem',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      color: metric.color
                    }}>
                      {metric.example}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem' }}>
                Common PromQL Queries
              </h3>
              <div style={{
                background: '#1e293b',
                borderRadius: 8,
                padding: '1.5rem',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                color: '#e2e8f0'
              }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ color: '#64748b', marginBottom: '0.25rem' }}># Current CPU usage for a Pod</div>
                  <div style={{ color: '#10b981' }}>rate(container_cpu_usage_seconds_total{'{'}pod="frontend-abc"{'}'}[5m])</div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ color: '#64748b', marginBottom: '0.25rem' }}># Memory usage in GB</div>
                  <div style={{ color: '#10b981' }}>container_memory_usage_bytes{'{'}pod="backend-xyz"{'}'} / 1024 / 1024 / 1024</div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ color: '#64748b', marginBottom: '0.25rem' }}># Request rate (requests per second)</div>
                  <div style={{ color: '#10b981' }}>rate(http_requests_total[5m])</div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ color: '#64748b', marginBottom: '0.25rem' }}># Error rate (percentage)</div>
                  <div style={{ color: '#10b981' }}>
                    rate(http_requests_total{'{'}status=~"5.."{'}'}[5m]) / rate(http_requests_total[5m]) * 100
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ color: '#64748b', marginBottom: '0.25rem' }}># 95th percentile latency</div>
                  <div style={{ color: '#10b981' }}>histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))</div>
                </div>

                <div>
                  <div style={{ color: '#64748b', marginBottom: '0.25rem' }}># Pods using more than 1GB memory</div>
                  <div style={{ color: '#10b981' }}>container_memory_usage_bytes {">"} 1073741824</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Four Golden Signals */}
        <section className={styles.spotlight}>
          <div style={{ background: 'white', borderRadius: 12, padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
              🎯 The Four Golden Signals (Google SRE)
            </h2>

            <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Google's SRE book recommends monitoring these four metrics for every service. If you monitor
              nothing else, monitor these. They tell you everything you need to know about user experience.
            </p>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {[
                {
                  signal: 'Latency',
                  description: 'How long does a request take? Measure both successful and failed requests separately.',
                  why: 'A slow 200 OK is worse than a fast 500 for UX. Track p50, p95, p99.',
                  alert: 'p95 latency > 500ms for 5 minutes',
                  color: '#3b82f6'
                },
                {
                  signal: 'Traffic',
                  description: 'How much demand is your service getting? Requests per second, transactions per second.',
                  why: 'Sudden drops = something broke. Sudden spikes = attack or viral content.',
                  alert: 'Traffic drops by 50% in 5 minutes',
                  color: '#10b981'
                },
                {
                  signal: 'Errors',
                  description: 'Rate of failed requests. HTTP 5xx, exceptions, failed DB queries.',
                  why: 'Even 0.1% error rate can mean thousands of angry users.',
                  alert: 'Error rate > 1% for 2 minutes',
                  color: '#ef4444'
                },
                {
                  signal: 'Saturation',
                  description: 'How "full" is your service? CPU, memory, disk, network, connection pools.',
                  why: 'At 100% saturation, your service stops working. Alert before that.',
                  alert: 'CPU > 80% for 10 minutes',
                  color: '#f59e0b'
                }
              ].map((signal, idx) => (
                <div key={idx} style={{
                  background: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '1.5rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.75rem'
                  }}>
                    <div style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: signal.color
                    }} />
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                      {signal.signal}
                    </h3>
                  </div>
                  <p style={{ color: '#64748b', marginBottom: '0.75rem' }}>
                    <strong style={{ color: '#1e293b' }}>What:</strong> {signal.description}
                  </p>
                  <p style={{ color: '#64748b', marginBottom: '0.75rem' }}>
                    <strong style={{ color: '#1e293b' }}>Why:</strong> {signal.why}
                  </p>
                  <div style={{
                    background: signal.color,
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: 6,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}>
                    🚨 Example Alert: {signal.alert}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What to Alert On */}
        <section className={styles.spotlight}>
          <div style={{ background: 'white', borderRadius: 12, padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
              🚨 What to Alert On (and What Not To)
            </h2>

            <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Alert fatigue is real. Too many alerts and you'll ignore them all. The goal is:
              <strong style={{ color: '#1e293b' }}> Only alert on things that require immediate human action.</strong>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  color: '#10b981',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>✓</span>
                  DO Alert On
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    'Service is completely down',
                    'Error rate > 5% for 5 minutes',
                    'p99 latency > 2 seconds',
                    'Disk usage > 90%',
                    'SSL certificate expiring in 7 days',
                    'Database replication lag > 1 minute',
                    'Payment processing failing'
                  ].map((item, idx) => (
                    <div key={idx} style={{
                      background: '#f0fdf4',
                      border: '2px solid #bbf7d0',
                      borderRadius: 6,
                      padding: '0.75rem',
                      color: '#166534'
                    }}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  color: '#ef4444',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>✗</span>
                  DON'T Alert On
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    'Single request failed (noise)',
                    'CPU briefly spiked to 90%',
                    'One Pod restarted (Kubernetes handles it)',
                    'Disk usage > 50% (too early)',
                    'p50 latency increased 10ms',
                    'Non-critical background job failed',
                    'INFO level log line appeared'
                  ].map((item, idx) => (
                    <div key={idx} style={{
                      background: '#fef2f2',
                      border: '2px solid #fecaca',
                      borderRadius: 6,
                      padding: '0.75rem',
                      color: '#991b1b'
                    }}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{
              background: '#fef3c7',
              border: '2px solid #fcd34d',
              borderRadius: 8,
              padding: '1.5rem'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#92400e' }}>The Golden Rule of Alerting:</h4>
              <p style={{ color: '#92400e', margin: 0, fontSize: '1.05rem' }}>
                <strong>Every alert should be actionable.</strong> If you can't do anything about it at 3am,
                don't wake someone up for it. Use dashboards for awareness, alerts for emergencies.
              </p>
            </div>
          </div>
        </section>

        {/* Alert Severity Levels */}
        <section className={styles.spotlight}>
          <div style={{ background: 'white', borderRadius: 12, padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
              📢 Alert Severity Levels
            </h2>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {[
                {
                  level: 'Critical',
                  color: '#ef4444',
                  action: 'Page on-call engineer immediately',
                  examples: 'Service down, data loss, security breach, payment processing broken',
                  response: 'Drop everything and fix now'
                },
                {
                  level: 'Warning',
                  color: '#f59e0b',
                  action: 'Slack notification to team channel',
                  examples: 'Error rate elevated, latency increasing, disk at 85%, high memory',
                  response: 'Investigate during business hours'
                },
                {
                  level: 'Info',
                  color: '#3b82f6',
                  action: 'Dashboard or log only, no notification',
                  examples: 'Deployment completed, Pod restarted, autoscaler triggered, cache cleared',
                  response: 'FYI, no action needed'
                }
              ].map((severity, idx) => (
                <div key={idx} style={{
                  background: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderLeft: `6px solid ${severity.color}`,
                  borderRadius: 8,
                  padding: '1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{
                      background: severity.color,
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: 6,
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      textTransform: 'uppercase'
                    }}>
                      {severity.level}
                    </div>
                    <div style={{ color: '#64748b', flex: 1 }}>
                      {severity.action}
                    </div>
                  </div>
                  <p style={{ color: '#64748b', marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#1e293b' }}>Examples:</strong> {severity.examples}
                  </p>
                  <p style={{ color: '#64748b', margin: 0 }}>
                    <strong style={{ color: '#1e293b' }}>Response:</strong> {severity.response}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Monitoring Tools */}
        <section className={styles.spotlight}>
          <div style={{ background: 'white', borderRadius: 12, padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
              🛠️ Popular Monitoring Tools
            </h2>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {[
                {
                  tool: 'Prometheus + Grafana',
                  description: 'Open-source standard. Prometheus scrapes metrics, Grafana visualizes them.',
                  pros: 'Free, powerful, huge community',
                  cons: 'Setup complexity, scaling challenges',
                  color: '#f59e0b'
                },
                {
                  tool: 'Datadog',
                  description: 'SaaS monitoring platform. Agent on each node, beautiful dashboards.',
                  pros: 'Zero config, gorgeous UI, APM included',
                  cons: 'Expensive ($$$), vendor lock-in',
                  color: '#8b5cf6'
                },
                {
                  tool: 'New Relic',
                  description: 'Application Performance Monitoring (APM) with infrastructure monitoring.',
                  pros: 'Deep insights, traces, easy setup',
                  cons: 'Pricey, complex pricing model',
                  color: '#10b981'
                },
                {
                  tool: 'CloudWatch (AWS)',
                  description: 'Native AWS monitoring. Auto-collects EC2, EKS, RDS metrics.',
                  pros: 'Built-in, no agents, integrates with AWS',
                  cons: 'AWS-only, limited PromQL support',
                  color: '#3b82f6'
                }
              ].map((tool, idx) => (
                <div key={idx} style={{
                  background: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderLeft: `4px solid ${tool.color}`,
                  borderRadius: 8,
                  padding: '1.5rem'
                }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
                    {tool.tool}
                  </h3>
                  <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                    {tool.description}
                  </p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginBottom: '0.25rem' }}>
                        PROS
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                        {tool.pros}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600, marginBottom: '0.25rem' }}>
                        CONS
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                        {tool.cons}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
          <Link href="/module-8-1" style={{
              textDecoration: 'none',
              color: '#94a3b8',
              fontWeight: 600,
              padding: '12px 24px',
              border: '2px solid #475569',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>← Previous: Logging</Link>

          <Link href="/module-8-3" style={{
              textDecoration: 'none',
              color: '#fff',
              background: '#9c0606ff',
              fontWeight: 600,
              padding: '12px 24px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>Next: Debugging Kubernetes →</Link>
        </div>

        <ModuleCompletion moduleId="8-2" />

      </main>
    </div>
  )
}
