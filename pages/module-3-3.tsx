import { useState } from 'react';
import styles from '../styles/Home.module.css';
import moduleStyles from '../styles/Module.module.css';
import ModuleShell from '../components/module/ModuleShell';
import Callout from '../components/module/Callout';
import TermBox from '../components/module/TermBox';

const envConfigs = {
  dev: {
    color: '#0ea5e9',
    replicas: 1,
    resources: 'Low (0.1 CPU, 128Mi)',
    logLevel: 'debug',
    database: 'dev-postgres.local',
    caching: 'Disabled',
    monitoring: 'Basic',
    autoScaling: 'Disabled',
  },
  staging: {
    color: '#f59e0b',
    replicas: 2,
    resources: 'Medium (0.5 CPU, 512Mi)',
    logLevel: 'info',
    database: 'staging-postgres.internal',
    caching: 'Redis (single node)',
    monitoring: 'Full (Prometheus)',
    autoScaling: 'Enabled (2-5 replicas)',
  },
  prod: {
    color: '#22c55e',
    replicas: 5,
    resources: 'High (2 CPU, 2Gi)',
    logLevel: 'error',
    database: 'prod-postgres-ha.aws.rds',
    caching: 'Redis Cluster (HA)',
    monitoring: 'Full + Alerting',
    autoScaling: 'Enabled (5-20 replicas)',
  },
};

export default function Module33() {
  const [selectedEnv, setSelectedEnv] = useState<'dev' | 'staging' | 'prod'>('dev');
  const current = envConfigs[selectedEnv];

  const envButton = (env: 'dev' | 'staging' | 'prod'): React.CSSProperties => ({
    padding: '12px 24px',
    background: selectedEnv === env ? envConfigs[env].color : 'var(--color-bg-tertiary)',
    color: selectedEnv === env ? '#fff' : 'var(--color-text-secondary)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '1rem',
    transition: 'all var(--transition-fast)',
  });

  return (
    <ModuleShell id="3-3" subtitle="Dev vs Staging vs Production">
      <section className={styles.spotlight}>
        <h2>The Three Kingdoms: Dev, Staging, Production</h2>
        <p>
          Every serious application runs in multiple environments. The challenge is managing the
          differences between them <em>without losing your mind</em>.
        </p>

        <Callout variant="info" icon="💡" title="The Golden Rule">
          <p style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>
            Same code, same containers, different configuration.
          </p>
        </Callout>

        <p>
          You should be able to take the <strong>exact same container image</strong> (e.g.,
          <code>myapp:v1.2.3</code>) and deploy it to dev, staging, and production with zero code
          changes. Only the <strong>ConfigMaps and Secrets</strong> should differ.
        </p>
      </section>

      <section className={styles.spotlight}>
        <h2>Interactive: Environment Comparison</h2>
        <p>Select an environment to see how configurations differ across dev, staging, and production:</p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', margin: '20px 0', flexWrap: 'wrap' }}>
          <button onClick={() => setSelectedEnv('dev')} style={envButton('dev')}>Development</button>
          <button onClick={() => setSelectedEnv('staging')} style={envButton('staging')}>Staging</button>
          <button onClick={() => setSelectedEnv('prod')} style={envButton('prod')}>Production</button>
        </div>

        <div
          style={{
            background: 'var(--color-bg-elevated)',
            border: `2px solid ${current.color}`,
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            margin: '20px 0',
            transition: 'all 0.3s',
          }}
        >
          <h3 style={{ marginTop: 0, color: current.color, textTransform: 'uppercase' }}>
            {selectedEnv === 'dev' ? '🛠️ Development' : selectedEnv === 'staging' ? '🧪 Staging' : '🚀 Production'}
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              color: 'var(--color-text-secondary)',
              fontSize: '0.95rem',
            }}
          >
            <div><strong>Replicas:</strong> {current.replicas}</div>
            <div><strong>Resources:</strong> {current.resources}</div>
            <div><strong>Log Level:</strong> {current.logLevel}</div>
            <div><strong>Database:</strong> {current.database}</div>
            <div><strong>Caching:</strong> {current.caching}</div>
            <div><strong>Monitoring:</strong> {current.monitoring}</div>
            <div style={{ gridColumn: '1 / -1' }}><strong>Auto-scaling:</strong> {current.autoScaling}</div>
          </div>
        </div>

        <Callout variant="neutral" title="Key Observations">
          <ul>
            <li><strong>Development:</strong> Fast iteration, verbose logging, minimal resources</li>
            <li><strong>Staging:</strong> Production-like setup for testing, medium scale</li>
            <li><strong>Production:</strong> High availability, performance-tuned, full monitoring</li>
          </ul>
          <p style={{ fontStyle: 'italic' }}>
            All three environments run the <strong>same container image</strong>—only ConfigMaps
            and Secrets differ.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Environment Isolation Strategies</h2>
        <p>How do you separate dev, staging, and production in Kubernetes? There are three main approaches:</p>

        <h3>Option 1: Separate Namespaces (Same Cluster)</h3>
        <Callout variant="info" title="Small Teams, Low Budget">
          <p><strong>Setup:</strong> One cluster, multiple namespaces (<code>dev</code>, <code>staging</code>, <code>prod</code>)</p>

          <TermBox>
            <div style={{ color: '#64748b' }}># Create namespaces</div>
            <div style={{ color: '#22c55e' }}>kubectl create namespace dev</div>
            <div style={{ color: '#22c55e' }}>kubectl create namespace staging</div>
            <div style={{ color: '#22c55e' }}>kubectl create namespace production</div>
          </TermBox>

          <p><strong>Pros:</strong></p>
          <ul>
            <li>✅ Cheap (single cluster)</li>
            <li>✅ Easy to manage</li>
            <li>✅ Resource sharing (efficient utilization)</li>
          </ul>

          <p><strong>Cons:</strong></p>
          <ul>
            <li>❌ Weak isolation (namespaces share nodes, network)</li>
            <li>❌ A prod incident can affect dev/staging</li>
            <li>❌ Security risk: namespace escape vulnerabilities</li>
            <li>❌ Not suitable for compliance requirements (PCI-DSS, HIPAA)</li>
          </ul>

          <p><strong>Best for:</strong> Startups, internal tools, low-stakes applications</p>
        </Callout>

        <h3>Option 2: Separate Clusters</h3>
        <Callout variant="success" title="Production-Grade Isolation">
          <p><strong>Setup:</strong> Three separate clusters (<code>dev-cluster</code>, <code>staging-cluster</code>, <code>prod-cluster</code>)</p>

          <p><strong>Pros:</strong></p>
          <ul>
            <li>✅ Strong isolation (blast radius limited to one cluster)</li>
            <li>✅ Independent scaling</li>
            <li>✅ Different cluster configurations per environment</li>
            <li>✅ Compliance-friendly</li>
            <li>✅ Upgrades can be tested in dev/staging first</li>
          </ul>

          <p><strong>Cons:</strong></p>
          <ul>
            <li>❌ More expensive (3x cluster costs)</li>
            <li>❌ More operational overhead</li>
            <li>❌ Harder to test cross-environment issues</li>
          </ul>

          <p><strong>Best for:</strong> Enterprises, regulated industries, high-availability requirements</p>
        </Callout>

        <h3>Option 3: Hybrid (Dev/Staging Together, Production Separate)</h3>
        <Callout variant="warning" title="Balanced Approach">
          <p>
            <strong>Setup:</strong> Two clusters—one for non-prod (<code>dev</code> + <code>staging</code> namespaces),
            one for production
          </p>

          <p><strong>Pros:</strong></p>
          <ul>
            <li>✅ Cost-effective (2 clusters instead of 3)</li>
            <li>✅ Production isolation (most important)</li>
            <li>✅ Dev/staging can break without affecting prod</li>
          </ul>

          <p><strong>Cons:</strong></p>
          <ul>
            <li>❌ Dev issues can affect staging (same cluster)</li>
            <li>❌ More complex than single-cluster setup</li>
          </ul>

          <p><strong>Best for:</strong> Growing companies, mid-market, most real-world scenarios</p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Directory Structure for Multi-Environment Deployments</h2>
        <p>How do you organize YAML files when managing multiple environments? Here's a proven structure:</p>

        <TermBox copyable={false}>
          <div style={{ color: '#f59e0b' }}>kubernetes/</div>
          <div style={{ color: '#e2e8f0' }}>├── base/                     # Shared across all envs</div>
          <div style={{ color: '#e2e8f0' }}>│   ├── deployment.yaml       # Template Deployment</div>
          <div style={{ color: '#e2e8f0' }}>│   ├── service.yaml          # Template Service</div>
          <div style={{ color: '#e2e8f0' }}>│   └── kustomization.yaml    # Base config</div>
          <div style={{ color: '#e2e8f0' }}>│</div>
          <div style={{ color: '#0ea5e9' }}>├── overlays/</div>
          <div style={{ color: '#0ea5e9' }}>│   ├── dev/</div>
          <div style={{ color: '#0ea5e9' }}>│   │   ├── configmap.yaml        # Dev-specific config</div>
          <div style={{ color: '#0ea5e9' }}>│   │   ├── kustomization.yaml    # Dev patches</div>
          <div style={{ color: '#0ea5e9' }}>│   │   └── secrets.yaml          # Dev secrets</div>
          <div style={{ color: '#f59e0b' }}>│   ├── staging/</div>
          <div style={{ color: '#f59e0b' }}>│   │   ├── configmap.yaml        # Staging-specific config</div>
          <div style={{ color: '#f59e0b' }}>│   │   ├── kustomization.yaml    # Staging patches</div>
          <div style={{ color: '#f59e0b' }}>│   │   └── secrets.yaml          # Staging secrets</div>
          <div style={{ color: '#22c55e' }}>│   └── production/</div>
          <div style={{ color: '#22c55e' }}>│       ├── configmap.yaml        # Prod-specific config</div>
          <div style={{ color: '#22c55e' }}>│       ├── kustomization.yaml    # Prod patches</div>
          <div style={{ color: '#22c55e' }}>│       └── secrets.yaml          # Prod secrets (use Vault!)</div>
        </TermBox>

        <p>
          This uses <strong>Kustomize</strong> (built into kubectl) to apply environment-specific
          patches to a base configuration. Other tools: Helm, Jsonnet, or plain kubectl.
        </p>
      </section>

      <section className={styles.spotlight}>
        <h2>Example: Multi-Environment Deployment with Kustomize</h2>

        <h3>Base Deployment (Shared Template)</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># base/deployment.yaml</div>
          <div style={{ color: '#f59e0b' }}>apiVersion: apps/v1</div>
          <div style={{ color: '#f59e0b' }}>kind: Deployment</div>
          <div style={{ color: '#f59e0b' }}>metadata:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: myapp</div>
          <div style={{ color: '#f59e0b' }}>spec:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;replicas: 1  # Default, overridden per env</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;template:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;spec:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;containers:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: app</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;image: myapp:latest  # Overridden per env</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;envFrom:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- configMapRef:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: app-config</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- secretRef:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: app-secrets</div>
        </TermBox>

        <h3>Development Overlay (Patches for Dev)</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># overlays/dev/kustomization.yaml</div>
          <div style={{ color: '#f59e0b' }}>apiVersion: kustomize.config.k8s.io/v1beta1</div>
          <div style={{ color: '#f59e0b' }}>kind: Kustomization</div>
          <div style={{ color: '#e2e8f0' }}>namespace: dev</div>
          <div style={{ color: '#e2e8f0' }}>bases:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;- ../../base</div>
          <div style={{ color: '#22c55e' }}>images:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;- name: myapp</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;newTag: v1.2.3  # Pin to specific version</div>
          <div style={{ color: '#22c55e' }}>replicas:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;- name: myapp</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;count: 1  # Dev only needs 1 replica</div>
          <div style={{ color: '#e2e8f0' }}>configMapGenerator:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;- name: app-config</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;literals:</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;- LOG_LEVEL=debug</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;- DATABASE_URL=dev-db:5432</div>
        </TermBox>

        <h3>Production Overlay (Patches for Prod)</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># overlays/production/kustomization.yaml</div>
          <div style={{ color: '#f59e0b' }}>apiVersion: kustomize.config.k8s.io/v1beta1</div>
          <div style={{ color: '#f59e0b' }}>kind: Kustomization</div>
          <div style={{ color: '#e2e8f0' }}>namespace: production</div>
          <div style={{ color: '#e2e8f0' }}>bases:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;- ../../base</div>
          <div style={{ color: '#22c55e' }}>images:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;- name: myapp</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;newTag: v1.2.3  # Same image as dev!</div>
          <div style={{ color: '#22c55e' }}>replicas:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;- name: myapp</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;count: 5  # Production needs more replicas</div>
          <div style={{ color: '#e2e8f0' }}>configMapGenerator:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;- name: app-config</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;literals:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;- LOG_LEVEL=error</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;- DATABASE_URL=prod-db-ha.rds:5432</div>
        </TermBox>

        <h3>Deploy to Each Environment</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># Deploy to dev</div>
          <div style={{ color: '#0ea5e9' }}>kubectl apply -k overlays/dev/</div>
          <br />
          <div style={{ color: '#64748b' }}># Deploy to staging</div>
          <div style={{ color: '#f59e0b' }}>kubectl apply -k overlays/staging/</div>
          <br />
          <div style={{ color: '#64748b' }}># Deploy to production</div>
          <div style={{ color: '#22c55e' }}>kubectl apply -k overlays/production/</div>
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>Avoiding Configuration Drift</h2>
        <p>
          <strong>Configuration drift</strong> happens when environments diverge over time—someone
          makes a change in dev that never makes it to prod, or vice versa. This causes bugs like
          "it works in dev but breaks in prod."
        </p>

        <h3>How Configuration Drift Happens</h3>
        <Callout variant="danger">
          <ul>
            <li>Manual <code>kubectl edit</code> commands that aren't documented</li>
            <li>Different people managing different environments</li>
            <li>No version control for Kubernetes manifests</li>
            <li>Emergency hotfixes applied only to prod</li>
            <li>ConfigMaps updated in one env, forgotten in others</li>
          </ul>
        </Callout>

        <h3>How to Prevent Configuration Drift</h3>
        <Callout variant="success" icon="✅" title="Best Practices">
          <ol style={{ lineHeight: '1.8' }}>
            <li><strong>GitOps:</strong> Store all Kubernetes manifests in Git. Deploy from Git only.</li>
            <li><strong>Infrastructure as Code:</strong> Treat YAML files like code (review, test, version)</li>
            <li><strong>Automated Deployments:</strong> Use CI/CD pipelines (GitHub Actions, GitLab CI, ArgoCD)</li>
            <li><strong>Same Base Config:</strong> Use Kustomize, Helm, or templates—never copy-paste YAML</li>
            <li><strong>Promote Images:</strong> Test <code>myapp:v1.2.3</code> in dev → staging → prod (same image!)</li>
            <li><strong>Audit Logs:</strong> Monitor who changes what, when</li>
            <li><strong>No Manual Edits:</strong> Forbid <code>kubectl edit</code> in production</li>
          </ol>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Environment Promotion Workflow</h2>
        <p>A typical promotion workflow looks like this:</p>

        <TermBox copyable={false}>
          <div style={{ color: '#0ea5e9' }}>┌─────────────┐</div>
          <div style={{ color: '#0ea5e9' }}>│     Dev     │  1. Deploy new feature</div>
          <div style={{ color: '#0ea5e9' }}>│  myapp:123  │     Test locally</div>
          <div style={{ color: '#0ea5e9' }}>└─────┬───────┘</div>
          <div style={{ color: '#64748b' }}>      │</div>
          <div style={{ color: '#64748b' }}>      │ 2. Automated tests pass</div>
          <div style={{ color: '#64748b' }}>      ▼</div>
          <div style={{ color: '#f59e0b' }}>┌─────────────┐</div>
          <div style={{ color: '#f59e0b' }}>│   Staging   │  3. Deploy same image</div>
          <div style={{ color: '#f59e0b' }}>│  myapp:123  │     Integration tests</div>
          <div style={{ color: '#f59e0b' }}>└─────┬───────┘     QA approval</div>
          <div style={{ color: '#64748b' }}>      │</div>
          <div style={{ color: '#64748b' }}>      │ 4. Manual approval (in most orgs)</div>
          <div style={{ color: '#64748b' }}>      ▼</div>
          <div style={{ color: '#22c55e' }}>┌─────────────┐</div>
          <div style={{ color: '#22c55e' }}>│ Production  │  5. Deploy same image</div>
          <div style={{ color: '#22c55e' }}>│  myapp:123  │     Monitor closely</div>
          <div style={{ color: '#22c55e' }}>└─────────────┘     Rollback if needed</div>
        </TermBox>

        <Callout variant="info" icon="💡" title="Key Principle">
          <p>
            The <strong>exact same container image</strong> (<code>myapp:123</code>) moves through
            all environments. This eliminates "it works in dev" bugs caused by rebuilding images
            per environment.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Real-World Tips</h2>

        <Callout variant="neutral" icon="🔧" title="Practical Advice from the Trenches">
          <ul style={{ lineHeight: '1.8' }}>
            <li><strong>Start simple:</strong> Use namespaces for dev/staging, separate cluster for prod</li>
            <li><strong>Image tags:</strong> Use semantic versioning (<code>v1.2.3</code>), never <code>:latest</code></li>
            <li><strong>Config changes:</strong> Treat them like code changes (PR, review, merge)</li>
            <li><strong>Secrets:</strong> Dev can use plain Secrets, prod should use Vault/AWS Secrets Manager</li>
            <li><strong>Resource limits:</strong> Dev can be relaxed, prod should have strict limits</li>
            <li><strong>Monitoring:</strong> Dev = basic logging, prod = full observability stack</li>
            <li><strong>Database connections:</strong> Dev can use port-forward, prod needs proper DNS</li>
            <li><strong>Staging should mirror prod:</strong> Same resources, same configs (just smaller scale)</li>
          </ul>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Tools for Multi-Environment Management</h2>
        <p>Beyond kubectl and Kustomize, here are tools teams use in production:</p>

        <div className={moduleStyles.grid}>
          <Callout variant="info" title="Helm">
            <p>Package manager for Kubernetes. Templates + values files for different environments.</p>
          </Callout>
          <Callout variant="success" title="ArgoCD">
            <p>GitOps continuous delivery. Automatically syncs Git state to cluster state.</p>
          </Callout>
          <Callout variant="warning" title="Flux">
            <p>GitOps operator. Monitors Git repos and applies changes automatically.</p>
          </Callout>
          <Callout variant="neutral" title="Terraform">
            <p>Infrastructure as Code. Provision clusters and manage resources declaratively.</p>
          </Callout>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>Key Takeaways</h2>
        <ul>
          <li><strong>Same image, different config</strong> across all environments</li>
          <li>Use <strong>namespaces</strong> for dev/staging, <strong>separate cluster</strong> for production</li>
          <li><strong>Kustomize</strong> or <strong>Helm</strong> for managing environment-specific configs</li>
          <li><strong>GitOps:</strong> Store all manifests in Git, deploy from Git only</li>
          <li><strong>Promote images</strong> through environments (dev → staging → prod)</li>
          <li>Prevent <strong>configuration drift</strong> with automation and version control</li>
          <li><strong>Staging should mirror production</strong> (same config, smaller scale)</li>
          <li>Use <strong>CI/CD pipelines</strong> to automate deployments</li>
          <li><strong>No manual edits</strong> in production (<code>kubectl edit</code> is banned)</li>
          <li>ConfigMaps for <strong>non-sensitive</strong> config, Secrets for <strong>credentials</strong></li>
        </ul>
      </section>
    </ModuleShell>
  );
}
