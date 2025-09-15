"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function AdminModelsPage() {
  const [models, setModels] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [editModel, setEditModel] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const toast = useRef(null);

  // Fetch models
  const loadModels = async () => {
    try {
      const res = await fetch("/api/v1/models");
      if (!res.ok) throw new Error("Failed to fetch models");
      const data = await res.json();
      setModels(data);
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load models",
        life: 3000,
      });
    }
  };

  // Fetch brands for dropdown
  const loadBrands = async () => {
    try {
      const res = await fetch("/api/v1/brands");
      if (!res.ok) throw new Error("Failed to fetch brands");
      const data = await res.json();
      setBrands(data);
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load brands",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    loadModels();
    loadBrands();
  }, []);

  const totalPages = Math.ceil(models.length / itemsPerPage);
  const currentModels = models.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openAddSidebar = () => {
    setEditModel({ id: null, name: "", brandId: brands[0]?.id || "" });
    setSidebarVisible(true);
  };

  const openEditSidebar = (model) => {
    setEditModel(model);
    setSidebarVisible(true);
  };

  // Save/Add Model via API
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const method = editModel.id ? "PUT" : "POST";
      const url = editModel.id
        ? `/api/v1/models/${editModel.id}`
        : "/api/v1/models";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editModel),
      });

      if (!res.ok) throw new Error("Failed to save model");

      toast.current.show({
        severity: "success",
        summary: editModel.id ? "Updated" : "Added",
        detail: `Model ${editModel.id ? "updated" : "added"} successfully`,
        life: 3000,
      });

      setSidebarVisible(false);
      await loadModels();
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Save failed",
        life: 3000,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/v1/models/${editModel.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.current.show({
        severity: "warn",
        summary: "Deleted",
        detail: "Model deleted successfully",
        life: 3000,
      });
      setSidebarVisible(false);
      await loadModels();
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Delete failed",
        life: 3000,
      });
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#a4aeedff", color: "#fff" }}>
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
        <h1 style={{ fontWeight: 700, fontSize: 28 }}>Models</h1>
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
              <th style={{ padding: 10 }}>Model Name</th>
              <th style={{ padding: 10 }}>Brand</th>
              <th style={{ padding: 10, textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentModels.map((model) => (
              <tr key={model.id} style={{ borderBottom: "1px solid #444" }}>
                <td style={{ padding: 10 }}>{model.name}</td>
                <td style={{ padding: 10 }}>{model.brandName}</td>
                <td style={{ padding: 10, textAlign: "center" }}>
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
        <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
          <Button
            label="Prev"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="p-button-text"
          />
          <span style={{ margin: "0 10px", alignSelf: "center" }}>
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            label="Next"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-button-text"
          />
        </div>
      </div>

      {/* Sidebar */}
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
              style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            />
          </label>

          <label>
            Brand:
            <select
              value={editModel?.brandId || ""}
              onChange={(e) => setEditModel({ ...editModel, brandId: e.target.value })}
              required
              style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
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
