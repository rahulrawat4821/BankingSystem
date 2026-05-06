import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully 👋");
    setTimeout(() => navigate("/"), 500);
  };

  const linkStyle = (path) =>
    location.pathname === path
      ? "text-yellow-300 font-semibold"
      : "hover:text-gray-200";

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 md:px-6 py-3 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-3 md:gap-6 flex-wrap">
        <h1 className="text-lg font-bold cursor-pointer" onClick={() => navigate("/dashboard")}>
          💰 BankApp
        </h1>
        <Link to="/dashboard" className={`text-sm md:text-base ${linkStyle("/dashboard")}`}>Dashboard</Link>
        <Link to="/transfer" className={`text-sm md:text-base ${linkStyle("/transfer")}`}>Transfer</Link>
        <Link to="/transactions" className={`text-sm md:text-base ${linkStyle("/transactions")}`}>Transactions</Link>
      </div>
      <button
        onClick={logout}
        className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition text-sm"
      >
        Logout
      </button>
    </div>
  );
}