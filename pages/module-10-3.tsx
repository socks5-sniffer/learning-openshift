import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function WhenToSayNo() {
  const [selectedScenario, setSelectedScenario] = useState<'simple' | 'cost' | 'team' | 'startup' | 'stateful'>('simple')
  const [complexityScore, setComplexityScore] = useState({
    services: 1,
    traffic: 1,
    team: 1,
    automation: 1
  })

  const scenarios = {
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
        {
          name: 'Platform as a Service (PaaS)',
          tools: 'Heroku, Railway, Render, Fly.io',
          why: 'Git push to deploy. Zero infrastructure management.',
          cost: '$7-50/month',
          setup: 'git push heroku main',
          bestFor: 'MVPs, side projects, small apps'
        },
        {
          name: 'Serverless',
          tools: 'AWS Lambda, Vercel, Netlify, Cloudflare Workers',
          why: 'Pay per request. Infinite scaling. Zero servers.',
          cost: '$0 - $20/month for small apps',
          setup: 'vercel deploy',
          bestFor: 'APIs, static sites, event-driven'
        },
        {
          name: 'Docker Compose',
          tools: 'Docker Compose on single VPS',
          why: 'All the containers, none of the complexity.',
          cost: '$5-20/month (DigitalOcean)',
          setup: 'docker-compose up -d',
          bestFor: 'Hobby projects, learning, prototypes'
        },
        {
          name: 'Managed Services',
          tools: 'AWS Amplify, Google App Engine, Azure App Service',
          why: 'Cloud provider handles everything.',
          cost: '$10-100/month',
          setup: 'gcloud app deploy',
          bestFor: 'Teams already on cloud, don\'t want ops'
        }
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
        {
          name: 'Heroku / Railway',
          tools: 'Fully managed platforms',
          why: 'Fixed cost, no surprises, includes everything',
          cost: '$7-100/month all-in',
          setup: '5 minutes',
          bestFor: 'Predictable costs, small scale'
        },
        {
          name: 'Serverless',
          tools: 'Lambda, Cloud Functions, Cloud Run',
          why: 'Pay only for execution time',
          cost: '$0-50/month for <100k requests',
          setup: '30 minutes',
          bestFor: 'Variable traffic, low volume'
        },
        {
          name: 'Single VPS',
          tools: 'DigitalOcean, Linode, Hetzner',
          why: 'One server, Docker Compose, done',
          cost: '$5-40/month',
          setup: '1 hour',
          bestFor: 'Budget-conscious, technical founder'
        },
        {
          name: 'Shared Hosting',
          tools: 'Traditional web hosting',
          why: 'Cheapest option for simple sites',
          cost: '$3-15/month',
          setup: 'FTP upload',
          bestFor: 'WordPress, PHP apps, no containers'
        }
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
        {
          name: 'Managed PaaS',
          tools: 'Heroku, Render, Fly.io',
          why: 'Abstracts all infrastructure. Focus on code.',
          cost: 'Time saved > money spent',
          setup: 'Learn in 1 day',
          bestFor: 'Small teams, rapid iteration'
        },
        {
          name: 'Cloud Run / App Engine',
          tools: 'Google Cloud Run, AWS App Runner',
          why: 'Container-based, Kubernetes under the hood, but hidden',
          cost: 'Pay per use',
          setup: 'Learn in 1 week',
          bestFor: 'Want containers without K8s complexity'
        },
        {
          name: 'Nomad',
          tools: 'HashiCorp Nomad',
          why: 'Like Kubernetes but 10x simpler',
          cost: 'Free, open source',
          setup: 'Learn in 2 weeks',
          bestFor: 'Need orchestration, want simplicity'
        },
        {
          name: 'Grow Then Migrate',
          tools: 'Start simple, move to K8s later',
          why: 'Build product first, infrastructure later',
          cost: 'Rational',
          setup: 'When you have 5+ engineers',
          bestFor: 'Every startup ever'
        }
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
        {
          name: 'Vercel / Netlify',
          tools: 'Frontend + serverless backend',
          why: 'Deploy in seconds, focus on features',
          cost: 'Free tier → $20/month',
          setup: 'git push',
          bestFor: 'Web apps, Next.js, React'
        },
        {
          name: 'Supabase / Firebase',
          tools: 'Backend as a Service',
          why: 'Database, auth, storage, APIs = done',
          cost: 'Free → $25/month',
          setup: '1 hour',
          bestFor: 'Mobile apps, CRUD apps'
        },
        {
          name: 'Railway / Fly.io',
          tools: 'Simple container hosting',
          why: 'Docker without the K8s overhead',
          cost: '$5-50/month',
          setup: '30 minutes',
          bestFor: 'Custom backends, APIs'
        },
        {
          name: 'Managed Database + Serverless',
          tools: 'Postgres (Neon) + Lambda',
          why: 'Pay per use, scales to zero',
          cost: '$0-100/month',
          setup: '2 hours',
          bestFor: 'APIs, microservices'
        }
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
        {
          name: 'Managed Databases',
          tools: 'AWS RDS, Google Cloud SQL, Azure Database',
          why: 'Backups, HA, scaling = handled',
          cost: '$15-500/month',
          setup: '5 minutes',
          bestFor: 'Production databases (Postgres, MySQL)'
        },
        {
          name: 'Specialized DB Services',
          tools: 'MongoDB Atlas, Redis Cloud, Elasticsearch Cloud',
          why: 'Experts run your DB better than you',
          cost: '$10-1000/month',
          setup: '10 minutes',
          bestFor: 'MongoDB, Redis, Elasticsearch'
        },
        {
          name: 'Serverless Databases',
          tools: 'PlanetScale, Neon, CockroachDB Serverless',
          why: 'Scale to zero, pay per query',
          cost: '$0-100/month',
          setup: '5 minutes',
          bestFor: 'Variable load, modern apps'
        },
        {
          name: 'Database Operators on K8s',
          tools: 'Only if you MUST: CloudNativePG, Postgres Operator',
          why: 'Let operator handle complexity',
          cost: 'Your time',
          setup: 'Days to weeks',
          bestFor: 'Regulatory reasons, can\'t use cloud DBs'
        }
      ]
    }
  }

  const currentScenario = scenarios[selectedScenario]

  const calculateComplexityScore = () => {
    const total = complexityScore.services + complexityScore.traffic + complexityScore.team + complexityScore.automation
    return total
  }

  const getRecommendation = () => {
    const score = calculateComplexityScore()
    if (score <= 6) {
      return {
        verdict: 'Skip Kubernetes',
        color: '#10b981',
        message: 'You don\'t need K8s. Use simpler alternatives.',
        alternatives: ['Heroku', 'Vercel', 'Docker Compose']
      }
    } else if (score <= 10) {
      return {
        verdict: 'Maybe Later',
        color: '#f59e0b',
        message: 'Not yet. Grow into K8s when pain becomes real.',
        alternatives: ['Cloud Run', 'Nomad', 'ECS']
      }
    } else {
      return {
        verdict: 'Consider Kubernetes',
        color: '#3b82f6',
        message: 'Your complexity might justify K8s. Evaluate carefully.',
        alternatives: ['GKE Autopilot', 'EKS', 'Managed OpenShift']
      }
    }
  }

  const recommendation = getRecommendation()

  return (
    <div className={styles.container}>
      <Head>
        <title>10.3 When to Say "No" to Kubernetes - Kubernetes Learning</title>
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
            10.3 When to Say "No" to Kubernetes
          </h1>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <Link href="/module-10-2" legacyBehavior>
              <a style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>
                ← Previous: Managed Kubernetes
              </a>
            </Link>
            <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
            <Link href="/learning-modules" legacyBehavior>
              <a style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>
                All Modules
              </a>
            </Link>
          </div>
          
          <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1rem' }}>
            The most important Kubernetes lesson: <strong style={{ color: '#1e293b' }}>you probably don't need it</strong>.
            K8s is powerful, but it's also complex, expensive, and overkill for most use cases.
            Here's when to skip it and what to use instead.
          </p>
          <div style={{
            background: '#fef2f2',
            border: '2px solid #fecaca',
            borderRadius: 8,
            padding: '1.5rem',
            fontSize: '1rem',
            color: '#991b1b'
          }}>
            <strong>⚠️ Truth Bomb:</strong> If you're asking "Do I need Kubernetes?", the answer is probably no.
            If you NEED it, you'll know. The pain will be obvious.
          </div>
        </div>

        {/* Scenario Selector */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
            🚫 Common "Skip Kubernetes" Scenarios
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {(Object.keys(scenarios) as Array<keyof typeof scenarios>).map(scenario => (
              <button
                key={scenario}
                onClick={() => setSelectedScenario(scenario)}
                style={{
                  padding: '1.5rem',
                  background: selectedScenario === scenario ? scenarios[scenario].color : '#f8fafc',
                  color: selectedScenario === scenario ? 'white' : '#1e293b',
                  border: selectedScenario === scenario ? 'none' : '2px solid #e2e8f0',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                  {scenarios[scenario].icon}
                </div>
                <div style={{ fontSize: '1rem', lineHeight: 1.3 }}>
                  {scenarios[scenario].name}
                </div>
              </button>
            ))}
          </div>

          {/* Scenario Details */}
          <div style={{
            background: '#f8fafc',
            border: `3px solid ${currentScenario.color}`,
            borderRadius: 12,
            padding: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '4rem' }}>{currentScenario.icon}</span>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', margin: 0, marginBottom: '0.5rem' }}>
                  {currentScenario.name}
                </h3>
                <p style={{ color: '#64748b', margin: 0, fontSize: '1.1rem' }}>
                  {currentScenario.problem}
                </p>
              </div>
            </div>

            {/* Kubernetes Verdict */}
            <div style={{
              background: 'white',
              border: '3px solid #ef4444',
              borderRadius: 8,
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.75rem' }}>
                {currentScenario.kubernetes.verdict}
              </h4>
              <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '1.05rem' }}>
                <strong style={{ color: '#1e293b' }}>Why:</strong> {currentScenario.kubernetes.why}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div style={{
                  background: '#fef2f2',
                  border: '2px solid #fecaca',
                  borderRadius: 6,
                  padding: '1rem'
                }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#991b1b', marginBottom: '0.5rem' }}>
                    Complexity Cost
                  </div>
                  <div style={{ fontSize: '1.1rem', color: '#ef4444', fontWeight: 600 }}>
                    {currentScenario.kubernetes.complexity}
                  </div>
                </div>
                <div style={{
                  background: '#fef2f2',
                  border: '2px solid #fecaca',
                  borderRadius: 6,
                  padding: '1rem'
                }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#991b1b', marginBottom: '0.5rem' }}>
                    Example of Waste
                  </div>
                  <div style={{ fontSize: '0.95rem', color: '#64748b' }}>
                    {currentScenario.kubernetes.example}
                  </div>
                </div>
              </div>
            </div>

            {/* Better Alternatives */}
            <div>
              <h4 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#10b981', marginBottom: '1rem' }}>
                ✅ Better Alternatives
              </h4>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {currentScenario.alternatives.map((alt, idx) => (
                  <div key={idx} style={{
                    background: 'white',
                    border: '2px solid #10b981',
                    borderRadius: 8,
                    padding: '1.5rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <h5 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#10b981', margin: 0 }}>
                        {idx + 1}. {alt.name}
                      </h5>
                      <div style={{
                        background: '#dcfce7',
                        color: '#166534',
                        padding: '0.25rem 0.75rem',
                        borderRadius: 4,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        whiteSpace: 'nowrap'
                      }}>
                        {alt.cost}
                      </div>
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>Tools: </span>
                      <span style={{ color: '#64748b', fontSize: '0.95rem' }}>{alt.tools}</span>
                    </div>
                    <p style={{ color: '#64748b', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                      <strong style={{ color: '#1e293b' }}>Why:</strong> {alt.why}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem' }}>
                      <div style={{
                        background: '#f8fafc',
                        borderRadius: 6,
                        padding: '0.75rem'
                      }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                          SETUP TIME
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>
                          {alt.setup}
                        </div>
                      </div>
                      <div style={{
                        background: '#f8fafc',
                        borderRadius: 6,
                        padding: '0.75rem'
                      }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                          BEST FOR
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>
                          {alt.bestFor}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Do You Need Kubernetes? Calculator */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
            🧮 Do You Actually Need Kubernetes?
          </h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            Answer honestly. Slide the scales based on your reality, not your dreams.
          </p>

          <div style={{ marginBottom: '2rem' }}>
            {[
              {
                key: 'services' as keyof typeof complexityScore,
                label: 'Number of Services',
                min: '1-3 services',
                max: '20+ microservices'
              },
              {
                key: 'traffic' as keyof typeof complexityScore,
                label: 'Traffic Scale',
                min: '<1000 users/day',
                max: 'Millions of requests/day'
              },
              {
                key: 'team' as keyof typeof complexityScore,
                label: 'Team Size & Expertise',
                min: '1-2 developers',
                max: '10+ with DevOps team'
              },
              {
                key: 'automation' as keyof typeof complexityScore,
                label: 'Automation Needs',
                min: 'Manual deploys OK',
                max: 'Need zero-downtime, auto-scaling'
              }
            ].map(item => (
              <div key={item.key} style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>{item.label}</span>
                  <span style={{ 
                    fontWeight: 700,
                    color: complexityScore[item.key] <= 2 ? '#10b981' : complexityScore[item.key] <= 3 ? '#f59e0b' : '#3b82f6',
                    fontSize: '1.1rem'
                  }}>
                    {complexityScore[item.key]}/5
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={complexityScore[item.key]}
                  onChange={(e) => setComplexityScore({
                    ...complexityScore,
                    [item.key]: parseInt(e.target.value)
                  })}
                  style={{ width: '100%', marginBottom: '0.5rem' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#64748b' }}>
                  <span>{item.min}</span>
                  <span>{item.max}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recommendation */}
          <div style={{
            background: recommendation.color,
            color: 'white',
            borderRadius: 12,
            padding: '2rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              {recommendation.verdict === 'Skip Kubernetes' ? '🚫' : recommendation.verdict === 'Maybe Later' ? '⏳' : '✅'}
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, marginBottom: '1rem' }}>
              Verdict: {recommendation.verdict}
            </h3>
            <p style={{ fontSize: '1.2rem', margin: 0, marginBottom: '1.5rem', opacity: 0.95 }}>
              {recommendation.message}
            </p>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 8,
              padding: '1rem',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', opacity: 0.9 }}>
                RECOMMENDED ALTERNATIVES
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                {recommendation.alternatives.join(' • ')}
              </div>
            </div>
          </div>
        </div>

        {/* When You DO Need Kubernetes */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
            ✅ OK, When DO You Need Kubernetes?
          </h2>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              {
                reason: 'Multiple teams deploying independently',
                pain: 'Coordination overhead killing velocity',
                signal: '5+ teams waiting on shared infrastructure'
              },
              {
                reason: 'True microservices (10+ services)',
                pain: 'Manual deployment of 10 services is unmaintainable',
                signal: 'Spending days on deploys, need automation'
              },
              {
                reason: 'Massive scale',
                pain: 'Need auto-scaling across hundreds of instances',
                signal: 'Current setup can\'t handle traffic spikes'
              },
              {
                reason: 'Multi-cloud or hybrid',
                pain: 'Running in AWS, GCP, on-prem, need consistency',
                signal: 'Vendor lock-in is real risk, need portability'
              },
              {
                reason: 'Complex deployment patterns',
                pain: 'Need blue-green, canary, A/B testing built-in',
                signal: 'Zero-downtime deployments are critical'
              },
              {
                reason: 'Compliance/Security requirements',
                pain: 'Need network policies, RBAC, audit logs',
                signal: 'SOC2, HIPAA, PCI-DSS certification needed'
              }
            ].map((item, idx) => (
              <div key={idx} style={{
                background: '#f8fafc',
                border: '2px solid #10b981',
                borderRadius: 8,
                padding: '1.5rem',
                display: 'flex',
                gap: '1rem'
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: '#10b981',
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
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#10b981', marginBottom: '0.5rem' }}>
                    {item.reason}
                  </h4>
                  <p style={{ color: '#64748b', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                    <strong style={{ color: '#1e293b' }}>Pain:</strong> {item.pain}
                  </p>
                  <div style={{
                    background: 'white',
                    border: '2px solid #e2e8f0',
                    borderRadius: 6,
                    padding: '0.75rem',
                    fontSize: '0.9rem',
                    color: '#64748b'
                  }}>
                    <strong style={{ color: '#1e293b' }}>You know you need it when:</strong> {item.signal}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Reality Check */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
            💰 The Real Cost of Kubernetes
          </h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            It's not just the cloud bill. Factor in ALL costs:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <div style={{
              background: '#fef2f2',
              border: '2px solid #fecaca',
              borderRadius: 8,
              padding: '1.5rem'
            }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ef4444', marginBottom: '1rem' }}>
                💸 Direct Costs
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#64748b' }}>
                <li>Control plane: $72/month (EKS) or Free (AKS)</li>
                <li>Worker nodes: $50-500+/month</li>
                <li>Load balancers: $20-100/month</li>
                <li>Monitoring tools: $50-500/month</li>
                <li>Storage: $10-200/month</li>
              </ul>
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'white',
                borderRadius: 6,
                fontWeight: 700,
                color: '#ef4444',
                fontSize: '1.2rem'
              }}>
                Total: $200-1500+/month
              </div>
            </div>

            <div style={{
              background: '#fef3c7',
              border: '2px solid #fde68a',
              borderRadius: 8,
              padding: '1.5rem'
            }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#d97706', marginBottom: '1rem' }}>
                ⏰ Time Costs
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#64748b' }}>
                <li>Initial setup: 1-4 weeks</li>
                <li>Learning curve: 3-6 months</li>
                <li>Ongoing maintenance: 20-40% of dev time</li>
                <li>Troubleshooting: Hours per incident</li>
                <li>Upgrades: Days per quarter</li>
              </ul>
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'white',
                borderRadius: 6,
                fontWeight: 700,
                color: '#d97706',
                fontSize: '1.2rem'
              }}>
                Total: $50k-200k+ in eng time/year
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '1.5rem',
            background: '#dcfce7',
            border: '2px solid #bbf7d0',
            borderRadius: 8,
            padding: '1.5rem'
          }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#166534', marginBottom: '0.75rem' }}>
              💡 Comparison: Heroku vs Kubernetes (for small app)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>Heroku</div>
                <div style={{ color: '#64748b', fontSize: '0.95rem' }}>
                  • $50/month<br/>
                  • Setup: 5 minutes<br/>
                  • Maintenance: 0 hours/week<br/>
                  • <strong style={{ color: '#10b981' }}>Focus: 100% on product</strong>
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>Kubernetes</div>
                <div style={{ color: '#64748b', fontSize: '0.95rem' }}>
                  • $300/month<br/>
                  • Setup: 2 weeks<br/>
                  • Maintenance: 10 hours/week<br/>
                  • <strong style={{ color: '#ef4444' }}>Focus: 50% on infra, 50% on product</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Wisdom */}
        <div style={{
          background: 'linear-gradient(135deg, #9c0606 0%, #dc2626 100%)',
          borderRadius: 12,
          padding: '3rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
          textAlign: 'center',
          color: 'white',
          marginBottom: '2rem'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎓</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, marginBottom: '1rem' }}>
            Final Wisdom
          </h2>
          <p style={{ fontSize: '1.3rem', lineHeight: 1.6, margin: 0, marginBottom: '2rem', opacity: 0.95 }}>
            Kubernetes is a tool, not a religion. Use it when the benefits outweigh the costs.
            The best engineers know when NOT to use fancy technology.
          </p>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 8,
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            fontSize: '1.2rem',
            fontWeight: 600,
            fontStyle: 'italic'
          }}>
            "Simplicity is the ultimate sophistication." - Leonardo da Vinci
          </div>
          <div style={{ marginTop: '2rem', fontSize: '1.1rem', opacity: 0.9 }}>
            Start simple. Grow into complexity. Not the other way around.
          </div>
        </div>

        {/* Congratulations */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '3rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>
            Congratulations! You've Completed the Course!
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
            You now understand Kubernetes from containers to production. You know how it works,
            when to use it, and—most importantly—when NOT to use it.
          </p>
          <div style={{
            background: '#f8fafc',
            border: '2px solid #e2e8f0',
            borderRadius: 8,
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>
              What You've Learned:
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              textAlign: 'left',
              color: '#64748b'
            }}>
              <div>✓ Containers & Docker</div>
              <div>✓ Pods & Deployments</div>
              <div>✓ Services & Networking</div>
              <div>✓ ConfigMaps & Secrets</div>
              <div>✓ Volumes & Storage</div>
              <div>✓ RBAC & Security</div>
              <div>✓ Ingress & Load Balancing</div>
              <div>✓ Logging & Monitoring</div>
              <div>✓ Debugging & Troubleshooting</div>
              <div>✓ CI/CD & GitOps</div>
              <div>✓ Failure Scenarios</div>
              <div>✓ Managed Kubernetes</div>
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #9c0606 0%, #dc2626 100%)',
            color: 'white',
            borderRadius: 8,
            padding: '1.5rem',
            fontSize: '1.2rem',
            fontWeight: 600
          }}>
            You're now equipped to make informed decisions about Kubernetes. Go build something amazing! 🚀
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
          <Link href="/module-10-2" legacyBehavior>
            <a style={{
              padding: '0.75rem 1.5rem',
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: 8,
              color: '#1e293b',
              textDecoration: 'none',
              fontWeight: 600
            }}>
              ← 10.2 Managed Kubernetes
            </a>
          </Link>
          <Link href="/learning-modules" legacyBehavior>
            <a style={{
              padding: '0.75rem 1.5rem',
              background: '#9c0606',
              borderRadius: 8,
              color: 'white',
              textDecoration: 'none',
              fontWeight: 600
            }}>
              🏠 Back to Learning Modules
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}
