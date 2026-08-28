
(function (global) {
    'use strict';
    if (!global.AkpoGuard || !global.AkpoGuard.ready) {
        console.error('[AKPO] Charger assets/js/session-guard.js avant firebase-config.js.');
        return;
    }
    global.firebaseConfig = global.AkpoGuard.config;
    global.AkpoGuard.ready.then(function (services) {
        global.auth = services.auth;
        global.db = services.db;
    }).catch(function (error) {
        console.error('[AKPO] Firebase indisponible.', error);
    });
})(window);
