/*
 * Шаблон email-подписи EuroDwell.
 * Один и тот же код используется и в build.js (Node), и в generator.html (браузер).
 *
 * Вёрстка — таблицами с inline-стилями: только так подпись одинаково
 * выглядит в Gmail, Outlook, Apple Mail и мобильных клиентах.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.EuroDwellSignature = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var RED = '#E52421';
  var TEXT = '#222222';
  var LINK = '#3B6FD6';
  var FONT = 'Arial, Helvetica, sans-serif';

  var DEFAULTS = {
    address: '307 W. Elizabeth Ave unit 3, Linden, NJ 07036',
    website: 'www.eurodwell.com',
    facebook: 'https://www.facebook.com/eurodwell',
    instagram: 'https://www.instagram.com/eurodwell',
  };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Относительные пути (assets/...) превращаются в абсолютные URL:
  // почтовые клиенты загружают картинки только по полному адресу.
  function asset(path, baseUrl) {
    if (!path) return '';
    if (/^(https?:|data:)/i.test(path)) return path;
    return (baseUrl || '').replace(/\/?$/, '/') + path.replace(/^\.?\//, '');
  }

  function withProtocol(url) {
    return /^https?:\/\//i.test(url) ? url : 'https://' + url;
  }

  function contactRow(icon, content, baseUrl) {
    return (
      '<tr>' +
      '<td width="30" valign="middle" style="padding:5px 0;width:30px;">' +
      '<img src="' + esc(asset('assets/icons/' + icon + '.png', baseUrl)) + '" width="20" height="20" alt="" style="display:block;border:0;width:20px;height:20px;">' +
      '</td>' +
      '<td valign="middle" style="padding:5px 0;font-family:' + FONT + ';font-size:14px;line-height:18px;color:' + TEXT + ';">' +
      content +
      '</td></tr>'
    );
  }

  function link(href, text) {
    return '<a href="' + esc(href) + '" target="_blank" style="color:' + LINK + ';text-decoration:underline;">' + esc(text) + '</a>';
  }

  function socialIcon(href, icon, alt, baseUrl) {
    return (
      '<a href="' + esc(href) + '" target="_blank" style="display:inline-block;text-decoration:none;margin-right:10px;">' +
      '<img src="' + esc(asset('assets/icons/' + icon + '.png', baseUrl)) + '" width="26" height="26" alt="' + alt + '" style="display:inline-block;border:0;width:26px;height:26px;vertical-align:middle;">' +
      '</a>'
    );
  }

  /**
   * @param {object} emp     данные сотрудника (см. employees.json)
   * @param {object} config  { assetsBaseUrl } — где лежат картинки
   * @returns {string} HTML подписи
   */
  function render(emp, config) {
    var e = {};
    Object.keys(DEFAULTS).forEach(function (k) { e[k] = DEFAULTS[k]; });
    // Не указанное поле берётся из DEFAULTS, пустая строка — скрывает строку.
    Object.keys(emp || {}).forEach(function (k) { if (emp[k] != null) e[k] = String(emp[k]).trim(); });
    var base = (config && config.assetsBaseUrl) || '';

    var rows = '';
    if (e.phone) {
      rows += contactRow('phone',
        '<a href="tel:' + esc(String(e.phone).replace(/[^\d+]/g, '')) + '" style="color:' + TEXT + ';text-decoration:none;">' + esc(e.phone) + '</a>',
        base);
    }
    if (e.address) {
      var mapUrl = e.addressUrl || 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(e.address);
      rows += contactRow('location', link(mapUrl, e.address), base);
    }
    if (e.website) {
      rows += contactRow('website', link(withProtocol(e.website), e.website), base);
    }

    var social = '';
    if (e.facebook) social += socialIcon(e.facebook, 'facebook', 'Facebook', base);
    if (e.instagram) social += socialIcon(e.instagram, 'instagram', 'Instagram', base);

    return (
      '<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;font-family:' + FONT + ';">' +
      '<tr>' +
      // Фото
      '<td valign="top" width="150" style="padding:0 22px 0 0;width:150px;">' +
      (e.photo
        ? '<img src="' + esc(asset(e.photo, base)) + '" width="150" height="150" alt="' + esc(e.name) + '" style="display:block;border:0;width:150px;height:150px;border-radius:50%;">'
        : '') +
      '</td>' +
      // Имя, должность, контакты
      '<td valign="top" style="padding:0;">' +
      '<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">' +
      '<tr><td style="font-family:' + FONT + ';font-size:24px;line-height:28px;font-weight:bold;color:' + TEXT + ';padding:2px 0 0 0;">' + esc(e.name) + '</td></tr>' +
      '<tr><td style="font-family:' + FONT + ';font-size:15px;line-height:20px;color:' + TEXT + ';padding:2px 0 12px 0;">' + esc(e.title) + '</td></tr>' +
      '<tr><td style="padding:0 0 8px 0;"><table cellpadding="0" cellspacing="0" border="0" role="presentation" width="100%" style="border-collapse:collapse;"><tr><td height="1" style="height:1px;line-height:1px;font-size:1px;background-color:' + RED + ';">&nbsp;</td></tr></table></td></tr>' +
      '<tr><td><table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">' + rows + '</table></td></tr>' +
      '</table>' +
      '</td>' +
      '</tr>' +
      // Логотип + соцсети
      '<tr>' +
      '<td valign="middle" style="padding:6px 22px 0 0;font-family:' + FONT + ';font-size:34px;line-height:38px;font-weight:bold;color:#000000;white-space:nowrap;letter-spacing:-0.5px;">' +
      '<a href="' + esc(withProtocol(e.website || DEFAULTS.website)) + '" target="_blank" style="color:#000000;text-decoration:none;"><span style="color:' + RED + ';">E</span>uroDwell</a>' +
      '</td>' +
      '<td valign="middle" style="padding:6px 0 0 0;">' + social + '</td>' +
      '</tr>' +
      '</table>'
    );
  }

  return { render: render, DEFAULTS: DEFAULTS };
});
