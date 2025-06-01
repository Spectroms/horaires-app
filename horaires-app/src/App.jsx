import React from 'react';
import { MdAccessTime, MdCalendarToday, MdSettings } from 'react-icons/md';

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>
          <MdAccessTime className="icon" /> Horaires App
        </h1>
      </header>
      <main>
        <div className="card">
          <MdCalendarToday className="icon-large" />
          <h2>Gestion des horaires</h2>
          <p>Organisez vos plannings facilement</p>
        </div>
        <div className="card">
          <MdSettings className="icon-large" />
          <h2>Configuration</h2>
          <p>Personnalisez votre application</p>
        </div>
      </main>
      <style jsx>{`
        .app-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          text-align: center;
        }
        header {
          margin-bottom: 3rem;
        }
        .icon {
          vertical-align: middle;
          margin-right: 0.5rem;
          font-size: 1.5em;
        }
        .icon-large {
          font-size: 3em;
          color: #2563eb;
          margin-bottom: 1rem;
        }
        .card {
          display: inline-block;
          padding: 2rem;
          margin: 1rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          background: white;
          min-width: 250px;
        }
        h1 {
          color: #1e40af;
          font-size: 2.5rem;
        }
        h2 {
          color: #1e40af;
          margin: 1rem 0;
        }
        p {
          color: #4b5563;
        }
      `}</style>
    </div>
  );
}

export default App;
