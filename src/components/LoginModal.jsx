import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:3000/users";

const LoginModal = ({ show, onClose, showToast }) => {
  const { login } = useContext(AuthContext);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // login | register
  const [resetMode, setResetMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /* ================= LOCK SCROLL ================= */
  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [show]);

  /* ================= RESET FORM ================= */
  useEffect(() => {
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    setShowPassword(false);
    setLoading(false);
    setErrors({});
  }, [mode, resetMode, show]);

  /* ================= ESC CLOSE ================= */
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ================= VALIDATE REGISTER ================= */
  const validateRegister = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = "Invalid email";
    if (!formData.password) errs.password = "Password is required";
    else if (formData.password.length < 6) errs.password = "Password must be at least 6 chars";
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      const userData = res.data.find(
        (u) => u.email === formData.email && u.password === formData.password
      );
      if (!userData) {
        showToast?.("Invalid email or password");
        setLoading(false);
        return;
      }
      login(userData);
      showToast?.("Login Successful"); // ✅ toast
      setTimeout(() => {
        onClose();
        navigate("/", { replace: true });
      }, 1800);
    } catch {
      showToast?.("Server error");
      setLoading(false);
    }
  };

  /* ================= REGISTER ================= */
  const handleRegister = async () => {
    const validationErrors = validateRegister();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await axios.get(API);
      const exists = res.data.some((u) => u.email === formData.email);
      if (exists) {
        showToast?.("User already exists");
        setLoading(false);
        return;
      }
      const newUser = await axios.post(API, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      login(newUser.data);
      showToast?.("Registration Successful"); // ✅ toast
      setTimeout(() => {
        onClose();
        navigate("/", { replace: true });
      }, 1800);
    } catch {
      showToast?.("Registration failed");
      setLoading(false);
    }
  };

  /* ================= RESET PASSWORD ================= */
  const handleReset = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      const exists = res.data.some((u) => u.email === formData.email);
      if (!exists) {
        showToast?.("Email not registered");
        setLoading(false);
        return;
      }
      showToast?.("Reset link sent to email");
      setTimeout(() => {
        setResetMode(false);
        setMode("login");
      }, 1800);
    } catch {
      showToast?.("Server error");
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    if (resetMode) return handleReset();
    if (mode === "login") return handleLogin();
    handleRegister();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onMouseDown={handleOverlayClick}>
      <div className="modal-content" ref={modalRef}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>{resetMode ? "Reset Password" : mode === "login" ? "User Login" : "Create Account"}</h3>

        <form onSubmit={handleSubmit}>
          {/* NAME */}
          {mode === "register" && !resetMode && (
            <div className="form-group">
              <input type="text" name="name" placeholder=" " value={formData.name} onChange={handleChange} />
              <label>Name</label>
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
          )}

          {/* EMAIL */}
          <div className="form-group">
            <input type="email" name="email" placeholder=" " value={formData.email} onChange={handleChange} />
            <label>Email</label>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* PASSWORD */}
          {!resetMode && (
            <div className="form-group password">
              <input type={showPassword ? "text" : "password"} name="password" placeholder=" " value={formData.password} onChange={handleChange} />
              <label>Password</label>
              {mode === "register" && errors.password && <span className="error-text">{errors.password}</span>}
              <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          )}

          {/* CONFIRM PASSWORD */}
          {mode === "register" && !resetMode && (
            <div className="form-group password">
              <input type={showPassword ? "text" : "password"} name="confirmPassword" placeholder=" " value={formData.confirmPassword} onChange={handleChange} />
              <label>Confirm Password</label>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          )}

          {/* FORGOT */}
          {mode === "login" && !resetMode && (
            <p className="auth-forgot"><span onClick={() => setResetMode(true)}>Forgot password?</span></p>
          )}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Please wait..." : resetMode ? "Send Reset Link" : mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        {/* SWITCH */}
        {!resetMode && (
          <p className="auth-switch">
            {mode === "login" ? (
              <>New here? <span onClick={() => setMode("register")}>Create account</span></>
            ) : (
              <>Already have an account? <span onClick={() => setMode("login")}>Login</span></>
            )}
          </p>
        )}

        {resetMode && (
          <p className="auth-switch"><span onClick={() => { setResetMode(false); setMode("login"); }}>← Back to Login</span></p>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
