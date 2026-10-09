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
    // Только для современного варианта:
    tagline: '', // короткий слоган справа от логотипа, например 'European quality since 2010'
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
    path = path.replace(/^\.?\//, '');
    return baseUrl ? baseUrl.replace(/\/?$/, '/') + path : path;
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

  // Классический вариант — как в исходном макете.
  function renderClassic(e, base) {

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

  // ---------------------------------------------------------------------------
  // Современный вариант: компактнее, больше воздуха, акцентная полоса,
  // должность капсом с разрядкой и тёмные круглые соцсети.
  // ---------------------------------------------------------------------------
  var INK = '#1A1A1A';
  var MUTED = '#6B6B6B';
  var HAIR = '#E6E6E6';

  function modernContact(icon, content, base) {
    return (
      '<td valign="middle" style="padding:0 6px 0 0;">' +
      '<img src="' + esc(asset('assets/icons/' + icon + '.png', base)) + '" width="14" height="14" alt="" style="display:block;border:0;width:14px;height:14px;">' +
      '</td>' +
      '<td valign="middle" style="padding:0 16px 0 0;font-family:' + FONT + ';font-size:13px;line-height:18px;color:' + INK + ';white-space:nowrap;">' +
      content +
      '</td>'
    );
  }

  function plainLink(href, text, color) {
    return '<a href="' + esc(href) + '" target="_blank" style="color:' + (color || INK) + ';text-decoration:none;">' + esc(text) + '</a>';
  }

  function contactLine(cells, isLast) {
    return cells
      ? '<tr><td style="padding:0 0 ' + (isLast ? 0 : 6) + 'px 0;"><table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;"><tr>' + cells + '</tr></table></td></tr>'
      : '';
  }

  function renderModern(e, base) {
    var site = e.website ? withProtocol(e.website) : '';

    var line1 = '';
    if (e.phone) {
      line1 += modernContact('phone', plainLink('tel:' + String(e.phone).replace(/[^\d+]/g, ''), e.phone), base);
    }
    if (e.website) {
      line1 += modernContact('website', plainLink(site, e.website.replace(/^https?:\/\//i, '').replace(/^www\./i, '')), base);
    }
    var line2 = '';
    if (e.address) {
      var mapUrl = e.addressUrl || 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(e.address);
      line2 += modernContact('location', plainLink(mapUrl, e.address, MUTED), base);
    }

    var social = '';
    if (e.facebook) social += socialRound(e.facebook, 'facebook-round', 'Facebook', base);
    if (e.instagram) social += socialRound(e.instagram, 'instagram-round', 'Instagram', base);

    return (
      '<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;font-family:' + FONT + ';">' +
      '<tr>' +
      // Фото
      (e.photo
        ? '<td valign="middle" width="112" style="padding:0 20px 0 0;width:112px;">' +
          '<img src="' + esc(asset(e.photo, base)) + '" width="112" height="112" alt="' + esc(e.name) + '" style="display:block;border:0;width:112px;height:112px;border-radius:50%;">' +
          '</td>'
        : '') +
      // Акцентная полоса
      '<td width="3" bgcolor="' + RED + '" style="width:3px;background-color:' + RED + ';font-size:1px;line-height:1px;">&nbsp;</td>' +
      // Текст
      '<td valign="middle" style="padding:0 0 0 20px;">' +
      '<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">' +
      '<tr><td style="font-family:' + FONT + ';font-size:22px;line-height:26px;font-weight:bold;color:' + INK + ';letter-spacing:-0.3px;">' + esc(e.name) + '</td></tr>' +
      '<tr><td style="font-family:' + FONT + ';font-size:11px;line-height:16px;font-weight:bold;color:' + RED + ';letter-spacing:1.6px;text-transform:uppercase;padding:4px 0 14px 0;">' + esc(e.title).toUpperCase() + '</td></tr>' +
      contactLine(line1, !line2) +
      contactLine(line2, true) +
      '</table>' +
      '</td>' +
      '</tr>' +
      // Нижняя строка: тонкая линия, логотип, слоган и соцсети
      '<tr><td colspan="3" style="padding:18px 0 0 0;">' +
      '<table cellpadding="0" cellspacing="0" border="0" role="presentation" width="100%" style="border-collapse:collapse;border-top:1px solid ' + HAIR + ';"><tr>' +
      '<td valign="middle" style="padding:12px 0 0 0;font-family:' + FONT + ';font-size:20px;line-height:22px;font-weight:bold;color:' + INK + ';white-space:nowrap;letter-spacing:-0.3px;">' +
      '<a href="' + esc(site || withProtocol(DEFAULTS.website)) + '" target="_blank" style="color:' + INK + ';text-decoration:none;"><span style="color:' + RED + ';">E</span>uroDwell</a>' +
      '</td>' +
      (e.tagline
        ? '<td valign="middle" style="padding:12px 0 0 14px;font-family:' + FONT + ';font-size:11px;line-height:14px;color:' + MUTED + ';letter-spacing:0.4px;white-space:nowrap;">' + esc(e.tagline) + '</td>'
        : '') +
      '<td valign="middle" align="right" style="padding:12px 0 0 16px;white-space:nowrap;">' + social + '</td>' +
      '</tr></table>' +
      '</td></tr>' +
      '</table>'
    );
  }

  function socialRound(href, icon, alt, base) {
    return (
      '<a href="' + esc(href) + '" target="_blank" style="display:inline-block;text-decoration:none;margin-left:6px;">' +
      '<img src="' + esc(asset('assets/icons/' + icon + '.png', base)) + '" width="28" height="28" alt="' + alt + '" style="display:inline-block;border:0;width:28px;height:28px;vertical-align:middle;">' +
      '</a>'
    );
  }

  var VARIANTS = { classic: renderClassic, modern: renderModern };

  /**
   * @param {object} emp     данные сотрудника (см. employees.json)
   * @param {object} config  { assetsBaseUrl, variant: 'classic' | 'modern' }
   * @returns {string} HTML подписи
   */
  function render(emp, config) {
    var e = {};
    Object.keys(DEFAULTS).forEach(function (k) { e[k] = DEFAULTS[k]; });
    // Не указанное поле берётся из DEFAULTS, пустая строка — скрывает строку.
    Object.keys(emp || {}).forEach(function (k) { if (emp[k] != null) e[k] = String(emp[k]).trim(); });
    var variant = VARIANTS[(config && config.variant) || 'classic'] || renderClassic;
    return variant(e, (config && config.assetsBaseUrl) || '');
  }

  return { render: render, DEFAULTS: DEFAULTS, VARIANTS: Object.keys(VARIANTS) };
});
