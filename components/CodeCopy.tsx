import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Adds a copy button to code blocks across the site without touching the
// content pages themselves. Module pages render code as <pre> blocks or as
// monospace-styled <div>s, so we detect both, skipping ASCII-art diagrams
// and short inline snippets where a button would be noise.

const PROCESSED = 'data-codecopy';
const DIAGRAM_CHARS = /[┌┐└┘├┤│─▼▲]/;

function attachButtons() {
  const candidates = document.querySelectorAll<HTMLElement>(
    'pre, div[style*="monospace"], div[style*="JetBrains"]'
  );

  candidates.forEach((el) => {
    if (el.hasAttribute(PROCESSED)) return;
    // don't double-attach to a monospace div nested inside an already-handled block
    if (el.parentElement?.closest(`[${PROCESSED}]`)) return;

    const text = el.innerText.trim();
    // skip diagrams, one-word snippets, and blocks that are mostly prose labels
    if (DIAGRAM_CHARS.test(text)) return;
    if (text.length < 25 && !text.includes('\n')) return;

    el.setAttribute(PROCESSED, 'true');
    if (getComputedStyle(el).position === 'static') {
      el.style.position = 'relative';
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = '⧉ Copy';
    button.setAttribute('aria-label', 'Copy code to clipboard');
    Object.assign(button.style, {
      position: 'absolute',
      top: '8px',
      right: '8px',
      padding: '4px 10px',
      fontSize: '0.72rem',
      fontWeight: '600',
      borderRadius: '6px',
      border: '1px solid rgba(148, 163, 184, 0.35)',
      background: 'rgba(15, 23, 42, 0.85)',
      color: '#94a3b8',
      cursor: 'pointer',
      opacity: '0',
      transition: 'opacity 0.15s ease',
      zIndex: '5',
    } as CSSStyleDeclaration);

    el.addEventListener('mouseenter', () => (button.style.opacity = '1'));
    el.addEventListener('mouseleave', () => (button.style.opacity = '0'));
    // keep it reachable on touch devices, where hover never fires
    if (typeof window.matchMedia === 'function' && window.matchMedia('(hover: none)').matches) {
      button.style.opacity = '0.7';
    }

    button.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = '✓ Copied';
        button.style.color = '#22c55e';
        setTimeout(() => {
          button.textContent = '⧉ Copy';
          button.style.color = '#94a3b8';
        }, 2000);
      } catch {
        button.textContent = '✗ Failed';
        setTimeout(() => (button.textContent = '⧉ Copy'), 2000);
      }
    });

    el.appendChild(button);
  });
}

export default function CodeCopy() {
  const router = useRouter();

  useEffect(() => {
    // slight delay so the page content is in the DOM after client navigation
    const run = () => setTimeout(attachButtons, 100);
    run();
    router.events.on('routeChangeComplete', run);
    return () => router.events.off('routeChangeComplete', run);
  }, [router.events]);

  return null;
}
