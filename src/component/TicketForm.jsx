import { useState } from "react";
import SuccessModal from "../component/SuccessModal"; // Import the SuccessModal component

export default function TicketForm({ closeModal, saveTicket }) {
  const user_id = localStorage.getItem("userdefinedid");  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    comments: "",
    user_id: user_id,
  });

  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "This field cannot be empty";
    } else if (!formData.name.match(/^[A-Za-z\s]+$/)) {
      newErrors.name = "Name must contain only alphabets";
    }

    if (!formData.email.trim()) {
      newErrors.email = "This field cannot be empty";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Email must contain '@'";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "This field cannot be empty";
    } else if (!formData.mobile.match(/^[6-9]\d{9}$/)) {
      newErrors.mobile = "Mobile must start with 6-9 and be 10 digits";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "This field cannot be empty";
    } else if (formData.subject.length > 50) {
      newErrors.subject = "Subject cannot exceed 50 characters";
    }

    if (!formData.comments.trim()) {
      newErrors.comments = "This field cannot be empty";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Fetch user_id from localStorage
    const userId = localStorage.getItem("userdefinedid");

    if (!userId) {
      alert("User ID not found. Please log in.");
      return;
    }

    try {
      const response = await fetch("https://ticketingtool.pmpframe.com/api/ticket.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit",
          user_id: userId, // Using user_id from localStorage
          ...formData,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to submit ticket");
      }
    // console.log(data);
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        saveTicket();
      }, 2000);

      setFormData({
        name: "",
        email: "",
        mobile: "",
        subject: "",
        comments: "",
        user_id: userId,
      });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="relative">
      {showSuccessModal && (
        <SuccessModal message="Ticket submitted successfully!" onClose={() => setShowSuccessModal(false)} />
      )}

      <div className="flex flex-col items-center justify-center p-6 mx-auto w-full border border-gray-300 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Raise Ticket</h2>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded text-black"
              />
              {errors.name && <p className="text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="font-medium">Email</label>
              <input
                type="text"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-2 rounded text-black"
              />
              {errors.email && <p className="text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="font-medium">Contact Number</label>
              <input
                type="tel"
                name="mobile"
                placeholder="Enter your contact number"
                value={formData.mobile}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 10) {
                    setFormData({ ...formData, mobile: value });
                  }
                  setErrors({ ...errors, mobile: "" });
                }}
                pattern="[0-9]{10}"
                maxLength="10"
                className="w-full border p-2 rounded text-black"
              />
              {errors.mobile && <p className="text-red-600">{errors.mobile}</p>}
            </div>

            <div>
              <label className="font-medium">Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="Enter subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full border p-2 rounded text-black"
              />
              {errors.subject && <p className="text-red-600">{errors.subject}</p>}
            </div>
          </div>

          <div className="mt-4">
            <label className="font-medium">Message</label>
            <textarea
              name="comments"
              placeholder="Enter your message"
              value={formData.comments}
              onChange={handleChange}
              className="w-full border p-2 rounded h-24 text-black"
            ></textarea>
            {errors.comments && <p className="text-red-600">{errors.comments}</p>}
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button type="button" onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}