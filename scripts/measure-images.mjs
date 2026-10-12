import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const baseURL = process.env.BRUMA_BASE_URL ?? 'http://localhost:4321';
const output = fileURLToPath(new URL('../docs/design/image-performance.json', import.meta.url));
const browser = await chromium.launch();
const results = [];
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const session = await page.context().newCDPSession(page);
    await session.send('Network.setCacheDisabled', { cacheDisabled: true });
    const started = performance.now();
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    await page.locator(width < 1024 ? '#llegar [data-scene-image] img' : '[data-story-frames] img').first().evaluate(image => image.decode());
    const heroDecodedMs = Math.round(performance.now() - started);
    await page.evaluate(async () => {
      for (const image of document.images) image.loading = 'eager';
      await Promise.all([...document.images].map(image => image.decode()));
    });
    const resources = await page.evaluate(() => performance.getEntriesByType('resource')
      .filter(entry => entry.initiatorType === 'img')
      .map(entry => ({ path: new URL(entry.name).pathname, durationMs: Math.round(entry.duration), ttfbMs: Math.round(entry.responseStart - entry.startTime), bytes: entry.transferSize })));
    results.push({ width, heroDecodedMs, meanImageRequestMs: Math.round(resources.reduce((sum, entry) => sum + entry.durationMs, 0) / resources.length), resources });
    await page.close();
  }
  const report = {
    context: 'Local Chromium, browser HTTP cache disabled, unthrottled loopback network. Not a production/mobile-network SLA.',
    baseURL,
    baseline: {
      source: 'Measured on the original Astro dev server before this change, 1440px viewport, PNG-to-AVIF on demand.',
      heroDecodedMs: 4932,
      meanImageRequestMs: 7094,
      requestDurationsMs: { facade: 4855, bar: 4938, table: 4295, flatWhite: 5537, filter: 10097, croissant: 10554, interior: 9381 },
    },
    optimized: results,
  };
  await writeFile(output, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(results.map(({ width, heroDecodedMs, meanImageRequestMs }) => ({ width, heroDecodedMs, meanImageRequestMs })), null, 2));
} finally {
  await browser.close();
}
