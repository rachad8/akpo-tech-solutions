# Test facture côté client et FedaPay

Le compte client de test `client.facture.test.20260831@example.com` a été créé directement dans le navigateur et redirigé vers son tableau de bord.

La page `client/invoices.html` s’ouvre correctement et affiche l’état vide pour ce compte. La facture `FAC-2026-6362` ne s’affiche pas, car elle est liée au client Abdoul Salami avec un autre `clientId`. Ce résultat confirme que le filtrage côté client est bien limité au compte connecté, et qu’une facture ne doit pas apparaître chez un autre client.

Étape suivante : créer une facture depuis l’espace admin en sélectionnant précisément le compte client de test, puis revenir dans ce compte pour confirmer son affichage et tester le bouton FedaPay sans effectuer de paiement réel.
