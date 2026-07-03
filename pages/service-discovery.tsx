import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import type { CSSProperties } from 'react';
import styles from '../styles/Home.module.css';
import { randomInt } from '../lib/random';

interface SimPod {
  name: string;
  ip: string;
  app: 'web' | 'api' | 'cache';
  ready: boolean;
}

const APPS = ['web', 'api', 'cache'] as const;
const APP_COLORS: Record<string, string> = { web: '#3b82f6', api: '#a855f7', cache: '#f59e0b' };

const initialPods: SimPod[] = [
  { name: 'web-7f9c-x2k4p', ip: '10.244.1.5', app: 'web', ready: true },
  { name: 'web-7f9c-m8n3q', ip: '10.244.2.7', app: 'web', ready: true },
  { name: 'web-7f9c-r5t1w', ip: '10.244.3.2', app: 'web', ready: false },
  { name: 'api-6b8d-h4j7l', ip: '10.244.1.9', app: 'api', ready: true },
  { name: 'api-6b8d-p2q9s', ip: '10.244.2.3', app: 'api', ready: true },
  { name: 'cache-5c7e-z6v8b', ip: '10.244.3.6', app: 'cache', ready: true },
];

export default function ServiceDiscovery() {
  const [pods, setPods] = useState<SimPod[]>(initialPods);
  const [selector, setSelector] = useState<'web' | 'api' | 'cache'>('web');
  const [lastHit, setLastHit] = useState<string | null>(null);
  const [requestLog, setRequestLog] = useState<string[]>([]);

  const endpoints = pods.filter((p) => p.app === selector && p.ready);

  const setApp = (name: string, app: SimPod['app']) =>
    setPods((prev) => prev.map((p) => (p.name === name ? { ...p, app } : p)));
  const toggleReady = (name: string) =>
    setPods((prev) => prev.map((p) => (p.name === name ? { ...p, ready: !p.ready } : p)));

  const sendRequest = () => {
    if (endpoints.length === 0) {
      setLastHit(null);
      setRequestLog((log) =>
        [`✗ curl http://${selector}-svc → connection refused (Service has no endpoints)`, ...log].slice(0, 6)
      );
      return;
    }
    const target = endpoints[randomInt(endpoints.length)];
    setLastHit(target.name);
    setRequestLog((log) =>
      [`✓ curl http://${selector}-svc → routed to ${target.name} (${target.ip})`, ...log].slice(0, 6)
    );
  };

  const chip = (active: boolean, color = '#dc2626'): CSSProperties => ({
    padding: '5px 12px',
    borderRadius: 999,
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: active ? `1px solid ${color}` : '1px solid rgba(148, 163, 184, 0.3)',
    background: active ? `${color}30` : 'transparent',
    color: active ? color : '#94a3b8',
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Service Discovery | KubeLearn</title>
        <meta name="description" content="Visualize how Kubernetes Services select Pods by label and load-balance traffic" />
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
            <Link href="/kubectl-cheatsheet" className={styles.navLink}>
              Cheat Sheet
            </Link>
          </div>
        </div>
      </nav>

      <main className={styles.main} style={{ maxWidth: 1100, margin: '0 auto', paddingTop: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}></span>
            Interactive Lab
          </div>
          <h1 className={styles.title}>
            Service <span className={styles.titleAccent}>Discovery</span>
          </h1>
          <p className={styles.subtitle}>
            A Service is just a label selector with a stable address. Change Pod labels and readiness
            below, and watch the endpoint list — and the traffic — follow. Companion to Modules 2.3 and 6.1.
          </p>
        </div>

        {/* Service definition */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderRadius: 12,
            border: '2px solid rgba(220, 38, 38, 0.4)',
            background: 'rgba(30, 41, 59, 0.6)',
            marginBottom: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Service
            </div>
            <div style={{ fontFamily: 'monospace', color: '#f8fafc', fontSize: '1.05rem', fontWeight: 700 }}>
              {selector}-svc
            </div>
            <div style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '0.78rem' }}>
              {selector}-svc.default.svc.cluster.local → 10.96.0.{selector === 'web' ? 10 : selector === 'api' ? 11 : 12}
            </div>
          </div>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: 6 }}>
              selector: <span style={{ fontFamily: 'monospace' }}>app=</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {APPS.map((a) => (
                <button key={a} style={chip(selector === a, APP_COLORS[a])} onClick={() => { setSelector(a); setLastHit(null); }}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: 6 }}>
              endpoints: <strong style={{ color: endpoints.length ? '#22c55e' : '#ef4444' }}>{endpoints.length}</strong>
            </div>
            <button
              onClick={sendRequest}
              style={{
                padding: '10px 22px',
                borderRadius: 8,
                border: 'none',
                background: '#9c0606',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              ⚡ Send request
            </button>
          </div>
        </div>

        {/* Pods */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {pods.map((pod) => {
            const isEndpoint = pod.app === selector && pod.ready;
            const wasHit = lastHit === pod.name;
            return (
              <div
                key={pod.name}
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: 12,
                  border: wasHit
                    ? '2px solid #22c55e'
                    : isEndpoint
                      ? '2px solid rgba(34, 197, 94, 0.45)'
                      : '2px solid rgba(148, 163, 184, 0.2)',
                  background: wasHit ? 'rgba(34, 197, 94, 0.12)' : 'rgba(30, 41, 59, 0.5)',
                  opacity: isEndpoint ? 1 : 0.75,
                  transition: 'all 0.25s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'monospace', color: '#f8fafc', fontSize: '0.85rem', fontWeight: 700 }}>
                    📦 {pod.name}
                  </span>
                  {isEndpoint && (
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#22c55e' }}>
                      {wasHit ? '⚡ HIT' : '● endpoint'}
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '0.75rem', marginTop: 2 }}>
                  {pod.ip}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontFamily: 'monospace' }}>app=</span>
                  {APPS.map((a) => (
                    <button key={a} style={chip(pod.app === a, APP_COLORS[a])} onClick={() => setApp(pod.name, a)}>
                      {a}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => toggleReady(pod.name)}
                  style={{
                    marginTop: '0.75rem',
                    padding: '4px 12px',
                    borderRadius: 999,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: pod.ready ? '1px solid rgba(34, 197, 94, 0.5)' : '1px solid rgba(239, 68, 68, 0.5)',
                    background: pod.ready ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                    color: pod.ready ? '#22c55e' : '#ef4444',
                  }}
                >
                  {pod.ready ? '✓ Ready' : '✗ NotReady — click to fix'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Request log */}
        {requestLog.length > 0 && (
          <div
            data-codecopy="skip"
            style={{
              marginTop: '1.5rem',
              padding: '1rem 1.25rem',
              borderRadius: 10,
              background: '#0f172a',
              border: '1px solid rgba(148, 163, 184, 0.15)',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              lineHeight: 1.8,
            }}
          >
            {requestLog.map((line, i) => (
              <div key={i} style={{ color: line.startsWith('✓') ? '#86efac' : '#fca5a5', opacity: i === 0 ? 1 : 0.55 }}>
                {line}
              </div>
            ))}
          </div>
        )}

        {/* Teaching notes */}
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem 1.25rem',
            borderRadius: 10,
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            color: '#bfdbfe',
            fontSize: '0.87rem',
            lineHeight: 1.7,
          }}
        >
          💡 Things to try: relabel a <strong>web</strong> Pod to <strong>api</strong> and watch it silently
          drop out of the endpoint list — label typos are a classic "Service returns connection refused"
          bug. Mark all matching Pods NotReady and send a request. Notice the Service IP and DNS name never
          change while all of this churns — that stability is the whole point (
          <Link href="/module-2-3" style={{ color: '#93c5fd' }}>Module 2.3</Link>).
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
