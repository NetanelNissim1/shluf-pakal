const fs = require('fs');
const path = require('path');

const svgDir = path.join(__dirname, '..', 'public', 'assets', 'visual_riddles');

function wrapSvg(content) {
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
  ${content}
</svg>`;
}

const SVGS = {};

// ==========================================
// 1. CATEGORY A: 13 SEMANTIC SWAP RIDDLES
// ==========================================

// hol-42: ונתנה תוקף (ספר פתוח + שופר מוזהב + חותם מלכותי)
SVGS['hol-42'] = wrapSvg(`
  <!-- Right: Open Holy Book (ספר פתוח) -->
  <g transform="translate(680, 260)" filter="url(#shadow)">
    <path d="M-65,-30 C-30,-45 -10,-35 0,-20 C10,-35 30,-45 65,-30 L60,45 C30,35 10,40 0,30 C-10,40 -30,35 -60,45 Z" fill="#fef3c7" stroke="#b45309" stroke-width="3"/>
    <path d="M0,-20 L0,30" stroke="#b45309" stroke-width="3"/>
    <line x1="-50" y1="-10" x2="-10" y2="-5" stroke="#92400e" stroke-width="3" stroke-dasharray="5 3"/>
    <line x1="-50" y1="5" x2="-10" y2="10" stroke="#92400e" stroke-width="3" stroke-dasharray="5 3"/>
    <line x1="10" y1="-5" x2="50" y2="-10" stroke="#92400e" stroke-width="3" stroke-dasharray="5 3"/>
    <line x1="10" y1="10" x2="50" y2="5" stroke="#92400e" stroke-width="3" stroke-dasharray="5 3"/>
  </g>
  <text x="520" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Middle: Golden Shofar (שופר מוזהב) -->
  <g transform="translate(380, 260)" filter="url(#shadow)">
    <path d="M-50,45 Q-20,25 0,0 Q20,-35 60,-25 Q50,-10 15,10 Q-20,30 -40,55 Z" fill="url(#goldGrad)" stroke="#78350f" stroke-width="3"/>
    <circle cx="-45" cy="50" r="7" fill="#451a03"/>
  </g>
  <text x="240" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Royal Seal (חותם מלכותי) -->
  <g transform="translate(130, 260)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="45" fill="url(#redGrad)" stroke="#991b1b" stroke-width="3"/>
    <polygon points="0,-30 8,-10 30,-10 12,4 18,24 0,12 -18,24 -12,4 -30,-10 -8,-10" fill="#fef08a"/>
    <circle cx="0" cy="3" r="10" fill="#ef4444"/>
  </g>
`);

// hol-44: סעודה מפסקת (שולחן סעודה ערוך + שעון שקיעה ועצור)
SVGS['hol-44'] = wrapSvg(`
  <!-- Right: Feast Table (שולחן סעודה ערוך) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <rect x="-70" y="-10" width="140" height="24" rx="4" fill="#78350f" stroke="#451a03" stroke-width="3"/>
    <rect x="-60" y="14" width="14" height="55" fill="#78350f"/>
    <rect x="46" y="14" width="14" height="55" fill="#78350f"/>
    <ellipse cx="0" cy="-22" rx="42" ry="14" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <circle cx="-18" cy="-24" r="8" fill="#ef4444"/>
    <circle cx="18" cy="-24" r="9" fill="#f59e0b"/>
    <rect x="-3" y="-42" width="6" height="22" rx="2" fill="#94a3b8"/>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Setting Sun & Stop Clock (שעון שקיעה ועצור) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <!-- Setting Sun Horizon -->
    <path d="M-60,35 L60,35" stroke="#ea580c" stroke-width="4"/>
    <path d="M-40,35 A40,40 0 0,1 40,35 Z" fill="url(#goldGrad)"/>
    <!-- Stop clock on top -->
    <circle cx="0" cy="-20" r="45" fill="#f8fafc" stroke="#dc2626" stroke-width="6"/>
    <circle cx="0" cy="-20" r="4" fill="#0f172a"/>
    <line x1="0" y1="-20" x2="0" y2="-50" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>
    <line x1="0" y1="-20" x2="20" y2="-20" stroke="#dc2626" stroke-width="4" stroke-linecap="round"/>
    <rect x="-12" y="-72" width="24" height="8" rx="2" fill="#dc2626"/>
  </g>
`);

// hol-46: נענועי לולב (לולב ירוק תמיר + חיצי תנועה לארבע רוחות)
SVGS['hol-46'] = wrapSvg(`
  <!-- Right: Tall Green Lulav (לולב ירוק תמיר) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <line x1="0" y1="-95" x2="0" y2="85" stroke="#16a34a" stroke-width="14" stroke-linecap="round"/>
    <line x1="-16" y1="-30" x2="0" y2="30" stroke="#22c55e" stroke-width="7" stroke-linecap="round"/>
    <line x1="16" y1="-30" x2="0" y2="30" stroke="#22c55e" stroke-width="7" stroke-linecap="round"/>
    <line x1="-20" y1="10" x2="0" y2="65" stroke="#15803d" stroke-width="7" stroke-linecap="round"/>
    <line x1="20" y1="10" x2="0" y2="65" stroke="#15803d" stroke-width="7" stroke-linecap="round"/>
    <rect x="-14" y="60" width="28" height="30" rx="4" fill="#ca8a04"/>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: 4-Directional Compass Movement Arrows (חיצי תנועה לארבע רוחות) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="70" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="6 6"/>
    <!-- North -->
    <polygon points="0,-80 14,-55 -14,-55" fill="#3b82f6"/>
    <line x1="0" y1="-55" x2="0" y2="0" stroke="#3b82f6" stroke-width="5"/>
    <!-- South -->
    <polygon points="0,80 14,55 -14,55" fill="#3b82f6"/>
    <line x1="0" y1="55" x2="0" y2="0" stroke="#3b82f6" stroke-width="5"/>
    <!-- East -->
    <polygon points="80,0 55,14 55,-14" fill="#3b82f6"/>
    <line x1="55" y1="0" x2="0" y2="0" stroke="#3b82f6" stroke-width="5"/>
    <!-- West -->
    <polygon points="-80,0 -55,14 -55,-14" fill="#3b82f6"/>
    <line x1="-55" y1="0" x2="0" y2="0" stroke="#3b82f6" stroke-width="5"/>
    <circle cx="0" cy="0" r="12" fill="#f59e0b"/>
  </g>
`);

// hol-51: קישוטי סוכה (שרשרת נייר צבעונית + פנס זוהר תלוי)
SVGS['hol-51'] = wrapSvg(`
  <!-- Right: Colorful Paper Chain (שרשרת נייר צבעונית) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <ellipse cx="-50" cy="0" rx="32" ry="20" fill="none" stroke="#ef4444" stroke-width="10" transform="rotate(-25 -50 0)"/>
    <ellipse cx="-18" cy="0" rx="32" ry="20" fill="none" stroke="#3b82f6" stroke-width="10" transform="rotate(25 -18 0)"/>
    <ellipse cx="18" cy="0" rx="32" ry="20" fill="none" stroke="#10b981" stroke-width="10" transform="rotate(-25 18 0)"/>
    <ellipse cx="50" cy="0" rx="32" ry="20" fill="none" stroke="#f59e0b" stroke-width="10" transform="rotate(25 50 0)"/>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Glowing Hanging Sukkah Lantern (פנס זוהר תלוי) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <line x1="0" y1="-90" x2="0" y2="-50" stroke="#94a3b8" stroke-width="4"/>
    <polygon points="-35,-50 35,-50 45,35 -45,35" fill="url(#goldGrad)" stroke="#b45309" stroke-width="4"/>
    <circle cx="0" cy="-8" r="22" fill="#fef08a"/>
    <polygon points="-30,35 30,35 0,75" fill="#b45309"/>
    <!-- Sparkles -->
    <line x1="-55" y1="-8" x2="-70" y2="-8" stroke="#facc15" stroke-width="4" stroke-linecap="round"/>
    <line x1="55" y1="-8" x2="70" y2="-8" stroke="#facc15" stroke-width="4" stroke-linecap="round"/>
  </g>
`);

// hol-55: לביבות חמות (תפוחי אדמה ומגררת + מחבת רוחשת לביבות)
SVGS['hol-55'] = wrapSvg(`
  <!-- Right: Potatoes and Grater (תפוחי אדמה ומגררת) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <rect x="-35" y="-65" width="70" height="95" rx="8" fill="#94a3b8" stroke="#475569" stroke-width="4"/>
    <rect x="-24" y="-55" width="48" height="75" fill="#cbd5e1"/>
    <circle cx="-12" cy="-40" r="3" fill="#334155"/>
    <circle cx="12" cy="-40" r="3" fill="#334155"/>
    <circle cx="0" cy="-25" r="3" fill="#334155"/>
    <circle cx="-12" cy="-10" r="3" fill="#334155"/>
    <circle cx="12" cy="-10" r="3" fill="#334155"/>
    <!-- Potatoes -->
    <ellipse cx="42" cy="40" rx="34" ry="24" fill="#a16207" transform="rotate(15 42 40)"/>
    <ellipse cx="-42" cy="42" rx="30" ry="22" fill="#b45309" transform="rotate(-15 -42 42)"/>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Sizzling Pan with Golden Latkes (מחבת רוחשת לביבות) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <circle cx="0" cy="10" r="65" fill="#334155" stroke="#1e293b" stroke-width="6"/>
    <line x1="55" y1="35" x2="105" y2="65" stroke="#1e293b" stroke-width="12" stroke-linecap="round"/>
    <!-- Golden Latkes -->
    <ellipse cx="-20" cy="-10" rx="22" ry="18" fill="url(#goldGrad)" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="22" cy="-5" rx="20" ry="17" fill="url(#goldGrad)" stroke="#b45309" stroke-width="2"/>
    <ellipse cx="-5" cy="28" rx="24" ry="19" fill="url(#goldGrad)" stroke="#b45309" stroke-width="2"/>
    <!-- Sizzle steam -->
    <path d="M-20,-45 Q-15,-60 -25,-75" stroke="#facc15" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M10,-40 Q15,-55 5,-70" stroke="#facc15" stroke-width="3" fill="none" stroke-linecap="round"/>
  </g>
`);

// hol-59: הנרות הללו (שמונה להבות נר + ספר פיוטים פתוח)
SVGS['hol-59'] = wrapSvg(`
  <!-- Right: 8 Candle Flames (שמונה להבות נר) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <!-- Base stand line -->
    <line x1="-80" y1="50" x2="80" y2="50" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
    <!-- 8 candles -->
    <g transform="translate(-70, 0)">
      <rect x="-4" y="0" width="8" height="50" fill="#f8fafc" rx="2"/>
      <path d="M0,-2 L-6,-18 C-6,-26 0,-34 0,-34 C0,-34 6,-26 6,-18 Z" fill="url(#goldGrad)"/>
    </g>
    <g transform="translate(-50, 0)">
      <rect x="-4" y="0" width="8" height="50" fill="#f8fafc" rx="2"/>
      <path d="M0,-2 L-6,-18 C-6,-26 0,-34 0,-34 C0,-34 6,-26 6,-18 Z" fill="url(#goldGrad)"/>
    </g>
    <g transform="translate(-30, 0)">
      <rect x="-4" y="0" width="8" height="50" fill="#f8fafc" rx="2"/>
      <path d="M0,-2 L-6,-18 C-6,-26 0,-34 0,-34 C0,-34 6,-26 6,-18 Z" fill="url(#goldGrad)"/>
    </g>
    <g transform="translate(-10, 0)">
      <rect x="-4" y="0" width="8" height="50" fill="#f8fafc" rx="2"/>
      <path d="M0,-2 L-6,-18 C-6,-26 0,-34 0,-34 C0,-34 6,-26 6,-18 Z" fill="url(#goldGrad)"/>
    </g>
    <g transform="translate(10, 0)">
      <rect x="-4" y="0" width="8" height="50" fill="#f8fafc" rx="2"/>
      <path d="M0,-2 L-6,-18 C-6,-26 0,-34 0,-34 C0,-34 6,-26 6,-18 Z" fill="url(#goldGrad)"/>
    </g>
    <g transform="translate(30, 0)">
      <rect x="-4" y="0" width="8" height="50" fill="#f8fafc" rx="2"/>
      <path d="M0,-2 L-6,-18 C-6,-26 0,-34 0,-34 C0,-34 6,-26 6,-18 Z" fill="url(#goldGrad)"/>
    </g>
    <g transform="translate(50, 0)">
      <rect x="-4" y="0" width="8" height="50" fill="#f8fafc" rx="2"/>
      <path d="M0,-2 L-6,-18 C-6,-26 0,-34 0,-34 C0,-34 6,-26 6,-18 Z" fill="url(#goldGrad)"/>
    </g>
    <g transform="translate(70, 0)">
      <rect x="-4" y="0" width="8" height="50" fill="#f8fafc" rx="2"/>
      <path d="M0,-2 L-6,-18 C-6,-26 0,-34 0,-34 C0,-34 6,-26 6,-18 Z" fill="url(#goldGrad)"/>
    </g>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Liturgical Open Hymn Book (ספר פיוטים פתוח) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <path d="M-75,-30 C-35,-45 -10,-35 0,-20 C10,-35 35,-45 75,-30 L70,45 C35,35 10,40 0,30 C-10,40 -35,35 -70,45 Z" fill="#fef3c7" stroke="#b45309" stroke-width="3"/>
    <path d="M0,-20 L0,30" stroke="#b45309" stroke-width="3"/>
    <text x="-35" y="0" font-family="Rubik, sans-serif" font-size="28" fill="#78350f" text-anchor="middle">♪</text>
    <text x="35" y="0" font-family="Rubik, sans-serif" font-size="28" fill="#78350f" text-anchor="middle">♫</text>
  </g>
`);

// hol-60: יהודה המכבי (אריה יהודה + מקבת / פטיש קרב)
SVGS['hol-60'] = wrapSvg(`
  <!-- Right: Lion of Judah Silhouette (אריה יהודה) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <!-- Lion head mane -->
    <circle cx="0" cy="0" r="55" fill="url(#goldGrad)" stroke="#78350f" stroke-width="3"/>
    <circle cx="-15" cy="-8" r="6" fill="#451a03"/>
    <circle cx="15" cy="-8" r="6" fill="#451a03"/>
    <polygon points="0,5 -8,-3 8,-3" fill="#451a03"/>
    <path d="M-8,12 Q0,18 8,12" stroke="#451a03" stroke-width="3" fill="none"/>
    <!-- Crown of Judah -->
    <polygon points="-30,-45 -15,-65 0,-50 15,-65 30,-45" fill="url(#goldGrad)" stroke="#78350f" stroke-width="2"/>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: War Battle Hammer (מקבת / פטיש קרב) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <!-- Wooden handle -->
    <rect x="-8" y="-30" width="16" height="110" rx="4" fill="#78350f" stroke="#451a03" stroke-width="3"/>
    <!-- Iron hammer head -->
    <rect x="-55" y="-60" width="110" height="42" rx="8" fill="#94a3b8" stroke="#334155" stroke-width="4"/>
    <rect x="-62" y="-55" width="14" height="32" rx="4" fill="#64748b"/>
    <rect x="48" y="-55" width="14" height="32" rx="4" fill="#64748b"/>
  </g>
`);

// hol-63: סדר ט"ו בשבט (ארבע כוסות יין גוונים + קערת שבעת המינים)
SVGS['hol-63'] = wrapSvg(`
  <!-- Right: 4 Wine Cups in Gradual Shades (ארבע כוסות יין גוונים) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <!-- Cup 1: White wine -->
    <g transform="translate(-60, 0)">
      <path d="M-14,-25 L14,-25 L10,10 C10,20 -10,20 -10,10 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
      <line x1="0" y1="18" x2="0" y2="35" stroke="#ca8a04" stroke-width="3"/>
      <ellipse cx="0" cy="35" rx="10" ry="4" fill="#ca8a04"/>
    </g>
    <!-- Cup 2: Light pink wine -->
    <g transform="translate(-20, 0)">
      <path d="M-14,-25 L14,-25 L10,10 C10,20 -10,20 -10,10 Z" fill="#fca5a5" stroke="#e11d48" stroke-width="2"/>
      <line x1="0" y1="18" x2="0" y2="35" stroke="#e11d48" stroke-width="3"/>
      <ellipse cx="0" cy="35" rx="10" ry="4" fill="#e11d48"/>
    </g>
    <!-- Cup 3: Rose wine -->
    <g transform="translate(20, 0)">
      <path d="M-14,-25 L14,-25 L10,10 C10,20 -10,20 -10,10 Z" fill="#f43f5e" stroke="#be123c" stroke-width="2"/>
      <line x1="0" y1="18" x2="0" y2="35" stroke="#be123c" stroke-width="3"/>
      <ellipse cx="0" cy="35" rx="10" ry="4" fill="#be123c"/>
    </g>
    <!-- Cup 4: Deep red wine -->
    <g transform="translate(60, 0)">
      <path d="M-14,-25 L14,-25 L10,10 C10,20 -10,20 -10,10 Z" fill="#881337" stroke="#4c0519" stroke-width="2"/>
      <line x1="0" y1="18" x2="0" y2="35" stroke="#4c0519" stroke-width="3"/>
      <ellipse cx="0" cy="35" rx="10" ry="4" fill="#4c0519"/>
    </g>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Plate of 7 Species Fruits (קערת שבעת המינים) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <circle cx="0" cy="10" r="65" fill="#f8fafc" stroke="#94a3b8" stroke-width="4"/>
    <circle cx="-25" cy="-5" r="14" fill="#dc2626"/> <!-- Pomegranate -->
    <circle cx="0" cy="-20" r="14" fill="#78350f"/> <!-- Date -->
    <circle cx="25" cy="-5" r="14" fill="#15803d"/> <!-- Fig -->
    <circle cx="-15" cy="25" r="12" fill="#7c2d12"/> <!-- Grapes -->
    <circle cx="15" cy="25" r="12" fill="#eab308"/> <!-- Olive -->
  </g>
`);

// hol-64: עץ שתול על מים (עץ עבות פורח + פלג מים זורם)
SVGS['hol-64'] = wrapSvg(`
  <!-- Right: Blooming Tree (עץ עבות פורח) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <path d="M-12,70 L-8,10 C-8,-10 -30,-30 0,-60 C30,-30 8,-10 8,10 L12,70" fill="#78350f" stroke="#451a03" stroke-width="4"/>
    <circle cx="0" cy="-50" r="55" fill="url(#greenGrad)"/>
    <circle cx="-35" cy="-35" r="35" fill="url(#greenGrad)"/>
    <circle cx="35" cy="-35" r="35" fill="url(#greenGrad)"/>
    <circle cx="-20" cy="-65" r="25" fill="#4ade80"/>
    <circle cx="20" cy="-65" r="25" fill="#4ade80"/>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Flowing Water Stream (פלג מים זורם) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <path d="M-75,45 Q-25,10 0,35 Q25,60 75,25 L75,70 L-75,70 Z" fill="url(#cyanGrad)"/>
    <path d="M-75,0 Q-25,-35 0,-10 Q25,15 75,-20 L75,25 L-75,25 Z" fill="url(#blueGrad)"/>
    <path d="M-70,10 Q-25,-20 0,5 Q25,30 70,-5" stroke="#ffffff" stroke-width="4" fill="none" opacity="0.7"/>
    <path d="M-70,55 Q-25,25 0,45 Q25,65 70,35" stroke="#ffffff" stroke-width="4" fill="none" opacity="0.7"/>
  </g>
`);

// hol-69: ונהפך הוא (חצי היפוך 180 מעלות + מסכת פורים ותחפושת)
SVGS['hol-69'] = wrapSvg(`
  <!-- Right: 180 Degree Flip Circular Arrow (חצי היפוך 180 מעלות) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <path d="M-50,0 A50,50 0 1,1 50,0" fill="none" stroke="url(#goldGrad)" stroke-width="12" stroke-linecap="round"/>
    <polygon points="35,0 65,0 50,25" fill="#f59e0b"/>
    <text x="0" y="10" font-family="Rubik, sans-serif" font-size="34" font-weight="900" fill="#fef08a" text-anchor="middle">180°</text>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Purim Masquerade Mask (מסכת פורים ותחפושת) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <path d="M-65,-25 C-30,-45 0,-15 0,-15 C0,-15 30,-45 65,-25 C80,10 40,40 0,30 C-40,40 -80,10 -65,-25 Z" fill="url(#purpleGrad)" stroke="#fbbf24" stroke-width="4"/>
    <!-- Eye holes -->
    <ellipse cx="-30" cy="-5" rx="16" ry="10" fill="#09090b"/>
    <ellipse cx="30" cy="-5" rx="16" ry="10" fill="#09090b"/>
    <!-- Feathers -->
    <path d="M0,-25 Q-20,-75 0,-85 Q20,-75 0,-25" fill="url(#cyanGrad)"/>
    <circle cx="0" cy="-25" r="8" fill="#fbbf24"/>
  </g>
`);

// hol-76: תענית אסתר (כתר אסתר המלכה + צלחת צום נעולה)
SVGS['hol-76'] = wrapSvg(`
  <!-- Right: Queen Esther's Crown (כתר אסתר המלכה) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <polygon points="-55,30 55,30 45,-25 20,-5 0,-38 -20,-5 -45,-25" fill="url(#goldGrad)" stroke="#b45309" stroke-width="4"/>
    <circle cx="0" cy="-38" r="7" fill="#ef4444"/>
    <circle cx="-45" cy="-25" r="6" fill="#3b82f6"/>
    <circle cx="45" cy="-25" r="6" fill="#3b82f6"/>
    <circle cx="0" cy="10" r="10" fill="#ec4899"/>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Locked Empty Fasting Plate (צלחת צום נעולה) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="65" fill="#f8fafc" stroke="#94a3b8" stroke-width="5"/>
    <circle cx="0" cy="0" r="50" fill="none" stroke="#e2e8f0" stroke-width="2"/>
    <!-- Padlock on plate -->
    <rect x="-22" y="-10" width="44" height="36" rx="6" fill="url(#goldGrad)" stroke="#78350f" stroke-width="3"/>
    <path d="M-14,-10 L-14,-26 C-14,-36 14,-36 14,-26 L14,-10" fill="none" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
    <circle cx="0" cy="8" r="4" fill="#451a03"/>
  </g>
`);

// hol-78: עשר המכות (הספרה 10 באדום + דם וצפרדע)
SVGS['hol-78'] = wrapSvg(`
  <!-- Right: Number 10 in Bold Red -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <rect x="-85" y="-85" width="170" height="170" rx="24" fill="url(#cardGrad)" stroke="#ef4444" stroke-width="4"/>
    <text x="0" y="45" font-family="Rubik, system-ui, sans-serif" font-size="115" font-weight="900" fill="url(#redGrad)" text-anchor="middle">10</text>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Blood Droplet and Leaping Frog -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <!-- Blood droplet -->
    <g transform="translate(-45, 5)">
      <path d="M0,-60 C22,-25 40,0 40,28 C40,55 22,70 0,70 C-22,70 -40,55 -40,28 C-40,0 -22,-25 0,-60 Z" fill="url(#redGrad)" stroke="#991b1b" stroke-width="3"/>
      <ellipse cx="-12" cy="22" rx="8" ry="16" fill="#fca5a5" opacity="0.6" transform="rotate(-20 -12 22)"/>
    </g>
    <!-- Leaping Frog -->
    <g transform="translate(45, 15)">
      <ellipse cx="0" cy="15" rx="35" ry="25" fill="#22c55e" stroke="#15803d" stroke-width="3"/>
      <ellipse cx="0" cy="-5" rx="26" ry="18" fill="#4ade80"/>
      <circle cx="-16" cy="-20" r="12" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
      <circle cx="16" cy="-20" r="12" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
      <circle cx="-16" cy="-20" r="7" fill="#fef08a"/>
      <circle cx="16" cy="-20" r="7" fill="#fef08a"/>
      <circle cx="-14" cy="-20" r="4" fill="#0f172a"/>
      <circle cx="14" cy="-20" r="4" fill="#0f172a"/>
      <path d="M-15,5 Q0,14 15,5" stroke="#15803d" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M-28,20 Q-50,8 -38,36" stroke="#16a34a" stroke-width="8" stroke-linecap="round" fill="none"/>
      <path d="M28,20 Q50,8 38,36" stroke="#16a34a" stroke-width="8" stroke-linecap="round" fill="none"/>
    </g>
  </g>
`);

// hol-79: חג האביב (שיבולי אביב ירוקות + פרפר ופרחי שדה)
SVGS['hol-79'] = wrapSvg(`
  <!-- Right: Spring Barley Stalks (שיבולי אביב ירוקות) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <line x1="0" y1="80" x2="0" y2="-70" stroke="#16a34a" stroke-width="8" stroke-linecap="round"/>
    <ellipse cx="-15" cy="-50" rx="8" ry="18" fill="#4ade80" transform="rotate(-30 -15 -50)"/>
    <ellipse cx="15" cy="-50" rx="8" ry="18" fill="#4ade80" transform="rotate(30 15 -50)"/>
    <ellipse cx="-18" cy="-20" rx="9" ry="20" fill="#22c55e" transform="rotate(-35 -18 -20)"/>
    <ellipse cx="18" cy="-20" rx="9" ry="20" fill="#22c55e" transform="rotate(35 18 -20)"/>
    <ellipse cx="-18" cy="15" rx="9" ry="20" fill="#16a34a" transform="rotate(-35 -18 15)"/>
    <ellipse cx="18" cy="15" rx="9" ry="20" fill="#16a34a" transform="rotate(35 18 15)"/>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Butterfly and Blooming Wildflowers (פרפר ופרחי שדה) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <!-- Butterfly -->
    <path d="M-35,-20 C-65,-60 0,-60 -15,-20 C0,10 -55,20 -35,-20 Z" fill="url(#cyanGrad)"/>
    <path d="M5,-20 C-10,-60 55,-60 40,-20 C25,10 80,20 60,-20 Z" fill="url(#cyanGrad)"/>
    <line x1="-15" y1="-40" x2="40" y2="0" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
    <!-- Red Anemone Wildflower -->
    <circle cx="0" cy="35" r="24" fill="#ef4444"/>
    <circle cx="0" cy="35" r="9" fill="#09090b"/>
  </g>
`);

// ==========================================
// 2. CATEGORY B: 6 IDENTICAL CLONE RIDDLES
// ==========================================

// hol-96: שמעון בר יוחאי (מערת סלעים עם חרוב + ספר הזוהר הקדוש)
SVGS['hol-96'] = wrapSvg(`
  <!-- Right: Cave with Carob Tree Branch -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <path d="M-80,70 C-85,-20 -25,-75 15,-65 C65,-55 85,-10 75,70 Z" fill="#78716c" stroke="#44403c" stroke-width="4"/>
    <ellipse cx="0" cy="25" rx="42" ry="45" fill="#1c1917"/>
    <!-- Carob Branch with pods -->
    <path d="M-25,-55 Q25,-85 65,-70" stroke="#78350f" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M15,-65 Q30,-45 20,-25" stroke="#451a03" stroke-width="11" stroke-linecap="round" fill="none"/>
    <path d="M45,-60 Q60,-40 50,-20" stroke="#451a03" stroke-width="11" stroke-linecap="round" fill="none"/>
    <ellipse cx="5" cy="-70" rx="8" ry="16" fill="#15803d" transform="rotate(35 5 -70)"/>
    <ellipse cx="35" cy="-80" rx="8" ry="16" fill="#16a34a" transform="rotate(-30 35 -80)"/>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Holy Zohar Book Glowing With Golden Rays -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <circle cx="0" cy="5" r="85" fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="6 8" opacity="0.6"/>
    <line x1="0" y1="-80" x2="0" y2="-105" stroke="#fbbf24" stroke-width="5" stroke-linecap="round"/>
    <line x1="-65" y1="-65" x2="-85" y2="-85" stroke="#fbbf24" stroke-width="5" stroke-linecap="round"/>
    <line x1="65" y1="-65" x2="85" y2="-85" stroke="#fbbf24" stroke-width="5" stroke-linecap="round"/>
    <line x1="-80" y1="5" x2="-105" y2="5" stroke="#fbbf24" stroke-width="5" stroke-linecap="round"/>
    <line x1="80" y1="5" x2="105" y2="5" stroke="#fbbf24" stroke-width="5" stroke-linecap="round"/>
    <path d="M-80,-35 C-40,-50 -10,-40 0,-25 C10,-40 40,-50 80,-35 L75,60 C40,45 10,52 0,40 C-10,52 -40,45 -75,60 Z" fill="#fef3c7" stroke="#b45309" stroke-width="3"/>
    <path d="M0,-25 L0,40" stroke="#b45309" stroke-width="4"/>
    <line x1="-65" y1="-15" x2="-15" y2="-10" stroke="#92400e" stroke-width="3" stroke-dasharray="6 4"/>
    <line x1="-65" y1="5" x2="-15" y2="10" stroke="#92400e" stroke-width="3" stroke-dasharray="6 4"/>
    <line x1="-65" y1="25" x2="-15" y2="30" stroke="#92400e" stroke-width="3" stroke-dasharray="6 4"/>
    <line x1="15" y1="-10" x2="65" y2="-15" stroke="#92400e" stroke-width="3" stroke-dasharray="6 4"/>
    <line x1="15" y1="10" x2="65" y2="5" stroke="#92400e" stroke-width="3" stroke-dasharray="6 4"/>
    <line x1="15" y1="30" x2="65" y2="25" stroke="#92400e" stroke-width="3" stroke-dasharray="6 4"/>
    <rect x="-35" y="58" width="70" height="26" rx="8" fill="#78350f" stroke="#fbbf24" stroke-width="2"/>
    <text x="0" y="77" font-family="Rubik, system-ui, sans-serif" font-size="16" font-weight="900" fill="#fef08a" text-anchor="middle">הַזֹּהַר</text>
  </g>
`);

// hol-97: הילולת מירון (קבר מירון עם כיפה + מדורת הדלקה)
SVGS['hol-97'] = wrapSvg(`
  <!-- Right: Meron Tomb Monument with White Dome (קבר מירון עם כיפה) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <!-- Base stone building -->
    <rect x="-65" y="-10" width="130" height="85" fill="#e7e5e4" stroke="#78716c" stroke-width="4"/>
    <line x1="-65" y1="20" x2="65" y2="20" stroke="#a8a29e" stroke-width="3"/>
    <line x1="-65" y1="50" x2="65" y2="50" stroke="#a8a29e" stroke-width="3"/>
    <!-- Dome -->
    <path d="M-50,-10 C-50,-65 50,-65 50,-10 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="4"/>
    <circle cx="0" cy="-68" r="6" fill="#fbbf24"/>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Celebratory Bonfire (מדורת הדלקה) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <!-- Wood logs -->
    <line x1="-50" y1="65" x2="50" y2="40" stroke="#78350f" stroke-width="14" stroke-linecap="round"/>
    <line x1="-50" y1="40" x2="50" y2="65" stroke="#451a03" stroke-width="14" stroke-linecap="round"/>
    <!-- Roaring Fire Flames -->
    <path d="M0,45 C-50,20 -55,-40 -20,-75 C-10,-45 0,-40 5,-60 C25,-40 55,-10 40,45 Z" fill="url(#redGrad)"/>
    <path d="M0,45 C-30,25 -30,-20 -10,-45 C0,-25 5,-20 10,-35 C20,-20 30,0 20,45 Z" fill="url(#goldGrad)"/>
    <ellipse cx="0" cy="30" rx="14" ry="18" fill="#fef08a"/>
  </g>
`);

// hol-99: מצעד הדגלים (שיירת אנשים צועדת + דגלי ישראל מונפים)
SVGS['hol-99'] = wrapSvg(`
  <!-- Right: Marching Crowd (שיירת אנשים צועדת) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <!-- Person 1 -->
    <g transform="translate(-40, 10)">
      <circle cx="0" cy="-45" r="14" fill="#3b82f6"/>
      <path d="M-15,-25 L15,-25 L10,35 L-10,35 Z" fill="#1d4ed8"/>
      <line x1="-8" y1="35" x2="-18" y2="65" stroke="#1e293b" stroke-width="6" stroke-linecap="round"/>
      <line x1="8" y1="35" x2="18" y2="65" stroke="#1e293b" stroke-width="6" stroke-linecap="round"/>
    </g>
    <!-- Person 2 -->
    <g transform="translate(0, 0)">
      <circle cx="0" cy="-55" r="16" fill="#60a5fa"/>
      <path d="M-18,-35 L18,-35 L12,30 L-12,30 Z" fill="#2563eb"/>
      <line x1="-10" y1="30" x2="-22" y2="70" stroke="#1e293b" stroke-width="7" stroke-linecap="round"/>
      <line x1="10" y1="30" x2="22" y2="70" stroke="#1e293b" stroke-width="7" stroke-linecap="round"/>
    </g>
    <!-- Person 3 -->
    <g transform="translate(40, 15)">
      <circle cx="0" cy="-45" r="14" fill="#38bdf8"/>
      <path d="M-15,-25 L15,-25 L10,35 L-10,35 Z" fill="#0284c7"/>
      <line x1="-8" y1="35" x2="-16" y2="65" stroke="#1e293b" stroke-width="6" stroke-linecap="round"/>
      <line x1="8" y1="35" x2="16" y2="65" stroke="#1e293b" stroke-width="6" stroke-linecap="round"/>
    </g>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Israeli Blue & White Flags Waving (דגלי ישראל מונפים) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <!-- Flagpole -->
    <line x1="-50" y1="-85" x2="-50" y2="80" stroke="#71717a" stroke-width="6" stroke-linecap="round"/>
    <!-- Flag Canvas -->
    <rect x="-50" y="-80" width="110" height="70" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
    <rect x="-50" y="-72" width="110" height="10" fill="#2563eb"/>
    <rect x="-50" y="-22" width="110" height="10" fill="#2563eb"/>
    <!-- Star of David -->
    <polygon points="5,-55 -15,-30 25,-30" fill="none" stroke="#2563eb" stroke-width="3"/>
    <polygon points="5,-25 -15,-50 25,-50" fill="none" stroke="#2563eb" stroke-width="3"/>
  </g>
`);

// hol-85: שיר השירים (תווי נגינה כפולים + איילה וכרם פורח)
SVGS['hol-85'] = wrapSvg(`
  <!-- Right: Double Musical Notes (תווי נגינה כפולים) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <circle cx="-30" cy="35" r="18" fill="url(#blueGrad)"/>
    <circle cx="30" cy="15" r="18" fill="url(#blueGrad)"/>
    <line x1="-15" y1="35" x2="-15" y2="-45" stroke="#2563eb" stroke-width="8" stroke-linecap="round"/>
    <line x1="45" y1="15" x2="45" y2="-65" stroke="#2563eb" stroke-width="8" stroke-linecap="round"/>
    <polygon points="-15,-45 45,-65 45,-45 -15,-25" fill="#2563eb"/>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Graceful Gazelle and Blooming Grape Vineyard (איילה וכרם פורח) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <!-- Gazelle Head & Antlers -->
    <ellipse cx="-25" cy="10" rx="20" ry="30" fill="#d97706" transform="rotate(-20 -25 10)"/>
    <path d="M-30,-15 Q-45,-45 -35,-70" stroke="#78350f" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M-20,-15 Q-15,-45 -5,-65" stroke="#78350f" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="-32" cy="0" r="4" fill="#0f172a"/>
    <!-- Grape Cluster (כרם) -->
    <g transform="translate(30, 0)">
      <circle cx="-10" cy="-10" r="10" fill="#7e22ce"/>
      <circle cx="10" cy="-10" r="10" fill="#7e22ce"/>
      <circle cx="0" cy="5" r="10" fill="#9333ea"/>
      <circle cx="-10" cy="20" r="9" fill="#7e22ce"/>
      <circle cx="10" cy="20" r="9" fill="#7e22ce"/>
      <circle cx="0" cy="35" r="8" fill="#a855f7"/>
      <path d="M0,-20 L0,-35" stroke="#15803d" stroke-width="4"/>
      <ellipse cx="12" cy="-30" rx="8" ry="5" fill="#22c55e"/>
    </g>
  </g>
`);

// hol-106: תיקון ליל שבועות (ספרים פתוחים ונר לילה + שעון 04:00 לפנות בוקר)
SVGS['hol-106'] = wrapSvg(`
  <!-- Right: Open Study Books with Candle (ספרים פתוחים ונר לילה) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <path d="M-70,-20 C-30,-35 -10,-25 0,-10 C10,-25 30,-35 70,-20 L65,50 C30,40 10,45 0,35 C-10,45 -30,40 -65,50 Z" fill="#fef3c7" stroke="#b45309" stroke-width="3"/>
    <path d="M0,-10 L0,35" stroke="#b45309" stroke-width="3"/>
    <!-- Candle on side -->
    <rect x="-65" y="-55" width="14" height="40" rx="2" fill="#f8fafc" stroke="#cbd5e1"/>
    <path d="M-58,-58 Q-62,-72 -58,-80 Q-54,-72 -58,-58 Z" fill="url(#goldGrad)"/>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Dawn 04:00 Clock with Night Moon (שעון 04:00 לפנות בוקר) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="65" fill="#0f172a" stroke="#38bdf8" stroke-width="5"/>
    <!-- Clock marks -->
    <line x1="0" y1="-55" x2="0" y2="-45" stroke="#f8fafc" stroke-width="4"/>
    <line x1="55" y1="0" x2="45" y2="0" stroke="#f8fafc" stroke-width="4"/>
    <line x1="0" y1="55" x2="0" y2="45" stroke="#f8fafc" stroke-width="4"/>
    <line x1="-55" y1="0" x2="-45" y2="0" stroke="#f8fafc" stroke-width="4"/>
    <!-- Hands pointing to 04:00 -->
    <line x1="0" y1="0" x2="0" y2="-40" stroke="#facc15" stroke-width="5" stroke-linecap="round"/>
    <line x1="0" y1="0" x2="28" y2="18" stroke="#facc15" stroke-width="6" stroke-linecap="round"/>
    <circle cx="0" cy="0" r="5" fill="#f59e0b"/>
    <!-- 04:00 digital pill -->
    <rect x="-30" y="75" width="60" height="24" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
    <text x="0" y="92" font-family="Rubik, sans-serif" font-size="15" font-weight="900" fill="#38bdf8" text-anchor="middle">04:00</text>
  </g>
`);

// ==========================================
// 3. CATEGORY C: 3 PRIMITIVE / ABSTRACT RIDDLES
// ==========================================

// gen-13: שם רגליים (שביל + רגל מושטת להכשיל + סימן אזהרה)
SVGS['gen-13'] = wrapSvg(`
  <g transform="translate(450, 250)" filter="url(#shadow)">
    <!-- Walking Trail in Perspective -->
    <polygon points="-160,120 160,120 90,-90 -90,-90" fill="#27272a" stroke="#d97706" stroke-width="4"/>
    <!-- Yellow trail center dashes -->
    <line x1="0" y1="-80" x2="0" y2="100" stroke="#fbbf24" stroke-width="7" stroke-dasharray="18 16"/>

    <!-- Extended Foot / Leg Tripping (שם רגליים) -->
    <g transform="translate(15, 10)">
      <!-- Blue Jeans Pant Leg -->
      <path d="M140,-15 L45,-15 L-20,-5 L-20,35 L45,30 L140,25 Z" fill="url(#blueGrad)" stroke="#1e40af" stroke-width="4"/>
      <!-- Red Sneaker Shoe blocking the trail -->
      <path d="M-20,-5 L-75,-5 C-100,-5 -110,20 -95,42 L-20,42 Z" fill="url(#redGrad)" stroke="#991b1b" stroke-width="4"/>
      <!-- White shoe sole -->
      <path d="M-100,34 L-20,34 L-20,44 L-100,44 Z" fill="#ffffff"/>
      <!-- White sneaker laces & toe cap -->
      <circle cx="-65" cy="12" r="5" fill="#ffffff"/>
      <circle cx="-50" cy="12" r="5" fill="#ffffff"/>
      <path d="M-80,5 Q-70,-15 -55,0" stroke="#ffffff" stroke-width="3" fill="none"/>
    </g>

    <!-- Tripping Warning Effect -->
    <path d="M-105,-20 L-130,-55" stroke="#facc15" stroke-width="6" stroke-linecap="round"/>
    <path d="M-80,-35 L-95,-75" stroke="#facc15" stroke-width="6" stroke-linecap="round"/>
    <circle cx="-130" cy="-70" r="20" fill="#ef4444" stroke="#fef08a" stroke-width="3"/>
    <text x="-130" y="-62" font-family="Rubik, sans-serif" font-size="26" font-weight="900" fill="#ffffff" text-anchor="middle">!</text>
  </g>
`);

// gen-22: שם נפשו בכפו (לב/נפש זוהר + כף יד פתוחה ואוחזת)
SVGS['gen-22'] = wrapSvg(`
  <!-- Right: Glowing Heart / Soul (נפש / לב זוהר) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <circle cx="0" cy="5" r="75" fill="none" stroke="#f43f5e" stroke-width="2" stroke-dasharray="6 6" opacity="0.6"/>
    <path d="M0,45 C-60,-5 -45,-55 0,-25 C45,-55 60,-5 0,45 Z" fill="url(#redGrad)" stroke="#be123c" stroke-width="3"/>
    <ellipse cx="-15" cy="-8" rx="8" ry="14" fill="#fecdd3" opacity="0.6" transform="rotate(-25 -15 -8)"/>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Open Cupped Palm of Hand (כף יד פתוחה) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <!-- Palm and fingers -->
    <path d="M-40,65 L-40,20 C-40,-15 -25,-45 -10,-45 C0,-45 5,-15 5,-15 C10,-40 25,-40 30,-15 C35,-35 45,-35 50,-15 C55,-30 65,-25 65,-5 C65,30 20,65 -40,65 Z" fill="#fed7aa" stroke="#c2410c" stroke-width="4"/>
    <line x1="-15" y1="20" x2="25" y2="20" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>
  </g>
`);

// geo-20: מעלה אדומים (מדרגות מעלה + צוקי סלעים ובניינים אדומים)
SVGS['geo-20'] = wrapSvg(`
  <!-- Right: Ascending Staircase Steps (מעלה - מדרגות עולות) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <polygon points="-65,55 -65,25 -25,25 -25,-5 15,-5 15,-35 55,-35 55,55" fill="url(#goldGrad)" stroke="#78350f" stroke-width="4"/>
    <!-- Ascending Arrow -->
    <line x1="-50" y1="50" x2="45" y2="-45" stroke="#22c55e" stroke-width="8" stroke-linecap="round"/>
    <polygon points="45,-45 20,-45 45,-20" fill="#22c55e"/>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Red Desert Hills & Red City Houses (אדומים) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <!-- Red mountain ridge -->
    <path d="M-75,55 Q-40,-25 0,10 Q40,-35 75,55 Z" fill="url(#redGrad)" stroke="#991b1b" stroke-width="4"/>
    <!-- Red city houses on hill -->
    <rect x="-25" y="10" width="22" height="25" fill="#fee2e2" stroke="#b91c1c" stroke-width="2"/>
    <polygon points="-27,10 -14,-5 -1,10" fill="#dc2626"/>
    <rect x="5" y="15" width="20" height="20" fill="#fee2e2" stroke="#b91c1c" stroke-width="2"/>
    <polygon points="3,15 15,3 27,15" fill="#dc2626"/>
  </g>
`);

// ==========================================
// 4. CATEGORY D: 5 MULTI-PART MONOLITHIC RIDDLES
// ==========================================

// hol-81: קריעת ים סוף (חומת מים משני הצדדים + שביל יבשה באמצע)
SVGS['hol-81'] = wrapSvg(`
  <!-- Right: Parting Sea Wave Walls (קריעת ים סוף) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <path d="M-55,-60 C-85,-20 -85,30 -55,60 L-30,60 C-50,20 -50,-20 -30,-60 Z" fill="url(#blueGrad)" stroke="#1d4ed8" stroke-width="3"/>
    <path d="M55,-60 C85,-20 85,30 55,60 L30,60 C50,20 50,-20 30,-60 Z" fill="url(#blueGrad)" stroke="#1d4ed8" stroke-width="3"/>
    <line x1="0" y1="-60" x2="0" y2="60" stroke="#93c5fd" stroke-width="4" stroke-dasharray="8 6"/>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Dry Sand Path (שביל יבשה בים) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <polygon points="-50,65 50,65 30,-65 -30,-65" fill="url(#goldGrad)" stroke="#b45309" stroke-width="3"/>
    <ellipse cx="-8" cy="-35" rx="5" ry="9" fill="#78350f"/>
    <ellipse cx="8" cy="-10" rx="5" ry="9" fill="#78350f"/>
    <ellipse cx="-8" cy="15" rx="5" ry="9" fill="#78350f"/>
    <ellipse cx="8" cy="40" rx="5" ry="9" fill="#78350f"/>
  </g>
`);

// hol-89: מטס חיל האוויר (מטוסי סילון במבנה + שובלי עשן כחול-לבן)
SVGS['hol-89'] = wrapSvg(`
  <!-- Right: 3 Fighter Jets Formation (מטוסי סילון במבנה) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <!-- Lead jet -->
    <g transform="translate(0, -35)">
      <polygon points="0,-35 8,0 24,14 8,10 8,22 14,28 -14,28 -8,22 -8,10 -24,14 -8,0" fill="#cbd5e1" stroke="#1e293b" stroke-width="2.5"/>
      <circle cx="0" cy="6" r="4" fill="#2563eb"/>
    </g>
    <!-- Wingman 1 -->
    <g transform="translate(-45, 15)">
      <polygon points="0,-30 7,0 20,12 7,9 7,18 12,24 -12,24 -7,18 -7,9 -20,12 -7,0" fill="#94a3b8" stroke="#1e293b" stroke-width="2"/>
    </g>
    <!-- Wingman 2 -->
    <g transform="translate(45, 15)">
      <polygon points="0,-30 7,0 20,12 7,9 7,18 12,24 -12,24 -7,18 -7,9 -20,12 -7,0" fill="#94a3b8" stroke="#1e293b" stroke-width="2"/>
    </g>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Blue and White Smoke Trails (שובלי עשן כחול-לבן) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <rect x="-60" y="-60" width="120" height="120" rx="16" fill="url(#cardGrad)" stroke="#38bdf8" stroke-width="3"/>
    <line x1="-30" y1="-45" x2="-30" y2="45" stroke="#3b82f6" stroke-width="12" stroke-linecap="round"/>
    <line x1="0" y1="-45" x2="0" y2="45" stroke="#ffffff" stroke-width="12" stroke-linecap="round"/>
    <line x1="30" y1="-45" x2="30" y2="45" stroke="#3b82f6" stroke-width="12" stroke-linecap="round"/>
  </g>
`);

// hol-100: הכותל המערבי (קיר אבני ענק עתיקות + פתקי תפילה בסדק)
SVGS['hol-100'] = wrapSvg(`
  <!-- Right: Ancient Giant Stone Wall (קיר אבני ענק עתיקות) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <rect x="-75" y="-60" width="150" height="120" rx="4" fill="#d6d3d1" stroke="#78716c" stroke-width="4"/>
    <line x1="-75" y1="-20" x2="75" y2="-20" stroke="#78716c" stroke-width="3"/>
    <line x1="-75" y1="20" x2="75" y2="20" stroke="#78716c" stroke-width="3"/>
    <line x1="-25" y1="-60" x2="-25" y2="-20" stroke="#78716c" stroke-width="3"/>
    <line x1="25" y1="-60" x2="25" y2="-20" stroke="#78716c" stroke-width="3"/>
    <line x1="0" y1="-20" x2="0" y2="20" stroke="#78716c" stroke-width="3"/>
    <circle cx="-25" cy="-20" r="10" fill="#15803d"/>
    <circle cx="35" cy="20" r="12" fill="#15803d"/>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Folded Prayer Notes (פתקי תפילה בסדק) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <rect x="-65" y="-65" width="130" height="130" rx="20" fill="url(#cardGrad)" stroke="#fbbf24" stroke-width="3"/>
    <path d="M-45,0 L45,0" stroke="#52525b" stroke-width="16" stroke-linecap="round"/>
    <rect x="-30" y="-12" width="22" height="24" rx="3" fill="#ffffff" stroke="#94a3b8" stroke-width="2" transform="rotate(12 -19 0)"/>
    <rect x="8" y="-14" width="24" height="28" rx="3" fill="#ffffff" stroke="#94a3b8" stroke-width="2" transform="rotate(-15 20 0)"/>
    <text x="-19" y="5" font-family="Rubik, sans-serif" font-size="14" font-weight="900" fill="#3b82f6" text-anchor="middle">תפילה</text>
  </g>
`);

// hol-102: ביכורים (סל קש מעוטר + פירות ראשונים של שבעת המינים)
SVGS['hol-102'] = wrapSvg(`
  <!-- Right: Decorated Wicker Basket (סל קש מעוטר) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <path d="M-50,0 C-50,-65 50,-65 50,0" fill="none" stroke="#78350f" stroke-width="7" stroke-linecap="round"/>
    <path d="M-65,0 L65,0 L50,70 L-50,70 Z" fill="#b45309" stroke="#78350f" stroke-width="4"/>
    <line x1="-60" y1="22" x2="60" y2="22" stroke="#d97706" stroke-width="3"/>
    <line x1="-55" y1="45" x2="55" y2="45" stroke="#d97706" stroke-width="3"/>
    <ellipse cx="-40" cy="-2" rx="12" ry="6" fill="#15803d" transform="rotate(-15 -40 -2)"/>
    <ellipse cx="40" cy="-2" rx="12" ry="6" fill="#15803d" transform="rotate(15 40 -2)"/>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: First Fruits of Seven Species (פירות ראשונים) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <circle cx="0" cy="10" r="65" fill="#f8fafc" stroke="#94a3b8" stroke-width="4"/>
    <circle cx="-25" cy="-5" r="18" fill="#dc2626"/>
    <polygon points="-25,-28 -20,-22 -30,-22" fill="#dc2626"/>
    <circle cx="22" cy="-8" r="18" fill="#701a75"/>
    <circle cx="-10" cy="25" r="12" fill="#7e22ce"/>
    <circle cx="10" cy="25" r="12" fill="#9333ea"/>
    <circle cx="0" cy="38" r="10" fill="#a855f7"/>
  </g>
`);

// geo-17: מצדה (מבצר בצוק מבודד + שביל הנחש)
SVGS['geo-17'] = wrapSvg(`
  <!-- Right: Masada Isolated Mountain Cliff (מצוק מצדה מבודד) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <polygon points="-75,60 -45,-30 45,-30 75,60" fill="#78350f" stroke="#b45309" stroke-width="4"/>
    <rect x="-25" y="-55" width="50" height="25" rx="2" fill="#d97706" stroke="#fbbf24" stroke-width="2"/>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Winding Snake Path (שביל הנחש) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <rect x="-65" y="-65" width="130" height="130" rx="20" fill="url(#cardGrad)" stroke="#fbbf24" stroke-width="3"/>
    <path d="M-45,45 Q0,30 -30,5 Q30,-20 -20,-45" stroke="#facc15" stroke-width="8" stroke-dasharray="12 8" fill="none" stroke-linecap="round"/>
    <circle cx="-20" cy="-45" r="8" fill="#ea580c"/>
  </g>
`);

// ==========================================
// 5. CATEGORY E: 4 FORMULA / DRAWING ADJUSTMENTS
// ==========================================

// hol-40: כפרות (תרנגול + חץ מעגלי + מטבעות צדקה)
SVGS['hol-40'] = wrapSvg(`
  <!-- Right: Rooster (תרנגול) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <ellipse cx="0" cy="10" rx="45" ry="35" fill="#f8fafc"/>
    <circle cx="35" cy="-15" r="22" fill="#f8fafc"/>
    <path d="M30,-35 C35,-45 45,-45 42,-35 C48,-42 55,-40 50,-30 Z" fill="#ef4444"/>
    <polygon points="55,-15 72,-10 55,-5" fill="#f59e0b"/>
    <path d="M-35,5 C-60,-15 -60,35 -40,30 Z" fill="#22c55e"/>
    <line x1="-15" y1="45" x2="-15" y2="70" stroke="#f59e0b" stroke-width="5"/>
    <line x1="15" y1="45" x2="15" y2="70" stroke="#f59e0b" stroke-width="5"/>
    <!-- Circular Arrow around Rooster head (סיבוב מעל הראש) -->
    <path d="M-25,-55 A35,35 0 1,1 25,-55" fill="none" stroke="#f59e0b" stroke-width="5" stroke-linecap="round"/>
    <polygon points="25,-55 35,-65 35,-45" fill="#f59e0b"/>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Charity Coins (מטבעות צדקה) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <circle cx="-25" cy="15" r="28" fill="url(#goldGrad)" stroke="#b45309" stroke-width="3"/>
    <circle cx="25" cy="15" r="28" fill="url(#goldGrad)" stroke="#b45309" stroke-width="3"/>
    <circle cx="0" cy="-20" r="34" fill="url(#goldGrad)" stroke="#b45309" stroke-width="4"/>
    <text x="0" y="-9" font-family="system-ui" font-size="34" font-weight="900" fill="#78350f" text-anchor="middle">₪</text>
  </g>
`);

// hol-41: נעילת שער (שער נסגר + מנעול זהב + שמש שוקעת)
SVGS['hol-41'] = wrapSvg(`
  <!-- Right: Closing Gate with Sunset (שער עם שמש שוקעת) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <!-- Sunset on horizon behind gate -->
    <path d="M-40,40 A40,40 0 0,1 40,40 Z" fill="url(#redGrad)"/>
    <!-- Gate posts -->
    <rect x="-65" y="-70" width="24" height="140" fill="#71717a" stroke="#27272a" stroke-width="3"/>
    <rect x="41" y="-70" width="24" height="140" fill="#71717a" stroke="#27272a" stroke-width="3"/>
    <path d="M-65,-70 Q0,-105 65,-70 Z" fill="#52525b" stroke="#27272a" stroke-width="3"/>
    <!-- Gate bars closing -->
    <rect x="-41" y="-60" width="82" height="130" fill="#78350f" stroke="#451a03" stroke-width="3"/>
    <line x1="0" y1="-60" x2="0" y2="70" stroke="#451a03" stroke-width="4"/>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Golden Padlock (מנעול זהב) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <path d="M-30,-10 L-30,-45 C-30,-68 30,-68 30,-45 L30,-10" fill="none" stroke="#cbd5e1" stroke-width="14" stroke-linecap="round"/>
    <rect x="-50" y="-15" width="100" height="85" rx="18" fill="url(#goldGrad)" stroke="#b45309" stroke-width="4"/>
    <circle cx="0" cy="22" r="9" fill="#451a03"/>
    <polygon points="-5,26 5,26 3,42 -3,42" fill="#451a03"/>
  </g>
`);

// hol-58: נס פך השמן (פך שמן קטן + להבה זוהרת + ספרה 8)
SVGS['hol-58'] = wrapSvg(`
  <!-- Right: Small Pure Oil Jug (פך שמן קטן) -->
  <g transform="translate(680, 260)" filter="url(#shadow)">
    <path d="M-30,-30 L30,-30 L40,45 C40,65 -40,65 -40,45 Z" fill="url(#goldGrad)" stroke="#b45309" stroke-width="3"/>
    <ellipse cx="0" cy="-30" rx="30" ry="8" fill="#f59e0b"/>
    <path d="M-30,-10 C-50,-10 -50,30 -35,35" stroke="#b45309" stroke-width="6" fill="none" stroke-linecap="round"/>
    <circle cx="0" cy="18" r="8" fill="#fef08a"/>
  </g>
  <text x="530" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Middle: Glowing Miraculous Flame (להבה זוהרת) -->
  <g transform="translate(390, 260)" filter="url(#shadow)">
    <path d="M0,50 C-45,20 -50,-30 -15,-65 C-5,-40 5,-35 10,-55 C30,-30 45,0 35,50 Z" fill="url(#redGrad)"/>
    <path d="M0,50 C-25,25 -25,-15 -5,-35 C5,-15 10,-10 15,-25 C25,-10 25,10 15,50 Z" fill="url(#goldGrad)"/>
    <ellipse cx="0" cy="30" rx="12" ry="16" fill="#fef08a"/>
  </g>
  <text x="250" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Number 8 (ספרה 8 לימי הנס) -->
  <g transform="translate(130, 260)" filter="url(#shadow)">
    <rect x="-65" y="-65" width="130" height="130" rx="20" fill="url(#cardGrad)" stroke="#fbbf24" stroke-width="4"/>
    <text x="0" y="38" font-family="Rubik, system-ui, sans-serif" font-size="95" font-weight="900" fill="url(#goldGrad)" text-anchor="middle">8</text>
  </g>
`);

// hol-91: מנורת הכנסת (מנורת שבעת הקנים + מבנה הכנסת בירושלים)
SVGS['hol-91'] = wrapSvg(`
  <!-- Right: 7-Branched Golden Menorah (מנורת שבעת הקנים מזהב) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <!-- Center stem -->
    <line x1="0" y1="-65" x2="0" y2="55" stroke="url(#goldGrad)" stroke-width="10" stroke-linecap="round"/>
    <rect x="-35" y="55" width="70" height="18" rx="4" fill="#b45309" stroke="#78350f" stroke-width="2"/>
    <!-- Outer branch 1 & 7 -->
    <path d="M-60,-55 C-60,10 0,25 0,25 C0,25 60,10 60,-55" fill="none" stroke="url(#goldGrad)" stroke-width="7" stroke-linecap="round"/>
    <!-- Middle branch 2 & 6 -->
    <path d="M-40,-55 C-40,-5 0,10 0,10 C0,10 40,-5 40,-55" fill="none" stroke="url(#goldGrad)" stroke-width="7" stroke-linecap="round"/>
    <!-- Inner branch 3 & 5 -->
    <path d="M-20,-55 C-20,-20 0,-5 0,-5 C0,-5 20,-20 20,-55" fill="none" stroke="url(#goldGrad)" stroke-width="7" stroke-linecap="round"/>
    <!-- 7 Flame tips -->
    <ellipse cx="-60" cy="-65" rx="5" ry="9" fill="#fef08a"/>
    <ellipse cx="-40" cy="-65" rx="5" ry="9" fill="#fef08a"/>
    <ellipse cx="-20" cy="-65" rx="5" ry="9" fill="#fef08a"/>
    <ellipse cx="0" cy="-75" rx="6" ry="11" fill="#fef08a"/>
    <ellipse cx="20" cy="-65" rx="5" ry="9" fill="#fef08a"/>
    <ellipse cx="40" cy="-65" rx="5" ry="9" fill="#fef08a"/>
    <ellipse cx="60" cy="-65" rx="5" ry="9" fill="#fef08a"/>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Knesset Building Facade (משכן הכנסת) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <!-- Base stone facade -->
    <rect x="-70" y="-20" width="140" height="80" rx="3" fill="#e2e8f0" stroke="#64748b" stroke-width="4"/>
    <!-- Pillars -->
    <line x1="-50" y1="-20" x2="-50" y2="60" stroke="#94a3b8" stroke-width="6"/>
    <line x1="-25" y1="-20" x2="-25" y2="60" stroke="#94a3b8" stroke-width="6"/>
    <line x1="0" y1="-20" x2="0" y2="60" stroke="#94a3b8" stroke-width="6"/>
    <line x1="25" y1="-20" x2="25" y2="60" stroke="#94a3b8" stroke-width="6"/>
    <line x1="50" y1="-20" x2="50" y2="60" stroke="#94a3b8" stroke-width="6"/>
    <!-- Overhanging Modern Roof -->
    <rect x="-85" y="-40" width="170" height="20" rx="3" fill="#64748b" stroke="#334155" stroke-width="3"/>
  </g>
`);

// hol-105: לוחות הברית (שני לוחות אבן מעוגלים)
SVGS['hol-105'] = wrapSvg(`
  <!-- Right: Tablet 1 (א-ה) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <path d="M-55,60 L55,60 L55,-25 C55,-55 -55,-55 -55,-25 Z" fill="url(#blueGrad)" stroke="#1d4ed8" stroke-width="4"/>
    <text x="0" y="18" font-family="Rubik, sans-serif" font-size="42" font-weight="900" fill="#fef08a" text-anchor="middle">א-ה</text>
  </g>
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>
  <!-- Left: Tablet 2 (ו-י) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <path d="M-55,60 L55,60 L55,-25 C55,-55 -55,-55 -55,-25 Z" fill="url(#blueGrad)" stroke="#1d4ed8" stroke-width="4"/>
    <text x="0" y="18" font-family="Rubik, sans-serif" font-size="42" font-weight="900" fill="#fef08a" text-anchor="middle">ו-י</text>
  </g>
`);

console.log('Writing updated SVGs to public/assets/visual_riddles...');
let count = 0;
Object.keys(SVGS).forEach(id => {
  const filePath = path.join(svgDir, `${id}.svg`);
  fs.writeFileSync(filePath, SVGS[id], 'utf8');
  count++;
});
console.log(`Successfully generated and saved ${count} updated SVG files.`);
