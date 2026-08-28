(function (global) {
    'use strict';

    const serviceImages = [
        '../assets/images/services/support-informatique.jpg',
        '../assets/images/projects/atelier-reparation.jpg',
        '../assets/images/services/securite-donnees.jpg',
        '../assets/images/services/reseau-professionnel.jpg',
        '../assets/images/services/maintenance-serveurs.jpg'
    ];
    const projectImages = [
        '../assets/images/projects/installation-reseau.jpg',
        '../assets/images/projects/maintenance-reseau.jpg',
        '../assets/images/services/securite-donnees.jpg',
        '../assets/images/projects/atelier-reparation.jpg'
    ];

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>'"]/g, function (char) {
            return {'&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;'}[char];
        });
    }

    function resolveImage(source, fallback) {
        const value = String(source || '').trim();
        if (!value) return fallback;
        if (/^(https?:|data:|blob:|\/)/i.test(value)) return value;
        const normalized = value.startsWith('assets/') ? `../${value}` : value;
        try {
            return new URL(normalized, document.baseURI).pathname;
        } catch (error) {
            return fallback;
        }
    }

    function formatTimestamp(value) {
        if (!value) return '';
        const date = value.toDate ? value.toDate() : new Date(value);
        return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('fr-FR');
    }

    function readCollection(collection) {
        return collection.orderBy('date', 'desc').get().catch(function () {
            return collection.get();
        });
    }

    function renderService(grid, item, index) {
        const title = item.nom || item.name || 'Service informatique';
        const description = item.description || 'Une solution adaptée à vos besoins informatiques.';
        const category = item.categorie || item.category || 'Professionnel';
        const image = resolveImage(item.image, serviceImages[index % serviceImages.length]);
        const date = formatTimestamp(item.date || item.createdAt);
        grid.insertAdjacentHTML('beforeend', `<div class="col-md-4"><article class="card h-100 service-card-dynamic"><img class="service-card-image" src="${escapeHtml(image)}" alt="${escapeHtml(title)}" loading="lazy"><div class="service-card-content"><h4>${escapeHtml(title)}</h4><p class="card-text">${escapeHtml(description)}</p><div class="d-flex justify-content-between align-items-center gap-2 flex-wrap"><span class="badge bg-primary-subtle text-primary">${escapeHtml(category)}</span>${date ? `<small class="text-muted">${escapeHtml(date)}</small>` : ''}</div></div></article></div>`);
    }

    function renderProject(grid, item, index) {
        const title = item.nom || item.name || 'Projet informatique';
        const description = item.description || 'Réalisation informatique effectuée par AKPO TECH SOLUTIONS.';
        const client = item.client || item.categorie || 'Client professionnel';
        const status = item.statut || 'Réalisé';
        const image = resolveImage(item.image, projectImages[index % projectImages.length]);
        const date = formatTimestamp(item.date || item.createdAt);
        grid.insertAdjacentHTML('beforeend', `<div class="col-md-4"><article class="project-card h-100"><img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" loading="lazy"><div class="project-card-body"><h4>${escapeHtml(title)}</h4><p>${escapeHtml(description)}</p><div class="project-tags"><span class="project-tag">${escapeHtml(status)}</span><span class="project-tag">${escapeHtml(client)}</span>${date ? `<span class="project-tag">${escapeHtml(date)}</span>` : ''}</div></div></article></div>`);
    }

    async function loadServices() {
        const grid = document.getElementById('servicesGrid');
        if (!grid || !global.AkpoGuard) return;
        try {
            await global.AkpoGuard.ready;
            const snapshot = await readCollection(global.db.collection('services'));
            if (snapshot.empty) return;
            grid.innerHTML = '';
            snapshot.forEach(function (doc, index) { renderService(grid, doc.data(), index); });
        } catch (error) {
            console.info('[AKPO] Services Firestore indisponibles, affichage local conservé.');
        }
    }

    async function loadProjects() {
        const grid = document.getElementById('projectsGrid');
        if (!grid || !global.AkpoGuard) return;
        try {
            await global.AkpoGuard.ready;
            const snapshot = await readCollection(global.db.collection('projects'));
            if (snapshot.empty) return;
            grid.innerHTML = '';
            snapshot.forEach(function (doc, index) { renderProject(grid, doc.data(), index); });
        } catch (error) {
            console.info('[AKPO] Projets Firestore indisponibles, affichage local conservé.');
        }
    }

    global.AkpoPublicContent = { loadServices, loadProjects };
    document.addEventListener('DOMContentLoaded', function () {
        loadServices();
        loadProjects();
    });
})(window);
