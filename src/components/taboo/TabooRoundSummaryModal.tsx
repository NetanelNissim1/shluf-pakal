import React from 'react';
import { Trophy, Award, FastForward, RotateCcw, ArrowRightLeft, Sparkles } from 'lucide-react';
import { usePakalStore } from '../../store/usePakalStore';

interface TabooRoundSummaryModalProps {
  isOpen: boolean;
  roundScore: { correct: number; skipped: number };
  isTeamMode: boolean;
  activeTeam: 'A' | 'B';
  teamScores: { teamA: number; teamB: number };
  onStartNextRound: () => void;
  onResetGame: () => void;
}

export const TabooRoundSummaryModal: React.FC<TabooRoundSummaryModalProps> = ({
  isOpen,
  roundScore,
  isTeamMode,
  activeTeam,
  teamScores,
  onStartNextRound,
  onResetGame
}) => {
  const { themeMode } = usePakalStore();
  const isCampfire = themeMode === 'campfire';

  if (!isOpen) return null;

  const currentTeamName = activeTeam === 'A' ? "קבוצה א'" : "קבוצה ב'";
  const nextTeamName = activeTeam === 'A' ? "קבוצה ב'" : "קבוצה א'";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className={`relative w-full max-w-md rounded-3xl border-2 p-6 shadow-2xl z-10 flex flex-col overflow-hidden transition-all text-center ${
          isCampfire 
            ? 'bg-stone-950 border-orange-600/70 text-stone-100 shadow-orange-950/80' 
            : 'bg-white border-amber-300 text-stone-900 shadow-2xl'
        }`}
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="taboo-summary-title"
      >
        {/* Animated Trophy Header */}
        <div className="inline-flex mx-auto p-4 rounded-full bg-amber-500/20 text-amber-500 mb-3 animate-bounce">
          <Trophy className="w-10 h-10" />
        </div>

        <h2 id="taboo-summary-title" className="text-2xl font-black tracking-tight mb-1">
          ⏱️ הזמן נגמר!
        </h2>
        
        {isTeamMode ? (
          <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-4">
            סיום הסיבוב של {currentTeamName}
          </p>
        ) : (
          <p className="text-xs text-stone-400 mb-4">
            כל הכבוד על הסיבוב! הנה התוצאות:
          </p>
        )}

        {/* Round Performance Breakdown */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className={`p-4 rounded-2xl border text-center ${
            isCampfire ? 'bg-emerald-950/40 border-emerald-900/60' : 'bg-emerald-50 border-emerald-200'
          }`}>
            <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-1">
              <Award className="w-4 h-4" />
              <span>הצלחות בסיבוב</span>
            </div>
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              +{roundScore.correct}
            </span>
          </div>

          <div className={`p-4 rounded-2xl border text-center ${
            isCampfire ? 'bg-stone-900/60 border-stone-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <div className="flex items-center justify-center gap-1.5 text-stone-400 text-xs font-bold mb-1">
              <FastForward className="w-4 h-4" />
              <span>דילוגים / פסילות</span>
            </div>
            <span className="text-3xl font-black text-stone-400">
              {roundScore.skipped}
            </span>
          </div>
        </div>

        {/* Team Leaderboard Standings if Team Mode is active */}
        {isTeamMode && (
          <div className={`p-4 rounded-2xl border mb-5 ${
            isCampfire ? 'bg-stone-900/90 border-stone-800' : 'bg-amber-50/70 border-amber-200'
          }`}>
            <div className="text-xs font-extrabold text-stone-400 mb-2 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>לוח תוצאות מצטבר:</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm font-black">
              <div className={`p-2.5 rounded-xl border ${
                activeTeam === 'A' 
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                  : 'border-stone-200 dark:border-stone-800 opacity-80'
              }`}>
                <div>קבוצה א'</div>
                <div className="text-2xl mt-0.5">{teamScores.teamA} נק'</div>
              </div>

              <div className={`p-2.5 rounded-xl border ${
                activeTeam === 'B' 
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                  : 'border-stone-200 dark:border-stone-800 opacity-80'
              }`}>
                <div>קבוצה ב'</div>
                <div className="text-2xl mt-0.5">{teamScores.teamB} נק'</div>
              </div>
            </div>

            <div className="mt-3 text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center justify-center gap-1.5 bg-amber-500/10 py-1.5 px-2 rounded-xl">
              <ArrowRightLeft className="w-4 h-4" />
              <span>תור {nextTeamName}! העבירו את הטלפון למסביר הבא</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onStartNextRound}
            className={`w-full py-3.5 px-4 rounded-2xl font-black text-base shadow-lg transition-all flex items-center justify-center gap-2 touch-press ${
              isCampfire
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-orange-950/50 hover:brightness-110'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-400/50 hover:brightness-105'
            }`}
          >
            <span>{isTeamMode ? `התחל סיבוב של ${nextTeamName} 🚀` : 'התחל סיבוב חדש 🚀'}</span>
          </button>

          <button
            onClick={onResetGame}
            className="w-full py-2.5 text-xs font-bold text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors inline-flex items-center justify-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>איפוס וסיום המשחק</span>
          </button>
        </div>

      </div>
    </div>
  );
};
