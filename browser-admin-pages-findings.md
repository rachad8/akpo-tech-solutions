# Contrôle navigateur des pages admin

Le tableau de bord charge correctement après publication de `a8bd0d7`.

Demandes, Clients, Messages, Factures, Commentaires et Statistiques fonctionnent dans la session admin.

Le lien Paramètres du dashboard était cassé : il ne naviguait pas. Le correctif local ajoute `href="settings.html"`; cette correction doit être republiée avant vérification finale.

La page Paramètres publiée est accessible directement et charge le compte admin, les informations du site, les services proposés et les actions de configuration. Le module Services affiche toutefois « Chargement des services... » dans le rendu observé et devra être vérifié dans le code.
