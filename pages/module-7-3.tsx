import { useState } from 'react';
import styles from '../styles/Home.module.css';
import ModuleShell from '../components/module/ModuleShell';
import Callout from '../components/module/Callout';
import TermBox from '../components/module/TermBox';

type PodKey = 'frontend' | 'backend' | 'database';
interface ConnInfo { allowed: boolean; critical: boolean }

const pods: Record<PodKey, { name: string; color: string; description: string }> = {
  frontend: { name: 'Frontend', color: '#3b82f6', description: 'Web server that talks to backend API' },
  backend: { name: 'Backend API', color: '#10b981', description: 'Application server that queries database' },
  database: { name: 'Database', color: '#f59e0b', description: 'PostgreSQL that should only accept connections from backend' },
};

export default function Module73() {
  const [selectedPod, setSelectedPod] = useState<PodKey>('frontend');
  const [policyEnabled, setPolicyEnabled] = useState(false);
  const [allowDNS, setAllowDNS] = useState(false);
  const [allowBackend, setAllowBackend] = useState(false);
  const [allowExternal, setAllowExternal] = useState(false);

  const connections: Record<PodKey, Record<string, ConnInfo>> = {
    frontend: {
      backend: { allowed: policyEnabled ? allowBackend : true, critical: true },
      database: { allowed: policyEnabled ? false : true, critical: false },
      dns: { allowed: policyEnabled ? allowDNS : true, critical: true },
      external: { allowed: policyEnabled ? allowExternal : true, critical: true },
    },
    backend: {
      frontend: { allowed: policyEnabled ? false : true, critical: false },
      database: { allowed: true, critical: true },
      dns: { allowed: policyEnabled ? allowDNS : true, critical: true },
      external: { allowed: policyEnabled ? false : true, critical: false },
    },
    database: {
      frontend: { allowed: policyEnabled ? false : true, critical: false },
      backend: { allowed: policyEnabled ? false : true, critical: false },
      dns: { allowed: policyEnabled ? allowDNS : true, critical: true },
      external: { allowed: policyEnabled ? false : true, critical: false },
    },
  };

  const getConnectionCount = (pod: PodKey) => {
    const conns = connections[pod];
    const allowed = Object.values(conns).filter((c) => c.allowed).length;
    return { allowed, total: Object.keys(conns).length };
  };

  return (
    <ModuleShell id="7-3">
      <section className={styles.spotlight}>
        <p>
          By default, any Pod can talk to any other Pod in your cluster. NetworkPolicies let you implement
          firewall rules—zero trust networking where every connection must be explicitly allowed. Essential
          for defense in depth.
        </p>

        <Callout variant="danger" title="The Default is Scary">
          <p>
            Without NetworkPolicies, a compromised frontend Pod can
            directly connect to your database. An attacker in one Pod can scan the entire cluster. Zero
            segmentation. NetworkPolicies fix this.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>How NetworkPolicies Work</h2>
        <p>
          NetworkPolicies select Pods (via labels) and define allowed ingress (incoming) and egress (outgoing)
          connections. Once you apply <em>any</em> NetworkPolicy that selects a Pod, it becomes deny-by-default.
        </p>

        <Callout variant="neutral" title="The Selection Model">
          <p>
            <strong>1. podSelector:</strong> Which Pods this policy applies to<br />
            <strong>2. policyTypes:</strong> Ingress, Egress, or both<br />
            <strong>3. ingress rules:</strong> Who can connect TO these Pods<br />
            <strong>4. egress rules:</strong> Where these Pods can connect TO
          </p>
        </Callout>

        <Callout variant="warning" title="Critical">
          <p>
            NetworkPolicies require a CNI plugin that supports them (Calico, Cilium,
            Weave). Flannel does NOT support NetworkPolicies by default. Check your CNI before relying on these!
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Interactive: Zero Trust Demo</h2>
        <p>See how NetworkPolicies restrict traffic in a 3-tier application:</p>

        <div style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '24px', margin: '20px 0' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={policyEnabled} onChange={(e) => setPolicyEnabled(e.target.checked)} style={{ width: '20px', height: '20px' }} />
              <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Enable NetworkPolicies (Zero Trust)</span>
            </label>
          </div>

          {policyEnabled && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>Configure Allowed Traffic:</div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem' }}>
                <input type="checkbox" checked={allowDNS} onChange={(e) => setAllowDNS(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                <span style={{ color: 'var(--color-text-secondary)' }}>Allow DNS (kube-system)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem' }}>
                <input type="checkbox" checked={allowBackend} onChange={(e) => setAllowBackend(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                <span style={{ color: 'var(--color-text-secondary)' }}>Allow Frontend → Backend</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={allowExternal} onChange={(e) => setAllowExternal(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                <span style={{ color: 'var(--color-text-secondary)' }}>Allow External (Internet)</span>
              </label>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {(Object.keys(pods) as PodKey[]).map((key) => {
              const { allowed, total } = getConnectionCount(key);
              const pod = pods[key];
              return (
                <button
                  key={key}
                  onClick={() => setSelectedPod(key)}
                  style={{
                    padding: '1rem',
                    border: `2px solid ${selectedPod === key ? pod.color : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    background: selectedPod === key ? `${pod.color}22` : 'var(--color-bg-secondary)',
                    cursor: 'pointer',
                    flex: '1',
                    minWidth: '150px',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>{pod.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{allowed}/{total} connections</div>
                </button>
              );
            })}
          </div>

          <div style={{ padding: '1.5rem', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: `2px solid ${pods[selectedPod].color}` }}>
            <h4 style={{ marginTop: 0 }}>{pods[selectedPod].name}</h4>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>{pods[selectedPod].description}</p>

            <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.75rem' }}>Outgoing Connections:</div>
            {Object.entries(connections[selectedPod]).map(([target, info]) => (
              <div
                key={target}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  background: info.allowed ? 'rgba(34,197,94,0.12)' : 'rgba(220,38,38,0.12)',
                  border: `1px solid ${info.allowed ? 'rgba(34,197,94,0.4)' : 'rgba(220,38,38,0.4)'}`,
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: info.allowed ? '#22c55e' : '#ef4444' }}>{info.allowed ? '✓' : '✗'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>→ {target}</div>
                  {!info.allowed && info.critical && (
                    <div style={{ fontSize: '0.85rem', color: '#ef4444', marginTop: '0.25rem' }}>⚠️ This connection is required for the app to work!</div>
                  )}
                </div>
              </div>
            ))}

            {policyEnabled && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: 'var(--color-text-primary)' }}>NetworkPolicy Applied:</strong>
                <span style={{ color: 'var(--color-text-secondary)', marginLeft: '0.5rem' }}>
                  {!allowDNS && 'DNS blocked! '}
                  {selectedPod === 'frontend' && !allowBackend && 'Backend blocked! '}
                  {selectedPod === 'frontend' && !allowExternal && 'Internet blocked! '}
                  {allowDNS && (selectedPod !== 'frontend' || allowBackend) && 'Connections restricted to minimum required.'}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>Basic NetworkPolicy Examples</h2>

        <h3>Example 1: Deny All (Starting Point)</h3>
        <p>Apply this first to make the namespace deny-by-default. Then add allow rules.</p>
        <TermBox>
          <div style={{ color: '#10b981' }}>apiVersion: networking.k8s.io/v1</div>
          <div style={{ color: '#10b981' }}>kind: NetworkPolicy</div>
          <div style={{ color: '#10b981' }}>metadata:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: deny-all</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;namespace: production</div>
          <div style={{ color: '#10b981' }}>spec:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;podSelector: {'{}'}  # Selects all Pods</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;policyTypes:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- Ingress</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- Egress</div>
          <div style={{ color: '#64748b' }}>&nbsp;&nbsp;# No ingress or egress rules = deny all</div>
        </TermBox>

        <h3>Example 2: Allow DNS</h3>
        <p>Without DNS, nothing works. Always allow egress to kube-system on port 53.</p>
        <TermBox>
          <div style={{ color: '#10b981' }}>apiVersion: networking.k8s.io/v1</div>
          <div style={{ color: '#10b981' }}>kind: NetworkPolicy</div>
          <div style={{ color: '#10b981' }}>metadata:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: allow-dns</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;namespace: production</div>
          <div style={{ color: '#10b981' }}>spec:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;podSelector: {'{}'}  # All Pods</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;policyTypes:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- Egress</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;egress:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- to:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;- namespaceSelector:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;matchLabels:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: kube-system</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;ports:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;- protocol: UDP</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;port: 53</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;- protocol: TCP</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;port: 53</div>
        </TermBox>

        <h3>Example 3: Frontend → Backend Only</h3>
        <p>Allow frontend Pods to connect to backend, but nothing else.</p>
        <TermBox>
          <div style={{ color: '#10b981' }}>apiVersion: networking.k8s.io/v1</div>
          <div style={{ color: '#10b981' }}>kind: NetworkPolicy</div>
          <div style={{ color: '#10b981' }}>metadata:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: backend-allow-frontend</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;namespace: production</div>
          <div style={{ color: '#10b981' }}>spec:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;podSelector:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;matchLabels:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;app: backend</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;policyTypes:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- Ingress</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;ingress:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- from:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;- podSelector:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;matchLabels:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;app: frontend</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;ports:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;- protocol: TCP</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;port: 8080</div>
        </TermBox>

        <h3>Example 4: Database Isolation</h3>
        <p>Database only accepts connections from backend, nowhere else.</p>
        <TermBox>
          <div style={{ color: '#10b981' }}>apiVersion: networking.k8s.io/v1</div>
          <div style={{ color: '#10b981' }}>kind: NetworkPolicy</div>
          <div style={{ color: '#10b981' }}>metadata:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: db-allow-backend-only</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;namespace: production</div>
          <div style={{ color: '#10b981' }}>spec:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;podSelector:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;matchLabels:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;app: database</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;policyTypes:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- Ingress</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- Egress  # Deny all outgoing except DNS</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;ingress:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- from:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;- podSelector:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;matchLabels:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;app: backend</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;ports:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;- protocol: TCP</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;port: 5432</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;egress:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- to:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;- namespaceSelector:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;matchLabels:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: kube-system</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;ports:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;- protocol: UDP</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;port: 53</div>
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>Advanced Selectors</h2>

        <h3>CIDR Blocks (External IPs)</h3>
        <p>Allow egress to specific external IPs or ranges.</p>
        <TermBox>
          <div style={{ color: '#10b981' }}>egress:</div>
          <div style={{ color: '#10b981' }}>- to:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- ipBlock:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cidr: 0.0.0.0/0  # All internet</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;except:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 10.0.0.0/8  # But not internal IPs</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 172.16.0.0/12</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 192.168.0.0/16</div>
        </TermBox>

        <h3>Cross-Namespace Communication</h3>
        <p>Allow Pods in 'frontend' namespace to reach Pods in 'backend' namespace.</p>
        <TermBox>
          <div style={{ color: '#10b981' }}>ingress:</div>
          <div style={{ color: '#10b981' }}>- from:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- namespaceSelector:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;matchLabels:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: frontend</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;podSelector:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;matchLabels:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;app: web</div>
        </TermBox>

        <h3>Multiple Rules (OR Logic)</h3>
        <p>Multiple items in the same rule are ANDed. Multiple rules are ORed.</p>
        <TermBox>
          <div style={{ color: '#10b981' }}>ingress:</div>
          <div style={{ color: '#64748b' }}># Rule 1: Allow from frontend Pods</div>
          <div style={{ color: '#10b981' }}>- from:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- podSelector:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;matchLabels:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;app: frontend</div>
          <div style={{ color: '#64748b' }}># Rule 2: OR allow from monitoring namespace</div>
          <div style={{ color: '#10b981' }}>- from:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- namespaceSelector:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;matchLabels:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: monitoring</div>
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>Testing NetworkPolicies</h2>
        <p>NetworkPolicies fail silently—blocked connections just timeout. Use these techniques to debug:</p>
        <TermBox>
          <div style={{ color: '#64748b' }}># Test connectivity from a Pod</div>
          <div style={{ color: '#10b981' }}>kubectl run test --rm -it --image=nicolaka/netshoot -- bash</div>
          <br />
          <div style={{ color: '#64748b' }}># Inside the Pod:</div>
          <div style={{ color: '#10b981' }}>curl http://backend-service:8080  # Should work or timeout</div>
          <div style={{ color: '#10b981' }}>dig backend-service.production.svc.cluster.local  # Test DNS</div>
          <div style={{ color: '#10b981' }}>nc -zv backend-service 8080  # Test TCP connection</div>
          <br />
          <div style={{ color: '#64748b' }}># Check if NetworkPolicy exists</div>
          <div style={{ color: '#10b981' }}>kubectl get networkpolicy -n production</div>
          <div style={{ color: '#10b981' }}>kubectl describe networkpolicy backend-allow-frontend</div>
          <br />
          <div style={{ color: '#64748b' }}># View CNI plugin logs (Calico example)</div>
          <div style={{ color: '#10b981' }}>kubectl logs -n kube-system -l k8s-app=calico-node</div>
        </TermBox>

        <Callout variant="info" title="Pro Tip">
          <p>
            Start with <code>policyTypes: [Ingress]</code> only. Get ingress rules working before adding
            egress rules. Egress + DNS issues are painful to debug.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Real-World Pattern: 3-Tier App</h2>
        <p>Here's a complete NetworkPolicy setup for a typical web app:</p>

        <Callout variant="neutral" title="Architecture">
          <p><strong>Internet</strong> → Ingress → <strong>Frontend</strong> → <strong>Backend</strong> → <strong>Database</strong></p>
        </Callout>

        <TermBox>
          <div style={{ color: '#64748b' }}># 1. Deny all by default</div>
          <div style={{ color: '#10b981' }}>apiVersion: networking.k8s.io/v1</div>
          <div style={{ color: '#10b981' }}>kind: NetworkPolicy</div>
          <div style={{ color: '#10b981' }}>metadata: {'{name: deny-all}'}</div>
          <div style={{ color: '#10b981' }}>spec:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;podSelector: {'{}'}</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;policyTypes: [Ingress, Egress]</div>
          <br />
          <div style={{ color: '#64748b' }}># 2. Allow DNS for everyone</div>
          <div style={{ color: '#10b981' }}>apiVersion: networking.k8s.io/v1</div>
          <div style={{ color: '#10b981' }}>kind: NetworkPolicy</div>
          <div style={{ color: '#10b981' }}>metadata: {'{name: allow-dns}'}</div>
          <div style={{ color: '#10b981' }}>spec:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;podSelector: {'{}'}</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;policyTypes: [Egress]</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;egress:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- to:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;- namespaceSelector: {'{matchLabels: {name: kube-system}}'}</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;ports: [{'{protocol: UDP, port: 53}'}]</div>
          <br />
          <div style={{ color: '#64748b' }}># 3. Frontend: from Ingress, to Backend</div>
          <div style={{ color: '#10b981' }}>kind: NetworkPolicy</div>
          <div style={{ color: '#10b981' }}>metadata: {'{name: frontend-policy}'}</div>
          <div style={{ color: '#10b981' }}>spec:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;podSelector: {'{matchLabels: {app: frontend}}'}</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;policyTypes: [Ingress, Egress]</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;ingress:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- from: [{'{namespaceSelector: {matchLabels: {name: ingress-nginx}}}'}]</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;ports: [{'{protocol: TCP, port: 80}'}]</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;egress:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- to: [{'{podSelector: {matchLabels: {app: backend}}}'}]</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;ports: [{'{protocol: TCP, port: 8080}'}]</div>
          <br />
          <div style={{ color: '#64748b' }}># 4. Backend: from Frontend, to Database</div>
          <div style={{ color: '#10b981' }}>kind: NetworkPolicy</div>
          <div style={{ color: '#10b981' }}>metadata: {'{name: backend-policy}'}</div>
          <div style={{ color: '#10b981' }}>spec:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;podSelector: {'{matchLabels: {app: backend}}'}</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;policyTypes: [Ingress, Egress]</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;ingress:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- from: [{'{podSelector: {matchLabels: {app: frontend}}}'}]</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;ports: [{'{protocol: TCP, port: 8080}'}]</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;egress:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- to: [{'{podSelector: {matchLabels: {app: database}}}'}]</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;ports: [{'{protocol: TCP, port: 5432}'}]</div>
          <br />
          <div style={{ color: '#64748b' }}># 5. Database: from Backend only</div>
          <div style={{ color: '#10b981' }}>kind: NetworkPolicy</div>
          <div style={{ color: '#10b981' }}>metadata: {'{name: database-policy}'}</div>
          <div style={{ color: '#10b981' }}>spec:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;podSelector: {'{matchLabels: {app: database}}'}</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;policyTypes: [Ingress]</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;ingress:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- from: [{'{podSelector: {matchLabels: {app: backend}}}'}]</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;ports: [{'{protocol: TCP, port: 5432}'}]</div>
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>Common Gotchas</h2>

        <Callout variant="danger" title="Gotcha 1: Forgetting DNS">
          <p>
            If you apply an egress policy without allowing DNS, service discovery breaks. Always allow
            egress to kube-system on UDP/TCP port 53.
          </p>
        </Callout>
        <Callout variant="danger" title="Gotcha 2: Label Mismatches">
          <p>
            NetworkPolicies use label selectors. If your Pod labels don't match, the policy won't apply.
            Use <code>kubectl get pods --show-labels</code> to verify.
          </p>
        </Callout>
        <Callout variant="danger" title="Gotcha 3: CNI Plugin Doesn't Support It">
          <p>
            Flannel doesn't support NetworkPolicies. If you're using Flannel, you need to add Calico
            (Canal = Flannel + Calico) or switch to a different CNI entirely.
          </p>
        </Callout>
        <Callout variant="danger" title="Gotcha 4: Policies Are Additive">
          <p>
            Multiple NetworkPolicies that select the same Pod are combined (ORed). You can't "deny"
            with one policy after "allowing" with another. To deny, simply don't create an allow rule.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Monitoring & Auditing</h2>
        <p>How do you know if your NetworkPolicies are working? Use these tools:</p>

        <Callout variant="neutral">
          <ul>
            <li><strong>Calico:</strong> <code>calicoctl get networkpolicy -o yaml</code></li>
            <li><strong>Cilium:</strong> Hubble UI for real-time flow visualization</li>
            <li><strong>Weave:</strong> Weave Scope shows network connections graphically</li>
            <li><strong>Generic:</strong> Enable audit logging and grep for "NetworkPolicy" events</li>
          </ul>
        </Callout>

        <Callout variant="warning" title="Remember">
          <p>
            NetworkPolicies are your firewall inside the cluster. Start with
            deny-all, then explicitly allow what's needed. This is zero trust: every connection is denied
            unless proven necessary. Combined with RBAC and Pod Security, you've got defense in depth.
          </p>
        </Callout>
      </section>
    </ModuleShell>
  );
}
