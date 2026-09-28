const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'assets', 'visual_riddles');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Helper to create styled SVG wrapper
function createSvg(id, title, content) {
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

const svgs = {};

// 1. hol-01: תפוח בדבש
svgs['hol-01'] = createSvg('hol-01', 'תפוח בדבש', `
  <!-- Apple -->
  <g transform="translate(140, 260)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="85" fill="url(#redGrad)"/>
    <circle cx="-25" cy="-20" r="15" fill="#fca5a5" opacity="0.4"/>
    <path d="M-8,-85 Q0,-120 25,-125 Q15,-100 0,-85" fill="#15803d"/>
    <path d="M0,-85 Q-5,-105 -15,-115" stroke="#78350f" stroke-width="8" stroke-linecap="round"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#f43f5e" text-anchor="middle">תפוח</text>
  </g>

  <!-- Plus -->
  <text x="320" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Letter Bet -->
  <g transform="translate(450, 260)" filter="url(#shadow)">
    <rect x="-65" y="-75" width="130" height="150" rx="20" fill="url(#cardGrad)" stroke="#fbbf24" stroke-width="4"/>
    <text x="0" y="40" font-family="Rubik, system-ui, sans-serif" font-size="110" font-weight="900" fill="url(#goldGrad)" text-anchor="middle">בְּ</text>
  </g>

  <!-- Plus -->
  <text x="580" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Honey Jar -->
  <g transform="translate(740, 260)" filter="url(#shadow)">
    <path d="M-60,-40 L60,-40 L50,75 C50,90 -50,90 -50,75 Z" fill="url(#goldGrad)"/>
    <ellipse cx="0" cy="-40" rx="60" ry="16" fill="#f59e0b"/>
    <rect x="-40" y="-65" width="80" height="25" rx="6" fill="#b45309" stroke="#78350f" stroke-width="3"/>
    <rect x="-48" y="-72" width="96" height="12" rx="4" fill="#fbbf24"/>
    <text x="0" y="35" font-family="system-ui, sans-serif" font-size="30" font-weight="900" fill="#78350f" text-anchor="middle">דְבַשׁ</text>
    <path d="M45,-30 Q70,0 60,40" stroke="#fef08a" stroke-width="8" stroke-linecap="round"/>
    <circle cx="60" cy="55" r="7" fill="#fbbf24"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#fbbf24" text-anchor="middle">דבש</text>
  </g>
`);

// 2. hol-02: שנה טובה ומתוקה
svgs['hol-02'] = createSvg('hol-02', 'שנה טובה ומתוקה', `
  <!-- Calendar: א תשרי -->
  <g transform="translate(180, 260)" filter="url(#shadow)">
    <rect x="-85" y="-85" width="170" height="170" rx="16" fill="#f8fafc" stroke="#94a3b8" stroke-width="3"/>
    <rect x="-85" y="-85" width="170" height="45" rx="16" fill="#ef4444"/>
    <circle cx="-50" cy="-62" r="5" fill="#ffffff"/>
    <circle cx="50" cy="-62" r="5" fill="#ffffff"/>
    <text x="0" y="-53" font-family="system-ui, sans-serif" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle">תשרי</text>
    <text x="0" y="30" font-family="Rubik, system-ui, sans-serif" font-size="75" font-weight="900" fill="#0f172a" text-anchor="middle">א׳</text>
    <text x="0" y="65" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="#64748b" text-anchor="middle">ראש השנה</text>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#f43f5e" text-anchor="middle">שנה</text>
  </g>

  <!-- Plus -->
  <text x="350" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Thumbs Up / Like -->
  <g transform="translate(480, 260)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="80" fill="url(#greenGrad)"/>
    <path d="M-30,15 L-30,-20 L-10,-20 L0,-50 C10,-50 15,-40 15,-20 L15,-10 L35,-10 C45,-10 45,5 35,15 L25,25 C25,35 15,35 5,35 L-30,35 Z" fill="#ffffff"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#34d399" text-anchor="middle">טובה</text>
  </g>

  <!-- Plus -->
  <text x="610" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Lollipop / Sweet -->
  <g transform="translate(740, 260)" filter="url(#shadow)">
    <line x1="0" y1="20" x2="0" y2="90" stroke="#f1f5f9" stroke-width="10" stroke-linecap="round"/>
    <circle cx="0" cy="-20" r="65" fill="url(#goldGrad)"/>
    <path d="M-40,-20 C-40,-45 40,-45 40,-20 C40,5 -20,5 -20,-20 C-20,-30 10,-30 10,-20" stroke="#ef4444" stroke-width="8" fill="none" stroke-linecap="round"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#fbbf24" text-anchor="middle">מתוקה</text>
  </g>
`);

// 3. hol-03: גמר חתימה טובה
svgs['hol-03'] = createSvg('hol-03', 'גמר חתימה טובה', `
  <!-- Finish Flag (גמר) -->
  <g transform="translate(180, 250)" filter="url(#shadow)">
    <line x1="-50" y1="-80" x2="-50" y2="80" stroke="#94a3b8" stroke-width="8" stroke-linecap="round"/>
    <rect x="-50" y="-80" width="100" height="60" fill="#000000"/>
    <rect x="-50" y="-80" width="25" height="30" fill="#ffffff"/>
    <rect x="0" y="-80" width="25" height="30" fill="#ffffff"/>
    <rect x="-25" y="-50" width="25" height="30" fill="#ffffff"/>
    <rect x="25" y="-50" width="25" height="30" fill="#ffffff"/>
    <text x="0" y="30" font-family="Rubik, system-ui, sans-serif" font-size="24" font-weight="900" fill="#38bdf8">FINISH</text>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#38bdf8" text-anchor="middle">גמר</text>
  </g>

  <text x="340" y="270" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Contract & Signature (חתימה) -->
  <g transform="translate(480, 250)" filter="url(#shadow)">
    <rect x="-60" y="-75" width="120" height="150" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/>
    <line x1="-40" y1="-45" x2="40" y2="-45" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
    <line x1="-40" y1="-25" x2="40" y2="-25" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
    <line x1="-40" y1="-5" x2="20" y2="-5" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
    <!-- Signature squiggle -->
    <path d="M-30,35 Q-15,15 0,35 T30,25 T45,40" stroke="#2563eb" stroke-width="4" fill="none" stroke-linecap="round"/>
    <!-- Pen -->
    <path d="M40,-50 L65,-75 L80,-60 L55,-35 Z" fill="#0284c7"/>
    <polygon points="40,-50 35,-35 55,-35" fill="#f59e0b"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#60a5fa" text-anchor="middle">חתימה</text>
  </g>

  <text x="620" y="270" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Green Check / Good (טובה) -->
  <g transform="translate(740, 250)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="75" fill="url(#greenGrad)"/>
    <path d="M-30,-5 L-10,25 L40,-25" stroke="#ffffff" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#34d399" text-anchor="middle">טובה</text>
  </g>
`);

// 4. hol-04: ארבעת המינים
svgs['hol-04'] = createSvg('hol-04', 'ארבעת המינים', `
  <!-- Number 4 -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <rect x="-100" y="-100" width="200" height="200" rx="30" fill="url(#cardGrad)" stroke="#38bdf8" stroke-width="4"/>
    <text x="0" y="55" font-family="Rubik, system-ui, sans-serif" font-size="160" font-weight="900" fill="#38bdf8" text-anchor="middle">4</text>
    <text x="0" y="145" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#38bdf8" text-anchor="middle">ארבעת</text>
  </g>

  <!-- Cross Multiply / Plus -->
  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Male & Female Gender Symbols (מינים) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <!-- Male symbol -->
    <circle cx="-50" cy="-10" r="40" stroke="#3b82f6" stroke-width="12" fill="none"/>
    <line x1="-22" y1="-38" x2="10" y2="-70" stroke="#3b82f6" stroke-width="12" stroke-linecap="round"/>
    <polyline points="-10,-70 10,-70 10,-50" stroke="#3b82f6" stroke-width="12" fill="none" stroke-linecap="round"/>

    <!-- Female symbol -->
    <circle cx="50" cy="10" r="40" stroke="#ec4899" stroke-width="12" fill="none"/>
    <line x1="50" y1="50" x2="50" y2="90" stroke="#ec4899" stroke-width="12" stroke-linecap="round"/>
    <line x1="30" y1="70" x2="70" y2="70" stroke="#ec4899" stroke-width="12" stroke-linecap="round"/>

    <text x="0" y="145" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#f472b6" text-anchor="middle">מינים (זכר/נקבה)</text>
  </g>
`);

// 5. hol-05: שלומית בונה סוכה
svgs['hol-05'] = createSvg('hol-05', 'שלומית בונה סוכה', `
  <!-- Peace Dove (שלום + י"ת = שלומית) -->
  <g transform="translate(180, 250)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="75" fill="url(#cardGrad)" stroke="#38bdf8" stroke-width="3"/>
    <path d="M-30,10 C-30,-20 0,-35 25,-10 C45,-25 50,-5 35,15 C20,30 -10,35 -30,10 Z" fill="#f8fafc"/>
    <path d="M25,-10 L45,-15 L35,-5 Z" fill="#f59e0b"/>
    <path d="M38,-12 Q55,-25 60,-15" stroke="#16a34a" stroke-width="4" fill="none"/>
    <circle cx="50" cy="-20" r="4" fill="#22c55e"/>
    <text x="0" y="55" font-family="Rubik, system-ui, sans-serif" font-size="22" font-weight="900" fill="#38bdf8" text-anchor="middle">שלום + י"ת</text>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#38bdf8" text-anchor="middle">שלומית</text>
  </g>

  <text x="340" y="270" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Hammer & Nail (בונה) -->
  <g transform="translate(480, 250)" filter="url(#shadow)">
    <rect x="-10" y="-10" x2="20" width="20" height="90" rx="6" fill="#b45309"/>
    <rect x="-45" y="-45" width="90" height="35" rx="8" fill="#94a3b8" stroke="#475569" stroke-width="3"/>
    <line x1="-50" y1="20" x2="-20" y2="40" stroke="#f59e0b" stroke-width="4"/>
    <line x1="-40" y1="60" x2="50" y2="60" stroke="#d97706" stroke-width="8" stroke-linecap="round"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#fbbf24" text-anchor="middle">בונה</text>
  </g>

  <text x="620" y="270" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Sukkah (סוכה) -->
  <g transform="translate(750, 250)" filter="url(#shadow)">
    <rect x="-60" y="-40" width="120" height="100" rx="4" fill="#78350f" stroke="#451a03" stroke-width="3"/>
    <!-- Door -->
    <rect x="-20" y="10" width="40" height="50" rx="4" fill="#18181b"/>
    <!-- Sechach -->
    <ellipse cx="0" cy="-45" rx="75" ry="18" fill="#16a34a"/>
    <path d="M-60,-45 Q0,-70 60,-45" stroke="#22c55e" stroke-width="6" fill="none"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#4ade80" text-anchor="middle">סוכה</text>
  </g>
`);

// 6. hol-06: נס גדול היה פה
svgs['hol-06'] = createSvg('hol-06', 'נס גדול היה פה', `
  <!-- Nes Coffee Mug (נס) -->
  <g transform="translate(140, 250)" filter="url(#shadow)">
    <rect x="-45" y="-40" width="90" height="90" rx="14" fill="#b91c1c" stroke="#991b1b" stroke-width="3"/>
    <!-- Handle -->
    <path d="M45,-20 C70,-20 70,30 45,30" stroke="#b91c1c" stroke-width="12" fill="none" stroke-linecap="round"/>
    <!-- Steam -->
    <path d="M-20,-55 Q-10,-75 -20,-90" stroke="#e2e8f0" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M10,-55 Q20,-75 10,-90" stroke="#e2e8f0" stroke-width="4" fill="none" stroke-linecap="round"/>
    <text x="0" y="15" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#fef08a" text-anchor="middle">נס</text>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#f87171" text-anchor="middle">נס</text>
  </g>

  <!-- Big Elephant / Giant (גדול) -->
  <g transform="translate(360, 250)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="75" fill="url(#cardGrad)" stroke="#3b82f6" stroke-width="3"/>
    <text x="0" y="45" font-family="Rubik, system-ui, sans-serif" font-size="110" font-weight="900" fill="#60a5fa" text-anchor="middle">XL</text>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#60a5fa" text-anchor="middle">גדול</text>
  </g>

  <!-- Hourglass (היה) -->
  <g transform="translate(560, 250)" filter="url(#shadow)">
    <polygon points="-40,-60 40,-60 0,0 -40,60 40,60 0,0" stroke="#f59e0b" stroke-width="6" fill="#18181b"/>
    <polygon points="-25,35 25,35 0,0" fill="#fbbf24"/>
    <circle cx="0" cy="20" r="3" fill="#fef08a"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#fbbf24" text-anchor="middle">היה (עבר)</text>
  </g>

  <!-- Open Lips Mouth (פה) -->
  <g transform="translate(760, 250)" filter="url(#shadow)">
    <path d="M-60,0 Q0,-45 60,0 Q0,55 -60,0 Z" fill="#e11d48"/>
    <path d="M-40,0 Q0,-15 40,0 Q0,25 -40,0 Z" fill="#881337"/>
    <rect x="-25" y="-6" width="50" height="12" rx="3" fill="#ffffff"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#fb7185" text-anchor="middle">פה (שפתיים)</text>
  </g>
`);

// 7. hol-07: דמי חנוכה
svgs['hol-07'] = createSvg('hol-07', 'דמי חנוכה', `
  <!-- Tear Drop (דמי / דמעות) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <path d="M0,-80 C50,0 60,50 0,70 C-60,50 -50,0 0,-80 Z" fill="url(#blueGrad)"/>
    <circle cx="-15" cy="25" r="10" fill="#ffffff" opacity="0.5"/>
    <text x="0" y="145" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#60a5fa" text-anchor="middle">דְּמִי (דמעה)</text>
  </g>

  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Hanukkiah Menorah (חנוכה) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <line x1="-80" y1="70" x2="80" y2="70" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"/>
    <line x1="0" y1="70" x2="0" y2="-50" stroke="#f59e0b" stroke-width="10"/>
    <!-- Branches -->
    <path d="M-60,-20 C-60,40 60,40 60,-20" stroke="#f59e0b" stroke-width="6" fill="none"/>
    <path d="M-40,-10 C-40,30 40,30 40,-10" stroke="#f59e0b" stroke-width="6" fill="none"/>
    <path d="M-20,0 C-20,20 20,20 20,0" stroke="#f59e0b" stroke-width="6" fill="none"/>
    <!-- Flames -->
    <circle cx="0" cy="-65" r="10" fill="#ef4444"/>
    <circle cx="0" cy="-65" r="6" fill="#fbbf24"/>
    <circle cx="-60" cy="-35" r="7" fill="#fbbf24"/>
    <circle cx="60" cy="-35" r="7" fill="#fbbf24"/>
    <circle cx="-40" cy="-25" r="7" fill="#fbbf24"/>
    <circle cx="40" cy="-25" r="7" fill="#fbbf24"/>
    <text x="0" y="145" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#fbbf24" text-anchor="middle">חֲנֻכָּה</text>
  </g>
`);

// 8. hol-08: סופגנייה בריבה
svgs['hol-08'] = createSvg('hol-08', 'סופגנייה בריבה', `
  <!-- Sponge (ספוג) -->
  <g transform="translate(180, 260)" filter="url(#shadow)">
    <rect x="-70" y="-55" width="140" height="110" rx="20" fill="#facc15" stroke="#eab308" stroke-width="4"/>
    <!-- Sponge holes -->
    <circle cx="-35" cy="-20" r="10" fill="#ca8a04"/>
    <circle cx="20" cy="-15" r="14" fill="#ca8a04"/>
    <circle cx="-10" cy="20" r="8" fill="#ca8a04"/>
    <circle cx="35" cy="25" r="11" fill="#ca8a04"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#facc15" text-anchor="middle">סְפוֹג (סוֹפֵג)</text>
  </g>

  <text x="340" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Letters Nun-Yud (נִיָּה) -->
  <g transform="translate(470, 260)" filter="url(#shadow)">
    <rect x="-55" y="-60" width="110" height="120" rx="16" fill="url(#cardGrad)" stroke="#38bdf8" stroke-width="4"/>
    <text x="0" y="25" font-family="Rubik, system-ui, sans-serif" font-size="70" font-weight="900" fill="#38bdf8" text-anchor="middle">נִיָּה</text>
  </g>

  <text x="600" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Strawberry Jam (ריבה) -->
  <g transform="translate(740, 260)" filter="url(#shadow)">
    <path d="M-45,-30 L45,-30 L40,65 C40,75 -40,75 -40,65 Z" fill="#e11d48"/>
    <ellipse cx="0" cy="-30" rx="45" ry="14" fill="#be123c"/>
    <rect x="-30" y="-55" width="60" height="20" rx="4" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="0" cy="20" r="22" fill="#ffffff" opacity="0.9"/>
    <!-- Strawberry icon -->
    <polygon points="0,32 -14,12 14,12" fill="#e11d48"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#f43f5e" text-anchor="middle">רִיבָּה</text>
  </g>
`);

// 9. hol-09: כי האדם עץ השדה
svgs['hol-09'] = createSvg('hol-09', 'כי האדם עץ השדה', `
  <!-- Key (כי / Key) -->
  <g transform="translate(140, 250)" filter="url(#shadow)">
    <circle cx="-25" cy="-25" r="35" stroke="url(#goldGrad)" stroke-width="12" fill="none"/>
    <line x1="-5" y1="-5" x2="50" y2="50" stroke="url(#goldGrad)" stroke-width="12" stroke-linecap="round"/>
    <line x1="30" y1="30" x2="45" y2="15" stroke="url(#goldGrad)" stroke-width="10" stroke-linecap="round"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#fbbf24" text-anchor="middle">מפתח (Key = כִּי)</text>
  </g>

  <!-- Man Silhouette (האדם) -->
  <g transform="translate(340, 250)" filter="url(#shadow)">
    <circle cx="0" cy="-55" r="22" fill="#38bdf8"/>
    <path d="M-25,-25 L25,-25 L35,45 L15,45 L10,85 L-10,85 L-15,45 L-35,45 Z" fill="#0284c7"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#38bdf8" text-anchor="middle">הָאָדָם</text>
  </g>

  <!-- Tree (עץ) -->
  <g transform="translate(540, 250)" filter="url(#shadow)">
    <rect x="-14" y="10" width="28" height="65" fill="#78350f" rx="4"/>
    <circle cx="0" cy="-25" r="60" fill="url(#greenGrad)"/>
    <circle cx="-30" cy="-10" r="40" fill="#15803d"/>
    <circle cx="30" cy="-10" r="40" fill="#15803d"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#4ade80" text-anchor="middle">עֵץ</text>
  </g>

  <!-- Furrowed Field (השדה) -->
  <g transform="translate(740, 250)" filter="url(#shadow)">
    <polygon points="-70,60 70,60 40,-40 -40,-40" fill="#b45309"/>
    <line x1="0" y1="-40" x2="0" y2="60" stroke="#78350f" stroke-width="6"/>
    <line x1="-20" y1="-40" x2="-40" y2="60" stroke="#78350f" stroke-width="6"/>
    <line x1="20" y1="-40" x2="40" y2="60" stroke="#78350f" stroke-width="6"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#fbbf24" text-anchor="middle">הַשָּׂדֶה</text>
  </g>
`);

// 10. hol-10: צדיק כתמר יפרח
svgs['hol-10'] = createSvg('hol-10', 'צדיק כתמר יפרח', `
  <!-- Letter Tzadi with Crown (צדיק) -->
  <g transform="translate(180, 250)" filter="url(#shadow)">
    <!-- Crown -->
    <path d="M-40,-50 L-30,-25 L0,-45 L30,-25 L40,-50 L35,-15 L-35,-15 Z" fill="url(#goldGrad)"/>
    <text x="0" y="55" font-family="Rubik, system-ui, sans-serif" font-size="110" font-weight="900" fill="#f8fafc" text-anchor="middle">צ׳</text>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#fbbf24" text-anchor="middle">צַדִּיק</text>
  </g>

  <text x="340" y="270" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Palm Tree (כתמר) -->
  <g transform="translate(480, 250)" filter="url(#shadow)">
    <path d="M-10,75 L-5,-20 L5,-20 L10,75 Z" fill="#92400e"/>
    <path d="M0,-20 Q-60,-50 -70,-20" stroke="#16a34a" stroke-width="10" stroke-linecap="round" fill="none"/>
    <path d="M0,-20 Q60,-50 70,-20" stroke="#16a34a" stroke-width="10" stroke-linecap="round" fill="none"/>
    <path d="M0,-20 Q-40,-70 -30,-80" stroke="#22c55e" stroke-width="10" stroke-linecap="round" fill="none"/>
    <path d="M0,-20 Q40,-70 30,-80" stroke="#22c55e" stroke-width="10" stroke-linecap="round" fill="none"/>
    <!-- Dates cluster -->
    <circle cx="-12" cy="-10" r="7" fill="#ea580c"/>
    <circle cx="0" cy="-5" r="7" fill="#ea580c"/>
    <circle cx="12" cy="-10" r="7" fill="#ea580c"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#4ade80" text-anchor="middle">כַּתָּמָר</text>
  </g>

  <text x="620" y="270" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Blooming Flower (יפרח) -->
  <g transform="translate(740, 250)" filter="url(#shadow)">
    <circle cx="0" cy="-20" r="18" fill="#f59e0b"/>
    <circle cx="-30" cy="-20" r="16" fill="#ec4899"/>
    <circle cx="30" cy="-20" r="16" fill="#ec4899"/>
    <circle cx="0" cy="-50" r="16" fill="#ec4899"/>
    <circle cx="0" cy="10" r="16" fill="#ec4899"/>
    <path d="M0,10 L0,70" stroke="#16a34a" stroke-width="8" stroke-linecap="round"/>
    <ellipse cx="15" cy="40" rx="14" ry="7" fill="#22c55e" transform="rotate(30 15 40)"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#f472b6" text-anchor="middle">יִפְרָח</text>
  </g>
`);

// 11. hol-11: משנכנס אדר מרבים בשמחה
svgs['hol-11'] = createSvg('hol-11', 'משנכנס אדר מרבים בשמחה', `
  <!-- Door Opening Inward (משנכנס) -->
  <g transform="translate(140, 250)" filter="url(#shadow)">
    <rect x="-40" y="-70" width="80" height="140" fill="#3f3f46" stroke="#71717a" stroke-width="4"/>
    <polygon points="-40,-70 20,-60 20,60 -40,70" fill="#b45309"/>
    <line x1="20" y1="0" x2="60" y2="0" stroke="#22c55e" stroke-width="8" stroke-linecap="round"/>
    <polygon points="50,-10 65,0 50,10" fill="#22c55e"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="26" font-weight="900" fill="#f59e0b" text-anchor="middle">מִשֶּׁנִּכְנַס</text>
  </g>

  <!-- Maple Leaf (אדר) -->
  <g transform="translate(340, 250)" filter="url(#shadow)">
    <path d="M0,-60 L15,-30 L45,-35 L30,-10 L60,10 L25,20 L35,50 L0,35 L-35,50 L-25,20 L-60,10 L-30,-10 L-45,-35 L-15,-30 Z" fill="#ea580c"/>
    <line x1="0" y1="35" x2="0" y2="70" stroke="#9a3412" stroke-width="8" stroke-linecap="round"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="26" font-weight="900" fill="#fb923c" text-anchor="middle">אֲדָר (עלה)</text>
  </g>

  <!-- Giant Plus (מרבים) -->
  <g transform="translate(540, 250)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="70" fill="url(#blueGrad)"/>
    <text x="0" y="32" font-family="Rubik, system-ui, sans-serif" font-size="110" font-weight="900" fill="#ffffff" text-anchor="middle">+</text>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="26" font-weight="900" fill="#60a5fa" text-anchor="middle">מַרְבִּים (+)</text>
  </g>

  <!-- Laughing Smiley (בשמחה) -->
  <g transform="translate(740, 250)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="70" fill="url(#goldGrad)"/>
    <!-- Laughing eyes -->
    <path d="M-35,-15 Q-20,-35 -5,-15" stroke="#78350f" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M5,-15 Q20,-35 35,-15" stroke="#78350f" stroke-width="7" fill="none" stroke-linecap="round"/>
    <!-- Open grinning mouth -->
    <path d="M-35,10 Q0,65 35,10 Z" fill="#78350f"/>
    <path d="M-25,10 Q0,35 25,10 Z" fill="#f87171"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="26" font-weight="900" fill="#fde047" text-anchor="middle">בְּשִׂמְחָה</text>
  </g>
`);

// 12. hol-12: משלוח מנות
svgs['hol-12'] = createSvg('hol-12', 'משלוח מנות', `
  <!-- Delivery Truck / Package (משלוח) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <!-- Truck body -->
    <rect x="-100" y="-30" width="130" height="80" rx="8" fill="#0284c7"/>
    <path d="M30,-5 L60,-5 L80,20 L80,50 L30,50 Z" fill="#38bdf8"/>
    <!-- Wheels -->
    <circle cx="-50" cy="55" r="22" fill="#18181b" stroke="#71717a" stroke-width="6"/>
    <circle cx="50" cy="55" r="22" fill="#18181b" stroke="#71717a" stroke-width="6"/>
    <!-- Package box -->
    <rect x="-80" y="-75" width="55" height="40" rx="4" fill="#b45309" stroke="#78350f" stroke-width="3"/>
    <line x1="-52" y1="-75" x2="-52" y2="-35" stroke="#f59e0b" stroke-width="4"/>
    <text x="0" y="135" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#38bdf8" text-anchor="middle">מִשְׁלוֹחַ</text>
  </g>

  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Restaurant Cloches / Dishes (מנות) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <!-- Cloche 1 -->
    <path d="M-60,30 Q-60,-40 0,-40 Q60,-40 60,30 Z" fill="#94a3b8" stroke="#cbd5e1" stroke-width="3"/>
    <circle cx="0" cy="-45" r="10" fill="#f59e0b"/>
    <line x1="-75" y1="35" x2="75" y2="35" stroke="#e2e8f0" stroke-width="10" stroke-linecap="round"/>
    <text x="0" y="135" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#fbbf24" text-anchor="middle">מָנוֹת (ארוחות)</text>
  </g>
`);

// 13. hol-13: אוזן המן
svgs['hol-13'] = createSvg('hol-13', 'אוזן המן', `
  <!-- Human Ear (אוזן) -->
  <g transform="translate(260, 250)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="90" fill="url(#cardGrad)" stroke="#f43f5e" stroke-width="3"/>
    <path d="M-30,40 C-60,10 -50,-60 10,-60 C50,-60 50,-20 20,-10 C-10,0 -10,30 10,40" stroke="#fca5a5" stroke-width="14" fill="none" stroke-linecap="round"/>
    <text x="0" y="145" font-family="system-ui, sans-serif" font-size="34" font-weight="900" fill="#fb7185" text-anchor="middle">אֹזֶן</text>
  </g>

  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Triangle Villain Hat / Bamba Guy (המן) -->
  <g transform="translate(640, 250)" filter="url(#shadow)">
    <!-- Triangular Hat -->
    <polygon points="0,-75 -85,55 85,55" fill="#3f3f46" stroke="#fbbf24" stroke-width="6"/>
    <!-- Evil eyes in shadow -->
    <circle cx="-25" cy="20" r="8" fill="#ef4444"/>
    <circle cx="25" cy="20" r="8" fill="#ef4444"/>
    <path d="M-35,35 Q0,15 35,35" stroke="#ef4444" stroke-width="4" fill="none"/>
    <text x="0" y="145" font-family="system-ui, sans-serif" font-size="34" font-weight="900" fill="#f87171" text-anchor="middle">הָמָן (כובע משולש)</text>
  </g>
`);

// 14. hol-14: יציאת מצרים
svgs['hol-14'] = createSvg('hol-14', 'יציאת מצרים', `
  <!-- Green EXIT Sign (יציאה) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <rect x="-100" y="-60" width="200" height="120" rx="16" fill="#15803d" stroke="#22c55e" stroke-width="4"/>
    <text x="0" y="15" font-family="Rubik, system-ui, sans-serif" font-size="44" font-weight="900" fill="#ffffff" text-anchor="middle">EXIT ➔</text>
    <text x="0" y="135" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#4ade80" text-anchor="middle">יְצִיאַת</text>
  </g>

  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Pyramids of Giza (מצרים) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <!-- Sand dunes -->
    <ellipse cx="0" cy="50" rx="110" ry="20" fill="#78350f"/>
    <!-- Big pyramid -->
    <polygon points="-15,-55 -85,50 55,50" fill="url(#goldGrad)"/>
    <polygon points="-15,-55 55,50 90,40" fill="#b45309"/>
    <!-- Small pyramid -->
    <polygon points="-65,10 -105,50 -25,50" fill="#d97706"/>
    <text x="0" y="135" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#fcd34d" text-anchor="middle">מִצְרַיִם (פירמידות)</text>
  </g>
`);

// 15. hol-15: עבדים היינו
svgs['hol-15'] = createSvg('hol-15', 'עבדים היינו', `
  <!-- Broken Chains / Handcuffs (עבדים) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <circle cx="-50" cy="0" r="35" stroke="#94a3b8" stroke-width="12" fill="none"/>
    <circle cx="50" cy="0" r="35" stroke="#94a3b8" stroke-width="12" fill="none"/>
    <!-- Broken link in middle -->
    <line x1="-15" y1="0" x2="-5" y2="-15" stroke="#ef4444" stroke-width="10" stroke-linecap="round"/>
    <line x1="15" y1="0" x2="5" y2="15" stroke="#ef4444" stroke-width="10" stroke-linecap="round"/>
    <!-- Spark -->
    <polygon points="0,-10 -5,5 5,0" fill="#fbbf24"/>
    <text x="0" y="135" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#94a3b8" text-anchor="middle">עֲבָדִים (אזיקים שבורים)</text>
  </g>

  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Reclining Wine Cup of Freedom (היינו לחורין) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <!-- Goblet tilted -->
    <g transform="rotate(25)">
      <path d="M-35,-50 L35,-50 L25,10 C25,30 -25,30 -25,10 Z" fill="url(#goldGrad)" stroke="#b45309" stroke-width="3"/>
      <line x1="0" y1="25" x2="0" y2="70" stroke="url(#goldGrad)" stroke-width="10"/>
      <ellipse cx="0" cy="70" rx="35" ry="10" fill="url(#goldGrad)"/>
      <ellipse cx="0" cy="-35" rx="28" ry="8" fill="#991b1b"/>
    </g>
    <text x="0" y="135" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#fbbf24" text-anchor="middle">הָיִינוּ (הסבה לחירות)</text>
  </g>
`);

// 16. hol-16: קערת ליל הסדר
svgs['hol-16'] = createSvg('hol-16', 'קערת ליל הסדר', `
  <!-- Bowl (קערת) -->
  <g transform="translate(180, 250)" filter="url(#shadow)">
    <path d="M-75,-10 C-75,60 75,60 75,-10 Z" fill="url(#blueGrad)"/>
    <ellipse cx="0" cy="-10" rx="75" ry="20" fill="#93c5fd"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#60a5fa" text-anchor="middle">קַעֲרַת</text>
  </g>

  <text x="340" y="270" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Full Moon Night (ליל) -->
  <g transform="translate(480, 250)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="70" fill="#0f172a" stroke="#334155" stroke-width="3"/>
    <circle cx="15" cy="-10" r="45" fill="#fef08a"/>
    <circle cx="5" cy="5" r="8" fill="#facc15" opacity="0.4"/>
    <circle cx="25" cy="-25" r="10" fill="#facc15" opacity="0.4"/>
    <!-- Stars -->
    <polygon points="-30,-30 -26,-20 -36,-24" fill="#ffffff"/>
    <polygon points="-40,15 -36,25 -46,21" fill="#ffffff"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#fde047" text-anchor="middle">לֵיל (ירח)</text>
  </g>

  <text x="620" y="270" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Ordered Numbers 1 2 3 (הסדר) -->
  <g transform="translate(740, 250)" filter="url(#shadow)">
    <rect x="-65" y="-65" width="130" height="130" rx="20" fill="url(#cardGrad)" stroke="#22c55e" stroke-width="3"/>
    <text x="0" y="25" font-family="Rubik, system-ui, sans-serif" font-size="52" font-weight="900" fill="#4ade80" text-anchor="middle">1 2 3</text>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#4ade80" text-anchor="middle">הַסֵּדֶר</text>
  </g>
`);

// 17. hol-17: מגן דוד כחול לבן
svgs['hol-17'] = createSvg('hol-17', 'מגן דוד כחול לבן', `
  <!-- Knight Shield (מגן) -->
  <g transform="translate(180, 250)" filter="url(#shadow)">
    <path d="M-60,-65 L60,-65 L60,10 Q60,65 0,85 Q-60,65 -60,10 Z" fill="#94a3b8" stroke="#e2e8f0" stroke-width="4"/>
    <path d="M-40,-45 L40,-45 L40,5 Q40,45 0,65 Q-40,45 -40,5 Z" fill="#475569"/>
    <text x="0" y="130" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#cbd5e1" text-anchor="middle">מָגֵן</text>
  </g>

  <text x="340" y="270" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- King David Harp & Crown (דוד) -->
  <g transform="translate(480, 250)" filter="url(#shadow)">
    <!-- Crown -->
    <path d="M-35,-65 L-25,-45 L0,-60 L25,-45 L35,-65 L30,-35 L-30,-35 Z" fill="url(#goldGrad)"/>
    <!-- Harp -->
    <path d="M-30,-20 Q20,-30 40,30 Q10,70 -30,60 Z" stroke="url(#goldGrad)" stroke-width="8" fill="none"/>
    <line x1="-15" y1="-15" x2="-15" y2="60" stroke="#fde047" stroke-width="3"/>
    <line x1="0" y1="-18" x2="0" y2="55" stroke="#fde047" stroke-width="3"/>
    <line x1="15" y1="-10" x2="15" y2="45" stroke="#fde047" stroke-width="3"/>
    <text x="0" y="130" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#fbbf24" text-anchor="middle">דָּוִד (המלך)</text>
  </g>

  <text x="620" y="270" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Blue & White Paint Cans (כחול לבן) -->
  <g transform="translate(740, 250)" filter="url(#shadow)">
    <!-- Blue can -->
    <rect x="-65" y="-30" width="55" height="75" rx="6" fill="#1d4ed8" stroke="#60a5fa" stroke-width="3"/>
    <!-- White can -->
    <rect x="5" y="-30" width="55" height="75" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/>
    <text x="-37" y="15" font-family="system-ui, sans-serif" font-size="16" font-weight="900" fill="#ffffff" text-anchor="middle">כחול</text>
    <text x="32" y="15" font-family="system-ui, sans-serif" font-size="16" font-weight="900" fill="#0f172a" text-anchor="middle">לבן</text>
    <text x="0" y="130" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#60a5fa" text-anchor="middle">כָּחֹל לָבָן</text>
  </g>
`);

// 18. hol-18: ביכורי קציר חיטים
svgs['hol-18'] = createSvg('hol-18', 'ביכורי קציר חיטים', `
  <!-- Fruit Basket / Tene (ביכורי) -->
  <g transform="translate(180, 250)" filter="url(#shadow)">
    <path d="M-60,0 L60,0 L45,65 L-45,65 Z" fill="#b45309" stroke="#78350f" stroke-width="4"/>
    <!-- Basket handle -->
    <path d="M-45,0 C-45,-45 45,-45 45,0" stroke="#b45309" stroke-width="8" fill="none"/>
    <!-- Pomegranate & Grapes -->
    <circle cx="-15" cy="-8" r="18" fill="#dc2626"/>
    <circle cx="15" cy="-8" r="14" fill="#7e22ce"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#fbbf24" text-anchor="middle">בִּכּוּרֵי (טנא)</text>
  </g>

  <text x="340" y="270" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Sickle / Harvest (קציר) -->
  <g transform="translate(480, 250)" filter="url(#shadow)">
    <!-- Sickle handle -->
    <rect x="-8" y="25" width="16" height="50" rx="4" fill="#92400e"/>
    <!-- Curved blade -->
    <path d="M0,25 C45,25 70,-45 10,-65 C-20,-75 25,-40 0,15" fill="#e2e8f0" stroke="#94a3b8" stroke-width="3"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#e2e8f0" text-anchor="middle">קְצִיר (מגל)</text>
  </g>

  <text x="620" y="270" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Wheat Spike (חיטים) -->
  <g transform="translate(740, 250)" filter="url(#shadow)">
    <line x1="0" y1="75" x2="0" y2="-50" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"/>
    <ellipse cx="-15" cy="-30" rx="14" ry="7" fill="#fbbf24" transform="rotate(-30 -15 -30)"/>
    <ellipse cx="15" cy="-30" rx="14" ry="7" fill="#fbbf24" transform="rotate(30 15 -30)"/>
    <ellipse cx="-15" cy="-5" rx="14" ry="7" fill="#fbbf24" transform="rotate(-30 -15 -5)"/>
    <ellipse cx="15" cy="-5" rx="14" ry="7" fill="#fbbf24" transform="rotate(30 15 -5)"/>
    <ellipse cx="0" cy="-55" rx="8" ry="16" fill="#fde047"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#fde047" text-anchor="middle">חִטִּים</text>
  </g>
`);

// 19. gen-01: סוף מעשה במחשבה תחילה
svgs['gen-01'] = createSvg('gen-01', 'סוף מעשה במחשבה תחילה', `
  <!-- The End (סוף) -->
  <g transform="translate(140, 250)" filter="url(#shadow)">
    <rect x="-65" y="-50" width="130" height="90" rx="10" fill="#000000" stroke="#f43f5e" stroke-width="3"/>
    <text x="0" y="5" font-family="Rubik, system-ui, sans-serif" font-size="24" font-weight="900" fill="#ffffff" text-anchor="middle">THE END</text>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="26" font-weight="900" fill="#f43f5e" text-anchor="middle">סוֹף</text>
  </g>

  <!-- Brick Wall / Work (מעשה) -->
  <g transform="translate(340, 250)" filter="url(#shadow)">
    <rect x="-65" y="-55" width="130" height="95" rx="6" fill="#b45309" stroke="#78350f" stroke-width="3"/>
    <line x1="-65" y1="-25" x2="65" y2="-25" stroke="#fcd34d" stroke-width="3"/>
    <line x1="-65" y1="5" x2="65" y2="5" stroke="#fcd34d" stroke-width="3"/>
    <line x1="0" y1="-55" x2="0" y2="-25" stroke="#fcd34d" stroke-width="3"/>
    <line x1="-30" y1="-25" x2="-30" y2="5" stroke="#fcd34d" stroke-width="3"/>
    <line x1="30" y1="-25" x2="30" y2="5" stroke="#fcd34d" stroke-width="3"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="26" font-weight="900" fill="#fbbf24" text-anchor="middle">מַעֲשֶׂה (בנייה)</text>
  </g>

  <!-- Thought Bubble with Gears (מחשבה) -->
  <g transform="translate(540, 250)" filter="url(#shadow)">
    <ellipse cx="0" cy="-10" rx="65" ry="45" fill="url(#blueGrad)"/>
    <circle cx="-40" cy="45" r="10" fill="#38bdf8"/>
    <circle cx="-55" cy="65" r="6" fill="#38bdf8"/>
    <!-- Gear icon -->
    <circle cx="0" cy="-10" r="18" fill="none" stroke="#ffffff" stroke-width="8"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="26" font-weight="900" fill="#38bdf8" text-anchor="middle">בְּמַחֲשָׁבָה</text>
  </g>

  <!-- Number 1 First (תחילה) -->
  <g transform="translate(740, 250)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="65" fill="url(#goldGrad)"/>
    <text x="0" y="32" font-family="Rubik, system-ui, sans-serif" font-size="95" font-weight="900" fill="#78350f" text-anchor="middle">1st</text>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="26" font-weight="900" fill="#fde047" text-anchor="middle">תְּחִלָּה (ראשון)</text>
  </g>
`);

// 20. gen-02: לא דובים ולא יער
svgs['gen-02'] = createSvg('gen-02', 'לא דובים ולא יער', `
  <!-- No Bears (לא דובים) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <!-- Two bears silhouettes -->
    <ellipse cx="-45" cy="15" rx="35" ry="25" fill="#78350f"/>
    <circle cx="-60" cy="-10" r="22" fill="#78350f"/>
    <circle cx="-75" cy="-25" r="9" fill="#92400e"/>

    <ellipse cx="45" cy="15" rx="35" ry="25" fill="#78350f"/>
    <circle cx="60" cy="-10" r="22" fill="#78350f"/>
    <circle cx="75" cy="-25" r="9" fill="#92400e"/>

    <!-- Red Prohibition Cross -->
    <line x1="-90" y1="-70" x2="90" y2="70" stroke="#ef4444" stroke-width="16" stroke-linecap="round"/>
    <line x1="90" y1="-70" x2="-90" y2="70" stroke="#ef4444" stroke-width="16" stroke-linecap="round"/>
    <text x="0" y="135" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#f87171" text-anchor="middle">לֹא דֻבִּים</text>
  </g>

  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- No Forest (ולא יער) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <!-- Forest trees -->
    <polygon points="-50,-35 -80,45 -20,45" fill="#15803d"/>
    <polygon points="0,-60 -35,45 35,45" fill="#16a34a"/>
    <polygon points="50,-35 20,45 80,45" fill="#15803d"/>

    <!-- Red Prohibition Cross -->
    <line x1="-90" y1="-70" x2="90" y2="70" stroke="#ef4444" stroke-width="16" stroke-linecap="round"/>
    <line x1="90" y1="-70" x2="-90" y2="70" stroke="#ef4444" stroke-width="16" stroke-linecap="round"/>
    <text x="0" y="135" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#4ade80" text-anchor="middle">וְלֹא יַעַר</text>
  </g>
`);

// 21. gen-03: בור סיד שאינו מאבד טיפה
svgs['gen-03'] = createSvg('gen-03', 'בור סיד שאינו מאבד טיפה', `
  <!-- Lime Coated Well (בור סיד) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <rect x="-80" y="-50" width="160" height="110" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="6"/>
    <ellipse cx="0" cy="-50" rx="80" ry="24" fill="#e2e8f0"/>
    <ellipse cx="0" cy="-50" rx="60" ry="16" fill="#0f172a"/>
    <text x="0" y="135" font-family="system-ui, sans-serif" font-size="30" font-weight="900" fill="#f8fafc" text-anchor="middle">בּוֹר סִיד (לבן)</text>
  </g>

  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Protected Drop of Water (שאינו מאבד טיפה) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <!-- Shield / Lock around drop -->
    <path d="M-65,-40 L65,-40 L65,20 Q65,75 0,95 Q-65,75 -65,20 Z" fill="#0f172a" stroke="#38bdf8" stroke-width="4"/>
    <!-- Water drop inside -->
    <path d="M0,-25 C30,25 35,55 0,65 C-35,55 -30,25 0,-25 Z" fill="url(#blueGrad)"/>
    <circle cx="-10" cy="40" r="6" fill="#ffffff" opacity="0.6"/>
    <text x="0" y="135" font-family="system-ui, sans-serif" font-size="30" font-weight="900" fill="#38bdf8" text-anchor="middle">אֵינוֹ מְאַבֵּד טִפָּה</text>
  </g>
`);

// 22. gen-04: שבר את הכלים
svgs['gen-04'] = createSvg('gen-04', 'שבר את הכלים', `
  <g transform="translate(450, 260)" filter="url(#shadow)">
    <!-- Shattered Plates and Glasses -->
    <path d="M-140,50 L-90,-10 L-60,40 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/>
    <path d="M-50,60 L0,20 L30,55 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/>
    <path d="M70,30 L110,65 L140,10 Z" fill="#93c5fd" stroke="#38bdf8" stroke-width="3"/>
    <path d="M20,10 L50,-30 L80,10 Z" fill="#93c5fd" stroke="#38bdf8" stroke-width="3"/>

    <!-- Heavy Sledgehammer swinging down -->
    <g transform="translate(0, -60) rotate(-35)">
      <rect x="-12" y="-20" width="24" height="150" rx="8" fill="#b45309" stroke="#78350f" stroke-width="3"/>
      <rect x="-45" y="-60" width="90" height="50" rx="10" fill="#64748b" stroke="#334155" stroke-width="4"/>
    </g>

    <!-- Impact burst -->
    <polygon points="-30,-10 -10,-40 10,-10 40,-30 25,10 50,30 15,25 0,55 -15,25 -50,30 -25,10" fill="#f59e0b"/>

    <text x="0" y="145" font-family="system-ui, sans-serif" font-size="36" font-weight="900" fill="#f87171" text-anchor="middle">שָׁבַר אֶת הַכֵּלִים!</text>
  </g>
`);

// 23. gen-05: טמן ידו בצלחת
svgs['gen-05'] = createSvg('gen-05', 'טמן ידו בצלחת', `
  <g transform="translate(450, 250)" filter="url(#shadow)">
    <!-- Big Soup Bowl / Plate -->
    <ellipse cx="0" cy="40" rx="190" ry="65" fill="#f8fafc" stroke="#94a3b8" stroke-width="6"/>
    <ellipse cx="0" cy="40" rx="140" ry="45" fill="#fef3c7"/>
    <!-- Sand / Soup level -->
    <ellipse cx="0" cy="40" rx="130" ry="38" fill="#b45309"/>

    <!-- Hand buried in the bowl -->
    <path d="M-30,-100 L30,-100 L25,40 L-25,40 Z" fill="#fbcfe8" stroke="#f472b6" stroke-width="6"/>
    <!-- Buried fingers vanishing into soup -->
    <ellipse cx="0" cy="40" rx="40" ry="12" fill="#78350f"/>

    <!-- Inactive "Zzz" -->
    <text x="80" y="-70" font-family="Rubik, system-ui, sans-serif" font-size="36" font-weight="900" fill="#38bdf8">Zzz...</text>
    <text x="0" y="155" font-family="system-ui, sans-serif" font-size="34" font-weight="900" fill="#fde047" text-anchor="middle">טָמַן יָדוֹ בַּצַּלַּחַת (עצלנות)</text>
  </g>
`);

// 24. gen-06: נפל האסימון
svgs['gen-06'] = createSvg('gen-06', 'נפל האסימון', `
  <!-- Public Phone Slot with falling Asimon (אסימון) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <!-- Orange Public Phone box -->
    <rect x="-90" y="-90" width="180" height="180" rx="20" fill="#ea580c" stroke="#c2410c" stroke-width="4"/>
    <!-- Coin slot -->
    <rect x="-40" y="-20" width="80" height="14" rx="7" fill="#000000"/>

    <!-- Asimon coin falling down -->
    <circle cx="0" cy="-45" r="38" fill="url(#goldGrad)" stroke="#78350f" stroke-width="3"/>
    <!-- Hole in the middle of Asimon -->
    <circle cx="0" cy="-45" r="12" fill="#ea580c" stroke="#78350f" stroke-width="2"/>
    <!-- Arrow down -->
    <line x1="0" y1="20" x2="0" y2="60" stroke="#fef08a" stroke-width="8" stroke-linecap="round"/>
    <polygon points="-12,50 0,68 12,50" fill="#fef08a"/>
    <text x="0" y="135" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#fbbf24" text-anchor="middle">נָפַל הָאֲסִימוֹן</text>
  </g>

  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">➔</text>

  <!-- Glowing Lightbulb Idea (הבנה פתאומית) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <!-- Rays -->
    <line x1="0" y1="-80" x2="0" y2="-105" stroke="#facc15" stroke-width="8" stroke-linecap="round"/>
    <line x1="-60" y1="-60" x2="-80" y2="-80" stroke="#facc15" stroke-width="8" stroke-linecap="round"/>
    <line x1="60" y1="-60" x2="80" y2="-80" stroke="#facc15" stroke-width="8" stroke-linecap="round"/>
    <!-- Bulb -->
    <circle cx="0" cy="-20" r="55" fill="url(#goldGrad)"/>
    <path d="M-30,15 L30,15 L20,45 L-20,45 Z" fill="#94a3b8"/>
    <ellipse cx="0" cy="50" rx="15" ry="6" fill="#64748b"/>
    <text x="0" y="135" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#fde047" text-anchor="middle">💡 רַעֲיוֹן! (הֵבִין)</text>
  </g>
`);

// 25. gen-07: חיים ומוות ביד הלשון
svgs['gen-07'] = createSvg('gen-07', 'חיים ומוות ביד הלשון', `
  <!-- Life Tree (חיים) -->
  <g transform="translate(180, 250)" filter="url(#shadow)">
    <circle cx="0" cy="-10" r="60" fill="url(#greenGrad)"/>
    <rect x="-10" y="25" width="20" height="45" fill="#78350f" rx="4"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#4ade80" text-anchor="middle">חַיִּים (עץ)</text>
  </g>

  <!-- Skull / Death (ומוות) -->
  <g transform="translate(360, 250)" filter="url(#shadow)">
    <circle cx="0" cy="-15" r="45" fill="#f8fafc"/>
    <rect x="-25" y="10" width="50" height="35" rx="6" fill="#f8fafc"/>
    <!-- Eye sockets -->
    <circle cx="-16" cy="-15" r="14" fill="#000000"/>
    <circle cx="16" cy="-15" r="14" fill="#000000"/>
    <!-- Teeth -->
    <line x1="-15" y1="30" x2="-15" y2="45" stroke="#000000" stroke-width="4"/>
    <line x1="0" y1="30" x2="0" y2="45" stroke="#000000" stroke-width="4"/>
    <line x1="15" y1="30" x2="15" y2="45" stroke="#000000" stroke-width="4"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#f87171" text-anchor="middle">וָמָוֶת</text>
  </g>

  <!-- Equal / In Hand of Tongue -->
  <g transform="translate(640, 250)" filter="url(#shadow)">
    <!-- Hand -->
    <path d="M-60,70 L-60,20 C-60,-20 -30,-40 0,-10 C30,-40 60,-20 60,20 L60,70 Z" fill="#fbcfe8" stroke="#f472b6" stroke-width="4"/>
    <!-- Tongue resting in hand -->
    <path d="M-25,10 C-25,-30 25,-30 25,10 C25,45 -25,45 -25,10 Z" fill="#e11d48"/>
    <line x1="0" y1="-15" x2="0" y2="25" stroke="#991b1b" stroke-width="4"/>
    <text x="0" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#fb7185" text-anchor="middle">בְּיַד לָשׁוֹן</text>
  </g>
`);

// 26. geo-01: פתח תקווה
svgs['geo-01'] = createSvg('geo-01', 'פתח תקווה', `
  <!-- Open Doorway (פתח) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <rect x="-80" y="-80" width="160" height="160" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="4"/>
    <!-- Light beaming from door -->
    <polygon points="-50,-70 20,-60 20,70 -50,70" fill="url(#goldGrad)"/>
    <circle cx="10" cy="10" r="5" fill="#78350f"/>
    <text x="0" y="135" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#38bdf8" text-anchor="middle">פֶּתַח (דלת פתוחה)</text>
  </g>

  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Shooting Star / Hope (תקווה) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <!-- Night sky circle -->
    <circle cx="0" cy="0" r="85" fill="#0f172a" stroke="#fbbf24" stroke-width="4"/>
    <!-- Shooting star -->
    <path d="M-60,40 Q-20,0 20,-20" stroke="url(#goldGrad)" stroke-width="8" stroke-linecap="round" fill="none"/>
    <polygon points="20,-35 25,-15 45,-15 30,-5 35,15 20,5 5,15 10,-5 -5,-15 15,-15" fill="#fde047"/>
    <text x="0" y="135" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#fde047" text-anchor="middle">תִּקְוָה (כוכב משאלות)</text>
  </g>
`);

// 27. geo-02: ראש פינה
svgs['geo-02'] = createSvg('geo-02', 'ראש פינה', `
  <!-- Human Head Profile (ראש) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <circle cx="0" cy="-10" r="60" fill="url(#cardGrad)" stroke="#38bdf8" stroke-width="4"/>
    <circle cx="0" cy="-25" r="30" fill="#38bdf8"/>
    <!-- Kova Tembel hat -->
    <ellipse cx="0" cy="-45" rx="42" ry="12" fill="#f59e0b"/>
    <path d="M-30,-45 C-30,-75 30,-75 30,-45 Z" fill="#b45309"/>
    <text x="0" y="135" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#38bdf8" text-anchor="middle">רֹאשׁ</text>
  </g>

  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Corner of 2 Walls (פינה) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <!-- 3D Room Corner -->
    <polygon points="-80,-60 0,0 0,70 -80,10" fill="#334155"/>
    <polygon points="80,-60 0,0 0,70 80,10" fill="#1e293b"/>
    <line x1="0" y1="0" x2="0" y2="70" stroke="#38bdf8" stroke-width="6"/>
    <!-- Red arrow pointing to corner -->
    <line x1="50" y1="-30" x2="10" y2="-5" stroke="#ef4444" stroke-width="10" stroke-linecap="round"/>
    <polygon points="5,-15 0,0 15,5" fill="#ef4444"/>
    <text x="0" y="135" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#f87171" text-anchor="middle">פִּנָּה</text>
  </g>
`);

// 28. geo-03: באר שבע
svgs['geo-03'] = createSvg('geo-03', 'באר שבע', `
  <!-- Stone Water Well (באר) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <!-- Well base -->
    <rect x="-70" y="0" width="140" height="70" rx="8" fill="#78350f" stroke="#451a03" stroke-width="4"/>
    <!-- Roof supports -->
    <line x1="-50" y1="0" x2="-50" y2="-60" stroke="#b45309" stroke-width="8"/>
    <line x1="50" y1="0" x2="50" y2="-60" stroke="#b45309" stroke-width="8"/>
    <!-- Triangle roof -->
    <polygon points="-75,-55 0,-85 75,-55" fill="#ea580c"/>
    <!-- Bucket -->
    <rect x="-15" y="-10" width="30" height="30" rx="4" fill="#94a3b8"/>
    <line x1="0" y1="-60" x2="0" y2="-10" stroke="#cbd5e1" stroke-width="3"/>
    <text x="0" y="135" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#fbbf24" text-anchor="middle">בְּאֵר (מים)</text>
  </g>

  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Number 7 (שבע) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <rect x="-90" y="-90" width="180" height="180" rx="30" fill="url(#cardGrad)" stroke="#38bdf8" stroke-width="4"/>
    <text x="0" y="60" font-family="Rubik, system-ui, sans-serif" font-size="160" font-weight="900" fill="#38bdf8" text-anchor="middle">7</text>
    <text x="0" y="135" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#38bdf8" text-anchor="middle">שֶׁבַע</text>
  </g>
`);

// 29. geo-04: עין גדי
svgs['geo-04'] = createSvg('geo-04', 'עין גדי', `
  <!-- Human Eye (עין) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <path d="M-80,0 Q0,-65 80,0 Q0,65 -80,0 Z" fill="#f8fafc" stroke="#38bdf8" stroke-width="4"/>
    <!-- Iris & Pupil -->
    <circle cx="0" cy="0" r="32" fill="#0284c7"/>
    <circle cx="0" cy="0" r="16" fill="#000000"/>
    <circle cx="-6" cy="-6" r="6" fill="#ffffff"/>
    <text x="0" y="135" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#38bdf8" text-anchor="middle">עַיִן</text>
  </g>

  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Little Goat / Kid (גדי) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="85" fill="url(#cardGrad)" stroke="#f59e0b" stroke-width="3"/>
    <!-- Goat head -->
    <ellipse cx="0" cy="10" rx="35" ry="45" fill="#f8fafc"/>
    <ellipse cx="-45" cy="5" rx="18" ry="8" fill="#fca5a5" transform="rotate(-20 -45 5)"/>
    <ellipse cx="45" cy="5" rx="18" ry="8" fill="#fca5a5" transform="rotate(20 45 5)"/>
    <!-- Horns -->
    <path d="M-15,-30 Q-30,-60 -15,-70" stroke="#78350f" stroke-width="8" stroke-linecap="round" fill="none"/>
    <path d="M15,-30 Q30,-60 15,-70" stroke="#78350f" stroke-width="8" stroke-linecap="round" fill="none"/>
    <!-- Eyes & beard -->
    <circle cx="-14" cy="5" r="6" fill="#000000"/>
    <circle cx="14" cy="5" r="6" fill="#000000"/>
    <polygon points="-8,45 8,45 0,65" fill="#e2e8f0"/>
    <text x="0" y="135" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#fbbf24" text-anchor="middle">גְּדִי (עזים)</text>
  </g>
`);

// 30. geo-05: מגדל העמק
svgs['geo-05'] = createSvg('geo-05', 'מגדל העמק', `
  <!-- Tall Tower (מגדל) -->
  <g transform="translate(260, 260)" filter="url(#shadow)">
    <!-- Tower body -->
    <polygon points="-40,75 -25,-60 25,-60 40,75" fill="#64748b" stroke="#334155" stroke-width="3"/>
    <!-- Roof spire -->
    <polygon points="-30,-60 0,-95 30,-60" fill="#dc2626"/>
    <!-- Clock -->
    <circle cx="0" cy="-20" r="16" fill="#ffffff" stroke="#000000" stroke-width="2"/>
    <line x1="0" y1="-20" x2="0" y2="-28" stroke="#000000" stroke-width="3"/>
    <line x1="0" y1="-20" x2="6" y2="-20" stroke="#000000" stroke-width="3"/>
    <text x="0" y="135" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#cbd5e1" text-anchor="middle">מִגְדָּל</text>
  </g>

  <text x="450" y="275" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="#fbbf24" text-anchor="middle">+</text>

  <!-- Green Valley between Mountains (העמק) -->
  <g transform="translate(640, 260)" filter="url(#shadow)">
    <!-- Left Mountain -->
    <polygon points="-110,65 -60,-40 0,65" fill="#78350f"/>
    <!-- Right Mountain -->
    <polygon points="0,65 60,-40 110,65" fill="#92400e"/>
    <!-- Valley in between -->
    <path d="M-50,65 Q0,10 50,65 Z" fill="#16a34a"/>
    <text x="0" y="135" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#4ade80" text-anchor="middle">הָעֵמֶק (בין הרים)</text>
  </g>
`);

// Write all SVGs to disk
let count = 0;
for (const [id, svgContent] of Object.entries(svgs)) {
  const filePath = path.join(targetDir, `${id}.svg`);
  fs.writeFileSync(filePath, svgContent, 'utf8');
  count++;
}

console.log(`Successfully generated ${count} vector SVG rebus illustrations in ${targetDir}!`);
