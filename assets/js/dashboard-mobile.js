(function () {
    const sidebar = document.querySelector('.dashboard-sidebar, .admin-sidebar');
    const layout = document.querySelector('.dashboard-layout') || document.querySelector('.admin-main')?.parentElement;
    if (!sidebar || !layout || document.querySelector('[data-mobile-menu-toggle]')) return;

    const isAdmin = window.location.pathname.includes('/admin/');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const toggle = document.querySelector('.sidebar-toggle') || document.createElement('button');
    document.body.classList.toggle('has-admin-mobile-nav', isAdmin);

    toggle.type = 'button';
    toggle.classList.add('dashboard-mobile-toggle');
    toggle.setAttribute('data-mobile-menu-toggle', '');
    toggle.setAttribute('aria-label', 'Ouvrir le menu');
    toggle.setAttribute('aria-controls', sidebar.id || (isAdmin ? 'adminSidebar' : 'clientSidebar'));
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<i class="bi bi-list" aria-hidden="true"></i>';

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'dashboard-mobile-close';
    close.setAttribute('aria-label', 'Fermer le menu');
    close.innerHTML = '<i class="bi bi-x-lg" aria-hidden="true"></i>';

    const overlay = document.createElement('button');
    overlay.type = 'button';
    overlay.className = 'dashboard-mobile-overlay';
    overlay.setAttribute('aria-label', 'Fermer le menu');
    overlay.setAttribute('tabindex', '-1');

    const bottomNav = document.createElement('nav');
    bottomNav.className = 'dashboard-bottom-nav';
    bottomNav.setAttribute('aria-label', 'Navigation principale mobile');
    const items = isAdmin
        ? [
            ['index.html', 'Accueil', 'bi-house'],
            ['demandes.html', 'Demandes', 'bi-list-check'],
            ['clients.html', 'Clients', 'bi-people'],
            ['messages.html', 'Messages', 'bi-envelope']
        ]
        : [
            ['index.html', 'Accueil', 'bi-house'],
            ['invoices.html', 'Factures', 'bi-receipt'],
            ['payments.html', 'Paiements', 'bi-credit-card'],
            ['profile.html', 'Profil', 'bi-person']
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

    sidebar.id = sidebar.id || (isAdmin ? 'adminSidebar' : 'clientSidebar');
    toggle.setAttribute('aria-controls', sidebar.id);
    sidebar.insertBefore(close, sidebar.firstChild);
    if (!toggle.parentElement) layout.prepend(toggle);
    layout.append(overlay, bottomNav);

    const setOpen = (open, restoreFocus = false) => {
        sidebar.classList.toggle('open', open);
        sidebar.classList.toggle('active', open);
        overlay.classList.toggle('visible', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', 'Ouvrir le menu');
        toggle.setAttribute('aria-hidden', String(open));
        toggle.tabIndex = open ? -1 : 0;
        toggle.classList.toggle('is-hidden', open);
        toggle.innerHTML = '<i class="bi bi-list" aria-hidden="true"></i>';
        document.body.classList.toggle('menu-open', open);
        if (open) close.focus();
        else if (restoreFocus) toggle.focus();
    };

    toggle.addEventListener('click', () => setOpen(!sidebar.classList.contains('open')));
    more.addEventListener('click', () => setOpen(!sidebar.classList.contains('open')));
    close.addEventListener('click', () => setOpen(false, true));
    overlay.addEventListener('click', () => setOpen(false, true));
    sidebar.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && sidebar.classList.contains('open')) setOpen(false, true);
    });
})();
