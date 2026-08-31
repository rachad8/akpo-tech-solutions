const {
  sendJson,
  setCors,
  getUser,
  getInvoiceForUser,
  fedapayRequest
} = require('./_shared');

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Méthode non autorisée.' });

  try {
    const user = await getUser(req);
    const factureId = String(req.body?.factureId || '').trim();
    const transactionId = String(req.body?.transactionId || '').trim();
    if (!transactionId) return sendJson(res, 400, { error: 'ID de transaction requis.' });

    const { admin, db, ref, facture } = await getInvoiceForUser(factureId, user.uid);
    const transaction = await fedapayRequest(`/transactions/${encodeURIComponent(transactionId)}`);
    const metadata = transaction.custom_metadata || transaction.metadata || {};
    const amount = Number(transaction.amount);
    const status = String(transaction.status || 'unknown').toLowerCase();
    const paid = ['approved', 'transferred', 'paid'].includes(status);
    const valid = paid && String(metadata.facture_id || '') === factureId
      && String(metadata.client_id || '') === user.uid
      && amount === Number(facture.montant);

    if (!valid) return sendJson(res, 200, { success: true, paid: false, status });

    await ref.update({
      statut: 'payee',
      datePaiement: admin.firestore.FieldValue.serverTimestamp(),
      fedaPayTransactionId: transaction.id || transactionId,
      fedaPayReference: transaction.reference || null,
      fedaPayStatus: transaction.status,
      fedaPayReceiptUrl: transaction.receipt_url || null
    });
    await db.collection('paiements').doc(String(transaction.id || transactionId)).set({
      transactionId: transaction.id || transactionId,
      reference: transaction.reference || null,
      factureId,
      clientId: user.uid,
      montant: amount,
      devise: 'XOF',
      statut: transaction.status,
      source: 'fedapay',
      date: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return sendJson(res, 200, { success: true, paid: true, status });
  } catch (error) {
    console.error('Vercel FedaPay verify error:', error);
    return sendJson(res, error.statusCode || 500, { error: error.message || 'Impossible de vérifier le paiement.' });
  }
};
