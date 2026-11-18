import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface GalleryLightboxProps {
  images: string[];
  title: string;
  activeIndex: number;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
}

export function GalleryLightbox({
  images,
  title,
  activeIndex,
  onClose,
  onChangeIndex,
}: GalleryLightboxProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        onChangeIndex((activeIndex - 1 + images.length) % images.length);
      }
      if (e.key === 'ArrowRight') {
        onChangeIndex((activeIndex + 1) % images.length);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex, images.length, onChangeIndex, onClose]);

  if (!images.length) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photo gallery`}
      className="fixed inset-0 z-50 bg-[#181A18]/90 backdrop-blur-sm flex flex-col justify-between p-4 sm:p-6"
    >
      <div className="flex items-center justify-between text-white max-w-[1100px] w-full mx-auto">
        <div>
          <p className="font-serif text-lg font-medium">{title}</p>
          <p className="text-xs text-white/70 font-mono tabular-nums">
            Photo {activeIndex + 1} of {images.length}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="w-11 h-11 rounded-md border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center my-4 max-w-[1100px] w-full mx-auto relative">
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => onChangeIndex((activeIndex - 1 + images.length) % images.length)}
            aria-label="Previous photo"
            className="absolute left-2 sm:left-4 z-10 w-11 h-11 rounded-md bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <img
          src={images[activeIndex]}
          alt={`${title} — photograph ${activeIndex + 1}`}
          referrerPolicy="no-referrer"
          className="max-h-[72vh] max-w-full object-contain rounded-sm border border-white/15 bg-black/40"
        />

        {images.length > 1 && (
          <button
            type="button"
            onClick={() => onChangeIndex((activeIndex + 1) % images.length)}
            aria-label="Next photo"
            className="absolute right-2 sm:right-4 z-10 w-11 h-11 rounded-md bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={img}
              type="button"
              onClick={() => onChangeIndex(idx)}
              aria-label={`Select photo ${idx + 1}`}
              className={`w-14 h-14 rounded-sm overflow-hidden border transition-opacity shrink-0 cursor-pointer ${
                idx === activeIndex
                  ? 'border-white opacity-100'
                  : 'border-white/20 opacity-55 hover:opacity-85'
              }`}
            >
              <img
                src={img}
                alt=""
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
