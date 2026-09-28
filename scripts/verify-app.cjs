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
assert(decryptedRiddles.length === 1733, `כמות החידות היא בדיוק 1,733 (נמצאו: ${decryptedRiddles.length})`);
assert(Array.isArray(decryptedTaboo), 'פריקת כרטיסי הטאבו מחזירה מערך תקין');
assert(decryptedTaboo.length === 20, `כמות כרטיסי הטאבו היא בדיוק 20 (נמצאו: ${decryptedTaboo.length})`);

// Cycle 2: Data Schema and Integrity Check
console.log('\n[מחזור 2]: בדיקת שלמות מבנה הנתונים (Data Integrity)');
let allRiddlesValid = true;
decryptedRiddles.forEach((r) => {
  if (!r.id || !r.question || !r.answer || !r.categoryId || !r.subCategory || !Array.isArray(r.tags)) {
    allRiddlesValid = false;
  }
});
assert(allRiddlesValid, 'כל 1,415 החידות מכילות שדות חובה מלאים (id, question, answer, categoryId, subCategory, tags)');

let allTabooValid = true;
decryptedTaboo.forEach((t) => {
  if (!t.id || !t.targetWord || !Array.isArray(t.forbiddenWords) || t.forbiddenWords.length < 4) {
    allTabooValid = false;
  }
});
assert(allTabooValid, 'כל 20 כרטיסי הטאבו מכילים מילת מטרה ו-4 מילים אסורות תקניות');

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
assert(shuffled.length === 20, 'ערבוב כרטיסים שומר על גודל החפיסה');

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
assert(visualRiddles.length === 30, `כמות החידות בציורים היא בדיוק 30 (נמצאו: ${visualRiddles.length})`);
assert(visualRiddles.every(r => r.id && r.title && r.mainCategory && r.rebusFormulaDescription && r.answer), 'כל חידה בציורים מכילה שדות חובה מלאים');
const allSvgsExist = visualRiddles.every(r => fs.existsSync(path.join(__dirname, '..', 'public', r.imageUrl)));
assert(allSvgsExist, 'כל 30 קובצי ה-SVG של החידות בציורים קיימים פיזית בתיקיית public');
const holidayVisuals = visualRiddles.filter(r => r.mainCategory === 'holidays');
assert(holidayVisuals.length === 18, `חידות בציורים לחגי ישראל מכילות 18 רבוסים (נמצאו: ${holidayVisuals.length})`);
const idiomVisuals = visualRiddles.filter(r => r.mainCategory === 'general');
assert(idiomVisuals.length === 7, `חידות בציורים לפתגמים וביטויים מכילות 7 רבוסים (נמצאו: ${idiomVisuals.length})`);
const geoVisuals = visualRiddles.filter(r => r.mainCategory === 'geography');
assert(geoVisuals.length === 5, `חידות בציורים לאתרים ומקומות בארץ מכילות 5 רבוסים (נמצאו: ${geoVisuals.length})`);

console.log('\n======================================================');
console.log(`תוצאות הבדיקה: ${passed} עברו בהצלחה, ${failed} נכשלו.`);
console.log('======================================================\n');

if (failed > 0) {
  process.exit(1);
}

