const {
  sendJson,
  setCors,
  getUser,
  getInvoiceForUser,
  fedapayRequest,
  FEDAPAY_ENVIRONMENT
} = require('./_shared');

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Méthode non autorisée.' });

  try {
    const user = await getUser(req);
    const factureId = String(req.body?.factureId || '').trim();
    const { ref, facture } = await getInvoiceForUser(factureId, user.uid);
    if (facture.statut === 'payee') return sendJson(res, 409, { error: 'Cette facture est déjà payée.' });

    const amount = Number(facture.montant);
    if (!Number.isInteger(amount) || amount <= 0) {
      return sendJson(res, 400, { error: 'Le montant de la facture est invalide.' });
    }

    const merchantReference = `AKPO-${factureId}-${Date.now()}`;
    const transaction = await fedapayRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify({
        description: `Paiement facture ${factureId}`,
        amount,
        currency: { iso: 'XOF' },
        callback_url: 'https://rachad8.github.io/akpo-tech-solutions/client/invoices.html',
        merchant_reference: merchantReference,
        custom_metadata: { facture_id: factureId, client_id: facture.clientId },
        customer: {
          email: facture.clientEmail || user.email || undefined,
          firstname: facture.clientNom || 'Client'
        }
      })
    });

    await ref.update({
      fedaPayTransactionId: transaction.id,
      fedaPayReference: transaction.reference || null,
      fedaPayMerchantReference: merchantReference,
      paiementMisAJourLe: require('../firebase-admin').getFirebaseAdmin().firestore.FieldValue.serverTimestamp()
    });

    return sendJson(res, 200, {
      success: true,
      transactionId: transaction.id,
      reference: transaction.reference || null,
      amount: transaction.amount || amount,
      environment: FEDAPAY_ENVIRONMENT
    });
  } catch (error) {
    console.error('Vercel FedaPay create error:', error);
    return sendJson(res, error.statusCode || 500, { error: error.message || 'Impossible de créer la transaction.' });
  }
};
