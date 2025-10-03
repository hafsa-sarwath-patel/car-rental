"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
//import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

export default function AdminModelsPage() {
  const [models, setModels] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [editModel, setEditModel] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  // Fetch models
  const loadModels = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/models");
      if (!res.ok) throw new Error("Failed to fetch models");
      const data = await res.json();
      setModels(data);
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load models",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch brands
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

  const openAddSidebar = () => {
    setEditModel({ id: null, name: "", brandId: brands[0]?.id || "" });
    setSidebarVisible(true);
  };

  const openEditSidebar = (model) => {
    setEditModel(model);
    setSidebarVisible(true);
  };

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
    <div className="p-4" style={{ minHeight: "100vh", background: "#a4aeedff", color: "#fff" }}>
      <Toast ref={toast} />

      {/* Header */}
      <div className="p-d-flex p-jc-between p-ai-center p-mb-3" style={{ background: "#232946", padding: "1rem 2rem" }}>
        <h1 style={{ fontWeight: 700, fontSize: 28 }}>Models</h1>
        <Button label="Add New Model" icon="pi pi-plus" className="p-button-success" onClick={openAddSidebar} />
      </div>

      {/* DataTable */}
      <Card>
        {loading ? (
          <div className="p-d-flex p-jc-center p-ai-center" style={{ height: 200 }}>
            <ProgressSpinner />
          </div>
        ) : (
          <DataTable
            value={models}
            paginator
            rows={5}
            responsiveLayout="scroll"
            emptyMessage="No models found"
          >
            <Column field="name" header="Model Name" />
            <Column field="brandName" header="Brand" />
            <Column
              header="Actions"
              body={(rowData) => (
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-info p-button-sm" onClick={() => openEditSidebar(rowData)} />
              )}
            />
          </DataTable>
        )}
      </Card>

      {/* Sidebar */}
     <Sidebar
  visible={sidebarVisible}
  onHide={() => setSidebarVisible(false)}
  position="right"
  style={{ width: "40rem", maxWidth: "95vw", height: "100%", overflowY: "auto" }}
>
  <Card>
    <form className="p-fluid" onSubmit={handleSave}>
      <h2>{editModel?.id ? "Edit Model" : "Add New Model"}</h2>

      {/* Field 1 */}
      <FloatLabel className="p-my-3 mt-5">
        <InputText
          id="modelName"
          value={editModel?.name || ""}
          onChange={(e) => setEditModel({ ...editModel, name: e.target.value })}
          required
        />
        <label htmlFor="modelName">Model Name</label>
      </FloatLabel>

      {/* Field 2 */}
      <FloatLabel className="p-my-3 mt-5">
        <InputText
          id="modelCode"
          value={editModel?.code || ""}
          onChange={(e) => setEditModel({ ...editModel, code: e.target.value })}
          required
        />
        <label htmlFor="modelCode">Model Code</label>
      </FloatLabel>

      {/* Field 3 */}
      <FloatLabel className="p-my-3 mt-5">
        <InputText
          id="modelDescription"
          value={editModel?.description || ""}
          onChange={(e) => setEditModel({ ...editModel, description: e.target.value })}
        />
        <label htmlFor="modelDescription">Description</label>
      </FloatLabel>

      <div className="p-d-flex p-jc-between p-mt-5">
        <Button type="submit" label="Save" icon="pi pi-check" className="p-button-success" />
        {editModel?.id && (
          <Button type="button" label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={handleDelete} />
        )}
      </div>
    </form>
  </Card>
</Sidebar>
    </div>
  );
}
