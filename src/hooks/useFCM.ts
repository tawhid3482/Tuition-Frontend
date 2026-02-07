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
  
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const initFCM = async () => {
      try {
        // ✅ User authenticate না হলে FCM initialize করবেন না
        if (!isAuthenticated || !user?.id) {
          return;
        }

        if (!messaging) {
          return;
        }

        // Request notification permission
        const permission = await Notification.requestPermission();
        
        if (permission !== "granted") {
          return;
        }

        // Get FCM token
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

    
        if (token && user.id) {
          try {
            // ✅ সঠিকভাবে API call করুন
            await saveToken({ 
              userId: user.id,  // ✅ userId
              token: token,     // ✅ token
              platform: "web"   // ✅ platform
            }).unwrap();
            
          } catch (apiError: any) {
            console.error("Failed to save token to backend:", apiError);
            if (apiError.data) {
              console.error("Backend error response:", apiError.data);
            }
          }
        } else {
          console.log("No token received from FCM or user ID not found");
        }

        // Handle foreground messages
        onMessage(messaging, (payload) => {
          // এখানে notification show করতে পারেন
          if (payload.notification) {
            new Notification(payload.notification.title || "Notification", {
              body: payload.notification.body,
              icon: "/icon.png"
            });
          }
        });

      } catch (error) {
        console.error("FCM initialization error:", error);
      }
    };

    // ✅ শুধুমাত্র user authenticated হলে FCM initialize করুন
    if (isAuthenticated && user?.id) {
      initFCM();
    }
    
  }, [isAuthenticated, user, saveToken]); // ✅ dependencies ঠিক আছে
};