import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Terminal from '../components/Terminal'
import { useTheme } from '../components/ThemeContext'


const Home: NextPage = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className={styles.container}>
      <Head>
        <title>Kubernetes Learning Platform | Cloud-Native Development</title>
        <meta name="description" content="Master Kubernetes and OpenShift with hands-on learning modules" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.navBrand}>
            <div className={styles.navLogo}>☸</div>
            <span className={styles.navTitle}>
              Kube<span className={styles.navTitleAccent}>Learn</span>
            </span>
          </Link>
          <div className={styles.navLinks}>
            <Link href="/learning-modules" className={styles.navLink}>
              Modules
            </Link>
            <Link href="/interactive-learning" className={styles.navLink}>
              Interactive
            </Link>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}></span>
            Deployed on OpenShift with Dev Spaces
          </div>
          <h1 className={styles.title}>
            Master <span className={styles.titleAccent}>Cloud-Native</span> Development
          </h1>
          
          {/* SIMULATED TERMINAL WINDOW */}
          <div className={styles.terminalWrapper}>
            <Terminal />
          </div>

          <p className={styles.subtitle}>
            A hands-on learning platform for Kubernetes, container orchestration, 
            and modern cloud infrastructure — built by practitioners, for practitioners.
          </p>
        </section>

        {/* My Approach */}
        <section className={styles.spotlight}>
          <h2 className={styles.spotlightTitle}>
            <span className={styles.spotlightIcon}>💡</span>
            Learning Philosophy
          </h2>
          <p className={styles.spotlightText}>
            I approach learning with intention. I ship working code, 
            document my mistakes, and iterate based on feedback. This platform itself is proof—I&apos;m 
            learning Next.js and OpenShift by actually deploying to production.
          </p>
        </section>

        {/* What I Know */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🛠️</span>
            Technical Focus Areas
          </h2>
          
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3><span className={styles.cardIcon}>⚡</span> Currently Practicing</h3>
              <ul className={styles.techList}>
                <li>Next.js + TypeScript fundamentals</li>
                <li>OpenShift deployment and routing</li>
                <li>Git workflows and version control</li>
                <li>Infrastructure configuration</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3><span className={styles.cardIcon}>📚</span> Actively Learning</h3>
              <ul className={styles.techList}>
                <li>Container orchestration patterns</li>
                <li>Kubernetes core concepts</li>
                <li>Cloud-native design patterns</li>
                <li>System architecture principles</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3><span className={styles.cardIcon}>🗺️</span> On the Roadmap</h3>
              <ul className={styles.techList}>
                <li>Service mesh and networking</li>
                <li>CI/CD pipeline automation</li>
                <li>Security best practices</li>
                <li>Infrastructure as Code</li>
              </ul>
            </div>
          </div>
        </section>

        {/* This Project */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🏗️</span>
            About This Platform
          </h2>
          <div className={styles.projectCard}>
            <div className={styles.projectHeader}>
              <span className={styles.projectStatus}>Live</span>
              <h3>Learning & Portfolio Workspace</h3>
            </div>
            <p className={styles.projectDesc}>
              This isn&apos;t a polished product—it&apos;s a working lab. I deployed a Next.js app to 
              OpenShift to understand how containerized applications work in practice. The codebase 
              is navigable, changes are tracked, and patterns are documented for learning.
            </p>
            <div className={styles.techStack}>
              <span className={styles.techBadge}>Next.js</span>
              <span className={styles.techBadge}>TypeScript</span>
              <span className={styles.techBadge}>OpenShift</span>
              <span className={styles.techBadge}>Kubernetes</span>
              <span className={styles.techBadge}>AI-Assisted</span>
            </div>
          </div>
        </section>

        {/* How I Learn */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🎯</span>
            Development Principles
          </h2>
          <div className={styles.principleGrid}>
            <div className={styles.principle}>
              <div className={styles.principleIcon}>🚀</div>
              <h4>Ship First, Refine Later</h4>
              <p>Deploy early, break things safely, learn from errors, and iterate continuously.</p>
            </div>
            
            <div className={styles.principle}>
              <div className={styles.principleIcon}>📖</div>
              <h4>Learn in Public</h4>
              <p>Transparency about gaps in knowledge enables honest progress tracking.</p>
            </div>
            
            <div className={styles.principle}>
              <div className={styles.principleIcon}>🔧</div>
              <h4>Production-Focused</h4>
              <p>Build real systems in real environments, not just tutorial exercises.</p>
            </div>
            
            <div className={styles.principle}>
              <div className={styles.principleIcon}>🤖</div>
              <h4>Leverage Modern Tools</h4>
              <p>Use AI assistance, automation, and existing patterns to accelerate learning.</p>
            </div>
          </div>
        </section>

        {/* Current Focus */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>📍</span>
            Current Focus
          </h2>
          <p className={styles.sectionText}>
            Working to understand how applications are architected for cloud environments. 
            That means hands-on work with container orchestration, understanding design decisions, 
            and learning why certain patterns matter for scalability and reliability.
          </p>
          <div className={styles.learningList}>
            <div className={styles.learningItem}>
              <span className={styles.learningStatus}>Practicing</span>
              <span>Deploying and updating applications in OpenShift</span>
            </div>
            <div className={styles.learningItem}>
              <span className={styles.learningStatus}>Studying</span>
              <span>How Kubernetes resources connect (Pods, Services, Routes)</span>
            </div>
            <div className={styles.learningItem}>
              <span className={styles.learningStatus}>Exploring</span>
              <span>Enterprise approaches to container orchestration</span>
            </div>
          </div>
        </section>

        {/* Why Solutions Architecture */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>💭</span>
            Why Solutions Architecture?
          </h2>
          <p className={styles.sectionText}>
            Drawn to the strategic side of technology—understanding how pieces fit together 
            to solve business problems. Developing the mindset: asking why certain approaches work, 
            thinking about tradeoffs, and connecting technology to outcomes. The goal is to grow 
            into a role helping teams make informed architectural decisions.
          </p>
        </section>

        {/* Connect */}
        <section className={styles.ctaSection}>
          <h2>Open to Opportunities</h2>
          <p>Looking for teams that value growth mindset, honest communication, and learning through building.</p>
          <div className={styles.ctaButtons}>
            <a href="https://github.com/socks5-sniffer" className={styles.ctaButton}>
              View GitHub →
            </a>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <Image
              src="/shield-272x300.png"
              alt="Logo"
              width={28}
              height={28}
              className={styles.footerLogo}
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