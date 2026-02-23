import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [highlightedUserId, setHighlightedUserId] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();

    const handleStorage = (e) => {
      if (e.key === "users") {
        const updatedUsers = JSON.parse(e.newValue) || [];
        const newUser = updatedUsers.find(
          (u) => !users.some((old) => old.id === u.id)
        );

        if (newUser) {
          setHighlightedUserId(newUser.id);
          setTimeout(() => setHighlightedUserId(null), 2000);
        }

        setUsers(updatedUsers);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [users]);

  /* ✅ SAFE FILTERING */
  const filteredUsers = users.filter((u) => {
    const name = (u.name || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    const role = (u.role || "").toLowerCase();
    const searchText = search.toLowerCase();

    const matchesSearch =
      name.includes(searchText) || email.includes(searchText);

    const matchesRole = roleFilter ? role === roleFilter : true;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="users-wrapper">
      <h2 className="users-title">Users Management</h2>

      {/* SEARCH + FILTER */}
      <div className="users-toolbar">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`user-row ${
                    highlightedUserId === u.id ? "highlight" : ""
                  }`}
                >
                  <td data-label="ID">{u.id}</td>
                  <td data-label="Name">{u.name || "—"}</td>
                  <td data-label="Email">{u.email || "—"}</td>
                  <td data-label="Role">
                    <span className={`role-badge ${u.role || "user"}`}>
                      {u.role || "user"}
                    </span>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="empty-state">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
