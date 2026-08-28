# AKPO TECH SOLUTIONS

Bienvenue sur le site d'AKPO TECH SOLUTIONS.

## Description

Ce dépôt contient le site web principal de l'entreprise. Il présente nos services, notre portfolio, les informations de contact et les projets réalisés.

## Objectif

Offrir une vitrine claire et professionnelle pour les visiteurs et les clients, avec une navigation simple et un contenu structuré.

## Fonctionnalités principales

- Présentation de l'entreprise
- Liste des services
- Portfolio des projets
- Formulaire de contact
- Informations sur l'équipe

## Installation

1. Cloner le dépôt.
2. Ouvrir le projet dans votre éditeur.
3. Héberger les fichiers sur un serveur web ou ouvrir le fichier `index.html` localement.

## Utilisation

- Modifier les sections du site pour ajouter vos propres services.
- Mettre à jour les informations de contact.
- Ajouter des images et des descriptions dans la section portfolio.

## Structure du projet

- `index.html` : page d'accueil
- `styles/` : fichiers CSS
- `scripts/` : fichiers JavaScript
- `images/` : ressources visuelles

## Version dynamique Firebase

La vitrine publique conserve son rendu visuel et ses photographies, tout en pouvant charger les collections `services` et `projects` depuis Firestore avec un fallback local. Le formulaire Contact enregistre les demandes dans `contacts` et conserve un secours par e-mail en cas d’indisponibilité du service.

L’authentification par e-mail et Google, l’inscription, le garde de session, l’espace client et l’espace administrateur sont réactivés dans la copie dynamique. Les règles Firestore sont conservées dans `firebase/firestore.rules` et la checklist de configuration se trouve dans `configuration-firebase-dynamique.md`.

Les héros des pages Accueil, Services et Projets, le portrait professionnel du fondateur et les photographies de projets/services se trouvent dans `assets/images/`. Les images issues de recherches externes sont listées dans `assets/images/ATTRIBUTIONS.md` et doivent être vérifiées côté licence avant une mise en production commerciale.

La version statique précédente reste disponible dans l’archive `akpo-tech-solutions-statique-refondu.zip`. L’archive dynamique exclut les secrets serveur, les fichiers `.env`, les clés de compte de service et les fichiers PHP hérités.

## Contact

Pour toute question ou modification, contacter le responsable du projet ou l'équipe de développement.
