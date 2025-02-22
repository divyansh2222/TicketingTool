import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState("user"); // Default to "user"
  const [userId, setUserId] = useState(null); // Store user ID globally
  const navigate = useNavigate();

  const handleLogin = async (onLoginSuccess) => {
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
      
      setUserId(data.user_id); // Store user ID globally
      onLoginSuccess();
      navigate("/help");
    } catch (err) {
      setError(err.message);
    //   console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        email,
        setEmail,
        password,
        setPassword,
        loading,
        error,
        userType,
        setUserType,
        userId,
        handleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
