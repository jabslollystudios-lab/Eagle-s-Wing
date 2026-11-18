import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { SITE_INFO } from '../data/ewnData';

export type RoutePath =
  | '/'
  | '/about'
  | '/board'
  | '/programs'
  | '/gallery'
  | '/updates'
  | '/donate'
  | '/contact';

interface HeaderProps {
  currentPath: RoutePath;
  onNavigate: (path: RoutePath) => void;
}

const MOBILE_NAV_ITEMS: { label: string; path: RoutePath }[] = [
  { label: 'Home', path: '/' },
  { label: 'Missions & Visions', path: '/about' },
  { label: 'Board of Directors', path: '/board' },
  { label: 'Programs & Initiatives', path: '/programs' },
  { label: 'Media Gallery', path: '/gallery' },
  { label: 'Events & Updates', path: '/updates' },
  { label: 'Contact & Volunteer', path: '/contact' },
];

export function Header({ currentPath, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleLink = (path: RoutePath) => {
    setMobileOpen(false);
    setAboutOpen(false);
    onNavigate(path);
  };

  const isAboutGroup = currentPath === '/about' || currentPath === '/updates';

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-sm border-b border-[#E4DFD3]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-8">
        {/* Zone 1: Brand Wordmark (logo only on mobile screens) */}
        <a
          href="#/"
          aria-label={`${SITE_INFO.name} Home`}
          onClick={(e) => {
            e.preventDefault();
            handleLink('/');
          }}
          className="flex items-center gap-2 whitespace-nowrap shrink-0 min-w-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#145233]"
        >
          <img
            src={SITE_INFO.logo}
            alt="Eagles Wings Network emblem"
            referrerPolicy="no-referrer"
            className="w-9 h-9 sm:w-8 sm:h-8 object-contain shrink-0"
          />
          <span className="hidden sm:inline font-serif text-lg font-semibold tracking-tight text-[#181A18]">
            {SITE_INFO.name}
          </span>
        </a>

        {/* Zone 2: 5 Concise Single-Line Nav Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium text-[#3F433E]"
        >
          {/* About + Updates dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            <button
              type="button"
              onClick={() => setAboutOpen((prev) => !prev)}
              aria-expanded={aboutOpen}
              className={`relative py-1 inline-flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#145233] ${
                isAboutGroup
                  ? 'text-[#145233] font-semibold'
                  : 'text-[#3F433E] hover:text-[#181A18]'
              }`}
            >
              <span>About</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  aboutOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
              {isAboutGroup && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-[#145233]"
                />
              )}
            </button>

            {aboutOpen && (
              <div className="absolute left-0 top-full pt-2 w-52 z-50">
                <div className="bg-[#FBF9F5] border border-[#E4DFD3] shadow-sm py-1.5">
                  <a
                    href="#/about"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLink('/about');
                    }}
                    className={`block px-4 py-2.5 text-sm transition-colors ${
                      currentPath === '/about'
                        ? 'text-[#145233] font-semibold bg-[#F2EFE7]'
                        : 'text-[#3F433E] hover:bg-[#F2EFE7] hover:text-[#181A18]'
                    }`}
                  >
                    Missions &amp; Visions
                  </a>
                  <a
                    href="#/updates"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLink('/updates');
                    }}
                    className={`block px-4 py-2.5 text-sm transition-colors ${
                      currentPath === '/updates'
                        ? 'text-[#145233] font-semibold bg-[#F2EFE7]'
                        : 'text-[#3F433E] hover:bg-[#F2EFE7] hover:text-[#181A18]'
                    }`}
                  >
                    Events &amp; Updates
                  </a>
                </div>
              </div>
            )}
          </div>

          {[
            { label: 'Board', path: '/board' as RoutePath },
            { label: 'Programs', path: '/programs' as RoutePath },
            { label: 'Gallery', path: '/gallery' as RoutePath },
            { label: 'Contact', path: '/contact' as RoutePath },
          ].map((item) => {
            const isActive = currentPath === item.path;
            return (
              <a
                key={item.path}
                href={`#${item.path}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLink(item.path);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#145233] ${
                  isActive
                    ? 'text-[#145233] font-semibold'
                    : 'text-[#3F433E] hover:text-[#181A18]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-[#145233]"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary CTA (+ Mobile Drawer Toggle) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleLink('/donate')}
            className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#145233] hover:bg-[#0E3D25] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#145233]"
          >
            Donate Today
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-md border border-[#E4DFD3] text-[#181A18] hover:bg-[#F2EFE7] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-[#E4DFD3] bg-[#FBF9F5] px-4 py-3 space-y-1 max-h-[80vh] overflow-y-auto"
        >
          {MOBILE_NAV_ITEMS.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <a
                key={item.path}
                href={`#${item.path}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLink(item.path);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`block px-3.5 py-3 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-[#F2EFE7] text-[#145233] font-semibold'
                    : 'text-[#3F433E] hover:bg-[#F2EFE7] hover:text-[#181A18]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      )}
    </header>
  );
}
