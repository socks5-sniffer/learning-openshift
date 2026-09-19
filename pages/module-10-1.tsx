import { useState } from 'react'
import styles from '../styles/Home.module.css'
import ModuleShell from '../components/module/ModuleShell'
import Callout from '../components/module/Callout'
import TermBox from '../components/module/TermBox'

interface TimelineStep { time: string; event: string; status: string; color: string }
interface RootCause { cause: string; why: string; example: string; fix: string }
interface Scenario {
  name: string
  icon: string
  description: string
  color: string
  symptoms: string[]
  rootCauses: RootCause[]
  timeline: TimelineStep[]
}

const scenarios: Record<'crashloop' | 'probe' | 'resources' | 'dns', Scenario> = {
  crashloop: {
    name: 'CrashLoopBackOff',
    icon: '🔄',
    description: 'Pod starts, crashes, Kubernetes restarts it, crashes again. Infinite loop of pain.',
    color: '#ef4444',
    symptoms: [
      'Pod status: CrashLoopBackOff',
      'Restart count keeps increasing',
      'Pod never reaches Ready state',
      'Events show "Back-off restarting failed container"'
    ],
    rootCauses: [
      {
        cause: 'Application Crashes on Startup',
        why: 'Code has bugs, missing dependencies, wrong config',
        example: 'Node.js app: Error: Cannot find module \'express\'',
        fix: 'Check logs with kubectl logs <pod> --previous, fix the bug, redeploy'
      },
      {
        cause: 'Can\'t Connect to Database',
        why: 'Wrong hostname, database not ready, network policy blocking',
        example: 'Error: getaddrinfo ENOTFOUND postgres-service',
        fix: 'Verify Service exists, check DNS, test connectivity with netshoot'
      },
      {
        cause: 'Wrong Command/Entrypoint',
        why: 'Dockerfile CMD or Pod command is incorrect',
        example: 'command: ["/bin/node"] instead of ["node", "server.js"]',
        fix: 'Check Dockerfile CMD and Pod spec command/args fields'
      },
      {
        cause: 'Out of Memory (OOMKilled)',
        why: 'Pod uses more memory than limit, gets killed by kernel',
        example: 'Last State: Terminated, Reason: OOMKilled, Exit Code: 137',
        fix: 'Increase memory limits or fix memory leak in code'
      },
      {
        cause: 'Liveness Probe Failing Immediately',
        why: 'App needs 30s to start, probe checks after 1s',
        example: 'livenessProbe: initialDelaySeconds: 5 (too short!)',
        fix: 'Increase initialDelaySeconds to match actual startup time'
      }
    ],
    timeline: [
      { time: '0s', event: 'Pod scheduled', status: 'Pending', color: '#64748b' },
      { time: '2s', event: 'Container starting', status: 'ContainerCreating', color: '#3b82f6' },
      { time: '5s', event: 'App crashes (exit 1)', status: 'Error', color: '#ef4444' },
      { time: '10s', event: 'Kubernetes restarts Pod', status: 'Restarting', color: '#f59e0b' },
      { time: '15s', event: 'App crashes again', status: 'Error', color: '#ef4444' },
      { time: '30s', event: 'Backoff increases', status: 'CrashLoopBackOff', color: '#ef4444' },
      { time: '60s', event: 'Still crashing...', status: 'CrashLoopBackOff', color: '#ef4444' }
    ]
  },
  probe: {
    name: 'Misconfigured Probes',
    icon: '🔍',
    description: 'Health checks that kill healthy Pods or let broken Pods stay alive. Both are bad.',
    color: '#f59e0b',
    symptoms: [
      'Pods constantly restarting (liveness too strict)',
      'Traffic going to broken Pods (readiness too lenient)',
      'Slow rollouts (readiness never passes)',
      'Events show "Liveness probe failed" or "Readiness probe failed"'
    ],
    rootCauses: [
      {
        cause: 'Liveness Probe Too Strict',
        why: 'Kills Pods during temporary slowness instead of actual failures',
        example: 'timeoutSeconds: 1, app sometimes takes 2s to respond',
        fix: 'Increase timeout, use failureThreshold: 3 for tolerance'
      },
      {
        cause: 'Readiness Probe Too Lenient',
        why: 'Pod marked Ready before it\'s actually ready to serve traffic',
        example: 'initialDelaySeconds: 5, app needs 30s to warm up caches',
        fix: 'Increase initialDelaySeconds, test actual startup time'
      },
      {
        cause: 'Wrong Probe Endpoint',
        why: 'Probing endpoint that doesn\'t exist or requires auth',
        example: 'httpGet: path: /health (but app only has /healthz)',
        fix: 'Verify endpoint exists, returns 200, doesn\'t require auth'
      },
      {
        cause: 'No Startup Probe',
        why: 'Slow-starting app gets killed by liveness before it finishes starting',
        example: 'Java app needs 60s to start, liveness checks at 10s',
        fix: 'Add startupProbe with longer failureThreshold * periodSeconds'
      },
      {
        cause: 'Database Dependency in Liveness',
        why: 'Liveness should check if POD is alive, not if DB is alive',
        example: 'Liveness returns 500 if can\'t reach DB → Pod killed needlessly',
        fix: 'Liveness = process alive. Readiness = can serve traffic (DB up)'
      }
    ],
    timeline: [
      { time: '0s', event: 'Pod starts', status: 'Starting', color: '#3b82f6' },
      { time: '5s', event: 'Liveness probe checks', status: 'Checking', color: '#3b82f6' },
      { time: '6s', event: 'App still warming up, slow response', status: 'Timeout', color: '#f59e0b' },
      { time: '10s', event: 'Probe fails (threshold: 1)', status: 'Failed', color: '#ef4444' },
      { time: '11s', event: 'Kubernetes kills Pod', status: 'Killing', color: '#ef4444' },
      { time: '15s', event: 'Pod restarts', status: 'Restarting', color: '#f59e0b' },
      { time: '20s', event: 'Cycle repeats...', status: 'CrashLoopBackOff', color: '#ef4444' }
    ]
  },
  resources: {
    name: 'Resource Exhaustion',
    icon: '💾',
    description: 'Running out of CPU, memory, or disk. Nodes can\'t schedule Pods, apps slow down or crash.',
    color: '#8b5cf6',
    symptoms: [
      'Pods stuck in Pending state',
      'Events: "Insufficient cpu" or "Insufficient memory"',
      'Nodes showing high resource usage',
      'OOMKilled Pods (memory exhaustion)',
      'Throttled apps (CPU exhaustion)'
    ],
    rootCauses: [
      {
        cause: 'No Resource Requests Set',
        why: 'Scheduler doesn\'t know how much to reserve, over-schedules nodes',
        example: 'Pod has no requests → 10 Pods on one node → node crashes',
        fix: 'Set requests based on actual usage (kubectl top pod)'
      },
      {
        cause: 'Memory Limit Too Low',
        why: 'App uses more memory than limit, gets OOMKilled',
        example: 'limits: memory: 128Mi, app actually needs 256Mi',
        fix: 'Monitor actual usage, increase limits or fix memory leak'
      },
      {
        cause: 'CPU Limits Causing Throttling',
        why: 'App hits CPU limit, gets throttled, becomes slow',
        example: 'limits: cpu: 100m, app needs 500m during traffic spike',
        fix: 'Increase CPU limits or remove them (controversial!)'
      },
      {
        cause: 'Disk Space Exhausted',
        why: 'Logs, temp files, or images fill up node disk',
        example: 'Node has 0% disk space, can\'t pull images or write logs',
        fix: 'Set up log rotation, clean old images, add disk space'
      },
      {
        cause: 'Too Many Pods Per Node',
        why: 'Node has CPU/memory but hit max Pod limit (110 by default)',
        example: '110 Pods on node, can\'t schedule more even with resources',
        fix: 'Increase max-pods per node or add more nodes'
      }
    ],
    timeline: [
      { time: '0s', event: 'Deploy 10 new Pods', status: 'Scheduling', color: '#3b82f6' },
      { time: '5s', event: '8 Pods scheduled successfully', status: 'Running', color: '#10b981' },
      { time: '10s', event: '2 Pods stuck Pending', status: 'Pending', color: '#f59e0b' },
      { time: '15s', event: 'Events: Insufficient memory', status: 'FailedScheduling', color: '#ef4444' },
      { time: '30s', event: 'Existing Pods OOMKilled', status: 'OOMKilled', color: '#ef4444' },
      { time: '45s', event: 'Node becomes NotReady', status: 'NodeNotReady', color: '#ef4444' },
      { time: '60s', event: 'Cluster degraded', status: 'Critical', color: '#ef4444' }
    ]
  },
  dns: {
    name: 'DNS Resolution Issues',
    icon: '🌐',
    description: 'Services can\'t find each other. DNS is broken. Nothing can communicate.',
    color: '#3b82f6',
    symptoms: [
      'Pods can\'t resolve service names',
      'curl: (6) Could not resolve host',
      'nslookup fails inside Pods',
      'Apps timing out connecting to services',
      'CoreDNS Pods not running or unhealthy'
    ],
    rootCauses: [
      {
        cause: 'CoreDNS Not Running',
        why: 'DNS server Pods are crashed, pending, or missing',
        example: 'kubectl get pods -n kube-system → coredns-* CrashLoopBackOff',
        fix: 'Check CoreDNS logs, ensure it has resources, restart if needed'
      },
      {
        cause: 'Wrong Service Name',
        why: 'Using IP instead of name, wrong namespace, typo',
        example: 'curl backend (wrong!) vs curl backend.production.svc.cluster.local',
        fix: 'Use FQDN or ensure same namespace, check Service exists'
      },
      {
        cause: 'NetworkPolicy Blocking DNS',
        why: 'Egress policy doesn\'t allow DNS traffic to kube-system',
        example: 'NetworkPolicy blocks UDP/53 to kube-system namespace',
        fix: 'Add egress rule allowing DNS: port 53, namespace: kube-system'
      },
      {
        cause: 'DNS Cache Issues',
        why: 'App caches DNS forever, Service IP changes, cache stale',
        example: 'Java/Go apps with infinite TTL on DNS lookups',
        fix: 'Configure app to respect DNS TTL, use service mesh'
      },
      {
        cause: 'Search Domain Issues',
        why: 'Pod\'s resolv.conf misconfigured, can\'t expand short names',
        example: 'search line missing or wrong in /etc/resolv.conf',
        fix: 'Check dnsPolicy and dnsConfig in Pod spec'
      }
    ],
    timeline: [
      { time: '0s', event: 'Pod starts', status: 'Running', color: '#10b981' },
      { time: '2s', event: 'App tries to connect to "backend"', status: 'Connecting', color: '#3b82f6' },
      { time: '3s', event: 'DNS lookup to CoreDNS', status: 'Resolving', color: '#3b82f6' },
      { time: '5s', event: 'CoreDNS timeout (not responding)', status: 'Timeout', color: '#f59e0b' },
      { time: '10s', event: 'Retry DNS lookup', status: 'Retrying', color: '#f59e0b' },
      { time: '15s', event: 'DNS resolution fails', status: 'Failed', color: '#ef4444' },
      { time: '30s', event: 'Connection timeout', status: 'Error', color: '#ef4444' }
    ]
  }
}

const quickRef = [
  {
    problem: 'Pod won\'t start',
    commands: [
      'kubectl describe pod <name>',
      'kubectl logs <name> --previous',
      'kubectl get events --sort-by=.lastTimestamp'
    ],
    lookFor: 'Events, Last State, Exit Code, Image pull errors'
  },
  {
    problem: 'Pod keeps restarting',
    commands: [
      'kubectl logs <name> --previous',
      'kubectl describe pod <name> | grep -A 10 Liveness',
      'kubectl get pod <name> -o yaml | grep resources'
    ],
    lookFor: 'OOMKilled, liveness probe config, resource limits'
  },
  {
    problem: 'Can\'t reach service',
    commands: [
      'kubectl get endpoints <service>',
      'kubectl exec -it <pod> -- nslookup <service>',
      'kubectl exec -it <pod> -- curl http://<service>:<port>'
    ],
    lookFor: 'Empty endpoints, DNS failures, connection timeouts'
  },
  {
    problem: 'Pods stuck Pending',
    commands: [
      'kubectl describe pod <name>',
      'kubectl top nodes',
      'kubectl get nodes'
    ],
    lookFor: 'Insufficient CPU/memory, taints, node selectors'
  }
]

const preventionTips = [
  { tip: 'Set Resource Requests & Limits', why: 'Prevents over-scheduling and OOMKills', example: 'requests: cpu: 100m, memory: 256Mi' },
  { tip: 'Configure Probes Correctly', why: 'Catches failures fast, doesn\'t kill healthy Pods', example: 'initialDelaySeconds: 30, timeoutSeconds: 5' },
  { tip: 'Test in Staging First', why: 'Catches misconfigurations before production', example: 'Staging cluster mirrors prod config' },
  { tip: 'Monitor Everything', why: 'Detect issues before users do', example: 'Prometheus + Grafana dashboards' },
  { tip: 'Use Init Containers', why: 'Wait for dependencies before starting app', example: 'Init container waits for DB ready' },
  { tip: 'Implement Graceful Shutdown', why: 'Handle SIGTERM, drain connections cleanly', example: 'terminationGracePeriodSeconds: 30' }
]

export default function CommonFailureScenarios() {
  const [selectedScenario, setSelectedScenario] = useState<keyof typeof scenarios>('crashloop')
  const [simulationStep, setSimulationStep] = useState(0)

  const currentScenario = scenarios[selectedScenario]
  const maxSteps = currentScenario.timeline.length - 1

  return (
    <ModuleShell id="10-1" subtitle="Part 10: Real-World Kubernetes">
      <section className={styles.spotlight}>
        <h2>🔥 Select a Failure Scenario</h2>
        <p>
          Production breaks. That's not a question of if, but when. These are the four failure modes
          you'll see over and over again. Learn to recognize them fast, debug them faster, and
          prevent them entirely.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', margin: '1.5rem 0' }}>
          {(Object.keys(scenarios) as Array<keyof typeof scenarios>).map(scenario => {
            const active = selectedScenario === scenario
            return (
              <button
                key={scenario}
                onClick={() => { setSelectedScenario(scenario); setSimulationStep(0) }}
                style={{
                  padding: '1.5rem',
                  background: active ? scenarios[scenario].color : 'var(--color-bg-tertiary)',
                  color: active ? '#fff' : 'var(--color-text-secondary)',
                  border: active ? 'none' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'var(--transition-fast)',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{scenarios[scenario].icon}</div>
                <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{scenarios[scenario].name}</div>
                <div style={{ fontSize: '0.875rem', opacity: active ? 0.9 : 0.7, lineHeight: 1.4 }}>{scenarios[scenario].description}</div>
              </button>
            )
          })}
        </div>

        <div style={{ background: 'var(--color-bg-tertiary)', border: `2px solid ${currentScenario.color}`, borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '3rem' }}>{currentScenario.icon}</span>
            <div>
              <h3 style={{ margin: 0 }}>{currentScenario.name}</h3>
              <p style={{ color: 'var(--color-text-secondary)', margin: '0.25rem 0 0 0' }}>{currentScenario.description}</p>
            </div>
          </div>

          <h4>🔍 Symptoms You'll See:</h4>
          <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {currentScenario.symptoms.map((symptom, idx) => (
              <div key={idx} style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                • {symptom}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            <h4 style={{ margin: 0 }}>⏱️ Timeline Simulation</h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setSimulationStep(Math.max(0, simulationStep - 1))}
                disabled={simulationStep === 0}
                style={{ padding: '0.5rem 1rem', background: simulationStep === 0 ? 'var(--color-bg-secondary)' : 'var(--color-text-muted)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', cursor: simulationStep === 0 ? 'not-allowed' : 'pointer', fontWeight: 600 }}
              >
                ← Previous
              </button>
              <button
                onClick={() => setSimulationStep(Math.min(maxSteps, simulationStep + 1))}
                disabled={simulationStep === maxSteps}
                style={{ padding: '0.5rem 1rem', background: simulationStep === maxSteps ? 'var(--color-bg-secondary)' : 'var(--color-text-muted)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', cursor: simulationStep === maxSteps ? 'not-allowed' : 'pointer', fontWeight: 600 }}
              >
                Next →
              </button>
              <button
                onClick={() => setSimulationStep(0)}
                style={{ padding: '0.5rem 1rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600 }}
              >
                Reset
              </button>
            </div>
          </div>

          <div style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1.5rem' }}>
            {currentScenario.timeline.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: idx < currentScenario.timeline.length - 1 ? '1rem' : 0, opacity: idx <= simulationStep ? 1 : 0.3, transition: 'opacity 0.3s' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: idx <= simulationStep ? step.color : 'var(--color-bg-tertiary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600, flexShrink: 0 }}>
                  {step.time}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{step.event}</div>
                  <div style={{ display: 'inline-block', background: idx <= simulationStep ? step.color : 'var(--color-bg-tertiary)', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 600 }}>
                    {step.status}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h4>🎯 Common Root Causes &amp; Fixes:</h4>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {currentScenario.rootCauses.map((item, idx) => (
              <div key={idx} style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                <h5 style={{ fontSize: '1rem', color: currentScenario.color, marginTop: 0, marginBottom: '0.5rem' }}>{idx + 1}. {item.cause}</h5>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                  <strong>Why:</strong> {item.why}
                </p>
                <Callout variant="danger">❌ {item.example}</Callout>
                <Callout variant="success"><strong>✅ Fix:</strong> {item.fix}</Callout>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>🚑 Quick Debugging Reference</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {quickRef.map((guide, idx) => (
            <div key={idx} style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', marginTop: 0, marginBottom: '0.75rem' }}>Problem: {guide.problem}</h3>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Run these commands:</div>
              <TermBox>{guide.commands.map(cmd => `$ ${cmd}`).join('\n')}</TermBox>
              <Callout variant="warning"><strong>Look for:</strong> {guide.lookFor}</Callout>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>🛡️ Prevention: Stop Failures Before They Happen</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {preventionTips.map((tip, idx) => (
            <div key={idx} style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-success)', marginTop: 0, marginBottom: '0.5rem' }}>✓ {tip.tip}</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>{tip.why}</p>
              <TermBox copyable={false}>{tip.example}</TermBox>
            </div>
          ))}
        </div>
      </section>
    </ModuleShell>
  )
}
