import React, { useState } from 'react';
import { EBOOK_CHAPTERS } from '../data/ebookData';
import { X, BookOpen, Clock, ChevronLeft, ChevronRight, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

interface EbookReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
  isUnlocked: boolean;
}

export const EbookReaderModal: React.FC<EbookReaderModalProps> = ({
  isOpen,
  onClose,
  onOpenCheckout,
  isUnlocked
}) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);

  if (!isOpen) return null;

  const currentChapter = EBOOK_CHAPTERS[activeChapterIndex];
  const isLocked = !isUnlocked && activeChapterIndex > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="rounded-[32px] bg-[#fdfaf5] border border-[#eeeae4] shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top bar */}
        <div className="p-5 md:p-6 border-b border-[#eeeae4] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f4f1ec] border border-[#eeeae4] text-[#d47e62] flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d47e62] bg-[#fdfaf5] border border-[#eeeae4] px-2.5 py-0.5 rounded-full">
                  Ebook Método Vínculo
                </span>
                <span className="text-xs text-[#688a4d] font-semibold">
                  {isUnlocked ? 'Acceso Completo' : 'Vista Previa'}
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
                Capítulo {currentChapter.chapterNumber}: {currentChapter.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#fdfaf5] border border-[#eeeae4] hover:bg-[#f4f1ec] flex items-center justify-center text-[#3d3229] cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chapters Navigation Tabs */}
        <div className="px-6 py-3 bg-[#fdfaf5] border-b border-[#eeeae4] overflow-x-auto flex gap-2 shrink-0">
          {EBOOK_CHAPTERS.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => setActiveChapterIndex(idx)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeChapterIndex === idx
                  ? 'bg-[#d47e62] text-white shadow-xs'
                  : 'bg-white text-[#3d3229] border border-[#eeeae4] hover:border-[#d47e62]/40'
              }`}
            >
              <span>Cap. {ch.chapterNumber}</span>
              {!isUnlocked && idx > 0 && <Lock className="w-3 h-3 text-[#d4a34b]" />}
            </button>
          ))}
        </div>

        {/* Reader Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6 bg-white">
          
          <div className="flex items-center justify-between text-xs text-[#7a6f65] border-b border-[#f4f1ec] pb-3">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#d4a34b]" />
              {currentChapter.readTime}
            </span>
            <span className="text-[11px] font-semibold text-[#688a4d]">
              Método Vínculo · Matrescencia
            </span>
          </div>

          {/* Excerpt Box */}
          <div className="p-5 rounded-2xl bg-[#fdfaf5] border-l-4 border-[#d47e62] text-sm text-[#3d3229] italic leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
            "{currentChapter.excerpt}"
          </div>

          {/* Key takeaways */}
          <div className="p-5 rounded-2xl bg-[#fdfaf5] border border-[#eeeae4]">
            <p className="text-xs font-bold uppercase tracking-wider text-[#3d3229] mb-3">
              💡 Puntos clave de este capítulo:
            </p>
            <ul className="space-y-2 text-xs md:text-sm text-[#3d3229]">
              {currentChapter.keyTakeaways.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#688a4d] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Full Text or Locked State */}
          {isLocked ? (
            <div className="text-center py-10 px-6 rounded-3xl bg-[#fdfaf5] border border-dashed border-[#d47e62]/40 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-[#f4f1ec] border border-[#eeeae4] mx-auto mb-3 flex items-center justify-center text-[#d47e62]">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
                Capítulo reservado para miembros
              </h3>
              <p className="mt-2 text-sm text-[#7a6f65] max-w-md mx-auto">
                Desbloquea el Ebook completo de 5 capítulos, la app interactiva y los 3 bonos por un pago único de <strong>$10 USD</strong>.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="mt-6 font-bold bg-[#d47e62] hover:bg-[#c46d52] text-white px-8 py-3.5 rounded-2xl text-sm shadow-md inline-flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>Desbloquear Todo por $10 USD</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4 text-sm md:text-base text-[#3d3229] leading-relaxed">
              {currentChapter.fullText.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-[#eeeae4] bg-[#fdfaf5] flex items-center justify-between">
          <button
            disabled={activeChapterIndex === 0}
            onClick={() => setActiveChapterIndex(prev => Math.max(0, prev - 1))}
            className="px-4 py-2 rounded-2xl text-xs font-semibold border border-[#eeeae4] bg-white text-[#3d3229] hover:bg-[#f4f1ec] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>

          <span className="text-xs font-medium text-[#7a6f65]">
            Capítulo {activeChapterIndex + 1} de {EBOOK_CHAPTERS.length}
          </span>

          <button
            disabled={activeChapterIndex === EBOOK_CHAPTERS.length - 1}
            onClick={() => setActiveChapterIndex(prev => Math.min(EBOOK_CHAPTERS.length - 1, prev + 1))}
            className="px-4 py-2 rounded-2xl text-xs font-semibold border border-[#eeeae4] bg-white text-[#3d3229] hover:bg-[#f4f1ec] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
          >
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
