import { useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { toast } from "sonner";

const Transfer = () => {
  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleTransfer = async () => {
    try {

      const res = await API.post(
  `/api/user/transfer?receiverEmail=${receiverEmail}&amount=${amount}`
);
      

      toast.success("Transfer Successful");
      setReceiverEmail("");
      setAmount("");
    } catch (err) {
      toast.error("Transfer Failed");
    }
  };

  return (
    <>
    <Navbar  />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px]">
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6">
          Transfer Money 💸
        </h2>

        {/* Receiver Email */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">
            Receiver Email
          </label>
          <input
            type="email"
            placeholder="Enter receiver email"
            value={receiverEmail}
            onChange={(e) => setReceiverEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Amount */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-1">
            Amount
          </label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleTransfer}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send Money
        </button>

        {/* Message */}
        {message && (
          <p className="text-center mt-4 text-sm font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
    </>
  
  );
};

export default Transfer;