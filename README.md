# Horaires App

## Structure du projet

- Le projet principal se trouve à la racine du dépôt ou dans le dossier `horaires-app` selon la version.
- Les fichiers importants sont :
  - `src/` : Contient le code source React (fichiers `App.jsx`, `main.jsx`, etc.)
  - `index.html` : Point d'entrée pour Vite
  - `package.json` : Dépendances et scripts npm

## Déploiement en ligne

L'application est déployée automatiquement sur [Vercel](https://vercel.com/) à chaque push sur la branche `main` du dépôt GitHub.

### Commandes principales

- **Installer les dépendances** :
  ```bash
  npm install
  ```
- **Lancer le projet en local** :
  ```bash
  npm run dev
  ```
- **Construire pour la production** :
  ```bash
  npm run build
  ```

### Déploiement Vercel

1. Le dépôt GitHub est connecté à Vercel.
2. À chaque push sur `main`, Vercel clone le dépôt, installe les dépendances et lance la commande `npm run build`.
3. Si la build réussit, le site est automatiquement mis à jour en ligne.

---

N'hésite pas à consulter ce fichier si tu as un doute sur la structure ou le déploiement du projet !

# Application Horaires

Une application de gestion des horaires développée avec React et Vite.

## Fonctionnalités

- Gestion des horaires
- Interface utilisateur moderne
- Application responsive 