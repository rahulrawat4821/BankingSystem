import { useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { toast } from "sonner";

export default function Withdraw() {
  const [amount, setAmount] = useState("");

  const handleWithdraw = async () => {
    try {
      await API.post(`/api/user/withdraw?amount=${amount}`);
      toast.success("Withdraw Successful 💸");

      setAmount("");
      window.location.reload();
    } catch (error) {
      toast.error("Withdraw Failed ❌");
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex justify-center mt-10">
        <div className="bg-white p-6 rounded shadow w-80">
          <h2 className="text-lg font-bold mb-4 text-red-500">
            Withdraw Money
          </h2>

          <input
            placeholder="Enter Amount"
            className="border p-2 w-full mb-3"
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            onClick={handleWithdraw}
            className="bg-red-500 text-white w-full py-2 rounded"
          >
            Withdraw
          </button>
        </div>
      </div>
    </>
  );
}
