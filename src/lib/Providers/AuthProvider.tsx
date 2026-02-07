// "use client";

// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { setUser, clearUser } from "@/src/redux/slices/authSlice";
// import { useGetSessionQuery } from "@/src/redux/features/auth/authApi";

// export default function AuthProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const dispatch = useDispatch();
//   const { data, isSuccess, isError } = useGetSessionQuery(undefined);

//   // console.log("AuthProvider - Session Data:", data?.data?.isAuthenticated, data?.data?.user);

//   useEffect(() => {
//     if (isSuccess) {
//       if (data?.data?.isAuthenticated) {
//         dispatch(setUser(data?.data?.user));
//       } else {
//         dispatch(clearUser());
//       }
//     }

//     if (isError) {
//       dispatch(clearUser());
//     }
//   }, [isSuccess, isError, data, dispatch]);

//   return <>{children}</>;
// }


"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/src/redux/slices/authSlice";
import { useGetSessionQuery } from "@/src/redux/features/auth/authApi";
import { useSyncPendingNotificationsMutation } from "@/src/redux/features/notification/notificationApi";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const { data, isSuccess, isError } = useGetSessionQuery(undefined);
  const [syncNotifications] = useSyncPendingNotificationsMutation();

  // console.log("AuthProvider - Session Data:", data?.data?.isAuthenticated, data?.data?.user);

  useEffect(() => {
    if (isSuccess) {
      if (data?.data?.isAuthenticated) {
        const userData = data?.data?.user;
        dispatch(setUser(userData));
        
        // ✅ User logged in successfully, sync pending notifications
        if (userData?.id) {
          console.log("User logged in, will sync pending notifications...", userData.id);
          
          // Wait for 3 seconds to ensure FCM is initialized
          const syncTimer = setTimeout(() => {
            syncNotifications({ userId: userData.id })
              .unwrap()
              .then(() => {
                console.log("Pending notifications synced successfully");
              })
              .catch((error) => {
                console.error("Failed to sync notifications:", error);
                // Don't show error to user, just log it
              });
          }, 3000);

          // Clean up timer if component unmounts
          return () => clearTimeout(syncTimer);
        }
      } else {
        dispatch(clearUser());
      }
    }

    if (isError) {
      dispatch(clearUser());
    }
  }, [isSuccess, isError, data, dispatch, syncNotifications]);

  return <>{children}</>;
}