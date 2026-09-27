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
          
          allRiddles.push({
            id: `riddle-${riddleCounter++}`,
            sourceFile: filename,
            categoryId: fileMeta.categoryId,
            subCategory: currentSubCategory || fileMeta.categoryName,
            question: questionText,
            answer: answerText,
            tags: tags,
            difficulty: (questionText.length > 50 || fileMeta.categoryId === 'logic-language') ? 'medium' : 'easy'
          });
        }
      }
    }
  }

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

  // 2. Write Obfuscated / Encrypted bundle for production security
  const encryptedPayload = {
    riddles: obfuscateData(JSON.stringify(allRiddles)),
    taboo: obfuscateData(JSON.stringify(allTabooCards)),
    checksum: allRiddles.length ^ allTabooCards.length
  };

  fs.writeFileSync(
    path.join(OUTPUT_DATA_DIR, 'encrypted-data.json'),
    JSON.stringify(encryptedPayload),
    'utf8'
  );

  console.log(`Successfully parsed, cleaned and encrypted ${allRiddles.length} riddles and ${allTabooCards.length} taboo cards!`);
}

parseMarkdownFiles();
