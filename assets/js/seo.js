

document.addEventListener('DOMContentLoaded', function() {

    initLazyLoading();

    injectSchemaMarkup();

    measurePerformance();

    initAccessibility();

});

function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {

        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    } else {

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.getAttribute('data-src')) {
                        img.src = img.getAttribute('data-src');
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });

        document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
    }
}

function injectSchemaMarkup() {

    const orgSchema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        'name': 'AKPO TECH SOLUTIONS',
        'description': 'Maintenance et dépannage informatique. Installation Windows, réparation PC, réseau, sécurité.',
        'url': window.location.origin,
        'telephone': '+2290190182549',
        'email': 'contactstechsolutionsakpo@gmail.com',
        'address': {
            '@type': 'PostalAddress',
            'streetAddress': 'Calavi Zopah',
            'addressLocality': 'Calavi',
            'addressCountry': 'BJ'
        },
        'openingHours': 'Mo-Sa 08:00-19:00',
        'priceRange': '5000-50000 FCFA'
    };
    injectJSONLD(orgSchema);

    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) {
        const items = [];
        const links = breadcrumb.querySelectorAll('a');
        links.forEach((link, index) => {
            items.push({
                '@type': 'ListItem',
                'position': index + 1,
                'name': link.textContent.trim(),
                'item': link.href
            });
        });
        items.push({
            '@type': 'ListItem',
            'position': items.length + 1,
            'name': document.title.split('|')[0].trim(),
            'item': window.location.href
        });

        injectJSONLD({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': items
        });
    }
}

function injectJSONLD(data) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
}

function measurePerformance() {
    window.addEventListener('load', function() {
        setTimeout(function() {
            if (window.performance && window.performance.timing) {
                const timing = window.performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
                console.log('Performance : Chargement ' + loadTime + 'ms | DOM prêt ' + domReady + 'ms');

                if (typeof gtag !== 'undefined') {
                    gtag('event', 'timing_complete', {
                        name: 'load',
                        value: loadTime,
                        event_category: 'Performance'
                    });
                }
            }
        }, 0);
    });
}

function initAccessibility() {

    document.querySelectorAll('button:not([aria-label])').forEach(btn => {
        const text = btn.textContent.trim();
        if (text) btn.setAttribute('aria-label', text);
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {

            document.querySelectorAll('.modal-backdrop-admin.active, .modal.show').forEach(m => {
                m.classList.remove('active', 'show');
            });
        }
    });

    if (!document.querySelector('.skip-link')) {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Aller au contenu principal';
        skipLink.style.cssText = 'position:absolute;top:-100px;left:0;background:#3B82F6;color:white;padding:8px 16px;z-index:9999;text-decoration:none;border-radius:0 0 8px 0;';
        skipLink.addEventListener('focus', function() { this.style.top = '0'; });
        skipLink.addEventListener('blur', function() { this.style.top = '-100px'; });
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
}