/* Geräteansicht für Entwickler – nur auf der Testseite (vor dem Livegang entfernen).
   Blendet oben im Header einen kleinen Schalter „Desktop · Tablet · Smartphone“ ein.
   Tablet/Smartphone öffnen geraete.html, die die aktuelle Seite in Gerätebreite zeigt. */
(() => {
  if (/(^|\.)aktivertierschutz\.at$/.test(location.hostname)) return;   // nie auf der echten Seite
  if (window.top !== window) return;                                     // nicht in der Geräteansicht selbst
  const wrap = document.querySelector('.site-header .wrap');
  if (!wrap) return;

  const st = document.createElement('style');
  st.textContent = `
    .geraete { position: absolute; left: 50%; top: 50%; translate: -50% -50%; display: flex; gap: 2px; padding: 3px;
      border-radius: 99px; background: rgba(255,255,255,.1); font: 700 12px/1 system-ui, sans-serif; }
    .geraete a { display: inline-flex; align-items: center; gap: 5px; padding: 6px 10px; border-radius: 99px;
      color: rgba(255,255,255,.75); text-decoration: none; white-space: nowrap; }
    .geraete a:hover { color: #fff; background: rgba(255,255,255,.12); }
    .geraete a[aria-current="true"] { background: #fff; color: #13492a; }
    .geraete svg { width: 14px; height: 14px; }
    @media (max-width: 899px) { .geraete { display: none; } }`;
  document.head.appendChild(st);

  const seite = (location.pathname.split('/').pop() || 'index.html') + location.search;
  const icon = {
    desktop: '<path d="M3 5h18v11H3zM9 20h6M12 16v4"/>',
    tablet: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M11 18h2"/>',
    phone: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>',
  };
  const svg = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon[k]}</svg>`;
  const ziel = g => `geraete.html?g=${g}&s=${encodeURIComponent(seite)}`;

  const nav = document.createElement('nav');
  nav.className = 'geraete';
  nav.setAttribute('aria-label', 'Geräteansicht (nur Testseite)');
  nav.innerHTML = `<a href="#" aria-current="true">${svg('desktop')}Desktop</a>`
    + `<a href="${ziel('tablet')}">${svg('tablet')}Tablet</a>`
    + `<a href="${ziel('phone')}">${svg('phone')}Smartphone</a>`;
  nav.firstElementChild.addEventListener('click', e => e.preventDefault());
  wrap.style.position = 'relative';
  wrap.appendChild(nav);
})();
