import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

interface EnvVar {
  key: string;
  value: string;
}

const NAME_RE = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;
const CPU_RE = /^(\d+m|\d+(\.\d+)?)$/;
const MEM_RE = /^\d+(Ki|Mi|Gi|Ti|k|M|G|T)?$/;

const PRESET_IMAGES = ['nginx:1.27', 'httpd:2.4', 'redis:7.4', 'node:22-alpine', 'python:3.12-slim', 'busybox:1.37'];

export default function PodBuilder() {
  const [kind, setKind] = useState<'Pod' | 'Deployment'>('Pod');
  const [name, setName] = useState('my-app');
  const [image, setImage] = useState('nginx:1.27');
  const [port, setPort] = useState('80');
  const [replicas, setReplicas] = useState('3');
  const [envVars, setEnvVars] = useState<EnvVar[]>([]);
  const [cpuRequest, setCpuRequest] = useState('100m');
  const [memRequest, setMemRequest] = useState('128Mi');
  const [cpuLimit, setCpuLimit] = useState('500m');
  const [memLimit, setMemLimit] = useState('256Mi');
  const [addResources, setAddResources] = useState(true);
  const [copied, setCopied] = useState(false);

  // --- validation hints ---
  const hints: { level: 'error' | 'warn'; text: string }[] = [];
  if (!NAME_RE.test(name) || name.length > 63) {
    hints.push({
      level: 'error',
      text: 'Name must be lowercase alphanumeric with dashes (RFC 1123), max 63 chars — e.g. "my-app". Kubernetes will reject anything else.',
    });
  }
  if (image.trim() === '') {
    hints.push({ level: 'error', text: 'Image is required — a Pod without an image has nothing to run.' });
  } else if (!image.includes(':')) {
    hints.push({
      level: 'warn',
      text: 'No image tag specified — this implicitly means :latest. Pin a specific tag so you always know what is running (see Module 9.1).',
    });
  } else if (image.endsWith(':latest')) {
    hints.push({
      level: 'warn',
      text: 'The :latest tag is mutable — deploys become unreproducible and rollbacks meaningless. Use a version tag like nginx:1.27 (see Module 9.1).',
    });
  }
  const portNum = Number(port);
  if (port !== '' && (!Number.isInteger(portNum) || portNum < 1 || portNum > 65535)) {
    hints.push({ level: 'error', text: 'containerPort must be an integer between 1 and 65535.' });
  }
  if (kind === 'Deployment') {
    const r = Number(replicas);
    if (!Number.isInteger(r) || r < 0) {
      hints.push({ level: 'error', text: 'Replicas must be a whole number (0 or more).' });
    } else if (r === 1) {
      hints.push({
        level: 'warn',
        text: '1 replica means zero redundancy — if the Pod dies, your app is down until it restarts. Consider 2+.',
      });
    }
  }
  if (addResources) {
    if (!CPU_RE.test(cpuRequest) || !CPU_RE.test(cpuLimit)) {
      hints.push({ level: 'error', text: 'CPU values look wrong — use millicores like "100m" or whole cores like "1" (see Module 4.1).' });
    }
    if (!MEM_RE.test(memRequest) || !MEM_RE.test(memLimit)) {
      hints.push({ level: 'error', text: 'Memory values look wrong — use units like "128Mi" or "1Gi" (see Module 4.1).' });
    }
  } else {
    hints.push({
      level: 'warn',
      text: 'No resource requests/limits: this Pod gets BestEffort QoS — first to be evicted under node pressure, and the scheduler can overpack nodes (see Module 4.1).',
    });
  }
  envVars.forEach((ev, i) => {
    if (ev.key !== '' && !/^[A-Za-z_][A-Za-z0-9_]*$/.test(ev.key)) {
      hints.push({ level: 'error', text: `Env var #${i + 1}: "${ev.key}" is not a valid variable name (letters, digits, underscores; cannot start with a digit).` });
    }
    if (/password|secret|token|key/i.test(ev.key)) {
      hints.push({
        level: 'warn',
        text: `Env var "${ev.key}" looks sensitive — plain env vars are visible to anyone who can read the manifest. Use a Secret instead (see Module 3.2).`,
      });
    }
  });
  const hasErrors = hints.some((h) => h.level === 'error');

  // --- YAML generation ---
  const indent = (level: number) => '  '.repeat(level);
  const containerLines = (base: number) => {
    const lines = [
      `${indent(base)}- name: ${name || 'app'}`,
      `${indent(base)}  image: ${image || 'IMAGE_REQUIRED'}`,
    ];
    if (port !== '') {
      lines.push(`${indent(base)}  ports:`);
      lines.push(`${indent(base)}    - containerPort: ${port}`);
    }
    const validEnv = envVars.filter((ev) => ev.key !== '');
    if (validEnv.length > 0) {
      lines.push(`${indent(base)}  env:`);
      validEnv.forEach((ev) => {
        lines.push(`${indent(base)}    - name: ${ev.key}`);
        lines.push(`${indent(base)}      value: "${ev.value}"`);
      });
    }
    if (addResources) {
      lines.push(`${indent(base)}  resources:`);
      lines.push(`${indent(base)}    requests:`);
      lines.push(`${indent(base)}      cpu: ${cpuRequest}`);
      lines.push(`${indent(base)}      memory: ${memRequest}`);
      lines.push(`${indent(base)}    limits:`);
      lines.push(`${indent(base)}      cpu: ${cpuLimit}`);
      lines.push(`${indent(base)}      memory: ${memLimit}`);
    }
    return lines;
  };

  let yaml: string;
  if (kind === 'Pod') {
    yaml = [
      'apiVersion: v1',
      'kind: Pod',
      'metadata:',
      `  name: ${name || 'my-app'}`,
      '  labels:',
      `    app: ${name || 'my-app'}`,
      'spec:',
      '  containers:',
      ...containerLines(2),
    ].join('\n');
  } else {
    yaml = [
      'apiVersion: apps/v1',
      'kind: Deployment',
      'metadata:',
      `  name: ${name || 'my-app'}`,
      '  labels:',
      `    app: ${name || 'my-app'}`,
      'spec:',
      `  replicas: ${replicas || 1}`,
      '  selector:',
      '    matchLabels:',
      `      app: ${name || 'my-app'}`,
      '  template:',
      '    metadata:',
      '      labels:',
      `        app: ${name || 'my-app'}`,
      '    spec:',
      '      containers:',
      ...containerLines(4),
    ].join('\n');
  }

  const copyYaml = async () => {
    try {
      await navigator.clipboard.writeText(yaml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable (e.g. non-secure context) — nothing to do
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid rgba(148, 163, 184, 0.3)',
    background: 'rgba(15, 23, 42, 0.6)',
    color: '#f8fafc',
    fontSize: '0.95rem',
    outline: 'none',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: '#cbd5e1',
    fontSize: '0.85rem',
    fontWeight: 600,
    marginBottom: 6,
    marginTop: '1.1rem',
  };
  const toggleStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 20px',
    background: active ? '#9c0606' : 'rgba(51, 65, 85, 0.6)',
    color: active ? '#fff' : '#94a3b8',
    border: 'none',
    borderRadius: 8,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Pod Builder | KubeLearn</title>
        <meta name="description" content="Build Kubernetes Pod and Deployment manifests interactively with instant validation feedback" />
      </Head>

      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.navBrand}>
            <div className={styles.navLogo}>☸</div>
            <span className={styles.navTitle}>
              Kube<span className={styles.navTitleAccent}>Learn</span>
            </span>
          </Link>
          <div className={styles.navLinks}>
            <Link href="/learning-modules" className={styles.navLink}>
              Modules
            </Link>
            <Link href="/interactive-learning" className={`${styles.navLink} ${styles.navLinkActive}`}>
              Interactive
            </Link>
          </div>
        </div>
      </nav>

      <main className={styles.main} style={{ maxWidth: 1200, margin: '0 auto', paddingTop: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}></span>
            Interactive Lab
          </div>
          <h1 className={styles.title}>
            Pod <span className={styles.titleAccent}>Builder</span>
          </h1>
          <p className={styles.subtitle}>
            Configure a workload on the left, watch the manifest write itself on the right — with the same
            feedback a seasoned reviewer would give you.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.5rem',
            alignItems: 'start',
          }}
        >
          {/* ---- Left: form ---- */}
          <div
            style={{
              padding: '1.5rem',
              borderRadius: 12,
              border: '1px solid rgba(148, 163, 184, 0.2)',
              background: 'rgba(30, 41, 59, 0.5)',
            }}
          >
            <div style={{ display: 'flex', gap: 10, marginBottom: '0.5rem' }}>
              <button style={toggleStyle(kind === 'Pod')} onClick={() => setKind('Pod')}>
                Bare Pod
              </button>
              <button style={toggleStyle(kind === 'Deployment')} onClick={() => setKind('Deployment')}>
                Deployment
              </button>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.5 }}>
              {kind === 'Pod'
                ? 'A bare Pod is great for learning, but remember Module 2.1: nothing recreates it when it dies.'
                : 'A Deployment wraps your Pod in a ReplicaSet: self-healing, scaling, and rolling updates (Module 2.2).'}
            </p>

            <label style={labelStyle}>Name</label>
            <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} spellCheck={false} />

            <label style={labelStyle}>Container image</label>
            <input style={inputStyle} value={image} onChange={(e) => setImage(e.target.value)} spellCheck={false} list="preset-images" />
            <datalist id="preset-images">
              {PRESET_IMAGES.map((img) => (
                <option key={img} value={img} />
              ))}
            </datalist>
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {PRESET_IMAGES.map((img) => (
                <button
                  key={img}
                  onClick={() => setImage(img)}
                  style={{
                    padding: '3px 10px',
                    fontSize: '0.75rem',
                    borderRadius: 999,
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    background: image === img ? 'rgba(220, 38, 38, 0.2)' : 'transparent',
                    color: image === img ? '#fca5a5' : '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  {img}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: kind === 'Deployment' ? '1fr 1fr' : '1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Container port</label>
                <input style={inputStyle} value={port} onChange={(e) => setPort(e.target.value)} placeholder="e.g. 80 (optional)" spellCheck={false} />
              </div>
              {kind === 'Deployment' && (
                <div>
                  <label style={labelStyle}>Replicas</label>
                  <input style={inputStyle} value={replicas} onChange={(e) => setReplicas(e.target.value)} spellCheck={false} />
                </div>
              )}
            </div>

            <label style={labelStyle}>Environment variables</label>
            {envVars.map((ev, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder="NAME"
                  value={ev.key}
                  spellCheck={false}
                  onChange={(e) => setEnvVars(envVars.map((v, j) => (j === i ? { ...v, key: e.target.value } : v)))}
                />
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder="value"
                  value={ev.value}
                  spellCheck={false}
                  onChange={(e) => setEnvVars(envVars.map((v, j) => (j === i ? { ...v, value: e.target.value } : v)))}
                />
                <button
                  onClick={() => setEnvVars(envVars.filter((_, j) => j !== i))}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#f87171',
                    borderRadius: 8,
                    padding: '0 12px',
                    cursor: 'pointer',
                  }}
                  aria-label={`Remove env var ${i + 1}`}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => setEnvVars([...envVars, { key: '', value: '' }])}
              style={{
                background: 'transparent',
                border: '1px dashed rgba(148, 163, 184, 0.4)',
                color: '#94a3b8',
                borderRadius: 8,
                padding: '8px 14px',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              + Add env var
            </button>

            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={addResources} onChange={(e) => setAddResources(e.target.checked)} />
              Set resource requests &amp; limits (recommended)
            </label>
            {addResources && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ ...labelStyle, marginTop: '0.25rem' }}>CPU request / limit</label>
                  <input style={{ ...inputStyle, marginBottom: 8 }} value={cpuRequest} onChange={(e) => setCpuRequest(e.target.value)} spellCheck={false} />
                  <input style={inputStyle} value={cpuLimit} onChange={(e) => setCpuLimit(e.target.value)} spellCheck={false} />
                </div>
                <div>
                  <label style={{ ...labelStyle, marginTop: '0.25rem' }}>Memory request / limit</label>
                  <input style={{ ...inputStyle, marginBottom: 8 }} value={memRequest} onChange={(e) => setMemRequest(e.target.value)} spellCheck={false} />
                  <input style={inputStyle} value={memLimit} onChange={(e) => setMemLimit(e.target.value)} spellCheck={false} />
                </div>
              </div>
            )}
          </div>

          {/* ---- Right: YAML + hints ---- */}
          <div>
            <div
              style={{
                borderRadius: 12,
                border: hasErrors ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(148, 163, 184, 0.2)',
                background: '#0f172a',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 16px',
                  background: 'rgba(30, 41, 59, 0.8)',
                  borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
                }}
              >
                <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                  {name || 'my-app'}.yaml
                </span>
                <button
                  onClick={copyYaml}
                  style={{
                    background: copied ? 'rgba(34, 197, 94, 0.2)' : 'rgba(148, 163, 184, 0.15)',
                    border: 'none',
                    color: copied ? '#22c55e' : '#cbd5e1',
                    padding: '5px 14px',
                    borderRadius: 6,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {copied ? '✓ Copied' : '⧉ Copy'}
                </button>
              </div>
              <pre
                data-codecopy="skip"
                style={{
                  margin: 0,
                  padding: '1.25rem',
                  color: '#e2e8f0',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  lineHeight: 1.6,
                  overflowX: 'auto',
                }}
              >
                {yaml}
              </pre>
            </div>

            {hints.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                {hints.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '10px 14px',
                      marginBottom: 8,
                      borderRadius: 8,
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      background: h.level === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      border: h.level === 'error' ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(245, 158, 11, 0.35)',
                      color: h.level === 'error' ? '#fca5a5' : '#fcd34d',
                    }}
                  >
                    {h.level === 'error' ? '⛔ ' : '⚠️ '}
                    {h.text}
                  </div>
                ))}
              </div>
            )}
            {hints.length === 0 && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: '0.85rem',
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.35)',
                  color: '#86efac',
                }}
              >
                ✅ Looks good — this manifest would pass a review.
              </div>
            )}

            <div
              style={{
                marginTop: '1rem',
                padding: '1rem 1.25rem',
                borderRadius: 10,
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                color: '#bfdbfe',
                fontSize: '0.85rem',
                lineHeight: 1.7,
              }}
            >
              <strong>Try it on a real cluster:</strong>
              <div style={{ fontFamily: 'monospace', marginTop: 6, color: '#e2e8f0' }}>
                kubectl apply -f {name || 'my-app'}.yaml
                <br />
                kubectl get {kind === 'Pod' ? 'pod' : 'deployment'} {name || 'my-app'}
                <br />
                kubectl describe {kind === 'Pod' ? 'pod' : 'deployment'} {name || 'my-app'}
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', margin: '3rem 0 1rem' }}>
          <Link href="/interactive-learning" style={{ color: '#94a3b8', textDecoration: 'none' }}>
            ← Back to Interactive Labs
          </Link>
        </div>
      </main>
    </div>
  );
}
