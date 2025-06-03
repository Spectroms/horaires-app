import React, { useState } from 'react';
import Logo from './Logo';
import { useAuth } from '../hooks/useAuth';

export function Accueil() {
  const { signIn } = useAuth();
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    setError(null);
    try {
      await signIn();
    } catch (err) {
      setError(err.message || 'Erreur lors de la connexion Google');
    }
  };

  return (
    <div className="accueil">
      <Logo />
      <h2>Bienvenue sur Horaires !</h2>
      <p>Note facilement tes heures, tâches et lieux chaque jour.<br/>Tout est sauvegardé et exportable.</p>
      <button className="btn" onClick={handleSignIn}>Commencer</button>
      {error && <div className="msg-error">{error}</div>}
    </div>
  );
}

export default Accueil; 