import type { ReactNode } from 'react';
import styles from '../../styles/Module.module.css';

interface TermBoxProps {
  children: ReactNode;
  /** When false, opts the block out of the global CodeCopy button
   *  (e.g. ASCII diagrams that aren't meant to be copied). */
  copyable?: boolean;
}

// Terminal/code display box. Intentionally dark in both themes. Replaces the
// repeated monospace <div style={{...}}> blocks in the modules.
export default function TermBox({ children, copyable = true }: TermBoxProps) {
  // TermBox styles its monospace font via a CSS class, so CodeCopy's inline
  // `style*="monospace"` selector won't catch it. Opt in with an explicit
  // marker attribute when copyable; opt out with the standard skip attribute.
  const marker = copyable ? { 'data-codecopy-scan': '' } : { 'data-codecopy': 'skip' };
  return (
    <div className={styles.termBox} {...marker}>
      {children}
    </div>
  );
}
