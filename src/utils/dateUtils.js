/**
 * @fileoverview Utilitaires pour la gestion des dates et des jours fériés
 * @module dateUtils
 */

export function getFrenchHolidays(year) {
  const holidays = [
    `${year}-01-01`, // Jour de l'an
    `${year}-05-01`, // Fête du Travail
    `${year}-05-08`, // Victoire 1945
    `${year}-07-14`, // Fête nationale
    `${year}-08-15`, // Assomption
    `${year}-11-01`, // Toussaint
    `${year}-11-11`, // Armistice
    `${year}-12-25`, // Noël
  ];
  const easter = getEasterDate(year);
  const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };
  holidays.push(addDays(easter, 1)); // Lundi de Pâques
  holidays.push(addDays(easter, 39)); // Ascension
  holidays.push(addDays(easter, 50)); // Lundi de Pentecôte
  return holidays;
}

export function getEasterDate(year) {
  const f = Math.floor,
    G = year % 19,
    C = f(year / 100),
    H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
    I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
    J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
    L = I - J,
    month = 3 + f((L + 40) / 44),
    day = L + 28 - 31 * f(month / 4);
  return new Date(year, month - 1, day);
}

/**
 * Récupère les jours fériés pour une année donnée
 * @param {number} annee - Année à analyser
 * @returns {Promise<Array>} Liste des jours fériés
 */
export function getFrenchHolidaysMulti(years) {
  let all = [];
  for (let y = years.start; y <= years.end; y++) {
    all = all.concat(getFrenchHolidays(y));
  }
  return all;
}

/**
 * Formate une date au format français (JJ/MM/AAAA)
 * @param {Date} date - Date à formater
 * @returns {string} Date formatée
 */
export function formatDateFR(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}-${m}-${y}`;
}

/**
 * Récupère le numéro de semaine pour une date donnée
 * @param {Date} date - Date à analyser
 * @returns {number} Numéro de semaine
 */
export function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}

/**
 * Vérifie si une date est un jour férié
 * @param {string} date - Date au format YYYY-MM-DD
 * @param {Array} joursFeries - Liste des jours fériés (YYYY-MM-DD)
 * @returns {boolean} True si la date est un jour férié
 */
export const estJourFerie = (date, joursFeries) => {
  return joursFeries.includes(date);
}

/**
 * Calcule le nombre d'heures entre deux horaires (hh:mm)
 * @param {string} debut - Heure de début (hh:mm)
 * @param {string} fin - Heure de fin (hh:mm)
 * @returns {number} Nombre d'heures (décimal)
 */
export const calculerHeures = (debut, fin) => {
  const [h1, m1] = debut.split(':').map(Number);
  const [h2, m2] = fin.split(':').map(Number);
  return (h2 + m2 / 60) - (h1 + m1 / 60);
} 