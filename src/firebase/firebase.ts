import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "XXX",
  authDomain: "tr-tuiton.firebaseapp.com",
  projectId: "tr-tuiton",
  messagingSenderId: "987697986281",
  appId: "XXX",
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
