import Head from 'next/head';
import Link from 'next/link';
import type { ReactNode } from 'react';
import homeStyles from '../../styles/Home.module.css';
import styles from '../../styles/Module.module.css';
import ModuleCompletion from '../ModuleCompletion';
import { allModules, getModuleById } from '../../data/modules';

interface ModuleShellProps {
  /** Module id, e.g. "1-1". Title, description, and prev/next are derived
   *  from data/modules.ts so there is a single source of truth. */
  id: string;
  /** Optional one-line subtitle shown under the heading. */
  subtitle?: string;
  children: ReactNode;
}

// Shared chrome for every learning module: themed container, page head,
// heading, in-flow nav, and the completion/quiz card. Nav labels and the
// document title come from the module catalog, not hand-written strings, so
// they can't drift out of sync with data/modules.ts.
export default function ModuleShell({ id, subtitle, children }: ModuleShellProps) {
  const info = getModuleById(id);
  const index = allModules.findIndex((m) => m.id === id);
  const prev = index > 0 ? allModules[index - 1] : null;
  const next = index >= 0 && index < allModules.length - 1 ? allModules[index + 1] : null;
  // Only the genuine final module gets the "Finish" action. When id isn't in
  // the catalog (index === -1) next is also null, but that's an unknown module,
  // not the end of the course — fall back to a plain "All Modules" link.
  const isLastModule = index >= 0 && index === allModules.length - 1;

  const heading = info ? `Module ${id.replace('-', '.')}: ${info.title}` : `Module ${id}`;
  const description = info?.description ?? '';

  return (
    <div className={homeStyles.container}>
      <Head>
        <title>{heading}</title>
        <meta name="description" content={description} />
      </Head>

      <Link href="/learning-modules" className={styles.cornerLink}>
        All Modules
      </Link>

      <main className={homeStyles.main}>
        <h1 className={homeStyles.title}>{heading}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

        <nav className={styles.topNav} aria-label="Module navigation">
          {prev && (
            <>
              <Link href={`/module-${prev.id}`} className={styles.topNavLink}>
                ← Previous: {prev.title}
              </Link>
              <span className={styles.topNavSep} aria-hidden="true">|</span>
            </>
          )}
          <Link href="/learning-modules" className={styles.topNavLink}>
            All Modules
          </Link>
          {next && (
            <>
              <span className={styles.topNavSep} aria-hidden="true">|</span>
              <Link href={`/module-${next.id}`} className={styles.topNavLink}>
                Next: {next.title} →
              </Link>
            </>
          )}
        </nav>

        {children}

        <div className={styles.bottomNav}>
          {prev ? (
            <Link href={`/module-${prev.id}`} className={styles.navButton}>
              ← Previous: {prev.title}
            </Link>
          ) : (
            <Link href="/learning-modules" className={styles.navButton}>
              ← All Modules
            </Link>
          )}
          {next ? (
            <Link href={`/module-${next.id}`} className={`${styles.navButton} ${styles.navButtonPrimary}`}>
              Next: {next.title} →
            </Link>
          ) : (
            <Link href="/learning-modules" className={`${styles.navButton} ${styles.navButtonPrimary}`}>
              {isLastModule ? 'Finish 🎉' : '← All Modules'}
            </Link>
          )}
        </div>

        <ModuleCompletion moduleId={id} />
      </main>
    </div>
  );
}
