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

  useEffect(() => {
    if (isSuccess) {
      if (data?.data?.isAuthenticated) {
        const userData = data?.data?.user;
        dispatch(setUser(userData));

        const syncTimer = setTimeout(() => {
          syncNotifications()
            .unwrap()
            .catch((error) => {
              console.error("Failed to sync notifications:", error);
            });
        }, 3000);

        return () => clearTimeout(syncTimer);
      }

      dispatch(clearUser());
    }

    if (isError) {
      dispatch(clearUser());
    }
  }, [isSuccess, isError, data, dispatch, syncNotifications]);

  return <>{children}</>;
}
