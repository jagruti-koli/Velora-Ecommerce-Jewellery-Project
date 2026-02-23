import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // optional if you have login context

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // optional: auto-login

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";

    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = "Invalid email format";
    }

    if (!formData.password) {
      errs.password = "Password is required";
    } else if (formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const alreadyExists = users.find((u) => u.email === formData.email);

    if (alreadyExists) {
      setToast("User already exists");
      setTimeout(() => setToast(""), 3000);
      return;
    }

    const newUser = {
      id: String(Date.now()),
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    setToast("Registration successful!");
    setTimeout(() => setToast(""), 3000);

    // Auto-login (optional)
    if (login) login(formData.email, formData.password);

    // Redirect to home page
    navigate("/", { replace: true });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="text-center mb-4">Create Account</h3>

      {toast && <div className="alert alert-success">{toast}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <input
          className={`form-control mb-2 ${errors.name ? "is-invalid" : ""}`}
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}

        <input
          className={`form-control mb-2 ${errors.email ? "is-invalid" : ""}`}
          placeholder="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}

        <input
          className={`form-control mb-2 ${errors.password ? "is-invalid" : ""}`}
          placeholder="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {errors.password && <div className="invalid-feedback">{errors.password}</div>}

        <input
          className={`form-control mb-3 ${errors.confirmPassword ? "is-invalid" : ""}`}
          placeholder="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        {errors.confirmPassword && (
          <div className="invalid-feedback">{errors.confirmPassword}</div>
        )}

        <button className="btn btn-dark w-100">Sign Up</button>
      </form>

      <p className="mt-3 text-center">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Register;
