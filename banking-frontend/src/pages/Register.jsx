import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); 

    if (!form.fullName || !form.email || !form.password) {
      toast.error("All fields are required ❌");
      return;
    }

    try {
      setLoading(true);

      await API.post("/api/auth/register", form);

      toast.success("Account Created Successfully 🎉");

      navigate("/"); // redirect to login
    } catch (err) {
      toast.error("Registration Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-purple-500 to-blue-500">
      
      <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Signup</h2>

        {/* FORM */}
        <form onSubmit={handleRegister}>
          
          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={form.fullName}
            onChange={(e) =>
              setForm({ ...form, fullName: e.target.value })
            }
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
              autoComplete="new-password"
            className="border p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-500 text-white w-full p-2 rounded hover:bg-purple-600 transition"
          >
            {loading ? "Creating..." : "Signup"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-3 text-sm text-center">
          Already have an account?{" "}
          <Link to="/" className="text-purple-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}