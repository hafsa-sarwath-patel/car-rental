"use client";

import { useState, useRef } from "react";
import { variants as initialVariants } from "./data";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function AdminVariantsPage() {
  const [variants, setVariants] = useState(initialVariants);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [editVariant, setEditVariant] = useState(null); // null = Add Mode
  const [currentPage, setCurrentPage] = useState(1);
  const toast = useRef(null);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentVariants = variants.slice(indexOfFirst, indexOfLast);

  // Open Add Variant Sidebar
  const openAddSidebar = () => {
    setEditVariant({ id: null, name: "", brand: "" });
    setSidebarVisible(true);
  };

  // Open Edit Variant Sidebar
  const openEditSidebar = (variant) => {
    setEditVariant(variant);
    setSidebarVisible(true);
  };

  // Save/Add Variant
  const handleSave = (e) => {
    e.preventDefault();
    if (editVariant.id) {
      setVariants((prev) => prev.map((v) => (v.id === editVariant.id ? editVariant : v)));
      toast.current.show({ severity: "success", summary: "Updated", detail: "Variant updated successfully", life: 3000 });
    } else {
      const newVariant = { ...editVariant, id: Date.now() };
      setVariants((prev) => [...prev, newVariant]);
      toast.current.show({ severity: "success", summary: "Added", detail: "Variant added successfully", life: 3000 });
    }
    setSidebarVisible(false);
  };

  // Delete Variant
  const handleDelete = () => {
    setVariants((prev) => prev.filter((v) => v.id !== editVariant.id));
    toast.current.show({ severity: "warn", summary: "Deleted", detail: "Variant deleted", life: 3000 });
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
        <h1 style={{ fontWeight: 700, fontSize: 28 }}>Manage Variants</h1>
        <Button label="Add New Variant" icon="pi pi-plus" className="p-button-success" onClick={openAddSidebar} />
      </div>

      {/* Table */}
      <div style={{ flex: 1, padding: "2rem", background: "#232946" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #444" }}>
              <th style={{ textAlign: "left", padding: "10px" }}>Variant Name</th>
              <th style={{ textAlign: "left", padding: "10px" }}>Brand</th>
              <th style={{ textAlign: "center", padding: "10px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentVariants.map((variant) => (
              <tr key={variant.id} style={{ borderBottom: "1px solid #444" }}>
                <td style={{ padding: "10px" }}>{variant.name}</td>
                <td style={{ padding: "10px" }}>{variant.brand}</td>
                <td style={{ textAlign: "center", padding: "10px" }}>
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-info p-button-sm"
                    onClick={() => openEditSidebar(variant)}
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

      {/* Sidebar */}
      <Sidebar visible={sidebarVisible} onHide={() => setSidebarVisible(false)} position="right" style={{ width: "30rem" }}>
        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }} onSubmit={handleSave}>
          <h2>{editVariant?.id ? "Edit Variant" : "Add New Variant"}</h2>
          <label>
            Variant Name:
            <input
              type="text"
              value={editVariant?.name || ""}
              onChange={(e) => setEditVariant({ ...editVariant, name: e.target.value })}
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
              value={editVariant?.brand || ""}
              onChange={(e) => setEditVariant({ ...editVariant, brand: e.target.value })}
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
          {editVariant?.id && (
            <Button type="button" label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={handleDelete} />
          )}
        </form>
      </Sidebar>
    </div>
  );
}
