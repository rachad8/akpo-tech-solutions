
const Auth = {
    async ready() {
        if (window.AkpoGuard && window.AkpoGuard.ready) {
            await window.AkpoGuard.ready;
        }
        return { auth: window.auth, db: window.db };
    },

    async login(email, password, remember = true) {
        const { auth } = await this.ready();
        const persistence = remember
            ? firebase.auth.Auth.Persistence.LOCAL
            : firebase.auth.Auth.Persistence.SESSION;
        await auth.setPersistence(persistence);
        return auth.signInWithEmailAndPassword(email, password);
    },

    async register(data) {
        const { auth, db } = await this.ready();
        const credential = await auth.createUserWithEmailAndPassword(data.email, data.password);
        if (data.nom) await credential.user.updateProfile({ displayName: data.nom });
        await db.collection('clients').doc(credential.user.uid).set({
            nom: data.nom || '',
            email: data.email,
            telephone: data.telephone || '',
            typeClient: data.typeClient || 'particulier',
            adresse: data.adresse || '',
            photo: credential.user.photoURL || '',
            dateInscription: firebase.firestore.FieldValue.serverTimestamp(),
            statut: 'actif',
            authProvider: 'email'
        });
        return credential;
    },

    async logout() {
        const { auth } = await this.ready();
        await auth.signOut();
    },

    async resetPassword(email) {
        const { auth } = await this.ready();
        return auth.sendPasswordResetEmail(email);
    }
};
