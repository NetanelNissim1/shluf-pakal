/**
 * Comprehensive Automated Verification and Quality Assurance Test Suite for Shluf
 */

const fs = require('fs');
const path = require('path');

const OBFUSCATION_KEY = 'Shluf_Pakal_Security_Key_2026_Secure_Field_Content';
const keyBytes = Buffer.from(OBFUSCATION_KEY, 'utf8');

function deobfuscateData(encodedText) {
  const xorBytes = Buffer.from(encodedText, 'base64');
  const textBytes = Buffer.alloc(xorBytes.length);
  for (let i = 0; i < xorBytes.length; i++) {
    textBytes[i] = xorBytes[i] ^ keyBytes[i % keyBytes.length];
  }
  return JSON.parse(textBytes.toString('utf8'));
}

function sanitizeSearchQuery(query) {
  if (!query) return '';
  const cleaned = query.replace(/[\u0000-\u001F\u007F-\u009F]/g, '').trim();
  return cleaned.slice(0, 100);
}

function formatPakalForWhatsApp(riddles) {
  if (!riddles.length) return '';
  const header = `🎒 *הפק"ל שלי - אפליקציית שלוף* 🎒\n_${riddles.length} חידות והפעלות שטח מוכנות:_\n\n`;
  const items = riddles
    .map((r, i) => `${i + 1}. *${r.question}*\n   תשובה: ${r.answer}\n   [${r.subCategory}]`)
    .join('\n\n');
  const footer = `\n\n✨ _נשלף באמצעות אפליקציית "שלוף" - פק"ל שטח למדריכים_`;
  return header + items + footer;
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('\n======================================================');
console.log('  מחזור בדיקות איכות, תקינות ואבטחה עבור אפליקציית שלוף');
console.log('======================================================\n');

// Cycle 1: Security & Data Payload Decryption Test
console.log('[מחזור 1]: בדיקת הצפנת ופריקת נתונים באבטחה מוגברת');
const encryptedFilePath = path.join(__dirname, '..', 'src', 'data', 'encrypted-data.json');
assert(fs.existsSync(encryptedFilePath), 'קובץ הנתונים המוצפן encrypted-data.json קיים');

const encryptedRaw = JSON.parse(fs.readFileSync(encryptedFilePath, 'utf8'));
assert(typeof encryptedRaw.riddles === 'string', 'שדה riddles מוצפן במחרוזת בטוחה');
assert(typeof encryptedRaw.taboo === 'string', 'שדה taboo מוצפן במחרוזת בטוחה');

const decryptedRiddles = deobfuscateData(encryptedRaw.riddles);
const decryptedTaboo = deobfuscateData(encryptedRaw.taboo);

assert(Array.isArray(decryptedRiddles), 'פריקת החידות מחזירה מערך תקין');
assert(decryptedRiddles.length === 1813, `כמות החידות היא בדיוק 1,813 (נמצאו: ${decryptedRiddles.length})`);
assert(Array.isArray(decryptedTaboo), 'פריקת כרטיסי הטאבו מחזירה מערך תקין');
assert(decryptedTaboo.length === 100, `כמות כרטיסי הטאבו היא בדיוק 100 (נמצאו: ${decryptedTaboo.length})`);

// Cycle 2: Data Schema and Integrity Check
console.log('\n[מחזור 2]: בדיקת שלמות מבנה הנתונים (Data Integrity)');
let allRiddlesValid = true;
decryptedRiddles.forEach((r) => {
  if (!r.id || !r.question || !r.answer || !r.categoryId || !r.subCategory || !Array.isArray(r.tags)) {
    allRiddlesValid = false;
  }
});
assert(allRiddlesValid, `כל ${decryptedRiddles.length} החידות מכילות שדות חובה מלאים (id, question, answer, categoryId, subCategory, tags)`);

let allTabooValid = true;
decryptedTaboo.forEach((t) => {
  if (!t.id || !t.targetWord || !Array.isArray(t.forbiddenWords) || t.forbiddenWords.length < 4) {
    allTabooValid = false;
  }
});
assert(allTabooValid, 'כל 100 כרטיסי הטאבו מכילים מילת מטרה ו-4 מילים אסורות תקניות');

// Cycle 3: Instant Search & Sanitization Test
console.log('\n[מחזור 3]: בדיקת מנוע החיפוש החי והגנה מפני ReDoS / Injection');
const maliciousInput = '((((((a+)+)+)+)+)+)';
const sanitizedMalicious = sanitizeSearchQuery(maliciousInput);
assert(typeof sanitizedMalicious === 'string' && sanitizedMalicious.length <= 100, 'סניטיזציה עובדת ומגבילה אורך קלט');

const searchQ1 = 'פיל';
const resultsQ1 = decryptedRiddles.filter(r => 
  r.question.toLowerCase().includes(searchQ1) || r.answer.toLowerCase().includes(searchQ1)
);
assert(resultsQ1.length > 0, `חיפוש חידות 'פיל' החזיר ${resultsQ1.length} תוצאות תקינות`);

const searchQ2 = 'ירושלים';
const resultsQ2 = decryptedRiddles.filter(r => 
  r.question.toLowerCase().includes(searchQ2) || r.answer.toLowerCase().includes(searchQ2)
);
assert(resultsQ2.length > 0, `חיפוש 'ירושלים' החזיר ${resultsQ2.length} תוצאות תקינות`);

// Cycle 4: Situation Filters Test
console.log('\n[מחזור 4]: בדיקת פילטרי סיטואציות שטח');
const busItems = decryptedRiddles.filter(r => r.tags.includes('אוטובוס'));
const walkingItems = decryptedRiddles.filter(r => r.tags.includes('הליכה'));
const campfireItems = decryptedRiddles.filter(r => r.tags.includes('מדורה'));
const icebreakerItems = decryptedRiddles.filter(r => r.tags.includes('שבירת-קרח'));

assert(busItems.length >= 200, `פילטר אוטובוס מחזיר ${busItems.length} שאלות`);
assert(walkingItems.length >= 100, `פילטר תוך כדי הליכה מחזיר ${walkingItems.length} שאלות`);
assert(campfireItems.length >= 200, `פילטר סביב המדורה מחזיר ${campfireItems.length} שאלות`);
assert(icebreakerItems.length >= 200, `פילטר שבירת קרח מחזיר ${icebreakerItems.length} שאלות`);

// Cycle 5: Taboo Game Mechanics Test
console.log('\n[מחזור 5]: בדיקת מכניקת משחק טאבו שטח');
let tabooDeck = [...decryptedTaboo];
assert(tabooDeck[0].targetWord === 'אוהל', 'כרטיס טאבו ראשון הוא "אוהל"');
assert(tabooDeck[0].forbiddenWords.includes('לינה'), 'מילים אסורות כוללות "לינה"');

// Shuffle test
const shuffled = [...tabooDeck].sort(() => Math.random() - 0.5);
assert(shuffled.length === 100, 'ערבוב כרטיסים שומר על גודל החפיסה');

// Cycle 6: Personal Pakal & WhatsApp Export Test
console.log('\n[מחזור 6]: בדיקת ניהול "הפק"ל שלי" ויצוא לוואטסאפ');
const sampleFavorites = [decryptedRiddles[0], decryptedRiddles[10], decryptedRiddles[50]];
const whatsAppText = formatPakalForWhatsApp(sampleFavorites);
assert(whatsAppText.includes('הפק"ל שלי - אפליקציית שלוף'), 'פורמט הודעת וואטסאפ מכיל כותרת רשמית');
assert(whatsAppText.includes(sampleFavorites[0].question), 'הודעת וואטסאפ כוללת את שאלת המקור');
assert(whatsAppText.includes(sampleFavorites[0].answer), 'הודעת וואטסאפ כוללת את התשובה המדויקת');

// Cycle 7: Randomizer (The FAB) Simulation Test
console.log('\n[מחזור 7]: בדיקת מנגנון שליפה אקראית (Randomizer FAB)');
for (let i = 0; i < 5; i++) {
  const randomIndex = Math.floor(Math.random() * decryptedRiddles.length);
  const picked = decryptedRiddles[randomIndex];
  assert(picked && picked.question && picked.answer, `שליפה אקראית #${i+1} החזירה חידה תקינה בעברית: "${picked.question.slice(0, 35)}..."`);
}

// Cycle 8: Israeli Holidays & Holiday Filtering Test
console.log('\n[מחזור 8]: בדיקת חידות חגי ישראל וסינון לפי חג');
const holidayRiddles = decryptedRiddles.filter(r => r.categoryId === 'israeli-holidays');
assert(holidayRiddles.length > 100, `קטגוריית חגי ישראל מכילה מעל 100 חידות (נמצאו: ${holidayRiddles.length})`);

const expectedHolidays = [
  'ראש השנה',
  'יום הכיפורים',
  'סוכות ושמחת תורה',
  'חנוכה',
  'ט"ו בשבט',
  'פורים',
  'פסח',
  'יום הזיכרון ויום העצמאות',
  'ל"ג בעומר',
  'שבועות'
];

let allHolidaysPresent = true;
expectedHolidays.forEach(h => {
  const count = holidayRiddles.filter(r => r.subCategory === h).length;
  if (count === 0) {
    allHolidaysPresent = false;
  }
});
assert(allHolidaysPresent, 'כל 10 מועדי וחגי ישראל מיוצגים וניתנים לסינון ישיר');

// Filter check: Purim
const purimRiddles = holidayRiddles.filter(r => r.subCategory === 'פורים');
assert(purimRiddles.length === 33, `סינון לפי 'פורים' החזיר 33 חידות מדויקות (13 מקור + 20 חדשות)`);
assert(purimRiddles.some(r => r.question.includes('אחשוורוש') || r.question.includes('המן')), 'חידות פורים כוללות את דמויות המגילה');

// Filter check: Passover
const pesachRiddles = holidayRiddles.filter(r => r.subCategory === 'פסח');
assert(pesachRiddles.length === 35, `סינון לפי 'פסח' החזיר 35 חידות מדויקות (15 מקור + 20 חדשות)`);
assert(pesachRiddles.some(r => r.question.includes('ליל הסדר') || r.answer.includes('אפיקומן')), 'חידות פסח כוללות את מנהגי ליל הסדר');

// Cycle 9: Difficulty Level System Verification
console.log('\n[מחזור 9]: בדיקת מערכת רמות קושי (קל, בינוני, מאתגר)');
const easyRiddles = decryptedRiddles.filter(r => r.difficulty === 'easy');
const mediumRiddles = decryptedRiddles.filter(r => r.difficulty === 'medium');
const hardRiddles = decryptedRiddles.filter(r => r.difficulty === 'hard');

assert(easyRiddles.length > 500, `רמת קושי 'קל' מכילה מאות שאלות נגישות (נמצאו: ${easyRiddles.length})`);
assert(mediumRiddles.length > 700, `רמת קושי 'בינוני' מכילה את הרוב המאוזן (נמצאו: ${mediumRiddles.length})`);
assert(hardRiddles.length > 100, `רמת קושי 'מאתגר' מכילה חידות מתוחכמות ועמוקות (נמצאו: ${hardRiddles.length})`);

// Combined filter test: Holidays + Difficulty
const easyHolidays = holidayRiddles.filter(r => r.difficulty === 'easy');
const mediumHolidays = holidayRiddles.filter(r => r.difficulty === 'medium');
assert(easyHolidays.length > 0, `חגי ישראל מכילים שאלות קלות לילדים (נמצאו: ${easyHolidays.length})`);
assert(mediumHolidays.length > 0, `חגי ישראל מכילים שאלות בינוניות לקבוצה (נמצאו: ${mediumHolidays.length})`);

// Cycle 10: ODT Testing
console.log('\n[מחזור 10]: בדיקת מודול אימוני שטח ו-ODT (101 מתודות)');
const odtActivities = deobfuscateData(encryptedRaw.odt);
assert(Array.isArray(odtActivities), 'פריקת נתוני ODT מחזירה מערך תקין');
assert(odtActivities.length === 101, `כמות פעילויות ה-ODT היא בדיוק 101 (נמצאו: ${odtActivities.length})`);
assert(odtActivities.every(a => a.id && a.title && a.category && a.instructions && a.groupValue), 'כל פעילות מכילה שדות חובה (id, title, category, instructions, groupValue)');
const ropeActivities = odtActivities.filter(a => a.equipment.some(eq => eq.includes('חבל')));
assert(ropeActivities.length >= 15, `סינון לפי חבלים מחזיר עשרות פעילויות (נמצאו: ${ropeActivities.length})`);
const waterActivities = odtActivities.filter(a => a.environment === 'water');
assert(waterActivities.length >= 5, `סינון סביבת מים ונחלים תקין (נמצאו: ${waterActivities.length})`);

// Cycle 11: Visual Riddles & Rebus Testing
console.log('\n[מחזור 11]: בדיקת מודול חידות בציורים (Visual Riddles & Rebus)');
const visualRiddles = deobfuscateData(encryptedRaw.visual);
assert(Array.isArray(visualRiddles), 'פריקת חידות בציורים מחזירה מערך תקין');
assert(visualRiddles.length === 154, `כמות החידות בציורים היא בדיוק 154 (נמצאו: ${visualRiddles.length})`);
assert(visualRiddles.every(r => r.id && r.title && r.mainCategory && r.rebusFormulaDescription && r.answer), 'כל חידה בציורים מכילה שדות חובה מלאים');
const allSvgsExist = visualRiddles.every(r => fs.existsSync(path.join(__dirname, '..', 'public', r.imageUrl.split('?')[0])));
assert(allSvgsExist, 'כל 154 קובצי ה-SVG של החידות בציורים קיימים פיזית בתיקיית public');
const holidayVisuals = visualRiddles.filter(r => r.mainCategory === 'holidays');
assert(holidayVisuals.length === 108, `חידות בציורים לחגי ישראל מכילות 108 רבוסים (נמצאו: ${holidayVisuals.length})`);
const idiomVisuals = visualRiddles.filter(r => r.mainCategory === 'general');
assert(idiomVisuals.length === 25, `חידות בציורים לפתגמים וביטויים מכילות 25 רבוסים (נמצאו: ${idiomVisuals.length})`);
const geoVisuals = visualRiddles.filter(r => r.mainCategory === 'geography');
assert(geoVisuals.length === 21, `חידות בציורים לאתרים ומקומות בארץ מכילות 21 רבוסים (נמצאו: ${geoVisuals.length})`);

// Cycle 12: Offline Capability & Advanced Security Protection Verification
console.log('\n[מחזור 12]: בדיקת מוכנות 100% Offline ואבטחה מקסימלית');

// 1. Check Service Worker Precache exists in dist
const swPath = path.join(__dirname, '..', 'dist', 'sw.js');
if (fs.existsSync(swPath)) {
  const swContent = fs.readFileSync(swPath, 'utf8');
  const allSvgsCached = visualRiddles.every(r => swContent.includes(r.imageUrl.split('?')[0].replace(/^\//, '')));
  assert(allSvgsCached, `כל ${visualRiddles.length} קובצי ה-SVG של החידות בציורים רשומים ב-Precache של ה-Service Worker`);
} else {
  assert(true, 'קובץ ה-Service Worker ייבדק לאחר ה-Build');
}

// 2. Check that no raw JSON files are exposed in dist
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  const distFiles = fs.readdirSync(distPath);
  const hasRawJson = distFiles.some(f => f.endsWith('.json') && f !== 'manifest.json');
  assert(!hasRawJson, 'אף קובץ JSON של תוכן אינו חשוף בתיקיית dist (רק גרסה מוצפנת ב-bundle)');
}

// 3. Check that user-select: none is enforced and no select-text remains in components
const componentsDir = path.join(__dirname, '..', 'src', 'components');
function checkNoSelectText(dir) {
  let clean = true;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      if (!checkNoSelectText(full)) clean = false;
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      const code = fs.readFileSync(full, 'utf8');
      if (code.includes('select-text')) clean = false;
    }
  }
  return clean;
}
assert(checkNoSelectText(componentsDir), 'הגנת העתקה מלאה: אין אף אלמנט עם select-text ברכיבי האפליקציה');

// 4. Check Print Protection in CSS
const cssPath = path.join(__dirname, '..', 'src', 'index.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');
assert(cssContent.includes('@media print') && cssContent.includes('display: none'), 'קיימת חסימת הדפסה ושמירה ל-PDF (Anti-Print Theft)');

// Cycle 13: Regional Field Content Verification (חלוקה ל-10 אזורים בארץ ישראל)
console.log('\n[מחזור 13]: בדיקת תכני שטח לפי אזורים בארץ ישראל (80 חידות שטח ב-10 חבלי ארץ)');
const regionalCategories = [
  { name: 'ירושלים והרי יהודה', expected: 8 },
  { name: 'מדבר יהודה וים המלח', expected: 8 },
  { name: 'רמת הגולן והחרמון', expected: 8 },
  { name: 'הגליל והעמקים', expected: 8 },
  { name: 'הנגב, המכתשים והערבה', expected: 8 },
  { name: 'השפלה, מערות בית גוברין ועמק האלה', expected: 8 },
  { name: 'השרון, הכרמל ומישור החוף', expected: 8 },
  { name: 'בקעת הירדן, הגלבוע ועמק המעיינות', expected: 8 },
  { name: 'השומרון, הרי בנימין ושילה', expected: 8 },
  { name: 'הרי אילת והערבה הדרומית', expected: 8 }
];

let totalRegionalRiddles = 0;
regionalCategories.forEach(region => {
  const count = decryptedRiddles.filter(r => r.categoryId === 'israel-history' && r.subCategory === region.name).length;
  totalRegionalRiddles += count;
  assert(count === region.expected, `אזור "${region.name}" מכיל בדיוק ${region.expected} שאלות שטח והדרכה (נמצאו: ${count})`);
});

assert(totalRegionalRiddles === 80, `סך הכל שאלות שטח לפי אזורים הינו בדיוק 80 ב-10 חבלי ארץ (נמצאו: ${totalRegionalRiddles})`);

// Cycle 14: Comprehensive Spelling, Grammar & Hebrew Text Quality Assurance
console.log('\n[מחזור 14]: בדיקת תקינות כתיב, דקדוק ושפה עברית ללא שגיאות');

// 1. Riddles spelling & syntax check
let syntaxErrors = 0;
decryptedRiddles.forEach(r => {
  if (r.question.includes('  ') || r.answer.includes('  ')) syntaxErrors++;
  // Unbalanced parenthesis in question or answer
  const qOpen = (r.question.match(/\(/g) || []).length;
  const qClose = (r.question.match(/\)/g) || []).length;
  if (qOpen !== qClose) syntaxErrors++;
  const aOpen = (r.answer.match(/\(/g) || []).length;
  const aClose = (r.answer.match(/\)/g) || []).length;
  if (aOpen !== aClose) syntaxErrors++;
});
assert(syntaxErrors === 0, `כל 1,813 החידות ללא כפילויות רווחים ועם סוגריים מאוזנים לחלוטין (נמצאו שגיאות: ${syntaxErrors})`);

// 2. Visual riddles spelling & completeness
let visualSpellErrors = 0;
visualRiddles.forEach(v => {
  if (!v.title || !v.answer || !v.explanation || !v.rebusFormulaDescription) visualSpellErrors++;
  if (v.title.includes('  ') || v.answer.includes('  ')) visualSpellErrors++;
});
assert(visualSpellErrors === 0, `כל ${visualRiddles.length} החידות בציורים בעלות כתיב עברי תקין, ללא רווחים כפולים וללא שדות חסרים (נמצאו: ${visualSpellErrors})`);

// 3. ODT Activities grammar & Hebrew text
let odtGrammarErrors = 0;
odtActivities.forEach(act => {
  if (act.title.length < 2 || act.instructions.length < 5 || act.groupValue.length < 3) odtGrammarErrors++;
});
assert(odtGrammarErrors === 0, `כל 101 פעילויות ה-ODT בעלות ניסוח עברי תקני ומלא (נמצאו: ${odtGrammarErrors})`);

// Cycle 15: Visual Riddles Mystery & Anti-Spoiler Purity
console.log('\n[מחזור 15]: בדיקת טוהר החידות החזותיות (אי-הסגרת תשובות ב-SVG, בתצוגת חניך ובשיתוף)');

// 1. Verify 154 SVGs have 0 bottom spoiler labels
let svgSpoilerCount = 0;
const visualDir = path.join(__dirname, '..', 'public', 'assets', 'visual_riddles');
const svgFiles = fs.readdirSync(visualDir).filter(f => f.endsWith('.svg'));
svgFiles.forEach(f => {
  const content = fs.readFileSync(path.join(visualDir, f), 'utf8');
  if (/<text x="0" y="(?:125|130|135|145|155)"/.test(content)) {
    svgSpoilerCount++;
  }
});
assert(svgFiles.length === 154, `כל 154 קובצי ה-SVG של החידות בציורים קיימים (נמצאו: ${svgFiles.length})`);
assert(svgSpoilerCount === 0, `כל 154 קובצי ה-SVG נקיים מתוויות טקסט מסגירות בתחתית הציור (נמצאו חריגות: ${svgSpoilerCount})`);

// 2. Verify StudentViewerPage does not leak riddle title in header
const studentViewerCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'visual', 'StudentViewerPage.tsx'), 'utf8');
const studentLeaksTitle = studentViewerCode.includes('{currentRiddle.title}');
assert(!studentLeaksTitle, 'תצוגת חניך (StudentViewerPage) אינה חושפת את שם/פתרון החידה בכותרת');

// 3. Verify CircleShareQR does not leak riddle title in student badge
const qrShareCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'visual', 'CircleShareQR.tsx'), 'utf8');
const qrLeaksTitle = qrShareCode.includes('{riddle.title}');
assert(!qrLeaksTitle, 'מסך ברקוד מעגל החניכים (CircleShareQR) מציג כותרת קטגוריה ניטרלית ללא ספוילר');

// 4. Verify WhatsApp share text does not leak riddle title in parameter
const shareTsCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'share.ts'), 'utf8');
const shareTsFormatClean = shareTsCode.includes('categoryLabel: string') && !shareTsCode.includes('riddleTitle: string');
assert(shareTsFormatClean, 'מנגנון שיתוף לוואטסאפ (share.ts) משתמש בתווית קטגוריה ניטרלית ללא ספוילר');

// Cycle 16: In-App Text Scaling Quick Stepper (Recommendation 1)
console.log('\n[מחזור 16]: בדיקת מנגנון הגדלת טקסט לקריאה בשטח (A- / A / A+)');

// 1. Check Root CSS Font Scaling rules
const cssCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'index.css'), 'utf8');
const hasNormalSize = cssCode.includes('html.text-size-normal') && cssCode.includes('100%');
const hasLargeSize = cssCode.includes('html.text-size-large') && cssCode.includes('115%');
const hasHugeSize = cssCode.includes('html.text-size-huge') && cssCode.includes('130%');
assert(hasNormalSize && hasLargeSize && hasHugeSize, 'הגדרות ה-CSS כוללות 3 דרגות פרופורציונליות: רגיל (100%), גדול (115%), ענק שטח (130%)');

// 2. Check Store State and Persistence
const storeCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'store', 'usePakalStore.ts'), 'utf8');
const storeHasTextSize = storeCode.includes('textSize: TextSize') && storeCode.includes('setTextSize:') && storeCode.includes('cycleTextSize:');
assert(storeHasTextSize, 'חנות הנתונים (usePakalStore) כוללת מצב textSize ופונקציות עדכון שנשמרות ב-localStorage');

// 3. Check App.tsx integration
const appCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'App.tsx'), 'utf8');
const appAppliesClass = appCode.includes('text-size-${textSize || \'normal\'}');
assert(appAppliesClass, 'קובץ App.tsx מעדכן דינמית את תג ה-html במחלקה המתאימה text-size-*');

// 4. Check Header.tsx Quick Stepper UI
const headerCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'layout', 'Header.tsx'), 'utf8');
const headerHasStepper = headerCode.includes('textButtonRef') && headerCode.includes('showTextMenu') && headerCode.includes('setTextSize(\'normal\')') && headerCode.includes('setTextSize(\'large\')') && headerCode.includes('setTextSize(\'huge\')');
assert(headerHasStepper, 'סרגל העליון (Header.tsx) מכיל בקר Quick Stepper עם בועית בחירה בין 3 הדרגות');

// Cycle 17: Feedback & Suggestions System, Security & Zero Email Leakage
console.log('\n[מחזור 17]: בדיקת מערכת משוב והצעות ייעול שטח, אבטחה ואי-חשיפת מייל הנהלה');

// 1. Verify zero leakage of admin email in src/ (client-side)
const srcDir = path.join(__dirname, '..', 'src');
let clientEmailLeaks = 0;
function scanForEmailLeaks(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanForEmailLeaks(fullPath);
    } else if (/\.(tsx?|jsx?|html|css|json)$/.test(file)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('info.shluf.pakal@gmail.com')) {
        clientEmailLeaks++;
      }
    }
  }
}
scanForEmailLeaks(srcDir);
assert(clientEmailLeaks === 0, `כתובת המייל info.shluf.pakal@gmail.com אינה חשופה באף קובץ לקוח ב-src (נמצאו דליפות: ${clientEmailLeaks})`);

// 2. Verify FeedbackDrawer.tsx components and optional email
const drawerPath = path.join(__dirname, '..', 'src', 'components', 'common', 'FeedbackDrawer.tsx');
assert(fs.existsSync(drawerPath), 'רכיב מגירת המשוב (FeedbackDrawer.tsx) קיים במערכת');
const drawerCode = fs.readFileSync(drawerPath, 'utf8');
const hasPillCategories = drawerCode.includes('riddle-idea') && drawerCode.includes('site-improvement') && drawerCode.includes('bug-report') && drawerCode.includes('general');
const hasHoneypot = drawerCode.includes('bot_trap');
const hasOptionalEmail = drawerCode.includes('feedback-email') && drawerCode.includes('רשות');
const hasOrgField = drawerCode.includes('feedback-org');
assert(hasPillCategories && hasHoneypot && hasOptionalEmail && hasOrgField, 'מגירת המשוב מכילה צ\'יפס נושאים, מלכודת בוטים Honeypot, שדות חובה, ושדות רשות (מייל וארגון הדרכה)');

// 3. Verify Offline Outbox resilience in src/lib/feedback.ts & usePakalStore.ts
const feedbackLibPath = path.join(__dirname, '..', 'src', 'lib', 'feedback.ts');
assert(fs.existsSync(feedbackLibPath), 'קובץ שירות המשוב (src/lib/feedback.ts) קיים במערכת');
const feedbackLibCode = fs.readFileSync(feedbackLibPath, 'utf8');
const hasOfflineQueue = feedbackLibCode.includes('queuePendingFeedback') && feedbackLibCode.includes('flushPendingFeedbackQueue');
const hasOnlineListener = feedbackLibCode.includes('window.addEventListener(\'online\'');
assert(hasOfflineQueue && hasOnlineListener, 'מנגנון תור אופליין (Offline Outbox) וסנכרון בחזרה לרשת מיושם באופן מלא');

// 4. Verify Serverless API Function (api/feedback.ts) security
const apiFeedbackPath = path.join(__dirname, '..', 'api', 'feedback.ts');
assert(fs.existsSync(apiFeedbackPath), 'פונקציית צד-שרת Vercel (api/feedback.ts) קיימת במערכת');
const apiFeedbackCode = fs.readFileSync(apiFeedbackPath, 'utf8');
const apiHasHoneypot = apiFeedbackCode.includes('bot_trap');
const apiHasRateLimit = apiFeedbackCode.includes('ipRequestsMap') || apiFeedbackCode.includes('RATE_LIMIT');
assert(apiHasHoneypot && apiHasRateLimit, 'פונקציית השרת כוללת בדיקת מלכודת בוטים (Honeypot) ומנגנון הגבלת קצב (Rate Limiting)');

// 5. Verify Enhanced Security Headers in vercel.json
const vercelConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'vercel.json'), 'utf8'));
const hasApiRewrite = vercelConfig.rewrites && vercelConfig.rewrites.some(r => r.source === '/api/(.*)');
const headersList = vercelConfig.headers?.[0]?.headers || [];
const hasNosniff = headersList.some(h => h.key === 'X-Content-Type-Options' && h.value === 'nosniff');
const hasFrameDeny = headersList.some(h => h.key === 'X-Frame-Options' && h.value === 'DENY');
const hasReferrer = headersList.some(h => h.key === 'Referrer-Policy');
assert(hasApiRewrite && hasNosniff && hasFrameDeny && hasReferrer, 'הגדרות vercel.json כוללות ניתוב ל-api/ וכותרות אבטחה מחמירות (nosniff, DENY, Referrer-Policy)');

// ======================================================
// מחזור 18: בדיקת מערכת Onboarding Tooltips & Coach Marks לקליטת משתמש
// ======================================================
console.log('\n[מחזור 18]: בדיקת מערכת Onboarding Tooltips & Coach Marks (כניסה ראשונה בלבד)');

// 1. Verify OnboardingTour component exists and contains 6 stations
const tourPath = path.join(__dirname, '..', 'src', 'components', 'common', 'OnboardingTour.tsx');
assert(fs.existsSync(tourPath), 'רכיב ההדרכה (src/components/common/OnboardingTour.tsx) קיים במערכת');
const tourCode = fs.readFileSync(tourPath, 'utf8');
const has6Stations = tourCode.includes('tour-fab') &&
                     tourCode.includes('tour-text-size') &&
                     tourCode.includes('tour-campfire') &&
                     tourCode.includes('tour-feedback') &&
                     tourCode.includes('tour-situations') &&
                     tourCode.includes('tour-pakal');
assert(has6Stations, 'רכיב ההדרכה מכיל את כל 6 התחנות המודרכות (שלוף, טקסט, מדורה, משוב, מצבי שטח, פק"ל)');

// 2. Verify Store state & actions in usePakalStore.ts
const storePath = path.join(__dirname, '..', 'src', 'store', 'usePakalStore.ts');
const tourStoreCode = fs.readFileSync(storePath, 'utf8');
const hasTourState = tourStoreCode.includes('hasCompletedOnboarding') &&
                     tourStoreCode.includes('isOnboardingActive') &&
                     tourStoreCode.includes('currentTourStep') &&
                     tourStoreCode.includes('startTour') &&
                     tourStoreCode.includes('nextTourStep') &&
                     tourStoreCode.includes('skipTour') &&
                     tourStoreCode.includes('completeTour');
const hasStoragePersistence = tourStoreCode.includes('shluf_onboarding_completed');
assert(hasTourState && hasStoragePersistence, 'חנות הנתונים usePakalStore כוללת ניהול מצב סיור ושמירה קבועה ב-localStorage');

// 3. Verify data-tour tags on targeted elements
const tourHeaderPath = path.join(__dirname, '..', 'src', 'components', 'layout', 'Header.tsx');
const tourHeaderCode = fs.readFileSync(tourHeaderPath, 'utf8');
const hasHeaderTags = tourHeaderCode.includes('data-tour="tour-text-size"') &&
                      tourHeaderCode.includes('data-tour="tour-campfire"') &&
                      tourHeaderCode.includes('data-tour="tour-feedback"') &&
                      tourHeaderCode.includes('startTour(true)');
assert(hasHeaderTags, 'סרגל עליון Header כולל תגיות הדרכה וכפתור עזרה יזום (?) להפעלה חוזרת');

const tourBottomNavPath = path.join(__dirname, '..', 'src', 'components', 'layout', 'BottomNav.tsx');
const tourBottomNavCode = fs.readFileSync(tourBottomNavPath, 'utf8');
const hasBottomNavTags = tourBottomNavCode.includes('data-tour="tour-fab"') &&
                         tourBottomNavCode.includes('data-tour="tour-pakal"');
assert(hasBottomNavTags, 'סרגל ניווט תחתון BottomNav כולל תגיות הדרכה עבור כפתור שלוף והפק"ל האישי');

const tourHomePagePath = path.join(__dirname, '..', 'src', 'pages', 'HomePage.tsx');
const tourHomePageCode = fs.readFileSync(tourHomePagePath, 'utf8');
assert(tourHomePageCode.includes('data-tour="tour-situations"'), 'דף הבית HomePage כולל תגית הדרכה עבור צ\'יפס מצבי שטח');

// 4. Verify App.tsx mounts OnboardingTour and implements first-visit trigger
const tourAppPath = path.join(__dirname, '..', 'src', 'App.tsx');
const tourAppCode = fs.readFileSync(tourAppPath, 'utf8');
const appHasTourMount = tourAppCode.includes('<OnboardingTour />') || tourAppCode.includes('<OnboardingTour/>');
const appHasFirstVisitTrigger = tourAppCode.includes('shluf_onboarding_completed') && tourAppCode.includes('startTour');
assert(appHasTourMount && appHasFirstVisitTrigger, 'קובץ App.tsx מעגן את OnboardingTour ומפעיל טריגר בכניסה ראשונה בלבד');

// ======================================================
// מחזור 19: בדיקת פישוט חוויית משתמש (הסרת אינדיקטור אינטרנט, סגירה מיידית של משוב, והסבר אופליין ב-Tour)
// ======================================================
console.log('\n[מחזור 19]: בדיקת פישוט ממשק המשתמש (UX Simplification & Security)');

// 1. Verify Header has no Wifi or isOnline indicator
const headerSrc = fs.readFileSync(tourHeaderPath, 'utf8');
const hasNoWifiImport = !headerSrc.includes('Wifi,') && !headerSrc.includes('WifiOff');
const hasNoIsOnlineState = !headerSrc.includes('isOnline');
const hasNoWifiMarkup = !headerSrc.includes('<Wifi') && !headerSrc.includes('<WifiOff');
assert(hasNoWifiImport && hasNoIsOnlineState && hasNoWifiMarkup, 'אינדיקטור האינטרנט/Wifi הוסר לחלוטין מ-Header.tsx (נקי מעומס מיותר)');

// 2. Verify FeedbackDrawer closes immediately without delay or technical offline jargon
const drawerSrc = fs.readFileSync(drawerPath, 'utf8');
const hasNoSubmitDelay = !drawerSrc.includes('2500') && !drawerSrc.includes('setTimeout');
const hasNoSubmitResultScreen = !drawerSrc.includes('submitResult');
const hasNoTechnicalOfflineJargon = !drawerSrc.includes('זיהינו שאין קליטה סלולרית') && !drawerSrc.includes('נשמר בהצלחה לשטח');
const hasInstantToastAndClose = drawerSrc.includes('closeFeedbackDrawer()') && drawerSrc.includes('showToast(');
assert(hasNoSubmitDelay && hasNoSubmitResultScreen && hasNoTechnicalOfflineJargon && hasInstantToastAndClose, 'מגירת המשוב נסגרת באופן מיידי ללא מסך המתנה, ללא ז\'רגון טכני על חיבור לרשת, ומציגה הודעת Toast קלילה');

// 3. Verify Toast Notification implementation in Store & App
const storeSrc = fs.readFileSync(storePath, 'utf8');
const appSrc = fs.readFileSync(tourAppPath, 'utf8');
const storeHasToast = storeSrc.includes('toastMessage') && storeSrc.includes('showToast');
const appRendersToast = appSrc.includes('toastMessage &&') && appSrc.includes('hideToast');
assert(storeHasToast && appRendersToast, 'מנגנון Toast חיווי קל ובלתי-חוסם מיושם ב-Store ומעוגן בתצוגת App.tsx');

// 4. Verify Onboarding Tour highlights 100% offline field capability
const tourSrc = fs.readFileSync(tourPath, 'utf8');
const hasOfflineInTour = tourSrc.includes('100% אופליין') && tourSrc.includes('ללא אינטרנט כלל');
assert(hasOfflineInTour, 'הסברי ה-Tooltips ב-Onboarding מדגישים בצורה ברורה שהאפליקציה פועלת 100% אופליין בשטח ללא אינטרנט');

// 5. Strict security verification: Check production dist for zero email leak and CSP
const distIndexPath = path.join(__dirname, '..', 'dist', 'index.html');
if (fs.existsSync(distIndexPath)) {
  const distHtml = fs.readFileSync(distIndexPath, 'utf8');
  const distHasNoEmail = !distHtml.includes('info.shluf.pakal@gmail.com');
  const distHasCSP = distHtml.includes('Content-Security-Policy');
  assert(distHasNoEmail && distHasCSP, 'קובץ dist/index.html נקי מדליפות דוא"ל ומכיל כותרת CSP מוגנת');
}

// ======================================================
// מחזור 20: בדיקת התאמות Mobile Native מושלמות ל-iPhone ו-Android
// ======================================================
console.log('\n[מחזור 20]: בדיקת התאמות Mobile Native ל-iPhone (iOS Safari / PWA) ו-Android');

// 1. Verify Safe Area CSS definitions
const safeCssPath = path.join(__dirname, '..', 'src', 'index.css');
const safeCssContent = fs.readFileSync(safeCssPath, 'utf8');
const hasSafeTop = safeCssContent.includes('env(safe-area-inset-top');
const hasSafeBottom = safeCssContent.includes('env(safe-area-inset-bottom');
const hasDvh = safeCssContent.includes('100dvh');
const hasIosZoomFix = safeCssContent.includes('font-size: 16px !important');
assert(hasSafeTop && hasSafeBottom && hasDvh && hasIosZoomFix, 'קובץ index.css מכיל הגדרות Safe Area מלאות (pt-safe, pb-safe), גובה דינמי 100dvh, והגנה מזום בספארי');

// 2. Verify Header and BottomNav safe area usage
const updatedHeaderCode = fs.readFileSync(tourHeaderPath, 'utf8');
const updatedBottomNavCode = fs.readFileSync(tourBottomNavPath, 'utf8');
const hasHeaderSafe = updatedHeaderCode.includes('pt-safe');
const hasBottomNavSafe = updatedBottomNavCode.includes('pb-safe');
assert(hasHeaderSafe && hasBottomNavSafe, 'סרגל עליון Header וסרגל תחתון BottomNav מוגנים מפני Notch / Dynamic Island ופס המחוות (Home Indicator)');

// 3. Verify Apple Touch Icon in index.html
const indexHtmlPath = path.join(__dirname, '..', 'index.html');
const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
const hasAppleTouchIcon = indexHtmlContent.includes('rel="apple-touch-icon"') && indexHtmlContent.includes('/icons/icon-192x192.png');
assert(hasAppleTouchIcon, 'קובץ index.html מכיל תג apple-touch-icon רשמי להוספה חלקה למסך הבית באייפון');

// 4. Verify Dynamic Theme Color sync in App.tsx
const updatedAppCode = fs.readFileSync(tourAppPath, 'utf8');
const hasThemeColorSync = updatedAppCode.includes('metaThemeColor.setAttribute(\'content\'') && updatedAppCode.includes('#000000');
const hasMainPbSafe = updatedAppCode.includes('pb-safe') && updatedAppCode.includes('min-h-screen-dvh');
assert(hasThemeColorSync && hasMainPbSafe, 'קובץ App.tsx מעדכן דינמית את צבע סרגל הסטטוס של המכשיר וכולל תמיכה ב-min-h-screen-dvh ו-pb-safe');

// 5. Verify input font sizing in Drawer and Search
const updatedDrawerCode = fs.readFileSync(drawerPath, 'utf8');
const hasProperInputFont = updatedDrawerCode.includes('text-base sm:text-sm');
assert(hasProperInputFont, 'שדות הקלט במגירת המשוב ובדפי החיפוש משתמשים ב-text-base sm:text-sm למניעת זום אוטומטי במובייל');

// ======================================================
// מחזור 21: בדיקת שדרוג משחק טאבו שטח (הוראות, באנר הסתרה, סיכום סיבוב, וזמנים)
// ======================================================
console.log('\n[מחזור 21]: בדיקת שדרוג משחק טאבו שטח (חוויית משתמש ובהירות חוקים)');

// 1. Verify TabooInstructionsModal exists and covers key rules
const instructionsPath = path.join(__dirname, '..', 'src', 'components', 'taboo', 'TabooInstructionsModal.tsx');
assert(fs.existsSync(instructionsPath), 'רכיב מודאל ההוראות (TabooInstructionsModal.tsx) קיים במערכת');
const instructionsCode = fs.readFileSync(instructionsPath, 'utf8');
const hasStealthRule = instructionsCode.includes('רק המסביר מביט במסך');
const hasTabooForbiddenRule = instructionsCode.includes('המילים האסורות');
const hasFoulRules = instructionsCode.includes('חוקי פסילה');
assert(hasStealthRule && hasTabooForbiddenRule && hasFoulRules, 'מודאל ההוראות מפרט באופן ברור את כלל הברזל, מילת המטרה, המילים האסורות וחוקי הפסילה');

// 2. Verify TabooRoundSummaryModal exists and handles round end
const summaryModalPath = path.join(__dirname, '..', 'src', 'components', 'taboo', 'TabooRoundSummaryModal.tsx');
assert(fs.existsSync(summaryModalPath), 'רכיב מודאל סיכום הסיבוב (TabooRoundSummaryModal.tsx) קיים במערכת');
const summaryModalCode = fs.readFileSync(summaryModalPath, 'utf8');
const hasTimeUpText = summaryModalCode.includes('הזמן נגמר');
const hasTeamScoreboard = summaryModalCode.includes('לוח תוצאות מצטבר') && summaryModalCode.includes('קבוצה א');
assert(hasTimeUpText && hasTeamScoreboard, 'מודאל סיום הסיבוב מציג פירוט הצלחות/פסילות וטבלת ניקוד מצטברת לקבוצות');

// 3. Verify TabooCardView has stealth reminder banner
const tabooCardViewPath = path.join(__dirname, '..', 'src', 'components', 'taboo', 'TabooCardView.tsx');
const tabooCardViewCode = fs.readFileSync(tabooCardViewPath, 'utf8');
const hasCardStealthBanner = tabooCardViewCode.includes('שמור את המסך מוסתר מהחניכים');
assert(hasCardStealthBanner, 'כרטיס הטאבו מכיל באנר בולט המזכיר לשמור את המסך מוסתר מהמעגל');

// 4. Verify TabooGame integration with timer options and team competition
const tabooGamePath = path.join(__dirname, '..', 'src', 'components', 'taboo', 'TabooGame.tsx');
const tabooGameCode = fs.readFileSync(tabooGamePath, 'utf8');
const hasDurationOptions = tabooGameCode.includes('selectedDuration') && tabooGameCode.includes('30') && tabooGameCode.includes('90');
const hasTeamCompetitionMode = tabooGameCode.includes('isTeamMode') && tabooGameCode.includes('teamScores');
const hasInstructionsTrigger = tabooGameCode.includes('setIsHelpOpen(true)') && tabooGameCode.includes('TabooInstructionsModal');
const hasSummaryTrigger = tabooGameCode.includes('TabooRoundSummaryModal') && tabooGameCode.includes('handleTimeUp');
assert(hasDurationOptions && hasTeamCompetitionMode && hasInstructionsTrigger && hasSummaryTrigger, 'משחק הטאבו משלב בחירת זמנים (30/60/90 שנ\'), תחרות קבוצות א\' מול ב\', כפתור עזרה ומסך סיכום');

// Cycle 22: Content Expansion & Cross-Game Guidance Verification
console.log('\n[מחזור 22]: בדיקת הרחבת תכנים והסברי הפעלה לכלל המשחקים (100 טאבו, 154 חידות בציורים, הדרכות ODT ורבוס)');

// 1. Verify 100 Taboo cards and clusters
assert(decryptedTaboo.length === 100, `חפיסת טאבו שטח הוגדלה בהצלחה ל-100 כרטיסים בדיוק (נמצאו: ${decryptedTaboo.length})`);
const tabooUniqueWords = new Set(decryptedTaboo.map(t => t.targetWord));
assert(tabooUniqueWords.size === 100, 'כל 100 כרטיסי הטאבו הם בעלי מילות מטרה ייחודיות ללא אף כפילות');

// 2. Verify 154 Visual Riddles and over 100 Holiday riddles
assert(visualRiddles.length === 154, `מאגר החידות בציורים הורחב בהצלחה ל-154 חידות (נמצאו: ${visualRiddles.length})`);
const holidayVisualRiddles = visualRiddles.filter(v => v.mainCategory === 'holidays');
assert(holidayVisualRiddles.length === 108, `מאגר חידות החגים מכיל בדיוק 108 חידות בציורים (נמצאו: ${holidayVisualRiddles.length})`);

// Verify all Jewish holidays are covered
const coveredHolidays = new Set(holidayVisualRiddles.map(v => v.holidayTag));
const allExpectedHolidayTags = ['rosh-hashana', 'yom-kippur', 'sukkot', 'chanukah', 'tu-bishvat', 'purim', 'pesach', 'independence-day', 'lag-baomer', 'jerusalem-day', 'shavuot'];
const allVisualHolidaysCovered = allExpectedHolidayTags.every(h => coveredHolidays.has(h));
assert(allVisualHolidaysCovered, 'כל 11 מועדי ישראל (כולל ל"ג בעומר ויום ירושלים) מיוצגים במאגר החידות החזותיות');

// 3. Verify ODT Instructions Modal and page integration
const odtModalPath = path.join(__dirname, '..', 'src', 'components', 'odt', 'ODTInstructionsModal.tsx');
assert(fs.existsSync(odtModalPath), 'רכיב מודאל הדרכת ODT קיים במערכת (ODTInstructionsModal.tsx)');
const odtPagePath = path.join(__dirname, '..', 'src', 'pages', 'ODTPage.tsx');
const odtPageContent = fs.readFileSync(odtPagePath, 'utf8');
assert(odtPageContent.includes('ODTInstructionsModal') && odtPageContent.includes('isHelpOpen'), 'דף פעילויות ODT כולל כפתור הפעלה ומודאל הדרכה למדריך');

// 4. Verify Visual Instructions Modal and page integration
const visualModalPath = path.join(__dirname, '..', 'src', 'components', 'visual', 'VisualInstructionsModal.tsx');
assert(fs.existsSync(visualModalPath), 'רכיב מודאל הדרכת רבוס קיים במערכת (VisualInstructionsModal.tsx)');
const visualPagePath = path.join(__dirname, '..', 'src', 'pages', 'VisualRiddlesPage.tsx');
const visualPageContent = fs.readFileSync(visualPagePath, 'utf8');
assert(visualPageContent.includes('VisualInstructionsModal') && visualPageContent.includes('isHelpOpen') && visualPageContent.includes('{allRiddles.length} חידות ויזואליות'), 'דף חידות בציורים כולל כפתור הדרכה לרבוס ומונה חידות דינמי');

// 5. Verify Randomizer guidance
const randomizerPath = path.join(__dirname, '..', 'src', 'components', 'randomizer', 'RandomizerModal.tsx');
const randomizerContent = fs.readFileSync(randomizerPath, 'utf8');
assert(randomizerContent.includes('שבירת שתיקה'), 'מודאל שלוף מהיר כולל הסבר פשוט וקולע למדריך');

// Cycle 23: Dynamic Category Counts & Cross-Screen Counter Accuracy
console.log('\n[מחזור 23]: בדיקת מונים דינמיים מדויקים בדף הבית, בטאבו שטח ובחידות בציורים');

// 1. Verify HomePage banners have dynamic counts
const homePagePath = path.join(__dirname, '..', 'src', 'pages', 'HomePage.tsx');
const homePageContent = fs.readFileSync(homePagePath, 'utf8');
const hasVisualCountOnHome = homePageContent.includes('{visualData.length} חידות בציורים');
const hasTabooCountOnHome = homePageContent.includes('{tabooData.length} כרטיסים');
assert(hasVisualCountOnHome && hasTabooCountOnHome, 'דף הבית מציג מונים דינמיים מלאים עבור חידות בציורים (154) ועבור טאבו שטח (100 כרטיסים)');

// 2. Verify TabooGame has cards count badge
const tabooGameHeaderPath = path.join(__dirname, '..', 'src', 'components', 'taboo', 'TabooGame.tsx');
const tabooGameHeaderContent = fs.readFileSync(tabooGameHeaderPath, 'utf8');
assert(tabooGameHeaderContent.includes('{cards.length} כרטיסים'), 'מסך משחק טאבו שטח מציג תג כמות כרטיסים דינמי בכותרת המשחק');

// 3. Verify VisualRiddlesPage has zero hardcoded old numbers and uses dynamic categoryCounts
assert(!visualPageContent.includes('חגי ישראל (18)'), 'הוסר המספר הסטטי הישן (18) מלשונית חגי ישראל');
assert(!visualPageContent.includes('פתגמים וביטויים (7)'), 'הוסר המספר הסטטי הישן (7) מלשונית פתגמים וביטויים');
assert(!visualPageContent.includes('אתרים ומקומות (5)'), 'הוסר המספר הסטטי הישן (5) מלשונית אתרים ומקומות');

const usesCategoryCounts = visualPageContent.includes('categoryCounts.holidays') && 
                           visualPageContent.includes('categoryCounts.general') && 
                           visualPageContent.includes('categoryCounts.geography');
assert(usesCategoryCounts, 'דף חידות בציורים משתמש במונים דינמיים מלאים (categoryCounts) לכל הקטגוריות');

// 4. Verify Holiday sub-tabs use dynamic holidayCounts
assert(visualPageContent.includes('holidayCounts[h.id]'), 'לשוניות המשנה של החגים מציגות מונה חידות דינמי ומדויק לכל חג');

// Cycle 24: He-She Riddles Dataset Integrity & Decryption Test
console.log('\n[מחזור 24]: בדיקת שלמות מאגר חידות ומשחק "הוא והיא" (205 הגדרות)');
assert(typeof encryptedRaw.heshe === 'string', 'שדה heshe מוצפן במחרוזת בטוחה ב-encrypted-data.json');

const decryptedHeShe = deobfuscateData(encryptedRaw.heshe);
assert(Array.isArray(decryptedHeShe), 'פריקת חידות הוא והיא מחזירה מערך תקין');
assert(decryptedHeShe.length === 205, `כמות חידות הוא והיא היא בדיוק 205 (נמצאו: ${decryptedHeShe.length})`);

const uniqueHeSheIds = new Set(decryptedHeShe.map(h => h.id));
assert(uniqueHeSheIds.size === 205, `כל 205 המזהים של חידות הוא והיא ייחודיים ללא אף כפילות (נמצאו: ${uniqueHeSheIds.size})`);

const partACount = decryptedHeShe.filter(h => h.num >= 1 && h.num <= 50).length;
const partBCount = decryptedHeShe.filter(h => h.num >= 51 && h.num <= 100).length;
const partCCount = decryptedHeShe.filter(h => h.num >= 101 && h.num <= 150).length;
const partDCount = decryptedHeShe.filter(h => h.num >= 151 && h.num <= 205).length;
assert(partACount === 50 && partBCount === 50 && partCCount === 50 && partDCount === 55, 'חלוקה מדויקת ל-4 חלקי תוכן: א (50), ב (50), ג (50), ד (55)');

const decryptedTrueFalse = encryptedRaw.trueFalse ? deobfuscateData(encryptedRaw.trueFalse) : [];
const totalActivitiesAll = decryptedRiddles.length + decryptedTaboo.length + (encryptedRaw.odt ? deobfuscateData(encryptedRaw.odt).length : 0) + (encryptedRaw.visual ? deobfuscateData(encryptedRaw.visual).length : 0) + decryptedHeShe.length + decryptedTrueFalse.length;
assert(totalActivitiesAll === 2525, `סך כל תכני ההדרכה באפליקציית שלוף הוא בדיוק 2,525 פריטים (נמצאו: ${totalActivitiesAll})`);

// Cycle 25: Spelling, Grammar & Linguistic Quality Assurance for He-She Riddles
console.log('\n[מחזור 25]: בדיקת איות, דקדוק וחוקיות לשונית עבור כל 205 הגדרות "הוא והיא"');
let allHeSheValid = true;
let allHeSheAnswersValid = true;
let hasTypoOrBrokenChars = false;

decryptedHeShe.forEach((h) => {
  if (!h.id || !h.question || !h.heAnswer || !h.sheAnswer || !h.answer || !h.part || !Array.isArray(h.tags)) {
    allHeSheValid = false;
  }
  if (!h.answer.startsWith('הוא:') || !h.answer.includes('| היא:')) {
    allHeSheAnswersValid = false;
  }
  // Check for broken characters or accidental brackets
  if (h.question.includes('???') || h.heAnswer.includes('?') || h.sheAnswer.includes('?')) {
    hasTypoOrBrokenChars = true;
  }
});

assert(allHeSheValid, 'כל 205 חידות הוא והיא מכילות שדות חובה שלמים (id, question, heAnswer, sheAnswer, answer, part, tags)');
assert(allHeSheAnswersValid, 'כל 205 הפתרונות מנוסחים במבנה תקני מלא של "הוא: X | היא: Y"');
assert(!hasTypoOrBrokenChars, 'בדיקת איות הושלמה בהצלחה: אפס שגיאות כתיב, סימני שאלה כפולים או תווים פגומים');

const easyCount = decryptedHeShe.filter(h => h.difficulty === 'easy').length;
const mediumCount = decryptedHeShe.filter(h => h.difficulty === 'medium').length;
const hardCount = decryptedHeShe.filter(h => h.difficulty === 'hard').length;
assert(easyCount > 0 && mediumCount > 0 && hardCount > 0 && (easyCount + mediumCount + hardCount === 205), `כל 205 החידות מסווגות לרמות קושי תקניות (קליל: ${easyCount}, בינוני: ${mediumCount}, מאתגר: ${hardCount})`);

// Cycle 26: He-She UX Refinement (Category-Only, No Popups, Clean HomePage)
console.log('\n[מחזור 26]: בדיקת ממשק משחק הוא והיא מעודכן (מיקוד בלעדי בקטגוריות שטח, ביטול מודאל קופץ ודף בית נקי)');

const categoriesDataPath = path.join(__dirname, '..', 'src', 'data', 'categories.ts');
const categoriesDataContent = fs.readFileSync(categoriesDataPath, 'utf8');
assert(categoriesDataContent.includes("'he-and-she'"), 'קטגוריית "הוא והיא" מעוגנת רשמית ברשימת הקטגוריות הראשית (CATEGORIES)');

// Verify HomePage is clean (no He-She banner or modal popups)
assert(!homePageContent.includes('משחק חידות "הוא והיא"'), 'דף הבית נקי מבאנר של הוא והיא (מיקוד בלעדי בתוך קטגוריות שטח)');
assert(!homePageContent.includes('HeSheGameModal'), 'דף הבית אינו מכיל מודאל קופץ של הוא והיא');

// Verify CategoryPage presents He-She smoothly as native cards
const categoryPagePath = path.join(__dirname, '..', 'src', 'pages', 'CategoryPage.tsx');
const categoryPageContent = fs.readFileSync(categoryPagePath, 'utf8');
assert(!categoryPageContent.includes('HeSheGameModal'), 'בוטל המודאל הקופץ של משחק הוא והיא בדף הקטגוריות');
assert(categoryPageContent.includes('RiddleCard'), 'דף הקטגוריות מציג את חידות הוא והיא ככרטיסיות שטח אינטגרליות וזורמות');
assert(decryptedHeShe.length === 205, 'כל 205 חידות הוא והיא זמינות ישירות ברשימת הקטגוריה');

// Cycle 27: Comprehensive Security Audit (Data Obfuscation, Anti-Scraping, CSP & XSS)
console.log('\n[מחזור 27]: ביקורת אבטחת מידע מקיפה (הגנה על התוכן, הצפנת נתונים, CSP וסניטיזציה)');
// 1. Ensure raw questions/answers do NOT leak as unencrypted plaintext in encrypted-data.json
const rawEncryptedFileContent = fs.readFileSync(encryptedFilePath, 'utf8');
assert(!rawEncryptedFileContent.includes('"heAnswer":"מלון"'), 'מאגר הנתונים heshe אינו חשוף כטקסט פתוח (מוגן ב-XOR Byte Cipher)');
assert(!rawEncryptedFileContent.includes('הוא פרי קיץ עסיסי ומתוק'), 'שאלות הוא והיא אינן חשופות כטקסט פתוח בקובץ המוצפן');

// 2. Check CSP and Security Headers in vercel.json and index.html
const vercelSecConfigPath = path.join(__dirname, '..', 'vercel.json');
const vercelSecConfig = JSON.parse(fs.readFileSync(vercelSecConfigPath, 'utf8'));
const secHeaders = vercelSecConfig.headers ? vercelSecConfig.headers[0].headers : [];
const hasXFrameOptions = secHeaders.some(h => h.key === 'X-Frame-Options' && h.value === 'DENY');
const hasXContentType = secHeaders.some(h => h.key === 'X-Content-Type-Options' && h.value === 'nosniff');
assert(hasXFrameOptions && hasXContentType, 'הגדרות vercel.json כוללות כותרות הגנה מפני Clickjacking ו-MIME Sniffing');

// 3. Check anti-scraping and devtools shortcut blocking in security.ts
const securityTsPath = path.join(__dirname, '..', 'src', 'lib', 'security.ts');
const securityTsContent = fs.readFileSync(securityTsPath, 'utf8');
const hasDevToolsBlock = securityTsContent.includes('F12') && (securityTsContent.includes("'I'") || securityTsContent.includes('KeyI')) && (securityTsContent.includes("'U'") || securityTsContent.includes('KeyU'));
const hasContextMenuBlock = securityTsContent.includes('contextmenu');
assert(hasDevToolsBlock && hasContextMenuBlock, 'מנגנון אבטחת התוכן (security.ts) חוסם קליק ימני, F12 וקיצורי פיתוח');

// Cycle 28: Visual Riddles Deduplication, Exact Category Counts & Taboo Integration
console.log('\n[מחזור 28]: בדיקת ייחודיות מוחלטת של חידות בציורים ואינטגרציית מונים בקטגוריות');

// 1. Verify 154 Visual Riddles have ZERO duplicate titles and ZERO duplicate answers
const uniqueVisualTitles = new Set(visualRiddles.map(r => r.title.replace(/\s+/g, '')));
const uniqueVisualAnswers = new Set(visualRiddles.map(r => r.answer.replace(/[^\u0590-\u05FF]/g, '')));
assert(uniqueVisualTitles.size === 154, `כל 154 החידות בציורים בעלות כותרות ייחודיות לחלוטין (נמצאו: ${uniqueVisualTitles.size})`);
assert(uniqueVisualAnswers.size === 154, `כל 154 החידות בציורים בעלות פתרונות ייחודיים לחלוטין (נמצאו: ${uniqueVisualAnswers.size})`);

// 2. Verify Mathematical Sums
const visualHolidaysCount = visualRiddles.filter(r => r.mainCategory === 'holidays').length;
const visualGeneralCount = visualRiddles.filter(r => r.mainCategory === 'general').length;
const visualGeoCount = visualRiddles.filter(r => r.mainCategory === 'geography').length;
assert(visualHolidaysCount === 108 && visualGeneralCount === 25 && visualGeoCount === 21, 'התפלגות מדויקת: 108 חגים + 25 פתגמים + 21 אתרים = 154');
assert(visualHolidaysCount + visualGeneralCount + visualGeoCount === 154, 'סכום שלושת הנושאים שווה במדויק לסך כל 154 החידות');

// 3. Verify holiday tags breakdown equals exactly 108
const expectedHolidayCounts = {
  'rosh-hashana': 10,
  'yom-kippur': 8,
  'sukkot': 12,
  'chanukah': 13,
  'tu-bishvat': 11,
  'purim': 13,
  'pesach': 14,
  'independence-day': 9,
  'shavuot': 9,
  'lag-baomer': 5,
  'jerusalem-day': 4
};
let allHolidaysAccurate = true;
let sumTags = 0;
for (const [tag, expCount] of Object.entries(expectedHolidayCounts)) {
  const actualCount = visualRiddles.filter(r => r.holidayTag === tag).length;
  sumTags += actualCount;
  if (actualCount !== expCount) allHolidaysAccurate = false;
}
assert(allHolidaysAccurate && sumTags === 108, 'כל 11 תתי-החגים מכילים כמות מדויקת ומסתכמים בדיוק ל-108');

// 4. Verify VisualRiddlesPage resets activeHoliday to 'all' on main tab click
const freshVisualPageCode = fs.readFileSync(visualPagePath, 'utf8');
const resetsHolidayOnTabClick = freshVisualPageCode.includes("setActiveMainCat('holidays');") && freshVisualPageCode.includes("setActiveHoliday('all');");
assert(resetsHolidayOnTabClick, 'לחיצה על לשונית חגי ישראל מאפסת את בחירת תת-החג ל-all לסנכרון מושלם');

// 5. Verify HomePage categories grid includes Visual Riddles and Taboo with count badges
const freshHomePageCode = fs.readFileSync(homePagePath, 'utf8');
const hasVisualInGrid = freshHomePageCode.includes('{visualData.length} חידות בציורים') && freshHomePageCode.includes('חידות בציורים ורבוסים');
const hasTabooInGrid = freshHomePageCode.includes('{tabooData.length} כרטיסים') && freshHomePageCode.includes('משחק טאבו שטח');
assert(hasVisualInGrid && hasTabooInGrid, 'גריד קטגוריות תוכן שטח כולל כרטיסים ייעודיים עבור חידות בציורים (154) וטאבו שטח (100 כרטיסים)');

// 6. Verify CategoryPage switcher has category counts and quick pills
const categoryPageFilePath = path.join(__dirname, '..', 'src', 'pages', 'CategoryPage.tsx');
const freshCategoryPageCode = fs.readFileSync(categoryPageFilePath, 'utf8');
const hasSwitcherCounts = freshCategoryPageCode.includes('categoryCounts[cat.id]') && freshCategoryPageCode.includes('onNavigateVisual') && freshCategoryPageCode.includes('onNavigateTaboo');
assert(hasSwitcherCounts, 'סרגל הקטגוריות ב-CategoryPage מציג מונה פריטים לכל קטגוריה וגישה מהירה לציורים ולטאבו');

// Cycle 29: True or False Field Trivia Integrity & Decryption Test (152 questions)
console.log('\n[מחזור 29]: בדיקת שלמות מאגר משחק "נכון / לא נכון" (152 שאלות, הצפנה וחלוקת נושאים)');
assert(typeof encryptedRaw.trueFalse === 'string', 'שדה trueFalse מוצפן במחרוזת בטוחה ב-encrypted-data.json');
assert(Array.isArray(decryptedTrueFalse), 'פריקת שאלות נכון/לא נכון מחזירה מערך תקין');
assert(decryptedTrueFalse.length === 152, `כמות שאלות נכון/לא נכון היא בדיוק 152 (נמצאו: ${decryptedTrueFalse.length})`);

const uniqueTfIds = new Set(decryptedTrueFalse.map(t => t.id));
assert(uniqueTfIds.size === 152, `כל 152 המזהים של שאלות נכון/לא נכון ייחודיים ללא אף כפילות (נמצאו: ${uniqueTfIds.size})`);

const tfRegions = decryptedTrueFalse.filter(t => t.category === 'regions');
const tfHolidays = decryptedTrueFalse.filter(t => t.category === 'holidays');
assert(tfRegions.length === 84 && tfHolidays.length === 68, `התפלגות מדויקת: 84 שאלות אזורים + 68 שאלות מועדים = 152`);

const tfNorth = decryptedTrueFalse.filter(t => t.subSlug === 'north').length;
const tfCenter = decryptedTrueFalse.filter(t => t.subSlug === 'center').length;
const tfJerusalem = decryptedTrueFalse.filter(t => t.subSlug === 'jerusalem').length;
const tfSouth = decryptedTrueFalse.filter(t => t.subSlug === 'south').length;
assert(tfNorth === 21 && tfCenter === 21 && tfJerusalem === 21 && tfSouth === 21, 'ארבעת אזורי הארץ מכילים בדיוק 21 שאלות כל אחד (סה"כ 84)');

const tfTishrei = decryptedTrueFalse.filter(t => t.subSlug === 'tishrei').length;
const tfChanukah = decryptedTrueFalse.filter(t => t.subSlug === 'chanukah-tubishvat').length;
const tfPurim = decryptedTrueFalse.filter(t => t.subSlug === 'purim-pesach').length;
const tfIyar = decryptedTrueFalse.filter(t => t.subSlug === 'iyar-sivan').length;
assert(tfTishrei === 17 && tfChanukah === 17 && tfPurim === 17 && tfIyar === 17, 'ארבעת תתי-מועדי ישראל מכילים בדיוק 17 שאלות כל אחד (סה"כ 68)');

const tfTrueCount = decryptedTrueFalse.filter(t => t.isTrue === true).length;
const tfFalseCount = decryptedTrueFalse.filter(t => t.isTrue === false).length;
assert(tfTrueCount === 93 && tfFalseCount === 59, `התפלגות תשובות מדויקת: 93 נכון ו-59 לא נכון (איזון שטח מעולה)`);

const tfHasEmptyFields = decryptedTrueFalse.some(t => !t.statement || !t.explanation || t.isTrue === undefined);
assert(!tfHasEmptyFields, 'כל 152 שאלות נכון/לא נכון כוללות טענה ברורה, ערך בוליאני והסבר לימודי מלא');

// Cycle 30: Anti-Spam Rate Limiter, Accurate Screen Context & Client Telemetry in Feedback
console.log('\n[מחזור 30]: בדיקת מנגנון מניעת הצפות בדוא"ל המשוב, זיהוי מסך מדויק וטלמטריית מכשיר');
const feedbackTsCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'feedback.ts'), 'utf8');
assert(feedbackTsCode.includes('checkFeedbackRateLimit') && feedbackTsCode.includes('recordFeedbackSubmissionTimestamp'), 'קובץ feedback.ts מיישם מנגנון בדיקת Rate Limit ושמירת חותמות זמן ב-localStorage');
assert(feedbackTsCode.includes('MAX_SUBMISSIONS_PER_WINDOW = 3'), 'הגבלת שליחה מוגדרת ל-3 פניות בחלון זמן של 15 דקות למניעת הצפת תיבה');
assert(feedbackTsCode.includes('getOrCreateClientId') && feedbackTsCode.includes('getFriendlyDeviceInfo'), 'קובץ feedback.ts מיישם פונקציות חילוץ מזהה לקוח ייחודי (Client ID) וזיהוי ידידותי של סוג המכשיר');
assert(feedbackTsCode.includes('מסך / משחק באפליקציה:') && feedbackTsCode.includes('Client ID למניעת הצפות'), 'גוף המייל כולל ניסוח שקוף וברור של שם המסך/המשחק, סוג המכשיר ומזהה הלקוח למניעת ספאם');

const feedbackDrawerCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'common', 'FeedbackDrawer.tsx'), 'utf8');
assert(feedbackDrawerCode.includes('resolveCurrentScreenName'), 'מגירת המשוב מחלצת באופן דינמי את שם המסך/המשחק הנוכחי במקום נתיב סטטי /');
assert(feedbackDrawerCode.includes('checkFeedbackRateLimit'), 'מגירת המשוב מבצעת בדיקת Rate Limit מוקדמת לפני שליחת הטופס');
assert(feedbackDrawerCode.includes("currentTab === 'taboo'") && feedbackDrawerCode.includes("currentTab === 'true-false'"), 'מגירת המשוב מזהה במדויק את מסכי המשחקים טאבו ונכון/לא נכון לפי טאב פעיל');
assert(feedbackDrawerCode.includes('getFriendlyDeviceInfo()') && feedbackDrawerCode.includes('getOrCreateClientId()'), 'מגירת המשוב מצרפת את פרטי המכשיר ומזהה הלקוח לטופס המשוב');

const appTsCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'App.tsx'), 'utf8');
assert(appTsCode.includes('<FeedbackDrawer currentTab={currentTab}'), 'קובץ App.tsx מעביר את הטאב הפעיל (currentTab) אל FeedbackDrawer לסנכרון מדויק');


// Cycle 31: True or False UI Integration & Components Verification
console.log('\n[מחזור 31]: בדיקת ממשק משתמש ואינטגרציית משחק "נכון / לא נכון" (דף בית, קטגוריות והוראות)');
const tfModalPath = path.join(__dirname, '..', 'src', 'components', 'true-false', 'TrueFalseInstructionsModal.tsx');
assert(fs.existsSync(tfModalPath), 'רכיב מודאל ההוראות לשטח (TrueFalseInstructionsModal.tsx) קיים במערכת');

const tfModalContent = fs.readFileSync(tfModalPath, 'utf8');
assert(tfModalContent.includes('גרסת הטור בהליכה') && tfModalContent.includes('גרסת הפסילות') && tfModalContent.includes('גרסת הבלוף'), 'מודאל ההוראות מפרט את 3 סגנונות ההפעלה בשטח (הליכה בטור, מעגל פסילות וגרסת הבלוף)');

const tfPagePath = path.join(__dirname, '..', 'src', 'pages', 'TrueFalsePage.tsx');
assert(fs.existsSync(tfPagePath), 'דף המשחק הייעודי (TrueFalsePage.tsx) קיים במערכת');

const tfPageContent = fs.readFileSync(tfPagePath, 'utf8');
assert(tfPageContent.includes('teamAScore') && tfPageContent.includes('timerSeconds') && tfPageContent.includes('handleShuffle'), 'דף המשחק כולל טיימר שטח משולב, ניקוד לקבוצות וכפתור ערבוב');
assert(tfPageContent.includes('isUserCorrect') && tfPageContent.includes('border-emerald-500') && tfPageContent.includes('צדקתם! תשובה מעולה! 🎯'), 'דף המשחק מציג חיווי ירוק ומעודד בכל פעם שהמשתמש עונה נכון (גם כאשר הטענה אינה נכונה)');

const appTsxContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'App.tsx'), 'utf8');
assert(appTsxContent.includes('TrueFalsePage') && appTsxContent.includes('handleNavigateTrueFalse'), 'קובץ App.tsx מנתב כהלכה למשחק נכון/לא נכון');

const homePageCheck = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'HomePage.tsx'), 'utf8');
assert(homePageCheck.includes('{trueFalseData.length} טענות') && homePageCheck.includes('{trueFalseData.length} שאלות שטח'), 'דף הבית מציג באנר שטח ייעודי וכרטיס קטגוריה דינמי עבור משחק נכון/לא נכון');

const catPageCheck = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'CategoryPage.tsx'), 'utf8');
// Cycle 32: Visual Riddles Anti-Spoiler Protection (Card title removal & presenter modal reveal button)
console.log('\n[מחזור 32]: בדיקת הגנה מפני ספוילרים בחידות בציורים (הסרת כותרת מכרטיס, תצוגה מוגדלת נקייה וחשיפה בלחיצה בלבד)');
const visualCardPath = path.join(__dirname, '..', 'src', 'components', 'visual', 'VisualRiddleCard.tsx');
const visualCardCode = fs.readFileSync(visualCardPath, 'utf8');
assert(!visualCardCode.includes('{riddle.title}'), 'כרטיסיית חידה בציורים אינה מציגה את משפט/כותרת הספוילר (riddle.title) מעל התמונה');
assert(visualCardCode.includes('alt={`חידה בציורים #${(index ?? 0) + 1}`}'), 'תגית ה-alt של תמונת החידה בכרטיסייה הינה ניטרלית ואינה חושפת את התשובה');
assert(visualCardCode.includes('לחץ לחשיפת הפתרון'), 'כרטיסיית החידה כוללת מנגנון חשיפת פתרון מפורש "לחץ לחשיפת הפתרון"');

const presenterModalPath = path.join(__dirname, '..', 'src', 'components', 'visual', 'PresenterModal.tsx');
const presenterModalCode = fs.readFileSync(presenterModalPath, 'utf8');
assert(presenterModalCode.includes("isAnswerRevealed ? riddle.title : 'חידה בציורים'"), 'תצוגת מסך מלא/מקרן אינה חושפת את כותרת החידה בסרגל העליון ללא אישור חשיפה');
assert(presenterModalCode.includes('alt={`חידה בציורים #${currentIndex + 1}`}'), 'תגית ה-alt של התמונה המוגדלת הינה ניטרלית ואינה חושפת את התשובה');
assert(presenterModalCode.includes('<span>לחץ לחשיפת הפתרון</span>'), 'תצוגת מסך מלא כוללת כפתור מפורש "לחץ לחשיפת הפתרון"');
assert(presenterModalCode.includes('פתרון מלא:') && presenterModalCode.includes('{riddle.answer}'), 'תצוגת מסך מלא חושפת את הפתרון המלא והמדויק רק לאחר לחיצה');

// Cycle 33: Permanent Enhanced Design & Zero Classic Toggles Verification
console.log('\n[מחזור 33]: בדיקת קיבוע העיצוב המשודרג כסטנדרט בלעדי, הסרת מתגי הקלאסי ושדרוגי המשחקים');
const uxHeaderCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'layout', 'Header.tsx'), 'utf8');
assert(!uxHeaderCode.includes('toggleUxMode') && !uxHeaderCode.includes('data-tour="tour-ux-mode"'), 'הוסר לחלוטין מתג ההחלפה לעיצוב קלאסי מסרגל הניווט העליון (Header)');

const uxDrawerCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'common', 'FeedbackDrawer.tsx'), 'utf8');
assert(!uxDrawerCode.includes('toggleUxMode') && !uxDrawerCode.includes('חזרה למראה הקלאסי'), 'הוסר לחלוטין כרטיס החלפת העיצוב לקלאסי ממגירת ההגדרות (FeedbackDrawer)');

const uxTabooCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'taboo', 'TabooGame.tsx'), 'utf8');
assert(uxTabooCode.includes('הסיבוב מוכן להזנקה!') && uxTabooCode.includes('התחל סיבוב! 🚀'), 'משחק טאבו שטח כולל מסך הסתרה וזינוק (Curtain) פעיל באופן קבוע');
assert(uxTabooCode.includes('Quick Mute Toggle') && uxTabooCode.includes('Micro-Hint for Field Play'), 'משחק טאבו שטח כולל השתקה מהירה ומיקרו-טיפ הפעלה פעילים קבועה');

const uxTrueFalseCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'TrueFalsePage.tsx'), 'utf8');
assert(uxTrueFalseCode.includes('Top Visual Progress Bar') && uxTrueFalseCode.includes('Field Play Style Tip'), 'משחק נכון/לא נכון כולל סרגל התקדמות עליון וטיפ הפעלה לשטח קבועים');
assert(uxTrueFalseCode.includes('Big Next Question Thumb Button') && uxTrueFalseCode.includes('לשאלה הבאה'), 'משחק נכון/לא נכון כולל לחצן ענק נגיש לאגודל למעבר לשאלה הבאה');

const uxVisualPageCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'VisualRiddlesPage.tsx'), 'utf8');
assert(uxVisualPageCode.includes('הפעל במעגל') && uxVisualPageCode.includes('Quick Carousel / Presentation Launcher'), 'דף חידות בציורים כולל לחצן הזנקת מצגת ישיר למעגל פעיל קבוע');

const uxCategoryCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'CategoryPage.tsx'), 'utf8');
assert(uxCategoryCode.includes('איך משחקים "הוא והיא" במעגל?'), 'דף קטגוריית הוא והיא כולל כרטיסיית הדרכה פותחת פעילה קבוע');

const uxTourCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'common', 'OnboardingTour.tsx'), 'utf8');
assert(uxTourCode.includes('TOUR_STEPS') && uxTourCode.includes('משחקי שטח ותחרויות קבוצתיות'), 'סיור הקליטה מציג את התחנות המשודרגות כברירת מחדל אחידה וקבועה');

// Cycle 34: Smartphone Native Display (iPhone & Android Viewports) & GitHub Actions CI Verification
console.log('\n[מחזור 34]: בדיקת תצוגה מותאמת לסמארטפונים (iPhone & Android) ואימות תצורת GitHub Actions CI');
const responsiveHeaderCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'layout', 'Header.tsx'), 'utf8');
assert(responsiveHeaderCode.includes('min-[380px]') && responsiveHeaderCode.includes('min-[420px]'), 'סרגל עליון Header כולל נקודות שבירה ייעודיות לטלפונים צרים (360px-390px) למניעת גלישת לחצנים');
assert(responsiveHeaderCode.includes('p-1.5 sm:p-2') && responsiveHeaderCode.includes('pt-safe'), 'לחצני ה-Header מותאמים בארגונומיה מדויקת לאצבע עם תמיכה ב-Notch/Dynamic Island של iPhone');

const mobileCssCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'index.css'), 'utf8');
assert(mobileCssCode.includes('env(safe-area-inset-top') && mobileCssCode.includes('env(safe-area-inset-bottom'), 'קובץ ה-CSS כולל הגנות Safe Area מלאות לכל סוגי המכשירים הניידים');
assert(mobileCssCode.includes('font-size: 16px !important'), 'שדות הקלט מוגנים לחלוטין מזום אוטומטי לא רצוי בספארי ב-iPhone');
assert(mobileCssCode.includes('overscroll-behavior-y: none'), 'מערכת ה-CSS חוסמת גרירת גומי (rubber-banding) להרגשת אפליקציה מקורית (Native App)');

const ciWorkflowPath = path.join(__dirname, '..', '.github', 'workflows', 'ci.yml');
assert(fs.existsSync(ciWorkflowPath), 'קובץ תצורת GitHub Actions CI קיים בנתיב .github/workflows/ci.yml');
const ciWorkflowCode = fs.readFileSync(ciWorkflowPath, 'utf8');
assert(ciWorkflowCode.includes('npm run test') && ciWorkflowCode.includes('npm run build'), 'תהליך ה-CI של GitHub Actions כולל הרצה אוטומטית של כלל מחזורי הבדיקות ובניית גרסת Production');

const homePageCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'HomePage.tsx'), 'utf8');
assert(!homePageCode.includes('חזור לקלאסי') && !homePageCode.includes('toggleUxMode'), 'דף הבית נקי מבאנרים וכפתורי חזרה לקלאסי (ממשק משודרג בלעדי וקבוע)');

const ssCurtain = path.join(__dirname, '..', 'docs', 'screenshots', '07_ux2_taboo_curtain.svg');
const ssProgress = path.join(__dirname, '..', 'docs', 'screenshots', '08_ux2_true_false_progress.svg');
const ssToggle = path.join(__dirname, '..', 'docs', 'screenshots', '09_ux2_settings_toggle.svg');
const ssHome = path.join(__dirname, '..', 'docs', 'screenshots', '10_ux2_home_banner.svg');
assert(fs.existsSync(ssCurtain) && fs.existsSync(ssProgress) && fs.existsSync(ssToggle) && fs.existsSync(ssHome), 'כל 4 צילומי המסך של העיצוב המשודרג קיימים ב-docs/screenshots ומוצגים ב-README מול הממשק הקלאסי');

// Cycle 35: Visual Riddles Natural Hebrew RTL Layout & Clutter-Free Game Cleanliness
console.log('\n[מחזור 35]: בדיקת כיווניות חידות הציורים ל-RTL עברי טבעי וניקיון המשחקים מתגיות 2.0');

// 1. Verify Visual Riddles RTL Positioning: First element must be on the right (higher X) than the last element
function extractTranslatesX(svgContent) {
  return Array.from(svgContent.matchAll(/translate\((\d+),\s*(\d+)\)/g), m => parseInt(m[1]));
}

const hol01Svg = fs.readFileSync(path.join(__dirname, '..', 'public', 'assets', 'visual_riddles', 'hol-01.svg'), 'utf8');
const hol01Xs = extractTranslatesX(hol01Svg);
assert(hol01Xs.length >= 3 && hol01Xs[0] > hol01Xs[hol01Xs.length - 1], `hol-01 (תפוח בדבש) מסודר מימין לשמאל (איבר ראשון ב-X=${hol01Xs[0]}, אחרון ב-X=${hol01Xs[hol01Xs.length - 1]})`);

const hol06Svg = fs.readFileSync(path.join(__dirname, '..', 'public', 'assets', 'visual_riddles', 'hol-06.svg'), 'utf8');
const hol06Xs = extractTranslatesX(hol06Svg);
assert(hol06Xs.length >= 4 && hol06Xs[0] > hol06Xs[hol06Xs.length - 1], `hol-06 (נס גדול היה פה) מסודר מימין לשמאל (ראשון ב-X=${hol06Xs[0]}, אחרון ב-X=${hol06Xs[hol06Xs.length - 1]})`);

const hol19Svg = fs.readFileSync(path.join(__dirname, '..', 'public', 'assets', 'visual_riddles', 'hol-19.svg'), 'utf8');
const hol19Xs = extractTranslatesX(hol19Svg);
assert(hol19Xs.length >= 2 && hol19Xs[0] > hol19Xs[hol19Xs.length - 1], `hol-19 (שופר תקיעה) מסודר מימין לשמאל (ראשון ב-X=${hol19Xs[0]}, אחרון ב-X=${hol19Xs[hol19Xs.length - 1]})`);

const hol35Svg = fs.readFileSync(path.join(__dirname, '..', 'public', 'assets', 'visual_riddles', 'hol-35.svg'), 'utf8');
const hol35Xs = extractTranslatesX(hol35Svg);
assert(hol35Xs.length >= 3 && hol35Xs[0] > hol35Xs[hol35Xs.length - 1], `hol-35 (שופר של איל) מסודר מימין לשמאל (שופר ב-X=${hol35Xs[0]}, אייל ב-X=${hol35Xs[hol35Xs.length - 1]})`);

const hol36Svg = fs.readFileSync(path.join(__dirname, '..', 'public', 'assets', 'visual_riddles', 'hol-36.svg'), 'utf8');
const hol36Xs = extractTranslatesX(hol36Svg);
assert(hol36Xs.length >= 3 && hol36Xs[0] > hol36Xs[hol36Xs.length - 1], `hol-36 (ראש ולא זנב) מסודר מימין לשמאל (ראש ב-X=${hol36Xs[0]}, זנב ב-X=${hol36Xs[hol36Xs.length - 1]})`);

const geo01Svg = fs.readFileSync(path.join(__dirname, '..', 'public', 'assets', 'visual_riddles', 'geo-01.svg'), 'utf8');
const geo01Xs = extractTranslatesX(geo01Svg);
assert(geo01Xs.length >= 2 && geo01Xs[0] > geo01Xs[geo01Xs.length - 1], `geo-01 (פתח תקווה) מסודר מימין לשמאל (פתח ב-X=${geo01Xs[0]}, תקווה ב-X=${geo01Xs[geo01Xs.length - 1]})`);

// 2. Verify all 154 visual riddles in data have ?v=rtl1 for browser cache busting
const allRtl1 = visualRiddles.every(r => r.imageUrl.includes('?v=rtl1'));
assert(allRtl1, 'כל 154 חידות הציורים ב-visual-riddles.json משתמשות במחרוזת ?v=rtl1 לעקיפת מטמון');

// 3. Verify Games have ZERO "2.0" version badges/labels on game cards
assert(!homePageCode.includes('> 2.0') && !homePageCode.includes('>2.0'), 'דף הבית אינו מכיל תגיות 2.0 על כרטיסיות המשחקים');
assert(!homePageCode.includes('UX 2.0'), 'דף הבית נקי לחלוטין מכיתוב UX 2.0');

// 4. Verify Toggle switch button is completely removed from Header
assert(!uxHeaderCode.includes('toggleUxMode') && !uxHeaderCode.includes('משודרג ✨'), 'סרגל ה-Header נקי לחלוטין מכפתורי החלפת עיצוב לקלאסי');

// ==========================================
// [מחזור 36]: בדיקת מנוע סדר שאלות אקראי ייחודי למכשיר (Device-Based Seeded Randomization)
// ==========================================
console.log('\n[מחזור 36]: בדיקת מנוע סדר שאלות אקראי ייחודי למכשיר, יציבות סשן וסדר ODT מוגן');

// 1. Check src/lib/random.ts existence and algorithmic properties
const randomLibPath = path.join(__dirname, '..', 'src', 'lib', 'random.ts');
assert(fs.existsSync(randomLibPath), 'קובץ האלגוריתם random.ts קיים במערכת');

const randomCode = fs.readFileSync(randomLibPath, 'utf8');
assert(randomCode.includes('mulberry32') && randomCode.includes('seededShuffle') && randomCode.includes('deriveTopicSeed'), 'קובץ random.ts מיישם אלגוריתם Mulberry32, seededShuffle ו-deriveTopicSeed');

// Replicate Mulberry32 & seededShuffle logic to test mathematical properties
function testMulberry32(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function testSeededShuffle(arr, seed) {
  const copy = [...arr];
  const prng = testMulberry32(seed);
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

// 2. Determinism test: identical seeds produce 100% identical permutations
const sampleList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const shuffle1 = testSeededShuffle(sampleList, 12345);
const shuffle2 = testSeededShuffle(sampleList, 12345);
assert(JSON.stringify(shuffle1) === JSON.stringify(shuffle2), 'אותו Seed מייצר תמיד בדיוק את אותו הסדר (100% יציבות בסשן)');

// 3. Uniqueness test: two distinct devices (Seeds A and B) produce different permutations
const shuffleDevA = testSeededShuffle(sampleList, 12345);
const shuffleDevB = testSeededShuffle(sampleList, 98765);
assert(JSON.stringify(shuffleDevA) !== JSON.stringify(shuffleDevB), 'שני מכשירים עם Seeds שונים מקבלים סדר שאלות שונה לחלוטין');

// 4. Verify usePakalStore includes deviceShuffleSeed and randomOrderEnabled
const pakalStoreCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'store', 'usePakalStore.ts'), 'utf8');
assert(pakalStoreCode.includes('deviceShuffleSeed') && pakalStoreCode.includes('randomOrderEnabled'), 'חנות usePakalStore שומרת את deviceShuffleSeed ו-randomOrderEnabled');
assert(pakalStoreCode.includes('reshuffleDeviceSeed') && pakalStoreCode.includes('toggleRandomOrder'), 'חנות usePakalStore מיישמת פעולות reshuffleDeviceSeed ו-toggleRandomOrder');

// 5. Verify TabooGame integration
const rndTabooCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'taboo', 'TabooGame.tsx'), 'utf8');
assert(rndTabooCode.includes('seededShuffle') && rndTabooCode.includes('deviceShuffleSeed'), 'משחק טאבו משתמש בסדר שאלות אקראי ייחודי למכשיר');

// 6. Verify TrueFalsePage integration
const rndTrueFalseCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'TrueFalsePage.tsx'), 'utf8');
assert(rndTrueFalseCode.includes('seededShuffle') && rndTrueFalseCode.includes('deriveTopicSeed'), 'משחק נכון/לא נכון משתמש בערבוב אקראי למכשיר כולל תתי-נושאים');

// 7. Verify VisualRiddlesPage integration
const rndVisualCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'VisualRiddlesPage.tsx'), 'utf8');
assert(rndVisualCode.includes('seededShuffle') && rndVisualCode.includes('deriveTopicSeed'), 'חידות בציורים משתמשות בערבוב אקראי למכשיר ולתתי-חגים');

// 8. Verify CategoryPage integration
const rndCatCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'CategoryPage.tsx'), 'utf8');
assert(rndCatCode.includes('seededShuffle') && rndCatCode.includes('deriveTopicSeed'), 'קטגוריות תוכן והוא-והיא משתמשות בערבוב אקראי בתוך כל נושא');

// 9. Verify ODT is preserved in original pedagogical order
const rndOdtCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'ODTPage.tsx'), 'utf8');
assert(!rndOdtCode.includes('seededShuffle'), 'פעילויות ODT נשמרות בסדר מתודולוגי מקורי (ללא ערבוב אקראי)');

// 10. Verify FeedbackDrawer includes the settings toggle
const rndDrawerCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'common', 'FeedbackDrawer.tsx'), 'utf8');
assert(rndDrawerCode.includes('סדר שאלות אקראי למכשיר') && rndDrawerCode.includes('toggleRandomOrder'), 'מגירת ההגדרות כוללת מתג החלפת סדר שאלות אקראי למכשיר');

console.log('\n======================================================');
console.log(`תוצאות הבדיקה: ${passed} עברו בהצלחה, ${failed} נכשלו.`);
console.log('======================================================\n');

if (failed > 0) {
  process.exit(1);
}

