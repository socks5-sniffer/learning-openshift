import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function About() {
  return (
    <div className={styles.container}>
      <Head>
        <title>About | ClusterFoundry</title>
        <meta name="description" content="How I learn and why I built this Kubernetes learning app." />
      </Head>

      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.navBrand}>
            <div className={styles.navLogo}>☸</div>
            <span className={styles.navTitle}><span className={styles.navTitleAccent}>ClusterFoundry</span></span>
          </Link>
          <div className={styles.navLinks}>
            <Link href="/learning-modules" className={styles.navLink}>Modules</Link>
            <Link href="/interactive-learning" className={styles.navLink}>Interactive</Link>
            <Link href="/kubectl-cheatsheet" className={styles.navLink}>Cheat Sheet</Link>
            <Link href="/about" className={`${styles.navLink} ${styles.navLinkActive}`} aria-current="page">About</Link>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        <header className={styles.aboutHeader}>
          <h1 className={styles.title}>About <span className={styles.titleAccent}>this project</span></h1>
          <p className={styles.subtitle}>
            A place to learn Kubernetes by building, exploring, and making ideas easier to understand.
          </p>
        </header>

        <section className={styles.spotlight}>
          <h2 className={styles.spotlightTitle}>
            <span className={styles.spotlightIcon}>💡</span>
            How I learn
          </h2>
          <p className={styles.spotlightText}>
            I learn best by trying things, seeing what happens, and improving from there. I build small
            examples, write down what I discover, and use mistakes as clues about what to learn next.
            This app follows that same approach: concepts are explained in practical steps, with room
            to explore and practice along the way.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🧭</span>
            What guides the learning
          </h2>
          <div className={styles.principleGrid}>
            <article className={styles.principle}>
              <div className={styles.principleIcon}>🧪</div>
              <h3>Learn by doing</h3>
              <p>Use examples and interactive labs to turn ideas into something you can try.</p>
            </article>
            <article className={styles.principle}>
              <div className={styles.principleIcon}>📝</div>
              <h3>Explain it clearly</h3>
              <p>Keep notes, diagrams, and command examples close to each topic.</p>
            </article>
            <article className={styles.principle}>
              <div className={styles.principleIcon}>🔁</div>
              <h3>Make progress visible</h3>
              <p>Track completed modules and return to where you left off.</p>
            </article>
            <article className={styles.principle}>
              <div className={styles.principleIcon}>🌱</div>
              <h3>Keep iterating</h3>
              <p>Improve the material as I learn more and find better ways to teach it.</p>
            </article>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🏗️</span>
            About the app
          </h2>
          <div className={styles.projectCard}>
            <div className={styles.projectHeader}>
              <span className={styles.projectStatus}>Learning project</span>
              <h3>Kubernetes, one concept at a time</h3>
            </div>
            <p className={styles.projectDesc}>
              This app is a hands-on guide to Kubernetes, from container basics through networking,
              security, observability, and deployment. It includes short knowledge checks, progress
              tracking, a kubectl cheat sheet, and interactive labs for practicing common ideas.
              The lessons and the app itself continue to grow as part of the learning process.
            </p>
            <div className={styles.techStack}>
              <span className={styles.techBadge}>Kubernetes</span>
              <span className={styles.techBadge}>OpenShift</span>
              <span className={styles.techBadge}>Next.js</span>
              <span className={styles.techBadge}>TypeScript</span>
            </div>
          </div>
        </section>

        <div className={styles.aboutLinkWrap}>
          <Link href="/learning-modules" className={styles.learningButton}>Explore the modules →</Link>
        </div>
      </main>
    </div>
  )
}
