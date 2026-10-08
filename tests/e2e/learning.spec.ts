import { allModules } from '../../data/modules';
import { quizzes } from '../../data/quizzes';
import { test, expect } from './fixtures';

for (const lesson of allModules) {
  test(`lesson ${lesson.id} loads its quiz and navigation`, async ({ page }) => {
    const response = await page.goto(`/module-${lesson.id}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(`Module ${lesson.id.replace('-', '.')}`);
    await expect(page.getByRole('heading', { name: /Knowledge Check/ })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Module navigation' })).toBeVisible();
    await expect(page.getByRole('button', { name: '✓ Mark as complete', exact: true })).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem('kubelearn-last-visited'))).toBe(lesson.id);
    const width = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: window.innerWidth }));
    expect(width.content, 'Lesson should fit the viewport without horizontal page scrolling').toBeLessThanOrEqual(width.viewport + 1);
  });
}

test('quiz completion persists and answers reset on client navigation', async ({ page }) => {
  await page.goto('/module-0-1');
  await expect(page.getByRole('heading', { name: /Knowledge Check/ })).toBeVisible();
  for (const question of quizzes['0-1']) {
    await page.getByRole('button', { name: question.options[question.correctIndex], exact: true }).click();
  }
  await expect(page.getByText('4 / 4 correct', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Mark as not complete', exact: true })).toBeVisible();
  await page.evaluate(() => Object.defineProperty(window, '__learningNavigationMarker', { value: true }));
  await page.getByRole('navigation', { name: 'Module navigation' }).getByRole('link', { name: /Next:/ }).click();
  await expect(page).toHaveURL(/\/module-0-2$/);
  expect(await page.evaluate(() => '__learningNavigationMarker' in window)).toBe(true);
  await expect(page.getByRole('heading', { name: /Knowledge Check/ })).toBeVisible();
  await expect(page.getByText('4 / 4 correct', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: '✓ Mark as complete', exact: true })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('kubelearn-progress') ?? '[]'))).toEqual(['0-1']);
  await page.goto('/learning-modules');
  await expect(page.getByText('Your progress: 1 of 30 modules')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Continue learning →', exact: true })).toHaveAttribute('href', '/module-0-2');
  await page.reload();
  await expect(page.getByText('Your progress: 1 of 30 modules')).toBeVisible();
});

test('malformed storage does not break the module catalog', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('kubelearn-progress', '{invalid');
    localStorage.setItem('kubelearn-last-visited', 'not-a-module');
  });
  await page.goto('/learning-modules');
  await expect(page.getByText('Your journey starts here')).toBeVisible();
});

test('unavailable storage permits completion for the session', async ({ page }) => {
  await page.addInitScript(() => {
    for (const method of ['getItem', 'setItem', 'removeItem']) {
      Object.defineProperty(Storage.prototype, method, { value: () => { throw new Error('Storage unavailable'); } });
    }
  });
  await page.goto('/module-0-1');
  await page.getByRole('button', { name: '✓ Mark as complete', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Mark as not complete', exact: true })).toBeVisible();
});

test('module search filters and Escape restores the list', async ({ page }) => {
  await page.goto('/learning-modules');
  const search = page.getByPlaceholder(/Search modules/);
  await search.fill('RBAC');
  await expect(page.locator('a[href="/module-7-1"]')).toBeVisible();
  await expect(page.locator('a[href="/module-0-1"]')).toHaveCount(0);
  await search.press('Escape');
  await expect(search).toHaveValue('');
  await expect(page.locator('a[href="/module-0-1"]')).toBeVisible();
});
