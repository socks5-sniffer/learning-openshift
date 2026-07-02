import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import type { CSSProperties } from 'react';
import styles from '../styles/Home.module.css';

const RESOURCES = ['pods', 'deployments', 'services', 'configmaps', 'secrets', 'pods/log'];
const VERBS = ['get', 'list', 'watch', 'create', 'update', 'delete'];
const NAMESPACES = ['default', 'staging', 'production'];

export default function RbacSimulator() {
  // --- Role definition ---
  const [clusterWide, setClusterWide] = useState(false);
  const [roleName, setRoleName] = useState('app-developer');
  const [roleNamespace, setRoleNamespace] = useState('staging');
  const [allowedResources, setAllowedResources] = useState<string[]>(['pods', 'deployments', 'services']);
  const [allowedVerbs, setAllowedVerbs] = useState<string[]>(['get', 'list', 'watch']);

  // --- Binding ---
  const [subjectKind, setSubjectKind] = useState<'User' | 'ServiceAccount'>('User');
  const [subjectName, setSubjectName] = useState('dana');

  // --- can-i tester ---
  const [testSubject, setTestSubject] = useState('dana');
  const [testVerb, setTestVerb] = useState('list');
  const [testResource, setTestResource] = useState('pods');
  const [testNamespace, setTestNamespace] = useState('staging');

  const toggle = (list: string[], setList: (v: string[]) => void, item: string) =>
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

  // --- evaluation, mirroring how the API server authorizes a request ---
  const steps: { ok: boolean; text: string }[] = [];
  const subjectMatches = testSubject.trim() === subjectName.trim();
  steps.push({
    ok: subjectMatches,
    text: subjectMatches
      ? `The ${clusterWide ? 'ClusterRoleBinding' : 'RoleBinding'} grants "${roleName}" to ${subjectKind} "${subjectName}" — subject matches.`
      : `The binding is for ${subjectKind} "${subjectName}", but the request comes from "${testSubject || '(nobody)'}" — no binding, no permissions.`,
  });
  const namespaceMatches = clusterWide || testNamespace === roleNamespace;
  if (subjectMatches) {
    steps.push({
      ok: namespaceMatches,
      text: clusterWide
        ? 'ClusterRole + ClusterRoleBinding apply cluster-wide — every namespace is in scope.'
        : namespaceMatches
          ? `The Role and its binding live in namespace "${roleNamespace}" — the request targets it, so it is in scope.`
          : `The Role only exists in namespace "${roleNamespace}" — a request in "${testNamespace}" is outside its scope. Roles are namespaced.`,
    });
  }
  const resourceMatches = allowedResources.includes(testResource);
  if (subjectMatches && namespaceMatches) {
    steps.push({
      ok: resourceMatches,
      text: resourceMatches
        ? `"${testResource}" is listed in the role's resources.`
        : `"${testResource}" is not in the role's resources [${allowedResources.join(', ') || 'none'}]. RBAC is allow-list only — anything unlisted is denied.`,
    });
  }
  const verbMatches = allowedVerbs.includes(testVerb);
  if (subjectMatches && namespaceMatches && resourceMatches) {
    steps.push({
      ok: verbMatches,
      text: verbMatches
        ? `The verb "${testVerb}" is granted.`
        : `The role grants [${allowedVerbs.join(', ') || 'none'}] but not "${testVerb}". Read access does not imply write access.`,
    });
  }
  const allowed = subjectMatches && namespaceMatches && resourceMatches && verbMatches;

  // --- YAML ---
  const roleKind = clusterWide ? 'ClusterRole' : 'Role';
  const bindingKind = clusterWide ? 'ClusterRoleBinding' : 'RoleBinding';
  const nsLine = clusterWide ? '' : `\n  namespace: ${roleNamespace}`;
  const saNamespace = clusterWide ? 'default' : roleNamespace;
  const yaml = `apiVersion: rbac.authorization.k8s.io/v1
kind: ${roleKind}
metadata:
  name: ${roleName}${nsLine}
rules:
  - apiGroups: ["", "apps"]
    resources: [${allowedResources.map((r) => `"${r}"`).join(', ')}]
    verbs: [${allowedVerbs.map((v) => `"${v}"`).join(', ')}]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ${bindingKind}
metadata:
  name: ${roleName}-binding${nsLine}
subjects:
  - kind: ${subjectKind}
    name: ${subjectName}${subjectKind === 'ServiceAccount' ? `\n    namespace: ${saNamespace}` : `\n    apiGroup: rbac.authorization.k8s.io`}
roleRef:
  kind: ${roleKind}
  name: ${roleName}
  apiGroup: rbac.authorization.k8s.io`;

  const canICommand = `kubectl auth can-i ${testVerb} ${testResource} -n ${testNamespace} --as=${
    subjectKind === 'ServiceAccount' ? `system:serviceaccount:${saNamespace}:${testSubject}` : testSubject
  }`;

  const chip = (active: boolean): CSSProperties => ({
    padding: '5px 12px',
    borderRadius: 999,
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: active ? '1px solid rgba(220, 38, 38, 0.6)' : '1px solid rgba(148, 163, 184, 0.3)',
    background: active ? 'rgba(220, 38, 38, 0.18)' : 'transparent',
    color: active ? '#fca5a5' : '#94a3b8',
  });
  const inputStyle: CSSProperties = {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 8,
    border: '1px solid rgba(148, 163, 184, 0.3)',
    background: 'rgba(15, 23, 42, 0.6)',
    color: '#f8fafc',
    fontSize: '0.9rem',
    outline: 'none',
  };
  const labelStyle: CSSProperties = {
    display: 'block',
    color: '#cbd5e1',
    fontSize: '0.82rem',
    fontWeight: 600,
    marginBottom: 6,
    marginTop: '1rem',
  };
  const panelStyle: CSSProperties = {
    padding: '1.5rem',
    borderRadius: 12,
    border: '1px solid rgba(148, 163, 184, 0.2)',
    background: 'rgba(30, 41, 59, 0.5)',
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>RBAC Simulator | KubeLearn</title>
        <meta name="description" content="Build Roles and RoleBindings, then test permissions like kubectl auth can-i" />
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

      <main className={styles.main} style={{ maxWidth: 1200, margin: '0 auto', paddingTop: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}></span>
            Interactive Lab
          </div>
          <h1 className={styles.title}>
            RBAC <span className={styles.titleAccent}>Simulator</span>
          </h1>
          <p className={styles.subtitle}>
            Define a Role and a binding on the left, then fire permission checks at it — and see exactly
            where the API server says yes or no. Companion to Module 7.1.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
          {/* Role + binding definition */}
          <div style={panelStyle}>
            <h2 style={{ marginTop: 0, fontSize: '1.15rem', color: '#f8fafc' }}>1 · Define the {roleKind}</h2>

            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={clusterWide} onChange={(e) => setClusterWide(e.target.checked)} />
              ClusterRole (applies to every namespace)
            </label>

            <label style={labelStyle}>Role name</label>
            <input style={inputStyle} value={roleName} onChange={(e) => setRoleName(e.target.value)} spellCheck={false} />

            {!clusterWide && (
              <>
                <label style={labelStyle}>Namespace the Role lives in</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {NAMESPACES.map((ns) => (
                    <button key={ns} style={chip(roleNamespace === ns)} onClick={() => setRoleNamespace(ns)}>
                      {ns}
                    </button>
                  ))}
                </div>
              </>
            )}

            <label style={labelStyle}>Resources the role covers</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {RESOURCES.map((r) => (
                <button key={r} style={chip(allowedResources.includes(r))} onClick={() => toggle(allowedResources, setAllowedResources, r)}>
                  {r}
                </button>
              ))}
            </div>

            <label style={labelStyle}>Verbs it grants</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {VERBS.map((v) => (
                <button key={v} style={chip(allowedVerbs.includes(v))} onClick={() => toggle(allowedVerbs, setAllowedVerbs, v)}>
                  {v}
                </button>
              ))}
            </div>

            <h2 style={{ fontSize: '1.15rem', color: '#f8fafc', marginTop: '1.75rem' }}>2 · Bind it to someone</h2>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['User', 'ServiceAccount'] as const).map((k) => (
                <button key={k} style={chip(subjectKind === k)} onClick={() => setSubjectKind(k)}>
                  {k}
                </button>
              ))}
            </div>
            <label style={labelStyle}>{subjectKind} name</label>
            <input style={inputStyle} value={subjectName} onChange={(e) => setSubjectName(e.target.value)} spellCheck={false} />

            <pre
              style={{
                marginTop: '1.5rem',
                marginBottom: 0,
                padding: '1rem',
                borderRadius: 10,
                background: '#0f172a',
                border: '1px solid rgba(148, 163, 184, 0.15)',
                color: '#e2e8f0',
                fontFamily: 'monospace',
                fontSize: '0.78rem',
                lineHeight: 1.55,
                overflowX: 'auto',
              }}
            >
              {yaml}
            </pre>
          </div>

          {/* can-i tester */}
          <div style={panelStyle}>
            <h2 style={{ marginTop: 0, fontSize: '1.15rem', color: '#f8fafc' }}>3 · Test a permission</h2>

            <label style={labelStyle}>Requesting identity</label>
            <input style={inputStyle} value={testSubject} onChange={(e) => setTestSubject(e.target.value)} spellCheck={false} />

            <label style={labelStyle}>Wants to…</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {VERBS.map((v) => (
                <button key={v} style={chip(testVerb === v)} onClick={() => setTestVerb(v)}>
                  {v}
                </button>
              ))}
            </div>

            <label style={labelStyle}>…which resource</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {RESOURCES.map((r) => (
                <button key={r} style={chip(testResource === r)} onClick={() => setTestResource(r)}>
                  {r}
                </button>
              ))}
            </div>

            <label style={labelStyle}>…in namespace</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {NAMESPACES.map((ns) => (
                <button key={ns} style={chip(testNamespace === ns)} onClick={() => setTestNamespace(ns)}>
                  {ns}
                </button>
              ))}
            </div>

            <div
              style={{
                marginTop: '1.5rem',
                padding: '0.9rem 1rem',
                borderRadius: 8,
                background: '#0f172a',
                border: '1px solid rgba(148, 163, 184, 0.15)',
                fontFamily: 'monospace',
                fontSize: '0.78rem',
                color: '#94a3b8',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
              }}
              data-codecopy="skip"
            >
              $ {canICommand}
            </div>

            {/* verdict */}
            <div
              style={{
                marginTop: '1rem',
                padding: '1.1rem 1.25rem',
                borderRadius: 10,
                textAlign: 'center',
                fontSize: '1.35rem',
                fontWeight: 800,
                letterSpacing: '0.02em',
                background: allowed ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                border: allowed ? '2px solid rgba(34, 197, 94, 0.5)' : '2px solid rgba(239, 68, 68, 0.5)',
                color: allowed ? '#22c55e' : '#ef4444',
              }}
            >
              {allowed ? 'yes — ALLOWED' : 'no — DENIED'}
            </div>

            {/* decision trace */}
            <div style={{ marginTop: '1rem' }}>
              {steps.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 10,
                    padding: '9px 12px',
                    marginBottom: 6,
                    borderRadius: 8,
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                    background: s.ok ? 'rgba(34, 197, 94, 0.07)' : 'rgba(239, 68, 68, 0.07)',
                    border: s.ok ? '1px solid rgba(34, 197, 94, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)',
                    color: s.ok ? '#bbf7d0' : '#fecaca',
                  }}
                >
                  <span>{s.ok ? '✓' : '✗'}</span>
                  <span>{s.text}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: '1.25rem',
                padding: '0.9rem 1.1rem',
                borderRadius: 10,
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                color: '#bfdbfe',
                fontSize: '0.83rem',
                lineHeight: 1.6,
              }}
            >
              💡 RBAC has no deny rules — permissions only add up. If nothing grants an action, it is
              denied. Try asking for <strong>delete secrets in production</strong> and watch each check
              fail in turn. Full theory in{' '}
              <Link href="/module-7-1" style={{ color: '#93c5fd' }}>
                Module 7.1: RBAC
              </Link>
              .
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
