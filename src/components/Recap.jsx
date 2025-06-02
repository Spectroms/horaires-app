/**
 * @fileoverview Composant de récapitulatif des horaires
 * @module Recap
 */

import React, { useState, useRef, useMemo } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { getFrenchHolidaysMulti, formatDateFR, getWeekNumber } from '../utils/dateUtils';
import '../styles/components/Recap.css';

/**
 * Calcule les statistiques des horaires
 * @param {Array} horaires - Liste des horaires à analyser
 * @returns {Object} Statistiques calculées (total, moyenne, etc.)
 */
const calculerStats = (horaires) => {
  // ... existing code ...
};

/**
 * Exporte les horaires au format Excel
 * @param {Array} horaires - Liste des horaires à exporter
 * @param {string} nomFichier - Nom du fichier de sortie
 */
const exporterExcel = (horaires, nomFichier) => {
  // ... existing code ...
};

/**
 * Exporte les horaires au format PDF
 * @param {Array} horaires - Liste des horaires à exporter
 * @param {string} nomFichier - Nom du fichier de sortie
 */
const exporterPDF = (horaires, nomFichier) => {
  // ... existing code ...
};

/**
 * Composant de récapitulatif des horaires
 * @component
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.horaires - Liste des horaires à afficher
 * @returns {JSX.Element} Interface de récapitulatif avec filtres et export
 */
export function Recap({ horaires }) {
  const tableRef = useRef(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [exportOption, setExportOption] = useState('');
  const [importMsg, setImportMsg] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Optimisation : ne calcule les jours fériés qu'une seule fois par année sélectionnée
  const holidays = useMemo(() => getFrenchHolidaysMulti({ start: selectedYear, end: selectedYear }), [selectedYear]);

  const filtered = horaires.filter(h => {
    const [y, m] = h.date.split('-');
    return Number(y) === Number(selectedYear) && Number(m) === Number(selectedMonth);
  });

  const filteredYear = horaires.filter(h => {
    const [y] = h.date.split('-');
    return Number(y) === Number(selectedYear);
  });

  const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date));
  const sortedYear = [...filteredYear].sort((a, b) => a.date.localeCompare(b.date));

  function getDuree(h) {
    if (h.start === '00:00' && h.end === '00:00' && h.pause === '00:00') return '';
    const [sh, sm] = h.start.split(':').map(Number);
    const [eh, em] = h.end.split(':').map(Number);
    const [ph, pm] = h.pause.split(':').map(Number);
    let duree = (eh * 60 + em) - (sh * 60 + sm) - (ph * 60 + pm);
    if (duree < 0) return '';
    const hres = Math.floor(duree / 60);
    const mins = duree % 60;
    return `${hres}h${mins.toString().padStart(2, '0')}`;
  }

  function getTotalMinutes(list) {
    return list.reduce((acc, h) => {
      const [sh, sm] = h.start.split(':').map(Number);
      const [eh, em] = h.end.split(':').map(Number);
      const [ph, pm] = h.pause.split(':').map(Number);
      let duree = (eh * 60 + em) - (sh * 60 + sm) - (ph * 60 + pm);
      return acc + (duree > 0 ? duree : 0);
    }, 0);
  }

  function getTotalHeures(list = sorted) {
    const mins = getTotalMinutes(list);
    const hres = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hres}h${m.toString().padStart(2, '0')}`;
  }

  function countDetailedSpecialDays(list) {
    let feriesTravailles = 0, feriesNonTravailles = 0, dimanches = 0, congesPayes = 0;
    for (const h of list) {
      const isSunday = new Date(h.date).getDay() === 0;
      const isHoliday = holidays.includes(h.date);
      const isWorked = h.start !== '00:00' || h.end !== '00:00';
      const task = (h.task || '').toLowerCase();
      if (isHoliday && isWorked) feriesTravailles++;
      if (isHoliday && !isWorked) feriesNonTravailles++;
      if (isSunday) dimanches++;
      if (!isWorked && task.includes('congé')) congesPayes++;
    }
    return { feriesTravailles, feriesNonTravailles, dimanches, congesPayes };
  }

  function splitByWeek(list) {
    const weeks = [];
    let currentWeek = [];
    let lastWeekNum = null;
    for (const h of list) {
      const weekNum = getWeekNumber(new Date(h.date));
      if (lastWeekNum !== null && weekNum !== lastWeekNum) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(h);
      lastWeekNum = weekNum;
    }
    if (currentWeek.length) weeks.push(currentWeek);
    return weeks;
  }

  function exportExcel(list = sorted) {
    const data = list.map(h => ({
      Date: formatDateFR(h.date),
      Début: h.start,
      Fin: h.end,
      Pause: h.pause,
      Durée: getDuree(h),
      Tâche: h.task || '',
      Lieu: h.place || ''
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Horaires');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `horaires-${selectedYear}-${selectedMonth.toString().padStart(2, '0')}.xlsx`);
  }

  async function exportPNG(list = sorted) {
    if (!tableRef.current) return;
    try {
      const canvas = await html2canvas(tableRef.current);
      canvas.toBlob(blob => {
        if (blob) {
          saveAs(blob, `horaires-${selectedYear}-${selectedMonth.toString().padStart(2, '0')}.png`);
        }
      }, 'image/png');
    } catch (err) {
      console.error("Erreur lors de l'export PNG (mois) :", err);
    }
  }

  function exportPNGYear() { exportPNG(sortedYear); }

  async function handleExport(opt) {
    setExportOption(opt);
    switch (opt) {
      case 'excel':
        exportExcel();
        break;
      case 'png':
        await exportPNG();
        break;
      case 'excel-year':
        exportExcelYear();
        break;
      case 'png-year':
        await exportPNGYear();
        break;
    }
    setExportOption('');
  }

  const weeks = splitByWeek(sorted);
  const stats = countDetailedSpecialDays(sorted);

  // LOG DEBUG
  console.log('HORAIRES RECUS DANS RECAP', horaires);

  return (
    <div className="recap">
      <h2>Récapitulatif des horaires</h2>
      
      <div className="filters">
        <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
          {[2023, 2024, 2025, 2026, 2027, 2028, 2029].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
            <option key={month} value={month}>
              {new Date(2000, month - 1).toLocaleString('fr-FR', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>

      <div className="export-dropdown">
        <button type="button" className="btn" onClick={() => setDropdownOpen(v => !v)}>
          Exporter ▼
        </button>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <button onClick={() => handleExport('excel')} disabled={exportOption}>Export Excel (mois)</button>
            <button onClick={() => handleExport('png')} disabled={exportOption}>Export PNG (mois)</button>
            <button onClick={() => handleExport('excel-year')} disabled={exportOption}>Export Excel (année)</button>
            <button onClick={() => handleExport('png-year')} disabled={exportOption}>Export PNG (année)</button>
          </div>
        )}
      </div>

      {/* Regroupe stats + tableau pour l'export PNG */}
      <div className="recap-export-container" ref={tableRef}>
        <div className="stats">
          <div>Total heures : {getTotalHeures()}</div>
          <div>Jours fériés travaillés : {stats.feriesTravailles}</div>
          <div>Jours fériés non travaillés : {stats.feriesNonTravailles}</div>
          <div>Dimanches : {stats.dimanches}</div>
          <div>Congés payés : {stats.congesPayes}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Début</th>
              <th>Fin</th>
              <th>Pause</th>
              <th>Durée</th>
              <th>Tâche</th>
              <th>Lieu</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, weekIndex) => (
              <React.Fragment key={weekIndex}>
                {week.map((h, index) => (
                  <tr key={h.date} className={index === 0 ? 'week-start' : ''}>
                    <td>{formatDateFR(h.date)}</td>
                    <td>{h.start}</td>
                    <td>{h.end}</td>
                    <td>{h.pause}</td>
                    <td>{getDuree(h)}</td>
                    <td>
                      {h.task && (h.start === '00:00' && h.end === '00:00' && h.pause === '00:00') ? (
                        <span className="recap-badge recap-badge-special">{h.task}</span>
                      ) : (
                        h.task || ''
                      )}
                    </td>
                    <td>{h.place || ''}</td>
                  </tr>
                ))}
                <tr className="week-total">
                  <td colSpan="4">Total semaine</td>
                  <td>{getTotalHeures(week)}</td>
                  <td colSpan="2"></td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Recap; 