import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { GalleryLightbox } from '../components/GalleryLightbox';
import { MediaFrame } from '../components/MediaFrame';
import type { RoutePath } from '../components/Header';
import { OUTREACH_EVENTS, SITE_INFO, type OutreachEvent } from '../data/ewnData';

interface UpdatesPageProps {
  initialSlug?: string | null;
  onNavigate: (path: RoutePath) => void;
}

export function UpdatesPage({ initialSlug, onNavigate }: UpdatesPageProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug || null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (initialSlug) {
      setSelectedSlug(initialSlug);
    }
  }, [initialSlug]);

  const activeArticle: OutreachEvent | undefined = selectedSlug
    ? OUTREACH_EVENTS.find((e) => e.slug === selectedSlug)
    : undefined;

  if (activeArticle) {
    return (
      <article className="max-w-[920px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-8">
        <button
          type="button"
          onClick={() => setSelectedSlug(null)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#145233] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to all updates &amp; reports</span>
        </button>

        <header className="space-y-4 pb-8 border-b border-[#E4DFD3]">
          <p className="text-xs text-[#565B55]">
            <span>{activeArticle.categoryLabel}</span>
            <span aria-hidden="true"> · </span>
            <span>{activeArticle.date}</span>
            <span aria-hidden="true"> · </span>
            <span>{activeArticle.location}</span>
          </p>
          <h1 className="font-serif text-[clamp(1.85rem,3.4vw,2.75rem)] leading-[1.15] font-medium text-[#181A18]">
            {activeArticle.title}
          </h1>
          <p className="text-base sm:text-lg text-[#3F433E] leading-relaxed max-w-prose">
            {activeArticle.summary}
          </p>
        </header>

        {activeArticle.images.length > 0 && (
          <div className="space-y-4">
            <div
              className="cursor-pointer"
              onClick={() => setLightboxIndex(0)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setLightboxIndex(0);
              }}
            >
              <MediaFrame
                src={activeArticle.images[0]}
                alt={activeArticle.title}
                imgClassName="w-full max-h-[480px] object-cover object-top"
                caption={`Fig. 1 — ${activeArticle.title} (${activeArticle.location}). Click to enlarge gallery.`}
              />
            </div>

            {activeArticle.images.length > 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {activeArticle.images.slice(1).map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setLightboxIndex(i + 1)}
                    className="text-left cursor-pointer group"
                  >
                    <MediaFrame
                      src={img}
                      alt={`${activeArticle.title} photo ${i + 2}`}
                      imgClassName="w-full aspect-[4/3] object-cover object-center group-hover:opacity-90 transition-opacity"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Structured sections (e.g. Nicaragua Mission Trip Report) or body paragraphs */}
        <div className="space-y-6 text-base text-[#3F433E] leading-[1.75] max-w-prose">
          {activeArticle.sections ? (
            activeArticle.sections.map((sec) => (
              <section key={sec.heading} className="space-y-2">
                <h2 className="font-serif text-xl font-semibold text-[#181A18]">{sec.heading}</h2>
                <p>{sec.body}</p>
              </section>
            ))
          ) : (
            activeArticle.bodyParagraphs.map((para, idx) => <p key={idx}>{para}</p>)
          )}

          {activeArticle.highlights.length > 0 && (
            <section className="pt-4 border-t border-[#E4DFD3] space-y-3">
              <h2 className="font-serif text-xl font-semibold text-[#181A18]">Event Highlights</h2>
              <ul className="space-y-2 text-sm sm:text-base">
                {activeArticle.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="font-mono text-xs text-[#145233] mt-1.5 tabular-nums">
                      0{idx + 1}.
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(activeArticle.partners || activeArticle.sponsors) && (
            <section className="bg-[#F2EFE7] border border-[#E4DFD3] p-5 space-y-2 text-sm">
              <h2 className="font-serif text-base font-semibold text-[#181A18]">
                Partners &amp; Sponsors
              </h2>
              {activeArticle.partners && (
                <p>
                  <strong>Collaborating Partners:</strong> {activeArticle.partners.join(', ')}
                </p>
              )}
              {activeArticle.sponsors && (
                <p>
                  <strong>Sponsors:</strong> {activeArticle.sponsors.join('; ')}
                </p>
              )}
            </section>
          )}
        </div>

        {/* How You Can Support Callout */}
        <aside className="bg-[#F2EFE7]/75 border border-[#E4DFD3] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <h2 className="font-serif text-xl font-semibold text-[#181A18]">How You Can Support</h2>
            <p className="text-sm text-[#3F433E] leading-relaxed">
              Your partnership enables Eagles Wings Network to continue delivering food, health
              screenings, and education. Donate online or via Zelle:{' '}
              <span className="font-mono text-[#145233]">{SITE_INFO.zelleEmail}</span>.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/donate')}
            className="px-5 py-2.5 bg-[#145233] hover:bg-[#0E3D25] text-white text-sm font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Donate Today
          </button>
        </aside>

        {lightboxIndex !== null && (
          <GalleryLightbox
            images={activeArticle.images}
            title={activeArticle.title}
            activeIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onChangeIndex={setLightboxIndex}
          />
        )}
      </article>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      <header className="space-y-4 pb-8 border-b border-[#E4DFD3]">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#145233]">
          Events &amp; Updates
        </p>
        <h1 className="font-serif text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.12] font-medium text-[#181A18] max-w-3xl">
          Field reports, community health fairs, and mission dispatches.
        </h1>
        <p className="text-base text-[#3F433E] max-w-2xl leading-relaxed">
          Chronological archive of outreach reports and program updates published by Eagles Wings
          Network.
        </p>
      </header>

      <div className="divide-y divide-[#E4DFD3] border-b border-[#E4DFD3]">
        {OUTREACH_EVENTS.map((item) => (
          <article
            key={item.id}
            className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start"
          >
            <div className="lg:col-span-4">
              <MediaFrame
                src={item.images[0]}
                alt={item.title}
                imgClassName="w-full aspect-[4/3] object-cover object-top"
              />
            </div>

            <div className="lg:col-span-8 space-y-3">
              <p className="text-xs text-[#565B55]">
                <span>{item.date}</span>
                <span aria-hidden="true"> · </span>
                <span>{item.categoryLabel}</span>
                <span aria-hidden="true"> · </span>
                <span>{item.location}</span>
              </p>

              <h2 className="font-serif text-2xl font-medium text-[#181A18]">{item.title}</h2>

              <p className="text-sm sm:text-base text-[#3F433E] leading-relaxed max-w-prose">
                {item.summary}
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSlug(item.slug)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#145233] hover:underline cursor-pointer"
                >
                  <span>Read full update</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
