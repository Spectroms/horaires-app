import React, { useState, useMemo } from 'react';
import { getFrenchHolidaysMulti } from '../utils/dateUtils';
import { FaClock, FaCalendarAlt, FaMapMarkerAlt, FaTasks, FaCheckCircle } from 'react-icons/fa';

export function Saisie({ onSave, horaires }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [start, setStart] = useState('08:00');
  const [end, setEnd] = useState('16:30');
  const [pause, setPause] = useState('01:00');
  const [task, setTask] = useState('');
  const [place, setPlace] = useState('');
  const [message, setMessage] = useState('');

  const year = Number(date.slice(0, 4));
  const holidays = useMemo(() => getFrenchHolidaysMulti({ start: year, end: year }), [year]);
  const isSunday = new Date(date).getDay() === 0;
  const isHoliday = holidays.includes(date);

  const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const jourSemaine = jours[new Date(date).getDay()];

  const handleSubmit = (e) => {
    e.preventDefault();
    const existe = horaires && horaires.some(h => h.date === date);
    if (existe) {
      if (!window.confirm('Un horaire existe déjà pour ce jour. Voulez-vous écraser les données existantes ?')) {
        setMessage('Saisie annulée.');
        setTimeout(() => setMessage(''), 2000);
        return;
      }
    }
    onSave && onSave({ date, start, end, pause, task, place });
    setMessage('Heures enregistrées !');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="saisie-card">
      <h2 className="saisie-title">Saisie d'une journée</h2>
      <div className="saisie-jour-info">
        <span>{jourSemaine}</span>
        {(isHoliday && !isSunday) && <span className="saisie-jour-ferie">Jour férié</span>}
      </div>
      <form onSubmit={handleSubmit} className="saisie-form">
        <div className="saisie-row">
          <div className="saisie-field-col">
            <div className="saisie-help">Date de la journée</div>
            <div className="saisie-field">
              <FaCalendarAlt className="saisie-icon" />
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
          </div>
          <div className="saisie-field-col">
            <div className="saisie-help">Heure de début</div>
            <div className="saisie-field">
              <FaClock className="saisie-icon" />
              <input type="time" value={start} onChange={e => setStart(e.target.value)} required />
            </div>
          </div>
          <div className="saisie-field-col">
            <div className="saisie-help">Heure de fin</div>
            <div className="saisie-field">
              <FaClock className="saisie-icon" />
              <input type="time" value={end} onChange={e => setEnd(e.target.value)} required />
            </div>
          </div>
          <div className="saisie-field-col">
            <div className="saisie-help">Pause (hh:mm)</div>
            <div className="saisie-field">
              <FaClock className="saisie-icon" />
              <input type="time" value={pause} onChange={e => setPause(e.target.value)} step="60" />
            </div>
          </div>
        </div>
        <div className="saisie-row">
          <div className="saisie-field-col">
            <div className="saisie-help">Tâche principale</div>
            <div className="saisie-field">
              <FaTasks className="saisie-icon" />
              <input type="text" value={task} onChange={e => setTask(e.target.value)} placeholder="Ex : livraison, réunion..." />
            </div>
          </div>
          <div className="saisie-field-col">
            <div className="saisie-help">Lieu principal</div>
            <div className="saisie-field">
              <FaMapMarkerAlt className="saisie-icon" />
              <input type="text" value={place} onChange={e => setPlace(e.target.value)} placeholder="Ex : Lyon, Marseille..." />
            </div>
          </div>
        </div>
        <div className="saisie-btn-row">
          <button type="submit" className="saisie-btn saisie-btn-modern saisie-btn-large saisie-btn-center">Enregistrer</button>
        </div>
        {message && <div className="saisie-success"><FaCheckCircle /> {message}</div>}
      </form>
    </div>
  );
}

export default Saisie; 