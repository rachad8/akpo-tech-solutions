(() => {
    const sidebar = document.querySelector('.dashboard-sidebar');
    const layout = document.querySelector('.dashboard-layout');
    if (!sidebar || !layout || document.querySelector('[data-mobile-menu-toggle]')) return;

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'dashboard-mobile-toggle';
    toggle.setAttribute('data-mobile-menu-toggle', '');
    toggle.setAttribute('aria-label', 'Ouvrir le menu');
    toggle.setAttribute('aria-controls', 'clientSidebar');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<i class="bi bi-list" aria-hidden="true"></i><span class="visually-hidden">Ouvrir le menu</span>';

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'dashboard-mobile-close';
    close.setAttribute('aria-label', 'Fermer le menu');
    close.innerHTML = '<i class="bi bi-x-lg" aria-hidden="true"></i><span class="visually-hidden">Fermer le menu</span>';

    const overlay = document.createElement('button');
    overlay.type = 'button';
    overlay.className = 'dashboard-mobile-overlay';
    overlay.setAttribute('aria-label', 'Fermer le menu');
    overlay.setAttribute('tabindex', '-1');

    const bottomNav = document.createElement('nav');
    bottomNav.className = 'dashboard-bottom-nav';
    bottomNav.setAttribute('aria-label', 'Navigation principale mobile');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const items = [
        ['index.html', 'Accueil', 'bi-house'],
        ['invoices.html', 'Factures', 'bi-receipt'],
        ['payments.html', 'Paiements', 'bi-credit-card'],
        ['support.html', 'Support', 'bi-headset']
    ];
    items.forEach(([href, label, icon]) => {
        const link = document.createElement('a');
        link.href = href;
        link.className = 'dashboard-bottom-link' + (currentPage === href ? ' active' : '');
        if (currentPage === href) link.setAttribute('aria-current', 'page');
        link.innerHTML = `<i class="bi ${icon}" aria-hidden="true"></i><span>${label}</span>`;
        bottomNav.appendChild(link);
    });
    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'dashboard-bottom-link dashboard-bottom-more';
    more.setAttribute('aria-label', 'Ouvrir le menu complet');
    more.innerHTML = '<i class="bi bi-grid" aria-hidden="true"></i><span>Plus</span>';
    bottomNav.appendChild(more);

    sidebar.id = sidebar.id || 'clientSidebar';
    sidebar.insertBefore(close, sidebar.firstChild);
    layout.append(toggle, overlay, bottomNav);

    const setOpen = (open) => {
        sidebar.classList.toggle('open', open);
        overlay.classList.toggle('visible', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
        toggle.innerHTML = open
            ? '<i class="bi bi-x-lg" aria-hidden="true"></i><span class="visually-hidden">Fermer le menu</span>'
            : '<i class="bi bi-list" aria-hidden="true"></i><span class="visually-hidden">Ouvrir le menu</span>';
        document.body.classList.toggle('menu-open', open);
        if (open) close.focus();
    };

    toggle.addEventListener('click', () => setOpen(!sidebar.classList.contains('open')));
    more.addEventListener('click', () => setOpen(!sidebar.classList.contains('open')));
    close.addEventListener('click', () => setOpen(false));
    overlay.addEventListener('click', () => setOpen(false));
    sidebar.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && sidebar.classList.contains('open')) setOpen(false);
    });
})();
