import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { logout } = useAuth();

  const admin = JSON.parse(localStorage.getItem("admin"));

  const handleLogout = () => {
    localStorage.removeItem("admin");
    logout();
    navigate("/admin/login");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(
        `http://localhost:3000/admins?email=${email}&password=${password}`
      );

      if (res.data.length > 0) {
        localStorage.setItem("admin", JSON.stringify(res.data[0]));
        navigate("/admin/dashboard");
      } else {
        setError("Invalid admin credentials");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  if (admin) {
    return (
      <div className="admin-login-wrapper">
        <div className="dashboard-particles">
          {Array.from({ length: 30 }).map((_, i) => (
            <span key={i} className={`particle particle-${i % 3}`} />
          ))}
        </div>

        <motion.div
          className="card login-card text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="mb-3" style={{ color: "#e85c7a" }}>
            Admin already logged in
          </h4>
          <p className="mb-3">{admin.name || admin.email}</p>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="admin-login-wrapper">
      {/* Floating particles */}
      <div className="dashboard-particles">
        {Array.from({ length: 30 }).map((_, i) => (
          <span key={i} className={`particle particle-${i % 3}`} />
        ))}
      </div>

      <motion.div
        className="card login-card"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-4 text-center" style={{ color: "#e85c7a" }}>
          Admin Login
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-control mb-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-control mb-4"
          />

          <button type="submit" className="btn login-btn w-100">
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
