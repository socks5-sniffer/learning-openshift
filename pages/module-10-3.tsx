import { useState } from 'react'
import styles from '../styles/Home.module.css'
import ModuleShell from '../components/module/ModuleShell'
import Callout from '../components/module/Callout'

interface Alternative {
  name: string
  tools: string
  why: string
  cost: string
  setup: string
  bestFor: string
}
interface Scenario {
  name: string
  icon: string
  color: string
  problem: string
  kubernetes: { verdict: string; why: string; complexity: string; example: string }
  alternatives: Alternative[]
}

const scenarios: Record<'simple' | 'cost' | 'team' | 'startup' | 'stateful', Scenario> = {
  simple: {
    name: 'Your App Is Simple',
    icon: '🎯',
    color: '#10b981',
    problem: 'You have 1-3 services, low traffic, straightforward deployment',
    kubernetes: {
      verdict: '❌ Overkill',
      why: 'K8s adds massive complexity for zero benefit',
      complexity: '100x more complex than needed',
      example: 'Running a blog with 100 users/day on Kubernetes'
    },
    alternatives: [
      { name: 'Platform as a Service (PaaS)', tools: 'Heroku, Railway, Render, Fly.io', why: 'Git push to deploy. Zero infrastructure management.', cost: '$7-50/month', setup: 'git push heroku main', bestFor: 'MVPs, side projects, small apps' },
      { name: 'Serverless', tools: 'AWS Lambda, Vercel, Netlify, Cloudflare Workers', why: 'Pay per request. Infinite scaling. Zero servers.', cost: '$0 - $20/month for small apps', setup: 'vercel deploy', bestFor: 'APIs, static sites, event-driven' },
      { name: 'Docker Compose', tools: 'Docker Compose on single VPS', why: 'All the containers, none of the complexity.', cost: '$5-20/month (DigitalOcean)', setup: 'docker-compose up -d', bestFor: 'Hobby projects, learning, prototypes' },
      { name: 'Managed Services', tools: 'AWS Amplify, Google App Engine, Azure App Service', why: 'Cloud provider handles everything.', cost: '$10-100/month', setup: 'gcloud app deploy', bestFor: 'Teams already on cloud, don\'t want ops' }
    ]
  },
  cost: {
    name: 'The Math Doesn\'t Work',
    icon: '💸',
    color: '#ef4444',
    problem: 'Kubernetes costs more than your entire revenue',
    kubernetes: {
      verdict: '❌ Too Expensive',
      why: 'Control plane + nodes + engineering time = $$$$',
      complexity: 'Minimum $150/month + days of setup',
      example: 'Spending $500/month on K8s for a $200/month SaaS'
    },
    alternatives: [
      { name: 'Heroku / Railway', tools: 'Fully managed platforms', why: 'Fixed cost, no surprises, includes everything', cost: '$7-100/month all-in', setup: '5 minutes', bestFor: 'Predictable costs, small scale' },
      { name: 'Serverless', tools: 'Lambda, Cloud Functions, Cloud Run', why: 'Pay only for execution time', cost: '$0-50/month for <100k requests', setup: '30 minutes', bestFor: 'Variable traffic, low volume' },
      { name: 'Single VPS', tools: 'DigitalOcean, Linode, Hetzner', why: 'One server, Docker Compose, done', cost: '$5-40/month', setup: '1 hour', bestFor: 'Budget-conscious, technical founder' },
      { name: 'Shared Hosting', tools: 'Traditional web hosting', why: 'Cheapest option for simple sites', cost: '$3-15/month', setup: 'FTP upload', bestFor: 'WordPress, PHP apps, no containers' }
    ]
  },
  team: {
    name: 'Your Team Isn\'t Ready',
    icon: '👥',
    color: '#f59e0b',
    problem: 'No one on your team knows Kubernetes',
    kubernetes: {
      verdict: '❌ Wrong Time',
      why: 'Learning K8s while building product = disaster',
      complexity: '6+ months to become proficient',
      example: '2-person startup spending 50% of time debugging K8s'
    },
    alternatives: [
      { name: 'Managed PaaS', tools: 'Heroku, Render, Fly.io', why: 'Abstracts all infrastructure. Focus on code.', cost: 'Time saved > money spent', setup: 'Learn in 1 day', bestFor: 'Small teams, rapid iteration' },
      { name: 'Cloud Run / App Engine', tools: 'Google Cloud Run, AWS App Runner', why: 'Container-based, Kubernetes under the hood, but hidden', cost: 'Pay per use', setup: 'Learn in 1 week', bestFor: 'Want containers without K8s complexity' },
      { name: 'Nomad', tools: 'HashiCorp Nomad', why: 'Like Kubernetes but 10x simpler', cost: 'Free, open source', setup: 'Learn in 2 weeks', bestFor: 'Need orchestration, want simplicity' },
      { name: 'Grow Then Migrate', tools: 'Start simple, move to K8s later', why: 'Build product first, infrastructure later', cost: 'Rational', setup: 'When you have 5+ engineers', bestFor: 'Every startup ever' }
    ]
  },
  startup: {
    name: 'You\'re a Startup',
    icon: '🚀',
    color: '#8b5cf6',
    problem: 'Speed to market matters more than architecture',
    kubernetes: {
      verdict: '❌ Premature Optimization',
      why: 'K8s before product-market fit is self-sabotage',
      complexity: 'Distracts from actual business goals',
      example: 'Perfecting K8s config instead of talking to customers'
    },
    alternatives: [
      { name: 'Vercel / Netlify', tools: 'Frontend + serverless backend', why: 'Deploy in seconds, focus on features', cost: 'Free tier → $20/month', setup: 'git push', bestFor: 'Web apps, Next.js, React' },
      { name: 'Supabase / Firebase', tools: 'Backend as a Service', why: 'Database, auth, storage, APIs = done', cost: 'Free → $25/month', setup: '1 hour', bestFor: 'Mobile apps, CRUD apps' },
      { name: 'Railway / Fly.io', tools: 'Simple container hosting', why: 'Docker without the K8s overhead', cost: '$5-50/month', setup: '30 minutes', bestFor: 'Custom backends, APIs' },
      { name: 'Managed Database + Serverless', tools: 'Postgres (Neon) + Lambda', why: 'Pay per use, scales to zero', cost: '$0-100/month', setup: '2 hours', bestFor: 'APIs, microservices' }
    ]
  },
  stateful: {
    name: 'It\'s Mostly Databases',
    icon: '🗄️',
    color: '#3b82f6',
    problem: 'Your workload is primarily stateful (databases, caches)',
    kubernetes: {
      verdict: '⚠️ Problematic',
      why: 'K8s is designed for stateless. StatefulSets are complex.',
      complexity: 'Storage, backups, failover = hard in K8s',
      example: 'Running production Postgres on K8s without deep expertise'
    },
    alternatives: [
      { name: 'Managed Databases', tools: 'AWS RDS, Google Cloud SQL, Azure Database', why: 'Backups, HA, scaling = handled', cost: '$15-500/month', setup: '5 minutes', bestFor: 'Production databases (Postgres, MySQL)' },
      { name: 'Specialized DB Services', tools: 'MongoDB Atlas, Redis Cloud, Elasticsearch Cloud', why: 'Experts run your DB better than you', cost: '$10-1000/month', setup: '10 minutes', bestFor: 'MongoDB, Redis, Elasticsearch' },
      { name: 'Serverless Databases', tools: 'PlanetScale, Neon, CockroachDB Serverless', why: 'Scale to zero, pay per query', cost: '$0-100/month', setup: '5 minutes', bestFor: 'Variable load, modern apps' },
      { name: 'Database Operators on K8s', tools: 'Only if you MUST: CloudNativePG, Postgres Operator', why: 'Let operator handle complexity', cost: 'Your time', setup: 'Days to weeks', bestFor: 'Regulatory reasons, can\'t use cloud DBs' }
    ]
  }
}

const sliders = [
  { key: 'services' as const, label: 'Number of Services', min: '1-3 services', max: '20+ microservices' },
  { key: 'traffic' as const, label: 'Traffic Scale', min: '<1000 users/day', max: 'Millions of requests/day' },
  { key: 'team' as const, label: 'Team Size & Expertise', min: '1-2 developers', max: '10+ with DevOps team' },
  { key: 'automation' as const, label: 'Automation Needs', min: 'Manual deploys OK', max: 'Need zero-downtime, auto-scaling' }
]

const needReasons = [
  { reason: 'Multiple teams deploying independently', pain: 'Coordination overhead killing velocity', signal: '5+ teams waiting on shared infrastructure' },
  { reason: 'True microservices (10+ services)', pain: 'Manual deployment of 10 services is unmaintainable', signal: 'Spending days on deploys, need automation' },
  { reason: 'Massive scale', pain: 'Need auto-scaling across hundreds of instances', signal: 'Current setup can\'t handle traffic spikes' },
  { reason: 'Multi-cloud or hybrid', pain: 'Running in AWS, GCP, on-prem, need consistency', signal: 'Vendor lock-in is real risk, need portability' },
  { reason: 'Complex deployment patterns', pain: 'Need blue-green, canary, A/B testing built-in', signal: 'Zero-downtime deployments are critical' },
  { reason: 'Compliance/Security requirements', pain: 'Need network policies, RBAC, audit logs', signal: 'SOC2, HIPAA, PCI-DSS certification needed' }
]

const learned = [
  'Containers & Docker', 'Pods & Deployments', 'Services & Networking', 'ConfigMaps & Secrets',
  'Volumes & Storage', 'RBAC & Security', 'Ingress & Load Balancing', 'Logging & Monitoring',
  'Debugging & Troubleshooting', 'CI/CD & GitOps', 'Failure Scenarios', 'Managed Kubernetes'
]

export default function WhenToSayNo() {
  const [selectedScenario, setSelectedScenario] = useState<keyof typeof scenarios>('simple')
  const [complexityScore, setComplexityScore] = useState({ services: 1, traffic: 1, team: 1, automation: 1 })

  const currentScenario = scenarios[selectedScenario]
  const total = complexityScore.services + complexityScore.traffic + complexityScore.team + complexityScore.automation

  const recommendation =
    total <= 6
      ? { verdict: 'Skip Kubernetes', color: '#10b981', icon: '🚫', message: 'You don\'t need K8s. Use simpler alternatives.', alternatives: ['Heroku', 'Vercel', 'Docker Compose'] }
      : total <= 10
      ? { verdict: 'Maybe Later', color: '#f59e0b', icon: '⏳', message: 'Not yet. Grow into K8s when pain becomes real.', alternatives: ['Cloud Run', 'Nomad', 'ECS'] }
      : { verdict: 'Consider Kubernetes', color: '#3b82f6', icon: '✅', message: 'Your complexity might justify K8s. Evaluate carefully.', alternatives: ['GKE Autopilot', 'EKS', 'Managed OpenShift'] }

  return (
    <ModuleShell id="10-3" subtitle="Part 10: Real-World Kubernetes">
      <section className={styles.spotlight}>
        <h2>🚫 Common "Skip Kubernetes" Scenarios</h2>
        <p>
          The most important Kubernetes lesson: <strong>you probably don't need it</strong>.
          K8s is powerful, but it's also complex, expensive, and overkill for most use cases.
          Here's when to skip it and what to use instead.
        </p>

        <Callout variant="danger" title="⚠️ Truth Bomb">
          If you're asking "Do I need Kubernetes?", the answer is probably no.
          If you NEED it, you'll know. The pain will be obvious.
        </Callout>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '1.5rem 0 2rem' }}>
          {(Object.keys(scenarios) as Array<keyof typeof scenarios>).map(scenario => {
            const active = selectedScenario === scenario
            return (
              <button
                key={scenario}
                onClick={() => setSelectedScenario(scenario)}
                style={{
                  padding: '1.5rem',
                  background: active ? scenarios[scenario].color : 'var(--color-bg-tertiary)',
                  color: active ? '#fff' : 'var(--color-text-secondary)',
                  border: active ? 'none' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'var(--transition-fast)',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{scenarios[scenario].icon}</div>
                <div style={{ fontSize: '1rem', lineHeight: 1.3 }}>{scenarios[scenario].name}</div>
              </button>
            )
          })}
        </div>

        <div style={{ background: 'var(--color-bg-tertiary)', border: `3px solid ${currentScenario.color}`, borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '4rem' }}>{currentScenario.icon}</span>
            <div>
              <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>{currentScenario.name}</h3>
              <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '1.1rem' }}>{currentScenario.problem}</p>
            </div>
          </div>

          <div style={{ background: 'var(--color-bg-secondary)', border: '3px solid #ef4444', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1.5rem', color: '#ef4444', marginTop: 0, marginBottom: '0.75rem' }}>{currentScenario.kubernetes.verdict}</h4>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', fontSize: '1.05rem' }}>
              <strong>Why:</strong> {currentScenario.kubernetes.why}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <Callout variant="danger" title="Complexity Cost">{currentScenario.kubernetes.complexity}</Callout>
              <Callout variant="danger" title="Example of Waste">{currentScenario.kubernetes.example}</Callout>
            </div>
          </div>

          <h4 style={{ fontSize: '1.3rem', color: 'var(--color-success)', marginBottom: '1rem' }}>✅ Better Alternatives</h4>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {currentScenario.alternatives.map((alt, idx) => (
              <div key={idx} style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <h5 style={{ fontSize: '1.2rem', color: 'var(--color-success)', margin: 0 }}>{idx + 1}. {alt.name}</h5>
                  <div style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-success)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{alt.cost}</div>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Tools: </span>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>{alt.tools}</span>
                </div>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                  <strong>Why:</strong> {alt.why}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem' }}>
                  <div style={{ background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>SETUP TIME</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{alt.setup}</div>
                  </div>
                  <div style={{ background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>BEST FOR</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{alt.bestFor}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>🧮 Do You Actually Need Kubernetes?</h2>
        <p>Answer honestly. Slide the scales based on your reality, not your dreams.</p>

        <div style={{ margin: '1.5rem 0 2rem' }}>
          {sliders.map(item => (
            <div key={item.key} style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600 }}>{item.label}</span>
                <span style={{ fontWeight: 700, color: complexityScore[item.key] <= 2 ? '#10b981' : complexityScore[item.key] <= 3 ? '#f59e0b' : '#3b82f6', fontSize: '1.1rem' }}>
                  {complexityScore[item.key]}/5
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={complexityScore[item.key]}
                onChange={(e) => setComplexityScore({ ...complexityScore, [item.key]: parseInt(e.target.value) })}
                style={{ width: '100%', marginBottom: '0.5rem', accentColor: 'var(--color-primary)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                <span>{item.min}</span>
                <span>{item.max}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: recommendation.color, color: '#fff', borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{recommendation.icon}</div>
          <h3 style={{ fontSize: '2rem', margin: '0 0 1rem 0', color: '#fff' }}>Verdict: {recommendation.verdict}</h3>
          <p style={{ fontSize: '1.2rem', margin: '0 0 1.5rem 0', opacity: 0.95 }}>{recommendation.message}</p>
          <div style={{ background: 'rgba(255, 255, 255, 0.2)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', opacity: 0.9 }}>RECOMMENDED ALTERNATIVES</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{recommendation.alternatives.join(' • ')}</div>
          </div>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>✅ OK, When DO You Need Kubernetes?</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {needReasons.map((item, idx) => (
            <div key={idx} style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'flex', gap: '1rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-success)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, flexShrink: 0 }}>
                {idx + 1}
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--color-success)', marginTop: 0, marginBottom: '0.5rem' }}>{item.reason}</h4>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                  <strong>Pain:</strong> {item.pain}
                </p>
                <div style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  <strong>You know you need it when:</strong> {item.signal}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>💰 The Real Cost of Kubernetes</h2>
        <p>It's not just the cloud bill. Factor in ALL costs:</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <Callout variant="danger" title="💸 Direct Costs">
            <ul style={{ margin: '0 0 1rem 0', paddingLeft: '1.5rem' }}>
              <li>Control plane: $72/month (EKS) or Free (AKS)</li>
              <li>Worker nodes: $50-500+/month</li>
              <li>Load balancers: $20-100/month</li>
              <li>Monitoring tools: $50-500/month</li>
              <li>Storage: $10-200/month</li>
            </ul>
            <div style={{ padding: '1rem', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-sm)', fontWeight: 700, color: '#ef4444', fontSize: '1.2rem' }}>Total: $200-1500+/month</div>
          </Callout>

          <Callout variant="warning" title="⏰ Time Costs">
            <ul style={{ margin: '0 0 1rem 0', paddingLeft: '1.5rem' }}>
              <li>Initial setup: 1-4 weeks</li>
              <li>Learning curve: 3-6 months</li>
              <li>Ongoing maintenance: 20-40% of dev time</li>
              <li>Troubleshooting: Hours per incident</li>
              <li>Upgrades: Days per quarter</li>
            </ul>
            <div style={{ padding: '1rem', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-sm)', fontWeight: 700, color: 'var(--color-warning, #d97706)', fontSize: '1.2rem' }}>Total: $50k-200k+ in eng time/year</div>
          </Callout>
        </div>

        <Callout variant="success" title="💡 Comparison: Heroku vs Kubernetes (for small app)">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Heroku</div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                • $50/month<br/>
                • Setup: 5 minutes<br/>
                • Maintenance: 0 hours/week<br/>
                • <strong style={{ color: 'var(--color-success)' }}>Focus: 100% on product</strong>
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Kubernetes</div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                • $300/month<br/>
                • Setup: 2 weeks<br/>
                • Maintenance: 10 hours/week<br/>
                • <strong style={{ color: '#ef4444' }}>Focus: 50% on infra, 50% on product</strong>
              </div>
            </div>
          </div>
        </Callout>
      </section>

      <div style={{ background: 'linear-gradient(135deg, #9c0606 0%, #dc2626 100%)', borderRadius: 'var(--radius-lg)', padding: '3rem', boxShadow: '0 4px 6px rgba(0,0,0,0.2)', textAlign: 'center', color: '#fff', marginBottom: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎓</div>
        <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0', color: '#fff' }}>Final Wisdom</h2>
        <p style={{ fontSize: '1.3rem', lineHeight: 1.6, margin: '0 0 2rem 0', opacity: 0.95 }}>
          Kubernetes is a tool, not a religion. Use it when the benefits outweigh the costs.
          The best engineers know when NOT to use fancy technology.
        </p>
        <div style={{ background: 'rgba(255, 255, 255, 0.2)', borderRadius: 'var(--radius-md)', padding: '1.5rem', fontSize: '1.2rem', fontWeight: 600, fontStyle: 'italic' }}>
          "Simplicity is the ultimate sophistication." - Leonardo da Vinci
        </div>
        <div style={{ marginTop: '2rem', fontSize: '1.1rem', opacity: 0.9 }}>
          Start simple. Grow into complexity. Not the other way around.
        </div>
      </div>

      <section className={styles.spotlight}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h2>Congratulations! You've Completed the Course!</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
            You now understand Kubernetes from containers to production. You know how it works,
            when to use it, and—most importantly—when NOT to use it.
          </p>
        </div>
        <div style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginTop: 0 }}>What You've Learned:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', color: 'var(--color-text-secondary)' }}>
            {learned.map((item, idx) => <div key={idx}>✓ {item}</div>)}
          </div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #9c0606 0%, #dc2626 100%)', color: '#fff', borderRadius: 'var(--radius-md)', padding: '1.5rem', fontSize: '1.2rem', fontWeight: 600, textAlign: 'center' }}>
          You're now equipped to make informed decisions about Kubernetes. Go build something amazing! 🚀
        </div>
      </section>
    </ModuleShell>
  )
}
