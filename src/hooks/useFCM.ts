/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "@/src/config/firebase";
import { useEffect } from "react";
import { useSaveFcmTokenMutation } from "../redux/features/notification/notificationApi";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export const useFCM = () => {
  const [saveToken] = useSaveFcmTokenMutation();

  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const initFCM = async () => {
      try {
        if (!isAuthenticated || !user?.id || !messaging) {
          return;
        }

        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          return;
        }

        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (token) {
          await saveToken({ token, platform: "web" }).unwrap();
        }

        onMessage(messaging, (payload) => {
          if (payload.notification) {
            new Notification(payload.notification.title || "Notification", {
              body: payload.notification.body,
              icon: "/icon.png",
            });
          }
        });
      } catch (error) {
        console.error("FCM initialization error:", error);
      }
    };

    if (isAuthenticated && user?.id) {
      initFCM();
    }
  }, [isAuthenticated, user?.id, saveToken]);
};
