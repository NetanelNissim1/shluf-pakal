const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const OUTPUT_DATA_DIR = path.join(__dirname, '..', 'src', 'data');

const OBFUSCATION_KEY = 'Shluf_Pakal_Security_Key_2026_Secure_Field_Content';
const keyBytes = Buffer.from(OBFUSCATION_KEY, 'utf8');

function obfuscateData(plainText) {
  const textBytes = Buffer.from(plainText, 'utf8');
  const xorBytes = Buffer.alloc(textBytes.length);
  for (let i = 0; i < textBytes.length; i++) {
    xorBytes[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
  }
  return xorBytes.toString('base64');
}

const FILE_CATEGORY_MAP = {
  'word_chains_riddles.md': {
    categoryId: 'word-chains',
    categoryName: 'שרשראות מילים ותחיליות',
    defaultTags: ['שבירת-קרח', 'אוטובוס', 'קצר']
  },
  'nature_and_animals.md': {
    categoryId: 'nature-animals',
    categoryName: 'טבע, בעלי חיים וצומח',
    defaultTags: ['הליכה', 'ילדים', 'מדורה']
  },
  'israel_history_places.md': {
    categoryId: 'israel-history',
    categoryName: 'ארץ ישראל, היסטוריה וערים',
    defaultTags: ['אוטובוס', 'הליכה', 'מדורה']
  },
  'language_and_logic.md': {
    categoryId: 'logic-language',
    categoryName: 'לשון, היגיון וכפל משמעות',
    defaultTags: ['מדורה', 'מתוחכמים', 'שבירת-קרח']
  },
  'culture_and_songs.md': {
    categoryId: 'songs-culture',
    categoryName: 'תרבות, שירים ישראליים ואנגלית',
    defaultTags: ['אוטובוס', 'מדורה', 'שבירת-קרח']
  },
  'jewish_holidays.md': {
    categoryId: 'israeli-holidays',
    categoryName: 'חגי ומועדי ישראל',
    defaultTags: ['מדורה', 'שבירת-קרח', 'אוטובוס']
  }
};

/**
 * Proofread and clean Hebrew text
 */
function cleanHebrewText(text) {
  if (!text) return '';
  let cleaned = text.trim();
  // Normalize multiple spaces
  cleaned = cleaned.replace(/\s+/g, ' ');
  // Clean surrounding brackets or quotes if standalone
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  // Spelling standardizations
  cleaned = cleaned.replace(/\bבאלגן\b/g, 'בלגן');
  cleaned = cleaned.replace(/\bציורפים\b/g, 'צירופים');
  return cleaned;
}

function determineTags(categoryId, subCategory, question) {
  const tags = new Set();
  const subLower = subCategory.toLowerCase();
  const qLower = question.toLowerCase();

  // Basic category defaults
  if (categoryId === 'word-chains') {
    tags.add('אוטובוס');
    tags.add('שבירת-קרח');
    tags.add('קצר');
  } else if (categoryId === 'nature-animals') {
    tags.add('הליכה');
    if (subLower.includes("א'-ב'") || subLower.includes("חרוזים")) {
      tags.add('ילדים');
      tags.add('שבירת-קרח');
    } else {
      tags.add('מדורה');
    }
  } else if (categoryId === 'israel-history') {
    tags.add('אוטובוס');
    tags.add('הליכה');
    if (subLower.includes('חוצה ישראל')) {
      tags.add('מדורה');
    }
  } else if (categoryId === 'logic-language') {
    tags.add('מדורה');
    tags.add('מתוחכמים');
    if (subLower.includes('פלינדרומים') || subLower.includes('למה')) {
      tags.add('שבירת-קרח');
      tags.add('אוטובוס');
    }
  } else if (categoryId === 'songs-culture') {
    tags.add('אוטובוס');
    if (subLower.includes('שירים') || subLower.includes('מקומות')) {
      tags.add('מדורה');
    }
    if (subLower.includes('אנגלית') || subLower.includes('מפורסמים')) {
      tags.add('שבירת-קרח');
    }
  } else if (categoryId === 'israeli-holidays') {
    tags.add('מדורה');
    tags.add('אוטובוס');
    tags.add('שבירת-קרח');
    if (subLower.includes('ט"ו בשבט') || subLower.includes('שבועות') || subLower.includes('ל"ג בעומר')) {
      tags.add('הליכה');
    }
  }

  // Content specific keywords
  if (qLower.includes('שיר') || qLower.includes('זמר') || qLower.includes('פזמון')) {
    tags.add('מדורה');
    tags.add('אוטובוס');
  }
  if (qLower.includes('נחל') || qLower.includes('הר') || qLower.includes('פרח') || qLower.includes('עץ')) {
    tags.add('הליכה');
  }

  return Array.from(tags);
}

function parseMarkdownFiles() {
  const allRiddles = [];
  const allTabooCards = [];
  let riddleCounter = 1;
  let tabooCounter = 1;

  for (const [filename, fileMeta] of Object.entries(FILE_CATEGORY_MAP)) {
    const filePath = path.join(CONTENT_DIR, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);

    let currentSubCategory = '';
    let isTabooSection = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line) continue;

      // Check for Subcategory Header (H2)
      if (line.startsWith('## ')) {
        const rawSub = line.replace(/^##\s+/, '').trim();
        currentSubCategory = cleanHebrewText(rawSub.replace(/^\d+[\.\)]\s*/, '').trim());
        isTabooSection = currentSubCategory.includes('טאבו') || currentSubCategory.includes('כרטיסי טאבו');
        continue;
      }

      // Ignore H1 or H3 headers and horizontal rules
      if (line.startsWith('#') || line.startsWith('---')) {
        continue;
      }

      // Handle Taboo cards in taboo section
      if (isTabooSection) {
        const tabooMatch = line.match(/(?:\d+\.|\*)\s*\*\*([^*]+)\*\*\s*\((?:אסור להגיד:\s*)?([^)]+)\)/);
        if (tabooMatch) {
          const targetWord = cleanHebrewText(tabooMatch[1]);
          const forbiddenRaw = tabooMatch[2].replace(/^אסור להגיד:\s*/, '').trim();
          const forbiddenWords = forbiddenRaw
            .split(/[,،]/)
            .map((w) => cleanHebrewText(w))
            .filter(Boolean);

          allTabooCards.push({
            id: `taboo-${tabooCounter++}`,
            targetWord: targetWord,
            forbiddenWords: [
              forbiddenWords[0] || '',
              forbiddenWords[1] || '',
              forbiddenWords[2] || '',
              forbiddenWords[3] || ''
            ]
          });
          continue;
        }
      }

      // Parse Riddle / Activity
      const isListItem = /^(?:[\*\-\+]|\d+[\.\)])\s+/.test(line);
      if (!isListItem) continue;

      let itemContent = line.replace(/^(?:[\*\-\+]|\d+[\.\)])\s+/, '').trim();

      if (itemContent.startsWith('[') && itemContent.endsWith(']')) {
        itemContent = itemContent.substring(1, itemContent.length - 1).trim();
      }

      const lastParenOpen = itemContent.lastIndexOf('(');
      const lastParenClose = itemContent.lastIndexOf(')');

      if (lastParenOpen !== -1 && lastParenClose > lastParenOpen) {
        const questionText = cleanHebrewText(itemContent.substring(0, lastParenOpen).trim());
        const answerText = cleanHebrewText(itemContent.substring(lastParenOpen + 1, lastParenClose).trim());

        if (questionText && answerText) {
          const tags = determineTags(fileMeta.categoryId, currentSubCategory, questionText);
          
function determineDifficulty(categoryId, subCategory, questionText) {
  const subLower = subCategory.toLowerCase();
  const len = questionText.length;

  if (
    subLower.includes('פלינדרומים') ||
    subLower.includes('היפוך') ||
    subLower.includes('מתחכמות') ||
    subLower.includes('כפולים') ||
    subLower.includes('קפד') ||
    len > 72
  ) {
    return 'hard';
  }

  if (
    len > 38 ||
    categoryId === 'logic-language' ||
    categoryId === 'israel-history' ||
    subLower.includes('בוטנית') ||
    subLower.includes('הוא והיא')
  ) {
    return 'medium';
  }

  return 'easy';
}

          const difficulty = determineDifficulty(fileMeta.categoryId, currentSubCategory, questionText);

          allRiddles.push({
            id: `riddle-${riddleCounter++}`,
            sourceFile: filename,
            categoryId: fileMeta.categoryId,
            subCategory: currentSubCategory || fileMeta.categoryName,
            question: questionText,
            answer: answerText,
            tags: tags,
            difficulty: difficulty
          });
        }
      }
    }
  }

  // --- Parse ODT Activities ---
  const allODTActivities = parseODTActivities();

  // --- Parse Visual Riddles ---
  const allVisualRiddles = parseVisualRiddles();

  if (!fs.existsSync(OUTPUT_DATA_DIR)) {
    fs.mkdirSync(OUTPUT_DATA_DIR, { recursive: true });
  }

  // 1. Write standard JSON for direct tooling
  fs.writeFileSync(
    path.join(OUTPUT_DATA_DIR, 'riddles.json'),
    JSON.stringify(allRiddles, null, 2),
    'utf8'
  );

  fs.writeFileSync(
    path.join(OUTPUT_DATA_DIR, 'taboo.json'),
    JSON.stringify(allTabooCards, null, 2),
    'utf8'
  );

  fs.writeFileSync(
    path.join(OUTPUT_DATA_DIR, 'odt.json'),
    JSON.stringify(allODTActivities, null, 2),
    'utf8'
  );

  fs.writeFileSync(
    path.join(OUTPUT_DATA_DIR, 'visual-riddles.json'),
    JSON.stringify(allVisualRiddles, null, 2),
    'utf8'
  );

  // 2. Write Obfuscated / Encrypted bundle for production security
  const encryptedPayload = {
    riddles: obfuscateData(JSON.stringify(allRiddles)),
    taboo: obfuscateData(JSON.stringify(allTabooCards)),
    odt: obfuscateData(JSON.stringify(allODTActivities)),
    visual: obfuscateData(JSON.stringify(allVisualRiddles)),
    checksum: allRiddles.length ^ allTabooCards.length ^ allODTActivities.length ^ allVisualRiddles.length
  };

  fs.writeFileSync(
    path.join(OUTPUT_DATA_DIR, 'encrypted-data.json'),
    JSON.stringify(encryptedPayload),
    'utf8'
  );

  console.log(`Successfully parsed, cleaned and encrypted:`);
  console.log(`  - ${allRiddles.length} riddles`);
  console.log(`  - ${allTabooCards.length} taboo cards`);
  console.log(`  - ${allODTActivities.length} ODT activities`);
  console.log(`  - ${allVisualRiddles.length} visual riddles`);
}

function parseODTActivities() {
  const filePath = path.join(CONTENT_DIR, 'odt_games_activities.md');
  if (!fs.existsSync(filePath)) return [];
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  let currentCat = '';
  let currentActivity = null;
  const activities = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('## ')) {
      currentCat = cleanHebrewText(line.replace(/^##\s+\d+[\.\)]\s*/, ''));
      continue;
    }
    const itemMatch = line.match(/^(\d+)\.\s+\*\*([^*]+)\*\*/);
    if (itemMatch) {
      if (currentActivity) activities.push(currentActivity);
      const num = itemMatch[1];
      currentActivity = {
        id: 'odt-' + num.padStart(2, '0'),
        title: cleanHebrewText(itemMatch[2]),
        category: currentCat,
        equipment: [],
        instructions: '',
        groupValue: '',
        groupSize: 'all',
        durationMinutes: 15,
        environment: 'open-field'
      };
      continue;
    }
    if (currentActivity) {
      if (line.includes('**ציוד:**')) {
        const eq = cleanHebrewText(line.replace(/^[*\s]*\*\*ציוד:\*\*\s*/, ''));
        currentActivity.equipment = [eq];
      } else if (line.includes('**הוראות:**')) {
        currentActivity.instructions = cleanHebrewText(line.replace(/^[*\s]*\*\*הוראות:\*\*\s*/, ''));
      } else if (line.includes('**ערך:**')) {
        currentActivity.groupValue = cleanHebrewText(line.replace(/^[*\s]*\*\*ערך:\*\*\s*/, ''));
      }
    }
  }
  if (currentActivity) activities.push(currentActivity);

  // Infer environment, duration, groupSize
  activities.forEach(act => {
    const text = (act.title + ' ' + act.instructions + ' ' + act.category).toLowerCase();
    if (text.includes('מים') || text.includes('נחל') || text.includes('מעיין') || text.includes('מעיינות')) {
      act.environment = 'water';
    } else if (text.includes('לילה') || text.includes('חושך') || text.includes('מדורה')) {
      act.environment = 'night';
    } else if (text.includes('שביל') || text.includes('הליכה') || text.includes('טור') || text.includes('trail')) {
      act.environment = 'trail';
    } else if (text.includes('עצים') || text.includes('חבלים') || text.includes('עיוורון') || text.includes('קורות')) {
      act.environment = 'camp';
    } else {
      act.environment = 'open-field';
    }

    if (text.includes('30 שניות') || text.includes('דקה') || text.includes('ספרינט') || text.includes('מהיר')) {
      act.durationMinutes = 5;
    } else if (text.includes('20 דקות') || text.includes('30 דקות') || text.includes('מבנה') || text.includes('רפסודה')) {
      act.durationMinutes = 25;
    } else {
      act.durationMinutes = 15;
    }

    if (text.includes('זוג') || text.includes('זוגות') || text.includes('שלשות')) {
      act.groupSize = 'small';
    } else if (text.includes('צוות של 4') || text.includes('צוות של 6') || text.includes('צוות של 8')) {
      act.groupSize = 'medium';
    } else if (text.includes('כל הקבוצה') || text.includes('מעגל') || text.includes('כולם')) {
      act.groupSize = 'all';
    } else {
      act.groupSize = 'large';
    }
  });

  return activities;
}

function parseVisualRiddles() {
  const filePath = path.join(CONTENT_DIR, 'visual_riddles_database.md');
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const blocks = content.split(/####\s+חידה\s+/).slice(1);
  const riddles = [];

  const holidayMap = {
    'ראש השנה': 'rosh-hashana',
    'יום כיפור': 'yom-kippur',
    'סוכות': 'sukkot',
    'חנוכה': 'chanukah',
    'טו בשבט': 'tu-bishvat',
    'ט"ו בשבט': 'tu-bishvat',
    'פורים': 'purim',
    'פסח': 'pesach',
    'יום העצמאות': 'independence-day',
    'יום הזיכרון': 'independence-day',
    'ל"ג בעומר': 'lag-baomer',
    'לג בעומר': 'lag-baomer',
    'יום ירושלים': 'jerusalem-day',
    'שבועות': 'shavuot'
  };

  blocks.forEach(b => {
    const lines = b.trim().split('\n');
    const titleLine = lines[0];
    const title = cleanHebrewText(titleLine.split(':')[1] || titleLine);

    const idMatch = b.match(/\*\*מזהה \(ID\):\*\*\s*`([^`]+)`/);
    const id = idMatch ? idMatch[1].trim() : '';

    const catLine = b.match(/\*\*קטגוריה ראשית:\*\*\s*([^\n]+)/);
    let mainCategory = 'general';
    let holidayTag = undefined;
    let generalTag = undefined;
    let difficulty = 'medium';

    if (catLine) {
      const catText = catLine[1];
      if (catText.includes('חגי ישראל')) {
        mainCategory = 'holidays';
      } else if (catText.includes('אתרים') || catText.includes('מקומות')) {
        mainCategory = 'geography';
      } else {
        mainCategory = 'general';
      }

      for (const [name, slug] of Object.entries(holidayMap)) {
        if (catText.includes(name)) {
          holidayTag = slug;
          break;
        }
      }

      const tagMatch = catText.match(/\*\*תגית:\*\*\s*([^|]+)/);
      if (tagMatch) {
        generalTag = cleanHebrewText(tagMatch[1]);
      }

      if (catText.includes('קל')) difficulty = 'easy';
      else if (catText.includes('קשה') || catText.includes('מאתגר')) difficulty = 'hard';
      else difficulty = 'medium';
    }

    const rebusMatch = b.match(/\*\*נוסחת הרבוס:\*\*\s*([^\n]+)/);
    const rebusFormulaDescription = rebusMatch ? cleanHebrewText(rebusMatch[1]) : '';

    const hintMatch = b.match(/\*\*רמז:\*\*\s*([^\n]+)/);
    const hints = hintMatch ? [cleanHebrewText(hintMatch[1])] : [];

    const ansMatch = b.match(/\*\*פתרון:\*\*\s*([^\n]+)/);
    const answer = ansMatch ? cleanHebrewText(ansMatch[1]) : '';

    const expMatch = b.match(/\*\*הסבר חזותי:\*\*\s*([^\n]+)/);
    const explanation = expMatch ? cleanHebrewText(expMatch[1]) : rebusFormulaDescription;

    if (id && title && answer) {
      riddles.push({
        id,
        title,
        mainCategory,
        holidayTag,
        generalTag,
        difficulty,
        imageUrl: '/assets/visual_riddles/' + id + '.svg?v=clean2',
        rebusFormulaDescription,
        hints,
        answer,
        explanation
      });
    }
  });

  return riddles;
}


parseMarkdownFiles();
