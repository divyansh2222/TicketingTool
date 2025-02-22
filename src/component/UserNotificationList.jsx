import { useContext } from "react";
import { UserNotificationContext } from "../context/UserNotificationContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function UserNotifications() {
  const { userNotifications } = useContext(UserNotificationContext);
  const navigate = useNavigate();

  // Flatten replies and limit to 8 notifications
  const allReplies = userNotifications.flatMap(ticket => ticket.replies).slice(0, 8);

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-xl rounded-2xl mt-6 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-4 z-10 bg-gray-200  px-3 py-1 text-sm text-gray-800 rounded-lg shadow-md hover:bg-gray-300 transition-all"
      >
        ← Back
      </button>

      <h2 className="text-2xl sm:text-md font-semibold text-gray-800 mb-4 border-b pb-2">
        🔔 User Notifications <span>{userNotifications.length}</span>
      </h2>

      {allReplies.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No new notifications 🎉</p>
      ) : (
        <ul className="space-y-4">
          {allReplies.map((reply, index) => (
            <motion.li
              key={reply.reply_id}
              className="bg-gray-100 p-4 rounded-xl shadow-md hover:bg-gray-200 transition-all duration-200 cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <strong className="text-gray-800">{reply.notification}</strong>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
