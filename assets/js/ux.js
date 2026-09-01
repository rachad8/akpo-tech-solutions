/* AKPO TECH SOLUTIONS — Couche UX/animations globale (refonte 2026).
   Chargée automatiquement par main.js et session-guard.js sur toutes les pages.
   Aucune logique métier, aucun appel Firebase : uniquement présentation. */
(function () {
    'use strict';
    if (window.__akpoUxLoaded) return;
    window.__akpoUxLoaded = true;


    /* ---------- 0. Chargement de la feuille de style de refonte ---------- */
    (function injectStyles() {
        var current = document.currentScript || (function () {
            var all = document.getElementsByTagName('script');
            return all[all.length - 1];
        })();
        var base = (current && current.src) ? current.src.replace(/js\/ux\.js.*$/, 'css/refonte-2026.css') : 'assets/css/refonte-2026.css';
        if (document.querySelector('link[data-akpo-refonte]')) return;
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = base;
        link.setAttribute('data-akpo-refonte', '');
        document.head.appendChild(link);
    })();

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = function () { return window.innerWidth < 768; };

    function ready(fn) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
        else fn();
    }

    /* ---------- 1. Révélation au scroll (progressive, sans casser le HTML) ---------- */
    function setupReveal() {
        if (reduced || !('IntersectionObserver' in window)) return;

        var selectors = [
            '.section-header', '.section-title', '.section-description',
            '.card', '.service-gallery-card', '.project-card', '.testimonial-card',
            '.faq-item', '.stat-item', '.footer-col', '.about-portrait',
            '.dash-card', '.stats-card', '.table-responsive', 'form .form-group'
        ];
        var nodes = [];
        selectors.forEach(function (sel) {
            Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) {
                if (el.closest('.chatbot-window') || el.hasAttribute('data-animate')) return;
                if (nodes.indexOf(el) === -1) nodes.push(el);
            });
        });

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-in');
                io.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

        nodes.forEach(function (el, i) {
            el.classList.add('akpo-reveal');
            el.style.setProperty('--akpo-delay', ((i % 6) * 70) + 'ms');
            io.observe(el);
        });

        /* Rétro-compatibilité avec l'ancien attribut data-animate */
        var legacy = document.querySelectorAll('[data-animate]:not(.animated)');
        if (legacy.length) {
            var io2 = new IntersectionObserver(function (entries) {
                entries.forEach(function (e) {
                    if (e.isIntersecting) { e.target.classList.add('animated'); io2.unobserve(e.target); }
                });
            }, { threshold: 0.1 });
            Array.prototype.forEach.call(legacy, function (el) { io2.observe(el); });
        }
    }

    /* ---------- 2. Entrée de page (transition douce) ---------- */
    function setupPageEnter() {
        document.documentElement.classList.add('akpo-page-enter');
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                document.documentElement.classList.add('akpo-page-ready');
            });
        });
    }

    /* ---------- 3. Barre de navigation : état au scroll ---------- */
    function setupNavbar() {
        var navbar = document.querySelector('.navbar');
        if (!navbar) return;
        navbar.classList.add('akpo-nav');
        var last = 0;
        var onScroll = function () {
            var y = window.scrollY;
            navbar.classList.toggle('scrolled', y > 24);
            if (isMobile()) navbar.classList.toggle('nav-hidden', y > last && y > 160);
            last = y;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---------- 4. Compteurs animés ---------- */
    function setupCounters() {
        var els = document.querySelectorAll('.stat-number, .counter');
        if (!els.length || !('IntersectionObserver' in window)) return;
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                io.unobserve(el);
                var raw = (el.textContent || '').trim();
                var match = raw.match(/([\d\s.,]+)/);
                if (!match) return;
                var target = parseFloat(match[1].replace(/[\s,]/g, ''));
                if (!isFinite(target) || target <= 0) return;
                if (reduced) return;
                var suffix = raw.slice(match.index + match[1].length);
                var prefix = raw.slice(0, match.index);
                var start = performance.now(), dur = 1200;
                var step = function (now) {
                    var p = Math.min((now - start) / dur, 1);
                    var eased = 1 - Math.pow(1 - p, 3);
                    el.textContent = prefix + Math.round(target * eased).toLocaleString('fr-FR') + suffix;
                    if (p < 1) requestAnimationFrame(step);
                };
                el.textContent = prefix + '0' + suffix;
                requestAnimationFrame(step);
            });
        }, { threshold: 0.4 });
        Array.prototype.forEach.call(els, function (el) { io.observe(el); });
    }

    /* ---------- 5. Effet tactile (ripple) sur boutons et liens d'action ---------- */
    function setupRipple() {
        if (reduced) return;
        document.addEventListener('pointerdown', function (e) {
            var btn = e.target.closest('.btn, .akpo-tabbar a, .dash-nav a');
            if (!btn || btn.dataset.noRipple) return;
            var rect = btn.getBoundingClientRect();
            var span = document.createElement('span');
            span.className = 'akpo-ripple';
            span.style.left = (e.clientX - rect.left) + 'px';
            span.style.top = (e.clientY - rect.top) + 'px';
            btn.appendChild(span);
            setTimeout(function () { span.remove(); }, 620);
        }, { passive: true });
    }

    /* ---------- 6. Barre d'onglets mobile façon application ---------- */
    var TABS = [
        { label: 'Accueil', icon: 'bi-house-door', href: 'index.html', match: ['index.html', '/'] },
        { label: 'Services', icon: 'bi-tools', href: 'pages/services.html', match: ['services.html'] },
        { label: 'Projets', icon: 'bi-collection', href: 'pages/projects.html', match: ['projects.html'] },
        { label: 'Contact', icon: 'bi-chat-dots', href: 'pages/contact.html', match: ['contact.html'] },
        { label: 'Compte', icon: 'bi-person-circle', href: 'auth/login.html', match: ['login.html', 'register.html', 'client/', 'admin/'] }
    ];

    function rootPrefix() {
        var path = window.location.pathname;
        var depth = 0;
        ['/pages/', '/auth/', '/client/', '/admin/'].forEach(function (seg) {
            if (path.indexOf(seg) !== -1) depth = 1;
        });
        return depth ? '../' : '';
    }

    function setupTabBar() {
        if (document.querySelector('.akpo-tabbar')) return;
        var path = window.location.pathname;
        var prefix = rootPrefix();
        var nav = document.createElement('nav');
        nav.className = 'akpo-tabbar';
        nav.setAttribute('aria-label', 'Navigation principale mobile');

        TABS.forEach(function (tab) {
            var active = tab.match.some(function (m) {
                return m === '/' ? (path === '/' || /\/index\.html$/.test(path) && path.split('/').length <= 2) : path.indexOf(m) !== -1;
            });
            var a = document.createElement('a');
            a.href = prefix + tab.href;
            a.className = 'akpo-tab' + (active ? ' is-active' : '');
            if (active) a.setAttribute('aria-current', 'page');
            a.innerHTML = '<i class="bi ' + tab.icon + '" aria-hidden="true"></i><span>' + tab.label + '</span>';
            nav.appendChild(a);
        });

        document.body.appendChild(nav);
        document.body.classList.add('has-akpo-tabbar');
    }

    /* ---------- 7. Dégradé réactif du héros (parallaxe légère) ---------- */
    function setupHeroMotion() {
        if (reduced) return;
        var hero = document.querySelector('.hero, .page-hero');
        if (!hero) return;
        hero.classList.add('akpo-hero');
        window.addEventListener('scroll', function () {
            var y = Math.min(window.scrollY, 400);
            hero.style.setProperty('--akpo-parallax', (y * 0.18) + 'px');
        }, { passive: true });
    }

    ready(function () {
        setupPageEnter();
        setupNavbar();
        setupReveal();
        setupCounters();
        setupRipple();
        setupHeroMotion();
        setupTabBar();
    });
})();
