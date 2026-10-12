import { test, expect } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`images are static WebP and load without runtime conversion at ${width}px`, async ({ page, context }) => {
    await page.setViewportSize({ width, height: 900 });
    const session = await context.newCDPSession(page);
    await session.send('Network.setCacheDisabled', { cacheDisabled: true });
    const transforms: string[] = [];
    page.on('request', request => {
      if (new URL(request.url()).pathname === '/_image') transforms.push(request.url());
    });
    await page.goto('/');
    await page.evaluate(async () => {
      for (const image of document.images) image.loading = 'eager';
      await Promise.all([...document.images].map(image => image.decode()));
    });
    const images = await page.locator('img').evaluateAll(elements => elements.map(element => ({
      url: (element as HTMLImageElement).currentSrc,
      width: (element as HTMLImageElement).naturalWidth,
    })));
    expect(images.length).toBeGreaterThanOrEqual(7);
    expect(images.every(image => new URL(image.url).pathname.startsWith('/images/') && image.url.endsWith('.webp'))).toBe(true);
    expect(images.every(image => image.width > 0 && image.width <= 1200)).toBe(true);
    expect(transforms).toEqual([]);
    const hero = page.locator(width < 1024 ? '#llegar [data-scene-image] img' : '[data-story-frames] img').first();
    expect(await hero.evaluate((image: HTMLImageElement) => image.currentSrc)).toMatch(width < 1024 ? /-400-[a-f0-9]{12}\.webp$/ : /-800-[a-f0-9]{12}\.webp$/);
  });
}

test('desktop crossfades have the following scenes loaded in advance', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-story]')).toHaveAttribute('data-enhanced', '');
  await expect.poll(() => page.locator('[data-story-frames] img').evaluateAll(images => images.every(image => {
    const element = image as HTMLImageElement;
    return element.loading === 'eager' && element.complete && element.naturalWidth > 0;
  }))).toBe(true);
  await expect(page.locator('[data-story-frames] img').nth(1)).toHaveAttribute('fetchpriority', 'low');
  await expect(page.locator('#carta img').first()).toHaveAttribute('loading', 'lazy');
});
