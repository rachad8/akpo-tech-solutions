# Contrôle navigateur des pages admin

Le dashboard publié fonctionne et ses liens réels redirigent correctement.

Les pages testées Demandes, Clients, Messages, Factures, Commentaires, Statistiques et Paramètres fonctionnent.

La page Factures directe fonctionne.

La page Paiements directe redirige vers `auth/admin-login.html`. La cause probable est son contrôle local qui vérifie uniquement `token.claims.admin`, alors que les comptes admin créés publiquement ont `role: 'admin'` dans Firestore mais ne peuvent pas obtenir de custom claim côté client. Cette page doit utiliser le même garde admin que les autres pages.
