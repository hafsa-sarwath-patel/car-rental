"use client";

import { useState, useRef } from "react";
import { models as initialModels } from "./data";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function AdminModelsPage() {
  const [models, setModels] = useState(initialModels);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [editModel, setEditModel] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(models.length / itemsPerPage);

  const toast = useRef(null); // Toast reference

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentModels = models.slice(indexOfFirst, indexOfLast);

  // Open Add Model Sidebar
  const openAddSidebar = () => {
    setEditModel({ id: null, name: "", brand: "" });
    setSidebarVisible(true);
  };

  // Open Edit Model Sidebar
  const openEditSidebar = (model) => {
    setEditModel(model);
    setSidebarVisible(true);
  };

  // Save/Add Model
  const handleSave = (e) => {
    e.preventDefault();
    if (editModel.id) {
      // Update existing model
      setModels((prev) => prev.map((m) => (m.id === editModel.id ? editModel : m)));
      toast.current.show({ severity: "success", summary: "Updated", detail: "Model updated successfully", life: 3000 });
    } else {
      // Add new model
      const newModel = { ...editModel, id: Date.now() };
      setModels((prev) => [...prev, newModel]);
      toast.current.show({ severity: "success", summary: "Added", detail: "New model added", life: 3000 });
    }
    setSidebarVisible(false);
  };

  // Delete Model
  const handleDelete = () => {
    setModels((prev) => prev.filter((m) => m.id !== editModel.id));
    toast.current.show({ severity: "warn", summary: "Deleted", detail: "Model deleted successfully", life: 3000 });
    setSidebarVisible(false);
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
        <h1 style={{ fontWeight: 700, fontSize: 28 }}>Manage Models</h1>
        <Button
          label="Add New Model"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={openAddSidebar}
        />
      </div>

      {/* Table */}
      <div style={{ flex: 1, padding: "2rem", background: "#232946" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #444" }}>
              <th style={{ textAlign: "left", padding: "10px" }}>Model Name</th>
              <th style={{ textAlign: "left", padding: "10px" }}>Brand</th>
              <th style={{ textAlign: "center", padding: "10px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentModels.map((model) => (
              <tr key={model.id} style={{ borderBottom: "1px solid #444" }}>
                <td style={{ padding: "10px" }}>{model.name}</td>
                <td style={{ padding: "10px" }}>{model.brand}</td>
                <td style={{ textAlign: "center", padding: "10px" }}>
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-info p-button-sm"
                    onClick={() => openEditSidebar(model)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
          <Button
            label="Prev"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="p-button-text"
          />
          <span style={{ margin: "0 10px", alignSelf: "center" }}>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            label="Next"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="p-button-text"
          />
        </div>
      </div>

      {/* Sidebar (Add/Edit) */}
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        position="right"
        style={{ width: "30rem" }}
      >
        <form
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          onSubmit={handleSave}
        >
          <h2>{editModel?.id ? "Edit Model" : "Add New Model"}</h2>
          <label>
            Model Name:
            <input
              type="text"
              value={editModel?.name || ""}
              onChange={(e) => setEditModel({ ...editModel, name: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: 4,
                border: "1px solid #ccc",
                marginTop: 4,
              }}
            />
          </label>
          <label>
            Brand:
            <input
              type="text"
              value={editModel?.brand || ""}
              onChange={(e) => setEditModel({ ...editModel, brand: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: 4,
                border: "1px solid #ccc",
                marginTop: 4,
              }}
            />
          </label>

          <Button type="submit" label="Save" icon="pi pi-check" className="p-button-success" />
          {editModel?.id && (
            <Button
              type="button"
              label="Delete"
              icon="pi pi-trash"
              className="p-button-danger"
              onClick={handleDelete}
            />
          )}
        </form>
      </Sidebar>
    </div>
  );
}
