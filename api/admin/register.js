const { getFirebaseAdmin } = require("../firebase-admin");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" });
  }

  try {
    const { email, password, fullName, phone, secretCode } = req.body || {};

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
      email: email.trim(),
      password,
      displayName: fullName.trim(),
    });

    await auth.setCustomUserClaims(userRecord.uid, { admin: true });

    await db.collection("clients").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: email.trim(),
      nom: fullName.trim(),
      phone: phone || "",
      typeClient: "admin",
      role: "admin",
      isAdmin: true,
      createdAt: new Date(),
    });

    return res.status(201).json({ success: true, message: "Compte administrateur créé avec succès.", uid: userRecord.uid });
  } catch (error) {
    console.error("Erreur création admin :", error);

    if (error.code === "auth/email-already-exists") {
      return res.status(409).json({ success: false, message: "Cet email est déjà utilisé." });
    }
    if (error.code === "auth/invalid-email") {
      return res.status(400).json({ success: false, message: "Adresse email invalide." });
    }

    return res.status(500).json({ success: false, message: error.message || "Erreur lors de la création du compte administrateur." });
  }
};
