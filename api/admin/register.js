const { getFirebaseAdmin } = require("../firebase-admin");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const secretCode = typeof body.secretCode === "string" ? body.secretCode.trim() : "";

    if (!email || !password || !fullName || !secretCode) {
      return res.status(400).json({ success: false, message: "Veuillez remplir tous les champs obligatoires." });
    }

    if (secretCode !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ success: false, message: "Code secret invalide." });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Le mot de passe doit contenir au moins 6 caractères." });
    }

    const firebaseAdmin = getFirebaseAdmin();
    const auth = firebaseAdmin.auth();
    const db = firebaseAdmin.firestore();

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: fullName,
    });

    await auth.setCustomUserClaims(userRecord.uid, { admin: true });

    await db.collection("clients").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      nom: fullName,
      phone,
      typeClient: "admin",
      role: "admin",
      isAdmin: true,
      createdAt: new Date(),
    });

    return res.status(201).json({ success: true, message: "Compte administrateur créé avec succès.", uid: userRecord.uid });
  } catch (error) {
    console.error("Erreur création admin :", error);

    if (error instanceof SyntaxError) {
      return res.status(400).json({ success: false, message: "Le corps de la requête doit être un JSON valide." });
    }
    if (error.code === "auth/email-already-exists") {
      return res.status(409).json({ success: false, message: "Cet email est déjà utilisé." });
    }
    if (error.code === "auth/invalid-email") {
      return res.status(400).json({ success: false, message: "Adresse email invalide." });
    }
    if (error.message && (error.message.indexOf("Configuration Firebase manquante") === 0 || error.message.indexOf("Configuration Firebase invalide") === 0)) {
      return res.status(503).json({ success: false, message: "Le service administrateur n'est pas correctement configuré sur le serveur." });
    }

    return res.status(500).json({ success: false, message: "Erreur lors de la création du compte administrateur." });
  }
};
