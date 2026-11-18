import { useState } from 'react';
import { ArrowRight, Images } from 'lucide-react';
import { GalleryLightbox } from '../components/GalleryLightbox';
import { MediaFrame } from '../components/MediaFrame';
import type { RoutePath } from '../components/Header';
import { OUTREACH_EVENTS, type OutreachEvent } from '../data/ewnData';

interface ProgramsPageProps {
  onNavigate: (path: RoutePath, opts?: { updateSlug?: string; programId?: string }) => void;
}

type FilterCategory = 'all' | 'local-fair' | 'international-mission' | 'youth-education';

const FILTER_TABS: { id: FilterCategory; label: string }[] = [
  { id: 'all', label: 'All Programs' },
  { id: 'local-fair', label: 'Local Food & Health Fairs' },
  { id: 'international-mission', label: 'International Medical Missions' },
  { id: 'youth-education', label: 'Youth & Education Drives' },
];

export function ProgramsPage({ onNavigate }: ProgramsPageProps) {
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [lightbox, setLightbox] = useState<{
    images: string[];
    title: string;
    index: number;
  } | null>(null);

  const programs = OUTREACH_EVENTS.filter((item) => item.category !== 'announcement').filter(
    (item) => (filter === 'all' ? true : item.category === filter)
  );

  const mapProgramToDonation = (ev: OutreachEvent): string => {
    if (ev.category === 'international-mission') return 'global-medical-missions';
    if (ev.category === 'youth-education') return 'back-to-school-youth';
    return 'food-health-fairs';
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16 space-y-12">
      <header className="space-y-4 pb-8 border-b border-[#E4DFD3]">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#145233]">
          Programs &amp; Initiatives
        </p>
        <h1 className="font-serif text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.12] font-medium text-[#181A18] max-w-3xl">
          Practical medical aid, nutrition support, and community outreach in action.
        </h1>
        <p className="text-base text-[#3F433E] max-w-2xl leading-relaxed">
          Every program listed below reflects documented outreach events conducted by Eagles Wings
          Network volunteers, healthcare professionals, and partner churches across Maryland and
          international communities.
        </p>

        {/* Functional Segmented Filter Bar */}
        <div className="pt-4 flex flex-wrap items-center gap-1.5 bg-[#F2EFE7] p-1.5 rounded-lg w-full sm:w-fit border border-[#E4DFD3]">
          {FILTER_TABS.map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-white text-[#145233] font-semibold shadow-xs'
                    : 'text-[#3F433E] hover:text-[#181A18]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      <div className="space-y-10">
        {programs.map((program, idx) => (
          <article
            key={program.id}
            className="bg-white border border-[#E4DFD3] p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start"
          >
            <div className="lg:col-span-5 space-y-3">
              <div
                className="cursor-pointer group relative"
                onClick={() =>
                  setLightbox({ images: program.images, title: program.title, index: 0 })
                }
              >
                <MediaFrame
                  src={program.images[0]}
                  alt={program.title}
                  imgClassName="w-full aspect-[4/3] object-cover object-top group-hover:opacity-95 transition-opacity"
                />
                {program.images.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightbox({ images: program.images, title: program.title, index: 0 });
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#145233] hover:underline cursor-pointer"
                  >
                    <Images className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>View {program.images.length} outreach photos</span>
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <p className="text-xs text-[#565B55]">
                  <span className="font-mono text-[#145233] mr-2 tabular-nums">
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <span>{program.categoryLabel}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{program.date}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{program.location}</span>
                </p>
                <h2 className="font-serif text-2xl font-medium text-[#181A18]">{program.title}</h2>
              </div>

              <p className="text-sm sm:text-base text-[#3F433E] leading-relaxed">
                {program.summary}
              </p>

              {/* Metrics Row */}
              {program.metrics.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-3 border-y border-[#E4DFD3]">
                  {program.metrics.map((metric) => (
                    <div key={metric.label}>
                      <p className="font-serif text-xl font-semibold text-[#181A18] tabular-nums">
                        {metric.value}
                      </p>
                      <p className="text-xs text-[#565B55]">{metric.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Highlights */}
              <ul className="space-y-1.5 text-sm text-[#3F433E]">
                {program.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-mono text-xs text-[#145233] mt-1">•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              {(program.partners || program.sponsors) && (
                <div className="text-xs text-[#565B55] space-y-1 pt-1">
                  {program.partners && (
                    <p>
                      <strong className="text-[#181A18]">Collaborating Partners:</strong>{' '}
                      {program.partners.join(', ')}
                    </p>
                  )}
                  {program.sponsors && (
                    <p>
                      <strong className="text-[#181A18]">Sponsors:</strong>{' '}
                      {program.sponsors.join('; ')}
                    </p>
                  )}
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  onClick={() =>
                    onNavigate('/donate', { programId: mapProgramToDonation(program) })
                  }
                  className="px-4 py-2 bg-[#145233] hover:bg-[#0E3D25] text-white text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Support This Initiative
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('/updates', { updateSlug: program.slug })}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#145233] hover:underline cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Read Full Field Report</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {lightbox && (
        <GalleryLightbox
          images={lightbox.images}
          title={lightbox.title}
          activeIndex={lightbox.index}
          onClose={() => setLightbox(null)}
          onChangeIndex={(index) => setLightbox((prev) => (prev ? { ...prev, index } : null))}
        />
      )}
    </div>
  );
}
