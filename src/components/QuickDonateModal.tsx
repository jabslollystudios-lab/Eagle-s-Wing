import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, Check, Copy, Lock, ShieldCheck, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { DONATION_DESIGNATIONS, SITE_INFO } from '../data/ewnData';

interface QuickDonateModalProps {
  open: boolean;
  initialDesignationId?: string | null;
  onClose: () => void;
  onOpenFullPortal: (designationId: string) => void;
}

const AMOUNTS = [25, 50, 100, 250];

export function QuickDonateModal({
  open,
  initialDesignationId,
  onClose,
  onOpenFullPortal,
}: QuickDonateModalProps) {
  const shouldReduceMotion = useReducedMotion();
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [designationId, setDesignationId] = useState<string>(
    initialDesignationId || DONATION_DESIGNATIONS[0].id
  );
  const [method, setMethod] = useState<'card' | 'zelle'>('card');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [billingZip, setBillingZip] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [receiptId, setReceiptId] = useState<string | null>(null);
  const [copiedZelle, setCopiedZelle] = useState(false);

  useEffect(() => {
    if (initialDesignationId) setDesignationId(initialDesignationId);
  }, [initialDesignationId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const activeAmount = customAmount.trim() ? Number(customAmount) : amount;
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!Number.isFinite(activeAmount) || activeAmount < 5) {
      setErrorMsg('Please enter an amount of at least $5.');
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
          method,
        }),
      });
      const intentData = await intentRes.json();
      if (!intentRes.ok) {
        setErrorMsg(intentData.error || 'Could not start checkout.');
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
        setErrorMsg(confirmData.error || 'Payment could not be confirmed.');
        return;
      }
      setReceiptId(confirmData.receipt?.receiptId || 'CONFIRMED');
    } catch {
      setErrorMsg('Network error reaching payment gateway.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-donate-title"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#181A18]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
        >
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FBF9F5] border border-[#E4DFD3] w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 sm:p-7 space-y-5"
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E4DFD3]">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#145233]">
                  Quick Contribution
                </p>
                <h2
                  id="quick-donate-title"
                  className="font-serif text-xl sm:text-2xl font-medium text-[#181A18]"
                >
                  Donate to Eagles Wings Network
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close donation dialog"
                className="w-11 h-11 rounded-md border border-[#E4DFD3] flex items-center justify-center text-[#181A18] hover:bg-[#F2EFE7] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {receiptId ? (
              <div className="space-y-4 py-2">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#145233]">
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  <span>Receipt · {receiptId}</span>
                </p>
                <h3 className="font-serif text-2xl font-medium text-[#181A18]">
                  Thank you for supporting Eagles Wings Network.
                </h3>
                <p className="text-sm text-[#3F433E] leading-relaxed">
                  Your ${Number.isFinite(activeAmount) ? activeAmount.toFixed(2) : '0.00'}{' '}
                  {frequency} contribution to <strong>{selectedDesignation.label}</strong> has been
                  recorded for {donorEmail}.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setReceiptId(null);
                      onClose();
                    }}
                    className="px-4 py-2.5 bg-[#145233] text-white text-sm font-semibold rounded-md cursor-pointer"
                  >
                    Done
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReceiptId(null);
                      onClose();
                      onOpenFullPortal(designationId);
                    }}
                    className="text-sm font-semibold text-[#145233] hover:underline cursor-pointer"
                  >
                    Open Full Donation Portal
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-1.5 bg-[#F2EFE7] p-1 rounded-lg border border-[#E4DFD3]">
                  <button
                    type="button"
                    onClick={() => setMethod('card')}
                    className={`py-2 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer ${
                      method === 'card'
                        ? 'bg-white text-[#145233] font-semibold shadow-xs'
                        : 'text-[#3F433E]'
                    }`}
                  >
                    Card Checkout
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('zelle')}
                    className={`py-2 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer ${
                      method === 'zelle'
                        ? 'bg-white text-[#145233] font-semibold shadow-xs'
                        : 'text-[#3F433E]'
                    }`}
                  >
                    Zelle Direct
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {(['one-time', 'monthly'] as const).map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setFrequency(freq)}
                      className={`py-2 px-3 text-xs sm:text-sm font-medium rounded-md border cursor-pointer ${
                        frequency === freq
                          ? 'bg-[#145233] border-[#145233] text-white'
                          : 'bg-white border-[#D4CEC0] text-[#181A18]'
                      }`}
                    >
                      {freq === 'one-time' ? 'One-Time Gift' : 'Monthly Support'}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {AMOUNTS.map((amt) => {
                    const selected = !customAmount.trim() && amount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setAmount(amt);
                          setCustomAmount('');
                        }}
                        className={`py-2.5 text-sm font-mono font-semibold rounded-md border tabular-nums cursor-pointer ${
                          selected
                            ? 'bg-[#145233] border-[#145233] text-white'
                            : 'bg-white border-[#D4CEC0] text-[#181A18]'
                        }`}
                      >
                        ${amt}
                      </button>
                    );
                  })}
                </div>

                <input
                  type="number"
                  min={5}
                  step="1"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  aria-label="Custom donation amount in USD"
                  placeholder="Custom amount ($ min 5)"
                  className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums border border-[#D4CEC0] rounded-md bg-white focus:outline-2 focus:outline-[#145233]"
                />

                <div>
                  <label
                    htmlFor="qd-designation"
                    className="block text-xs font-semibold text-[#181A18] mb-1"
                  >
                    Designation
                  </label>
                  <select
                    id="qd-designation"
                    value={designationId}
                    onChange={(e) => setDesignationId(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-[#D4CEC0] rounded-md bg-white text-[#181A18] focus:outline-2 focus:outline-[#145233]"
                  >
                    {DONATION_DESIGNATIONS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    aria-label="Full name"
                    placeholder="Full name"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#D4CEC0] rounded-md bg-white focus:outline-2 focus:outline-[#145233]"
                  />
                  <input
                    type="email"
                    required
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    aria-label="Email for receipt"
                    placeholder="Email for receipt"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#D4CEC0] rounded-md bg-white focus:outline-2 focus:outline-[#145233]"
                  />
                </div>

                {method === 'card' ? (
                  <div className="space-y-3 pt-2 border-t border-[#E4DFD3]">
                    <div className="flex items-center justify-between text-xs text-[#565B55]">
                      <span>Card Details</span>
                      <span className="inline-flex items-center gap-1 text-[#145233]">
                        <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Encrypted</span>
                      </span>
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(
                          e.target.value
                            .replace(/\D/g, '')
                            .slice(0, 19)
                            .replace(/(\d{4})(?=\d)/g, '$1 ')
                        )
                      }
                      aria-label="Card number"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums border border-[#D4CEC0] rounded-md bg-white focus:outline-2 focus:outline-[#145233]"
                    />
                    <div className="grid grid-cols-3 gap-2.5">
                      <input
                        type="text"
                        inputMode="numeric"
                        required
                        value={expiry}
                        onChange={(e) => {
                          const d = e.target.value.replace(/\D/g, '').slice(0, 4);
                          setExpiry(d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
                        }}
                        aria-label="Card expiration MM/YY"
                        placeholder="MM/YY"
                        className="w-full px-3 py-2.5 text-sm font-mono tabular-nums border border-[#D4CEC0] rounded-md bg-white focus:outline-2 focus:outline-[#145233]"
                      />
                      <input
                        type="text"
                        inputMode="numeric"
                        required
                        maxLength={4}
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        aria-label="Card CVC"
                        placeholder="CVC"
                        className="w-full px-3 py-2.5 text-sm font-mono tabular-nums border border-[#D4CEC0] rounded-md bg-white focus:outline-2 focus:outline-[#145233]"
                      />
                      <input
                        type="text"
                        required
                        value={billingZip}
                        onChange={(e) => setBillingZip(e.target.value)}
                        aria-label="Billing ZIP"
                        placeholder="ZIP"
                        className="w-full px-3 py-2.5 text-sm font-mono tabular-nums border border-[#D4CEC0] rounded-md bg-white focus:outline-2 focus:outline-[#145233]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#F2EFE7] border border-[#E4DFD3] p-4 space-y-2 text-xs sm:text-sm text-[#3F433E]">
                    <p>Send Zelle contributions directly to:</p>
                    <div className="flex items-center justify-between gap-2 bg-white border border-[#E4DFD3] px-3 py-2 rounded-md">
                      <span className="font-mono text-[#181A18] truncate">
                        {SITE_INFO.zelleEmail}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyZelle}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#145233] hover:underline shrink-0 cursor-pointer"
                      >
                        {copiedZelle ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedZelle ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <p role="alert" className="text-xs sm:text-sm text-red-700 font-medium">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#145233] hover:bg-[#0E3D25] disabled:opacity-60 text-white text-sm font-semibold rounded-md transition-colors cursor-pointer tabular-nums"
                >
                  {submitting
                    ? 'Processing...'
                    : `Give $${Number.isFinite(activeAmount) ? activeAmount.toFixed(2) : '0.00'}`}
                </button>

                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenFullPortal(designationId);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#145233] hover:underline cursor-pointer"
                  >
                    <span>Need In-Kind Pledge or Full Portal?</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
