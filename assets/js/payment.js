const FEDAPAY_CONFIG = {
    environment: 'sandbox',
    publicKey: 'VOTRE_CLE_PUBLIQUE_FEDAPAY_SANDBOX'
};

const FacturationAPI = {
    generateFactureId() {
        const annee = new Date().getFullYear();
        const numero = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
        return 'FAC-' + annee + '-' + numero;
    },
    async createFacture(data) {
        try {
            const factureId = this.generateFactureId();
            const facture = { id: factureId, clientId: data.clientId, clientNom: data.clientNom, clientEmail: data.clientEmail, clientTelephone: data.clientTelephone || '', demandeId: data.demandeId || '', service: data.service, description: data.description || '', montant: data.montant, date: firebase.firestore.FieldValue.serverTimestamp(), statut: 'en-attente' };
            await db.collection('factures').doc(factureId).set(facture);
            return { success: true, data: facture };
        } catch (error) { return { success: false, error: error.message }; }
    },
    async getClientFactures(clientId) {
        try {
            const snapshot = await db.collection('factures').where('clientId', '==', clientId).orderBy('date', 'desc').get();
            const factures = []; snapshot.forEach(doc => factures.push({ id: doc.id, ...doc.data() }));
            return { success: true, data: factures };
        } catch (error) { return { success: false, error: error.message }; }
    },
    async getAllFactures() {
        try {
            const snapshot = await db.collection('factures').orderBy('date', 'desc').get();
            const factures = []; snapshot.forEach(doc => factures.push({ id: doc.id, ...doc.data() }));
            return { success: true, data: factures };
        } catch (error) { return { success: false, error: error.message }; }
    },
    async updateStatut(factureId, statut) {
        try {
            await db.collection('factures').doc(factureId).update({ statut, datePaiement: statut === 'payee' ? firebase.firestore.FieldValue.serverTimestamp() : null });
            return { success: true };
        } catch (error) { return { success: false, error: error.message }; }
    },
    async deleteFacture(factureId) {
        try { await db.collection('factures').doc(factureId).delete(); return { success: true }; }
        catch (error) { return { success: false, error: error.message }; }
    },
    async payerFacture(facture) {
        if (!facture?.id) throw new Error('Facture invalide.');
        if (facture.statut === 'payee') throw new Error('Cette facture est déjà payée.');
        if (!window.firebase?.functions) throw new Error('Firebase Functions n’est pas disponible.');
        await this.loadFedaPayCheckout();
        if (!FEDAPAY_CONFIG.publicKey || FEDAPAY_CONFIG.publicKey.startsWith('VOTRE_')) throw new Error('La clé publique FedaPay n’est pas encore configurée dans assets/js/payment.js.');
        const result = await firebase.functions().httpsCallable('createFedaPayTransaction')({ factureId: facture.id });
        const payment = result.data;
        if (!payment?.success || !payment.transactionId) throw new Error('Impossible de créer la transaction FedaPay.');
        const widget = FedaPay.init({
            public_key: FEDAPAY_CONFIG.publicKey,
            environment: FEDAPAY_CONFIG.environment,
            locale: 'fr',
            transaction: { id: payment.transactionId, amount: payment.amount, description: 'Paiement facture ' + facture.id },
            customer: { email: facture.clientEmail || '', lastname: facture.clientNom || 'Client' },
            onComplete: async (reason, transaction) => {
                if (reason !== FedaPay.CHECKOUT_COMPLETED) return;
                try {
                    const verification = await firebase.functions().httpsCallable('verifyFedaPayPayment')({ factureId: facture.id, transactionId: transaction?.id || payment.transactionId });
                    if (verification.data?.paid) { alert('Paiement confirmé. Votre facture est maintenant payée.'); window.location.reload(); }
                    else alert('Le paiement n’a pas encore été confirmé. Vérifiez votre facture dans quelques instants.');
                } catch (error) { console.error('Erreur de vérification FedaPay:', error); alert('La confirmation automatique du paiement a échoué. Actualisez la page ou contactez le support.'); }
            }
        });
        widget.open();
        return payment;
    },
    loadFedaPayCheckout() {
        if (window.FedaPay) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const existing = document.querySelector('script[data-fedapay-checkout]');
            if (existing) { existing.addEventListener('load', resolve, { once: true }); existing.addEventListener('error', () => reject(new Error('Impossible de charger FedaPay Checkout.')), { once: true }); return; }
            const script = document.createElement('script'); script.src = 'https://cdn.fedapay.com/checkout.js?v=1.1.7'; script.async = true; script.dataset.fedapayCheckout = 'true'; script.onload = resolve; script.onerror = () => reject(new Error('Impossible de charger FedaPay Checkout.')); document.head.appendChild(script);
        });
    },
    generateFactureHTML(facture) {
        const date = facture.date ? new Date(facture.date.toDate()).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR');
        return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;color:#0F172A;padding:40px}.header{text-align:center;margin-bottom:30px}.header h1{color:#3B82F6;margin:0;font-size:24px}.header p{color:#64748B;margin:5px 0;font-size:12px}.facture-title{text-align:center;font-size:20px;font-weight:bold;margin:20px 0}.info-table{width:100%;margin-bottom:20px}.info-table td{padding:4px 0;font-size:13px}.table{width:100%;border-collapse:collapse;margin:20px 0}.table th{background:#3B82F6;color:white;padding:10px;text-align:left;font-size:13px}.table td{padding:10px;border-bottom:1px solid #E2E8F0;font-size:13px}.total{text-align:right;font-size:18px;font-weight:bold;margin-top:20px}.footer{text-align:center;margin-top:50px;font-size:11px;color:#94A3B8}.statut{display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:bold}.statut-payee{background:#F0FDF4;color:#16A34A}.statut-attente{background:#FFFBEB;color:#F59E0B}</style></head><body><div class="header"><h1>AKPO TECH SOLUTIONS</h1><p>Calavi Zopah | Tel: 01 90 18 25 49</p><p>contact@akpotechsolutions.com</p></div><div class="facture-title">FACTURE N° ${facture.id}</div><table class="info-table"><tr><td>Date :</td><td>${date}</td></tr><tr><td>Client :</td><td>${facture.clientNom}</td></tr><tr><td>Email :</td><td>${facture.clientEmail}</td></tr><tr><td>Téléphone :</td><td>${facture.clientTelephone||'-'}</td></tr><tr><td>Statut :</td><td><span class="statut ${facture.statut==='payee'?'statut-payee':'statut-attente'}">${facture.statut==='payee'?'Payée':'En attente'}</span></td></tr></table><table class="table"><thead><tr><th>Service</th><th>Description</th><th>Montant</th></tr></thead><tbody><tr><td>${facture.service}</td><td>${facture.description||'-'}</td><td>${facture.montant.toLocaleString()} FCFA</td></tr></tbody></table><div class="total">TOTAL : ${facture.montant.toLocaleString()} FCFA</div><div class="footer"><p>AKPO TECH SOLUTIONS - Votre informatique, notre priorité</p><p>Merci de votre confiance !</p></div></body></html>`;
    },
    downloadFacturePDF(facture) { const printWindow = window.open('', '_blank'); printWindow.document.write(this.generateFactureHTML(facture)); printWindow.document.close(); setTimeout(() => printWindow.print(), 500); },
    sendFactureEmail(facture) {
        const sujet = 'Facture ' + facture.id + ' - AKPO TECH SOLUTIONS';
        const corps = 'Bonjour ' + facture.clientNom + ',\n\nVeuillez trouver ci-joint votre facture ' + facture.id + '.\n\nService : ' + facture.service + '\nMontant : ' + facture.montant.toLocaleString() + ' FCFA\nStatut : ' + (facture.statut === 'payee' ? 'Payée' : 'En attente') + '\n\nCordialement,\nAKPO TECH SOLUTIONS\nTel : 01 90 18 25 49';
        window.open('mailto:' + facture.clientEmail + '?subject=' + encodeURIComponent(sujet) + '&body=' + encodeURIComponent(corps), '_blank');
    },
    async getStats() {
        try { const snapshot = await db.collection('factures').get(); const stats = { total: snapshot.size, payees: 0, enAttente: 0, montantTotal: 0, montantPaye: 0 }; snapshot.forEach(doc => { const d = doc.data(); if (d.statut === 'payee') { stats.payees++; stats.montantPaye += d.montant || 0; } else if (d.statut === 'en-attente') stats.enAttente++; stats.montantTotal += d.montant || 0; }); return { success: true, data: stats }; }
        catch (error) { return { success: false, error: error.message }; }
    }
};

// Ajoute automatiquement le bouton Payer dans la liste des factures existante.
(function initFedaPayInvoiceButtons() {
    function injectButtons() {
        const table = document.getElementById('facturesTable');
        if (!table) return;
        table.querySelectorAll('tr').forEach(row => {
            const strong = row.querySelector('td:first-child strong');
            if (!strong || row.querySelector('.btn-fedapay-pay')) return;
            const factureId = strong.textContent.trim();
            const facture = Array.isArray(window.allFactures) ? window.allFactures.find(f => f.id === factureId) : null;
            if (!facture || facture.statut === 'payee') return;
            const actions = row.querySelector('td:last-child');
            if (!actions) return;
            const button = document.createElement('button');
            button.className = 'btn btn-sm btn-success btn-action btn-fedapay-pay';
            button.title = 'Payer avec FedaPay';
            button.innerHTML = '<i class="bi bi-credit-card"></i> Payer';
            button.addEventListener('click', async () => {
                button.disabled = true;
                try { await FacturationAPI.payerFacture(facture); }
                catch (error) { console.error(error); alert(error.message || 'Impossible de lancer le paiement.'); button.disabled = false; }
            });
            actions.prepend(button);
        });
    }
    const observer = new MutationObserver(injectButtons);
    document.addEventListener('DOMContentLoaded', () => { const table = document.getElementById('facturesTable'); if (table) observer.observe(table, { childList: true, subtree: true }); injectButtons(); });
})();
