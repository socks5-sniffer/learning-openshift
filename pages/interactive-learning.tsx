import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function InteractiveLearning() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Interactive Learning | KubeLearn</title>
        <meta name="description" content="Interactive learning modules and activities" />
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
            <Link href="/interactive-learning" className={`${styles.navLink} ${styles.navLinkActive}`}>
              Interactive
            </Link>
            <Link href="/kubectl-cheatsheet" className={styles.navLink}>
              Cheat Sheet
            </Link>
          </div>
        </div>
      </nav>

      <main className={styles.main} style={{ paddingTop: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}></span>
            Hands-On Learning
          </div>
          <h1 className={styles.title}>
            Interactive <span className={styles.titleAccent}>Labs</span>
          </h1>
          <p className={styles.subtitle}>
            Learn by doing — hands-on activities, simulations, and challenges to deepen your understanding.
          </p>
        </div>

        <section className={styles.spotlight}>
          <h2 className={styles.spotlightTitle}>
            <span className={styles.spotlightIcon}>🧪</span>
            The Lab Is Open
          </h2>
          <p className={styles.spotlightText}>
            Three labs are live: build real Kubernetes manifests with instant validation feedback in the
            Pod Builder, test permissions in the RBAC Simulator, or drill the whole curriculum with
            Flashcards. Service discovery visualization is on the way.
          </p>
        </section>

        <div className={styles.grid} style={{ marginTop: '2rem' }}>
          <Link href="/pod-builder" className={styles.card} style={{ textDecoration: 'none' }}>
            <h3><span className={styles.cardIcon}>📦</span> Pod Builder</h3>
            <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>
              Build and deploy pods interactively with instant feedback on your YAML configurations.
            </p>
            <span style={{
              display: 'inline-block',
              padding: '4px 10px',
              background: 'rgba(34, 197, 94, 0.15)',
              borderRadius: '4px',
              fontSize: '0.75rem',
              color: '#22c55e',
              fontWeight: 700,
              marginTop: '1rem'
            }}>
              ● Live — Try it now
            </span>
          </Link>

          <Link href="/flashcards" className={styles.card} style={{ textDecoration: 'none' }}>
            <h3><span className={styles.cardIcon}>🃏</span> Flashcards</h3>
            <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>
              120 cards built from every module&apos;s knowledge checks — flip, self-grade, and find the
              topics that need another pass.
            </p>
            <span style={{
              display: 'inline-block',
              padding: '4px 10px',
              background: 'rgba(34, 197, 94, 0.15)',
              borderRadius: '4px',
              fontSize: '0.75rem',
              color: '#22c55e',
              fontWeight: 700,
              marginTop: '1rem'
            }}>
              ● Live — Try it now
            </span>
          </Link>

          <div className={styles.card} style={{ opacity: 0.6 }}>
            <h3><span className={styles.cardIcon}>🌐</span> Service Discovery</h3>
            <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>
              Visualize how services connect and route traffic within a Kubernetes cluster.
            </p>
            <span style={{ 
              display: 'inline-block', 
              padding: '4px 10px', 
              background: 'rgba(148, 163, 184, 0.15)', 
              borderRadius: '4px', 
              fontSize: '0.75rem',
              color: '#94a3b8',
              marginTop: '1rem'
            }}>
              In Development
            </span>
          </div>

          <Link href="/rbac-simulator" className={styles.card} style={{ textDecoration: 'none' }}>
            <h3><span className={styles.cardIcon}>🔐</span> RBAC Simulator</h3>
            <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>
              Practice configuring roles, bindings, and permissions in a safe sandbox environment.
            </p>
            <span style={{
              display: 'inline-block',
              padding: '4px 10px',
              background: 'rgba(34, 197, 94, 0.15)',
              borderRadius: '4px',
              fontSize: '0.75rem',
              color: '#22c55e',
              fontWeight: 700,
              marginTop: '1rem'
            }}>
              ● Live — Try it now
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
