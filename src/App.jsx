import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./component/Header";
import Footer from "./component/Footer";
import LoginModal from "./component/LoginModal";

import ViewTicket from "./pages/ViewTicket";
import Help from "./pages/TicketPage";
import Notifications from "./component/Notification";
import UserNotificationList from "./component/UserNotificationList";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn");
    if (storedLogin === "true") {
      setIsLoggedIn(true);
    } else {
      setIsLoginOpen(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
    setIsLoginOpen(false);
    navigate("/help");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.clear();
    setIsLoggedIn(false);
    setIsLoginOpen(true);
    navigate("/");
  };


  // starting of the app

  return (
    <div className="min-h-screen flex flex-col text-gray-800">
      <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <main className="flex-grow container mx-auto p-6">
        <Routes>
          <Route
            path="/"
            element={
              <LoginModal
                closeModal={() => setIsLoginOpen(false)}
                onLoginSuccess={handleLoginSuccess}
              />
            }
          />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/help" element={<Help />} />
          <Route path="/usernotification" element={<UserNotificationList />} />
          <Route path="/view-ticket" element={<ViewTicket />} />
        </Routes>
      </main>
      <Footer />
      {isLoginOpen && (
        <LoginModal
          closeModal={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
  }

export default App;


// paste this code into the APP.js file and dont upload the build im already uploaded
