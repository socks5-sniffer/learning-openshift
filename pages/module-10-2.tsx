import { useState } from 'react'
import styles from '../styles/Home.module.css'
import ModuleShell from '../components/module/ModuleShell'
import Callout from '../components/module/Callout'
import TermBox from '../components/module/TermBox'

interface Provider {
  name: string
  fullName: string
  icon: string
  color: string
  company: string
  popularity: string
  description: string
  pricing: string
  theyHandle: string[]
  youHandle: string[]
  pros: string[]
  cons: string[]
  bestFor: string
  setupExample: string
}

const providers: Record<'eks' | 'gke' | 'aks' | 'openshift', Provider> = {
  eks: {
    name: 'Amazon EKS',
    fullName: 'Elastic Kubernetes Service',
    icon: '☁️',
    color: '#ff9900',
    company: 'AWS',
    popularity: '⭐⭐⭐⭐⭐',
    description: 'Amazon\'s managed Kubernetes service with AWS infrastructure and identity integrations.',
    pricing: 'Cluster fees vary by Kubernetes support tier; compute, storage, and networking are additional.',
    theyHandle: [
      'Control plane (API server, etcd, scheduler)',
      'Automatic upgrades (with your approval)',
      'Control plane HA across 3 AZs',
      'AWS IAM integration for RBAC',
      'VPC networking and security',
      'CloudWatch integration for logging',
      'AWS Load Balancer controller',
      'EBS/EFS storage drivers'
    ],
    youHandle: [
      'Worker nodes (EC2 instances or Fargate)',
      'Node OS patches and updates',
      'Cluster networking (VPC, subnets)',
      'Application load balancers',
      'Ingress controllers',
      'Monitoring tools (Prometheus, Grafana)',
      'Backup and disaster recovery',
      'Cost optimization (autoscaling, spot)'
    ],
    pros: [
      '✓ Deep AWS integration (IAM, VPC, ELB)',
      '✓ Fargate for serverless Pods',
      '✓ Huge AWS ecosystem and services',
      '✓ Enterprise support available'
    ],
    cons: [
      '✗ Cluster fee varies with version support tier',
      '✗ Version availability follows the EKS release schedule',
      '✗ AWS vendor lock-in',
      '✗ Complex IAM for service accounts'
    ],
    bestFor: 'Already on AWS, need deep integration, enterprise workloads',
    setupExample: `# Install eksctl
curl --silent --location "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin

# Create cluster
eksctl create cluster \\
  --name production \\
  --region us-east-1 \\
  --nodegroup-name workers \\
  --node-type t3.medium \\
  --nodes 3 \\
  --nodes-min 2 \\
  --nodes-max 5 \\
  --managed

# Configure kubectl
aws eks update-kubeconfig --name production --region us-east-1

# Verify
kubectl get nodes`
  },
  gke: {
    name: 'Google GKE',
    fullName: 'Google Kubernetes Engine',
    icon: '🔵',
    color: '#4285f4',
    company: 'Google Cloud',
    popularity: '⭐⭐⭐⭐⭐',
    description: 'Google Cloud managed Kubernetes with Standard and Autopilot operating modes.',
    pricing: 'Cluster management fee with eligible free-tier credit; compute and other resources cost extra.',
    theyHandle: [
      'Control plane (fully managed)',
      'Automatic upgrades and patches',
      'Node auto-repair and auto-upgrade',
      'GKE Autopilot mode (fully serverless)',
      'Google Cloud IAM integration',
      'Stackdriver logging and monitoring',
      'Built-in ingress controller',
      'Persistent disk drivers',
      'Binary Authorization'
    ],
    youHandle: [
      'Worker nodes (unless using Autopilot)',
      'Cluster configuration decisions',
      'Network policies',
      'Application architecture',
      'Backup strategies',
      'Cost management',
      'Compliance requirements'
    ],
    pros: [
      '✓ Standard and Autopilot operating modes',
      '✓ Release channels for upgrade planning',
      '✓ Autopilot manages node infrastructure',
      '✓ Eligible free-tier cluster credit',
      '✓ Node auto-repair and autoscaling options'
    ],
    cons: [
      '✗ Smaller ecosystem than AWS',
      '✗ Less enterprise adoption',
      '✗ Google Cloud has fewer services',
      '✗ Regional limitations in some areas'
    ],
    bestFor: 'Teams on Google Cloud or those evaluating Autopilot',
    setupExample: `# Install gcloud CLI
curl https://sdk.cloud.google.com | bash

# Initialize and authenticate
gcloud init
gcloud auth login

# Create Standard cluster
gcloud container clusters create production \\
  --zone us-central1-a \\
  --num-nodes 3 \\
  --machine-type n1-standard-2 \\
  --enable-autoscaling \\
  --min-nodes 2 \\
  --max-nodes 10 \\
  --enable-autorepair \\
  --enable-autoupgrade

# Or create Autopilot cluster (fully managed)
gcloud container clusters create-auto production \\
  --region us-central1

# Configure kubectl
gcloud container clusters get-credentials production --zone us-central1-a

# Verify
kubectl get nodes`
  },
  aks: {
    name: 'Azure AKS',
    fullName: 'Azure Kubernetes Service',
    icon: '🔷',
    color: '#0078d4',
    company: 'Microsoft Azure',
    popularity: '⭐⭐⭐⭐',
    description: 'Microsoft\'s managed Kubernetes. Strong Windows container support, great for hybrid cloud.',
    pricing: 'Free, Standard, and Premium tiers differ in cluster-management charges and features; compute costs extra.',
    theyHandle: [
      'Managed control plane (tier-dependent charges)',
      'Automatic upgrades',
      'Azure AD integration',
      'Virtual network integration',
      'Azure Monitor and Log Analytics',
      'Azure Load Balancer',
      'Azure Disk and Files storage',
      'Azure Policy for governance',
      'Azure Defender security'
    ],
    youHandle: [
      'Worker nodes (VMs)',
      'Node scaling and updates',
      'Application design',
      'Network policies',
      'Storage provisioning',
      'Monitoring dashboards',
      'Backup solutions',
      'Cost optimization'
    ],
    pros: [
      '✓ Free tier available for development and testing',
      '✓ Windows container support',
      '✓ Strong enterprise features',
      '✓ Hybrid cloud with Azure Arc',
      '✓ Azure AD integration'
    ],
    cons: [
      '✗ Azure ecosystem smaller than AWS',
      '✗ Some features require a paid tier',
      '✗ Azure networking and identity require planning',
      '✗ Regional feature availability varies'
    ],
    bestFor: 'Already on Azure, Windows containers, hybrid cloud, cost-conscious',
    setupExample: `# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login
az login

# Create resource group
az group create --name k8s-resources --location eastus

# Create AKS cluster
az aks create \\
  --resource-group k8s-resources \\
  --name production \\
  --node-count 3 \\
  --node-vm-size Standard_D2s_v3 \\
  --enable-addons monitoring \\
  --enable-cluster-autoscaler \\
  --min-count 2 \\
  --max-count 10 \\
  --generate-ssh-keys

# Configure kubectl
az aks get-credentials --resource-group k8s-resources --name production

# Verify
kubectl get nodes`
  },
  openshift: {
    name: 'Red Hat OpenShift',
    fullName: 'OpenShift Container Platform',
    icon: '🔴',
    color: '#ee0000',
    company: 'Red Hat (IBM)',
    popularity: '⭐⭐⭐⭐',
    description: 'Enterprise Kubernetes distribution. More than K8s: built-in CI/CD, registry, networking, and security.',
    pricing: 'Varies by deployment (self-managed or managed on AWS/Azure/GCP)',
    theyHandle: [
      'Everything Kubernetes does',
      'Built-in image registry',
      'Integrated CI/CD pipelines',
      'Source-to-Image (S2I) builds',
      'Advanced RBAC and security',
      'Multi-tenancy with Projects',
      'Built-in monitoring (Prometheus)',
      'Service mesh (Istio)',
      'Developer console UI',
      'OperatorHub for add-ons'
    ],
    youHandle: [
      'Infrastructure (if self-managed)',
      'Cluster sizing',
      'Upgrade planning',
      'Application architecture',
      'Storage configuration',
      'Network policies',
      'User management'
    ],
    pros: [
      '✓ Complete platform (not just K8s)',
      '✓ Enterprise security and compliance',
      '✓ Integrated developer console',
      '✓ Red Hat support',
      '✓ Runs anywhere (on-prem, cloud, edge)',
      '✓ Strong multi-tenancy'
    ],
    cons: [
      '✗ More expensive than plain K8s',
      '✗ Steeper learning curve',
      '✗ Opinionated (less flexibility)',
      '✗ Slower to adopt upstream K8s'
    ],
    bestFor: 'Enterprise, regulated industries, need full platform, on-premises',
    setupExample: `# OpenShift Local (formerly CodeReady Containers) for dev
# Download from https://developers.redhat.com/products/openshift-local

crc setup
crc start

# For production: OpenShift on AWS (ROSA)
rosa init
rosa create cluster --cluster-name production --region us-east-1

# Or Azure Red Hat OpenShift (ARO)
az aro create \\
  --resource-group openshift-rg \\
  --name production \\
  --vnet aro-vnet \\
  --master-subnet master-subnet \\
  --worker-subnet worker-subnet

# Login and verify
oc login -u kubeadmin -p <password>
oc get nodes`
  }
}

const comparisonRows = [
  { feature: 'Control Plane Cost', eks: 'Per-cluster fee; support tier matters', gke: 'Fee with eligible credit', aks: 'Depends on tier', openshift: 'Varies' },
  { feature: 'Ease of Setup', eks: '⭐⭐⭐', gke: '⭐⭐⭐⭐⭐', aks: '⭐⭐⭐⭐', openshift: '⭐⭐⭐' },
  { feature: 'Kubernetes Version Availability', eks: 'Check supported versions', gke: 'Check release channels', aks: 'Check supported versions', openshift: 'Check update channels' },
  { feature: 'Auto-Upgrade', eks: 'Manual', gke: 'Automatic', aks: 'Scheduled', openshift: 'Operator' },
  { feature: 'Serverless Pods', eks: 'Fargate', gke: 'Autopilot', aks: 'Virtual Nodes', openshift: 'No' },
  { feature: 'Built-in CI/CD', eks: 'No', gke: 'Cloud Build', aks: 'No', openshift: 'Yes' },
  { feature: 'Multi-Cloud', eks: 'AWS only', gke: 'GCP + Anthos', aks: 'Azure + Arc', openshift: 'Anywhere' },
  { feature: 'Windows Support', eks: 'Yes', gke: 'Yes', aks: 'Yes', openshift: 'Yes' },
  { feature: 'Enterprise Support', eks: 'AWS Support', gke: 'Google Support', aks: 'Azure Support', openshift: 'Red Hat' }
]

const gotchas = [
  { gotcha: 'Managed ≠ Fully Managed', issue: 'They manage the control plane. You still manage nodes, networking, storage, monitoring.', solution: 'Understand what you\'re responsible for before deploying' },
  { gotcha: 'Upgrades Aren\'t Automatic', issue: 'Control plane might auto-upgrade, but you schedule node upgrades manually.', solution: 'Plan maintenance windows, test upgrades in staging first' },
  { gotcha: 'You Pay for Control Plane + Nodes', issue: 'Cluster-management fees and infrastructure charges vary by provider and service tier.', solution: 'Use provider pricing calculators, enable autoscaling, and review workload costs' },
  { gotcha: 'Each Provider Has Quirks', issue: 'Identity and cluster billing differ by provider and service tier.', solution: 'Read provider-specific docs, follow their best practices' },
  { gotcha: 'Vendor Lock-In Is Real', issue: 'Deep integration with cloud services makes migration painful.', solution: 'Use cloud-agnostic tools where possible (Terraform, Helm, Istio)' },
  { gotcha: 'Support Isn\'t Unlimited', issue: 'They support the K8s platform, not your applications.', solution: 'Don\'t expect cloud support to debug your app code' }
]

const decisionGuide = [
  { scenario: 'Already on AWS', choice: 'EKS', color: '#ff9900', reason: 'Deep integration with AWS services (IAM, VPC, ELB, RDS, etc.)' },
  { scenario: 'Prefer managed node infrastructure', choice: 'GKE', color: '#4285f4', reason: 'Autopilot manages node infrastructure; review its workload constraints and pricing' },
  { scenario: 'Cost-conscious', choice: 'AKS', color: '#0078d4', reason: 'AKS offers a Free tier; compare paid tiers and total infrastructure costs' },
  { scenario: 'Enterprise/Regulated', choice: 'OpenShift', color: '#ee0000', reason: 'Complete platform with security, compliance, and Red Hat support' },
  { scenario: 'Windows containers', choice: 'AKS', color: '#0078d4', reason: 'Best Windows container support, Azure AD integration' },
  { scenario: 'Hybrid/Multi-cloud', choice: 'OpenShift or GKE Anthos', color: '#8b5cf6', reason: 'Run consistently across clouds and on-premises' },
  { scenario: 'Startup/MVP', choice: 'GKE Autopilot', color: '#4285f4', reason: 'Zero node management, pay only for Pods, fastest to market' }
]

export default function ManagedKubernetes() {
  const [selectedProvider, setSelectedProvider] = useState<keyof typeof providers>('eks')
  const currentProvider = providers[selectedProvider]

  const cellStyle: React.CSSProperties = { padding: '1rem', textAlign: 'center', color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border)' }
  const headStyle: React.CSSProperties = { padding: '1rem', textAlign: 'center', borderBottom: '2px solid var(--color-border)' }

  return (
    <ModuleShell id="10-2" subtitle="Part 10: Real-World Kubernetes">
      <section className={styles.spotlight}>
        <h2>☁️ Select a Managed Kubernetes Provider</h2>
        <p>
          Running Kubernetes yourself is a full-time job. Managed providers handle the control plane,
          upgrades, and infrastructure so you can focus on your applications. But they're not all the same.
          Let's compare the big players.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', margin: '1.5rem 0 2rem' }}>
          {(Object.keys(providers) as Array<keyof typeof providers>).map(provider => {
            const active = selectedProvider === provider
            return (
              <button
                key={provider}
                onClick={() => setSelectedProvider(provider)}
                style={{
                  padding: '1.5rem',
                  background: active ? providers[provider].color : 'var(--color-bg-tertiary)',
                  color: active ? '#fff' : 'var(--color-text-secondary)',
                  border: active ? 'none' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'var(--transition-fast)',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{providers[provider].icon}</div>
                <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{providers[provider].name}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.5rem' }}>{providers[provider].company}</div>
                <div style={{ fontSize: '0.9rem' }}>{providers[provider].popularity}</div>
              </button>
            )
          })}
        </div>

        <div style={{ background: 'var(--color-bg-tertiary)', border: `3px solid ${currentProvider.color}`, borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '4rem' }}>{currentProvider.icon}</span>
            <div>
              <div style={{ display: 'inline-block', background: currentProvider.color, color: '#fff', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {currentProvider.company}
              </div>
              <h3 style={{ fontSize: '2rem', margin: 0 }}>{currentProvider.fullName}</h3>
              <p style={{ color: 'var(--color-text-secondary)', margin: '0.5rem 0 0 0', fontSize: '1.1rem' }}>{currentProvider.description}</p>
            </div>
          </div>

          <Callout variant="info" title="💰 Pricing">{currentProvider.pricing}</Callout>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', margin: '1.5rem 0' }}>
            <Callout variant="success" title="✅ They Handle">
              <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                {currentProvider.theyHandle.map((item, idx) => <li key={idx} style={{ marginBottom: '0.35rem' }}>{item}</li>)}
              </ul>
            </Callout>
            <Callout variant="warning" title="⚙️ You Still Handle">
              <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                {currentProvider.youHandle.map((item, idx) => <li key={idx} style={{ marginBottom: '0.35rem' }}>{item}</li>)}
              </ul>
            </Callout>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h4>Pros</h4>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {currentProvider.pros.map((pro, idx) => (
                  <div key={idx} style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>{pro}</div>
                ))}
              </div>
            </div>
            <div>
              <h4>Cons</h4>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {currentProvider.cons.map((con, idx) => (
                  <div key={idx} style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-danger, #ef4444)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>{con}</div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: currentProvider.color, color: '#fff', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#fff' }}>🎯 Best For</h4>
            <p style={{ fontSize: '1.1rem', margin: 0 }}>{currentProvider.bestFor}</p>
          </div>

          <h4>🚀 Quick Setup Guide</h4>
          <TermBox>{currentProvider.setupExample}</TermBox>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>📊 Quick Comparison Matrix</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-tertiary)' }}>
                <th style={{ ...headStyle, textAlign: 'left', fontWeight: 600 }}>Feature</th>
                <th style={headStyle}><div style={{ fontSize: '1.5rem' }}>☁️</div><div style={{ fontWeight: 600, color: '#ff9900' }}>EKS</div></th>
                <th style={headStyle}><div style={{ fontSize: '1.5rem' }}>🔵</div><div style={{ fontWeight: 600, color: '#4285f4' }}>GKE</div></th>
                <th style={headStyle}><div style={{ fontSize: '1.5rem' }}>🔷</div><div style={{ fontWeight: 600, color: '#0078d4' }}>AKS</div></th>
                <th style={headStyle}><div style={{ fontSize: '1.5rem' }}>🔴</div><div style={{ fontWeight: 600, color: '#ee0000' }}>OpenShift</div></th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ ...cellStyle, textAlign: 'left', fontWeight: 600, color: 'var(--color-text-primary)' }}>{row.feature}</td>
                  <td style={cellStyle}>{row.eks}</td>
                  <td style={cellStyle}>{row.gke}</td>
                  <td style={cellStyle}>{row.aks}</td>
                  <td style={cellStyle}>{row.openshift}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>⚠️ Common Gotchas Across All Providers</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {gotchas.map((item, idx) => (
            <Callout key={idx} variant="danger" title={`${idx + 1}. ${item.gotcha}`}>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: 0, marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                <strong>Issue:</strong> {item.issue}
              </p>
              <div style={{ background: 'var(--color-bg-secondary)', borderLeft: '4px solid var(--color-success)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                <strong>Solution:</strong> {item.solution}
              </div>
            </Callout>
          ))}
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>🤔 Which One Should You Choose?</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {decisionGuide.map((guide, idx) => (
            <div key={idx} style={{ background: 'var(--color-bg-tertiary)', border: `2px solid ${guide.color}`, borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: guide.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, flexShrink: 0 }}>
                {idx + 1}
              </div>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>If: {guide.scenario}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: guide.color, marginBottom: '0.5rem' }}>→ Choose: {guide.choice}</div>
                <div style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>{guide.reason}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </ModuleShell>
  )
}
