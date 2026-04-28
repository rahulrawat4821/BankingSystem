import { useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { toast } from "sonner";

export default function Deposit() {
  const [amount, setAmount] = useState("");

  const handleDeposit = async () => {
    try {
    
        await API.post(`/api/user/deposit?amount=${amount}`);
        toast.success("Money Deposited 💰");
         setAmount("");
    
        window.location.reload();
    } catch (error) {
        toast.error("Deposit Failed ❌");
    }

  };

  return (
    <>
      <Navbar />

      <div className="flex justify-center mt-10">
        <div className="bg-white p-6 rounded shadow w-80">
          <h2 className="text-lg font-bold mb-4">Deposit Money</h2>

          <input
            placeholder="Enter Amount"
            className="border p-2 w-full mb-3"
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            onClick={handleDeposit}
            className="bg-green-500 text-white w-full py-2 rounded"
          >
            Deposit
          </button>
        </div>
      </div>
    </>
  );
}