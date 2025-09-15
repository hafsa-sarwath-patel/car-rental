"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function AdminVariantsPage() {
  const [variants, setVariants] = useState([]);
  const [models, setModels] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [editVariant, setEditVariant] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const toast = useRef(null);

  // Load all variants
  const loadVariants = async () => {
    try {
      const res = await fetch("/api/v1/variants");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setVariants(data);
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load variants",
        life: 3000,
      });
    }
  };

  // Load all models for dropdown
  const loadModels = async () => {
    try {
      const res = await fetch("/api/v1/models");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setModels(data);
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load models",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    loadVariants();
    loadModels();
  }, []);

  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const currentVariants = variants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openAddSidebar = () => {
    setEditVariant({ id: null, name: "", modelId: "" });
    setSidebarVisible(true);
  };

  const openEditSidebar = (variant) => {
    setEditVariant({
      id: variant.id,
      name: variant.name,
      modelId: variant.modelId,
    });
    setSidebarVisible(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const method = editVariant.id ? "PUT" : "POST";
      const url = editVariant.id
        ? `/api/v1/variants/${editVariant.id}`
        : "/api/v1/variants";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editVariant),
      });

      if (!res.ok) throw new Error();

      toast.current.show({
        severity: "success",
        summary: editVariant.id ? "Updated" : "Added",
        detail: `Variant ${editVariant.id ? "updated" : "added"} successfully`,
        life: 3000,
      });

      setSidebarVisible(false);
      await loadVariants();
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
      const res = await fetch(`/api/v1/variants/${editVariant.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.current.show({
        severity: "warn",
        summary: "Deleted",
        detail: "Variant deleted successfully",
        life: 3000,
      });
      setSidebarVisible(false);
      await loadVariants();
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

      <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem 2rem", background: "#232946" }}>
        <h1 style={{ fontWeight: 700, fontSize: 28 }}>Variants</h1>
        <Button label="Add New Variant" icon="pi pi-plus" className="p-button-success" onClick={openAddSidebar} />
      </div>

      <div style={{ flex: 1, padding: "2rem", background: "#232946" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #444" }}>
              <th style={{ padding: "10px", textAlign: "left" }}>Variant Name</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Model</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentVariants.map((v) => {
              const modelName = models.find((m) => m.id === v.modelId)?.name || "-";
              return (
                <tr key={v.id} style={{ borderBottom: "1px solid #444" }}>
                  <td style={{ padding: "10px" }}>{v.name}</td>
                  <td style={{ padding: "10px" }}>{modelName}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-info p-button-sm" onClick={() => openEditSidebar(v)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
          <Button label="Prev" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="p-button-text" />
          <span style={{ margin: "0 10px", alignSelf: "center" }}>Page {currentPage} of {totalPages || 1}</span>
          <Button label="Next" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage((p) => p + 1)} className="p-button-text" />
        </div>
      </div>

      <Sidebar visible={sidebarVisible} onHide={() => setSidebarVisible(false)} position="right" style={{ width: "30rem" }}>
        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }} onSubmit={handleSave}>
          <h2>{editVariant?.id ? "Edit Variant" : "Add New Variant"}</h2>

          <label>
            Variant Name:
            <input type="text" value={editVariant?.name || ""} onChange={(e) => setEditVariant({ ...editVariant, name: e.target.value })} required style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }} />
          </label>

          <label>
            Model:
            <select value={editVariant?.modelId || ""} onChange={(e) => setEditVariant({ ...editVariant, modelId: e.target.value })} required style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}>
              <option value="">Select Model</option>
              {models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </label>

          <Button type="submit" label="Save" icon="pi pi-check" className="p-button-success" />
          {editVariant?.id && <Button type="button" label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={handleDelete} />}
        </form>
      </Sidebar>
    </div>
  );
}
