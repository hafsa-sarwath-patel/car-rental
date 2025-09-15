"use client";

import { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";

export default function AdminStatesPage() {
  const [states, setStates] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [editState, setEditState] = useState(null);
  const toast = useRef(null);

  // Load states from API
  const loadStates = async () => {
    try {
      const res = await fetch("/api/v1/states");
      if (!res.ok) throw new Error("Failed to fetch states");
      const data = await res.json();
      setStates(data);
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load states",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    loadStates();
  }, []);

  const openSidebar = (state = null) => {
    setEditState(state ? { ...state } : { id: null, name: "" });
    setSidebarVisible(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const method = editState.id ? "PUT" : "POST";
      const url = editState.id
        ? `/api/v1/states/${editState.id}`
        : "/api/v1/states";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editState.name }),
      });

      if (!res.ok) throw new Error("Failed to save state");

      toast.current.show({
        severity: "success",
        summary: editState.id ? "Updated" : "Added",
        detail: `State ${editState.id ? "updated" : "added"} successfully`,
        life: 3000,
      });

      setSidebarVisible(false);
      await loadStates();
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Save failed",
        life: 3000,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/v1/states/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete state");

      toast.current.show({
        severity: "warn",
        summary: "Deleted",
        detail: "State deleted successfully",
        life: 3000,
      });
      await loadStates();
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Delete failed",
        life: 3000,
      });
    }
  };

  const actionBodyTemplate = (rowData) => (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <Button
        icon="pi pi-pencil"
        className="p-button-sm p-button-info"
        onClick={() => openSidebar(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-sm p-button-danger"
        onClick={() => handleDelete(rowData.id)}
      />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", padding: "2rem", background: "#353573ff" }}>
      <Toast ref={toast} />

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h1>States</h1>
        <Button label="Add New State" icon="pi pi-plus" className="p-button-success" onClick={() => openSidebar()} />
      </div>

      <DataTable value={states} paginator rows={5} responsiveLayout="scroll">
        <Column field="id" header="ID" sortable />
        <Column field="name" header="State Name" sortable />
        <Column header="Action" body={actionBodyTemplate} />
      </DataTable>

      <Sidebar visible={sidebarVisible} onHide={() => setSidebarVisible(false)} position="right" style={{ width: "30rem" }}>
        <h2>{editState?.id ? "Edit State" : "Add New State"}</h2>
        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }} onSubmit={handleSave}>
          <label>
            State Name:
            <input
              type="text"
              value={editState?.name || ""}
              onChange={(e) => setEditState({ ...editState, name: e.target.value })}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </label>
          <Button type="submit" label="Save" className="p-button-success" />
        </form>
      </Sidebar>
    </div>
  );
}
