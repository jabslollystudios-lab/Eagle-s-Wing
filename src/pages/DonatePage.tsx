import { useEffect, useState, type FormEvent } from 'react';
import { Check, Copy, CreditCard, Lock, Printer, ShieldCheck } from 'lucide-react';
import {
  AREAS_OF_NEED,
  DONATION_DESIGNATIONS,
  MISSION_AND_PURPOSE,
  SITE_INFO,
} from '../data/ewnData';

interface DonatePageProps {
  initialProgramId?: string | null;
}

interface Receipt {
  receiptId: string;
  intentId: string;
  amountCents: number;
  currency: string;
  frequency: 'one-time' | 'monthly';
  designationLabel: string;
  donorName: string;
  donorEmail: string;
  method: 'card' | 'zelle';
  cardBrand?: string;
  last4?: string;
  gatewayMode: 'stripe' | 'secure_gateway' | 'zelle_direct';
  confirmedAt: string;
}

const PRESET_AMOUNTS = [25, 50, 100, 250, 500];

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

export function DonatePage({ initialProgramId }: DonatePageProps) {
  const [givingMode, setGivingMode] = useState<'card' | 'zelle' | 'inkind'>('card');
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [designationId, setDesignationId] = useState<string>(
    initialProgramId || DONATION_DESIGNATIONS[0].id
  );
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [note, setNote] = useState('');

  // Card gateway fields
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [billingZip, setBillingZip] = useState('');

  // In-kind pledge fields
  const [inKindItems, setInKindItems] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [inKindConfirmed, setInKindConfirmed] = useState<string | null>(null);
  const [copiedZelle, setCopiedZelle] = useState(false);

  useEffect(() => {
    if (initialProgramId) {
      setDesignationId(initialProgramId);
    }
  }, [initialProgramId]);

  const activeAmount = customAmount.trim() ? Number(customAmount) : selectedAmount;
  const selectedDesignation =
    DONATION_DESIGNATIONS.find((d) => d.id === designationId) || DONATION_DESIGNATIONS[0];

  const handleCopyZelle = async () => {
    try {
      await navigator.clipboard.writeText(SITE_INFO.zelleEmail);
      setCopiedZelle(true);
      setTimeout(() => setCopiedZelle(false), 2000);
    } catch {
      setCopiedZelle(false);
    }
  };

  const handleCardOrZelleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!Number.isFinite(activeAmount) || activeAmount < 5) {
      setErrorMsg('Please select or enter a contribution amount of at least $5.');
      return;
    }

    setSubmitting(true);
    try {
      const intentRes = await fetch('/api/donations/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountDollars: activeAmount,
          frequency,
          designationId: selectedDesignation.id,
          designationLabel: selectedDesignation.label,
          donorName,
          donorEmail,
          note,
          method: givingMode === 'zelle' ? 'zelle' : 'card',
        }),
      });
      const intentData = await intentRes.json();
      if (!intentRes.ok) {
        setErrorMsg(intentData.error || 'Could not start donation checkout.');
        setSubmitting(false);
        return;
      }

      const confirmRes = await fetch('/api/donations/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intentId: intentData.intentId,
          cardNumber,
          expiry,
          cvc,
          billingZip,
        }),
      });
      const confirmData = await confirmRes.json();
      if (!confirmRes.ok) {
        setErrorMsg(confirmData.error || 'Payment authorization was not completed.');
        setSubmitting(false);
        return;
      }

      setReceipt(confirmData.receipt);
    } catch {
      setErrorMsg('Network error reaching the payment gateway. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInKindSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: donorName,
          email: donorEmail,
          topic: 'In-Kind Supply Donation Pledge',
          message: `Program designation: ${selectedDesignation.label}. Items pledged: ${inKindItems}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Could not submit pledge.');
        return;
      }
      setInKindConfirmed(data.submission?.referenceId || 'SUBMITTED');
    } catch {
      setErrorMsg('Unable to send pledge right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16 space-y-10">
      <header className="space-y-3 pb-8 border-b border-[#E4DFD3]">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#145233]">
          {MISSION_AND_PURPOSE.donateCalloutHeading}
        </p>
        <h1 className="font-serif text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.12] font-medium text-[#181A18] max-w-3xl">
          Support medical care, nutritious groceries, and hope for underserved communities.
        </h1>
        <p className="text-base text-[#3F433E] max-w-2xl leading-relaxed">
          {MISSION_AND_PURPOSE.donateCalloutBody}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Main Donation Portal */}
        <div className="lg:col-span-7 bg-white border border-[#E4DFD3] p-4 sm:p-8 space-y-6">
          {receipt ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#E4DFD3]">
                <div className="space-y-1">
                  <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#145233]">
                    <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                    <span>
                      {receipt.method === 'zelle'
                        ? 'Zelle Pledge Recorded'
                        : 'Contribution Confirmed'}
                    </span>
                  </p>
                  <h2 className="font-serif text-2xl font-semibold text-[#181A18]">
                    Thank you, {receipt.donorName}.
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-[#E4DFD3] rounded-md text-[#181A18] hover:bg-[#F2EFE7] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Print Receipt</span>
                </button>
              </div>

              <dl className="divide-y divide-[#E4DFD3] border-y border-[#E4DFD3] text-sm">
                <div className="py-3 flex justify-between gap-4">
                  <dt className="text-[#565B55]">Receipt Reference</dt>
                  <dd className="font-mono font-medium text-[#181A18] tabular-nums">
                    {receipt.receiptId}
                  </dd>
                </div>
                <div className="py-3 flex justify-between gap-4">
                  <dt className="text-[#565B55]">Contribution Amount</dt>
                  <dd className="font-mono font-semibold text-[#145233] tabular-nums">
                    ${(receipt.amountCents / 100).toFixed(2)} USD (
                    {receipt.frequency === 'monthly' ? 'Monthly' : 'One-Time'})
                  </dd>
                </div>
                <div className="py-3 flex justify-between gap-4">
                  <dt className="text-[#565B55]">Program Designation</dt>
                  <dd className="font-medium text-[#181A18] text-right">
                    {receipt.designationLabel}
                  </dd>
                </div>
                <div className="py-3 flex justify-between gap-4">
                  <dt className="text-[#565B55]">Payment Channel</dt>
                  <dd className="text-[#181A18]">
                    {receipt.method === 'card'
                      ? `${receipt.cardBrand} ending in ${receipt.last4}`
                      : `Zelle Direct (${SITE_INFO.zelleEmail})`}
                  </dd>
                </div>
                <div className="py-3 flex justify-between gap-4">
                  <dt className="text-[#565B55]">Receipt Email</dt>
                  <dd className="text-[#181A18]">{receipt.donorEmail}</dd>
                </div>
              </dl>

              {receipt.method === 'zelle' && (
                <div className="bg-[#F2EFE7] border border-[#E4DFD3] p-4 text-sm text-[#3F433E] space-y-1">
                  <p className="font-semibold text-[#181A18]">Complete Your Zelle Transfer</p>
                  <p>
                    Open your banking app and send{' '}
                    <strong className="font-mono">
                      ${(receipt.amountCents / 100).toFixed(2)}
                    </strong>{' '}
                    via Zelle to{' '}
                    <strong className="font-mono text-[#145233]">{SITE_INFO.zelleEmail}</strong>{' '}
                    with memo <span className="font-mono">{receipt.receiptId}</span>.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setReceipt(null);
                  setCardNumber('');
                  setExpiry('');
                  setCvc('');
                }}
                className="px-5 py-2.5 bg-[#145233] hover:bg-[#0E3D25] text-white text-sm font-semibold rounded-md transition-colors cursor-pointer"
              >
                Make Another Contribution
              </button>
            </div>
          ) : (
            <>
              {/* Payment Method Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 bg-[#F2EFE7] p-1.5 rounded-lg border border-[#E4DFD3]">
                {[
                  { id: 'card' as const, label: 'Card Gateway' },
                  { id: 'zelle' as const, label: 'Zelle Transfer' },
                  { id: 'inkind' as const, label: 'In-Kind Supplies' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setGivingMode(tab.id);
                      setErrorMsg(null);
                    }}
                    className={`py-2.5 sm:py-2 px-3 min-h-[42px] text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      givingMode === tab.id
                        ? 'bg-white text-[#145233] font-semibold shadow-xs'
                        : 'text-[#3F433E] hover:text-[#181A18]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {givingMode === 'inkind' ? (
                inKindConfirmed ? (
                  <div className="space-y-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#145233]">
                      Pledge Recorded · {inKindConfirmed}
                    </p>
                    <h2 className="font-serif text-2xl font-medium text-[#181A18]">
                      Thank you for pledging medical or food supplies.
                    </h2>
                    <p className="text-sm text-[#3F433E] leading-relaxed">
                      Our outreach coordinator will follow up at{' '}
                      <span className="font-medium">{donorEmail}</span> regarding collection
                      logistics for upcoming Maryland or international missions.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setInKindConfirmed(null);
                        setInKindItems('');
                      }}
                      className="px-4 py-2 bg-[#145233] text-white text-sm font-semibold rounded-md cursor-pointer"
                    >
                      Submit Another Pledge
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInKindSubmit} className="space-y-5">
                    <div className="space-y-1">
                      <h2 className="font-serif text-xl font-semibold text-[#181A18]">
                        Pledge Food, Medicines, or Supplies
                      </h2>
                      <p className="text-sm text-[#3F433E]">
                        Eagles Wings Network welcomes donations of non-perishable food,
                        over-the-counter medicines, reading glasses, toothbrushes, toothpaste, baby
                        wipes, formula, and school supplies.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="inkind-name"
                          className="block text-xs font-semibold text-[#181A18] mb-1.5"
                        >
                          Full Name or Organization
                        </label>
                        <input
                          id="inkind-name"
                          type="text"
                          required
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          placeholder="Full name"
                          className="w-full px-3.5 py-2.5 text-sm border border-[#D4CEC0] rounded-md bg-[#FBF9F5] focus:outline-2 focus:outline-[#145233]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="inkind-email"
                          className="block text-xs font-semibold text-[#181A18] mb-1.5"
                        >
                          Email Address
                        </label>
                        <input
                          id="inkind-email"
                          type="email"
                          required
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          placeholder="you@example.org"
                          className="w-full px-3.5 py-2.5 text-sm border border-[#D4CEC0] rounded-md bg-[#FBF9F5] focus:outline-2 focus:outline-[#145233]"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="inkind-items"
                        className="block text-xs font-semibold text-[#181A18] mb-1.5"
                      >
                        Items &amp; Approximate Quantities
                      </label>
                      <textarea
                        id="inkind-items"
                        rows={4}
                        required
                        value={inKindItems}
                        onChange={(e) => setInKindItems(e.target.value)}
                        placeholder="e.g., Non-perishable groceries, multivitamins, reading glasses, or notebooks & school supplies"
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
                      className="w-full py-3 bg-[#145233] hover:bg-[#0E3D25] disabled:opacity-60 text-white text-sm font-semibold rounded-md transition-colors cursor-pointer"
                    >
                      {submitting ? 'Recording Pledge...' : 'Submit Supply Donation Pledge'}
                    </button>
                  </form>
                )
              ) : (
                <form onSubmit={handleCardOrZelleSubmit} className="space-y-6">
                  {/* Frequency */}
                  <div className="space-y-2">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[#565B55]">
                      01. Gift Frequency
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'one-time' as const, label: 'One-Time Gift' },
                        { id: 'monthly' as const, label: 'Monthly Support' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setFrequency(opt.id)}
                          className={`py-2.5 px-4 text-sm font-medium rounded-md border transition-colors cursor-pointer ${
                            frequency === opt.id
                              ? 'border-[#145233] bg-[#145233] text-white'
                              : 'border-[#D4CEC0] bg-[#FBF9F5] text-[#181A18] hover:border-[#145233]'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[#565B55]">
                      02. Select Amount (USD)
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                      {PRESET_AMOUNTS.map((amt) => {
                        const isSelected = !customAmount.trim() && selectedAmount === amt;
                        return (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => {
                              setSelectedAmount(amt);
                              setCustomAmount('');
                            }}
                            className={`py-2.5 px-3 text-sm font-mono font-semibold rounded-md border tabular-nums transition-colors cursor-pointer ${
                              isSelected
                                ? 'border-[#145233] bg-[#145233] text-white'
                                : 'border-[#D4CEC0] bg-[#FBF9F5] text-[#181A18] hover:border-[#145233]'
                            }`}
                          >
                            ${amt}
                          </button>
                        );
                      })}
                    </div>
                    <div className="pt-1">
                      <label htmlFor="custom-amount" className="sr-only">
                        Custom contribution amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm text-[#565B55]">
                          $
                        </span>
                        <input
                          id="custom-amount"
                          type="number"
                          min={5}
                          step="1"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          placeholder="Other amount (min $5)"
                          className="w-full pl-8 pr-4 py-2.5 text-sm font-mono tabular-nums border border-[#D4CEC0] rounded-md bg-[#FBF9F5] focus:outline-2 focus:outline-[#145233]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Program Designation */}
                  <div className="space-y-2">
                    <label
                      htmlFor="program-designation"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#565B55]"
                    >
                      03. Program Designation
                    </label>
                    <select
                      id="program-designation"
                      value={designationId}
                      onChange={(e) => setDesignationId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-[#D4CEC0] rounded-md bg-[#FBF9F5] text-[#181A18] focus:outline-2 focus:outline-[#145233]"
                    >
                      {DONATION_DESIGNATIONS.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-[#565B55]">{selectedDesignation.description}</p>
                  </div>

                  {/* Donor Details */}
                  <div className="space-y-3 pt-2 border-t border-[#E4DFD3]">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[#565B55]">
                      04. Donor Information
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="donor-name"
                          className="block text-xs font-semibold text-[#181A18] mb-1.5"
                        >
                          Full Name
                        </label>
                        <input
                          id="donor-name"
                          type="text"
                          required
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          placeholder="Full name"
                          className="w-full px-3.5 py-2.5 text-sm border border-[#D4CEC0] rounded-md bg-[#FBF9F5] focus:outline-2 focus:outline-[#145233]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="donor-email"
                          className="block text-xs font-semibold text-[#181A18] mb-1.5"
                        >
                          Email for Tax-Deductible Receipt
                        </label>
                        <input
                          id="donor-email"
                          type="email"
                          required
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          placeholder="you@example.org"
                          className="w-full px-3.5 py-2.5 text-sm border border-[#D4CEC0] rounded-md bg-[#FBF9F5] focus:outline-2 focus:outline-[#145233]"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="donor-note"
                        className="block text-xs font-semibold text-[#181A18] mb-1.5"
                      >
                        Optional Note or Dedication
                      </label>
                      <input
                        id="donor-note"
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Optional message for the outreach team"
                        className="w-full px-3.5 py-2.5 text-sm border border-[#D4CEC0] rounded-md bg-[#FBF9F5] focus:outline-2 focus:outline-[#145233]"
                      />
                    </div>
                  </div>

                  {/* Gateway Section: Card or Zelle */}
                  {givingMode === 'card' ? (
                    <div className="space-y-3 pt-2 border-t border-[#E4DFD3]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#565B55]">
                          05. Payment Gateway Details
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-[#145233] font-medium">
                          <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Encrypted Checkout</span>
                        </span>
                      </div>

                      <div>
                        <label
                          htmlFor="card-number"
                          className="block text-xs font-semibold text-[#181A18] mb-1.5"
                        >
                          Card Number
                        </label>
                        <div className="relative">
                          <CreditCard
                            className="w-4 h-4 text-[#565B55] absolute left-3.5 top-1/2 -translate-y-1/2"
                            aria-hidden="true"
                          />
                          <input
                            id="card-number"
                            type="text"
                            inputMode="numeric"
                            autoComplete="cc-number"
                            required
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            placeholder="1234 5678 9012 3456"
                            className="w-full pl-10 pr-4 py-2.5 text-sm font-mono tabular-nums border border-[#D4CEC0] rounded-md bg-[#FBF9F5] focus:outline-2 focus:outline-[#145233]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label
                            htmlFor="card-expiry"
                            className="block text-xs font-semibold text-[#181A18] mb-1.5"
                          >
                            Expiration
                          </label>
                          <input
                            id="card-expiry"
                            type="text"
                            inputMode="numeric"
                            autoComplete="cc-exp"
                            required
                            value={expiry}
                            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                            placeholder="MM/YY"
                            className="w-full px-3 py-2.5 text-sm font-mono tabular-nums border border-[#D4CEC0] rounded-md bg-[#FBF9F5] focus:outline-2 focus:outline-[#145233]"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="card-cvc"
                            className="block text-xs font-semibold text-[#181A18] mb-1.5"
                          >
                            CVC
                          </label>
                          <input
                            id="card-cvc"
                            type="text"
                            inputMode="numeric"
                            autoComplete="cc-csc"
                            required
                            maxLength={4}
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            placeholder="123"
                            className="w-full px-3 py-2.5 text-sm font-mono tabular-nums border border-[#D4CEC0] rounded-md bg-[#FBF9F5] focus:outline-2 focus:outline-[#145233]"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="card-zip"
                            className="block text-xs font-semibold text-[#181A18] mb-1.5"
                          >
                            Billing ZIP
                          </label>
                          <input
                            id="card-zip"
                            type="text"
                            autoComplete="postal-code"
                            required
                            value={billingZip}
                            onChange={(e) => setBillingZip(e.target.value)}
                            placeholder="20705"
                            className="w-full px-3 py-2.5 text-sm font-mono tabular-nums border border-[#D4CEC0] rounded-md bg-[#FBF9F5] focus:outline-2 focus:outline-[#145233]"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#F2EFE7] border border-[#E4DFD3] p-5 space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#145233]">
                        Official Zelle Giving Channel
                      </p>
                      <p className="text-sm text-[#3F433E]">
                        As published on Eagles Wings Network updates, direct contributions can be
                        sent via Zelle to:
                      </p>
                      <div className="flex items-center justify-between gap-3 bg-white border border-[#E4DFD3] px-3.5 py-2.5 rounded-md">
                        <span className="font-mono text-sm font-medium text-[#181A18] truncate">
                          {SITE_INFO.zelleEmail}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyZelle}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#145233] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          {copiedZelle ? (
                            <>
                              <Check className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Copy Email</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-[#565B55]">
                        Submit below to generate a contribution reference ID for your Zelle memo and
                        receipt record.
                      </p>
                    </div>
                  )}

                  {errorMsg && (
                    <p role="alert" className="text-sm text-red-700 font-medium">
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 bg-[#145233] hover:bg-[#0E3D25] disabled:opacity-60 text-white text-sm font-semibold rounded-md transition-colors cursor-pointer tabular-nums"
                  >
                    {submitting
                      ? 'Processing Securely...'
                      : givingMode === 'zelle'
                        ? `Record $${Number.isFinite(activeAmount) ? activeAmount.toFixed(2) : '0.00'} Zelle Contribution`
                        : `Complete $${Number.isFinite(activeAmount) ? activeAmount.toFixed(2) : '0.00'} ${frequency === 'monthly' ? 'Monthly ' : ''}Contribution`}
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        {/* Transparency & Impact Summary Column */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="bg-[#F2EFE7]/80 border border-[#E4DFD3] p-6 sm:p-7 space-y-5">
            <h2 className="font-serif text-xl font-semibold text-[#181A18]">
              Where Your Contribution Goes
            </h2>
            <p className="text-sm text-[#3F433E] leading-relaxed">
              Eagles Wings Network initiatives are volunteer-driven, with financial gifts and
              donated supplies directly fueling medical clinics, free groceries, and educational
              outreach across our seven documented areas of need:
            </p>
            <ul className="space-y-2.5 text-sm text-[#3F433E]">
              {AREAS_OF_NEED.map((area) => (
                <li key={area.index} className="flex items-start gap-2.5">
                  <span className="font-mono text-xs text-[#145233] mt-0.5 tabular-nums">
                    {area.index}.
                  </span>
                  <span>
                    <strong className="text-[#181A18]">{area.title}:</strong> {area.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-[#E4DFD3] bg-white p-6 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#145233]">
              Direct Zelle Giving
            </p>
            <p className="text-sm text-[#3F433E] leading-relaxed">
              Prefer direct bank-to-bank transfer? You can also donate via Zelle directly to{' '}
              <span className="font-mono text-[#181A18]">{SITE_INFO.zelleEmail}</span>.
            </p>
            <p className="text-xs text-[#565B55] leading-relaxed">
              Every bit of support helps bridge the gap in healthcare access, nutrition, and
              education for underserved families.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
