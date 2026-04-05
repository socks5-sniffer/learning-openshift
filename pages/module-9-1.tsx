import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function DeployingTheRightWay() {
  const [selectedStrategy, setSelectedStrategy] = useState<'latest' | 'semver' | 'sha' | 'hybrid'>('latest')
  const [deploymentScenario, setDeploymentScenario] = useState<'blue-green' | 'rolling' | 'canary' | 'recreate'>('rolling')
  const [showRollback, setShowRollback] = useState(false)

  const taggingStrategies = {
    latest: {
      name: ':latest Tag',
      example: 'myapp:latest',
      color: '#ef4444',
      verdict: '🚫 Never Use in Production',
      pros: ['Simple', 'Default behavior', 'Easy for local dev'],
      cons: [
        'No versioning - what version is running?',
        'Not immutable - :latest changes constantly',
        'Rollback is impossible',
        'No audit trail',
        'Cached images cause confusion'
      ],
      useCase: 'Local development only. Never, ever in production.',
      commands: [
        '# What version is this?',
        'docker pull myapp:latest  # Could be anything!',
        '',
        '# Rollback? Good luck.',
        'kubectl rollout undo deployment/myapp  # To what version?'
      ]
    },
    semver: {
      name: 'Semantic Versioning',
      example: 'myapp:v1.2.3',
      color: '#10b981',
      verdict: '✅ Good for Releases',
      pros: [
        'Human-readable versions',
        'Clear major/minor/patch changes',
        'Easy rollback to specific version',
        'Follows industry standard',
        'Good for public APIs'
      ],
      cons: [
        'Requires manual tagging',
        'Easy to forget to bump version',
        'Doesn\'t identify exact commit',
        'Multiple commits per version possible'
      ],
      useCase: 'Great for release-based deployments. Library/API versioning.',
      commands: [
        '# Build and tag with version',
        'docker build -t myapp:v1.2.3 .',
        'docker push myapp:v1.2.3',
        '',
        '# Deploy specific version',
        'kubectl set image deployment/myapp myapp=myapp:v1.2.3',
        '',
        '# Rollback is easy',
        'kubectl set image deployment/myapp myapp=myapp:v1.2.2'
      ]
    },
    sha: {
      name: 'Git SHA Tags',
      example: 'myapp:a3f5b2c',
      color: '#3b82f6',
      verdict: '✅ Best for CI/CD',
      pros: [
        'Maps to exact git commit',
        'Fully traceable to source code',
        'Immutable by nature',
        'Automatic in CI/CD',
        'No version bump needed'
      ],
      cons: [
        'Not human-readable',
        'Hard to know what\'s in it',
        'Needs good commit messages',
        'Tag explosion over time'
      ],
      useCase: 'Perfect for continuous deployment. Maps image to exact code.',
      commands: [
        '# Auto-tag with git commit SHA',
        'SHA=$(git rev-parse --short HEAD)',
        'docker build -t myapp:$SHA .',
        'docker push myapp:$SHA',
        '',
        '# Deploy with SHA',
        'kubectl set image deployment/myapp myapp=myapp:a3f5b2c',
        '',
        '# Know exactly what\'s running',
        'kubectl get deployment myapp -o yaml | grep image'
      ]
    },
    hybrid: {
      name: 'Hybrid Strategy',
      example: 'myapp:v1.2.3-a3f5b2c',
      color: '#8b5cf6',
      verdict: '✅ Best of Both Worlds',
      pros: [
        'Human-readable version',
        'Git SHA for exact traceability',
        'Easy to understand AND debug',
        'Good for auditing',
        'Perfect for compliance'
      ],
      cons: [
        'Longer tag names',
        'Requires more CI/CD logic',
        'Can be overkill for small projects'
      ],
      useCase: 'Enterprise deployments. When you need both clarity and traceability.',
      commands: [
        '# Build with version + SHA',
        'VERSION=v1.2.3',
        'SHA=$(git rev-parse --short HEAD)',
        'docker build -t myapp:$VERSION-$SHA .',
        'docker push myapp:$VERSION-$SHA',
        '',
        '# Also tag as latest version',
        'docker tag myapp:$VERSION-$SHA myapp:$VERSION',
        'docker push myapp:$VERSION',
        '',
        '# Deploy',
        'kubectl set image deployment/myapp myapp=myapp:v1.2.3-a3f5b2c'
      ]
    }
  }

  const deploymentStrategies = {
    'blue-green': {
      name: 'Blue-Green Deployment',
      description: 'Two identical environments. Switch traffic instantly. Zero downtime, instant rollback.',
      steps: [
        'Deploy new version (Green) alongside old (Blue)',
        'Test Green environment',
        'Switch Service selector to Green',
        'Keep Blue running as backup',
        'Delete Blue after confidence'
      ],
      pros: ['Instant rollback', 'Test in production before switching', 'Zero downtime', 'Easy to understand'],
      cons: ['Requires 2x resources', 'Database migrations tricky', 'Expensive'],
      diagram: `
┌─────────────┐       ┌─────────────┐
│   Service   │       │   Service   │
│  (to Blue)  │  ───► │  (to Green) │
└──────┬──────┘       └──────┬──────┘
       │                     │
       ↓                     ↓
┌─────────────┐       ┌─────────────┐
│    Blue     │       │    Green    │
│  (v1.2.2)   │       │  (v1.2.3)   │
│  3 Pods     │       │  3 Pods     │
└─────────────┘       └─────────────┘
   ↓ Delete                ↓ Now Live`
    },
    rolling: {
      name: 'Rolling Update',
      description: 'Default Kubernetes strategy. Replace Pods one-by-one. Gradual, safe, minimal resources.',
      steps: [
        'Create 1 new Pod (v2)',
        'Wait for it to be Ready',
        'Terminate 1 old Pod (v1)',
        'Repeat until all Pods updated',
        'Rollback reverses the process'
      ],
      pros: ['No extra resources needed', 'Built into Kubernetes', 'Gradual rollout', 'Automatic health checks'],
      cons: ['Both versions running simultaneously', 'Slower than blue-green', 'Can\'t test fully before going live'],
      diagram: `
Step 1: [v1] [v1] [v1]           ← 3 old Pods
Step 2: [v1] [v1] [v1] [v2]      ← Add 1 new
Step 3: [v1] [v1] [v2]           ← Remove 1 old
Step 4: [v1] [v2] [v2]           ← Repeat
Step 5: [v2] [v2] [v2]           ← All updated`
    },
    canary: {
      name: 'Canary Deployment',
      description: 'Deploy to small % of users first. Monitor. Gradually increase. Minimize blast radius.',
      steps: [
        'Deploy new version to 10% of Pods',
        'Monitor metrics (errors, latency)',
        'If good, increase to 50%',
        'If still good, increase to 100%',
        'If bad at any point, rollback'
      ],
      pros: ['Minimal user impact if broken', 'Real user testing', 'Gradual confidence building', 'Easy rollback'],
      cons: ['Complex routing needed', 'Requires good monitoring', 'Two versions in prod', 'Takes longer'],
      diagram: `
Phase 1: 90% v1, 10% v2  ← Test with small traffic
         ↓ Monitor metrics
Phase 2: 50% v1, 50% v2  ← Increase if healthy
         ↓ Still good?
Phase 3: 0% v1, 100% v2  ← Full rollout`
    },
    recreate: {
      name: 'Recreate Strategy',
      description: 'Kill all old Pods, then create new ones. Simple but causes downtime.',
      steps: [
        'Terminate all old Pods',
        'Wait for them to stop',
        'Create all new Pods',
        'Wait for them to be Ready',
        'Done'
      ],
      pros: ['Simple to understand', 'No version conflicts', 'Clean state', 'No extra resources'],
      cons: ['DOWNTIME during update', 'Can\'t rollback quickly', 'Risky for production', 'Users see errors'],
      diagram: `
Step 1: [v1] [v1] [v1]     ← Old version running
Step 2: [ ] [ ] [ ]        ← ALL PODS DOWN 🔥
Step 3: [v2] [v2] [v2]     ← New version starts`
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>9.1 Deploying the Right Way - Kubernetes Learning</title>
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
            Part 9: CI/CD & GitOps
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>
            9.1 Deploying the Right Way
          </h1>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <Link href="/module-8-3" legacyBehavior>
              <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
                ← Previous: Debugging
              </a>
            </Link>
            <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
            <Link href="/learning-modules" legacyBehavior>
              <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
                All Modules
              </a>
            </Link>
            <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
            <Link href="/module-9-2" legacyBehavior>
              <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
                Next: GitOps →
              </a>
            </Link>
          </div>
          
          <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.6 }}>
            You built a container. Now what? How do you tag it? How do you deploy it without breaking
            production? How do you roll back when things go wrong? These decisions seem small but they
            determine whether your deployments are smooth or chaotic.
          </p>
        </div>

        {/* Image Tagging Strategies */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
            🏷️ Image Tagging Strategies
          </h2>

          <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Your image tag is your version control. Choose wrong and you'll lose track of what's
            deployed, struggle to rollback, and confuse everyone. Choose right and deployments
            become predictable, traceable, and safe.
          </p>

          {/* Strategy Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {(Object.keys(taggingStrategies) as Array<keyof typeof taggingStrategies>).map(strategy => (
              <button
                key={strategy}
                onClick={() => setSelectedStrategy(strategy)}
                style={{
                  padding: '1rem',
                  background: selectedStrategy === strategy ? taggingStrategies[strategy].color : '#f8fafc',
                  color: selectedStrategy === strategy ? 'white' : '#1e293b',
                  border: selectedStrategy === strategy ? 'none' : '2px solid #e2e8f0',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  {taggingStrategies[strategy].name}
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  fontFamily: 'monospace',
                  opacity: selectedStrategy === strategy ? 1 : 0.7
                }}>
                  {taggingStrategies[strategy].example}
                </div>
              </button>
            ))}
          </div>

          {/* Strategy Details */}
          <div style={{
            background: '#f8fafc',
            border: `2px solid ${taggingStrategies[selectedStrategy].color}`,
            borderRadius: 8,
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                {taggingStrategies[selectedStrategy].name}
              </h3>
              <div style={{
                padding: '0.5rem 1rem',
                background: taggingStrategies[selectedStrategy].color,
                color: 'white',
                borderRadius: 6,
                fontWeight: 600,
                fontSize: '0.875rem'
              }}>
                {taggingStrategies[selectedStrategy].verdict}
              </div>
            </div>

            <div style={{ 
              fontFamily: 'monospace', 
              fontSize: '1.1rem', 
              color: '#1e293b',
              background: 'white',
              padding: '1rem',
              borderRadius: 6,
              marginBottom: '1rem',
              border: '2px solid #e2e8f0'
            }}>
              {taggingStrategies[selectedStrategy].example}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ color: '#10b981', fontSize: '1rem', marginBottom: '0.5rem' }}>✓ Pros</h4>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                  {taggingStrategies[selectedStrategy].pros.map((pro, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>{pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#ef4444', fontSize: '1rem', marginBottom: '0.5rem' }}>✗ Cons</h4>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                  {taggingStrategies[selectedStrategy].cons.map((con, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{
              background: '#fef3c7',
              borderLeft: '4px solid #f59e0b',
              padding: '1rem',
              borderRadius: 4,
              marginBottom: '1rem'
            }}>
              <strong style={{ color: '#92400e' }}>Use Case:</strong>
              <p style={{ color: '#92400e', margin: '0.5rem 0 0 0' }}>
                {taggingStrategies[selectedStrategy].useCase}
              </p>
            </div>

            {/* Commands */}
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
                Example Commands:
              </h4>
              <div style={{
                background: '#1e293b',
                borderRadius: 6,
                padding: '1rem',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                color: '#10b981'
              }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {taggingStrategies[selectedStrategy].commands.join('\n')}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Immutable Deployments */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
            🔒 Immutable Deployments
          </h2>

          <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            <strong style={{ color: '#1e293b' }}>Immutable = Never Change Running Containers.</strong>
            {' '}Need to update? Deploy a new version. Don't SSH in and change files. Don't restart
            processes. Don't patch running containers. Deploy fresh, always.
          </p>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              background: '#f0fdf4',
              border: '2px solid #bbf7d0',
              borderLeft: '4px solid #10b981',
              borderRadius: 8,
              padding: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#166534', marginBottom: '0.75rem' }}>
                ✓ The Right Way
              </h3>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#166534' }}>
                <li>Build new image with changes</li>
                <li>Tag it with new version/SHA</li>
                <li>Deploy new Pods with new image</li>
                <li>Let Kubernetes replace old Pods</li>
                <li>Old image still exists for rollback</li>
              </ul>
              <div style={{
                background: '#1e293b',
                borderRadius: 6,
                padding: '1rem',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                color: '#10b981',
                marginTop: '1rem'
              }}>
                <pre style={{ margin: 0 }}>{`# Build new image
docker build -t myapp:v1.2.4 .
docker push myapp:v1.2.4

# Update Deployment
kubectl set image deployment/myapp myapp=myapp:v1.2.4

# Kubernetes handles the rest`}</pre>
              </div>
            </div>

            <div style={{
              background: '#fef2f2',
              border: '2px solid #fecaca',
              borderLeft: '4px solid #ef4444',
              borderRadius: 8,
              padding: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#991b1b', marginBottom: '0.75rem' }}>
                ✗ The Wrong Way
              </h3>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#991b1b' }}>
                <li>SSH into Pod and edit files</li>
                <li>kubectl cp config files into running Pod</li>
                <li>Change environment variables at runtime</li>
                <li>Patch processes without restarting</li>
                <li>Hope it works until next restart</li>
              </ul>
              <div style={{
                background: '#1e293b',
                borderRadius: 6,
                padding: '1rem',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                color: '#ef4444',
                marginTop: '1rem'
              }}>
                <pre style={{ margin: 0 }}>{`# DON'T DO THIS
kubectl exec -it myapp-abc -- bash
root@myapp-abc:/# vim config.json  # Changed!
root@myapp-abc:/# systemctl restart app

# Next restart = changes LOST 💀`}</pre>
              </div>
            </div>
          </div>

          <div style={{
            background: '#fef3c7',
            border: '2px solid #fcd34d',
            borderRadius: 8,
            padding: '1.5rem'
          }}>
            <h4 style={{ margin: '0 0 0.75rem 0', color: '#92400e' }}>Why Immutable?</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#92400e' }}>
              <li><strong>Consistency:</strong> Every Pod is identical, built from same image</li>
              <li><strong>Reproducibility:</strong> Can recreate exact state anytime</li>
              <li><strong>Rollback:</strong> Old image still exists, just point back to it</li>
              <li><strong>Auditability:</strong> Know exactly what's running (image tag = version)</li>
              <li><strong>No Drift:</strong> Pods can't diverge from each other over time</li>
            </ul>
          </div>
        </div>

        {/* Deployment Strategies */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
            🚀 Deployment Strategies
          </h2>

          <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            You've got a new image. How do you actually deploy it? All at once? Gradually? With a backup?
            Each strategy has tradeoffs between speed, safety, and resource usage.
          </p>

          {/* Strategy Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {(Object.keys(deploymentStrategies) as Array<keyof typeof deploymentStrategies>).map(strategy => (
              <button
                key={strategy}
                onClick={() => setDeploymentScenario(strategy)}
                style={{
                  padding: '1rem',
                  background: deploymentScenario === strategy ? '#9c0606' : '#f8fafc',
                  color: deploymentScenario === strategy ? 'white' : '#1e293b',
                  border: deploymentScenario === strategy ? 'none' : '2px solid #e2e8f0',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                {deploymentStrategies[strategy].name}
              </button>
            ))}
          </div>

          {/* Strategy Details */}
          <div style={{
            background: '#f8fafc',
            border: '2px solid #e2e8f0',
            borderRadius: 8,
            padding: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem' }}>
              {deploymentStrategies[deploymentScenario].name}
            </h3>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>
              {deploymentStrategies[deploymentScenario].description}
            </p>

            {/* Visual Diagram */}
            <div style={{
              background: '#1e293b',
              borderRadius: 6,
              padding: '1rem',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              color: '#10b981',
              marginBottom: '1rem'
            }}>
              <pre style={{ margin: 0, whiteSpace: 'pre' }}>
                {deploymentStrategies[deploymentScenario].diagram}
              </pre>
            </div>

            {/* Steps */}
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
                How It Works:
              </h4>
              <ol style={{ margin: 0, paddingLeft: '1.5rem', color: '#64748b' }}>
                {deploymentStrategies[deploymentScenario].steps.map((step, idx) => (
                  <li key={idx} style={{ marginBottom: '0.25rem' }}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Pros & Cons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div>
                <h4 style={{ color: '#10b981', fontSize: '1rem', marginBottom: '0.5rem' }}>✓ Pros</h4>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                  {deploymentStrategies[deploymentScenario].pros.map((pro, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>{pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#ef4444', fontSize: '1rem', marginBottom: '0.5rem' }}>✗ Cons</h4>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                  {deploymentStrategies[deploymentScenario].cons.map((con, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Rollback Demo */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
            ⏪ Rollback: When Things Go Wrong
          </h2>

          <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Deployments fail. Code has bugs. Rollback should be one command, no panic, no downtime.
            Kubernetes makes this trivial—if you've been tagging images correctly.
          </p>

          <div style={{ marginBottom: '1rem' }}>
            <button
              onClick={() => setShowRollback(!showRollback)}
              style={{
                padding: '0.75rem 1.5rem',
                background: showRollback ? '#ef4444' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              {showRollback ? '🔥 Oh No! Rollback Now!' : '🚀 Deploy v1.2.4'}
            </button>
          </div>

          {showRollback ? (
            <div style={{
              background: '#fef2f2',
              border: '2px solid #ef4444',
              borderRadius: 8,
              padding: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#991b1b', marginBottom: '1rem' }}>
                🚨 v1.2.4 is broken! Error rate spiking!
              </h3>
              <div style={{
                background: '#1e293b',
                borderRadius: 6,
                padding: '1rem',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                color: '#ef4444',
                marginBottom: '1rem'
              }}>
                <pre style={{ margin: 0 }}>{`# Check what's deployed
kubectl rollout history deployment/myapp

REVISION  CHANGE-CAUSE
1         <none>
2         kubectl set image deployment/myapp myapp=myapp:v1.2.3
3         kubectl set image deployment/myapp myapp=myapp:v1.2.4

# ROLLBACK TO PREVIOUS VERSION
kubectl rollout undo deployment/myapp

# Or rollback to specific revision
kubectl rollout undo deployment/myapp --to-revision=2

# Watch it rollback
kubectl rollout status deployment/myapp
Waiting for rollout to finish: 1 out of 3 new replicas...
Waiting for rollout to finish: 2 out of 3 new replicas...
deployment "myapp" successfully rolled out

# Back to v1.2.3 ✅`}</pre>
              </div>
              <div style={{
                background: '#dcfce7',
                borderLeft: '4px solid #10b981',
                padding: '1rem',
                borderRadius: 4,
                color: '#166534'
              }}>
                <strong>Crisis averted!</strong> Rollback took 30 seconds. Users saw minimal impact.
                v1.2.3 is running again. Now debug v1.2.4 in non-prod.
              </div>
            </div>
          ) : (
            <div style={{
              background: '#f0fdf4',
              border: '2px solid #10b981',
              borderRadius: 8,
              padding: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#166534', marginBottom: '1rem' }}>
                ✅ v1.2.4 deployed successfully
              </h3>
              <div style={{
                background: '#1e293b',
                borderRadius: 6,
                padding: '1rem',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                color: '#10b981'
              }}>
                <pre style={{ margin: 0 }}>{`# Deploy new version
kubectl set image deployment/myapp myapp=myapp:v1.2.4

# Watch the rollout
kubectl rollout status deployment/myapp
Waiting for deployment "myapp" rollout to finish...
1 out of 3 new replicas have been updated...
2 out of 3 new replicas have been updated...
deployment "myapp" successfully rolled out ✅`}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Best Practices */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
            ✅ Deployment Best Practices
          </h2>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              {
                title: 'Always Use Specific Tags',
                description: 'Never use :latest in production. Use semver or git SHA. You must know what version is running.',
                example: 'myapp:v1.2.3 or myapp:a3f5b2c'
              },
              {
                title: 'Set Resource Requests/Limits',
                description: 'Prevents one bad deployment from taking down the whole cluster.',
                example: 'requests: cpu: 100m, memory: 256Mi'
              },
              {
                title: 'Configure Health Checks',
                description: 'Liveness and readiness probes catch broken deployments before users do.',
                example: 'livenessProbe: httpGet on /health'
              },
              {
                title: 'Use maxSurge and maxUnavailable',
                description: 'Control how many Pods update at once. Slower = safer.',
                example: 'maxSurge: 1, maxUnavailable: 0 = one at a time'
              },
              {
                title: 'Enable Rollout History',
                description: 'Keep deployment history so you can rollback to any version.',
                example: 'revisionHistoryLimit: 10'
              },
              {
                title: 'Test in Staging First',
                description: 'Never deploy directly to production. Staging catches 90% of issues.',
                example: 'staging → canary → production'
              },
              {
                title: 'Monitor During Rollout',
                description: 'Watch error rates, latency, logs during deployment. Catch issues early.',
                example: 'Prometheus alerts during deployments'
              },
              {
                title: 'Automate Everything',
                description: 'Manual deployments cause mistakes. CI/CD automates tagging, building, deploying.',
                example: 'GitHub Actions → build → push → deploy'
              }
            ].map((practice, idx) => (
              <div key={idx} style={{
                background: '#f8fafc',
                border: '2px solid #e2e8f0',
                borderRadius: 8,
                padding: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
                  {practice.title}
                </h3>
                <p style={{ color: '#64748b', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                  {practice.description}
                </p>
                <div style={{
                  background: '#1e293b',
                  borderRadius: 6,
                  padding: '0.75rem',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  color: '#10b981'
                }}>
                  💡 {practice.example}
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
          <Link href="/module-8-3" legacyBehavior>
            <a style={{
              padding: '0.75rem 1.5rem',
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: 8,
              color: '#1e293b',
              textDecoration: 'none',
              fontWeight: 600
            }}>
              ← 8.3 Debugging Kubernetes
            </a>
          </Link>
          <Link href="/module-9-2" legacyBehavior>
            <a style={{
              padding: '0.75rem 1.5rem',
              background: '#9c0606',
              borderRadius: 8,
              color: 'white',
              textDecoration: 'none',
              fontWeight: 600
            }}>
              9.2 GitOps →
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}
