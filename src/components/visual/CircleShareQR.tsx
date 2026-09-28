import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Users, Sparkles, QrCode, Share2, Download } from 'lucide-react';
import { VisualRiddle } from '../../types';
import { usePakalStore } from '../../store/usePakalStore';
import { copyToClipboard, formatVisualRiddleForWhatsApp, shareToWhatsApp, downloadVisualImage } from '../../lib/share';
import { triggerHaptic } from '../../lib/haptics';

interface CircleShareQRProps {
  riddle: VisualRiddle;
  onClose: () => void;
}

export const CircleShareQR: React.FC<CircleShareQRProps> = ({ riddle, onClose }) => {
  const { themeMode, hapticsEnabled } = usePakalStore();
  const isCampfire = themeMode === 'campfire';
  const [copied, setCopied] = useState(false);

  // Generate clean student view URL pointing directly to this riddle
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const shareUrl = `${currentOrigin}${currentPath}?mode=student&riddle=${riddle.id}`;

  const handleCopyLink = async () => {
    if (hapticsEnabled) triggerHaptic(25);
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-sm rounded-3xl border-2 p-6 shadow-2xl relative text-center transition-all ${
        isCampfire
          ? 'bg-stone-950 border-orange-600/80 text-orange-100 shadow-orange-950/70'
          : 'bg-white border-amber-300 text-stone-900 shadow-amber-900/20'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="סגור"
          className="absolute top-4 left-4 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-orange-400">
            <QrCode className="w-6 h-6" />
          </div>
        </div>

        <h3 className="text-xl font-black tracking-tight mb-1">
          שתף למעגל החניכים
        </h3>
        <p className="text-xs text-stone-400 max-w-xs mx-auto mb-5 leading-relaxed">
          סרוק את הקוד בסמארטפונים: החניכים יראו רק את הציור עם זום – <strong>ללא תשובות וספוילרים!</strong>
        </p>

        {/* QR Code Canvas */}
        <div className="p-4 bg-white rounded-2xl inline-block shadow-inner border border-stone-200 mx-auto mb-4">
          <QRCodeSVG
            value={shareUrl}
            size={200}
            level="M"
            includeMargin={false}
          />
        </div>

        {/* Riddle Title Badge */}
        <div className="mb-4">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-orange-300 border border-amber-500/30">
            🎨 {riddle.title}
          </span>
        </div>

        {/* Action Buttons: WhatsApp Group Share, Copy Link, and Download Image */}
        <div className="space-y-2">
          {/* Direct WhatsApp Share Button */}
          <button
            onClick={() => {
              if (hapticsEnabled) triggerHaptic(30);
              const text = formatVisualRiddleForWhatsApp(riddle.title, shareUrl);
              shareToWhatsApp(text);
            }}
            className="w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white shadow-md shadow-emerald-950/20 transition-all touch-press"
          >
            <Share2 className="w-4 h-4" />
            <span>שלח לוואטסאפ של קבוצת החניכים 📲</span>
          </button>

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all touch-press ${
              isCampfire
                ? 'bg-stone-900 border-stone-700 text-stone-200 hover:bg-stone-800'
                : 'bg-stone-100 border-stone-300 text-stone-800 hover:bg-stone-200'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500 stroke-[2.5]" />
                <span>הקישור הועתק בהצלחה!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-500" />
                <span>העתק קישור תצוגת חניך</span>
              </>
            )}
          </button>

          {/* Download Image Button */}
          <button
            onClick={() => {
              if (hapticsEnabled) triggerHaptic(20);
              downloadVisualImage(riddle.imageUrl, `shluf-${riddle.id}.svg`);
            }}
            className={`w-full py-2 px-3 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 border transition-all touch-press ${
              isCampfire
                ? 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                : 'bg-amber-50/50 border-amber-200 text-stone-600 hover:text-stone-900 hover:bg-amber-100/60'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-amber-500" />
            <span>הורד איור לשליחה כקובץ תמונה</span>
          </button>
        </div>

        <p className="text-[11px] text-stone-400 mt-3">
          💡 הקישור פותח לתלמידים את הציור בזום מלא – ללא תשובות וספוילרים!
        </p>
      </div>
    </div>
  );
};
