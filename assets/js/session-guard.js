
(function (global) {
    'use strict';

    const config = {
        apiKey: 'AIzaSyA6EpcsDZOTsVJUyXkoqMND3zjgyTRIA6s',
        authDomain: 'akpo-tech-solutions.firebaseapp.com',
        projectId: 'akpo-tech-solutions',
        storageBucket: 'akpo-tech-solutions.firebasestorage.app',
        messagingSenderId: '935755637623',
        appId: '1:935755637623:web:9c28d7819b118ed21cf772'
    };

    const guard = global.AkpoGuard = global.AkpoGuard || {};
    guard.config = config;

    function ensureFirebase() {
        if (typeof global.firebase === 'undefined') {
            return Promise.reject(new Error('Le SDK Firebase n’est pas chargé.'));
        }
        if (!global.firebase.apps.length) {
            global.firebase.initializeApp(config);
        }
        global.auth = global.firebase.auth();
        global.db = global.firebase.firestore();
        return Promise.resolve({ auth: global.auth, db: global.db });
    }

    guard.ready = ensureFirebase();

    guard.getProfile = async function (user) {
        if (!user) return null;
        await guard.ready;
        const snapshot = await global.db.collection('clients').doc(user.uid).get();
        return snapshot.exists ? { id: snapshot.id, ...snapshot.data() } : null;
    };

    guard.isAdmin = async function (user, profile) {
        if (!user) return false;
        try {
            const token = await user.getIdTokenResult();
            if (token.claims && token.claims.admin === true) return true;
        } catch (error) {
            console.warn('[AKPO] Impossible de lire les claims admin.', error);
        }
        return Boolean(profile && profile.role === 'admin');
    };

    guard.redirectForUser = async function (user, fallback) {
        const profile = await guard.getProfile(user);
        const admin = await guard.isAdmin(user, profile);
        global.location.href = admin ? 'admin/index.html' : (fallback || 'client/index.html');
    };

    guard.redirectIfAuthenticated = function (onReady, options) {
        const settings = options || {};
        guard.ready.then(function () {
            global.auth.onAuthStateChanged(async function (user) {
                if (!user) {
                    if (typeof onReady === 'function') onReady();
                    return;
                }
                try {
                    const profile = await guard.getProfile(user);
                    const admin = await guard.isAdmin(user, profile);
                    global.location.href = admin ? (settings.adminPath || '../admin/index.html') : (settings.clientPath || '../client/index.html');
                } catch (error) {
                    console.error('[AKPO] Erreur de redirection de session.', error);
                    if (typeof onReady === 'function') onReady();
                }
            });
        }).catch(function (error) {
            console.error('[AKPO] Firebase indisponible.', error);
            if (typeof onReady === 'function') onReady();
        });
    };

    guard.requireAuth = function (callback, options) {
        const settings = options || {};
        guard.ready.then(function () {
            global.auth.onAuthStateChanged(async function (user) {
                if (!user) {
                    global.location.href = settings.loginPath || '../auth/login.html';
                    return;
                }
                try {
                    const profile = await guard.getProfile(user);
                    if (typeof callback === 'function') callback(user, profile);
                } catch (error) {
                    console.error('[AKPO] Impossible de charger le profil.', error);
                    if (typeof callback === 'function') callback(user, null);
                }
            });
        }).catch(function (error) {
            console.error('[AKPO] Firebase indisponible.', error);
        });
    };

    guard.requireAdmin = function (callback, options) {
        const settings = options || {};
        guard.requireAuth(async function (user, profile) {
            if (await guard.isAdmin(user, profile)) {
                if (typeof callback === 'function') callback(user, profile);
                return;
            }
            alert('Accès réservé à l’administration.');
            global.location.href = settings.deniedPath || '../auth/admin-login.html';
        }, settings);
    };

    guard.logout = async function (target) {
        await guard.ready;
        await global.auth.signOut();
        global.location.href = target || '../index.html';
    };
})(window);


/* Refonte UI/UX 2026 : chargement de la couche d'expérience (animations,
   design global, navigation mobile). Chargée une seule fois par page. */
(function loadAkpoUx() {
    if (window.__akpoUxRequested) return;
    window.__akpoUxRequested = true;
    var current = document.currentScript;
    var src = current && current.src ? current.src.replace(/[^/]+\.js(\?.*)?$/, 'ux.js') : 'assets/js/ux.js';
    var s = document.createElement('script');
    s.src = src;
    s.defer = true;
    document.head.appendChild(s);
})();
