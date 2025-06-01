// Configuration Firebase
// Pour configurer Firebase :
// 1. Allez sur https://console.firebase.google.com/
// 2. Créez un projet ou sélectionnez-en un existant
// 3. Dans les paramètres du projet (⚙️), allez dans "Paramètres du projet"
// 4. Dans l'onglet "Général", descendez jusqu'à "Vos applications"
// 5. Cliquez sur l'icône Web (</>)
// 6. Enregistrez votre application et copiez la configuration ci-dessous

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDClVPiELpRM6Z6-qYByfMsBZHVHtDParY",
  authDomain: "app-horaire-6fcb0.firebaseapp.com",
  projectId: "app-horaire-6fcb0",
  storageBucket: "app-horaire-6fcb0.appspot.com",
  messagingSenderId: "736909362515",
  appId: "1:736909362515:web:822f104d460c2128668da6",
  measurementId: "G-0QVZLX7XXH"
};

// Vérification de la configuration
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined') {
  console.error('Erreur : La configuration Firebase est manquante. Veuillez créer un fichier .env à la racine du projet avec les variables suivantes :');
  console.error(`
VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre_auth_domain
VITE_FIREBASE_PROJECT_ID=votre_project_id
VITE_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_messaging_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
  `);
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 