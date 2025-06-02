import React from 'react';

export function Logo() {
  return (
    <div className="logo-accueil">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="38" stroke="#FFD600" strokeWidth="4" fill="#fff" />
        <circle cx="40" cy="40" r="30" stroke="#FFD600" strokeWidth="2" fill="#fffde7" />
        <rect x="37" y="20" width="6" height="22" rx="3" fill="#FFD600" />
        <rect x="40" y="40" width="16" height="4" rx="2" fill="#FFD600" />
        <circle cx="40" cy="40" r="4" fill="#FFD600" />
      </svg>
    </div>
  );
}

export default Logo; 