"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";

export default function AdminCitiesPage() {
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [editCity, setEditCity] = useState(null);
  const toast = useRef(null);

  // Load states and cities
  const loadStates = async () => {
    try {
      const res = await fetch("/api/v1/states");
      if (!res.ok) throw new Error();
      setStates(await res.json());
    } catch {
      toast.current.show({ severity: "error", summary: "Error", detail: "Failed to load states", life: 3000 });
    }
  };

  const loadCities = async () => {
    try {
      const res = await fetch("/api/v1/cities");
      if (!res.ok) throw new Error();
      setCities(await res.json());
    } catch {
      toast.current.show({ severity: "error", summary: "Error", detail: "Failed to load cities", life: 3000 });
    }
  };

  useEffect(() => {
    loadStates();
    loadCities();
  }, []);

  const openSidebar = (city = null) => {
    setEditCity(
      city
        ? { ...city }
        : { id: null, name: "", stateId: "", status: "Active" }
    );
    setSidebarVisible(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const method = editCity.id ? "PUT" : "POST";
      const url = editCity.id
        ? `/api/v1/cities/${editCity.id}`
        : "/api/v1/cities";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editCity.name,
          stateId: editCity.stateId,
          status: editCity.status,
        }),
      });
      if (!res.ok) throw new Error();

      toast.current.show({
        severity: "success",
        summary: editCity.id ? "Updated" : "Added",
        detail: `City ${editCity.id ? "updated" : "added"} successfully`,
        life: 3000,
      });

      setSidebarVisible(false);
      await loadCities();
    } catch {
      toast.current.show({ severity: "error", summary: "Error", detail: "Save failed", life: 3000 });
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/v1/cities/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.current.show({ severity: "warn", summary: "Deleted", detail: "City deleted", life: 3000 });
      await loadCities();
    } catch {
      toast.current.show({ severity: "error", summary: "Error", detail: "Delete failed", life: 3000 });
    }
  };

  const actionBodyTemplate = (row) => (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <Button icon="pi pi-pencil" className="p-button-sm p-button-info" onClick={() => openSidebar(row)} />
      <Button icon="pi pi-trash" className="p-button-sm p-button-danger" onClick={() => handleDelete(row.id)} />
    </div>
  );

  // Summary counts
  const total = cities.length;
  const activeCount = cities.filter(c => c.status === "Active").length;
  const inactiveCount = cities.filter(c => c.status === "Inactive").length;

  return (
    <div style={{ minHeight: "100vh", padding: "2rem", background: "#fafafa" }}>
      <Toast ref={toast} />

      {/* Summary Card */}
      <Card className="p-4 mb-4 rounded-2xl">

<div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h1>Cities</h1>
        <Button label="Add New City" icon="pi pi-plus" className="p-button-success" onClick={() => openSidebar()} />
      </div>

        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <h3 className="text-lg font-semibold">Total Cities</h3>
            <p className="text-2xl">{total}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Active</h3>
            <p className="text-2xl text-green-600">{activeCount}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Inactive</h3>
            <p className="text-2xl text-red-600">{inactiveCount}</p>
          </div>
        </div>
      </Card>

     

      <DataTable value={cities} paginator rows={10} rowKey="id">
        <Column field="name" header="City Name" sortable />
        <Column field="stateName" header="State" sortable />
        <Column header="Action" body={actionBodyTemplate} style={{ textAlign: "center", width: "8rem" }} />
      </DataTable>

      <Sidebar visible={sidebarVisible} onHide={() => setSidebarVisible(false)} position="right" style={{ width: "30rem" }}>
        <h2>{editCity?.id ? "Edit City" : "Add New City"}</h2>
        <form style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }} onSubmit={handleSave}>
          <label>
            City Name:
            <input
              type="text"
              value={editCity?.name || ""}
              onChange={(e) => setEditCity({ ...editCity, name: e.target.value })}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </label>
          <label>
            State:
            <Dropdown
              value={editCity?.stateId || ""}
              options={states.map((s) => ({ label: s.name, value: s.id }))}
              onChange={(e) => setEditCity({ ...editCity, stateId: e.value })}
              placeholder="Select a state"
              style={{ width: "100%" }}
            />
          </label>
          <label>
            Status:
            <Dropdown
              value={editCity?.status || "Active"}
              options={[
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ]}
              onChange={(e) => setEditCity({ ...editCity, status: e.value })}
              style={{ width: "100%" }}
            />
          </label>
          <Button type="submit" label="Save" className="p-button-success" />
        </form>
      </Sidebar>
    </div>
  );
}
