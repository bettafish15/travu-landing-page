// Screenshot sections of the landing page for visual diff against design-refs/.
// Usage:
//   node screenshot.mjs --section "#hero"        one section (any CSS selector)
//   node screenshot.mjs --all                    every section[id]
//   node screenshot.mjs --full                   full-page shot
//   node screenshot.mjs --mobile --section ...   390x844 viewport instead of 1920x1080
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? null : (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true);
};

const mobile = !!opt('mobile');
const viewport = mobile ? { width: 390, height: 844 } : { width: 1920, height: 1080 };
const outDir = new URL('./shots/', import.meta.url).pathname;
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport });
await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);

const slug = (s) => s.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') + (mobile ? '-mobile' : '');

if (opt('full')) {
  await page.screenshot({ path: `${outDir}page${mobile ? '-mobile' : ''}.png`, fullPage: true });
  console.log(`page${mobile ? '-mobile' : ''}.png`);
} else if (opt('all')) {
  for (const id of await page.$$eval('section[id]', (els) => els.map((e) => e.id))) {
    await page.locator(`#${id}`).screenshot({ path: `${outDir}${slug(id)}.png` });
    console.log(`${slug(id)}.png`);
  }
} else {
  const sel = opt('section');
  if (!sel || sel === true) { console.error('need --section <selector>, --all, or --full'); process.exit(1); }
  await page.locator(sel).screenshot({ path: `${outDir}${slug(sel)}.png` });
  console.log(`${slug(sel)}.png`);
}

await browser.close();
