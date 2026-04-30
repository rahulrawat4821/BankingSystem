import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("ALL");

  const fetchTransactions = async () => {
    try {

     const res = await API.get("/api/user/transactions");

      setTransactions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  //Filter logic
  const filteredData =
    filter === "ALL"
      ? transactions
      : transactions.filter((tx) => tx.type === filter);

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-100 p-6">
     
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6">Transaction History</h2>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6">
        {["ALL", "DEPOSIT", "WITHDRAW", "TRANSFER"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === type
                ? "bg-blue-600 text-white"
                : "bg-white border"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">Type</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
              <th className="p-3">To</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((tx, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">

                {/* Type */}
                <td className="p-3 font-medium">
                  {tx.type === "DEPOSIT" && "🟢 Deposit"}
                  {tx.type === "WITHDRAW" && "🔴 Withdraw"}
                  {tx.type === "TRANSFER" && "🔵 Transfer"}
                </td>

                {/* Amount */}
                <td className="p-3 font-semibold">
                  ₹ {tx.amount}
                </td>

                {/* Date */}
      <td className="p-3 text-gray-600">
        {new Date(tx.createdAt).toLocaleDateString()}
      </td>

                {/* Receiver */}
                <td className="p-3 text-gray-600">
                  {tx.receiverEmail || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <p className="text-center p-4 text-gray-500">
            No transactions found
          </p>
        )}
      </div>
    </div>
    </>
       
  );
};

export default Transactions;