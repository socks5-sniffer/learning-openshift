import { test, expect } from './fixtures';

test('Pod Builder validates resources and generates Deployment selectors', async ({ page }) => {
  await page.goto('/pod-builder');
  await page.getByRole('button', { name: 'Deployment', exact: true }).click();
  const yaml = page.locator('pre');
  await expect(yaml).toContainText('kind: Deployment');
  await expect(yaml).toContainText('selector:\n    matchLabels:\n      app: my-app');
  const name = page.getByLabel('Name', { exact: true });
  await name.fill('Invalid_Name');
  const copy = page.getByRole('button', { name: '⧉ Copy', exact: true });
  await expect(copy).toBeDisabled();
  await name.fill('my-app');
  await expect(copy).toBeEnabled();
  // The resource request must fit within its limit.
  await page.getByLabel('CPU request', { exact: true }).fill('999m');
  await expect(page.getByText('CPU request cannot exceed the CPU limit.')).toBeVisible();
  await expect(copy).toBeDisabled();
});

test('RBAC enforces identity, namespace, and verb scope', async ({ page }) => {
  await page.goto('/rbac-simulator');
  const tester = page.getByRole('heading', { name: '3 · Test a permission', exact: true }).locator('..');
  await expect(tester.getByText('yes — ALLOWED', { exact: true })).toBeVisible();
  await tester.getByRole('button', { name: 'delete', exact: true }).click();
  await expect(tester.getByText('no — DENIED', { exact: true })).toBeVisible();
  await tester.getByRole('button', { name: 'list', exact: true }).click();
  await tester.getByRole('button', { name: 'production', exact: true }).click();
  await expect(tester.getByText('no — DENIED', { exact: true })).toBeVisible();
  await tester.getByRole('button', { name: 'staging', exact: true }).click();
  await tester.locator('input').fill('someone-else');
  await expect(tester.getByText('no — DENIED', { exact: true })).toBeVisible();
});

test('Service Discovery excludes unready Pods and handles no endpoints', async ({ page }) => {
  await page.goto('/service-discovery');
  await page.getByRole('button', { name: /Send request/ }).click();
  await expect(page.getByText(/routed to web-7f9c-/)).toBeVisible();
  const cache = page.getByRole('button', { name: 'cache', exact: true }).first();
  await cache.click();
  const pod = page.getByText('📦 cache-5c7e-z6v8b', { exact: true }).locator('..').locator('..');
  await pod.getByRole('button', { name: /Ready/ }).click();
  await page.getByRole('button', { name: /Send request/ }).click();
  await expect(page.getByText(/request failed \(Service has no ready endpoints\)/)).toBeVisible();
});

test('flashcards support keyboard reveal and grading', async ({ page }) => {
  await page.goto('/flashcards');
  const card = page.getByRole('button', { name: 'Showing question, activate to reveal answer', exact: true });
  await expect(card).toBeVisible();
  await card.focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('button', { name: 'Showing answer, activate to show question', exact: true })).toBeVisible();
  await page.keyboard.press('1');
  await expect(page.getByRole('button', { name: 'Showing question, activate to reveal answer', exact: true })).toBeVisible();
  await expect(page.getByText('1 known', { exact: true })).toBeVisible();
});

test('Secret encoder round-trips Unicode and handles invalid Base64', async ({ page }) => {
  await page.goto('/module-3-2');
  const secret = 'pässword-🔐';
  await page.getByLabel('Plain-text secret', { exact: true }).fill(secret);
  await expect(page.getByText('Base64 Encoded:', { exact: true }).locator('..')).toContainText('cMOkc3N3b3JkLfCflJA=');
  await page.getByLabel('Base64 secret', { exact: true }).fill('cMOkc3N3b3JkLfCflJA=');
  await expect(page.getByText('Decoded (Original Secret):', { exact: true }).locator('..')).toContainText(secret);
  await page.getByLabel('Base64 secret', { exact: true }).fill('!invalid!');
  await expect(page.getByText(/Invalid Base64/)).toBeVisible();
});

test('HPA scales from current replicas and supports scaling down', async ({ page }) => {
  await page.goto('/module-4-3');
  const sliders = page.getByRole('slider');
  await sliders.nth(4).press('End'); // Max replicas: 20
  await sliders.nth(1).press('End'); // Current replicas: 20
  await sliders.nth(3).press('Home'); // Min replicas: 1
  await sliders.nth(0).press('Home'); // CPU: 10%, target: 70%
  const recommendation = page.getByText('Desired Replicas', { exact: true }).locator('..');
  await expect(recommendation.getByText('3', { exact: true })).toBeVisible();
  await expect(recommendation.getByText('❄️ Scale down from 20', { exact: true })).toBeVisible();
  await sliders.nth(0).press('End'); // CPU: 100%
  await expect(recommendation.getByText('20', { exact: true })).toBeVisible();
  await expect(recommendation.getByText('✅ Keep the current replica count', { exact: true })).toBeVisible();
});
