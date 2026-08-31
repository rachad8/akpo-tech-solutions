# Contrôle navigateur des pages admin

La session Firebase est active avec l’utilisateur admin de test. Le profil `clients/{uid}` existe avec `role: 'admin'` et `isAdmin: true`.

Les requêtes exactes du chargement principal réussissent dans la console du navigateur : `clients.get()` renvoie 11 documents, `contacts.orderBy('date')`, `factures.orderBy('date')`, `commentaires.orderBy('date')` et les sous-collections `clients/{uid}/demandes.orderBy('date')` réussissent.

Le dashboard publié affiche toutefois encore `Missing or insufficient permissions`. Le code active aussi une écoute temps réel via `db.collectionGroup('demandes').orderBy('date', 'desc')`. Les règles actuelles ne contiennent pas de règle explicite adaptée aux requêtes collection group, ce qui est la cause probable à corriger.
