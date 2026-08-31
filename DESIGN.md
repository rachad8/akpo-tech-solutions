# DESIGN.md — AKPO TECH SOLUTIONS

## Visual Theme & Atmosphere

Direction **technique, premium et rassurante** : une vitrine de maintenance informatique pour particuliers et entreprises à Cotonou, Calavi et environs. L’interface doit être claire, rapide à comprendre et orientée vers deux actions : découvrir un service et demander une intervention. La marque conserve son identité bleu et blanc avec une profondeur éditoriale sobre plutôt qu’un style générique de tableau de bord.

## Color Palette & Roles

| Nom | Valeur | Rôle |
|---|---|---|
| Bleu principal | `#2563EB` | CTA, liens, éléments actifs |
| Bleu profond | `#0B1F3A` | Hero, footer, titres forts |
| Bleu clair | `#DBEAFE` | Surfaces d’accent et états informatifs |
| Blanc chaud | `#FCFDFE` | Fond principal |
| Surface bleutée | `#F4F7FB` | Sections alternées et cartes |
| Texte principal | `#10233F` | Titres et contenu prioritaire |
| Texte secondaire | `#52657D` | Paragraphes et métadonnées |
| Accent teal | `#0F766E` | Confirmation et éléments de confiance |

## Typography Rules

Utiliser une hiérarchie fluide avec `clamp()`. Les titres sont compacts, affirmés et lisibles ; le corps est confortable sur mobile avec une hauteur de ligne de 1.65. Conserver la police de marque existante pour éviter une rupture de chargement, mais renforcer la hiérarchie par le poids, l’espacement et la largeur de lecture.

## Component Stylings

Les boutons ont une hauteur minimale de 44px, une hiérarchie nette et un focus visible. Les cartes utilisent un rayon modéré de 14px, une bordure légère et une élévation discrète uniquement au survol. Les champs de formulaire ont toujours un label associé, un état d’erreur textuel et un contour de focus bleu. Les navigations restent sémantiques avec un lien « Aller au contenu principal ».

## Layout Principles

Échelle d’espacement basée sur 4px, conteneur maximal de 1200px, sections aérées et grilles asymétriques lorsque cela clarifie le contenu. Les informations métier importantes restent visibles à toutes les tailles ; aucune fonctionnalité critique ne doit être cachée sur mobile.

## Depth & Elevation

Privilégier les bordures `#DCE6F2`, les ombres courtes et les contrastes de surface. Le hero et le footer peuvent utiliser le bleu profond avec des dégradés très subtils. Éviter le glassmorphism systématique, les ombres lourdes et les gradients décoratifs sur les textes.

## Do’s and Don’ts

Faire : conserver les fonctions Firebase, les formulaires, les liens de paiement, des états de chargement explicites, le contraste AA et `prefers-reduced-motion`. Éviter : modifier les adresses e-mail, les URL métier, les collections Firestore, les clés d’intégration ou transformer les contrôles sémantiques en `div` cliquables.

## Responsive Behavior

À 320–414px, passer les grilles en une colonne, réduire les paddings et conserver des cibles tactiles de 44px. À 768px, utiliser deux colonnes lorsque le contenu le permet. À partir de 1024px, utiliser le conteneur complet et une navigation horizontale. Le texte doit rester lisible à 200% de zoom et le mouvement doit être désactivé avec `prefers-reduced-motion: reduce`.

## Theme & Language

Le thème clair est la référence. Le thème sombre utilise un bleu nuit teinté, des surfaces bleu ardoise et des bordures à contraste suffisant ; il ne s’agit pas d’une simple inversion. Le sélecteur de langue doit être extensible au français et à l’anglais, avec persistance locale, sans modifier les données métier ou les URL de paiement.

## Verification Checklist

Avant publication : tester l’accueil, À propos, Services, Projets, FAQ, Contact, authentification, espaces client/admin et paiement ; vérifier les états hover/focus/loading/error, l’absence de débordement horizontal, le contraste, le clavier, les formulaires et la console navigateur.

> Ce document accompagne la refonte et ne remplace pas les règles métier ni la configuration Firebase.
