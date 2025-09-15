"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const toast = useRef(null);

  const itemsPerPage = 5;

  // Load categories from API
  const loadCategories = async () => {
    try {
      const res = await fetch("/api/v1/checklistcategory");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCategories(data);
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load categories",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddSidebar = () => {
    setEditCategory({ id: null, name: "", description: "" });
    setSidebarVisible(true);
  };

  const openEditSidebar = (category) => {
    setEditCategory(category);
    setSidebarVisible(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const method = editCategory.id ? "PUT" : "POST";
      const url = editCategory.id
        ? `/api/v1/checklistcategory/${editCategory.id}`
        : "/api/v1/checklistcategory";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editCategory.name,
          description: editCategory.description || editCategory.description,
        }),
      });

      if (!res.ok) throw new Error();

      toast.current.show({
        severity: "success",
        summary: editCategory.id ? "Updated" : "Added",
        detail: `Category ${editCategory.id ? "updated" : "added"} successfully`,
        life: 3000,
      });

      setSidebarVisible(false);
      await loadCategories();
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
      const res = await fetch(`/api/v1/checklistcategory/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.current.show({
        severity: "warn",
        summary: "Deleted",
        detail: "Category deleted",
        life: 3000,
      });
      await loadCategories();
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
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <Button icon="pi pi-pencil" className="p-button-sm p-button-info" onClick={() => openEditSidebar(rowData)} />
      <Button icon="pi pi-trash" className="p-button-sm p-button-danger" onClick={() => handleDelete(rowData.id)} />
    </div>
  );

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirst, indexOfLast);

  return (
    <div style={{ minHeight: "100vh", background: "#a4aeedff", display: "flex", flexDirection: "column", color: "#fff" }}>
      <Toast ref={toast} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", background: "#232946" }}>
        <h1 style={{ fontWeight: 700, fontSize: 28 }}>Checklist Categories</h1>
        <Button label="Add New Category" icon="pi pi-plus" className="p-button-success" onClick={openAddSidebar} />
      </div>

      {/* Table */}
      <div style={{ flex: 1, padding: "2rem", background: "#232946" }}>
        <DataTable value={currentCategories} paginator rows={itemsPerPage} responsiveLayout="scroll">
          <Column field="name" header="Category Name" sortable />
          <Column field="description" header="Description" sortable />
          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
          <Button label="Prev" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-button-text" />
          <span style={{ margin: "0 10px", alignSelf: "center" }}>Page {currentPage} of {totalPages}</span>
          <Button label="Next" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-button-text" />
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar visible={sidebarVisible} onHide={() => setSidebarVisible(false)} position="right" style={{ width: "30rem" }}>
        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }} onSubmit={handleSave}>
          <h2>{editCategory?.id ? "Edit Category" : "Add New Category"}</h2>
          <label>
            Category Name:
            <input type="text" value={editCategory?.name || ""} onChange={e => setEditCategory({ ...editCategory, name: e.target.value })} required style={{ width: "100%", padding: "8px" }} />
          </label>
          <label>
            Description:
            <textarea value={editCategory?.description || ""} onChange={e => setEditCategory({ ...editCategory, description: e.target.value })} style={{ width: "100%", padding: "8px", minHeight: "80px" }} />
          </label>
          <Button type="submit" label="Save" icon="pi pi-check" className="p-button-success" />
          {editCategory?.id && (
            <Button type="button" label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={() => handleDelete(editCategory.id)} />
          )}
        </form>
      </Sidebar>
    </div>
  );
}
