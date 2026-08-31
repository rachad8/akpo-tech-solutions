const admin = require("firebase-admin");

function getFirebaseAdmin() {
  if (admin.apps.length) return admin;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const privateKeyBase64 = process.env.FIREBASE_PRIVATE_KEY_BASE64;

  if (!projectId || !clientEmail || (!privateKey && !privateKeyBase64)) {
    throw new Error("Configuration Firebase manquante sur Vercel. Vérifiez FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL et FIREBASE_PRIVATE_KEY dans Environment Variables.");
  }

  const stripOptionalQuotes = (value) => value.trim().replace(/^['"]|['"]$/g, "");
  const normalizedPrivateKey = privateKeyBase64
    ? Buffer.from(stripOptionalQuotes(privateKeyBase64), "base64").toString("utf8").trim()
    : stripOptionalQuotes(privateKey).replace(/\\n/g, "\n").trim();

  console.error("Firebase config diagnostic:", {
    projectIdPresent: Boolean(projectId),
    projectId: stripOptionalQuotes(projectId || ""),
    clientEmailPresent: Boolean(clientEmail),
    clientEmailDomain: stripOptionalQuotes(clientEmail || "").split("@")[1] || "",
    privateKeyPresent: Boolean(privateKey),
    privateKeyLength: privateKey ? privateKey.length : 0,
    privateKeyBase64Present: Boolean(privateKeyBase64),
    privateKeyBase64Length: privateKeyBase64 ? privateKeyBase64.length : 0,
    normalizedPrivateKeyLength: normalizedPrivateKey.length,
    normalizedPrivateKeyHeader: normalizedPrivateKey.slice(0, 27),
  });

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: stripOptionalQuotes(projectId),
        clientEmail: stripOptionalQuotes(clientEmail),
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
