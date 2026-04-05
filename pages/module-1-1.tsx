import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Module11() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Module 1.1: What Is a Kubernetes Cluster?</title>
        <meta name="description" content="Understanding Kubernetes cluster architecture" />
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
        <h1 className={styles.title}>Module 1.1: What Is a Kubernetes Cluster?</h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280', marginTop: '-10px' }}>
          Understanding the Foundation
        </p>
        
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/module-0-2" legacyBehavior>
            <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              ← Previous: Containers 101
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/learning-modules" legacyBehavior>
            <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              All Modules
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/module-1-2" legacyBehavior>
            <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              Next: kubectl Basics →
            </a>
          </Link>
        </div>

        <section className={styles.spotlight}>
          <h2>What Is a Cluster?</h2>
          <p>
            A <strong>Kubernetes cluster</strong> is a collection of machines (physical or virtual) that work 
            together to run containerized applications. Think of it as a team of computers pooling their 
            resources—CPU, memory, storage—to act as one unified system.
          </p>
          <p>
            When you deploy an application to Kubernetes, you don't specify which machine it should run on. 
            You simply say "I want this app to run," and Kubernetes decides where to place it based on 
            available resources. If a machine fails, Kubernetes automatically moves your application to 
            a healthy machine.
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
              A cluster provides <strong>abstraction</strong>. You don't manage individual servers—you 
              manage a pool of resources. This is the core shift from traditional infrastructure to 
              cloud-native architecture.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Nodes: The Building Blocks</h2>
          <p>
            Every machine in a Kubernetes cluster is called a <strong>node</strong>. Nodes are the workers 
            that actually run your containers. A cluster can have:
          </p>
          <ul>
            <li><strong>One node</strong> (for learning/testing—not for production)</li>
            <li><strong>Dozens of nodes</strong> (typical for small to medium workloads)</li>
            <li><strong>Thousands of nodes</strong> (for companies like Google, Netflix, Spotify)</li>
          </ul>

          <h3>Two Types of Nodes</h3>
          <p>
            Kubernetes clusters have two kinds of nodes, each with very different responsibilities:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            margin: '20px 0'
          }}>
            {/* Control Plane Node */}
            <div style={{
              border: '2px solid #9c0606ff',
              borderRadius: '12px',
              padding: '24px',
              background: '#fef2f2'
            }}>
              <h4 style={{ marginTop: 0, color: '#9c0606ff' }}>🧠 Control Plane Nodes</h4>
              <p style={{ color: '#1e293b' }}><strong>The brain of the cluster</strong></p>
              <ul style={{ color: '#1e293b' }}>
                <li>Make decisions about the cluster</li>
                <li>Schedule workloads</li>
                <li>Detect and respond to events</li>
                <li>Store cluster state</li>
              </ul>
              <p style={{ fontSize: '0.9rem', color: '#1e293b' }}>
                <em>Think of this as management—it tells others what to do but doesn't do the heavy lifting itself.</em>
              </p>
            </div>

            {/* Worker Node */}
            <div style={{
              border: '2px solid #0ea5e9',
              borderRadius: '12px',
              padding: '24px',
              background: '#f0f9ff'
            }}>
              <h4 style={{ marginTop: 0, color: '#0ea5e9' }}>💪 Worker Nodes</h4>
              <p style={{ color: '#1e293b' }}><strong>The muscle of the cluster</strong></p>
              <ul style={{ color: '#1e293b' }}>
                <li>Run your application containers</li>
                <li>Provide CPU, memory, and storage</li>
                <li>Report status to control plane</li>
                <li>Execute instructions from control plane</li>
              </ul>
              <p style={{ fontSize: '0.9rem', color: '#1e293b' }}>
                <em>These are the workhorses—they run your actual applications and do the computing.</em>
              </p>
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
            <h3 style={{ marginTop: 0, color: '#b45309' }}>🔑 Analogy</h3>
            <p style={{ marginBottom: 0 }}>
              <strong>Control Plane = Project Manager</strong><br/>
              Decides who does what, tracks progress, handles issues, but doesn't write code.<br/><br/>
              <strong>Worker Nodes = Developers</strong><br/>
              Actually build the product, execute tasks assigned by the project manager.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Control Plane vs Worker Nodes: A Deeper Look</h2>
          
          <h3>Control Plane Responsibilities</h3>
          <p>
            The control plane makes all the "global" decisions about the cluster. It's responsible for:
          </p>
          <ul>
            <li><strong>Scheduling:</strong> Deciding which worker node should run a new container</li>
            <li><strong>Maintaining desired state:</strong> If you say "run 3 copies of this app," it ensures 3 are always running</li>
            <li><strong>Responding to failures:</strong> If a node dies, it reschedules containers elsewhere</li>
            <li><strong>Exposing the API:</strong> All interactions with Kubernetes go through the control plane</li>
            <li><strong>Storing configuration:</strong> It keeps track of what should be running and where</li>
          </ul>

          <h3>Worker Node Responsibilities</h3>
          <p>
            Worker nodes are simpler—they follow orders from the control plane:
          </p>
          <ul>
            <li><strong>Run containers:</strong> Start, stop, and restart containers as instructed</li>
            <li><strong>Monitor health:</strong> Check if containers are running and report back</li>
            <li><strong>Provide resources:</strong> CPU, memory, disk space for containers</li>
            <li><strong>Network connectivity:</strong> Allow containers to communicate with each other and the outside world</li>
          </ul>

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#0369a1' }}>💡 Important Distinction</h3>
            <p style={{ marginBottom: 0 }}>
              In production clusters, control plane nodes typically <strong>don't</strong> run your 
              application workloads. They're dedicated to cluster management. You want them focused 
              on keeping the cluster healthy, not competing for resources with your apps.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>A Cluster as a Promise, Not a Machine</h2>
          <p>
            This is the philosophical shift that makes Kubernetes powerful: you stop thinking about 
            individual machines and start thinking about the cluster as a single, unified system.
          </p>

          <h3>The Old Way (Pets)</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}>// Traditional deployment</div>
            <div style={{ color: '#ef4444' }}>ssh web-server-01</div>
            <div style={{ color: '#ef4444' }}>sudo systemctl restart nginx</div>
            <div style={{ color: '#64748b' }}>// Check if it's running</div>
            <div style={{ color: '#ef4444' }}>curl http://web-server-01/health</div>
            <div style={{ color: '#64748b' }}>// If it fails, manually fix it or switch to backup</div>
          </div>
          <p style={{ color: '#1e293b' }}>
            You're managing specific machines. You know their names, their IPs, their quirks. 
            When something breaks, you SSH in and fix it.
          </p>

          <h3>The Kubernetes Way (Cattle)</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}>// Kubernetes deployment</div>
            <div style={{ color: '#22c55e' }}>kubectl apply -f deployment.yaml</div>
            <div style={{ color: '#64748b' }}>// That's it. Kubernetes handles the rest.</div>
            <div style={{ color: '#64748b' }}>// If something fails, Kubernetes automatically replaces it.</div>
          </div>
          <p style={{ color: '#1e293b' }}>
            You describe what you want (3 copies of nginx), and Kubernetes makes it happen. 
            You don't care which nodes they run on. If a container dies, Kubernetes starts a new one. 
            If a node dies, Kubernetes moves containers to healthy nodes.
          </p>

          <h3>The Promise</h3>
          <p>
            When you deploy to Kubernetes, you're making a <strong>declaration</strong>:
          </p>
          <div style={{
            background: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <p style={{ fontSize: '1.1rem', marginBottom: 0 }}>
              <em>"Dear Kubernetes, please ensure that 3 replicas of my app are always running, 
              using the image <code>myapp:v1.2</code>, with 500MB of memory each."</em>
            </p>
          </div>
          <p>
            Kubernetes responds: <em>"I promise to maintain that state, no matter what happens."</em>
          </p>
          <ul>
            <li>A container crashes? Kubernetes restarts it.</li>
            <li>A node goes down? Kubernetes moves containers to other nodes.</li>
            <li>Traffic increases? Kubernetes can scale up (if you configure autoscaling).</li>
          </ul>

          <div style={{
            background: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#b45309' }}>⚠️ Reality Check</h3>
            <p style={{ marginBottom: 0 }}>
              This "promise" isn't magic. If your cluster is out of resources (CPU, memory, disk), 
              Kubernetes can't conjure more. If all your nodes fail simultaneously, your apps go down. 
              Kubernetes is resilient, but it's not omnipotent. You still need to design for failure 
              and properly resource your cluster.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Visualizing a Cluster</h2>
          <p>Here's a simple representation of a Kubernetes cluster:</p>

          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '24px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            overflowX: 'auto',
            margin: '20px 0'
          }}>
            <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>┌─────────────────────────────────────────────────────┐</div>
            <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>│          KUBERNETES CLUSTER                         │</div>
            <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>└─────────────────────────────────────────────────────┘</div>
            <br/>
            <div style={{ color: '#ef4444' }}>┌─── CONTROL PLANE ───────────────────────┐</div>
            <div style={{ color: '#ef4444' }}>│  • API Server (main entry point)        │</div>
            <div style={{ color: '#ef4444' }}>│  • etcd (cluster state database)         │</div>
            <div style={{ color: '#ef4444' }}>│  • Scheduler (assigns pods to nodes)     │</div>
            <div style={{ color: '#ef4444' }}>│  • Controller Manager (maintains state)  │</div>
            <div style={{ color: '#ef4444' }}>└──────────────────────────────────────────┘</div>
            <div style={{ color: '#64748b' }}>                    │</div>
            <div style={{ color: '#64748b' }}>                    │ (manages)</div>
            <div style={{ color: '#64748b' }}>                    ▼</div>
            <div style={{ color: '#0ea5e9' }}>┌─── WORKER NODES ─────────────────────────┐</div>
            <div style={{ color: '#0ea5e9' }}>│                                           │</div>
            <div style={{ color: '#0ea5e9' }}>│  Node 1         Node 2         Node 3    │</div>
            <div style={{ color: '#0ea5e9' }}>│  [Pod] [Pod]    [Pod] [Pod]    [Pod]     │</div>
            <div style={{ color: '#0ea5e9' }}>│  [Pod]          [Pod]          [Pod]     │</div>
            <div style={{ color: '#0ea5e9' }}>│                                           │</div>
            <div style={{ color: '#0ea5e9' }}>│  (Your applications run here)             │</div>
            <div style={{ color: '#0ea5e9' }}>└───────────────────────────────────────────┘</div>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Cluster Size Considerations</h2>
          
          <h3>Small Cluster (3-5 nodes)</h3>
          <ul>
            <li>Good for: Development, small applications, learning</li>
            <li>Usually 1 control plane node, 2-4 worker nodes</li>
            <li>Lower cost, easier to manage</li>
            <li>Limited redundancy</li>
          </ul>

          <h3>Medium Cluster (10-50 nodes)</h3>
          <ul>
            <li>Good for: Production workloads, medium-scale applications</li>
            <li>Usually 3 control plane nodes (for high availability)</li>
            <li>Better fault tolerance</li>
            <li>Can handle significant traffic</li>
          </ul>

          <h3>Large Cluster (100+ nodes)</h3>
          <ul>
            <li>Good for: Large-scale production, high-traffic applications</li>
            <li>Multiple control plane nodes across availability zones</li>
            <li>Complex networking and monitoring requirements</li>
            <li>Requires dedicated platform team</li>
          </ul>

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#0369a1' }}>💡 Pro Tip</h3>
            <p style={{ marginBottom: 0 }}>
              Start small. You can always add more nodes to a cluster later. It's easier to scale 
              up than to over-provision and waste money on idle resources. Managed Kubernetes 
              services (EKS, GKE, AKS, OpenShift) make it easy to add or remove nodes dynamically.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Key Takeaways</h2>
          <ul>
            <li>A <strong>cluster</strong> is a group of machines working together as one system</li>
            <li><strong>Nodes</strong> are the individual machines in the cluster</li>
            <li><strong>Control plane nodes</strong> manage the cluster; <strong>worker nodes</strong> run your applications</li>
            <li>You declare desired state; Kubernetes maintains it</li>
            <li>The cluster is an abstraction—you manage resources, not individual machines</li>
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
          <Link href="/module-0-2" legacyBehavior>
            <a style={{
              textDecoration: 'none',
              color: '#4b5563',
              fontWeight: 600,
              padding: '12px 24px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>← Previous: Containers 101</a>
          </Link>
          
          <Link href="/module-1-2" legacyBehavior>
            <a style={{
              textDecoration: 'none',
              color: '#fff',
              background: '#9c0606ff',
              fontWeight: 600,
              padding: '12px 24px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>Next: Control Plane Components →</a>
          </Link>
        </div>
      </main>
    </div>
  );
}
