"use client";
import { useState } from "react";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";

export default function AdminCitiesPage() {
  const [cities, setCities] = useState([
    { id: 1, name: "Mumbai" },
    { id: 2, name: "Bangalore" },
  ]);

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [editCity, setEditCity] = useState(null);

  // Open Sidebar for Add/Edit
  const openSidebar = (city = null) => {
    setEditCity(city ? { ...city } : { id: null, name: "" });
    setSidebarVisible(true);
  };

  // Save City (Add or Edit)
  const handleSave = (e) => {
    e.preventDefault();
    if (editCity.id) {
      setCities((prev) =>
        prev.map((c) => (c.id === editCity.id ? editCity : c))
      );
    } else {
      setCities((prev) => [...prev, { ...editCity, id: Date.now() }]);
    }
    setSidebarVisible(false);
  };

  // Delete City
  const handleDelete = (id) => {
    setCities((prev) => prev.filter((c) => c.id !== id));
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
        <h1>Cities</h1>
        <Button
          label="Add New City"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={() => openSidebar()}
        />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "2rem" }}>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {cities.map((city) => (
            <li
              key={city.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid #444",
              }}
            >
              {city.name}
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  label="Edit"
                  icon="pi pi-pencil"
                  className="p-button-sm p-button-info"
                  onClick={() => openSidebar(city)}
                />
                <Button
                  label="Remove"
                  icon="pi pi-trash"
                  className="p-button-sm p-button-danger"
                  onClick={() => handleDelete(city.id)}
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
        <h2>{editCity?.id ? "Edit City" : "Add New City"}</h2>
        <form
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          onSubmit={handleSave}
        >
          <label>
            City Name:
            <input
              type="text"
              value={editCity?.name || ""}
              onChange={(e) =>
                setEditCity({ ...editCity, name: e.target.value })
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
