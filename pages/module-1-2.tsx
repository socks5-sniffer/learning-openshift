import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import ModuleCompletion from '../components/ModuleCompletion';

export default function Module12() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Module 1.2: Control Plane Components</title>
        <meta name="description" content="Understanding the brains of Kubernetes" />
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
        <h1 className={styles.title}>Module 1.2: Control Plane Components</h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280', marginTop: '-10px' }}>
          The Brains of the Operation
        </p>
        
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/module-1-1" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>← Previous: What Is a Kubernetes Cluster?</Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/learning-modules" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>All Modules</Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/module-1-3" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>Next: Worker Node Components →</Link>
        </div>

        <section className={styles.spotlight}>
          <h2>What Is the Control Plane?</h2>
          <p>
            The <strong>control plane</strong> is the set of components that manage the Kubernetes cluster. 
            It's the decision-maker, the orchestrator, the brain. Every action in Kubernetes—deploying apps, 
            scaling, monitoring, responding to failures—is coordinated by the control plane.
          </p>
          <p>
            The control plane runs on dedicated nodes (in production) and consists of four main components 
            that work together to keep your cluster running smoothly.
          </p>

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
              Everything in Kubernetes—users, worker nodes, even other control plane components—talks 
              to the cluster through the <strong>API Server</strong>. It's the single source of truth 
              and the gateway to the cluster.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>The Four Main Components</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            margin: '20px 0'
          }}>
            {/* API Server */}
            <div style={{
              border: '3px solid #9c0606ff',
              borderRadius: '12px',
              padding: '24px',
              background: '#fff5f5'
            }}>
              <h3 style={{ marginTop: 0, color: '#9c0606ff' }}>🚪 API Server</h3>
              <p style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#1e293b' }}>The Front Door</p>
              <p style={{ color: '#1e293b', fontSize: '0.9rem' }}>
                The main entry point to the cluster. All requests go through here.
              </p>
            </div>

            {/* etcd */}
            <div style={{
              border: '3px solid #f59e0b',
              borderRadius: '12px',
              padding: '24px',
              background: '#fffbeb'
            }}>
              <h3 style={{ marginTop: 0, color: '#f59e0b' }}>🗄️ etcd</h3>
              <p style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#1e293b' }}>The Database</p>
              <p style={{ color: '#1e293b', fontSize: '0.9rem' }}>
                Stores all cluster data. Where hope and fear are stored.
              </p>
            </div>

            {/* Scheduler */}
            <div style={{
              border: '3px solid #0ea5e9',
              borderRadius: '12px',
              padding: '24px',
              background: '#f0f9ff'
            }}>
              <h3 style={{ marginTop: 0, color: '#0ea5e9' }}>📋 Scheduler</h3>
              <p style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#1e293b' }}>The Matchmaker</p>
              <p style={{ color: '#1e293b', fontSize: '0.9rem' }}>
                Assigns new pods to worker nodes based on resources.
              </p>
            </div>

            {/* Controller Manager */}
            <div style={{
              border: '3px solid #22c55e',
              borderRadius: '12px',
              padding: '24px',
              background: '#f0fdf4'
            }}>
              <h3 style={{ marginTop: 0, color: '#22c55e' }}>⚙️ Controller Manager</h3>
              <p style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#1e293b' }}>The Caretaker</p>
              <p style={{ color: '#1e293b', fontSize: '0.9rem' }}>
                Monitors cluster state and makes corrections when needed.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>1. API Server (kube-apiserver)</h2>
          <h3>The Front Door</h3>
          <p>
            The <strong>API Server</strong> is the central hub of Kubernetes. It's the only component 
            that directly talks to etcd, and it's the only way to interact with the cluster. Every 
            command you run (<code>kubectl get pods</code>, <code>kubectl apply</code>) is a request 
            to the API Server.
          </p>

          <h3>What It Does</h3>
          <ul>
            <li><strong>Exposes the Kubernetes API:</strong> RESTful HTTP/JSON interface</li>
            <li><strong>Authenticates and authorizes requests:</strong> Who are you? What can you do?</li>
            <li><strong>Validates requests:</strong> Does this YAML make sense?</li>
            <li><strong>Processes API operations:</strong> CRUD (Create, Read, Update, Delete) for cluster objects</li>
            <li><strong>Communicates with etcd:</strong> Persists cluster state</li>
            <li><strong>Serves as the gateway:</strong> All cluster components communicate through it</li>
          </ul>

          <h3>Example: Creating a Deployment</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            overflowX: 'auto',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}>// You run:</div>
            <div style={{ color: '#22c55e' }}>kubectl create deployment nginx --image=nginx</div>
            <br/>
            <div style={{ color: '#64748b' }}>// What happens:</div>
            <div style={{ color: '#e2e8f0' }}>1. kubectl sends HTTP POST to API Server</div>
            <div style={{ color: '#e2e8f0' }}>2. API Server authenticates you</div>
            <div style={{ color: '#e2e8f0' }}>3. API Server validates the request</div>
            <div style={{ color: '#e2e8f0' }}>4. API Server writes to etcd</div>
            <div style={{ color: '#e2e8f0' }}>5. API Server notifies other components</div>
          </div>

          <div style={{
            background: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#b45309' }}>🔑 Key Point</h3>
            <p style={{ marginBottom: 0 }}>
              The API Server doesn't <em>do</em> the work—it coordinates. It doesn't run your 
              containers or schedule them. It just receives requests, validates them, stores them 
              in etcd, and lets other components know what needs to happen.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>2. etcd</h2>
          <h3>Where Hope and Fear Are Stored</h3>
          <p>
            <strong>etcd</strong> is a distributed key-value store that holds all cluster data. 
            It's the single source of truth for the entire cluster state. If etcd goes down or 
            loses data, your cluster has amnesia—it forgets what should be running and where.
          </p>

          <h3>What It Stores</h3>
          <ul>
            <li>All cluster configuration</li>
            <li>What pods should be running and where</li>
            <li>Network configuration</li>
            <li>Secrets and ConfigMaps</li>
            <li>Service definitions</li>
            <li>Resource quotas and policies</li>
          </ul>

          <h3>Why It's Critical</h3>
          <p>
            Losing etcd data is catastrophic. It's like your cluster getting Alzheimer's. Kubernetes 
            won't know what it's supposed to do. That's why in production:
          </p>
          <ul>
            <li>etcd runs on multiple nodes (3 or 5 for redundancy)</li>
            <li>Regular backups are essential</li>
            <li>It's isolated from user workloads</li>
            <li>It uses strong consistency guarantees (via Raft consensus)</li>
          </ul>

          <div style={{
            background: '#fef2f2',
            border: '2px solid #ef4444',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#b91c1c' }}>🚨 Warning</h3>
            <p style={{ marginBottom: 0 }}>
              <strong>BACK UP ETCD.</strong> This cannot be stressed enough. If you lose etcd 
              without backups, your cluster is gone. All configuration, all state—erased. Many 
              managed Kubernetes services (EKS, GKE, AKS) handle etcd backups for you, but if 
              you're self-hosting, this is on you.
            </p>
          </div>

          <h3>Fun Fact</h3>
          <p>
            etcd is pronounced "et-see-dee" (not "etched"). It stands for "distributed etc directory"—a 
            reference to the Unix <code>/etc</code> directory where configuration files live.
          </p>
        </section>

        <section className={styles.spotlight}>
          <h2>3. Scheduler (kube-scheduler)</h2>
          <h3>The Matchmaker</h3>
          <p>
            The <strong>Scheduler</strong> is responsible for assigning newly created pods to worker nodes. 
            When a pod needs to run, the scheduler looks at available nodes and decides the best fit.
          </p>

          <h3>How It Works</h3>
          <ol>
            <li><strong>Watch for unscheduled pods:</strong> The API Server notifies the scheduler when a new pod is created without a node assignment</li>
            <li><strong>Filter nodes:</strong> Eliminate nodes that can't run the pod (not enough CPU, wrong OS, taints, etc.)</li>
            <li><strong>Score nodes:</strong> Rank remaining nodes based on priorities (spread pods evenly, keep related pods together, etc.)</li>
            <li><strong>Assign pod to node:</strong> Updates the pod's specification with the chosen node</li>
            <li><strong>Notify API Server:</strong> API Server writes the update to etcd</li>
          </ol>

          <h3>What the Scheduler Considers</h3>
          <ul>
            <li><strong>Resource requirements:</strong> Does the node have enough CPU and memory?</li>
            <li><strong>Node selectors:</strong> Does the pod require specific node labels?</li>
            <li><strong>Affinity/Anti-affinity:</strong> Should pods be together or apart?</li>
            <li><strong>Taints and tolerations:</strong> Is the node willing to accept this pod?</li>
            <li><strong>Data locality:</strong> Is persistent storage closer to certain nodes?</li>
            <li><strong>Resource balance:</strong> Spread load evenly across nodes</li>
          </ul>

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#0369a1' }}>💡 Important Note</h3>
            <p style={{ marginBottom: 0 }}>
              The Scheduler only <strong>assigns</strong> pods to nodes. It doesn't actually start 
              them. That's the job of the <strong>kubelet</strong> on the worker node (covered in 
              the next module). The scheduler is purely a decision-maker.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>4. Controller Manager (kube-controller-manager)</h2>
          <h3>The Caretaker</h3>
          <p>
            The <strong>Controller Manager</strong> is actually a collection of controllers that monitor 
            the cluster state and make corrections to move the current state toward the desired state. 
            It's the component that makes Kubernetes "self-healing."
          </p>

          <h3>What Are Controllers?</h3>
          <p>
            Controllers are control loops that watch the cluster state through the API Server and make 
            changes when the current state doesn't match the desired state. Think of them as robot 
            administrators that never sleep.
          </p>

          <h3>Common Controllers</h3>
          
          <div style={{ marginLeft: '20px' }}>
            <h4 style={{ color: '#9c0606ff' }}>Node Controller</h4>
            <ul>
              <li>Monitors node health</li>
              <li>Marks nodes as unhealthy if they stop responding</li>
              <li>Evicts pods from failed nodes</li>
            </ul>

            <h4 style={{ color: '#9c0606ff' }}>Replication Controller</h4>
            <ul>
              <li>Ensures the correct number of pod replicas are running</li>
              <li>If a pod dies, it creates a new one</li>
              <li>If too many are running, it deletes extras</li>
            </ul>

            <h4 style={{ color: '#9c0606ff' }}>Endpoints Controller</h4>
            <ul>
              <li>Populates endpoint objects (links Services to Pods)</li>
              <li>Updates endpoints when pods come and go</li>
            </ul>

            <h4 style={{ color: '#9c0606ff' }}>Service Account & Token Controllers</h4>
            <ul>
              <li>Creates default accounts and API access tokens for new namespaces</li>
            </ul>
          </div>

          <h3>The Control Loop Pattern</h3>
          <p>All controllers follow the same basic pattern:</p>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#22c55e' }}>while (true) {'{'}</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;desired_state = get_desired_state()</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;current_state = observe_current_state()</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;</div>
            <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;if (current_state != desired_state) {'{'}</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;&nbsp;&nbsp;make_changes_to_match_desired_state()</div>
            <div style={{ color: '#f59e0b' }}>&nbsp;&nbsp;{'}'}</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;</div>
            <div style={{ color: '#e2e8f0' }}>&nbsp;&nbsp;sleep(interval)</div>
            <div style={{ color: '#22c55e' }}>{'}'}</div>
          </div>

          <div style={{
            background: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#15803d' }}>✅ Why This Matters</h3>
            <p>
              Controllers are what make Kubernetes <strong>declarative</strong>. You don't tell 
              Kubernetes <em>"start this container."</em> You tell it <em>"ensure 3 replicas are 
              always running."</em> Controllers continuously work to make reality match your declaration.
            </p>
            <p style={{ marginBottom: 0 }}>
              This is why Kubernetes is self-healing. A pod crashes? A controller notices and starts 
              a new one. A node dies? A controller reschedules pods elsewhere. You declare intent; 
              controllers make it happen.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>How They Work Together</h2>
          <p>Let's trace what happens when you deploy an application:</p>

          <div style={{
            background: '#f9fafb',
            border: '2px solid #475569',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#9c0606ff' }}>Scenario: kubectl create deployment nginx --image=nginx --replicas=3</h3>
            
            <ol style={{ lineHeight: '1.8' }}>
              <li><strong>kubectl</strong> sends the request to the <strong>API Server</strong></li>
              <li><strong>API Server</strong> validates and writes to <strong>etcd</strong></li>
              <li><strong>Deployment Controller</strong> notices a new Deployment and creates a ReplicaSet</li>
              <li><strong>ReplicaSet Controller</strong> notices the ReplicaSet needs 3 pods and creates them</li>
              <li><strong>Scheduler</strong> watches for unscheduled pods and assigns each to a node</li>
              <li><strong>API Server</strong> updates etcd with pod-to-node assignments</li>
              <li><strong>Kubelet</strong> (on worker nodes) notices pods assigned to its node and starts containers</li>
            </ol>
          </div>

          <p>
            Notice how everything flows through the API Server? That's the Kubernetes architecture 
            philosophy: centralized communication, decentralized execution.
          </p>
        </section>

        <section className={styles.spotlight}>
          <h2>Key Takeaways</h2>
          <ul>
            <li><strong>API Server</strong> is the front door—everything goes through it</li>
            <li><strong>etcd</strong> is the database—it stores all cluster state (back it up!)</li>
            <li><strong>Scheduler</strong> assigns pods to nodes based on resources and constraints</li>
            <li><strong>Controller Manager</strong> runs controllers that maintain desired state</li>
            <li>Control plane components don't run workloads—they orchestrate worker nodes</li>
            <li>Everything talks to the API Server, even Kubernetes itself</li>
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
          <Link href="/module-1-1" style={{
              textDecoration: 'none',
              color: '#94a3b8',
              fontWeight: 600,
              padding: '12px 24px',
              border: '2px solid #475569',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block',
              textAlign: 'center'
            }}>← Previous: What Is a Kubernetes Cluster?</Link>
          
          <Link href="/module-1-3" style={{
              textDecoration: 'none',
              color: '#fff',
              background: '#9c0606ff',
              fontWeight: 600,
              padding: '12px 24px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block',
              textAlign: 'center'
            }}>Next: Worker Node Components →</Link>
        </div>
        <ModuleCompletion moduleId="1-2" />

      </main>
    </div>
  );
}
