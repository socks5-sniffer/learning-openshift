import type { ReactNode } from 'react';
import styles from '../../styles/Module.module.css';

type Variant = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

interface CalloutProps {
  /** Semantic color. Maps to the design-system accent tokens. */
  variant?: Variant;
  /** Optional bold heading (e.g. "Key Concept", "Reality Check"). */
  title?: string;
  /** Optional leading emoji/icon for the heading. */
  icon?: string;
  children: ReactNode;
}

// Themed callout box, replacing the hardcoded light-mode <div style={{...}}>
// boxes that were copy-pasted across every module. Uses translucent accent
// tints + theme text tokens so it reads in both dark and light mode.
export default function Callout({ variant = 'info', title, icon, children }: CalloutProps) {
  return (
    <div className={`${styles.callout} ${styles[variant]}`}>
      {title && (
        <p className={styles.calloutTitle}>
          {icon && <span aria-hidden="true">{icon}</span>}
          {title}
        </p>
      )}
      <div className={styles.calloutBody}>{children}</div>
    </div>
  );
}
