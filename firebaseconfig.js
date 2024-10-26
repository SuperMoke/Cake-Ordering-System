import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyARxMigk4VDt45dlgOeTppCmTs22BHj3T4",
  authDomain: "aiahs-sweet-treat.firebaseapp.com",
  projectId: "aiahs-sweet-treat",
  storageBucket: "aiahs-sweet-treat.appspot.com",
  messagingSenderId: "875516822673",
  appId: "1:875516822673:web:6ade153966ad9c3d31eb30",
  measurementId: "G-BPKTC1KV2T",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const storage = getStorage(app);

export { app, db, auth, storage };
