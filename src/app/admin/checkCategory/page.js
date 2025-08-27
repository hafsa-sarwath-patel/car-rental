"use client";

import { useState, useRef } from "react";
import { checklists as initialChecklists } from "./data";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function AdminChecklistsPage() {
  const [checklists, setChecklists] = useState(initialChecklists);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [editChecklist, setEditChecklist] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const toast = useRef(null);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(checklists.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentChecklists = checklists.slice(indexOfFirst, indexOfLast);

  const categories = [
    { label: "Interior", value: "Interior" },
    { label: "Exterior", value: "Exterior" },
  ];

  // Open Add Sidebar
  const openAddSidebar = () => {
    setEditChecklist({ id: null, name: "", category: "" });
    setSidebarVisible(true);
  };

  // Open Edit Sidebar
  const openEditSidebar = (checklist) => {
    setEditChecklist(checklist);
    setSidebarVisible(true);
  };

  // Save/Add Checklist
  const handleSave = (e) => {
    e.preventDefault();

    if (editChecklist.id) {
      // Update existing checklist
      setChecklists((prev) =>
        prev.map((c) => (c.id === editChecklist.id ? editChecklist : c))
      );
      toast.current.show({
        severity: "success",
        summary: "Updated",
        detail: "Checklist updated successfully!",
        life: 3000,
      });
    } else {
      // Add new checklist
      const newChecklist = { ...editChecklist, id: Date.now() };
      setChecklists((prev) => [...prev, newChecklist]);
      toast.current.show({
        severity: "success",
        summary: "Added",
        detail: "New checklist added successfully!",
        life: 3000,
      });
    }

    setSidebarVisible(false);
  };

  // Delete Checklist
  const handleDelete = () => {
    setChecklists((prev) => prev.filter((c) => c.id !== editChecklist.id));
    setSidebarVisible(false);
    toast.current.show({
      severity: "warn",
      summary: "Deleted",
      detail: "Checklist deleted!",
      life: 3000,
    });
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
        <h1 style={{ fontWeight: 700, fontSize: 28 }}>Manage Checklists</h1>
        <Button
          label="Add New Checklist"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={openAddSidebar}
        />
      </div>

      {/* Table */}
      <div style={{ flex: 1, padding: "2rem", background: "#232946" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #444" }}>
              <th style={{ textAlign: "left", padding: "10px" }}>
                Checklist Name
              </th>
              <th style={{ textAlign: "left", padding: "10px" }}>Category</th>
              <th style={{ textAlign: "center", padding: "10px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentChecklists.map((checklist) => (
              <tr key={checklist.id} style={{ borderBottom: "1px solid #444" }}>
                <td style={{ padding: "10px" }}>{checklist.name}</td>
                <td style={{ padding: "10px" }}>{checklist.category}</td>
                <td style={{ textAlign: "center", padding: "10px" }}>
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-info p-button-sm"
                    onClick={() => openEditSidebar(checklist)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}
        >
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
          <h2>{editChecklist?.id ? "Edit Checklist" : "Add New Checklist"}</h2>

          <label>
            Checklist Name:
            <input
              type="text"
              value={editChecklist?.name || ""}
              onChange={(e) =>
                setEditChecklist({ ...editChecklist, name: e.target.value })
              }
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
            Category:
            <Dropdown
              value={editChecklist?.category || ""}
              options={categories}
              onChange={(e) =>
                setEditChecklist({ ...editChecklist, category: e.value })
              }
              placeholder="Select Category"
              style={{ width: "100%", marginTop: 4 }}
            />
          </label>

          <Button
            type="submit"
            label="Save"
            icon="pi pi-check"
            className="p-button-success"
          />
          {editChecklist?.id && (
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
