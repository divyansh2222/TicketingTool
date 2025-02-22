import { useEffect } from "react";
import { FiCheckCircle } from "react-icons/fi"; // Import the checkmark icon

export default function SuccessModal({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col items-center">
        <FiCheckCircle className="text-green-600 text-5xl mb-2" /> {/* Success Icon */}
        <h2 className="text-lg font-semibold text-green-600">Success!</h2>
        <h3 className="text-gray-700">Your response has been saved successfully!</h3>
        <p className="text-gray-500">{message}</p>
      </div>
    </div>
  );
}
