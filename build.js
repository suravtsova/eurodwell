#!/usr/bin/env node
/*
 * Собирает сайт с подписями в папку dist/ (его публикует GitHub Pages).
 *
 *   python3 tools/round-photos.py   — сначала обрезать фото из photos/ в круг
 *   node build.js                   — картинки по адресу config.assetsBaseUrl (для писем)
 *   node build.js --local           — картинки из самой папки dist (для предпросмотра)
 *
 * Стиль задаётся в employees.json: config.variant ("modern" или "classic"),
 * при необходимости — отдельно для сотрудника полем "variant".
 *
 * Результат:
 *   dist/index.html       — все подписи с кнопками «Скопировать»
 *   dist/<id>.html        — подпись одного сотрудника
 *   dist/generator.html   — конструктор для разовых подписей
 *   dist/assets/…         — иконки и круглые фото
 */
const fs = require('fs');
const path = require('path');
const { render } = require('./signature.js');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'dist');
const local = process.argv.includes('--local');

let data;
try {
  data = JSON.parse(fs.readFileSync(path.join(ROOT, 'employees.json'), 'utf8'));
} catch (err) {
  console.error('Ошибка в employees.json — проверьте запятые и кавычки:\n' + err.message);
  process.exit(1);
}
const config = { ...data.config, ...(local ? { assetsBaseUrl: '' } : {}) };

fs.mkdirSync(OUT, { recursive: true });
fs.cpSync(path.join(ROOT, 'assets', 'icons'), path.join(OUT, 'assets', 'icons'), { recursive: true });
for (const f of ['signature.js', 'generator.html']) fs.copyFileSync(path.join(ROOT, f), path.join(OUT, f));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Фото: явная ссылка из employees.json или круглое фото, сделанное из photos/<id>.*
function photoFor(emp) {
  if (emp.photo) return emp.photo;
  const p = `assets/photos/${emp.id}.png`;
  if (fs.existsSync(path.join(OUT, p))) return p;
  console.warn(`⚠ Нет фото для "${emp.id}": загрузите photos/${emp.id}.jpg`);
  return '';
}

const COPY_SCRIPT = `
<script>
  function toast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg; t.className = 'show';
    setTimeout(function () { t.className = ''; }, 2500);
  }
  function selectAndCopy(el) {
    var r = document.createRange(); r.selectNodeContents(el);
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    document.execCommand('copy'); s.removeAllRanges();
  }
  document.addEventListener('click', function (ev) {
    var btn = ev.target.closest('[data-copy]');
    if (!btn) return;
    var sig = document.getElementById(btn.getAttribute('data-target'));
    var html = sig.innerHTML;
    if (btn.getAttribute('data-copy') === 'html') {
      navigator.clipboard.writeText(html).then(function () { toast('HTML-код скопирован'); });
      return;
    }
    if (navigator.clipboard && window.ClipboardItem) {
      navigator.clipboard.write([new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([sig.innerText], { type: 'text/plain' })
      })]).then(function () { toast('Подпись скопирована — вставьте её в настройки почты'); },
                function () { selectAndCopy(sig); toast('Подпись скопирована'); });
    } else { selectAndCopy(sig); toast('Подпись скопирована'); }
  });
</script>`;

const page = (title, body) => `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(title)}</title>
<style>
  body { margin: 0; background: #f4f4f4; font-family: Arial, Helvetica, sans-serif; color: #222; }
  header { background: #fff; border-bottom: 3px solid #E52421; padding: 16px 24px; }
  header h1 { margin: 0; font-size: 20px; } header h1 span { color: #E52421; }
  main { max-width: 900px; margin: 0 auto; padding: 24px 16px; }
  .card { background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
  .card h2 { margin: 0 0 16px; font-size: 16px; }
  .sig { padding: 16px; border: 1px dashed #ddd; border-radius: 6px; overflow-x: auto; background: #fff; }
  .row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
  button, .btn { cursor: pointer; border: 1px solid #E52421; background: #E52421; color: #fff; padding: 9px 14px; border-radius: 6px; font-size: 14px; text-decoration: none; }
  .secondary { background: #fff; color: #E52421; }
  ol { font-size: 14px; line-height: 1.6; padding-left: 18px; }
  #toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: #222; color: #fff; padding: 10px 16px; border-radius: 6px; opacity: 0; transition: opacity .2s; pointer-events: none; }
  #toast.show { opacity: 1; }
</style>
</head>
<body>
<header><h1><span>E</span>uroDwell — email-подписи</h1></header>
<main>
${body}
</main>
<div id="toast"></div>
${COPY_SCRIPT}
</body>
</html>
`;

const card = (emp, html) => `
<section class="card">
  <h2>${esc(emp.name)}</h2>
  <div class="sig" id="sig-${esc(emp.id)}">${html}</div>
  <div class="row">
    <button type="button" data-copy="rich" data-target="sig-${esc(emp.id)}">Скопировать подпись</button>
    <button type="button" class="secondary" data-copy="html" data-target="sig-${esc(emp.id)}">Скопировать HTML-код</button>
    <a class="btn secondary" href="${esc(emp.id)}.html">Отдельная страница</a>
  </div>
</section>`;

const HOWTO = `
<section class="card">
  <h2>Как установить подпись</h2>
  <ol>
    <li><b>Gmail:</b> «Скопировать подпись» → в Gmail ⚙ → «Все настройки» → вкладка «Общие» → «Подпись» → «Создать» → вставить (Ctrl+V / Cmd+V) → внизу «Сохранить изменения».</li>
    <li><b>Outlook (веб и новый Outlook):</b> ⚙ → «Учётные записи» → «Подписи» → «Новая подпись» → вставить → «Сохранить». Выберите её как подпись по умолчанию.</li>
    <li><b>Apple Mail:</b> откройте «Отдельную страницу» в Safari → Cmd+A, Cmd+C → Mail → Настройки → «Подписи» → «+» → вставить. Снимите галочку «Всегда использовать мой шрифт по умолчанию».</li>
    <li><b>Сервис рассылок</b> (Mailchimp, Brevo, SendPulse…): «Скопировать HTML-код» → вставить в HTML-блок в конце шаблона письма.</li>
  </ol>
  <p style="font-size:13px;color:#666;">Нужна разовая подпись для человека не из списка? <a href="generator.html">Откройте конструктор</a>.</p>
</section>`;

const cards = [];
const ids = new Set();
for (const emp of data.employees) {
  if (!emp.id || !/^[a-z0-9-]+$/.test(emp.id)) {
    console.error(`Ошибка: у сотрудника "${emp.name}" поле id должно состоять из латинских букв, цифр и дефисов`);
    process.exit(1);
  }
  if (ids.has(emp.id)) {
    console.error(`Ошибка: id "${emp.id}" встречается дважды`);
    process.exit(1);
  }
  ids.add(emp.id);
  const html = render({ ...emp, photo: photoFor(emp) }, { ...config, variant: emp.variant || config.variant });
  fs.writeFileSync(path.join(OUT, `${emp.id}.html`), page(`Подпись — ${emp.name}`, card(emp, html) + HOWTO));
  fs.writeFileSync(path.join(OUT, `${emp.id}.snippet.html`), html + '\n');
  cards.push(card(emp, html));
  console.log(`✔ dist/${emp.id}.html`);
}
fs.writeFileSync(path.join(OUT, 'index.html'), page('EuroDwell — email-подписи', cards.join('\n') + HOWTO));
console.log('✔ dist/index.html');
