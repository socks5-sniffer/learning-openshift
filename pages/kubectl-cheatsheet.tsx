import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

interface CheatSection {
  icon: string;
  title: string;
  moduleRef: string;
  moduleId: string;
  commands: string;
}

// One <pre> block per topic — the site-wide CodeCopy enhancer gives each a copy button.
const cheatSections: CheatSection[] = [
  {
    icon: '🔍',
    title: 'Inspecting Resources',
    moduleRef: 'Modules 2.1, 8.3',
    moduleId: '2-1',
    commands: `# List resources
kubectl get pods                          # Pods in current namespace
kubectl get pods -A                       # Pods in ALL namespaces
kubectl get pods -o wide                  # Adds node, IP, and more
kubectl get all                           # Pods, Services, Deployments...

# Deep-dive a single resource (start here when debugging)
kubectl describe pod <pod-name>           # Events section = crime scene report
kubectl get pod <pod-name> -o yaml        # Full manifest as the cluster sees it

# Watch things change live
kubectl get pods -w`,
  },
  {
    icon: '🚀',
    title: 'Creating & Applying',
    moduleRef: 'Modules 2.2, 9.1',
    moduleId: '2-2',
    commands: `# Declarative (preferred): apply a manifest
kubectl apply -f deployment.yaml
kubectl apply -f ./manifests/             # Whole directory

# Quick experiments (fine for learning, not production)
kubectl run test-pod --image=nginx:1.27
kubectl create deployment web --image=nginx:1.27 --replicas=3

# Generate YAML without creating anything (great starting point)
kubectl create deployment web --image=nginx:1.27 --dry-run=client -o yaml

# Delete things
kubectl delete -f deployment.yaml
kubectl delete pod <pod-name>`,
  },
  {
    icon: '🐛',
    title: 'Debugging Pods',
    moduleRef: 'Modules 8.3, 10.1',
    moduleId: '8-3',
    commands: `# Logs (the answer is usually here)
kubectl logs <pod-name>
kubectl logs <pod-name> --previous        # The container that just crashed
kubectl logs <pod-name> -c <container>    # Multi-container Pods
kubectl logs -f <pod-name>                # Follow live

# Get inside a running container
kubectl exec -it <pod-name> -- sh
kubectl exec <pod-name> -- env            # One-off command

# Cluster-wide event stream (sorted by time)
kubectl get events --sort-by=.metadata.creationTimestamp

# Copy files in/out
kubectl cp <pod-name>:/path/file ./file`,
  },
  {
    icon: '📈',
    title: 'Scaling & Rollouts',
    moduleRef: 'Modules 2.2, 4.3, 9.1',
    moduleId: '2-2',
    commands: `# Scale manually
kubectl scale deployment web --replicas=5

# Rolling updates
kubectl set image deployment/web web=nginx:1.28
kubectl rollout status deployment/web     # Watch it happen
kubectl rollout history deployment/web    # Past revisions

# When the deploy goes bad
kubectl rollout undo deployment/web
kubectl rollout undo deployment/web --to-revision=2

# Restart all Pods (picks up new ConfigMaps/Secrets)
kubectl rollout restart deployment/web`,
  },
  {
    icon: '⚙️',
    title: 'Config & Secrets',
    moduleRef: 'Modules 3.1, 3.2',
    moduleId: '3-1',
    commands: `# ConfigMaps
kubectl create configmap app-config --from-literal=LOG_LEVEL=debug
kubectl create configmap app-config --from-file=config.properties
kubectl get configmap app-config -o yaml

# Secrets (remember: base64 ≠ encryption)
kubectl create secret generic db-creds --from-literal=password=s3cret
kubectl get secret db-creds -o jsonpath='{.data.password}' | base64 -d`,
  },
  {
    icon: '🌐',
    title: 'Services & Networking',
    moduleRef: 'Modules 2.3, 6.1, 6.2',
    moduleId: '2-3',
    commands: `# Expose and inspect Services
kubectl expose deployment web --port=80 --type=ClusterIP
kubectl get svc
kubectl get endpoints web                 # Which Pods actually back the Service?

# Test connectivity from inside the cluster
kubectl run curl-test --image=curlimages/curl -it --rm -- sh

# Port-forward to your laptop (no Service needed)
kubectl port-forward pod/<pod-name> 8080:80
kubectl port-forward svc/web 8080:80

# Ingress
kubectl get ingress
kubectl describe ingress <name>`,
  },
  {
    icon: '🔐',
    title: 'RBAC & Permissions',
    moduleRef: 'Module 7.1',
    moduleId: '7-1',
    commands: `# Can I do this? (test before you're surprised)
kubectl auth can-i create deployments
kubectl auth can-i delete pods -n production
kubectl auth can-i list secrets --as=system:serviceaccount:default:my-sa

# Inspect who can do what
kubectl get roles,rolebindings
kubectl describe clusterrole view`,
  },
  {
    icon: '📊',
    title: 'Resources & Nodes',
    moduleRef: 'Modules 4.1, 4.2',
    moduleId: '4-1',
    commands: `# Usage (requires metrics-server)
kubectl top pods
kubectl top nodes

# Node management
kubectl get nodes -o wide
kubectl describe node <node-name>         # Capacity, allocations, taints
kubectl cordon <node-name>                # Stop new Pods scheduling here
kubectl drain <node-name> --ignore-daemonsets   # Evict for maintenance
kubectl uncordon <node-name>              # Back in service

# Labels & taints
kubectl label node <node-name> disktype=ssd
kubectl taint node <node-name> dedicated=gpu:NoSchedule`,
  },
  {
    icon: '🗂️',
    title: 'Namespaces & Context',
    moduleRef: 'Module 3.3',
    moduleId: '3-3',
    commands: `# Namespaces
kubectl get namespaces
kubectl create namespace staging
kubectl get pods -n staging

# Set default namespace so you stop typing -n
kubectl config set-context --current --namespace=staging

# Clusters & contexts (multi-cluster life)
kubectl config get-contexts
kubectl config use-context <context-name>
kubectl cluster-info`,
  },
];

export default function KubectlCheatsheet() {
  return (
    <div className={styles.container}>
      <Head>
        <title>kubectl Cheat Sheet | KubeLearn</title>
        <meta name="description" content="The kubectl commands used across all 30 learning modules, grouped by task, with copy buttons" />
      </Head>

      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.navBrand}>
            <div className={styles.navLogo}>☸</div>
            <span className={styles.navTitle}>
              Kube<span className={styles.navTitleAccent}>Learn</span>
            </span>
          </Link>
          <div className={styles.navLinks}>
            <Link href="/learning-modules" className={styles.navLink}>
              Modules
            </Link>
            <Link href="/interactive-learning" className={styles.navLink}>
              Interactive
            </Link>
            <Link href="/kubectl-cheatsheet" className={`${styles.navLink} ${styles.navLinkActive}`}>
              Cheat Sheet
            </Link>
          </div>
        </div>
      </nav>

      <main className={styles.main} style={{ maxWidth: 1000, margin: '0 auto', paddingTop: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}></span>
            Quick Reference
          </div>
          <h1 className={styles.title}>
            kubectl <span className={styles.titleAccent}>Cheat Sheet</span>
          </h1>
          <p className={styles.subtitle}>
            The commands used across the curriculum, grouped by task. Hover any block for a copy button —
            each section links back to the module that explains the concepts.
          </p>
        </div>

        {cheatSections.map((section) => (
          <section key={section.title} className={styles.spotlight} style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 style={{ margin: 0 }}>
                {section.icon} {section.title}
              </h2>
              <Link
                href={`/module-${section.moduleId}`}
                style={{ color: '#94a3b8', fontSize: '0.8rem', textDecoration: 'none' }}
              >
                📖 {section.moduleRef} →
              </Link>
            </div>
            <pre
              style={{
                marginTop: '1rem',
                marginBottom: 0,
                padding: '1.25rem',
                borderRadius: 10,
                background: '#0f172a',
                border: '1px solid rgba(148, 163, 184, 0.15)',
                color: '#e2e8f0',
                fontFamily: 'monospace',
                fontSize: '0.83rem',
                lineHeight: 1.65,
                overflowX: 'auto',
              }}
            >
              {section.commands}
            </pre>
          </section>
        ))}

        <div
          style={{
            margin: '2rem 0',
            padding: '1.25rem 1.5rem',
            borderRadius: 10,
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            color: '#bfdbfe',
            fontSize: '0.9rem',
            lineHeight: 1.7,
          }}
        >
          💡 <strong>Tip:</strong> almost every command accepts <code style={{ color: '#e2e8f0' }}>-n &lt;namespace&gt;</code> to
          target a namespace, <code style={{ color: '#e2e8f0' }}>-o yaml</code>/<code style={{ color: '#e2e8f0' }}>-o wide</code> to
          change output, and <code style={{ color: '#e2e8f0' }}>--help</code> when you forget the rest. On OpenShift,{' '}
          <code style={{ color: '#e2e8f0' }}>oc</code> accepts all of these plus platform extras like{' '}
          <code style={{ color: '#e2e8f0' }}>oc new-app</code> and <code style={{ color: '#e2e8f0' }}>oc get routes</code>.
        </div>
      </main>
    </div>
  );
}
