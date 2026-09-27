export type CategoryId = 
  | 'word-chains'      // אותיות ותחיליות (מתוך word_chains_riddles.md)
  | 'nature-animals'   // טבע, חיות, צומח (מתוך nature_and_animals.md)
  | 'israel-history'   // ידיעת הארץ וערים (מתוך israel_history_places.md)
  | 'logic-language'   // היגיון ולשון (מתוך language_and_logic.md)
  | 'songs-culture'    // שירים, תרבות וטאבו (מתוך culture_and_songs.md)
  | 'israeli-holidays' // חגי ומועדי ישראל (מתוך jewish_holidays.md)
  | 'games-activities' // משחקים והפעלות
  | 'stories';         // סיפורים וקטעי קריאה

export type SituationFilter = 'all' | 'holidays' | 'bus' | 'walking' | 'campfire' | 'icebreaker' | 'pakal';

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
