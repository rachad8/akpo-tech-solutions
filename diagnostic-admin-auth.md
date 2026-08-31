# Diagnostic de connexion administrateur

## Vérifications et correction

La page de connexion admin utilise Firebase Authentication avec email et mot de passe, puis vérifie le custom claim `admin` ou le profil `clients/{uid}` avec `role: 'admin'` avant d’autoriser l’accès au tableau de bord.

L’ancien formulaire d’inscription admin créait un utilisateur depuis le navigateur et tentait d’écrire lui-même `role: 'admin'`. Les règles Firestore empêchent cette auto-attribution. Le formulaire a été corrigé pour appeler la fonction callable Firebase `registerAdmin`.

À la demande du propriétaire, aucun code secret n’est désormais utilisé. Pour éviter de rendre la création de comptes administrateurs publique, la fonction serveur exige qu’un administrateur soit déjà authentifié. Elle vérifie le custom claim `admin: true` ou le profil admin côté serveur, puis crée le nouvel utilisateur et lui attribue le claim admin. La page d’inscription est elle-même redirigée vers la connexion admin lorsqu’aucun administrateur n’est connecté.

La redirection par défaut du garde admin vers `auth/admin-login.html` a également été corrigée.

## Tests réalisés

La syntaxe JavaScript des fichiers client, API et fonctions Firebase a été vérifiée avec Node.js. Les contrôles de diff Git ont également été exécutés sans erreur. Les références à `secretCode`, `ADMIN_SECRET` et `admin.secret` ont été supprimées du flux corrigé et du modèle d’environnement.

## Point important pour le premier administrateur

Sans code secret, le premier compte administrateur doit être créé manuellement depuis Firebase Authentication/Firestore ou être provisionné par une procédure serveur initiale. Une fois ce premier administrateur disponible, il pourra créer les comptes administrateurs suivants depuis la page protégée.

## Publication

Les corrections ont été poussées sur la branche `main` du dépôt GitHub `rachad8/akpo-tech-solutions`. Le déploiement Firebase Functions doit être effectué sur l’environnement qui sert réellement le site pour rendre la nouvelle fonction active.
