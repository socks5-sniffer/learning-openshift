import { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Module62() {
  const [showTrafficFlow, setShowTrafficFlow] = useState(false);
  const [selectedPath, setSelectedPath] = useState('/api/users');
  const [tlsEnabled, setTlsEnabled] = useState(true);
  const [selectedController, setSelectedController] = useState('nginx');

  const ingressControllers = {
    nginx: {
      name: 'NGINX Ingress',
      vendor: 'Community/Kubernetes',
      implementation: 'nginx.conf + Lua',
      features: 'Path/host routing, TLS, rate limiting, auth',
      performance: 'High (C-based)',
      complexity: 'Medium',
      useCase: 'General purpose, most popular'
    },
    traefik: {
      name: 'Traefik',
      vendor: 'Traefik Labs',
      implementation: 'Go + middleware',
      features: 'Auto SSL (Let\'s Encrypt), TCP/UDP, middleware',
      performance: 'High',
      complexity: 'Low',
      useCase: 'Easy setup, modern UI, dynamic config'
    },
    haproxy: {
      name: 'HAProxy Ingress',
      vendor: 'HAProxy Technologies',
      implementation: 'haproxy.cfg',
      features: 'Blue/green, A/B testing, circuit breaking',
      performance: 'Very High',
      complexity: 'High',
      useCase: 'Advanced routing, enterprise features'
    },
    contour: {
      name: 'Contour',
      vendor: 'VMware',
      implementation: 'Envoy proxy',
      features: 'HTTPProxy CRD, delegation, multi-tenancy',
      performance: 'Very High',
      complexity: 'Medium',
      useCase: 'Envoy-based, complex routing'
    },
    istio: {
      name: 'Istio Gateway',
      vendor: 'Google/IBM/Lyft',
      implementation: 'Envoy + control plane',
      features: 'Service mesh, mTLS, observability, retries',
      performance: 'High (with overhead)',
      complexity: 'Very High',
      useCase: 'Full service mesh, microservices'
    }
  };

  const routingPaths = {
    '/api/users': { service: 'user-service', port: 8080, color: '#3b82f6' },
    '/api/orders': { service: 'order-service', port: 8081, color: '#10b981' },
    '/': { service: 'frontend', port: 80, color: '#f59e0b' }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title} style={{ color: '#1e293b' }}>
          6.2 Ingress
        </h1>

        <div style={{ marginBottom: '2rem' }}>
          <Link href="/module-6-1" legacyBehavior>
            <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              ← Previous: Kubernetes Networking Model
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/learning-modules" legacyBehavior>
            <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              All Modules
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/module-7-1" legacyBehavior>
            <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              Next: RBAC →
            </a>
          </Link>
        </div>

        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#1e293b', maxWidth: '800px' }}>
          Services give you load balancing <em>inside</em> the cluster. Ingress gives you load balancing
          <em>from outside</em> the cluster. It's the front door to your Kubernetes applications,
          handling HTTP/HTTPS routing based on hostnames and paths.
        </p>

        <div style={{
          background: 'linear-gradient(to right, #fef3c7, #fde68a)',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '2rem',
          borderLeft: '4px solid #f59e0b'
        }}>
          <p style={{ margin: 0, color: '#1e293b', lineHeight: '1.6' }}>
            <strong>Key Point:</strong> An Ingress resource is just YAML—a specification of routing rules.
            An Ingress <em>controller</em> is the actual software (NGINX, Traefik, HAProxy, etc.) that reads
            those rules and routes traffic. Without a controller, Ingress resources do nothing.
          </p>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>What Ingress Is (and Isn't)</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginTop: '1.5rem'
        }}>
          <div style={{
            background: '#f0fdf4',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '2px solid #10b981'
          }}>
            <h3 style={{ marginTop: 0, color: '#1e293b' }}>✓ Ingress IS</h3>
            <ul style={{ color: '#1e293b', lineHeight: '1.8', marginBottom: 0 }}>
              <li>HTTP/HTTPS load balancing</li>
              <li>Host-based routing (api.example.com)</li>
              <li>Path-based routing (/api, /web)</li>
              <li>TLS termination</li>
              <li>Name-based virtual hosting</li>
              <li>Single external IP for multiple services</li>
            </ul>
          </div>

          <div style={{
            background: '#fef2f2',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '2px solid #ef4444'
          }}>
            <h3 style={{ marginTop: 0, color: '#1e293b' }}>✗ Ingress ISN'T</h3>
            <ul style={{ color: '#1e293b', lineHeight: '1.8', marginBottom: 0 }}>
              <li>A replacement for Services</li>
              <li>TCP/UDP load balancing (use LoadBalancer)</li>
              <li>Automatic DNS management</li>
              <li>A web application firewall (though some have it)</li>
              <li>Required (you can use NodePort/LoadBalancer)</li>
              <li>Layer 4 load balancing</li>
            </ul>
          </div>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Interactive: Request Routing</h2>

        <div style={{
          background: '#f8fafc',
          padding: '2rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          border: '2px solid #e2e8f0'
        }}>
          <p style={{ color: '#1e293b', marginBottom: '1rem' }}>
            Select a path to see how Ingress routes the request:
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {Object.entries(routingPaths).map(([path, info]) => (
              <button
                key={path}
                onClick={() => setSelectedPath(path)}
                style={{
                  padding: '1rem 1.5rem',
                  border: selectedPath === path ? `3px solid ${info.color}` : '2px solid #cbd5e1',
                  borderRadius: '8px',
                  background: selectedPath === path ? '#fef2f2' : 'white',
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: '#1e293b',
                  flex: '1',
                  minWidth: '150px'
                }}
              >
                {path}
              </button>
            ))}
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1.5rem' }}>
            <input
              type="checkbox"
              checked={tlsEnabled}
              onChange={(e) => setTlsEnabled(e.target.checked)}
              style={{ width: '20px', height: '20px' }}
            />
            <span style={{ color: '#1e293b', fontWeight: 600 }}>Enable TLS (HTTPS)</span>
          </label>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            border: `3px solid ${routingPaths[selectedPath as keyof typeof routingPaths].color}`
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>
              Request: {tlsEnabled ? 'https' : 'http'}://example.com{selectedPath}
            </h4>

            <div style={{ marginTop: '1.5rem' }}>
              {[
                {
                  step: 1,
                  title: 'Client → Load Balancer',
                  detail: `${tlsEnabled ? 'HTTPS' : 'HTTP'} request to ${tlsEnabled ? '443' : '80'}`,
                  description: 'Client makes request to your domain. DNS points to the Ingress controller\'s external IP.'
                },
                {
                  step: 2,
                  title: 'Load Balancer → Ingress Controller',
                  detail: 'Traffic reaches NGINX/Traefik Pod',
                  description: 'The LoadBalancer service forwards to the Ingress controller Pod (usually on port 80/443).'
                },
                ...(tlsEnabled ? [{
                  step: 3,
                  title: 'TLS Termination',
                  detail: 'Decrypt with cert from Secret',
                  description: 'Ingress controller decrypts HTTPS using the TLS certificate stored in a Kubernetes Secret.'
                }] : []),
                {
                  step: tlsEnabled ? 4 : 3,
                  title: 'Path Matching',
                  detail: `Match rule: ${selectedPath} → ${routingPaths[selectedPath as keyof typeof routingPaths].service}`,
                  description: 'Ingress controller checks its rules and finds the matching path/host.'
                },
                {
                  step: tlsEnabled ? 5 : 4,
                  title: 'Ingress Controller → Service',
                  detail: `HTTP to ${routingPaths[selectedPath as keyof typeof routingPaths].service}:${routingPaths[selectedPath as keyof typeof routingPaths].port}`,
                  description: 'Controller forwards the request to the backend Service (unencrypted within cluster).'
                },
                {
                  step: tlsEnabled ? 6 : 5,
                  title: 'Service → Pod',
                  detail: 'Service load balances to healthy Pod',
                  description: 'Service picks a backend Pod using iptables/IPVS. The Pod handles the request.'
                },
                {
                  step: tlsEnabled ? 7 : 6,
                  title: 'Response Returns',
                  detail: 'Pod → Service → Ingress → Client',
                  description: tlsEnabled 
                    ? 'Response flows back through the same path. Ingress controller re-encrypts for HTTPS.'
                    : 'Response flows back through the same path.'
                }
              ].map((flow) => (
                <div
                  key={flow.step}
                  style={{
                    marginBottom: '1rem',
                    padding: '1rem',
                    background: '#f8fafc',
                    borderRadius: '6px',
                    borderLeft: `4px solid ${routingPaths[selectedPath as keyof typeof routingPaths].color}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: routingPaths[selectedPath as keyof typeof routingPaths].color,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}>
                      {flow.step}
                    </div>
                    <strong style={{ color: '#1e293b' }}>{flow.title}</strong>
                  </div>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    color: '#059669',
                    background: '#f0fdfa',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    marginBottom: '0.5rem'
                  }}>
                    {flow.detail}
                  </div>
                  <div style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.5' }}>
                    {flow.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#fef3c7',
            borderRadius: '6px'
          }}>
            <strong style={{ color: '#1e293b' }}>Notice:</strong>
            <span style={{ color: '#1e293b', marginLeft: '0.5rem' }}>
              TLS terminates at the Ingress controller. Traffic inside the cluster is HTTP (unencrypted).
              For end-to-end encryption, you need a service mesh or backend TLS.
            </span>
          </div>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Example Ingress Resource</h2>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b' }}>
          Here's a typical Ingress YAML that routes based on paths:
        </p>

        <div style={{
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          background: '#1e293b',
          color: '#10b981',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1rem',
          overflowX: 'auto'
        }}>
          {"apiVersion: networking.k8s.io/v1"}<br />
          {"kind: Ingress"}<br />
          {"metadata:"}<br />
          {"  name: my-ingress"}<br />
          {"  annotations:"}<br />
          {"    nginx.ingress.kubernetes.io/rewrite-target: /"}<br />
          {"    cert-manager.io/cluster-issuer: letsencrypt-prod"}<br />
          {"spec:"}<br />
          {"  ingressClassName: nginx"}<br />
          {"  tls:"}<br />
          {"  - hosts:"}<br />
          {"    - example.com"}<br />
          {"    secretName: example-tls  # Certificate here"}<br />
          {"  rules:"}<br />
          {"  - host: example.com"}<br />
          {"    http:"}<br />
          {"      paths:"}<br />
          {"      - path: /api/users"}<br />
          {"        pathType: Prefix"}<br />
          {"        backend:"}<br />
          {"          service:"}<br />
          {"            name: user-service"}<br />
          {"            port:"}<br />
          {"              number: 8080"}<br />
          {"      - path: /api/orders"}<br />
          {"        pathType: Prefix"}<br />
          {"        backend:"}<br />
          {"          service:"}<br />
          {"            name: order-service"}<br />
          {"            port:"}<br />
          {"              number: 8081"}<br />
          {"      - path: /"}<br />
          {"        pathType: Prefix"}<br />
          {"        backend:"}<br />
          {"          service:"}<br />
          {"            name: frontend"}<br />
          {"            port:"}<br />
          {"              number: 80"}
        </div>

        <div style={{
          background: '#f8fafc',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ marginTop: 0, color: '#1e293b' }}>Breaking It Down</h3>
          
          <div style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <code style={{ background: 'white', padding: '0.2rem 0.5rem', borderRadius: '3px', color: '#9c0606ff', fontWeight: 600 }}>
                ingressClassName: nginx
              </code>
              <p style={{ color: '#1e293b', marginTop: '0.5rem', marginBottom: 0 }}>
                Specifies which Ingress controller handles this resource. Multiple controllers can coexist.
              </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <code style={{ background: 'white', padding: '0.2rem 0.5rem', borderRadius: '3px', color: '#9c0606ff', fontWeight: 600 }}>
                tls.secretName: example-tls
              </code>
              <p style={{ color: '#1e293b', marginTop: '0.5rem', marginBottom: 0 }}>
                References a Secret containing tls.crt and tls.key. Cert-manager can auto-create this.
              </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <code style={{ background: 'white', padding: '0.2rem 0.5rem', borderRadius: '3px', color: '#9c0606ff', fontWeight: 600 }}>
                pathType: Prefix
              </code>
              <p style={{ color: '#1e293b', marginTop: '0.5rem', marginBottom: 0 }}>
                <strong>Prefix:</strong> /api/users matches /api/users/123<br />
                <strong>Exact:</strong> Only exact match<br />
                <strong>ImplementationSpecific:</strong> Controller decides (usually regex)
              </p>
            </div>

            <div>
              <code style={{ background: 'white', padding: '0.2rem 0.5rem', borderRadius: '3px', color: '#9c0606ff', fontWeight: 600 }}>
                annotations
              </code>
              <p style={{ color: '#1e293b', marginTop: '0.5rem', marginBottom: 0 }}>
                Controller-specific config. NGINX uses nginx.ingress.kubernetes.io/*, Traefik uses traefik.ingress.kubernetes.io/*, etc.
              </p>
            </div>
          </div>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Ingress Controllers Compared</h2>

        <div style={{
          background: '#f8fafc',
          padding: '2rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          border: '2px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {Object.entries(ingressControllers).map(([key, controller]) => (
              <button
                key={key}
                onClick={() => setSelectedController(key)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: selectedController === key ? '2px solid #9c0606ff' : '2px solid #cbd5e1',
                  borderRadius: '6px',
                  background: selectedController === key ? '#fef2f2' : 'white',
                  cursor: 'pointer',
                  fontWeight: selectedController === key ? 600 : 400,
                  color: '#1e293b'
                }}
              >
                {controller.name}
              </button>
            ))}
          </div>

          <div style={{
            padding: '1.5rem',
            background: 'white',
            borderRadius: '8px',
            border: '2px solid #9c0606ff'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b', fontSize: '1.3rem' }}>
              {ingressControllers[selectedController as keyof typeof ingressControllers].name}
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Vendor
                </div>
                <div style={{ color: '#1e293b', fontSize: '1.05rem' }}>
                  {ingressControllers[selectedController as keyof typeof ingressControllers].vendor}
                </div>
              </div>
              
              <div>
                <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Implementation
                </div>
                <div style={{ color: '#1e293b', fontSize: '1.05rem' }}>
                  {ingressControllers[selectedController as keyof typeof ingressControllers].implementation}
                </div>
              </div>
              
              <div>
                <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Key Features
                </div>
                <div style={{ color: '#1e293b', fontSize: '1.05rem' }}>
                  {ingressControllers[selectedController as keyof typeof ingressControllers].features}
                </div>
              </div>
              
              <div>
                <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Performance
                </div>
                <div style={{ color: '#1e293b', fontSize: '1.05rem' }}>
                  {ingressControllers[selectedController as keyof typeof ingressControllers].performance}
                </div>
              </div>
              
              <div>
                <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Complexity
                </div>
                <div style={{ color: '#1e293b', fontSize: '1.05rem' }}>
                  {ingressControllers[selectedController as keyof typeof ingressControllers].complexity}
                </div>
              </div>
              
              <div>
                <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Best For
                </div>
                <div style={{ color: '#1e293b', fontSize: '1.05rem' }}>
                  {ingressControllers[selectedController as keyof typeof ingressControllers].useCase}
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 style={{ color: '#1e293b', marginTop: '2rem' }}>Installation Examples</h3>

        <div style={{ marginTop: '1.5rem' }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>NGINX Ingress Controller</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6' }}>
              Most popular choice. Battle-tested, well-documented. Two versions exist: Kubernetes community
              version (recommended) and NGINX Inc version.
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              background: '#1e293b',
              color: '#10b981',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflowX: 'auto'
            }}>
              # Install via Helm<br />
              helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx<br />
              helm install nginx-ingress ingress-nginx/ingress-nginx<br />
              <br />
              # Or via kubectl<br />
              kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml<br />
              <br />
              # Get the external IP<br />
              kubectl get svc -n ingress-nginx
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Traefik</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6' }}>
              Modern, with a nice dashboard. Automatic Let's Encrypt integration. Supports TCP/UDP routing
              and middlewares (rate limiting, auth, etc.).
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              background: '#1e293b',
              color: '#10b981',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflowX: 'auto'
            }}>
              # Install via Helm<br />
              helm repo add traefik https://traefik.github.io/charts<br />
              helm install traefik traefik/traefik<br />
              <br />
              # Access dashboard<br />
              kubectl port-forward -n traefik {"$(kubectl get pods -n traefik -o name | head -n 1)"} 9000:9000<br />
              # Open http://localhost:9000/dashboard/
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Istio Gateway (Service Mesh)</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6' }}>
              Not just Ingress—full service mesh with mTLS, retries, circuit breaking, observability.
              Overkill for simple routing, but powerful for microservices.
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              background: '#1e293b',
              color: '#10b981',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflowX: 'auto'
            }}>
              # Install Istio<br />
              istioctl install --set profile=demo<br />
              <br />
              # Gateway instead of Ingress:<br />
              {"apiVersion: networking.istio.io/v1beta1"}<br />
              {"kind: Gateway"}<br />
              {"metadata:"}<br />
              {"  name: my-gateway"}<br />
              {"spec:"}<br />
              {"  servers:"}<br />
              {"  - port:"}<br />
              {"      number: 80"}<br />
              {"      name: http"}<br />
              {"      protocol: HTTP"}<br />
              {"    hosts:"}<br />
              {"    - '*.example.com'"}
            </div>
          </div>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>TLS Termination</h2>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b' }}>
          Ingress handles TLS by storing certificates in Kubernetes Secrets. You can create them manually
          or use cert-manager to automatically provision Let's Encrypt certificates.
        </p>

        <div style={{
          background: '#f8fafc',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ marginTop: 0, color: '#1e293b' }}>Option 1: Manual Certificate</h3>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            background: '#1e293b',
            color: '#10b981',
            padding: '1rem',
            borderRadius: '6px',
            marginTop: '0.5rem',
            overflowX: 'auto'
          }}>
            # Create TLS secret from cert files<br />
            kubectl create secret tls example-tls \<br />
            {"  --cert=path/to/tls.crt \\"}<br />
            {"  --key=path/to/tls.key"}<br />
            <br />
            # Reference in Ingress:<br />
            {"tls:"}<br />
            {"- hosts:"}<br />
            {"  - example.com"}<br />
            {"  secretName: example-tls"}
          </div>
        </div>

        <div style={{
          background: '#f8fafc',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1rem',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ marginTop: 0, color: '#1e293b' }}>Option 2: cert-manager (Recommended)</h3>
          <p style={{ color: '#1e293b', lineHeight: '1.6' }}>
            Automatically requests, renews, and installs certificates from Let's Encrypt or other ACME providers.
          </p>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            background: '#1e293b',
            color: '#10b981',
            padding: '1rem',
            borderRadius: '6px',
            marginTop: '0.5rem',
            overflowX: 'auto'
          }}>
            # Install cert-manager<br />
            kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml<br />
            <br />
            # Create ClusterIssuer for Let's Encrypt<br />
            {"apiVersion: cert-manager.io/v1"}<br />
            {"kind: ClusterIssuer"}<br />
            {"metadata:"}<br />
            {"  name: letsencrypt-prod"}<br />
            {"spec:"}<br />
            {"  acme:"}<br />
            {"    server: https://acme-v02.api.letsencrypt.org/directory"}<br />
            {"    email: you@example.com"}<br />
            {"    privateKeySecretRef:"}<br />
            {"      name: letsencrypt-prod"}<br />
            {"    solvers:"}<br />
            {"    - http01:"}<br />
            {"        ingress:"}<br />
            {"          class: nginx"}<br />
            <br />
            # Annotate your Ingress:<br />
            {"annotations:"}<br />
            {"  cert-manager.io/cluster-issuer: letsencrypt-prod"}<br />
            <br />
            # cert-manager will automatically create the Secret!
          </div>
        </div>

        <div style={{
          background: '#fef3c7',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          borderLeft: '4px solid #f59e0b'
        }}>
          <p style={{ margin: 0, color: '#1e293b', lineHeight: '1.6' }}>
            <strong>Let's Encrypt Rate Limits:</strong> 50 certificates per registered domain per week.
            Use the staging environment (acme-staging-v02.api.letsencrypt.org) for testing to avoid hitting
            limits. Switch to prod once you're confident.
          </p>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Real-World Traffic Flow (Complete Picture)</h2>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b' }}>
          Let's trace a request from a user's browser to a Pod, hitting every component:
        </p>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          border: '2px solid #9c0606ff'
        }}>
          <div style={{ fontSize: '1.05rem', color: '#1e293b', lineHeight: '1.8' }}>
            <div style={{
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '2px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#3b82f6',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600
                }}>
                  1
                </div>
                <strong>DNS Resolution</strong>
              </div>
              <div style={{ marginLeft: '42px', color: '#475569' }}>
                User types example.com → DNS returns 1.2.3.4 (your LoadBalancer IP)
              </div>
            </div>

            <div style={{
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '2px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#3b82f6',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600
                }}>
                  2
                </div>
                <strong>Cloud LoadBalancer</strong>
              </div>
              <div style={{ marginLeft: '42px', color: '#475569' }}>
                AWS ELB / GCP Load Balancer / Azure Load Balancer receives HTTPS on port 443.
                Routes to any node running the Ingress controller (NodePort or direct Pod routing).
              </div>
            </div>

            <div style={{
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '2px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#3b82f6',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600
                }}>
                  3
                </div>
                <strong>Ingress Controller Pod</strong>
              </div>
              <div style={{ marginLeft: '42px', color: '#475569' }}>
                NGINX/Traefik Pod receives the request. Decrypts TLS using certificate from Secret.
                Examines Host header and path. Matches Ingress rule.
              </div>
            </div>

            <div style={{
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '2px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#3b82f6',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600
                }}>
                  4
                </div>
                <strong>Service (ClusterIP)</strong>
              </div>
              <div style={{ marginLeft: '42px', color: '#475569' }}>
                Controller sends HTTP (unencrypted) to Service IP (e.g., 10.96.0.1:8080).
                kube-proxy/eBPF intercepts and load balances to a backend Pod IP.
              </div>
            </div>

            <div style={{
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '2px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#3b82f6',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600
                }}>
                  5
                </div>
                <strong>Application Pod</strong>
              </div>
              <div style={{ marginLeft: '42px', color: '#475569' }}>
                Your app receives HTTP request on 10.244.1.5:8080. Processes it. Returns response.
              </div>
            </div>

            <div style={{
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '2px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#10b981',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600
                }}>
                  6
                </div>
                <strong>Response Path</strong>
              </div>
              <div style={{ marginLeft: '42px', color: '#475569' }}>
                Pod → Service → Ingress Controller (re-encrypts to HTTPS) → LoadBalancer → User's browser
              </div>
            </div>

            <div style={{
              background: '#f0fdf4',
              padding: '1rem',
              borderRadius: '6px',
              border: '2px solid #10b981'
            }}>
              <strong>Total latency added:</strong> ~2-5ms (TLS handshake + routing)
            </div>
          </div>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Common Patterns & Gotchas</h2>

        <div style={{ marginTop: '1.5rem' }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Pattern: Multiple Domains</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6' }}>
              You can route multiple domains to different services in one Ingress:
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: '#1e293b',
              color: '#10b981',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflowX: 'auto'
            }}>
              {"rules:"}<br />
              {"- host: api.example.com"}<br />
              {"  http:"}<br />
              {"    paths:"}<br />
              {"    - path: /"}<br />
              {"      backend: {service: {name: api-service}}"}<br />
              {"- host: www.example.com"}<br />
              {"  http:"}<br />
              {"    paths:"}<br />
              {"    - path: /"}<br />
              {"      backend: {service: {name: web-service}}"}
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Pattern: Redirect HTTP to HTTPS</h4>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: '#1e293b',
              color: '#10b981',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflowX: 'auto'
            }}>
              {"annotations:"}<br />
              {"  nginx.ingress.kubernetes.io/ssl-redirect: 'true'"}<br />
              {"  # Or force HTTPS:"}<br />
              {"  nginx.ingress.kubernetes.io/force-ssl-redirect: 'true'"}
            </div>
          </div>

          <div style={{
            background: '#fef2f2',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            borderLeft: '4px solid #ef4444'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Gotcha: Path rewriting</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
              If you route /api to a service that expects /, you need rewrite rules:
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: 'white',
              color: '#1e293b',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflowX: 'auto'
            }}>
              {"# Request: /api/users → Backend receives: /users"}<br />
              {"annotations:"}<br />
              {"  nginx.ingress.kubernetes.io/rewrite-target: /$2"}<br />
              {"paths:"}<br />
              {"- path: /api(/|$)(.*)"}<br />
              {"  pathType: ImplementationSpecific"}
            </div>
          </div>

          <div style={{
            background: '#fef2f2',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            borderLeft: '4px solid #ef4444'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Gotcha: Default backend</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
              Without a default backend, unmatched requests return 404 from the Ingress controller itself.
              Deploy a custom 404 service:
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: 'white',
              color: '#1e293b',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflowX: 'auto'
            }}>
              {"spec:"}<br />
              {"  defaultBackend:"}<br />
              {"    service:"}<br />
              {"      name: default-backend"}<br />
              {"      port:"}<br />
              {"        number: 80"}
            </div>
          </div>

          <div style={{
            background: '#fef2f2',
            padding: '1.5rem',
            borderRadius: '8px',
            borderLeft: '4px solid #ef4444'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Gotcha: CORS and headers</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
              Frontend calling API from different origin? Configure CORS at the Ingress level:
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: 'white',
              color: '#1e293b',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflowX: 'auto'
            }}>
              {"annotations:"}<br />
              {"  nginx.ingress.kubernetes.io/enable-cors: 'true'"}<br />
              {"  nginx.ingress.kubernetes.io/cors-allow-origin: '*'"}<br />
              {"  nginx.ingress.kubernetes.io/cors-allow-methods: 'GET, POST, OPTIONS'"}<br />
              {"  nginx.ingress.kubernetes.io/cors-allow-headers: 'Authorization, Content-Type'"}
            </div>
          </div>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>When NOT to Use Ingress</h2>

        <ul style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b' }}>
          <li>
            <strong>Non-HTTP protocols:</strong> Use LoadBalancer or NodePort for TCP/UDP services (databases, game servers, etc.)
          </li>
          <li>
            <strong>Single service:</strong> If you only expose one service, LoadBalancer is simpler
          </li>
          <li>
            <strong>Internal traffic:</strong> For pod-to-pod or service-to-service, use ClusterIP Services directly
          </li>
          <li>
            <strong>Cost sensitivity:</strong> Ingress needs a LoadBalancer ($$). For dev, use port-forward or NodePort
          </li>
        </ul>

        <div style={{
          background: 'linear-gradient(to right, #dbeafe, #bfdbfe)',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '2rem',
          borderLeft: '4px solid #3b82f6'
        }}>
          <p style={{ margin: 0, color: '#1e293b', lineHeight: '1.6' }}>
            <strong>Pro Tip:</strong> In production, combine Ingress with ExternalDNS for automatic DNS management,
            and cert-manager for automatic TLS. This trinity (Ingress + ExternalDNS + cert-manager) gives you
            fully automated, secure ingress with zero manual DNS or certificate work.
          </p>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>The Big Picture</h2>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b' }}>
          Ingress is the standard way to expose HTTP services in Kubernetes. It's more flexible than LoadBalancer
          (one IP for multiple services, path routing) and more powerful than NodePort (TLS, virtual hosting).
          The controller ecosystem is mature—pick one that fits your needs and stick with it.
        </p>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b' }}>
          For most use cases, <strong>NGINX Ingress + cert-manager</strong> is the sweet spot: well-documented,
          performant, and has every feature you'd need. If you want something more modern with a better UX,
          try <strong>Traefik</strong>. If you're building a complex microservices architecture, consider
          <strong> Istio Gateway</strong> for the full service mesh experience.
        </p>

        <div style={{
          background: 'linear-gradient(to right, #fef3c7, #fde68a)',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '2rem',
          borderLeft: '4px solid #f59e0b'
        }}>
          <p style={{ margin: 0, color: '#1e293b', lineHeight: '1.6' }}>
            <strong>Remember:</strong> Ingress resources are just config. The controller is the actual software
            doing the work. Understanding this separation helps debug issues—check the controller logs, not the
            Ingress YAML, when traffic isn't flowing.
          </p>
        </div>

        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/module-6-1" legacyBehavior>
            <a style={{ color: '#9c0606ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              ← Previous: Kubernetes Networking Model
            </a>
          </Link>
          <Link href="/learning-modules" legacyBehavior>
            <a style={{
              background: '#9c0606ff',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: 600
            }}>
              Complete Part 6 →
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
}
