const base = process.env.SMOKE_URL || 'http://127.0.0.1:3000';
// Fixed diagnostic IDs identify the failed check without logging HTTP data or
// Error objects. Search the ID below to find its corresponding assertion.
const failures = {
  startup: () => console.error('SMOKE_STARTUP (container-smoke.cjs): /api/hello did not become ready'),
  pageRequest: () => console.error('SMOKE_PAGE_REQUEST (container-smoke.cjs): document request failed or timed out'),
  pageStatus: () => console.error('SMOKE_PAGE_STATUS (container-smoke.cjs): document must return HTTP 200'),
  nosniff: () => console.error('SMOKE_NOSNIFF (container-smoke.cjs): document is missing the nosniff header'),
  eval: () => console.error('SMOKE_CSP_EVAL (container-smoke.cjs): production CSP must not permit unsafe-eval'),
  nonce: () => console.error('SMOKE_CSP_NONCE (container-smoke.cjs): document is missing its CSP nonce'),
  nonceReuse: () => console.error('SMOKE_NONCE_REUSE (container-smoke.cjs): documents must receive fresh nonces'),
  htmlNonce: () => console.error('SMOKE_HTML_NONCE (container-smoke.cjs): HTML must contain the response nonce'),
  scripts: () => console.error('SMOKE_JS_LINKS (container-smoke.cjs): rendered pages contain no JavaScript links'),
  styles: () => console.error('SMOKE_CSS_LINKS (container-smoke.cjs): rendered pages contain no stylesheet links'),
  assetRequest: () => console.error('SMOKE_ASSET_REQUEST (container-smoke.cjs): packaged asset request failed or timed out'),
  assetStatus: () => console.error('SMOKE_ASSET_STATUS (container-smoke.cjs): asset must return HTTP 200; check public and .next/static copies'),
};
let reportFailure = failures.startup;

function requireCheck(condition, reporter) {
  if (!condition) {
    reportFailure = reporter;
    throw new Error('Standalone smoke check failed');
  }
}

async function check() {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`${base}/api/hello`, {
        signal: AbortSignal.timeout(2000),
      });
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {
      // The standalone server may still be starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  requireCheck(ready, failures.startup);
  console.log('Standalone health check passed');

  const nonces = new Set();
  const assets = new Set(['/favicon.ico', '/shield-272x300.png']);
  for (const pagePath of ['/', '/', '/learning-modules', '/module-7-1']) {
    if (pagePath === '/') console.log('Checking document /');
    if (pagePath === '/learning-modules') console.log('Checking document /learning-modules');
    if (pagePath === '/module-7-1') console.log('Checking document /module-7-1');
    reportFailure = failures.pageRequest;
    const response = await fetch(`${base}${pagePath}`, { signal: AbortSignal.timeout(5000) });
    requireCheck(response.status === 200, failures.pageStatus);
    requireCheck(response.headers.get('x-content-type-options') === 'nosniff', failures.nosniff);
    const csp = response.headers.get('content-security-policy') || '';
    requireCheck(!csp.includes('unsafe-eval'), failures.eval);
    const nonce = csp.match(/'nonce-([^']+)'/)?.[1];
    requireCheck(nonce, failures.nonce);
    requireCheck(!nonces.has(nonce), failures.nonceReuse);
    nonces.add(nonce);
    const html = await response.text();
    requireCheck(html.includes(`nonce="${nonce}"`), failures.htmlNonce);
    for (const match of html.matchAll(/(?:src|href)="([^"#]*\/_next\/static\/[^"#]+)"/g)) {
      assets.add(match[1].replaceAll('&amp;', '&'));
    }
  }
  requireCheck([...assets].some((assetPath) => assetPath.endsWith('.js')), failures.scripts);
  requireCheck([...assets].some((assetPath) => assetPath.endsWith('.css')), failures.styles);
  console.log('Rendered page and production CSP checks passed');
  for (const assetPath of assets) {
    reportFailure = failures.assetRequest;
    const response = await fetch(new URL(assetPath, base), { signal: AbortSignal.timeout(5000) });
    requireCheck(response.status === 200, failures.assetStatus);
  }
  console.log('Packaged JavaScript, stylesheets, and public assets passed');
}

check().catch(() => {
  reportFailure();
  process.exitCode = 1;
});
