const { getFirebaseAdmin } = require('../firebase-admin');

const FEDAPAY_ENVIRONMENT = process.env.FEDAPAY_ENVIRONMENT === 'live' ? 'live' : 'sandbox';
const FEDAPAY_API_BASE = FEDAPAY_ENVIRONMENT === 'live'
  ? 'https://api.fedapay.com/v1'
  : 'https://sandbox-api.fedapay.com/v1';

function sendJson(res, status, payload) {
  res.status(status).json(payload);
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://rachad8.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Vary', 'Origin');
}

async function getUser(req) {
  const authorization = req.headers.authorization || '';
  if (!authorization.startsWith('Bearer ')) {
    const error = new Error('Connexion Firebase requise.');
    error.statusCode = 401;
    throw error;
  }
  const token = authorization.slice('Bearer '.length).trim();
  if (!token) {
    const error = new Error('Token Firebase manquant.');
    error.statusCode = 401;
    throw error;
  }
  const admin = getFirebaseAdmin();
  return admin.auth().verifyIdToken(token);
}

async function getInvoiceForUser(factureId, uid) {
  if (!factureId) {
    const error = new Error('ID de facture requis.');
    error.statusCode = 400;
    throw error;
  }
  const admin = getFirebaseAdmin();
  const db = admin.firestore();
  const ref = db.collection('factures').doc(String(factureId));
  const snapshot = await ref.get();
  if (!snapshot.exists) {
    const error = new Error('Facture introuvable.');
    error.statusCode = 404;
    throw error;
  }
  const facture = snapshot.data();
  const profile = await db.collection('clients').doc(uid).get();
  const profileData = profile.data() || {};
  const isAdmin = profileData.role === 'admin' || profileData.isAdmin === true;
  if (!isAdmin && facture.clientId !== uid) {
    const error = new Error('Cette facture ne vous appartient pas.');
    error.statusCode = 403;
    throw error;
  }
  return { admin, db, ref, facture };
}

async function fedapayRequest(path, options = {}) {
  const secret = process.env.FEDAPAY_SECRET_KEY;
  if (!secret) {
    const error = new Error('FEDAPAY_SECRET_KEY n’est pas configurée dans Vercel.');
    error.statusCode = 503;
    throw error;
  }
  const response = await fetch(`${FEDAPAY_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = payload?.message || payload?.error || payload?.errors || payload?.error_description || `FedaPay a répondu ${response.status}.`;
    const detailText = typeof detail === 'string' ? detail : JSON.stringify(detail);
    console.error('FedaPay API error:', JSON.stringify({ status: response.status, payload }));
    const error = new Error(detailText);
    error.statusCode = response.status >= 500 ? 502 : 400;
    throw error;
  }
  const transaction = payload?.transaction
    || payload?.data
    || payload?.['v1/transaction']
    || payload?.['v1_transaction']
    || payload;

  if (!transaction || transaction.id === undefined || transaction.id === null) {
    console.error('Réponse FedaPay sans identifiant de transaction:', {
      keys: Object.keys(payload || {}),
      nestedKeys: transaction && typeof transaction === 'object' ? Object.keys(transaction) : []
    });
    const error = new Error('FedaPay a créé une réponse sans identifiant de transaction. Consultez les journaux Vercel.');
    error.statusCode = 502;
    throw error;
  }

  return transaction;
}

module.exports = {
  FEDAPAY_ENVIRONMENT,
  sendJson,
  setCors,
  getUser,
  getInvoiceForUser,
  fedapayRequest
};
