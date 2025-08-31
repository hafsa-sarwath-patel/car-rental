"use client";

import { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";

export default function AdminStatesPage() {
  const [states, setStates] = useState([
    { id: 1, name: "Punjab", code: "PB" },
    { id: 2, name: "Karnataka", code: "KA" },
  ]);

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [editState, setEditState] = useState(null);
  const toast = useRef(null);

  // Open Sidebar
  const openSidebar = (state = null) => {
    setEditState(state ? { ...state } : { id: null, name: "", code: "" });
    setSidebarVisible(true);
  };

  // Save state
  const handleSave = (e) => {
    e.preventDefault();
    if (editState.id) {
      setStates((prev) =>
        prev.map((s) => (s.id === editState.id ? editState : s))
      );
      toast.current.show({
        severity: "info",
        summary: "Updated",
        detail: "State updated successfully",
        life: 3000,
      });
    } else {
      setStates((prev) => [...prev, { ...editState, id: Date.now() }]);
      toast.current.show({
        severity: "success",
        summary: "Added",
        detail: "State added successfully",
        life: 3000,
      });
    }
    setSidebarVisible(false);
  };

  // Action Buttons (Only Edit, No Delete)
  const actionBodyTemplate = (rowData) => (
    <Button
      icon="pi pi-pencil"
      className="p-button-sm p-button-info"
      onClick={() => openSidebar(rowData)}
    />
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f0f0ff",
        padding: "2rem",
      }}
    >
      <Toast ref={toast} />

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
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

      {/* Table */}
      <DataTable value={states} paginator rows={5} responsiveLayout="scroll">
        <Column field="id" header="ID" sortable></Column>
        <Column field="name" header="State Name" sortable></Column>
        <Column field="code" header="Code" sortable></Column>
        <Column header="Action" body={actionBodyTemplate}></Column>
      </DataTable>

      {/* Sidebar */}
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
          <label>
            Code:
            <input
              type="text"
              value={editState?.code || ""}
              onChange={(e) =>
                setEditState({ ...editState, code: e.target.value })
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
