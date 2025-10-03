"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function AdminVariantsPage() {
  const toast = useRef(null);

  const [variants, setVariants] = useState([]);
  const [models, setModels] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [editVariant, setEditVariant] = useState(null);

  // fetch variants
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

  // fetch models
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

  const openAddSidebar = () => {
    setEditVariant({ id: null, name: "", modelId: "" });
    setSidebarVisible(true);
  };

  const openEditSidebar = (variant) => {
    setEditVariant(variant);
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

  const onPageChange = (e) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  return (
    <div className="min-h-screen bg-surface-100 p-6">
      <Toast ref={toast} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Variants</h1>
        <Button
          label="Add New Variant"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={openAddSidebar}
        />
      </div>

      {/* Search */}
      <div className="mb-4">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="w-64"
          />
        </span>
      </div>

      {/* Data Table */}
      <DataTable
        value={variants}
        paginator
        first={first}
        rows={rows}
        onPage={onPageChange}
        globalFilter={globalFilter}
        rowsPerPageOptions={[5, 10, 20]}
        responsiveLayout="scroll"
        className="p-datatable-striped p-datatable-gridlines p-datatable-sm rounded-xl shadow"
      >
        <Column
          field="name"
          header="Variant Name"
          sortable
          filter
          filterPlaceholder="Search by name"
        />
        <Column
          header="Model"
          body={(row) => models.find((m) => m.id === row.modelId)?.name || "-"}
          sortable
        />
        <Column
          header="Action"
          body={(row) => (
            <Button
              icon="pi pi-pencil"
              className="p-button-rounded p-button-info p-button-sm"
              onClick={() => openEditSidebar(row)}
            />
          )}
          style={{ textAlign: "center", width: "8rem" }}
        />
      </DataTable>

      {/* Sidebar Add/Edit */}
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        position="right"
        className="bg-surface-0"
        style={{ width: "30rem" }}
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSave}
        >
          <h2 className="text-xl font-semibold">
            {editVariant?.id ? "Edit Variant" : "Add New Variant"}
          </h2>

          <span className="p-float-label">
            <InputText
              id="variantName"
              value={editVariant?.name || ""}
              onChange={(e) =>
                setEditVariant({ ...editVariant, name: e.target.value })
              }
              required
              className="w-full"
            />
            <label htmlFor="variantName">Variant Name</label>
          </span>

          <Dropdown
            value={editVariant?.modelId || ""}
            options={models.map((m) => ({ label: m.name, value: m.id }))}
            onChange={(e) =>
              setEditVariant({ ...editVariant, modelId: e.value })
            }
            placeholder="Select Model"
            className="w-full"
            required
          />

          <Button
            type="submit"
            label="Save"
            icon="pi pi-check"
            className="p-button-success"
          />
          {editVariant?.id && (
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
