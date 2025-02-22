import { createContext, useState, useEffect } from "react";

export const UserNotificationContext = createContext();

export function UserNotificationProvider({ children }) {
  const [userNotifications, setUserNotifications] = useState([]);
  const [userNotificationCount, setUserNotificationCount] = useState(0);

  useEffect(() => {
    fetchUserNotifications();
    const interval = setInterval(fetchUserNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUserNotifications = async () => {
    const userid = localStorage.getItem("userdefinedid");
    if (!userid) return; // Prevent API call if no user is logged in

    try {
      const response = await fetch(
        "https://ticketingtool.pmpframe.com/api/ticket.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "list", user_id: userid, limit: "200" }),
        }
      );

      const data = await response.json();
      // console.log("Fetched User Notifications:", data.data?.[0]?.replies?.[0]?.notification);

      setUserNotifications(data.data || []);
      setUserNotificationCount(data.unseen_notification_count || 0);
    } catch (error) {
      console.error("Error fetching user notifications:", error);
    }
  };

  return (
    <UserNotificationContext.Provider value={{ userNotifications, userNotificationCount, fetchUserNotifications }}>
      {children}
    </UserNotificationContext.Provider>
  );
}
