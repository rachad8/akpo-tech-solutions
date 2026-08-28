# Configuration Firebase — AKPO TECH SOLUTIONS

## Fonctionnalités réactivées

La copie dynamique contient l’initialisation Firebase unifiée, l’inscription et la connexion par e-mail, la connexion Google, la récupération de profil client, la protection des espaces client et administrateur, l’enregistrement des messages Contact dans `contacts`, ainsi que le chargement public des services et projets depuis Firestore avec un fallback visuel local.

## Configuration à effectuer dans Firebase Console

| Zone | Action |
|---|---|
| Authentication | Activer **Email/Password**. Activer **Google** si la connexion Google est souhaitée. Ajouter le domaine de production dans les domaines autorisés. |
| Firestore | Publier `firebase/firestore.rules`. Créer ou laisser les collections `clients`, `contacts`, `projects`, `services`, `commentaires` et `factures` se créer lors des premiers enregistrements. |
| Admin | Créer un compte administrateur, puis lui attribuer `role: admin` dans `clients/{uid}` ou le custom claim `admin: true` via un environnement serveur sécurisé. |
| Fonctions cloud | Si les e-mails automatiques sont activés, configurer les variables d’environnement exigées par `functions/index.js` avant déploiement. Ne jamais remettre `.env` ou une clé de compte de service dans le dossier public. |
| Hébergement | Servir le dossier dynamique via Firebase Hosting ou un hébergeur HTTPS. Pour les URLs Google/Email Auth, utiliser le domaine réellement publié, pas seulement `127.0.0.1`. |

## Modèle de données minimal

Les nouvelles demandes Contact sont écrites dans `contacts` avec `nom`, `telephone`, `email`, `service`, `urgence`, `source`, `adresse`, `description`, `statut`, `lu`, `date` et `createdAt`. Les demandes d’un client connecté restent sous `clients/{uid}/demandes/{demandeId}`. Les documents `projects` et `services` peuvent contenir au minimum `nom`, `description`, `image`, `categorie` ou `category`, et `date`.

## Sécurité

La configuration Firebase côté navigateur n’est pas une autorisation d’administration. La sécurité repose sur les règles Firestore et les claims/roles vérifiés côté serveur et dans les règles. Les fichiers secrets présents dans l’archive historique ont été exclus de l’archive dynamique livrable ; les identifiants exposés précédemment doivent être renouvelés si l’archive originale a été partagée publiquement.

## Tests effectués

Le code JavaScript restauré passe le contrôle syntaxique. La page Contact confirme le chargement de Firebase/Auth/Firestore et du garde. L’accès non authentifié à `client/index.html` et `admin/index.html` est redirigé vers `auth/login.html` après rechargement anti-cache. Les pages Services et Projets conservent leurs cartes locales lorsque les collections Firestore sont vides ou indisponibles.
