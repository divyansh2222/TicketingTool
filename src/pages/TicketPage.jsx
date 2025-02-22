import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import TicketTable from "../component/TicketTable";
import TicketForm from "../component/TicketForm";
import { useAuth } from "../context/AuthProvider.jsx";
export default function TicketPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userType, setUserType] = useState("");  // State to store user type
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user type from localStorage
    const storedUserType = localStorage.getItem("userType");
      // const { userId, userType, loading,setLoading } = useAuth();
      // console.log("User Type:", userType,userId);
    // console.log("Stored User Type:", storedUserType);
    setUserType(storedUserType);
  }, []);

  const toggleForm = () => {
    setIsFormOpen((prev) => !prev);
  };

  const saveTicket = (data) => {
    setIsFormOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div></div>
        {userType !== "admin" && (
          <button
            onClick={toggleForm}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {isFormOpen ? "Cancel" : "Raise Ticket"}
          </button>
        )}
      </div>

      {isFormOpen ? (
        <TicketForm closeModal={toggleForm} saveTicket={saveTicket} />
      ) : (
        <TicketTable toggleForm={toggleForm} navigate={navigate} />
      )}
    </div>
  );
}
