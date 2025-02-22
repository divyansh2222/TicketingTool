import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { IoMdContact } from "react-icons/io";
import Profile from "./Profile";
import { NotificationContext } from "../context/NotificationContext"; // Admin notifications
import { UserNotificationContext } from "../context/UserNotificationContext"; // User notifications 

export default function Header({ isLoggedIn, handleLogout, openLogin }) {
  const navigate = useNavigate();
  const { notifications } = useContext(NotificationContext);
  const { userNotifications } = useContext(UserNotificationContext);
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState({ username: "", email: "" });

  const userType = localStorage.getItem("userType");

  // States for tracking notification count
  const [prevAdminNotifCount, setPrevAdminNotifCount] = useState(notifications.length);
  const [prevUserNotifCount, setPrevUserNotifCount] = useState(userNotifications.length);
  const [showAdminNotifCount, setShowAdminNotifCount] = useState(false);
  const [showUserNotifCount, setShowUserNotifCount] = useState(false);

  useEffect(() => {
    if (notifications.length > prevAdminNotifCount) {
      setShowAdminNotifCount(true);
      setPrevAdminNotifCount(notifications.length);
    }
    if (userNotifications.length > prevUserNotifCount) {
      setShowUserNotifCount(true);
      setPrevUserNotifCount(userNotifications.length);
    }
  }, [notifications, userNotifications]);
  useEffect(() => {
    if (!isLoggedIn) return; 

    const userid = localStorage.getItem("userdefinedid");
    const fetchUserData = async () => {
      try {
        const response = await fetch("https://ticketingtool.pmpframe.com/api/login.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "profile",
            user_id: userid,
          }),
        });

        const data = await response.json();
        if (data.success) {
          setUserData({ username: data.data.username, email: data.data.email });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [isLoggedIn]); 

  const handleAdminNotificationClick = () => {
    if (userType === "admin") {
      setShowAdminNotifCount(false);
      navigate("/notifications");
    }
  };

  const handleUserNotificationClick = () => {
    if (userType === "user") {
      setShowUserNotifCount(false);
      navigate("/usernotification");
    }
  };

  return (
    <header className="bg-green-700 text-white p-8">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to={isLoggedIn ? "/help" : "/login"} className="active:text-yellow-300">
            TicketingTool
          </Link>
        </h1>

        <nav>
          <ul className="flex items-center space-x-4">
            {/* Admin Notification */}
            {userType === "admin" && (
              <li className="relative cursor-pointer" onClick={handleAdminNotificationClick}>
                <span className="relative">🔔</span>
                {showAdminNotifCount && (
                  <p className="absolute top-0 right-0 text-xs text-white bg-red-600 px-1 rounded-md">
                    {notifications.length}
                  </p>
                )}
              </li>
            )}

            {/* User Notification */}
            {userType === "user" && (
              <>
                <li className="relative cursor-pointer" onClick={handleUserNotificationClick}>
                  <span className="relative">🔔</span>
                  {showUserNotifCount && (
                    <p className="absolute top-0 right-0 text-xs text-white bg-red-600 px-1 rounded-md">
                      {userNotifications.length}
                    </p>
                  )}
                </li>

                {/* User Profile */}
                <li className="flex items-center space-x-2 cursor-pointer" onClick={() => setShowModal(true)}>
                  <IoMdContact size={24} />
                </li>
              </>
            )}

            {/* Login / Logout */}
            <li>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="rounded-lg">
                  Logout
                </button>
              ) : (
                <button onClick={openLogin} className="rounded-lg">
                  Login
                </button>
              )}
            </li>
          </ul>
        </nav>
      </div>

      <Profile isOpen={showModal} onClose={() => setShowModal(false)} userData={userData} />
    </header>
  );
}
