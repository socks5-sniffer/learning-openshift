import { useState } from 'react';
import styles from '../styles/Home.module.css';
import ModuleShell from '../components/module/ModuleShell';
import Callout from '../components/module/Callout';
import TermBox from '../components/module/TermBox';

const commands = {
  describe: {
    name: 'kubectl describe', icon: '🔍',
    description: 'Shows detailed info about a resource. The first place to look when something is wrong.',
    useCase: "Pod won't start? Describe it. You'll see events, conditions, and error messages.",
    example: 'kubectl describe pod frontend-7b8f9d-xk2p9',
    output: `Name:         frontend-7b8f9d-xk2p9
Namespace:    production
Node:         worker-01/10.0.1.5
Status:       CrashLoopBackOff
Containers:
  app:
    Image:          frontend:v1.2.3
    State:          Waiting
      Reason:       CrashLoopBackOff
    Last State:     Terminated
      Reason:       Error
      Exit Code:    1
Events:
  Type     Reason     Age                Message
  ----     ------     ---                -------
  Warning  BackOff    2m (x5)            Back-off restarting failed container
  Warning  Failed     1m (x3)            Error: connection refused to database`,
    whatToLook: ['Events at bottom', 'Container State (Running/Waiting/Terminated)', 'Exit Code', 'Conditions', 'Resource requests/limits'],
  },
  logs: {
    name: 'kubectl logs', icon: '📋',
    description: 'Shows stdout/stderr from your container. What did the app actually say before it died?',
    useCase: 'Pod is crashing? Read the logs. Stack traces, error messages, panic logs all here.',
    example: 'kubectl logs frontend-7b8f9d-xk2p9 --previous',
    output: `Starting application...
Connecting to database at postgres://db:5432
Error: getaddrinfo ENOTFOUND db
    at GetAddrInfoReqWrap.onlookup [as oncomplete]
Process exiting with code 1`,
    whatToLook: ['Error messages', 'Stack traces', 'Last few lines before crash', 'Connection errors', 'Missing env vars'],
  },
  exec: {
    name: 'kubectl exec', icon: '💻',
    description: 'SSH into a running container. Test connections, check files, run commands interactively.',
    useCase: 'Pod is running but acting weird? Exec in and poke around. Test network, check configs.',
    example: 'kubectl exec -it frontend-7b8f9d-xk2p9 -- /bin/bash',
    output: `root@frontend-7b8f9d-xk2p9:/app# curl http://backend:3000
curl: (6) Could not resolve host: backend

root@frontend-7b8f9d-xk2p9:/app# env | grep DATABASE
DATABASE_URL=postgres://wrong-host:5432/db

root@frontend-7b8f9d-xk2p9:/app# cat /etc/resolv.conf
nameserver 10.96.0.10
search production.svc.cluster.local`,
    whatToLook: ['Can you curl internal services?', 'Are env vars set correctly?', 'Are files mounted?', 'DNS resolution working?', 'Disk space full?'],
  },
  events: {
    name: 'kubectl get events', icon: '📰',
    description: "Cluster-wide event log. The crime scene tape. Shows what happened when and why.",
    useCase: "Something failed but you don't know what? Events show scheduling, pulling, starting.",
    example: 'kubectl get events --sort-by=.lastTimestamp',
    output: `LAST SEEN   TYPE      REASON              OBJECT                     MESSAGE
2m          Warning   FailedScheduling    pod/db-abc123              0/3 nodes available: insufficient memory
2m          Normal    Pulling             pod/frontend-xyz789        Pulling image "frontend:v1.2.3"
1m          Warning   Failed              pod/frontend-xyz789        Failed to pull image: 404 not found
1m          Warning   BackOff             pod/frontend-xyz789        Back-off restarting failed container
30s         Normal    Killing             pod/old-pod-456            Stopping container`,
    whatToLook: ['FailedScheduling (no resources)', 'ImagePullBackOff (wrong tag)', 'Unhealthy (liveness probe failing)', 'BackOff (crashing)', 'Evicted (out of memory)'],
  },
};

interface Issue { name: string; description: string; symptoms: string[]; steps: { step: string; command: string; why: string }[]; commonCauses: string[] }
const issues: Record<'crashloop' | 'pending' | 'imagepull' | 'networking', Issue> = {
  crashloop: {
    name: 'CrashLoopBackOff',
    description: 'Pod starts, crashes, Kubernetes restarts it, crashes again. Infinite loop.',
    symptoms: ['Pod shows status "CrashLoopBackOff"', 'Restarts keep increasing', 'Pod never becomes Ready'],
    steps: [
      { step: '1. Check logs of crashed container', command: 'kubectl logs <pod-name> --previous', why: 'See what error caused the crash. Stack traces, connection errors, missing files.' },
      { step: '2. Describe the Pod', command: 'kubectl describe pod <pod-name>', why: 'Look at Events section. Shows exit codes, OOMKilled, etc.' },
      { step: "3. Check if it's an env var issue", command: 'kubectl get pod <pod-name> -o yaml | grep -A 10 env', why: "Missing DATABASE_URL? Wrong API_KEY? App can't start without them." },
      { step: '4. Verify the image exists', command: 'kubectl describe pod <pod-name> | grep Image', why: "Typo in image tag? Wrong registry? Can't run what doesn't exist." },
    ],
    commonCauses: ['Application code has a bug and exits immediately', 'Missing required environment variables', "Can't connect to database (wrong hostname)", 'Liveness probe failing immediately (misconfigured)', 'Out of memory (OOMKilled)', 'Wrong command in Dockerfile/Pod spec'],
  },
  pending: {
    name: 'Pod Stuck in Pending',
    description: "Kubernetes can't schedule the Pod. Not enough resources, node selector issues, etc.",
    symptoms: ['Pod status shows "Pending" forever', 'No container ever starts', 'Events show "FailedScheduling"'],
    steps: [
      { step: '1. Describe the Pod', command: 'kubectl describe pod <pod-name>', why: "Events will tell you exactly why it can't schedule: no CPU, no memory, wrong node." },
      { step: '2. Check node resources', command: 'kubectl top nodes', why: 'Are all nodes maxed out? Need more capacity or smaller resource requests.' },
      { step: '3. Look at Pod resource requests', command: 'kubectl get pod <pod-name> -o yaml | grep -A 5 resources', why: 'Requesting 32GB RAM? No node has that. Lower your requests.' },
      { step: '4. Check node selectors', command: 'kubectl get pod <pod-name> -o yaml | grep -A 3 nodeSelector', why: "nodeSelector: gpu: true but no nodes have that label? Won't schedule." },
    ],
    commonCauses: ['Insufficient CPU/memory on all nodes', 'Pod requests more than any single node has', 'Node selector or affinity rules exclude all nodes', 'Taints on all nodes, no matching tolerations', 'PersistentVolume not available', 'Namespace ResourceQuota exceeded'],
  },
  imagepull: {
    name: 'ImagePullBackOff',
    description: "Kubernetes can't pull the container image. Wrong tag, private registry, or network issue.",
    symptoms: ['Pod status shows "ImagePullBackOff" or "ErrImagePull"', 'Events show "Failed to pull image"', 'Image pull takes forever'],
    steps: [
      { step: '1. Describe the Pod', command: 'kubectl describe pod <pod-name>', why: 'Events show exact error: 404 not found, 401 unauthorized, timeout.' },
      { step: '2. Verify image exists', command: 'docker pull <image-name>', why: 'Can you pull it locally? Typo in tag? Does it actually exist?' },
      { step: '3. Check image pull secrets', command: 'kubectl get pod <pod-name> -o yaml | grep imagePullSecrets', why: 'Private registry needs credentials. Did you create the secret?' },
      { step: '4. Test registry connectivity', command: 'kubectl run test --image=busybox -it --rm -- wget -O- https://registry.example.com', why: 'Can Pods reach your private registry? Firewall blocking?' },
    ],
    commonCauses: ["Image tag doesn't exist (typo: v1.2.3 vs v1.2.4)", 'Private registry missing imagePullSecrets', 'Wrong registry URL (gcr.io vs docker.io)', 'Registry is down or unreachable', 'Rate limit exceeded (Docker Hub)', 'Network policy blocking registry access'],
  },
  networking: {
    name: 'Networking Issues',
    description: "Pods can't talk to each other, external services, or the internet.",
    symptoms: ['Curl timeouts', 'Connection refused', 'DNS resolution failing', 'Services unreachable'],
    steps: [
      { step: '1. Test DNS resolution', command: 'kubectl exec -it <pod> -- nslookup backend', why: 'Can Pod resolve service names? If not, CoreDNS is broken or unreachable.' },
      { step: '2. Test Service connectivity', command: 'kubectl exec -it <pod> -- curl http://backend:3000', why: 'DNS works but curl fails? Service endpoints might be empty.' },
      { step: '3. Check Service endpoints', command: 'kubectl get endpoints backend', why: "No endpoints? Service selector doesn't match any Pods." },
      { step: '4. Verify NetworkPolicies', command: 'kubectl get networkpolicies', why: 'NetworkPolicy denying traffic? Check ingress/egress rules.' },
      { step: '5. Test external connectivity', command: 'kubectl exec -it <pod> -- curl https://google.com', why: "Can't reach internet? Egress NetworkPolicy or no NAT gateway." },
    ],
    commonCauses: ["Service selector doesn't match Pod labels", 'NetworkPolicy blocking traffic', 'Wrong port (Service: 80, Pod: 3000)', 'CoreDNS not running or unhealthy', 'CNI plugin issues (Calico/Flannel broken)', 'Firewall rules blocking traffic', 'Pod in different namespace (use FQDN)'],
  },
};

const workflow = [
  { title: 'Step 1: Identify the Problem', command: 'kubectl get pods', why: 'Which Pod is broken? Look for CrashLoopBackOff, Pending, Error, ImagePullBackOff' },
  { title: 'Step 2: Describe It', command: 'kubectl describe pod <pod-name>', why: 'Read the Events at the bottom. They tell you what went wrong.' },
  { title: 'Step 3: Read the Logs', command: 'kubectl logs <pod-name> --previous', why: 'See what the app said before it crashed. Stack traces, errors, connection failures.' },
  { title: 'Step 4: Exec Into It (if running)', command: 'kubectl exec -it <pod-name> -- /bin/sh', why: 'Test network connectivity, check env vars, verify files are mounted.' },
  { title: 'Step 5: Check Cluster Events', command: 'kubectl get events --sort-by=.lastTimestamp', why: 'See cluster-wide issues: scheduling failures, node problems, resource constraints.' },
];

const advancedTools = [
  { tool: 'kubectl run netshoot', description: 'Spin up a network debugging Pod with curl, dig, nslookup, etc.', command: 'kubectl run netshoot --image=nicolaka/netshoot -it --rm -- /bin/bash', useCase: 'Test network connectivity, DNS resolution, service reachability' },
  { tool: 'kubectl port-forward', description: 'Forward a local port to a Pod. Access services without Ingress.', command: 'kubectl port-forward pod/frontend-abc 8080:80', useCase: 'Debug a service locally, test APIs without exposing them' },
  { tool: 'kubectl top', description: 'See real-time CPU and memory usage for nodes and Pods.', command: 'kubectl top pods --all-namespaces --sort-by=memory', useCase: 'Find memory leaks, identify resource hogs' },
  { tool: 'kubectl diff', description: 'Preview what would change before applying a YAML file.', command: 'kubectl diff -f deployment.yaml', useCase: 'Avoid breaking production by seeing changes first' },
  { tool: 'kubectl debug', description: 'Create an ephemeral debug container in a running Pod.', command: 'kubectl debug -it pod/frontend-abc --image=busybox', useCase: 'Debug distroless images with no shell' },
];

export default function Module83() {
  const [selectedCommand, setSelectedCommand] = useState<keyof typeof commands>('describe');
  const [selectedIssue, setSelectedIssue] = useState<keyof typeof issues>('crashloop');
  const cmd = commands[selectedCommand];
  const issue = issues[selectedIssue];

  return (
    <ModuleShell id="8-3" subtitle="Part 8: Observability & Debugging">
      <section className={styles.spotlight}>
        <h2>🛠️ Essential Debugging Commands</h2>
        <p>
          Something's broken. Pods won't start, services won't connect, everything's on fire.
          Don't panic. Kubernetes tells you exactly what's wrong—if you know where to look.
          These four commands will solve 95% of your problems: describe, logs, exec, and events.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {(Object.keys(commands) as Array<keyof typeof commands>).map((c) => (
            <button key={c} onClick={() => setSelectedCommand(c)}
              style={{ padding: '1rem', background: selectedCommand === c ? 'var(--color-primary)' : 'var(--color-bg-secondary)', color: selectedCommand === c ? 'white' : 'var(--color-text-primary)', border: selectedCommand === c ? 'none' : '1px solid var(--color-border)', borderRadius: 8, cursor: 'pointer', fontWeight: 600, textAlign: 'left' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{commands[c].icon}</div>
              <div>{commands[c].name}</div>
            </button>
          ))}
        </div>

        <div style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '1.5rem' }}>
          <h3 style={{ marginTop: 0 }}>{cmd.icon} {cmd.name}</h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>{cmd.description}</p>
          <Callout variant="warning" title="Use Case"><p>{cmd.useCase}</p></Callout>

          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>EXAMPLE COMMAND:</div>
          <TermBox>
            <div style={{ color: '#10b981' }}>$ {cmd.example}</div>
          </TermBox>

          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>SAMPLE OUTPUT:</div>
          <TermBox copyable={false}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{cmd.output}</pre>
          </TermBox>

          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>WHAT TO LOOK FOR:</div>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--color-text-secondary)' }}>
            {cmd.whatToLook.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>🔧 Common Issues & How to Fix Them</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {(Object.keys(issues) as Array<keyof typeof issues>).map((i) => (
            <button key={i} onClick={() => setSelectedIssue(i)}
              style={{ padding: '1rem', background: selectedIssue === i ? '#ef4444' : 'var(--color-bg-secondary)', color: selectedIssue === i ? 'white' : 'var(--color-text-primary)', border: selectedIssue === i ? 'none' : '1px solid var(--color-border)', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              {issues[i].name}
            </button>
          ))}
        </div>

        <div style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '1.5rem' }}>
          <h3 style={{ marginTop: 0 }}>🔥 {issue.name}</h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>{issue.description}</p>

          <h4>Symptoms:</h4>
          <ul style={{ margin: '0 0 1.5rem', paddingLeft: '1.5rem', color: 'var(--color-text-secondary)' }}>
            {issue.symptoms.map((s, idx) => <li key={idx}>{s}</li>)}
          </ul>

          <h4>Debugging Steps:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {issue.steps.map((step, idx) => (
              <div key={idx} style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '1rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--color-text-accent)', marginBottom: '0.5rem' }}>{step.step}</div>
                <div style={{ background: '#0f172a', borderRadius: 6, padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.875rem', color: '#10b981', marginBottom: '0.5rem' }}>{step.command}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}><strong>Why:</strong> {step.why}</div>
              </div>
            ))}
          </div>

          <h4>Common Causes:</h4>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {issue.commonCauses.map((cause, idx) => (
              <div key={idx} style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.4)', borderRadius: 6, padding: '0.75rem', color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>• {cause}</div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>🕵️ Reading Events Like a Crime Scene</h2>
        <p>
          Events are Kubernetes' way of telling you what happened. They're like security camera footage—
          timestamped, specific, and they tell a story. Learn to read them chronologically to understand
          what went wrong.
        </p>

        <h3>Example Crime Scene:</h3>
        <TermBox copyable={false}>
          <pre style={{ margin: 0 }}>{`LAST SEEN   TYPE      REASON              MESSAGE
---------   ----      ------              -------
5m          Normal    Scheduled           Successfully assigned to worker-01
5m          Normal    Pulling             Pulling image "frontend:v1.2.3"
4m          Warning   Failed              Failed to pull image: manifest unknown
4m          Warning   Failed              Error: ErrImagePull
3m          Normal    BackOff             Back-off pulling image "frontend:v1.2.3"
2m          Warning   Failed              Error: ImagePullBackOff`}</pre>
        </TermBox>

        <h4>Reading the Story:</h4>
        <ol style={{ paddingLeft: '1.5rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          <li><strong style={{ color: '#22c55e' }}>5m ago: Scheduled</strong> - Kubernetes found a node with capacity ✓</li>
          <li><strong style={{ color: '#22c55e' }}>5m ago: Pulling</strong> - Started downloading the image ✓</li>
          <li><strong style={{ color: '#ef4444' }}>4m ago: Failed</strong> - Image doesn't exist! Tag v1.2.3 is wrong ✗</li>
          <li><strong style={{ color: '#f59e0b' }}>3m ago: BackOff</strong> - Kubernetes is waiting before retrying</li>
          <li><strong style={{ color: '#ef4444' }}>2m ago: ImagePullBackOff</strong> - Still can't pull, gave up ✗</li>
        </ol>

        <Callout variant="success" title="🔍 Diagnosis">
          <p>Image tag is wrong. Check your deployment YAML, fix the tag, and redeploy.</p>
        </Callout>

        <h3>Event Types to Know:</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {[
            { type: 'Normal', color: '#10b981', examples: 'Scheduled, Pulling, Pulled, Created, Started' },
            { type: 'Warning', color: '#f59e0b', examples: 'BackOff, Unhealthy, FailedMount' },
            { type: 'Error', color: '#ef4444', examples: 'Failed, Killing, FailedScheduling, Evicted' },
          ].map((e, idx) => (
            <div key={idx} style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderLeft: `4px solid ${e.color}`, borderRadius: 8, padding: '1rem' }}>
              <div style={{ fontWeight: 600, color: e.color, marginBottom: '0.25rem' }}>{e.type}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{e.examples}</div>
            </div>
          ))}
        </div>

        <Callout variant="warning" title="💡 Pro Tip">
          <p>
            Events expire after 1 hour by default. If something broke last night, events are gone.
            That's why centralized logging matters. Events tell you what, logs tell you why.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>📋 Quick Reference: Debug Workflow</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {workflow.map((w, idx) => (
            <div key={idx}>
              <div style={{ fontWeight: 600, color: 'var(--color-text-accent)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{w.title}</div>
              <div style={{ background: '#0f172a', borderRadius: 6, padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.875rem', color: '#10b981', marginBottom: '0.5rem' }}>{w.command}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{w.why}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>🚀 Advanced Debugging Tools</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {advancedTools.map((t, idx) => (
            <div key={idx} style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', marginTop: 0 }}>{t.tool}</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>{t.description}</p>
              <div style={{ background: '#0f172a', borderRadius: 6, padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.875rem', color: '#10b981', marginBottom: '0.75rem' }}>{t.command}</div>
              <div style={{ background: 'rgba(245,158,11,0.12)', borderLeft: '4px solid #f59e0b', padding: '0.75rem', borderRadius: 4, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                <strong>Use Case:</strong> {t.useCase}
              </div>
            </div>
          ))}
        </div>
      </section>
    </ModuleShell>
  );
}
