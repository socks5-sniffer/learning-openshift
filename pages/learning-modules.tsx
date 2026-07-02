import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { sections } from '../data/modules';
import { useProgress } from '../components/ProgressContext';

export default function LearningModules() {
  const [showArrow, setShowArrow] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { isComplete, completedCount, totalCount, loaded, nextModule } = useProgress();

  useEffect(() => {
    const handleScroll = () => {
      setShowArrow(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className={styles.container} style={{ position: 'relative' }}>
      <Head>
        <title>Learning Modules | KubeLearn</title>
        <meta name="description" content="Kubernetes: A comprehensive introduction to container orchestration" />
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
            <Link href="/learning-modules" className={`${styles.navLink} ${styles.navLinkActive}`}>
              Modules
            </Link>
            <Link href="/interactive-learning" className={styles.navLink}>
              Interactive
            </Link>
          </div>
        </div>
      </nav>

      <main className={styles.main} style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}></span>
            Comprehensive Curriculum
          </div>
          <h1 className={styles.title} style={{ marginBottom: '1rem' }}>
            Kubernetes <span className={styles.titleAccent}>Deep Dive</span>
          </h1>
          <p className={styles.subtitle}>
            From container basics to production-ready deployments — learn by building things that fail in interesting ways.
          </p>
        </div>

        {/* Overall progress */}
        {loaded && (
          <div
            style={{
              marginBottom: '2.5rem',
              padding: '1.25rem 1.5rem',
              borderRadius: 12,
              border: '1px solid rgba(148, 163, 184, 0.2)',
              background: 'rgba(30, 41, 59, 0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ color: '#f8fafc', fontWeight: 600 }}>
                {completedCount === 0
                  ? '🚀 Your journey starts here'
                  : completedCount === totalCount
                    ? '🏆 Curriculum complete — well done!'
                    : `📈 Your progress: ${completedCount} of ${totalCount} modules`}
              </div>
              {completedCount > 0 && completedCount < totalCount && (
                <Link
                  href={`/module-${nextModule()}`}
                  style={{
                    background: '#9c0606',
                    color: 'white',
                    padding: '8px 18px',
                    borderRadius: 8,
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                >
                  Continue learning →
                </Link>
              )}
            </div>
            <div
              style={{
                marginTop: '0.9rem',
                height: 10,
                borderRadius: 5,
                background: 'rgba(148, 163, 184, 0.15)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  borderRadius: 5,
                  background: 'linear-gradient(90deg, #16a34a, #22c55e)',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
        )}

        <section className={styles.spotlight} style={{ marginBottom: '2rem' }}>
          <h2 className={styles.spotlightTitle}>
            <span className={styles.spotlightIcon}>☸️</span>
            What is Kubernetes?
          </h2>
          <p className={styles.spotlightText}>
            Kubernetes (K8s) is a system for running applications at scale—whether that scale is
            &quot;three users and a dream&quot; or &quot;half the internet.&quot; It answers the questions developers
            used to avoid: What happens when my app crashes? How do I run five copies of it?
            How do I update it without everything catching fire?
          </p>
        </section>

        {/* Search Bar */}
        <div style={{ marginBottom: '2.5rem' }}>
          <input
            type="text"
            placeholder="🔍 Search modules (e.g., 'Security', 'Pods', 'Networking')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              fontSize: '1rem',
              borderRadius: '10px',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              outline: 'none',
              transition: 'all 0.2s ease',
              background: 'rgba(30, 41, 59, 0.5)',
              color: '#f8fafc',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.5)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
            }}
          />
        </div>

        {sections.map((section) => {
          const filtered = section.modules.filter(m =>
            m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
          if (filtered.length === 0) return null;
          const sectionDone = section.modules.filter(m => isComplete(m.id)).length;
          return (
            <div key={section.key}>
              <div className="section-header">
                <h2>
                  {section.heading}
                  {loaded && sectionDone > 0 && (
                    <span
                      style={{
                        marginLeft: '0.75rem',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        verticalAlign: 'middle',
                        color: sectionDone === section.modules.length ? '#22c55e' : '#94a3b8',
                      }}
                    >
                      {sectionDone === section.modules.length
                        ? '✓ complete'
                        : `${sectionDone}/${section.modules.length} done`}
                    </span>
                  )}
                </h2>
                <p>{section.blurb}</p>
              </div>
              <div className="module-grid">
                {filtered.map((module) => {
                  const done = loaded && isComplete(module.id);
                  return (
                    <Link
                      key={module.id}
                      href={`/module-${module.id}`}
                      className="module-card"
                      style={done ? { borderColor: 'rgba(34, 197, 94, 0.5)', position: 'relative' } : { position: 'relative' }}
                    >
                      {done && (
                        <span
                          style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            background: 'rgba(34, 197, 94, 0.15)',
                            color: '#22c55e',
                            borderRadius: 999,
                            padding: '2px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          ✓ Done
                        </span>
                      )}
                      <div className="module-card-icon">{module.icon}</div>
                      <h3 className="module-card-title">{module.title}</h3>
                      <p className="module-card-description">{module.description}</p>
                      <span className={`module-card-status ${section.badgeClass}`}>{section.badgeLabel}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>

      {/* Back to top arrow */}
      {showArrow && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            width: 50,
            height: 50,
            borderRadius: '50%',
            border: 'none',
            background: '#94a3b8',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ↑
        </button>
      )}
    </div>
  );
}
