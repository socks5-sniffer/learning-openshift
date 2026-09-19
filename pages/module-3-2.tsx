import { useState } from 'react';
import styles from '../styles/Home.module.css';
import moduleStyles from '../styles/Module.module.css';
import ModuleShell from '../components/module/ModuleShell';
import Callout from '../components/module/Callout';
import TermBox from '../components/module/TermBox';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  fontSize: '1rem',
  background: 'var(--color-bg-secondary)',
  color: 'var(--color-text-primary)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  marginBottom: '12px',
  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
  boxSizing: 'border-box',
};

export default function Module32() {
  const [encodedSecret, setEncodedSecret] = useState('');
  const [decodedSecret, setDecodedSecret] = useState('');

  const encodeSecret = (text: string) => {
    if (typeof window !== 'undefined') {
      setEncodedSecret(btoa(text));
    }
  };

  const decodeSecret = (text: string) => {
    if (typeof window !== 'undefined') {
      try {
        setDecodedSecret(atob(text));
      } catch {
        setDecodedSecret('Invalid Base64');
      }
    }
  };

  return (
    <ModuleShell id="3-2" subtitle="What Kubernetes Secrets Are (and Are Not)">
      <section className={styles.spotlight}>
        <h2>The Uncomfortable Truth About Kubernetes Secrets</h2>
        <p>
          Let's get this out of the way immediately: Kubernetes Secrets are <strong>not encrypted by
          default</strong>. They are Base64-encoded, which is about as secure as writing your password
          on a sticky note and turning it upside down.
        </p>

        <Callout variant="danger" icon="⚠️" title="Base64 ≠ Encryption">
          <p><strong>Base64 encoding is NOT security:</strong></p>
          <ul>
            <li>Anyone with read access to the Secret can decode it</li>
            <li>Secrets are stored in etcd (Kubernetes' database) in Base64</li>
            <li>Anyone with etcd access can read all Secrets</li>
            <li>Base64 is <strong>reversible</strong>—it's meant for data transport, not security</li>
          </ul>
          <p style={{ fontWeight: 'bold' }}>
            So why use Secrets at all? Because they provide <strong>access control</strong>,
            <strong>audit logging</strong>, and can be <strong>encrypted at rest</strong> with
            additional configuration.
          </p>
        </Callout>

        <Callout variant="info" icon="💡" title="What Secrets Actually Provide">
          <ul>
            <li><strong>RBAC enforcement:</strong> Control who can read Secrets (unlike ConfigMaps in plain YAML)</li>
            <li><strong>Audit trails:</strong> Who accessed which Secret, when</li>
            <li><strong>Encryption at rest (optional):</strong> Can be enabled via EncryptionConfiguration</li>
            <li><strong>Separation from config:</strong> Different object type = different permissions</li>
            <li><strong>Integration points:</strong> Mount as files, inject as env vars (like ConfigMaps)</li>
          </ul>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Interactive: Base64 Is Not Encryption</h2>
        <p>Let's prove that Base64 "obfuscation" provides zero security. Try encoding and decoding a "secret":</p>

        <div
          style={{
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            margin: '20px 0',
          }}
        >
          <h3 style={{ marginTop: 0, color: 'var(--color-text-accent)' }}>Encode a Secret (Base64)</h3>
          <input
            type="text"
            placeholder="Type a password (e.g., SuperSecret123)"
            onChange={(e) => encodeSecret(e.target.value)}
            style={inputStyle}
          />
          {encodedSecret && (
            <div style={{ background: '#0f172a', color: '#22c55e', padding: '16px', borderRadius: 'var(--radius-md)', fontFamily: 'monospace', fontSize: '0.9rem', wordBreak: 'break-all' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Base64 Encoded:</div>
              {encodedSecret}
            </div>
          )}

          <h3 style={{ marginTop: '24px', color: 'var(--color-text-accent)' }}>Decode a Secret (Base64)</h3>
          <input
            type="text"
            placeholder="Paste Base64 string (or try: U3VwZXJTZWNyZXQxMjM=)"
            onChange={(e) => decodeSecret(e.target.value)}
            style={inputStyle}
          />
          {decodedSecret && (
            <div style={{ background: '#0f172a', color: '#ef4444', padding: '16px', borderRadius: 'var(--radius-md)', fontFamily: 'monospace', fontSize: '0.9rem', wordBreak: 'break-all' }}>
              <div style={{ color: '#64748b', marginBottom: '8px' }}>Decoded (Original Secret):</div>
              {decodedSecret}
            </div>
          )}

          <Callout variant="danger">
            <p>
              🚨 <strong>See the problem?</strong> Anyone can decode Base64 instantly. This is why
              Kubernetes Secrets alone are not sufficient for sensitive data in production.
            </p>
          </Callout>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>Creating a Secret</h2>
        <p>
          Despite their limitations, Secrets are still the correct way to store sensitive data in
          Kubernetes (compared to ConfigMaps or hardcoding). Let's see how to create them.
        </p>

        <h3>Method 1: From Literal Values (kubectl)</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># Kubernetes automatically Base64-encodes the values</div>
          <div style={{ color: '#22c55e' }}>kubectl create secret generic db-credentials \</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--from-literal=username=admin \</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--from-literal=password=SuperSecret123</div>
        </TermBox>

        <h3>Method 2: From YAML File (Manual Base64 Encoding)</h3>
        <p>If you write a Secret in YAML, you must Base64-encode values yourself:</p>

        <TermBox>
          <div style={{ color: '#64748b' }}># First, encode your secrets (on Linux/Mac/PowerShell)</div>
          <div style={{ color: '#22c55e' }}>echo -n "admin" | base64</div>
          <div style={{ color: '#64748b' }}># Output: YWRtaW4=</div>
          <br />
          <div style={{ color: '#22c55e' }}>echo -n "SuperSecret123" | base64</div>
          <div style={{ color: '#64748b' }}># Output: U3VwZXJTZWNyZXQxMjM=</div>
        </TermBox>

        <TermBox>
          <div style={{ color: '#64748b' }}># secret.yaml</div>
          <div style={{ color: '#f59e0b' }}>apiVersion: v1</div>
          <div style={{ color: '#f59e0b' }}>kind: Secret</div>
          <div style={{ color: '#f59e0b' }}>metadata:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: db-credentials</div>
          <div style={{ color: '#f59e0b' }}>type: Opaque</div>
          <div style={{ color: '#f59e0b' }}>data:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;username: YWRtaW4=           # Base64 for "admin"</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;password: U3VwZXJTZWNyZXQxMjM=  # Base64 for "SuperSecret123"</div>
        </TermBox>

        <TermBox>
          <div style={{ color: '#64748b' }}># Apply the Secret</div>
          <div style={{ color: '#22c55e' }}>kubectl apply -f secret.yaml</div>
        </TermBox>

        <Callout variant="warning">
          <p>
            ⚠️ <strong>Never commit Secrets to Git</strong> (even Base64-encoded). Use secret
            management tools like Sealed Secrets, External Secrets Operator, or Vault.
          </p>
        </Callout>

        <h3>Method 3: Using stringData (Plain Text in YAML)</h3>
        <p>
          Kubernetes allows <code>stringData</code> as an alternative—values are plain text, and
          Kubernetes encodes them automatically:
        </p>

        <TermBox>
          <div style={{ color: '#64748b' }}># secret.yaml (easier to read, still dangerous in Git)</div>
          <div style={{ color: '#f59e0b' }}>apiVersion: v1</div>
          <div style={{ color: '#f59e0b' }}>kind: Secret</div>
          <div style={{ color: '#f59e0b' }}>metadata:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: db-credentials</div>
          <div style={{ color: '#f59e0b' }}>type: Opaque</div>
          <div style={{ color: '#22c55e' }}>stringData:  # No Base64 needed!</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;username: admin</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;password: SuperSecret123</div>
        </TermBox>

        <Callout variant="info">
          <p>
            💡 <code>stringData</code> is write-only. When you retrieve the Secret, Kubernetes shows
            it as <code>data</code> (Base64-encoded). Useful for local development, not for Git.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Using Secrets in Pods</h2>
        <p>Just like ConfigMaps, Secrets can be injected as environment variables or mounted as files.</p>

        <h3>Option 1: Environment Variables</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># deployment.yaml</div>
          <div style={{ color: '#f59e0b' }}>apiVersion: apps/v1</div>
          <div style={{ color: '#f59e0b' }}>kind: Deployment</div>
          <div style={{ color: '#f59e0b' }}>metadata:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: myapp</div>
          <div style={{ color: '#f59e0b' }}>spec:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;template:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;spec:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;containers:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: app</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;image: myapp:1.0</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;env:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: DB_USERNAME</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;valueFrom:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;secretKeyRef:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: db-credentials</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;key: username</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: DB_PASSWORD</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;valueFrom:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;secretKeyRef:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: db-credentials</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;key: password</div>
        </TermBox>

        <Callout variant="info">
          <p>
            <strong>Inside the container:</strong> <code>DB_USERNAME</code> and <code>DB_PASSWORD</code>
            are available as environment variables (automatically decoded from Base64).
          </p>
        </Callout>

        <h3>Option 2: Mounted as Files (Volumes)</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># deployment.yaml</div>
          <div style={{ color: '#f59e0b' }}>apiVersion: apps/v1</div>
          <div style={{ color: '#f59e0b' }}>kind: Deployment</div>
          <div style={{ color: '#f59e0b' }}>metadata:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: myapp</div>
          <div style={{ color: '#f59e0b' }}>spec:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;template:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;spec:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;containers:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: app</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;image: myapp:1.0</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;volumeMounts:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: secret-volume</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mountPath: /etc/secrets</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;readOnly: true  # Secrets should always be read-only</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;volumes:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: secret-volume</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;secret:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;secretName: db-credentials</div>
        </TermBox>

        <Callout variant="info">
          <p>
            <strong>Inside the container:</strong><br />
            <code>/etc/secrets/username</code> (contains: admin)<br />
            <code>/etc/secrets/password</code> (contains: SuperSecret123)<br />
            Values are automatically decoded from Base64.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Secret Types</h2>
        <p>Kubernetes supports different Secret types for different use cases:</p>

        <div style={{ display: 'grid', gap: '1rem', margin: '1.5rem 0' }}>
          <Callout variant="info" title="Opaque (Default)">
            <p>Generic key-value pairs. Use for database passwords, API keys, tokens, etc.</p>
          </Callout>
          <Callout variant="success" title="kubernetes.io/dockerconfigjson">
            <p>Docker registry credentials. Used by Pods to pull private container images.</p>
          </Callout>
          <Callout variant="warning" title="kubernetes.io/tls">
            <p>TLS certificates and private keys. Used by Ingress controllers for HTTPS.</p>
          </Callout>
          <Callout variant="neutral" title="kubernetes.io/service-account-token">
            <p>Service account tokens. Automatically created by Kubernetes for Pod authentication.</p>
          </Callout>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>Common Secret Commands</h2>

        <TermBox>
          <div style={{ color: '#64748b' }}># List all Secrets</div>
          <div style={{ color: '#22c55e' }}>kubectl get secrets</div>
          <br />
          <div style={{ color: '#64748b' }}># View Secret details (values are hidden by default)</div>
          <div style={{ color: '#22c55e' }}>kubectl describe secret db-credentials</div>
          <br />
          <div style={{ color: '#64748b' }}># View Secret with Base64 values</div>
          <div style={{ color: '#22c55e' }}>kubectl get secret db-credentials -o yaml</div>
          <br />
          <div style={{ color: '#64748b' }}># Decode a specific Secret value</div>
          <div style={{ color: '#22c55e' }}>{"kubectl get secret db-credentials -o jsonpath='{.data.password}' | base64 --decode"}</div>
          <br />
          <div style={{ color: '#64748b' }}># Delete a Secret</div>
          <div style={{ color: '#ef4444' }}>kubectl delete secret db-credentials</div>
          <br />
          <div style={{ color: '#64748b' }}># Create TLS Secret from certificate files</div>
          <div style={{ color: '#22c55e' }}>kubectl create secret tls my-tls-secret \</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--cert=path/to/cert.crt \</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--key=path/to/key.key</div>
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>Making Secrets Actually Secure</h2>
        <p>
          Kubernetes Secrets out-of-the-box are not production-ready for sensitive data. Here's how
          to harden them:
        </p>

        <h3>1. Enable Encryption at Rest</h3>
        <Callout variant="neutral">
          <p>
            By default, Secrets are stored in etcd <strong>unencrypted</strong>. Anyone with etcd
            access can read them. Enable encryption at rest in your cluster:
          </p>
          <ul>
            <li>Configure <code>EncryptionConfiguration</code> on the API server</li>
            <li>Secrets are encrypted before being written to etcd</li>
            <li>Requires cluster admin access (managed Kubernetes services often enable this)</li>
          </ul>
        </Callout>

        <h3>2. Use External Secret Managers (Recommended)</h3>
        <Callout variant="success" icon="✅" title="Production Best Practice">
          <p>Don't store secrets in Kubernetes at all. Use a dedicated secret manager:</p>
          <ul>
            <li><strong>HashiCorp Vault:</strong> Industry standard, full-featured secret management</li>
            <li><strong>AWS Secrets Manager:</strong> For AWS workloads</li>
            <li><strong>Azure Key Vault:</strong> For Azure workloads</li>
            <li><strong>Google Secret Manager:</strong> For GCP workloads</li>
            <li><strong>External Secrets Operator:</strong> Syncs secrets from external sources to Kubernetes</li>
            <li><strong>Sealed Secrets:</strong> Encrypt secrets so they can be safely stored in Git</li>
          </ul>
        </Callout>

        <h3>3. Limit RBAC Access</h3>
        <Callout variant="neutral">
          <p>Use RBAC to control who can read Secrets:</p>
          <ul>
            <li>Developers shouldn't have <code>get secrets</code> permission in production</li>
            <li>Use separate namespaces for different teams</li>
            <li>ServiceAccounts should only access Secrets they need</li>
            <li>Audit who accesses Secrets (enable audit logging)</li>
          </ul>
        </Callout>

        <h3>4. Avoid Environment Variables (Use Files)</h3>
        <Callout variant="warning">
          <p>⚠️ <strong>Security risk:</strong> Environment variables can be leaked through:</p>
          <ul>
            <li>Process listings (<code>ps aux</code> shows env vars)</li>
            <li>Crash dumps and error logs</li>
            <li>Child processes (inherit parent's env vars)</li>
          </ul>
          <p style={{ fontWeight: 'bold' }}>
            Prefer mounting Secrets as files with <code>readOnly: true</code>. Files have tighter
            permissions and don't leak through process trees.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>When to Use Secrets vs External Secret Managers</h2>

        <div className={moduleStyles.grid}>
          <Callout variant="info" title="Use Kubernetes Secrets">
            <ul>
              <li>Development/testing environments</li>
              <li>Low-security workloads</li>
              <li>Small teams with good RBAC hygiene</li>
              <li>TLS certificates (short-lived)</li>
              <li>ServiceAccount tokens (auto-managed)</li>
            </ul>
          </Callout>

          <Callout variant="success" title="Use External Secret Managers">
            <ul>
              <li>Production environments</li>
              <li>Compliance requirements (PCI-DSS, HIPAA)</li>
              <li>Database passwords, API keys</li>
              <li>Multi-cluster deployments</li>
              <li>Secret rotation requirements</li>
            </ul>
          </Callout>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>Real-World Example: Database Credentials</h2>

        <h3>Create Secret for Database</h3>
        <TermBox>
          <div style={{ color: '#22c55e' }}>kubectl create secret generic postgres-credentials \</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--from-literal=username=appuser \</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--from-literal=password=MyS3cur3P@ssw0rd \</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--from-literal=host=postgres.default.svc.cluster.local \</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--from-literal=port=5432</div>
        </TermBox>

        <h3>Use in Deployment</h3>
        <TermBox>
          <div style={{ color: '#f59e0b' }}>apiVersion: apps/v1</div>
          <div style={{ color: '#f59e0b' }}>kind: Deployment</div>
          <div style={{ color: '#f59e0b' }}>metadata:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: backend</div>
          <div style={{ color: '#f59e0b' }}>spec:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;template:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;spec:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;containers:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: app</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;image: backend:1.0</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;env:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: DB_USER</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;valueFrom:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;secretKeyRef:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: postgres-credentials</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;key: username</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: DB_PASSWORD</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;valueFrom:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;secretKeyRef:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: postgres-credentials</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;key: password</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: DB_HOST</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;valueFrom:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;secretKeyRef:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: postgres-credentials</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;key: host</div>
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>Key Takeaways</h2>
        <ul>
          <li><strong>Kubernetes Secrets</strong> are Base64-encoded, not encrypted by default</li>
          <li>Base64 is <strong>trivially reversible</strong>—anyone can decode it</li>
          <li>Secrets provide <strong>access control and audit trails</strong>, not encryption</li>
          <li>Enable <strong>encryption at rest</strong> for production clusters</li>
          <li>Use <strong>RBAC</strong> to limit who can read Secrets</li>
          <li>Prefer <strong>external secret managers</strong> (Vault, AWS Secrets Manager) for production</li>
          <li>Mount Secrets as <strong>files</strong> instead of env vars (more secure)</li>
          <li>Never commit Secrets to Git (even Base64-encoded)</li>
          <li>Use <strong>Sealed Secrets</strong> or <strong>External Secrets Operator</strong> for GitOps workflows</li>
          <li>Secret types: <code>Opaque</code>, <code>dockerconfigjson</code>, <code>tls</code>, <code>service-account-token</code></li>
        </ul>
      </section>
    </ModuleShell>
  );
}
