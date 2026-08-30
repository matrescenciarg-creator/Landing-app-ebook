import React, { useState } from 'react';
import { BookOpen, CheckCircle, ChevronLeft, ChevronRight, Lock, Sparkles, Bookmark, Search, Type, Moon, Sun } from 'lucide-react';
import { EBOOK_CHAPTERS } from '../../data/ebookData';
import { EbookChapter } from '../../types';

interface AppEbookReaderProps {
  isUnlocked: boolean;
  onOpenCheckout: () => void;
}

export const AppEbookReader: React.FC<AppEbookReaderProps> = ({ isUnlocked, onOpenCheckout }) => {
  const [selectedChapterId, setSelectedChapterId] = useState<string>(EBOOK_CHAPTERS[0].id);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [readingTheme, setReadingTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [completedChapters, setCompletedChapters] = useState<string[]>(['cap-1']);

  const currentChapter = EBOOK_CHAPTERS.find((c) => c.id === selectedChapterId) || EBOOK_CHAPTERS[0];
  const currentIndex = EBOOK_CHAPTERS.findIndex((c) => c.id === selectedChapterId);

  const handleNext = () => {
    if (currentIndex < EBOOK_CHAPTERS.length - 1) {
      const nextId = EBOOK_CHAPTERS[currentIndex + 1].id;
      setSelectedChapterId(nextId);
      if (!completedChapters.includes(selectedChapterId)) {
        setCompletedChapters([...completedChapters, selectedChapterId]);
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedChapterId(EBOOK_CHAPTERS[currentIndex - 1].id);
    }
  };

  const toggleComplete = (id: string) => {
    if (completedChapters.includes(id)) {
      setCompletedChapters(completedChapters.filter((c) => c !== id));
    } else {
      setCompletedChapters([...completedChapters, id]);
    }
  };

  const themeStyles = {
    light: 'bg-white text-[#3d3229] border-[#eeeae4]',
    sepia: 'bg-[#fbf0d9] text-[#433422] border-[#ecd9b5]',
    dark: 'bg-[#241f1c] text-[#ece4dc] border-[#38312d]'
  };

  const fontSizes = {
    normal: 'text-sm leading-relaxed',
    large: 'text-base leading-relaxed',
    xlarge: 'text-lg leading-loose'
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-[32px] bg-gradient-to-br from-white via-[#fdfaf5] to-[#f4f1ec] border border-[#eeeae4] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d47e62]/10 border border-[#d47e62]/30 text-[#d47e62] text-xs font-bold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ebook Completo · 5 Capítulos Integrales</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
              El Método Vínculo: La Guía Maestra
            </h2>
            <p className="text-sm text-[#7a6f65] max-w-xl">
              La biología del llanto, el mapa de ventanas de vigilia y el protocolo de rescate para noches difíciles en un lenguaje cálido y sin culpas.
            </p>
          </div>

          {/* Progress Pill */}
          <div className="p-4 rounded-2xl bg-white border border-[#eeeae4] shadow-xs shrink-0 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c8d6ba]/40 text-[#688a4d] flex items-center justify-center font-bold text-sm">
              {Math.round((completedChapters.length / EBOOK_CHAPTERS.length) * 100)}%
            </div>
            <div>
              <p className="text-xs font-bold text-[#3d3229]">Progreso de Lectura</p>
              <p className="text-[11px] text-[#7a6f65]">
                {completedChapters.length} de {EBOOK_CHAPTERS.length} leídos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reader Grid */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Navigation: Chapters index */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-5 rounded-[28px] bg-white border border-[#eeeae4] shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7a6f65]">
              Índice de Capítulos
            </h3>

            <div className="space-y-2">
              {EBOOK_CHAPTERS.map((chapter) => {
                const isSelected = selectedChapterId === chapter.id;
                const isDone = completedChapters.includes(chapter.id);
                const isLocked = !isUnlocked && chapter.chapterNumber > 1;

                return (
                  <button
                    key={chapter.id}
                    onClick={() => {
                      if (isLocked) {
                        onOpenCheckout();
                      } else {
                        setSelectedChapterId(chapter.id);
                      }
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#fdfaf5] border-[#d47e62] shadow-xs ring-1 ring-[#d47e62]/20'
                        : 'bg-white border-[#eeeae4] hover:bg-[#fcfaf7]'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isDone
                          ? 'bg-[#688a4d] text-white'
                          : isSelected
                          ? 'bg-[#d47e62] text-white'
                          : 'bg-[#f4f1ec] text-[#3d3229]'
                      }`}
                    >
                      {isLocked ? <Lock className="w-3.5 h-3.5" /> : chapter.chapterNumber}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold truncate ${isSelected ? 'text-[#d47e62]' : 'text-[#3d3229]'}`}>
                        {chapter.title}
                      </p>
                      <p className="text-[10px] text-[#7a6f65] mt-0.5">
                        {chapter.readTime}
                      </p>
                    </div>

                    {isLocked && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-[#dfa745]/20 text-[#dfa745] shrink-0">
                        $10
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {!isUnlocked && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#dfa745]/15 to-[#d47e62]/10 border border-[#dfa745]/30 space-y-2 mt-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#3d3229]">
                  <Sparkles className="w-4 h-4 text-[#dfa745]" />
                  <span>Desbloquea los 5 Capítulos</span>
                </div>
                <p className="text-[11px] text-[#7a6f65]">
                  Accede a la obra completa + 3 bonos exclusivos por un único pago de $10 USD.
                </p>
                <button
                  onClick={onOpenCheckout}
                  className="w-full py-2.5 rounded-xl bg-[#d47e62] hover:bg-[#c46d52] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Desbloquear Ebook ($10 USD)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Area: Reading Viewport */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Reader Controls Toolbar */}
          <div className="p-4 rounded-2xl bg-white border border-[#eeeae4] shadow-xs flex items-center justify-between gap-4 flex-wrap">
            {/* Font size picker */}
            <div className="flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#7a6f65]" />
              {(['normal', 'large', 'xlarge'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFontSize(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    fontSize === s ? 'bg-[#3d3229] text-white' : 'bg-[#f4f1ec] text-[#7a6f65]'
                  }`}
                >
                  {s === 'normal' ? 'A' : s === 'large' ? 'A+' : 'A++'}
                </button>
              ))}
            </div>

            {/* Reading Theme */}
            <div className="flex items-center gap-1.5">
              {(['light', 'sepia', 'dark'] as const).map((theme) => (
                <button
                  key={theme}
                  onClick={() => setReadingTheme(theme)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    readingTheme === theme ? 'bg-[#d47e62] text-white' : 'bg-[#f4f1ec] text-[#3d3229]'
                  }`}
                >
                  {theme === 'light' ? 'Día' : theme === 'sepia' ? 'Sepia' : 'Noche'}
                </button>
              ))}
            </div>

            {/* Mark as read button */}
            <button
              onClick={() => toggleComplete(currentChapter.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                completedChapters.includes(currentChapter.id)
                  ? 'bg-[#c8d6ba] text-[#3d3229]'
                  : 'bg-[#f4f1ec] text-[#7a6f65] hover:text-[#3d3229]'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{completedChapters.includes(currentChapter.id) ? 'Leído' : 'Marcar Leído'}</span>
            </button>
          </div>

          {/* Chapter Content Body */}
          <div className={`p-6 md:p-10 rounded-[32px] border shadow-xs transition-colors ${themeStyles[readingTheme]}`}>
            
            {/* Chapter Header */}
            <div className="border-b pb-6 mb-6 space-y-3" style={{ borderColor: readingTheme === 'dark' ? '#38312d' : '#eeeae4' }}>
              <span className="text-xs uppercase tracking-widest font-bold opacity-75">
                Capítulo {currentChapter.chapterNumber} · {currentChapter.readTime}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                {currentChapter.title}
              </h1>
              <p className="text-sm italic opacity-90 leading-relaxed">
                "{currentChapter.excerpt}"
              </p>
            </div>

            {/* Key Takeaways Box */}
            <div
              className={`p-5 rounded-2xl mb-8 border ${
                readingTheme === 'dark'
                  ? 'bg-[#1e1a17] border-[#38312d]'
                  : readingTheme === 'sepia'
                  ? 'bg-[#f6ebd2] border-[#ecd9b5]'
                  : 'bg-[#fdfaf5] border-[#eeeae4]'
              }`}
            >
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 text-[#d47e62]">
                <Sparkles className="w-3.5 h-3.5" /> Puntos Clave para Recordar:
              </h4>
              <ul className="space-y-2">
                {currentChapter.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="text-xs flex items-start gap-2 leading-relaxed">
                    <span className="text-[#d47e62] font-bold">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Full text paragraphs */}
            <div className={`space-y-5 ${fontSizes[fontSize]}`}>
              {currentChapter.fullText.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Bottom Chapter Pagination */}
            <div className="mt-10 pt-6 border-t flex items-center justify-between gap-4" style={{ borderColor: readingTheme === 'dark' ? '#38312d' : '#eeeae4' }}>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-2.5 rounded-2xl bg-[#f4f1ec] text-[#3d3229] disabled:opacity-30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <span className="text-xs text-[#7a6f65] font-semibold">
                Capítulo {currentIndex + 1} de {EBOOK_CHAPTERS.length}
              </span>

              <button
                onClick={handleNext}
                disabled={currentIndex === EBOOK_CHAPTERS.length - 1}
                className="px-4 py-2.5 rounded-2xl bg-[#d47e62] text-white disabled:opacity-30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
