import { useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Transfer() {
  const [receiverAccount, setReceiverAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTransfer = async () => {
    if (!receiverAccount || !amount || amount <= 0) {
      toast.error("Please fill all fields correctly");
      return;
    }
    try {
      setLoading(true);
      const res = await API.post(
        `/api/user/transfer?receiverAccount=${receiverAccount}&amount=${amount}`
      );
      toast.success(res.data.message || "Transfer Successful 💸");
      setReceiverAccount("");
      setAmount("");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      const message = err.response?.data?.error || "Transfer Failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Transfer Money 💸</h2>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Receiver Account Number</label>
            <input
              type="text"
              placeholder="Enter account number"
              value={receiverAccount}
              onChange={(e) => setReceiverAccount(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-600 mb-1">Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            onClick={handleTransfer}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Sending..." : "Send Money"}
          </button>
        </div>
      </div>
    </>
  );
}