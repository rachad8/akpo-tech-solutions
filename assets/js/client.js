

let currentUser = null;
let clientData = { demandes: [], factures: [] };

auth.onAuthStateChanged(async function(user) {
    if (!user) {
        window.location.href = '../auth/login.html';
        return;
    }
    
    currentUser = user;

    const profile = await ClientsAPI.getProfile(user.uid);
    if (profile.success) {
        document.getElementById('clientName').textContent = profile.data.nom.split(' ')[0];
    }

    await loadAllData();
});

async function loadAllData() {

    const demandesResult = await DemandesAPI.getByClient(currentUser.uid);
    if (demandesResult.success) {
        clientData.demandes = demandesResult.data;
        updateDemandes();
        updateStats();
    }

    const facturesResult = await FacturesAPI.getByClient(currentUser.uid);
    if (facturesResult.success) {
        clientData.factures = facturesResult.data;
        updateFactures();
    }
}

function updateStats() {
    const d = clientData.demandes;
    document.getElementById('statTotal').textContent = d.length;
    document.getElementById('statEnAttente').textContent = d.filter(x => x.statut === 'en-attente').length;
    document.getElementById('statEnCours').textContent = d.filter(x => x.statut === 'en-cours').length;
    document.getElementById('statTermine').textContent = d.filter(x => x.statut === 'termine').length;

    const recent = d.slice(0, 5);
    document.getElementById('recentDemandes').innerHTML = recent.length === 0 
        ? '<tr><td colspan="4" class="text-center">Aucune demande</td></tr>'
        : recent.map(d => `<tr><td><strong>${d.id}</strong></td><td>${d.service}</td><td>${formatDate(d.date)}</td><td><span class="badge bg-${getStatusColor(d.statut)}">${statutLabel(d.statut)}</span></td></tr>`).join('');
}

function updateDemandes() {
    const container = document.getElementById('demandesList');
    if (clientData.demandes.length === 0) {
        container.innerHTML = '<div class="col-12 text-center py-5"><i class="bi bi-inbox fs-1 text-muted"></i><p>Aucune demande</p></div>';
        return;
    }
    container.innerHTML = clientData.demandes.map(d => `
        <div class="col-md-6">
            <div class="card">
                <div class="d-flex justify-content-between mb-2"><span class="text-muted small">${d.id}</span><span class="badge bg-${getStatusColor(d.statut)}">${statutLabel(d.statut)}</span></div>
                <h4>${d.service}</h4>
                <p class="text-muted small">${d.description ? d.description.substring(0, 100) : ''}</p>
                <small class="text-muted"><i class="bi bi-calendar"></i> ${formatDate(d.date)}</small>
            </div>
        </div>
    `).join('');
}

function updateFactures() {
    const container = document.getElementById('facturesList');
    if (clientData.factures.length === 0) {
        container.innerHTML = '<div class="col-12 text-center py-5"><i class="bi bi-receipt fs-1 text-muted"></i><p>Aucune facture</p></div>';
        return;
    }
    container.innerHTML = clientData.factures.map(f => `
        <div class="col-md-6">
            <div class="card">
                <div class="d-flex justify-content-between mb-2"><span class="text-muted small">${f.id}</span><span class="badge bg-${f.statut === 'payee' ? 'success' : 'warning'}">${f.statut}</span></div>
                <h4>${f.service}</h4>
                <h3 class="text-primary">${f.montant} FCFA</h3>
                <small class="text-muted"><i class="bi bi-calendar"></i> ${formatDate(f.date)}</small>
            </div>
        </div>
    `).join('');
}

async function createDemande(e) {
    e.preventDefault();
    const data = {
        service: document.getElementById('demandeService').value,
        urgence: document.getElementById('demandeUrgence').value,
        adresse: document.getElementById('demandeAdresse').value,
        description: document.getElementById('demandeDescription').value
    };
    
    const result = await DemandesAPI.create(currentUser.uid, data);
    if (result.success) {
        clientData.demandes.unshift(result.data);
        updateDemandes();
        updateStats();
        navigateTo('demandes');
        document.getElementById('newDemandeForm').reset();
    } else {
        alert('Erreur : ' + result.error);
    }
    return false;
}

function navigateTo(page) {
    document.querySelectorAll('[id^="page-"]').forEach(p => p.style.display = 'none');
    document.getElementById('page-' + page).style.display = 'block';
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
}

document.querySelectorAll('.sidebar-link[data-page]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        navigateTo(this.dataset.page);
    });
});

function formatDate(d) {
    if (!d) return '';
    const dt = d.toDate ? d.toDate() : new Date(d);
    return dt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}
function statutLabel(s) {
    const labels = { 'en-attente': 'En attente', 'en-cours': 'En cours', 'termine': 'Terminé', 'annule': 'Annulé' };
    return labels[s] || s;
}
function getStatusColor(s) {
    const colors = { 'en-attente': 'warning', 'en-cours': 'info', 'termine': 'success', 'annule': 'danger' };
    return colors[s] || 'secondary';
}