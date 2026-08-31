# Diagnostic de connexion administrateur

## Fonctionnement retenu

La création d’un administrateur se fait désormais directement depuis la page `auth/admin-register.html`, avec le SDK Firebase côté navigateur. Aucun code secret et aucune Cloud Function ne sont nécessaires.

Le formulaire utilise `createUserWithEmailAndPassword`, puis crée le document `clients/{uid}` avec `role: 'admin'` et `isAdmin: true`. Les règles Firestore autorisent cette création lorsque l’utilisateur vient d’être créé et que l’UID du document correspond à son propre UID.

La connexion admin utilise ensuite Firebase Authentication et vérifie le profil Firestore admin avant l’accès au tableau de bord.

## Unicité des emails

Firebase Authentication conserve une adresse email unique dans le projet Firebase. Si un email existe déjà, la création échoue avec l’erreur `auth/email-already-in-use`; il n’est donc pas possible de créer plusieurs comptes avec exactement la même adresse.

## Nettoyage effectué

La référence à la Cloud Function `registerAdmin` a été retirée de la page admin et de `functions/index.js`. Les variables et champs `ADMIN_SECRET`, `admin.secret`, `secretCode` et `registerSecret` ont été supprimés du flux et de la configuration.

## Tests réalisés

La syntaxe JavaScript des fichiers client, API et fonctions Firebase a été vérifiée avec Node.js. Les contrôles confirment l’utilisation de Firebase Authentication côté client, l’écriture du profil admin dans Firestore, l’absence de l’ancienne Cloud Function et l’absence de code secret. La vérification `git diff --check` est également passée.

## Avertissement de sécurité

Cette version est volontairement publique : toute personne connaissant l’URL peut tenter de créer un compte administrateur. La protection repose sur l’obscurité de l’URL et ne constitue pas une sécurité forte. Il est recommandé de surveiller régulièrement les utilisateurs Firebase et de retirer rapidement tout compte non autorisé.
