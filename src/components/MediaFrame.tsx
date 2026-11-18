import { useState } from 'react';
import { HeartHandshake } from 'lucide-react';

interface MediaFrameProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  caption?: string;
  fallbackTitle?: string;
}

export function MediaFrame({
  src,
  alt,
  className = '',
  imgClassName = 'w-full h-full object-cover',
  caption,
  fallbackTitle,
}: MediaFrameProps) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className={className}>
      <div className="relative w-full h-full overflow-hidden bg-[#F2EFE7] border border-[#E4DFD3]">
        {!failed ? (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className={imgClassName}
          />
        ) : (
          <div className="w-full h-full min-h-[180px] flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#F2EFE7] to-[#E9E4D8]">
            <HeartHandshake className="w-7 h-7 text-[#145233] mb-2" aria-hidden="true" />
            <span className="font-serif text-sm text-[#181A18]">
              {fallbackTitle || 'Eagles Wings Network'}
            </span>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2.5 text-xs font-serif italic text-[#565B55] leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
