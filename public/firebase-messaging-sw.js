importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAqJl_AM8-7oqPa7WTxHWiB6vm2eHFq-Zc",
  authDomain: "tr-tuiton.firebaseapp.com",
  projectId: "tr-tuiton",
  messagingSenderId: "987697986281",
  appId: "1:987697986281:web:8170e96ff99b0007448e78",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: "/icon.png",
    }
  );
});
