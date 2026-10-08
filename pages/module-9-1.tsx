import { useState } from 'react'
import styles from '../styles/Home.module.css'
import moduleStyles from '../styles/Module.module.css'
import ModuleShell from '../components/module/ModuleShell'
import Callout from '../components/module/Callout'
import TermBox from '../components/module/TermBox'

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

const bestPractices = [
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
]

export default function DeployingTheRightWay() {
  const [selectedStrategy, setSelectedStrategy] = useState<keyof typeof taggingStrategies>('latest')
  const [deploymentScenario, setDeploymentScenario] = useState<keyof typeof deploymentStrategies>('rolling')
  const [showRollback, setShowRollback] = useState(false)

  const tag = taggingStrategies[selectedStrategy]
  const deploy = deploymentStrategies[deploymentScenario]

  return (
    <ModuleShell id="9-1" subtitle="Part 9: CI/CD & GitOps">
      <section className={styles.spotlight}>
        <h2>🏷️ Image Tagging Strategies</h2>
        <p>
          You built a container. Now what? How do you tag it? How do you deploy it without breaking
          production? How do you roll back when things go wrong? These decisions seem small but they
          determine whether your deployments are smooth or chaotic.
        </p>
        <p>
          Your image tag is your version control. Choose wrong and you'll lose track of what's
          deployed, struggle to rollback, and confuse everyone. Choose right and deployments
          become predictable, traceable, and safe.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '1.5rem 0' }}>
          {(Object.keys(taggingStrategies) as Array<keyof typeof taggingStrategies>).map(strategy => {
            const active = selectedStrategy === strategy
            return (
              <button
                key={strategy}
                onClick={() => setSelectedStrategy(strategy)}
                style={{
                  padding: '1rem',
                  background: active ? taggingStrategies[strategy].color : 'var(--color-bg-tertiary)',
                  color: active ? '#fff' : 'var(--color-text-secondary)',
                  border: active ? 'none' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'var(--transition-fast)',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>{taggingStrategies[strategy].name}</div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', opacity: active ? 1 : 0.7 }}>
                  {taggingStrategies[strategy].example}
                </div>
              </button>
            )
          })}
        </div>

        <div style={{
          background: 'var(--color-bg-tertiary)',
          border: `2px solid ${tag.color}`,
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ margin: 0 }}>{tag.name}</h3>
            <div style={{ padding: '0.5rem 1rem', background: tag.color, color: '#fff', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '0.875rem' }}>
              {tag.verdict}
            </div>
          </div>

          <TermBox copyable={false}>{tag.example}</TermBox>

          <div className={moduleStyles.grid} style={{ margin: '1rem 0' }}>
            <div>
              <h4 style={{ color: 'var(--color-success)', marginBottom: '0.5rem' }}>✓ Pros</h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                {tag.pros.map((pro, idx) => <li key={idx} style={{ marginBottom: '0.25rem' }}>{pro}</li>)}
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'var(--color-danger, #ef4444)', marginBottom: '0.5rem' }}>✗ Cons</h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                {tag.cons.map((con, idx) => <li key={idx} style={{ marginBottom: '0.25rem' }}>{con}</li>)}
              </ul>
            </div>
          </div>

          <Callout variant="warning" title="Use Case">{tag.useCase}</Callout>

          <h4 style={{ marginBottom: '0.5rem' }}>Example Commands:</h4>
          <TermBox>{tag.commands.join('\n')}</TermBox>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>🔒 Immutable Deployments</h2>
        <p>
          <strong>Immutable = Never Change Running Containers.</strong>{' '}
          Need to update? Deploy a new version. Don't SSH in and change files. Don't restart
          processes. Don't patch running containers. Deploy fresh, always.
        </p>

        <div style={{ display: 'grid', gap: '1rem', margin: '1.5rem 0' }}>
          <Callout variant="success" title="✓ The Right Way">
            <ul style={{ margin: '0 0 1rem 0', paddingLeft: '1.5rem' }}>
              <li>Build new image with changes</li>
              <li>Tag it with new version/SHA</li>
              <li>Deploy new Pods with new image</li>
              <li>Let Kubernetes replace old Pods</li>
              <li>Old image still exists for rollback</li>
            </ul>
            <TermBox>{`# Build new image
docker build -t myapp:v1.2.4 .
docker push myapp:v1.2.4

# Update Deployment
kubectl set image deployment/myapp myapp=myapp:v1.2.4

# Kubernetes handles the rest`}</TermBox>
          </Callout>

          <Callout variant="danger" title="✗ The Wrong Way">
            <ul style={{ margin: '0 0 1rem 0', paddingLeft: '1.5rem' }}>
              <li>SSH into Pod and edit files</li>
              <li>kubectl cp config files into running Pod</li>
              <li>Change environment variables at runtime</li>
              <li>Patch processes without restarting</li>
              <li>Hope it works until next restart</li>
            </ul>
            <TermBox>{`# DON'T DO THIS
kubectl exec -it myapp-abc -- bash
root@myapp-abc:/# vim config.json  # Changed!
root@myapp-abc:/# systemctl restart app

# Next restart = changes LOST 💀`}</TermBox>
          </Callout>
        </div>

        <Callout variant="warning" title="Why Immutable?">
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li><strong>Consistency:</strong> Every Pod is identical, built from same image</li>
            <li><strong>Reproducibility:</strong> Can recreate exact state anytime</li>
            <li><strong>Rollback:</strong> Old image still exists, just point back to it</li>
            <li><strong>Auditability:</strong> Know exactly what's running (image tag = version)</li>
            <li><strong>No Drift:</strong> Pods can't diverge from each other over time</li>
          </ul>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>🚀 Deployment Strategies</h2>
        <p>
          You've got a new image. How do you actually deploy it? All at once? Gradually? With a backup?
          Each strategy has tradeoffs between speed, safety, and resource usage.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '1.5rem 0' }}>
          {(Object.keys(deploymentStrategies) as Array<keyof typeof deploymentStrategies>).map(strategy => {
            const active = deploymentScenario === strategy
            return (
              <button
                key={strategy}
                onClick={() => setDeploymentScenario(strategy)}
                style={{
                  padding: '1rem',
                  background: active ? 'var(--color-primary)' : 'var(--color-bg-tertiary)',
                  color: active ? '#fff' : 'var(--color-text-secondary)',
                  border: active ? 'none' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'var(--transition-fast)'
                }}
              >
                {deploymentStrategies[strategy].name}
              </button>
            )
          })}
        </div>

        <div style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
          <h3 style={{ marginTop: 0 }}>{deploy.name}</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>{deploy.description}</p>

          <TermBox copyable={false}>{deploy.diagram}</TermBox>

          <h4>How It Works:</h4>
          <ol style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--color-text-secondary)' }}>
            {deploy.steps.map((step, idx) => <li key={idx} style={{ marginBottom: '0.25rem' }}>{step}</li>)}
          </ol>

          <div className={moduleStyles.grid} style={{ marginTop: '1rem' }}>
            <div>
              <h4 style={{ color: 'var(--color-success)', marginBottom: '0.5rem' }}>✓ Pros</h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                {deploy.pros.map((pro, idx) => <li key={idx} style={{ marginBottom: '0.25rem' }}>{pro}</li>)}
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'var(--color-danger, #ef4444)', marginBottom: '0.5rem' }}>✗ Cons</h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                {deploy.cons.map((con, idx) => <li key={idx} style={{ marginBottom: '0.25rem' }}>{con}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>⏪ Rollback: When Things Go Wrong</h2>
        <p>
          Deployments fail. Code has bugs. Rollback should be one command, no panic, no downtime.
          Kubernetes makes this trivial—if you've been tagging images correctly.
        </p>

        <button
          onClick={() => setShowRollback(!showRollback)}
          style={{
            padding: '0.75rem 1.5rem',
            background: showRollback ? '#ef4444' : 'var(--color-success)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '1rem',
            marginBottom: '1rem'
          }}
        >
          {showRollback ? '🔥 Oh No! Rollback Now!' : '🚀 Deploy v1.2.4'}
        </button>

        {showRollback ? (
          <Callout variant="danger" title="🚨 v1.2.4 is broken! Error rate spiking!">
            <TermBox>{`# Check what's deployed
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

# Back to v1.2.3 ✅`}</TermBox>
            <p style={{ marginBottom: 0 }}>
              <strong>Crisis averted!</strong> Rollback took 30 seconds. Users saw minimal impact.
              v1.2.3 is running again. Now debug v1.2.4 in non-prod.
            </p>
          </Callout>
        ) : (
          <Callout variant="success" title="✅ v1.2.4 deployed successfully">
            <TermBox>{`# Deploy new version
kubectl set image deployment/myapp myapp=myapp:v1.2.4

# Watch the rollout
kubectl rollout status deployment/myapp
Waiting for deployment "myapp" rollout to finish...
1 out of 3 new replicas have been updated...
2 out of 3 new replicas have been updated...
deployment "myapp" successfully rolled out ✅`}</TermBox>
          </Callout>
        )}
      </section>

      <section className={styles.spotlight}>
        <h2>✅ Deployment Best Practices</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {bestPractices.map((practice, idx) => (
            <div key={idx} style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
              <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1.1rem' }}>{practice.title}</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>{practice.description}</p>
              <TermBox copyable={false}>💡 {practice.example}</TermBox>
            </div>
          ))}
        </div>
      </section>
    </ModuleShell>
  )
}
