import { createContext, useState, useEffect } from "react";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        "https://ticketingtool.pmpframe.com/api/admin/ticket.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "list", user_id: 1, limit: "200" }),
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        setNotifications(Array.isArray(data.data) ? data.data : []);
        // console.log("New Notification:", data.data[1]?.notification);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
}
