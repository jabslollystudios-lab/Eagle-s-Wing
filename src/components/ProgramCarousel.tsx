import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, HeartHandshake, Pause, Play } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { OutreachEvent } from '../data/ewnData';

interface ProgramCarouselProps {
  items: OutreachEvent[];
  onSelectProgram: (event: OutreachEvent) => void;
  onQuickDonate: (programId: string) => void;
}

export function ProgramCarousel({
  items,
  onSelectProgram,
  onQuickDonate,
}: ProgramCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (paused || items.length <= 1 || shouldReduceMotion) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [paused, items.length, shouldReduceMotion]);

  if (!items.length) return null;

  const active = items[index];
  const mapCategoryToProgramId = (ev: OutreachEvent) => {
    if (ev.category === 'international-mission') return 'global-medical-missions';
    if (ev.category === 'youth-education') return 'back-to-school-youth';
    return 'food-health-fairs';
  };

  return (
    <div
      className="relative bg-white border border-[#E4DFD3] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Visual Slide */}
        <div className="lg:col-span-7 relative min-h-[260px] sm:min-h-[360px] lg:min-h-[420px] bg-[#F2EFE7] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={active.id}
              src={active.images[0]}
              alt={active.title}
              referrerPolicy="no-referrer"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full min-h-[260px] sm:min-h-[360px] lg:min-h-[420px] max-h-[460px] object-cover object-top"
            />
          </AnimatePresence>

          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 via-black/30 to-transparent pointer-events-none"
          />

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-3 text-white">
            <p className="text-xs font-mono tabular-nums truncate">
              {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')} ·{' '}
              {active.location}
            </p>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? 'Play program carousel' : 'Pause program carousel'}
                className="w-10 h-10 rounded-md bg-black/55 hover:bg-black/80 border border-white/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIndex((prev) => (prev - 1 + items.length) % items.length)}
                aria-label="Previous featured outreach"
                className="w-10 h-10 rounded-md bg-black/55 hover:bg-black/80 border border-white/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIndex((prev) => (prev + 1) % items.length)}
                aria-label="Next featured outreach"
                className="w-10 h-10 rounded-md bg-black/55 hover:bg-black/80 border border-white/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Slide Content */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <p className="text-xs text-[#565B55]">
                <span className="font-semibold text-[#145233]">{active.categoryLabel}</span>
                <span aria-hidden="true"> · </span>
                <span>{active.date}</span>
              </p>

              <h3 className="font-serif text-2xl font-medium text-[#181A18] leading-snug">
                {active.title}
              </h3>

              <p className="text-sm text-[#3F433E] leading-relaxed">{active.summary}</p>

              {active.metrics.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-[#E4DFD3]">
                  {active.metrics.slice(0, 3).map((m) => (
                    <div key={m.label}>
                      <p className="font-serif text-lg font-semibold text-[#181A18] tabular-nums">
                        {m.value}
                      </p>
                      <p className="text-[11px] text-[#565B55] leading-tight">{m.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="space-y-4 pt-2 border-t border-[#E4DFD3]">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onSelectProgram(active)}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold bg-[#145233] hover:bg-[#0E3D25] text-white rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Inspect Outreach Report
              </button>
              <button
                type="button"
                onClick={() => onQuickDonate(mapCategoryToProgramId(active))}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold border border-[#D4CEC0] bg-[#FBF9F5] hover:border-[#145233] text-[#181A18] rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <HeartHandshake className="w-4 h-4 text-[#145233]" aria-hidden="true" />
                <span>Quick Donate</span>
              </button>
            </div>

            {/* Slide Progress Bars */}
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Featured outreach slides">
              {items.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={idx === index}
                  aria-label={`Show ${item.title}`}
                  onClick={() => setIndex(idx)}
                  className={`h-1.5 flex-1 rounded-full transition-colors cursor-pointer ${
                    idx === index ? 'bg-[#145233]' : 'bg-[#E4DFD3] hover:bg-[#C9C2B2]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
