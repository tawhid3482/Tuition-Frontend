// src/hooks/useTestNotification.ts
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export const useTestNotification = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const sendTestNotification = async () => {
    if (!isAuthenticated || !user?.id) return;

    try {
      const res = await fetch(`http://localhost:5000/api/v1/notification/test/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log("Notification API response:", data);
    } catch (err) {
      console.error("Failed to send test notification:", err);
    }
  };

  return { sendTestNotification };
};
