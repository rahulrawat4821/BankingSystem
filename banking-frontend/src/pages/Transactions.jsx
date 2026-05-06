import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await API.get("/api/user/transactions");
        setTransactions(res.data.reverse());
      } catch (err) {
        console.log(err);
      }
    };
    fetchTransactions();
  }, []);

  const filteredData = filter === "ALL"
    ? transactions
    : transactions.filter((tx) => tx.type === filter);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-4 md:p-6">
        <h2 className="text-2xl font-bold mb-6">Transaction History</h2>
        <div className="flex gap-2 mb-6 flex-wrap">
          {["ALL", "DEPOSIT", "WITHDRAW", "TRANSFER"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === type ? "bg-blue-600 text-white" : "bg-white border"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3">Type</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
                <th className="p-3">To/From</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((tx, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">
                    {tx.type === "DEPOSIT" && "🟢 Deposit"}
                    {tx.type === "WITHDRAW" && "🔴 Withdraw"}
                    {tx.type === "TRANSFER" && "🔵 Transfer"}
                  </td>
                  <td className="p-3 font-semibold">₹ {tx.amount}</td>
                  <td className="p-3 text-gray-600">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-gray-600 text-sm">
                    {tx.type === "DEPOSIT" ? tx.receiverEmail :
                     tx.type === "WITHDRAW" ? tx.senderEmail :
                     tx.receiverEmail || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <p className="text-center p-4 text-gray-500">No transactions found</p>
          )}
        </div>
      </div>
    </>
  );
}