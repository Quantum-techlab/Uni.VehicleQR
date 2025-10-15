import admin from 'firebase-admin';

let initError: Error | null = null;

function ensureInitialized() {
  if (admin.apps.length) return;
  try {
    if (
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY
    ) {
      throw new Error('Missing Firebase Admin environment variables');
    }
    const serviceAccount: admin.ServiceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
    });
  } catch (e: any) {
    initError = e instanceof Error ? e : new Error(String(e));
  }
}

export function getAdminDb() {
  ensureInitialized();
  if (initError) {
    throw initError;
  }
  return admin.firestore();
}

export function getAdminStorage() {
  ensureInitialized();
  if (initError) {
    throw initError;
  }
  return admin.storage().bucket();
}
