import { useState } from 'react'
import styles from '../styles/Home.module.css'
import ModuleShell from '../components/module/ModuleShell'
import Callout from '../components/module/Callout'
import TermBox from '../components/module/TermBox'

const tools = {
  argocd: {
    name: 'Argo CD',
    logo: '🦑',
    description: 'Kubernetes-native GitOps tool with a beautiful web UI. Most popular choice.',
    maintainer: 'CNCF (Cloud Native Computing Foundation)',
    color: '#f59e0b',
    pros: [
      'Beautiful, intuitive web UI',
      'Manual sync option (emergency deploys)',
      'Multi-cluster support',
      'SSO integration (OIDC, SAML)',
      'Rollback UI with one click',
      'Strong RBAC support'
    ],
    cons: [
      'Can be resource-heavy',
      'Complex initial setup',
      'Requires Redis for HA'
    ],
    useCase: 'Teams that want visibility and control. Great for multi-tenant clusters.',
    install: [
      '# Install Argo CD',
      'kubectl create namespace argocd',
      'kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml',
      '',
      '# Get admin password',
      'kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d',
      '',
      '# Port forward to UI',
      'kubectl port-forward svc/argocd-server -n argocd 8080:443'
    ]
  },
  flux: {
    name: 'Flux CD',
    logo: '🌊',
    description: 'GitOps operator built by Weaveworks. Fully automated, no UI. Just set and forget.',
    maintainer: 'CNCF (Cloud Native Computing Foundation)',
    color: '#3b82f6',
    pros: [
      'Fully automated (no manual sync)',
      'Lightweight and fast',
      'Native Kustomize/Helm support',
      'Multi-tenancy with namespaces',
      'Image automation (update image tags)',
      'Notification system'
    ],
    cons: [
      'No built-in UI (use CLI)',
      'Harder to debug without UI',
      'Steeper learning curve'
    ],
    useCase: 'Full automation. No human clicks. Perfect for mature DevOps teams.',
    install: [
      '# Install Flux CLI',
      'brew install fluxcd/tap/flux',
      '',
      '# Bootstrap Flux in cluster',
      'flux bootstrap github \\',
      '  --owner=myorg \\',
      '  --repository=myrepo \\',
      '  --branch=main \\',
      '  --path=./clusters/production',
      '',
      '# Flux auto-deploys from Git now'
    ]
  },
  manual: {
    name: 'Manual kubectl',
    logo: '👨‍💻',
    description: 'You, a terminal, and kubectl. No automation, no safety net. Not GitOps.',
    maintainer: 'You (good luck)',
    color: '#64748b',
    pros: [
      'Simple to understand',
      'No additional tools needed',
      'Quick for small projects'
    ],
    cons: [
      'No audit trail (who deployed what?)',
      'No drift detection',
      'Manual rollback',
      'Prone to human error',
      'Doesn\'t scale past 1 person',
      'Not declarative',
      'No Git history'
    ],
    useCase: 'Local dev, learning, prototypes. Never in production.',
    install: [
      '# Just use kubectl',
      'kubectl apply -f deployment.yaml',
      '',
      '# That\'s it. No automation.',
      '# No drift detection.',
      '# No rollback.',
      '# Just you and the cluster.'
    ]
  }
}

const stateDescriptions = {
  synced: {
    title: '✅ Synced',
    color: '#10b981',
    description: 'Git matches cluster. Everything is in harmony.',
    details: 'Argo CD checks Git every 3 minutes. Cluster state matches what\'s in Git. No manual changes detected.',
    icon: '✅'
  },
  outOfSync: {
    title: '⚠️ Out of Sync',
    color: '#f59e0b',
    description: 'Someone made manual changes. Git and cluster don\'t match.',
    details: 'Either someone ran kubectl apply manually, or Git has new commits that haven\'t been deployed yet. Argo CD will auto-sync or wait for manual approval.',
    icon: '⚠️'
  },
  syncing: {
    title: '🔄 Syncing',
    color: '#3b82f6',
    description: 'Deploying changes from Git right now.',
    details: 'Argo CD is applying the latest Git commit to the cluster. Pods are updating, Services are being created, ConfigMaps are syncing.',
    icon: '🔄'
  }
}

const principles = [
  {
    number: '1',
    title: 'Declarative',
    description: 'Everything is defined in YAML/JSON. No "run this script" imperative commands.',
    example: 'deployment.yaml, service.yaml, ingress.yaml'
  },
  {
    number: '2',
    title: 'Versioned',
    description: 'All config stored in Git. Every change is a commit. Full history forever.',
    example: 'git log shows who changed what, when, why'
  },
  {
    number: '3',
    title: 'Immutable',
    description: 'Don\'t edit running resources. Change Git, redeploy from scratch.',
    example: 'No kubectl edit, no manual patches'
  },
  {
    number: '4',
    title: 'Automated',
    description: 'Git is the only source of truth. Tools continuously sync cluster to match Git.',
    example: 'Argo CD watches Git, auto-deploys changes'
  }
]

const workflowSteps = [
  {
    step: 1,
    title: 'Developer commits code',
    description: 'Push to feature branch, open Pull Request',
    command: 'git commit -m "feat: add user dashboard"\ngit push origin feature/user-dashboard'
  },
  {
    step: 2,
    title: 'CI builds and tests',
    description: 'GitHub Actions runs tests, builds Docker image, pushes to registry',
    command: 'docker build -t myapp:a3f5b2c .\ndocker push myapp:a3f5b2c'
  },
  {
    step: 3,
    title: 'Update Git config repo',
    description: 'CI or developer updates deployment.yaml with new image tag',
    command: 'sed -i "s/image: myapp:.*/image: myapp:a3f5b2c/" k8s/deployment.yaml\ngit commit -am "deploy: update to a3f5b2c"\ngit push'
  },
  {
    step: 4,
    title: 'Argo CD detects change',
    description: 'Argo CD polls Git every 3 minutes, sees new commit',
    command: '# Argo CD internal process\n"New commit detected in main branch"\n"Application is OutOfSync"'
  },
  {
    step: 5,
    title: 'Auto-sync (if enabled)',
    description: 'Argo CD applies changes to cluster automatically',
    command: 'kubectl apply -f deployment.yaml\n# Argo CD does this for you'
  },
  {
    step: 6,
    title: 'Health checks pass',
    description: 'New Pods start, readiness probes pass, old Pods terminate',
    command: 'kubectl rollout status deployment/myapp\ndeployment "myapp" successfully rolled out ✅'
  },
  {
    step: 7,
    title: 'Application synced',
    description: 'Cluster now matches Git. Deployment complete.',
    command: '# Argo CD status\nStatus: Synced\nHealth: Healthy\nCommit: a3f5b2c'
  }
]

const reasons = [
  {
    icon: '📖',
    title: 'Audit Trail',
    description: 'Every deployment is a Git commit. git log shows who changed what, when, and why.',
    example: 'git log --oneline → see entire deployment history'
  },
  {
    icon: '⏪',
    title: 'Easy Rollback',
    description: 'Broken deploy? git revert the commit. Argo CD auto-deploys the previous version.',
    example: 'git revert HEAD → instant rollback'
  },
  {
    icon: '🔒',
    title: 'Security',
    description: 'No one has kubectl access. All changes go through Git + PR review + approvals.',
    example: 'Junior dev can\'t kubectl delete prod by accident'
  },
  {
    icon: '🌍',
    title: 'Disaster Recovery',
    description: 'Cluster explodes? Clone Git repo, point new cluster at it, everything rebuilds.',
    example: 'Full cluster recovery from Git in minutes'
  },
  {
    icon: '👥',
    title: 'Collaboration',
    description: 'All infra changes go through Pull Requests. Code review for infrastructure.',
    example: 'PR: "Increase replicas to 10" → team reviews → merge → auto-deploy'
  },
  {
    icon: '🔍',
    title: 'Transparency',
    description: 'Everyone sees what\'s deployed. No "mystery changes" or tribal knowledge.',
    example: 'git show HEAD → exactly what\'s running in prod right now'
  },
  {
    icon: '🚫',
    title: 'No Drift',
    description: 'Manual kubectl changes get auto-reverted. Cluster always matches Git.',
    example: 'Someone runs kubectl scale → Argo CD reverts it'
  },
  {
    icon: '🤖',
    title: 'Automation',
    description: 'CI updates Git, GitOps deploys. Zero human kubectl commands.',
    example: 'GitHub Actions → update image tag → commit → auto-deploy'
  }
]

const gitopsPractices = [
  {
    title: 'Separate App Code from Config',
    description: 'App code in one repo, Kubernetes manifests in another. Keep them decoupled.',
    good: 'app-repo (code) + config-repo (k8s YAML)',
    bad: 'Everything in one repo'
  },
  {
    title: 'Use Pull Requests for Changes',
    description: 'Never commit directly to main. All changes reviewed, tested, approved.',
    good: 'Feature branch → PR → review → merge → auto-deploy',
    bad: 'git push main --force'
  },
  {
    title: 'Pin Image Tags',
    description: 'Use specific image tags (semver or SHA), never :latest.',
    good: 'image: myapp:v1.2.3 or myapp:a3f5b2c',
    bad: 'image: myapp:latest'
  },
  {
    title: 'Enable Auto-Sync (Carefully)',
    description: 'Auto-sync for dev/staging. Manual sync for prod (extra safety).',
    good: 'Dev auto-syncs, Prod requires manual approval',
    bad: 'Auto-sync everywhere with no oversight'
  },
  {
    title: 'Monitor Sync Status',
    description: 'Set up alerts for OutOfSync or Degraded applications.',
    good: 'Slack alert: "myapp is OutOfSync for 10 minutes"',
    bad: 'Find out days later something broke'
  },
  {
    title: 'Use Kustomize or Helm',
    description: 'Templating tools reduce duplication across environments.',
    good: 'base/ + overlays/dev + overlays/prod',
    bad: 'Copy-paste YAML for each environment'
  }
]

export default function GitOps() {
  const [selectedTool, setSelectedTool] = useState<keyof typeof tools>('argocd')
  const [gitopsState, setGitopsState] = useState<keyof typeof stateDescriptions>('synced')
  const [showWorkflow, setShowWorkflow] = useState(false)

  const tool = tools[selectedTool]
  const state = stateDescriptions[gitopsState]

  return (
    <ModuleShell id="9-2" subtitle="Part 9: CI/CD & GitOps">
      <section className={styles.spotlight}>
        <h2>🌳 What is GitOps?</h2>
        <p>
          GitOps is simple: Git is your source of truth. The cluster should always match what's in Git.
          If someone makes manual changes, they get reverted. If you update Git, the cluster updates
          automatically. No kubectl needed. Just Git commits.
        </p>

        <h3>The Core Principles:</h3>
        <div style={{ display: 'grid', gap: '1rem', margin: '1rem 0 1.5rem' }}>
          {principles.map((principle, idx) => (
            <div key={idx} style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'flex', gap: '1rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, flexShrink: 0 }}>
                {principle.number}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>{principle.title}</h4>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{principle.description}</p>
                <TermBox copyable={false}>{principle.example}</TermBox>
              </div>
            </div>
          ))}
        </div>

        <Callout variant="success" title="The GitOps Promise:">
          <strong>"If it's not in Git, it's not in production."</strong>{' '}
          Want to deploy? Commit to Git. Want to rollback? Revert the commit. Want an audit trail?
          Look at git log. Want disaster recovery? Clone the repo and redeploy.
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>🛠️ GitOps Tools</h2>

        <div style={{ display: 'flex', gap: '1rem', margin: '1.5rem 0', flexWrap: 'wrap' }}>
          {(Object.keys(tools) as Array<keyof typeof tools>).map(t => {
            const active = selectedTool === t
            return (
              <button
                key={t}
                onClick={() => setSelectedTool(t)}
                style={{
                  padding: '1rem 1.5rem',
                  background: active ? tools[t].color : 'var(--color-bg-tertiary)',
                  color: active ? '#fff' : 'var(--color-text-secondary)',
                  border: active ? 'none' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem'
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{tools[t].logo}</span>
                {tools[t].name}
              </button>
            )
          })}
        </div>

        <div style={{ background: 'var(--color-bg-tertiary)', border: `2px solid ${tool.color}`, borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '3rem' }}>{tool.logo}</span>
            <div>
              <h3 style={{ margin: 0 }}>{tool.name}</h3>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{tool.maintainer}</div>
            </div>
          </div>

          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem' }}>{tool.description}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <h4 style={{ color: 'var(--color-success)', marginBottom: '0.5rem' }}>✓ Pros</h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                {tool.pros.map((pro, idx) => <li key={idx} style={{ marginBottom: '0.25rem' }}>{pro}</li>)}
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'var(--color-danger, #ef4444)', marginBottom: '0.5rem' }}>✗ Cons</h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                {tool.cons.map((con, idx) => <li key={idx} style={{ marginBottom: '0.25rem' }}>{con}</li>)}
              </ul>
            </div>
          </div>

          <Callout variant="warning" title="Use Case">{tool.useCase}</Callout>

          <h4 style={{ marginBottom: '0.5rem' }}>Installation:</h4>
          <TermBox>{tool.install.join('\n')}</TermBox>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>🔄 GitOps State: Sync vs Drift</h2>
        <p>
          GitOps tools continuously watch both Git and your cluster. When they differ, you're "out of sync."
          The tool will either auto-heal (revert manual changes) or wait for manual sync.
        </p>

        <div style={{ display: 'flex', gap: '1rem', margin: '1.5rem 0', flexWrap: 'wrap' }}>
          {(Object.keys(stateDescriptions) as Array<keyof typeof stateDescriptions>).map(s => {
            const active = gitopsState === s
            return (
              <button
                key={s}
                onClick={() => setGitopsState(s)}
                style={{
                  padding: '1rem 1.5rem',
                  background: active ? stateDescriptions[s].color : 'var(--color-bg-tertiary)',
                  color: active ? '#fff' : 'var(--color-text-secondary)',
                  border: active ? 'none' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'var(--transition-fast)',
                  fontSize: '1rem'
                }}
              >
                {stateDescriptions[s].icon} {stateDescriptions[s].title}
              </button>
            )
          })}
        </div>

        <div style={{ background: 'var(--color-bg-tertiary)', border: `2px solid ${state.color}`, borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
          <h3 style={{ marginTop: 0 }}>{state.title}</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem' }}>{state.description}</p>

          <div style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '2rem', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📁</div>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Git Repo</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>commit: a3f5b2c</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>replicas: 3</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: state.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto', animation: gitopsState === 'syncing' ? 'spin 2s linear infinite' : 'none' }}>
                  {state.icon}
                </div>
                <div style={{ marginTop: '0.5rem', fontWeight: 600, color: state.color }}>
                  {gitopsState === 'synced' ? 'In Sync' : gitopsState === 'outOfSync' ? 'Drift Detected' : 'Syncing...'}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>☸️</div>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Cluster</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                  {gitopsState === 'outOfSync' ? 'commit: b8e2d1a' : 'commit: a3f5b2c'}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  {gitopsState === 'outOfSync' ? 'replicas: 5 ⚠️' : 'replicas: 3'}
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--color-bg-secondary)', borderLeft: `4px solid ${state.color}`, padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{state.details}</p>
          </div>
        </div>

        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </section>

      <section className={styles.spotlight}>
        <h2>🔄 The GitOps Workflow</h2>

        <button
          onClick={() => setShowWorkflow(!showWorkflow)}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '1rem',
            marginBottom: '1rem'
          }}
        >
          {showWorkflow ? 'Hide Workflow' : 'Show Complete Workflow'}
        </button>

        {showWorkflow && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {workflowSteps.map((item, idx) => (
              <div key={idx} style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', borderLeft: '4px solid var(--color-primary)', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'flex', gap: '1rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700, flexShrink: 0 }}>
                  {item.step}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>{item.title}</h4>
                  <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>{item.description}</p>
                  <TermBox>{item.command}</TermBox>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.spotlight}>
        <h2>🎯 Why Git Becomes Your Source of Truth</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {reasons.map((reason, idx) => (
            <div key={idx} style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'flex', gap: '1rem' }}>
              <div style={{ fontSize: '2.5rem', flexShrink: 0 }}>{reason.icon}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1.1rem' }}>{reason.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>{reason.description}</p>
                <TermBox copyable={false}>💡 {reason.example}</TermBox>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>✅ GitOps Best Practices</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {gitopsPractices.map((practice, idx) => (
            <div key={idx} style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
              <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1.1rem' }}>{practice.title}</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>{practice.description}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem' }}>
                <Callout variant="success" title="✓ Good">{practice.good}</Callout>
                <Callout variant="danger" title="✗ Bad">{practice.bad}</Callout>
              </div>
            </div>
          ))}
        </div>
      </section>
    </ModuleShell>
  )
}
