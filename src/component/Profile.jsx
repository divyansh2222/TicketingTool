import React, { useEffect } from "react";
import { IoMdContact } from "react-icons/io";

export default function Profile({ isOpen, onClose, userData }) {
  if (!isOpen) return null;

  // ✅ Generate a random 10-digit mobile number
  const randomMobile = Math.floor(6000000000 + Math.random() * 4000000000);

  // ✅ Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Disable scroll
    } else {
      document.body.style.overflow = "auto"; // Enable scroll when modal closes
    }

    return () => {
      document.body.style.overflow = "auto"; // Cleanup on unmount
    };
  }, [isOpen]);

  return (
    <div className="fixed z-40 inset-0 flex justify-center items-center backdrop-blur-sm bg-opacity-10">
      <div className="bg-gradient-to-r from-green-300 to-blue-00 border-2 p-6 rounded-lg shadow-lg w-96 text-center text-black">
        
        {/* ✅ Profile Icon */}
        <div className="flex justify-center mb-4">
          <IoMdContact size={50} className="text-black" />
        </div>

        <h2 className="text-xl font-bold mb-4">User Profile</h2>
        <p><strong>Name:</strong> {userData.username || "Default User"}</p>
        <p><strong>Email:</strong> {userData.email || "user@example.com"}</p>
        <p><strong>Mobile:</strong> {randomMobile}</p>

        <button className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
