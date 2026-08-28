const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { FedaPay, Transaction } = require('fedapay');

admin.initializeApp();
const db = admin.firestore();

const FEDAPAY_SECRET_KEY = 'FEDAPAY_SECRET_KEY';
const FEDAPAY_ENVIRONMENT = process.env.FEDAPAY_ENVIRONMENT || 'sandbox';

function getFedaPayClient() {
    const secret = process.env[FEDAPAY_SECRET_KEY];
    if (!secret) {
        throw new Error('FEDAPAY_SECRET_KEY n\'est pas configurée.');
    }
    FedaPay.setApiKey(secret);
    FedaPay.setEnvironment(FEDAPAY_ENVIRONMENT === 'live' ? 'live' : 'sandbox');
}

function assertAmount(amount) {
    const value = Number(amount);
    if (!Number.isInteger(value) || value <= 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Montant de facture invalide.');
    }
    return value;
}

exports.createFedaPayTransaction = functions
    .runWith({ secrets: [FEDAPAY_SECRET_KEY] })
    .https.onCall(async (data, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Vous devez être connecté.');
        }

        const factureId = String(data?.factureId || '').trim();
        if (!factureId) {
            throw new functions.https.HttpsError('invalid-argument', 'ID de facture requis.');
        }

        try {
            const factureRef = db.collection('factures').doc(factureId);
            const factureSnap = await factureRef.get();

            if (!factureSnap.exists) {
                throw new functions.https.HttpsError('not-found', 'Facture introuvable.');
            }

            const facture = factureSnap.data();
            if (facture.clientId !== context.auth.uid) {
                throw new functions.https.HttpsError('permission-denied', 'Cette facture ne vous appartient pas.');
            }

            if (facture.statut === 'payee') {
                throw new functions.https.HttpsError('failed-precondition', 'Cette facture est déjà payée.');
            }

            const amount = assertAmount(facture.montant);
            const merchantReference = `AKPO-${factureId}-${Date.now()}`;

            getFedaPayClient();

            const transaction = await Transaction.create({
                description: `Paiement facture ${factureId}`,
                amount,
                currency: { iso: 'XOF' },
                callback_url: 'https://rachad8.github.io/akpo-tech-solutions/client/invoices.html',
                merchant_reference: merchantReference,
                custom_metadata: {
                    facture_id: factureId,
                    client_id: context.auth.uid
                },
                customer: {
                    email: facture.clientEmail || context.auth.token.email || undefined,
                    firstname: String(facture.clientNom || 'Client')
                }
            });

            await factureRef.update({
                fedaPayTransactionId: transaction.id,
                fedaPayReference: transaction.reference || null,
                fedaPayMerchantReference: merchantReference,
                paiementMisAJourLe: admin.firestore.FieldValue.serverTimestamp()
            });

            return {
                success: true,
                transactionId: transaction.id,
                reference: transaction.reference || null,
                amount,
                environment: FEDAPAY_ENVIRONMENT
            };
        } catch (error) {
            console.error('FedaPay create transaction error:', error);
            if (error instanceof functions.https.HttpsError) throw error;
            throw new functions.https.HttpsError('internal', 'Impossible de créer la transaction FedaPay.');
        }
    });

exports.verifyFedaPayPayment = functions
    .runWith({ secrets: [FEDAPAY_SECRET_KEY] })
    .https.onCall(async (data, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Vous devez être connecté.');
        }

        const factureId = String(data?.factureId || '').trim();
        const transactionId = Number(data?.transactionId);
        if (!factureId || !Number.isInteger(transactionId) || transactionId <= 0) {
            throw new functions.https.HttpsError('invalid-argument', 'Transaction ou facture invalide.');
        }

        try {
            const factureRef = db.collection('factures').doc(factureId);
            const factureSnap = await factureRef.get();
            if (!factureSnap.exists) {
                throw new functions.https.HttpsError('not-found', 'Facture introuvable.');
            }

            const facture = factureSnap.data();
            if (facture.clientId !== context.auth.uid) {
                throw new functions.https.HttpsError('permission-denied', 'Cette facture ne vous appartient pas.');
            }

            getFedaPayClient();
            const transaction = await Transaction.retrieve(transactionId);
            const metadata = transaction.custom_metadata || transaction.metadata || {};
            const amount = Number(transaction.amount);

            const approved = ['approved', 'transferred'].includes(String(transaction.status).toLowerCase());
            const matchingInvoice = String(metadata.facture_id || '') === factureId;
            const matchingClient = String(metadata.client_id || '') === context.auth.uid;
            const matchingAmount = amount === Number(facture.montant);

            if (!approved || !matchingInvoice || !matchingClient || !matchingAmount) {
                return {
                    success: false,
                    paid: false,
                    status: transaction.status || 'unknown'
                };
            }

            await factureRef.update({
                statut: 'payee',
                datePaiement: admin.firestore.FieldValue.serverTimestamp(),
                fedaPayTransactionId: transaction.id,
                fedaPayReference: transaction.reference || null,
                fedaPayStatus: transaction.status,
                fedaPayReceiptUrl: transaction.receipt_url || null
            });

            await db.collection('paiements').doc(String(transaction.id)).set({
                transactionId: transaction.id,
                reference: transaction.reference || null,
                factureId,
                clientId: context.auth.uid,
                montant: amount,
                devise: 'XOF',
                statut: transaction.status,
                source: 'fedapay',
                date: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            return { success: true, paid: true, status: transaction.status };
        } catch (error) {
            console.error('FedaPay verify transaction error:', error);
            if (error instanceof functions.https.HttpsError) throw error;
            throw new functions.https.HttpsError('internal', 'Impossible de vérifier le paiement.');
        }
    });
