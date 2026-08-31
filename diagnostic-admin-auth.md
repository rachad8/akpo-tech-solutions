# Diagnostic de connexion administrateur

## Vérifications publiques du 31 août 2026

La page publiée `https://rachad8.github.io/akpo-tech-solutions/auth/admin-login.html` s’affiche correctement et contient le formulaire de connexion admin. La page publiée `https://rachad8.github.io/akpo-tech-solutions/auth/admin-register.html` affiche encore l’ancien formulaire, sans champ de code secret, et son libellé indique la création directe avec Firebase.

## Cause identifiée

La page `auth/admin-register.html` créait auparavant un utilisateur avec le SDK Firebase côté navigateur puis tentait d’écrire `role: 'admin'` dans `clients/{uid}`. Les règles `firebase/firestore.rules` autorisent une création client uniquement si le rôle est absent ou égal à `client`. Cette écriture est donc refusée par Firestore et ne peut pas produire un compte administrateur fiable.

## Correction appliquée

Le formulaire admin appelle désormais la fonction callable Firebase `registerAdmin`, transmet un code secret administrateur, et laisse le serveur créer l’utilisateur, attribuer le custom claim `admin: true` et écrire le profil admin. La redirection par défaut du garde admin vers `auth/admin-login.html` a également été corrigée.

## Limite du test en production

Le dépôt est servi actuellement par GitHub Pages ; `akpo-tech-solutions.web.app` répond 404 et le domaine `akpotechsolutions.com` ne se résout pas depuis l’environnement de test. La correction n’est donc pas encore visible en production tant que les changements ne sont pas poussés et que le déploiement Firebase Functions/Hosting correspondant n’est pas effectué.
