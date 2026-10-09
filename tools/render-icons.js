// Рендерит SVG-иконки в PNG (64×64, прозрачный фон) в assets/icons/.
// Запуск: node tools/render-icons.js  (нужен playwright)
const path = require('path');
const { chromium } = require('playwright');
const icons = require('./icons.svg.js');

const SIZE = 64;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: SIZE, height: SIZE } });
  for (const [name, svg] of Object.entries(icons)) {
    await page.setContent(
      `<html><body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${SIZE}" height="${SIZE}" `)}</body></html>`
    );
    const out = path.join(__dirname, '..', 'assets', 'icons', `${name}.png`);
    await page.locator('svg').screenshot({ path: out, omitBackground: true });
    console.log('✔', out);
  }
  await browser.close();
})();
