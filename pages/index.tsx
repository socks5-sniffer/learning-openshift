import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Terminal from '../components/Terminal'


const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>A Developer Learning Journey</title>
        <meta name="description" content="Learning cloud-native development in public" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation Bar */}
      <nav style={{ position: 'absolute', top: 24, right: 32, zIndex: 10 }}>
        <Link href="/learning-modules" legacyBehavior>
          <a style={{ marginRight: 24, color: '#636060ff', fontWeight: 600, textDecoration: 'none', fontSize: '1.1rem' }}>Learning Modules</a>
        </Link>
        <Link href="/interactive-learning" legacyBehavior>
          <a style={{ color: '#636060ff', fontWeight: 600, textDecoration: 'none', fontSize: '1.1rem' }}>Interactive Learning</a>
        </Link>
      </nav>
      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.badge}>Deployed on OpenShift with Dev Spaces</div>
          <h1 className={styles.title}>
            Learning Cloud-Native Development
          </h1>
          
          {/* SIMULATED TERMINAL WINDOW */}
          <div className={styles.terminalWrapper}>
            <Terminal />
          </div>

          <p className={styles.subtitle}>
            Aspiring Developer | Building in Public | Growing&nbsp;Through&nbsp;Practice
          </p>
        </section>

        {/* My Approach */}
        <section className={styles.spotlight}>
          <h2 className={styles.spotlightTitle}>My Learning Philosophy</h2>
          <p className={styles.spotlightText}>
            I&apos;m early in my journey, but I approach learning with intention. I ship working code, 
            document my mistakes, and iterate based on feedback. This site itself is proof—I&apos;m 
            learning Next.js and OpenShift by actually deploying to production.
          </p>
        </section>

        {/* What I Know */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What I&apos;m Working With</h2>
          
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>Currently Practicing</h3>
              <ul className={styles.techList}>
                <li>Next.js + TypeScript basics</li>
                <li>OpenShift deployment and routing</li>
                <li>Git workflows and version control</li>
                <li>Reading and modifying existing code</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3>Actively Learning</h3>
              <ul className={styles.techList}>
                <li>Container concepts (still connecting dots)</li>
                <li>Kubernetes fundamentals</li>
                <li>Cloud-native design patterns</li>
                <li>How architectures are planned</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3>On My Roadmap</h3>
              <ul className={styles.techList}>
                <li>Service mesh and networking</li>
                <li>CI/CD pipelines in practice</li>
                <li>Deeper security practices</li>
                <li>Infrastructure as Code</li>
              </ul>
            </div>
          </div>
        </section>

        {/* This Project */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>About This Site</h2>
          <div className={styles.projectCard}>
            <div className={styles.projectHeader}>
              <span className={styles.projectStatus}>Live</span>
              <h3>Portfolio & Learning Workspace</h3>
            </div>
            <p className={styles.projectDesc}>
              This isn&apos;t a polished product—it&apos;s a working lab. I deployed a Next.js app to 
              OpenShift to learn how containerized applications actually work in practice. I can 
              navigate the codebase, make changes, and understand how routing and components fit 
              together. I&apos;m not writing complex scripts from scratch yet, but I can read, modify, 
              and learn from existing patterns.
            </p>
            <div className={styles.techStack}>
              <span className={styles.techBadge}>Next.js</span>
              <span className={styles.techBadge}>TypeScript</span>
              <span className={styles.techBadge}>OpenShift</span>
              <span className={styles.techBadge}>AI-Assisted</span>
            </div>
          </div>
        </section>

        {/* How I Learn */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How I&apos;m Growing</h2>
          <div className={styles.principleGrid}>
            <div className={styles.principle}>
              <div className={styles.principleIcon}>🚀</div>
              <h4>Ship First, Refine Later</h4>
              <p>I don&apos;t wait until I &quot;know enough.&quot; I deploy, break things, learn from errors, and improve.</p>
            </div>
            
            <div className={styles.principle}>
              <div className={styles.principleIcon}>📖</div>
              <h4>Learn in Public</h4>
              <p>Being open about what I don&apos;t know yet keeps me honest and helps me track real progress.</p>
            </div>
            
            <div className={styles.principle}>
              <div className={styles.principleIcon}>🔨</div>
              <h4>Production-Focused</h4>
              <p>I learn by building real things that run in real environments, not just following tutorials.</p>
            </div>
            
            <div className={styles.principle}>
              <div className={styles.principleIcon}>🤝</div>
              <h4>Leverage Tools</h4>
              <p>I use AI assistance, documentation, and existing code to accelerate learning—that&apos;s how modern development works.</p>
            </div>
          </div>
        </section>

        {/* Current Focus */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What I&apos;m Focusing On Now</h2>
          <p className={styles.sectionText}>
            I&apos;m working to understand how applications are architected for cloud environments. 
            Right now that means getting hands-on with OpenShift, understanding how containers 
            work, and learning why certain design decisions matter for scalability and reliability.
          </p>
          <div className={styles.learningList}>
            <div className={styles.learningItem}>
              <span className={styles.learningStatus}>Practicing</span>
              <span>Deploying and updating apps in OpenShift</span>
            </div>
            <div className={styles.learningItem}>
              <span className={styles.learningStatus}>Studying</span>
              <span>How Kubernetes resources connect (Pods, Services, Routes)</span>
            </div>
            <div className={styles.learningItem}>
              <span className={styles.learningStatus}>Exploring</span>
              <span>Red Hat&apos;s approach to enterprise open source</span>
            </div>
          </div>
        </section>

        {/* Why Jr. Solutions Architect */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Why Solutions Architecture?</h2>
          <p className={styles.sectionText}>
            I&apos;m drawn to the strategic side of technology—understanding how pieces fit together 
            to solve business problems. While I&apos;m early in my technical journey, I&apos;m developing 
            the mindset: asking why certain approaches work, thinking about tradeoffs, and 
            connecting technology to outcomes. I want to grow into a role where I help teams 
            make informed architectural decisions.
          </p>
        </section>

        {/* Connect */}
        <section className={styles.ctaSection}>
          <h2>Open to Junior Opportunities</h2>
          <p>Looking for a team that values growth mindset, honest communication, and learning through building.</p>
          <div className={styles.ctaButtons}>
            <a href="https://github.com/socks5-sniffer" className={styles.ctaButton}>
              View GitHub →
            </a>
            <a href="https://roedhousestudios.com" className={styles.ctaButtonSecondary}>
              Personal Site →
            </a>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <Image
              src="/shield-272x300.png"
              alt="Roedhouse Studios"
              width={32}
              height={32}
            />
            <span>Built with Next.js • Deployed on OpenShift</span>
          </div>
          <div className={styles.footerMeta}>
            Learning in public since 2025
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home