(function initCommentForm(global) {
    'use strict';

    const form = document.getElementById('commentForm');
    if (!form) return;

    const authNotice = document.getElementById('commentAuthNotice');
    const feedback = document.getElementById('commentFormFeedback');
    const submitButton = document.getElementById('commentSubmitButton');
    const nameInput = document.getElementById('commentName');
    const ratingInput = document.getElementById('commentRating');
    const textInput = document.getElementById('commentText');
    const characterCount = document.getElementById('commentCharacterCount');
    const honeypot = document.getElementById('commentWebsite');

    let currentUser = null;

    function setFeedback(message, type) {
        feedback.textContent = message;
        feedback.className = 'comment-form-feedback ' + (type || 'info');
        feedback.hidden = false;
    }

    function clearFeedback() {
        feedback.textContent = '';
        feedback.className = 'comment-form-feedback';
        feedback.hidden = true;
    }

    function setFormEnabled(enabled) {
        [nameInput, ratingInput, textInput, submitButton].forEach(function (element) {
            element.disabled = !enabled;
        });
        form.setAttribute('aria-disabled', String(!enabled));
    }

    function updateCharacterCount() {
        characterCount.textContent = textInput.value.length + ' / 600 caractères';
    }

    function getDisplayName(user, profile) {
        return (profile && (profile.nom || profile.name)) || user.displayName || '';
    }

    function handleAuthState(user) {
        currentUser = user || null;
        clearFeedback();

        if (!currentUser) {
            authNotice.hidden = false;
            setFormEnabled(false);
            return;
        }

        authNotice.hidden = true;
        setFormEnabled(true);
        nameInput.value = currentUser.displayName || '';

        if (global.AkpoGuard && typeof global.AkpoGuard.getProfile === 'function') {
            global.AkpoGuard.getProfile(currentUser)
                .then(function (profile) {
                    if (!nameInput.value.trim()) {
                        nameInput.value = getDisplayName(currentUser, profile);
                    }
                })
                .catch(function () {
                    // Le profil est facultatif : le nom Firebase reste disponible.
                });
        }
    }

    function validateFields() {
        const name = nameInput.value.trim();
        const rating = Number(ratingInput.value);
        const text = textInput.value.trim();

        if (name.length < 2 || name.length > 80) {
            return 'Veuillez renseigner un nom compris entre 2 et 80 caractères.';
        }
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return 'Veuillez sélectionner une note entre 1 et 5 étoiles.';
        }
        if (text.length < 10 || text.length > 600) {
            return 'Votre commentaire doit contenir entre 10 et 600 caractères.';
        }
        return null;
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        clearFeedback();

        if (!currentUser) {
            setFeedback('Connectez-vous pour envoyer un commentaire.', 'error');
            return;
        }

        if (honeypot.value.trim()) {
            return;
        }

        const validationError = validateFields();
        if (validationError) {
            setFeedback(validationError, 'error');
            return;
        }

        const originalLabel = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Envoi en cours...';

        try {
            await global.AkpoGuard.ready;
            await global.db.collection('commentaires').add({
                nom: nameInput.value.trim(),
                note: Number(ratingInput.value),
                texte: textInput.value.trim(),
                uid: currentUser.uid,
                statut: 'en-attente',
                date: global.firebase.firestore.FieldValue.serverTimestamp()
            });

            form.reset();
            ratingInput.value = '5';
            updateCharacterCount();
            setFeedback('Merci pour votre retour. Il sera vérifié par notre équipe avant publication.', 'success');
        } catch (error) {
            console.error('[AKPO] Impossible d’envoyer le commentaire.', error);
            setFeedback('Le commentaire n’a pas pu être envoyé. Vérifiez votre connexion puis réessayez.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalLabel;
        }
    });

    textInput.addEventListener('input', updateCharacterCount);
    updateCharacterCount();
    setFormEnabled(false);

    if (global.AkpoGuard && global.AkpoGuard.ready) {
        global.AkpoGuard.ready
            .then(function () {
                global.auth.onAuthStateChanged(handleAuthState);
            })
            .catch(function () {
                setFormEnabled(false);
                setFeedback('Le formulaire est temporairement indisponible. Merci de réessayer plus tard.', 'error');
            });
    } else {
        setFeedback('Le formulaire est temporairement indisponible. Merci de réessayer plus tard.', 'error');
    }
})(window);
