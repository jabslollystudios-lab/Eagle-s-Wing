import { useState, type FormEvent } from 'react';
import { Check } from 'lucide-react';
import { SITE_INFO } from '../data/ewnData';
import type { RoutePath } from './Header';

interface FooterProps {
  onNavigate: (path: RoutePath) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [subscribedInfo, setSubscribedInfo] = useState<{
    email: string;
    alreadySubscribed: boolean;
  } | null>(null);

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Unable to subscribe right now.');
        return;
      }
      setSubscribedInfo({
        email: data.subscription?.email || trimmed,
        alreadySubscribed: Boolean(data.alreadySubscribed),
      });
      setEmail('');
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-[#E4DFD3] bg-[#F2EFE7]/70 mt-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Stay Connected Newsletter Strip */}
        <section
          aria-labelledby="footer-stay-connected"
          className="pb-10 mb-10 border-b border-[#E4DFD3] grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center"
        >
          <div className="lg:col-span-6 space-y-1.5">
            <h2
              id="footer-stay-connected"
              className="font-serif text-xl sm:text-2xl font-medium text-[#181A18]"
            >
              Stay Connected
            </h2>
            <p className="text-sm text-[#3F433E] leading-relaxed max-w-lg">
              Subscribe to receive updates on upcoming local food and health fairs, international
              medical missions, and outreach reports from Eagles Wings Network.
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribedInfo ? (
              <div
                role="status"
                className="bg-[#FBF9F5] border border-[#E4DFD3] px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-2.5 text-sm text-[#181A18]">
                  <Check
                    className="w-4 h-4 text-[#145233] mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span>
                    {subscribedInfo.alreadySubscribed
                      ? `${subscribedInfo.email} is already subscribed to outreach mission updates.`
                      : `Subscribed ${subscribedInfo.email} for outreach mission updates.`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSubscribedInfo(null)}
                  className="text-xs font-semibold text-[#145233] hover:underline whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-center"
                >
                  Subscribe another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} noValidate className="space-y-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address for outreach mission updates
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="Enter your email address"
                    className="flex-1 min-w-0 px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#D4CEC0] rounded-md text-[#181A18] placeholder:text-[#6B7069] focus:outline-2 focus:outline-[#145233]"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-[#145233] hover:bg-[#0E3D25] disabled:opacity-60 text-white text-sm font-semibold rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#145233]"
                  >
                    {submitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
                {errorMsg && (
                  <p role="alert" className="text-xs text-red-700 font-medium">
                    {errorMsg}
                  </p>
                )}
              </form>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-[#E4DFD3]">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={SITE_INFO.logo}
                alt="Eagles Wings Network"
                referrerPolicy="no-referrer"
                className="w-10 h-10 object-contain"
              />
              <div>
                <p className="font-serif text-lg font-semibold text-[#181A18]">{SITE_INFO.name}</p>
                <p className="text-xs text-[#565B55]">{SITE_INFO.footerTagline}</p>
              </div>
            </div>
            <p className="text-sm text-[#3F433E] leading-relaxed max-w-md">
              Where Compassion Takes Flight — extending a lifeline of medical and food aid to
              underserved individuals, families, and communities within the United States and
              internationally.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-[#565B55]">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Home', path: '/' as RoutePath },
                { label: 'Missions & Visions', path: '/about' as RoutePath },
                { label: 'Board of Directors', path: '/board' as RoutePath },
                { label: 'Programs & Outreach', path: '/programs' as RoutePath },
                { label: 'Media Gallery', path: '/gallery' as RoutePath },
                { label: 'Field Reports & Updates', path: '/updates' as RoutePath },
                { label: 'Donate Today', path: '/donate' as RoutePath },
                { label: 'Contact & Volunteer', path: '/contact' as RoutePath },
              ].map((item) => (
                <li key={item.path}>
                  <a
                    href={`#${item.path}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.path);
                    }}
                    className="text-[#3F433E] hover:text-[#145233] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-[#565B55]">
              Connect & Give
            </h3>
            <div className="space-y-2 text-sm text-[#3F433E]">
              <p>
                Zelle & Direct Email:{' '}
                <a
                  href={`mailto:${SITE_INFO.email}`}
                  className="font-medium text-[#145233] hover:underline"
                >
                  {SITE_INFO.email}
                </a>
              </p>
              <p>
                Community Updates:{' '}
                <a
                  href={SITE_INFO.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#145233] hover:underline"
                >
                  Official Facebook Page
                </a>
              </p>
              <p className="text-xs text-[#565B55] pt-1">
                Operating across Maryland / United States communities and international mission
                collaborations.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#565B55]">
          <p>© {new Date().getFullYear()} Eagles Wings Network. All rights reserved.</p>
          <p>{SITE_INFO.subtitle}</p>
        </div>
      </div>
    </footer>
  );
}
