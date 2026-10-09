import { test, expect } from './fixtures';

test('home resumes an unfinished lesson before any completion', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Start learning →', exact: true })).toHaveAttribute('href', '/module-0-1');
  await page.goto('/module-4-3');
  await expect(page.getByRole('heading', { name: /Knowledge Check/ })).toBeVisible();
  await page.goto('/');
  const resume = page.getByRole('link', { name: /^Continue:/ });
  await expect(resume).toHaveAttribute('href', '/module-4-3');
  await resume.click();
  await expect(page).toHaveURL(/\/module-4-3$/);
  await expect(page.getByRole('button', { name: '✓ Mark as complete', exact: true })).toBeVisible();
});

test('unsupported monitoring metrics ignore the enabled alert threshold', async ({ page }) => {
  await page.goto('/module-8-2');
  const errors = page.getByRole('button', { name: /Error Rate/ });
  await errors.click();
  const chart = page.locator('svg polyline');
  const originalPoints = await chart.getAttribute('points');
  expect(originalPoints).not.toBeNull();
  await page.getByRole('button', { name: /CPU Usage/ }).click();
  await page.getByLabel('Enable Alert', { exact: true }).check();
  await expect(page.getByRole('slider', { name: /^Alert Threshold:/ })).toBeVisible();
  await errors.click();
  await expect(page.getByRole('slider', { name: /^Alert Threshold:/ })).toHaveCount(0);
  await expect(page.locator('svg line[stroke="#ef4444"]')).toHaveCount(0);
  await expect(chart).toHaveAttribute('points', originalPoints!);
});
