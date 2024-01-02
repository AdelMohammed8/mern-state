import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-a0f06.firebaseapp.com",
  projectId: "mern-estate-a0f06",
  storageBucket: "mern-estate-a0f06.appspot.com",
  messagingSenderId: "515341786632",
  appId: "1:515341786632:web:20ceec3d1204a373bc3bbd",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
