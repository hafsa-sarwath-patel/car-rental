"use client";

import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function AdminUsersPage() {
  const toast = useRef(null);

  const [users, setUsers] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 5,
    page: 1,
    filters: {},
  });
  const [editVisible, setEditVisible] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Logged-in user role
  const currentUserRole = "ADMIN";

  const roleOptions = [
    { label: "ADMIN", value: "ADMIN" },
    { label: "USER", value: "USER" },
    { label: "DRIVER", value: "DRIVER" },
    { label: "MECHANIC", value: "MECHANIC" },
    { label: "PROVIDER", value: "PROVIDER" },
    { label: "CUSTOMER", value: "CUSTOMER" },
  ];

  const showToast = (severity, summary, detail) =>
    toast.current.show({ severity, summary, detail, life: 3000 });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/v1/users?page=${lazyParams.page}&limit=${lazyParams.rows}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Load failed");
      setUsers(json.data);
      setTotalRecords(json.meta.total);
    } catch (err) {
      console.error(err);
      showToast("error", "Fetch Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [lazyParams]);

  const handleSave = async (e) => {
    e.preventDefault();
    const method = editUser?.id ? "PUT" : "POST";
    const url = editUser?.id
      ? `/api/v1/users/${editUser.id}`
      : `/api/v1/users`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editUser),
      });
      if (!res.ok) throw new Error(`${method} failed`);

      showToast(
        "success",
        "Success",
        editUser?.id ? "User updated" : "User added"
      );
      setEditVisible(false);
      loadUsers();
    } catch (err) {
      console.error(err);
      showToast("error", "Save Failed", err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      const res = await fetch(`/api/v1/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      showToast("success", "User Deleted", `User ${id} removed`);
      loadUsers();
    } catch (err) {
      console.error(err);
      showToast("error", "Delete Failed", err.message);
    }
  };

  // Show Edit/Delete only for rows with role === ADMIN
  const actionTemplate = (row) => {
    if (row.role !== "ADMIN") return null;

    return (
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-info p-button-sm"
          onClick={() => {
            setEditUser(row);
            setEditVisible(true);
          }}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-sm"
          onClick={() => handleDelete(row.id)}
        />
      </div>
    );
  };

  return (
    <div style={{ padding: "1rem" }}>
      <Toast ref={toast} />

      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2>Manage Users</h2>
        {currentUserRole === "ADMIN" && (
          <Button
            label="Add New User"
            icon="pi pi-plus"
            className="p-button-success"
            onClick={() => {
              setEditUser({
                name: "",
                username: "",
                email: "",
                password: "",
                role: "",
              });
              setEditVisible(true);
            }}
          />
        )}
      </div>

      <DataTable
        value={users}
        paginator
        lazy
        loading={loading}
        first={lazyParams.first}
        rows={lazyParams.rows}
        totalRecords={totalRecords}
        onPage={(e) =>
          setLazyParams({
            ...lazyParams,
            first: e.first,
            rows: e.rows,
            page: e.page + 1,
          })
        }
        responsiveLayout="scroll"
        stripedRows
      >
        <Column field="name" header="Name" sortable />
        <Column field="username" header="Username" sortable />
        <Column field="email" header="Email" sortable />
        <Column
          field="role"
          header="Role"
          sortable
          body={(row) => row.role || "N/A"}
        />
        <Column
          field="isAvailable"
          header="Available"
          body={(r) => (r.isAvailable ? "Yes" : "No")}
        />
        <Column
          body={actionTemplate}
          header="Actions"
          style={{ textAlign: "center", width: "8rem" }}
        />
      </DataTable>

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
          <h3>{editUser?.id ? "Edit User" : "Add New User"}</h3>

          <input
            type="text"
            placeholder="Name"
            value={editUser?.name || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, name: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Username"
            value={editUser?.username || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, username: e.target.value })
            }
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={editUser?.email || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={editUser?.password || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, password: e.target.value })
            }
            required={!editUser?.id}
          />

          <Dropdown
            value={editUser?.role || ""}
            options={roleOptions}
            onChange={(e) => setEditUser({ ...editUser, role: e.value })}
            placeholder="Select Role"
            required
          />

          <Button
            type="submit"
            label="Save"
            icon="pi pi-check"
            className="p-button-success"
          />
        </form>
      </Sidebar>
    </div>
  );
}
