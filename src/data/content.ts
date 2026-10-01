import { deobfuscateData } from '../lib/security';
import encryptedPayload from './encrypted-data.json';
import { RiddleItem, TabooCard, ODTActivity, VisualRiddle, HeSheRiddle } from '../types';

// In-memory decrypted content secured against plain text bundle inspection
export const riddlesData: RiddleItem[] = deobfuscateData<RiddleItem[]>(encryptedPayload.riddles);
export const tabooData: TabooCard[] = deobfuscateData<TabooCard[]>(encryptedPayload.taboo);
export const odtData: ODTActivity[] = encryptedPayload.odt ? deobfuscateData<ODTActivity[]>(encryptedPayload.odt) : [];
export const visualData: VisualRiddle[] = encryptedPayload.visual ? deobfuscateData<VisualRiddle[]>(encryptedPayload.visual) : [];
export const hesheData: HeSheRiddle[] = encryptedPayload.heshe ? deobfuscateData<HeSheRiddle[]>(encryptedPayload.heshe) : [];

// Adapter: convert HeShe items to RiddleItem format for category listing, search, favorites and randomizer
export const hesheAsRiddles: RiddleItem[] = hesheData.map((h) => ({
  id: `riddle-${h.id}`,
  sourceFile: 'he_and_she_riddles.md',
  categoryId: 'he-and-she' as const,
  subCategory: h.part,
  question: h.question,
  answer: h.answer,
  tags: [...h.tags, 'הוא-והיא'],
  difficulty: h.difficulty,
}));

export const allCombinedRiddles: RiddleItem[] = [...riddlesData, ...hesheAsRiddles];
