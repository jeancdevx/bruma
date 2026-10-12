import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Spanish demo, local fonts and working primary action', async ({ page }) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (!['localhost', '127.0.0.1'].includes(new URL(request.url()).hostname)) external.push(request.url()); });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Un café. Un momento para ti.');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  expect(await page.evaluate(() => document.fonts.check('16px Manrope') && document.fonts.check('36px Fraunces'))).toBe(true);
  await page.getByRole('link', { name: 'Explorar Bruma' }).click();
  await expect(page).toHaveURL(/#barra$/);
  await expect(page.locator('[data-story]')).toHaveAttribute('data-story-active', '1');
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test('desktop story follows scroll in both directions', async ({ page }) => {
  await page.goto('/');
  const story = page.locator('[data-story]');
  await expect(story).toHaveAttribute('data-enhanced', '');
  await expect(story).toHaveAttribute('data-story-active', '0');
  await page.getByRole('link', { name: '03: Disfrutar' }).click();
  await expect(story).toHaveAttribute('data-story-active', '2');
  await expect(page.locator('[data-story-frames]')).toHaveAttribute('aria-label', /mesa de madera/);
  expect(await page.locator('.visual-frame').nth(2).evaluate(element => Number(getComputedStyle(element).opacity))).toBeGreaterThan(.75);
  await page.getByRole('link', { name: '02: Preparar' }).click();
  await expect(story).toHaveAttribute('data-story-active', '1');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(story).toHaveAttribute('data-story-active', '0');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(story).not.toHaveAttribute('data-enhanced');
  await expect(page.locator('#barra [data-scene-image]')).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(story).toHaveAttribute('data-enhanced', '');
});

for (const width of [320, 390, 768, 1440]) {
  test(`responsive layout and complete images at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    const title = await page.locator('h1').boundingBox();
    expect(title!.x).toBeGreaterThanOrEqual(0);
    expect(title!.x + title!.width).toBeLessThanOrEqual(width);
    if (width < 1024) {
      await expect(page.locator('[data-story]')).not.toHaveAttribute('data-enhanced');
      await expect(page.locator('[data-scene-image]')).toHaveCount(3);
      for (const id of ['llegar', 'barra', 'mesa']) {
        const image = page.locator(`#${id} [data-scene-image] img`);
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
        const box = await image.boundingBox();
        expect(box!.width / box!.height).toBeCloseTo(1.5, 1);
      }
    }
    await page.locator('#carta').scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: 'Flat white' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  });
}

test('mobile menu traps focus, closes with Escape and navigates', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Abrir menú' });
  await toggle.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Shift+Tab');
  expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await dialog.getByRole('link', { name: /La carta/ }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/#carta$/);
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');
  await toggle.click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(dialog).not.toBeVisible();
  await expect(page.locator('[data-brand-link]')).toBeFocused();
});

test('reduced motion is static and updates when the preference changes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const story = page.locator('[data-story]');
  await expect(story).not.toHaveAttribute('data-enhanced');
  for (const image of await page.locator('[data-scene-image]').all()) await expect(image).toBeVisible();
  expect(await page.locator('html').evaluate(element => getComputedStyle(element).scrollBehavior)).toBe('auto');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(story).toHaveAttribute('data-enhanced', '');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(story).not.toHaveAttribute('data-enhanced');
});

test('all content and navigation work without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 }, baseURL });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('[data-story]')).not.toHaveAttribute('data-enhanced');
  await expect(page.getByRole('button', { name: 'Abrir menú' })).not.toBeVisible();
  for (const figure of await page.locator('[data-scene-image]').all()) await expect(figure).toBeVisible();
  await page.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name: 'La carta' }).click();
  await expect(page).toHaveURL(/#carta$/);
  await expect(page.getByRole('heading', { name: 'Pequeños placeres, bien hechos.' })).toBeInViewport();
  await context.close();
});

test('keyboard skip link reaches main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Saltar al contenido' });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('manifesto reveals words in reading order', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-manifesto]').scrollIntoViewIfNeeded();
  await page.locator('#ambiente').scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('[data-word][data-read]').count()).toBe(5);
});

for (const width of [390, 1440]) {
  test(`accessible page and menu at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(result.violations).toEqual([]);
    if (width === 390) {
      await page.getByRole('button', { name: 'Abrir menú' }).click();
      const menuResult = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(menuResult.violations).toEqual([]);
    }
  });
}

test('branded 404 returns to the landing', async ({ page }) => {
  const response = await page.goto('/una-pausa-perdida');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Este camino no lleva a una taza.' })).toBeVisible();
  await page.getByRole('link', { name: 'Volver a Bruma' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Un café. Un momento para ti.');
});
