import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function DebuggingKubernetes() {
  const [selectedCommand, setSelectedCommand] = useState<'describe' | 'logs' | 'exec' | 'events'>('describe')
  const [selectedIssue, setSelectedIssue] = useState<'crashloop' | 'pending' | 'imagepull' | 'networking'>('crashloop')

  const commands = {
    describe: {
      name: 'kubectl describe',
      icon: '🔍',
      description: 'Shows detailed info about a resource. The first place to look when something is wrong.',
      useCase: 'Pod won\'t start? Describe it. You\'ll see events, conditions, and error messages.',
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
      whatToLook: ['Events at bottom', 'Container State (Running/Waiting/Terminated)', 'Exit Code', 'Conditions', 'Resource requests/limits']
    },
    logs: {
      name: 'kubectl logs',
      icon: '📋',
      description: 'Shows stdout/stderr from your container. What did the app actually say before it died?',
      useCase: 'Pod is crashing? Read the logs. Stack traces, error messages, panic logs all here.',
      example: 'kubectl logs frontend-7b8f9d-xk2p9 --previous',
      output: `Starting application...
Connecting to database at postgres://db:5432
Error: getaddrinfo ENOTFOUND db
    at GetAddrInfoReqWrap.onlookup [as oncomplete]
Process exiting with code 1`,
      whatToLook: ['Error messages', 'Stack traces', 'Last few lines before crash', 'Connection errors', 'Missing env vars']
    },
    exec: {
      name: 'kubectl exec',
      icon: '💻',
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
      whatToLook: ['Can you curl internal services?', 'Are env vars set correctly?', 'Are files mounted?', 'DNS resolution working?', 'Disk space full?']
    },
    events: {
      name: 'kubectl get events',
      icon: '📰',
      description: 'Cluster-wide event log. The crime scene tape. Shows what happened when and why.',
      useCase: 'Something failed but you don\'t know what? Events show scheduling, pulling, starting.',
      example: 'kubectl get events --sort-by=.lastTimestamp',
      output: `LAST SEEN   TYPE      REASON              OBJECT                     MESSAGE
2m          Warning   FailedScheduling    pod/db-abc123              0/3 nodes available: insufficient memory
2m          Normal    Pulling             pod/frontend-xyz789        Pulling image "frontend:v1.2.3"
1m          Warning   Failed              pod/frontend-xyz789        Failed to pull image: 404 not found
1m          Warning   BackOff             pod/frontend-xyz789        Back-off restarting failed container
30s         Normal    Killing             pod/old-pod-456            Stopping container`,
      whatToLook: ['FailedScheduling (no resources)', 'ImagePullBackOff (wrong tag)', 'Unhealthy (liveness probe failing)', 'BackOff (crashing)', 'Evicted (out of memory)']
    }
  }

  const issues = {
    crashloop: {
      name: 'CrashLoopBackOff',
      description: 'Pod starts, crashes, Kubernetes restarts it, crashes again. Infinite loop.',
      symptoms: ['Pod shows status "CrashLoopBackOff"', 'Restarts keep increasing', 'Pod never becomes Ready'],
      steps: [
        {
          step: '1. Check logs of crashed container',
          command: 'kubectl logs <pod-name> --previous',
          why: 'See what error caused the crash. Stack traces, connection errors, missing files.'
        },
        {
          step: '2. Describe the Pod',
          command: 'kubectl describe pod <pod-name>',
          why: 'Look at Events section. Shows exit codes, OOMKilled, etc.'
        },
        {
          step: '3. Check if it\'s an env var issue',
          command: 'kubectl get pod <pod-name> -o yaml | grep -A 10 env',
          why: 'Missing DATABASE_URL? Wrong API_KEY? App can\'t start without them.'
        },
        {
          step: '4. Verify the image exists',
          command: 'kubectl describe pod <pod-name> | grep Image',
          why: 'Typo in image tag? Wrong registry? Can\'t run what doesn\'t exist.'
        }
      ],
      commonCauses: [
        'Application code has a bug and exits immediately',
        'Missing required environment variables',
        'Can\'t connect to database (wrong hostname)',
        'Liveness probe failing immediately (misconfigured)',
        'Out of memory (OOMKilled)',
        'Wrong command in Dockerfile/Pod spec'
      ]
    },
    pending: {
      name: 'Pod Stuck in Pending',
      description: 'Kubernetes can\'t schedule the Pod. Not enough resources, node selector issues, etc.',
      symptoms: ['Pod status shows "Pending" forever', 'No container ever starts', 'Events show "FailedScheduling"'],
      steps: [
        {
          step: '1. Describe the Pod',
          command: 'kubectl describe pod <pod-name>',
          why: 'Events will tell you exactly why it can\'t schedule: no CPU, no memory, wrong node.'
        },
        {
          step: '2. Check node resources',
          command: 'kubectl top nodes',
          why: 'Are all nodes maxed out? Need more capacity or smaller resource requests.'
        },
        {
          step: '3. Look at Pod resource requests',
          command: 'kubectl get pod <pod-name> -o yaml | grep -A 5 resources',
          why: 'Requesting 32GB RAM? No node has that. Lower your requests.'
        },
        {
          step: '4. Check node selectors',
          command: 'kubectl get pod <pod-name> -o yaml | grep -A 3 nodeSelector',
          why: 'nodeSelector: gpu: true but no nodes have that label? Won\'t schedule.'
        }
      ],
      commonCauses: [
        'Insufficient CPU/memory on all nodes',
        'Pod requests more than any single node has',
        'Node selector or affinity rules exclude all nodes',
        'Taints on all nodes, no matching tolerations',
        'PersistentVolume not available',
        'Namespace ResourceQuota exceeded'
      ]
    },
    imagepull: {
      name: 'ImagePullBackOff',
      description: 'Kubernetes can\'t pull the container image. Wrong tag, private registry, or network issue.',
      symptoms: ['Pod status shows "ImagePullBackOff" or "ErrImagePull"', 'Events show "Failed to pull image"', 'Image pull takes forever'],
      steps: [
        {
          step: '1. Describe the Pod',
          command: 'kubectl describe pod <pod-name>',
          why: 'Events show exact error: 404 not found, 401 unauthorized, timeout.'
        },
        {
          step: '2. Verify image exists',
          command: 'docker pull <image-name>',
          why: 'Can you pull it locally? Typo in tag? Does it actually exist?'
        },
        {
          step: '3. Check image pull secrets',
          command: 'kubectl get pod <pod-name> -o yaml | grep imagePullSecrets',
          why: 'Private registry needs credentials. Did you create the secret?'
        },
        {
          step: '4. Test registry connectivity',
          command: 'kubectl run test --image=busybox -it --rm -- wget -O- https://registry.example.com',
          why: 'Can Pods reach your private registry? Firewall blocking?'
        }
      ],
      commonCauses: [
        'Image tag doesn\'t exist (typo: v1.2.3 vs v1.2.4)',
        'Private registry missing imagePullSecrets',
        'Wrong registry URL (gcr.io vs docker.io)',
        'Registry is down or unreachable',
        'Rate limit exceeded (Docker Hub)',
        'Network policy blocking registry access'
      ]
    },
    networking: {
      name: 'Networking Issues',
      description: 'Pods can\'t talk to each other, external services, or the internet.',
      symptoms: ['Curl timeouts', 'Connection refused', 'DNS resolution failing', 'Services unreachable'],
      steps: [
        {
          step: '1. Test DNS resolution',
          command: 'kubectl exec -it <pod> -- nslookup backend',
          why: 'Can Pod resolve service names? If not, CoreDNS is broken or unreachable.'
        },
        {
          step: '2. Test Service connectivity',
          command: 'kubectl exec -it <pod> -- curl http://backend:3000',
          why: 'DNS works but curl fails? Service endpoints might be empty.'
        },
        {
          step: '3. Check Service endpoints',
          command: 'kubectl get endpoints backend',
          why: 'No endpoints? Service selector doesn\'t match any Pods.'
        },
        {
          step: '4. Verify NetworkPolicies',
          command: 'kubectl get networkpolicies',
          why: 'NetworkPolicy denying traffic? Check ingress/egress rules.'
        },
        {
          step: '5. Test external connectivity',
          command: 'kubectl exec -it <pod> -- curl https://google.com',
          why: 'Can\'t reach internet? Egress NetworkPolicy or no NAT gateway.'
        }
      ],
      commonCauses: [
        'Service selector doesn\'t match Pod labels',
        'NetworkPolicy blocking traffic',
        'Wrong port (Service: 80, Pod: 3000)',
        'CoreDNS not running or unhealthy',
        'CNI plugin issues (Calico/Flannel broken)',
        'Firewall rules blocking traffic',
        'Pod in different namespace (use FQDN)'
      ]
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>8.3 Debugging Kubernetes - Kubernetes Learning</title>
      </Head>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/learning-modules" legacyBehavior>
            <a style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem' }}>
              ← Back to Learning Modules
            </a>
          </Link>
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
            8.3 Debugging Kubernetes
          </h1>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <Link href="/module-8-2" legacyBehavior>
              <a style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>
                ← Previous: Metrics & Monitoring
              </a>
            </Link>
            <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
            <Link href="/learning-modules" legacyBehavior>
              <a style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>
                All Modules
              </a>
            </Link>
            <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
            <Link href="/module-9-1" legacyBehavior>
              <a style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>
                Next: Deploying the Right Way →
              </a>
            </Link>
          </div>
          
          <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.6 }}>
            Something's broken. Pods won't start, services won't connect, everything's on fire.
            Don't panic. Kubernetes tells you exactly what's wrong—if you know where to look.
            These four commands will solve 95% of your problems: describe, logs, exec, and events.
          </p>
        </div>

        {/* Command Explorer */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
            🛠️ Essential Debugging Commands
          </h2>

          {/* Command Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {(Object.keys(commands) as Array<keyof typeof commands>).map(cmd => (
              <button
                key={cmd}
                onClick={() => setSelectedCommand(cmd)}
                style={{
                  padding: '1rem',
                  background: selectedCommand === cmd ? '#9c0606' : '#f8fafc',
                  color: selectedCommand === cmd ? 'white' : '#1e293b',
                  border: selectedCommand === cmd ? 'none' : '2px solid #e2e8f0',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                  {commands[cmd].icon}
                </div>
                <div>{commands[cmd].name}</div>
              </button>
            ))}
          </div>

          {/* Command Details */}
          <div style={{
            background: '#f8fafc',
            border: '2px solid #e2e8f0',
            borderRadius: 8,
            padding: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem' }}>
              {commands[selectedCommand].icon} {commands[selectedCommand].name}
            </h3>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>
              {commands[selectedCommand].description}
            </p>
            <div style={{
              background: '#fef3c7',
              borderLeft: '4px solid #f59e0b',
              padding: '1rem',
              borderRadius: 4,
              marginBottom: '1rem'
            }}>
              <strong style={{ color: '#92400e' }}>Use Case:</strong>
              <p style={{ color: '#92400e', margin: '0.5rem 0 0 0' }}>
                {commands[selectedCommand].useCase}
              </p>
            </div>

            {/* Command Example */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ 
                fontSize: '0.875rem', 
                color: '#64748b', 
                marginBottom: '0.5rem',
                fontWeight: 600
              }}>
                EXAMPLE COMMAND:
              </div>
              <div style={{
                background: '#1e293b',
                borderRadius: 6,
                padding: '1rem',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                color: '#10b981'
              }}>
                $ {commands[selectedCommand].example}
              </div>
            </div>

            {/* Sample Output */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ 
                fontSize: '0.875rem', 
                color: '#64748b', 
                marginBottom: '0.5rem',
                fontWeight: 600
              }}>
                SAMPLE OUTPUT:
              </div>
              <div style={{
                background: '#1e293b',
                borderRadius: 6,
                padding: '1rem',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                color: '#e2e8f0',
                maxHeight: 300,
                overflowY: 'auto'
              }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{commands[selectedCommand].output}</pre>
              </div>
            </div>

            {/* What to Look For */}
            <div>
              <div style={{ 
                fontSize: '0.875rem', 
                color: '#64748b', 
                marginBottom: '0.5rem',
                fontWeight: 600
              }}>
                WHAT TO LOOK FOR:
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#64748b' }}>
                {commands[selectedCommand].whatToLook.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '0.25rem' }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Common Issues Troubleshooter */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
            🔧 Common Issues & How to Fix Them
          </h2>

          {/* Issue Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {(Object.keys(issues) as Array<keyof typeof issues>).map(issue => (
              <button
                key={issue}
                onClick={() => setSelectedIssue(issue)}
                style={{
                  padding: '1rem',
                  background: selectedIssue === issue ? '#ef4444' : '#f8fafc',
                  color: selectedIssue === issue ? 'white' : '#1e293b',
                  border: selectedIssue === issue ? 'none' : '2px solid #e2e8f0',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                {issues[issue].name}
              </button>
            ))}
          </div>

          {/* Issue Details */}
          <div style={{
            background: '#f8fafc',
            border: '2px solid #e2e8f0',
            borderRadius: 8,
            padding: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem' }}>
              🔥 {issues[selectedIssue].name}
            </h3>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>
              {issues[selectedIssue].description}
            </p>

            {/* Symptoms */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
                Symptoms:
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#64748b' }}>
                {issues[selectedIssue].symptoms.map((symptom, idx) => (
                  <li key={idx} style={{ marginBottom: '0.25rem' }}>{symptom}</li>
                ))}
              </ul>
            </div>

            {/* Debugging Steps */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem' }}>
                Debugging Steps:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {issues[selectedIssue].steps.map((step, idx) => (
                  <div key={idx} style={{
                    background: 'white',
                    border: '2px solid #e2e8f0',
                    borderRadius: 8,
                    padding: '1rem'
                  }}>
                    <div style={{ fontWeight: 600, color: '#9c0606', marginBottom: '0.5rem' }}>
                      {step.step}
                    </div>
                    <div style={{
                      background: '#1e293b',
                      borderRadius: 6,
                      padding: '0.75rem',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      color: '#10b981',
                      marginBottom: '0.5rem'
                    }}>
                      {step.command}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                      <strong style={{ color: '#1e293b' }}>Why:</strong> {step.why}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Causes */}
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem' }}>
                Common Causes:
              </h4>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {issues[selectedIssue].commonCauses.map((cause, idx) => (
                  <div key={idx} style={{
                    background: '#fef2f2',
                    border: '2px solid #fecaca',
                    borderRadius: 6,
                    padding: '0.75rem',
                    color: '#991b1b',
                    fontSize: '0.9rem'
                  }}>
                    • {cause}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reading Events Like a Crime Scene */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
            🕵️ Reading Events Like a Crime Scene
          </h2>

          <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Events are Kubernetes' way of telling you what happened. They're like security camera footage—
            timestamped, specific, and they tell a story. Learn to read them chronologically to understand
            what went wrong.
          </p>

          <div style={{
            background: '#f8fafc',
            border: '2px solid #e2e8f0',
            borderRadius: 8,
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>
              Example Crime Scene:
            </h3>
            <div style={{
              background: '#1e293b',
              borderRadius: 6,
              padding: '1rem',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              color: '#e2e8f0',
              marginBottom: '1rem'
            }}>
              <pre style={{ margin: 0 }}>{`LAST SEEN   TYPE      REASON              MESSAGE
---------   ----      ------              -------
5m          Normal    Scheduled           Successfully assigned to worker-01
5m          Normal    Pulling             Pulling image "frontend:v1.2.3"
4m          Warning   Failed              Failed to pull image: manifest unknown
4m          Warning   Failed              Error: ErrImagePull
3m          Normal    BackOff             Back-off pulling image "frontend:v1.2.3"
2m          Warning   Failed              Error: ImagePullBackOff`}</pre>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
                Reading the Story:
              </h4>
              <ol style={{ paddingLeft: '1.5rem', color: '#64748b', lineHeight: 1.8 }}>
                <li><strong style={{ color: '#10b981' }}>5m ago: Scheduled</strong> - Kubernetes found a node with capacity ✓</li>
                <li><strong style={{ color: '#10b981' }}>5m ago: Pulling</strong> - Started downloading the image ✓</li>
                <li><strong style={{ color: '#ef4444' }}>4m ago: Failed</strong> - Image doesn't exist! Tag v1.2.3 is wrong ✗</li>
                <li><strong style={{ color: '#f59e0b' }}>3m ago: BackOff</strong> - Kubernetes is waiting before retrying</li>
                <li><strong style={{ color: '#ef4444' }}>2m ago: ImagePullBackOff</strong> - Still can't pull, gave up ✗</li>
              </ol>
            </div>

            <div style={{
              background: '#dcfce7',
              borderLeft: '4px solid #10b981',
              padding: '1rem',
              borderRadius: 4
            }}>
              <strong style={{ color: '#166534' }}>🔍 Diagnosis:</strong>
              <p style={{ color: '#166534', margin: '0.5rem 0 0 0' }}>
                Image tag is wrong. Check your deployment YAML, fix the tag, and redeploy.
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>
              Event Types to Know:
            </h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {[
                { type: 'Normal', color: '#10b981', examples: 'Scheduled, Pulling, Pulled, Created, Started' },
                { type: 'Warning', color: '#f59e0b', examples: 'BackOff, Unhealthy, FailedMount' },
                { type: 'Error', color: '#ef4444', examples: 'Failed, Killing, FailedScheduling, Evicted' }
              ].map((eventType, idx) => (
                <div key={idx} style={{
                  background: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderLeft: `4px solid ${eventType.color}`,
                  borderRadius: 8,
                  padding: '1rem'
                }}>
                  <div style={{ fontWeight: 600, color: eventType.color, marginBottom: '0.25rem' }}>
                    {eventType.type}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                    {eventType.examples}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: '#fef3c7',
            border: '2px solid #fcd34d',
            borderRadius: 8,
            padding: '1.5rem'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#92400e' }}>💡 Pro Tip:</h4>
            <p style={{ color: '#92400e', margin: 0 }}>
              Events expire after 1 hour by default. If something broke last night, events are gone.
              That's why centralized logging matters. Events tell you what, logs tell you why.
            </p>
          </div>
        </div>

        {/* Quick Reference */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
            📋 Quick Reference: Debug Workflow
          </h2>

          <div style={{
            background: '#f8fafc',
            border: '2px solid #e2e8f0',
            borderRadius: 8,
            padding: '1.5rem'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 600, color: '#9c0606', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                Step 1: Identify the Problem
              </div>
              <div style={{
                background: '#1e293b',
                borderRadius: 6,
                padding: '0.75rem',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                color: '#10b981',
                marginBottom: '0.5rem'
              }}>
                kubectl get pods
              </div>
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                Which Pod is broken? Look for CrashLoopBackOff, Pending, Error, ImagePullBackOff
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 600, color: '#9c0606', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                Step 2: Describe It
              </div>
              <div style={{
                background: '#1e293b',
                borderRadius: 6,
                padding: '0.75rem',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                color: '#10b981',
                marginBottom: '0.5rem'
              }}>
                kubectl describe pod {"<pod-name>"}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                Read the Events at the bottom. They tell you what went wrong.
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 600, color: '#9c0606', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                Step 3: Read the Logs
              </div>
              <div style={{
                background: '#1e293b',
                borderRadius: 6,
                padding: '0.75rem',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                color: '#10b981',
                marginBottom: '0.5rem'
              }}>
                kubectl logs {"<pod-name>"} --previous
              </div>
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                See what the app said before it crashed. Stack traces, errors, connection failures.
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 600, color: '#9c0606', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                Step 4: Exec Into It (if running)
              </div>
              <div style={{
                background: '#1e293b',
                borderRadius: 6,
                padding: '0.75rem',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                color: '#10b981',
                marginBottom: '0.5rem'
              }}>
                kubectl exec -it {"<pod-name>"} -- /bin/sh
              </div>
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                Test network connectivity, check env vars, verify files are mounted.
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 600, color: '#9c0606', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                Step 5: Check Cluster Events
              </div>
              <div style={{
                background: '#1e293b',
                borderRadius: 6,
                padding: '0.75rem',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                color: '#10b981',
                marginBottom: '0.5rem'
              }}>
                kubectl get events --sort-by=.lastTimestamp
              </div>
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                See cluster-wide issues: scheduling failures, node problems, resource constraints.
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Debugging Tools */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
            🚀 Advanced Debugging Tools
          </h2>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              {
                tool: 'kubectl run netshoot',
                description: 'Spin up a network debugging Pod with curl, dig, nslookup, etc.',
                command: 'kubectl run netshoot --image=nicolaka/netshoot -it --rm -- /bin/bash',
                useCase: 'Test network connectivity, DNS resolution, service reachability'
              },
              {
                tool: 'kubectl port-forward',
                description: 'Forward a local port to a Pod. Access services without Ingress.',
                command: 'kubectl port-forward pod/frontend-abc 8080:80',
                useCase: 'Debug a service locally, test APIs without exposing them'
              },
              {
                tool: 'kubectl top',
                description: 'See real-time CPU and memory usage for nodes and Pods.',
                command: 'kubectl top pods --all-namespaces --sort-by=memory',
                useCase: 'Find memory leaks, identify resource hogs'
              },
              {
                tool: 'kubectl diff',
                description: 'Preview what would change before applying a YAML file.',
                command: 'kubectl diff -f deployment.yaml',
                useCase: 'Avoid breaking production by seeing changes first'
              },
              {
                tool: 'kubectl debug',
                description: 'Create an ephemeral debug container in a running Pod.',
                command: 'kubectl debug -it pod/frontend-abc --image=busybox',
                useCase: 'Debug distroless images with no shell'
              }
            ].map((tool, idx) => (
              <div key={idx} style={{
                background: '#f8fafc',
                border: '2px solid #e2e8f0',
                borderRadius: 8,
                padding: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
                  {tool.tool}
                </h3>
                <p style={{ color: '#64748b', marginBottom: '0.75rem' }}>
                  {tool.description}
                </p>
                <div style={{
                  background: '#1e293b',
                  borderRadius: 6,
                  padding: '0.75rem',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  color: '#10b981',
                  marginBottom: '0.75rem'
                }}>
                  {tool.command}
                </div>
                <div style={{
                  background: '#fef3c7',
                  borderLeft: '4px solid #f59e0b',
                  padding: '0.75rem',
                  borderRadius: 4,
                  fontSize: '0.9rem',
                  color: '#92400e'
                }}>
                  <strong>Use Case:</strong> {tool.useCase}
                </div>
              </div>
            ))}
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
          <Link href="/module-8-2" legacyBehavior>
            <a style={{
              padding: '0.75rem 1.5rem',
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: 8,
              color: '#1e293b',
              textDecoration: 'none',
              fontWeight: 600
            }}>
              ← 8.2 Monitoring
            </a>
          </Link>
          <Link href="/learning-modules" legacyBehavior>
            <a style={{
              padding: '0.75rem 1.5rem',
              background: '#9c0606',
              borderRadius: 8,
              color: 'white',
              textDecoration: 'none',
              fontWeight: 600
            }}>
              Back to Modules →
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}
