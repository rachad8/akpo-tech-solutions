# Test facture côté client et FedaPay

Un compte client de test a été créé dans le navigateur. Une facture `FAC-2026-5025`, montant 1 FCFA, service « Test de visibilité facture », a été créée depuis l’espace admin pour ce compte.

Après reconnexion avec le compte client, la page `client/invoices.html` affiche réellement : 1 facture, 1 facture en attente, 1 FCFA, et le bouton « Payer ».

Le clic sur « Payer » a ouvert une fenêtre `about:blank` sans afficher de widget FedaPay visible. Le paiement n’a pas été effectué. Cette étape nécessite une vérification de la configuration FedaPay, de la Cloud Function de création de transaction et des erreurs console.
