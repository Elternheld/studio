import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCl3fCg-Wz1N5irBnOvCm7rB-hUgMZVXb8",
  authDomain: "elternheld-3f160.firebaseapp.com",
  projectId: "elternheld-3f160",
  storageBucket: "elternheld-3f160.firebasestorage.app",
  messagingSenderId: "209882917292",
  appId: "1:209882917292:web:9bbaa1602c210f850bf209"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
