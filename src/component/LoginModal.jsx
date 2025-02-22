import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ticketingImage from "../assets/images/ticketing.jpg";
export default function LoginModal({ closeModal, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState("user"); // Default to "user"
  const [userId, setUserId] = useState(localStorage.getItem("userdefinedid") || ""); 

  const navigate = useNavigate();

  // लोकल स्टोरेज से यूज़र टाइप को लोड करें
  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      setUserType(storedUserType);
    
    }
  }, []);

  // लोकल स्टोरेज के बदलाव को सुनने के लिए
  useEffect(() => {
    const handleStorageChange = () => {
      setUserId(localStorage.getItem("userdefinedid") || "");
    };
 console
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // 🔥 LOGIN FUNCTION
  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    const apiEndpoint =
      userType === "admin"
        ? "https://ticketingtool.pmpframe.com/api/admin/login.php"
        : "https://ticketingtool.pmpframe.com/api/login.php";

    const payload = {
      action: "login",
      email,
      password,
    };

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed! Please check your credentials.");
      }

      localStorage.setItem("userdefinedid", data.user_id);
      setUserId(data.user_id); 
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userType", userType);
   console.log( localStorage.getItem("userdefinedid"))
      onLoginSuccess();
      navigate("/help");
    } catch (err) {
      setError(err.message);
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-blue-300 to-white bg-opacity-75 p-4">
<div className="bg-white rounded-lg shadow-2xl flex flex-col md:flex-row w-full max-w-7xl">
        
        {/* Left Section (Info) */}
        <div className="w-full md:w-1/2 p-6 bg-gradient-to-br from-blue-700 to-blue-500 text-white rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
          <h1 className="text-2xl md:text-4xl font-extrabold text-center mb-4">
            Welcome to Ticketing Tool
          </h1>
          <div className="flex items-center justify-center">
            <img className="h-60 w-60 sm:block hidden bg-transparent" src={ticketingImage} alt="" />
          </div>
          <p className="text-center text-sm md:text-lg opacity-90 leading-relaxed">
            Experience seamless issue resolution. Connect with our dedicated support team.
          </p>
        </div>

        {/* Right Section (Form) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-800">Login</h2>
          {error && <p className="text-red-600 text-center">{error}</p>}

          {/* User/Admin Toggle */}
          <div className="flex w-full mb-4">
            <button
              onClick={() => setUserType("user")}
              className={`w-1/2 py-2 px-4 rounded-l-lg ${
                userType === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
              }`}
            >
              User
            </button>
            <button
              onClick={() => setUserType("admin")}
              className={`w-1/2 py-2 px-4 rounded-r-lg ${
                userType === "admin" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
              }`}
            >
              Admin
            </button>
          </div>

          {/* Email & Password Input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 mb-2 rounded text-black focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 mb-4 rounded text-black focus:ring-2 focus:ring-blue-400"
          />

          {/* Login Button */}
          <button
            className="bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700 transition-all"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        
        </div>
      </div>
    </div>
  );
}
