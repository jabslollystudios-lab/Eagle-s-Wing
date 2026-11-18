import { useEffect, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { MediaFrame } from '../components/MediaFrame';
import type { RoutePath } from '../components/Header';
import {
  AREAS_OF_NEED,
  BOARD_OF_DIRECTORS,
  DOCUMENTED_SPONSORS_AND_PARTNERS,
  MISSION_AND_PURPOSE,
  SITE_INFO,
  type BoardMember,
} from '../data/ewnData';

interface AboutPageProps {
  onNavigate: (path: RoutePath) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);

  useEffect(() => {
    if (!selectedMember) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedMember(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedMember]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16 space-y-16">
      {/* Page Header & Visual */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch pb-12 border-b border-[#E4DFD3]">
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#145233]">
              Missions and Visions
            </p>
            <h1 className="font-serif text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.12] font-medium text-[#181A18]">
              Bridging health, social, and economic disparities at the grassroots level.
            </h1>
          </div>

          <div className="space-y-6 pt-2">
            <div>
              <h2 className="font-serif text-xl font-semibold text-[#181A18] mb-2">
                Mission Statement
              </h2>
              <p className="text-base text-[#3F433E] leading-relaxed max-w-prose">
                {MISSION_AND_PURPOSE.missionStatement}
              </p>
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-[#181A18] mb-2">
                Purpose Statement
              </h2>
              <p className="text-base text-[#3F433E] leading-relaxed max-w-prose">
                {MISSION_AND_PURPOSE.purposeStatement}
              </p>
            </div>
            <p className="text-sm text-[#565B55] leading-relaxed max-w-prose">
              {MISSION_AND_PURPOSE.operationalScope}
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col">
          <MediaFrame
            src={SITE_INFO.missionBanner}
            alt="Eagles Wings Network outreach with schoolchildren during field mission"
            className="flex-1 flex flex-col"
            imgClassName="w-full h-full min-h-[320px] object-cover object-top"
            caption="Fig. 1 — Eagles Wings Network serving children and communities through education, healthcare, and nutrition support."
          />
        </div>
      </section>

      {/* Seven Basic Areas of Need */}
      <section className="space-y-8">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#145233]">
            Core Focus Areas
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#181A18]">
            The basic areas of need that Eagles Wings Network addresses.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E4DFD3] border border-[#E4DFD3]">
          {AREAS_OF_NEED.map((area) => (
            <div key={area.index} className="bg-[#FBF9F5] p-6 sm:p-7 space-y-2.5">
              <p className="font-mono text-xs text-[#145233] tabular-nums">{area.index}.</p>
              <h3 className="font-serif text-lg font-semibold text-[#181A18]">{area.title}</h3>
              <p className="text-sm text-[#3F433E] leading-relaxed">{area.description}</p>
            </div>
          ))}
          <div className="bg-[#F2EFE7] p-6 sm:p-7 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#145233]">
                Collaborative Network
              </p>
              <p className="text-sm text-[#3F433E] leading-relaxed">
                Connecting underserved families with governmental and non-governmental facilitators
                of assistance across the United States and partner nations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/programs')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#145233] hover:underline cursor-pointer self-start"
            >
              <span>View Active Programs</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* Board of Directors */}
      <section id="board" className="space-y-8 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E4DFD3]">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#145233]">
              Leadership &amp; Governance
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#181A18]">
              Members of the Board of Directors
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/board')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#145233] hover:underline whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-end"
          >
            <span>Open Dedicated Leadership Page</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BOARD_OF_DIRECTORS.map((member) => (
            <article
              key={member.id}
              className="bg-white border border-[#E4DFD3] flex flex-col justify-between"
            >
              <div>
                <MediaFrame
                  src={member.image}
                  alt={member.name}
                  imgClassName="w-full aspect-[4/4] object-cover object-top"
                  fallbackTitle={member.name}
                />
                <div className="p-5 space-y-2">
                  <p className="text-xs text-[#565B55]">{member.role}</p>
                  <h3 className="font-serif text-lg font-semibold text-[#181A18]">
                    {member.name}
                  </h3>
                  <p className="text-xs font-medium text-[#145233]">{member.specialty}</p>
                  <p className="text-sm text-[#3F433E] leading-relaxed line-clamp-4 pt-1">
                    {member.bio[0]}
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMember(member)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#145233] hover:underline cursor-pointer"
                >
                  <span>Read full biography</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Documented Church Partners & Sponsors */}
      <section className="border-t border-[#E4DFD3] pt-12 space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#145233]">
            Partners &amp; Sponsors Acknowledged in Field Reports
          </p>
          <h2 className="font-serif text-2xl font-medium text-[#181A18]">
            Faith-based, agricultural, dental, and pharmaceutical collaborators.
          </h2>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-[#3F433E]">
          {DOCUMENTED_SPONSORS_AND_PARTNERS.map((partner) => (
            <li
              key={partner}
              className="bg-[#F2EFE7]/70 border border-[#E4DFD3] px-4 py-3 font-medium text-[#181A18]"
            >
              {partner}
            </li>
          ))}
        </ul>
      </section>

      {/* Biography Modal */}
      {selectedMember && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="board-modal-title"
          className="fixed inset-0 z-50 bg-[#181A18]/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-[#FBF9F5] border border-[#E4DFD3] max-w-2xl w-full max-h-[88vh] overflow-y-auto p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E4DFD3]">
              <div className="flex items-center gap-4">
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-cover object-top border border-[#E4DFD3] shrink-0"
                />
                <div>
                  <p className="text-xs text-[#565B55]">{selectedMember.role}</p>
                  <h3
                    id="board-modal-title"
                    className="font-serif text-2xl font-semibold text-[#181A18]"
                  >
                    {selectedMember.name}
                  </h3>
                  <p className="text-xs font-medium text-[#145233]">{selectedMember.specialty}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                aria-label="Close biography"
                className="w-10 h-10 rounded-md border border-[#E4DFD3] flex items-center justify-center text-[#181A18] hover:bg-[#F2EFE7] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-[#3F433E] leading-relaxed">
              {selectedMember.bio.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
