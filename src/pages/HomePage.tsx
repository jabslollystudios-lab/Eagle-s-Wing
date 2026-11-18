import { useState } from 'react';
import { ArrowRight, Images } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { MediaFrame } from '../components/MediaFrame';
import { ProgramCarousel } from '../components/ProgramCarousel';
import { ProgramDetailModal } from '../components/ProgramDetailModal';
import type { RoutePath } from '../components/Header';
import {
  HERO_CONTENT,
  MISSION_AND_PURPOSE,
  OUTREACH_EVENTS,
  SITE_INFO,
  type OutreachEvent,
} from '../data/ewnData';

interface HomePageProps {
  onNavigate: (path: RoutePath, opts?: { updateSlug?: string; programId?: string }) => void;
  onQuickDonate: (programId?: string) => void;
}

export function HomePage({ onNavigate, onQuickDonate }: HomePageProps) {
  const [modalEvent, setModalEvent] = useState<OutreachEvent | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const carouselEvents = OUTREACH_EVENTS.filter((e) =>
    [
      'riverdale-sept-2025',
      'nigeria-outreach-2024',
      'nicaragua-mission-2024',
      'owings-mills-2024',
      'back-to-school-2024',
    ].includes(e.id)
  );
  const leadEvent = OUTREACH_EVENTS[0];
  const secondaryEvents = OUTREACH_EVENTS.filter((e) =>
    ['nigeria-outreach-2024', 'nicaragua-mission-2024', 'owings-mills-2024'].includes(e.id)
  );
  const archiveEvents = OUTREACH_EVENTS.filter((e) =>
    [
      'back-to-school-2024',
      'victoria-park-manor-2024',
      'first-fruits-collaboration-2024',
      'refiners-church-2023',
      'nigeria-outreach-2023',
    ].includes(e.id)
  );

  return (
    <div>
      {/* Editorial Hero Split */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-between py-1 sm:py-2"
          >
            <div className="space-y-5 sm:space-y-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#145233]">
                {HERO_CONTENT.kicker} · {SITE_INFO.subtitle}
              </p>

              <h1 className="font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] font-medium tracking-tight text-[#181A18]">
                {HERO_CONTENT.headline}
              </h1>

              <div className="space-y-4 text-sm sm:text-base text-[#3F433E] leading-relaxed max-w-prose">
                {HERO_CONTENT.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>

            <div className="pt-6 sm:pt-8 flex flex-wrap items-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={() => onQuickDonate('general-lifeline')}
                className="px-6 py-3 bg-[#145233] hover:bg-[#0E3D25] text-white text-sm font-semibold rounded-md transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#145233]"
              >
                Donate Today
              </button>
              <a
                href="#/about"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/about');
                }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#181A18] hover:text-[#145233] transition-colors whitespace-nowrap shrink-0 py-2"
              >
                <span>Explore Missions &amp; Visions</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col"
          >
            <MediaFrame
              src="/media/nicaragua-2024-1.jpg"
              alt="Eagles Wings Network medical and outreach mission team in Nicaragua"
              className="flex-1 flex flex-col"
              imgClassName="w-full h-full min-h-[240px] sm:min-h-[320px] lg:min-h-[420px] object-cover object-center"
              caption="Fig. 1 — Eagles Wings Network mission volunteers serving communities internationally and across Maryland."
              fallbackTitle="Eagles Wings Network Outreach"
            />
          </motion.div>
        </div>

        {/* Full-Width 4-Column Factual Impact Strip */}
        <div className="mt-10 sm:mt-12 border-t border-b border-[#E4DFD3] py-6 grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          <div>
            <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#181A18] tabular-nums">
              205
            </p>
            <p className="mt-1 text-xs text-[#565B55] leading-relaxed">
              Individuals assisted at Mbato Ofeme, Umuahia, Nigeria · Dec 26, 2024
            </p>
          </div>
          <div>
            <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#181A18] tabular-nums">
              135
            </p>
            <p className="mt-1 text-xs text-[#565B55] leading-relaxed">
              Neighbors served at Riverdale, MD Food &amp; Health Fair · Sept 13, 2025
            </p>
          </div>
          <div>
            <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#181A18] tabular-nums">
              ~100 / day
            </p>
            <p className="mt-1 text-xs text-[#565B55] leading-relaxed">
              Average patients treated across 5 Managua clinics · July 2024
            </p>
          </div>
          <div>
            <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#181A18] tabular-nums">
              185
            </p>
            <p className="mt-1 text-xs text-[#565B55] leading-relaxed">
              135 adults &amp; 50 children served in Owings Mills, MD · Mar 30, 2024
            </p>
          </div>
        </div>
      </section>

      {/* Featured Program Carousel */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-14 lg:pb-18 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#145233]">
              Featured Outreach Spotlight
            </p>
            <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl font-medium text-[#181A18]">
              Recent missions and community health fairs.
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/gallery')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#145233] hover:underline whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-end"
          >
            <Images className="w-4 h-4" aria-hidden="true" />
            <span>Explore Full Media Gallery</span>
          </button>
        </div>

        <ProgramCarousel
          items={carouselEvents}
          onSelectProgram={(ev) => setModalEvent(ev)}
          onQuickDonate={(programId) => onQuickDonate(programId)}
        />
      </section>

      {/* Mission & Purpose Editorial Statement */}
      <section className="bg-[#F2EFE7]/75 border-y border-[#E4DFD3] py-12 sm:py-14 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#145233]">
              Missions &amp; Visions
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#181A18]">
              Grassroots networks of care and medical relief.
            </h2>
            <p className="text-sm text-[#565B55] leading-relaxed">
              {MISSION_AND_PURPOSE.operationalScope}
            </p>
            <div className="pt-2">
              <a
                href="#/board"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/board');
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#145233] hover:underline"
              >
                <span>Meet the Board of Directors</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-[#FBF9F5] border border-[#E4DFD3] p-6 sm:p-7 space-y-3">
              <h3 className="font-serif text-lg font-semibold text-[#181A18]">Mission Statement</h3>
              <p className="text-sm text-[#3F433E] leading-relaxed">
                {MISSION_AND_PURPOSE.missionStatement}
              </p>
            </div>
            <div className="bg-[#FBF9F5] border border-[#E4DFD3] p-6 sm:p-7 space-y-3">
              <h3 className="font-serif text-lg font-semibold text-[#181A18]">Purpose Statement</h3>
              <p className="text-sm text-[#3F433E] leading-relaxed">
                {MISSION_AND_PURPOSE.purposeStatement}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Initiatives: 3-Tier Editorial Salience */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#E4DFD3]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#145233]">
              Recent Outreach &amp; Field Reports
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-medium text-[#181A18]">
              Documented impact across local and global communities.
            </h2>
          </div>
          <a
            href="#/updates"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/updates');
            }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#145233] hover:underline whitespace-nowrap shrink-0"
          >
            <span>All Field Reports</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>

        {/* Tier 1: Lead Story */}
        <article className="py-10 border-b border-[#E4DFD3] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <MediaFrame
              src={leadEvent.images[0]}
              alt={leadEvent.title}
              imgClassName="w-full aspect-[4/3] object-cover object-top"
              caption="Fig. 2 — Eagles Wings Network and Glory of Christ Church volunteers at Parkview Gardens Apartments, Riverdale, MD."
            />
          </div>
          <div className="lg:col-span-6 space-y-4">
            <p className="text-xs text-[#565B55]">
              <span>{leadEvent.categoryLabel}</span>
              <span aria-hidden="true"> · </span>
              <span>{leadEvent.date}</span>
              <span aria-hidden="true"> · </span>
              <span>{leadEvent.location}</span>
            </p>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#181A18]">
              {leadEvent.title}
            </h3>
            <p className="text-sm sm:text-base text-[#3F433E] leading-relaxed">
              {leadEvent.summary}
            </p>
            <ul className="space-y-1.5 text-sm text-[#3F433E]">
              {leadEvent.highlights.slice(0, 3).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="font-mono text-xs text-[#145233] mt-1">0{idx + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setModalEvent(leadEvent)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#145233] hover:underline cursor-pointer"
              >
                <span>Quick preview report</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/updates', { updateSlug: leadEvent.slug })}
                className="text-sm text-[#565B55] hover:text-[#181A18] hover:underline cursor-pointer"
              >
                Open full page
              </button>
            </div>
          </div>
        </article>

        {/* Tier 2: Secondary Features */}
        <div className="py-10 border-b border-[#E4DFD3] grid grid-cols-1 md:grid-cols-3 gap-8">
          {secondaryEvents.map((ev) => (
            <article key={ev.id} className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <MediaFrame
                  src={ev.images[0]}
                  alt={ev.title}
                  imgClassName="w-full aspect-[4/3] object-cover object-center"
                />
                <p className="text-xs text-[#565B55]">
                  <span>{ev.date}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{ev.location}</span>
                </p>
                <h3 className="font-serif text-xl font-medium text-[#181A18]">{ev.title}</h3>
                <p className="text-sm text-[#3F433E] leading-relaxed">{ev.summary}</p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setModalEvent(ev)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#145233] hover:underline cursor-pointer"
                >
                  <span>Read report</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Tier 3: Additional Initiatives Archive List */}
        <div className="pt-8">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[#565B55] mb-4">
            Additional Community Initiatives &amp; Collaborations
          </h3>
          <div className="divide-y divide-[#E4DFD3] border-y border-[#E4DFD3]">
            {archiveEvents.map((ev) => (
              <div
                key={ev.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <p className="text-xs text-[#565B55]">
                    <span>{ev.categoryLabel}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{ev.date}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{ev.location}</span>
                  </p>
                  <p className="font-serif text-lg font-medium text-[#181A18]">{ev.title}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalEvent(ev)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#145233] hover:underline whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-center"
                >
                  <span>View details</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donate Today Callout */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#145233] text-white p-6 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
              {MISSION_AND_PURPOSE.donateCalloutHeading}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-white">
              Your donation to Eagles Wings is a lifeline of hope.
            </h2>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-2xl">
              {MISSION_AND_PURPOSE.donateCalloutBody}
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/donate')}
              className="w-full sm:w-auto px-6 py-3.5 bg-white text-[#145233] hover:bg-[#F2EFE7] text-sm font-semibold rounded-md transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 text-center"
            >
              Proceed to Secure Donation Portal
            </button>
            <p className="text-xs text-white/80 lg:text-right break-all">
              Zelle direct giving: <span className="font-mono">{SITE_INFO.zelleEmail}</span>
            </p>
          </div>
        </div>
      </section>

      <ProgramDetailModal
        event={modalEvent}
        onClose={() => setModalEvent(null)}
        onDonate={(programId) => onNavigate('/donate', { programId })}
        onOpenFullUpdate={(updateSlug) => onNavigate('/updates', { updateSlug })}
      />
    </div>
  );
}
