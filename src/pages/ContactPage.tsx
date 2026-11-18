import { useState, type FormEvent } from 'react';
import { ExternalLink, Mail, MapPin, ShieldCheck } from 'lucide-react';
import type { RoutePath } from '../components/Header';
import { VolunteerRegistrationForm } from '../components/VolunteerRegistrationForm';
import { SITE_INFO } from '../data/ewnData';

interface ContactPageProps {
  onNavigate: (path: RoutePath) => void;
}

const TOPICS = [
  'Church or Community Partnership',
  'Sponsor / Supply Donation',
  'Youth Mentoring Program',
  'General Inquiry',
];

export function ContactPage({ onNavigate }: ContactPageProps) {
  const [activeTab, setActiveTab] = useState<'volunteer' | 'message'>('volunteer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, topic, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Unable to submit message.');
        return;
      }
      setReferenceId(data.submission?.referenceId || 'SENT');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setErrorMsg('Network error sending inquiry. Please email eagleswingsnetwork@gmail.com.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16 space-y-12">
      <header className="space-y-3 pb-8 border-b border-[#E4DFD3]">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#145233]">
          Contact &amp; Get Involved
        </p>
        <h1 className="font-serif text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.12] font-medium text-[#181A18] max-w-3xl">
          Partner, volunteer, or connect with Eagles Wings Network.
        </h1>
        <p className="text-base text-[#3F433E] max-w-2xl leading-relaxed">
          Eagles Wings Network thrives through volunteers, medical providers, local churches, and
          donors who help expand access to food, healthcare, and health education.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Volunteer Registration & General Contact Card */}
        <div className="lg:col-span-7 bg-white border border-[#E4DFD3] p-4 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-[#F2EFE7] p-1.5 rounded-lg border border-[#E4DFD3]">
            <button
              type="button"
              onClick={() => setActiveTab('volunteer')}
              className={`py-2.5 sm:py-2 px-3 min-h-[42px] text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'volunteer'
                  ? 'bg-white text-[#145233] font-semibold shadow-xs'
                  : 'text-[#3F433E] hover:text-[#181A18]'
              }`}
            >
              Volunteer Registration
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('message')}
              className={`py-2.5 sm:py-2 px-3 min-h-[42px] text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'message'
                  ? 'bg-white text-[#145233] font-semibold shadow-xs'
                  : 'text-[#3F433E] hover:text-[#181A18]'
              }`}
            >
              General Inquiry
            </button>
          </div>

          {activeTab === 'volunteer' ? (
            <VolunteerRegistrationForm />
          ) : referenceId ? (
            <div className="space-y-5 py-4">
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#145233]">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                <span>Message Received · {referenceId}</span>
              </p>
              <h2 className="font-serif text-2xl font-semibold text-[#181A18]">
                Thank you for reaching out to Eagles Wings Network.
              </h2>
              <p className="text-sm text-[#3F433E] leading-relaxed">
                Your inquiry has been logged. For urgent volunteer coordination or Zelle support,
                you can also reach us directly at{' '}
                <a
                  href={`mailto:${SITE_INFO.email}`}
                  className="font-medium text-[#145233] hover:underline"
                >
                  {SITE_INFO.email}
                </a>
                .
              </p>
              <button
                type="button"
                onClick={() => setReferenceId(null)}
                className="px-5 py-2.5 bg-[#145233] hover:bg-[#0E3D25] text-white text-sm font-semibold rounded-md transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <h2 className="font-serif text-2xl font-medium text-[#181A18]">
                  Send a General Inquiry
                </h2>
                <p className="text-sm text-[#565B55]">
                  Connect with us regarding church partnerships, sponsorships, supply donations, or
                  community collaborations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold text-[#181A18] mb-1.5"
                  >
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#D4CEC0] rounded-md bg-[#FBF9F5] focus:outline-2 focus:outline-[#145233]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold text-[#181A18] mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.org"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#D4CEC0] rounded-md bg-[#FBF9F5] focus:outline-2 focus:outline-[#145233]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-topic"
                  className="block text-xs font-semibold text-[#181A18] mb-1.5"
                >
                  Topic
                </label>
                <select
                  id="contact-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-[#D4CEC0] rounded-md bg-[#FBF9F5] text-[#181A18] focus:outline-2 focus:outline-[#145233]"
                >
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold text-[#181A18] mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share how you would like to partner or support an upcoming outreach."
                  className="w-full px-3.5 py-2.5 text-sm border border-[#D4CEC0] rounded-md bg-[#FBF9F5] focus:outline-2 focus:outline-[#145233]"
                />
              </div>

              {errorMsg && (
                <p role="alert" className="text-sm text-red-700 font-medium">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-[#145233] hover:bg-[#0E3D25] disabled:opacity-60 text-white text-sm font-semibold rounded-md transition-colors cursor-pointer"
              >
                {submitting ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        {/* Official Contact Channels */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="bg-[#F2EFE7]/80 border border-[#E4DFD3] p-6 sm:p-7 space-y-5">
            <h2 className="font-serif text-xl font-semibold text-[#181A18]">
              Official Channels &amp; Service Regions
            </h2>

            <div className="space-y-4 text-sm text-[#3F433E]">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#145233] mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-[#181A18]">Email &amp; Zelle</p>
                  <a
                    href={`mailto:${SITE_INFO.email}`}
                    className="font-mono text-[#145233] hover:underline break-all"
                  >
                    {SITE_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ExternalLink
                  className="w-4 h-4 text-[#145233] mt-1 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-[#181A18]">Facebook Community</p>
                  <a
                    href={SITE_INFO.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#145233] hover:underline"
                  >
                    Eagles Wings Network on Facebook
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#145233] mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-[#181A18]">Active Outreach Regions</p>
                  <p className="leading-relaxed">
                    United States (Maryland communities including Riverdale, Owings Mills,
                    Beltsville, and Prince George’s County) and International Collaborations
                    (Nigeria and Nicaragua).
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-[#E4DFD3] bg-white p-6 space-y-3">
            <h3 className="font-serif text-lg font-semibold text-[#181A18]">Ways to Get Involved</h3>
            <ul className="space-y-2 text-sm text-[#3F433E]">
              <li>01. Volunteer at a community food and health fair or mentoring program.</li>
              <li>02. Donate non-perishable food, over-the-counter medicines, or financial gifts.</li>
              <li>03. Share the mission with friends, local churches, and community groups.</li>
            </ul>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('/donate')}
                className="text-sm font-semibold text-[#145233] hover:underline cursor-pointer"
              >
                Go to Secure Donation Portal →
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
