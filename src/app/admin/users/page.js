"use client";
import { useState } from "react";
import { users as initialUsers } from "./data";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function AdminUsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [editVisible, setEditVisible] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // Edit existing user
  const handleEdit = (user) => {
    setEditUser(user);
    setEditVisible(true);
  };

  // Add new user
  const handleAddNew = () => {
    setEditUser({ id: null, name: "", email: "", role: "" });
    setEditVisible(true);
  };

  // Save user (new or existing)
  const handleSave = (e) => {
    e.preventDefault();

    if (editUser.id) {
      // Update existing user
      setUsers((prev) =>
        prev.map((u) => (u.id === editUser.id ? editUser : u))
      );
    } else {
      // Add new user
      const newUser = { ...editUser, id: Date.now() };
      setUsers((prev) => [...prev, newUser]);
    }

    setEditVisible(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#a4aeedff",
        display: "flex",
        flexDirection: "column",
        color: "#fff",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          background: "#232946",
        }}
      >
        <h1 style={{ fontWeight: 700, fontSize: 28 }}>Manage Users</h1>
        <Button
          label="Add New User"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={handleAddNew}
        />
      </div>

    {/* User List Box Full Page */}
<div
  style={{
    flex: 1,
    width: "100%",
    background: "#232946",
    padding: "2rem",
    boxSizing: "border-box",
  }}
>
  {/* Table Header */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      fontWeight: "bold",
      borderBottom: "2px solid #555",
      paddingBottom: "10px",
      marginBottom: "10px",
    }}
  >
    <span style={{ flex: 1 }}>ID</span>
    <span style={{ flex: 2 }}>Name</span>
    <span style={{ flex: 2 }}>Role</span>
    <span style={{ flex: 2, textAlign: "right" }}>Actions</span>
  </div>

  {/* User Rows */}
  {users.map((user) => (
    <div
      key={user.id}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: "1px solid #444",
      }}
    >
      <span style={{ flex: 1 }}>{user.id}</span>
      <span style={{ flex: 2 }}>{user.name}</span>
      <span style={{ flex: 2 }}>{user.role}</span>

   <div
  style={{
    display: "flex",
    gap: "10px",
    flex: 2,
    justifyContent: "flex-end",
  }}
>
  {user.role !== "customer" && user.role !== "hoster" && (
    <Button
      label="Edit"
      icon="pi pi-pencil"
      className="p-button-sm p-button-info"
      onClick={() => handleEdit(user)}
    />
  )}

  <button
    style={{
      padding: "6px 12px",
      background: "#f44336",
      color: "#fff",
      border: "none",
      borderRadius: 4,
      cursor: "pointer",
    }}
    onClick={() =>
      setUsers((prev) => prev.filter((u) => u.id !== user.id))
    }
  >
    Remove
  </button>
</div>

    </div>
  ))}
</div>
    


      {/* Sidebar for Add/Edit */}
      <Sidebar
        visible={editVisible}
        onHide={() => setEditVisible(false)}
        position="right"
        style={{ width: "30rem" }}
      >
        <form
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          onSubmit={handleSave}
        >
          <h2>{editUser?.id ? `Edit User: ${editUser.name}` : "Add New User"}</h2>

          <label>
            Name:
            <input
              type="text"
              value={editUser?.name || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, name: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: 4,
                border: "1px solid #ccc",
                marginTop: 4,
              }}
              required
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              value={editUser?.email || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: 4,
                border: "1px solid #ccc",
                marginTop: 4,
              }}
              required
            />
          </label>

          <label>
            Role:
            <input
              type="text"
              value={editUser?.role || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, role: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: 4,
                border: "1px solid #ccc",
                marginTop: 4,
              }}
            />
          </label>

          <Button
            type="submit"
            label="Save"
            icon="pi pi-check"
            className="p-button-success"
            style={{ alignSelf: "flex-start" }}
          />
        </form>
      </Sidebar>
    </div>
 
  );
}
