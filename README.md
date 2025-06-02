# Horaires App

## Structure du projet

Le projet est organisé comme suit :
```
horaires-app/           # Dossier principal de l'application
├── src/               # Code source React
├── public/            # Fichiers statiques
├── node_modules/      # Dépendances (non versionné)
├── .env              # Variables d'environnement (non versionné)
├── .gitignore        # Configuration Git
├── package.json      # Dépendances et scripts
├── vite.config.js    # Configuration Vite
└── README.md         # Documentation
```

## Fonctionnalités

- Gestion des horaires de travail
- Interface utilisateur moderne et responsive
- Mode sombre/clair
- Export en Excel et PDF
- Authentification Google
- Sauvegarde cloud avec Firebase
- Calcul automatique des durées
- Gestion des jours fériés et congés

## Installation

1. **Cloner le dépôt** :
   ```bash
   git clone [URL_DU_REPO]
   cd horaires-app
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configuration des variables d'environnement** :
   - Créez un fichier `.env` à la racine du projet
   - Copiez les variables suivantes (remplacez les valeurs par les vôtres) :
     ```env
     # Configuration Firebase
     VITE_FIREBASE_API_KEY=votre_api_key_ici
     VITE_FIREBASE_AUTH_DOMAIN=votre_auth_domain_ici
     VITE_FIREBASE_PROJECT_ID=votre_project_id_ici
     VITE_FIREBASE_STORAGE_BUCKET=votre_storage_bucket_ici
     VITE_FIREBASE_MESSAGING_SENDER_ID=votre_messaging_sender_id_ici
     VITE_FIREBASE_APP_ID=votre_app_id_ici
     VITE_FIREBASE_MEASUREMENT_ID=votre_measurement_id_ici

     # Environnement
     NODE_ENV=development
     ```

## Développement

- **Lancer le serveur de développement** :
  ```bash
  npm run dev
  ```

- **Construire pour la production** :
  ```bash
  npm run build
  ```

## Déploiement

L'application est déployée automatiquement sur [Vercel](https://vercel.com/) à chaque push sur la branche `main`.

### Configuration Vercel

1. Connectez votre dépôt GitHub à Vercel
2. Configurez les variables d'environnement dans les paramètres du projet Vercel
3. Les déploiements se feront automatiquement à chaque push sur `main`

## Sécurité

⚠️ **Important** :
- Ne jamais commiter le fichier `.env` dans le dépôt
- Garder les clés API et autres informations sensibles dans les variables d'environnement
- Utiliser uniquement des variables d'environnement pour la configuration Firebase

## Contribution

1. Créez une branche pour votre fonctionnalité
2. Committez vos changements
3. Poussez vers la branche
4. Créez une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Technologies utilisées

- React
- Vite
- Firebase (Auth + Firestore)
- React Router
- XLSX (export Excel)
- jsPDF (export PDF)
- HTML2Canvas
