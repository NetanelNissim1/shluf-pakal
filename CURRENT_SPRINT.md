# שלוף פק"ל — סטטוס ספרינט נוכחי (CURRENT_SPRINT)

**עדכון אחרון:** 05 באוקטובר 2026 | **גרסה:** Production Ready (Enhanced UX)  
**ענף פעיל:** `main` | **סטטוס אינטגרציה:** עבר בהצלחה (225/225 בדיקות + 8/8 מבחני סייבר)  
**כתובת האתר:** [shluf-pakal.org](https://shluf-pakal.org) | **מאגר גיטהאב:** [NetanelNissim1/shluf-pakal](https://github.com/NetanelNissim1/shluf-pakal)

---

## 🎯 מטרות ויעדי הספרינט שהושלמו

במהלך הספרינטים האחרונים הפרויקט עבר שדרוג תשתיתי, ארכיטקטוני, עיצובי ואבטחתי רחב היקף, שהפך את **שלוף פק"ל** לאפליקציית שטח מקצועית, עמידה, מאובטחת ואינטואיטיבית:

1. **אימוץ העיצוב המשודרג (Enhanced UX) כסטנדרט קבוע ובלעדי:**
   - ביטול מלא של מתגי המעבר לעיצוב הקלאסי מכלל המסכים (סרגל Header, מגירת FeedbackDrawer, ודף הבית).
   - קיבוע כלל שדרוגי המשחקים וההפעלות כברירת מחדל אחידה וקבועה.
   - ניקוי מלא של תגיות גרסה מלאכותיות (כגון `2.0 ✨`) לטובת מראה נקי ומקצועי.

2. **סדר שאלות אקראי ייחודי לכל מכשיר (Device-Based Seeded Randomization):**
   - פיתוח מנוע אקראיות דטרמיניסטי מבוסס Seed (`Mulberry32 PRNG` + `Fisher-Yates Shuffle`) ב-[`src/lib/random.ts`](file:///c:/projects/shluf-pakal/src/lib/random.ts).
   - כל מכשיר מקבל רצף שאלות ייחודי בתוך כל נושא ותת-קטגוריה (טאבו, נכון/לא נכון, חידות בציורים, הוא-והיא וקטגוריות תוכן).
   - החרגה מתודולוגית מובנית לפעילויות ODT – נשמרות בסדרן הפדגוגי המקורי.
   - יציבות סשן מלאה (ריענון עמוד או כיבוי מסך בשטח שומרים על מיקום המדריך ללא קפיצות).
   - שליטה מלאה למדריך דרך מגירת ההגדרות: כפתור ערבוב מחדש (Reshuffle) ומתג חזרה לסדר הנושאי המקורי.

3. **שדרוגי חוויית שטח בכל 4 מנועי המשחקים:**
   - **טאבו שטח (100 כרטיסים):** מסך הסתרה וזינוק (Curtain Overlay) אטום מונע הצצות לפני תחילת הסיבוב, השתקת צלילים מהירה, מיקרו-טיפים להפעלה וקיצורי מקלדת.
   - **משחק נכון / לא נכון (152 טענות):** סרגל התקדמות עליון מונפש (אחוזים ושאלה X מתוך Y), טיפים דינמיים להפעלה בשטח (הליכה בטור מול מעגל פסילות), כפתור ענק נגיש לאגודל "לשאלה הבאה", ומשוב ויזואלי אדפטיבי מעצים.
   - **חידות בציורים ורבוסים (154 איורים):** כיווניות עברית טבעית (RTL מימין לשמאל ללא רמזים מלאכותיים), הגנה מלאה מספוילרים בכרטיסיות ובמצב מקרן, כפתור "הפעל במעגל ▶️" להזנקת מצגת ישירה, ותגיות alt ניטרליות.
   - **חידות "הוא והיא" (205 הגדרות):** כרטיסיית הדרכה פותחת להנחיית המשחק במעגל, תצוגת כרטיסיות שטח אינטגרליות וזורמות, ללא מודאלים קופצים.

4. **אבטחת מידע, סייבר ועמידה בתקנים מחמירים (Enterprise Hardening A+):**
   - הצפנת מאגרי התוכן ב-Build באמצעות UTF-8 Byte XOR Cipher – אפס דליפות תוכן כטקסט פתוח ב-Bundle.
   - הגנת Anti-Scraping ונעילת סביבת פיתוח: חסימת קליק ימני, חסימת סימון טקסט, גרירה, וקיצורי דרך (`F12`, `Ctrl+Shift+I`, `Ctrl+U`, `Ctrl+S`).
   - חסינות מוחלטת מ-DOM XSS: אפס שימוש ב-`innerHTML` וב-`dangerouslySetInnerHTML`, אפס `eval()`, ואימות סטטי ממוחשב.
   - כותרות אבטחה מחמירות ב-[`vercel.json`](file:///c:/projects/shluf-pakal/vercel.json) וב-[`index.html`](file:///c:/projects/shluf-pakal/index.html): CSP קפדני (`default-src 'self'`, `object-src 'none'`, `base-uri 'self'`), HSTS לשנתיים עם Preload, COOP, CORP.
   - הגנת דוא"ל ומשוב: מנגנון Rate Limiting מקומי (מקסימום 3 שליחות ב-15 דקות), מלכודת בוטים בלתי-נראית (Honeypot), סניטיזציית תווי בקרה (Unicode/Control chars), וטלמטריית מכשיר שקופה (Client ID).

5. **סיור קליטה מודרך אחוד (Unified Onboarding Tour):**
   - איחוד מסלול ההדרכה לכדי 8 תחנות שטח ממוקדות: משחקי שטח, חידות בציורים, כפתור שלוף מהיר, מצבי שטח, פק"ל אישי, גודל טקסט, מצב מדורה AMOLED, והגדרות שטח/ערבוב.
   - דגש מלא בכל ההסברים על פעולה חלקה 100% אופליין ללא צורך באינטרנט.

---

## 📊 סטטוס נוכחי ומדדי איכות (Metrics & Health)

| תחום | סטטוס | פירוט |
| :--- | :---: | :--- |
| **קומפילציית TypeScript** | ✅ עבר בהצלחה | `tsc --noEmit` ללא שום שגיאה או אזהרה |
| **חבילת בדיקות האפליקציה** | ✅ 225/225 עברו (100%) | [`scripts/verify-app.cjs`](file:///c:/projects/shluf-pakal/scripts/verify-app.cjs) — 36 מחזורי אימות שלמים |
| **חבילת בדיקות סייבר ואבטחה** | ✅ 8/8 עברו (100%) | [`scripts/verify-security.cjs`](file:///c:/projects/shluf-pakal/scripts/verify-security.cjs) — בדיקות תקן מחמירות |
| **בניית Production PWA** | ✅ עבר בהצלחה | `vite build` — יצירת Manifest, Service Worker ו-Precache מלא |
| **סך פעילויות ותוכן** | 📚 2,525 פריטים | 1,813 חידות + 152 נכון/לא נכון + 205 הוא והיא + 101 ODT + 154 ציורים + 100 טאבו |
| **הגנת אופליין (PWA)** | ⚡ 100% Offline-First | עבודה מלאה וחלקה ללא רשת, במצב טיסה או בעומק שטח |
| **ניהול גרסאות (Git)** | 🟢 מעודכן ומסונכרן | Commit `69af1f7` נדחף ל-`origin/main` |

---

## 🗂️ פירוט רכיבים וקבצים מרכזיים שטופלו

1. **ממשק משתמש ורכיבים:**
   - [`src/components/layout/Header.tsx`](file:///c:/projects/shluf-pakal/src/components/layout/Header.tsx): סרגל עליון נקי מכפתור מעבר עיצוב, מותאם מסכי סמארטפון צרים (360px-390px) ו-Dynamic Island / Notch.
   - [`src/components/common/FeedbackDrawer.tsx`](file:///c:/projects/shluf-pakal/src/components/common/FeedbackDrawer.tsx): מגירת הגדרות ומשוב נקייה עם בקר סדר שאלות אקראי למכשיר.
   - [`src/pages/HomePage.tsx`](file:///c:/projects/shluf-pakal/src/pages/HomePage.tsx): דף בית נקי מבאנרים וכפתורי חזרה לקלאסי, כרטיסיות משחקים משודרגות ללא תגיות גרסה.
   - [`src/components/taboo/TabooGame.tsx`](file:///c:/projects/shluf-pakal/src/components/taboo/TabooGame.tsx): טאבו שטח עם מסך זינוק והסתרה, השתקה מהירה ומיקרו-טיפים קבועים.
   - [`src/pages/TrueFalsePage.tsx`](file:///c:/projects/shluf-pakal/src/pages/TrueFalsePage.tsx): משחק נכון/לא נכון עם סרגל התקדמות, טיפים, לחצן אגודל ענק וקיצורי מקלדת קבועים.
   - [`src/pages/VisualRiddlesPage.tsx`](file:///c:/projects/shluf-pakal/src/pages/VisualRiddlesPage.tsx): חידות בציורים עם כפתור הזנקת מצגת במעגל, מבנה RTL טבעי והגנת ספוילרים.
   - [`src/pages/CategoryPage.tsx`](file:///c:/projects/shluf-pakal/src/pages/CategoryPage.tsx): קטגוריות תוכן והדרכת הוא-והיא פעילה קבוע.
   - [`src/components/common/OnboardingTour.tsx`](file:///c:/projects/shluf-pakal/src/components/common/OnboardingTour.tsx): סיור הדרכה אחוד בן 8 תחנות.
   - [`src/components/randomizer/RandomizerModal.tsx`](file:///c:/projects/shluf-pakal/src/components/randomizer/RandomizerModal.tsx): מודאל שליפה מהירה נקי מתנאי UX Mode.

2. **ניהול מצב וטיפוסים:**
   - [`src/store/usePakalStore.ts`](file:///c:/projects/shluf-pakal/src/store/usePakalStore.ts): הוסרו `uxMode`, `setUxMode`, `toggleUxMode`. שמירה על `deviceShuffleSeed` ו-`randomOrderEnabled`.
   - [`src/types/index.ts`](file:///c:/projects/shluf-pakal/src/types/index.ts): הוסר טיפוס ה-`UxMode`.

3. **אימות ובדיקות איכות:**
   - [`scripts/verify-app.cjs`](file:///c:/projects/shluf-pakal/scripts/verify-app.cjs): עודכנו מחזורים 33, 34, 35 לאימות קיבוע העיצוב המשודרג, הסרת המתגים, ואימות שלמות כלל התחנות והתכונות (225 בדיקות).
   - [`scripts/verify-security.cjs`](file:///c:/projects/shluf-pakal/scripts/verify-security.cjs): 8 בדיקות סייבר מחמירות ברמת Enterprise.

4. **תיעוד והסברה:**
   - [`README.md`](file:///c:/projects/shluf-pakal/README.md): עודכנו תגי הסטטוס (ממשק משודרג וקבוע, 225 בדיקות), עודכן סעיף 15, ונשמרה גלריית תמונות ההשוואה בליווי הסבר ברור על אימוץ העיצוב החדש כסטנדרט רשמי וקבוע.

---

## 🚀 משימות המשך מומלצות לספרינט הבא (Backlog & Next Steps)

1. **משוב משתמשים ראשוני מהשטח (Field Feedback Collection):**
   - איסוף תובנות ממדריכים פעילים באמצעות מערכת המשוב המובנית על סדר השאלות האקראי וזמני הטיימר במשחקים.
2. **אופטימיזציית גודל חבילת ה-PWA (Bundle Splitting):**
   - פיצול דינמי (`dynamic import()`) לקטגוריות תוכן כבדות ולמודול ה-ODT כדי להקטין את גודל הטעינה הראשונית עוד יותר (מתחת ל-500kB ל-chunk).
3. **תוספות תוכן עתידיות:**
   - העשרת חידות ייעודיות לעונות השנה (סתיו/חורף) ואירועי לילה בשטח לפי דרישה.
