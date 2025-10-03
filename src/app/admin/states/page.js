"use client";

import { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function AdminStatesPage() {
  const [states, setStates] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [editState, setEditState] = useState(null);
  const toast = useRef(null);

  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  const loadStates = async () => {
    try {
      const res = await fetch("/api/v1/states");
      if (!res.ok) throw new Error("Failed to fetch states");
      const data = await res.json();
      setStates(data);

      // compute summary counts
      const activeCount = data.filter((s) => s.status === "Active").length;
      const inactiveCount = data.filter((s) => s.status === "Inactive").length;
      setSummary({
        total: data.length,
        active: activeCount,
        inactive: inactiveCount,
      });
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
    setEditState(
      state
        ? { ...state }
        : { id: null, name: "", code: "", status: "Active" }
    );
    setSidebarVisible(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const method = editState.id ? "PUT" : "POST";
      const url = editState.id
        ? `/api/v1/states/${editState.id}`
        : "/api/v1/states";

      const body = {
        name: editState.name,
        code: editState.code,
        status: editState.status,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
    <div className="flex gap-2 justify-center">
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
    <div className="min-h-screen bg-surface-100 p-6">
      <Toast ref={toast} />

      {/* Summary Card */}
     

      <Card className="mb-6 rounded-2xl shadow-md">
 {/* Header & Add Button */}
     <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h1>States</h1>
        <Button label="Add New states" icon="pi pi-plus" className="p-button-success" onClick={() => openSidebar()} />
      </div>

        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <h3 className="text-lg font-semibold">Total States</h3>
            <p className="text-2xl">{summary.total}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Active</h3>
            <p className="text-2xl text-green-600">{summary.active}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Inactive</h3>
            <p className="text-2xl text-red-600">{summary.inactive}</p>
          </div>
        </div>
      </Card>


      {/* Data Table */}
      <DataTable
        value={states}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 20]}
        responsiveLayout="scroll"
        className="p-datatable-striped p-datatable-gridlines rounded-xl shadow"
      >
        <Column field="name" header="State Name" sortable />
        <Column field="code" header="Code" sortable />
        <Column field="status" header="Status" sortable />
        <Column header="Action" body={actionBodyTemplate} />
      </DataTable>

      {/* Sidebar Form */}
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        position="right"
        style={{ width: "30rem" }}
        className="bg-surface-0"
      >
        <form
          onSubmit={handleSave}
          className="flex flex-col gap-4 p-4"
        >
          <h2 className="text-xl font-semibold">
            {editState?.id ? "Edit State" : "Add New State"}
          </h2>

          <span className="p-float-label">
            <InputText
              id="stateName"
              value={editState?.name || ""}
              onChange={(e) =>
                setEditState({ ...editState, name: e.target.value })
              }
              required
              className="w-full"
            />
            <label htmlFor="stateName">State Name</label>
          </span>

          <span className="p-float-label">
            <InputText
              id="stateCode"
              value={editState?.code || ""}
              onChange={(e) =>
                setEditState({ ...editState, code: e.target.value })
              }
              required
              className="w-full"
            />
            <label htmlFor="stateCode">State Code</label>
          </span>

          <Dropdown
            value={editState?.status || "Active"}
            options={[
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
            ]}
            onChange={(e) =>
              setEditState({ ...editState, status: e.value })
            }
            placeholder="Select Status"
            className="w-full"
          />

          <Button
            type="submit"
            label="Save"
            icon="pi pi-check"
            className="p-button-success"
          />
          {editState?.id && (
            <Button
              type="button"
              label="Delete"
              icon="pi pi-trash"
              className="p-button-danger"
              onClick={() => handleDelete(editState.id)}
            />
          )}
        </form>
      </Sidebar>
    </div>
  );
}
