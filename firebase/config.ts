import { getApp, getApps, initializeApp, FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyC2jOd5qdjcUIkPbkzDNI9WspxXTlhSV3Q",
  authDomain: "blogstoreapp-ae5ec.firebaseapp.com",
  projectId: "blogstoreapp-ae5ec",
  storageBucket: "blogstoreapp-ae5ec.appspot.com",
  messagingSenderId: "386649911206",
  appId: "1:386649911206:web:45a2ee8062c99f71a76967",
  measurementId: "G-47NLEXZMBX",
};

function createFirebaseApp(config: FirebaseOptions) {
  try {
    return getApp();
  } catch {
    return initializeApp(config);
  }
}

const FIREBASE_APP = createFirebaseApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const ADMIN_REF = collection(FIREBASE_DB, "admins");
export const BLOG_REF = collection(FIREBASE_DB, "blogs");
export const BLOG_TYPE_REF = collection(FIREBASE_DB, "blog_types");
export const UAE_TYPE_REF = collection(FIREBASE_DB, "uae_types");
export const UAE_REF = collection(FIREBASE_DB, "made_in_uae");
export const PRODUCT_REF = collection(FIREBASE_DB, "products");
export const CONTACT_REF = collection(FIREBASE_DB, "contacts");
export const NEWS_LETTER_REF = collection(FIREBASE_DB, "news_letter");
