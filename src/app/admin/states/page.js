"use client";
import { useState } from "react";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";

export default function AdminStatesPage() {
  const [states, setStates] = useState([
    { id: 1, name: "Punjab" },
    { id: 2, name: "Karnataka" },
  ]);

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [editState, setEditState] = useState(null);

  // Open Sidebar for Add/Edit
  const openSidebar = (state = null) => {
    setEditState(state ? { ...state } : { id: null, name: "" });
    setSidebarVisible(true);
  };

  // Save State (Add or Edit)
  const handleSave = (e) => {
    e.preventDefault();
    if (editState.id) {
      setStates((prev) =>
        prev.map((s) => (s.id === editState.id ? editState : s))
      );
    } else {
      setStates((prev) => [...prev, { ...editState, id: Date.now() }]);
    }
    setSidebarVisible(false);
  };

  // Delete State
  const handleDelete = (id) => {
    setStates((prev) => prev.filter((s) => s.id !== id));
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
        <h1>States</h1>
        <Button
          label="Add New State"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={() => openSidebar()}
        />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "2rem" }}>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {states.map((state) => (
            <li
              key={state.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid #444",
              }}
            >
              {state.name}
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  label="Edit"
                  icon="pi pi-pencil"
                  className="p-button-sm p-button-info"
                  onClick={() => openSidebar(state)}
                />
                <Button
                  label="Remove"
                  icon="pi pi-trash"
                  className="p-button-sm p-button-danger"
                  onClick={() => handleDelete(state.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Sidebar Add/Edit */}
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        position="right"
        style={{ width: "30rem" }}
      >
        <h2>{editState?.id ? "Edit State" : "Add New State"}</h2>
        <form
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          onSubmit={handleSave}
        >
          <label>
            State Name:
            <input
              type="text"
              value={editState?.name || ""}
              onChange={(e) =>
                setEditState({ ...editState, name: e.target.value })
              }
              style={{ width: "100%", padding: "8px" }}
            />
          </label>
          <Button type="submit" label="Save" className="p-button-success" />
        </form>
      </Sidebar>
    </div>
  );
}
