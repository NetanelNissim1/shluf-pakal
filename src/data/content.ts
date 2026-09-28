import { deobfuscateData } from '../lib/security';
import encryptedPayload from './encrypted-data.json';
import { RiddleItem, TabooCard, ODTActivity, VisualRiddle } from '../types';

// In-memory decrypted content secured against plain text bundle inspection
export const riddlesData: RiddleItem[] = deobfuscateData<RiddleItem[]>(encryptedPayload.riddles);
export const tabooData: TabooCard[] = deobfuscateData<TabooCard[]>(encryptedPayload.taboo);
export const odtData: ODTActivity[] = encryptedPayload.odt ? deobfuscateData<ODTActivity[]>(encryptedPayload.odt) : [];
export const visualData: VisualRiddle[] = encryptedPayload.visual ? deobfuscateData<VisualRiddle[]>(encryptedPayload.visual) : [];
