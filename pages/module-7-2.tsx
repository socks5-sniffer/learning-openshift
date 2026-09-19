import { useState } from 'react';
import styles from '../styles/Home.module.css';
import ModuleShell from '../components/module/ModuleShell';
import Callout from '../components/module/Callout';
import TermBox from '../components/module/TermBox';

interface SecurityStandard {
  name: string; level: string; color: string; description: string;
  allows: string[]; forbids?: string[]; useCase: string;
}

const securityStandards: Record<'privileged' | 'baseline' | 'restricted', SecurityStandard> = {
  privileged: {
    name: 'Privileged', level: 'Unrestricted', color: '#ef4444',
    description: 'No restrictions. Pods can do anything. Only for system components.',
    allows: ['Run as root (UID 0)', 'Privileged containers', 'Host namespaces (network, PID, IPC)', 'Host paths mounted', 'All capabilities', 'Privilege escalation'],
    useCase: 'System daemons (kube-proxy, CNI, monitoring agents)',
  },
  baseline: {
    name: 'Baseline', level: 'Minimally restrictive', color: '#f59e0b',
    description: 'Prevents known privilege escalations. Good default for most apps.',
    allows: ['Run as non-root (enforced)', 'No privileged containers', 'No host namespaces', 'Limited capabilities', 'No privilege escalation'],
    forbids: ['Privileged: true', 'hostNetwork, hostPID, hostIPC', 'hostPath volumes', 'Dangerous capabilities (SYS_ADMIN, NET_ADMIN, etc.)'],
    useCase: 'Most applications, web servers, APIs',
  },
  restricted: {
    name: 'Restricted', level: 'Heavily restricted', color: '#10b981',
    description: 'Maximum security. Follows current Pod hardening best practices.',
    allows: ['Must run as non-root', 'Must drop ALL capabilities', 'Read-only root filesystem (seccompProfile)', 'No privilege escalation', 'Specific seccomp/AppArmor profiles'],
    forbids: ['Everything from Baseline', 'Running as root (must set runAsNonRoot: true)', 'Any capabilities (must drop all)', 'Writable root filesystem'],
    useCase: 'Security-critical apps, compliance requirements (PCI-DSS, HIPAA)',
  },
};

export default function Module72() {
  const [runAsUser, setRunAsUser] = useState(1000);
  const [privileged, setPrivileged] = useState(false);
  const [readOnlyRoot, setReadOnlyRoot] = useState(false);
  const [allowPrivilegeEscalation, setAllowPrivilegeEscalation] = useState(true);
  const [selectedStandard, setSelectedStandard] = useState<'privileged' | 'baseline' | 'restricted'>('restricted');

  const getSecurityScore = () => {
    let s = 100;
    if (runAsUser === 0) s -= 30;
    if (privileged) s -= 40;
    if (!readOnlyRoot) s -= 15;
    if (allowPrivilegeEscalation) s -= 15;
    return Math.max(0, s);
  };
  const getScoreColor = (s: number) => (s >= 80 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444');
  const score = getSecurityScore();
  const std = securityStandards[selectedStandard];

  return (
    <ModuleShell id="7-2">
      <section className={styles.spotlight}>
        <p>
          By default, containers run as root with a lot of privileges. This is terrifying from a security
          perspective. Pod Security Standards and SecurityContext let you lock down containers so a
          compromised app can't take over the node.
        </p>

        <Callout variant="danger" title="Why This Matters">
          <p>
            A container escape from a privileged Pod can give attackers
            full control of the node—and potentially the entire cluster. Running as root, mounting host paths,
            or using privileged mode are the most common misconfigurations that lead to breaches.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>SecurityContext: Pod-Level Configuration</h2>
        <p>
          SecurityContext defines privilege and access control settings for Pods and containers. Set it at
          the Pod level (applies to all containers) or per-container (overrides Pod settings).
        </p>

        <h3>Interactive: Security Configuration</h3>
        <p>Adjust security settings and see the impact:</p>

        <div style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '24px', margin: '20px 0' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: 'var(--color-text-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
              Run as User ID: {runAsUser} {runAsUser === 0 && '(ROOT - DANGEROUS!)'}
            </label>
            <input type="range" min="0" max="65534" step="1000" value={runAsUser} onChange={(e) => setRunAsUser(parseInt(e.target.value))} style={{ width: '100%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              <span>0 (root)</span><span>1000 (non-root)</span><span>65534 (nobody)</span>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={privileged} onChange={(e) => setPrivileged(e.target.checked)} style={{ width: '20px', height: '20px' }} />
              <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Privileged Mode {privileged && '⚠️ EXTREMELY DANGEROUS'}</span>
            </label>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={readOnlyRoot} onChange={(e) => setReadOnlyRoot(e.target.checked)} style={{ width: '20px', height: '20px' }} />
              <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Read-Only Root Filesystem ✓ Recommended</span>
            </label>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={allowPrivilegeEscalation} onChange={(e) => setAllowPrivilegeEscalation(e.target.checked)} style={{ width: '20px', height: '20px' }} />
              <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Allow Privilege Escalation {allowPrivilegeEscalation && '⚠️ Risky'}</span>
            </label>
          </div>

          <div style={{ padding: '1.5rem', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: `2px solid ${getScoreColor(score)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0 }}>Security Score</h4>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: getScoreColor(score) }}>{score}/100</div>
            </div>
            <div style={{ width: '100%', height: '20px', background: 'var(--color-bg-tertiary)', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
              <div style={{ width: `${score}%`, height: '100%', background: getScoreColor(score), transition: 'all 0.3s ease' }} />
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              {score >= 80 && '✅ Good security posture. This Pod follows best practices.'}
              {score >= 50 && score < 80 && '⚠️ Moderate risk. Consider tightening security settings.'}
              {score < 50 && '🚨 High risk! This Pod has significant security vulnerabilities.'}
            </div>
          </div>

          <TermBox copyable={false}>
            <div style={{ color: '#10b981' }}>apiVersion: v1</div>
            <div style={{ color: '#10b981' }}>kind: Pod</div>
            <div style={{ color: '#10b981' }}>metadata:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: secure-pod</div>
            <div style={{ color: '#10b981' }}>spec:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;securityContext:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;runAsUser: {runAsUser}</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;runAsNonRoot: {runAsUser !== 0 ? 'true' : 'false'}</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;fsGroup: 2000  # Group for volumes</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;containers:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- name: app</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;image: myapp:latest</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;securityContext:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;privileged: {privileged ? 'true' : 'false'}</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;readOnlyRootFilesystem: {readOnlyRoot ? 'true' : 'false'}</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allowPrivilegeEscalation: {allowPrivilegeEscalation ? 'true' : 'false'}</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;capabilities:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;drop:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ALL</div>
            {!privileged && (
              <>
                <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;add:</div>
                <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- NET_BIND_SERVICE  # Only if needed</div>
              </>
            )}
          </TermBox>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>SecurityContext Fields Explained</h2>

        <h3>runAsUser / runAsNonRoot</h3>
        <p>
          <strong>runAsUser:</strong> Numeric UID to run the container as. 0 = root (avoid!).<br />
          <strong>runAsNonRoot:</strong> If true, Kubernetes validates the image doesn't run as UID 0.
          Pod fails to start if it tries to run as root.
        </p>
        <TermBox>
          <div style={{ color: '#10b981' }}>securityContext:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;runAsUser: 1000</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;runAsNonRoot: true  # Enforces non-root</div>
        </TermBox>

        <h3>privileged</h3>
        <p>
          When true, container runs in privileged mode with access to all devices on the host.
          Essentially <strong>root access to the node</strong>. Only use for system-level Pods
          (CNI plugins, storage drivers). Never for application Pods.
        </p>
        <TermBox>
          <div style={{ color: '#ef4444' }}>securityContext:</div>
          <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;privileged: true  # DON'T USE unless absolutely necessary</div>
        </TermBox>

        <h3>readOnlyRootFilesystem</h3>
        <p>
          Makes the container's root filesystem read-only. Forces apps to use volumes for writable
          data. Prevents attackers from modifying binaries or installing tools inside the container.
        </p>
        <TermBox>
          <div style={{ color: '#10b981' }}>securityContext:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;readOnlyRootFilesystem: true</div>
          <div style={{ color: '#10b981' }}>volumeMounts:</div>
          <div style={{ color: '#10b981' }}>- name: tmp</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;mountPath: /tmp  # App can still write here</div>
        </TermBox>

        <h3>allowPrivilegeEscalation</h3>
        <p>
          Controls whether a process can gain more privileges than its parent. Set to false to prevent
          setuid binaries and privilege escalation attacks. Should always be false unless you have a
          specific reason.
        </p>
        <TermBox>
          <div style={{ color: '#10b981' }}>securityContext:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;allowPrivilegeEscalation: false  # Recommended</div>
        </TermBox>

        <h3>capabilities</h3>
        <p>
          Linux capabilities divide root privileges into discrete units. Drop ALL by default, then
          add back only what's needed. Common ones: NET_BIND_SERVICE (bind to ports {'<'} 1024),
          CHOWN (change file ownership).
        </p>
        <TermBox>
          <div style={{ color: '#10b981' }}>securityContext:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;capabilities:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;drop:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;- ALL  # Drop everything first</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;add:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;- NET_BIND_SERVICE  # Add back only what's needed</div>
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>Pod Security Standards (PSS)</h2>
        <p>
          Kubernetes defines three security levels: Privileged, Baseline, and Restricted. These are enforced
          at the namespace level using admission controllers.
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {Object.entries(securityStandards).map(([key, standard]) => (
            <button
              key={key}
              onClick={() => setSelectedStandard(key as keyof typeof securityStandards)}
              style={{
                padding: '0.75rem 1.5rem',
                border: `2px solid ${selectedStandard === key ? standard.color : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-sm)',
                background: selectedStandard === key ? `${standard.color}22` : 'var(--color-bg-elevated)',
                cursor: 'pointer',
                fontWeight: selectedStandard === key ? 600 : 400,
                color: 'var(--color-text-primary)',
              }}
            >
              {standard.name}
            </button>
          ))}
        </div>

        <div style={{ padding: '1.5rem', background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)', border: `2px solid ${std.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <h4 style={{ margin: 0, fontSize: '1.5rem' }}>{std.name}</h4>
            <div style={{ padding: '0.25rem 0.75rem', background: `${std.color}22`, color: std.color, borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}>{std.level}</div>
          </div>

          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>{std.description}</p>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 600, color: '#22c55e', marginBottom: '0.5rem' }}>✓ Allows:</div>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
              {std.allows.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>

          {std.forbids && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 600, color: '#ef4444', marginBottom: '0.5rem' }}>✗ Forbids:</div>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                {std.forbids.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )}

          <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
            <strong style={{ color: 'var(--color-text-primary)' }}>Use Case:</strong>
            <span style={{ color: 'var(--color-text-secondary)', marginLeft: '0.5rem' }}>{std.useCase}</span>
          </div>
        </div>

        <h3>Enforcing Pod Security Standards</h3>
        <p>
          Use namespace labels to enforce PSS. Three modes: enforce (block), audit (log violations), warn
          (show warnings to users).
        </p>
        <TermBox>
          <div style={{ color: '#64748b' }}># Enforce 'restricted' in production namespace</div>
          <div style={{ color: '#10b981' }}>kubectl label namespace production \</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;pod-security.kubernetes.io/enforce=restricted \</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;pod-security.kubernetes.io/audit=restricted \</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;pod-security.kubernetes.io/warn=restricted</div>
          <br />
          <div style={{ color: '#64748b' }}># Allow 'baseline' in staging</div>
          <div style={{ color: '#10b981' }}>kubectl label namespace staging \</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;pod-security.kubernetes.io/enforce=baseline</div>
          <br />
          <div style={{ color: '#64748b' }}># Check if Pod would be admitted</div>
          <div style={{ color: '#10b981' }}>kubectl label namespace dev \</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;pod-security.kubernetes.io/warn=restricted</div>
          <div style={{ color: '#64748b' }}># Pods are created, but you get warnings</div>
        </TermBox>

        <Callout variant="warning" title="Recommendation">
          <p>
            Start with <code>warn</code> mode in dev environments to see what breaks. Move to <code>audit</code> in
            staging, then <code>enforce</code> in production once your Pods are compliant.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Why "privileged" is a Scary Word</h2>
        <p>
          A privileged container has access to all devices on the host and can perform nearly any action
          the host kernel allows. This breaks container isolation entirely.
        </p>

        <Callout variant="danger" title="What an Attacker Can Do with Privileged Mode">
          <ul>
            <li>Mount the host filesystem and read/modify any file (including /etc/passwd, SSH keys)</li>
            <li>Load kernel modules and install rootkits</li>
            <li>Access all host devices (/dev/sda, /dev/kmsg, etc.)</li>
            <li>Escape the container and execute code directly on the node</li>
            <li>Pivot to other containers on the node</li>
            <li>Steal kubelet credentials and compromise the cluster</li>
          </ul>
        </Callout>

        <h3>Example: Container Escape via Privileged</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># Inside a privileged container:</div>
          <div style={{ color: '#10b981' }}>mkdir /mnt/host</div>
          <div style={{ color: '#10b981' }}>mount /dev/sda1 /mnt/host</div>
          <br />
          <div style={{ color: '#64748b' }}># Now you can access the entire host filesystem</div>
          <div style={{ color: '#10b981' }}>cat /mnt/host/etc/shadow</div>
          <div style={{ color: '#10b981' }}>cat /mnt/host/var/lib/kubelet/config.yaml</div>
          <br />
          <div style={{ color: '#64748b' }}># Add SSH key for persistence</div>
          <div style={{ color: '#10b981' }}>echo "ssh-rsa AAAA..." &gt;&gt; /mnt/host/root/.ssh/authorized_keys</div>
          <br />
          <div style={{ color: '#64748b' }}># Game over.</div>
        </TermBox>

        <Callout variant="info" title="When IS Privileged Mode Acceptable?">
          <p>
            System-level Pods that need low-level host access: CNI plugins (Calico, Cilium), monitoring
            agents (node exporters), storage drivers (Rook, Longhorn). Even then, prefer specific
            capabilities over full privileged mode when possible.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Secure Pod Template</h2>
        <p>Here's a secure Pod template following the "restricted" standard:</p>
        <TermBox>
          <div style={{ color: '#10b981' }}>apiVersion: v1</div>
          <div style={{ color: '#10b981' }}>kind: Pod</div>
          <div style={{ color: '#10b981' }}>metadata:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: secure-app</div>
          <div style={{ color: '#10b981' }}>spec:</div>
          <div style={{ color: '#64748b' }}>&nbsp;&nbsp;# Pod-level settings</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;securityContext:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;runAsNonRoot: true</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;runAsUser: 1000</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;fsGroup: 2000</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;seccompProfile:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type: RuntimeDefault</div>
          <br />
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;containers:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- name: app</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;image: myapp:latest</div>
          <br />
          <div style={{ color: '#64748b' }}>&nbsp;&nbsp;&nbsp;&nbsp;# Container-level settings</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;securityContext:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allowPrivilegeEscalation: false</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;readOnlyRootFilesystem: true</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;runAsNonRoot: true</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;capabilities:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;drop:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ALL</div>
          <br />
          <div style={{ color: '#64748b' }}>&nbsp;&nbsp;&nbsp;&nbsp;# Writable directories via volumes</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;volumeMounts:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;- name: tmp</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mountPath: /tmp</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;- name: cache</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mountPath: /app/cache</div>
          <br />
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;volumes:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- name: tmp</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;emptyDir: {'{}'}</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- name: cache</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;emptyDir: {'{}'}</div>
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>Common Issues</h2>

        <Callout variant="danger" title="Issue: App Won't Start (readOnlyRootFilesystem)">
          <p>
            <strong>Symptom:</strong> "Read-only file system" errors in logs.<br />
            <strong>Solution:</strong> Mount emptyDir volumes for paths the app writes to (/tmp, /var/run,
            /app/cache, etc.). Update the app to write logs to stdout instead of files.
          </p>
        </Callout>
        <Callout variant="danger" title="Issue: Permission Denied (runAsNonRoot)">
          <p>
            <strong>Symptom:</strong> Container fails because it tries to run as root.<br />
            <strong>Solution:</strong> Rebuild the Docker image with a USER directive, or set runAsUser in
            the Pod spec. Check file permissions in the image—they may need to be owned by a non-root user.
          </p>
        </Callout>
        <Callout variant="danger" title="Issue: PSS Blocks Pod Creation">
          <p>
            <strong>Symptom:</strong> "violates PodSecurity restricted:latest" error.<br />
            <strong>Solution:</strong> Check which fields are violating the policy (kubectl describe pod).
            Fix the SecurityContext settings. If you legitimately need relaxed security, change the namespace
            label to 'baseline' or add an exemption.
          </p>
        </Callout>

        <Callout variant="warning" title="Remember">
          <p>
            Security is about layers. Even if a container is compromised, proper
            SecurityContext settings limit the blast radius. Always run as non-root, drop capabilities,
            and use read-only filesystems. Your future self (debugging a breach) will thank you.
          </p>
        </Callout>
      </section>
    </ModuleShell>
  );
}
