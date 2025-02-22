import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SuccessModal from "../component/SuccessModal"; // Import the modal component

export default function ViewTicket() {
  const [searchParams] = useSearchParams();
  const ticketId = searchParams.get("id");

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    const userid = localStorage.getItem("userdefinedid");
    // console.log("In ViewTicket, user ID:", userid);
    setIsAdmin(userType === "admin");

    if (!ticketId) return;

    const fetchTicketDetails = async () => {
      try {
        setLoading(true);
        const apiUrl =
          userType === "admin"
            ? "https://ticketingtool.pmpframe.com/api/admin/ticket.php"
            : "https://ticketingtool.pmpframe.com/api/ticket.php";

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "view", user_id:userid, id: ticketId}),
        });

        if (!response.ok) throw new Error("Failed to fetch ticket details");

        
        const data = await response.json();
        // console.log(data);
        if (data.data) {
          setTicket(data.data);
          setUserId(data.data?.userid || null);
          setNewStatus(data.data?.status || "0"); // Default to Pending (0)
        } else {
          setError("No ticket data received.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [ticketId]);

  const handleReply = useCallback(async () => {
    if (!replyMessage.trim()) {
      alert("Reply message cannot be empty!");
      return;
    }
    if (!userId) {
      alert("User ID not found! Please refresh and try again.");
      return;
    }

    setIsReplying(true);

    try {
      const userType = localStorage.getItem("userType") || "user";
      const userid = localStorage.getItem("userdefinedid");

      // console.log("In ViewTicket, user ID:", userid);
      const apiUrl =
        userType === "admin"
          ? "https://ticketingtool.pmpframe.com/api/admin/ticket.php"
          : "https://ticketingtool.pmpframe.com/api/ticket.php";

      const payload = {
        action: "reply",
        ticket_id: ticketId,
        user_id: userid,
        message: replyMessage.trim(),
        status: newStatus,
        user_type: userType, // Send userType as part of the payload
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Failed to post reply");
  // console.log(data);
      setReplyMessage("");
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        navigate("/help");
      }, 3000);
    } catch (err) {
      // console.log(err.msg)
    } finally {
      setIsReplying(false);
    }
  }, [replyMessage, ticketId, userId, navigate, newStatus]);

  const handleStatusChange = async (e) => {
    const selectedStatus = e.target.value;
    setNewStatus(selectedStatus); // Update state

    try {
      const userType = localStorage.getItem("userType");
      const userid = localStorage.getItem("userdefinedid");

      const response = await fetch("https://ticketingtool.pmpframe.com/api/admin/ticket.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reply",
          ticket_id: ticketId,
          user_id: userid,
          status: selectedStatus,
          message: replyMessage.trim(),
          user_type: userType,
        }),
      });

      const data = await response.json();

     
      setTicket((prevTicket) => ({ ...prevTicket, status: selectedStatus }));
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  if (loading) return <div>Loading ticket details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!ticket) return <div>No ticket found.</div>;

  return (
    <div className="w-full my-12 mx-auto p-6 border rounded-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Ticket Details</h2>
        <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
      <p><strong>Ticket:</strong> #{ticket.ticket_id}</p>
      <p><strong>Name:</strong> {ticket.name || "N/A"}</p>
      <p><strong>Email:</strong> {ticket.email || "N/A"}</p>
      <p><strong>Mobile:</strong> {ticket.mobile || "N/A"}</p>

      {isAdmin ? (
        <div>
          <strong>Status:</strong>
          <select
            value={newStatus}
            onChange={(e) => handleStatusChange(e)}
            className="ml-2 p-1 border rounded"
          >
            <option value="pending">Pending</option> {/* 0 = Pending */}
            <option value="process">In Process</option> {/* 1 = In Process */}
            <option value="resolved">Resolved</option> {/* 2 = Resolved */}
            <option value="closed">Closed</option> {/* 3 = Closed */}
          </select>
        </div>
      ) : (
        <div>
          <strong>Status:</strong>{" "}
          {ticket.status === "pending"
            ? "Pending"
            : ticket.status === "process"
            ? "In Progress"
            : ticket.status === "resolved"
            ? "Resolved"
            : "Active"}
        </div>
      )}

      <p><strong>Create Date:</strong> {ticket.datetime || "N/A"}</p>
      <p><strong>Subject:</strong> {ticket.subject || "N/A"}</p>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Conversation</h3>
        <div className="flex flex-col gap-2 border p-2">
          <p className="text-sm font-semibold bg-amber-100">Message</p>
          <p className="text-sm">{ticket.comments}</p>
        </div>

        {ticket.replies && ticket.replies.length > 0 ? (
          ticket.replies.map((msg, index) => (
            <div key={index} className={`mb-2 p-3 rounded ${msg.user_type === "admin" ? "bg-blue-200 text-blue-900" : "bg-gray-200 text-gray-900"}`}>
              <p className="text-sm font-semibold bg-amber-100">{msg.user_type} - {msg.datetime}</p>
              <p className="text-sm">{msg.message}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No replies yet.</p>
        )}
      </div>

      <div className="mt-4">
        <textarea className="w-full p-2 border rounded" placeholder="Reply Message..." value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} disabled={isReplying} />
        <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleReply} disabled={isReplying}>{isReplying ? "Posting Reply..." : "Post Reply"}</button>
      </div>

      {showModal && <SuccessModal message="Reply Submitted! Redirecting to help page..." onClose={() => setShowModal(false)} />}
    </div>
  );
}
