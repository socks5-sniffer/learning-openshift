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
  return (
    <div className={styles.termBox} {...(copyable ? {} : { 'data-codecopy': 'skip' })}>
      {children}
    </div>
  );
}
