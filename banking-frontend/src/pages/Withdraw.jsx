import { useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Withdraw() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleWithdraw = async () => {
    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    try {
      setLoading(true);
      const res = await API.post(`/api/user/withdraw?amount=${amount}`);
      toast.success(res.data.message || "Withdrawal Successful 💸");
      setAmount("");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      const message = err.response?.data?.error || "Withdrawal Failed";
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
          <h2 className="text-lg font-bold mb-4 text-red-500">Withdraw Money 💸</h2>
          <input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            className="border p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            onClick={handleWithdraw}
            disabled={loading}
            className="bg-red-500 text-white w-full py-2 rounded hover:bg-red-600 transition"
          >
            {loading ? "Processing..." : "Withdraw"}
          </button>
        </div>
      </div>
    </>
  );
}