import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../styles/Home.module.css';
import ModuleCompletion from '../components/ModuleCompletion';

export default function Module32() {
  const [encodedSecret, setEncodedSecret] = useState('');
  const [decodedSecret, setDecodedSecret] = useState('');

  const encodeSecret = (text: string) => {
    if (typeof window !== 'undefined') {
      const encoded = btoa(text);
      setEncodedSecret(encoded);
    }
  };

  const decodeSecret = (text: string) => {
    if (typeof window !== 'undefined') {
      try {
        const decoded = atob(text);
        setDecodedSecret(decoded);
      } catch (e) {
        setDecodedSecret('Invalid Base64');
      }
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Module 3.2: Secrets</title>
        <meta name="description" content="Understanding Kubernetes Secrets and their limitations" />
      </Head>

      {/* Home link in top right */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 30,
        zIndex: 10
      }}>
        <Link href="/learning-modules" style={{
            textDecoration: 'none',
            color: '#9c0606ff',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            background: 'rgba(255,255,255,0.85)',
            padding: '8px 16px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>All Modules</Link>
      </div>

      <main className={styles.main}>
        <h1 className={styles.title}>Module 3.2: Secrets</h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280', marginTop: '-10px' }}>
          What Kubernetes Secrets Are (and Are Not)
        </p>
        
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/module-3-1" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>← Previous: ConfigMaps</Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/learning-modules" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>All Modules</Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/module-3-3" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>Next: Environment Strategy →</Link>
        </div>
        
        <section className={styles.spotlight}>
          <h2>The Uncomfortable Truth About Kubernetes Secrets</h2>
          <p>
            Let's get this out of the way immediately: Kubernetes Secrets are <strong>not encrypted by 
            default</strong>. They are Base64-encoded, which is about as secure as writing your password 
            on a sticky note and turning it upside down.
          </p>

          <div style={{
            background: '#fef2f2',
            border: '2px solid #ef4444',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#dc2626' }}>⚠️ Base64 ≠ Encryption</h3>
            <p><strong>Base64 encoding is NOT security:</strong></p>
            <ul>
              <li>Anyone with read access to the Secret can decode it</li>
              <li>Secrets are stored in etcd (Kubernetes' database) in Base64</li>
              <li>Anyone with etcd access can read all Secrets</li>
              <li>Base64 is <strong>reversible</strong>—it's meant for data transport, not security</li>
            </ul>
            <p style={{ fontWeight: 'bold', marginTop: '16px' }}>
              So why use Secrets at all? Because they provide <strong>access control</strong>, 
              <strong>audit logging</strong>, and can be <strong>encrypted at rest</strong> with 
              additional configuration.
            </p>
          </div>

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#0369a1' }}>💡 What Secrets Actually Provide</h3>
            <ul>
              <li><strong>RBAC enforcement:</strong> Control who can read Secrets (unlike ConfigMaps in plain YAML)</li>
              <li><strong>Audit trails:</strong> Who accessed which Secret, when</li>
              <li><strong>Encryption at rest (optional):</strong> Can be enabled via EncryptionConfiguration</li>
              <li><strong>Separation from config:</strong> Different object type = different permissions</li>
              <li><strong>Integration points:</strong> Mount as files, inject as env vars (like ConfigMaps)</li>
            </ul>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Interactive: Base64 Is Not Encryption</h2>
          <p>
            Let's prove that Base64 "obfuscation" provides zero security. Try encoding and decoding a "secret":
          </p>

          <div style={{
            background: '#f9fafb',
            border: '2px solid #475569',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0'
          }}>
            <h3 style={{ marginTop: 0, color: '#9c0606ff' }}>Encode a Secret (Base64)</h3>
            <input
              type="text"
              placeholder="Type a password (e.g., SuperSecret123)"
              onChange={(e) => encodeSecret(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '1rem',
                border: '2px solid #475569',
                borderRadius: '8px',
                marginBottom: '12px',
                fontFamily: 'monospace'
              }}
            />
            {encodedSecret && (
              <div style={{
                background: '#1e293b',
                color: '#22c55e',
                padding: '16px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                wordBreak: 'break-all'
              }}>
                <div style={{ color: '#64748b', marginBottom: '8px' }}>Base64 Encoded:</div>
                {encodedSecret}
              </div>
            )}

            <h3 style={{ marginTop: '24px', color: '#9c0606ff' }}>Decode a Secret (Base64)</h3>
            <input
              type="text"
              placeholder="Paste Base64 string (or try: U3VwZXJTZWNyZXQxMjM=)"
              onChange={(e) => decodeSecret(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '1rem',
                border: '2px solid #475569',
                borderRadius: '8px',
                marginBottom: '12px',
                fontFamily: 'monospace'
              }}
            />
            {decodedSecret && (
              <div style={{
                background: '#1e293b',
                color: '#ef4444',
                padding: '16px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                wordBreak: 'break-all'
              }}>
                <div style={{ color: '#64748b', marginBottom: '8px' }}>Decoded (Original Secret):</div>
                {decodedSecret}
              </div>
            )}

            <div style={{
              background: '#fef2f2',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              padding: '16px',
              marginTop: '20px',
              color: '#1e293b'
            }}>
              <p style={{ margin: 0 }}>
                🚨 <strong>See the problem?</strong> Anyone can decode Base64 instantly. This is why 
                Kubernetes Secrets alone are not sufficient for sensitive data in production.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Creating a Secret</h2>
          <p>
            Despite their limitations, Secrets are still the correct way to store sensitive data in 
            Kubernetes (compared to ConfigMaps or hardcoding). Let's see how to create them.
          </p>

          <h3>Method 1: From Literal Values (kubectl)</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            overflowX: 'auto',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># Kubernetes automatically Base64-encodes the values</div>
            <div style={{ color: '#22c55e' }}>kubectl create secret generic db-credentials \</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--from-literal=username=admin \</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--from-literal=password=SuperSecret123</div>
          </div>

          <h3>Method 2: From YAML File (Manual Base64 Encoding)</h3>
          <p style={{ color: '#1e293b' }}>
            If you write a Secret in YAML, you must Base64-encode values yourself:
          </p>

          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            overflowX: 'auto',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># First, encode your secrets (on Linux/Mac/PowerShell)</div>
            <div style={{ color: '#22c55e' }}>echo -n "admin" | base64</div>
            <div style={{ color: '#64748b' }}># Output: YWRtaW4=</div>
            <br/>
            <div style={{ color: '#22c55e' }}>echo -n "SuperSecret123" | base64</div>
            <div style={{ color: '#64748b' }}># Output: U3VwZXJTZWNyZXQxMjM=</div>
          </div>

          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            overflowX: 'auto',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># secret.yaml</div>
            <div style={{ color: '#f59e0b' }}>apiVersion: v1</div>
            <div style={{ color: '#f59e0b' }}>kind: Secret</div>
            <div style={{ color: '#f59e0b' }}>metadata:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: db-credentials</div>
            <div style={{ color: '#f59e0b' }}>type: Opaque</div>
            <div style={{ color: '#f59e0b' }}>data:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;username: YWRtaW4=           # Base64 for "admin"</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;password: U3VwZXJTZWNyZXQxMjM=  # Base64 for "SuperSecret123"</div>
          </div>

          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '16px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># Apply the Secret</div>
            <div style={{ color: '#22c55e' }}>kubectl apply -f secret.yaml</div>
          </div>

          <div style={{
            background: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '8px',
            padding: '16px',
            margin: '16px 0',
            color: '#1e293b'
          }}>
            <p style={{ margin: 0 }}>
              ⚠️ <strong>Never commit Secrets to Git</strong> (even Base64-encoded). Use secret 
              management tools like Sealed Secrets, External Secrets Operator, or Vault.
            </p>
          </div>

          <h3>Method 3: Using stringData (Plain Text in YAML)</h3>
          <p style={{ color: '#1e293b' }}>
            Kubernetes allows <code>stringData</code> as an alternative—values are plain text, and 
            Kubernetes encodes them automatically:
          </p>

          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            overflowX: 'auto',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># secret.yaml (easier to read, still dangerous in Git)</div>
            <div style={{ color: '#f59e0b' }}>apiVersion: v1</div>
            <div style={{ color: '#f59e0b' }}>kind: Secret</div>
            <div style={{ color: '#f59e0b' }}>metadata:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: db-credentials</div>
            <div style={{ color: '#f59e0b' }}>type: Opaque</div>
            <div style={{ color: '#22c55e' }}>stringData:  # No Base64 needed!</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;username: admin</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;password: SuperSecret123</div>
          </div>

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '16px',
            margin: '16px 0',
            color: '#1e293b'
          }}>
            <p style={{ margin: 0 }}>
              💡 <code>stringData</code> is write-only. When you retrieve the Secret, Kubernetes shows 
              it as <code>data</code> (Base64-encoded). Useful for local development, not for Git.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Using Secrets in Pods</h2>
          <p>
            Just like ConfigMaps, Secrets can be injected as environment variables or mounted as files.
          </p>

          <h3>Option 1: Environment Variables</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
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
          </div>

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '16px',
            margin: '16px 0',
            color: '#1e293b'
          }}>
            <p style={{ margin: 0 }}>
              <strong>Inside the container:</strong> <code>DB_USERNAME</code> and <code>DB_PASSWORD</code> 
              are available as environment variables (automatically decoded from Base64).
            </p>
          </div>

          <h3>Option 2: Mounted as Files (Volumes)</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
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
          </div>

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '16px',
            margin: '16px 0',
            color: '#1e293b'
          }}>
            <p style={{ margin: 0 }}>
              <strong>Inside the container:</strong><br/>
              <code>/etc/secrets/username</code> (contains: admin)<br/>
              <code>/etc/secrets/password</code> (contains: SuperSecret123)<br/>
              Values are automatically decoded from Base64.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Secret Types</h2>
          <p>
            Kubernetes supports different Secret types for different use cases:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '16px',
            margin: '20px 0'
          }}>
            <div style={{
              border: '2px solid #0ea5e9',
              borderRadius: '8px',
              padding: '16px',
              background: '#f0f9ff'
            }}>
              <h4 style={{ marginTop: 0, color: '#0ea5e9' }}>Opaque (Default)</h4>
              <p style={{ color: '#1e293b', margin: 0, fontSize: '0.9rem' }}>
                Generic key-value pairs. Use for database passwords, API keys, tokens, etc.
              </p>
            </div>

            <div style={{
              border: '2px solid #22c55e',
              borderRadius: '8px',
              padding: '16px',
              background: '#f0fdf4'
            }}>
              <h4 style={{ marginTop: 0, color: '#22c55e' }}>kubernetes.io/dockerconfigjson</h4>
              <p style={{ color: '#1e293b', margin: 0, fontSize: '0.9rem' }}>
                Docker registry credentials. Used by Pods to pull private container images.
              </p>
            </div>

            <div style={{
              border: '2px solid #f59e0b',
              borderRadius: '8px',
              padding: '16px',
              background: '#fef3c7'
            }}>
              <h4 style={{ marginTop: 0, color: '#f59e0b' }}>kubernetes.io/tls</h4>
              <p style={{ color: '#1e293b', margin: 0, fontSize: '0.9rem' }}>
                TLS certificates and private keys. Used by Ingress controllers for HTTPS.
              </p>
            </div>

            <div style={{
              border: '2px solid #6b7280',
              borderRadius: '8px',
              padding: '16px',
              background: '#f9fafb'
            }}>
              <h4 style={{ marginTop: 0, color: '#6b7280' }}>kubernetes.io/service-account-token</h4>
              <p style={{ color: '#1e293b', margin: 0, fontSize: '0.9rem' }}>
                Service account tokens. Automatically created by Kubernetes for Pod authentication.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Common Secret Commands</h2>
          
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># List all Secrets</div>
            <div style={{ color: '#22c55e' }}>kubectl get secrets</div>
            <br/>
            <div style={{ color: '#64748b' }}># View Secret details (values are hidden by default)</div>
            <div style={{ color: '#22c55e' }}>kubectl describe secret db-credentials</div>
            <br/>
            <div style={{ color: '#64748b' }}># View Secret with Base64 values</div>
            <div style={{ color: '#22c55e' }}>kubectl get secret db-credentials -o yaml</div>
            <br/>
            <div style={{ color: '#64748b' }}># Decode a specific Secret value</div>
            <div style={{ color: '#22c55e' }}>{"kubectl get secret db-credentials -o jsonpath='{.data.password}' | base64 --decode"}</div>
            <br/>
            <div style={{ color: '#64748b' }}># Delete a Secret</div>
            <div style={{ color: '#ef4444' }}>kubectl delete secret db-credentials</div>
            <br/>
            <div style={{ color: '#64748b' }}># Create TLS Secret from certificate files</div>
            <div style={{ color: '#22c55e' }}>kubectl create secret tls my-tls-secret \</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--cert=path/to/cert.crt \</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--key=path/to/key.key</div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Making Secrets Actually Secure</h2>
          <p>
            Kubernetes Secrets out-of-the-box are not production-ready for sensitive data. Here's how 
            to harden them:
          </p>

          <h3>1. Enable Encryption at Rest</h3>
          <div style={{
            background: '#f9fafb',
            border: '2px solid #475569',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <p>
              By default, Secrets are stored in etcd <strong>unencrypted</strong>. Anyone with etcd 
              access can read them. Enable encryption at rest in your cluster:
            </p>
            <ul>
              <li>Configure <code>EncryptionConfiguration</code> on the API server</li>
              <li>Secrets are encrypted before being written to etcd</li>
              <li>Requires cluster admin access (managed Kubernetes services often enable this)</li>
            </ul>
          </div>

          <h3>2. Use External Secret Managers (Recommended)</h3>
          <div style={{
            background: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h4 style={{ marginTop: 0, color: '#15803d' }}>✅ Production Best Practice</h4>
            <p>Don't store secrets in Kubernetes at all. Use a dedicated secret manager:</p>
            <ul>
              <li><strong>HashiCorp Vault:</strong> Industry standard, full-featured secret management</li>
              <li><strong>AWS Secrets Manager:</strong> For AWS workloads</li>
              <li><strong>Azure Key Vault:</strong> For Azure workloads</li>
              <li><strong>Google Secret Manager:</strong> For GCP workloads</li>
              <li><strong>External Secrets Operator:</strong> Syncs secrets from external sources to Kubernetes</li>
              <li><strong>Sealed Secrets:</strong> Encrypt secrets so they can be safely stored in Git</li>
            </ul>
          </div>

          <h3>3. Limit RBAC Access</h3>
          <div style={{
            background: '#f9fafb',
            border: '2px solid #475569',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <p>Use RBAC to control who can read Secrets:</p>
            <ul>
              <li>Developers shouldn't have <code>get secrets</code> permission in production</li>
              <li>Use separate namespaces for different teams</li>
              <li>ServiceAccounts should only access Secrets they need</li>
              <li>Audit who accesses Secrets (enable audit logging)</li>
            </ul>
          </div>

          <h3>4. Avoid Environment Variables (Use Files)</h3>
          <div style={{
            background: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <p>
              ⚠️ <strong>Security risk:</strong> Environment variables can be leaked through:
            </p>
            <ul>
              <li>Process listings (<code>ps aux</code> shows env vars)</li>
              <li>Crash dumps and error logs</li>
              <li>Child processes (inherit parent's env vars)</li>
            </ul>
            <p style={{ fontWeight: 'bold' }}>
              Prefer mounting Secrets as files with <code>readOnly: true</code>. Files have tighter 
              permissions and don't leak through process trees.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>When to Use Secrets vs External Secret Managers</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            margin: '20px 0'
          }}>
            <div style={{
              border: '2px solid #0ea5e9',
              borderRadius: '12px',
              padding: '20px',
              background: '#f0f9ff'
            }}>
              <h4 style={{ marginTop: 0, color: '#0ea5e9' }}>Use Kubernetes Secrets</h4>
              <ul style={{ color: '#1e293b', fontSize: '0.9rem', lineHeight: '1.6' }}>
                <li>Development/testing environments</li>
                <li>Low-security workloads</li>
                <li>Small teams with good RBAC hygiene</li>
                <li>TLS certificates (short-lived)</li>
                <li>ServiceAccount tokens (auto-managed)</li>
              </ul>
            </div>

            <div style={{
              border: '2px solid #22c55e',
              borderRadius: '12px',
              padding: '20px',
              background: '#f0fdf4'
            }}>
              <h4 style={{ marginTop: 0, color: '#22c55e' }}>Use External Secret Managers</h4>
              <ul style={{ color: '#1e293b', fontSize: '0.9rem', lineHeight: '1.6' }}>
                <li>Production environments</li>
                <li>Compliance requirements (PCI-DSS, HIPAA)</li>
                <li>Database passwords, API keys</li>
                <li>Multi-cluster deployments</li>
                <li>Secret rotation requirements</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Real-World Example: Database Credentials</h2>
          
          <h3>Create Secret for Database</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#22c55e' }}>kubectl create secret generic postgres-credentials \</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--from-literal=username=appuser \</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--from-literal=password=MyS3cur3P@ssw0rd \</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--from-literal=host=postgres.default.svc.cluster.local \</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--from-literal=port=5432</div>
          </div>

          <h3>Use in Deployment</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
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
          </div>
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

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginTop: '60px',
          paddingTop: '30px',
          borderTop: '2px solid #e5e7eb',
          gap: '20px'
        }}>
          <Link href="/module-3-1" style={{
              textDecoration: 'none',
              color: '#94a3b8',
              fontWeight: 600,
              padding: '12px 24px',
              border: '2px solid #475569',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>← Previous: ConfigMaps</Link>
          
          <Link href="/module-3-3" style={{
              textDecoration: 'none',
              color: '#fff',
              background: '#9c0606ff',
              fontWeight: 600,
              padding: '12px 24px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>Next: Environment Strategy →</Link>
        </div>
        <ModuleCompletion moduleId="3-2" />

      </main>
    </div>
  );
}
