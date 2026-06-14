import { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Module72() {
  const [runAsUser, setRunAsUser] = useState(1000);
  const [privileged, setPrivileged] = useState(false);
  const [readOnlyRoot, setReadOnlyRoot] = useState(false);
  const [allowPrivilegeEscalation, setAllowPrivilegeEscalation] = useState(true);
  const [selectedStandard, setSelectedStandard] = useState('restricted');

  const securityStandards = {
    privileged: {
      name: 'Privileged',
      level: 'Unrestricted',
      color: '#ef4444',
      description: 'No restrictions. Pods can do anything. Only for system components.',
      allows: [
        'Run as root (UID 0)',
        'Privileged containers',
        'Host namespaces (network, PID, IPC)',
        'Host paths mounted',
        'All capabilities',
        'Privilege escalation'
      ],
      useCase: 'System daemons (kube-proxy, CNI, monitoring agents)'
    },
    baseline: {
      name: 'Baseline',
      level: 'Minimally restrictive',
      color: '#f59e0b',
      description: 'Prevents known privilege escalations. Good default for most apps.',
      allows: [
        'Run as non-root (enforced)',
        'No privileged containers',
        'No host namespaces',
        'Limited capabilities',
        'No privilege escalation'
      ],
      forbids: [
        'Privileged: true',
        'hostNetwork, hostPID, hostIPC',
        'hostPath volumes',
        'Dangerous capabilities (SYS_ADMIN, NET_ADMIN, etc.)'
      ],
      useCase: 'Most applications, web servers, APIs'
    },
    restricted: {
      name: 'Restricted',
      level: 'Heavily restricted',
      color: '#10b981',
      description: 'Maximum security. Follows current Pod hardening best practices.',
      allows: [
        'Must run as non-root',
        'Must drop ALL capabilities',
        'Read-only root filesystem (seccompProfile)',
        'No privilege escalation',
        'Specific seccomp/AppArmor profiles'
      ],
      forbids: [
        'Everything from Baseline',
        'Running as root (must set runAsNonRoot: true)',
        'Any capabilities (must drop all)',
        'Writable root filesystem'
      ],
      useCase: 'Security-critical apps, compliance requirements (PCI-DSS, HIPAA)'
    }
  };

  const getSecurityScore = () => {
    let score = 100;
    if (runAsUser === 0) score -= 30;
    if (privileged) score -= 40;
    if (!readOnlyRoot) score -= 15;
    if (allowPrivilegeEscalation) score -= 15;
    return Math.max(0, score);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const score = getSecurityScore();

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title} style={{ color: '#1e293b' }}>
          7.2 Pod Security
        </h1>

        <div style={{ marginBottom: '2rem' }}>
          <Link href="/module-7-1" legacyBehavior>
            <a style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>
              ← Previous: RBAC
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/learning-modules" legacyBehavior>
            <a style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>
              All Modules
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/module-7-3" legacyBehavior>
            <a style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>
              Next: Network Policies →
            </a>
          </Link>
        </div>

        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#1e293b', maxWidth: '800px' }}>
          By default, containers run as root with a lot of privileges. This is terrifying from a security
          perspective. Pod Security Standards and SecurityContext let you lock down containers so a
          compromised app can't take over the node.
        </p>

        <div style={{
          background: 'linear-gradient(to right, #fee2e2, #fecaca)',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '2rem',
          borderLeft: '4px solid #ef4444'
        }}>
          <p style={{ margin: 0, color: '#1e293b', lineHeight: '1.6' }}>
            <strong>Why This Matters:</strong> A container escape from a privileged Pod can give attackers
            full control of the node—and potentially the entire cluster. Running as root, mounting host paths,
            or using privileged mode are the most common misconfigurations that lead to breaches.
          </p>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>SecurityContext: Pod-Level Configuration</h2>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b' }}>
          SecurityContext defines privilege and access control settings for Pods and containers. Set it at
          the Pod level (applies to all containers) or per-container (overrides Pod settings).
        </p>

        <div style={{
          background: '#f8fafc',
          padding: '2rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          border: '2px solid #e2e8f0'
        }}>
          <h3 style={{ marginTop: 0, color: '#1e293b' }}>Interactive: Security Configuration</h3>
          <p style={{ color: '#1e293b', marginBottom: '1.5rem' }}>
            Adjust security settings and see the impact:
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#1e293b', fontWeight: 600, marginBottom: '0.5rem' }}>
              Run as User ID: {runAsUser} {runAsUser === 0 && '(ROOT - DANGEROUS!)'}
            </label>
            <input
              type="range"
              min="0"
              max="65534"
              step="1000"
              value={runAsUser}
              onChange={(e) => setRunAsUser(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>
              <span>0 (root)</span>
              <span>1000 (non-root)</span>
              <span>65534 (nobody)</span>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={privileged}
                onChange={(e) => setPrivileged(e.target.checked)}
                style={{ width: '20px', height: '20px' }}
              />
              <span style={{ color: '#1e293b', fontWeight: 600 }}>
                Privileged Mode {privileged && '⚠️ EXTREMELY DANGEROUS'}
              </span>
            </label>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={readOnlyRoot}
                onChange={(e) => setReadOnlyRoot(e.target.checked)}
                style={{ width: '20px', height: '20px' }}
              />
              <span style={{ color: '#1e293b', fontWeight: 600 }}>Read-Only Root Filesystem ✓ Recommended</span>
            </label>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={allowPrivilegeEscalation}
                onChange={(e) => setAllowPrivilegeEscalation(e.target.checked)}
                style={{ width: '20px', height: '20px' }}
              />
              <span style={{ color: '#1e293b', fontWeight: 600 }}>
                Allow Privilege Escalation {allowPrivilegeEscalation && '⚠️ Risky'}
              </span>
            </label>
          </div>

          <div style={{
            padding: '1.5rem',
            background: 'white',
            borderRadius: '8px',
            border: `3px solid ${getScoreColor(score)}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0, color: '#1e293b' }}>Security Score</h4>
              <div style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: getScoreColor(score)
              }}>
                {score}/100
              </div>
            </div>

            <div style={{
              width: '100%',
              height: '20px',
              background: '#e2e8f0',
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: `${score}%`,
                height: '100%',
                background: getScoreColor(score),
                transition: 'all 0.3s ease'
              }} />
            </div>

            <div style={{ fontSize: '0.95rem', color: '#1e293b', lineHeight: '1.6' }}>
              {score >= 80 && '✅ Good security posture. This Pod follows best practices.'}
              {score >= 50 && score < 80 && '⚠️ Moderate risk. Consider tightening security settings.'}
              {score < 50 && '🚨 High risk! This Pod has significant security vulnerabilities.'}
            </div>
          </div>

          <div style={{
            marginTop: '1.5rem',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            background: '#1e293b',
            color: '#10b981',
            padding: '1rem',
            borderRadius: '6px',
            overflowX: 'auto'
          }}>
            {"apiVersion: v1"}<br />
            {"kind: Pod"}<br />
            {"metadata:"}<br />
            {"  name: secure-pod"}<br />
            {"spec:"}<br />
            {"  securityContext:"}<br />
            {"    runAsUser: "}{runAsUser}<br />
            {"    runAsNonRoot: "}{runAsUser !== 0 ? 'true' : 'false'}<br />
            {"    fsGroup: 2000  # Group for volumes"}<br />
            {"  containers:"}<br />
            {"  - name: app"}<br />
            {"    image: myapp:latest"}<br />
            {"    securityContext:"}<br />
            {"      privileged: "}{privileged ? 'true' : 'false'}<br />
            {"      readOnlyRootFilesystem: "}{readOnlyRoot ? 'true' : 'false'}<br />
            {"      allowPrivilegeEscalation: "}{allowPrivilegeEscalation ? 'true' : 'false'}<br />
            {"      capabilities:"}<br />
            {"        drop:"}<br />
            {"        - ALL"}<br />
            {!privileged && "        add:\n        - NET_BIND_SERVICE  # Only if needed"}
          </div>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>SecurityContext Fields Explained</h2>

        <div style={{ marginTop: '1.5rem' }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>runAsUser / runAsNonRoot</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
              <strong>runAsUser:</strong> Numeric UID to run the container as. 0 = root (avoid!).<br />
              <strong>runAsNonRoot:</strong> If true, Kubernetes validates the image doesn't run as UID 0.
              Pod fails to start if it tries to run as root.
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: '#f8fafc',
              color: '#1e293b',
              padding: '0.75rem',
              borderRadius: '4px',
              marginTop: '0.5rem'
            }}>
              {"securityContext:"}<br />
              {"  runAsUser: 1000"}<br />
              {"  runAsNonRoot: true  # Enforces non-root"}
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>privileged</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
              When true, container runs in privileged mode with access to all devices on the host.
              Essentially <strong>root access to the node</strong>. Only use for system-level Pods
              (CNI plugins, storage drivers). Never for application Pods.
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: '#fef2f2',
              color: '#1e293b',
              padding: '0.75rem',
              borderRadius: '4px',
              marginTop: '0.5rem'
            }}>
              {"securityContext:"}<br />
              {"  privileged: true  # DON'T USE unless absolutely necessary"}
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>readOnlyRootFilesystem</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
              Makes the container's root filesystem read-only. Forces apps to use volumes for writable
              data. Prevents attackers from modifying binaries or installing tools inside the container.
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: '#f8fafc',
              color: '#1e293b',
              padding: '0.75rem',
              borderRadius: '4px',
              marginTop: '0.5rem'
            }}>
              {"securityContext:"}<br />
              {"  readOnlyRootFilesystem: true"}<br />
              {"volumeMounts:"}<br />
              {"- name: tmp"}<br />
              {"  mountPath: /tmp  # App can still write here"}
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>allowPrivilegeEscalation</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
              Controls whether a process can gain more privileges than its parent. Set to false to prevent
              setuid binaries and privilege escalation attacks. Should always be false unless you have a
              specific reason.
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: '#f8fafc',
              color: '#1e293b',
              padding: '0.75rem',
              borderRadius: '4px',
              marginTop: '0.5rem'
            }}>
              {"securityContext:"}<br />
              {"  allowPrivilegeEscalation: false  # Recommended"}
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>capabilities</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
              Linux capabilities divide root privileges into discrete units. Drop ALL by default, then
              add back only what's needed. Common ones: NET_BIND_SERVICE (bind to ports {"<"} 1024),
              CHOWN (change file ownership).
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: '#f8fafc',
              color: '#1e293b',
              padding: '0.75rem',
              borderRadius: '4px',
              marginTop: '0.5rem'
            }}>
              {"securityContext:"}<br />
              {"  capabilities:"}<br />
              {"    drop:"}<br />
              {"    - ALL  # Drop everything first"}<br />
              {"    add:"}<br />
              {"    - NET_BIND_SERVICE  # Add back only what's needed"}
            </div>
          </div>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Pod Security Standards (PSS)</h2>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b' }}>
          Kubernetes defines three security levels: Privileged, Baseline, and Restricted. These are enforced
          at the namespace level using admission controllers.
        </p>

        <div style={{
          background: '#f8fafc',
          padding: '2rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          border: '2px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {Object.entries(securityStandards).map(([key, standard]) => (
              <button
                key={key}
                onClick={() => setSelectedStandard(key)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: selectedStandard === key ? `2px solid ${standard.color}` : '2px solid #cbd5e1',
                  borderRadius: '6px',
                  background: selectedStandard === key ? `${standard.color}22` : 'white',
                  cursor: 'pointer',
                  fontWeight: selectedStandard === key ? 600 : 400,
                  color: '#1e293b'
                }}
              >
                {standard.name}
              </button>
            ))}
          </div>

          <div style={{
            padding: '1.5rem',
            background: 'white',
            borderRadius: '8px',
            border: `3px solid ${securityStandards[selectedStandard].color}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.5rem' }}>
                {securityStandards[selectedStandard].name}
              </h4>
              <div style={{
                padding: '0.25rem 0.75rem',
                background: `${securityStandards[selectedStandard].color}22`,
                color: securityStandards[selectedStandard].color,
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                {securityStandards[selectedStandard].level}
              </div>
            </div>

            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              {securityStandards[selectedStandard].description}
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 600, color: '#10b981', marginBottom: '0.5rem' }}>
                ✓ Allows:
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#1e293b', lineHeight: '1.8' }}>
                {securityStandards[selectedStandard].allows.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {securityStandards[selectedStandard].forbids && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 600, color: '#ef4444', marginBottom: '0.5rem' }}>
                  ✗ Forbids:
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#1e293b', lineHeight: '1.8' }}>
                  {securityStandards[selectedStandard].forbids.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '6px'
            }}>
              <strong style={{ color: '#1e293b' }}>Use Case:</strong>
              <span style={{ color: '#1e293b', marginLeft: '0.5rem' }}>
                {securityStandards[selectedStandard].useCase}
              </span>
            </div>
          </div>
        </div>

        <h3 style={{ color: '#1e293b', marginTop: '2rem' }}>Enforcing Pod Security Standards</h3>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b' }}>
          Use namespace labels to enforce PSS. Three modes: enforce (block), audit (log violations), warn
          (show warnings to users).
        </p>

        <div style={{
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          background: '#1e293b',
          color: '#10b981',
          padding: '1rem',
          borderRadius: '6px',
          marginTop: '1rem',
          overflowX: 'auto'
        }}>
          {"# Enforce 'restricted' in production namespace"}<br />
          kubectl label namespace production \<br />
          {"  pod-security.kubernetes.io/enforce=restricted \\"}<br />
          {"  pod-security.kubernetes.io/audit=restricted \\"}<br />
          {"  pod-security.kubernetes.io/warn=restricted"}<br />
          <br />
          {"# Allow 'baseline' in staging"}<br />
          kubectl label namespace staging \<br />
          {"  pod-security.kubernetes.io/enforce=baseline"}<br />
          <br />
          {"# Check if Pod would be admitted"}<br />
          kubectl label namespace dev \<br />
          {"  pod-security.kubernetes.io/warn=restricted"}<br />
          {"# Pods are created, but you get warnings"}
        </div>

        <div style={{
          background: '#fef3c7',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          borderLeft: '4px solid #f59e0b'
        }}>
          <p style={{ margin: 0, color: '#1e293b', lineHeight: '1.6' }}>
            <strong>Recommendation:</strong> Start with <code style={{ background: 'white', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>warn</code> mode
            in dev environments to see what breaks. Move to <code style={{ background: 'white', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>audit</code> in
            staging, then <code style={{ background: 'white', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>enforce</code> in production once your
            Pods are compliant.
          </p>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Why "privileged" is a Scary Word</h2>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b' }}>
          A privileged container has access to all devices on the host and can perform nearly any action
          the host kernel allows. This breaks container isolation entirely.
        </p>

        <div style={{
          background: '#fee2e2',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          borderLeft: '4px solid #dc2626'
        }}>
          <h3 style={{ marginTop: 0, color: '#1e293b' }}>What an Attacker Can Do with Privileged Mode</h3>
          <ul style={{ color: '#1e293b', lineHeight: '1.8', marginBottom: 0 }}>
            <li>Mount the host filesystem and read/modify any file (including /etc/passwd, SSH keys)</li>
            <li>Load kernel modules and install rootkits</li>
            <li>Access all host devices (/dev/sda, /dev/kmsg, etc.)</li>
            <li>Escape the container and execute code directly on the node</li>
            <li>Pivot to other containers on the node</li>
            <li>Steal kubelet credentials and compromise the cluster</li>
          </ul>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          border: '2px solid #e2e8f0'
        }}>
          <h4 style={{ marginTop: 0, color: '#1e293b' }}>Example: Container Escape via Privileged</h4>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            background: '#1e293b',
            color: '#10b981',
            padding: '1rem',
            borderRadius: '6px',
            marginTop: '0.5rem',
            overflowX: 'auto'
          }}>
            {"# Inside a privileged container:"}<br />
            mkdir /mnt/host<br />
            mount /dev/sda1 /mnt/host<br />
            <br />
            {"# Now you can access the entire host filesystem"}<br />
            cat /mnt/host/etc/shadow<br />
            cat /mnt/host/var/lib/kubelet/config.yaml<br />
            <br />
            {"# Add SSH key for persistence"}<br />
            echo "ssh-rsa AAAA..." {">> /mnt/host/root/.ssh/authorized_keys"}<br />
            <br />
            {"# Game over."}
          </div>
        </div>

        <div style={{
          background: '#dbeafe',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          borderLeft: '4px solid #3b82f6'
        }}>
          <p style={{ margin: 0, color: '#1e293b', lineHeight: '1.6' }}>
            <strong>When IS Privileged Mode Acceptable?</strong> System-level Pods that need low-level
            host access: CNI plugins (Calico, Cilium), monitoring agents (node exporters), storage drivers
            (Rook, Longhorn). Even then, prefer specific capabilities over full privileged mode when possible.
          </p>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Secure Pod Template</h2>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b' }}>
          Here's a secure Pod template following the "restricted" standard:
        </p>

        <div style={{
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          background: '#1e293b',
          color: '#10b981',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1rem',
          overflowX: 'auto'
        }}>
          {"apiVersion: v1"}<br />
          {"kind: Pod"}<br />
          {"metadata:"}<br />
          {"  name: secure-app"}<br />
          {"spec:"}<br />
          {"  # Pod-level settings"}<br />
          {"  securityContext:"}<br />
          {"    runAsNonRoot: true"}<br />
          {"    runAsUser: 1000"}<br />
          {"    fsGroup: 2000"}<br />
          {"    seccompProfile:"}<br />
          {"      type: RuntimeDefault"}<br />
          <br />
          {"  containers:"}<br />
          {"  - name: app"}<br />
          {"    image: myapp:latest"}<br />
          <br />
          {"    # Container-level settings"}<br />
          {"    securityContext:"}<br />
          {"      allowPrivilegeEscalation: false"}<br />
          {"      readOnlyRootFilesystem: true"}<br />
          {"      runAsNonRoot: true"}<br />
          {"      capabilities:"}<br />
          {"        drop:"}<br />
          {"        - ALL"}<br />
          <br />
          {"    # Writable directories via volumes"}<br />
          {"    volumeMounts:"}<br />
          {"    - name: tmp"}<br />
          {"      mountPath: /tmp"}<br />
          {"    - name: cache"}<br />
          {"      mountPath: /app/cache"}<br />
          <br />
          {"  volumes:"}<br />
          {"  - name: tmp"}<br />
          {"    emptyDir: {}"}<br />
          {"  - name: cache"}<br />
          {"    emptyDir: {}"}
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Common Issues</h2>

        <div style={{ marginTop: '1.5rem' }}>
          <div style={{
            background: '#fef2f2',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            borderLeft: '4px solid #ef4444'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Issue: App Won't Start (readOnlyRootFilesystem)</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
              <strong>Symptom:</strong> "Read-only file system" errors in logs.<br />
              <strong>Solution:</strong> Mount emptyDir volumes for paths the app writes to (/tmp, /var/run,
              /app/cache, etc.). Update the app to write logs to stdout instead of files.
            </p>
          </div>

          <div style={{
            background: '#fef2f2',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            borderLeft: '4px solid #ef4444'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Issue: Permission Denied (runAsNonRoot)</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
              <strong>Symptom:</strong> Container fails because it tries to run as root.<br />
              <strong>Solution:</strong> Rebuild the Docker image with a USER directive, or set runAsUser in
              the Pod spec. Check file permissions in the image—they may need to be owned by a non-root user.
            </p>
          </div>

          <div style={{
            background: '#fef2f2',
            padding: '1.5rem',
            borderRadius: '8px',
            borderLeft: '4px solid #ef4444'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Issue: PSS Blocks Pod Creation</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
              <strong>Symptom:</strong> "violates PodSecurity restricted:latest" error.<br />
              <strong>Solution:</strong> Check which fields are violating the policy (kubectl describe pod).
              Fix the SecurityContext settings. If you legitimately need relaxed security, change the namespace
              label to 'baseline' or add an exemption.
            </p>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(to right, #fef3c7, #fde68a)',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '2rem',
          borderLeft: '4px solid #f59e0b'
        }}>
          <p style={{ margin: 0, color: '#1e293b', lineHeight: '1.6' }}>
            <strong>Remember:</strong> Security is about layers. Even if a container is compromised, proper
            SecurityContext settings limit the blast radius. Always run as non-root, drop capabilities,
            and use read-only filesystems. Your future self (debugging a breach) will thank you.
          </p>
        </div>

        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/module-7-1" legacyBehavior>
            <a style={{ color: '#9c0606ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              ← Previous: RBAC
            </a>
          </Link>
          <Link href="/module-7-3" legacyBehavior>
            <a style={{
              background: '#9c0606ff',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: 600
            }}>
              Next: Network Policies →
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
}
