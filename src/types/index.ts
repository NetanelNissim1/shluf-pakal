export type CategoryId = 
  | 'word-chains'      // אותיות ותחיליות (מתוך word_chains_riddles.md)
  | 'nature-animals'   // טבע, חיות, צומח (מתוך nature_and_animals.md)
  | 'israel-history'   // ידיעת הארץ וערים (מתוך israel_history_places.md)
  | 'logic-language'   // היגיון ולשון (מתוך language_and_logic.md)
  | 'songs-culture'    // שירים, תרבות וטאבו (מתוך culture_and_songs.md)
  | 'israeli-holidays' // חגי ומועדי ישראל (מתוך jewish_holidays.md)
  | 'he-and-she'       // חידות ומשחק "הוא והיא" (מתוך he_and_she_riddles.md)
  | 'games-activities' // משחקים והפעלות
  | 'stories';         // סיפורים וקטעי קריאה

export interface HeSheRiddle {
  id: string;
  num: number;
  part: string;
  question: string;
  heAnswer: string;
  sheAnswer: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

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
export type TextSize = 'normal' | 'large' | 'huge';
export type UxMode = 'classic' | 'enhanced';

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
  | 'lag-baomer'
  | 'jerusalem-day'
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

// --- Feedback & Suggestions Module Types ---
export type FeedbackCategory = 'riddle-idea' | 'site-improvement' | 'bug-report' | 'general';

export interface FeedbackSubmission {
  name: string;
  message: string;
  category: FeedbackCategory;
  email?: string;
  organization?: string;
  currentScreen?: string;
  deviceInfo?: string;
  clientId?: string;
  clientTimestamp?: number;
  bot_trap?: string;
}

export interface StoredFeedbackItem extends FeedbackSubmission {
  id: string;
  createdAt: number;
}

// --- True or False Field Trivia Module Types ---
export interface TrueFalseItem {
  id: string;               // e.g. 'tf-001' ... 'tf-152'
  num: number;              // 1 ... 152
  category: 'regions' | 'holidays';
  subCategory: string;      // e.g. 'צפון הארץ (גולן, גליל, עמקים והכרמל)'
  subSlug: string;          // 'north' | 'center' | 'jerusalem' | 'south' | 'tishrei' | 'chanukah-tubishvat' | 'purim-pesach' | 'iyar-sivan'
  statement: string;
  isTrue: boolean;
  explanation: string;
  tags: string[];
}

