const admin = require("firebase-admin");

function getFirebaseAdmin() {
  if (admin.apps.length) return admin;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Configuration Firebase manquante sur Vercel. Vérifiez FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL et FIREBASE_PRIVATE_KEY dans Environment Variables.");
  }

  const normalizedPrivateKey = privateKey.replace(/\\n/g, "\n").trim();

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId.trim(),
        clientEmail: clientEmail.trim(),
        privateKey: normalizedPrivateKey,
      }),
    });
  } catch (error) {
    console.error("Initialisation Firebase Admin impossible :", error);
    throw new Error("Configuration Firebase invalide sur Vercel. Vérifiez la clé privée et les identifiants du compte de service.");
  }

  return admin;
}

module.exports = { getFirebaseAdmin };
