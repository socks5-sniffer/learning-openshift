import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function ManagedKubernetes() {
  const [selectedProvider, setSelectedProvider] = useState<'eks' | 'gke' | 'aks' | 'openshift'>('eks')

  const providers = {
    eks: {
      name: 'Amazon EKS',
      fullName: 'Elastic Kubernetes Service',
      icon: '☁️',
      color: '#ff9900',
      company: 'AWS',
      popularity: '⭐⭐⭐⭐⭐',
      description: 'Amazon\'s managed Kubernetes. Deep AWS integration, enterprise-grade, biggest ecosystem.',
      pricing: '$0.10/hour per cluster + EC2/Fargate costs',
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
        '✗ Most expensive control plane ($72/month)',
        '✗ Slower to adopt new K8s versions',
        '✗ AWS vendor lock-in',
        '✗ Complex IAM for service accounts'
      ],
      bestFor: 'Already on AWS, need deep integration, enterprise workloads',
      setupExample: `# Install eksctl
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
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
      description: 'Google invented Kubernetes. GKE is the most mature, feature-rich, and fastest to adopt new K8s versions.',
      pricing: '$0.10/hour per cluster (free if <15GB memory) + GCE costs',
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
        '✓ Best Kubernetes implementation (Google built it)',
        '✓ Fastest to adopt new K8s versions',
        '✓ GKE Autopilot = zero node management',
        '✓ Free control plane for small clusters',
        '✓ Best auto-scaling and auto-repair'
      ],
      cons: [
        '✗ Smaller ecosystem than AWS',
        '✗ Less enterprise adoption',
        '✗ Google Cloud has fewer services',
        '✗ Regional limitations in some areas'
      ],
      bestFor: 'Best Kubernetes experience, greenfield projects, cloud-native apps',
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
      pricing: 'FREE control plane + VM costs',
      theyHandle: [
        'Control plane (completely free!)',
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
        '✓ FREE control plane (best value)',
        '✓ Best Windows container support',
        '✓ Strong enterprise features',
        '✓ Hybrid cloud with Azure Arc',
        '✓ Azure AD integration'
      ],
      cons: [
        '✗ Azure ecosystem smaller than AWS',
        '✗ Occasional reliability issues',
        '✗ UI can be confusing',
        '✗ Less mature than GKE'
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
        '✓ Best developer experience',
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

  const currentProvider = providers[selectedProvider]

  return (
    <div className={styles.container}>
      <Head>
        <title>10.2 Managed Kubernetes - Kubernetes Learning</title>
      </Head>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/learning-modules" legacyBehavior>
            <a style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem' }}>
              ← Back to Learning Modules
            </a>
          </Link>
        </div>

        <div style={{ 
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            display: 'inline-block',
            background: '#9c0606',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: 6,
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '1rem'
          }}>
            Part 10: Real-World Kubernetes
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>
            10.2 Managed Kubernetes
          </h1>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <Link href="/module-10-1" legacyBehavior>
              <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
                ← Previous: Common Failure Scenarios
              </a>
            </Link>
            <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
            <Link href="/learning-modules" legacyBehavior>
              <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
                All Modules
              </a>
            </Link>
            <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
            <Link href="/module-10-3" legacyBehavior>
              <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
                Next: When to Say No to Kubernetes →
              </a>
            </Link>
          </div>
          
          <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.6 }}>
            Running Kubernetes yourself is a full-time job. Managed providers handle the control plane,
            upgrades, and infrastructure so you can focus on your applications. But they're not all the same.
            Let's compare the big players.
          </p>
        </div>

        {/* Provider Selector */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
            ☁️ Select a Managed Kubernetes Provider
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {(Object.keys(providers) as Array<keyof typeof providers>).map(provider => (
              <button
                key={provider}
                onClick={() => setSelectedProvider(provider)}
                style={{
                  padding: '1.5rem',
                  background: selectedProvider === provider ? providers[provider].color : '#f8fafc',
                  color: selectedProvider === provider ? 'white' : '#1e293b',
                  border: selectedProvider === provider ? 'none' : '2px solid #e2e8f0',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                  {providers[provider].icon}
                </div>
                <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                  {providers[provider].name}
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  opacity: 0.8,
                  marginBottom: '0.5rem'
                }}>
                  {providers[provider].company}
                </div>
                <div style={{ fontSize: '0.9rem' }}>
                  {providers[provider].popularity}
                </div>
              </button>
            ))}
          </div>

          {/* Provider Details */}
          <div style={{
            background: '#f8fafc',
            border: `3px solid ${currentProvider.color}`,
            borderRadius: 12,
            padding: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '4rem' }}>{currentProvider.icon}</span>
              <div>
                <div style={{ 
                  display: 'inline-block',
                  background: currentProvider.color,
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem'
                }}>
                  {currentProvider.company}
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                  {currentProvider.fullName}
                </h3>
                <p style={{ color: '#64748b', margin: '0.5rem 0 0 0', fontSize: '1.1rem' }}>
                  {currentProvider.description}
                </p>
              </div>
            </div>

            {/* Pricing */}
            <div style={{
              background: 'white',
              border: '2px solid #e2e8f0',
              borderRadius: 8,
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                💰 Pricing
              </div>
              <div style={{ color: '#64748b', fontSize: '1rem' }}>
                {currentProvider.pricing}
              </div>
            </div>

            {/* What They Handle vs What You Handle */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {/* They Handle */}
              <div style={{
                background: 'white',
                border: '2px solid #10b981',
                borderRadius: 8,
                padding: '1.5rem'
              }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#10b981', marginBottom: '1rem' }}>
                  ✅ They Handle
                </h4>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {currentProvider.theyHandle.map((item, idx) => (
                    <div key={idx} style={{
                      padding: '0.75rem',
                      background: '#f0fdf4',
                      borderRadius: 6,
                      color: '#166534',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem'
                    }}>
                      <span style={{ flexShrink: 0, marginTop: '0.1rem' }}>✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* You Handle */}
              <div style={{
                background: 'white',
                border: '2px solid #f59e0b',
                borderRadius: 8,
                padding: '1.5rem'
              }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#f59e0b', marginBottom: '1rem' }}>
                  ⚙️ You Still Handle
                </h4>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {currentProvider.youHandle.map((item, idx) => (
                    <div key={idx} style={{
                      padding: '0.75rem',
                      background: '#fffbeb',
                      borderRadius: 6,
                      color: '#92400e',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem'
                    }}>
                      <span style={{ flexShrink: 0, marginTop: '0.1rem' }}>→</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pros and Cons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {/* Pros */}
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem' }}>
                  Pros
                </h4>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {currentProvider.pros.map((pro, idx) => (
                    <div key={idx} style={{
                      background: 'white',
                      border: '2px solid #10b981',
                      borderRadius: 6,
                      padding: '0.75rem',
                      color: '#166534',
                      fontSize: '0.95rem'
                    }}>
                      {pro}
                    </div>
                  ))}
                </div>
              </div>

              {/* Cons */}
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem' }}>
                  Cons
                </h4>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {currentProvider.cons.map((con, idx) => (
                    <div key={idx} style={{
                      background: 'white',
                      border: '2px solid #ef4444',
                      borderRadius: 6,
                      padding: '0.75rem',
                      color: '#991b1b',
                      fontSize: '0.95rem'
                    }}>
                      {con}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Best For */}
            <div style={{
              background: currentProvider.color,
              color: 'white',
              borderRadius: 8,
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                🎯 Best For
              </h4>
              <p style={{ fontSize: '1.1rem', margin: 0 }}>
                {currentProvider.bestFor}
              </p>
            </div>

            {/* Setup Example */}
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem' }}>
                🚀 Quick Setup Guide
              </h4>
              <div style={{
                background: '#1e293b',
                borderRadius: 8,
                padding: '1.5rem',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                color: '#10b981',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap'
              }}>
                {currentProvider.setupExample}
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Matrix */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
            📊 Quick Comparison Matrix
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '0.9rem'
            }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#1e293b', fontWeight: 600 }}>
                    Feature
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>
                    <div style={{ fontSize: '1.5rem' }}>☁️</div>
                    <div style={{ fontWeight: 600, color: '#ff9900' }}>EKS</div>
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>
                    <div style={{ fontSize: '1.5rem' }}>🔵</div>
                    <div style={{ fontWeight: 600, color: '#4285f4' }}>GKE</div>
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>
                    <div style={{ fontSize: '1.5rem' }}>🔷</div>
                    <div style={{ fontWeight: 600, color: '#0078d4' }}>AKS</div>
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>
                    <div style={{ fontSize: '1.5rem' }}>🔴</div>
                    <div style={{ fontWeight: 600, color: '#ee0000' }}>OpenShift</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { 
                    feature: 'Control Plane Cost',
                    eks: '$72/month',
                    gke: 'Free (<15GB)',
                    aks: 'FREE',
                    openshift: 'Varies'
                  },
                  {
                    feature: 'Ease of Setup',
                    eks: '⭐⭐⭐',
                    gke: '⭐⭐⭐⭐⭐',
                    aks: '⭐⭐⭐⭐',
                    openshift: '⭐⭐⭐'
                  },
                  {
                    feature: 'Kubernetes Version Lag',
                    eks: '~3 months',
                    gke: '~1 week',
                    aks: '~2 months',
                    openshift: '~6 months'
                  },
                  {
                    feature: 'Auto-Upgrade',
                    eks: 'Manual',
                    gke: 'Automatic',
                    aks: 'Scheduled',
                    openshift: 'Operator'
                  },
                  {
                    feature: 'Serverless Pods',
                    eks: 'Fargate',
                    gke: 'Autopilot',
                    aks: 'Virtual Nodes',
                    openshift: 'No'
                  },
                  {
                    feature: 'Built-in CI/CD',
                    eks: 'No',
                    gke: 'Cloud Build',
                    aks: 'No',
                    openshift: 'Yes'
                  },
                  {
                    feature: 'Multi-Cloud',
                    eks: 'AWS only',
                    gke: 'GCP + Anthos',
                    aks: 'Azure + Arc',
                    openshift: 'Anywhere'
                  },
                  {
                    feature: 'Windows Support',
                    eks: 'Yes',
                    gke: 'Yes',
                    aks: 'Best',
                    openshift: 'Yes'
                  },
                  {
                    feature: 'Enterprise Support',
                    eks: 'AWS Support',
                    gke: 'Google Support',
                    aks: 'Azure Support',
                    openshift: 'Red Hat'
                  }
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#1e293b' }}>
                      {row.feature}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>
                      {row.eks}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>
                      {row.gke}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>
                      {row.aks}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>
                      {row.openshift}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Common Gotchas */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
            ⚠️ Common Gotchas Across All Providers
          </h2>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              {
                gotcha: 'Managed ≠ Fully Managed',
                issue: 'They manage the control plane. You still manage nodes, networking, storage, monitoring.',
                solution: 'Understand what you\'re responsible for before deploying'
              },
              {
                gotcha: 'Upgrades Aren\'t Automatic',
                issue: 'Control plane might auto-upgrade, but you schedule node upgrades manually.',
                solution: 'Plan maintenance windows, test upgrades in staging first'
              },
              {
                gotcha: 'You Pay for Control Plane + Nodes',
                issue: 'EKS: $72/month + EC2 costs. Hidden costs add up fast.',
                solution: 'Use cost calculators, enable autoscaling, use spot instances'
              },
              {
                gotcha: 'Each Provider Has Quirks',
                issue: 'AWS IAM for SA is complex. GKE Workload Identity. AKS has free control plane but...',
                solution: 'Read provider-specific docs, follow their best practices'
              },
              {
                gotcha: 'Vendor Lock-In Is Real',
                issue: 'Deep integration with cloud services makes migration painful.',
                solution: 'Use cloud-agnostic tools where possible (Terraform, Helm, Istio)'
              },
              {
                gotcha: 'Support Isn\'t Unlimited',
                issue: 'They support the K8s platform, not your applications.',
                solution: 'Don\'t expect cloud support to debug your app code'
              }
            ].map((item, idx) => (
              <div key={idx} style={{
                background: '#fef2f2',
                border: '2px solid #fecaca',
                borderRadius: 8,
                padding: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#dc2626', marginBottom: '0.5rem' }}>
                  {idx + 1}. {item.gotcha}
                </h3>
                <p style={{ color: '#64748b', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                  <strong style={{ color: '#1e293b' }}>Issue:</strong> {item.issue}
                </p>
                <div style={{
                  background: 'white',
                  borderLeft: '4px solid #10b981',
                  padding: '0.75rem',
                  borderRadius: 4,
                  fontSize: '0.9rem',
                  color: '#166534'
                }}>
                  <strong>Solution:</strong> {item.solution}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decision Guide */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
            🤔 Which One Should You Choose?
          </h2>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              {
                scenario: 'Already on AWS',
                choice: 'EKS',
                color: '#ff9900',
                reason: 'Deep integration with AWS services (IAM, VPC, ELB, RDS, etc.)'
              },
              {
                scenario: 'Best Kubernetes experience',
                choice: 'GKE',
                color: '#4285f4',
                reason: 'Google invented K8s. Most mature, fastest updates, Autopilot mode'
              },
              {
                scenario: 'Cost-conscious',
                choice: 'AKS',
                color: '#0078d4',
                reason: 'FREE control plane saves $72/month. Good enough for most workloads'
              },
              {
                scenario: 'Enterprise/Regulated',
                choice: 'OpenShift',
                color: '#ee0000',
                reason: 'Complete platform with security, compliance, and Red Hat support'
              },
              {
                scenario: 'Windows containers',
                choice: 'AKS',
                color: '#0078d4',
                reason: 'Best Windows container support, Azure AD integration'
              },
              {
                scenario: 'Hybrid/Multi-cloud',
                choice: 'OpenShift or GKE Anthos',
                color: '#8b5cf6',
                reason: 'Run consistently across clouds and on-premises'
              },
              {
                scenario: 'Startup/MVP',
                choice: 'GKE Autopilot',
                color: '#4285f4',
                reason: 'Zero node management, pay only for Pods, fastest to market'
              }
            ].map((guide, idx) => (
              <div key={idx} style={{
                background: '#f8fafc',
                border: `2px solid ${guide.color}`,
                borderRadius: 8,
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem'
              }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: guide.color,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {idx + 1}
                </div>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
                    If: {guide.scenario}
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: guide.color, marginBottom: '0.5rem' }}>
                    → Choose: {guide.choice}
                  </div>
                  <div style={{ fontSize: '0.95rem', color: '#64748b' }}>
                    {guide.reason}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          paddingTop: '2rem',
          borderTop: '2px solid #e2e8f0'
        }}>
          <Link href="/module-10-1" legacyBehavior>
            <a style={{
              padding: '0.75rem 1.5rem',
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: 8,
              color: '#1e293b',
              textDecoration: 'none',
              fontWeight: 600
            }}>
              ← 10.1 Common Failure Scenarios
            </a>
          </Link>
          <Link href="/module-10-3" legacyBehavior>
            <a style={{
              padding: '0.75rem 1.5rem',
              background: '#9c0606',
              borderRadius: 8,
              color: 'white',
              textDecoration: 'none',
              fontWeight: 600
            }}>
              10.3 When to Say "No" to Kubernetes →
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}
