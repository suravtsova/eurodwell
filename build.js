#!/usr/bin/env node
/*
 * Генерирует готовые подписи для всех сотрудников из employees.json.
 *
 *   node build.js           — картинки по адресу config.assetsBaseUrl (для отправки писем)
 *   node build.js --local   — картинки из локальной папки (только для предпросмотра)
 *
 * Результат: dist/<id>.html — по файлу на сотрудника, dist/index.html — общий список.
 */
const fs = require('fs');
const path = require('path');
const { render } = require('./signature.js');

const local = process.argv.includes('--local');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'employees.json'), 'utf8'));
const config = { ...data.config, ...(local ? { assetsBaseUrl: '../' } : {}) };
const outDir = path.join(__dirname, 'dist');
fs.mkdirSync(outDir, { recursive: true });

const page = (title, body) => `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:24px;background:#ffffff;">
${body}
</body>
</html>
`;

const links = [];
for (const emp of data.employees) {
  if (!emp.id) throw new Error(`У сотрудника "${emp.name}" не указан id`);
  const html = render(emp, config);
  fs.writeFileSync(path.join(outDir, `${emp.id}.html`), page(`Signature — ${emp.name}`, html));
  fs.writeFileSync(path.join(outDir, `${emp.id}.snippet.html`), html + '\n');
  links.push(`<h3 style="font-family:Arial,sans-serif;"><a href="${emp.id}.html">${emp.name}</a></h3>${html}<hr style="margin:32px 0;">`);
  console.log(`✔ dist/${emp.id}.html`);
}
fs.writeFileSync(path.join(outDir, 'index.html'), page('EuroDwell signatures', links.join('\n')));
console.log('✔ dist/index.html');
