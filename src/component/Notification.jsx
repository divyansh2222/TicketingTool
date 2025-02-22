import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";
import { UserNotificationContext } from "../context/UserNotificationContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotificationList() {
  const { notifications } = useContext(NotificationContext);
  const { userNotifications } = useContext(UserNotificationContext);
  const navigate = useNavigate();

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-xl rounded-2xl mt-6 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-4 z-10 bg-gray-200  text-gray-800 rounded-lg shadow-md hover:bg-gray-300 transition-all
                    px-3 py-1 text-sm"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2 
                     sm:text-lg md:text-xl">
        🔔 All Notifications - <span className="text-red-700">{notifications.length}</span>
      </h2>
      <div> {notifications.length === 0 ? (
        <p className="text-gray-500 text-center py-6 sm:text-sm md:text-base">
          No new notifications 🎉
        </p>
      ) : (
        <ul className="space-y-4">
          {notifications.slice(0, 8).map((notification, index) => (
            <motion.li
              key={index}
              className="bg-gray-100 p-4 rounded-xl shadow-md hover:bg-gray-200 transition-all duration-200 cursor-pointer
                         sm:p-3 sm:text-sm md:p-4 md:text-base"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <strong className="text-gray-800">{notification.notification}</strong>
            </motion.li>
          ))}
        </ul>
      )} </div>
      
    </div>
  );
}
