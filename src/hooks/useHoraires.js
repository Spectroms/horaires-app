/**
 * @fileoverview Hook personnalisé pour la gestion des horaires avec Firestore
 * @module useHoraires
 */

import { useState, useEffect } from 'react';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase';
import { useAuth } from './useAuth';

/**
 * Hook personnalisé pour gérer les horaires
 * @param {string} userId - ID de l'utilisateur connecté
 * @returns {Object} État et fonctions de gestion des horaires
 * @property {Array} horaires - Liste des horaires
 * @property {boolean} loading - État de chargement
 * @property {Error|null} error - Erreur éventuelle
 * @property {Function} ajouterHoraire - Fonction pour ajouter un horaire
 * @property {Function} supprimerHoraire - Fonction pour supprimer un horaire
 */
export function useHoraires() {
  const [horaires, setHoraires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadHoraires = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const db = getFirestore();
        const horairesRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(horairesRef);
        if (docSnap.exists()) {
          setHoraires(docSnap.data().horaires || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadHoraires();
  }, [user]);

  const saveHoraires = async (newHoraires) => {
    if (!user) {
      setError('Utilisateur non connecté');
      return;
    }
    try {
      const db = getFirestore();
      const horairesRef = doc(db, 'users', user.uid);
      await setDoc(horairesRef, { horaires: newHoraires }, { merge: true });
      setHoraires(newHoraires);
    } catch (err) {
      setError(err.message);
    }
  };

  const addHoraire = async (horaire) => {
    const newHoraires = [...horaires];
    const index = newHoraires.findIndex(h => h.date === horaire.date);
    if (index !== -1) {
      newHoraires[index] = horaire;
    } else {
      newHoraires.push(horaire);
    }
    await saveHoraires(newHoraires);
  };

  return {
    horaires,
    loading,
    error,
    addHoraire,
    saveHoraires
  };
} 