# אפיון טכני וארכיטקטורת פיתוח: "שלוף" (Shluf)

**פלטפורמת תוכן והפעלות שטח למדריכים – מותאמת מובייל (Mobile-First PWA)**

---

## 1. הגדרות פרויקט ושמות רשמיים (Project Metadata)

* **שם המוצר בעברית:** שלוף
* **שם הפרויקט באנגלית (Folder & Git Repository):** `shluf-app` (או לחלופין: `shluf-pakal`)
* **תיקיית קובצי התוכן (Markdown Content Directory):** `content/` או `data/content/`
* **ייעוד:** אפליקציית ווב מתקדמת (PWA) למדריכי טיולים, תנועות נוער, מורים ומפקדים, המאפשרת שליפה מיידית (פחות מ-2 שניות) של חידות, משחקים, סיפורים והפעלות בעת שהייה בשטח, בנסיעה באוטובוס או מסביב למדורה.
* **עקרון ליבה טכנולוגי:** **Offline-First & Frictionless UX**. האפליקציה חייבת לעבוד באופן מלא וללא שגיאות גם במצב טיסה או באזורים נטולי קליטה סלולרית לחלוטין.

---

## 2. מבנה תיקיות הפרויקט ושילוב 5 קובצי ה-Markdown

כל חמשת קובצי ה-Markdown של התוכן מוזנים ישירות לתוך תיקיית הפרויקט, ומודל ה-AI / קוד הפיתוח יקרא אותם ישירות בזמן build או runtime:

```text
shluf-app/
├── content/                         # 5 קובצי התוכן המלאים של הפרויקט
│   ├── word_chains_riddles.md       # 1. שרשראות מילים, אותיות ותחיליות (פיל, חל, גל...)
│   ├── nature_and_animals.md        # 2. טבע, בעלי חיים, בוטניקה ופירות/ירקות
│   ├── israel_history_places.md     # 3. ארץ ישראל, היסטוריה, ערים וחוצה ישראל
│   ├── language_and_logic.md        # 4. היגיון, חידודי לשון, כפל משמעות, הפכים ודו"צ
│   └── culture_and_songs.md         # 5. שירים ישראליים, מפורסמים, אנגלית וטאבו
├── src/
│   ├── components/                  # RiddleCard, FilterBar, Randomizer, TabooGame
│   ├── lib/
│   │   └── markdownParser.ts        # מודול קריאה ופרסור של קובצי ה-MD למבנה נתונים
│   ├── types/                       # הגדרות Typescript
│   └── app/ (או pages/)             # מסכי האפליקציה מותאמי המובייל
├── public/
│   ├── manifest.json                # הגדרות PWA להתקנה בסמארטפון
│   └── sw.js                        # Service Worker לאחסון ופעילות אופליין מלאה
├── package.json
└── README.md
```

### 2.1 הנחיות פרסור (Markdown Ingestion Pipeline)
המודל המפתח או הסקריפט יבצע פרסור אוטומטי של קובצי ה-`.md`:
1. חלוקה לפי כותרות רמה 2 (`##`) לקטגוריות ראשיות ותתי-נושאים.
2. זיהוי שאלות מקור ושאלות מורחבות (לפי מבנה תבליטים ומספור).
3. חילוץ התשובה מתוך הסוגריים בסוף השאלה `(...)` והפרדתה לשדה `answer` נפרד, כדי לאפשר מנגנון הסתרה وحשיפה בלחיצה.

---

## 3. דרישות ממשק וחוויית משתמש שטח (Field-Ready Mobile UX/UI)

### 3.1 תנאי סביבה פיזיים
1. **שימוש ביד אחת (One-Handed Usability):** כל הכפתורים הקריטיים ממוקמים ב-Bottom Bar (אזור האגודל).
2. **קריאות תחת שמש ישירה (High Contrast Outdoor Mode):**
   * שימוש בניגודיות חזקה (טקסט שחור כהה `#111827` על רקע לבן `#FFFFFF` או צהוב-מדברי עדין `#FEF3C7`).
   * גופנים קריאים ומרווחים (מינימום `18px` לתוכן השאלה).
3. **מצב מדורה / לילה (Campfire Night Mode):**
   * תמיכה במצב כהה עם גווני אדום/כתום עמוקים (Amoled Black `#000000` עם טקסט בורדו/כתום) למניעת סינוור החניכים והריסת ראיית הלילה.

### 3.2 מנגנון "הסתרת תשובות נגד הצצות" (Anti-Peeking Mechanism)
* **ברירת מחדל:** שאלות מוצגות ללא פתרון גלוי.
* **חשיפה (Reveal):**
  * לחיצה על כרטיסייה (Tap to Reveal) פותחת את התשובה באנימציה חלקה (Accordion / Flip Card).
  * אפשרות ללחיצה ארוכה (Press & Hold) להצצה זמנית בפתרון.
  * כפתור מהיר "הסתר הכל" / "חשוף הכל" בראש העמוד.

### 3.3 כפתור הפלא: "שלוף לי!" (The Randomizer FAB)
* כפתור צף קבוע בתחתית המסך (Floating Action Button):
  * לחיצה עליו שולפת מיידית שאלה או משחק אקראי מתוך כל המאגר או מתוך הקטגוריה הפעילה.
  * מלווה ברטט קל (Haptic Feedback `navigator.vibrate(50)`) בעת שליפה.

---

## 4. מודל הנתונים לאחר פרסור (Data Schema)

```typescript
export type CategoryId = 
  | 'word-chains'      // אותיות ותחיליות (מתוך word_chains_riddles.md)
  | 'nature-animals'   // טבע, חיות, צומח (מתוך nature_and_animals.md)
  | 'israel-history'   // ידיעת הארץ וערים (מתוך israel_history_places.md)
  | 'logic-language'   // היגיון ולשון (מתוך language_and_logic.md)
  | 'songs-culture'    // שירים, תרבות וטאבו (מתוך culture_and_songs.md)
  | 'games-activities' // משחקים והפעלות
  | 'stories';         // סיפורים וקטעי קריאה

export interface RiddleItem {
  id: string;
  sourceFile: string;  // שם קובץ ה-MD שממנו נשאבה החידה
  categoryId: CategoryId;
  subCategory: string; // למשל: "חידות פיל", "קפד ראשו", "חוצה ישראל"
  question: string;
  answer: string;
  hints?: string[];
  tags: string[];      // ['אוטובוס', 'הליכה', 'שבירת-קרח', 'קצר', 'ילדים']
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface TabooCard {
  id: string;
  targetWord: string;
  forbiddenWords: [string, string, string, string];
}
```

---

## 5. מסכי האפליקציה העיקריים (Screen Specifications)

### 5.1 מסך הבית (Home / Dashboard)
* **Header עליון:** לוגו "שלוף", חיווי מצב Offline, ומתג מצב שמש/מדורה.
* **חיפוש חכם (Instant Search):** סינון מהיר לפי טקסט חופשי (שאלה או תשובה).
* **פילטרים מהירים (Quick Situation Chips):**
  * `🚌 באוטובוס` | `🥾 תוך כדי הליכה` | `🔥 סביב המדורה` | `🧊 שבירת קרח` | `⭐ הפק"ל שלי`.
* **גריד קטגוריות ראשי:** גישה מיידית ל-5 הקטגוריות המקבילות לקובצי התוכן.
* **Bottom Bar:** כפתור "🎲 שלוף שאלה".

### 5.2 מסך קטגוריה ורשימת שאלות (Category & List View)
* סרגל גלילה אופקי לתתי-נושאים.
* כרטיסיות שאלות עם פתרון מוסתר שנחשף בלחיצה.
* לחצן כוכב (★) להוספה מיידית ל"פק"ל האישי".

### 5.3 מסך משחק טאבו שטח (Interactive Taboo Tool)
* מבוסס על כרטיסי הטאבו מקובץ התרבות:
  * תצוגת מסך מלא לקריאה ממרחק.
  * טיימר 60 שניות עגול עם צפצוף סיום.
  * החלקה ימינה/שמאלה להחלפת כרטיס.

### 5.4 מסך "הפק"ל שלי" (Personal Pakal)
* רשימת חידות ופעילויות שנשמרו מראש לטיול הספציפי.
* עבודה מלאה ללא רשת (Offline Cache).
* כפתור שיתוף מהיר (Share / Copy to WhatsApp).

---

## 6. מפרט טכנולוגי והנחיות מימוש למודל ה-AI

```text
[Recommended Stack]
Project Name:    shluf-app
Framework:       Next.js (App Router) או Vite + React
Styling:         Tailwind CSS + Lucide Icons
Content Source:  5 Markdown Files in /content
Offline/PWA:     Workbox / Serwist (Pre-cache static assets & parsed content)
State Store:     Zustand + LocalStorage
```

### דגשי פיתוח קריטיים:
1. **קריאת קובצי ה-MD:** יש לממש מנגנון פרסור שמייצר רשימת שאלות תקינה עם שדות `question` ו-`answer` נקיים ללא תגיות מיותרות.
2. **תמיכת RTL:** ממשק מלא בעברית, יישור מלא לימין ושימוש נכון ב-Tailwind RTL.
3. **ביצועים:** אפס השהייה במעבר בין שאלות וחיפוש מיידי בלוקאל ללא קריאות שרת בזמן אמת.