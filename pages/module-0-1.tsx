import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Module01() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Module 0.1: Why Kubernetes Exists</title>
        <meta name="description" content="Understanding the problem Kubernetes solves" />
      </Head>

      {/* Home link in top right */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 30,
        zIndex: 10
      }}>
        <Link href="/learning-modules" legacyBehavior>
          <a style={{
            textDecoration: 'none',
            color: '#9c0606ff',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            background: 'rgba(255,255,255,0.85)',
            padding: '8px 16px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>All Modules</a>
        </Link>
      </div>

      <main className={styles.main}>
        <h1 className={styles.title}>Module 0.1: Why Kubernetes Exists</h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/learning-modules" legacyBehavior>
            <a style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>
              ← Back to All Modules
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/module-0-2" legacyBehavior>
            <a style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>
              Next: Containers 101 →
            </a>
          </Link>
        </div>

        <section className={styles.spotlight}>
          <h2>The Problem Kubernetes Solves</h2>
          <p>
            Before Kubernetes, deploying and managing applications at scale was a manual nightmare. 
            Imagine you have an application running on a server. Now imagine that application becomes 
            popular. What happens when:
          </p>
          <ul>
            <li><strong>The server crashes?</strong> Your app goes down. Someone (probably you, at 3 AM) needs to SSH in and restart it.</li>
            <li><strong>Traffic spikes?</strong> One server isn't enough. You manually spin up more servers, install dependencies, configure networking...</li>
            <li><strong>You need to update the app?</strong> Take it down, deploy new code, pray nothing breaks, bring it back up.</li>
            <li><strong>A server dies completely?</strong> Hope you have backups and enjoy rebuilding everything from scratch.</li>
          </ul>
          <p>
            Kubernetes automates all of this. It's a system that watches your applications, ensures they're 
            running as expected, automatically restarts them when they fail, scales them up or down based on 
            demand, and handles updates without downtime. It's like having a tireless robot administrator 
            that never sleeps and doesn't make typos in SSH commands.
          </p>
          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#0369a1' }}>💡 Key Insight</h3>
            <p style={{ marginBottom: 0 }}>
              Kubernetes doesn't just run your application—it continuously works to ensure reality 
              matches your desired state. You declare "I want 3 copies of this app running," and 
              Kubernetes makes it happen, even if servers die or the network hiccups.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Monoliths vs Microservices (Without Buzzword Bingo)</h2>
          
          <h3>The Monolith</h3>
          <p>
            A <strong>monolithic application</strong> is like a Swiss Army knife—everything built into one piece. 
            Your authentication, database logic, UI rendering, payment processing, and cat video recommendations 
            all live in the same codebase and run as a single unit.
          </p>
          <p><strong>Pros:</strong></p>
          <ul>
            <li>Simple to develop initially</li>
            <li>Easy to test (it's all right there)</li>
            <li>Easy to deploy (one thing to deploy)</li>
            <li>Debugging is straightforward</li>
          </ul>
          <p><strong>Cons:</strong></p>
          <ul>
            <li>Scales poorly (need more user handling capacity? Scale the entire app, even the parts that don't need it)</li>
            <li>One bug can crash everything</li>
            <li>As the codebase grows, changes become risky and slow</li>
            <li>Different teams step on each other's toes</li>
          </ul>

          <h3>Microservices</h3>
          <p>
            A <strong>microservices architecture</strong> breaks your application into smaller, independent services. 
            Instead of one massive program, you have:
          </p>
          <ul>
            <li>An authentication service</li>
            <li>A user profile service</li>
            <li>A payment service</li>
            <li>A recommendation engine</li>
            <li>...each running independently, communicating over a network</li>
          </ul>
          <p><strong>Pros:</strong></p>
          <ul>
            <li>Each service can be scaled independently (payment processing getting hammered? Scale just that service)</li>
            <li>Teams can work on different services without conflicts</li>
            <li>Different services can use different programming languages or databases (if needed)</li>
            <li>A bug in one service doesn't crash the entire system</li>
          </ul>
          <p><strong>Cons:</strong></p>
          <ul>
            <li>Much more complex to deploy and manage (this is where Kubernetes helps)</li>
            <li>Network calls between services add latency</li>
            <li>Debugging is harder (which service caused the issue?)</li>
            <li>You need good monitoring and logging</li>
          </ul>

          <div style={{
            background: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#b45309' }}>⚠️ Reality Check</h3>
            <p style={{ marginBottom: 0 }}>
              Microservices are not inherently better than monoliths. They trade one set of problems 
              for another. Many successful companies run monoliths just fine. Microservices make sense 
              when you have scale, multiple teams, and clear service boundaries. Otherwise, you're just 
              making your life harder.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Pets vs Cattle (And Why Your Server Is Not Special)</h2>
          <p>
            This is one of the most important mindset shifts in cloud-native development.
          </p>
          
          <h3>Pets 🐕</h3>
          <p>
            Traditional servers are <strong>pets</strong>. You give them names (web-server-01, db-primary), 
            you care for them individually, you monitor their health, and when they get sick, you nurse them 
            back to health. If a pet dies, you're sad and you spend time setting up a replacement just right.
          </p>
          <ul>
            <li>Manually configured</li>
            <li>Irreplaceable (or painful to replace)</li>
            <li>Snowflakes—no two are exactly alike</li>
            <li>When broken, you debug and fix them</li>
          </ul>

          <h3>Cattle 🐄</h3>
          <p>
            Kubernetes treats servers as <strong>cattle</strong>. They're numbered, not named (pod-7f8b9c-xk2p9). 
            They're identical and replaceable. When one gets sick, you don't fix it—you shoot it and get a new one. 
            Sounds harsh, but this is actually better for reliability.
          </p>
          <ul>
            <li>Automatically provisioned from templates (container images)</li>
            <li>Identical and interchangeable</li>
            <li>When broken, they're destroyed and replaced automatically</li>
            <li>No emotional attachment required</li>
          </ul>

          <div style={{
            background: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#15803d' }}>✅ Why This Matters</h3>
            <p>
              When your infrastructure is cattle, not pets, you gain:
            </p>
            <ul style={{ marginBottom: 0 }}>
              <li><strong>Reliability:</strong> Systems self-heal instead of waiting for humans</li>
              <li><strong>Consistency:</strong> Every instance is identical, reducing "works on my machine" issues</li>
              <li><strong>Speed:</strong> New instances spin up in seconds, not hours</li>
              <li><strong>Scalability:</strong> Going from 3 to 300 instances is just a number change</li>
            </ul>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>When Kubernetes Is Overkill (Important But Often Skipped)</h2>
          <p>
            Let's be honest: Kubernetes is complex. It adds operational overhead, requires new skills, 
            and introduces failure modes that don't exist in simpler setups. Sometimes, you don't need it.
          </p>

          <h3>You Probably Don't Need Kubernetes If:</h3>
          <ul>
            <li><strong>Your app runs on one server and that's fine.</strong> A Digital Ocean droplet with Docker Compose might be perfect.</li>
            <li><strong>You're a solo developer or small team.</strong> Managing Kubernetes could take more time than building your actual product.</li>
            <li><strong>Your traffic is predictable and small.</strong> Elastic scaling is cool, but unnecessary if you have 100 users.</li>
            <li><strong>You don't have microservices.</strong> A single monolith doesn't benefit much from Kubernetes' orchestration.</li>
            <li><strong>You're not ready for the operational complexity.</strong> Kubernetes requires monitoring, logging, security considerations, and troubleshooting skills.</li>
          </ul>

          <h3>You Might Need Kubernetes If:</h3>
          <ul>
            <li><strong>You have multiple services</strong> that need to communicate and scale independently</li>
            <li><strong>You need high availability</strong> and can't afford downtime</li>
            <li><strong>Traffic is unpredictable</strong> and you need auto-scaling</li>
            <li><strong>You're deploying frequently</strong> and need zero-downtime updates</li>
            <li><strong>You're running on multiple cloud providers</strong> or need portability</li>
            <li><strong>Your team is growing</strong> and needs standardized deployment practices</li>
          </ul>

          <div style={{
            background: '#fef2f2',
            border: '2px solid #ef4444',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#b91c1c' }}>🚨 Warning</h3>
            <p style={{ marginBottom: 0 }}>
              Kubernetes is not a magic bullet. It won't fix a poorly designed application, and it won't 
              make your team more productive if they don't understand it. Start simple. Grow into Kubernetes 
              when the pain of not using it exceeds the pain of learning it.
            </p>
          </div>

          <h3>Simpler Alternatives to Consider First:</h3>
          <ul>
            <li><strong>Docker Compose:</strong> For local development and simple production deployments</li>
            <li><strong>Platform-as-a-Service (PaaS):</strong> Heroku, Render, Railway—they abstract away infrastructure</li>
            <li><strong>Serverless:</strong> AWS Lambda, Google Cloud Functions, Vercel—no servers to manage at all</li>
            <li><strong>Managed container services:</strong> AWS ECS, Google Cloud Run—simpler than Kubernetes but more flexible than PaaS</li>
          </ul>
        </section>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginTop: '60px',
          paddingTop: '30px',
          borderTop: '2px solid #e5e7eb',
          gap: '20px'
        }}>
          <Link href="/learning-modules" legacyBehavior>
            <a style={{
              textDecoration: 'none',
              color: '#94a3b8',
              fontWeight: 600,
              padding: '12px 24px',
              border: '2px solid #475569',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>← All Modules</a>
          </Link>
          
          <Link href="/module-0-2" legacyBehavior>
            <a style={{
              textDecoration: 'none',
              color: '#fff',
              background: '#9c0606ff',
              fontWeight: 600,
              padding: '12px 24px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>Next: Containers 101 →</a>
          </Link>
        </div>
      </main>
    </div>
  );
}
