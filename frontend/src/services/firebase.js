import { getApp, getApps, initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID

};

console.log("Firebase Config:", firebaseConfig);
// const firebaseConfig = {
//   apiKey: "AIzaSyC--fFwfeBwM3yvwXT3KhbCPF36ipcf5oE",
//   authDomain: "devsync-5e791.firebaseapp.com",
//   projectId: "devsync-5e791",
//   storageBucket: "devsync-5e791.firebasestorage.app",
//   messagingSenderId: "683515333266",
//   appId: "1:683515333266:web:185ffce4befa6b34d8744b",
//   measurementId: "G-JNEN72LE45"
// };

const requiredConfig = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.appId,
];

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const googleErrorMessage = (error) => {
  if (error.code === "auth/popup-closed-by-user") {
    return "Google sign-in was cancelled.";
  }
  if (error.code === "auth/popup-blocked") {
    return "Your browser blocked the Google sign-in popup. Please allow popups and try again.";
  }
  if (error.code === "auth/network-request-failed") {
    return "A network error occurred while signing in with Google.";
  }
  if (error.code === "auth/account-exists-with-different-credential") {
    return "An account already exists with a different sign-in method.";
  }
  return "Google sign-in could not be completed. Please try again.";
};

export async function getGoogleIdToken() {
  if (requiredConfig.some((value) => !value)) {
    throw new Error("Google sign-in is not configured yet.");
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user.getIdToken();
  } catch (error) {
    throw new Error(googleErrorMessage(error));
  }
}
