import { useState } from 'react';
import styles from '../styles/Home.module.css';
import moduleStyles from '../styles/Module.module.css';
import ModuleShell from '../components/module/ModuleShell';
import Callout from '../components/module/Callout';
import TermBox from '../components/module/TermBox';

const volumeTypes = {
  emptyDir: {
    name: 'emptyDir',
    description: 'Temporary storage that lives as long as the Pod',
    useCase: 'Scratch space, caching, temporary data',
    persistent: false,
    surviveRestart: false,
    color: '#f59e0b',
  },
  hostPath: {
    name: 'hostPath',
    description: 'Mounts a file/directory from the host node',
    useCase: 'Accessing node logs, Docker socket (dangerous)',
    persistent: true,
    surviveRestart: true,
    color: '#ef4444',
  },
  configMap: {
    name: 'configMap',
    description: 'Injects ConfigMap data as files',
    useCase: 'Configuration files, certificates',
    persistent: false,
    surviveRestart: true,
    color: '#0ea5e9',
  },
};

const metricBox: React.CSSProperties = {
  background: 'var(--color-bg-secondary)',
  padding: '12px',
  borderRadius: 'var(--radius-sm)',
};

export default function Module51() {
  const [volumeType, setVolumeType] = useState<keyof typeof volumeTypes>('emptyDir');
  const [showPodRestart, setShowPodRestart] = useState(false);
  const current = volumeTypes[volumeType];

  const typeButton = (t: keyof typeof volumeTypes): React.CSSProperties => ({
    padding: '12px 24px',
    background: volumeType === t ? volumeTypes[t].color : 'var(--color-bg-tertiary)',
    color: volumeType === t ? '#fff' : 'var(--color-text-secondary)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '1rem',
    transition: 'all var(--transition-fast)',
  });

  return (
    <ModuleShell id="5-1" subtitle="Ephemeral vs Persistent Storage (and Why Containers Are Disposable)">
      <section className={styles.spotlight}>
        <h2>The Storage Problem</h2>
        <p>
          You deploy a beautiful web app to Kubernetes. Users upload profile pictures. Everything
          works great. Then your Pod crashes (maybe OOMKilled from Module 4.1). Kubernetes
          restarts it. The users' profile pictures are gone.
        </p>

        <Callout variant="danger" icon="💥" title="The Container Filesystem Is Ephemeral">
          <p>
            When a container starts, it gets a <strong>fresh filesystem</strong> from the image.
            Any changes you make (files written, logs created, user uploads) exist <strong>only
            in that container</strong>. When the container dies, those changes vanish.
          </p>
        </Callout>

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

        <Callout variant="info" icon="🔑" title="Key Concept: Volume Lifetime">
          <ul>
            <li><strong>Container lifetime:</strong> Container's writable layer (ephemeral, dies with container)</li>
            <li><strong>Pod lifetime:</strong> <code>emptyDir</code> volume (ephemeral, dies with Pod)</li>
            <li><strong>Beyond Pod lifetime:</strong> <code>PersistentVolume</code> (survives Pod deletion)</li>
          </ul>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Interactive: Volume Types</h2>
        <p>Click on different volume types to see their characteristics:</p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', margin: '20px 0', flexWrap: 'wrap' }}>
          <button onClick={() => setVolumeType('emptyDir')} style={typeButton('emptyDir')}>emptyDir</button>
          <button onClick={() => setVolumeType('hostPath')} style={typeButton('hostPath')}>hostPath</button>
          <button onClick={() => setVolumeType('configMap')} style={typeButton('configMap')}>configMap</button>
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
          <h3 style={{ marginTop: 0, color: current.color, fontFamily: 'monospace', fontSize: '1.5rem' }}>{current.name}</h3>

          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', margin: '16px 0' }}>{current.description}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginTop: '20px' }}>
            <div style={metricBox}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>Persistent?</div>
              <div style={{ color: 'var(--color-text-primary)', fontWeight: 600, fontSize: '1.1rem' }}>{current.persistent ? '✅ Yes' : '❌ No'}</div>
            </div>
            <div style={metricBox}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>Survives Restart?</div>
              <div style={{ color: 'var(--color-text-primary)', fontWeight: 600, fontSize: '1.1rem' }}>{current.surviveRestart ? '✅ Yes' : '❌ No'}</div>
            </div>
          </div>

          <div style={{ ...metricBox, marginTop: '16px' }}>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>Use Case:</div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>{current.useCase}</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <button
            onClick={() => setShowPodRestart(!showPodRestart)}
            style={{ padding: '12px 24px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}
          >
            {showPodRestart ? '🔄 Pod Restarted!' : '💥 Simulate Pod Restart'}
          </button>
        </div>

        {showPodRestart && (
          <Callout variant={current.surviveRestart ? 'success' : 'danger'} title={current.surviveRestart ? '✅ Data Survived!' : '❌ Data Lost!'}>
            <p>
              {volumeType === 'emptyDir' && 'emptyDir is deleted when the Pod is deleted. All data is lost.'}
              {volumeType === 'hostPath' && 'hostPath data persists on the node filesystem. Still there after Pod restart!'}
              {volumeType === 'configMap' && 'ConfigMap data is stored in etcd, not in the Pod. Still available after restart!'}
            </p>
          </Callout>
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
        <TermBox>
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
        </TermBox>

        <Callout variant="info">
          <p>
            <strong>What happens:</strong> Both containers share the same <code>emptyDir</code>
            volume. The cache-warmer can pre-populate data that the app container reads. When
            the Pod is deleted, the entire <code>emptyDir</code> is wiped.
          </p>
        </Callout>

        <h3>emptyDir with Memory Storage</h3>
        <p>You can store <code>emptyDir</code> data in memory (tmpfs) instead of disk:</p>

        <TermBox>
          <div style={{ color: '#22c55e' }}>volumes:</div>
          <div style={{ color: '#22c55e' }}>- name: memory-cache</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;emptyDir:</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;medium: Memory  # Store in RAM, not disk</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;sizeLimit: 128Mi  # Limit to 128MB</div>
        </TermBox>

        <Callout variant="warning">
          <p>
            <strong>⚠️ Caution:</strong> Memory-backed <code>emptyDir</code> counts against the
            container's memory limit. If you exceed it, the Pod gets OOMKilled (Module 4.1).
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>hostPath: Node Filesystem Access</h2>
        <p>
          A <code>hostPath</code> volume mounts a file or directory from the <strong>host node's
          filesystem</strong> into the Pod. Unlike <code>emptyDir</code>, it persists even after
          the Pod is deleted.
        </p>

        <h3>Example: Accessing Node Logs</h3>
        <TermBox>
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
        </TermBox>

        <h3>hostPath Types</h3>
        <TermBox>
          <div style={{ color: '#22c55e' }}>Directory           # Path must exist and be a directory</div>
          <div style={{ color: '#22c55e' }}>DirectoryOrCreate   # Create if missing</div>
          <div style={{ color: '#22c55e' }}>File                # Path must exist and be a file</div>
          <div style={{ color: '#22c55e' }}>FileOrCreate        # Create file if missing</div>
          <div style={{ color: '#22c55e' }}>Socket              # UNIX socket must exist</div>
          <div style={{ color: '#22c55e' }}>CharDevice          # Character device must exist</div>
          <div style={{ color: '#22c55e' }}>BlockDevice         # Block device must exist</div>
        </TermBox>

        <Callout variant="danger" icon="⚠️" title="WARNING: hostPath Is Dangerous">
          <ul>
            <li><strong>Security risk:</strong> Gives Pod access to node filesystem (can read secrets, modify system files)</li>
            <li><strong>Not portable:</strong> If the Pod moves to a different node, the data isn't there</li>
            <li><strong>Breaks the Pod abstraction:</strong> Tightly couples Pod to specific node</li>
          </ul>
          <p>
            <strong>Only use hostPath for:</strong> System-level Pods (log collectors, monitoring agents,
            DaemonSets that need node access). Never for application data.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>ConfigMap and Secret Volumes</h2>
        <p>
          You can mount <strong>ConfigMaps</strong> (Module 3.1) and <strong>Secrets</strong>
          (Module 3.2) as volumes instead of environment variables.
        </p>

        <h3>Example: Mounting ConfigMap as Files</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># Create ConfigMap with config files</div>
          <div style={{ color: '#22c55e' }}>kubectl create configmap nginx-config \</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--from-file=nginx.conf \</div>
          <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;--from-file=app.conf</div>
          <br />
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
        </TermBox>

        <Callout variant="info">
          <p>
            <strong>Result:</strong> The ConfigMap keys become filenames in <code>/etc/nginx/conf.d/</code>:
            <br /><code>/etc/nginx/conf.d/nginx.conf</code>
            <br /><code>/etc/nginx/conf.d/app.conf</code>
          </p>
        </Callout>

        <h3>Mounting Specific Keys</h3>
        <p>You can mount only specific keys from a ConfigMap:</p>

        <TermBox>
          <div style={{ color: '#0ea5e9' }}>volumes:</div>
          <div style={{ color: '#0ea5e9' }}>- name: config</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;configMap:</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;name: nginx-config</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;items:</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;- key: nginx.conf  # Only mount this key</div>
          <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;path: nginx.conf  # As this filename</div>
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>Why Containers Are Disposable</h2>
        <p>
          Kubernetes embraces the philosophy that <strong>containers should be disposable</strong>.
          This means:
        </p>

        <Callout variant="neutral" title="Disposable Container Principles">
          <ul>
            <li><strong>Immutable:</strong> Never modify a running container (rebuild and redeploy instead)</li>
            <li><strong>Replaceable:</strong> Any container can be killed and replaced at any time</li>
            <li><strong>Ephemeral:</strong> Don't store important data in the container filesystem</li>
            <li><strong>Stateless (ideally):</strong> Application state lives outside the container</li>
          </ul>
        </Callout>

        <h3>Where Does State Live?</h3>
        <div style={{ display: 'grid', gap: '1rem', margin: '1.5rem 0' }}>
          <Callout variant="success" title="✅ Stateless Application (Web Server)">
            <p>
              <strong>State:</strong> Session data in Redis (external), user profiles in Postgres (external)<br />
              <strong>Why it works:</strong> Container can die/restart without losing user sessions<br />
              <strong>Kubernetes fit:</strong> Perfect - use Deployments, scale horizontally
            </p>
          </Callout>
          <Callout variant="warning" title="⚠️ Stateful Application (Database)">
            <p>
              <strong>State:</strong> Database files stored in PersistentVolume<br />
              <strong>Challenges:</strong> Can't just kill and replace (data loss), ordering matters, network identity important<br />
              <strong>Kubernetes fit:</strong> StatefulSets (Module 5.3) + PersistentVolumes (Module 5.2)
            </p>
          </Callout>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>Other Volume Types (Preview)</h2>
        <p>
          Kubernetes supports many volume types beyond <code>emptyDir</code>, <code>hostPath</code>,
          and <code>configMap</code>:
        </p>

        <TermBox>
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
        </TermBox>

        <Callout variant="info">
          <p>
            <strong>💡 You rarely use these directly.</strong> Instead, you use
            <strong>PersistentVolumeClaims</strong> (Module 5.2), which abstract away the
            storage provider details.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Volume vs PersistentVolume</h2>

        <div className={moduleStyles.grid}>
          <Callout variant="warning" title="Volume (This Module)">
            <ul>
              <li>Defined in Pod spec</li>
              <li>Lifetime tied to Pod</li>
              <li>No abstraction layer</li>
              <li>Use for temp storage</li>
            </ul>
            <p>Example: <code>emptyDir</code>, <code>configMap</code></p>
          </Callout>

          <Callout variant="info" title="PersistentVolume (Module 5.2)">
            <ul>
              <li>Cluster-level resource</li>
              <li>Outlives Pods</li>
              <li>Abstracted via PVC</li>
              <li>Use for databases, files</li>
            </ul>
            <p>Example: EBS volume, NFS share</p>
          </Callout>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>Debugging Volume Issues</h2>

        <TermBox>
          <div style={{ color: '#64748b' }}># Check if volume is mounted</div>
          <div style={{ color: '#22c55e' }}>kubectl describe pod my-pod</div>
          <div style={{ color: '#64748b' }}># Look for "Mounts:" and "Volumes:" sections</div>
          <br />
          <div style={{ color: '#64748b' }}># Inspect volume contents from inside the container</div>
          <div style={{ color: '#0ea5e9' }}>kubectl exec my-pod -- ls -la /app/cache</div>
          <br />
          <div style={{ color: '#64748b' }}># Check volume permissions</div>
          <div style={{ color: '#f59e0b' }}>kubectl exec my-pod -- stat /app/cache</div>
          <br />
          <div style={{ color: '#64748b' }}># Common error: "volume mount failed"</div>
          <div style={{ color: '#ef4444' }}>kubectl get events --sort-by='.lastTimestamp'</div>
        </TermBox>

        <h3>Common Volume Errors</h3>
        <div style={{ display: 'grid', gap: '0.75rem', margin: '1.5rem 0' }}>
          <Callout variant="danger" title='❌ "path /data not found" (hostPath)'>
            <p>
              <strong>Cause:</strong> hostPath directory doesn't exist on the node<br />
              <strong>Fix:</strong> Use <code>type: DirectoryOrCreate</code> or pre-create the directory
            </p>
          </Callout>
          <Callout variant="danger" title='❌ "configmap nginx-config not found"'>
            <p>
              <strong>Cause:</strong> ConfigMap doesn't exist or wrong namespace<br />
              <strong>Fix:</strong> <code>kubectl get configmap</code> to verify it exists
            </p>
          </Callout>
          <Callout variant="danger" title='❌ "permission denied" when writing to volume'>
            <p>
              <strong>Cause:</strong> Container running as non-root, volume owned by root<br />
              <strong>Fix:</strong> Set <code>securityContext.fsGroup</code> in Pod spec (Module 7.2)
            </p>
          </Callout>
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
    </ModuleShell>
  );
}
