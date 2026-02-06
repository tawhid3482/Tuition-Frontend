// src/components/FCMProvider.tsx
"use client";

import { useFCM } from "@/src/hooks/useFCM";

const FCMProvider = () => {
  useFCM();
  console.log("FCMProvider mounted");
  return null; // UI কিছুই লাগবে না
};

export default FCMProvider;
