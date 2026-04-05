import { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Module61() {
  const [selectedPod, setSelectedPod] = useState<string | null>(null);
  const [showPacketFlow, setShowPacketFlow] = useState(false);
  const [selectedCNI, setSelectedCNI] = useState('calico');

  const pods = {
    'pod-a': { name: 'frontend-abc123', ip: '10.244.1.5', node: 'node-1', nodeIP: '192.168.1.10' },
    'pod-b': { name: 'backend-xyz789', ip: '10.244.2.8', node: 'node-2', nodeIP: '192.168.1.11' },
    'pod-c': { name: 'database-def456', ip: '10.244.3.12', node: 'node-3', nodeIP: '192.168.1.12' }
  };

  const cniPlugins = {
    calico: {
      name: 'Calico',
      routing: 'BGP',
      encapsulation: 'VXLAN (optional)',
      networkPolicy: 'Yes (full support)',
      performance: 'High',
      complexity: 'Medium',
      useCase: 'Production clusters, strong network policies'
    },
    flannel: {
      name: 'Flannel',
      routing: 'Host routing table',
      encapsulation: 'VXLAN',
      networkPolicy: 'No',
      performance: 'Medium',
      complexity: 'Low',
      useCase: 'Simple clusters, learning'
    },
    weave: {
      name: 'Weave Net',
      routing: 'Mesh network',
      encapsulation: 'Sleeve (UDP)',
      networkPolicy: 'Yes',
      performance: 'Medium',
      complexity: 'Low',
      useCase: 'Multi-cloud, ease of use'
    },
    cilium: {
      name: 'Cilium',
      routing: 'eBPF',
      encapsulation: 'Geneve/VXLAN',
      networkPolicy: 'Yes (L7 aware)',
      performance: 'Very High',
      complexity: 'High',
      useCase: 'Modern clusters, observability, L7 policies'
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title} style={{ color: '#1e293b' }}>
          6.1 Kubernetes Networking Model
        </h1>

        <div style={{ marginBottom: '2rem' }}>
          <Link href="/module-5-3" legacyBehavior>
            <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              ← Previous: StatefulSets
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/learning-modules" legacyBehavior>
            <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              All Modules
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/module-6-2" legacyBehavior>
            <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              Next: Ingress →
            </a>
          </Link>
        </div>

        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#1e293b', maxWidth: '800px' }}>
          Kubernetes networking is weird. Every Pod gets its own IP. Pods can talk to other Pods without NAT.
          Services exist but they're not real—they're just load balancing rules in iptables (or eBPF).
          Let's demystify it.
        </p>

        <div style={{
          background: 'linear-gradient(to right, #fef3c7, #fde68a)',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '2rem',
          borderLeft: '4px solid #f59e0b'
        }}>
          <p style={{ margin: 0, color: '#1e293b', lineHeight: '1.6' }}>
            <strong>The Four Rules of Kubernetes Networking:</strong><br />
            1. All Pods can communicate with all other Pods without NAT<br />
            2. All Nodes can communicate with all Pods without NAT<br />
            3. The IP a Pod sees itself as is the same IP others see it as<br />
            4. How you implement this is up to you (CNI plugins)
          </p>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Pod-to-Pod Communication</h2>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b' }}>
          Unlike Docker's default bridge network, Kubernetes doesn't use NAT for Pod-to-Pod traffic.
          Every Pod gets a real IP from a cluster-wide CIDR range (often 10.244.0.0/16 or similar).
        </p>

        <div style={{
          background: '#f8fafc',
          padding: '2rem',
          borderRadius: '8px',
          marginTop: '2rem',
          border: '2px solid #e2e8f0'
        }}>
          <h3 style={{ marginTop: 0, color: '#1e293b' }}>Interactive: Pod Communication</h3>
          <p style={{ color: '#1e293b' }}>Select a source Pod to see how it communicates with another Pod:</p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            {Object.entries(pods).map(([key, pod]) => (
              <button
                key={key}
                onClick={() => setSelectedPod(key)}
                style={{
                  padding: '1rem',
                  border: selectedPod === key ? '3px solid #9c0606ff' : '2px solid #cbd5e1',
                  borderRadius: '8px',
                  background: selectedPod === key ? '#fef2f2' : 'white',
                  cursor: 'pointer',
                  flex: '1',
                  minWidth: '200px'
                }}
              >
                <div style={{ fontWeight: 600, color: '#1e293b' }}>{pod.name}</div>
                <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.5rem' }}>
                  Pod IP: {pod.ip}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  Node: {pod.node} ({pod.nodeIP})
                </div>
              </button>
            ))}
          </div>

          {selectedPod && (
            <div style={{ marginTop: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showPacketFlow}
                  onChange={(e) => setShowPacketFlow(e.target.checked)}
                  style={{ width: '20px', height: '20px' }}
                />
                <span style={{ color: '#1e293b', fontWeight: 600 }}>Show packet flow</span>
              </label>

              {showPacketFlow && (
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1.5rem',
                  background: 'white',
                  borderRadius: '8px',
                  border: '2px solid #9c0606ff'
                }}>
                  <h4 style={{ marginTop: 0, color: '#1e293b' }}>
                    From {pods[selectedPod as keyof typeof pods].name} to {pods['pod-b'].name}
                  </h4>
                  
                  <div style={{ marginTop: '1rem' }}>
                    {[
                      {
                        step: 1,
                        title: 'Application sends packet',
                        detail: `curl http://${pods['pod-b'].ip}:8080`,
                        description: 'The app in the Pod doesn\'t know about Kubernetes. It just sends to an IP.'
                      },
                      {
                        step: 2,
                        title: 'Pod network namespace',
                        detail: `Source: ${pods[selectedPod as keyof typeof pods].ip} → Dest: ${pods['pod-b'].ip}`,
                        description: 'Packet goes through the Pod\'s virtual ethernet (veth) pair.'
                      },
                      {
                        step: 3,
                        title: selectedPod === 'pod-b' ? 'Same node routing' : 'Cross-node routing',
                        detail: selectedPod === 'pod-b' 
                          ? 'Bridge forwards directly (no network hop)'
                          : `${pods[selectedPod as keyof typeof pods].nodeIP} → ${pods['pod-b'].nodeIP}`,
                        description: selectedPod === 'pod-b'
                          ? 'Both Pods are on the same node, so the bridge forwards the packet directly.'
                          : 'CNI plugin routes packet to the destination node. Could be VXLAN tunnel, BGP route, or direct routing.'
                      },
                      {
                        step: 4,
                        title: 'Destination Pod receives',
                        detail: `Pod ${pods['pod-b'].name} sees source IP as ${pods[selectedPod as keyof typeof pods].ip}`,
                        description: 'No NAT! The destination sees the real source IP.'
                      }
                    ].map((flow) => (
                      <div
                        key={flow.step}
                        style={{
                          marginBottom: '1rem',
                          padding: '1rem',
                          background: '#f8fafc',
                          borderRadius: '6px',
                          borderLeft: '4px solid #9c0606ff'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: '#9c0606ff',
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

                  <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: '#fef3c7',
                    borderRadius: '6px'
                  }}>
                    <strong style={{ color: '#1e293b' }}>Key Point:</strong>
                    <span style={{ color: '#1e293b', marginLeft: '0.5rem' }}>
                      The entire flow uses real IPs. No port mapping. No NAT. This is the Kubernetes networking model.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Wait, No NAT? How Does That Work?</h2>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b' }}>
          On traditional networks, private IPs (10.x.x.x, 192.168.x.x) get NAT'd when they leave the network.
          Kubernetes breaks this assumption. The cluster is a flat network where every Pod IP is routable.
        </p>

        <div style={{
          background: '#f8fafc',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ marginTop: 0, color: '#1e293b' }}>Docker vs Kubernetes Networking</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ padding: '1rem', background: 'white', borderRadius: '6px', border: '2px solid #cbd5e1' }}>
              <h4 style={{ marginTop: 0, color: '#1e293b' }}>Docker (default)</h4>
              <div style={{ fontSize: '0.95rem', color: '#1e293b', lineHeight: '1.6' }}>
                • Containers get private IPs (172.17.0.x)<br />
                • Host does NAT for outbound traffic<br />
                • Port mapping for inbound (-p 8080:80)<br />
                • Containers can't reach each other across hosts<br />
                • Need overlay network for multi-host
              </div>
            </div>
            
            <div style={{ padding: '1rem', background: 'white', borderRadius: '6px', border: '2px solid #9c0606ff' }}>
              <h4 style={{ marginTop: 0, color: '#1e293b' }}>Kubernetes</h4>
              <div style={{ fontSize: '0.95rem', color: '#1e293b', lineHeight: '1.6' }}>
                • Pods get routable IPs (10.244.x.x)<br />
                • No NAT between Pods<br />
                • No port mapping needed<br />
                • Any Pod can reach any Pod<br />
                • CNI plugin handles routing magic
              </div>
            </div>
          </div>
        </div>

        <div style={{
          background: '#fef2f2',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          borderLeft: '4px solid #ef4444'
        }}>
          <p style={{ margin: 0, color: '#1e293b', lineHeight: '1.6' }}>
            <strong>Wait, but my Pods DO get NAT'd!</strong><br />
            Yes, for traffic <em>leaving</em> the cluster (to the internet). Kubernetes does SNAT (Source NAT) so external
            services see your Node IPs, not Pod IPs. But <strong>inside</strong> the cluster, Pod-to-Pod traffic is
            direct and un-NAT'd.
          </p>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>CNI Plugins: The Magic Behind the Curtain</h2>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b' }}>
          CNI (Container Network Interface) is a spec. When a Pod starts, kubelet calls a CNI plugin to:
        </p>

        <ul style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b' }}>
          <li>Allocate an IP address from the cluster CIDR</li>
          <li>Create a network interface in the Pod's namespace</li>
          <li>Set up routes so the Pod can reach other Pods</li>
          <li>Configure the node's network to forward traffic correctly</li>
        </ul>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b' }}>
          Different plugins do this differently. Some use overlays (VXLAN), some use BGP, some use eBPF.
          They all implement the same interface, but the underlying tech varies.
        </p>

        <div style={{
          background: '#f8fafc',
          padding: '2rem',
          borderRadius: '8px',
          marginTop: '2rem',
          border: '2px solid #e2e8f0'
        }}>
          <h3 style={{ marginTop: 0, color: '#1e293b' }}>Interactive: CNI Plugin Comparison</h3>
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {Object.entries(cniPlugins).map(([key, plugin]) => (
              <button
                key={key}
                onClick={() => setSelectedCNI(key)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: selectedCNI === key ? '2px solid #9c0606ff' : '2px solid #cbd5e1',
                  borderRadius: '6px',
                  background: selectedCNI === key ? '#fef2f2' : 'white',
                  cursor: 'pointer',
                  fontWeight: selectedCNI === key ? 600 : 400,
                  color: '#1e293b'
                }}
              >
                {plugin.name}
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
              {cniPlugins[selectedCNI as keyof typeof cniPlugins].name}
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Routing Method
                </div>
                <div style={{ color: '#1e293b', fontSize: '1.05rem' }}>
                  {cniPlugins[selectedCNI as keyof typeof cniPlugins].routing}
                </div>
              </div>
              
              <div>
                <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Encapsulation
                </div>
                <div style={{ color: '#1e293b', fontSize: '1.05rem' }}>
                  {cniPlugins[selectedCNI as keyof typeof cniPlugins].encapsulation}
                </div>
              </div>
              
              <div>
                <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Network Policy
                </div>
                <div style={{ color: '#1e293b', fontSize: '1.05rem' }}>
                  {cniPlugins[selectedCNI as keyof typeof cniPlugins].networkPolicy}
                </div>
              </div>
              
              <div>
                <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Performance
                </div>
                <div style={{ color: '#1e293b', fontSize: '1.05rem' }}>
                  {cniPlugins[selectedCNI as keyof typeof cniPlugins].performance}
                </div>
              </div>
              
              <div>
                <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Complexity
                </div>
                <div style={{ color: '#1e293b', fontSize: '1.05rem' }}>
                  {cniPlugins[selectedCNI as keyof typeof cniPlugins].complexity}
                </div>
              </div>
              
              <div>
                <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Best For
                </div>
                <div style={{ color: '#1e293b', fontSize: '1.05rem' }}>
                  {cniPlugins[selectedCNI as keyof typeof cniPlugins].useCase}
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 style={{ color: '#1e293b', marginTop: '2rem' }}>Breaking Down CNI Plugins</h3>

        <div style={{ marginTop: '1.5rem' }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Calico</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6' }}>
              Uses BGP (Border Gateway Protocol) to program routes directly in the kernel routing table.
              No overlay by default—just pure IP routing. Can optionally use VXLAN for environments that
              don't support BGP. Strong NetworkPolicy implementation with iptables or eBPF.
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
              # Install Calico<br />
              kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml<br />
              <br />
              # Each node gets routes like this:<br />
              10.244.1.0/24 via 192.168.1.10 dev eth0<br />
              10.244.2.0/24 via 192.168.1.11 dev eth0
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Flannel</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6' }}>
              The simplest CNI. Uses VXLAN to create an overlay network. Every packet gets wrapped in a VXLAN
              header with the destination node's IP. Easy to set up, but no NetworkPolicy support (you need
              Calico on top for that—yes, you can run both).
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
              # Install Flannel<br />
              kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml<br />
              <br />
              # Creates a flannel.1 interface on each node<br />
              # All Pod traffic goes through the VXLAN tunnel
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Cilium</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6' }}>
              Uses eBPF (extended Berkeley Packet Filter) to program the Linux kernel directly. Extremely fast
              because it bypasses iptables entirely. Can enforce NetworkPolicies at Layer 7 (HTTP level). Also
              provides excellent observability with Hubble. The future of Kubernetes networking.
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
              # Install Cilium<br />
              cilium install<br />
              <br />
              # Can block HTTP methods:<br />
              {"apiVersion: cilium.io/v2"}<br />
              {"kind: CiliumNetworkPolicy"}<br />
              {"spec:"}<br />
              {"  endpointSelector: {}"}<br />
              {"  egress:"}<br />
              {"  - toFQDNs:"}<br />
              {"    - matchPattern: '*.google.com'"}<br />
              {"    toPorts:"}<br />
              {"    - ports:"}<br />
              {"      - port: '443'"}<br />
              {"        protocol: TCP"}
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Weave Net</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6' }}>
              Creates a mesh network where every node talks to every other node. Automatically handles
              multi-cloud scenarios. Uses "fast datapath" (kernel-based) when possible, falls back to
              "sleeve" mode (userspace) when needed. Good for hybrid cloud.
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
              # Install Weave<br />
              kubectl apply -f https://github.com/weaveworks/weave/releases/download/v2.8.1/weave-daemonset-k8s.yaml<br />
              <br />
              # Each node runs a weave router<br />
              # Automatically discovers peers and forms mesh
            </div>
          </div>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>What About Services?</h2>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b' }}>
          Services are not part of the networking model—they're built <em>on top</em> of it. A Service is
          just a virtual IP (ClusterIP) that load balances to Pod IPs. The implementation is usually:
        </p>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          border: '2px solid #e2e8f0'
        }}>
          <h4 style={{ marginTop: 0, color: '#1e293b' }}>kube-proxy (iptables mode)</h4>
          <p style={{ color: '#1e293b', lineHeight: '1.6', marginBottom: '1rem' }}>
            For every Service, kube-proxy writes iptables rules on every node. When a Pod sends traffic to
            a Service IP (e.g., 10.96.0.1), iptables randomly picks a backend Pod and rewrites the destination
            to the Pod's IP. The return traffic is un-NATed back to the Service IP.
          </p>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            background: '#1e293b',
            color: '#10b981',
            padding: '1rem',
            borderRadius: '6px',
            overflowX: 'auto'
          }}>
            # iptables rules for a Service with 3 backends:<br />
            -A KUBE-SERVICES -d 10.96.0.1/32 -p tcp -m tcp --dport 80 -j KUBE-SVC-XYZ<br />
            <br />
            -A KUBE-SVC-XYZ -m statistic --mode random --probability 0.33 -j KUBE-SEP-1<br />
            -A KUBE-SVC-XYZ -m statistic --mode random --probability 0.50 -j KUBE-SEP-2<br />
            -A KUBE-SVC-XYZ -j KUBE-SEP-3<br />
            <br />
            -A KUBE-SEP-1 -p tcp -m tcp -j DNAT --to-destination 10.244.1.5:8080<br />
            -A KUBE-SEP-2 -p tcp -m tcp -j DNAT --to-destination 10.244.2.8:8080<br />
            -A KUBE-SEP-3 -p tcp -m tcp -j DNAT --to-destination 10.244.3.12:8080
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1rem',
          border: '2px solid #e2e8f0'
        }}>
          <h4 style={{ marginTop: 0, color: '#1e293b' }}>kube-proxy (IPVS mode)</h4>
          <p style={{ color: '#1e293b', lineHeight: '1.6', marginBottom: '1rem' }}>
            Instead of iptables, uses IPVS (IP Virtual Server) for load balancing. Better performance at scale
            (1000+ services). Supports more load balancing algorithms (round-robin, least connection, etc.).
          </p>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            background: '#1e293b',
            color: '#10b981',
            padding: '1rem',
            borderRadius: '6px',
            overflowX: 'auto'
          }}>
            # Enable IPVS mode in kube-proxy ConfigMap:<br />
            mode: "ipvs"<br />
            ipvs:<br />
            {"  scheduler: 'rr'  # round-robin"}<br />
            <br />
            # View IPVS rules:<br />
            ipvsadm -Ln<br />
            TCP  10.96.0.1:80 rr<br />
            {"  -> 10.244.1.5:8080    Masq    1      0          0"}<br />
            {"  -> 10.244.2.8:8080    Masq    1      0          0"}<br />
            {"  -> 10.244.3.12:8080   Masq    1      0          0"}
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1rem',
          border: '2px solid #e2e8f0'
        }}>
          <h4 style={{ marginTop: 0, color: '#1e293b' }}>Cilium (eBPF mode)</h4>
          <p style={{ color: '#1e293b', lineHeight: '1.6', marginBottom: '1rem' }}>
            Replaces kube-proxy entirely. Load balancing happens in eBPF, which is faster than both iptables
            and IPVS. Can also do socket-level load balancing, meaning traffic never even leaves the Pod's
            network namespace if the backend is local.
          </p>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            background: '#1e293b',
            color: '#10b981',
            padding: '1rem',
            borderRadius: '6px',
            overflowX: 'auto'
          }}>
            # Install Cilium with kube-proxy replacement:<br />
            cilium install --set kubeProxyReplacement=strict<br />
            <br />
            # All Service load balancing happens in eBPF<br />
            # Can handle 10M+ connections/sec
          </div>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Common Networking Issues</h2>

        <div style={{ marginTop: '1.5rem' }}>
          <div style={{
            background: '#fef2f2',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            borderLeft: '4px solid #ef4444'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Problem: Pods can't reach each other</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
              <strong>Diagnosis:</strong> Check if CNI plugin is installed. Look at pod logs in kube-system
              namespace (calico-node, cilium, flannel, etc.). Verify nodes have correct routes.
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              background: 'white',
              color: '#1e293b',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem'
            }}>
              kubectl get pods -n kube-system | grep -E 'calico|cilium|flannel|weave'<br />
              ip route  # On the node<br />
              kubectl logs -n kube-system calico-node-xxxxx
            </div>
          </div>

          <div style={{
            background: '#fef2f2',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            borderLeft: '4px solid #ef4444'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Problem: Services don't work</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
              <strong>Diagnosis:</strong> Check kube-proxy is running. Verify iptables/IPVS rules exist.
              Make sure the Service has endpoints (backend Pods).
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              background: 'white',
              color: '#1e293b',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem'
            }}>
              kubectl get svc my-service<br />
              kubectl get endpoints my-service  # Should list Pod IPs<br />
              kubectl logs -n kube-system kube-proxy-xxxxx<br />
              sudo iptables-save | grep my-service
            </div>
          </div>

          <div style={{
            background: '#fef2f2',
            padding: '1.5rem',
            borderRadius: '8px',
            borderLeft: '4px solid #ef4444'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Problem: NetworkPolicy blocks everything</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
              <strong>Diagnosis:</strong> By default, Pods accept all traffic. Once you create <em>any</em>
              NetworkPolicy that selects a Pod, it becomes deny-by-default. You need to explicitly allow DNS.
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              background: 'white',
              color: '#1e293b',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem'
            }}>
              # Always allow DNS:<br />
              {"egress:"}<br />
              {"- to:"}<br />
              {"  - namespaceSelector:"}<br />
              {"      matchLabels:"}<br />
              {"        name: kube-system"}<br />
              {"  ports:"}<br />
              {"  - protocol: UDP"}<br />
              {"    port: 53"}
            </div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(to right, #dbeafe, #bfdbfe)',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '2rem',
          borderLeft: '4px solid #3b82f6'
        }}>
          <p style={{ margin: 0, color: '#1e293b', lineHeight: '1.6' }}>
            <strong>Pro Tip:</strong> Use <code style={{ background: 'white', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>kubectl run -it --rm debug --image=nicolaka/netshoot --restart=Never -- bash</code>
            to spin up a debug Pod with all the networking tools (curl, dig, tcpdump, etc.). Essential for
            troubleshooting.
          </p>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>The Big Picture</h2>

        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          border: '2px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '1.05rem', color: '#1e293b', lineHeight: '1.8' }}>
            <strong>The Kubernetes Networking Stack:</strong>
            <ol style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Pod IPs (CNI plugin):</strong> Every Pod gets a unique IP. CNI handles allocation and routing.
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Services (kube-proxy or eBPF):</strong> Virtual IPs that load balance to Pod IPs. Implemented with iptables, IPVS, or eBPF.
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Ingress (next module):</strong> HTTP/HTTPS load balancing from outside the cluster to Services.
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>NetworkPolicy (CNI plugin):</strong> Firewall rules between Pods. Only works if your CNI supports it.
              </li>
            </ol>
          </div>
        </div>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b', marginTop: '2rem' }}>
          Understanding this stack is crucial. Most production issues involve networking. When something breaks,
          you need to know which layer is failing: Pod connectivity? Service discovery? External access?
        </p>

        <div style={{
          background: 'linear-gradient(to right, #fef3c7, #fde68a)',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '2rem',
          borderLeft: '4px solid #f59e0b'
        }}>
          <p style={{ margin: 0, color: '#1e293b', lineHeight: '1.6' }}>
            <strong>Remember:</strong> Kubernetes networking looks complicated because it solves a hard problem:
            making containers on different machines behave like they're on the same LAN, without requiring
            you to understand the details. Choose your CNI plugin based on your needs (simplicity vs features vs
            performance), and trust that the fundamental model—flat networking, no NAT—works.
          </p>
        </div>

        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/module-5-3" legacyBehavior>
            <a style={{ color: '#9c0606ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              ← Previous: StatefulSets
            </a>
          </Link>
          <Link href="/module-6-2" legacyBehavior>
            <a style={{
              background: '#9c0606ff',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: 600
            }}>
              Next: Ingress →
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
}
