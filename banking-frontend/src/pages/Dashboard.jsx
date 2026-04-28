import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        //fetch user
        const userRes = await API.get("/api/user/me");
        setUser(userRes.data);

        //fetch transactions
        const txRes = await API.get("/api/user/transactions");
        setTransactions(txRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  //latest transactions first
  const sortedTx = [...transactions].reverse();

  return (
    <>
      <Navbar />

      <div className="p-6 bg-gray-100 min-h-screen">
        
        {/* Welcome */}
        <h2 className="text-2xl font-semibold mb-4">
          Welcome, {user?.fullName} 👋
        </h2>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-400 text-white p-6 rounded-xl shadow-md w-full md:w-1/2">
          <p className="text-sm">Current Balance</p>
          <h1 className="text-3xl font-bold mt-2">
            ₹ {user?.balance || 0}
          </h1>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6 flex-wrap">
          <button
            onClick={() => navigate("/deposit")}
            className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600"
          >
            Deposit
          </button>

          <button
            onClick={() => navigate("/withdraw")}
            className="bg-green-500 text-white px-6 py-2 rounded shadow hover:bg-green-600"
          >
            Withdraw
          </button>

          <button
            onClick={() => navigate("/transfer")}
            className="bg-red-500 text-white px-6 py-2 rounded shadow hover:bg-red-600"
          >
            Transfer
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8 bg-white p-4 rounded shadow w-full md:w-1/2">
          <h3 className="font-semibold mb-3">Recent Transactions</h3>

          {/* Empty */}
          {sortedTx.length === 0 && (
            <p className="text-gray-500 text-sm">
              No transactions yet
            </p>
          )}

          {/* Data */}
          {sortedTx.slice(0, 5).map((tx, index) => (
            <div
              key={index}
              className="border-b py-2 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">
                  {tx.type === "DEPOSIT" && "🟢 Deposit"}
                  {tx.type === "WITHDRAW" && "🔴 Withdraw"}
                  {tx.type === "TRANSFER" && "🔵 Transfer"}
                </p>

                {/* Optional Date */}
                {tx.createdAt && (
                  <p className="text-xs text-gray-500">
                    {new Date(tx.createdAt).toLocaleString()}
                  </p>
                )}
              </div>

              <span className="font-semibold">
                ₹ {tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}