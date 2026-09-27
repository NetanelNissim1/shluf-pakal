import React, { useState } from 'react';
import { 
  Star, 
  Share2, 
  Copy, 
  Trash2, 
  Check, 
  Eye, 
  EyeOff, 
  Compass,
  MessageCircle
} from 'lucide-react';
import { riddlesData } from '../data/content';
import { RiddleItem } from '../types';
import { RiddleCard } from '../components/riddles/RiddleCard';
import { usePakalStore } from '../store/usePakalStore';
import { formatPakalForWhatsApp, shareContent, copyToClipboard } from '../lib/share';

interface MyPakalPageProps {
  onExploreClick: () => void;
}

export const MyPakalPage: React.FC<MyPakalPageProps> = ({ onExploreClick }) => {
  const { 
    themeMode, 
    favorites, 
    clearFavorites, 
    revealedMap, 
    revealAll, 
    hideAll 
  } = usePakalStore();

  const isCampfire = themeMode === 'campfire';
  const allRiddles = riddlesData as RiddleItem[];

  const [copied, setCopied] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Retrieve favorited riddles
  const savedRiddles = allRiddles.filter((r) => favorites.includes(r.id));
  const savedIds = savedRiddles.map((r) => r.id);
  const allRevealed = savedIds.length > 0 && savedIds.every((id) => !!revealedMap[id]);

  const handleShareToWhatsApp = async () => {
    const text = formatPakalForWhatsApp(savedRiddles);
    const shared = await shareContent('הפק"ל שלי - אפליקציית שלוף', text);
    if (shared) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCopyAll = async () => {
    const text = formatPakalForWhatsApp(savedRiddles);
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleToggleReveal = () => {
    if (allRevealed) {
      hideAll();
    } else {
      revealAll(savedIds);
    }
  };

  return (
    <div className="space-y-4 pb-24">
      
      {/* Page Header */}
      <div className={`p-4.5 rounded-2xl border transition-all ${
        isCampfire 
          ? 'bg-campfire-card border-campfire-border/90 text-orange-100 shadow-fire' 
          : 'bg-white border-amber-200/90 text-stone-900 shadow-field'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-xl ${
              isCampfire ? 'bg-orange-950 text-orange-400' : 'bg-amber-100 text-amber-800'
            }`}>
              <Star className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">הפק"ל שלי</h2>
              <p className="text-xs text-stone-400">
                {savedRiddles.length} חידות ופעילויות שנשמרו לטיול
              </p>
            </div>
          </div>

          <span className={`text-xs font-black px-2.5 py-1 rounded-xl border ${
            isCampfire
              ? 'bg-stone-950 text-orange-400 border-stone-800'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            נשמר אופליין
          </span>
        </div>

        {/* WhatsApp & Share Actions */}
        {savedRiddles.length > 0 && (
          <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2 flex-wrap">
            <button
              onClick={handleShareToWhatsApp}
              className="flex-1 min-w-[130px] py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20 transition-all touch-press"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>הועתק בהצלחה!</span>
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4" />
                  <span>שלח לוואטסאפ</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyAll}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all touch-press ${
                isCampfire
                  ? 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800'
                  : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Copy className="w-4 h-4" />
              <span>העתק טקסט</span>
            </button>

            {showConfirmClear ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    clearFavorites();
                    setShowConfirmClear(false);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-red-600 text-white font-bold text-xs"
                >
                  בטוח? מחק
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="py-2.5 px-2 rounded-xl text-stone-400 hover:text-stone-600 text-xs"
                >
                  ביטול
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmClear(true)}
                title="נקה את כל הפק&quot;ל"
                className="p-2.5 rounded-xl text-stone-400 hover:text-red-500 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Empty State */}
      {savedRiddles.length === 0 ? (
        <div className={`p-8 text-center rounded-3xl border ${
          isCampfire ? 'bg-campfire-card border-campfire-border/80' : 'bg-white border-amber-200/90 shadow-sm'
        }`}>
          <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center bg-amber-500/10 text-amber-600 dark:text-orange-400">
            <Star className="w-8 h-8 stroke-[1.8]" />
          </div>
          <h3 className="text-lg font-extrabold mb-1">הפק"ל שלך עדיין ריק</h3>
          <p className="text-xs text-stone-400 max-w-xs mx-auto mb-5 leading-relaxed">
            טייל בין החידות והמשחקים באפליקציה, ולחץ על סמל הכוכב (★) בכל שאלה שתרצה לשמור לטיול הבא שלך.
          </p>
          <button
            onClick={onExploreClick}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all touch-press inline-flex items-center gap-1.5 ${
              isCampfire
                ? 'bg-orange-600 hover:bg-orange-500 text-white'
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/20'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>סייר בחידות עכשיו</span>
          </button>
        </div>
      ) : (
        /* Saved List */
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-stone-400">
              רשימת החידות שנבחרו:
            </span>
            <button
              onClick={handleToggleReveal}
              className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                isCampfire 
                  ? 'border-campfire-border bg-stone-900 text-orange-300' 
                  : 'border-amber-200 bg-white text-stone-700 shadow-sm'
              }`}
            >
              {allRevealed ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>הסתר פתרונות</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-amber-500" />
                  <span>חשוף הכל</span>
                </>
              )}
            </button>
          </div>

          {savedRiddles.map((riddle, index) => (
            <RiddleCard key={riddle.id} riddle={riddle} index={index} />
          ))}
        </div>
      )}

    </div>
  );
};
