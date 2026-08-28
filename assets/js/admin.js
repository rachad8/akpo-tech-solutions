

let allDemandes = [];
let allClients = [];
let allMessages = [];
let allFactures = [];

auth.onAuthStateChanged(async function(user) {
    if (user && user.email === 'admin@akpotechsolutions.com') {
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'flex';
        await loadAllData();
    } else if (user) {
        await auth.signOut();
        showLogin();
    } else {
        showLogin();
    }
});

function showLogin() {
    document.getElementById('adminLogin').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

async function adminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const error = document.getElementById('loginError');
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
        error.className = 'auth-message error';
        error.textContent = 'Identifiants incorrects.';
    }
    return false;
}

async function loadAllData() {

    const dResult = await DemandesAPI.getAll();
    allDemandes = dResult.success ? dResult.data : [];

    const cResult = await ClientsAPI.getAll();
    allClients = cResult.success ? cResult.data : [];

    const mResult = await MessagesAPI.getAll();
    allMessages = mResult.success ? mResult.data : [];

    const fResult = await FacturesAPI.getAll();
    allFactures = fResult.success ? fResult.data : [];
    
    updateDashboard();
    updateAllTables();
    updateStats();
    initNavigation();
}

async function refreshAll() {
    await loadAllData();
}

function updateDashboard() {
    document.getElementById('statAllDemandes').textContent = allDemandes.length;
    document.getElementById('statEnAttente').textContent = allDemandes.filter(d => d.statut === 'en-attente').length;
    document.getElementById('statEnCours').textContent = allDemandes.filter(d => d.statut === 'en-cours').length;
    document.getElementById('statTermine').textContent = allDemandes.filter(d => d.statut === 'termine').length;
    document.getElementById('statMessages').textContent = allMessages.filter(m => !m.lu).length;
    document.getElementById('statClients').textContent = allClients.length;
    
    document.getElementById('badgeDemandes').textContent = allDemandes.filter(d => d.statut === 'en-attente').length;
    document.getElementById('badgeMessages').textContent = allMessages.filter(m => !m.lu).length;

    const recent = allDemandes.slice(0, 10);
    document.getElementById('recentDemandes').innerHTML = recent.map(d => 
        `<tr><td><strong>${d.id}</strong></td><td>${d.clientNom}</td><td>${d.service}</td><td><span class="badge bg-${statusColor(d.statut)}">${statusLabel(d.statut)}</span></td><td>${formatDate(d.date)}</td></tr>`
    ).join('') || '<tr><td colspan="5" class="text-center">Aucune demande</td></tr>';
}

function updateAllTables() {
    updateDemandesTable();
    updateMessagesTable();
    updateClientsTable();
    updateFacturesTable();
}

function updateDemandesTable(filtered) {
    const data = filtered || allDemandes;
    document.getElementById('allDemandes').innerHTML = data.map(d => `
        <tr>
            <td><strong>${d.id}</strong></td><td>${d.clientNom}</td><td>${d.clientTelephone}</td><td>${d.service}</td>
            <td>
                <select class="form-select form-select-sm" onchange="changeStatut('${d.clientId}','${d.id}',this.value)" style="width:130px;">
                    <option value="en-attente" ${d.statut==='en-attente'?'selected':''}>En attente</option>
                    <option value="en-cours" ${d.statut==='en-cours'?'selected':''}>En cours</option>
                    <option value="termine" ${d.statut==='termine'?'selected':''}>Terminé</option>
                    <option value="annule" ${d.statut==='annule'?'selected':''}>Annulé</option>
                </select>
            </td>
            <td>${formatDate(d.date)}</td>
            <td class="action-btns">
                <button class="btn btn-sm btn-outline-primary" onclick="showDetail('${d.clientId}','${d.id}')"><i class="bi bi-eye"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteDemande('${d.clientId}','${d.id}')"><i class="bi bi-trash"></i></button>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="7" class="text-center">Aucune demande</td></tr>';
}

function updateMessagesTable() {
    document.getElementById('allMessages').innerHTML = allMessages.map(m => `
        <tr class="${!m.lu ? 'fw-bold' : ''}">
            <td>${formatDate(m.date)}</td><td>${m.nom}</td><td>${m.telephone}</td><td>${m.email||'-'}</td><td>${m.service}</td>
            <td><button class="btn btn-sm btn-outline-primary" onclick="showMessage('${m.id}')"><i class="bi bi-eye"></i></button></td>
        </tr>
    `).join('') || '<tr><td colspan="6" class="text-center">Aucun message</td></tr>';
}

function updateClientsTable() {
    document.getElementById('allClients').innerHTML = allClients.map(c => {
        const nb = allDemandes.filter(d => d.clientId === c.id).length;
        return `<tr><td><strong>${c.nom||'Inconnu'}</strong></td><td>${c.email||'-'}</td><td>${c.telephone||'-'}</td><td><span class="badge bg-${c.typeClient==='entreprise'?'info':'primary'}">${c.typeClient==='entreprise'?'Entreprise':'Particulier'}</span></td><td>${formatDate(c.dateInscription)}</td><td><span class="badge bg-primary">${nb} demandes</span></td></tr>`;
    }).join('') || '<tr><td colspan="6" class="text-center">Aucun client</td></tr>';
}

function updateFacturesTable() {
    document.getElementById('allFactures').innerHTML = allFactures.map(f => `
        <tr>
            <td><strong>${f.id}</strong></td><td>${f.clientNom}</td><td><strong>${f.montant} FCFA</strong></td>
            <td><span class="badge bg-${f.statut==='payee'?'success':'warning'}">${f.statut}</span></td>
            <td>${formatDate(f.date)}</td>
            <td class="action-btns">
                <button class="btn btn-sm btn-outline-primary" onclick="downloadFacture('${f.id}')"><i class="bi bi-download"></i></button>
                <button class="btn btn-sm btn-outline-success" onclick="markPaid('${f.id}')"><i class="bi bi-check-circle"></i></button>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="6" class="text-center">Aucune facture</td></tr>';
}

async function updateStats() {
    const result = await ServicesAPI.getStats();
    if (result.success) {
        document.getElementById('servicesStats').innerHTML = result.data.map(s => 
            `<div class="dashboard-stat-card"><div class="dashboard-stat-icon bg-primary bg-opacity-10 text-primary"><i class="bi bi-tools"></i></div><div><div class="dashboard-stat-value">${s.count}</div><div class="dashboard-stat-label">${s.nom}</div></div></div>`
        ).join('');
    }
}

async function changeStatut(clientId, demandeId, newStatut) {
    await DemandesAPI.updateStatut(clientId, demandeId, newStatut);
    const idx = allDemandes.findIndex(d => d.id === demandeId);
    if (idx !== -1) allDemandes[idx].statut = newStatut;
    updateDashboard();
}

async function deleteDemande(clientId, demandeId) {
    if (!confirm('Supprimer cette demande ?')) return;
    await DemandesAPI.delete(clientId, demandeId);
    allDemandes = allDemandes.filter(d => !(d.id === demandeId));
    updateDashboard();
    updateDemandesTable();
}

function showDetail(clientId, demandeId) {
    const d = allDemandes.find(d => d.id === demandeId);
    if (!d) return;
    document.getElementById('modalContent').innerHTML = `
        <h4>Détail de la demande</h4>
        <p><strong>Réf :</strong> ${d.id}</p>
        <p><strong>Client :</strong> ${d.clientNom}</p>
        <p><strong>Tél :</strong> ${d.clientTelephone}</p>
        <p><strong>Email :</strong> ${d.clientEmail}</p>
        <p><strong>Service :</strong> ${d.service}</p>
        <p><strong>Urgence :</strong> ${d.urgence}</p>
        <p><strong>Statut :</strong> ${statusLabel(d.statut)}</p>
        <p><strong>Description :</strong> ${d.description || 'Aucune'}</p>
        <p><strong>Adresse :</strong> ${d.adresse || 'Non précisée'}</p>
        <p><strong>Date :</strong> ${formatDate(d.date)}</p>
        <button class="btn btn-primary mt-3" onclick="closeModal()">Fermer</button>
    `;
    document.getElementById('modalBackdrop').classList.add('active');
}

async function showMessage(messageId) {
    const m = allMessages.find(m => m.id === messageId);
    if (!m) return;
    await MessagesAPI.markAsRead(messageId);
    m.lu = true;
    updateMessagesTable();
    updateDashboard();
    
    document.getElementById('modalContent').innerHTML = `
        <h4>Message de contact</h4>
        <p><strong>Nom :</strong> ${m.nom}</p>
        <p><strong>Tél :</strong> ${m.telephone}</p>
        <p><strong>Email :</strong> ${m.email || '-'}</p>
        <p><strong>Service :</strong> ${m.service}</p>
        <p><strong>Urgence :</strong> ${m.urgence || 'Normal'}</p>
        <p><strong>Adresse :</strong> ${m.adresse || '-'}</p>
        <p><strong>Description :</strong> ${m.description || 'Aucune'}</p>
        <p><strong>Date :</strong> ${formatDate(m.date)}</p>
        <button class="btn btn-primary mt-3" onclick="closeModal()">Fermer</button>
    `;
    document.getElementById('modalBackdrop').classList.add('active');
}

function closeModal() {
    document.getElementById('modalBackdrop').classList.remove('active');
}
document.getElementById('modalBackdrop').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

function filterDemandes() {
    const search = document.getElementById('searchDemandes').value.toLowerCase();
    const statut = document.getElementById('filterStatutDemandes').value;
    updateDemandesTable(allDemandes.filter(d => 
        (d.clientNom.toLowerCase().includes(search) || d.id.toLowerCase().includes(search)) &&
        (statut === 'tous' || d.statut === statut)
    ));
}

function showCreateFacture() {
    const clientOptions = allClients.map(c => `<option value="${c.id}">${c.nom} - ${c.email}</option>`).join('');
    document.getElementById('modalContent').innerHTML = `
        <h4>Créer une facture</h4>
        <form onsubmit="return createFacture(event)">
            <div class="mb-3"><label class="form-label">Client</label><select class="form-control" id="factureClient" required>${clientOptions}</select></div>
            <div class="mb-3"><label class="form-label">Service</label><input type="text" class="form-control" id="factureService" required></div>
            <div class="mb-3"><label class="form-label">Montant (FCFA)</label><input type="number" class="form-control" id="factureMontant" required></div>
            <div class="mb-3"><label class="form-label">Description</label><textarea class="form-control" id="factureDescription" rows="2"></textarea></div>
            <button type="submit" class="btn btn-primary">Créer</button>
            <button type="button" class="btn btn-secondary ms-2" onclick="closeModal()">Annuler</button>
        </form>
    `;
    document.getElementById('modalBackdrop').classList.add('active');
}

async function createFacture(e) {
    e.preventDefault();
    const clientId = document.getElementById('factureClient').value;
    const client = allClients.find(c => c.id === clientId);
    
    const result = await FacturesAPI.create({
        clientId, clientNom: client.nom, clientEmail: client.email,
        service: document.getElementById('factureService').value,
        montant: parseInt(document.getElementById('factureMontant').value),
        description: document.getElementById('factureDescription').value
    });
    
    if (result.success) {
        allFactures.unshift(result.data);
        updateFacturesTable();
        closeModal();
    } else {
        alert('Erreur : ' + result.error);
    }
    return false;
}

async function markPaid(factureId) {
    await FacturesAPI.updateStatut(factureId, 'payee');
    const idx = allFactures.findIndex(f => f.id === factureId);
    if (idx !== -1) allFactures[idx].statut = 'payee';
    updateFacturesTable();
}

function downloadFacture(factureId) {
    alert('Téléchargement de la facture ' + factureId + ' - Fonctionnalité à implémenter');
}

function initNavigation() {
    document.querySelectorAll('.sidebar-link[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo(this.dataset.page);
        });
    });
}

function navigateTo(page) {
    document.querySelectorAll('[id^="page-"]').forEach(p => p.style.display = 'none');
    const target = document.getElementById('page-' + page);
    if (target) target.style.display = 'block';
    
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
    
    if (page === 'services') updateStats();
}

function formatDate(d) { if (!d) return ''; const dt = d.toDate ? d.toDate() : new Date(d); return dt.toLocaleDateString('fr-FR', {day:'2-digit',month:'short',year:'numeric'}); }
function statusLabel(s) { const l = {'en-attente':'En attente','en-cours':'En cours','termine':'Terminé','annule':'Annulé'}; return l[s]||s; }
function statusColor(s) { const c = {'en-attente':'warning','en-cours':'info','termine':'success','annule':'danger'}; return c[s]||'secondary'; }