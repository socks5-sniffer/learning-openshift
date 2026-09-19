import { useState } from 'react';
import styles from '../styles/Home.module.css';
import moduleStyles from '../styles/Module.module.css';
import ModuleShell from '../components/module/ModuleShell';
import Callout from '../components/module/Callout';
import TermBox from '../components/module/TermBox';

const pods = {
  'pod-a': { name: 'frontend-abc123', ip: '10.244.1.5', node: 'node-1', nodeIP: '192.168.1.10' },
  'pod-b': { name: 'backend-xyz789', ip: '10.244.2.8', node: 'node-2', nodeIP: '192.168.1.11' },
  'pod-c': { name: 'database-def456', ip: '10.244.3.12', node: 'node-3', nodeIP: '192.168.1.12' },
};

const cniPlugins = {
  calico: { name: 'Calico', routing: 'BGP', encapsulation: 'VXLAN (optional)', networkPolicy: 'Yes (full support)', performance: 'High', complexity: 'Medium', useCase: 'Production clusters, strong network policies' },
  flannel: { name: 'Flannel', routing: 'Host routing table', encapsulation: 'VXLAN', networkPolicy: 'No', performance: 'Medium', complexity: 'Low', useCase: 'Simple clusters, learning' },
  cilium: { name: 'Cilium', routing: 'eBPF', encapsulation: 'Geneve/VXLAN', networkPolicy: 'Yes (L7 aware)', performance: 'Very High', complexity: 'High', useCase: 'Modern clusters, observability, L7 policies' },
};

export default function Module61() {
  const [selectedPod, setSelectedPod] = useState<string | null>(null);
  const [showPacketFlow, setShowPacketFlow] = useState(false);
  const [selectedCNI, setSelectedCNI] = useState<keyof typeof cniPlugins>('calico');
  const cni = cniPlugins[selectedCNI];

  const field = (label: string, value: string) => (
    <div>
      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ color: 'var(--color-text-primary)', fontSize: '1.05rem' }}>{value}</div>
    </div>
  );

  return (
    <ModuleShell id="6-1">
      <section className={styles.spotlight}>
        <p>
          Kubernetes networking is weird. Every Pod gets its own IP. Pods can talk to other Pods without NAT.
          Services exist but they're not real—they're just load balancing rules in iptables (or eBPF).
          Let's demystify it.
        </p>

        <Callout variant="warning" title="The Four Rules of Kubernetes Networking">
          <p>
            1. All Pods can communicate with all other Pods without NAT<br />
            2. All Nodes can communicate with all Pods without NAT<br />
            3. The IP a Pod sees itself as is the same IP others see it as<br />
            4. How you implement this is up to you (CNI plugins)
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Pod-to-Pod Communication</h2>
        <p>
          Unlike Docker's default bridge network, Kubernetes doesn't use NAT for Pod-to-Pod traffic.
          Every Pod gets a real IP from a cluster-wide CIDR range (often 10.244.0.0/16 or similar).
        </p>

        <h3>Interactive: Pod Communication</h3>
        <p>Select a source Pod to see how it communicates with another Pod:</p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          {Object.entries(pods).map(([key, pod]) => (
            <button
              key={key}
              onClick={() => setSelectedPod(key)}
              style={{
                padding: '1rem',
                border: `2px solid ${selectedPod === key ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-md)',
                background: selectedPod === key ? 'var(--color-bg-secondary)' : 'var(--color-bg-elevated)',
                cursor: 'pointer',
                flex: '1',
                minWidth: '200px',
                textAlign: 'left',
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{pod.name}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Pod IP: {pod.ip}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Node: {pod.node} ({pod.nodeIP})</div>
            </button>
          ))}
        </div>

        {selectedPod && (
          <div style={{ marginTop: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={showPacketFlow} onChange={(e) => setShowPacketFlow(e.target.checked)} style={{ width: '20px', height: '20px' }} />
              <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Show packet flow</span>
            </label>

            {showPacketFlow && (
              <div style={{ marginTop: '1.5rem' }}>
                <h4>From {pods[selectedPod as keyof typeof pods].name} to {pods['pod-b'].name}</h4>

                {[
                  { step: 1, title: 'Application sends packet', detail: `curl http://${pods['pod-b'].ip}:8080`, description: "The app in the Pod doesn't know about Kubernetes. It just sends to an IP." },
                  { step: 2, title: 'Pod network namespace', detail: `Source: ${pods[selectedPod as keyof typeof pods].ip} → Dest: ${pods['pod-b'].ip}`, description: "Packet goes through the Pod's virtual ethernet (veth) pair." },
                  { step: 3, title: selectedPod === 'pod-b' ? 'Same node routing' : 'Cross-node routing', detail: selectedPod === 'pod-b' ? 'Bridge forwards directly (no network hop)' : `${pods[selectedPod as keyof typeof pods].nodeIP} → ${pods['pod-b'].nodeIP}`, description: selectedPod === 'pod-b' ? 'Both Pods are on the same node, so the bridge forwards the packet directly.' : 'CNI plugin routes packet to the destination node. Could be VXLAN tunnel, BGP route, or direct routing.' },
                  { step: 4, title: 'Destination Pod receives', detail: `Pod ${pods['pod-b'].name} sees source IP as ${pods[selectedPod as keyof typeof pods].ip}`, description: 'No NAT! The destination sees the real source IP.' },
                ].map((flow) => (
                  <div key={flow.step} style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.9rem' }}>{flow.step}</div>
                      <strong style={{ color: 'var(--color-text-primary)' }}>{flow.title}</strong>
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#10b981', background: '#0f172a', padding: '0.5rem', borderRadius: '4px', marginBottom: '0.5rem' }}>{flow.detail}</div>
                    <div style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>{flow.description}</div>
                  </div>
                ))}

                <Callout variant="warning" title="Key Point">
                  <p>The entire flow uses real IPs. No port mapping. No NAT. This is the Kubernetes networking model.</p>
                </Callout>
              </div>
            )}
          </div>
        )}
      </section>

      <section className={styles.spotlight}>
        <h2>Wait, No NAT? How Does That Work?</h2>
        <p>
          On traditional networks, private IPs (10.x.x.x, 192.168.x.x) get NAT'd when they leave the network.
          Kubernetes breaks this assumption. The cluster is a flat network where every Pod IP is routable.
        </p>

        <h3>Docker vs Kubernetes Networking</h3>
        <div className={moduleStyles.grid}>
          <Callout variant="neutral" title="Docker (default)">
            <p>
              • Containers get private IPs (172.17.0.x)<br />
              • Host does NAT for outbound traffic<br />
              • Port mapping for inbound (-p 8080:80)<br />
              • Containers can't reach each other across hosts<br />
              • Need overlay network for multi-host
            </p>
          </Callout>
          <Callout variant="danger" title="Kubernetes">
            <p>
              • Pods get routable IPs (10.244.x.x)<br />
              • No NAT between Pods<br />
              • No port mapping needed<br />
              • Any Pod can reach any Pod<br />
              • CNI plugin handles routing magic
            </p>
          </Callout>
        </div>

        <Callout variant="danger">
          <p>
            <strong>Wait, but my Pods DO get NAT'd!</strong><br />
            Yes, for traffic <em>leaving</em> the cluster (to the internet). Kubernetes does SNAT (Source NAT) so external
            services see your Node IPs, not Pod IPs. But <strong>inside</strong> the cluster, Pod-to-Pod traffic is
            direct and un-NAT'd.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>CNI Plugins: The Magic Behind the Curtain</h2>
        <p>CNI (Container Network Interface) is a spec. When a Pod starts, kubelet calls a CNI plugin to:</p>
        <ul>
          <li>Allocate an IP address from the cluster CIDR</li>
          <li>Create a network interface in the Pod's namespace</li>
          <li>Set up routes so the Pod can reach other Pods</li>
          <li>Configure the node's network to forward traffic correctly</li>
        </ul>
        <p>
          Different plugins do this differently. Some use overlays (VXLAN), some use BGP, some use eBPF.
          They all implement the same interface, but the underlying tech varies.
        </p>

        <h3>Interactive: CNI Plugin Comparison</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {Object.entries(cniPlugins).map(([key, plugin]) => (
            <button
              key={key}
              onClick={() => setSelectedCNI(key as keyof typeof cniPlugins)}
              style={{
                padding: '0.75rem 1.5rem',
                border: `2px solid ${selectedCNI === key ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-sm)',
                background: selectedCNI === key ? 'var(--color-bg-secondary)' : 'var(--color-bg-elevated)',
                cursor: 'pointer',
                fontWeight: selectedCNI === key ? 600 : 400,
                color: 'var(--color-text-primary)',
              }}
            >
              {plugin.name}
            </button>
          ))}
        </div>

        <div style={{ padding: '1.5rem', background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <h4 style={{ marginTop: 0, fontSize: '1.3rem' }}>{cni.name}</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {field('Routing Method', cni.routing)}
            {field('Encapsulation', cni.encapsulation)}
            {field('Network Policy', cni.networkPolicy)}
            {field('Performance', cni.performance)}
            {field('Complexity', cni.complexity)}
            {field('Best For', cni.useCase)}
          </div>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>Breaking Down CNI Plugins</h2>

        <Callout variant="neutral" title="Calico">
          <p>
            Uses BGP (Border Gateway Protocol) to program routes directly in the kernel routing table.
            No overlay by default—just pure IP routing. Can optionally use VXLAN for environments that
            don't support BGP. Strong NetworkPolicy implementation with iptables or eBPF.
          </p>
          <TermBox>
            <div style={{ color: '#64748b' }}># Install Calico</div>
            <div style={{ color: '#10b981' }}>kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml</div>
            <br />
            <div style={{ color: '#64748b' }}># Each node gets routes like this:</div>
            <div style={{ color: '#10b981' }}>10.244.1.0/24 via 192.168.1.10 dev eth0</div>
            <div style={{ color: '#10b981' }}>10.244.2.0/24 via 192.168.1.11 dev eth0</div>
          </TermBox>
        </Callout>

        <Callout variant="neutral" title="Flannel">
          <p>
            The simplest CNI. Uses VXLAN to create an overlay network. Every packet gets wrapped in a VXLAN
            header with the destination node's IP. Easy to set up, but no NetworkPolicy support (you need
            Calico on top for that—yes, you can run both).
          </p>
          <TermBox>
            <div style={{ color: '#64748b' }}># Install Flannel</div>
            <div style={{ color: '#10b981' }}>kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml</div>
            <br />
            <div style={{ color: '#64748b' }}># Creates a flannel.1 interface on each node</div>
            <div style={{ color: '#64748b' }}># All Pod traffic goes through the VXLAN tunnel</div>
          </TermBox>
        </Callout>

        <Callout variant="neutral" title="Cilium">
          <p>
            Uses eBPF (extended Berkeley Packet Filter) to program the Linux kernel directly. Extremely fast
            because it bypasses iptables entirely. Can enforce NetworkPolicies at Layer 7 (HTTP level). Also
            provides excellent observability with Hubble. The future of Kubernetes networking.
          </p>
          <TermBox>
            <div style={{ color: '#64748b' }}># Install Cilium</div>
            <div style={{ color: '#10b981' }}>cilium install</div>
            <br />
            <div style={{ color: '#64748b' }}># Can block HTTP methods:</div>
            <div style={{ color: '#10b981' }}>apiVersion: cilium.io/v2</div>
            <div style={{ color: '#10b981' }}>kind: CiliumNetworkPolicy</div>
            <div style={{ color: '#10b981' }}>spec:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;endpointSelector: {'{}'}</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;egress:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- toFQDNs:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;- matchPattern: '*.google.com'</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;toPorts:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;- ports:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- port: '443'</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;protocol: TCP</div>
          </TermBox>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>What About Services?</h2>
        <p>
          Services are not part of the networking model—they're built <em>on top</em> of it. A Service is
          just a virtual IP (ClusterIP) that load balances to Pod IPs. The implementation is usually:
        </p>

        <h3>kube-proxy (iptables mode)</h3>
        <p>
          For every Service, kube-proxy writes iptables rules on every node. When a Pod sends traffic to
          a Service IP (e.g., 10.96.0.1), iptables randomly picks a backend Pod and rewrites the destination
          to the Pod's IP. The return traffic is un-NATed back to the Service IP.
        </p>
        <TermBox>
          <div style={{ color: '#64748b' }}># iptables rules for a Service with 3 backends:</div>
          <div style={{ color: '#10b981' }}>-A KUBE-SERVICES -d 10.96.0.1/32 -p tcp -m tcp --dport 80 -j KUBE-SVC-XYZ</div>
          <br />
          <div style={{ color: '#10b981' }}>-A KUBE-SVC-XYZ -m statistic --mode random --probability 0.33 -j KUBE-SEP-1</div>
          <div style={{ color: '#10b981' }}>-A KUBE-SVC-XYZ -m statistic --mode random --probability 0.50 -j KUBE-SEP-2</div>
          <div style={{ color: '#10b981' }}>-A KUBE-SVC-XYZ -j KUBE-SEP-3</div>
          <br />
          <div style={{ color: '#10b981' }}>-A KUBE-SEP-1 -p tcp -m tcp -j DNAT --to-destination 10.244.1.5:8080</div>
          <div style={{ color: '#10b981' }}>-A KUBE-SEP-2 -p tcp -m tcp -j DNAT --to-destination 10.244.2.8:8080</div>
          <div style={{ color: '#10b981' }}>-A KUBE-SEP-3 -p tcp -m tcp -j DNAT --to-destination 10.244.3.12:8080</div>
        </TermBox>

        <h3>kube-proxy (IPVS mode)</h3>
        <p>
          Instead of iptables, uses IPVS (IP Virtual Server) for load balancing. Better performance at scale
          (1000+ services). Supports more load balancing algorithms (round-robin, least connection, etc.).
        </p>
        <TermBox>
          <div style={{ color: '#64748b' }}># Enable IPVS mode in kube-proxy ConfigMap:</div>
          <div style={{ color: '#10b981' }}>mode: "ipvs"</div>
          <div style={{ color: '#10b981' }}>ipvs:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;scheduler: 'rr'  # round-robin</div>
          <br />
          <div style={{ color: '#64748b' }}># View IPVS rules:</div>
          <div style={{ color: '#10b981' }}>ipvsadm -Ln</div>
          <div style={{ color: '#10b981' }}>TCP  10.96.0.1:80 rr</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;-&gt; 10.244.1.5:8080    Masq    1      0          0</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;-&gt; 10.244.2.8:8080    Masq    1      0          0</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;-&gt; 10.244.3.12:8080   Masq    1      0          0</div>
        </TermBox>

        <h3>Cilium (eBPF mode)</h3>
        <p>
          Replaces kube-proxy entirely. Load balancing happens in eBPF, which is faster than both iptables
          and IPVS. Can also do socket-level load balancing, meaning traffic never even leaves the Pod's
          network namespace if the backend is local.
        </p>
        <TermBox>
          <div style={{ color: '#64748b' }}># Install Cilium with kube-proxy replacement:</div>
          <div style={{ color: '#10b981' }}>cilium install --set kubeProxyReplacement=strict</div>
          <br />
          <div style={{ color: '#64748b' }}># All Service load balancing happens in eBPF</div>
          <div style={{ color: '#64748b' }}># Can handle 10M+ connections/sec</div>
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>Common Networking Issues</h2>

        <Callout variant="danger" title="Problem: Pods can't reach each other">
          <p>
            <strong>Diagnosis:</strong> Check if CNI plugin is installed. Look at pod logs in kube-system
            namespace (calico-node, cilium, flannel, etc.). Verify nodes have correct routes.
          </p>
          <TermBox>
            <div style={{ color: '#e2e8f0' }}>kubectl get pods -n kube-system | grep -E 'calico|cilium|flannel'</div>
            <div style={{ color: '#e2e8f0' }}>ip route  # On the node</div>
            <div style={{ color: '#e2e8f0' }}>kubectl logs -n kube-system calico-node-xxxxx</div>
          </TermBox>
        </Callout>

        <Callout variant="danger" title="Problem: Services don't work">
          <p>
            <strong>Diagnosis:</strong> Check kube-proxy is running. Verify iptables/IPVS rules exist.
            Make sure the Service has endpoints (backend Pods).
          </p>
          <TermBox>
            <div style={{ color: '#e2e8f0' }}>kubectl get svc my-service</div>
            <div style={{ color: '#e2e8f0' }}>kubectl get endpoints my-service  # Should list Pod IPs</div>
            <div style={{ color: '#e2e8f0' }}>kubectl logs -n kube-system kube-proxy-xxxxx</div>
            <div style={{ color: '#e2e8f0' }}>sudo iptables-save | grep my-service</div>
          </TermBox>
        </Callout>

        <Callout variant="danger" title="Problem: NetworkPolicy blocks everything">
          <p>
            <strong>Diagnosis:</strong> By default, Pods accept all traffic. Once you create <em>any</em>
            NetworkPolicy that selects a Pod, it becomes deny-by-default. You need to explicitly allow DNS.
          </p>
          <TermBox>
            <div style={{ color: '#64748b' }}># Always allow DNS:</div>
            <div style={{ color: '#10b981' }}>egress:</div>
            <div style={{ color: '#10b981' }}>- to:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- namespaceSelector:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;matchLabels:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: kube-system</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;ports:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- protocol: UDP</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;port: 53</div>
          </TermBox>
        </Callout>

        <Callout variant="info" title="Pro Tip">
          <p>
            Use <code>kubectl run -it --rm debug --image=nicolaka/netshoot --restart=Never -- bash</code>
            to spin up a debug Pod with all the networking tools (curl, dig, tcpdump, etc.). Essential for
            troubleshooting.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>The Big Picture</h2>

        <Callout variant="neutral" title="The Kubernetes Networking Stack">
          <ol>
            <li><strong>Pod IPs (CNI plugin):</strong> Every Pod gets a unique IP. CNI handles allocation and routing.</li>
            <li><strong>Services (kube-proxy or eBPF):</strong> Virtual IPs that load balance to Pod IPs. Implemented with iptables, IPVS, or eBPF.</li>
            <li><strong>Ingress (next module):</strong> HTTP/HTTPS load balancing from outside the cluster to Services.</li>
            <li><strong>NetworkPolicy (CNI plugin):</strong> Firewall rules between Pods. Only works if your CNI supports it.</li>
          </ol>
        </Callout>

        <p>
          Understanding this stack is crucial. Most production issues involve networking. When something breaks,
          you need to know which layer is failing: Pod connectivity? Service discovery? External access?
        </p>

        <Callout variant="warning" title="Remember">
          <p>
            Kubernetes networking looks complicated because it solves a hard problem:
            making containers on different machines behave like they're on the same LAN, without requiring
            you to understand the details. Choose your CNI plugin based on your needs (simplicity vs features vs
            performance), and trust that the fundamental model—flat networking, no NAT—works.
          </p>
        </Callout>
      </section>
    </ModuleShell>
  );
}
