export type CategoryId = 
  | 'word-chains'      // אותיות ותחיליות (מתוך word_chains_riddles.md)
  | 'nature-animals'   // טבע, חיות, צומח (מתוך nature_and_animals.md)
  | 'israel-history'   // ידיעת הארץ וערים (מתוך israel_history_places.md)
  | 'logic-language'   // היגיון ולשון (מתוך language_and_logic.md)
  | 'songs-culture'    // שירים, תרבות וטאבו (מתוך culture_and_songs.md)
  | 'israeli-holidays' // חגי ומועדי ישראל (מתוך jewish_holidays.md)
  | 'games-activities' // משחקים והפעלות
  | 'stories';         // סיפורים וקטעי קריאה

export type SituationFilter = 'all' | 'odt' | 'visual' | 'holidays' | 'bus' | 'walking' | 'campfire' | 'icebreaker' | 'pakal';

export interface RiddleItem {
  id: string;
  sourceFile: string;
  categoryId: CategoryId;
  subCategory: string;
  question: string;
  answer: string;
  hints?: string[];
  tags: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface TabooCard {
  id: string;
  targetWord: string;
  forbiddenWords: [string, string, string, string];
}

export interface CategoryMeta {
  id: CategoryId;
  title: string;
  subtitle: string;
  iconName: string;
  color: string;
  accent: string;
  description: string;
}

export type ThemeMode = 'sun' | 'campfire';

// --- ODT Activities Module Types ---
export interface ODTActivity {
  id: string;              // לדוגמה: 'odt-01'
  title: string;           // שם המשחק: "מעגל הקימה (חבל מעגלי)"
  category: string;        // קטגוריית על: 'משחקי חבלים וטבעות'
  equipment: string[];     // ציוד: ['חבל עבה קשור במעגל סגור']
  instructions: string;    // פירוט ביצוע שלב-אחר-שלב
  groupValue: string;      // ערך/מיומנות: 'אמון הדדי, סינכרון ושיווי משקל'
  groupSize: 'small' | 'medium' | 'large' | 'all'; // גודל קבוצה
  durationMinutes?: number;// זמן מוערך בדקות
  environment: 'trail' | 'camp' | 'water' | 'night' | 'open-field'; // סביבת פעילות
}

// --- Visual Riddles Module Types ---
export type HolidayTag = 
  | 'rosh-hashana' 
  | 'yom-kippur' 
  | 'sukkot' 
  | 'chanukah' 
  | 'tu-bishvat' 
  | 'purim' 
  | 'pesach' 
  | 'independence-day' 
  | 'shavuot';

export type GeneralCategory = 
  | 'idioms-proverbs'  // פתגמים וביטויים
  | 'israel-places'    // מקומות וערים בארץ
  | 'nature-science';   // טבע, בעלי חיים ומדע

export interface VisualRiddle {
  id: string;                      // למשל: 'hol-01'
  title: string;                   // כותרת מנחה: "איזה חג וביטוי מסתתר?"
  mainCategory: 'holidays' | 'general' | 'geography';
  holidayTag?: HolidayTag;         // חג ספציפי אם רלוונטי
  generalTag?: string;             // תגית נושאית
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;                // נתיב לקובץ התמונה (SVG / WebP)
  rebusFormulaDescription: string; // תיאור הלוגיקה של הציור
  hints: string[];                 // רמזים מדורגים
  answer: string;                  // הפתרון המלא
  explanation: string;             // הסבר למה זה הפתרון ואיך פותרים
}
