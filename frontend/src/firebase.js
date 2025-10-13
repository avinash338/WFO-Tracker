import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCiMimOcZ_kmTI7G3qHq1900N2mIcTy5Z4",
  authDomain: "wfo-tracker-c444c.firebaseapp.com",
  projectId: "wfo-tracker-c444c",
  storageBucket: "wfo-tracker-c444c.firebasestorage.app",
  messagingSenderId: "329887034366",
  appId: "1:329887034366:web:9909861d69f28bec342eaf"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
