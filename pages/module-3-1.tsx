import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../styles/Home.module.css';
import ModuleCompletion from '../components/ModuleCompletion';

export default function Module31() {
  const [configType, setConfigType] = useState<'env' | 'file'>('env');
  const [showPodYAML, setShowPodYAML] = useState(false);

  return (
    <div className={styles.container}>
      <Head>
        <title>Module 3.1: ConfigMaps</title>
        <meta name="description" content="Understanding Kubernetes ConfigMaps for application configuration" />
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
        <h1 className={styles.title}>Module 3.1: ConfigMaps</h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280', marginTop: '-10px' }}>
          Separating Config from Code
        </p>
        
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/module-2-3" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>← Previous: Services</Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/learning-modules" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>All Modules</Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/module-3-2" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>Next: Secrets →</Link>
        </div>
        
        <section className={styles.spotlight}>
          <h2>The Anti-Pattern We're Avoiding</h2>
          <p>
            Before we talk about ConfigMaps, let's talk about what happens when you <em>don't</em> use them.
          </p>

          <div style={{
            background: '#fef2f2',
            border: '2px solid #ef4444',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#dc2626' }}>❌ Hardcoding Config (The Old Way)</h3>
            <div style={{
              background: '#1e293b',
              color: '#e2e8f0',
              padding: '16px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              margin: '12px 0'
            }}>
              <div style={{ color: '#64748b' }}>// app.js</div>
              <div style={{ color: '#f59e0b' }}>const config = {'{'}</div>
              <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;databaseURL: "mysql://prod-db:3306/myapp",  // Hardcoded!</div>
              <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;apiKey: "sk-1234567890abcdef",             // In source code!</div>
              <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;maxConnections: 100,                       // Can't change without rebuild!</div>
              <div style={{ color: '#f59e0b' }}>{'}'}</div>
            </div>

            <p><strong>Problems with this approach:</strong></p>
            <ul>
              <li>🔄 Change config = rebuild entire container image</li>
              <li>🌍 Same image can't run in dev/staging/production with different configs</li>
              <li>🔐 Secrets in source code (security nightmare)</li>
              <li>👥 Developers need access to production values (bad idea)</li>
              <li>🐛 Config bugs require full deployment cycle</li>
            </ul>
          </div>

          <div style={{
            background: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#15803d' }}>✅ Using ConfigMaps (The Kubernetes Way)</h3>
            <p>
              ConfigMaps store configuration data separately from your application code. You can:
            </p>
            <ul>
              <li>✅ Use the same container image across all environments</li>
              <li>✅ Change config without rebuilding images</li>
              <li>✅ Manage configuration through Kubernetes (version controlled, auditable)</li>
              <li>✅ Keep sensitive data out of source code</li>
              <li>✅ Update config and restart Pods instantly</li>
            </ul>
          </div>

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#0369a1' }}>💡 Key Concept</h3>
            <p style={{ marginBottom: 0 }}>
              A <strong>ConfigMap</strong> is a Kubernetes object that stores non-sensitive configuration 
              data as key-value pairs. Think of it as a dictionary/map that Pods can read from.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Creating a ConfigMap</h2>
          <p>
            There are multiple ways to create ConfigMaps. Let's look at the most common approaches.
          </p>

          <h3>Method 1: From Literal Values (Quick & Simple)</h3>
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
            <div style={{ color: '#64748b' }}># Create ConfigMap from command line</div>
            <div style={{ color: '#22c55e' }}>kubectl create configmap app-config \</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--from-literal=DATABASE_URL=mysql://db:3306/myapp \</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--from-literal=MAX_CONNECTIONS=100 \</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--from-literal=LOG_LEVEL=info</div>
          </div>

          <h3>Method 2: From a YAML File (Declarative & Version-Controlled)</h3>
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
            <div style={{ color: '#64748b' }}># Apply the ConfigMap</div>
            <div style={{ color: '#22c55e' }}>kubectl apply -f configmap.yaml</div>
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
              ⚠️ <strong>Important:</strong> ConfigMap values must be strings. Numbers like <code>100</code> 
              should be quoted as <code>"100"</code>. Your application converts them to the correct type.
            </p>
          </div>

          <h3>Method 3: From a File (For Large Configs)</h3>
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
            <div style={{ color: '#64748b' }}># If you have app.properties:</div>
            <div style={{ color: '#e2e8f0' }}>database.url=mysql://db:3306/myapp</div>
            <div style={{ color: '#e2e8f0' }}>database.maxConnections=100</div>
            <div style={{ color: '#e2e8f0' }}>log.level=info</div>
            <br/>
            <div style={{ color: '#64748b' }}># Create ConfigMap from file</div>
            <div style={{ color: '#22c55e' }}>kubectl create configmap app-config \</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--from-file=app.properties</div>
            <br/>
            <div style={{ color: '#64748b' }}># The entire file becomes one key-value pair:</div>
            <div style={{ color: '#64748b' }}># Key: "app.properties"</div>
            <div style={{ color: '#64748b' }}># Value: [contents of the file]</div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Interactive: Two Ways to Use ConfigMaps</h2>
          <p>
            ConfigMaps can inject configuration into Pods in two ways. Choose one below to see how it works:
          </p>

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            margin: '20px 0'
          }}>
            <button
              onClick={() => setConfigType('env')}
              style={{
                padding: '12px 24px',
                background: configType === 'env' ? '#9c0606ff' : '#334155',
                color: configType === 'env' ? '#fff' : '#f8fafc',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'all 0.2s'
              }}
            >
              Environment Variables
            </button>
            <button
              onClick={() => setConfigType('file')}
              style={{
                padding: '12px 24px',
                background: configType === 'file' ? '#9c0606ff' : '#334155',
                color: configType === 'file' ? '#fff' : '#f8fafc',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'all 0.2s'
              }}
            >
              Mounted Files
            </button>
          </div>

          {configType === 'env' && (
            <div style={{
              background: '#f9fafb',
              border: '2px solid #475569',
              borderRadius: '12px',
              padding: '24px',
              margin: '20px 0'
            }}>
              <h3 style={{ marginTop: 0, color: '#9c0606ff' }}>Option 1: Environment Variables</h3>
              <p style={{ color: '#1e293b' }}>
                ConfigMap data is injected as environment variables that your application reads at startup.
              </p>

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
                <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;envFrom:</div>
                <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- configMapRef:</div>
                <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: app-config  # Loads ALL keys as env vars</div>
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
                  <strong>What happens inside the container:</strong><br/>
                  Your app can read <code>DATABASE_URL</code>, <code>MAX_CONNECTIONS</code>, and 
                  <code>LOG_LEVEL</code> as standard environment variables.
                </p>
              </div>

              <h4 style={{ color: '#1e293b' }}>Reading in Code (Any Language)</h4>
              <div style={{
                background: '#1e293b',
                color: '#e2e8f0',
                padding: '16px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                margin: '12px 0'
              }}>
                <div style={{ color: '#64748b' }}>// Node.js / JavaScript</div>
                <div style={{ color: '#22c55e' }}>const dbURL = process.env.DATABASE_URL;</div>
                <div style={{ color: '#22c55e' }}>const maxConns = parseInt(process.env.MAX_CONNECTIONS);</div>
                <br/>
                <div style={{ color: '#64748b' }}># Python</div>
                <div style={{ color: '#22c55e' }}>import os</div>
                <div style={{ color: '#22c55e' }}>db_url = os.getenv('DATABASE_URL')</div>
                <div style={{ color: '#22c55e' }}>max_conns = int(os.getenv('MAX_CONNECTIONS'))</div>
                <br/>
                <div style={{ color: '#64748b' }}>// Go</div>
                <div style={{ color: '#22c55e' }}>dbURL := os.Getenv("DATABASE_URL")</div>
                <div style={{ color: '#22c55e' }}>maxConns, _ := strconv.Atoi(os.Getenv("MAX_CONNECTIONS"))</div>
              </div>

              <div style={{
                background: '#f0fdf4',
                border: '2px solid #22c55e',
                borderRadius: '8px',
                padding: '16px',
                margin: '16px 0',
                color: '#1e293b'
              }}>
                <p style={{ margin: 0 }}>
                  ✅ <strong>Best for:</strong> Simple key-value configs, feature flags, connection strings, 
                  log levels, timeouts—anything your app can read from environment variables.
                </p>
              </div>
            </div>
          )}

          {configType === 'file' && (
            <div style={{
              background: '#f9fafb',
              border: '2px solid #475569',
              borderRadius: '12px',
              padding: '24px',
              margin: '20px 0'
            }}>
              <h3 style={{ marginTop: 0, color: '#9c0606ff' }}>Option 2: Mounted Files (Volumes)</h3>
              <p style={{ color: '#1e293b' }}>
                ConfigMap data is mounted as files inside the container. Useful for large configs or 
                when your app expects config files (JSON, XML, YAML, .properties, etc).
              </p>

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
                <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: config-volume</div>
                <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mountPath: /etc/config  # Where files appear in container</div>
                <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;volumes:</div>
                <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: config-volume</div>
                <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;configMap:</div>
                <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: app-config</div>
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
                  <strong>What happens inside the container:</strong><br/>
                  Each key in the ConfigMap becomes a file in <code>/etc/config/</code>:<br/>
                  <code>/etc/config/DATABASE_URL</code> (contains: mysql://db:3306/myapp)<br/>
                  <code>/etc/config/MAX_CONNECTIONS</code> (contains: 100)<br/>
                  <code>/etc/config/LOG_LEVEL</code> (contains: info)
                </p>
              </div>

              <h4 style={{ color: '#1e293b' }}>Reading in Code</h4>
              <div style={{
                background: '#1e293b',
                color: '#e2e8f0',
                padding: '16px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                margin: '12px 0'
              }}>
                <div style={{ color: '#64748b' }}>// Node.js</div>
                <div style={{ color: '#22c55e' }}>const fs = require('fs');</div>
                <div style={{ color: '#22c55e' }}>const dbURL = fs.readFileSync('/etc/config/DATABASE_URL', 'utf8');</div>
                <br/>
                <div style={{ color: '#64748b' }}># Python</div>
                <div style={{ color: '#22c55e' }}>with open('/etc/config/DATABASE_URL', 'r') as f:</div>
                <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;db_url = f.read().strip()</div>
              </div>

              <div style={{
                background: '#f0fdf4',
                border: '2px solid #22c55e',
                borderRadius: '8px',
                padding: '16px',
                margin: '16px 0',
                color: '#1e293b'
              }}>
                <p style={{ margin: 0 }}>
                  ✅ <strong>Best for:</strong> JSON/XML configs, nginx.conf, application.properties, 
                  or when you need to reload config without restarting (advanced: watch for file changes).
                </p>
              </div>
            </div>
          )}
        </section>

        <section className={styles.spotlight}>
          <h2>Environment Variables vs Mounted Files</h2>
          <p>
            Which approach should you use? Here's a practical guide:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            margin: '20px 0'
          }}>
            <div style={{
              border: '2px solid #22c55e',
              borderRadius: '12px',
              padding: '20px',
              background: '#f0fdf4'
            }}>
              <h4 style={{ marginTop: 0, color: '#22c55e' }}>✅ Use Environment Variables When:</h4>
              <ul style={{ color: '#1e293b', fontSize: '0.9rem', lineHeight: '1.6' }}>
                <li>Config is simple (strings, numbers, booleans)</li>
                <li>You have fewer than ~20 config items</li>
                <li>Your app already uses env vars (12-factor app pattern)</li>
                <li>You want easy debugging (<code>kubectl exec</code> → <code>env</code>)</li>
                <li>Standard practice in cloud-native apps</li>
              </ul>
            </div>

            <div style={{
              border: '2px solid #0ea5e9',
              borderRadius: '12px',
              padding: '20px',
              background: '#f0f9ff'
            }}>
              <h4 style={{ marginTop: 0, color: '#0ea5e9' }}>✅ Use Mounted Files When:</h4>
              <ul style={{ color: '#1e293b', fontSize: '0.9rem', lineHeight: '1.6' }}>
                <li>Config is complex (JSON, YAML, XML, INI)</li>
                <li>You have many config items (50+)</li>
                <li>Your app expects config files (nginx, Spring Boot)</li>
                <li>You need to reload config without restarting</li>
                <li>Config includes multi-line data</li>
              </ul>
            </div>
          </div>

          <div style={{
            background: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#b45309' }}>🔑 Pro Tip: You Can Use Both</h3>
            <p style={{ marginBottom: 0 }}>
              It's common to use env vars for simple configs (URLs, timeouts) and mounted files for 
              complex configs (logging configuration, feature flags JSON). One Pod, multiple ConfigMaps.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Updating ConfigMaps</h2>
          <p>
            What happens when you need to change configuration?
          </p>

          <h3>Step 1: Update the ConfigMap</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '16px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># Edit directly</div>
            <div style={{ color: '#22c55e' }}>kubectl edit configmap app-config</div>
            <br/>
            <div style={{ color: '#64748b' }}># Or update from file</div>
            <div style={{ color: '#22c55e' }}>kubectl apply -f configmap.yaml</div>
          </div>

          <h3>Step 2: Restart Pods to Pick Up Changes</h3>
          <div style={{
            background: '#fef2f2',
            border: '2px solid #ef4444',
            borderRadius: '8px',
            padding: '16px',
            margin: '16px 0',
            color: '#1e293b'
          }}>
            <p style={{ margin: 0 }}>
              ⚠️ <strong>Important:</strong> If you're using <strong>environment variables</strong>, 
              Pods do NOT automatically reload. You must restart them:
            </p>
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
            <div style={{ color: '#64748b' }}># Force Deployment to restart all Pods</div>
            <div style={{ color: '#22c55e' }}>kubectl rollout restart deployment myapp</div>
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
              💡 <strong>Mounted files (volumes):</strong> These update automatically within ~60 seconds 
              (kubelet sync interval). If your app watches for file changes, it can reload config without 
              restarting. Environment variables cannot do this.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Common ConfigMap Commands</h2>
          
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># List all ConfigMaps</div>
            <div style={{ color: '#22c55e' }}>kubectl get configmaps</div>
            <div style={{ color: '#22c55e' }}>kubectl get cm  # Short form</div>
            <br/>
            <div style={{ color: '#64748b' }}># View ConfigMap contents</div>
            <div style={{ color: '#22c55e' }}>kubectl describe configmap app-config</div>
            <div style={{ color: '#22c55e' }}>kubectl get configmap app-config -o yaml</div>
            <br/>
            <div style={{ color: '#64748b' }}># Edit ConfigMap</div>
            <div style={{ color: '#22c55e' }}>kubectl edit configmap app-config</div>
            <br/>
            <div style={{ color: '#64748b' }}># Delete ConfigMap</div>
            <div style={{ color: '#ef4444' }}>kubectl delete configmap app-config</div>
            <br/>
            <div style={{ color: '#64748b' }}># Create from literal values</div>
            <div style={{ color: '#22c55e' }}>kubectl create configmap app-config --from-literal=KEY=VALUE</div>
            <br/>
            <div style={{ color: '#64748b' }}># Create from file</div>
            <div style={{ color: '#22c55e' }}>kubectl create configmap app-config --from-file=config.json</div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Real-World Example: Multi-Environment Config</h2>
          <p>
            Let's say you have three environments: dev, staging, and production. Same app, different configs.
          </p>

          <h3>ConfigMap for Development</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
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
          </div>

          <h3>ConfigMap for Production</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
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
          </div>

          <h3>Deployment (Same for Both Environments)</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
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
          </div>

          <div style={{
            background: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#15803d' }}>✅ Benefits of This Approach</h3>
            <ul>
              <li>Same container image across all environments</li>
              <li>Config changes don't require rebuilding images</li>
              <li>Clear separation of code and configuration</li>
              <li>Version control your ConfigMaps (GitOps)</li>
              <li>Developers don't need production credentials</li>
            </ul>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>What NOT to Put in ConfigMaps</h2>
          <div style={{
            background: '#fef2f2',
            border: '2px solid #ef4444',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#dc2626' }}>❌ Don't Store Sensitive Data</h3>
            <p><strong>Never put these in ConfigMaps:</strong></p>
            <ul>
              <li>🔐 Database passwords</li>
              <li>🔑 API keys</li>
              <li>🔒 TLS certificates/private keys</li>
              <li>🎫 OAuth tokens</li>
              <li>💳 Any secret credentials</li>
            </ul>
            <p style={{ fontWeight: 'bold', marginTop: '16px' }}>
              ConfigMaps are stored in etcd <strong>unencrypted</strong> and can be read by anyone with 
              read access to the namespace. Use <strong>Secrets</strong> instead (Module 3.2).
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
            <h3 style={{ marginTop: 0, color: '#0369a1' }}>✅ ConfigMaps Are For:</h3>
            <ul>
              <li>Feature flags</li>
              <li>Connection URLs (without passwords)</li>
              <li>Log levels</li>
              <li>Timeouts and retry limits</li>
              <li>Non-sensitive application settings</li>
            </ul>
          </div>
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
          <Link href="/module-2-3" style={{
              textDecoration: 'none',
              color: '#94a3b8',
              fontWeight: 600,
              padding: '12px 24px',
              border: '2px solid #475569',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>← Previous: Services</Link>
          
          <Link href="/module-3-2" style={{
              textDecoration: 'none',
              color: '#fff',
              background: '#9c0606ff',
              fontWeight: 600,
              padding: '12px 24px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>Next: Secrets →</Link>
        </div>
        <ModuleCompletion moduleId="3-1" />

      </main>
    </div>
  );
}
