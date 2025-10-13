import { initializeApp, getApps, getApp, FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyDKg4h8nUL4O-i4gvoSf79b1OO_1TOT_rE",
  authDomain: "studio-3097722029-dc9ac.firebaseapp.com",
  projectId: "studio-3097722029-dc9ac",
  storageBucket: "studio-3097722029-dc9ac.appspot.com",
  messagingSenderId: "484567993739",
  appId: "1:484567993739:web:8059eb7bc8eff78bc2b38e",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
