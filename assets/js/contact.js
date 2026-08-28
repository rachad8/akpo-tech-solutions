

async function submitContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');

    const data = {
        nom: document.getElementById('contactNom').value.trim(),
        telephone: document.getElementById('contactTelephone').value.trim(),
        email: document.getElementById('contactEmail').value.trim(),
        service: document.getElementById('contactService').value,
        adresse: document.getElementById('contactAdresse').value.trim(),
        description: document.getElementById('contactDescription').value.trim(),
        urgence: document.getElementById('contactUrgence').value
    };

    if (!data.nom || !data.telephone || !data.service || !data.adresse || !data.description) {
        alert('Veuillez remplir tous les champs obligatoires (*).');
        return false;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Envoi en cours...';
    }

    const result = await MessagesAPI.send(data);
    
    if (result.success) {

        form.style.display = 'none';
        const confirmation = document.getElementById('contactConfirmation');
        if (confirmation) {
            confirmation.style.display = 'block';
            confirmation.scrollIntoView({ behavior: 'smooth' });
        }

        setTimeout(function() {
            form.reset();
            form.style.display = 'block';
            if (confirmation) confirmation.style.display = 'none';
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="bi bi-send"></i> Envoyer ma demande';
            }
        }, 5000);
    } else {
        alert('Erreur : ' + result.error + '\n\nContactez-nous au 01 90 18 25 49.');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-send"></i> Envoyer ma demande';
        }
    }
    
    return false;
}