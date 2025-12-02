import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

// Gmail SMTP Configuration
const GMAIL_USER = process.env.GMAIL_USER; // your email@gmail.com
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD; // app password (not regular password)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || GMAIL_USER; // where to send notifications

if (!GMAIL_USER || !GMAIL_PASSWORD) {
  console.warn('Missing Gmail credentials. Create server/.env with GMAIL_USER and GMAIL_PASSWORD');
}

// Create Nodemailer transporter for Gmail
let transporter;
let isTestAccount = false;
let lastEmailPreviews = {};
let transporterReady = false;

async function createTransporter() {
  if (GMAIL_USER && GMAIL_PASSWORD) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: GMAIL_USER, pass: GMAIL_PASSWORD }
    });
    isTestAccount = false;
    transporterReady = true;
    console.log('Using Gmail SMTP account.');
    return transporter;
  }

  // Fallback to Ethereal test account for local testing
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass }
    });
    isTestAccount = true;
    transporterReady = true;
    console.log('✅ Using Ethereal test SMTP account. Preview URLs will be available.');
    console.log(`Ethereal user: ${testAccount.user}`);
    console.log(`Ethereal pass: ${testAccount.pass}`);
    return transporter;
  } catch (e) {
    console.error('Failed to create test SMTP account', e);
    throw e;
  }
}

function recordPreview(key, info) {
  if (!isTestAccount) {
    console.log(`[${key}] Email sent via Gmail (no preview available).`);
    return;
  }
  try {
    const url = nodemailer.getTestMessageUrl(info) || null;
    lastEmailPreviews[key] = url;
    const serverDir = path.join(process.cwd(), 'server');
    if (!fs.existsSync(serverDir)) {
      fs.mkdirSync(serverDir, { recursive: true });
    }
    const outPath = path.join(serverDir, 'last_emails.json');
    fs.writeFileSync(outPath, JSON.stringify(lastEmailPreviews, null, 2), 'utf-8');
    console.log(`✅ Wrote email preview ${key}`);
    console.log(`   URL: ${url}`);
    console.log(`   Saved to: ${outPath}`);
  } catch (e) {
    console.error('Error writing last_emails.json', e);
  }
}

// Initialize transporter async and wait
let transporterPromise = createTransporter();
transporterPromise.then(() => {
  console.log('✅ Transporter initialized successfully');
}).catch(err => {
  console.error('❌ Transporter init failed', err);
});

// Simple JSON file storage for reservations (suitable for small deploys)
const RESERVATIONS_FILE = path.join(process.cwd(), 'server', 'reservations.json');

function readReservations() {
  try {
    if (!fs.existsSync(RESERVATIONS_FILE)) return [];
    const raw = fs.readFileSync(RESERVATIONS_FILE, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Error reading reservations file', err);
    return [];
  }
}

function writeReservations(arr) {
  try {
    fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(arr, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing reservations file', err);
  }
}

function saveReservation(reservation) {
  const all = readReservations();
  all.push(reservation);
  writeReservations(all);
}

function updateReservationStatus(id, update) {
  const all = readReservations();
  const idx = all.findIndex(r => r.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...update };
  writeReservations(all);
  return all[idx];
}

// Devis (Mechanic Quotes) file management
const DEVIS_FILE = path.join(process.cwd(), 'server', 'devis.json');

function readDevis() {
  try {
    if (!fs.existsSync(DEVIS_FILE)) return [];
    const raw = fs.readFileSync(DEVIS_FILE, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Error reading devis file', err);
    return [];
  }
}

function writeDevis(arr) {
  try {
    fs.writeFileSync(DEVIS_FILE, JSON.stringify(arr, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing devis file', err);
  }
}

function saveDevis(devis) {
  const all = readDevis();
  all.push(devis);
  writeDevis(all);
}

function updateDevisStatus(id, update) {
  const all = readDevis();
  const idx = all.findIndex(d => d.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...update };
  writeDevis(all);
  return all[idx];
}

// Stripe setup
const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: '2022-11-15' }) : null;
if (!stripe) console.warn('Missing STRIPE_SECRET_KEY in environment variables.');

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Email booking server running', transporterReady });
});

// Admin dashboard API: get all reservations with optional filters
app.get('/api/reservations', (req, res) => {
  try {
    const all = readReservations();
    
    // Apply filters
    const status = req.query.status; // 'pending', 'confirmed', 'cancelled', or undefined (all)
    const dateFrom = req.query.dateFrom; // ISO date or undefined
    const dateTo = req.query.dateTo; // ISO date or undefined
    const sortBy = req.query.sortBy || 'bookingDate'; // 'bookingDate', 'createdAt'
    const sortOrder = req.query.sortOrder || 'asc'; // 'asc', 'desc'

    let filtered = all;

    // Filter by status
    if (status) {
      filtered = filtered.filter(r => r.status === status);
    }

    // Filter by booking date range
    if (dateFrom || dateTo) {
      filtered = filtered.filter(r => {
        const bookingDate = r.form?.bookingDate;
        if (!bookingDate) return false;
        if (dateFrom && bookingDate < dateFrom) return false;
        if (dateTo && bookingDate > dateTo) return false;
        return true;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      if (sortBy === 'createdAt') {
        aVal = new Date(a.createdAt);
        bVal = new Date(b.createdAt);
      } else {
        // sortBy === 'bookingDate'
        aVal = new Date(`${a.form?.bookingDate || '9999-12-31'}T${a.form?.bookingTime || '00:00'}`);
        bVal = new Date(`${b.form?.bookingDate || '9999-12-31'}T${b.form?.bookingTime || '00:00'}`);
      }
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    res.json(filtered);
  } catch (err) {
    console.error('Error fetching reservations', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Admin dashboard API: update reservation status
app.patch('/api/reservations/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updated = updateReservationStatus(id, { status, updatedAt: new Date().toISOString() });
    if (!updated) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Error updating reservation', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Admin dashboard API: get all devis with optional filters
app.get('/api/devis', (req, res) => {
  try {
    const all = readDevis();
    
    // Apply filters
    const status = req.query.status; // 'pending', 'confirmed', 'cancelled'
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'asc';

    let filtered = all;

    if (status) {
      filtered = filtered.filter(d => d.status === status);
    }

    if (dateFrom || dateTo) {
      filtered = filtered.filter(d => {
        const createdDate = d.createdAt?.split('T')[0];
        if (!createdDate) return false;
        if (dateFrom && createdDate < dateFrom) return false;
        if (dateTo && createdDate > dateTo) return false;
        return true;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      if (sortBy === 'createdAt') {
        aVal = new Date(a.createdAt);
        bVal = new Date(b.createdAt);
      } else {
        aVal = new Date(a.createdAt);
        bVal = new Date(b.createdAt);
      }
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    res.json(filtered);
  } catch (err) {
    console.error('Error fetching devis', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Admin dashboard API: update devis status
app.patch('/api/devis/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updated = updateDevisStatus(id, { status, updatedAt: new Date().toISOString() });
    if (!updated) {
      return res.status(404).json({ error: 'Devis non trouvé' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Error updating devis', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /devis - Create a mechanic quote request
app.post('/devis', async (req, res) => {
  try {
    const form = req.body;
    
    // Validate required fields
    if (!form.clientName || !form.clientPhone) {
      return res.status(400).json({ error: 'Champs manquants : clientName, clientPhone requis' });
    }

    // Create unique id
    const devisId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const devis = {
      id: devisId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      form
    };

    // Save to devis.json
    saveDevis(devis);

    // Send emails
    try {
      await ensureTransporter();
      const clientEmail = form.clientEmail && form.clientEmail.includes('@') ? form.clientEmail : null;

      // Prepare admin email
      const adminMailOptions = {
        from: GMAIL_USER || 'no-reply@yassauto.local',
        to: ADMIN_EMAIL,
        subject: `[NOUVELLE DEMANDE DEVIS] ${form.requestType === 'repair' ? 'Réparation' : 'Diagnostic'} - ${form.clientName}`,
        html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Nouvelle demande de devis</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding:20px 10px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td align="center" style="padding:20px 20px 10px 20px;background-color:#000000;">
              <img src="https://via.placeholder.com/140x80?text=YassAuto+Logo" alt="YassAuto" width="140" style="display:block;border:0;outline:none;text-decoration:none;">
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 20px 15px 20px;background-color:#000000;">
              <h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:20px;line-height:1.4;color:#ffffff;">Nouvelle demande de devis</h1>
              <p style="margin:5px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#f0f0f0;">Service mécanique</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 25px 10px 25px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#333333;">
              Nouvelle demande de ${form.requestType === 'repair' ? 'réparation' : 'diagnostic'} pour ${form.clientName}.
            </td>
          </tr>
          <tr>
            <td style="padding:5px 25px 15px 25px;">
              <h2 style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#000000;border-left:4px solid #e30613;padding-left:8px;">Infos client</h2>
              <table role="presentation" cellpadding="6" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:13px;">
                <tr><td style="width:40%;font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Nom</td><td style="border:1px solid #dddddd;">${form.clientName || ''}</td></tr>
                <tr><td style="font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Email</td><td style="border:1px solid #dddddd;">${clientEmail || 'Non fourni'}</td></tr>
                <tr><td style="font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Téléphone</td><td style="border:1px solid #dddddd;">${form.clientPhone || ''}</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:5px 25px 15px 25px;">
              <h2 style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#000000;border-left:4px solid #e30613;padding-left:8px;">Véhicule</h2>
              <table role="presentation" cellpadding="6" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:13px;">
                <tr><td style="width:40%;font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Immatriculation</td><td style="border:1px solid #dddddd;">${form.licensePlate || 'Non fourni'}</td></tr>
                <tr><td style="font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Type de demande</td><td style="border:1px solid #dddddd;">${form.requestType === 'repair' ? 'Réparation' : 'Diagnostic'}</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:5px 25px 15px 25px;">
              <h2 style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#000000;border-left:4px solid #e30613;padding-left:8px;">Description de la demande</h2>
              <div style="background-color:#f9f9f9;border:1px solid #dddddd;padding:10px;border-radius:4px;font-family:Arial,Helvetica,sans-serif;font-size:13px;white-space:pre-wrap;">${form.issueDescription || 'Aucune description'}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:5px 25px 15px 25px;">
              <h2 style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#000000;border-left:4px solid #e30613;padding-left:8px;">Infos supplémentaires</h2>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#333333;">
                <strong>Photos/vidéos :</strong> ${form.hasPhotos ? 'Oui - À demander au client' : 'Non'}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:15px 25px 20px 25px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:#333333;">
              À vous de contacter le client pour établir un devis personnalisé.
            </td>
          </tr>
          <tr>
            <td style="padding:15px 25px;background-color:#f9f9f9;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#999999;border-top:1px solid #eeeeee;">
              ID Demande: <strong>${devisId}</strong> | Reçue le: <strong>${new Date().toLocaleString('fr-FR')}</strong>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
      };

      await transporter.sendMail(adminMailOptions);
      console.log('Admin notified for devis', devisId);

      if (clientEmail) {
        const clientMailOptions = {
          from: GMAIL_USER || 'no-reply@yassauto.local',
          to: clientEmail,
          subject: `Votre demande de ${form.requestType === 'repair' ? 'réparation' : 'diagnostic'} - YassAuto`,
          html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Confirmation de demande de devis</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding:20px 10px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td align="center" style="padding:20px 20px 10px 20px;background-color:#000000;">
              <img src="https://via.placeholder.com/140x80?text=YassAuto+Logo" alt="YassAuto" width="140" style="display:block;border:0;outline:none;text-decoration:none;">
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 20px 15px 20px;background-color:#000000;">
              <h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:20px;line-height:1.4;color:#ffffff;">Demande bien reçue !</h1>
              <p style="margin:5px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#f0f0f0;">Nous vous recontacterons bientôt</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 25px 10px 25px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#333333;">
              Bonjour <strong>${form.clientName}</strong>,<br><br>
              Merci pour votre demande de ${form.requestType === 'repair' ? 'réparation' : 'diagnostic'}. Nous avons bien reçu votre demande et nous vous recontacterons <strong>dans les 24 heures</strong> pour fixer un rendez-vous et établir un devis personnalisé.
            </td>
          </tr>
          <tr>
            <td style="padding:5px 25px 15px 25px;">
              <h2 style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#000000;border-left:4px solid #e30613;padding-left:8px;">Récapitulatif de votre demande</h2>
              <table role="presentation" cellpadding="6" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:13px;">
                <tr><td style="width:40%;font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Type de demande</td><td style="border:1px solid #dddddd;">${form.requestType === 'repair' ? 'Réparation' : 'Diagnostic'}</td></tr>
                <tr><td style="font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Immatriculation</td><td style="border:1px solid #dddddd;">${form.licensePlate || 'Non fourni'}</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:15px 25px 20px 25px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:#333333;">
              En attendant votre appel, vous pouvez nous envoyer des photos ou vidéos du problème si vous en avez.<br><br>
              À très bientôt,<br><strong>L'équipe YassAuto</strong><br>
              📞 06 48 38 05 68 | 📧 ${ADMIN_EMAIL} | 🌐 www.yassauto.fr
            </td>
          </tr>
          <tr>
            <td style="padding:15px 25px;background-color:#f9f9f9;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#999999;border-top:1px solid #eeeeee;">
              Référence demande: <strong>${devisId}</strong>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
        };

        await transporter.sendMail(clientMailOptions);
        console.log('Client notified for devis:', clientEmail);
      }
    } catch (e) {
      console.error('Error sending devis emails', e);
    }

    res.json({ success: true, devisId });
  } catch (err) {
    console.error('Error creating devis', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Wait for transporter to be ready before sending emails
async function ensureTransporter() {
  if (!transporterReady) {
    await transporterPromise;
  }
}

// Create a Stripe Checkout session and a pending reservation
app.post('/create-checkout-session', async (req, res) => {
  try {
    const form = req.body;
    // Minimal validation
    if (!form.clientName || !form.clientPhone || !form.bookingDate) {
      return res.status(400).json({ error: 'Champs manquants : clientName, clientPhone, bookingDate requis' });
    }

    // Create a simple unique id
    const reservationId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Determine total price depending on student status
    const isStudent = !!form.isStudent;
    const price_total_cents = isStudent ? 10000 : 15000; // 100€ or 150€ in cents

    const reservation = {
      id: reservationId,
      status: 'pending',
      amount_cents: 2000, // acompte in cents (20€)
      price_total_cents,
      currency: 'eur',
      createdAt: new Date().toISOString(),
      form: { ...form, isStudent }
    };

    // persist reservation
    saveReservation(reservation);

    const frontendBase = process.env.FRONTEND_URL || 'http://localhost:3000';

    // If Stripe is not configured, return a mock session URL so local testing works
    if (!stripe) {
      const mockUrl = `${frontendBase}/#/merci?session_id=fake-${reservationId}`;
      return res.json({ url: mockUrl, reservationId });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: 'Acompte réservation YassAuto' },
            unit_amount: 2000
          },
          quantity: 1
        }
      ],
      metadata: { reservationId, isStudent: isStudent ? '1' : '0' },
      // Use hash routing for the frontend (HashRouter). This ensures
      // Stripe redirects land on the correct client-side route.
      success_url: `${frontendBase}/#/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendBase}/#/annulation`
    });

    res.json({ url: session.url, reservationId });
  } catch (err) {
    console.error('Error creating checkout session', err);
    res.status(500).json({ error: 'Erreur serveur lors de la création de la session Stripe' });
  }
});

// Stripe webhook endpoint (use raw body for signature verification)
app.post('/webhook/stripe', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const skipSig = process.env.SKIP_STRIPE_SIGNATURE === '1' || process.env.NODE_ENV === 'test' || !webhookSecret;

  if (!stripe && !skipSig) {
    console.warn('Stripe not configured and signature verification required.');
    return res.status(500).send('Webhook not configured');
  }

  let event;
  try {
    if (skipSig) {
      // req.body may be a Buffer (raw) or already-parsed object (bodyParser.json applied).
      if (Buffer.isBuffer(req.body)) {
        event = JSON.parse(req.body.toString('utf-8'));
      } else if (typeof req.body === 'object') {
        event = req.body;
      } else {
        event = JSON.parse(String(req.body));
      }
    } else {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    }
  } catch (err) {
    console.error('Webhook signature verification failed or invalid JSON.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
    const session = event.type === 'checkout.session.completed' ? event.data.object : null;
    // For payment_intent.succeeded we may need to fetch the session via payment_intent
    let reservationId = null;

    if (session && session.metadata && session.metadata.reservationId) {
      reservationId = session.metadata.reservationId;
    } else if (event.type === 'payment_intent.succeeded') {
      // Try to find a checkout session linked to the payment_intent
      try {
        const paymentIntent = event.data.object;
        const sessions = await stripe.checkout.sessions.list({ payment_intent: paymentIntent.id, limit: 1 });
        if (sessions.data && sessions.data[0] && sessions.data[0].metadata) {
          reservationId = sessions.data[0].metadata.reservationId;
        }
      } catch (e) {
        console.error('Error fetching checkout session for payment_intent', e);
      }
    }

    if (!reservationId) {
      console.warn('ReservationId not found in webhook event metadata.');
      // Still respond 200 to acknowledge
      return res.json({ received: true });
    }

    // Mark reservation as confirmed
    const updated = updateReservationStatus(reservationId, { status: 'confirmed', confirmedAt: new Date().toISOString() });

    // Send emails: admin + client
    try {
      await ensureTransporter();
      const reservation = updated || readReservations().find(r => r.id === reservationId);
      const form = reservation.form || {};
      const clientEmail = form.clientEmail && form.clientEmail.includes('@') ? form.clientEmail : null;

      // Prepare admin email
      const bookingDateTime = `${form.bookingDate || ''} ${form.bookingTime || ''}`;
      const bookingTypeLabel = form.bookingType === 'accompagnement' ? 'Accompagnement Achat' : 'Devis Mécanique';

      // compute pricing (cents)
      const totalCents = reservation.price_total_cents || (form.isStudent ? 10000 : 15000);
      const depositCents = reservation.amount_cents || 2000;
      const balanceCents = totalCents - depositCents;

      const adminMailOptions = {
        from: GMAIL_USER || 'no-reply@yassauto.local',
        to: ADMIN_EMAIL,
        subject: `[ACOMPTE PAYÉ ✅] ${bookingTypeLabel} - ${form.clientName || 'Nouveau client'}`,
        html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>YassAuto - Nouvelle réservation confirmée</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding:20px 10px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td align="center" style="padding:20px 20px 10px 20px;background-color:#000000;">
              <img src="https://via.placeholder.com/140x80?text=YassAuto+Logo" alt="YassAuto" width="140" style="display:block;border:0;outline:none;text-decoration:none;">
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 20px 15px 20px;background-color:#000000;">
              <h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:20px;line-height:1.4;color:#ffffff;">Réservation confirmée</h1>
              <p style="margin:5px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#90EE90;">✅ Acompte 20 € reçu</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 25px 10px 25px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#333333;">
              Nouvelle réservation confirmée pour ${form.clientName || 'Client'} — Acompte reçu.
            </td>
          </tr>
          <tr>
            <td style="padding:5px 25px 15px 25px;">
              <h2 style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#000000;border-left:4px solid #e30613;padding-left:8px;">Infos client</h2>
              <table role="presentation" cellpadding="6" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:13px;">
                <tr><td style="width:40%;font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Nom</td><td style="border:1px solid #dddddd;">${form.clientName || ''}</td></tr>
                <tr><td style="font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Email</td><td style="border:1px solid #dddddd;">${clientEmail || 'Non fourni'}</td></tr>
                <tr><td style="font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Téléphone</td><td style="border:1px solid #dddddd;">${form.clientPhone || 'Non fourni'}</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:5px 25px 15px 25px;">
              <h2 style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#000000;border-left:4px solid #e30613;padding-left:8px;">Rendez-vous</h2>
              <table role="presentation" cellpadding="6" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:13px;">
                <tr><td style="width:40%;font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Type</td><td style="border:1px solid #dddddd;">${bookingTypeLabel}</td></tr>
                <tr><td style="font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Date</td><td style="border:1px solid #dddddd;">${form.bookingDate || 'À déterminer'}</td></tr>
                <tr><td style="font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Heure</td><td style="border:1px solid #dddddd;">${form.bookingTime || 'À déterminer'}</td></tr>
                <tr><td style="font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Notes client</td><td style="border:1px solid #dddddd;">${form.description || 'Aucune'}</td></tr>
              </table>
            </td>
          </tr>
              <tr>
            <td style="padding:5px 25px 15px 25px;">
              <h2 style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#000000;border-left:4px solid #e30613;padding-left:8px;">Paiement</h2>
              <table role="presentation" cellpadding="6" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:13px;">
                <tr><td style="width:40%;font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Prix total</td><td style="border:1px solid #dddddd;">${(totalCents/100).toFixed(2)} € TTC${form.isStudent ? ' (tarif étudiant -30%)' : ''}</td></tr>
                <tr><td style="font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Acompte payé en ligne</td><td style="border:1px solid #dddddd;"><strong style="color:#90EE90;">${(depositCents/100).toFixed(2)} € TTC ✅</strong></td></tr>
                <tr><td style="font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Solde à régler sur place</td><td style="border:1px solid #dddddd;">${(balanceCents/100).toFixed(2)} € TTC</td></tr>
              </table>
              ${form.isStudent ? `<p style="color:#b45309;margin-top:8px;font-size:13px;">⚠️ Client bénéficie du tarif étudiant. Vérifier la carte d'étudiant lors du RDV. Si non valide, appliquer le tarif plein (${((15000 - depositCents)/100).toFixed(2)} € au lieu de ${(balanceCents/100).toFixed(2)} €).</p>` : ''}
            </td>
          </tr>
          <tr>
            <td style="padding:15px 25px 20px 25px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:#333333;">
              Cette réservation est confirmée et en attente de votre validation.<br>
              Le client a reçu un email de confirmation.
            </td>
          </tr>
          <tr>
            <td style="padding:15px 25px;background-color:#f9f9f9;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#999999;border-top:1px solid #eeeeee;">
              ID Réservation: <strong>${reservationId}</strong> | Créée le: <strong>${new Date().toLocaleString('fr-FR')}</strong>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
      };

      await transporter.sendMail(adminMailOptions);
      console.log('Admin notified for reservation', reservationId);

      if (clientEmail) {
        const clientMailOptions = {
            from: GMAIL_USER || 'no-reply@yassauto.local',
            to: clientEmail,
            subject: `Confirmation de rendez-vous - YassAuto | ${bookingTypeLabel}`,
            html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>YassAuto - Confirmation de rendez-vous</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding:20px 10px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td align="center" style="padding:20px 20px 10px 20px;background-color:#000000;">
              <img src="https://via.placeholder.com/140x80?text=YassAuto+Logo" alt="YassAuto" width="140" style="display:block;border:0;outline:none;text-decoration:none;">
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 20px 15px 20px;background-color:#000000;">
              <h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:20px;line-height:1.4;color:#ffffff;">Bienvenue chez YassAuto</h1>
              <p style="margin:5px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#f0f0f0;">Confirmation de votre rendez-vous</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 25px 10px 25px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#333333;">
              Bonjour <strong>${form.clientName || 'Client'}</strong>,<br><br>
              Merci pour votre confiance. Votre rendez-vous a bien été enregistré et votre acompte a été reçu ✅
            </td>
          </tr>
          <tr>
            <td style="padding:5px 25px 15px 25px;">
              <h2 style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#000000;border-left:4px solid #e30613;padding-left:8px;">Détails du rendez-vous</h2>
              <table role="presentation" cellpadding="6" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:13px;">
                <tr><td style="width:40%;font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Type de service</td><td style="border:1px solid #dddddd;">${bookingTypeLabel}</td></tr>
                <tr><td style="font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Date</td><td style="border:1px solid #dddddd;">${form.bookingDate || 'À déterminer'}</td></tr>
                <tr><td style="font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Heure</td><td style="border:1px solid #dddddd;">${form.bookingTime || 'À déterminer'} (durée 1h30)</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:5px 25px 15px 25px;">
              <h2 style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#000000;border-left:4px solid #e30613;padding-left:8px;">Vos informations</h2>
              <table role="presentation" cellpadding="6" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:13px;">
                <tr><td style="width:40%;font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Nom</td><td style="border:1px solid #dddddd;">${form.clientName || ''}</td></tr>
                <tr><td style="font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Téléphone</td><td style="border:1px solid #dddddd;">${form.clientPhone || ''}</td></tr>
                <tr><td style="font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Email</td><td style="border:1px solid #dddddd;">${clientEmail || ''}</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:5px 25px 15px 25px;">
              <h2 style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#000000;border-left:4px solid #e30613;padding-left:8px;">Tarifs et paiement</h2>
              <table role="presentation" cellpadding="6" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:13px;">
                <tr><td style="width:40%;font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Prix de l'accompagnement</td><td style="border:1px solid #dddddd;">${(totalCents/100).toFixed(2)} € TTC${form.isStudent ? ' (tarif étudiant -30%)' : ''}</td></tr>
                <tr><td style="font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Acompte payé en ligne</td><td style="border:1px solid #dddddd;"><strong style="color:#e30613;">${(depositCents/100).toFixed(2)} € TTC ✅ Reçu</strong></td></tr>
                <tr><td style="font-weight:bold;border:1px solid #dddddd;background-color:#fafafa;">Solde à régler sur place</td><td style="border:1px solid #dddddd;">${(balanceCents/100).toFixed(2)} € TTC (carte ou espèces)</td></tr>
              </table>
            </td>
          </tr>
          ${form.isStudent ? `<tr><td style="padding:10px 25px 15px 25px;color:#b45309;font-size:13px;">⚠️ Carte d'étudiant à présenter le jour du rendez-vous. En cas de non-présentation, le tarif plein sera appliqué (solde ${((15000 - depositCents)/100).toFixed(2)} € au lieu de ${(balanceCents/100).toFixed(2)} €).</td></tr>` : ''}
          <tr>
            <td style="padding:5px 25px 15px 25px;">
              <h2 style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#000000;border-left:4px solid #e30613;padding-left:8px;">Politique d'annulation</h2>
              <ul style="margin:0 0 8px 20px;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#333333;">
                <li>Annulation plus de 2h avant : acompte remboursé.</li>
                <li>Annulation moins de 2h avant : acompte conservé.</li>
                <li>Retard 20+ min sans prévenir : rendez-vous annulé, acompte dû.</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td style="padding:15px 25px 20px 25px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:#333333;">
              À très bientôt,<br><strong>L'équipe YassAuto</strong><br>
              📞 06 48 38 05 68 | 📧 ${ADMIN_EMAIL} | 🌐 www.yassauto.fr
            </td>
          </tr>
          <tr>
            <td style="padding:15px 25px;background-color:#f9f9f9;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#999999;border-top:1px solid #eeeeee;">
              Réservation ID: <strong>${reservationId}</strong>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
          };

        await transporter.sendMail(clientMailOptions);
        console.log('Client notified:', clientEmail);
      }
    } catch (e) {
      console.error('Error sending confirmation emails after webhook', e);
    }
  }

  // Return a 200 to acknowledge receipt of the event
  res.json({ received: true });
});

// Get Stripe Checkout session information (used by frontend confirmation page)
app.get('/api/stripe-session', async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ error: 'Missing session_id query parameter' });
    }

    // Support fake session ids created for local testing: fake-<reservationId>
    if (sessionId.startsWith('fake-')) {
      const reservationId = sessionId.replace('fake-', '');
      const reservations = readReservations();
      const reservation = reservations.find(r => r.id === reservationId) || null;
      return res.json({
        success: true,
        session: {
          id: sessionId,
          payment_status: reservation && reservation.status === 'confirmed' ? 'paid' : 'unpaid',
          customer_details: { email: reservation?.form?.clientEmail || null },
          metadata: { reservationId: reservationId, isStudent: reservation?.form?.isStudent ? '1' : '0' }
        },
        reservation
      });
    }

    // If Stripe SDK isn't available, return an error
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured on server' });
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['payment_intent'] });

    // Try to find stored reservation by metadata.reservationId
    let reservation = null;
    if (session && session.metadata && session.metadata.reservationId) {
      const reservations = readReservations();
      reservation = reservations.find(r => r.id === session.metadata.reservationId) || null;
    }

    res.json({ success: true, session, reservation });
  } catch (err) {
    console.error('Error fetching stripe session', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de la session Stripe', details: err.message });
  }
});

// Send booking confirmation email
app.post('/booking/send-email', async (req, res) => {
  await ensureTransporter();
  try {
    const { 
      clientName, 
      clientEmail, 
      clientPhone, 
      bookingDate, 
      bookingTime, 
      bookingType, // 'accompagnement' or 'mecanique'
      description 
    } = req.body;

    console.log('Received booking request:', { clientName, clientEmail, clientPhone, bookingDate, bookingType });

    if (!clientName || !clientPhone || !bookingDate) {
      console.error('Missing required fields');
      return res.status(400).json({ error: 'Champs manquants : clientName, clientPhone, bookingDate requis' });
    }

    // Use email if provided, otherwise use a placeholder
    const finalEmail = clientEmail && clientEmail.includes('@') ? clientEmail : `booking-${Date.now()}@yassauto.local`;
    
    const bookingDateTime = `${bookingDate} ${bookingTime || '10:00'}`;
    const bookingTypeLabel = bookingType === 'accompagnement' ? 'Accompagnement Achat' : 'Devis Mécanique';

    // Student pricing logic (for non-Stripe booking/send-email flow)
    const isStudentFlag = !!req.body.isStudent;
    const totalCents = isStudentFlag ? 10000 : 15000;
    const depositCents = 2000;
    const balanceCents = totalCents - depositCents;

    // Email to client
    const clientMailOptions = {
      from: GMAIL_USER,
      to: finalEmail,
      subject: `Confirmation de rendez-vous - YassAuto | ${bookingTypeLabel}`,
      html: `
        <h2>Bienvenue chez YassAuto ! 🚗</h2>
        <p>Merci pour votre confiance. Votre rendez-vous a été enregistré :</p>
        <table border="1" cellpadding="10" style="border-collapse: collapse;">
          <tr>
            <td><strong>Type de service</strong></td>
            <td>${bookingTypeLabel}</td>
          </tr>
          <tr>
            <td><strong>Date & Heure</strong></td>
            <td>${bookingDateTime}</td>
          </tr>
          <tr>
            <td><strong>Votre nom</strong></td>
            <td>${clientName}</td>
          </tr>
          <tr>
            <td><strong>Téléphone</strong></td>
            <td>${clientPhone || 'Non fourni'}</td>
          </tr>
          <tr>
            <td><strong>Description</strong></td>
            <td>${description || 'Aucune description'}</td>
          </tr>
          ${bookingType === 'accompagnement' ? `
          <tr>
            <td><strong>Prix total</strong></td>
            <td>${(totalCents/100).toFixed(2)} € TTC${isStudentFlag ? ' (tarif étudiant -30%)' : ''}</td>
          </tr>
          <tr>
            <td><strong>Acompte payé en ligne</strong></td>
            <td>${(depositCents/100).toFixed(2)} € TTC</td>
          </tr>
          <tr>
            <td><strong>Solde à régler sur place</strong></td>
            <td>${(balanceCents/100).toFixed(2)} € TTC</td>
          </tr>
          ` : ''}
        </table>
        ${isStudentFlag ? `<p style="color:#b45309">⚠️ Votre statut étudiant sera vérifié le jour du rendez-vous. Merci de vous munir de votre carte d'étudiant en cours de validité. En cas de non-présentation, le tarif plein (150 €) sera appliqué, soit un solde de ${(15000 - depositCents)/100} € au lieu de ${(balanceCents/100).toFixed(2)} €.</p>` : ''}
        <p><strong>Contact :</strong> 06 48 38 05 68</p>
        <p>Merci et à bientôt ! 👍</p>
      `
    };

    // Email to admin (you)
    const adminMailOptions = {
      from: GMAIL_USER,
      to: ADMIN_EMAIL,
      subject: `[NOUVEAU RENDEZ-VOUS] ${bookingTypeLabel} - ${clientName}`,
      html: `
        <h2>Nouveau rendez-vous reçu</h2>
        <table border="1" cellpadding="10" style="border-collapse: collapse;">
          <tr>
            <td><strong>Type</strong></td>
            <td>${bookingTypeLabel}</td>
          </tr>
          <tr>
            <td><strong>Client</strong></td>
            <td>${clientName}</td>
          </tr>
          <tr>
            <td><strong>Email</strong></td>
            <td>${finalEmail}</td>
          </tr>
          <tr>
            <td><strong>Téléphone</strong></td>
            <td>${clientPhone || 'Non fourni'}</td>
          </tr>
          <tr>
            <td><strong>Date & Heure</strong></td>
            <td>${bookingDateTime}</td>
          </tr>
          <tr>
            <td><strong>Description/Détails</strong></td>
            <td>${description || 'Aucune'}</td>
          </tr>
          ${bookingType === 'accompagnement' ? `
          <tr>
            <td><strong>Prix total</strong></td>
            <td>${(totalCents/100).toFixed(2)} € TTC${isStudentFlag ? ' (tarif étudiant -30%)' : ''}</td>
          </tr>
          <tr>
            <td><strong>Solde attendu</strong></td>
            <td>${(balanceCents/100).toFixed(2)} € TTC</td>
          </tr>
          ` : ''}
        </table>
        ${isStudentFlag ? `<p style="color:#b45309">⚠️ Client bénéficie du tarif étudiant. Vérifier la carte d'étudiant lors du RDV. Si non valide, appliquer le tarif plein (${((15000 - depositCents)/100).toFixed(2)} € au lieu de ${(balanceCents/100).toFixed(2)} €).</p>` : ''}
      `
    };

    // Send both emails
    console.log('Sending emails...');
    const clientInfo = await transporter.sendMail(clientMailOptions);
    console.log('Client email sent to:', finalEmail);
    recordPreview('client', clientInfo);

    const adminInfo = await transporter.sendMail(adminMailOptions);
    console.log('Admin email sent to:', ADMIN_EMAIL);
    recordPreview('admin', adminInfo);

    res.json({ 
      success: true, 
      message: 'Emails envoyés avec succès',
      clientEmail: finalEmail,
      adminEmail: ADMIN_EMAIL
    });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ error: 'Erreur serveur lors de l\'envoi', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Email booking server running on http://localhost:${PORT}`);
  console.log(`Send POST requests to http://localhost:${PORT}/booking/send-email`);
});

