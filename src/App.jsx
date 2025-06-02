/**
 * @fileoverview Composant principal de l'application Horaires
 * @module App
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useHoraires } from './hooks/useHoraires';
import { Logo } from './components/Logo';
import { Accueil } from './components/Accueil';
import { Saisie } from './components/Saisie';
import { Recap } from './components/Recap';
import { Parametres } from './components/Parametres';
import './styles/components/App.css';
import { FaHome, FaCalendarAlt, FaTable, FaCog } from 'react-icons/fa';

/**
 * Composant de navigation de l'application
 * @component
 * @returns {JSX.Element} Barre de navigation avec les liens vers les différentes sections
 */
function Navigation() {
  const location = useLocation();

  return (
    <nav aria-label="Navigation principale" role="navigation">
      <div className="nav-links" role="menubar">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''} role="menuitem" aria-current={location.pathname === '/' ? 'page' : undefined} tabIndex={0}>
          <FaHome size={22} style={{marginBottom: 2}} />
          <span>Accueil</span>
        </Link>
        <Link to="/saisie" className={location.pathname === '/saisie' ? 'active' : ''} role="menuitem" aria-current={location.pathname === '/saisie' ? 'page' : undefined} tabIndex={0}>
          <FaCalendarAlt size={22} style={{marginBottom: 2}} />
          <span>Saisie</span>
        </Link>
        <Link to="/recap" className={location.pathname === '/recap' ? 'active' : ''} role="menuitem" aria-current={location.pathname === '/recap' ? 'page' : undefined} tabIndex={0}>
          <FaTable size={22} style={{marginBottom: 2}} />
          <span>Récap</span>
        </Link>
        <Link to="/parametres" className={location.pathname === '/parametres' ? 'active' : ''} role="menuitem" aria-current={location.pathname === '/parametres' ? 'page' : undefined} tabIndex={0}>
          <FaCog size={22} style={{marginBottom: 2}} />
          <span>Paramètres</span>
        </Link>
      </div>
    </nav>
  );
}

/**
 * Composant principal de l'application
 * @component
 * @returns {JSX.Element} Application complète avec routage et gestion du thème
 */
function App() {
  const { user, loading: authLoading } = useAuth();
  const { horaires, loading: horairesLoading, error } = useHoraires();
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  if (authLoading || horairesLoading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error">Erreur : {error.message}</div>;
  }

  return (
    <Router>
      <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/saisie" element={user ? <Saisie /> : <Accueil />} />
            <Route path="/recap" element={user ? <Recap horaires={horaires} /> : <Accueil />} />
            <Route path="/parametres" element={<Parametres />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 