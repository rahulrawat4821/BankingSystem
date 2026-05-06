import { useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDeposit = async () => {
    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    try {
      setLoading(true);
      const res = await API.post(`/api/user/deposit?amount=${amount}`);
      toast.success(res.data.message || "Money Deposited 💰");
      setAmount("");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      const message = err.response?.data?.error || "Deposit Failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
        <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm">
          <h2 className="text-lg font-bold mb-4 text-green-600">Deposit Money 💰</h2>
          <input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            className="border p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            onClick={handleDeposit}
            disabled={loading}
            className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600 transition"
          >
            {loading ? "Processing..." : "Deposit"}
          </button>
        </div>
      </div>
    </>
  );
}