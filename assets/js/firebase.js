
(function (global) {
    'use strict';
    if (!global.AkpoGuard || !global.AkpoGuard.ready) {
        console.error('[AKPO] Charger session-guard.js avant firebase.js.');
        return;
    }
    global.AkpoGuard.ready.catch(function (error) {
        console.error('[AKPO] Firebase indisponible.', error);
    });
})(window);
