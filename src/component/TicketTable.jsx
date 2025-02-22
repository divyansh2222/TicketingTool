import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthProvider.jsx";

export default function TicketTable({ toggleForm }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Get user type from localStorage
  const userType = localStorage.getItem("userType");
  const userid = localStorage.getItem("userdefinedid");
  // console.log("inticket table user id:",userid);



  // const { userId, userType, loading,setLoading } = useAuth();

  console.log( localStorage.getItem("userdefinedid"))
  useEffect(() => {
    const fetchTickets = async () => {
      // console.log("In TicketTable, user ID:", userid);
      // console.log("usertype :",userType);
      try {
        const apiUrl =
          userType === "admin"
            ? "https://ticketingtool.pmpframe.com/api/admin/ticket.php"
            : "https://ticketingtool.pmpframe.com/api/ticket.php";

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "list", user_id: userid }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setTickets(data.data || []);
        // console.log(tickets)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [userType]);

  if (loading) return <div>Loading tickets...</div>;
  

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Ticket</th>
            {userType === "admin" && (
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
            )}
            <th className="border border-gray-300 px-4 py-2 text-left">Raise on</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Subject</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length === 0 ? (
            <tr>
              <td colSpan={userType === "admin" ? "6" : "5"} className="text-center py-4 text-gray-500">
                No tickets available
              </td>
            </tr>
          ) : (
            tickets.map((ticket, index) => (
              <tr key={index} className="border border-gray-300">
                <td className="border border-gray-300 px-4 py-2">{ticket.ticket_id || "N/A"}</td>
                {userType === "admin" && (
                  <td className="border border-gray-300 px-4 py-2">{ticket.email || "N/A"}</td>
                )}
                <td className="border border-gray-300 px-4 py-2">{ticket.datetime || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">{ticket.subject || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {ticket.status}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => navigate(`/view-ticket?id=${ticket.id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    {userType === "admin" ? "Update" : "View"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
