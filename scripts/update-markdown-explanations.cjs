const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, '..', 'content', 'visual_riddles_database.md');
let content = fs.readFileSync(mdPath, 'utf8');

// Explanations dictionary for the 29 items
const explanations = {
  'hol-02': 'לוח שנה (שנה) + בוהן למעלה (טובה) + סוכרייה (מתוקה) = שנה טובה ומתוקה.',
  'hol-03': 'קו גמר + חתימה על חוזה + סימן וי = גמר חתימה טובה.',
  'hol-04': 'הספרה 4 + סמלי מינים (זכר ונקבה) = ארבעת המינים.',
  'hol-05': 'איור שלום + בנאי עובד + סוכה = שלומית בונה סוכה.',
  'hol-06': 'כוס נס קפה + הר גדול + שפתיים/פה = נס גדול היה פה.',
  'hol-07': 'דמיון + חנוכייה מאירה = דמי חנוכה.',
  'hol-08': 'סופגנייה תפוחה + צנצנת ריבה אדומה = סופגנייה בריבה.',
  'hol-09': 'דמות אדם + עץ נטוע + שדה פתוח = כי האדם עץ השדה.',
  'hol-10': 'איור צדיק + עץ תמר + פרח פורח = צדיק כתמר יפרח.',
  'hol-11': 'חודש אדר + סמיילי שמח וצוהל = משנכנס אדר מרבים בשמחה.',
  'hol-12': 'חבילת משלוח + צלחת מנות טעימות = משלוח מנות.',
  'hol-13': 'אוזן שומעת + דמות המן הרשע = אוזן המן.',
  'hol-14': 'שלט יציאה ירוק + פירמידות מצרים = יציאת מצרים.',
  'hol-15': 'שרשראות עבדות שבורות וידיים חופשיות = עבדים היינו.',
  'hol-16': 'קערה + ליל ירח מלא + סדר מספרים = קערת ליל הסדר.',
  'hol-17': 'מגן דוד + צבעי כחול ולבן = מגן דוד כחול לבן.',
  'hol-18': 'סל ביכורים + קציר שיבולי חיטה = ביכורי קציר חיטים.',
  'gen-01': 'The End (סוף) + פועל בונה (מעשה) + גלגלי מחשבה + מקום 1 (תחילה) = סוף מעשה במחשבה תחילה.',
  'gen-02': 'איקס על דובים + איקס על עצי יער = לא דובים ולא יער.',
  'gen-03': 'בור סיד לבן + טיפת מים מוגנת שאינה דולפת = בור סיד שאינו מאבד טיפה.',
  'gen-04': 'פטיש ברזל מנפץ צלחת וכוס = שבר את הכלים.',
  'gen-05': 'כף יד קבורה בצלחת מרק = טמן ידו בצלחת.',
  'gen-06': 'אסימון נופל בחריץ טלפון + נורת רעיון זוהרת = נפל האסימון.',
  'gen-07': 'עץ חיים + גולגולת מוות + כף יד אוחזת לשון = חיים ומוות ביד הלשון.',
  'geo-01': 'דלת כניסה פתוחה (פתח) + בלון משאלות וכוכבים (תקווה) = פתח תקווה.',
  'geo-02': 'ראש של אדם + חץ לפינת חדר = ראש פינה.',
  'geo-03': 'באר מים עתיקה + הספרה 7 (שבע) = באר שבע.',
  'geo-04': 'עין אנושית כחולה + גדי עזים קטן = עין גדי.',
  'geo-05': 'מגדל שעון גבוה + עמק ירוק בין הרים = מגדל העמק.'
};

// Update hol-38 formula to match the moon + prayer book
content = content.replace(
  /\* \*\*נוסחת הרבוס:\*\* `\[ירח חצות\] \+ \[ספר תפילה\] \+ \[שעון מעורר\]`/,
  '* **נוסחת הרבוס:** `[ירח חצות] + [ספר סליחות פתוח]`'
);

// For each id in explanations, check if the block has הסבר חזותי. If not or if it has brackets, update/add it!
Object.keys(explanations).forEach(id => {
  const pattern = new RegExp(`(#### [^\\n]+?\\n\\* \\*\\*מזהה \\(ID\\):\\*\\* \`${id}\`[\\s\\S]*?)(?=(####|##|---|$))`);
  const match = content.match(pattern);
  if (!match) {
    console.warn(`Could not find block for ${id}`);
    return;
  }
  let block = match[1];
  const newExpLine = `* **הסבר חזותי:** ${explanations[id]}\n\n`;
  
  if (block.includes('* **הסבר חזותי:**')) {
    block = block.replace(/\* \*\*הסבר חזותי:\*\* [^\n]+\n+/, newExpLine);
  } else {
    // Append after פתרון line
    block = block.replace(/(\* \*\*פתרון:\*\* [^\n]+\n+)/, `$1${newExpLine}`);
  }
  content = content.replace(match[1], block);
  console.log(`Updated explanation for ${id}`);
});

fs.writeFileSync(mdPath, content, 'utf8');
console.log('Successfully updated content/visual_riddles_database.md!');
