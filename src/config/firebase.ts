// src/config/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

export const messaging = typeof window !== "undefined"
  ? getMessaging(app)
  : null;


  
// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAqJl_AM8-7oqPa7WTxHWiB6vm2eHFq-Zc",
//   authDomain: "tr-tuiton.firebaseapp.com",
//   projectId: "tr-tuiton",
//   storageBucket: "tr-tuiton.firebasestorage.app",
//   messagingSenderId: "987697986281",
//   appId: "1:987697986281:web:8170e96ff99b0007448e78",
//   measurementId: "G-DNG3H6DT6V"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);