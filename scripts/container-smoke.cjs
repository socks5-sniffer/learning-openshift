const assert = require('node:assert/strict');

const base = process.env.SMOKE_URL || 'http://127.0.0.1:3000';

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
  assert.ok(ready, 'Standalone server did not become ready');

  const nonces = new Set();
  const assets = new Set(['/favicon.ico', '/shield-272x300.png']);
  for (const path of ['/', '/', '/learning-modules', '/module-7-1']) {
    const response = await fetch(`${base}${path}`);
    assert.equal(response.status, 200, path);
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    const csp = response.headers.get('content-security-policy') || '';
    assert.ok(!csp.includes('unsafe-eval'), 'Production CSP permits eval');
    const nonce = csp.match(/'nonce-([^']+)'/)?.[1];
    assert.ok(nonce, `${path}: missing CSP nonce`);
    assert.ok(!nonces.has(nonce), 'CSP nonce was reused');
    nonces.add(nonce);
    const html = await response.text();
    assert.ok(html.includes(`nonce="${nonce}"`), `${path}: nonce missing from HTML`);
    for (const match of html.matchAll(/(?:src|href)="([^"#]*\/_next\/static\/[^"#]+)"/g)) {
      assets.add(match[1].replaceAll('&amp;', '&'));
    }
  }
  assert.ok([...assets].some((path) => path.endsWith('.js')), 'No JavaScript assets found');
  assert.ok([...assets].some((path) => path.endsWith('.css')), 'No stylesheet assets found');
  for (const path of assets) {
    const response = await fetch(new URL(path, base));
    assert.equal(response.status, 200, `Missing packaged asset: ${path}`);
  }
  console.log(`Standalone smoke check passed: fresh CSP nonces and ${assets.size} assets`);
}

check().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
