import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from 'react';
import styles from '../styles/Home.module.css';
import { quizzes } from '../data/quizzes';
import { sections, getModuleById } from '../data/modules';
import { randomInt } from '../lib/random';

interface Card {
  moduleId: string;
  moduleTitle: string;
  sectionKey: string;
  front: string;
  back: string;
  detail: string;
}

// Build the deck once from the quiz bank: front = question,
// back = the correct answer, detail = the explanation.
const allCards: Card[] = Object.entries(quizzes).flatMap(([moduleId, questions]) => {
  const moduleInfo = getModuleById(moduleId);
  const section = sections.find((s) => s.modules.some((m) => m.id === moduleId));
  return questions.map((q) => ({
    moduleId,
    moduleTitle: moduleInfo ? moduleInfo.title : moduleId,
    sectionKey: section ? section.key : '',
    front: q.question,
    back: q.options[q.correctIndex],
    detail: q.explanation,
  }));
});

// "🏛️ Part 0: The Foundation" -> "The Foundation"
function sectionLabel(heading: string): string {
  return heading.replace(/^[^:]*:\s*/, '');
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function Flashcards() {
  const [sectionFilter, setSectionFilter] = useState('all');
  const [deck, setDeck] = useState<Card[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [gotIt, setGotIt] = useState(0);
  const [review, setReview] = useState(0);

  const pool = useMemo(
    () => (sectionFilter === 'all' ? allCards : allCards.filter((c) => c.sectionKey === sectionFilter)),
    [sectionFilter]
  );

  const restart = useCallback((cards: Card[]) => {
    setDeck(shuffle(cards));
    setIndex(0);
    setFlipped(false);
    setGotIt(0);
    setReview(0);
  }, []);

  // (re)build the deck on mount and whenever the filter changes —
  // shuffling in an effect keeps the server render deterministic
  useEffect(() => {
    restart(pool);
  }, [pool, restart]);

  const card = deck[index];
  const finished = deck.length > 0 && index >= deck.length;

  const advance = useCallback(
    (knewIt: boolean) => {
      if (knewIt) setGotIt((n) => n + 1);
      else setReview((n) => n + 1);
      setFlipped(false);
      setIndex((i) => i + 1);
    },
    []
  );

  // keyboard: space flips, 1/2 answer after flipping
  useEffect(() => {
    const NATIVE_CONTROL_TAGS = new Set(['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A']);
    const focusIsNativeControl = () => {
      const el = document.activeElement;
      if (!el) return false;
      return NATIVE_CONTROL_TAGS.has(el.tagName) || (el as HTMLElement).isContentEditable;
    };
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        // A focused button/input etc. should get its own native Space
        // activation instead of having it hijacked into flipping the card.
        if (focusIsNativeControl()) return;
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (flipped && e.key === '1') {
        advance(true);
      } else if (flipped && e.key === '2') {
        advance(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [flipped, advance]);

  const actionButton = (label: string, color: string, onClick: () => void): CSSProperties & { label: string; onClick: () => void } => ({
    label,
    onClick,
    padding: '12px 24px',
    borderRadius: 8,
    border: `1px solid ${color}`,
    background: 'transparent',
    color,
    fontWeight: 600,
    fontSize: '0.95rem',
    cursor: 'pointer',
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Flashcards | KubeLearn</title>
        <meta name="description" content="Review Kubernetes concepts with flashcards built from every module's knowledge checks" />
      </Head>

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

      <main className={styles.main} style={{ maxWidth: 800, margin: '0 auto', paddingTop: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}></span>
            Spaced Review
          </div>
          <h1 className={styles.title}>
            Flash<span className={styles.titleAccent}>cards</span>
          </h1>
          <p className={styles.subtitle}>
            {allCards.length} cards built from every module&apos;s knowledge checks. Space to flip,
            then be honest with yourself.
          </p>
        </div>

        {/* Section filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: '2rem' }}>
          {[{ key: 'all', label: `All (${allCards.length})` }, ...sections.map((s) => ({
            key: s.key,
            label: `${sectionLabel(s.heading)} (${allCards.filter((c) => c.sectionKey === s.key).length})`,
          }))].map((s) => {
            return (
              <button
                key={s.key}
                onClick={() => setSectionFilter(s.key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  background: sectionFilter === s.key ? 'rgba(220, 38, 38, 0.2)' : 'transparent',
                  color: sectionFilter === s.key ? '#fca5a5' : '#94a3b8',
                }}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Progress line */}
        {deck.length > 0 && !finished && (
          <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Card {index + 1} of {deck.length}
            {gotIt + review > 0 && (
              <span>
                {' '}· <span style={{ color: '#22c55e' }}>{gotIt} known</span> ·{' '}
                <span style={{ color: '#f59e0b' }}>{review} to review</span>
              </span>
            )}
          </div>
        )}

        {/* Card */}
        {card && !finished && (
          <>
            <div
              onClick={() => setFlipped((f) => !f)}
              role="button"
              tabIndex={0}
              aria-pressed={flipped}
              aria-label={flipped ? 'Showing answer, activate to show question' : 'Showing question, activate to reveal answer'}
              onKeyDown={(e: ReactKeyboardEvent<HTMLDivElement>) => {
                // Space is handled by the window-level shortcut; only Enter needs a local handler.
                if (e.key === 'Enter') {
                  e.preventDefault();
                  setFlipped((f) => !f);
                }
              }}
              style={{
                minHeight: 280,
                borderRadius: 16,
                border: flipped ? '2px solid rgba(34, 197, 94, 0.4)' : '2px solid rgba(148, 163, 184, 0.25)',
                background: flipped ? 'rgba(34, 197, 94, 0.06)' : 'rgba(30, 41, 59, 0.6)',
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                userSelect: 'none',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {flipped ? 'Answer' : 'Question'} · {card.moduleTitle}
              </div>
              {flipped ? (
                <>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#86efac', lineHeight: 1.5 }}>
                    {card.back}
                  </div>
                  <div style={{ marginTop: '1.25rem', fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6, maxWidth: 600 }}>
                    {card.detail}
                  </div>
                  <Link
                    href={`/module-${card.moduleId}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{ marginTop: '1.25rem', color: '#94a3b8', fontSize: '0.8rem', textDecoration: 'none' }}
                  >
                    📖 Review this module →
                  </Link>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f8fafc', lineHeight: 1.5, maxWidth: 620 }}>
                    {card.front}
                  </div>
                  <div style={{ marginTop: '1.5rem', color: '#64748b', fontSize: '0.8rem' }}>
                    click or press space to reveal
                  </div>
                </>
              )}
            </div>

            {flipped && (
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
                {[actionButton('✓ Got it (1)', '#22c55e', () => advance(true)), actionButton('↻ Review again (2)', '#f59e0b', () => advance(false))].map(
                  ({ label, onClick, ...style }) => (
                    <button key={label} style={style} onClick={onClick}>
                      {label}
                    </button>
                  )
                )}
              </div>
            )}
          </>
        )}

        {/* Finished */}
        {finished && (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem 2rem',
              borderRadius: 16,
              border: '2px solid rgba(34, 197, 94, 0.4)',
              background: 'rgba(34, 197, 94, 0.06)',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc' }}>Deck complete</div>
            <div style={{ color: '#cbd5e1', marginTop: '0.75rem' }}>
              <span style={{ color: '#22c55e', fontWeight: 700 }}>{gotIt}</span> known ·{' '}
              <span style={{ color: '#f59e0b', fontWeight: 700 }}>{review}</span> worth another look
            </div>
            <button
              onClick={() => restart(pool)}
              style={{
                marginTop: '1.5rem',
                padding: '12px 28px',
                borderRadius: 8,
                border: 'none',
                background: '#9c0606',
                color: 'white',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              ↻ Shuffle & go again
            </button>
          </div>
        )}

        <div style={{ textAlign: 'center', margin: '3rem 0 1rem' }}>
          <Link href="/interactive-learning" style={{ color: '#94a3b8', textDecoration: 'none' }}>
            ← Back to Interactive Labs
          </Link>
        </div>
      </main>
    </div>
  );
}
