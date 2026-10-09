import { test, expect } from './fixtures';

test('RBAC lesson supports viewer and admin actions with matching YAML', async ({ page }) => {
  await page.goto('/module-7-1');
  await page.getByRole('button', { name: 'Read-Only Viewer', exact: true }).click();
  await page.getByLabel('Show example RBAC YAML', { exact: true }).check();
  const yaml = page.locator('pre');
  await expect(yaml).toContainText('name: viewer-role');
  await expect(yaml).toContainText('apiGroups: ["apps"]\n    resources: ["deployments"]');
  for (const role of ['Read-Only Viewer', 'Namespace Admin', 'Cluster Admin']) {
    await page.getByRole('button', { name: role, exact: true }).click();
    for (const action of ['get-services', 'get-deployments']) {
      await page.getByRole('button', { name: action, exact: true }).click();
      await expect(page.getByText(`Allowed: ${action}`, { exact: true })).toBeVisible();
    }
    if (role === 'Cluster Admin') {
      await expect(yaml).toContainText('kind: ClusterRoleBinding');
      await expect(yaml).toContainText('name: cluster-admin');
    } else {
      await expect(yaml).toContainText('resources: ["services"]');
      await expect(yaml).toContainText('apiGroups: ["apps"]\n    resources: ["deployments"]');
    }
  }
  await page.getByRole('button', { name: 'Read-Only Viewer', exact: true }).click();
  await page.getByRole('button', { name: 'create-pods', exact: true }).click();
  await expect(page.getByText('Denied: create-pods', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Namespace Admin', exact: true }).click();
  await page.getByRole('button', { name: 'delete-namespace', exact: true }).click();
  await expect(page.getByText('Denied: delete-namespace', { exact: true })).toBeVisible();
});

test('monitoring alert threshold is named and responds to the keyboard', async ({ page }) => {
  await page.goto('/module-8-2');
  await page.getByLabel('Enable Alert', { exact: true }).check();
  const threshold = page.getByRole('slider', { name: /^Alert Threshold:/ });
  await threshold.press('Home');
  await expect(threshold).toHaveValue('50');
  await expect(page.getByText(/ALERT: CPU Usage is 62%, exceeding threshold of 50%/)).toBeVisible();
  await threshold.press('End');
  await expect(threshold).toHaveValue('100');
  await expect(page.getByText(/ALERT: CPU Usage/)).toHaveCount(0);
});

test('home progress text meets normal-text contrast in both themes', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('kubelearn-progress', '["0-1"]');
  });
  await page.goto('/');
  const progress = page.getByText(/You've completed/);
  await expect(progress).toBeVisible();
  for (const theme of ['light', 'dark']) {
    // Disable the color transitions so computed contrast reflects the selected theme.
    await page.evaluate((value) => {
      document.querySelectorAll<HTMLElement>('*').forEach((element) => element.style.setProperty('transition', 'none', 'important'));
      document.documentElement.setAttribute('data-theme', value);
    }, theme);
    const ratios = await progress.evaluate((element) => {
      const rgba = (value: string) => value.match(/[\d.]+/g)!.map(Number);
      const luminance = (rgb: number[]) => rgb.slice(0, 3).map((value) => {
        const channel = value / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      }).reduce((total, value, index) => total + value * [0.2126, 0.7152, 0.0722][index], 0);
      return [element, ...Array.from(element.querySelectorAll('strong'))].map((text) => {
        const ancestors: Element[] = [];
        for (let current: Element | null = text; current; current = current.parentElement) ancestors.unshift(current);
        let background = [255, 255, 255];
        for (const ancestor of ancestors) {
          const color = rgba(getComputedStyle(ancestor).backgroundColor);
          const alpha = color[3] ?? 1;
          background = background.map((value, index) => color[index] * alpha + value * (1 - alpha));
        }
        const foreground = luminance(rgba(getComputedStyle(text).color));
        const surface = luminance(background);
        return (Math.max(foreground, surface) + 0.05) / (Math.min(foreground, surface) + 0.05);
      });
    });
    for (const ratio of ratios) expect(ratio, `${theme} progress text contrast`).toBeGreaterThanOrEqual(4.5);
  }
});
