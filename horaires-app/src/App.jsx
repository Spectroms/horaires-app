import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { MdHome, MdEditCalendar, MdListAlt, MdSettings } from 'react-icons/md';
import './App.css';
import { useState, useEffect, useRef } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { auth } from './firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';

function Logo() {
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

function Accueil() {
  return (
    <div className="accueil">
      <Logo />
      <h2>Bienvenue sur Horaires !</h2>
      <p>Note facilement tes heures, tâches et lieux chaque jour.<br/>Tout est sauvegardé et exportable.</p>
      <Link to="/saisie" className="btn">Commencer</Link>
    </div>
  );
}

function getFrenchHolidays(year) {
  // Jours fixes
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
  // Pâques et jours mobiles
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

function getEasterDate(year) {
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

// Génère les jours fériés pour plusieurs années
function getFrenchHolidaysMulti(years) {
  let all = [];
  for (let y = years.start; y <= years.end; y++) {
    all = all.concat(getFrenchHolidays(y));
  }
  return all;
}

function Saisie({ onSave, horaires }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [start, setStart] = useState('08:00');
  const [end, setEnd] = useState('16:30');
  const [pause, setPause] = useState('01:00');
  const [task, setTask] = useState('');
  const [place, setPlace] = useState('');
  const [message, setMessage] = useState('');

  const year = Number(date.slice(0, 4));
  const holidays = getFrenchHolidaysMulti({ start: 2024, end: 2029 });
  const isSunday = new Date(date).getDay() === 0;
  const isHoliday = holidays.includes(date);

  // Nouveau : calcul du jour de la semaine
  const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const jourSemaine = jours[new Date(date).getDay()];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Vérifie si un horaire existe déjà pour cette date
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
    <div className="saisie">
      <h2>Saisie d'une journée</h2>
      <div className="info-jour-special" style={{marginBottom: (isSunday || isHoliday) ? '0.5rem' : '2rem'}}>
        {jourSemaine}
      </div>
      {(isHoliday && !isSunday) && (
        <div className="info-jour-special">
          Jour férié
        </div>
      )}
      <form onSubmit={handleSubmit} className="form-horaires">
        <label>
          Date
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </label>
        <label>
          Début
          <input type="time" value={start} onChange={e => setStart(e.target.value)} required />
        </label>
        <label>
          Fin
          <input type="time" value={end} onChange={e => setEnd(e.target.value)} required />
        </label>
        <label>
          Pause (hh:mm)
          <input type="time" value={pause} onChange={e => setPause(e.target.value)} step="60" />
        </label>
        <label>
          Tâche
          <input type="text" value={task} onChange={e => setTask(e.target.value)} placeholder="Ex : livraison, réunion..." />
        </label>
        <label>
          Lieu
          <input type="text" value={place} onChange={e => setPlace(e.target.value)} placeholder="Ex : Lyon, Marseille..." />
        </label>
        <button type="submit" className="btn">Enregistrer</button>
        {message && <div className="msg-success">{message}</div>}
      </form>
    </div>
  );
}

// Ajout d'une fonction utilitaire pour formater les dates en JJ-MM-AAAA
function formatDateFR(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}-${m}-${y}`;
}

function Recap({ horaires, setHoraires }) {
  const tableRef = useRef(null);
  // Ajout du sélecteur de mois/année
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [exportOption, setExportOption] = useState('');
  const [importMsg, setImportMsg] = useState('');

  // Filtrage des horaires selon le mois/année sélectionné
  const filtered = horaires.filter(h => {
    const [y, m] = h.date.split('-');
    return Number(y) === Number(selectedYear) && Number(m) === Number(selectedMonth);
  });
  // Pour l'année entière
  const filteredYear = horaires.filter(h => {
    const [y] = h.date.split('-');
    return Number(y) === Number(selectedYear);
  });

  // Trie les horaires par date
  const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date));
  const sortedYear = [...filteredYear].sort((a, b) => a.date.localeCompare(b.date));

  // Calcule la durée d'une journée (en heures et minutes)
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

  // Calcule le total d'heures d'une liste (en minutes)
  function getTotalMinutes(list) {
    let total = 0;
    for (const h of list) {
      if (h.start === '00:00' && h.end === '00:00' && h.pause === '00:00') continue;
      const [sh, sm] = h.start.split(':').map(Number);
      const [eh, em] = h.end.split(':').map(Number);
      const [ph, pm] = h.pause.split(':').map(Number);
      let duree = (eh * 60 + em) - (sh * 60 + sm) - (ph * 60 + pm);
      total += duree;
    }
    return total;
  }

  // Calcule le total d'heures (format texte)
  function getTotalHeures(list = sorted) {
    const total = getTotalMinutes(list);
    const h = Math.floor(total / 60);
    const m = total % 60;
    return `${h}h${m.toString().padStart(2, '0')}`;
  }

  // Nouvelle fonction pour compter les jours spéciaux détaillés
  function countDetailedSpecialDays(list) {
    let feriesTravailles = 0, feriesNonTravailles = 0, dimanches = 0, congesPayes = 0;
    for (const h of list) {
      const isHoliday = holidays.includes(h.date);
      const isSunday = new Date(h.date).getDay() === 0;
      const isWorked = !(h.start === '00:00' && h.end === '00:00' && h.pause === '00:00');
      const task = (h.task || '').toLowerCase();
      if (isHoliday) {
        if (isWorked) feriesTravailles++;
        else feriesNonTravailles++;
      }
      if (isSunday) dimanches++;
      if (!isWorked && task.includes('congé')) congesPayes++;
    }
    return { feriesTravailles, feriesNonTravailles, dimanches, congesPayes };
  }

  // Découpe la liste par semaine (lundi-dimanche)
  function splitByWeek(list) {
    const weeks = [];
    let currentWeek = [];
    let lastWeekNum = null;
    for (const h of list) {
      const d = new Date(h.date);
      const weekNum = getWeekNumber(d);
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
  // Calcule le numéro de semaine ISO (lundi = premier jour)
  function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
  }

  // ... jours spéciaux ...
  const holidays = getFrenchHolidaysMulti({ start: 2023, end: 2029 });

  // Pour l'affichage et l'export : on découpe par semaine
  const weeks = splitByWeek(sorted);

  // Export Excel/PDF/JPG avec colonne Durée et totaux par semaine
  function exportExcel(list = sorted) {
    const weeks = splitByWeek(list);
    let data = [];
    for (const week of weeks) {
      for (const h of week) {
        data.push({
          Date: formatDateFR(h.date),
          Début: h.start,
          Fin: h.end,
          Pause: h.pause,
          Tâche: h.task,
          Lieu: h.place,
          Spécial: (new Date(h.date).getDay() === 0 ? 'Dimanche ' : '') + (holidays.includes(h.date) ? 'Férié' : ''),
          Durée: getDuree(h)
        });
      }
      // Ajoute une ligne de total de la semaine
      data.push({ Date: '', Début: '', Fin: '', Pause: '', Tâche: '', Lieu: '', Spécial: 'Total semaine', Durée: getTotalHeures(week) });
    }
    // Ajoute le total jours spéciaux détaillé et le total d'heures
    const { feriesTravailles, feriesNonTravailles, dimanches, congesPayes } = countDetailedSpecialDays(list);
    data.push({ Date: '', Début: '', Fin: '', Pause: '', Tâche: '', Lieu: '', Spécial: 'Total heures', Durée: getTotalHeures(list) });
    data.push({ Date: '', Début: '', Fin: '', Pause: '', Tâche: '', Lieu: '', Spécial: 'Fériés travaillés', Durée: feriesTravailles });
    data.push({ Date: '', Début: '', Fin: '', Pause: '', Tâche: '', Lieu: '', Spécial: 'Fériés non travaillés', Durée: feriesNonTravailles });
    data.push({ Date: '', Début: '', Fin: '', Pause: '', Tâche: '', Lieu: '', Spécial: 'Dimanches', Durée: dimanches });
    data.push({ Date: '', Début: '', Fin: '', Pause: '', Tâche: '', Lieu: '', Spécial: 'Congés payés', Durée: congesPayes });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Horaires');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), `horaires_${selectedYear}_${String(selectedMonth).padStart(2, '0')}.xlsx`);
  }

  async function exportPDF(list = sorted) {
    if (!tableRef.current) return;
    // Le PDF sera fidèle au tableau affiché (avec colonne Durée et totaux par semaine)
    const canvas = await html2canvas(tableRef.current, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`horaires_${selectedYear}_${String(selectedMonth).padStart(2, '0')}.pdf`);
  }

  async function exportJPG(list = sorted) {
    if (!tableRef.current) return;
    const canvas = await html2canvas(tableRef.current, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true
    });
    canvas.toBlob((blob) => {
      saveAs(blob, `horaires_${selectedYear}_${String(selectedMonth).padStart(2, '0')}.jpg`);
    }, 'image/jpeg', 0.95);
  }

  async function exportPDFYear() { await exportPDF(sortedYear); }
  async function exportJPGYear() { await exportJPG(sortedYear); }
  function exportExcelYear() { exportExcel(sortedYear); }

  // Générer la liste des années/mois disponibles
  const allYears = Array.from(new Set(horaires.map(h => h.date.split('-')[0]))).sort();
  const allMonths = [1,2,3,4,5,6,7,8,9,10,11,12];

  // Nouvelle fonction d'export unique
  async function handleExport(opt) {
    const option = opt || exportOption;
    if (option === 'mois-excel') exportExcel(sorted);
    else if (option === 'mois-jpg') await exportJPG(sorted);
    else if (option === 'annee-excel') exportExcel(sortedYear);
    else if (option === 'annee-jpg') await exportJPG(sortedYear);
  }

  // Affichage du tableau avec colonne Durée, totaux par semaine et jours spéciaux
  const { feriesTravailles, feriesNonTravailles, dimanches, congesPayes } = countDetailedSpecialDays(sorted);

  return (
    <div className="recap">
      <h2>Récapitulatif</h2>
      <div className="recap-filtres">
        <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
          {allYears.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}>
          {allMonths.map(m => <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>)}
        </select>
      </div>
      <div className="total-heures">Total : {getTotalHeures(sorted)}</div>
      <div className="export-buttons compact">
        <select
          value={exportOption}
          onChange={e => {
            setExportOption(e.target.value);
            if (e.target.value) setTimeout(() => handleExport(e.target.value), 0);
          }}
          className="export-select export-btn-style"
        >
          <option value="">Exporter</option>
          <option value="mois-excel">Exporter le mois en Excel</option>
          <option value="mois-jpg">Exporter le mois en JPG</option>
          <option value="annee-excel">Exporter l'année en Excel</option>
          <option value="annee-jpg">Exporter l'année en JPG</option>
        </select>
      </div>
      <div className="table-container">
        <table className="table-recap" ref={tableRef}>
          <thead>
            <tr>
              <th>Date</th><th>Début</th><th>Fin</th><th>Pause</th><th>Tâche</th><th>Lieu</th><th>Spécial</th><th>Durée</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, widx) => [
              ...week.map((h, i) => {
                const isSunday = new Date(h.date).getDay() === 0;
                const isHoliday = holidays.includes(h.date);
                // Détermine le texte à afficher dans Spécial
                let special = '';
                if ((h.task || '').toLowerCase().includes('férié')) special = 'Férié';
                else if ((h.task || '').toLowerCase().includes('congé')) special = 'Congé payé';
                else if ((h.task || '').toLowerCase().includes('récup')) special = 'Récup';
                else if (isSunday) special = 'Dimanche';
                else if (isHoliday) special = 'Férié';
                // La colonne Tâche ne doit plus contenir ces mentions
                const tache = (special === '' ? h.task : '');
                return (
                  <tr key={h.date + '-' + i} className={isSunday || isHoliday ? 'special' : ''}>
                    <td>{formatDateFR(h.date)}</td>
                    <td>{h.start}</td>
                    <td>{h.end}</td>
                    <td>{h.pause}</td>
                    <td>{tache}</td>
                    <td>{h.place}</td>
                    <td>{special}</td>
                    <td>{getDuree(h)}</td>
                  </tr>
                );
              }),
              // Ligne de total de la semaine
              <tr key={'total-week-' + widx} style={{ background: '#fffde7', fontWeight: 600 }}>
                <td colSpan={1} style={{ textAlign: 'left' }}>Total semaine</td>
                <td colSpan={6}></td>
                <td>{getTotalHeures(week)}</td>
              </tr>
            ])}
            {/* Ligne de total heures */}
            <tr style={{ background: '#fffde7', fontWeight: 600 }}>
              <td colSpan={1} style={{ textAlign: 'left' }}>Total heures</td>
              <td colSpan={6}></td>
              <td>{getTotalHeures(sorted)}</td>
            </tr>
            {/* Ligne de total jours spéciaux */}
            <tr style={{ background: '#fffde7', fontWeight: 600 }}>
              <td colSpan={1} style={{ textAlign: 'left' }}>Jours spéciaux</td>
              <td colSpan={6}>{feriesTravailles} férié(s) travaillé(s), {feriesNonTravailles} férié(s) non travaillé(s), {dimanches} dimanche(s), {congesPayes} congé(s) payé(s)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Parametres({ darkMode, setDarkMode }) {
  const [notifActive, setNotifActive] = useState(() => {
    const stored = localStorage.getItem('notifRappel');
    if (stored === null) {
      localStorage.setItem('notifRappel', 'true');
      return true;
    }
    return stored === 'true';
  });
  const [heure, setHeure] = useState(() => {
    return localStorage.getItem('heureRappel') || '17:00';
  });

  function handleNotifChange(e) {
    const value = e.target.checked;
    setNotifActive(value);
    localStorage.setItem('notifRappel', value);
    if (value) {
      Notification.requestPermission();
    }
  }

  function handleHeureChange(e) {
    setHeure(e.target.value);
    localStorage.setItem('heureRappel', e.target.value);
  }

  function handleDarkModeChange(e) {
    setDarkMode(e.target.checked);
  }

  return (
    <div className="parametres">
      <h2>Paramètres</h2>
      <div style={{margin: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem', justifyContent: 'center'}}>
        <label>
          <input type="checkbox" checked={darkMode} onChange={handleDarkModeChange} />
          Activer le mode sombre
        </label>
        <label>
          <input type="checkbox" checked={notifActive} onChange={handleNotifChange} />
          Activer le rappel quotidien
        </label>
        <label>
          Heure du rappel&nbsp;:
          <input type="time" value={heure} onChange={handleHeureChange} style={{marginLeft: '0.7em', fontSize: '1.05em', borderRadius: '8px', border: '1.5px solid #ffe066', background: '#fffde7', padding: '0.3em 0.7em'}} />
        </label>
      </div>
      <p>Notifications de rappel : <b style={{color: notifActive ? '#388e3c' : '#b71c1c'}}>{notifActive ? 'activées' : 'désactivées'}</b> à <b>{heure}</b></p>
    </div>
  );
}

function BottomNav() {
  const location = useLocation();
  const navItems = [
    { to: '/', label: 'Accueil', icon: <MdHome size={24} /> },
    { to: '/saisie', label: 'Saisie', icon: <MdEditCalendar size={24} /> },
    { to: '/recap', label: 'Récap', icon: <MdListAlt size={24} /> },
    { to: '/parametres', label: 'Paramètres', icon: <MdSettings size={24} /> },
  ];
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={location.pathname === item.to ? 'active' : ''}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

function Connexion({ user, setUser }) {
  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };
  const handleLogout = async () => {
    await signOut(auth);
  };
  return (
    <div className="connexion">
      {user ? (
        <>
          <div className="user-info">Connecté en tant que <b>{user.displayName || user.email}</b></div>
          <button className="btn" onClick={handleLogout}>Se déconnecter</button>
        </>
      ) : (
        <button className="btn" onClick={handleGoogle}>Connexion Google</button>
      )}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [horaires, setHoraires] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    return stored === 'true';
  });
  const db = getFirestore();

  // Effet pour gérer le mode sombre
  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Active notifications par défaut et demande la permission dès l'ouverture
  useEffect(() => {
    if (localStorage.getItem('notifRappel') === null) {
      localStorage.setItem('notifRappel', 'true');
    }
    if (Notification && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  // Charge les horaires depuis Firestore au chargement de l'utilisateur
  useEffect(() => {
    if (user) {
      const userDoc = doc(db, 'users', user.uid);
      getDoc(userDoc).then(docSnap => {
        if (docSnap.exists() && docSnap.data().horaires) {
          const horairesFromFirebase = docSnap.data().horaires;
          // Trie les horaires par date
          horairesFromFirebase.sort((a, b) => a.date.localeCompare(b.date));
          setHoraires(horairesFromFirebase);
        }
      }).catch(error => console.error("Erreur lors du chargement des horaires:", error));
    }
  }, [user, db]);

  // Sauvegarde les horaires dans Firestore quand ils changent
  useEffect(() => {
    if (user && horaires.length > 0) {
      const userDoc = doc(db, 'users', user.uid);
      setDoc(userDoc, { horaires }, { merge: true })
        .catch(error => console.error("Erreur lors de la sauvegarde des horaires:", error));
    }
  }, [horaires, user, db]);

  useEffect(() => {
    const notifActive = localStorage.getItem('notifRappel') === 'true';
    const heure = localStorage.getItem('heureRappel') || '17:00';
    if (!notifActive || Notification.permission !== 'granted') return;
    const [h, m] = heure.split(':').map(Number);
    // Vérifie l'heure toutes les minutes
    const interval = setInterval(() => {
      const now = new Date();
      const isWorkday = now.getDay() >= 1 && now.getDay() <= 5;
      const isHeure = now.getHours() === h && now.getMinutes() === m;
      if (isWorkday && isHeure) {
        const lastNotif = localStorage.getItem('lastNotifRappel');
        const today = now.toISOString().slice(0,10);
        if (lastNotif !== today) {
          new Notification("N'oublie pas de saisir tes heures !", {
            body: 'Pense à enregistrer ta journée dans Horaires.',
            icon: '/favicon.ico'
          });
          localStorage.setItem('lastNotifRappel', today);
        }
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  if (!user) {
    return <Connexion user={user} setUser={setUser} />;
  }

  // Nouvelle logique pour écraser l'horaire si la date existe déjà
  const handleSaveHoraire = (h) => {
    setHoraires(prev => {
      const idx = prev.findIndex(x => x.date === h.date);
      if (idx !== -1) {
        // Remplace l'ancien horaire
        const copie = [...prev];
        copie[idx] = h;
        return copie;
      }
      return [...prev, h];
    });
  };

  return (
    <Router>
      <div className={`app-content ${darkMode ? 'dark-mode' : ''}`}>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/saisie" element={<Saisie onSave={handleSaveHoraire} horaires={horaires} />} />
          <Route path="/recap" element={<Recap horaires={horaires} setHoraires={setHoraires} />} />
          <Route path="/parametres" element={<Parametres darkMode={darkMode} setDarkMode={setDarkMode} />} />
        </Routes>
      </div>
      <BottomNav />
    </Router>
  );
}

export default App;
