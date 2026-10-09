import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import Terminal from '../components/Terminal'
import { useProgress } from '../components/ProgressContext'
import { getModuleById } from '../data/modules'

const Home: NextPage = () => {
  const { completedCount, totalCount, loaded, nextModule, lastVisited } = useProgress()
  const nextId = nextModule()
  const nextInfo = getModuleById(nextId)

  return (
    <div className={styles.container}>
      <Head>
        <title>ClusterFoundry | Kubernetes Learning</title>
        <meta name="description" content="Learn Kubernetes through hands-on modules, interactive labs, and practical examples." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.navBrand}>
            <div className={styles.navLogo}>☸</div>
            <span className={styles.navTitle}>
              <span className={styles.navTitleAccent}>ClusterFoundry</span>
            </span>
          </Link>
          <div className={styles.navLinks}>
            <Link href="/learning-modules" className={styles.navLink}>Modules</Link>
            <Link href="/interactive-learning" className={styles.navLink}>Interactive</Link>
            <Link href="/kubectl-cheatsheet" className={styles.navLink}>Cheat Sheet</Link>
            <Link href="/about" className={styles.navLink}>About</Link>
          </div>
        </div>
      </nav>

      <main className={`${styles.main} ${styles.landingMain}`}>
        <section className={`${styles.hero} ${styles.landingHero}`}>
          <h1 className={styles.title}>
            Master <span className={styles.titleAccent}>Cloud-Native</span> Development
          </h1>

          <div className={styles.terminalWrapper}>
            <Terminal />
          </div>

          <p className={styles.subtitle}>
            A hands-on learning platform for Kubernetes, container orchestration,
            and modern cloud infrastructure. Built by practitioners, for practitioners.
          </p>

          {loaded && (
            <div className={styles.learningCta}>
              {completedCount > 0 ? (
                <>
                  <div className={styles.learningCtaText}>
                    You&apos;ve completed <strong>{completedCount} of {totalCount}</strong> modules
                  </div>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${Math.round((completedCount / totalCount) * 100)}%` }}
                    />
                  </div>
                  <Link
                    href={completedCount === totalCount ? '/learning-modules' : `/module-${nextId}`}
                    className={styles.learningButton}
                  >
                    {completedCount === totalCount
                      ? 'Review the curriculum →'
                      : `Continue: ${nextInfo ? nextInfo.title : 'next module'} →`}
                  </Link>
                </>
              ) : (
                <>
                  <div className={styles.learningCtaText}>
                    {totalCount} modules, from container basics to production Kubernetes
                  </div>
                  <Link href={`/module-${nextId}`} className={styles.learningButton}>
                    {lastVisited ? `Continue: ${nextInfo ? nextInfo.title : 'next module'} →` : 'Start learning →'}
                  </Link>
                </>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Home
