import React from 'react';
import { FaCog, FaMoon, FaSun } from 'react-icons/fa';

export function Parametres() {
  // Gestion du thème (mode sombre/clair)
  const [darkMode, setDarkMode] = React.useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Notification
  const [notifEnabled, setNotifEnabled] = React.useState(() => {
    const saved = localStorage.getItem('notifEnabled');
    return saved ? JSON.parse(saved) : false;
  });
  const [notifHour, setNotifHour] = React.useState(() => {
    const saved = localStorage.getItem('notifHour');
    return saved || '18:00';
  });

  React.useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  React.useEffect(() => {
    localStorage.setItem('notifEnabled', JSON.stringify(notifEnabled));
    localStorage.setItem('notifHour', notifHour);
    if (notifEnabled && 'Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, [notifEnabled, notifHour]);

  return (
    <div className="parametres-card">
      <div className="parametres-header">
        <FaCog className="parametres-cog" />
        <h2 className="parametres-title">Paramètres</h2>
      </div>
      <div className="parametres-options">
        <div className="parametres-option theme-option">
          <div className="theme-label">
            {darkMode ? <FaMoon className="theme-icon" /> : <FaSun className="theme-icon" />}
            <span>Mode {darkMode ? 'sombre' : 'clair'}</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={e => setDarkMode(e.target.checked)}
              aria-label={`Activer le mode ${darkMode ? 'clair' : 'sombre'}`}
            />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="parametres-option">
          <span>Rappel quotidien (jours ouvrés)</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={notifEnabled}
              onChange={e => setNotifEnabled(e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </div>
        {notifEnabled && (
          <div className="parametres-option">
            <span>Heure du rappel</span>
            <input
              type="time"
              value={notifHour}
              onChange={e => setNotifHour(e.target.value)}
              className="parametres-time"
            />
          </div>
        )}
      </div>
      <p className="parametres-help">Personnalise l'apparence et les rappels de l'application.<br/>D'autres options seront bientôt disponibles.</p>
    </div>
  );
} 