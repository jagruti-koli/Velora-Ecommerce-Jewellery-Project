import { Navigate } from "react-router-dom";

const AdminPrivateRoute = ({ children }) => {
  const admin = JSON.parse(localStorage.getItem("admin"));

  // ❌ admin login nahi hai
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  // ✅ admin login hai
  return children;
};

export default AdminPrivateRoute;
