"use client";
import { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";

export default function AdminCitiesPage() {
  const [cities, setCities] = useState([
    { id: 1, name: "Mumbai", state: "Maharashtra" },
    { id: 2, name: "Bangalore", state: "Karnataka" },
  ]);

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [editCity, setEditCity] = useState(null);
  const toast = useRef(null);

  const states = ["Maharashtra", "Karnataka", "Telangana", "Tamil Nadu", "Delhi"];

  // Open Sidebar for Add/Edit
  const openSidebar = (city = null) => {
    setEditCity(city ? { ...city } : { id: null, name: "", state: "" });
    setSidebarVisible(true);
  };

  // Save City
  const handleSave = (e) => {
    e.preventDefault();
    if (editCity.id) {
      setCities((prev) =>
        prev.map((c) => (c.id === editCity.id ? editCity : c))
      );
      toast.current.show({
        severity: "info",
        summary: "Updated",
        detail: "City updated successfully",
        life: 3000,
      });
    } else {
      setCities((prev) => [...prev, { ...editCity, id: Date.now() }]);
      toast.current.show({
        severity: "success",
        summary: "Added",
        detail: "City added successfully",
        life: 3000,
      });
    }
    setSidebarVisible(false);
  };

  const actionBodyTemplate = (rowData) => (
    <Button
      label="Edit"
      icon="pi pi-pencil"
      className="p-button-sm p-button-info"
      onClick={() => openSidebar(rowData)}
    />
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fafafaff",
        display: "flex",
        flexDirection: "column",
        color: "#fff",
      }}
    >
      <Toast ref={toast} />

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
        <h1>Cities</h1>
        <Button
          label="Add New City"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={() => openSidebar()}
        />
      </div>

      {/* Table */}
      <div style={{ flex: 1, padding: "2rem" }}>
        <DataTable value={cities} paginator rows={5} responsiveLayout="scroll">
          <Column field="name" header="City Name" sortable></Column>
          <Column field="state" header="State Name" sortable></Column>
          <Column body={actionBodyTemplate} header="Action"></Column>
        </DataTable>
      </div>

      {/* Sidebar */}
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        position="right"
        style={{ width: "30rem" }}
      >
        <h2>{editCity?.id ? "Edit City" : "Add New City"}</h2>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginTop: "1rem",
          }}
          onSubmit={handleSave}
        >
          {/* City Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label><strong>City Name:</strong></label>
            <input
              type="text"
              value={editCity?.name || ""}
              onChange={(e) =>
                setEditCity({ ...editCity, name: e.target.value })
              }
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          {/* State Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label><strong>State Name:</strong></label>
            <Dropdown
              value={editCity?.state || ""}
              options={states}
              onChange={(e) =>
                setEditCity({ ...editCity, state: e.value })
              }
              placeholder="Select a State"
              style={{ width: "100%" }}
            />
          </div>

          <Button type="submit" label="Save" className="p-button-success" />
        </form>
      </Sidebar>
    </div>
  );
}
