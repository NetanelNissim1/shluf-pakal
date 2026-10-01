const fs = require('fs');
const path = require('path');

const NEW_RIDDLES = [
  {
    id: 'hol-42',
    title: 'ונתנה תוקף',
    holiday: 'יום כיפור',
    difficulty: 'קשה',
    desc: 'ספר פתוח מואר באור יקרות, לידו שופר מוזהב וחותם מלכותי המעניק תוקף לגזירה.',
    formula: '[ספר פתוח] + [שופר מוזהב] + [חותם מלכותי]',
    hint: 'הפיוט המרטיט ביותר בתפילות הימים הנוראים ויום הכיפורים.',
    answer: 'ונתנה תוקף.',
    explanation: 'ספר פתוח ושופר + חותם תוקף = ונתנה תוקף.',
    svgItems: [
      { type: 'open_book', x: 280, y: 260 },
      { type: 'plus', x: 450, y: 275 },
      { type: 'horn', x: 620, y: 260 }
    ]
  },
  {
    id: 'hol-44',
    title: 'סעודה מפסקת',
    holiday: 'יום כיפור',
    difficulty: 'בינוני',
    desc: 'שולחן סעודה ערוך בכל טוב, ולידו שעון שקיעה המורה על רגע הפסקת האכילה.',
    formula: '[שולחן סעודה ערוך] + [שעון שקיעה ועצור]',
    hint: 'הסעודה האחרונה והחגיגית שאוכלים בערב יום הכיפורים לפני כניסת הצום.',
    answer: 'סעודה מפסקת.',
    explanation: 'סעודה + הפסקת אכילה = סעודה מפסקת.',
    svgItems: [
      { type: 'feast_table', x: 280, y: 260 },
      { type: 'plus', x: 450, y: 275 },
      { type: 'stop_clock', x: 620, y: 260 }
    ]
  },
  {
    id: 'hol-46',
    title: 'נענועי לולב',
    holiday: 'סוכות',
    difficulty: 'קל',
    desc: 'שדרת לולב ירוקה ותמירה קשורה בעלי תמר, ומסביבה ארבעה חיצים לארבע רוחות השמיים.',
    formula: '[לולב ירוק תמיר] + [חיצי תנועה לארבע רוחות]',
    hint: 'המצווה לנענע את ארבעת המינים לכל הכיוונים בסוכה ובתפילה.',
    answer: 'נענועי לולב.',
    explanation: 'לולב + חיצי כיוון = נענועי לולב.',
    svgItems: [
      { type: 'green_lulav', x: 280, y: 260 },
      { type: 'plus', x: 450, y: 275 },
      { type: 'compass_arrows', x: 620, y: 260 }
    ]
  },
  {
    id: 'hol-51',
    title: 'קישוטי סוכה',
    holiday: 'סוכות',
    difficulty: 'קל',
    desc: 'שרשרת טבעות נייר צבעונית מסולסלת, פנס מאיר תלוי, ורימון מוזהב מעטר סוכה.',
    formula: '[שרשרת נייר צבעונית] + [פנס זוהר תלוי]',
    hint: 'השרשראות, הרימונים והפנסים שתולים הילדים וההורים מתחת לסכך.',
    answer: 'קישוטי סוכה.',
    explanation: 'שרשרת צבעונית + פנס ורימון = קישוטי סוכה.',
    svgItems: [
      { type: 'paper_chain', x: 280, y: 260 },
      { type: 'plus', x: 450, y: 275 },
      { type: 'hanging_lantern', x: 620, y: 260 }
    ]
  },
  {
    id: 'hol-55',
    title: 'לביבות חמות',
    holiday: 'chanukah',
    holidayName: 'חנוכה',
    difficulty: 'קל',
    desc: 'תפוחי אדמה חומים ומגררת כסופה, ומחבת לוהטת שממנה עולים אדים ולביבות זהובות.',
    formula: '[תפוחי אדמה ומגררת] + [מחבת רוחשת לביבות]',
    hint: 'המאכל המטוגן בשמן ששרים עליו "קמח קמח מן השק, שמן מן הכד...".',
    answer: 'לביבות חמות.',
    explanation: 'תפוחי אדמה + מחבת שמן = לביבות חמות.',
    svgItems: [
      { type: 'potatoes_grater', x: 280, y: 260 },
      { type: 'plus', x: 450, y: 275 },
      { type: 'latkes_pan', x: 620, y: 260 }
    ]
  },
  {
    id: 'hol-59',
    title: 'הנרות הללו',
    holiday: 'chanukah',
    holidayName: 'חנוכה',
    difficulty: 'בינוני',
    desc: 'שמונה נרות דולקים בלהבות צבעוניות זוהרות, וספר פיוטים פתוח באותיות מוארות.',
    formula: '[שמונה להבות נר] + [ספר פיוטים פתוח]',
    hint: 'המזמור הנאמר מיד לאחר הדלקת הנרות: "...אנו מדליקין על הניסים ועל הנפלאות".',
    answer: 'הנרות הללו.',
    explanation: 'נרות דולקים + פיוט = הנרות הללו.',
    svgItems: [
      { type: 'eight_candles', x: 280, y: 260 },
      { type: 'plus', x: 450, y: 275 },
      { type: 'prayer_book', x: 620, y: 260 }
    ]
  },
  {
    id: 'hol-60',
    title: 'יהודה המכבי',
    holiday: 'chanukah',
    holidayName: 'חנוכה',
    difficulty: 'קל',
    desc: 'אריה שואג סמל שבט יהודה, ופטיש ברזל כבד (מקבת) המכה בסלע.',
    formula: '[אריה יהודה] + [מקבת / פטיש קרב]',
    hint: 'המצביא הנועז מנהיג מרד החשמונאים ששחרר את ירושלים וטיהר את בית המקדש.',
    answer: 'יהודה המכבי.',
    explanation: 'אריה יהודה + מקבת (פטיש) = יהודה המכבי.',
    svgItems: [
      { type: 'lion_judah', x: 280, y: 260 },
      { type: 'plus', x: 450, y: 275 },
      { type: 'battle_hammer', x: 620, y: 260 }
    ]
  },
  {
    id: 'hol-63',
    title: 'סדר ט"ו בשבט',
    holiday: 'tu-bishvat',
    holidayName: 'טו בשבט',
    difficulty: 'בינוני',
    desc: 'ארבע כוסות יין בשלל גוונים מלבן ועד אדום עמוק, לצד קערת פירות שבעת המינים.',
    formula: '[ארבע כוסות יין גוונים] + [קערת שבעת המינים]',
    hint: 'המסורת המיוחדת מטבריה וצפת שבה שותים ארבע כוסות יין וטועמים מפירות הארץ.',
    answer: 'סדר ט"ו בשבט.',
    explanation: '4 כוסות יין צבעוניות + פירות הארץ = סדר ט"ו בשבט.',
    svgItems: [
      { type: 'four_wine_glasses', x: 280, y: 260 },
      { type: 'plus', x: 450, y: 275 },
      { type: 'seven_species_plate', x: 620, y: 260 }
    ]
  },
  {
    id: 'hol-64',
    title: 'עץ שתול על מים',
    holiday: 'tu-bishvat',
    holidayName: 'טו בשבט',
    difficulty: 'בינוני',
    desc: 'עץ ירוק רחב צמרת בעל ענפים עמוסי פרי, הנטוע על גדות פלג מים צלול ומפכה.',
    formula: '[עץ עבות פורח] + [פלג מים זורם]',
    hint: 'המשל מתהילים א׳ לאדם צדיק ומבורך: "והיה כעץ שתול על פלגי מים...".',
    answer: 'עץ שתול על מים.',
    explanation: 'עץ פורח + פלג מים = עץ שתול על מים.',
    svgItems: [
      { type: 'tree_of_life', x: 280, y: 260 },
      { type: 'plus', x: 450, y: 275 },
      { type: 'water_stream', x: 620, y: 260 }
    ]
  },
  {
    id: 'hol-69',
    title: 'ונהפך הוא',
    holiday: 'purim',
    holidayName: 'פורים',
    difficulty: 'בינוני',
    desc: 'שני חצים עגולים המתהפכים ב-180 מעלות, ומסכת קרנבל עליזה עם כובע ליצן.',
    formula: '[חצי היפוך 180 מעלות] + [מסכת פורים ותחפושת]',
    hint: 'הפסוק ממגילת אסתר: "אשר נהפך להם מיגון לשמחה ומאבל ליום טוב".',
    answer: 'ונהפך הוא.',
    explanation: 'היפוך חיצים + מסכה ושמחה = ונהפך הוא.',
    svgItems: [
      { type: 'flip_arrows', x: 280, y: 260 },
      { type: 'plus', x: 450, y: 275 },
      { type: 'purim_mask_jester', x: 620, y: 260 }
    ]
  },
  {
    id: 'hol-76',
    title: 'תענית אסתר',
    holiday: 'purim',
    holidayName: 'פורים',
    difficulty: 'קל',
    desc: 'כתר מלכות מוזהב של המלכה אסתר, לצד שמש זורחת וצלחת צום נעולה ללא מזון.',
    formula: '[כתר אסתר המלכה] + [צלחת צום נעולה]',
    hint: 'הצום שנקבע ביום י"ג באדר לזכר שלושת ימי הצום שגזרה אסתר בשושן.',
    answer: 'תענית אסתר.',
    explanation: 'כתר אסתר + צלחת צום = תענית אסתר.',
    svgItems: [
      { type: 'queen_crown', x: 280, y: 260 },
      { type: 'plus', x: 450, y: 275 },
      { type: 'fasting_plate', x: 620, y: 260 }
    ]
  },
  {
    id: 'hol-78',
    title: 'עשר המכות',
    holiday: 'pesach',
    holidayName: 'פסח',
    difficulty: 'קל',
    desc: 'הספרה 10 גדולה באדום בוהק, טיפת דם גדולה וצפרדע ירוקה מקפצת.',
    formula: '[הספרה 10 באדום] + [דם וצפרדע]',
    hint: 'העונשים והאותות שהונחתו על פרעה ומצרים עד שהסכים לשלח את בני ישראל.',
    answer: 'עשר המכות.',
    explanation: '10 + דם וצפרדע = עשר המכות.',
    svgItems: [
      { type: 'number_ten', x: 280, y: 260 },
      { type: 'plus', x: 450, y: 275 },
      { type: 'blood_and_frog', x: 620, y: 260 }
    ]
  },
  {
    id: 'hol-79',
    title: 'חג האביב',
    holiday: 'pesach',
    holidayName: 'פסח',
    difficulty: 'קל',
    desc: 'אלומת שיבולי שעורה ירוקות רעננות, פרפר ססגוני מעופף ופרחי שדה אדומי כלנית.',
    formula: '[שיבולי אביב ירוקות] + [פרפר ופרחי שדה]',
    hint: 'הכינוי המקראי המפורסם של חג הפסח על שם עונת פריחת וחידוש הטבע.',
    answer: 'חג האביב.',
    explanation: 'שיבולים ירוקות + פרחים ופרפר = חג האביב.',
    svgItems: [
      { type: 'green_barley', x: 280, y: 260 },
      { type: 'plus', x: 450, y: 275 },
      { type: 'butterfly_bloom', x: 620, y: 260 }
    ]
  }
];

// Helper to render high quality SVG
function renderGraphic(item) {
  if (item.type === 'plus') {
    return `<text x="${item.x}" y="${item.y}" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>`;
  }

  let inner = '';
  switch (item.type) {
    case 'open_book':
      inner = `
        <rect x="-65" y="-50" width="130" height="95" rx="8" fill="#f8fafc" stroke="#334155" stroke-width="3"/>
        <line x1="0" y1="-50" x2="0" y2="45" stroke="#94a3b8" stroke-width="3"/>
        <line x1="-50" y1="-30" x2="-10" y2="-30" stroke="#cbd5e1" stroke-width="4"/>
        <line x1="-50" y1="-10" x2="-10" y2="-10" stroke="#cbd5e1" stroke-width="4"/>
        <line x1="10" y1="-30" x2="50" y2="-30" stroke="#cbd5e1" stroke-width="4"/>
        <line x1="10" y1="-10" x2="50" y2="-10" stroke="#cbd5e1" stroke-width="4"/>
      `;
      break;

    case 'horn':
      inner = `
        <path d="M-60,50 Q-30,30 -10,0 Q20,-40 70,-30 Q60,-15 15,10 Q-25,35 -50,60 Z" fill="url(#goldGrad)" stroke="#78350f" stroke-width="3"/>
        <circle cx="-55" cy="55" r="8" fill="#451a03"/>
      `;
      break;

    case 'feast_table':
      inner = `
        <rect x="-60" y="-10" width="120" height="20" rx="4" fill="#78350f" stroke="#451a03" stroke-width="3"/>
        <rect x="-50" y="10" width="12" height="50" fill="#78350f"/>
        <rect x="38" y="10" width="12" height="50" fill="#78350f"/>
        <ellipse cx="0" cy="-20" rx="35" ry="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
        <circle cx="-15" cy="-22" r="6" fill="#ef4444"/>
        <circle cx="15" cy="-22" r="7" fill="#f59e0b"/>
        <path d="M-2,-35 L2,-35 L4,-15 L-4,-15 Z" fill="#94a3b8"/>
      `;
      break;

    case 'stop_clock':
      inner = `
        <circle cx="0" cy="5" r="55" fill="#f8fafc" stroke="#dc2626" stroke-width="8"/>
        <circle cx="0" cy="5" r="4" fill="#0f172a"/>
        <line x1="0" y1="5" x2="0" y2="-30" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>
        <line x1="0" y1="5" x2="25" y2="5" stroke="#dc2626" stroke-width="4" stroke-linecap="round"/>
        <polygon points="-15,-55 15,-55 0,-68" fill="#dc2626"/>
      `;
      break;

    case 'rooster':
      inner = `
        <ellipse cx="0" cy="10" rx="45" ry="35" fill="#f8fafc"/>
        <circle cx="35" cy="-15" r="22" fill="#f8fafc"/>
        <path d="M30,-35 C35,-45 45,-45 42,-35 C48,-42 55,-40 50,-30 Z" fill="#ef4444"/>
        <polygon points="55,-15 72,-10 55,-5" fill="#f59e0b"/>
        <path d="M-35,5 C-60,-15 -60,35 -40,30 Z" fill="#22c55e"/>
        <line x1="-15" y1="45" x2="-15" y2="70" stroke="#f59e0b" stroke-width="5"/>
        <line x1="15" y1="45" x2="15" y2="70" stroke="#f59e0b" stroke-width="5"/>
      `;
      break;

    case 'charity_coins':
      inner = `
        <circle cx="-25" cy="15" r="28" fill="url(#goldGrad)" stroke="#b45309" stroke-width="3"/>
        <circle cx="20" cy="-15" r="32" fill="url(#goldGrad)" stroke="#b45309" stroke-width="3"/>
        <circle cx="0" cy="20" r="30" fill="url(#goldGrad)" stroke="#b45309" stroke-width="3"/>
        <text x="0" y="28" font-family="Rubik, sans-serif" font-size="24" font-weight="900" fill="#78350f" text-anchor="middle">צדקה</text>
      `;
      break;

    case 'green_lulav':
      inner = `
        <line x1="0" y1="-80" x2="0" y2="80" stroke="#16a34a" stroke-width="12" stroke-linecap="round"/>
        <line x1="-15" y1="-20" x2="0" y2="30" stroke="#22c55e" stroke-width="6" stroke-linecap="round"/>
        <line x1="15" y1="-20" x2="0" y2="30" stroke="#22c55e" stroke-width="6" stroke-linecap="round"/>
        <line x1="-18" y1="10" x2="0" y2="60" stroke="#15803d" stroke-width="6" stroke-linecap="round"/>
        <line x1="18" y1="10" x2="0" y2="60" stroke="#15803d" stroke-width="6" stroke-linecap="round"/>
        <rect x="-12" y="55" width="24" height="25" fill="#ca8a04" rx="4"/>
      `;
      break;

    case 'compass_arrows':
      inner = `
        <circle cx="0" cy="0" r="60" fill="none" stroke="#e2e8f0" stroke-width="3" stroke-dasharray="4 4"/>
        <polygon points="0,-70 12,-48 -12,-48" fill="#3b82f6"/>
        <polygon points="0,70 12,48 -12,48" fill="#3b82f6"/>
        <polygon points="70,0 48,12 48,-12" fill="#3b82f6"/>
        <polygon points="-70,0 -48,12 -48,-12" fill="#3b82f6"/>
        <line x1="0" y1="-48" x2="0" y2="48" stroke="#3b82f6" stroke-width="4"/>
        <line x1="-48" y1="0" x2="48" y2="0" stroke="#3b82f6" stroke-width="4"/>
        <circle cx="0" cy="0" r="10" fill="#f59e0b"/>
      `;
      break;

    case 'paper_chain':
      inner = `
        <ellipse cx="-45" cy="0" rx="30" ry="18" fill="none" stroke="#ef4444" stroke-width="10" transform="rotate(-20 -45 0)"/>
        <ellipse cx="-15" cy="0" rx="30" ry="18" fill="none" stroke="#3b82f6" stroke-width="10" transform="rotate(20 -15 0)"/>
        <ellipse cx="15" cy="0" rx="30" ry="18" fill="none" stroke="#10b981" stroke-width="10" transform="rotate(-20 15 0)"/>
        <ellipse cx="45" cy="0" rx="30" ry="18" fill="none" stroke="#f59e0b" stroke-width="10" transform="rotate(20 45 0)"/>
      `;
      break;

    case 'hanging_lantern':
      inner = `
        <line x1="0" y1="-80" x2="0" y2="-45" stroke="#94a3b8" stroke-width="3"/>
        <polygon points="-30,-45 30,-45 40,30 -40,30" fill="url(#goldGrad)" stroke="#b45309" stroke-width="4"/>
        <circle cx="0" cy="-5" r="18" fill="#fef08a"/>
        <polygon points="-25,30 25,30 0,65" fill="#b45309"/>
      `;
      break;

    case 'potatoes_grater':
      inner = `
        <rect x="-30" y="-60" width="60" height="90" rx="8" fill="#94a3b8" stroke="#475569" stroke-width="4"/>
        <rect x="-20" y="-50" width="40" height="70" fill="#cbd5e1"/>
        <circle cx="-10" cy="-35" r="3" fill="#334155"/>
        <circle cx="10" cy="-35" r="3" fill="#334155"/>
        <circle cx="0" cy="-20" r="3" fill="#334155"/>
        <circle cx="-10" cy="-5" r="3" fill="#334155"/>
        <circle cx="10" cy="-5" r="3" fill="#334155"/>
        <ellipse cx="40" cy="35" rx="32" ry="24" fill="#a16207" transform="rotate(15 40 35)"/>
        <ellipse cx="-40" cy="40" rx="28" ry="20" fill="#b45309" transform="rotate(-15 -40 40)"/>
      `;
      break;

    case 'latkes_pan':
      inner = `
        <circle cx="0" cy="5" r="60" fill="#334155" stroke="#0f172a" stroke-width="5"/>
        <line x1="45" y1="-40" x2="80" y2="-75" stroke="#1e293b" stroke-width="14" stroke-linecap="round"/>
        <circle cx="-20" cy="-10" r="18" fill="url(#goldGrad)" stroke="#d97706" stroke-width="3"/>
        <circle cx="20" cy="-10" r="18" fill="url(#goldGrad)" stroke="#d97706" stroke-width="3"/>
        <circle cx="0" cy="22" r="18" fill="url(#goldGrad)" stroke="#d97706" stroke-width="3"/>
      `;
      break;

    case 'eight_candles':
      inner = `
        <g transform="translate(-56, 0)">
          <rect x="0" y="0" width="10" height="50" rx="2" fill="url(#blueGrad)"/>
          <path d="M5,-10 Q12,-3 5,0 Q-2,-3 5,-10 Z" fill="#f59e0b"/>
        </g>
        <g transform="translate(-40, 0)">
          <rect x="0" y="0" width="10" height="50" rx="2" fill="url(#blueGrad)"/>
          <path d="M5,-10 Q12,-3 5,0 Q-2,-3 5,-10 Z" fill="#f59e0b"/>
        </g>
        <g transform="translate(-24, 0)">
          <rect x="0" y="0" width="10" height="50" rx="2" fill="url(#blueGrad)"/>
          <path d="M5,-10 Q12,-3 5,0 Q-2,-3 5,-10 Z" fill="#f59e0b"/>
        </g>
        <g transform="translate(-8, 0)">
          <rect x="0" y="0" width="10" height="50" rx="2" fill="url(#blueGrad)"/>
          <path d="M5,-10 Q12,-3 5,0 Q-2,-3 5,-10 Z" fill="#f59e0b"/>
        </g>
        <g transform="translate(8, 0)">
          <rect x="0" y="0" width="10" height="50" rx="2" fill="url(#blueGrad)"/>
          <path d="M5,-10 Q12,-3 5,0 Q-2,-3 5,-10 Z" fill="#f59e0b"/>
        </g>
        <g transform="translate(24, 0)">
          <rect x="0" y="0" width="10" height="50" rx="2" fill="url(#blueGrad)"/>
          <path d="M5,-10 Q12,-3 5,0 Q-2,-3 5,-10 Z" fill="#f59e0b"/>
        </g>
        <g transform="translate(40, 0)">
          <rect x="0" y="0" width="10" height="50" rx="2" fill="url(#blueGrad)"/>
          <path d="M5,-10 Q12,-3 5,0 Q-2,-3 5,-10 Z" fill="#f59e0b"/>
        </g>
        <g transform="translate(56, 0)">
          <rect x="0" y="0" width="10" height="50" rx="2" fill="url(#blueGrad)"/>
          <path d="M5,-10 Q12,-3 5,0 Q-2,-3 5,-10 Z" fill="#f59e0b"/>
        </g>
        <rect x="-65" y="50" width="140" height="10" rx="4" fill="#64748b"/>
      `;
      break;

    case 'prayer_book':
      inner = `
        <rect x="-60" y="-45" width="120" height="90" rx="6" fill="#f8fafc" stroke="#475569" stroke-width="3"/>
        <line x1="0" y1="-45" x2="0" y2="45" stroke="#94a3b8" stroke-width="3"/>
        <text x="-30" y="5" font-family="Rubik, sans-serif" font-size="28" font-weight="900" fill="#3b82f6" text-anchor="middle">פיוט</text>
        <text x="30" y="5" font-family="Rubik, sans-serif" font-size="28" font-weight="900" fill="#3b82f6" text-anchor="middle">שירה</text>
      `;
      break;

    case 'lion_judah':
      inner = `
        <circle cx="0" cy="-5" r="45" fill="url(#goldGrad)" stroke="#b45309" stroke-width="4"/>
        <circle cx="-15" cy="-15" r="6" fill="#451a03"/>
        <circle cx="15" cy="-15" r="6" fill="#451a03"/>
        <polygon points="0,-3 8,8 -8,8" fill="#451a03"/>
        <path d="M-15,18 Q0,30 15,18" stroke="#451a03" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="-45" cy="-35" r="16" fill="#d97706"/>
        <circle cx="45" cy="-35" r="16" fill="#d97706"/>
      `;
      break;

    case 'battle_hammer':
      inner = `
        <line x1="-35" y1="55" x2="35" y2="-25" stroke="#78350f" stroke-width="14" stroke-linecap="round"/>
        <rect x="15" y="-55" width="55" height="35" rx="6" fill="#64748b" stroke="#334155" stroke-width="4" transform="rotate(-30 42 -37)"/>
      `;
      break;

    case 'four_wine_glasses':
      inner = `
        <g transform="translate(-45, 0)">
          <path d="M-12,-35 L12,-35 L10,0 C10,15 -10,15 -10,0 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="3"/>
          <line x1="0" y1="12" x2="0" y2="35" stroke="#94a3b8" stroke-width="4"/>
          <line x1="-12" y1="35" x2="12" y2="35" stroke="#94a3b8" stroke-width="4"/>
        </g>
        <g transform="translate(-15, 0)">
          <path d="M-12,-35 L12,-35 L10,0 C10,15 -10,15 -10,0 Z" fill="#fed7aa" stroke="#f97316" stroke-width="3"/>
          <line x1="0" y1="12" x2="0" y2="35" stroke="#f97316" stroke-width="4"/>
          <line x1="-12" y1="35" x2="12" y2="35" stroke="#f97316" stroke-width="4"/>
        </g>
        <g transform="translate(15, 0)">
          <path d="M-12,-35 L12,-35 L10,0 C10,15 -10,15 -10,0 Z" fill="#fca5a5" stroke="#ef4444" stroke-width="3"/>
          <line x1="0" y1="12" x2="0" y2="35" stroke="#ef4444" stroke-width="4"/>
          <line x1="-12" y1="35" x2="12" y2="35" stroke="#ef4444" stroke-width="4"/>
        </g>
        <g transform="translate(45, 0)">
          <path d="M-12,-35 L12,-35 L10,0 C10,15 -10,15 -10,0 Z" fill="#991b1b" stroke="#7f1d1d" stroke-width="3"/>
          <line x1="0" y1="12" x2="0" y2="35" stroke="#7f1d1d" stroke-width="4"/>
          <line x1="-12" y1="35" x2="12" y2="35" stroke="#7f1d1d" stroke-width="4"/>
        </g>
      `;
      break;

    case 'seven_species_plate':
      inner = `
        <circle cx="0" cy="5" r="60" fill="url(#goldGrad)" stroke="#b45309" stroke-width="4"/>
        <circle cx="-25" cy="-15" r="12" fill="#713f12"/>
        <circle cx="25" cy="-15" r="14" fill="#dc2626"/>
        <circle cx="0" cy="25" r="13" fill="#15803d"/>
        <circle cx="-25" cy="20" r="10" fill="#f59e0b"/>
        <circle cx="25" cy="20" r="11" fill="#ca8a04"/>
      `;
      break;

    case 'tree_of_life':
      inner = `
        <circle cx="0" cy="-15" r="50" fill="url(#greenGrad)" stroke="#047857" stroke-width="3"/>
        <rect x="-12" y="15" width="24" height="45" fill="#78350f" rx="3"/>
      `;
      break;

    case 'water_stream':
      inner = `
        <path d="M-60,-30 C-30,-50 0,-10 30,-30 C60,-50 80,-30 80,-10 C80,10 60,-10 30,10 C0,-10 -30,30 -60,10 Z" fill="url(#blueGrad)"/>
        <path d="M-50,15 C-20,-5 10,35 40,15 C70,-5 80,15 80,35 C80,55 60,35 30,55 C0,35 -30,75 -60,55 Z" fill="url(#cyanGrad)"/>
      `;
      break;

    case 'flip_arrows':
      inner = `
        <path d="M-40,0 A40,40 0 1,1 40,0" fill="none" stroke="#f59e0b" stroke-width="12" stroke-linecap="round"/>
        <polygon points="45,-15 55,10 25,5" fill="#f59e0b"/>
        <path d="M40,25 A40,40 0 1,1 -40,25" fill="none" stroke="#3b82f6" stroke-width="12" stroke-linecap="round"/>
        <polygon points="-45,40 -55,15 -25,20" fill="#3b82f6"/>
        <text x="0" y="18" font-family="Rubik, sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">180°</text>
      `;
      break;

    case 'purim_mask_jester':
      inner = `
        <path d="M-60,-10 Q0,-45 60,-10 Q35,45 0,25 Q-35,45 -60,-10 Z" fill="url(#purpleGrad)" stroke="#581c87" stroke-width="4"/>
        <ellipse cx="-25" cy="-2" rx="14" ry="9" fill="#ffffff"/>
        <ellipse cx="25" cy="-2" rx="14" ry="9" fill="#ffffff"/>
        <circle cx="-25" cy="-2" r="5" fill="#0f172a"/>
        <circle cx="25" cy="-2" r="5" fill="#0f172a"/>
      `;
      break;

    case 'queen_crown':
      inner = `
        <path d="M-55,30 L-65,-30 L-25,-5 L0,-45 L25,-5 L65,-30 L55,30 Z" fill="url(#goldGrad)" stroke="#b45309" stroke-width="4"/>
        <circle cx="-65" cy="-30" r="7" fill="#ef4444"/>
        <circle cx="0" cy="-45" r="9" fill="#3b82f6"/>
        <circle cx="65" cy="-30" r="7" fill="#ef4444"/>
        <circle cx="0" cy="15" r="8" fill="#10b981"/>
      `;
      break;

    case 'fasting_plate':
      inner = `
        <circle cx="0" cy="0" r="65" fill="#f8fafc" stroke="#94a3b8" stroke-width="4"/>
        <circle cx="0" cy="0" r="45" fill="none" stroke="#e2e8f0" stroke-width="3"/>
        <line x1="-55" y1="-55" x2="55" y2="55" stroke="#ef4444" stroke-width="10" stroke-linecap="round"/>
      `;
      break;

    case 'number_ten':
      inner = `
        <rect x="-65" y="-75" width="130" height="150" rx="20" fill="url(#cardGrad)" stroke="#ef4444" stroke-width="4"/>
        <text x="0" y="38" font-family="Rubik, system-ui, sans-serif" font-size="76" font-weight="900" fill="url(#redGrad)" text-anchor="middle">10</text>
      `;
      break;

    case 'blood_and_frog':
      inner = `
        <path d="M-35,30 C-60,30 -60,-10 -35,-40 C-10,-10 -10,30 -35,30 Z" fill="url(#redGrad)"/>
        <ellipse cx="35" cy="15" rx="30" ry="22" fill="#22c55e" stroke="#15803d" stroke-width="3"/>
        <circle cx="22" cy="-5" r="9" fill="#15803d"/>
        <circle cx="48" cy="-5" r="9" fill="#15803d"/>
        <circle cx="22" cy="-5" r="4" fill="#0f172a"/>
        <circle cx="48" cy="-5" r="4" fill="#0f172a"/>
      `;
      break;

    case 'green_barley':
      inner = `
        <line x1="-15" y1="65" x2="-15" y2="-55" stroke="#16a34a" stroke-width="6" stroke-linecap="round"/>
        <ellipse cx="-15" cy="-45" rx="8" ry="18" fill="#4ade80"/>
        <ellipse cx="-25" cy="-25" rx="7" ry="14" fill="#22c55e" transform="rotate(-30 -25 -25)"/>
        <ellipse cx="-5" cy="-25" rx="7" ry="14" fill="#22c55e" transform="rotate(30 -5 -25)"/>
        <ellipse cx="-25" cy="-5" rx="7" ry="14" fill="#16a34a" transform="rotate(-30 -25 -5)"/>
        <ellipse cx="-5" cy="-5" rx="7" ry="14" fill="#16a34a" transform="rotate(30 -5 -5)"/>
        <line x1="20" y1="65" x2="20" y2="-45" stroke="#16a34a" stroke-width="6" stroke-linecap="round"/>
        <ellipse cx="20" cy="-35" rx="8" ry="18" fill="#4ade80"/>
        <ellipse cx="10" cy="-15" rx="7" ry="14" fill="#22c55e" transform="rotate(-30 10 -15)"/>
        <ellipse cx="30" cy="-15" rx="7" ry="14" fill="#22c55e" transform="rotate(30 30 -15)"/>
      `;
      break;

    case 'butterfly_bloom':
      inner = `
        <path d="M-40,0 C-70,-40 0,-40 -20,0 C0,30 -60,40 -40,0 Z" fill="url(#cyanGrad)"/>
        <path d="M0,0 C30,-40 -40,-40 -20,0 C-40,30 20,40 0,0 Z" fill="url(#cyanGrad)" transform="scale(-1, 1) translate(-40, 0)"/>
        <line x1="-20" y1="-25" x2="-20" y2="25" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
        <circle cx="35" cy="20" r="22" fill="#ef4444"/>
        <circle cx="35" cy="20" r="9" fill="#fef08a"/>
      `;
      break;

    default:
      inner = `<circle cx="0" cy="0" r="45" fill="url(#goldGrad)"/>`;
      break;
  }

  return `
    <g transform="translate(${item.x}, ${item.y})" filter="url(#shadow)">
      ${inner}
    </g>`;
}

function buildSvg(riddle) {
  const rendered = riddle.svgItems.map(renderGraphic).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 550" width="100%" height="100%" class="rebus-svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18181b"/>
      <stop offset="100%" stop-color="#09090b"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#27272a"/>
      <stop offset="100%" stop-color="#18181b"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f87171"/>
      <stop offset="100%" stop-color="#dc2626"/>
    </linearGradient>
    <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#7e22ce"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="900" height="550" rx="24" fill="url(#bgGrad)" stroke="#3f3f46" stroke-width="3"/>
  <rect x="15" y="15" width="870" height="520" rx="18" fill="none" stroke="#27272a" stroke-width="1.5" stroke-dasharray="6 6"/>

  <!-- Content Graphics Area -->
  ${rendered}
</svg>`;
}

// 1. Write SVGs
const svgDir = path.join(__dirname, '..', 'public', 'assets', 'visual_riddles');
NEW_RIDDLES.forEach(r => {
  const filePath = path.join(svgDir, `${r.id}.svg`);
  const svg = buildSvg(r);
  fs.writeFileSync(filePath, svg, 'utf8');
  console.log(`Generated SVG for ${r.id}: ${r.title}`);
});

// 2. Update content/visual_riddles_database.md
const mdPath = path.join(__dirname, '..', 'content', 'visual_riddles_database.md');
let mdContent = fs.readFileSync(mdPath, 'utf8');

NEW_RIDDLES.forEach(r => {
  // Regex to match the block starting from #### חידה ... up to the next #### or ---
  const pattern = new RegExp(`(#### [^\n]+?\\n\\* \\*\\*מזהה \\(ID\\):\\*\\* \`${r.id}\`[\\s\\S]*?)(?=(####|##|---|$))`);
  const match = mdContent.match(pattern);
  if (match) {
    const holidayDisplayName = r.holidayName || r.holiday;
    const newBlock = `#### חידה: ${r.title}\n* **מזהה (ID):** \`${r.id}\`\n* **קטגוריה ראשית:** \`חגי ישראל\` | **חג:** \`${holidayDisplayName}\` | **רמת קושי:** \`${r.difficulty}\`\n* **תיאור הציור למאייר/AI:** ${r.desc}\n* **נוסחת הרבוס:** \`${r.formula}\`\n* **רמז:** ${r.hint}\n* **פתרון:** ${r.answer}\n* **הסבר חזותי:** ${r.explanation}\n\n`;
    mdContent = mdContent.replace(match[1], newBlock);
    console.log(`Updated markdown block for ${r.id}: ${r.title}`);
  } else {
    console.warn(`Could not find block for ${r.id} in markdown`);
  }
});

fs.writeFileSync(mdPath, mdContent, 'utf8');
console.log('Successfully updated content/visual_riddles_database.md!');
