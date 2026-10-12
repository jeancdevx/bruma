import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('../docs/presentation/', import.meta.url));
const baseURL = process.env.BRUMA_BASE_URL ?? 'http://localhost:4321';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();

try {
  for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const firstImage = page.locator(name === 'desktop' ? '[data-story-frames] .visual-frame img' : '#llegar [data-scene-image] img').first();
    await firstImage.evaluate(image => image.decode());
    await page.screenshot({ path: `${output}/${name}.png` });

    if (name === 'desktop') {
      for (const [scene, index] of [['bar', '1'], ['table', '2']]) {
        await page.locator(`[data-route-index="${index}"]`).click();
        await page.evaluate(index => {
          const step = document.querySelectorAll('[data-story-step]')[Number(index)];
          const rect = step.getBoundingClientRect();
          window.scrollTo({ top: window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2, behavior: 'instant' });
        }, index);
        await page.waitForFunction(index => document.querySelector('[data-story]')?.getAttribute('data-story-active') === index, index);
        await page.locator('.visual-frame img').nth(Number(index)).evaluate(image => image.decode());
        await page.waitForFunction(() => document.getAnimations().every(animation => animation.playState !== 'running'));
        await page.screenshot({ path: `${output}/desktop-${scene}.png` });
      }
      // A full-page still presents all three images instead of flattening a sticky animation.
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForFunction(() => !document.querySelector('[data-story]')?.hasAttribute('data-enhanced'));
    }

    await page.locator('[data-manifesto]').scrollIntoViewIfNeeded();
    await page.locator('#ambiente').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const manifesto = document.querySelector('[data-manifesto]');
      return !manifesto?.hasAttribute('data-word-reveal') || manifesto.querySelectorAll('[data-read]').length === manifesto.querySelectorAll('[data-word]').length;
    });
    await page.evaluate(async () => {
      const images = [...document.images].filter(image => image.getClientRects().length);
      images.forEach(image => { image.loading = 'eager'; });
      await Promise.all(images.map(image => image.decode()));
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
    });
    await page.waitForFunction(() => document.getAnimations().every(animation => animation.playState !== 'running'));
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForFunction(() => document.getAnimations().every(animation => animation.playState !== 'running'));
    await page.screenshot({ path: `${output}/${name}-full.png`, fullPage: true });
    await page.close();
  }
  await writeFile(`${output}/captures.json`, JSON.stringify({
    baseURL,
    tool: 'Playwright Chromium',
    captures: {
      'desktop.png': '1440×900, normal motion, initial scene',
      'desktop-bar.png': '1440×900, normal motion, second scene',
      'desktop-table.png': '1440×900, normal motion, third scene',
      'desktop-full.png': '1440px, reduced motion to show the complete static storyboard',
      'mobile.png': '390×844, normal motion, initial view',
      'mobile-full.png': '390px, normal motion, complete page',
    },
  }, null, 2) + '\n');
  console.log(`Presentation captures saved in ${output}`);
} finally {
  await browser.close();
}
