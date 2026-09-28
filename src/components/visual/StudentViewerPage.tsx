import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ZoomIn, ZoomOut, RotateCcw, Compass, ArrowRight, EyeOff } from 'lucide-react';
import { visualData } from '../../data/content';
import { VisualRiddle } from '../../types';

interface StudentViewerPageProps {
  riddleId?: string;
  onExitStudentMode?: () => void;
}

export const StudentViewerPage: React.FC<StudentViewerPageProps> = ({ 
  riddleId,
  onExitStudentMode 
}) => {
  const allVisual = visualData as VisualRiddle[];
  
  // Find current riddle or fallback
  const currentRiddle = allVisual.find(r => r.id === riddleId) || allVisual[0];

  const handleExitClick = () => {
    if (!onExitStudentMode) return;
    if (window.confirm('האם לעבור למצב מדריך מלא? (יוצגו פתרונות וכל מאגרי הפק"ל)')) {
      onExitStudentMode();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000000] text-white flex flex-col select-none overflow-hidden">
      
      {/* Top Bar for Student */}
      <header className="h-14 px-4 bg-stone-950/90 border-b border-stone-800 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm">
            🎨
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white leading-tight">
              {currentRiddle.title}
            </h1>
            <div className="flex items-center gap-1 text-[11px] text-stone-400">
              <EyeOff className="w-3 h-3 text-emerald-400" />
              <span>תצוגת חניך שטח (ללא פתרונות)</span>
            </div>
          </div>
        </div>

        {onExitStudentMode && (
          <button
            onClick={handleExitClick}
            className="text-xs font-bold text-stone-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-stone-800 hover:bg-stone-900 transition-colors"
          >
            חזרה למדריך
          </button>
        )}
      </header>

      {/* Main Pinch-to-Zoom Pan Canvas */}
      <main className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center bg-black">
        <TransformWrapper
          initialScale={1}
          minScale={0.8}
          maxScale={6}
          centerOnInit
          wheel={{ step: 0.15 }}
          pinch={{ step: 5 }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              {/* Zoom Controls floating bottom */}
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-stone-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-stone-800 shadow-xl">
                <button
                  onClick={() => zoomIn()}
                  aria-label="הגדל"
                  className="p-2 rounded-xl text-stone-200 hover:bg-stone-800 active:scale-95 transition-all"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button
                  onClick={() => zoomOut()}
                  aria-label="הקטן"
                  className="p-2 rounded-xl text-stone-200 hover:bg-stone-800 active:scale-95 transition-all"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button
                  onClick={() => resetTransform()}
                  aria-label="איפוס זום"
                  className="p-2 rounded-xl text-stone-200 hover:bg-stone-800 active:scale-95 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Pan Canvas with high-res SVG */}
              <TransformComponent
                wrapperClass="!w-full !h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                contentClass="!w-full !h-full flex items-center justify-center p-2 sm:p-6"
              >
                <img
                  src={currentRiddle.imageUrl}
                  alt={currentRiddle.title}
                  className="max-w-full max-h-[85vh] object-contain drop-shadow-2xl select-none pointer-events-none"
                  draggable={false}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </main>

      {/* Helpful Hint Footer for Students */}
      <footer className="h-10 px-4 bg-stone-950/90 border-t border-stone-900 flex items-center justify-center text-[11px] text-stone-500 shrink-0">
        <span>🔍 השתמש בשתי אצבעות להגדלה וגרירה כדי לחקור את פרטי הציור</span>
      </footer>

    </div>
  );
};
