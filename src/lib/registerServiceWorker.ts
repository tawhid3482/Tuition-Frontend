// src/lib/registerServiceWorker.ts
export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
  }
};
