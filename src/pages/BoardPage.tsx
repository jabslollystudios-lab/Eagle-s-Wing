import { useEffect, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MediaFrame } from '../components/MediaFrame';
import type { RoutePath } from '../components/Header';
import { BOARD_OF_DIRECTORS, type BoardMember } from '../data/ewnData';

interface BoardPageProps {
  onNavigate: (path: RoutePath) => void;
}

type DisciplineFilter = 'all' | 'medical' | 'community';

function isMedicalMember(member: BoardMember): boolean {
  const s = member.specialty.toLowerCase();
  return (
    s.includes('pediatrician') ||
    s.includes('pharmacist') ||
    s.includes('obstetrician') ||
    s.includes('nurse')
  );
}

export function BoardPage({ onNavigate }: BoardPageProps) {
  const [filter, setFilter] = useState<DisciplineFilter>('all');
  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!selectedMember) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedMember(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedMember]);

  const filteredMembers = BOARD_OF_DIRECTORS.filter((member) => {
    if (filter === 'medical') return isMedicalMember(member);
    if (filter === 'community') return !isMedicalMember(member);
    return true;
  });

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16 space-y-12">
      <header className="space-y-4 pb-8 border-b border-[#E4DFD3]">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#145233]">
          Leadership &amp; Governance
        </p>
        <h1 className="font-serif text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.12] font-medium text-[#181A18] max-w-3xl">
          Members of the Board of Directors
        </h1>
        <p className="text-base text-[#3F433E] max-w-2xl leading-relaxed">
          Eagles Wings Network is guided by physicians, nurses, pharmacists, ministers, and
          community leaders dedicated to extending compassionate medical, food, and social aid
          across underserved communities.
        </p>

        {/* Functional Discipline Filter */}
        <div className="pt-3 flex flex-wrap items-center gap-1.5 bg-[#F2EFE7] p-1.5 rounded-lg w-full sm:w-fit border border-[#E4DFD3]">
          {[
            { id: 'all' as const, label: `All Directors (${BOARD_OF_DIRECTORS.length})` },
            {
              id: 'medical' as const,
              label: `Medical & Healthcare (${BOARD_OF_DIRECTORS.filter(isMedicalMember).length})`,
            },
            {
              id: 'community' as const,
              label: `Ministry & Community (${BOARD_OF_DIRECTORS.filter((m) => !isMedicalMember(m)).length})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filter === tab.id
                  ? 'bg-white text-[#145233] font-semibold shadow-xs'
                  : 'text-[#3F433E] hover:text-[#181A18]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Directors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredMembers.map((member, index) => (
          <motion.article
            key={member.id}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: shouldReduceMotion ? 0 : index * 0.04 }}
            className="bg-white border border-[#E4DFD3] grid grid-cols-1 sm:grid-cols-12 overflow-hidden"
          >
            <div className="sm:col-span-5">
              <MediaFrame
                src={member.image}
                alt={member.name}
                className="h-full"
                imgClassName="w-full h-64 sm:h-full object-cover object-top"
                fallbackTitle={member.name}
              />
            </div>

            <div className="sm:col-span-7 p-6 flex flex-col justify-between gap-4">
              <div className="space-y-2.5">
                <p className="text-xs text-[#565B55]">{member.role}</p>
                <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#181A18]">
                  {member.name}
                </h2>
                <p className="text-xs font-semibold text-[#145233]">{member.specialty}</p>
                <p className="text-sm text-[#3F433E] leading-relaxed line-clamp-5 pt-1">
                  {member.bio.join(' ')}
                </p>
              </div>

              <div className="pt-2 border-t border-[#E4DFD3]">
                <button
                  type="button"
                  onClick={() => setSelectedMember(member)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#145233] hover:underline cursor-pointer py-1"
                >
                  <span>Read full biography</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Bottom CTA */}
      <section className="bg-[#F2EFE7]/80 border border-[#E4DFD3] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#181A18]">
            Serve alongside our medical and community leaders.
          </h2>
          <p className="text-sm text-[#3F433E] leading-relaxed">
            Join an upcoming health fair, medical mission, or youth mentoring initiative, or
            support the Board’s grassroots work with a contribution.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('/contact')}
            className="px-4 py-2.5 border border-[#D4CEC0] bg-white hover:border-[#145233] text-[#181A18] text-sm font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap"
          >
            Volunteer With Us
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/donate')}
            className="px-5 py-2.5 bg-[#145233] hover:bg-[#0E3D25] text-white text-sm font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap"
          >
            Donate Today
          </button>
        </div>
      </section>

      {/* Full Biography Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="board-page-modal-title"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setSelectedMember(null)}
            className="fixed inset-0 z-50 bg-[#181A18]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
          >
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FBF9F5] border border-[#E4DFD3] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-8 space-y-6"
            >
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E4DFD3]">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover object-top border border-[#E4DFD3] shrink-0"
                  />
                  <div>
                    <p className="text-xs text-[#565B55]">{selectedMember.role}</p>
                    <h3
                      id="board-page-modal-title"
                      className="font-serif text-xl sm:text-2xl font-semibold text-[#181A18]"
                    >
                      {selectedMember.name}
                    </h3>
                    <p className="text-xs font-medium text-[#145233]">
                      {selectedMember.specialty}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  aria-label="Close biography"
                  className="w-11 h-11 rounded-md border border-[#E4DFD3] flex items-center justify-center text-[#181A18] hover:bg-[#F2EFE7] transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-[#3F433E] leading-relaxed">
                {selectedMember.bio.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
