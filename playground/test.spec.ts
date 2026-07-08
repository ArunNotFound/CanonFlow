import { test, expect } from '@playwright/test';
test('playground', async ({ page }) => {
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  const url = 'https://ArunNotFound.github.io/CanonFlow/';
  await page.goto(url);
  await page.waitForTimeout(5000);
});
