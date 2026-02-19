import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { API_BASE_URL } from "../config/site";

export const useTestNotification = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const sendTestNotification = async () => {
    if (!isAuthenticated || !user?.id) return;

    try {
      const res = await fetch(`${API_BASE_URL}/notification/test/${user.id}`, {
        method: "POST",
        credentials: "include",
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
