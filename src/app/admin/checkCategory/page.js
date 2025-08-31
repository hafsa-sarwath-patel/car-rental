"use client";

import { useState, useRef } from "react";
import { categories as initialCategories } from "./data"; // make sure data.js has {id, name, description}
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const toast = useRef(null);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirst, indexOfLast);

  // Open Add Sidebar
  const openAddSidebar = () => {
    setEditCategory({ id: null, name: "", description: "" });
    setSidebarVisible(true);
  };

  // Open Edit Sidebar
  const openEditSidebar = (category) => {
    setEditCategory(category);
    setSidebarVisible(true);
  };

  // Save/Add Category
  const handleSave = (e) => {
    e.preventDefault();

    if (editCategory.id) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editCategory.id ? editCategory : c))
      );
      toast.current.show({
        severity: "success",
        summary: "Updated",
        detail: "Category updated successfully!",
        life: 3000,
      });
    } else {
      const newCategory = { ...editCategory, id: Date.now() };
      setCategories((prev) => [...prev, newCategory]);
      toast.current.show({
        severity: "success",
        summary: "Added",
        detail: "New category added successfully!",
        life: 3000,
      });
    }

    setSidebarVisible(false);
  };

  // Delete Category
  const handleDelete = () => {
    setCategories((prev) => prev.filter((c) => c.id !== editCategory.id));
    setSidebarVisible(false);
    toast.current.show({
      severity: "warn",
      summary: "Deleted",
      detail: "Category deleted!",
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
        <h1 style={{ fontWeight: 700, fontSize: 28 }}>checklist Categories</h1>
        <Button
          label="Add New Category"
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
              <th style={{ textAlign: "left", padding: "10px" }}>Category Name</th>
              <th style={{ textAlign: "left", padding: "10px" }}>Description</th>
              <th style={{ textAlign: "center", padding: "10px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((category) => (
              <tr key={category.id} style={{ borderBottom: "1px solid #444" }}>
                <td style={{ padding: "10px" }}>{category.name}</td>
                <td style={{ padding: "10px" }}>{category.description}</td>
                <td style={{ textAlign: "center", padding: "10px" }}>
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-info p-button-sm"
                    onClick={() => openEditSidebar(category)}
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
          <h2>{editCategory?.id ? "Edit Category" : "Add New Category"}</h2>

          <label>
            Category Name:
            <input
              type="text"
              value={editCategory?.name || ""}
              onChange={(e) =>
                setEditCategory({ ...editCategory, name: e.target.value })
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
            Description:
            <textarea
              value={editCategory?.description || ""}
              onChange={(e) =>
                setEditCategory({ ...editCategory, description: e.target.value })
              }
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: 4,
                border: "1px solid #ccc",
                marginTop: 4,
                minHeight: "80px",
              }}
            />
          </label>

          <Button
            type="submit"
            label="Save"
            icon="pi pi-check"
            className="p-button-success"
          />
          {editCategory?.id && (
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
