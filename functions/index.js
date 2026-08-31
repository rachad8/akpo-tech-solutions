

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });

admin.initializeApp();
const db = admin.firestore();

const EMAIL_USER = functions.config().email.user || 'contatstechsolutionsakpo@gmail.com';
const EMAIL_PASSWORD = functions.config().email.password;

if (!EMAIL_PASSWORD) {
    console.error('❌ EMAIL_PASSWORD non configuré');
    throw new Error('Configuration email manquante. Exécutez : firebase functions:config:set email.password="VOTRE_MOT_DE_PASSE"');
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
    }
});
exports.notifyNewDemande = functions.firestore
    .document('clients/{clientId}/demandes/{demandeId}')
    .onCreate(async (snap, context) => {
        const data = snap.data();
        const clientId = context.params.clientId;

        const clientDoc = await db.collection('clients').doc(clientId).get();
        const clientData = clientDoc.data();

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; color: #0F172A; padding: 20px; }
                    .header { background: #3B82F6; color: white; padding: 20px; border-radius: 12px; text-align: center; }
                    .content { padding: 20px; border: 1px solid #E2E8F0; border-radius: 12px; margin: 20px 0; }
                    .info { padding: 8px 0; border-bottom: 1px solid #F1F5F9; }
                    .label { font-weight: 600; color: #475569; }
                    .btn { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; }
                    .footer { text-align: center; color: #94A3B8; font-size: 12px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Nouvelle demande d'intervention</h1>
                    <p>AKPO TECH SOLUTIONS</p>
                </div>
                <div class="content">
                    <div class="info"><span class="label">Référence :</span> ${data.id}</div>
                    <div class="info"><span class="label">Client :</span> ${clientData?.nom || 'Inconnu'}</div>
                    <div class="info"><span class="label">Téléphone :</span> ${clientData?.telephone || '-'}</div>
                    <div class="info"><span class="label">Email :</span> ${clientData?.email || '-'}</div>
                    <div class="info"><span class="label">Service :</span> ${data.service}</div>
                    <div class="info"><span class="label">Urgence :</span> ${data.urgence || 'Normal'}</div>
                    <div class="info"><span class="label">Adresse :</span> ${data.adresse || 'Non spécifiée'}</div>
                    <div class="info"><span class="label">Description :</span> ${data.description || 'Aucune description'}</div>
                    <div class="info"><span class="label">Date :</span> ${new Date().toLocaleString('fr-FR')}</div>
                </div>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="https://akpotechsolutions.com/admin/demandes.html" class="btn">Voir dans l'administration</a>
                </div>
                <div class="footer">
                    <p>AKPO TECH SOLUTIONS - Votre informatique, notre priorité</p>
                    <p>Tel: 01 90 18 25 49 | contact@akpotechsolutions.com</p>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: `AKPO TECH <${EMAIL_USER}>`,
            to: 'contatstechsolutionsakpo@gmail.com',
            subject: `📩 Nouvelle demande : ${data.id}`,
            html: html
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`✅ Email envoyé pour la demande ${data.id}`);
            return { success: true };
        } catch (error) {
            console.error('❌ Erreur email:', error);
            return { success: false, error: error.message };
        }
    });

exports.notifyNewContact = functions.firestore
    .document('contacts/{contactId}')
    .onCreate(async (snap, context) => {
        const data = snap.data();

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; color: #0F172A; padding: 20px; }
                    .header { background: #EF4444; color: white; padding: 20px; border-radius: 12px; text-align: center; }
                    .content { padding: 20px; border: 1px solid #E2E8F0; border-radius: 12px; margin: 20px 0; }
                    .info { padding: 8px 0; border-bottom: 1px solid #F1F5F9; }
                    .label { font-weight: 600; color: #475569; }
                    .btn { display: inline-block; background: #EF4444; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; }
                    .footer { text-align: center; color: #94A3B8; font-size: 12px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Nouveau message de contact</h1>
                    <p>AKPO TECH SOLUTIONS</p>
                </div>
                <div class="content">
                    <div class="info"><span class="label">Nom :</span> ${data.nom || 'Anonyme'}</div>
                    <div class="info"><span class="label">Téléphone :</span> ${data.telephone || '-'}</div>
                    <div class="info"><span class="label">Email :</span> ${data.email || '-'}</div>
                    <div class="info"><span class="label">Service :</span> ${data.service || 'Non spécifié'}</div>
                    <div class="info"><span class="label">Urgence :</span> ${data.urgence || 'Normal'}</div>
                    <div class="info"><span class="label">Adresse :</span> ${data.adresse || 'Non spécifiée'}</div>
                    <div class="info"><span class="label">Message :</span> ${data.description || 'Aucun message'}</div>
                    <div class="info"><span class="label">Date :</span> ${new Date().toLocaleString('fr-FR')}</div>
                </div>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="https://akpotechsolutions.com/admin/messages.html" class="btn">Voir dans l'administration</a>
                </div>
                <div class="footer">
                    <p>AKPO TECH SOLUTIONS - Votre informatique, notre priorité</p>
                    <p>Tel: 01 90 18 25 49 | contact@akpotechsolutions.com</p>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: `AKPO TECH <${EMAIL_USER}>`,
            to: 'contatstechsolutionsakpo@gmail.com',
            subject: `📩 Nouveau message de ${data.nom || 'visiteur'}`,
            html: html
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('✅ Email envoyé pour le message');
            return { success: true };
        } catch (error) {
            console.error('❌ Erreur email:', error);
            return { success: false, error: error.message };
        }
    });

exports.notifyNewFacture = functions.firestore
    .document('factures/{factureId}')
    .onCreate(async (snap, context) => {
        const data = snap.data();

        const clientEmail = data.clientEmail || 'contatstechsolutionsakpo@gmail.com';

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; color: #0F172A; padding: 20px; }
                    .header { background: #10B981; color: white; padding: 20px; border-radius: 12px; text-align: center; }
                    .content { padding: 20px; border: 1px solid #E2E8F0; border-radius: 12px; margin: 20px 0; }
                    .info { padding: 8px 0; border-bottom: 1px solid #F1F5F9; }
                    .label { font-weight: 600; color: #475569; }
                    .montant { font-size: 24px; font-weight: 700; color: #10B981; }
                    .btn { display: inline-block; background: #10B981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; }
                    .footer { text-align: center; color: #94A3B8; font-size: 12px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Votre facture est disponible</h1>
                    <p>AKPO TECH SOLUTIONS</p>
                </div>
                <div class="content">
                    <div class="info"><span class="label">Référence :</span> ${data.id}</div>
                    <div class="info"><span class="label">Service :</span> ${data.service}</div>
                    <div class="info"><span class="label">Description :</span> ${data.description || '-'}</div>
                    <div class="info" style="border-bottom: none;">
                        <span class="label">Montant :</span>
                        <span class="montant">${data.montant?.toLocaleString()} FCFA</span>
                    </div>
                    <div class="info"><span class="label">Statut :</span> ${data.statut === 'payee' ? '✅ Payée' : '⏳ En attente de paiement'}</div>
                    <div class="info"><span class="label">Date :</span> ${new Date().toLocaleString('fr-FR')}</div>
                </div>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="https://akpotechsolutions.com/client/invoices.html" class="btn">Voir mes factures</a>
                </div>
                <div class="footer">
                    <p>AKPO TECH SOLUTIONS - Votre informatique, notre priorité</p>
                    <p>Tel: 01 90 18 25 49 | contact@akpotechsolutions.com</p>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: `AKPO TECH <${EMAIL_USER}>`,
            to: clientEmail,
            subject: `🧾 Votre facture ${data.id}`,
            html: html
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`✅ Email facture envoyé pour ${data.id}`);
            return { success: true };
        } catch (error) {
            console.error('❌ Erreur email:', error);
            return { success: false, error: error.message };
        }
    });

exports.deleteClientAccount = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Vous devez être connecté');
    }

    const uid = context.auth.uid;
    const clientId = data.clientId || uid;

    if (uid !== clientId) {
        throw new functions.https.HttpsError('permission-denied', 'Action non autorisée');
    }

    try {
        const demandes = await db.collection('clients').doc(clientId).collection('demandes').get();
        for (const doc of demandes.docs) {
            await db.collection('clients').doc(clientId).collection('demandes').doc(doc.id).delete();
        }

        await db.collection('clients').doc(clientId).delete();

        const factures = await db.collection('factures').where('clientId', '==', clientId).get();
        for (const doc of factures.docs) {
            await db.collection('factures').doc(doc.id).delete();
        }

        if (uid === clientId) {
            await admin.auth().deleteUser(clientId);
        }

        return { success: true, message: 'Compte supprimé avec succès' };
    } catch (error) {
        console.error('❌ Erreur suppression:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
exports.markFacturePaid = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Vous devez être connecté');
    }

    const { factureId } = data;
    if (!factureId) {
        throw new functions.https.HttpsError('invalid-argument', 'ID de facture requis');
    }

    try {
        const factureDoc = await db.collection('factures').doc(factureId).get();
        if (!factureDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Facture introuvable');
        }

        const factureData = factureDoc.data();
        const uid = context.auth.uid;

        const userDoc = await db.collection('clients').doc(uid).get();
        const userData = userDoc.data();
        const isAdmin = userData?.role === 'admin' || userData?.isAdmin === true;

        if (!isAdmin && factureData.clientId !== uid) {
            throw new functions.https.HttpsError('permission-denied', 'Action non autorisée');
        }

        await db.collection('factures').doc(factureId).update({
            statut: 'payee',
            datePaiement: admin.firestore.FieldValue.serverTimestamp(),
            payePar: uid
        });

        return { success: true, message: 'Facture marquée comme payée' };
    } catch (error) {
        console.error('❌ Erreur paiement:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});

exports.getDashboardStats = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Vous devez être connecté');
    }

    const userDoc = await db.collection('clients').doc(context.auth.uid).get();
    const userData = userDoc.data();
    if (userData?.role !== 'admin' && !userData?.isAdmin) {
        throw new functions.https.HttpsError('permission-denied', 'Accès réservé aux administrateurs');
    }

    try {
        const clientsSnapshot = await db.collection('clients').get();
        const totalClients = clientsSnapshot.size;

        let totalDemandes = 0;
        let demandesParStatut = { 'en-attente': 0, 'en-cours': 0, 'termine': 0 };
        
        for (const doc of clientsSnapshot.docs) {
            const demandes = await db.collection('clients').doc(doc.id).collection('demandes').get();
            totalDemandes += demandes.size;
            
            for (const d of demandes.docs) {
                const statut = d.data().statut || 'en-attente';
                if (demandesParStatut[statut] !== undefined) {
                    demandesParStatut[statut]++;
                }
            }
        }

        const facturesSnapshot = await db.collection('factures').get();
        let totalFactures = 0;
        let montantTotal = 0;
        let facturesPayees = 0;

        for (const doc of facturesSnapshot.docs) {
            const data = doc.data();
            totalFactures++;
            montantTotal += data.montant || 0;
            if (data.statut === 'payee') facturesPayees++;
        }

        const messagesSnapshot = await db.collection('contacts').where('lu', '==', false).get();
        const messagesNonLus = messagesSnapshot.size;

        return {
            success: true,
            data: {
                clients: totalClients,
                demandes: {
                    total: totalDemandes,
                    enAttente: demandesParStatut['en-attente'],
                    enCours: demandesParStatut['en-cours'],
                    termine: demandesParStatut['termine']
                },
                factures: {
                    total: totalFactures,
                    payees: facturesPayees,
                    montantTotal: montantTotal
                },
                messagesNonLus: messagesNonLus
            }
        };
    } catch (error) {
        console.error('❌ Erreur statistiques:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});

exports.testEmail = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Vous devez être connecté');
    }

    const userDoc = await db.collection('clients').doc(context.auth.uid).get();
    const userData = userDoc.data();
    if (userData?.role !== 'admin' && !userData?.isAdmin) {
        throw new functions.https.HttpsError('permission-denied', 'Accès réservé aux administrateurs');
    }

    try {
        await transporter.sendMail({
            from: `AKPO TECH <${EMAIL_USER}>`,
            to: 'contatstechsolutionsakpo@gmail.com',
            subject: '✅ Test de configuration email',
            html: `
                <h2>Configuration email fonctionnelle !</h2>
                <p>Ce message confirme que l'envoi d'emails est correctement configuré.</p>
                <p>Vous recevrez désormais les notifications pour :</p>
                <ul>
                    <li>Nouvelles demandes d'intervention</li>
                    <li>Nouveaux messages de contact</li>
                    <li>Nouvelles factures</li>
                </ul>
                <p>Date du test : ${new Date().toLocaleString('fr-FR')}</p>
                <hr>
                <p style="color:#94A3B8;font-size:12px;">AKPO TECH SOLUTIONS</p>
            `
        });

        return { success: true, message: 'Email de test envoyé avec succès' };
    } catch (error) {
        console.error('❌ Erreur test email:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
