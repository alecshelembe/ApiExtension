// firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyDbPssO3MtWWzrYeFK60QUdolehWFs14J0",
  authDomain: "visitmyjoburg-4db92.firebaseapp.com",
  projectId: "visitmyjoburg-4db92",
  storageBucket: "visitmyjoburg-4db92.appspot.com", // fixed .app → .com
  messagingSenderId: "425503117524",
  appId: "1:425503117524:web:9e7dd4a92af5fe03082b41",
  measurementId: "G-VS5WS3P0V7"
};

let firebaseApp: FirebaseApp;

// Only initialize once
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

export { firebaseApp };
