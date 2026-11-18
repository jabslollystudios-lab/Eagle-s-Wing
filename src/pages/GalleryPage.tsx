import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Film,
  HeartHandshake,
  Images,
  Pause,
  Play,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { GalleryLightbox } from '../components/GalleryLightbox';
import { MediaFrame } from '../components/MediaFrame';
import type { RoutePath } from '../components/Header';
import {
  GALLERY_COLLECTIONS,
  SITE_INFO,
  type GalleryCollection,
} from '../data/ewnData';

interface GalleryPageProps {
  onNavigate: (path: RoutePath, opts?: { updateSlug?: string; programId?: string }) => void;
  onQuickDonate: (programId?: string) => void;
}

type GalleryFilter = 'all' | 'local-fair' | 'international-mission' | 'youth-education' | 'reels';

const INITIAL_VISIBLE_COUNT = 8;

function mapCollectionToDonationId(col: GalleryCollection): string {
  if (col.category === 'international-mission') return 'global-medical-missions';
  if (col.category === 'youth-education') return 'back-to-school-youth';
  return 'food-health-fairs';
}

export function GalleryPage({ onNavigate, onQuickDonate }: GalleryPageProps) {
  const shouldReduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<GalleryFilter>('all');
  const [expandedCollections, setExpandedCollections] = useState<Record<string, boolean>>({});
  const [lightbox, setLightbox] = useState<{
    images: string[];
    title: string;
    index: number;
  } | null>(null);

  // Interactive Slideshow Reel Modal
  const [reelCollection, setReelCollection] = useState<GalleryCollection | null>(null);
  const [reelIndex, setReelIndex] = useState(0);
  const [reelPlaying, setReelPlaying] = useState(true);

  const totalPhotos = useMemo(
    () => GALLERY_COLLECTIONS.reduce((acc, col) => acc + col.images.length, 0),
    []
  );

  const filteredCollections = useMemo(() => {
    if (filter === 'all' || filter === 'reels') return GALLERY_COLLECTIONS;
    return GALLERY_COLLECTIONS.filter((c) => c.category === filter);
  }, [filter]);

  useEffect(() => {
    if (!reelCollection || !reelPlaying || shouldReduceMotion) return;
    const timer = window.setInterval(() => {
      setReelIndex((prev) => (prev + 1) % reelCollection.images.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [reelCollection, reelPlaying, shouldReduceMotion]);

  useEffect(() => {
    if (!reelCollection) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setReelCollection(null);
      if (e.key === 'ArrowLeft') {
        setReelIndex(
          (prev) => (prev - 1 + reelCollection.images.length) % reelCollection.images.length
        );
      }
      if (e.key === 'ArrowRight') {
        setReelIndex((prev) => (prev + 1) % reelCollection.images.length);
      }
      if (e.key === ' ') {
        e.preventDefault();
        setReelPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [reelCollection]);

  const openReel = (collection: GalleryCollection, startIndex = 0) => {
    setReelCollection(collection);
    setReelIndex(startIndex);
    setReelPlaying(!shouldReduceMotion);
  };

  const toggleExpand = (id: string) => {
    setExpandedCollections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16 space-y-12">
      {/* Header */}
      <header className="space-y-4 pb-8 border-b border-[#E4DFD3]">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#145233]">
          Outreach Media Archive ·{' '}
          <span className="font-mono tabular-nums">{totalPhotos}</span> Documented Photographs
        </p>
        <h1 className="font-serif text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.12] font-medium text-[#181A18] max-w-3xl">
          Visual record of medical clinics, health fairs, and community partnerships.
        </h1>
        <p className="text-base text-[#3F433E] max-w-2xl leading-relaxed">
          Browse every outreach photo series published on Eagles Wings Network across our local
          Maryland food and health fairs, Back-to-School Drive, and international medical missions
          in Nigeria and Nicaragua. Click any photograph for full-screen lightbox viewing or launch
          an outreach slideshow reel.
        </p>

        {/* Functional Category Filter Tabs */}
        <div className="pt-3 flex flex-wrap items-center gap-1.5 bg-[#F2EFE7] p-1.5 rounded-lg w-full sm:w-fit border border-[#E4DFD3]">
          {[
            { id: 'all' as const, label: `All Programs (${GALLERY_COLLECTIONS.length})` },
            { id: 'local-fair' as const, label: 'Local Health & Food Fairs' },
            { id: 'international-mission' as const, label: 'International Missions' },
            { id: 'youth-education' as const, label: 'Youth & Education' },
            { id: 'reels' as const, label: 'Slideshow Reels & Video' },
          ].map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-3 sm:px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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

      {/* Slideshow Reels & Video View */}
      {filter === 'reels' ? (
        <section className="space-y-8">
          <div className="bg-[#F2EFE7]/80 border border-[#E4DFD3] p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#145233]">
                Outreach Slideshow Reels &amp; Video Policy
              </p>
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#181A18]">
                Interactive field slideshow reels from official EWN galleries.
              </h2>
              <p className="text-sm text-[#3F433E] leading-relaxed">
                Eagles Wings Network publishes outreach coverage as multi-photo slideshow carousels
                rather than embedded standalone videos. Watch any program slideshow reel below, or
                visit the official Eagles Wings Network Facebook page for external community clips.
              </p>
            </div>
            <a
              href={SITE_INFO.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#D4CEC0] hover:border-[#145233] text-xs sm:text-sm font-semibold text-[#181A18] rounded-md transition-colors whitespace-nowrap shrink-0 self-start md:self-center"
            >
              <span>Official Facebook Page</span>
              <ExternalLink className="w-4 h-4 text-[#145233]" aria-hidden="true" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GALLERY_COLLECTIONS.map((col, idx) => (
              <motion.article
                key={col.id}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: shouldReduceMotion ? 0 : idx * 0.04 }}
                className="bg-white border border-[#E4DFD3] flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => openReel(col, 0)}
                    className="relative w-full text-left group cursor-pointer block overflow-hidden bg-[#F2EFE7]"
                  >
                    <img
                      src={col.images[0]}
                      alt={`${col.title} slideshow cover`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full aspect-[16/10] object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent"
                    />
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black/70 text-white text-xs font-semibold">
                      <Film className="w-3.5 h-3.5" aria-hidden="true" />
                      <span className="tabular-nums">Play {col.images.length}-Photo Reel</span>
                    </span>
                  </button>

                  <div className="p-5 space-y-2">
                    <p className="text-xs text-[#565B55]">
                      <span>{col.date}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{col.location}</span>
                    </p>
                    <h3 className="font-serif text-lg font-semibold text-[#181A18]">{col.title}</h3>
                    <p className="text-xs sm:text-sm text-[#3F433E] leading-relaxed line-clamp-3">
                      {col.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-3 border-t border-[#E4DFD3]/70">
                  <button
                    type="button"
                    onClick={() => openReel(col, 0)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#145233] hover:underline cursor-pointer py-1"
                  >
                    <Play className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Launch Slideshow</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setLightbox({ images: col.images, title: col.title, index: 0 })
                    }
                    className="text-xs font-medium text-[#565B55] hover:text-[#181A18] hover:underline cursor-pointer py-1"
                  >
                    Open Lightbox
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      ) : (
        /* Structured Program Photo Galleries */
        <div className="space-y-14">
          {filteredCollections.map((collection) => {
            const isExpanded = Boolean(expandedCollections[collection.id]);
            const visibleImages = isExpanded
              ? collection.images
              : collection.images.slice(0, INITIAL_VISIBLE_COUNT);
            const hiddenCount = collection.images.length - visibleImages.length;

            return (
              <section
                key={collection.id}
                aria-labelledby={`gallery-heading-${collection.id}`}
                className="space-y-6 pb-12 border-b border-[#E4DFD3] last:border-b-0"
              >
                {/* Collection Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
                  <div className="space-y-2 max-w-3xl">
                    <p className="text-xs text-[#565B55]">
                      <span className="font-semibold text-[#145233]">
                        {collection.categoryLabel}
                      </span>
                      <span aria-hidden="true"> · </span>
                      <span>{collection.date}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{collection.location}</span>
                      <span aria-hidden="true"> · </span>
                      <span className="font-mono tabular-nums text-[#181A18]">
                        {collection.images.length} photos
                      </span>
                    </p>
                    <h2
                      id={`gallery-heading-${collection.id}`}
                      className="font-serif text-2xl sm:text-3xl font-medium text-[#181A18]"
                    >
                      {collection.title}
                    </h2>
                    <p className="text-sm sm:text-base text-[#3F433E] leading-relaxed">
                      {collection.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => openReel(collection, 0)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-[42px] bg-[#F2EFE7] hover:bg-[#E4DFD3] border border-[#D4CEC0] text-xs sm:text-sm font-semibold text-[#181A18] rounded-md transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Play className="w-3.5 h-3.5 text-[#145233]" aria-hidden="true" />
                      <span>Play Slideshow Reel</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onQuickDonate(mapCollectionToDonationId(collection))}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-[42px] bg-[#145233] hover:bg-[#0E3D25] text-white text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <HeartHandshake className="w-4 h-4" aria-hidden="true" />
                      <span>Support Outreach</span>
                    </button>
                  </div>
                </div>

                {/* Responsive Photo Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {visibleImages.map((imgSrc, idx) => (
                    <button
                      key={imgSrc}
                      type="button"
                      onClick={() =>
                        setLightbox({
                          images: collection.images,
                          title: collection.title,
                          index: idx,
                        })
                      }
                      aria-label={`Open ${collection.title} photograph ${idx + 1} of ${collection.images.length}`}
                      className="group relative text-left bg-[#F2EFE7] border border-[#E4DFD3] overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#145233]"
                    >
                      <MediaFrame
                        src={imgSrc}
                        alt={`${collection.title} — photograph ${idx + 1}`}
                        imgClassName="w-full aspect-[4/3] object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 text-white text-[11px] font-mono tabular-nums rounded-xs opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Expand / Link Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <div className="flex flex-wrap items-center gap-4">
                    {collection.images.length > INITIAL_VISIBLE_COUNT && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(collection.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] border border-[#D4CEC0] bg-white hover:border-[#145233] text-xs sm:text-sm font-semibold text-[#181A18] rounded-md transition-colors cursor-pointer"
                      >
                        <Images className="w-4 h-4 text-[#145233]" aria-hidden="true" />
                        <span>
                          {isExpanded
                            ? 'Show fewer thumbnails'
                            : `Show all ${collection.images.length} photos (+${hiddenCount} more)`}
                        </span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setLightbox({ images: collection.images, title: collection.title, index: 0 })
                      }
                      className="text-xs sm:text-sm font-semibold text-[#145233] hover:underline cursor-pointer py-2"
                    >
                      Browse all {collection.images.length} in lightbox
                    </button>
                  </div>

                  {collection.linkedUpdateSlug && (
                    <button
                      type="button"
                      onClick={() =>
                        onNavigate('/updates', { updateSlug: collection.linkedUpdateSlug })
                      }
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#145233] hover:underline cursor-pointer py-1"
                    >
                      <span>Read Field Report</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightbox && (
        <GalleryLightbox
          images={lightbox.images}
          title={lightbox.title}
          activeIndex={lightbox.index}
          onClose={() => setLightbox(null)}
          onChangeIndex={(index) => setLightbox((prev) => (prev ? { ...prev, index } : null))}
        />
      )}

      {/* Interactive Program Slideshow Reel Modal */}
      <AnimatePresence>
        {reelCollection && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reel-modal-title"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setReelCollection(null)}
            className="fixed inset-0 z-50 bg-[#181A18]/92 backdrop-blur-sm flex flex-col justify-between p-3 sm:p-6"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-[1060px] w-full mx-auto flex items-start justify-between gap-4 text-white"
            >
              <div className="space-y-0.5 min-w-0">
                <p className="text-xs text-white/75 truncate">
                  {reelCollection.categoryLabel} · {reelCollection.date} · {reelCollection.location}
                </p>
                <h2
                  id="reel-modal-title"
                  className="font-serif text-lg sm:text-2xl font-medium truncate"
                >
                  {reelCollection.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setReelCollection(null)}
                aria-label="Close slideshow reel"
                className="w-11 h-11 rounded-md border border-white/25 flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center my-3 sm:my-4 max-w-[1060px] w-full mx-auto relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={reelCollection.images[reelIndex]}
                  src={reelCollection.images[reelIndex]}
                  alt={`${reelCollection.title} — slide ${reelIndex + 1} of ${reelCollection.images.length}`}
                  referrerPolicy="no-referrer"
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.01 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-h-[65vh] max-w-full object-contain rounded-sm border border-white/15 bg-black/50"
                />
              </AnimatePresence>

              <button
                type="button"
                onClick={() =>
                  setReelIndex(
                    (prev) =>
                      (prev - 1 + reelCollection.images.length) % reelCollection.images.length
                  )
                }
                aria-label="Previous slide"
                className="absolute left-2 sm:left-4 w-11 h-11 rounded-md bg-black/65 hover:bg-black/85 border border-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setReelIndex((prev) => (prev + 1) % reelCollection.images.length)}
                aria-label="Next slide"
                className="absolute right-2 sm:right-4 w-11 h-11 rounded-md bg-black/65 hover:bg-black/85 border border-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-[1060px] w-full mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white border-t border-white/15 pt-3"
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setReelPlaying((p) => !p)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-md bg-white/15 hover:bg-white/25 text-xs sm:text-sm font-semibold cursor-pointer"
                >
                  {reelPlaying ? (
                    <>
                      <Pause className="w-4 h-4" aria-hidden="true" />
                      <span>Pause Reel</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" aria-hidden="true" />
                      <span>Play Reel</span>
                    </>
                  )}
                </button>
                <span className="text-xs font-mono text-white/80 tabular-nums">
                  Slide {reelIndex + 1} / {reelCollection.images.length}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {reelCollection.linkedUpdateSlug && (
                  <button
                    type="button"
                    onClick={() => {
                      const slug = reelCollection.linkedUpdateSlug;
                      setReelCollection(null);
                      onNavigate('/updates', { updateSlug: slug });
                    }}
                    className="text-xs sm:text-sm text-white/85 hover:text-white hover:underline cursor-pointer"
                  >
                    Read Dispatch →
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const programId = mapCollectionToDonationId(reelCollection);
                    setReelCollection(null);
                    onQuickDonate(programId);
                  }}
                  className="px-4 py-2 min-h-[40px] bg-[#145233] hover:bg-[#0E3D25] text-white text-xs sm:text-sm font-semibold rounded-md cursor-pointer"
                >
                  Support This Program
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
