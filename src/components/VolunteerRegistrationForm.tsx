import { useState, type FormEvent } from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import { SITE_INFO } from '../data/ewnData';

export type VolunteerInterestArea = 'medical' | 'logistical' | 'educational';

interface InterestOption {
  id: VolunteerInterestArea;
  title: string;
  description: string;
}

const INTEREST_OPTIONS: InterestOption[] = [
  {
    id: 'medical',
    title: 'Medical',
    description:
      'Healthcare professionals and volunteers assisting with blood pressure and blood sugar screenings, clinic care, and medication distribution.',
  },
  {
    id: 'logistical',
    title: 'Logistical',
    description:
      'Event setup, flyer outreach, packing and distributing groceries, clothing, baby supplies, and bilingual interpretation.',
  },
  {
    id: 'educational',
    title: 'Educational',
    description:
      'Nutrition and disease prevention guidance, health education, Back-to-School drives, and youth mentoring.',
  },
];

const AVAILABILITY_DAYS = [
  'Weekdays',
  'Saturdays / Weekends',
  'Flexible / On-Call',
];

const COMMITMENT_OPTIONS = [
  'Single Local Outreach Event',
  'Recurring Monthly Health & Food Fairs',
  'Multi-Day International Mission Trip',
];

const REGION_PREFERENCES = [
  'Local Community Fairs (Maryland)',
  'International Missions',
  'Both Local & International',
];

interface RegistrationReceipt {
  registrationId: string;
  fullName: string;
  email: string;
  interests: VolunteerInterestArea[];
  availabilityDays: string[];
  commitment: string;
  regionPreference: string;
  createdAt: string;
}

export function VolunteerRegistrationForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interests, setInterests] = useState<VolunteerInterestArea[]>(['medical']);
  const [medicalCredential, setMedicalCredential] = useState('');
  const [availabilityDays, setAvailabilityDays] = useState<string[]>(['Saturdays / Weekends']);
  const [commitment, setCommitment] = useState(COMMITMENT_OPTIONS[0]);
  const [regionPreference, setRegionPreference] = useState(REGION_PREFERENCES[0]);
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<RegistrationReceipt | null>(null);

  const toggleInterest = (area: VolunteerInterestArea) => {
    setInterests((prev) =>
      prev.includes(area) ? prev.filter((item) => item !== area) : [...prev, area]
    );
    if (errorMsg) setErrorMsg(null);
  };

  const toggleDay = (day: string) => {
    setAvailabilityDays((prev) =>
      prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day]
    );
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (interests.length === 0) {
      setErrorMsg('Please select at least one area of interest (Medical, Logistical, or Educational).');
      return;
    }
    if (availabilityDays.length === 0) {
      setErrorMsg('Please select at least one availability option.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/volunteers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          interests,
          medicalCredential: interests.includes('medical') ? medicalCredential : undefined,
          availabilityDays,
          commitment,
          regionPreference,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Unable to submit volunteer registration.');
        return;
      }
      setReceipt(data.registration);
    } catch {
      setErrorMsg(`Network error submitting registration. Please email ${SITE_INFO.email}.`);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setReceipt(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setInterests(['medical']);
    setMedicalCredential('');
    setAvailabilityDays(['Saturdays / Weekends']);
    setCommitment(COMMITMENT_OPTIONS[0]);
    setRegionPreference(REGION_PREFERENCES[0]);
    setNotes('');
    setErrorMsg(null);
  };

  if (receipt) {
    return (
      <div className="space-y-6 py-2">
        <div className="space-y-2 pb-4 border-b border-[#E4DFD3]">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#145233]">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>Volunteer Registered · {receipt.registrationId}</span>
          </p>
          <h2 className="font-serif text-2xl font-semibold text-[#181A18]">
            Thank you for volunteering, {receipt.fullName}.
          </h2>
          <p className="text-sm text-[#3F433E] leading-relaxed">
            Your volunteer profile and availability have been recorded. Our outreach coordinators
            will contact you at <span className="font-medium text-[#181A18]">{receipt.email}</span>{' '}
            ahead of upcoming missions.
          </p>
        </div>

        <dl className="divide-y divide-[#E4DFD3] border-y border-[#E4DFD3] text-sm">
          <div className="py-3 flex justify-between gap-4">
            <dt className="text-[#565B55]">Areas of Interest</dt>
            <dd className="font-medium text-[#181A18] capitalize text-right">
              {receipt.interests.join(', ')}
            </dd>
          </div>
          <div className="py-3 flex justify-between gap-4">
            <dt className="text-[#565B55]">Availability</dt>
            <dd className="font-medium text-[#181A18] text-right">
              {receipt.availabilityDays.join(', ')}
            </dd>
          </div>
          <div className="py-3 flex justify-between gap-4">
            <dt className="text-[#565B55]">Commitment</dt>
            <dd className="text-[#181A18] text-right">{receipt.commitment}</dd>
          </div>
          <div className="py-3 flex justify-between gap-4">
            <dt className="text-[#565B55]">Outreach Preference</dt>
            <dd className="text-[#181A18] text-right">{receipt.regionPreference}</dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={resetForm}
          className="px-5 py-2.5 bg-[#145233] hover:bg-[#0E3D25] text-white text-sm font-semibold rounded-md transition-colors cursor-pointer"
        >
          Register Another Volunteer
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <h2 className="font-serif text-2xl font-medium text-[#181A18]">
          Volunteer Registration
        </h2>
        <p className="text-sm text-[#565B55]">
          Indicate your areas of interest and availability to assist with upcoming local food and
          health fairs or international medical missions.
        </p>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <span className="block text-xs font-semibold uppercase tracking-wider text-[#565B55]">
          01. Volunteer Details
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="vol-name"
              className="block text-xs font-semibold text-[#181A18] mb-1.5"
            >
              Full Name
            </label>
            <input
              id="vol-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-3.5 py-2.5 text-sm border border-[#D4CEC0] rounded-md bg-[#FBF9F5] focus:outline-2 focus:outline-[#145233]"
            />
          </div>
          <div>
            <label
              htmlFor="vol-email"
              className="block text-xs font-semibold text-[#181A18] mb-1.5"
            >
              Email Address
            </label>
            <input
              id="vol-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.org"
              className="w-full px-3.5 py-2.5 text-sm border border-[#D4CEC0] rounded-md bg-[#FBF9F5] focus:outline-2 focus:outline-[#145233]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="vol-phone"
              className="block text-xs font-semibold text-[#181A18] mb-1.5"
            >
              Phone Number (Optional)
            </label>
            <input
              id="vol-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full px-3.5 py-2.5 text-sm border border-[#D4CEC0] rounded-md bg-[#FBF9F5] focus:outline-2 focus:outline-[#145233]"
            />
          </div>
          <div>
            <label
              htmlFor="vol-region"
              className="block text-xs font-semibold text-[#181A18] mb-1.5"
            >
              Outreach Scope
            </label>
            <select
              id="vol-region"
              value={regionPreference}
              onChange={(e) => setRegionPreference(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-[#D4CEC0] rounded-md bg-[#FBF9F5] text-[#181A18] focus:outline-2 focus:outline-[#145233]"
            >
              {REGION_PREFERENCES.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Areas of Interest */}
      <fieldset className="space-y-3 pt-2 border-t border-[#E4DFD3]">
        <legend className="text-xs font-semibold uppercase tracking-wider text-[#565B55] pt-2">
          02. Areas of Interest (Select all that apply)
        </legend>

        <div className="grid grid-cols-1 gap-2.5">
          {INTEREST_OPTIONS.map((opt) => {
            const selected = interests.includes(opt.id);
            return (
              <label
                key={opt.id}
                className={`flex items-start gap-3 p-3.5 border rounded-md cursor-pointer transition-colors ${
                  selected
                    ? 'border-[#145233] bg-[#F2EFE7]/70'
                    : 'border-[#D4CEC0] bg-[#FBF9F5] hover:border-[#145233]/60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleInterest(opt.id)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`mt-0.5 w-4 h-4 rounded-xs border flex items-center justify-center shrink-0 transition-colors ${
                    selected
                      ? 'bg-[#145233] border-[#145233] text-white'
                      : 'bg-white border-[#B9B2A3]'
                  }`}
                >
                  {selected && <Check className="w-3 h-3" />}
                </span>
                <span className="space-y-0.5">
                  <span className="block text-sm font-semibold text-[#181A18]">{opt.title}</span>
                  <span className="block text-xs text-[#3F433E] leading-relaxed">
                    {opt.description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>

        {interests.includes('medical') && (
          <div className="pt-1">
            <label
              htmlFor="vol-credential"
              className="block text-xs font-semibold text-[#181A18] mb-1.5"
            >
              Clinical Role or Background (Optional)
            </label>
            <input
              id="vol-credential"
              type="text"
              value={medicalCredential}
              onChange={(e) => setMedicalCredential(e.target.value)}
              placeholder="e.g., Physician, Registered Nurse, Pharmacist, Nursing Student"
              className="w-full px-3.5 py-2.5 text-sm border border-[#D4CEC0] rounded-md bg-[#FBF9F5] focus:outline-2 focus:outline-[#145233]"
            />
          </div>
        )}
      </fieldset>

      {/* Availability */}
      <div className="space-y-4 pt-2 border-t border-[#E4DFD3]">
        <span className="block text-xs font-semibold uppercase tracking-wider text-[#565B55] pt-2">
          03. Availability
        </span>

        <div className="space-y-2">
          <span className="block text-xs font-semibold text-[#181A18]">
            Schedule Availability
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {AVAILABILITY_DAYS.map((day) => {
              const active = availabilityDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  aria-pressed={active}
                  className={`py-2.5 px-3 text-xs sm:text-sm font-medium rounded-md border transition-colors cursor-pointer whitespace-nowrap truncate ${
                    active
                      ? 'border-[#145233] bg-[#145233] text-white'
                      : 'border-[#D4CEC0] bg-[#FBF9F5] text-[#181A18] hover:border-[#145233]'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label
            htmlFor="vol-commitment"
            className="block text-xs font-semibold text-[#181A18] mb-1.5"
          >
            Preferred Commitment
          </label>
          <select
            id="vol-commitment"
            value={commitment}
            onChange={(e) => setCommitment(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-[#D4CEC0] rounded-md bg-[#FBF9F5] text-[#181A18] focus:outline-2 focus:outline-[#145233]"
          >
            {COMMITMENT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="vol-notes"
            className="block text-xs font-semibold text-[#181A18] mb-1.5"
          >
            Additional Availability or Language Skills (Optional)
          </label>
          <textarea
            id="vol-notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Share specific dates, language fluency (e.g., Spanish interpretation), or relevant outreach experience."
            className="w-full px-3.5 py-2.5 text-sm border border-[#D4CEC0] rounded-md bg-[#FBF9F5] focus:outline-2 focus:outline-[#145233]"
          />
        </div>
      </div>

      {errorMsg && (
        <p role="alert" className="text-sm text-red-700 font-medium">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto px-6 py-3 bg-[#145233] hover:bg-[#0E3D25] disabled:opacity-60 text-white text-sm font-semibold rounded-md transition-colors cursor-pointer"
      >
        {submitting ? 'Submitting Registration...' : 'Submit Volunteer Registration'}
      </button>
    </form>
  );
}
