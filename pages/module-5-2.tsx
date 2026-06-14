import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Module52() {
  const [storageSize, setStorageSize] = useState(10);
  const [accessMode, setAccessMode] = useState<'ReadWriteOnce' | 'ReadOnlyMany' | 'ReadWriteMany'>('ReadWriteOnce');
  const [storageClass, setStorageClass] = useState<'fast' | 'standard' | 'archive'>('standard');

  const accessModes = {
    ReadWriteOnce: {
      code: 'RWO',
      description: 'Volume can be mounted read-write by a single node',
      useCase: 'Most common - databases, single-node apps',
      color: '#22c55e',
      bg: '#f0fdf4'
    },
    ReadOnlyMany: {
      code: 'ROX',
      description: 'Volume can be mounted read-only by many nodes',
      useCase: 'Shared config files, static assets',
      color: '#0ea5e9',
      bg: '#f0f9ff'
    },
    ReadWriteMany: {
      code: 'RWX',
      description: 'Volume can be mounted read-write by many nodes',
      useCase: 'Shared storage (NFS), multi-node writes',
      color: '#f59e0b',
      bg: '#fef3c7'
    }
  };

  const storageClasses = {
    fast: {
      name: 'fast-ssd',
      type: 'SSD (io2 / Premium SSD)',
      iops: '64,000',
      cost: '$$$',
      color: '#ef4444'
    },
    standard: {
      name: 'standard',
      type: 'SSD (gp3 / Standard SSD)',
      iops: '16,000',
      cost: '$$',
      color: '#0ea5e9'
    },
    archive: {
      name: 'archive-hdd',
      type: 'HDD (st1 / Standard HDD)',
      iops: '500',
      cost: '$',
      color: '#6b7280'
    }
  };

  const currentMode = accessModes[accessMode];
  const currentClass = storageClasses[storageClass];

  return (
    <div className={styles.container}>
      <Head>
        <title>Module 5.2: PersistentVolumes & Claims</title>
        <meta name="description" content="Understanding PVs, PVCs, StorageClasses, and dynamic provisioning" />
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
        <h1 className={styles.title}>Module 5.2: PersistentVolumes & Claims</h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280', marginTop: '-10px' }}>
          Abstracting Storage (So Developers Don't Need to Know About AWS EBS)
        </p>
        
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/module-5-1" legacyBehavior>
            <a style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>
              ← Previous: Volumes
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/learning-modules" legacyBehavior>
            <a style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>
              All Modules
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/module-5-3" legacyBehavior>
            <a style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>
              Next: StatefulSets →
            </a>
          </Link>
        </div>
        
        <section className={styles.spotlight}>
          <h2>The Problem with Volumes</h2>
          <p>
            In Module 5.1, we used volumes like <code>emptyDir</code> and <code>hostPath</code>. 
            These work, but they have a problem: the Pod manifest must know storage details.
          </p>

          <div style={{
            background: '#fef2f2',
            border: '2px solid #ef4444',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#dc2626' }}>❌ The Tightly-Coupled Approach</h3>
            <div style={{
              background: '#1e293b',
              color: '#e2e8f0',
              padding: '16px',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              margin: '12px 0'
            }}>
              <div style={{ color: '#ef4444' }}>volumes:</div>
              <div style={{ color: '#ef4444' }}>- name: data</div>
              <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;awsElasticBlockStore:</div>
              <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;volumeID: vol-0a1b2c3d4e5f6g7h8  # AWS-specific!</div>
              <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;fsType: ext4</div>
            </div>
            <p style={{ marginBottom: 0 }}>
              <strong>Problems:</strong> Developer must know AWS volume IDs, can't switch cloud providers, 
              can't reuse the same Pod manifest in different environments.
            </p>
          </div>

          <div style={{
            background: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#16a34a' }}>✅ The Abstracted Approach</h3>
            <div style={{
              background: '#1e293b',
              color: '#e2e8f0',
              padding: '16px',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              margin: '12px 0'
            }}>
              <div style={{ color: '#22c55e' }}>volumes:</div>
              <div style={{ color: '#22c55e' }}>- name: data</div>
              <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;persistentVolumeClaim:</div>
              <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;claimName: my-database-storage  # Just ask for storage!</div>
            </div>
            <p style={{ marginBottom: 0 }}>
              <strong>Better:</strong> Developer asks for "10GB of storage" and Kubernetes figures out 
              how to provide it (AWS EBS, Google Persistent Disk, NFS, etc).
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>The Storage Abstraction Layers</h2>
          
          <div style={{
            background: '#f9fafb',
            border: '2px solid #475569',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#9c0606ff' }}>Three Layers</h3>
            <ol>
              <li>
                <strong>PersistentVolume (PV):</strong> Actual storage resource (cluster admin creates)
                <ul>
                  <li>100GB AWS EBS volume</li>
                  <li>NFS share at <code>nfs-server:/exports</code></li>
                  <li>Azure Disk</li>
                </ul>
              </li>
              <li>
                <strong>PersistentVolumeClaim (PVC):</strong> Request for storage (developer creates)
                <ul>
                  <li>"I need 10GB of fast storage"</li>
                  <li>Kubernetes binds PVC to a matching PV</li>
                </ul>
              </li>
              <li>
                <strong>Pod:</strong> Uses the PVC (developer references in Pod spec)
                <ul>
                  <li>Mounts the PVC as a volume</li>
                  <li>Doesn't know about underlying storage</li>
                </ul>
              </li>
            </ol>
          </div>

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>
              Storage Flow
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                background: '#ef4444',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '8px',
                fontWeight: 600
              }}>
                AWS EBS Volume
              </div>
              <div style={{ fontSize: '1.5rem' }}>→</div>
              <div style={{
                background: '#f59e0b',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '8px',
                fontWeight: 600
              }}>
                PersistentVolume
              </div>
              <div style={{ fontSize: '1.5rem' }}>→</div>
              <div style={{
                background: '#0ea5e9',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '8px',
                fontWeight: 600
              }}>
                PVC
              </div>
              <div style={{ fontSize: '1.5rem' }}>→</div>
              <div style={{
                background: '#22c55e',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '8px',
                fontWeight: 600
              }}>
                Pod
              </div>
            </div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Interactive: PVC Configuration</h2>
          <p>
            Configure a PersistentVolumeClaim and see the generated YAML:
          </p>

          <div style={{
            background: '#f9fafb',
            border: '2px solid #475569',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px 0'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontWeight: 600,
                marginBottom: '8px',
                color: '#1e293b'
              }}>
                Storage Size: {storageSize}Gi
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={storageSize}
                onChange={(e) => setStorageSize(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontWeight: 600,
                marginBottom: '12px',
                color: '#1e293b'
              }}>
                Access Mode:
              </label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setAccessMode('ReadWriteOnce')}
                  style={{
                    padding: '10px 16px',
                    background: accessMode === 'ReadWriteOnce' ? '#22c55e' : '#334155',
                    color: accessMode === 'ReadWriteOnce' ? '#fff' : '#f8fafc',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  RWO (Single Node)
                </button>
                <button
                  onClick={() => setAccessMode('ReadOnlyMany')}
                  style={{
                    padding: '10px 16px',
                    background: accessMode === 'ReadOnlyMany' ? '#0ea5e9' : '#334155',
                    color: accessMode === 'ReadOnlyMany' ? '#fff' : '#f8fafc',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  ROX (Read-Only)
                </button>
                <button
                  onClick={() => setAccessMode('ReadWriteMany')}
                  style={{
                    padding: '10px 16px',
                    background: accessMode === 'ReadWriteMany' ? '#f59e0b' : '#334155',
                    color: accessMode === 'ReadWriteMany' ? '#fff' : '#f8fafc',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  RWX (Multi-Node)
                </button>
              </div>
            </div>

            <div style={{
              background: currentMode.bg,
              border: `2px solid ${currentMode.color}`,
              borderRadius: '8px',
              padding: '16px',
              margin: '16px 0'
            }}>
              <div style={{ color: '#1e293b', fontSize: '0.9rem', marginBottom: '4px' }}>
                <strong>{currentMode.code}:</strong> {currentMode.description}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                Use case: {currentMode.useCase}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontWeight: 600,
                marginBottom: '12px',
                color: '#1e293b'
              }}>
                Storage Class:
              </label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setStorageClass('fast')}
                  style={{
                    padding: '10px 16px',
                    background: storageClass === 'fast' ? '#ef4444' : '#334155',
                    color: storageClass === 'fast' ? '#fff' : '#f8fafc',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  Fast SSD
                </button>
                <button
                  onClick={() => setStorageClass('standard')}
                  style={{
                    padding: '10px 16px',
                    background: storageClass === 'standard' ? '#0ea5e9' : '#334155',
                    color: storageClass === 'standard' ? '#fff' : '#f8fafc',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  Standard
                </button>
                <button
                  onClick={() => setStorageClass('archive')}
                  style={{
                    padding: '10px 16px',
                    background: storageClass === 'archive' ? '#6b7280' : '#334155',
                    color: storageClass === 'archive' ? '#fff' : '#f8fafc',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  Archive HDD
                </button>
              </div>
            </div>

            <div style={{
              background: '#f9fafb',
              border: '2px solid #475569',
              borderRadius: '8px',
              padding: '16px',
              margin: '16px 0'
            }}>
              <div style={{ color: '#1e293b', fontSize: '0.85rem' }}>
                <strong>Type:</strong> {currentClass.type}
              </div>
              <div style={{ color: '#1e293b', fontSize: '0.85rem' }}>
                <strong>IOPS:</strong> Up to {currentClass.iops}
              </div>
              <div style={{ color: '#1e293b', fontSize: '0.85rem' }}>
                <strong>Cost:</strong> {currentClass.cost}
              </div>
            </div>

            <div style={{
              background: '#1e293b',
              color: '#e2e8f0',
              padding: '20px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              marginTop: '20px'
            }}>
              <div style={{ color: '#64748b' }}># pvc.yaml</div>
              <div style={{ color: '#f59e0b' }}>apiVersion: v1</div>
              <div style={{ color: '#f59e0b' }}>kind: PersistentVolumeClaim</div>
              <div style={{ color: '#f59e0b' }}>metadata:</div>
              <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: my-database-storage</div>
              <div style={{ color: '#f59e0b' }}>spec:</div>
              <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;accessModes:</div>
              <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;- {accessMode}</div>
              <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;storageClassName: {currentClass.name}</div>
              <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;resources:</div>
              <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;requests:</div>
              <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;storage: {storageSize}Gi</div>
            </div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Step 1: Creating a PersistentVolume (Admin Task)</h2>
          <p>
            <strong>Cluster admins</strong> create PersistentVolumes that represent actual storage 
            resources. Developers don't typically do this (they use PVCs instead).
          </p>

          <h3>Example: Static PV (Manual Provisioning)</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># pv.yaml</div>
            <div style={{ color: '#f59e0b' }}>apiVersion: v1</div>
            <div style={{ color: '#f59e0b' }}>kind: PersistentVolume</div>
            <div style={{ color: '#f59e0b' }}>metadata:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: pv-nfs-1</div>
            <div style={{ color: '#f59e0b' }}>spec:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;capacity:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;storage: 100Gi</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;accessModes:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;- ReadWriteMany  # Multiple Pods can write</div>
            <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;persistentVolumeReclaimPolicy: Retain</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;nfs:</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;server: nfs-server.example.com</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;&nbsp;&nbsp;path: "/exports/data"</div>
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
            <div style={{ color: '#22c55e' }}>kubectl apply -f pv.yaml</div>
            <div style={{ color: '#0ea5e9' }}>kubectl get pv</div>
            <div style={{ color: '#64748b' }}>NAME       CAPACITY   ACCESS MODES   STATUS      CLAIM</div>
            <div style={{ color: '#e2e8f0' }}>pv-nfs-1   100Gi      RWX            Available</div>
          </div>

          <h3>PV Reclaim Policies</h3>
          <div style={{
            background: '#f9fafb',
            border: '2px solid #475569',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <ul>
              <li><strong>Retain:</strong> Keep the PV and data after PVC is deleted (manual cleanup)</li>
              <li><strong>Delete:</strong> Delete the PV and underlying storage (cloud volumes deleted automatically)</li>
              <li><strong>Recycle:</strong> Deprecated - wipe data and make PV available again</li>
            </ul>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Step 2: Creating a PersistentVolumeClaim (Developer Task)</h2>
          <p>
            Developers create <strong>PVCs</strong> to request storage. Kubernetes finds a matching 
            PV and binds them together.
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
            <div style={{ color: '#64748b' }}># pvc.yaml</div>
            <div style={{ color: '#f59e0b' }}>apiVersion: v1</div>
            <div style={{ color: '#f59e0b' }}>kind: PersistentVolumeClaim</div>
            <div style={{ color: '#f59e0b' }}>metadata:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: my-pvc</div>
            <div style={{ color: '#f59e0b' }}>spec:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;accessModes:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;- ReadWriteMany  # Must match PV's access mode</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;resources:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;requests:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;storage: 50Gi  # Must be ≤ PV capacity</div>
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
            <div style={{ color: '#22c55e' }}>kubectl apply -f pvc.yaml</div>
            <div style={{ color: '#0ea5e9' }}>kubectl get pvc</div>
            <div style={{ color: '#64748b' }}>NAME     STATUS   VOLUME     CAPACITY   ACCESS MODES</div>
            <div style={{ color: '#e2e8f0' }}>my-pvc   Bound    pv-nfs-1   100Gi      RWX</div>
            <br/>
            <div style={{ color: '#0ea5e9' }}>kubectl get pv</div>
            <div style={{ color: '#64748b' }}>NAME       CAPACITY   STATUS   CLAIM            ACCESS MODES</div>
            <div style={{ color: '#22c55e' }}>pv-nfs-1   100Gi      Bound    default/my-pvc   RWX</div>
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
              <strong>Binding:</strong> Kubernetes matched the PVC (<code>my-pvc</code>) to the PV 
              (<code>pv-nfs-1</code>) because the access modes and capacity matched. The PVC is now 
              <code>Bound</code> and ready to use.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Step 3: Using the PVC in a Pod</h2>
          <p>
            Now that the PVC is bound, you can mount it in a Pod like any other volume:
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
            <div style={{ color: '#64748b' }}># pod-with-pvc.yaml</div>
            <div style={{ color: '#f59e0b' }}>apiVersion: v1</div>
            <div style={{ color: '#f59e0b' }}>kind: Pod</div>
            <div style={{ color: '#f59e0b' }}>metadata:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: app-with-storage</div>
            <div style={{ color: '#f59e0b' }}>spec:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;volumes:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;- name: data</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;persistentVolumeClaim:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;claimName: my-pvc  # Reference the PVC</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;containers:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;- name: app</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;image: myapp:1.0</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;volumeMounts:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;- name: data</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mountPath: /app/data</div>
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
              <strong>✅ Clean Abstraction:</strong> The Pod doesn't know about NFS, AWS EBS, or any 
              storage details. It just references <code>my-pvc</code>. If you switch from NFS to 
              cloud storage, the Pod manifest doesn't change!
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Dynamic Provisioning (The Modern Way)</h2>
          <p>
            <strong>Static provisioning</strong> (creating PVs manually) is tedious. <strong>Dynamic 
            provisioning</strong> automatically creates PVs when you create PVCs.
          </p>

          <h3>StorageClass: The Provisioning Template</h3>
          <p>
            A <strong>StorageClass</strong> defines <em>how</em> to provision storage dynamically. 
            It's like a template that says "when someone asks for storage, create an AWS EBS volume 
            with these settings."
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
            <div style={{ color: '#64748b' }}># storageclass.yaml</div>
            <div style={{ color: '#f59e0b' }}>apiVersion: storage.k8s.io/v1</div>
            <div style={{ color: '#f59e0b' }}>kind: StorageClass</div>
            <div style={{ color: '#f59e0b' }}>metadata:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: fast-ssd</div>
            <div style={{ color: '#22c55e' }}>provisioner: kubernetes.io/aws-ebs  # AWS EBS provisioner</div>
            <div style={{ color: '#0ea5e9' }}>parameters:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;type: io2  # Provisioned IOPS SSD</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;iopsPerGB: "50"</div>
            <div style={{ color: '#f59e0b' }}>volumeBindingMode: WaitForFirstConsumer  # Provision when Pod is scheduled</div>
          </div>

          <h3>Using a StorageClass</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># pvc-with-storageclass.yaml</div>
            <div style={{ color: '#f59e0b' }}>apiVersion: v1</div>
            <div style={{ color: '#f59e0b' }}>kind: PersistentVolumeClaim</div>
            <div style={{ color: '#f59e0b' }}>metadata:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: db-storage</div>
            <div style={{ color: '#f59e0b' }}>spec:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;storageClassName: fast-ssd  # Use this StorageClass</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;accessModes:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;- ReadWriteOnce</div>
            <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;resources:</div>
            <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;requests:</div>
            <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;storage: 50Gi</div>
          </div>

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#0369a1' }}>What Happens</h3>
            <ol style={{ marginBottom: 0 }}>
              <li>You create the PVC</li>
              <li>Kubernetes sees <code>storageClassName: fast-ssd</code></li>
              <li>The <code>fast-ssd</code> StorageClass calls the AWS EBS provisioner</li>
              <li>AWS creates a new 50GB io2 EBS volume</li>
              <li>Kubernetes creates a PV for that EBS volume</li>
              <li>Kubernetes binds the PVC to the new PV</li>
              <li>Your Pod mounts the volume</li>
            </ol>
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
              <strong>✅ You never created a PV manually!</strong> The StorageClass did it for you. 
              This is how most production Kubernetes clusters work.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Access Modes Explained</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '16px',
            margin: '20px 0'
          }}>
            <div style={{
              border: '2px solid #22c55e',
              borderRadius: '8px',
              padding: '20px',
              background: '#f0fdf4'
            }}>
              <h4 style={{ marginTop: 0, color: '#22c55e' }}>ReadWriteOnce (RWO)</h4>
              <p style={{ color: '#1e293b', margin: 0, fontSize: '0.9rem' }}>
                <strong>Meaning:</strong> Volume can be mounted read-write by a <em>single node</em><br/>
                <strong>Use case:</strong> Most common - databases, single-Pod apps<br/>
                <strong>Supported by:</strong> AWS EBS, Google Persistent Disk, Azure Disk<br/>
                <strong>Note:</strong> Multiple Pods on the <em>same node</em> can share RWO volume
              </p>
            </div>

            <div style={{
              border: '2px solid #0ea5e9',
              borderRadius: '8px',
              padding: '20px',
              background: '#f0f9ff'
            }}>
              <h4 style={{ marginTop: 0, color: '#0ea5e9' }}>ReadOnlyMany (ROX)</h4>
              <p style={{ color: '#1e293b', margin: 0, fontSize: '0.9rem' }}>
                <strong>Meaning:</strong> Volume can be mounted read-only by <em>many nodes</em><br/>
                <strong>Use case:</strong> Shared config files, static content distribution<br/>
                <strong>Supported by:</strong> NFS, CephFS, CSI drivers<br/>
                <strong>Example:</strong> Sharing TLS certificates across all Pods
              </p>
            </div>

            <div style={{
              border: '2px solid #f59e0b',
              borderRadius: '8px',
              padding: '20px',
              background: '#fef3c7'
            }}>
              <h4 style={{ marginTop: 0, color: '#f59e0b' }}>ReadWriteMany (RWX)</h4>
              <p style={{ color: '#1e293b', margin: 0, fontSize: '0.9rem' }}>
                <strong>Meaning:</strong> Volume can be mounted read-write by <em>many nodes</em><br/>
                <strong>Use case:</strong> Shared file storage (user uploads, logs)<br/>
                <strong>Supported by:</strong> NFS, CephFS, Azure Files (not EBS/GCE PD!)<br/>
                <strong>Warning:</strong> Multiple writers = potential data corruption (use locking)
              </p>
            </div>
          </div>

          <div style={{
            background: '#fef2f2',
            border: '2px solid #ef4444',
            borderRadius: '8px',
            padding: '16px',
            margin: '16px 0',
            color: '#1e293b'
          }}>
            <p style={{ margin: 0 }}>
              <strong>⚠️ Common Mistake:</strong> Trying to use AWS EBS with <code>ReadWriteMany</code>. 
              EBS volumes can only attach to one node at a time. Use NFS or a CSI driver like EFS 
              for RWX on AWS.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Common StorageClass Provisioners</h2>

          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#22c55e' }}>kubernetes.io/aws-ebs          # AWS Elastic Block Store</div>
            <div style={{ color: '#22c55e' }}>kubernetes.io/gce-pd           # Google Persistent Disk</div>
            <div style={{ color: '#22c55e' }}>kubernetes.io/azure-disk       # Azure Disk</div>
            <div style={{ color: '#0ea5e9' }}>kubernetes.io/azure-file       # Azure Files (RWX)</div>
            <div style={{ color: '#0ea5e9' }}>kubernetes.io/nfs              # NFS (RWX)</div>
            <div style={{ color: '#f59e0b' }}>ebs.csi.aws.com                # AWS EBS CSI (modern)</div>
            <div style={{ color: '#f59e0b' }}>disk.csi.azure.com             # Azure Disk CSI</div>
            <div style={{ color: '#f59e0b' }}>pd.csi.storage.gke.io          # Google PD CSI</div>
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
              <strong>💡 CSI (Container Storage Interface):</strong> Modern storage plugins use CSI. 
              The old in-tree provisioners (like <code>kubernetes.io/aws-ebs</code>) are deprecated. 
              Always prefer CSI drivers when available.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Expansion & Snapshots</h2>

          <h3>Volume Expansion</h3>
          <p>
            Some StorageClasses support <strong>expanding</strong> volumes after creation:
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
            <div style={{ color: '#64748b' }}># storageclass.yaml</div>
            <div style={{ color: '#f59e0b' }}>apiVersion: storage.k8s.io/v1</div>
            <div style={{ color: '#f59e0b' }}>kind: StorageClass</div>
            <div style={{ color: '#f59e0b' }}>metadata:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: expandable</div>
            <div style={{ color: '#22c55e' }}>allowVolumeExpansion: true  # Enable expansion</div>
            <div style={{ color: '#e2e8f0' }}>provisioner: ebs.csi.aws.com</div>
            <br/>
            <div style={{ color: '#64748b' }}># Expand by editing PVC</div>
            <div style={{ color: '#0ea5e9' }}>kubectl edit pvc db-storage</div>
            <div style={{ color: '#64748b' }}># Change: storage: 50Gi → storage: 100Gi</div>
          </div>

          <h3>Volume Snapshots</h3>
          <p>
            CSI drivers support <strong>snapshots</strong> (point-in-time backups):
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
            <div style={{ color: '#64748b' }}># snapshot.yaml</div>
            <div style={{ color: '#f59e0b' }}>apiVersion: snapshot.storage.k8s.io/v1</div>
            <div style={{ color: '#f59e0b' }}>kind: VolumeSnapshot</div>
            <div style={{ color: '#f59e0b' }}>metadata:</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;name: db-snapshot-20260125</div>
            <div style={{ color: '#f59e0b' }}>spec:</div>
            <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;volumeSnapshotClassName: csi-snapclass</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;source:</div>
            <div style={{ color: '#0ea5e9' }}>&nbsp;&nbsp;&nbsp;&nbsp;persistentVolumeClaimName: db-storage</div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Debugging Storage Issues</h2>

          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># Check PVC status</div>
            <div style={{ color: '#22c55e' }}>kubectl get pvc</div>
            <div style={{ color: '#22c55e' }}>kubectl describe pvc my-pvc</div>
            <br/>
            <div style={{ color: '#64748b' }}># Check PV status</div>
            <div style={{ color: '#0ea5e9' }}>kubectl get pv</div>
            <br/>
            <div style={{ color: '#64748b' }}># Check StorageClass</div>
            <div style={{ color: '#f59e0b' }}>kubectl get storageclass</div>
            <br/>
            <div style={{ color: '#64748b' }}># Events show provisioning errors</div>
            <div style={{ color: '#ef4444' }}>kubectl get events --sort-by='.lastTimestamp'</div>
          </div>

          <h3>Common Storage Errors</h3>
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
                ❌ PVC Stuck in "Pending"
              </h4>
              <p style={{ color: '#1e293b', margin: 0, fontSize: '0.85rem' }}>
                <strong>Cause:</strong> No PV matches the PVC, or dynamic provisioning failed<br/>
                <strong>Fix:</strong> Check <code>kubectl describe pvc</code> for events, verify StorageClass exists
              </p>
            </div>

            <div style={{
              border: '2px solid #ef4444',
              borderRadius: '8px',
              padding: '16px',
              background: '#fef2f2'
            }}>
              <h4 style={{ marginTop: 0, color: '#ef4444', fontSize: '0.95rem' }}>
                ❌ Pod Can't Mount Volume (Multi-Attach Error)
              </h4>
              <p style={{ color: '#1e293b', margin: 0, fontSize: '0.85rem' }}>
                <strong>Cause:</strong> Trying to mount RWO volume on multiple nodes<br/>
                <strong>Fix:</strong> Use RWX access mode (NFS) or ensure Pods are on the same node
              </p>
            </div>

            <div style={{
              border: '2px solid #ef4444',
              borderRadius: '8px',
              padding: '16px',
              background: '#fef2f2'
            }}>
              <h4 style={{ marginTop: 0, color: '#ef4444', fontSize: '0.95rem' }}>
                ❌ "Failed to Provision Volume" (Cloud Error)
              </h4>
              <p style={{ color: '#1e293b', margin: 0, fontSize: '0.85rem' }}>
                <strong>Cause:</strong> Cloud provider API failure, quota exceeded, wrong parameters<br/>
                <strong>Fix:</strong> Check cloud provider logs, verify IAM permissions, check quotas
              </p>
            </div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Key Takeaways</h2>
          <ul>
            <li><strong>PersistentVolumes (PV):</strong> Cluster-level storage resources</li>
            <li><strong>PersistentVolumeClaims (PVC):</strong> Requests for storage (developers create)</li>
            <li><strong>StorageClass:</strong> Defines how to provision storage dynamically</li>
            <li><strong>Static provisioning:</strong> Admin creates PV manually, PVC binds to it</li>
            <li><strong>Dynamic provisioning:</strong> PVC creates PV automatically via StorageClass</li>
            <li><strong>Access modes:</strong> RWO (single node), ROX (read-only many), RWX (multi-node)</li>
            <li><strong>RWO ≠ single Pod</strong> - multiple Pods on the same node can share RWO</li>
            <li><strong>AWS EBS, Azure Disk, GCE PD:</strong> RWO only (single node)</li>
            <li><strong>NFS, CephFS, Azure Files:</strong> Support RWX (multi-node)</li>
            <li><strong>CSI drivers:</strong> Modern storage plugins (use instead of in-tree provisioners)</li>
            <li>PVCs abstract storage details - Pods don't need to know about cloud providers</li>
            <li>Use dynamic provisioning in production (StorageClass + PVC)</li>
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
          <Link href="/module-5-1" legacyBehavior>
            <a style={{
              textDecoration: 'none',
              color: '#94a3b8',
              fontWeight: 600,
              padding: '12px 24px',
              border: '2px solid #475569',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>← Previous: Volumes</a>
          </Link>
          
          <Link href="/module-5-3" legacyBehavior>
            <a style={{
              textDecoration: 'none',
              color: '#fff',
              background: '#9c0606ff',
              fontWeight: 600,
              padding: '12px 24px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>Next: StatefulSets →</a>
          </Link>
        </div>
      </main>
    </div>
  );
}
