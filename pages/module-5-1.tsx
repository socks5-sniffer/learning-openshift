import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Module51() {
  const [volumeType, setVolumeType] = useState<'emptyDir' | 'hostPath' | 'configMap'>('emptyDir');
  const [showPodRestart, setShowPodRestart] = useState(false);

  const volumeTypes = {
    emptyDir: {
      name: 'emptyDir',
      description: 'Temporary storage that lives as long as the Pod',
      useCase: 'Scratch space, caching, temporary data',
      persistent: false,
      surviveRestart: false,
      color: '#f59e0b',
      bg: '#fef3c7'
    },
    hostPath: {
      name: 'hostPath',
      description: 'Mounts a file/directory from the host node',
      useCase: 'Accessing node logs, Docker socket (dangerous)',
      persistent: true,
      surviveRestart: true,
      color: '#ef4444',
      bg: '#fee2e2'
    },
    configMap: {
      name: 'configMap',
      description: 'Injects ConfigMap data as files',
      useCase: 'Configuration files, certificates',
      persistent: false,
      surviveRestart: true,
      color: '#0ea5e9',
      bg: '#f0f9ff'
    }
  };

  const current = volumeTypes[volumeType];

  return (
    <div className={styles.container}>
      <Head>
        <title>Module 5.1: Volumes</title>
        <meta name="description" content="Understanding ephemeral and persistent storage in Kubernetes" />
      </Head>

      {/* Home link in top right */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 30,
        zIndex: 10
      }}>
        <Link href="/learning-modules" legacyBehavior>
          <a style={{
            textDecoration: 'none',
            color: '#9c0606ff',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            background: 'rgba(255,255,255,0.85)',
            padding: '8px 16px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>All Modules</a>
        </Link>
      </div>

      <main className={styles.main}>
        <h1 className={styles.title}>Module 5.1: Volumes</h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280', marginTop: '-10px' }}>
          Ephemeral vs Persistent Storage (and Why Containers Are Disposable)
        </p>
        
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/module-4-3" legacyBehavior>
            <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              ← Previous: HPA
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/learning-modules" legacyBehavior>
            <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              All Modules
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/module-5-2" legacyBehavior>
            <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              Next: PersistentVolumes & Claims →
            </a>
          </Link>
        </div>
        
        <section className={styles.spotlight}>
          <h2>The Storage Problem</h2>
          <p>
            You deploy a beautiful web app to Kubernetes. Users upload profile pictures. Everything 
            works great. Then your Pod crashes (maybe OOMKilled from Module 4.1). Kubernetes 
            restarts it. The users' profile pictures are gone.
          </p>

          <div style={{
            background: '#fef2f2',
            border: '2px solid #ef4444',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#dc2626' }}>💥 The Container Filesystem Is Ephemeral</h3>
            <p style={{ marginBottom: 0 }}>
              When a container starts, it gets a <strong>fresh filesystem</strong> from the image. 
              Any changes you make (files written, logs created, user uploads) exist <strong>only 
              in that container</strong>. When the container dies, those changes vanish.
            </p>
          </div>

          <p>
            This is <strong>by design</strong>. Containers are meant to be disposable, replaceable, 
            and stateless. But real applications have state: databases, uploaded files, logs, caches. 
            That's where <strong>volumes</strong> come in.
          </p>
        </section>

        <section className={styles.spotlight}>
          <h2>What Is a Volume?</h2>
          <p>
            A <strong>volume</strong> is storage that outlives a single container. Volumes can be 
            shared between containers in a Pod and can persist data beyond the Pod's lifetime 
            (depending on the volume type).
          </p>

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#0369a1' }}>🔑 Key Concept: Volume Lifetime</h3>
            <ul style={{ marginBottom: 0 }}>
              <li><strong>Container lifetime:</strong> Container's writable layer (ephemeral, dies with container)</li>
              <li><strong>Pod lifetime:</strong> <code>emptyDir</code> volume (ephemeral, dies with Pod)</li>
              <li><strong>Beyond Pod lifetime:</strong> <code>PersistentVolume</code> (survives Pod deletion)</li>
            </ul>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Interactive: Volume Types</h2>
          <p>
            Click on different volume types to see their characteristics:
          </p>

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            margin: '20px 0',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setVolumeType('emptyDir')}
              style={{
                padding: '12px 24px',
                background: volumeType === 'emptyDir' ? '#f59e0b' : '#e5e7eb',
                color: volumeType === 'emptyDir' ? '#fff' : '#1e293b',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'all 0.2s'
              }}
            >
              emptyDir
            </button>
            <button
              onClick={() => setVolumeType('hostPath')}
              style={{
                padding: '12px 24px',
                background: volumeType === 'hostPath' ? '#ef4444' : '#e5e7eb',
                color: volumeType === 'hostPath' ? '#fff' : '#1e293b',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'all 0.2s'
              }}
            >
              hostPath
            </button>
            <button
              onClick={() => setVolumeType('configMap')}
              style={{
                padding: '12px 24px',
                background: volumeType === 'configMap' ? '#0ea5e9' : '#e5e7eb',
                color: volumeType === 'configMap' ? '#fff' : '#1e293b',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'all 0.2s'
              }}
            >
              configMap
            </button>
          </div>

          <div style={{
            background: current.bg,
            border: `3px solid ${current.color}`,
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            transition: 'all 0.3s'
          }}>
            <h3 style={{ marginTop: 0, color: current.color, fontFamily: 'monospace', fontSize: '1.5rem' }}>
              {current.name}
            </h3>
            
            <p style={{ color: '#1e293b', fontSize: '1.05rem', margin: '16px 0' }}>
              {current.description}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              marginTop: '20px'
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.7)',
                padding: '12px',
                borderRadius: '6px'
              }}>
                <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '4px' }}>Persistent?</div>
                <div style={{ color: '#1e293b', fontWeight: 600, fontSize: '1.1rem' }}>
                  {current.persistent ? '✅ Yes' : '❌ No'}
                </div>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.7)',
                padding: '12px',
                borderRadius: '6px'
              }}>
                <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '4px' }}>Survives Restart?</div>
                <div style={{ color: '#1e293b', fontWeight: 600, fontSize: '1.1rem' }}>
                  {current.surviveRestart ? '✅ Yes' : '❌ No'}
                </div>
              </div>
            </div>

            <div style={{
              marginTop: '16px',
              padding: '16px',
              background: 'rgba(255,255,255,0.7)',
              borderRadius: '6px'
            }}>
              <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '4px' }}>Use Case:</div>
              <div style={{ color: '#1e293b', fontSize: '0.95rem' }}>{current.useCase}</div>
            </div>
          </div>

          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <button
              onClick={() => setShowPodRestart(!showPodRestart)}
              style={{
                padding: '12px 24px',
                background: '#9c0606ff',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              {showPodRestart ? '🔄 Pod Restarted!' : '💥 Simulate Pod Restart'}
            </button>
          </div>

          {showPodRestart && (
            <div style={{
              background: current.surviveRestart ? '#f0fdf4' : '#fef2f2',
              border: `3px solid ${current.surviveRestart ? '#22c55e' : '#ef4444'}`,
              borderRadius: '8px',
              padding: '20px',
              margin: '20px 0',
              color: '#1e293b',
              animation: 'fadeIn 0.3s'
            }}>
              <h4 style={{ marginTop: 0, color: current.surviveRestart ? '#16a34a' : '#dc2626' }}>
                {current.surviveRestart ? '✅ Data Survived!' : '❌ Data Lost!'}
              </h4>
              <p style={{ marginBottom: 0 }}>
                {volumeType === 'emptyDir' && 'emptyDir is deleted when the Pod is deleted. All data is lost.'}
                {volumeType === 'hostPath' && 'hostPath data persists on the node filesystem. Still there after Pod restart!'}
                {volumeType === 'configMap' && 'ConfigMap data is stored in etcd, not in the Pod. Still available after restart!'}
              </p>
            </div>
          )}
        </section>

        <section className={styles.spotlight}>
          <h2>emptyDir: Temporary Storage</h2>
          <p>
            An <code>emptyDir</code> volume is created when a Pod is assigned to a node, and exists 
            as long as that Pod is running. When the Pod is deleted, the <code>emptyDir</code> is 
            deleted permanently.
          </p>

          <h3>Use Cases</h3>
          <ul>
            <li><strong>Scratch space:</strong> Temporary files, sorting large datasets</li>
            <li><strong>Caching:</strong> Downloading large files that can be re-fetched</li>
            <li><strong>Sharing data between containers in a Pod:</strong> Sidecar patterns</li>
          </ul>

          <h3>Example: Shared Cache Between Containers</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># pod-with-emptyydir.yaml</div>
            <div style={{ color: '#f59e0b' }}>apiVersion: v1</div>
            <div style={{ color: '#f59e0b' }}>kind: Pod</div>
            <div style={{ color: '#f59e0b' }}>metadata:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: cache-example</div>
            <div style={{ color: '#f59e0b' }}>spec:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;volumes:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;- name: cache-volume</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;emptyDir: {"{}"}  # Creates an empty directory</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;containers:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;- name: app</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;image: myapp:1.0</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;volumeMounts:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;- name: cache-volume</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mountPath: /app/cache  # Where to mount in container</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;- name: cache-warmer</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;image: cache-warmer:1.0</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;volumeMounts:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;- name: cache-volume</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mountPath: /cache  # Same volume, different path</div>
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
              <strong>What happens:</strong> Both containers share the same <code>emptyDir</code> 
              volume. The cache-warmer can pre-populate data that the app container reads. When 
              the Pod is deleted, the entire <code>emptyDir</code> is wiped.
            </p>
          </div>

          <h3>emptyDir with Memory Storage</h3>
          <p>
            You can store <code>emptyDir</code> data in memory (tmpfs) instead of disk:
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
            <div style={{ color: '#22c55e' }}>volumes:</div>
            <div style={{ color: '#22c55e' }}>- name: memory-cache</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;emptyDir:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;medium: Memory  # Store in RAM, not disk</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;sizeLimit: 128Mi  # Limit to 128MB</div>
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
              <strong>⚠️ Caution:</strong> Memory-backed <code>emptyDir</code> counts against the 
              container's memory limit. If you exceed it, the Pod gets OOMKilled (Module 4.1).
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>hostPath: Node Filesystem Access</h2>
          <p>
            A <code>hostPath</code> volume mounts a file or directory from the <strong>host node's 
            filesystem</strong> into the Pod. Unlike <code>emptyDir</code>, it persists even after 
            the Pod is deleted.
          </p>

          <h3>Example: Accessing Node Logs</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># pod-with-hostpath.yaml</div>
            <div style={{ color: '#f59e0b' }}>apiVersion: v1</div>
            <div style={{ color: '#f59e0b' }}>kind: Pod</div>
            <div style={{ color: '#f59e0b' }}>metadata:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: log-collector</div>
            <div style={{ color: '#f59e0b' }}>spec:</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;volumes:</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;- name: host-logs</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;hostPath:</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;path: /var/log  # Path on the host node</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type: Directory</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;containers:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;- name: log-reader</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;image: busybox</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;command: ['sh', '-c', 'tail -f /logs/syslog']</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;volumeMounts:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;- name: host-logs</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mountPath: /logs  # Mount node's /var/log to /logs</div>
          </div>

          <h3>hostPath Types</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#22c55e' }}>Directory           # Path must exist and be a directory</div>
            <div style={{ color: '#22c55e' }}>DirectoryOrCreate   # Create if missing</div>
            <div style={{ color: '#22c55e' }}>File                # Path must exist and be a file</div>
            <div style={{ color: '#22c55e' }}>FileOrCreate        # Create file if missing</div>
            <div style={{ color: '#22c55e' }}>Socket              # UNIX socket must exist</div>
            <div style={{ color: '#22c55e' }}>CharDevice          # Character device must exist</div>
            <div style={{ color: '#22c55e' }}>BlockDevice         # Block device must exist</div>
          </div>

          <div style={{
            background: '#fef2f2',
            border: '3px solid #ef4444',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#dc2626' }}>⚠️ WARNING: hostPath Is Dangerous</h3>
            <ul style={{ marginBottom: 0 }}>
              <li><strong>Security risk:</strong> Gives Pod access to node filesystem (can read secrets, modify system files)</li>
              <li><strong>Not portable:</strong> If the Pod moves to a different node, the data isn't there</li>
              <li><strong>Breaks the Pod abstraction:</strong> Tightly couples Pod to specific node</li>
            </ul>
            <p style={{ marginBottom: 0, marginTop: '12px' }}>
              <strong>Only use hostPath for:</strong> System-level Pods (log collectors, monitoring agents, 
              DaemonSets that need node access). Never for application data.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>ConfigMap and Secret Volumes</h2>
          <p>
            You can mount <strong>ConfigMaps</strong> (Module 3.1) and <strong>Secrets</strong> 
            (Module 3.2) as volumes instead of environment variables.
          </p>

          <h3>Example: Mounting ConfigMap as Files</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># Create ConfigMap with config files</div>
            <div style={{ color: '#22c55e' }}>kubectl create configmap nginx-config \</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--from-file=nginx.conf \</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--from-file=app.conf</div>
            <br/>
            <div style={{ color: '#64748b' }}># pod-with-configmap-volume.yaml</div>
            <div style={{ color: '#f59e0b' }}>apiVersion: v1</div>
            <div style={{ color: '#f59e0b' }}>kind: Pod</div>
            <div style={{ color: '#f59e0b' }}>metadata:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: web-server</div>
            <div style={{ color: '#f59e0b' }}>spec:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;volumes:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;- name: config</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;configMap:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: nginx-config  # ConfigMap name</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;containers:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;- name: nginx</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;image: nginx:1.21</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;volumeMounts:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;- name: config</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mountPath: /etc/nginx/conf.d  # Mount location</div>
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
              <strong>Result:</strong> The ConfigMap keys become filenames in <code>/etc/nginx/conf.d/</code>:
              <br/><code>/etc/nginx/conf.d/nginx.conf</code>
              <br/><code>/etc/nginx/conf.d/app.conf</code>
            </p>
          </div>

          <h3>Mounting Specific Keys</h3>
          <p>
            You can mount only specific keys from a ConfigMap:
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
            <div style={{ color: '#0ea5e9' }}>volumes:</div>
            <div style={{ color: '#0ea5e9' }}>- name: config</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;configMap:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;name: nginx-config</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;items:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;- key: nginx.conf  # Only mount this key</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;path: nginx.conf  # As this filename</div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Why Containers Are Disposable</h2>
          <p>
            Kubernetes embraces the philosophy that <strong>containers should be disposable</strong>. 
            This means:
          </p>

          <div style={{
            background: '#f9fafb',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#9c0606ff' }}>Disposable Container Principles</h3>
            <ul>
              <li><strong>Immutable:</strong> Never modify a running container (rebuild and redeploy instead)</li>
              <li><strong>Replaceable:</strong> Any container can be killed and replaced at any time</li>
              <li><strong>Ephemeral:</strong> Don't store important data in the container filesystem</li>
              <li><strong>Stateless (ideally):</strong> Application state lives outside the container</li>
            </ul>
          </div>

          <h3>Where Does State Live?</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '16px',
            margin: '20px 0'
          }}>
            <div style={{
              border: '2px solid #22c55e',
              borderRadius: '8px',
              padding: '16px',
              background: '#f0fdf4'
            }}>
              <h4 style={{ marginTop: 0, color: '#22c55e' }}>✅ Stateless Application (Web Server)</h4>
              <p style={{ color: '#1e293b', margin: 0, fontSize: '0.9rem' }}>
                <strong>State:</strong> Session data in Redis (external), user profiles in Postgres (external)<br/>
                <strong>Why it works:</strong> Container can die/restart without losing user sessions<br/>
                <strong>Kubernetes fit:</strong> Perfect - use Deployments, scale horizontally
              </p>
            </div>

            <div style={{
              border: '2px solid #f59e0b',
              borderRadius: '8px',
              padding: '16px',
              background: '#fef3c7'
            }}>
              <h4 style={{ marginTop: 0, color: '#f59e0b' }}>⚠️ Stateful Application (Database)</h4>
              <p style={{ color: '#1e293b', margin: 0, fontSize: '0.9rem' }}>
                <strong>State:</strong> Database files stored in PersistentVolume<br/>
                <strong>Challenges:</strong> Can't just kill and replace (data loss), ordering matters, network identity important<br/>
                <strong>Kubernetes fit:</strong> StatefulSets (Module 5.3) + PersistentVolumes (Module 5.2)
              </p>
            </div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Other Volume Types (Preview)</h2>
          <p>
            Kubernetes supports many volume types beyond <code>emptyDir</code>, <code>hostPath</code>, 
            and <code>configMap</code>:
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
            <div style={{ color: '#22c55e' }}>persistentVolumeClaim  # Module 5.2 - The most important one</div>
            <div style={{ color: '#0ea5e9' }}>nfs                    # Network File System</div>
            <div style={{ color: '#0ea5e9' }}>awsElasticBlockStore   # AWS EBS</div>
            <div style={{ color: '#0ea5e9' }}>gcePersistentDisk      # Google Cloud Persistent Disk</div>
            <div style={{ color: '#0ea5e9' }}>azureDisk              # Azure Disk</div>
            <div style={{ color: '#0ea5e9' }}>azureFile              # Azure File Storage</div>
            <div style={{ color: '#0ea5e9' }}>cephfs                 # Ceph File System</div>
            <div style={{ color: '#0ea5e9' }}>glusterfs              # GlusterFS</div>
            <div style={{ color: '#0ea5e9' }}>iscsi                  # iSCSI storage</div>
            <div style={{ color: '#f59e0b' }}>csi                    # Container Storage Interface (modern approach)</div>
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
              <strong>💡 You rarely use these directly.</strong> Instead, you use 
              <strong>PersistentVolumeClaims</strong> (Module 5.2), which abstract away the 
              storage provider details.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Volume vs PersistentVolume</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            margin: '20px 0'
          }}>
            <div style={{
              border: '2px solid #f59e0b',
              borderRadius: '12px',
              padding: '20px',
              background: '#fef3c7'
            }}>
              <h3 style={{ marginTop: 0, color: '#f59e0b' }}>Volume (This Module)</h3>
              <ul style={{ color: '#1e293b', fontSize: '0.9rem' }}>
                <li>Defined in Pod spec</li>
                <li>Lifetime tied to Pod</li>
                <li>No abstraction layer</li>
                <li>Use for temp storage</li>
              </ul>
              <p style={{ color: '#1e293b', fontSize: '0.85rem', marginBottom: 0 }}>
                Example: <code>emptyDir</code>, <code>configMap</code>
              </p>
            </div>

            <div style={{
              border: '2px solid #0ea5e9',
              borderRadius: '12px',
              padding: '20px',
              background: '#f0f9ff'
            }}>
              <h3 style={{ marginTop: 0, color: '#0ea5e9' }}>PersistentVolume (Module 5.2)</h3>
              <ul style={{ color: '#1e293b', fontSize: '0.9rem' }}>
                <li>Cluster-level resource</li>
                <li>Outlives Pods</li>
                <li>Abstracted via PVC</li>
                <li>Use for databases, files</li>
              </ul>
              <p style={{ color: '#1e293b', fontSize: '0.85rem', marginBottom: 0 }}>
                Example: EBS volume, NFS share
              </p>
            </div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Debugging Volume Issues</h2>

          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># Check if volume is mounted</div>
            <div style={{ color: '#22c55e' }}>kubectl describe pod my-pod</div>
            <div style={{ color: '#64748b' }}># Look for "Mounts:" and "Volumes:" sections</div>
            <br/>
            <div style={{ color: '#64748b' }}># Inspect volume contents from inside the container</div>
            <div style={{ color: '#0ea5e9' }}>kubectl exec my-pod -- ls -la /app/cache</div>
            <br/>
            <div style={{ color: '#64748b' }}># Check volume permissions</div>
            <div style={{ color: '#f59e0b' }}>kubectl exec my-pod -- stat /app/cache</div>
            <br/>
            <div style={{ color: '#64748b' }}># Common error: "volume mount failed"</div>
            <div style={{ color: '#ef4444' }}>kubectl get events --sort-by='.lastTimestamp'</div>
          </div>

          <h3>Common Volume Errors</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '12px',
            margin: '20px 0'
          }}>
            <div style={{
              border: '2px solid #ef4444',
              borderRadius: '8px',
              padding: '16px',
              background: '#fef2f2'
            }}>
              <h4 style={{ marginTop: 0, color: '#ef4444', fontSize: '0.95rem' }}>
                ❌ "path /data not found" (hostPath)
              </h4>
              <p style={{ color: '#1e293b', margin: 0, fontSize: '0.85rem' }}>
                <strong>Cause:</strong> hostPath directory doesn't exist on the node<br/>
                <strong>Fix:</strong> Use <code>type: DirectoryOrCreate</code> or pre-create the directory
              </p>
            </div>

            <div style={{
              border: '2px solid #ef4444',
              borderRadius: '8px',
              padding: '16px',
              background: '#fef2f2'
            }}>
              <h4 style={{ marginTop: 0, color: '#ef4444', fontSize: '0.95rem' }}>
                ❌ "configmap nginx-config not found"
              </h4>
              <p style={{ color: '#1e293b', margin: 0, fontSize: '0.85rem' }}>
                <strong>Cause:</strong> ConfigMap doesn't exist or wrong namespace<br/>
                <strong>Fix:</strong> <code>kubectl get configmap</code> to verify it exists
              </p>
            </div>

            <div style={{
              border: '2px solid #ef4444',
              borderRadius: '8px',
              padding: '16px',
              background: '#fef2f2'
            }}>
              <h4 style={{ marginTop: 0, color: '#ef4444', fontSize: '0.95rem' }}>
                ❌ "permission denied" when writing to volume
              </h4>
              <p style={{ color: '#1e293b', margin: 0, fontSize: '0.85rem' }}>
                <strong>Cause:</strong> Container running as non-root, volume owned by root<br/>
                <strong>Fix:</strong> Set <code>securityContext.fsGroup</code> in Pod spec (Module 7.2)
              </p>
            </div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Key Takeaways</h2>
          <ul>
            <li><strong>Container filesystem is ephemeral</strong> - data lost when container dies</li>
            <li><strong>Volumes</strong> provide storage that outlives containers</li>
            <li><strong>emptyDir:</strong> Temporary storage (Pod lifetime), good for caching and scratch space</li>
            <li><strong>hostPath:</strong> Access node filesystem (dangerous, avoid for apps)</li>
            <li><strong>ConfigMap/Secret volumes:</strong> Inject config files into Pods</li>
            <li><strong>Containers should be disposable</strong> - immutable, replaceable, stateless (when possible)</li>
            <li><strong>State lives outside containers:</strong> External databases, caches, PersistentVolumes</li>
            <li>Volume types: Pod-scoped (<code>emptyDir</code>) vs cluster-scoped (<code>PersistentVolume</code>)</li>
            <li>Use <code>emptyDir</code> for temp data, <code>PersistentVolume</code> (Module 5.2) for important data</li>
            <li>Debug volumes with <code>kubectl describe pod</code> and <code>kubectl exec</code></li>
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
          <Link href="/module-4-3" legacyBehavior>
            <a style={{
              textDecoration: 'none',
              color: '#4b5563',
              fontWeight: 600,
              padding: '12px 24px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>← Previous: Horizontal Pod Autoscaling</a>
          </Link>
          
          <Link href="/module-5-2" legacyBehavior>
            <a style={{
              textDecoration: 'none',
              color: '#fff',
              background: '#9c0606ff',
              fontWeight: 600,
              padding: '12px 24px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>Next: PersistentVolumes & Claims →</a>
          </Link>
        </div>
      </main>
    </div>
  );
}
