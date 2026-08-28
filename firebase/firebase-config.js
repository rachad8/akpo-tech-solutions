/*
 * Configuration Firebase centrale - AKPO TECH SOLUTIONS
 *
 * IMPORTANT : cette configuration contient uniquement les informations
 * publiques nécessaires à l'identification de l'application Firebase.
 * Les secrets FedaPay et toute autre clé privée ne doivent PAS être placés ici.
 *
 * L'initialisation Firebase est centralisée dans assets/js/session-guard.js
 * afin d'éviter plusieurs initializeApp() et de conserver la compatibilité
 * avec l'architecture actuelle du projet.
 */
(function (global) {
    'use strict';

    if (!global.AkpoGuard || !global.AkpoGuard.ready) {
        console.error('[AKPO] Charger assets/js/session-guard.js avant firebase-config.js.');
        return;
    }

    // Configuration publique de l'application Firebase.
    global.firebaseConfig = Object.freeze({ ...global.AkpoGuard.config });

    // Expose l'application et les services déjà initialisés par le guard.
    global.AkpoGuard.ready.then(function (services) {
        global.firebaseApp = global.firebase.apps[0] || null;
        global.auth = services.auth;
        global.db = services.db;
    }).catch(function (error) {
        console.error('[AKPO] Firebase indisponible.', error);
    });
})(window);
