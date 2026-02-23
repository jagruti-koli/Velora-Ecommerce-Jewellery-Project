import React, { useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Redirect path (Checkout / Product / Home)
  const redirectPath = location.state?.from || "/";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(
      (u) =>
        u.email === formData.email &&
        u.password === formData.password
    );

    if (!existingUser) {
      alert("User not found. Please Sign Up.");
      return;
    }

    // ✅ LOGIN USER
    login(existingUser);

    // ✅ Redirect after login
    navigate(redirectPath, { replace: true });
  };

  return (
    <div className="login-container">
      <h3 className="login-title">User Login</h3>

      <form onSubmit={handleSubmit} className="login-form">
        {/* EMAIL */}
        <div className="form-floating-group">
          <input
            type="email"
            className="form-input"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label className="form-label">Email</label>
        </div>

        {/* PASSWORD */}
        <div className="form-floating-group">
          <input
            type={showPassword ? "text" : "password"}
            className="form-input"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label className="form-label">Password</label>
          <span
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {/* BUTTON */}
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>

      {/* SIGN UP */}
      <p className="signup-text">
        New user?{" "}
        <Link to="/register" className="signup-link">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;
