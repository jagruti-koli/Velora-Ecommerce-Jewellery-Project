import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAdmin = localStorage.getItem("admin");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedAdmin) setAdmin(JSON.parse(storedAdmin));

    setLoading(false);
  }, []);

  // USER
  const login = (userData) => {
    setUser({ ...userData, id: String(userData.id) });
    localStorage.setItem("user", JSON.stringify({ ...userData, id: String(userData.id) }));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // ADMIN
  const adminLogin = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem("admin", JSON.stringify(adminData));
  };

  const adminLogout = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        login,
        logout,
        adminLogin,
        adminLogout,
        isAuthenticated: !!user,
        isAdmin: !!admin,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
