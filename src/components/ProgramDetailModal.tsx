import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { OutreachEvent } from '../data/ewnData';

interface ProgramDetailModalProps {
  event: OutreachEvent | null;
  onClose: () => void;
  onDonate: (programId: string) => void;
  onOpenFullUpdate: (slug: string) => void;
}

export function ProgramDetailModal({
  event,
  onClose,
  onDonate,
  onOpenFullUpdate,
}: ProgramDetailModalProps) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setPhotoIdx(0);
  }, [event?.id]);

  useEffect(() => {
    if (!event) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [event, onClose]);

  const mapCategoryToProgramId = (ev: OutreachEvent) => {
    if (ev.category === 'international-mission') return 'global-medical-missions';
    if (ev.category === 'youth-education') return 'back-to-school-youth';
    return 'food-health-fairs';
  };

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="program-modal-title"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#181A18]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
        >
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FBF9F5] border border-[#E4DFD3] w-full max-w-3xl max-h-[90vh] overflow-y-auto p-5 sm:p-8 space-y-6"
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E4DFD3]">
              <div className="space-y-1">
                <p className="text-xs text-[#565B55]">
                  <span className="font-semibold text-[#145233]">{event.categoryLabel}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{event.date}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{event.location}</span>
                </p>
                <h2
                  id="program-modal-title"
                  className="font-serif text-xl sm:text-2xl font-semibold text-[#181A18]"
                >
                  {event.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close outreach details"
                className="w-11 h-11 rounded-md border border-[#E4DFD3] flex items-center justify-center text-[#181A18] hover:bg-[#F2EFE7] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {event.images.length > 0 && (
              <div className="relative bg-[#F2EFE7] border border-[#E4DFD3] overflow-hidden">
                <img
                  src={event.images[photoIdx]}
                  alt={`${event.title} photo ${photoIdx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-[240px] sm:h-[340px] object-cover object-top"
                />
                {event.images.length > 1 && (
                  <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-black/65 text-white text-xs font-mono tabular-nums rounded-sm">
                      {photoIdx + 1} / {event.images.length}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setPhotoIdx((p) => (p - 1 + event.images.length) % event.images.length)
                        }
                        aria-label="Previous outreach image"
                        className="w-10 h-10 bg-black/65 hover:bg-black/85 text-white rounded-md flex items-center justify-center cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhotoIdx((p) => (p + 1) % event.images.length)}
                        aria-label="Next outreach image"
                        className="w-10 h-10 bg-black/65 hover:bg-black/85 text-white rounded-md flex items-center justify-center cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4 text-sm sm:text-base text-[#3F433E] leading-relaxed">
              {event.bodyParagraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {event.highlights.length > 0 && (
              <ul className="space-y-2 text-sm text-[#3F433E] border-t border-[#E4DFD3] pt-4">
                {event.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="font-mono text-xs text-[#145233] mt-0.5 tabular-nums">
                      0{i + 1}.
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}

            {(event.partners || event.sponsors) && (
              <div className="bg-[#F2EFE7] border border-[#E4DFD3] p-4 text-xs sm:text-sm text-[#3F433E] space-y-1">
                {event.partners && (
                  <p>
                    <strong className="text-[#181A18]">Partners:</strong>{' '}
                    {event.partners.join(', ')}
                  </p>
                )}
                {event.sponsors && (
                  <p>
                    <strong className="text-[#181A18]">Sponsors:</strong>{' '}
                    {event.sponsors.join('; ')}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E4DFD3]">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDonate(mapCategoryToProgramId(event));
                }}
                className="px-5 py-2.5 bg-[#145233] hover:bg-[#0E3D25] text-white text-sm font-semibold rounded-md cursor-pointer"
              >
                Support This Initiative
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullUpdate(event.slug);
                }}
                className="text-sm font-semibold text-[#145233] hover:underline cursor-pointer"
              >
                Open Full Dispatch Page →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
