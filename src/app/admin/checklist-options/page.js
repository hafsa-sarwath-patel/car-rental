"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function AdminChecklistsPage() {
  const [checklists, setChecklists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [editChecklist, setEditChecklist] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const toast = useRef(null);

  const itemsPerPage = 5;

  // Load checklist options
  const loadChecklists = async () => {
    try {
      const res = await fetch("/api/v1/checklistoption");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setChecklists(data);
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load checklist options",
        life: 3000,
      });
    }
  };

  // Load categories for dropdown
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
    loadChecklists();
    loadCategories();
  }, []);

  const openAddSidebar = () => {
    setEditChecklist({ id: null, name: "", categoryId: "" });
    setSidebarVisible(true);
  };

  const openEditSidebar = (checklist) => {
    setEditChecklist({
      id: checklist.id,
      name: checklist.name,
      categoryId: checklist.category?.id || "",
    });
    setSidebarVisible(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const method = editChecklist.id ? "PUT" : "POST";
      const url = editChecklist.id
        ? `/api/v1/checklistoption/${editChecklist.id}`
        : "/api/v1/checklistoption";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editChecklist.name,
          categoryId: editChecklist.categoryId,
        }),
      });

      if (!res.ok) throw new Error();

      toast.current.show({
        severity: "success",
        summary: editChecklist.id ? "Updated" : "Added",
        detail: `Checklist option ${editChecklist.id ? "updated" : "added"} successfully`,
        life: 3000,
      });

      setSidebarVisible(false);
      await loadChecklists();
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
      const res = await fetch(`/api/v1/checklistoption/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.current.show({
        severity: "warn",
        summary: "Deleted",
        detail: "Checklist option deleted",
        life: 3000,
      });
      await loadChecklists();
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
      <Button
        icon="pi pi-pencil"
        className="p-button-sm p-button-info"
        onClick={() => openEditSidebar(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-sm p-button-danger"
        onClick={() => handleDelete(rowData.id)}
      />
    </div>
  );

  const totalPages = Math.ceil(checklists.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentChecklists = checklists.slice(indexOfFirst, indexOfLast);

  return (
    <div style={{ minHeight: "100vh", background: "#a4aeedff", display: "flex", flexDirection: "column", color: "#fff" }}>
      <Toast ref={toast} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", background: "#232946" }}>
        <h1 style={{ fontWeight: 700, fontSize: 28 }}>Checklist Options</h1>
        <Button label="Add New Option" icon="pi pi-plus" className="p-button-success" onClick={openAddSidebar} />
      </div>

      {/* Table */}
      <div style={{ flex: 1, padding: "2rem", background: "#232946" }}>
        <DataTable value={currentChecklists} paginator rows={itemsPerPage} responsiveLayout="scroll">
          <Column field="name" header="Option Name" sortable />
          <Column field="category.name" header="Category" sortable />
          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
          <Button label="Prev" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)} className="p-button-text" />
          <span style={{ margin: "0 10px", alignSelf: "center" }}>Page {currentPage} of {totalPages}</span>
          <Button label="Next" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)} className="p-button-text" />
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar visible={sidebarVisible} onHide={() => setSidebarVisible(false)} position="right" style={{ width: "30rem" }}>
        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }} onSubmit={handleSave}>
          <h2>{editChecklist?.id ? "Edit Checklist Option" : "Add New Checklist Option"}</h2>

          <label>
            Option Name:
            <input
              type="text"
              value={editChecklist?.name || ""}
              onChange={(e) => setEditChecklist({ ...editChecklist, name: e.target.value })}
              required
              style={{ width: "100%", padding: "8px", borderRadius: 4, border: "1px solid #ccc", marginTop: 4 }}
            />
          </label>

          <label>
            Category:
            <select
              value={editChecklist?.categoryId || ""}
              onChange={(e) => setEditChecklist({ ...editChecklist, categoryId: e.target.value })}
              required
              style={{ width: "100%", padding: "8px", borderRadius: 4, border: "1px solid #ccc", marginTop: 4 }}
            >
              <option value="" disabled>Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </label>

          <Button type="submit" label="Save" icon="pi pi-check" className="p-button-success" />
          {editChecklist?.id && (
            <Button type="button" label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={() => handleDelete(editChecklist.id)} />
          )}
        </form>
      </Sidebar>
    </div>
  );
}
