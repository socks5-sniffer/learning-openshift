const base = process.env.SMOKE_URL || 'http://127.0.0.1:3000';
let safeFailure = new Error('Standalone health endpoint did not become ready');

function requireCheck(condition, message) {
  if (!condition) {
    // Messages are supplied by this test, never by an HTTP response.
    safeFailure = new Error(message);
    Error.captureStackTrace(safeFailure, requireCheck);
    throw safeFailure;
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
  requireCheck(ready, 'Health endpoint /api/hello did not become ready within 60 attempts');
  console.log('Standalone health check passed');

  const nonces = new Set();
  const assets = new Set(['/favicon.ico', '/shield-272x300.png']);
  for (const path of ['/', '/', '/learning-modules', '/module-7-1']) {
    safeFailure = new Error(`${path}: document request failed or exceeded its 5-second deadline`);
    const response = await fetch(`${base}${path}`, { signal: AbortSignal.timeout(5000) });
    requireCheck(response.status === 200, `${path}: expected HTTP 200`);
    requireCheck(response.headers.get('x-content-type-options') === 'nosniff', `${path}: missing nosniff header`);
    const csp = response.headers.get('content-security-policy') || '';
    requireCheck(!csp.includes('unsafe-eval'), `${path}: production CSP permits eval`);
    const nonce = csp.match(/'nonce-([^']+)'/)?.[1];
    requireCheck(nonce, `${path}: missing CSP nonce`);
    requireCheck(!nonces.has(nonce), `${path}: CSP nonce was reused`);
    nonces.add(nonce);
    const html = await response.text();
    requireCheck(html.includes(`nonce="${nonce}"`), `${path}: nonce missing from HTML`);
    for (const match of html.matchAll(/(?:src|href)="([^"#]*\/_next\/static\/[^"#]+)"/g)) {
      assets.add(match[1].replaceAll('&amp;', '&'));
    }
  }
  requireCheck([...assets].some((path) => path.endsWith('.js')), 'Rendered pages contain no JavaScript assets');
  requireCheck([...assets].some((path) => path.endsWith('.css')), 'Rendered pages contain no stylesheet assets');
  console.log('Rendered page and production CSP checks passed');
  for (const path of assets) {
    safeFailure = new Error('Packaged asset request failed or exceeded its 5-second deadline');
    const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(5000) });
    requireCheck(response.status === 200, 'Packaged asset returned an unexpected status; expected HTTP 200');
  }
  console.log('Packaged JavaScript, stylesheets, and public assets passed');
}

check().catch(() => {
  // Keep check-specific diagnostics and call sites, without printing raw fetch
  // errors, response content, headers, nonces, or response-derived asset URLs.
  console.error(safeFailure.stack);
  process.exitCode = 1;
});
