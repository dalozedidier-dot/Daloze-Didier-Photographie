# Didier Daloze Photographie

Portfolio photographique statique pensé pour GitHub Pages.

## Objectif

Le dépôt est conçu en deux étapes :

1. **Portfolio**
   - accueil très visuel
   - galeries filtrables
   - affichage plein écran des photos
   - responsive mobile / desktop
   - aucune dépendance JavaScript externe
   - hébergement possible directement sur GitHub Pages

2. **Vente**
   - tirages photographiques
   - séries limitées
   - licences d’utilisation
   - redirection vers un checkout sécurisé
   - aucune donnée bancaire stockée dans le dépôt

## Ajouter les photos

1. Optimiser les images en WebP ou AVIF.
2. Les placer dans `assets/photos/`.
3. Compléter `assets/data/photos.js`.
4. Commit et push.

Exemple :

```js
{
  src: "assets/photos/lion-01.webp",
  title: "Le regard",
  category: "felins",
  categoryLabel: "Félins",
  alt: "Portrait rapproché d'un lion",
  year: "2026",
  sale: {
    enabled: false,
    priceFrom: 0,
    checkoutUrl: ""
  }
}
```

## Catégories initiales

- Félins
- Nature
- Orages
- Costumes

Elles peuvent être renommées ou complétées.

## Mise en ligne avec GitHub Pages

Le site ne nécessite aucune compilation.

Dans GitHub :

- `Settings`
- `Pages`
- `Build and deployment`
- `Deploy from a branch`
- branche `main`
- dossier `/ (root)`

Le site sera ensuite disponible sur l’adresse GitHub Pages du dépôt.

## Vente en ligne

Voir `docs/ROADMAP.md`.

## Droit d’auteur

Les fichiers sources haute définition ne doivent pas être placés dans le dépôt public.
Le portfolio doit contenir uniquement des versions web optimisées.
