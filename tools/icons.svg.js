// SVG-исходники иконок подписи. PNG-версии генерирует tools/render-icons.js
// (почтовые клиенты, в т.ч. Gmail и Outlook, не показывают SVG в письмах).
const RED = '#E52421';
const BLACK = '#000000';
const DARK = '#1F1F1F';

module.exports = {
  phone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="${RED}" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`,
  location: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="${RED}" fill-rule="evenodd" d="M12 1.5C7.86 1.5 4.5 4.86 4.5 9c0 5.62 7.5 13.5 7.5 13.5S19.5 14.62 19.5 9c0-4.14-3.36-7.5-7.5-7.5zm0 10.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>`,
  website: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${RED}" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4.6" ry="10"/><path d="M12 2v20M2 12h20M3.4 7h17.2M3.4 17h17.2"/></svg>`,
  facebook: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><clipPath id="c"><circle cx="12" cy="12" r="11.5"/></clipPath></defs><g clip-path="url(#c)"><circle cx="12" cy="12" r="11.5" fill="${BLACK}"/><path fill="#fff" d="M13.6 24v-8.6h2.85l.43-3.35H13.6V9.92c0-.97.27-1.63 1.66-1.63H17V5.3c-.3-.04-1.34-.13-2.55-.13-2.53 0-4.26 1.54-4.26 4.37v2.48H7.33v3.35h2.86V24z"/></g></svg>`,
  instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${BLACK}"><rect x="1.6" y="1.6" width="20.8" height="20.8" rx="6" stroke-width="2.6"/><circle cx="12" cy="12" r="5" stroke-width="2.6"/><circle cx="18" cy="6" r="1.5" fill="${BLACK}" stroke="none"/></svg>`,
  // Для современного варианта: белый знак в тёмном круге.
  'facebook-round': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="${DARK}"/><path fill="#fff" d="M13.1 19v-6.2h2.08l.31-2.42H13.1V8.84c0-.7.2-1.18 1.2-1.18h1.28V5.5a17 17 0 0 0-1.86-.1c-1.84 0-3.1 1.12-3.1 3.18v1.79H8.54v2.42h2.08V19z"/></svg>`,
  'instagram-round': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="${DARK}"/><g fill="none" stroke="#fff" stroke-width="1.6"><rect x="6.5" y="6.5" width="11" height="11" rx="3.3"/><circle cx="12" cy="12" r="2.7"/></g><circle cx="15.1" cy="8.9" r=".85" fill="#fff"/></svg>`,
};
