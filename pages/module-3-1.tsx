import { useState } from 'react';
import styles from '../styles/Home.module.css';
import ModuleShell from '../components/module/ModuleShell';
import Callout from '../components/module/Callout';
import TermBox from '../components/module/TermBox';

function tabStyle(active: boolean): React.CSSProperties {
  return {
    padding: '12px 24px',
    background: active ? 'var(--color-primary)' : 'var(--color-bg-tertiary)',
    color: active ? '#fff' : 'var(--color-text-secondary)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '1rem',
    transition: 'all var(--transition-fast)',
  };
}

export default function Module31() {
  const [configType, setConfigType] = useState<'env' | 'file'>('env');

  return (
    <ModuleShell id="3-1" subtitle="Separating Config from Code">
      <section className={styles.spotlight}>
        <h2>The Anti-Pattern We're Avoiding</h2>
        <p>
          Before we talk about ConfigMaps, let's talk about what happens when you <em>don't</em> use them.
        </p>

        <Callout variant="danger" icon="❌" title="Hardcoding Config (The Old Way)">
          <TermBox>
            <div style={{ color: '#64748b' }}>// app.js</div>
            <div style={{ color: '#f59e0b' }}>const config = {'{'}</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;databaseURL: "mysql://prod-db:3306/myapp",  // Hardcoded!</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;apiKey: "sk-1234567890abcdef",             // In source code!</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;maxConnections: 100,                       // Can't change without rebuild!</div>
            <div style={{ color: '#f59e0b' }}>{'}'}</div>
          </TermBox>

          <p><strong>Problems with this approach:</strong></p>
          <ul>
            <li>🔄 Change config = rebuild entire container image</li>
            <li>🌍 Same image can't run in dev/staging/production with different configs</li>
            <li>🔐 Secrets in source code (security nightmare)</li>
            <li>👥 Developers need access to production values (bad idea)</li>
            <li>🐛 Config bugs require full deployment cycle</li>
          </ul>
        </Callout>

        <Callout variant="success" icon="✅" title="Using ConfigMaps (The Kubernetes Way)">
          <p>ConfigMaps store configuration data separately from your application code. You can:</p>
          <ul>
            <li>✅ Use the same container image across all environments</li>
            <li>✅ Change config without rebuilding images</li>
            <li>✅ Manage configuration through Kubernetes (version controlled, auditable)</li>
            <li>✅ Keep sensitive data out of source code</li>
            <li>✅ Update config and restart Pods instantly</li>
          </ul>
        </Callout>

        <Callout variant="info" icon="💡" title="Key Concept">
          <p>
            A <strong>ConfigMap</strong> is a Kubernetes object that stores non-sensitive configuration
            data as key-value pairs. Think of it as a dictionary/map that Pods can read from.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Creating a ConfigMap</h2>
        <p>There are multiple ways to create ConfigMaps. Let's look at the most common approaches.</p>

        <h3>Method 1: From Literal Values (Quick &amp; Simple)</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># Create ConfigMap from command line</div>
          <div style={{ color: '#22c55e' }}>kubectl create configmap app-config \</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--from-literal=DATABASE_URL=mysql://db:3306/myapp \</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--from-literal=MAX_CONNECTIONS=100 \</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--from-literal=LOG_LEVEL=info</div>
        </TermBox>

        <h3>Method 2: From a YAML File (Declarative &amp; Version-Controlled)</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># configmap.yaml</div>
          <div style={{ color: '#f59e0b' }}>apiVersion: v1</div>
          <div style={{ color: '#f59e0b' }}>kind: ConfigMap</div>
          <div style={{ color: '#f59e0b' }}>metadata:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: app-config</div>
          <div style={{ color: '#f59e0b' }}>data:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;DATABASE_URL: "mysql://db:3306/myapp"</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;MAX_CONNECTIONS: "100"</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;LOG_LEVEL: "info"</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;FEATURE_FLAGS: "new-ui,dark-mode,beta-api"</div>
        </TermBox>

        <TermBox>
          <div style={{ color: '#64748b' }}># Apply the ConfigMap</div>
          <div style={{ color: '#22c55e' }}>kubectl apply -f configmap.yaml</div>
        </TermBox>

        <Callout variant="warning">
          <p>
            ⚠️ <strong>Important:</strong> ConfigMap values must be strings. Numbers like <code>100</code>
            should be quoted as <code>"100"</code>. Your application converts them to the correct type.
          </p>
        </Callout>

        <h3>Method 3: From a File (For Large Configs)</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># If you have app.properties:</div>
          <div style={{ color: '#e2e8f0' }}>database.url=mysql://db:3306/myapp</div>
          <div style={{ color: '#e2e8f0' }}>database.maxConnections=100</div>
          <div style={{ color: '#e2e8f0' }}>log.level=info</div>
          <br />
          <div style={{ color: '#64748b' }}># Create ConfigMap from file</div>
          <div style={{ color: '#22c55e' }}>kubectl create configmap app-config \</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--from-file=app.properties</div>
          <br />
          <div style={{ color: '#64748b' }}># The entire file becomes one key-value pair:</div>
          <div style={{ color: '#64748b' }}># Key: "app.properties"</div>
          <div style={{ color: '#64748b' }}># Value: [contents of the file]</div>
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>Interactive: Two Ways to Use ConfigMaps</h2>
        <p>ConfigMaps can inject configuration into Pods in two ways. Choose one below to see how it works:</p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', margin: '20px 0', flexWrap: 'wrap' }}>
          <button onClick={() => setConfigType('env')} style={tabStyle(configType === 'env')}>
            Environment Variables
          </button>
          <button onClick={() => setConfigType('file')} style={tabStyle(configType === 'file')}>
            Mounted Files
          </button>
        </div>

        {configType === 'env' && (
          <Callout variant="neutral" title="Option 1: Environment Variables">
            <p>ConfigMap data is injected as environment variables that your application reads at startup.</p>

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
              <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;envFrom:</div>
              <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- configMapRef:</div>
              <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: app-config  # Loads ALL keys as env vars</div>
            </TermBox>

            <Callout variant="info">
              <p>
                <strong>What happens inside the container:</strong><br />
                Your app can read <code>DATABASE_URL</code>, <code>MAX_CONNECTIONS</code>, and
                <code>LOG_LEVEL</code> as standard environment variables.
              </p>
            </Callout>

            <h4>Reading in Code (Any Language)</h4>
            <TermBox>
              <div style={{ color: '#64748b' }}>// Node.js / JavaScript</div>
              <div style={{ color: '#22c55e' }}>const dbURL = process.env.DATABASE_URL;</div>
              <div style={{ color: '#22c55e' }}>const maxConns = parseInt(process.env.MAX_CONNECTIONS);</div>
              <br />
              <div style={{ color: '#64748b' }}># Python</div>
              <div style={{ color: '#22c55e' }}>import os</div>
              <div style={{ color: '#22c55e' }}>db_url = os.getenv('DATABASE_URL')</div>
              <div style={{ color: '#22c55e' }}>max_conns = int(os.getenv('MAX_CONNECTIONS'))</div>
              <br />
              <div style={{ color: '#64748b' }}>// Go</div>
              <div style={{ color: '#22c55e' }}>dbURL := os.Getenv("DATABASE_URL")</div>
              <div style={{ color: '#22c55e' }}>maxConns, _ := strconv.Atoi(os.Getenv("MAX_CONNECTIONS"))</div>
            </TermBox>

            <Callout variant="success">
              <p>
                ✅ <strong>Best for:</strong> Simple key-value configs, feature flags, connection strings,
                log levels, timeouts—anything your app can read from environment variables.
              </p>
            </Callout>
          </Callout>
        )}

        {configType === 'file' && (
          <Callout variant="neutral" title="Option 2: Mounted Files (Volumes)">
            <p>
              ConfigMap data is mounted as files inside the container. Useful for large configs or
              when your app expects config files (JSON, XML, YAML, .properties, etc).
            </p>

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
              <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: config-volume</div>
              <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mountPath: /etc/config  # Where files appear in container</div>
              <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;volumes:</div>
              <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: config-volume</div>
              <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;configMap:</div>
              <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: app-config</div>
            </TermBox>

            <Callout variant="info">
              <p>
                <strong>What happens inside the container:</strong><br />
                Each key in the ConfigMap becomes a file in <code>/etc/config/</code>:<br />
                <code>/etc/config/DATABASE_URL</code> (contains: mysql://db:3306/myapp)<br />
                <code>/etc/config/MAX_CONNECTIONS</code> (contains: 100)<br />
                <code>/etc/config/LOG_LEVEL</code> (contains: info)
              </p>
            </Callout>

            <h4>Reading in Code</h4>
            <TermBox>
              <div style={{ color: '#64748b' }}>// Node.js</div>
              <div style={{ color: '#22c55e' }}>const fs = require('fs');</div>
              <div style={{ color: '#22c55e' }}>const dbURL = fs.readFileSync('/etc/config/DATABASE_URL', 'utf8');</div>
              <br />
              <div style={{ color: '#64748b' }}># Python</div>
              <div style={{ color: '#22c55e' }}>with open('/etc/config/DATABASE_URL', 'r') as f:</div>
              <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;db_url = f.read().strip()</div>
            </TermBox>

            <Callout variant="success">
              <p>
                ✅ <strong>Best for:</strong> JSON/XML configs, nginx.conf, application.properties,
                or when you need to reload config without restarting (advanced: watch for file changes).
              </p>
            </Callout>
          </Callout>
        )}
      </section>

      <section className={styles.spotlight}>
        <h2>Environment Variables vs Mounted Files</h2>
        <p>Which approach should you use? Here's a practical guide:</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem', margin: '1.5rem 0' }}>
          <Callout variant="success" title="✅ Use Environment Variables When:">
            <ul>
              <li>Config is simple (strings, numbers, booleans)</li>
              <li>You have fewer than ~20 config items</li>
              <li>Your app already uses env vars (12-factor app pattern)</li>
              <li>You want easy debugging (<code>kubectl exec</code> → <code>env</code>)</li>
              <li>Standard practice in cloud-native apps</li>
            </ul>
          </Callout>

          <Callout variant="info" title="✅ Use Mounted Files When:">
            <ul>
              <li>Config is complex (JSON, YAML, XML, INI)</li>
              <li>You have many config items (50+)</li>
              <li>Your app expects config files (nginx, Spring Boot)</li>
              <li>You need to reload config without restarting</li>
              <li>Config includes multi-line data</li>
            </ul>
          </Callout>
        </div>

        <Callout variant="warning" icon="🔑" title="Pro Tip: You Can Use Both">
          <p>
            It's common to use env vars for simple configs (URLs, timeouts) and mounted files for
            complex configs (logging configuration, feature flags JSON). One Pod, multiple ConfigMaps.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Updating ConfigMaps</h2>
        <p>What happens when you need to change configuration?</p>

        <h3>Step 1: Update the ConfigMap</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># Edit directly</div>
          <div style={{ color: '#22c55e' }}>kubectl edit configmap app-config</div>
          <br />
          <div style={{ color: '#64748b' }}># Or update from file</div>
          <div style={{ color: '#22c55e' }}>kubectl apply -f configmap.yaml</div>
        </TermBox>

        <h3>Step 2: Restart Pods to Pick Up Changes</h3>
        <Callout variant="danger">
          <p>
            ⚠️ <strong>Important:</strong> If you're using <strong>environment variables</strong>,
            Pods do NOT automatically reload. You must restart them:
          </p>
        </Callout>

        <TermBox>
          <div style={{ color: '#64748b' }}># Force Deployment to restart all Pods</div>
          <div style={{ color: '#22c55e' }}>kubectl rollout restart deployment myapp</div>
        </TermBox>

        <Callout variant="info">
          <p>
            💡 <strong>Mounted files (volumes):</strong> These update automatically within ~60 seconds
            (kubelet sync interval). If your app watches for file changes, it can reload config without
            restarting. Environment variables cannot do this.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Common ConfigMap Commands</h2>

        <TermBox>
          <div style={{ color: '#64748b' }}># List all ConfigMaps</div>
          <div style={{ color: '#22c55e' }}>kubectl get configmaps</div>
          <div style={{ color: '#22c55e' }}>kubectl get cm  # Short form</div>
          <br />
          <div style={{ color: '#64748b' }}># View ConfigMap contents</div>
          <div style={{ color: '#22c55e' }}>kubectl describe configmap app-config</div>
          <div style={{ color: '#22c55e' }}>kubectl get configmap app-config -o yaml</div>
          <br />
          <div style={{ color: '#64748b' }}># Edit ConfigMap</div>
          <div style={{ color: '#22c55e' }}>kubectl edit configmap app-config</div>
          <br />
          <div style={{ color: '#64748b' }}># Delete ConfigMap</div>
          <div style={{ color: '#ef4444' }}>kubectl delete configmap app-config</div>
          <br />
          <div style={{ color: '#64748b' }}># Create from literal values</div>
          <div style={{ color: '#22c55e' }}>kubectl create configmap app-config --from-literal=KEY=VALUE</div>
          <br />
          <div style={{ color: '#64748b' }}># Create from file</div>
          <div style={{ color: '#22c55e' }}>kubectl create configmap app-config --from-file=config.json</div>
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>Real-World Example: Multi-Environment Config</h2>
        <p>Let's say you have three environments: dev, staging, and production. Same app, different configs.</p>

        <h3>ConfigMap for Development</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># configmap-dev.yaml</div>
          <div style={{ color: '#f59e0b' }}>apiVersion: v1</div>
          <div style={{ color: '#f59e0b' }}>kind: ConfigMap</div>
          <div style={{ color: '#f59e0b' }}>metadata:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: app-config</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;namespace: dev</div>
          <div style={{ color: '#f59e0b' }}>data:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;DATABASE_URL: "mysql://dev-db:3306/myapp"</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;LOG_LEVEL: "debug"</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;CACHE_ENABLED: "false"</div>
        </TermBox>

        <h3>ConfigMap for Production</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># configmap-prod.yaml</div>
          <div style={{ color: '#f59e0b' }}>apiVersion: v1</div>
          <div style={{ color: '#f59e0b' }}>kind: ConfigMap</div>
          <div style={{ color: '#f59e0b' }}>metadata:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: app-config</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;namespace: production</div>
          <div style={{ color: '#f59e0b' }}>data:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;DATABASE_URL: "mysql://prod-db-ha.aws.rds:3306/myapp"</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;LOG_LEVEL: "error"</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;CACHE_ENABLED: "true"</div>
        </TermBox>

        <h3>Deployment (Same for Both Environments)</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># deployment.yaml (works in any namespace)</div>
          <div style={{ color: '#f59e0b' }}>apiVersion: apps/v1</div>
          <div style={{ color: '#f59e0b' }}>kind: Deployment</div>
          <div style={{ color: '#f59e0b' }}>metadata:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: myapp</div>
          <div style={{ color: '#f59e0b' }}>spec:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;template:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;spec:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;containers:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: app</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;image: myapp:1.0  # Same image everywhere!</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;envFrom:</div>
          <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- configMapRef:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: app-config  # Reads ConfigMap from same namespace</div>
        </TermBox>

        <Callout variant="success" icon="✅" title="Benefits of This Approach">
          <ul>
            <li>Same container image across all environments</li>
            <li>Config changes don't require rebuilding images</li>
            <li>Clear separation of code and configuration</li>
            <li>Version control your ConfigMaps (GitOps)</li>
            <li>Developers don't need production credentials</li>
          </ul>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>What NOT to Put in ConfigMaps</h2>
        <Callout variant="danger" icon="❌" title="Don't Store Sensitive Data">
          <p><strong>Never put these in ConfigMaps:</strong></p>
          <ul>
            <li>🔐 Database passwords</li>
            <li>🔑 API keys</li>
            <li>🔒 TLS certificates/private keys</li>
            <li>🎫 OAuth tokens</li>
            <li>💳 Any secret credentials</li>
          </ul>
          <p style={{ fontWeight: 'bold' }}>
            ConfigMaps are stored in etcd <strong>unencrypted</strong> and can be read by anyone with
            read access to the namespace. Use <strong>Secrets</strong> instead (Module 3.2).
          </p>
        </Callout>

        <Callout variant="info" icon="✅" title="ConfigMaps Are For:">
          <ul>
            <li>Feature flags</li>
            <li>Connection URLs (without passwords)</li>
            <li>Log levels</li>
            <li>Timeouts and retry limits</li>
            <li>Non-sensitive application settings</li>
          </ul>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Key Takeaways</h2>
        <ul>
          <li><strong>ConfigMaps</strong> separate configuration from application code</li>
          <li>Use the <strong>same container image</strong> across all environments</li>
          <li><strong>Two injection methods:</strong> environment variables (simple) or mounted files (complex)</li>
          <li>Environment variables require <strong>Pod restart</strong> to update</li>
          <li>Mounted files <strong>update automatically</strong> (but app must reload)</li>
          <li>ConfigMaps are <strong>NOT encrypted</strong>—use Secrets for sensitive data</li>
          <li>Version control your ConfigMaps for <strong>GitOps workflows</strong></li>
          <li>Each namespace can have its own ConfigMap with the same name (dev vs prod)</li>
        </ul>
      </section>
    </ModuleShell>
  );
}
