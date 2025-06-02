import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export function Accueil() {
  return (
    <div className="accueil">
      <Logo />
      <h2>Bienvenue sur Horaires !</h2>
      <p>Note facilement tes heures, tâches et lieux chaque jour.<br/>Tout est sauvegardé et exportable.</p>
      <Link to="/saisie" className="btn">Commencer</Link>
    </div>
  );
}

export default Accueil; 