import { test, expect } from './fixtures';

test('production scripts use the request nonce and hydrate', async ({ page, request }) => {
  const response = await page.goto('/learning-modules');
  expect(response?.status()).toBe(200);
  const policy = response?.headers()['content-security-policy'] ?? '';
  const nonce = policy.match(/'nonce-([^']+)'/)?.[1];
  expect(nonce).toBeTruthy();
  expect(policy).not.toContain("'unsafe-eval'");
  expect(policy).toContain("'strict-dynamic'");
  expect(policy.split(';').find((part) => part.trim().startsWith('script-src'))).not.toContain("'unsafe-inline'");
  // Next's trusted runtime may prefetch scripts without a nonce, which
  // strict-dynamic intentionally permits. Check the original response tags.
  const bootstrapNonces = await page.evaluate((html) => {
    const document = new DOMParser().parseFromString(html, 'text/html');
    return Array.from(document.querySelectorAll('script'), (script) => script.nonce);
  }, await response!.text());
  expect(bootstrapNonces.length).toBeGreaterThan(0);
  expect(bootstrapNonces.every((value) => value === nonce)).toBe(true);
  await expect(page.getByText('Your journey starts here')).toBeVisible();

  const prefetchHeaders: Record<string, string>[] = [{ purpose: 'prefetch' }, { 'next-router-prefetch': '1' }];
  const seenNonces = new Set([nonce]);
  for (const headers of prefetchHeaders) {
    const nextResponse = await request.get('/learning-modules', {
      headers: { ...headers, 'x-nonce': 'untrusted-client-nonce', 'content-security-policy': "script-src 'unsafe-inline'" },
    });
    const nextPolicy = nextResponse.headers()['content-security-policy'];
    const nextNonce = nextPolicy?.match(/'nonce-([^']+)'/)?.[1];
    expect(nextNonce).toBeTruthy();
    expect(seenNonces.has(nextNonce)).toBe(false);
    expect(nextNonce).not.toBe('untrusted-client-nonce');
    seenNonces.add(nextNonce);
    expect(await nextResponse.text()).toContain(`nonce="${nextNonce}"`);
  }
});

test('CSP blocks an inline script without a trusted nonce', async ({ page, browserErrors }) => {
  // Inject into the response HTML to simulate an untrusted parser-inserted
  // script. Scripts created by the trusted runtime inherit strict-dynamic.
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (event) => {
      if (event.blockedURI === 'inline' && event.effectiveDirective === 'script-src-elem') {
        document.documentElement.setAttribute('data-untrusted-script-blocked', 'true');
      }
    });
  });
  await page.route('**/learning-modules', async (route) => {
    const response = await route.fetch();
    const html = await response.text();
    await route.fulfill({
      response,
      body: html.replace('</body>', '<script>window.__untrustedScriptExecuted = true</script></body>'),
    });
  });
  await page.goto('/learning-modules');
  await expect(page.getByText('Your journey starts here')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-untrusted-script-blocked', 'true');
  expect(await page.evaluate(() => '__untrustedScriptExecuted' in window)).toBe(false);
  const expectedViolation = /^Executing inline script violates the following Content Security Policy directive/;
  expect(browserErrors.some((error) => expectedViolation.test(error))).toBe(true);
  for (let index = browserErrors.length - 1; index >= 0; index--) {
    if (expectedViolation.test(browserErrors[index])) browserErrors.splice(index, 1);
  }
});

test('missing routes retain a nonce-protected error page', async ({ request, page }) => {
  const response = await request.get('/not-a-real-route');
  expect(response.status()).toBe(404);
  const nonce = response.headers()['content-security-policy']?.match(/'nonce-([^']+)'/)?.[1];
  expect(nonce).toBeTruthy();
  const scriptNonces = await page.evaluate((html) => {
    const document = new DOMParser().parseFromString(html, 'text/html');
    return Array.from(document.querySelectorAll('script'), (script) => script.nonce);
  }, await response.text());
  expect(scriptNonces.length).toBeGreaterThan(0);
  expect(scriptNonces.every((value) => value === nonce)).toBe(true);
});

test('security headers and API method restrictions are enforced', async ({ request }) => {
  const response = await request.get('/');
  expect(response.headers()['x-frame-options']).toBe('DENY');
  expect(response.headers()['x-content-type-options']).toBe('nosniff');
  expect(response.headers()['x-powered-by']).toBeUndefined();
  expect(response.headers()['strict-transport-security']).toContain('max-age=');
  const get = await request.get('/api/hello');
  expect(get.status()).toBe(200);
  expect(await get.json()).toEqual({ name: 'John Doe' });
  const post = await request.post('/api/hello');
  expect(post.status()).toBe(405);
  expect(post.headers()['allow']).toBe('GET');
});
