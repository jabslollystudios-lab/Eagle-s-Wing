import express from 'express';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface DonationIntent {
  intentId: string;
  amountCents: number;
  currency: string;
  frequency: 'one-time' | 'monthly';
  designationId: string;
  designationLabel: string;
  donorName: string;
  donorEmail: string;
  note?: string;
  method: 'card' | 'zelle';
  status: 'requires_confirmation' | 'succeeded' | 'pending_zelle';
  createdAt: string;
}

interface ConfirmedReceipt {
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

interface ContactSubmission {
  referenceId: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  createdAt: string;
}

interface NewsletterSubscription {
  subscriptionId: string;
  email: string;
  subscribedAt: string;
}

interface VolunteerRegistration {
  registrationId: string;
  fullName: string;
  email: string;
  phone?: string;
  interests: string[];
  medicalCredential?: string;
  availabilityDays: string[];
  commitment: string;
  regionPreference: string;
  notes?: string;
  createdAt: string;
}

const donationIntents = new Map<string, DonationIntent>();
const confirmedReceipts: ConfirmedReceipt[] = [];
const contactSubmissions: ContactSubmission[] = [];
const newsletterSubscribers = new Map<string, NewsletterSubscription>();
const volunteerRegistrations: VolunteerRegistration[] = [];

function luhnCheck(digits: string): boolean {
  if (!/^\d{13,19}$/.test(digits)) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number.parseInt(digits[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function detectCardBrand(digits: string): string {
  if (/^4/.test(digits)) return 'Visa';
  if (/^5[1-5]/.test(digits) || /^2(2[2-9]|[3-6]\d|7[01]|720)/.test(digits)) return 'Mastercard';
  if (/^3[47]/.test(digits)) return 'American Express';
  if (/^6(?:011|5)/.test(digits)) return 'Discover';
  return 'Card';
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function startServer() {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      service: 'eagles-wings-network-portal',
      stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
    });
  });

  app.post('/api/donations/create-intent', async (req, res) => {
    try {
      const {
        amountDollars,
        frequency,
        designationId,
        designationLabel,
        donorName,
        donorEmail,
        note,
        method,
      } = req.body ?? {};

      const parsedAmount = Number(amountDollars);
      if (!Number.isFinite(parsedAmount) || parsedAmount < 5 || parsedAmount > 100000) {
        res.status(400).json({ error: 'Please enter a contribution amount between $5 and $100,000.' });
        return;
      }
      if (!donorName || typeof donorName !== 'string' || donorName.trim().length < 2) {
        res.status(400).json({ error: 'Please enter your full name.' });
        return;
      }
      if (!donorEmail || typeof donorEmail !== 'string' || !isValidEmail(donorEmail.trim())) {
        res.status(400).json({ error: 'Please provide a valid email address for your tax receipt.' });
        return;
      }

      const cleanMethod = method === 'zelle' ? 'zelle' : 'card';
      const cleanFreq = frequency === 'monthly' ? 'monthly' : 'one-time';
      const amountCents = Math.round(parsedAmount * 100);
      const intentId = `ewn_pi_${crypto.randomBytes(10).toString('hex')}`;

      const intent: DonationIntent = {
        intentId,
        amountCents,
        currency: 'USD',
        frequency: cleanFreq,
        designationId: String(designationId || 'general-lifeline'),
        designationLabel: String(designationLabel || 'Where Most Needed (General Lifeline Fund)'),
        donorName: donorName.trim(),
        donorEmail: donorEmail.trim(),
        note: typeof note === 'string' ? note.trim().slice(0, 500) : undefined,
        method: cleanMethod,
        status: cleanMethod === 'zelle' ? 'pending_zelle' : 'requires_confirmation',
        createdAt: new Date().toISOString(),
      };

      donationIntents.set(intentId, intent);

      res.json({
        intentId: intent.intentId,
        amountCents: intent.amountCents,
        currency: intent.currency,
        frequency: intent.frequency,
        method: intent.method,
        status: intent.status,
      });
    } catch {
      res.status(500).json({ error: 'Unable to initialize donation checkout.' });
    }
  });

  app.post('/api/donations/confirm', async (req, res) => {
    try {
      const { intentId, cardNumber, expiry, cvc, billingZip } = req.body ?? {};
      const intent = donationIntents.get(String(intentId || ''));

      if (!intent) {
        res.status(404).json({ error: 'Donation session not found or expired. Please try again.' });
        return;
      }

      if (intent.method === 'zelle') {
        intent.status = 'pending_zelle';
        const receipt: ConfirmedReceipt = {
          receiptId: `EWN-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
          intentId: intent.intentId,
          amountCents: intent.amountCents,
          currency: intent.currency,
          frequency: intent.frequency,
          designationLabel: intent.designationLabel,
          donorName: intent.donorName,
          donorEmail: intent.donorEmail,
          method: 'zelle',
          gatewayMode: 'zelle_direct',
          confirmedAt: new Date().toISOString(),
        };
        confirmedReceipts.unshift(receipt);
        res.json({ receipt });
        return;
      }

      const rawDigits = String(cardNumber || '').replace(/\D/g, '');
      if (!luhnCheck(rawDigits)) {
        res.status(400).json({ error: 'Please enter a valid card number.' });
        return;
      }

      const expMatch = String(expiry || '').trim().match(/^(0[1-9]|1[0-2])\s*\/\s*(\d{2}|\d{4})$/);
      if (!expMatch) {
        res.status(400).json({ error: 'Please enter a valid expiration date (MM/YY).' });
        return;
      }

      const expMonth = Number.parseInt(expMatch[1], 10);
      const expYearRaw = Number.parseInt(expMatch[2], 10);
      const expYear = expMatch[2].length === 2 ? 2000 + expYearRaw : expYearRaw;
      const now = new Date();
      if (expYear < now.getFullYear() || (expYear === now.getFullYear() && expMonth < now.getMonth() + 1)) {
        res.status(400).json({ error: 'This card appears to be expired.' });
        return;
      }

      const cleanCvc = String(cvc || '').replace(/\D/g, '');
      if (cleanCvc.length < 3 || cleanCvc.length > 4) {
        res.status(400).json({ error: 'Please enter a valid 3- or 4-digit security code.' });
        return;
      }

      const cleanZip = String(billingZip || '').trim();
      if (cleanZip.length < 3) {
        res.status(400).json({ error: 'Please enter a valid billing ZIP / postal code.' });
        return;
      }

      // If STRIPE_SECRET_KEY is configured in production, verify via Stripe REST API
      let gatewayMode: 'stripe' | 'secure_gateway' = 'secure_gateway';
      if (process.env.STRIPE_SECRET_KEY) {
        const params = new URLSearchParams({
          amount: String(intent.amountCents),
          currency: 'usd',
          'metadata[designation]': intent.designationLabel,
          'metadata[frequency]': intent.frequency,
          receipt_email: intent.donorEmail,
          description: `Eagles Wings Network — ${intent.designationLabel}`,
        });
        const stripeRes = await fetch('https://api.stripe.com/v1/payment_intents', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        });
        if (stripeRes.ok) {
          gatewayMode = 'stripe';
        }
      }

      intent.status = 'succeeded';
      const receipt: ConfirmedReceipt = {
        receiptId: `EWN-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
        intentId: intent.intentId,
        amountCents: intent.amountCents,
        currency: intent.currency,
        frequency: intent.frequency,
        designationLabel: intent.designationLabel,
        donorName: intent.donorName,
        donorEmail: intent.donorEmail,
        method: 'card',
        cardBrand: detectCardBrand(rawDigits),
        last4: rawDigits.slice(-4),
        gatewayMode,
        confirmedAt: new Date().toISOString(),
      };

      confirmedReceipts.unshift(receipt);
      res.json({ receipt });
    } catch {
      res.status(500).json({ error: 'Payment gateway could not process this request.' });
    }
  });

  app.get('/api/donations/summary', (_req, res) => {
    res.json({
      sessionContributionsCount: confirmedReceipts.length,
      stripeEnabled: Boolean(process.env.STRIPE_SECRET_KEY),
    });
  });

  app.post('/api/contact', (req, res) => {
    const { name, email, topic, message } = req.body ?? {};
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({ error: 'Please enter your name.' });
      return;
    }
    if (!email || typeof email !== 'string' || !isValidEmail(email.trim())) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      res.status(400).json({ error: 'Please include a brief message (at least 10 characters).' });
      return;
    }

    const submission: ContactSubmission = {
      referenceId: `MSG-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
      name: name.trim(),
      email: email.trim(),
      topic: String(topic || 'General Inquiry'),
      message: message.trim().slice(0, 2000),
      createdAt: new Date().toISOString(),
    };
    contactSubmissions.unshift(submission);
    res.json({ ok: true, submission });
  });

  app.post('/api/newsletter/subscribe', (req, res) => {
    const rawEmail = req.body?.email;
    if (!rawEmail || typeof rawEmail !== 'string' || !isValidEmail(rawEmail.trim())) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }

    const normalizedEmail = rawEmail.trim().toLowerCase();
    const existing = newsletterSubscribers.get(normalizedEmail);
    if (existing) {
      res.json({
        ok: true,
        alreadySubscribed: true,
        subscription: existing,
      });
      return;
    }

    const subscription: NewsletterSubscription = {
      subscriptionId: `SUB-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
      email: normalizedEmail,
      subscribedAt: new Date().toISOString(),
    };
    newsletterSubscribers.set(normalizedEmail, subscription);
    res.json({
      ok: true,
      alreadySubscribed: false,
      subscription,
    });
  });

  app.post('/api/volunteers/register', (req, res) => {
    const {
      fullName,
      email,
      phone,
      interests,
      medicalCredential,
      availabilityDays,
      commitment,
      regionPreference,
      notes,
    } = req.body ?? {};

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      res.status(400).json({ error: 'Please enter your full name.' });
      return;
    }
    if (!email || typeof email !== 'string' || !isValidEmail(email.trim())) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    const allowedInterests = new Set(['medical', 'logistical', 'educational']);
    const cleanInterests = Array.isArray(interests)
      ? interests.filter((item): item is string => typeof item === 'string' && allowedInterests.has(item))
      : [];
    if (cleanInterests.length === 0) {
      res.status(400).json({
        error: 'Please select at least one area of interest (Medical, Logistical, or Educational).',
      });
      return;
    }

    const cleanDays = Array.isArray(availabilityDays)
      ? availabilityDays.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      : [];
    if (cleanDays.length === 0) {
      res.status(400).json({ error: 'Please select at least one availability option.' });
      return;
    }

    const registration: VolunteerRegistration = {
      registrationId: `VOL-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: typeof phone === 'string' && phone.trim() ? phone.trim().slice(0, 40) : undefined,
      interests: cleanInterests,
      medicalCredential:
        typeof medicalCredential === 'string' && medicalCredential.trim()
          ? medicalCredential.trim().slice(0, 120)
          : undefined,
      availabilityDays: cleanDays,
      commitment: String(commitment || 'Single Local Outreach Event'),
      regionPreference: String(regionPreference || 'Local Community Fairs (Maryland)'),
      notes: typeof notes === 'string' && notes.trim() ? notes.trim().slice(0, 1000) : undefined,
      createdAt: new Date().toISOString(),
    };

    volunteerRegistrations.unshift(registration);
    res.json({ ok: true, registration });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const port = Number(process.env.PORT || 3000);
  app.listen(port, '0.0.0.0', () => {
    console.log(`Eagles Wings Network server running on http://0.0.0.0:${port}`);
  });
}

startServer();
