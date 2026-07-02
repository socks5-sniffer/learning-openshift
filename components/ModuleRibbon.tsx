import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { allModules, sections } from '../data/modules';
import { useProgress } from './ProgressContext';

// Fixed navigation ribbon shown on every module page (mounted once in _app,
// activated by route). Gives learners a sense of place — position in the
// curriculum, section, estimated reading time — plus prev/next navigation.
export default function ModuleRibbon() {
  const router = useRouter();
  const { isComplete, completedCount, totalCount, loaded } = useProgress();
  const [readMinutes, setReadMinutes] = useState<number | null>(null);

  const match = router.pathname.match(/^\/module-(.+)$/);
  const moduleId = match ? match[1] : null;
  const index = moduleId ? allModules.findIndex((m) => m.id === moduleId) : -1;
  const active = index !== -1;

  // reserve space so the ribbon never covers the completion card at page bottom
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.paddingBottom;
    document.body.style.paddingBottom = '64px';
    return () => {
      document.body.style.paddingBottom = previous;
    };
  }, [active, moduleId]);

  // estimate reading time from the rendered page text (~200 wpm)
  useEffect(() => {
    if (!active) return;
    setReadMinutes(null);
    const timer = setTimeout(() => {
      // innerText on a detached clone is unreliable (no layout), so instead
      // subtract the (still-attached) copy buttons' own word counts from the total.
      const container = document.querySelector('main') ?? document.body;
      const countWords = (text: string) => text.split(/\s+/).filter(Boolean).length;
      const copyButtons = container.querySelectorAll<HTMLElement>('[aria-label="Copy code to clipboard"]');
      const buttonWords = Array.from(copyButtons).reduce((sum, btn) => sum + countWords(btn.innerText), 0);
      const words = Math.max(0, countWords(container.innerText) - buttonWords);
      setReadMinutes(Math.max(1, Math.round(words / 200)));
    }, 150);
    return () => clearTimeout(timer);
  }, [active, moduleId]);

  if (!active) return null;

  const current = allModules[index];
  const prev = index > 0 ? allModules[index - 1] : null;
  const next = index < allModules.length - 1 ? allModules[index + 1] : null;
  const section = sections.find((s) => s.modules.some((m) => m.id === current.id));
  const done = loaded && isComplete(current.id);
  const progressPercent = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

  const navLinkStyle: CSSProperties = {
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '28vw',
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        background: 'rgba(15, 23, 42, 0.96)',
        borderTop: '1px solid rgba(148, 163, 184, 0.2)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* thin curriculum progress bar along the top edge */}
      <div style={{ height: 3, background: 'rgba(148, 163, 184, 0.15)' }}>
        <div
          style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #16a34a, #22c55e)',
            transition: 'width 0.4s ease',
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          maxWidth: 1200,
          margin: '0 auto',
          padding: '10px 16px',
        }}
      >
        {prev ? (
          <Link href={`/module-${prev.id}`} style={navLinkStyle} title={prev.title}>
            ← {prev.title}
          </Link>
        ) : (
          <Link href="/learning-modules" style={navLinkStyle}>
            ← All Modules
          </Link>
        )}

        <div
          style={{
            textAlign: 'center',
            color: '#cbd5e1',
            fontSize: '0.82rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <span style={{ fontWeight: 700, color: '#f8fafc' }}>
            {index + 1} of {allModules.length}
          </span>
          {section && <span style={{ color: '#64748b' }}> · {section.badgeLabel}</span>}
          {readMinutes !== null && <span style={{ color: '#64748b' }}> · ~{readMinutes} min read</span>}
          {done && <span style={{ color: '#22c55e', fontWeight: 700 }}> · ✓ done</span>}
        </div>

        {next ? (
          <Link href={`/module-${next.id}`} style={{ ...navLinkStyle, color: '#fca5a5', textAlign: 'right' }} title={next.title}>
            {next.title} →
          </Link>
        ) : (
          <Link href="/learning-modules" style={{ ...navLinkStyle, color: '#fca5a5', textAlign: 'right' }}>
            Finish 🎉
          </Link>
        )}
      </div>
    </div>
  );
}
