const fs = require('fs');
const path = require('path');

const TARGET_DIR = path.join(__dirname, '..', 'public', 'assets', 'visual_riddles');

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

function createSvg(elements, plusSigns = true) {
  const count = elements.length;
  // Calculate X positions
  let xPositions = [];
  if (count === 1) {
    xPositions = [450];
  } else if (count === 2) {
    xPositions = [260, 640];
  } else if (count === 3) {
    xPositions = [190, 450, 710];
  } else if (count === 4) {
    xPositions = [140, 340, 540, 740];
  }

  let content = '';

  elements.forEach((el, idx) => {
    const x = xPositions[idx];
    const y = 250;
    content += `
  <!-- Element ${idx + 1}: ${el.label} -->
  <g transform="translate(${x}, ${y})" filter="url(#shadow)">
    ${el.svg}
  </g>`;

    if (plusSigns && idx < count - 1) {
      const nextX = xPositions[idx + 1];
      const midX = (x + nextX) / 2;
      content += `\n  <text x="${midX}" y="270" font-family="system-ui, sans-serif" font-size="52" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>`;
    }
  });

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
  ${content}
</svg>`;
}

const riddlesData = [
  // 16 Holiday Riddles
  {
    id: 'hol-19',
    elements: [
      {
        label: 'שׁוֹפָר (אַיִל)',
        color: '#fbbf24',
        svg: `<path d="M-60,30 Q-20,35 10,0 Q35,-30 65,-40 Q55,-10 30,10 Q-10,40 -60,30 Z" fill="url(#goldGrad)" stroke="#78350f" stroke-width="3"/>
              <ellipse cx="65" cy="-40" rx="10" ry="18" fill="#451a03"/>
              <ellipse cx="-60" cy="30" rx="4" ry="7" fill="#78350f"/>`
      },
      {
        label: 'תְּקִיעָה (תָּוִים)',
        color: '#60a5fa',
        svg: `<circle cx="0" cy="0" r="75" fill="#0f172a" stroke="#3b82f6" stroke-width="3"/>
              <path d="M-30,20 L-30,-20 L20,-35 L20,5" stroke="#60a5fa" stroke-width="5" fill="none"/>
              <ellipse cx="-40" cy="20" rx="15" ry="10" fill="#60a5fa"/>
              <ellipse cx="10" cy="5" rx="15" ry="10" fill="#60a5fa"/>`
      }
    ]
  },
  {
    id: 'hol-20',
    elements: [
      {
        label: 'כַּרְטִיס (מַעֲטָפָה)',
        color: '#60a5fa',
        svg: `<rect x="-70" y="-45" width="140" height="90" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
              <polygon points="-70,-45 0,10 70,-45" fill="none" stroke="#38bdf8" stroke-width="3"/>
              <rect x="25" y="-35" width="35" height="40" fill="#f59e0b" rx="2"/>`
      },
      {
        label: 'בְּרָכָה (כּוֹכָב זוֹהֵר)',
        color: '#fbbf24',
        svg: `<polygon points="0,-65 18,-18 65,-18 28,12 42,60 0,30 -42,60 -28,12 -65,-18 -18,-18" fill="url(#goldGrad)" stroke="#78350f" stroke-width="2"/>
              <circle cx="0" cy="0" r="18" fill="#fef08a"/>`
      }
    ]
  },
  {
    id: 'hol-21',
    elements: [
      {
        label: 'צוֹם (פֶּה חָתוּם)',
        color: '#f87171',
        svg: `<circle cx="0" cy="0" r="75" fill="#1e1b4b" stroke="#ef4444" stroke-width="3"/>
              <circle cx="-25" cy="-20" r="8" fill="#ef4444"/>
              <circle cx="25" cy="-20" r="8" fill="#ef4444"/>
              <line x1="-35" y1="25" x2="35" y2="25" stroke="#f87171" stroke-width="6"/>
              <line x1="-20" y1="15" x2="-20" y2="35" stroke="#f87171" stroke-width="3"/>
              <line x1="0" y1="15" x2="0" y2="35" stroke="#f87171" stroke-width="3"/>
              <line x1="20" y1="15" x2="20" y2="35" stroke="#f87171" stroke-width="3"/>`
      },
      {
        label: 'קַל (נוֹצָה)',
        color: '#34d399',
        svg: `<path d="M-40,50 Q-10,0 45,-55 Q20,-20 -5,20 Z" fill="url(#greenGrad)" stroke="#065f46" stroke-width="2"/>
              <line x1="-50" y1="65" x2="45" y2="-55" stroke="#d1fae5" stroke-width="3"/>`
      }
    ]
  },
  {
    id: 'hol-22',
    elements: [
      {
        label: 'סֵפֶר',
        color: '#60a5fa',
        svg: `<path d="M-70,30 Q-20,20 0,35 Q20,20 70,30 L70,-40 Q20,-50 0,-35 Q-20,-50 -70,-40 Z" fill="#1e293b" stroke="#60a5fa" stroke-width="3"/>
              <line x1="0" y1="-35" x2="0" y2="35" stroke="#60a5fa" stroke-width="3"/>`
      },
      {
        label: 'הַחַיִּים (עֵץ)',
        color: '#34d399',
        svg: `<rect x="-12" y="10" width="24" height="60" fill="#78350f" rx="3"/>
              <circle cx="0" cy="-20" r="55" fill="url(#greenGrad)"/>
              <circle cx="-25" cy="-10" r="35" fill="url(#greenGrad)"/>
              <circle cx="25" cy="-10" r="35" fill="url(#greenGrad)"/>`
      }
    ]
  },
  {
    id: 'hol-23',
    elements: [
      {
        label: 'אוּשְׁפִּיזִין (אוֹרְחִים)',
        color: '#fbbf24',
        svg: `<rect x="-70" y="-60" width="140" height="120" rx="8" fill="#1e1b4b" stroke="#f59e0b" stroke-width="3"/>
              <circle cx="-30" cy="-10" r="18" fill="#fbbf24"/>
              <path d="M-50,35 Q-30,15 -10,35" stroke="#fbbf24" stroke-width="4" fill="none"/>
              <circle cx="30" cy="-10" r="18" fill="#38bdf8"/>
              <path d="M10,35 Q30,15 50,35" stroke="#38bdf8" stroke-width="4" fill="none"/>`
      },
      {
        label: 'קַדִּישִׁין (כֶּתֶר)',
        color: '#c084fc',
        svg: `<polygon points="-60,30 -50,-30 -20,5 0,-40 20,5 50,-30 60,30" fill="url(#purpleGrad)" stroke="#fef08a" stroke-width="3"/>
              <circle cx="-50" cy="-35" r="7" fill="#fbbf24"/>
              <circle cx="0" cy="-45" r="8" fill="#fbbf24"/>
              <circle cx="50" cy="-35" r="7" fill="#fbbf24"/>`
      }
    ]
  },
  {
    id: 'hol-24',
    elements: [
      {
        label: 'הַקָּפוֹת (סִבּוּב)',
        color: '#60a5fa',
        svg: `<circle cx="0" cy="0" r="65" fill="none" stroke="#38bdf8" stroke-width="8" stroke-dasharray="100 30"/>
              <polygon points="45,-45 70,-45 55,-20" fill="#38bdf8"/>
              <circle cx="0" cy="0" r="15" fill="#38bdf8"/>`
      },
      {
        label: 'שְׁנִיּוֹת (2)',
        color: '#fbbf24',
        svg: `<circle cx="0" cy="0" r="70" fill="url(#goldGrad)"/>
              <text x="0" y="32" font-family="sans-serif" font-size="95" font-weight="900" fill="#78350f" text-anchor="middle">2</text>`
      }
    ]
  },
  {
    id: 'hol-25',
    elements: [
      {
        label: 'מָעוֹז צוּר (מִבְצָר)',
        color: '#fbbf24',
        svg: `<rect x="-60" y="-30" width="120" height="90" fill="#334155" stroke="#94a3b8" stroke-width="3"/>
              <polygon points="-60,-30 -40,-30 -40,-15 -20,-15 -20,-30 0,-30 0,-15 20,-15 20,-30 40,-30 40,-15 60,-15 60,-30" fill="#475569"/>
              <rect x="-18" y="20" width="36" height="40" rx="18" fill="#0f172a"/>`
      },
      {
        label: 'יְשׁוּעָתִי (הַצָּלָה)',
        color: '#f87171',
        svg: `<circle cx="0" cy="0" r="65" fill="#ef4444" stroke="#ffffff" stroke-width="12"/>
              <circle cx="0" cy="0" r="30" fill="#0f172a"/>
              <line x1="-65" y1="0" x2="-30" y2="0" stroke="#ffffff" stroke-width="8"/>
              <line x1="30" y1="0" x2="65" y2="0" stroke="#ffffff" stroke-width="8"/>
              <line x1="0" y1="-65" x2="0" y2="-30" stroke="#ffffff" stroke-width="8"/>
              <line x1="0" y1="30" x2="0" y2="65" stroke="#ffffff" stroke-width="8"/>`
      }
    ]
  },
  {
    id: 'hol-26',
    elements: [
      {
        label: 'נֵר',
        color: '#fbbf24',
        svg: `<rect x="-18" y="-10" width="36" height="70" fill="#f8fafc" rx="4"/>
              <line x1="0" y1="-10" x2="0" y2="-25" stroke="#475569" stroke-width="3"/>
              <path d="M0,-55 Q18,-35 0,-20 Q-18,-35 0,-55 Z" fill="url(#goldGrad)"/>`
      },
      {
        label: 'אִישׁ',
        color: '#60a5fa',
        svg: `<circle cx="0" cy="-35" r="22" fill="#38bdf8"/>
              <path d="M-30,45 L-20,-5 L20,-5 L30,45" stroke="#38bdf8" stroke-width="8" stroke-linecap="round" fill="none"/>`
      },
      {
        label: 'בֵּיתוֹ',
        color: '#34d399',
        svg: `<polygon points="0,-60 -55,-10 55,-10" fill="#ef4444"/>
              <rect x="-45" y="-10" width="90" height="65" fill="#1e293b" stroke="#34d399" stroke-width="3"/>
              <rect x="-15" y="15" width="30" height="40" fill="#34d399"/>`
      }
    ]
  },
  {
    id: 'hol-27',
    elements: [
      {
        label: 'שְׁקֵדִיָּה',
        color: '#f472b6',
        svg: `<rect x="-8" y="10" width="16" height="55" fill="#78350f" rx="3"/>
              <circle cx="-25" cy="-20" r="30" fill="#fbcfe8"/>
              <circle cx="25" cy="-20" r="30" fill="#fbcfe8"/>
              <circle cx="0" cy="-40" r="32" fill="#f472b6"/>
              <circle cx="0" cy="-40" r="10" fill="#fef08a"/>`
      },
      {
        label: 'פּוֹרַחַת (שֶׁמֶשׁ)',
        color: '#fbbf24',
        svg: `<circle cx="0" cy="0" r="45" fill="url(#goldGrad)"/>
              <line x1="0" y1="-65" x2="0" y2="-50" stroke="#f59e0b" stroke-width="6"/>
              <line x1="0" y1="50" x2="0" y2="65" stroke="#f59e0b" stroke-width="6"/>
              <line x1="-65" y1="0" x2="-50" y2="0" stroke="#f59e0b" stroke-width="6"/>
              <line x1="50" y1="0" x2="65" y2="0" stroke="#f59e0b" stroke-width="6"/>`
      }
    ]
  },
  {
    id: 'hol-28',
    elements: [
      {
        label: 'פֵּירוֹת (סַלְסִלָּה)',
        color: '#34d399',
        svg: `<ellipse cx="0" cy="20" rx="55" ry="35" fill="#78350f"/>
              <circle cx="-25" cy="0" r="20" fill="#9333ea"/>
              <circle cx="20" cy="-5" r="22" fill="#f59e0b"/>
              <circle cx="0" cy="-15" r="18" fill="#ef4444"/>`
      },
      {
        label: 'יְבֵשִׁים (שֶׁמֶשׁ מִדְבָּר)',
        color: '#fbbf24',
        svg: `<polygon points="0,-50 15,-15 50,0 15,15 0,50 -15,15 -50,0 -15,-15" fill="url(#goldGrad)"/>
              <circle cx="0" cy="0" r="20" fill="#ea580c"/>`
      }
    ]
  },
  {
    id: 'hol-29',
    elements: [
      {
        label: 'סוּס הַמַּלְכוּת',
        color: '#fbbf24',
        svg: `<path d="M-40,40 Q-20,0 -30,-40 Q0,-50 20,-20 Q40,0 20,40 Z" fill="#78350f" stroke="#fbbf24" stroke-width="3"/>
              <polygon points="-5,-45 25,-40 10,-20" fill="#f59e0b"/>`
      },
      {
        label: 'כֶּתֶר מַלְכוּת',
        color: '#fbbf24',
        svg: `<polygon points="-50,30 -40,-25 -15,0 0,-35 15,0 40,-25 50,30" fill="url(#goldGrad)" stroke="#78350f" stroke-width="2"/>`
      },
      {
        label: 'יֵעָשֶׂה לָאִישׁ',
        color: '#60a5fa',
        svg: `<circle cx="0" cy="0" r="60" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
              <polygon points="-20,-25 25,0 -20,25" fill="#38bdf8"/>`
      }
    ]
  },
  {
    id: 'hol-30',
    elements: [
      {
        label: 'עַד (חָבִית יַיִן)',
        color: '#a855f7',
        svg: `<ellipse cx="0" cy="0" rx="45" ry="60" fill="#581c87" stroke="#c084fc" stroke-width="3"/>
              <line x1="-45" y1="-20" x2="45" y2="-20" stroke="#c084fc" stroke-width="3"/>
              <line x1="-45" y1="20" x2="45" y2="20" stroke="#c084fc" stroke-width="3"/>`
      },
      {
        label: 'דְּלֹא יָדַע (?)',
        color: '#fbbf24',
        svg: `<circle cx="0" cy="0" r="65" fill="#0f172a" stroke="#fbbf24" stroke-width="3"/>
              <text x="0" y="32" font-family="sans-serif" font-size="90" font-weight="900" fill="#fbbf24" text-anchor="middle">?</text>`
      }
    ]
  },
  {
    id: 'hol-31',
    elements: [
      {
        label: 'מָה (?)',
        color: '#38bdf8',
        svg: `<circle cx="0" cy="0" r="65" fill="#0284c7" stroke="#bae6fd" stroke-width="3"/>
              <text x="0" y="32" font-family="sans-serif" font-size="90" font-weight="900" fill="#ffffff" text-anchor="middle">?</text>`
      },
      {
        label: 'נִשְׁתַּנָּה (זִקִּית)',
        color: '#34d399',
        svg: `<path d="M-50,20 Q-20,-40 30,-20 Q60,0 30,30 Q-10,35 -50,20 Z" fill="url(#greenGrad)" stroke="#065f46" stroke-width="3"/>
              <circle cx="35" cy="-10" r="10" fill="#fef08a"/>
              <circle cx="37" cy="-10" r="4" fill="#000000"/>`
      },
      {
        label: 'מַצָּה',
        color: '#fbbf24',
        svg: `<rect x="-50" y="-50" width="100" height="100" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="3"/>
              <circle cx="-25" cy="-25" r="4" fill="#92400e"/>
              <circle cx="0" cy="-25" r="4" fill="#92400e"/>
              <circle cx="25" cy="-25" r="4" fill="#92400e"/>
              <circle cx="-25" cy="0" r="4" fill="#92400e"/>
              <circle cx="25" cy="0" r="4" fill="#92400e"/>
              <circle cx="0" cy="25" r="4" fill="#92400e"/>`
      }
    ]
  },
  {
    id: 'hol-32',
    elements: [
      {
        label: 'מַכָּה (בָּרָק)',
        color: '#fbbf24',
        svg: `<polygon points="10,-65 -35,5 0,5 -15,65 35,-5 0,-5" fill="url(#goldGrad)" stroke="#78350f" stroke-width="2"/>`
      },
      {
        label: 'בְּכוֹרוֹת (מִסְפָּר 1)',
        color: '#60a5fa',
        svg: `<circle cx="0" cy="0" r="65" fill="#1e3a8a" stroke="#60a5fa" stroke-width="4"/>
              <text x="0" y="32" font-family="sans-serif" font-size="90" font-weight="900" fill="#60a5fa" text-anchor="middle">1</text>`
      }
    ]
  },
  {
    id: 'hol-33',
    elements: [
      {
        label: 'צְפִירָה (צוֹפָר)',
        color: '#f87171',
        svg: `<polygon points="-50,-20 -10,-45 -10,45 -50,20" fill="#dc2626"/>
              <rect x="-65" y="-15" width="20" height="30" fill="#991b1b"/>
              <path d="M10,-35 Q35,0 10,35" stroke="#f87171" stroke-width="6" fill="none"/>
              <path d="M25,-50 Q60,0 25,50" stroke="#f87171" stroke-width="6" fill="none"/>`
      },
      {
        label: 'דּוּמִיָּה (עֲמִידָה)',
        color: '#38bdf8',
        svg: `<circle cx="0" cy="-40" r="18" fill="#38bdf8"/>
              <rect x="-12" y="-15" width="24" height="65" rx="6" fill="#38bdf8"/>`
      }
    ]
  },
  {
    id: 'hol-34',
    elements: [
      {
        label: 'מַתָּן (מַתָּנָה)',
        color: '#f43f5e',
        svg: `<rect x="-50" y="-30" width="100" height="85" fill="#e11d48" rx="6"/>
              <rect x="-55" y="-45" width="110" height="20" fill="#be123c" rx="4"/>
              <line x1="0" y1="-45" x2="0" y2="55" stroke="#fef08a" stroke-width="14"/>
              <line x1="-50" y1="10" x2="50" y2="10" stroke="#fef08a" stroke-width="14"/>`
      },
      {
        label: 'תּוֹרָה (לוּחוֹת הַבְּרִית)',
        color: '#60a5fa',
        svg: `<path d="M-55,45 L-55,-20 Q-28,-55 0,-20 Q28,-55 55,-20 L55,45 Z" fill="#334155" stroke="#94a3b8" stroke-width="3"/>
              <line x1="0" y1="-20" x2="0" y2="45" stroke="#94a3b8" stroke-width="3"/>
              <text x="-28" y="10" font-size="20" font-weight="900" fill="#fbbf24" text-anchor="middle">א-ה</text>
              <text x="28" y="10" font-size="20" font-weight="900" fill="#fbbf24" text-anchor="middle">ו-י</text>`
      }
    ]
  },

  // 18 Idioms and General Riddles (gen-08 to gen-25)
  {
    id: 'gen-08',
    elements: [
      {
        label: 'מַיִם שְׁקֵטִים',
        color: '#38bdf8',
        svg: `<path d="M-60,-20 Q-30,-30 0,-20 Q30,-10 60,-20 L60,40 L-60,40 Z" fill="#0284c7"/>
              <path d="M-60,5 Q-30,-5 0,5 Q30,15 60,5" stroke="#38bdf8" stroke-width="4" fill="none"/>`
      },
      {
        label: 'חוֹדְרִים עָמֹק (חֵץ)',
        color: '#34d399',
        svg: `<line x1="0" y1="-60" x2="0" y2="40" stroke="#10b981" stroke-width="12" stroke-linecap="round"/>
              <polygon points="-25,35 25,35 0,65" fill="#10b981"/>`
      }
    ]
  },
  {
    id: 'gen-09',
    elements: [
      {
        label: 'עָלָה (חֵץ מַעְלָה)',
        color: '#fbbf24',
        svg: `<line x1="0" y1="50" x2="0" y2="-40" stroke="#f59e0b" stroke-width="12" stroke-linecap="round"/>
              <polygon points="-25,-35 25,-35 0,-65" fill="#f59e0b"/>`
      },
      {
        label: 'דָּם (טִפָּה)',
        color: '#f87171',
        svg: `<path d="M0,-60 Q35,0 0,55 Q-35,0 0,-60 Z" fill="url(#redGrad)"/>`
      },
      {
        label: 'לָרֹאשׁ',
        color: '#ef4444',
        svg: `<circle cx="0" cy="0" r="55" fill="#991b1b" stroke="#f87171" stroke-width="3"/>
              <circle cx="-18" cy="-10" r="6" fill="#ffffff"/>
              <circle cx="18" cy="-10" r="6" fill="#ffffff"/>
              <line x1="-25" y1="25" x2="25" y2="25" stroke="#ffffff" stroke-width="5"/>`
      }
    ]
  },
  {
    id: 'gen-10',
    elements: [
      {
        label: 'נַחְתּוֹם (אוֹפֶה)',
        color: '#fbbf24',
        svg: `<circle cx="0" cy="-10" r="30" fill="#fed7aa"/>
              <path d="M-30,-25 Q0,-65 30,-25 Z" fill="#ffffff"/>
              <rect x="-25" y="20" width="50" height="40" fill="#ffffff" rx="4"/>`
      },
      {
        label: 'אֵין מֵעִיד (X)',
        color: '#ef4444',
        svg: `<circle cx="0" cy="0" r="60" fill="#7f1d1d" stroke="#ef4444" stroke-width="3"/>
              <line x1="-35" y1="-35" x2="35" y2="35" stroke="#f87171" stroke-width="10"/>
              <line x1="35" y1="-35" x2="-35" y2="35" stroke="#f87171" stroke-width="10"/>`
      },
      {
        label: 'עִיסָתוֹ (בָּצֵק)',
        color: '#fef08a',
        svg: `<ellipse cx="0" cy="20" rx="60" ry="30" fill="#334155"/>
              <ellipse cx="0" cy="0" rx="45" ry="30" fill="#fef08a"/>`
      }
    ]
  },
  {
    id: 'gen-11',
    elements: [
      {
        label: 'אֶבֶן נָגוֹלָה',
        color: '#94a3b8',
        svg: `<circle cx="0" cy="0" r="60" fill="#475569" stroke="#94a3b8" stroke-width="4"/>
              <path d="M-30,30 Q0,-40 40,-20" stroke="#cbd5e1" stroke-width="5" fill="none"/>`
      },
      {
        label: 'מֵעַל לִבּוֹ (לֵב)',
        color: '#f87171',
        svg: `<path d="M0,45 L-45,0 Q-45,-40 0,-15 Q45,-40 45,0 Z" fill="url(#redGrad)"/>`
      }
    ]
  },
  {
    id: 'gen-12',
    elements: [
      {
        label: 'מֵרוֹב עֵצִים',
        color: '#34d399',
        svg: `<rect x="-45" y="10" width="12" height="40" fill="#78350f"/>
              <circle cx="-40" cy="-5" r="25" fill="#10b981"/>
              <rect x="-5" y="0" width="14" height="50" fill="#78350f"/>
              <circle cx="2" cy="-20" r="30" fill="#059669"/>
              <rect x="35" y="10" width="12" height="40" fill="#78350f"/>
              <circle cx="40" cy="-5" r="25" fill="#10b981"/>`
      },
      {
        label: 'לֹא רוֹאִים יַעַר',
        color: '#f87171',
        svg: `<circle cx="0" cy="0" r="60" fill="#1e1b4b" stroke="#ef4444" stroke-width="4"/>
              <line x1="-40" y1="40" x2="40" y2="-40" stroke="#ef4444" stroke-width="8"/>
              <circle cx="-15" cy="0" r="14" stroke="#ffffff" stroke-width="4" fill="none"/>
              <circle cx="20" cy="0" r="14" stroke="#ffffff" stroke-width="4" fill="none"/>`
      }
    ]
  },
  {
    id: 'gen-13',
    elements: [
      {
        label: 'שָׂם רַגְלַיִם (הַכְשָׁלָה)',
        color: '#fbbf24',
        svg: `<line x1="-50" y1="20" x2="50" y2="20" stroke="#eab308" stroke-width="12" stroke-linecap="round"/>
              <path d="M-30,-50 L0,-10 L30,-50" stroke="#ef4444" stroke-width="6" fill="none"/>`
      }
    ]
  },
  {
    id: 'gen-14',
    elements: [
      {
        label: 'דֶּרֶךְ (שְׁבִיל)',
        color: '#fbbf24',
        svg: `<polygon points="-20,-50 20,-50 50,50 -50,50" fill="#78350f" stroke="#fbbf24" stroke-width="3"/>
              <line x1="0" y1="-45" x2="0" y2="45" stroke="#fef08a" stroke-width="5" stroke-dasharray="12 10"/>`
      },
      {
        label: 'הַמֶּלֶךְ (כֶּתֶר)',
        color: '#f59e0b',
        svg: `<polygon points="-50,30 -40,-25 -15,0 0,-35 15,0 40,-25 50,30" fill="url(#goldGrad)" stroke="#78350f" stroke-width="2"/>`
      }
    ]
  },
  {
    id: 'gen-15',
    elements: [
      {
        label: 'תָּפַסְתָּ מְרֻבֶּה',
        color: '#38bdf8',
        svg: `<rect x="-55" y="-45" width="110" height="90" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
              <circle cx="-25" cy="-15" r="10" fill="#f87171"/>
              <circle cx="0" cy="-15" r="10" fill="#fbbf24"/>
              <circle cx="25" cy="-15" r="10" fill="#34d399"/>
              <circle cx="-25" cy="15" r="10" fill="#c084fc"/>
              <circle cx="0" cy="15" r="10" fill="#38bdf8"/>
              <circle cx="25" cy="15" r="10" fill="#fb923c"/>`
      },
      {
        label: 'לֹא תָּפַסְתָּ (0)',
        color: '#ef4444',
        svg: `<circle cx="0" cy="0" r="60" fill="#450a0a" stroke="#ef4444" stroke-width="4"/>
              <text x="0" y="28" font-size="80" font-weight="900" fill="#ef4444" text-anchor="middle">0</text>`
      }
    ]
  },
  {
    id: 'gen-16',
    elements: [
      {
        label: 'עָשִׁיר (זָהָב)',
        color: '#fbbf24',
        svg: `<ellipse cx="0" cy="20" rx="45" ry="30" fill="#b45309"/>
              <circle cx="0" cy="-10" r="30" fill="url(#goldGrad)"/>
              <text x="0" y="2" font-size="30" font-weight="900" fill="#78350f" text-anchor="middle">₪</text>`
      },
      {
        label: 'שָׂמֵחַ (חִיּוּךְ)',
        color: '#34d399',
        svg: `<circle cx="0" cy="0" r="55" fill="url(#greenGrad)"/>
              <circle cx="-18" cy="-15" r="6" fill="#064e3b"/>
              <circle cx="18" cy="-15" r="6" fill="#064e3b"/>
              <path d="M-25,12 Q0,35 25,12" stroke="#064e3b" stroke-width="5" fill="none"/>`
      },
      {
        label: 'בְּחֶלְקוֹ (עוּגָה)',
        color: '#60a5fa',
        svg: `<circle cx="0" cy="0" r="55" fill="#334155"/>
              <path d="M0,0 L55,0 A55,55 0 0,1 0,55 Z" fill="#60a5fa"/>`
      }
    ]
  },
  {
    id: 'gen-17',
    elements: [
      {
        label: 'כַּדּוּר שֶׁלֶג מִתְגַּלְגֵּל',
        color: '#bae6fd',
        svg: `<circle cx="30" cy="-10" r="45" fill="#f0f9ff" stroke="#38bdf8" stroke-width="4"/>
              <circle cx="-25" cy="20" r="25" fill="#e0f2fe" stroke="#38bdf8" stroke-width="3"/>
              <path d="M-60,45 L60,45" stroke="#94a3b8" stroke-width="5"/>`
      }
    ]
  },
  {
    id: 'gen-18',
    elements: [
      {
        label: 'לִשְׁבֹּר (פַּטִּישׁ)',
        color: '#f87171',
        svg: `<rect x="-35" y="-45" width="70" height="30" fill="#475569" rx="3"/>
              <rect x="-8" y="-15" width="16" height="75" fill="#78350f" rx="3"/>`
      },
      {
        label: 'אֶת הַקֶּרַח (קֻבִיָּה)',
        color: '#38bdf8',
        svg: `<rect x="-45" y="-45" width="90" height="90" fill="#bae6fd" stroke="#0284c7" stroke-width="4" rx="6"/>
              <line x1="-20" y1="-20" x2="20" y2="20" stroke="#0284c7" stroke-width="3"/>
              <line x1="-30" y1="10" x2="10" y2="-30" stroke="#0284c7" stroke-width="3"/>`
      }
    ]
  },
  {
    id: 'gen-19',
    elements: [
      {
        label: 'פֶּה (פָּתוּחַ)',
        color: '#f87171',
        svg: `<path d="M-50,0 Q0,-35 50,0 Q0,45 -50,0 Z" fill="#991b1b" stroke="#f87171" stroke-width="3"/>
              <rect x="-20" y="-10" width="40" height="12" fill="#ffffff" rx="2"/>`
      },
      {
        label: 'לַשָּׂטָן (קַרְנַיִם)',
        color: '#dc2626',
        svg: `<circle cx="0" cy="10" r="45" fill="#b91c1c"/>
              <path d="M-30,-15 Q-40,-55 -15,-40" stroke="#dc2626" stroke-width="8" stroke-linecap="round" fill="none"/>
              <path d="M30,-15 Q40,-55 15,-40" stroke="#dc2626" stroke-width="8" stroke-linecap="round" fill="none"/>`
      }
    ]
  },
  {
    id: 'gen-20',
    elements: [
      {
        label: 'יוֹרֵד (סֻלָּם)',
        color: '#fbbf24',
        svg: `<line x1="-25" y1="-55" x2="-25" y2="55" stroke="#f59e0b" stroke-width="5"/>
              <line x1="25" y1="-55" x2="25" y2="55" stroke="#f59e0b" stroke-width="5"/>
              <line x1="-25" y1="-30" x2="25" y2="-30" stroke="#f59e0b" stroke-width="4"/>
              <line x1="-25" y1="0" x2="25" y2="0" stroke="#f59e0b" stroke-width="4"/>
              <line x1="-25" y1="30" x2="25" y2="30" stroke="#f59e0b" stroke-width="4"/>`
      },
      {
        label: 'דַּעְתּוֹ (מוֹחַ)',
        color: '#c084fc',
        svg: `<circle cx="0" cy="0" r="55" fill="url(#purpleGrad)"/>
              <path d="M-25,-15 Q0,-35 25,-15 Q0,10 -25,-15" stroke="#f3e8ff" stroke-width="4" fill="none"/>
              <path d="M-25,15 Q0,-5 25,15" stroke="#f3e8ff" stroke-width="4" fill="none"/>`
      }
    ]
  },
  {
    id: 'gen-21',
    elements: [
      {
        label: 'שְׂכָרוֹ (+)',
        color: '#34d399',
        svg: `<circle cx="0" cy="0" r="55" fill="#065f46" stroke="#34d399" stroke-width="3"/>
              <text x="0" y="25" font-size="70" font-weight="900" fill="#34d399" text-anchor="middle">+</text>`
      },
      {
        label: 'הֶפְסֵדוֹ (- -)',
        color: '#ef4444',
        svg: `<circle cx="0" cy="0" r="55" fill="#7f1d1d" stroke="#ef4444" stroke-width="3"/>
              <line x1="-30" y1="0" x2="30" y2="0" stroke="#ef4444" stroke-width="12"/>`
      }
    ]
  },
  {
    id: 'gen-22',
    elements: [
      {
        label: 'שָׂם נַפְשׁוֹ (לֵב/נֶפֶשׁ)',
        color: '#f87171',
        svg: `<path d="M0,35 L-35,0 Q-35,-30 0,-10 Q35,-30 35,0 Z" fill="url(#redGrad)"/>`
      },
      {
        label: 'בְּכַפּוֹ (כַּף יָד)',
        color: '#fbbf24',
        svg: `<path d="M-25,45 L-25,-10 L-10,-35 L0,-35 L10,-30 L20,-20 L25,45 Z" fill="#d97706"/>`
      }
    ]
  },
  {
    id: 'gen-23',
    elements: [
      {
        label: 'עָקֵב (נַעַל)',
        color: '#60a5fa',
        svg: `<path d="M-45,25 L-45,-10 Q-30,-25 0,-15 L45,10 L45,25 Z" fill="#2563eb"/>
              <rect x="-45" y="25" width="25" height="15" fill="#1e3a8a"/>`
      },
      {
        label: 'אֲגוּדָל (רֶגֶל)',
        color: '#fbbf24',
        svg: `<ellipse cx="0" cy="0" rx="35" ry="50" fill="#f59e0b"/>
              <circle cx="0" cy="-25" r="18" fill="#fef08a"/>`
      }
    ]
  },
  {
    id: 'gen-24',
    elements: [
      {
        label: 'הֵצִיץ (עַיִן)',
        color: '#38bdf8',
        svg: `<path d="M-55,0 Q0,-40 55,0 Q0,40 -55,0 Z" fill="#ffffff" stroke="#0284c7" stroke-width="3"/>
              <circle cx="0" cy="0" r="22" fill="#0284c7"/>
              <circle cx="0" cy="0" r="10" fill="#000000"/>`
      },
      {
        label: 'וְנִפְגַּע (כּוֹכָבִים)',
        color: '#fbbf24',
        svg: `<polygon points="0,-45 12,-12 45,0 12,12 0,45 -12,12 -45,0 -12,-12" fill="url(#goldGrad)"/>`
      }
    ]
  },
  {
    id: 'gen-25',
    elements: [
      {
        label: 'שִׁבְעַת (7)',
        color: '#fbbf24',
        svg: `<circle cx="0" cy="0" r="65" fill="#b45309"/>
              <text x="0" y="32" font-size="90" font-weight="900" fill="#fef08a" text-anchor="middle">7</text>`
      },
      {
        label: 'מְדוֹרֵי גֵּיהִנֹּם (אֵשׁ)',
        color: '#ef4444',
        svg: `<path d="M-40,40 Q-50,0 -20,-20 Q-40,-50 0,-60 Q30,-30 15,-10 Q45,0 35,40 Z" fill="url(#redGrad)"/>
              <path d="M-20,40 Q-30,10 -10,0 Q-20,-20 0,-30 Q20,-10 10,0 Q30,10 20,40 Z" fill="url(#goldGrad)"/>`
      }
    ]
  },

  // 16 Geography and Landmark Riddles (geo-06 to geo-21)
  {
    id: 'geo-06',
    elements: [
      {
        label: 'כֶּרֶם (עֲנָבִים)',
        color: '#a855f7',
        svg: `<circle cx="-15" cy="-20" r="14" fill="#9333ea"/>
              <circle cx="15" cy="-20" r="14" fill="#9333ea"/>
              <circle cx="0" cy="-5" r="14" fill="#9333ea"/>
              <circle cx="-10" cy="15" r="14" fill="#9333ea"/>
              <circle cx="10" cy="15" r="14" fill="#9333ea"/>
              <circle cx="0" cy="30" r="14" fill="#9333ea"/>
              <path d="M0,-30 Q5,-50 25,-45" stroke="#15803d" stroke-width="4" fill="none"/>`
      },
      {
        label: 'אֵ-ל (קֹדֶשׁ)',
        color: '#fbbf24',
        svg: `<circle cx="0" cy="0" r="65" fill="#1e1b4b" stroke="#fbbf24" stroke-width="3"/>
              <text x="0" y="24" font-size="65" font-weight="900" fill="#fbbf24" text-anchor="middle">אֵל</text>`
      }
    ]
  },
  {
    id: 'geo-07',
    elements: [
      {
        label: 'נָהָר (זְרִימָה)',
        color: '#38bdf8',
        svg: `<path d="M-60,-40 Q0,-10 -60,40 L60,40 Q0,-10 60,-40 Z" fill="#0284c7"/>
              <path d="M-40,-20 Q0,5 -40,30" stroke="#bae6fd" stroke-width="4" fill="none"/>`
      },
      {
        label: 'יָהּ (י+ה)',
        color: '#fbbf24',
        svg: `<circle cx="0" cy="0" r="65" fill="#0f172a" stroke="#fbbf24" stroke-width="3"/>
              <text x="0" y="24" font-size="65" font-weight="900" fill="#fbbf24" text-anchor="middle">יָהּ</text>`
      }
    ]
  },
  {
    id: 'geo-08',
    elements: [
      {
        label: 'נֶשֶׁר (עוֹף דּוֹרֵס)',
        color: '#fbbf24',
        svg: `<path d="M0,-20 Q-40,-60 -70,-30 Q-40,0 -10,35 Q0,45 10,35 Q40,0 70,-30 Q40,-60 0,-20 Z" fill="#78350f" stroke="#fbbf24" stroke-width="2"/>
              <circle cx="0" cy="-25" r="14" fill="#fef08a"/>
              <polygon points="0,-20 8,-10 -8,-10" fill="#ea580c"/>`
      }
    ]
  },
  {
    id: 'geo-09',
    elements: [
      {
        label: 'כְּפָר (בָּתִּים)',
        color: '#34d399',
        svg: `<polygon points="-40,-10 -15,-35 10,-10" fill="#ef4444"/>
              <rect x="-35" y="-10" width="40" height="40" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
              <polygon points="5,-5 25,-25 45,-5" fill="#f59e0b"/>
              <rect x="10" y="-5" width="30" height="35" fill="#334155" stroke="#fbbf24" stroke-width="2"/>`
      },
      {
        label: 'סַבָּא (זָקָן וּמַקֵּל)',
        color: '#94a3b8',
        svg: `<circle cx="0" cy="-20" r="28" fill="#fed7aa"/>
              <path d="M-22,-10 Q0,25 22,-10 Z" fill="#f8fafc"/>
              <line x1="35" y1="-30" x2="35" y2="45" stroke="#78350f" stroke-width="6"/>`
      }
    ]
  },
  {
    id: 'geo-10',
    elements: [
      {
        label: 'רָמָה (הַר מֻגְבָּהּ)',
        color: '#fbbf24',
        svg: `<polygon points="-60,40 -30,-40 30,-40 60,40" fill="#854d0e" stroke="#fbbf24" stroke-width="3"/>
              <line x1="-30" y1="-40" x2="30" y2="-40" stroke="#fef08a" stroke-width="4"/>`
      },
      {
        label: 'הַשָּׁרוֹן (תּוּת)',
        color: '#f87171',
        svg: `<path d="M0,50 Q-40,10 -35,-20 Q-30,-45 0,-40 Q30,-45 35,-20 Q40,10 0,50 Z" fill="#dc2626"/>
              <circle cx="-15" cy="-10" r="3" fill="#fef08a"/>
              <circle cx="15" cy="-10" r="3" fill="#fef08a"/>
              <circle cx="0" cy="15" r="3" fill="#fef08a"/>`
      }
    ]
  },
  {
    id: 'geo-11',
    elements: [
      {
        label: 'בֵּית',
        color: '#34d399',
        svg: `<polygon points="0,-50 -50,0 50,0" fill="#dc2626"/>
              <rect x="-40" y="0" width="80" height="50" fill="#1e293b" stroke="#34d399" stroke-width="3"/>
              <rect x="-12" y="15" width="24" height="35" fill="#34d399"/>`
      },
      {
        label: 'שֶׁמֶשׁ',
        color: '#fbbf24',
        svg: `<circle cx="0" cy="0" r="45" fill="url(#goldGrad)"/>
              <line x1="0" y1="-65" x2="0" y2="-50" stroke="#f59e0b" stroke-width="6"/>
              <line x1="0" y1="50" x2="0" y2="65" stroke="#f59e0b" stroke-width="6"/>
              <line x1="-65" y1="0" x2="-50" y2="0" stroke="#f59e0b" stroke-width="6"/>
              <line x1="50" y1="0" x2="65" y2="0" stroke="#f59e0b" stroke-width="6"/>`
      }
    ]
  },
  {
    id: 'geo-12',
    elements: [
      {
        label: 'נְתִיבוֹת (נְתִיבֵי דֶּרֶךְ)',
        color: '#fbbf24',
        svg: `<path d="M0,50 Q-40,0 -50,-50" stroke="#fbbf24" stroke-width="8" fill="none"/>
              <path d="M0,50 L0,-50" stroke="#38bdf8" stroke-width="8"/>
              <path d="M0,50 Q40,0 50,-50" stroke="#34d399" stroke-width="8" fill="none"/>`
      }
    ]
  },
  {
    id: 'geo-13',
    elements: [
      {
        label: 'קָצָר (סַרְגֵּל)',
        color: '#f87171',
        svg: `<rect x="-55" y="-20" width="110" height="40" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
              <line x1="-40" y1="-20" x2="-40" y2="0" stroke="#854d0e" stroke-width="3"/>
              <line x1="-15" y1="-20" x2="-15" y2="10" stroke="#854d0e" stroke-width="3"/>
              <line x1="10" y1="-20" x2="10" y2="0" stroke="#854d0e" stroke-width="3"/>
              <line x1="35" y1="-20" x2="35" y2="10" stroke="#854d0e" stroke-width="3"/>`
      },
      {
        label: 'יִין (י+ן)',
        color: '#c084fc',
        svg: `<circle cx="0" cy="0" r="65" fill="#3b0764" stroke="#c084fc" stroke-width="3"/>
              <text x="0" y="24" font-size="65" font-weight="900" fill="#f3e8ff" text-anchor="middle">יִין</text>`
      }
    ]
  },
  {
    id: 'geo-14',
    elements: [
      {
        label: 'מְטֻלְטָל (סִבּוּב)',
        color: '#fbbf24',
        svg: `<circle cx="0" cy="0" r="55" fill="none" stroke="#f59e0b" stroke-width="8" stroke-dasharray="80 30"/>
              <polygon points="40,-35 60,-35 45,-15" fill="#f59e0b"/>`
      },
      {
        label: 'הּ (ה)',
        color: '#38bdf8',
        svg: `<circle cx="0" cy="0" r="65" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>
              <text x="0" y="24" font-size="70" font-weight="900" fill="#38bdf8" text-anchor="middle">הּ</text>`
      }
    ]
  },
  {
    id: 'geo-15',
    elements: [
      {
        label: 'יָם (גַּלִּים)',
        color: '#38bdf8',
        svg: `<path d="M-55,-10 Q-25,-30 0,-10 Q25,10 55,-10" stroke="#38bdf8" stroke-width="8" fill="none"/>
              <path d="M-55,20 Q-25,0 0,20 Q25,40 55,20" stroke="#0284c7" stroke-width="8" fill="none"/>`
      },
      {
        label: 'מֶלַח (מַלְחִיָּה)',
        color: '#f8fafc',
        svg: `<rect x="-30" y="-30" width="60" height="75" rx="8" fill="#e2e8f0" stroke="#94a3b8" stroke-width="3"/>
              <rect x="-20" y="-45" width="40" height="15" rx="4" fill="#64748b"/>
              <circle cx="-10" cy="-38" r="2" fill="#000"/>
              <circle cx="0" cy="-38" r="2" fill="#000"/>
              <circle cx="10" cy="-38" r="2" fill="#000"/>`
      }
    ]
  },
  {
    id: 'geo-16',
    elements: [
      {
        label: 'הַר (כִּפָּה)',
        color: '#34d399',
        svg: `<path d="M-65,45 Q0,-65 65,45 Z" fill="#15803d" stroke="#34d399" stroke-width="3"/>`
      },
      {
        label: 'תָּבוֹר (כְּנֵסִיָּה)',
        color: '#fbbf24',
        svg: `<rect x="-35" y="-20" width="70" height="65" fill="#334155" stroke="#fbbf24" stroke-width="2"/>
              <polygon points="0,-55 -35,-20 35,-20" fill="#b45309"/>
              <line x1="0" y1="-55" x2="0" y2="-65" stroke="#fbbf24" stroke-width="4"/>`
      }
    ]
  },
  {
    id: 'geo-17',
    elements: [
      {
        label: 'מְצָדָה (מְצוּדָה בַּצּוּק)',
        color: '#fbbf24',
        svg: `<polygon points="-60,45 -35,-25 35,-25 60,45" fill="#78350f" stroke="#d97706" stroke-width="3"/>
              <rect x="-25" y="-55" width="50" height="30" fill="#b45309" stroke="#fbbf24" stroke-width="2"/>
              <path d="M-55,40 Q-10,10 -30,-20" stroke="#fbbf24" stroke-width="4" stroke-dasharray="6 4" fill="none"/>`
      }
    ]
  },
  {
    id: 'geo-18',
    elements: [
      {
        label: 'אַיָּלָה (קַרְנַיִם)',
        color: '#fbbf24',
        svg: `<ellipse cx="0" cy="10" rx="35" ry="40" fill="#b45309"/>
              <circle cx="0" cy="-20" r="22" fill="#d97706"/>
              <path d="M-15,-35 Q-35,-65 -20,-60" stroke="#78350f" stroke-width="5" fill="none"/>
              <path d="M15,-35 Q35,-65 20,-60" stroke="#78350f" stroke-width="5" fill="none"/>`
      },
      {
        label: 'יָם סוּף (דּוֹלְפִין)',
        color: '#38bdf8',
        svg: `<path d="M-45,20 Q0,-40 45,0 Q10,10 -45,20 Z" fill="#0284c7"/>
              <polygon points="45,0 60,-15 55,10" fill="#0284c7"/>`
      }
    ]
  },
  {
    id: 'geo-19',
    elements: [
      {
        label: 'חוֹל (דִּיּוּנָה)',
        color: '#fbbf24',
        svg: `<path d="M-60,40 Q-10,-30 40,20 Q55,30 65,40 Z" fill="url(#goldGrad)"/>`
      },
      {
        label: 'וֹן (ו+ן)',
        color: '#38bdf8',
        svg: `<circle cx="0" cy="0" r="65" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>
              <text x="0" y="24" font-size="65" font-weight="900" fill="#38bdf8" text-anchor="middle">וֹן</text>`
      }
    ]
  },
  {
    id: 'geo-20',
    elements: [
      {
        label: 'מַעֲלֶה (מַדְרֵגוֹת)',
        color: '#fbbf24',
        svg: `<polygon points="-50,45 -50,20 -20,20 -20,-5 10,-5 10,-30 40,-30 40,45" fill="#d97706" stroke="#fbbf24" stroke-width="3"/>`
      },
      {
        label: 'אֲדֻמִּים (אֲדַמְדַּם)',
        color: '#ef4444',
        svg: `<circle cx="0" cy="0" r="55" fill="url(#redGrad)" stroke="#b91c1c" stroke-width="4"/>`
      }
    ]
  },
  {
    id: 'geo-21',
    elements: [
      {
        label: 'שַׁעַר (קֶשֶׁת)',
        color: '#38bdf8',
        svg: `<path d="M-45,45 L-45,-10 Q0,-55 45,-10 L45,45 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="4"/>
              <path d="M-25,45 L-25,5 Q0,-25 25,5 L25,45 Z" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>`
      },
      {
        label: 'הַגַּיְא (עֵמֶק וּמְשֻׁרְיָן)',
        color: '#34d399',
        svg: `<polygon points="-60,-30 -20,40 20,40 60,-30 60,50 -60,50" fill="#15803d"/>
              <rect x="-20" y="15" width="40" height="20" fill="#475569" rx="3"/>`
      }
    ]
  }
];

riddlesData.forEach(r => {
  const svgContent = createSvg(r.elements);
  const filePath = path.join(TARGET_DIR, `${r.id}.svg`);
  fs.writeFileSync(filePath, svgContent, 'utf8');
  console.log(`Created: ${r.id}.svg`);
});

console.log(`\nSuccessfully created all ${riddlesData.length} SVGs!`);
