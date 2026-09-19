import { useState } from 'react';
import styles from '../styles/Home.module.css';
import moduleStyles from '../styles/Module.module.css';
import ModuleShell from '../components/module/ModuleShell';
import Callout from '../components/module/Callout';
import TermBox from '../components/module/TermBox';

const ingressControllers = {
  nginx: { name: 'NGINX Ingress', vendor: 'Community/Kubernetes', implementation: 'nginx.conf + Lua', features: 'Path/host routing, TLS, rate limiting, auth', performance: 'High (C-based)', complexity: 'Medium', useCase: 'General purpose, most popular' },
  traefik: { name: 'Traefik', vendor: 'Traefik Labs', implementation: 'Go + middleware', features: "Auto SSL (Let's Encrypt), TCP/UDP, middleware", performance: 'High', complexity: 'Low', useCase: 'Easy setup, modern UI, dynamic config' },
  haproxy: { name: 'HAProxy Ingress', vendor: 'HAProxy Technologies', implementation: 'haproxy.cfg', features: 'Blue/green, A/B testing, circuit breaking', performance: 'Very High', complexity: 'High', useCase: 'Advanced routing, enterprise features' },
  contour: { name: 'Contour', vendor: 'VMware', implementation: 'Envoy proxy', features: 'HTTPProxy CRD, delegation, multi-tenancy', performance: 'Very High', complexity: 'Medium', useCase: 'Envoy-based, complex routing' },
  istio: { name: 'Istio Gateway', vendor: 'Google/IBM/Lyft', implementation: 'Envoy + control plane', features: 'Service mesh, mTLS, observability, retries', performance: 'High (with overhead)', complexity: 'Very High', useCase: 'Full service mesh, microservices' },
};

const routingPaths = {
  '/api/users': { service: 'user-service', port: 8080, color: '#3b82f6' },
  '/api/orders': { service: 'order-service', port: 8081, color: '#10b981' },
  '/': { service: 'frontend', port: 80, color: '#f59e0b' },
};

export default function Module62() {
  const [selectedPath, setSelectedPath] = useState<keyof typeof routingPaths>('/api/users');
  const [tlsEnabled, setTlsEnabled] = useState(true);
  const [selectedController, setSelectedController] = useState<keyof typeof ingressControllers>('nginx');
  const path = routingPaths[selectedPath];
  const ctrl = ingressControllers[selectedController];

  const field = (label: string, value: string) => (
    <div>
      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ color: 'var(--color-text-primary)', fontSize: '1.05rem' }}>{value}</div>
    </div>
  );

  const flowSteps = [
    { step: 1, title: 'Client → Load Balancer', detail: `${tlsEnabled ? 'HTTPS' : 'HTTP'} request to ${tlsEnabled ? '443' : '80'}`, description: "Client makes request to your domain. DNS points to the Ingress controller's external IP." },
    { step: 2, title: 'Load Balancer → Ingress Controller', detail: 'Traffic reaches NGINX/Traefik Pod', description: 'The LoadBalancer service forwards to the Ingress controller Pod (usually on port 80/443).' },
    ...(tlsEnabled ? [{ step: 3, title: 'TLS Termination', detail: 'Decrypt with cert from Secret', description: 'Ingress controller decrypts HTTPS using the TLS certificate stored in a Kubernetes Secret.' }] : []),
    { step: tlsEnabled ? 4 : 3, title: 'Path Matching', detail: `Match rule: ${selectedPath} → ${path.service}`, description: 'Ingress controller checks its rules and finds the matching path/host.' },
    { step: tlsEnabled ? 5 : 4, title: 'Ingress Controller → Service', detail: `HTTP to ${path.service}:${path.port}`, description: 'Controller forwards the request to the backend Service (unencrypted within cluster).' },
    { step: tlsEnabled ? 6 : 5, title: 'Service → Pod', detail: 'Service load balances to healthy Pod', description: 'Service picks a backend Pod using iptables/IPVS. The Pod handles the request.' },
    { step: tlsEnabled ? 7 : 6, title: 'Response Returns', detail: 'Pod → Service → Ingress → Client', description: tlsEnabled ? 'Response flows back through the same path. Ingress controller re-encrypts for HTTPS.' : 'Response flows back through the same path.' },
  ];

  return (
    <ModuleShell id="6-2">
      <section className={styles.spotlight}>
        <p>
          Services give you load balancing <em>inside</em> the cluster. Ingress gives you load balancing
          <em>from outside</em> the cluster. It's the front door to your Kubernetes applications,
          handling HTTP/HTTPS routing based on hostnames and paths.
        </p>

        <Callout variant="warning" title="Key Point">
          <p>
            An Ingress resource is just YAML—a specification of routing rules.
            An Ingress <em>controller</em> is the actual software (NGINX, Traefik, HAProxy, etc.) that reads
            those rules and routes traffic. Without a controller, Ingress resources do nothing.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>What Ingress Is (and Isn't)</h2>
        <div className={moduleStyles.grid}>
          <Callout variant="success" title="✓ Ingress IS">
            <ul>
              <li>HTTP/HTTPS load balancing</li>
              <li>Host-based routing (api.example.com)</li>
              <li>Path-based routing (/api, /web)</li>
              <li>TLS termination</li>
              <li>Name-based virtual hosting</li>
              <li>Single external IP for multiple services</li>
            </ul>
          </Callout>
          <Callout variant="danger" title="✗ Ingress ISN'T">
            <ul>
              <li>A replacement for Services</li>
              <li>TCP/UDP load balancing (use LoadBalancer)</li>
              <li>Automatic DNS management</li>
              <li>A web application firewall (though some have it)</li>
              <li>Required (you can use NodePort/LoadBalancer)</li>
              <li>Layer 4 load balancing</li>
            </ul>
          </Callout>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>Interactive: Request Routing</h2>
        <p>Select a path to see how Ingress routes the request:</p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {Object.entries(routingPaths).map(([p, info]) => (
            <button
              key={p}
              onClick={() => setSelectedPath(p as keyof typeof routingPaths)}
              style={{
                padding: '1rem 1.5rem',
                border: `2px solid ${selectedPath === p ? info.color : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-md)',
                background: selectedPath === p ? 'var(--color-bg-secondary)' : 'var(--color-bg-elevated)',
                cursor: 'pointer',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                flex: '1',
                minWidth: '150px',
              }}
            >
              {p}
            </button>
          ))}
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1.5rem' }}>
          <input type="checkbox" checked={tlsEnabled} onChange={(e) => setTlsEnabled(e.target.checked)} style={{ width: '20px', height: '20px' }} />
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Enable TLS (HTTPS)</span>
        </label>

        <div style={{ background: 'var(--color-bg-elevated)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: `2px solid ${path.color}` }}>
          <h4 style={{ marginTop: 0 }}>Request: {tlsEnabled ? 'https' : 'http'}://example.com{selectedPath}</h4>

          {flowSteps.map((flow) => (
            <div key={flow.step} style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', borderLeft: `4px solid ${path.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: path.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.9rem' }}>{flow.step}</div>
                <strong style={{ color: 'var(--color-text-primary)' }}>{flow.title}</strong>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#10b981', background: '#0f172a', padding: '0.5rem', borderRadius: '4px', marginBottom: '0.5rem' }}>{flow.detail}</div>
              <div style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>{flow.description}</div>
            </div>
          ))}
        </div>

        <Callout variant="warning" title="Notice">
          <p>
            TLS terminates at the Ingress controller. Traffic inside the cluster is HTTP (unencrypted).
            For end-to-end encryption, you need a service mesh or backend TLS.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Example Ingress Resource</h2>
        <p>Here's a typical Ingress YAML that routes based on paths:</p>

        <TermBox>
          <div style={{ color: '#10b981' }}>apiVersion: networking.k8s.io/v1</div>
          <div style={{ color: '#10b981' }}>kind: Ingress</div>
          <div style={{ color: '#10b981' }}>metadata:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: my-ingress</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;annotations:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;nginx.ingress.kubernetes.io/rewrite-target: /</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;cert-manager.io/cluster-issuer: letsencrypt-prod</div>
          <div style={{ color: '#10b981' }}>spec:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;ingressClassName: nginx</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;tls:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- hosts:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;- example.com</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;secretName: example-tls  # Certificate here</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;rules:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- host: example.com</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;http:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;paths:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- path: /api/users</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pathType: Prefix</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;backend:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;service:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: user-service</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;port:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;number: 8080</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- path: /api/orders</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pathType: Prefix</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;backend:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;service:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: order-service</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;port:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;number: 8081</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- path: /</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pathType: Prefix</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;backend:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;service:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: frontend</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;port:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;number: 80</div>
        </TermBox>

        <Callout variant="neutral" title="Breaking It Down">
          <p><code>ingressClassName: nginx</code><br />
            Specifies which Ingress controller handles this resource. Multiple controllers can coexist.</p>
          <p><code>tls.secretName: example-tls</code><br />
            References a Secret containing tls.crt and tls.key. Cert-manager can auto-create this.</p>
          <p><code>pathType: Prefix</code><br />
            <strong>Prefix:</strong> /api/users matches /api/users/123 · <strong>Exact:</strong> Only exact match ·
            <strong>ImplementationSpecific:</strong> Controller decides (usually regex)</p>
          <p><code>annotations</code><br />
            Controller-specific config. NGINX uses nginx.ingress.kubernetes.io/*, Traefik uses traefik.ingress.kubernetes.io/*, etc.</p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Ingress Controllers Compared</h2>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {Object.entries(ingressControllers).map(([key, controller]) => (
            <button
              key={key}
              onClick={() => setSelectedController(key as keyof typeof ingressControllers)}
              style={{
                padding: '0.75rem 1.5rem',
                border: `2px solid ${selectedController === key ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-sm)',
                background: selectedController === key ? 'var(--color-bg-secondary)' : 'var(--color-bg-elevated)',
                cursor: 'pointer',
                fontWeight: selectedController === key ? 600 : 400,
                color: 'var(--color-text-primary)',
              }}
            >
              {controller.name}
            </button>
          ))}
        </div>

        <div style={{ padding: '1.5rem', background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <h4 style={{ marginTop: 0, fontSize: '1.3rem' }}>{ctrl.name}</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {field('Vendor', ctrl.vendor)}
            {field('Implementation', ctrl.implementation)}
            {field('Key Features', ctrl.features)}
            {field('Performance', ctrl.performance)}
            {field('Complexity', ctrl.complexity)}
            {field('Best For', ctrl.useCase)}
          </div>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>Installation Examples</h2>

        <Callout variant="neutral" title="NGINX Ingress Controller">
          <p>
            Most popular choice. Battle-tested, well-documented. Two versions exist: Kubernetes community
            version (recommended) and NGINX Inc version.
          </p>
          <TermBox>
            <div style={{ color: '#64748b' }}># Install via Helm</div>
            <div style={{ color: '#10b981' }}>helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx</div>
            <div style={{ color: '#10b981' }}>helm install nginx-ingress ingress-nginx/ingress-nginx</div>
            <br />
            <div style={{ color: '#64748b' }}># Or via kubectl</div>
            <div style={{ color: '#10b981' }}>kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml</div>
            <br />
            <div style={{ color: '#64748b' }}># Get the external IP</div>
            <div style={{ color: '#10b981' }}>kubectl get svc -n ingress-nginx</div>
          </TermBox>
        </Callout>

        <Callout variant="neutral" title="Traefik">
          <p>
            Modern, with a nice dashboard. Automatic Let's Encrypt integration. Supports TCP/UDP routing
            and middlewares (rate limiting, auth, etc.).
          </p>
          <TermBox>
            <div style={{ color: '#64748b' }}># Install via Helm</div>
            <div style={{ color: '#10b981' }}>helm repo add traefik https://traefik.github.io/charts</div>
            <div style={{ color: '#10b981' }}>helm install traefik traefik/traefik</div>
            <br />
            <div style={{ color: '#64748b' }}># Access dashboard</div>
            <div style={{ color: '#10b981' }}>kubectl port-forward -n traefik {"$(kubectl get pods -n traefik -o name | head -n 1)"} 9000:9000</div>
            <div style={{ color: '#64748b' }}># Open http://localhost:9000/dashboard/</div>
          </TermBox>
        </Callout>

        <Callout variant="neutral" title="Istio Gateway (Service Mesh)">
          <p>
            Not just Ingress—full service mesh with mTLS, retries, circuit breaking, observability.
            Overkill for simple routing, but powerful for microservices.
          </p>
          <TermBox>
            <div style={{ color: '#64748b' }}># Install Istio</div>
            <div style={{ color: '#10b981' }}>istioctl install --set profile=demo</div>
            <br />
            <div style={{ color: '#64748b' }}># Gateway instead of Ingress:</div>
            <div style={{ color: '#10b981' }}>apiVersion: networking.istio.io/v1beta1</div>
            <div style={{ color: '#10b981' }}>kind: Gateway</div>
            <div style={{ color: '#10b981' }}>metadata:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: my-gateway</div>
            <div style={{ color: '#10b981' }}>spec:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;servers:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- port:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;number: 80</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: http</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;protocol: HTTP</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;hosts:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;- '*.example.com'</div>
          </TermBox>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>TLS Termination</h2>
        <p>
          Ingress handles TLS by storing certificates in Kubernetes Secrets. You can create them manually
          or use cert-manager to automatically provision Let's Encrypt certificates.
        </p>

        <Callout variant="neutral" title="Option 1: Manual Certificate">
          <TermBox>
            <div style={{ color: '#64748b' }}># Create TLS secret from cert files</div>
            <div style={{ color: '#10b981' }}>kubectl create secret tls example-tls \</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;--cert=path/to/tls.crt \</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;--key=path/to/tls.key</div>
            <br />
            <div style={{ color: '#64748b' }}># Reference in Ingress:</div>
            <div style={{ color: '#10b981' }}>tls:</div>
            <div style={{ color: '#10b981' }}>- hosts:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- example.com</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;secretName: example-tls</div>
          </TermBox>
        </Callout>

        <Callout variant="neutral" title="Option 2: cert-manager (Recommended)">
          <p>Automatically requests, renews, and installs certificates from Let's Encrypt or other ACME providers.</p>
          <TermBox>
            <div style={{ color: '#64748b' }}># Install cert-manager</div>
            <div style={{ color: '#10b981' }}>kubectl apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml</div>
            <br />
            <div style={{ color: '#64748b' }}># Create ClusterIssuer for Let's Encrypt</div>
            <div style={{ color: '#10b981' }}>apiVersion: cert-manager.io/v1</div>
            <div style={{ color: '#10b981' }}>kind: ClusterIssuer</div>
            <div style={{ color: '#10b981' }}>metadata:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: letsencrypt-prod</div>
            <div style={{ color: '#10b981' }}>spec:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;acme:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;server: https://acme-v02.api.letsencrypt.org/directory</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;email: you@example.com</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;privateKeySecretRef:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: letsencrypt-prod</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;solvers:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;- http01:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ingress:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;class: nginx</div>
            <br />
            <div style={{ color: '#64748b' }}># Annotate your Ingress:</div>
            <div style={{ color: '#10b981' }}>annotations:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;cert-manager.io/cluster-issuer: letsencrypt-prod</div>
            <br />
            <div style={{ color: '#64748b' }}># cert-manager will automatically create the Secret!</div>
          </TermBox>
        </Callout>

        <Callout variant="warning" title="Let's Encrypt Rate Limits">
          <p>
            50 certificates per registered domain per week.
            Use the staging environment (acme-staging-v02.api.letsencrypt.org) for testing to avoid hitting
            limits. Switch to prod once you're confident.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Real-World Traffic Flow (Complete Picture)</h2>
        <p>Let's trace a request from a user's browser to a Pod, hitting every component:</p>

        <Callout variant="neutral">
          {[
            { n: 1, c: '#3b82f6', title: 'DNS Resolution', body: 'User types example.com → DNS returns 1.2.3.4 (your LoadBalancer IP)' },
            { n: 2, c: '#3b82f6', title: 'Cloud LoadBalancer', body: 'AWS ELB / GCP Load Balancer / Azure Load Balancer receives HTTPS on port 443. Routes to any node running the Ingress controller (NodePort or direct Pod routing).' },
            { n: 3, c: '#3b82f6', title: 'Ingress Controller Pod', body: 'NGINX/Traefik Pod receives the request. Decrypts TLS using certificate from Secret. Examines Host header and path. Matches Ingress rule.' },
            { n: 4, c: '#3b82f6', title: 'Service (ClusterIP)', body: 'Controller sends HTTP (unencrypted) to Service IP (e.g., 10.96.0.1:8080). kube-proxy/eBPF intercepts and load balances to a backend Pod IP.' },
            { n: 5, c: '#3b82f6', title: 'Application Pod', body: 'Your app receives HTTP request on 10.244.1.5:8080. Processes it. Returns response.' },
            { n: 6, c: '#10b981', title: 'Response Path', body: 'Pod → Service → Ingress Controller (re-encrypts to HTTPS) → LoadBalancer → User\'s browser' },
          ].map((s) => (
            <div key={s.n} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: s.c, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>{s.n}</div>
                <strong style={{ color: 'var(--color-text-primary)' }}>{s.title}</strong>
              </div>
              <div style={{ marginLeft: '42px', color: 'var(--color-text-secondary)' }}>{s.body}</div>
            </div>
          ))}
          <p style={{ marginBottom: 0 }}><strong>Total latency added:</strong> ~2-5ms (TLS handshake + routing)</p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Common Patterns & Gotchas</h2>

        <Callout variant="neutral" title="Pattern: Multiple Domains">
          <p>You can route multiple domains to different services in one Ingress:</p>
          <TermBox>
            <div style={{ color: '#10b981' }}>rules:</div>
            <div style={{ color: '#10b981' }}>- host: api.example.com</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;http:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;paths:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;- path: /</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;backend: {'{service: {name: api-service}}'}</div>
            <div style={{ color: '#10b981' }}>- host: www.example.com</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;http:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;paths:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;- path: /</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;backend: {'{service: {name: web-service}}'}</div>
          </TermBox>
        </Callout>

        <Callout variant="neutral" title="Pattern: Redirect HTTP to HTTPS">
          <TermBox>
            <div style={{ color: '#10b981' }}>annotations:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;nginx.ingress.kubernetes.io/ssl-redirect: 'true'</div>
            <div style={{ color: '#64748b' }}>&nbsp;&nbsp;# Or force HTTPS:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;nginx.ingress.kubernetes.io/force-ssl-redirect: 'true'</div>
          </TermBox>
        </Callout>

        <Callout variant="danger" title="Gotcha: Path rewriting">
          <p>If you route /api to a service that expects /, you need rewrite rules:</p>
          <TermBox>
            <div style={{ color: '#64748b' }}># Request: /api/users → Backend receives: /users</div>
            <div style={{ color: '#10b981' }}>annotations:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;nginx.ingress.kubernetes.io/rewrite-target: /$2</div>
            <div style={{ color: '#10b981' }}>paths:</div>
            <div style={{ color: '#10b981' }}>- path: /api(/|$)(.*)</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;pathType: ImplementationSpecific</div>
          </TermBox>
        </Callout>

        <Callout variant="danger" title="Gotcha: Default backend">
          <p>
            Without a default backend, unmatched requests return 404 from the Ingress controller itself.
            Deploy a custom 404 service:
          </p>
          <TermBox>
            <div style={{ color: '#10b981' }}>spec:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;defaultBackend:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;service:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: default-backend</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;port:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;number: 80</div>
          </TermBox>
        </Callout>

        <Callout variant="danger" title="Gotcha: CORS and headers">
          <p>Frontend calling API from different origin? Configure CORS at the Ingress level:</p>
          <TermBox>
            <div style={{ color: '#10b981' }}>annotations:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;nginx.ingress.kubernetes.io/enable-cors: 'true'</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;nginx.ingress.kubernetes.io/cors-allow-origin: '*'</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;nginx.ingress.kubernetes.io/cors-allow-methods: 'GET, POST, OPTIONS'</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;nginx.ingress.kubernetes.io/cors-allow-headers: 'Authorization, Content-Type'</div>
          </TermBox>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>When NOT to Use Ingress</h2>
        <ul>
          <li><strong>Non-HTTP protocols:</strong> Use LoadBalancer or NodePort for TCP/UDP services (databases, game servers, etc.)</li>
          <li><strong>Single service:</strong> If you only expose one service, LoadBalancer is simpler</li>
          <li><strong>Internal traffic:</strong> For pod-to-pod or service-to-service, use ClusterIP Services directly</li>
          <li><strong>Cost sensitivity:</strong> Ingress needs a LoadBalancer ($$). For dev, use port-forward or NodePort</li>
        </ul>

        <Callout variant="info" title="Pro Tip">
          <p>
            In production, combine Ingress with ExternalDNS for automatic DNS management,
            and cert-manager for automatic TLS. This trinity (Ingress + ExternalDNS + cert-manager) gives you
            fully automated, secure ingress with zero manual DNS or certificate work.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>The Big Picture</h2>
        <p>
          Ingress is the standard way to expose HTTP services in Kubernetes. It's more flexible than LoadBalancer
          (one IP for multiple services, path routing) and more powerful than NodePort (TLS, virtual hosting).
          The controller ecosystem is mature—pick one that fits your needs and stick with it.
        </p>
        <p>
          For most use cases, <strong>NGINX Ingress + cert-manager</strong> is the sweet spot: well-documented,
          performant, and has every feature you'd need. If you want something more modern with a better UX,
          try <strong>Traefik</strong>. If you're building a complex microservices architecture, consider
          <strong> Istio Gateway</strong> for the full service mesh experience.
        </p>

        <Callout variant="warning" title="Remember">
          <p>
            Ingress resources are just config. The controller is the actual software
            doing the work. Understanding this separation helps debug issues—check the controller logs, not the
            Ingress YAML, when traffic isn't flowing.
          </p>
        </Callout>
      </section>
    </ModuleShell>
  );
}
