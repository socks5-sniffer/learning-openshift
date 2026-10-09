import styles from '../styles/Home.module.css';
import moduleStyles from '../styles/Module.module.css';
import ModuleShell from '../components/module/ModuleShell';
import Callout from '../components/module/Callout';
import TermBox from '../components/module/TermBox';

export default function Module13() {
  return (
    <ModuleShell id="1-3" subtitle="Where Your Applications Actually Run">
      <section className={styles.spotlight}>
        <h2>What Are Worker Nodes?</h2>
        <p>
          <strong>Worker nodes</strong> are the machines that run your containerized applications.
          While the control plane makes decisions, worker nodes execute them. They're the muscle
          of the cluster—providing CPU, memory, storage, and networking for your workloads.
        </p>
        <p>
          Each worker node runs a small set of components that allow it to communicate with the
          control plane, run containers, and handle networking. These components are simple but
          critical—they're the local agents that make Kubernetes orchestration possible.
        </p>

        <Callout variant="info" icon="💡" title="Key Concept">
          <p>
            Worker nodes are stateless and replaceable. If a worker node dies, the control plane
            reschedules its pods elsewhere. This is the "cattle, not pets" philosophy in action—nodes
            are interchangeable and disposable.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>The Three Main Components</h2>

        <div className={moduleStyles.grid}>
          <Callout variant="danger" icon="🤖" title="kubelet">
            <p><strong>The Node Agent</strong></p>
            <p>Runs on every node. Talks to the API Server and manages containers.</p>
          </Callout>

          <Callout variant="info" icon="📦" title="Container Runtime">
            <p><strong>The Engine</strong></p>
            <p>Actually starts and stops containers (Docker, containerd, CRI-O).</p>
          </Callout>

          <Callout variant="success" icon="🌐" title="kube-proxy">
            <p><strong>The Network Plumber</strong></p>
            <p>Manages network rules for pod communication and load balancing.</p>
          </Callout>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>1. kubelet</h2>
        <h3>The Node Agent</h3>
        <p>
          The <strong>kubelet</strong> is the primary node agent that runs on every worker node.
          It's the local representative of the Kubernetes control plane—the component that actually
          executes instructions on the node.
        </p>

        <h3>What It Does</h3>
        <ul>
          <li><strong>Watches the API Server:</strong> Constantly checks for pods assigned to its node</li>
          <li><strong>Starts containers:</strong> Uses the container runtime to run pod containers</li>
          <li><strong>Monitors pod health:</strong> Runs health checks (liveness, readiness probes)</li>
          <li><strong>Reports status:</strong> Sends pod and node status back to the API Server</li>
          <li><strong>Mounts volumes:</strong> Attaches storage to pods as needed</li>
          <li><strong>Executes lifecycle hooks:</strong> Runs pre-start and pre-stop commands</li>
        </ul>

        <h3>How It Works</h3>
        <Callout variant="neutral" title="The kubelet's Control Loop">
          <ol style={{ lineHeight: '1.8' }}>
            <li>Query the API Server: "Are there any pods I should be running?"</li>
            <li>Compare desired state to current state on this node</li>
            <li>If a new pod is assigned:
              <ul>
                <li>Pull container images (if not cached)</li>
                <li>Create containers via the container runtime</li>
                <li>Mount volumes</li>
                <li>Start containers</li>
              </ul>
            </li>
            <li>If a pod should be removed: Stop and delete containers</li>
            <li>Run health checks on running pods</li>
            <li>Report pod status back to API Server</li>
            <li>Repeat every few seconds</li>
          </ol>
        </Callout>

        <Callout variant="info" icon="💡" title="Important Note">
          <p>
            The kubelet <strong>only manages pods explicitly assigned to its node</strong>. It doesn't
            make scheduling decisions—that's the scheduler's job. The kubelet is purely an executor,
            faithfully running whatever the control plane tells it to run.
          </p>
        </Callout>

        <h3>Health Checking</h3>
        <p>The kubelet performs health checks using probes defined in pod specifications:</p>
        <ul>
          <li><strong>Liveness Probe:</strong> Is the container alive? If not, restart it.</li>
          <li><strong>Readiness Probe:</strong> Is the container ready to serve traffic? If not, remove it from service endpoints.</li>
          <li><strong>Startup Probe:</strong> Has the container fully started? Give slow-starting apps more time.</li>
        </ul>

        <p>These probes can be:</p>
        <ul>
          <li><strong>HTTP requests:</strong> GET /healthz (returns 200 = healthy)</li>
          <li><strong>TCP socket:</strong> Can I connect to this port?</li>
          <li><strong>Exec commands:</strong> Run a command inside the container (exit 0 = healthy)</li>
        </ul>
      </section>

      <section className={styles.spotlight}>
        <h2>2. Container Runtime</h2>
        <h3>The Engine That Runs Containers</h3>
        <p>
          The <strong>container runtime</strong> is the low-level software that actually starts and
          stops containers. Kubernetes doesn't run containers itself—it delegates that to the container
          runtime via a standard interface called the <strong>Container Runtime Interface (CRI)</strong>.
        </p>

        <h3>Common Container Runtimes</h3>

        <div style={{ marginLeft: '20px' }}>
          <h4 style={{ color: 'var(--color-info)' }}>containerd</h4>
          <ul>
            <li>Industry standard, used by Docker</li>
            <li>Lightweight and fast</li>
            <li>Default in many Kubernetes distributions</li>
            <li>Graduated CNCF project</li>
          </ul>

          <h4 style={{ color: 'var(--color-info)' }}>CRI-O</h4>
          <ul>
            <li>Built specifically for Kubernetes</li>
            <li>Lightweight, OCI-compliant</li>
            <li>Popular in OpenShift</li>
          </ul>

          <h4 style={{ color: 'var(--color-info)' }}>Docker (deprecated)</h4>
          <ul>
            <li>Was the original default</li>
            <li>Kubernetes removed direct Docker support in 1.24</li>
            <li>Docker images still work (they're OCI images)</li>
            <li>containerd is the replacement (it's what Docker uses underneath)</li>
          </ul>
        </div>

        <Callout variant="warning" icon="⚠️" title="Wait, Kubernetes Doesn't Use Docker?">
          <p>
            Not anymore (as of Kubernetes 1.24). But don't panic—this doesn't affect your container
            images. Docker images are just OCI (Open Container Initiative) images, and all container
            runtimes support them.
          </p>
          <p>
            What changed: Kubernetes removed the "dockershim" (a compatibility layer for Docker).
            Now it talks directly to containerd or CRI-O, which are more lightweight and purpose-built
            for Kubernetes. Your workflows and images remain the same.
          </p>
        </Callout>

        <h3>The CRI (Container Runtime Interface)</h3>
        <p>
          The CRI is a plugin interface that allows Kubernetes to use different container runtimes
          without changing code. The kubelet talks to the container runtime via CRI using gRPC.
        </p>
        <p>This abstraction means:</p>
        <ul>
          <li>You can swap container runtimes without changing Kubernetes</li>
          <li>New runtimes can be added by implementing the CRI spec</li>
          <li>Kubernetes stays runtime-agnostic</li>
        </ul>
      </section>

      <section className={styles.spotlight}>
        <h2>3. kube-proxy</h2>
        <h3>The Network Plumber</h3>
        <p>
          <strong>kube-proxy</strong> is a network component that runs on every node. It maintains
          network rules that allow communication between pods, and from external clients to services
          inside the cluster.
        </p>

        <h3>What It Does</h3>
        <ul>
          <li><strong>Implements Services:</strong> Makes Kubernetes Services work by routing traffic to pods</li>
          <li><strong>Load balancing:</strong> Distributes traffic across multiple pod replicas</li>
          <li><strong>Maintains network rules:</strong> Updates iptables/IPVS rules on the node</li>
          <li><strong>Watches the API Server:</strong> Updates rules when Services or Endpoints change</li>
        </ul>

        <h3>How It Works</h3>
        <p>
          When you create a Kubernetes Service, you're essentially creating a virtual IP address
          that load-balances traffic to a set of pods. kube-proxy is what makes that happen.
        </p>

        <Callout variant="neutral" title="Example: Service Traffic Flow">
          <ol style={{ lineHeight: '1.8' }}>
            <li>You create a Service that points to 3 pods</li>
            <li>The Service gets a ClusterIP (e.g., 10.96.0.100)</li>
            <li>kube-proxy watches for this Service via the API Server</li>
            <li>kube-proxy updates iptables/IPVS rules on the node:
              <TermBox copyable={false}>
                <div style={{ color: '#64748b' }}>// Simplified rule:</div>
                <div style={{ color: '#e2e8f0' }}>If destination = 10.96.0.100:80</div>
                <div style={{ color: '#e2e8f0' }}>Then forward to one of:</div>
                <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;- pod-1 (192.168.1.10:8080)</div>
                <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;- pod-2 (192.168.1.11:8080)</div>
                <div style={{ color: '#22c55e' }}>&nbsp;&nbsp;- pod-3 (192.168.1.12:8080)</div>
              </TermBox>
            </li>
            <li>When a pod tries to connect to 10.96.0.100, the kernel routes it to one of the backend pods</li>
          </ol>
        </Callout>

        <h3>Modes of Operation</h3>
        <p>kube-proxy can operate in different modes:</p>

        <ul>
          <li>
            <strong>iptables mode (default):</strong> Uses Linux iptables rules for routing
            <ul>
              <li>Mature and stable</li>
              <li>Can become slow with thousands of Services</li>
            </ul>
          </li>
          <li>
            <strong>IPVS mode:</strong> Uses IP Virtual Server for load balancing
            <ul>
              <li>Better performance at scale</li>
              <li>More sophisticated load balancing algorithms</li>
            </ul>
          </li>
          <li>
            <strong>Userspace mode (legacy):</strong> Rarely used anymore
          </li>
        </ul>

        <Callout variant="info" icon="💡" title="Key Point">
          <p>
            kube-proxy doesn't actually proxy traffic (despite its name). It programs the kernel's
            networking layer to do the routing. Traffic flows directly from client to pod via kernel
            rules, not through kube-proxy as an intermediary. This makes it much faster.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>How Worker Node Components Work Together</h2>
        <p>Let's see these components in action when a new pod is scheduled:</p>

        <Callout variant="neutral" title="Scenario: Control Plane Schedules a Pod to Worker Node 2">
          <ol style={{ lineHeight: '1.8' }}>
            <li><strong>Scheduler</strong> assigns pod to node-2, updates API Server</li>
            <li><strong>kubelet on node-2</strong> notices the new pod assignment
              <ul>
                <li>Reads pod specification</li>
                <li>Determines what containers need to run</li>
              </ul>
            </li>
            <li><strong>kubelet</strong> calls the <strong>container runtime</strong>
              <ul>
                <li>"Pull image nginx:1.21"</li>
                <li>"Create container with these specs"</li>
                <li>"Start the container"</li>
              </ul>
            </li>
            <li><strong>Container runtime</strong> (containerd) does the work
              <ul>
                <li>Pulls image from registry</li>
                <li>Creates container</li>
                <li>Starts container process</li>
              </ul>
            </li>
            <li><strong>kubelet</strong> mounts volumes, sets up networking</li>
            <li><strong>kubelet</strong> starts health checks</li>
            <li><strong>kubelet</strong> reports status to API Server: "Pod is running"</li>
            <li><strong>kube-proxy</strong> (if pod is part of a Service) updates network rules to include this pod as a backend</li>
          </ol>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>The Full Picture: Control Plane + Worker Nodes</h2>
        <p>Now we can see how everything connects:</p>

        <TermBox copyable={false}>
          <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>┌────────────────────────────────────────────────┐</div>
          <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>│         KUBERNETES CLUSTER                     │</div>
          <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>└────────────────────────────────────────────────┘</div>
          <br />
          <div style={{ color: '#ef4444' }}>╔═══════════ CONTROL PLANE ═══════════╗</div>
          <div style={{ color: '#ef4444' }}>║  ┌─────────────┐  ┌──────────────┐  ║</div>
          <div style={{ color: '#ef4444' }}>║  │ API Server  │  │ Scheduler    │  ║</div>
          <div style={{ color: '#ef4444' }}>║  └─────────────┘  └──────────────┘  ║</div>
          <div style={{ color: '#ef4444' }}>║  ┌─────────────┐  ┌──────────────┐  ║</div>
          <div style={{ color: '#ef4444' }}>║  │ etcd        │  │ Controller   │  ║</div>
          <div style={{ color: '#ef4444' }}>║  │ (database)  │  │ Manager      │  ║</div>
          <div style={{ color: '#ef4444' }}>║  └─────────────┘  └──────────────┘  ║</div>
          <div style={{ color: '#ef4444' }}>╚═════════════════════════════════════╝</div>
          <div style={{ color: '#64748b' }}>            │ │ │</div>
          <div style={{ color: '#64748b' }}>            │ │ │ (communication via API Server)</div>
          <div style={{ color: '#64748b' }}>            ▼ ▼ ▼</div>
          <div style={{ color: '#0ea5e9' }}>╔═══════════ WORKER NODES ════════════╗</div>
          <div style={{ color: '#0ea5e9' }}>║                                      ║</div>
          <div style={{ color: '#0ea5e9' }}>║  ┌─ Node 1 ─────────────────────┐   ║</div>
          <div style={{ color: '#0ea5e9' }}>║  │ • kubelet                    │   ║</div>
          <div style={{ color: '#0ea5e9' }}>║  │ • kube-proxy                 │   ║</div>
          <div style={{ color: '#0ea5e9' }}>║  │ • container runtime          │   ║</div>
          <div style={{ color: '#22c55e' }}>║  │   ┌─────────┐  ┌─────────┐  │   ║</div>
          <div style={{ color: '#22c55e' }}>║  │   │ Pod 1   │  │ Pod 2   │  │   ║</div>
          <div style={{ color: '#22c55e' }}>║  │   └─────────┘  └─────────┘  │   ║</div>
          <div style={{ color: '#0ea5e9' }}>║  └──────────────────────────────┘   ║</div>
          <div style={{ color: '#0ea5e9' }}>║                                      ║</div>
          <div style={{ color: '#0ea5e9' }}>║  ┌─ Node 2 ─────────────────────┐   ║</div>
          <div style={{ color: '#0ea5e9' }}>║  │ • kubelet                    │   ║</div>
          <div style={{ color: '#0ea5e9' }}>║  │ • kube-proxy                 │   ║</div>
          <div style={{ color: '#0ea5e9' }}>║  │ • container runtime          │   ║</div>
          <div style={{ color: '#22c55e' }}>║  │   ┌─────────┐  ┌─────────┐  │   ║</div>
          <div style={{ color: '#22c55e' }}>║  │   │ Pod 3   │  │ Pod 4   │  │   ║</div>
          <div style={{ color: '#22c55e' }}>║  │   └─────────┘  └─────────┘  │   ║</div>
          <div style={{ color: '#0ea5e9' }}>║  └──────────────────────────────┘   ║</div>
          <div style={{ color: '#0ea5e9' }}>╚══════════════════════════════════════╝</div>
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>Key Lesson: Everything Talks to the API Server</h2>
        <p>
          Notice a pattern? <strong>Everything communicates through the API Server.</strong> This
          includes:
        </p>
        <ul>
          <li>Users (via kubectl)</li>
          <li>Control plane components (scheduler, controllers)</li>
          <li>Worker node components (kubelet, kube-proxy)</li>
          <li>Add-ons and operators</li>
        </ul>

        <Callout variant="success" icon="✅" title="Why This Architecture Matters">
          <p><strong>1. Single Source of Truth</strong></p>
          <p>All state lives in etcd, accessed only through the API Server. No confusion about what should be running.</p>

          <p><strong>2. Decoupled Components</strong></p>
          <p>Components don't talk directly to each other. They only watch and update the API Server. This makes Kubernetes modular and extensible.</p>

          <p><strong>3. Self-Healing</strong></p>
          <p>Controllers constantly watch for drift between desired and actual state, correcting it automatically.</p>

          <p><strong>4. Declarative Management</strong></p>
          <p>You declare intent; components work continuously to make it reality.</p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Key Takeaways</h2>
        <ul>
          <li><strong>kubelet</strong> is the node agent—it executes instructions from the control plane</li>
          <li><strong>Container runtime</strong> (containerd, CRI-O) actually starts and stops containers</li>
          <li><strong>kube-proxy</strong> handles networking and service load balancing</li>
          <li>Worker nodes are stateless and replaceable</li>
          <li>All components communicate through the API Server</li>
          <li>This architecture enables self-healing, scalability, and declarative management</li>
        </ul>
      </section>
    </ModuleShell>
  );
}
