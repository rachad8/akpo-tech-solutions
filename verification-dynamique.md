# Vérification dynamique Firebase

La page `pages/contact.html` charge correctement le SDK Firebase et le garde de session. Le contrôle navigateur confirme `firebaseLoaded=true`, `authLoaded=true`, `dbLoaded=true`, `guardLoaded=true`, `guardReady=true` et la fonction `submitContactForm` est présente. Le formulaire est prêt à enregistrer un document dans `contacts` avec un secours par e-mail en cas d’échec réseau ou de règle Firestore.

## Connexion

La page `auth/login.html` s’affiche correctement sans soumission de données. Le navigateur confirme que Firebase, Auth, Firestore et `AkpoGuard` sont chargés et prêts ; le contenu principal du formulaire est visible (`authContentVisible=block`). Aucun compte n’a été créé ni utilisé pendant ce test.

## Anomalie espace client

Le test de `client/index.html` montre que le SDK Firebase est présent mais que `AkpoGuard` et `auth` ne sont pas chargés (`guardLoaded=false`, `authLoaded=false`). La page reste donc visible sans protection. Il faut ajouter le script `../assets/js/session-guard.js` dans les pages client qui ne le chargent pas réellement, puis retester la redirection.

## Retest espace client

Après insertion des balises `session-guard.js` dans toutes les pages protégées, le contrôle des fichiers confirme que chaque page Firebase possède désormais la balise. Toutefois, le navigateur local continue d’afficher `client/index.html` sans `AkpoGuard` ni `auth` (`guardLoaded=false`, `authLoaded=false`). Le serveur local semble servir une ancienne copie/cache ou le fichier consulté n’a pas été rechargé avec la modification ; un contrôle avec un serveur redémarré et une URL de test différente est nécessaire avant de conclure.

## Protection client corrigée

Après rechargement anti-cache de `client/index.html`, le garde fonctionne : le navigateur redirige automatiquement vers `auth/login.html`. Sur la page de connexion, `guardLoaded=true`, `authLoaded=true`, `dbLoaded=true`, `guardReady=true` et aucune session active n’est détectée.

## Protection admin et contenu public

L’ouverture de `admin/index.html?dynamic=1` sans session redirige vers `auth/login.html`. La page Services dynamique charge le SDK Firebase, `AkpoGuard` et `AkpoPublicContent`; les neuf cartes locales restent visibles et aucune image n’est cassée. `db` n’est pas encore disponible immédiatement au moment du contrôle synchrone, car l’initialisation est asynchrone, mais le garde est chargé et le contenu de secours est fonctionnel.

## Initialisation publique corrigée

Les pages Services et Projets chargent désormais Firebase Auth en plus de Firestore, ce qui permet au garde unifié de s’initialiser complètement. Le contrôle navigateur de Services confirme `firebaseLoaded=true`, `authLoaded=true`, `dbLoaded=true`, `guardReady=true`, `servicesLoader=true` et neuf cartes visibles.

## Protection administrateur

Après réactivation du garde dans les pages admin, l’ouverture de `admin/index.html?dynamic=2` sans session redirige correctement vers `auth/login.html`. Aucun accès administrateur n’a été effectué pendant ce test.

## Inscription

La page `auth/register.html?dynamic=1` s’affiche correctement. Le contrôle confirme que Firebase/Auth/Firestore et `AkpoGuard` sont prêts, et que `registerForm` existe. Aucun compte n’a été créé et aucune donnée personnelle n’a été saisie.

## Archive dynamique

L’archive `akpo-tech-solutions-dynamique-refondu.zip` contient 106 fichiers dynamiques et visuels, dont `session-guard.js`, `public-content.js`, les pages Auth/client/admin, les règles Firestore, les fonctions cloud et la checklist de configuration. Aucun fichier `.env`, PHP, clé de compte de service ou configuration serveur sensible n’est inclus. Les tests n’ont pas créé de compte et n’ont pas soumis de demande réelle.

## Test complet des pages

Le test HTTP de la copie dynamique a parcouru **34 pages HTML** hors dépendances tierces. Résultat : **34/34 pages HTTP 200**, **0 ressource locale manquante** et **0 échec**. Les références corrigées concernaient les liens statistiques admin, le logo de Paiements et le logo du profil client. Les redirections des espaces client et admin ont été vérifiées séparément dans le navigateur, car un test HTTP seul n’exécute pas le JavaScript.

Le contrôle syntaxique de tous les fichiers JavaScript du site et des fonctions cloud indique **JS_SYNTAX=0_FAILURE**.

## Compte de test client

Avec l’autorisation confirmée, le compte `test.akpo.2026@example.com` a été créé via le formulaire d’inscription Firebase. Après rechargement anti-cache de l’espace client, le navigateur confirme `guardLoaded=true`, `authLoaded=true`, l’UID Firebase `uEzMwVtFirMpRGTJ9yeqxorDH3K2` et le nom affiché `Test`. Le tableau de bord client est donc accessible avec la session créée. Aucun compte administrateur n’a été créé.

## Test inscription, déconnexion et reconnexion

Le compte de test a été créé avec succès et l’espace client a été atteint. Le premier clic sur Déconnexion a révélé un chemin relatif incorrect (`client/auth/login.html` au lieu de `../auth/login.html`) ; les chemins de déconnexion client et admin ont été corrigés dans toutes les pages concernées. La reconnexion avec le compte de test a ensuite redirigé vers l’espace client. Une vérification sans paramètre anti-cache a servi une ancienne copie du HTML et affichait temporairement `AkpoGuard=false`; les vérifications doivent utiliser le rechargement anti-cache pour refléter les fichiers récemment modifiés.

## Reconnexion confirmée

Après rechargement anti-cache, la reconnexion est confirmée : `guardLoaded=true`, `authLoaded=true`, l’adresse `test.akpo.2026@example.com` est active, le nom `Test` apparaît dans l’espace client et le compteur de demandes est à zéro.

## Déconnexion confirmée

Le bouton Déconnexion corrigé redirige maintenant correctement depuis `client/index.html` vers `auth/login.html`, sans erreur 404. Le compte de test est donc validé sur le parcours création, connexion, accès client et déconnexion.

## Tests espace client — première série

Avec le compte de test connecté, les pages `client/index.html`, `client/profile.html`, `client/invoices.html`, `client/payments.html` et `client/history.html` ont été ouvertes avec anti-cache. Elles s’affichent correctement, le profil « Test AKPO » est chargé, les factures et paiements affichent des listes vides cohérentes, et l’historique propose ses filtres sans erreur visible.

## Tests espace client — deuxième série

Les pages `client/support.html` et `client/settings.html` ont été ouvertes avec la session de test. Support affiche les canaux WhatsApp, téléphone, e-mail et la FAQ. Paramètres affiche la modification du mot de passe et la zone de suppression de compte. Aucun formulaire sensible n’a été soumis et aucune suppression n’a été déclenchée.
