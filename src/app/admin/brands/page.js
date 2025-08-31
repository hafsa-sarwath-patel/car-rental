"use client";

import { useState, useRef } from "react";
import { brands as initialBrands } from "./data"; // importing from data.js
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState(initialBrands);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(brands.length / itemsPerPage);

  const toast = useRef(null);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBrands = brands.slice(indexOfFirst, indexOfLast);

  // Open Add Brand Sidebar
  const openAddSidebar = () => {
    setEditBrand({ id: null, name: "", image: "", active: true });
    setSidebarVisible(true);
  };

  // Open Edit Brand Sidebar
  const openEditSidebar = (brand) => {
    setEditBrand(brand);
    setSidebarVisible(true);
  };

  // Save/Add Brand
  const handleSave = (e) => {
    e.preventDefault();
    if (editBrand.id) {
      setBrands((prev) => prev.map((b) => (b.id === editBrand.id ? editBrand : b)));
      toast.current.show({ severity: "success", summary: "Updated", detail: "Brand updated successfully", life: 3000 });
    } else {
      const newBrand = { ...editBrand, id: Date.now() };
      setBrands((prev) => [...prev, newBrand]);
      toast.current.show({ severity: "success", summary: "Added", detail: "New brand added", life: 3000 });
    }
    setSidebarVisible(false);
  };

  // Delete Brand
  const handleDelete = () => {
    setBrands((prev) => prev.filter((b) => b.id !== editBrand.id));
    toast.current.show({ severity: "warn", summary: "Deleted", detail: "Brand deleted successfully", life: 3000 });
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
        <h1 style={{ fontWeight: 700, fontSize: 28 }}>Brands</h1>
        <Button
          label="Add New Brand"
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
              <th style={{ textAlign: "left", padding: "10px" }}>Image</th>
              <th style={{ textAlign: "left", padding: "10px" }}>Name</th>
              <th style={{ textAlign: "left", padding: "10px" }}>Active</th>
              <th style={{ textAlign: "center", padding: "10px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentBrands.map((brand) => (
              <tr key={brand.id} style={{ borderBottom: "1px solid #444" }}>
                <td style={{ padding: "10px" }}>
                  {brand.image ? (
                    <img src={brand.image} alt={brand.name} width={50} height={50} style={{ borderRadius: 8 }} />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td style={{ padding: "10px" }}>{brand.name}</td>
                <td style={{ padding: "10px" }}>{brand.active ? "Yes" : "No"}</td>
                <td style={{ textAlign: "center", padding: "10px" }}>
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-info p-button-sm"
                    onClick={() => openEditSidebar(brand)}
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
          <h2>{editBrand?.id ? "Edit Brand" : "Add New Brand"}</h2>

          <label>
            Brand Name:
            <input
              type="text"
              value={editBrand?.name || ""}
              onChange={(e) => setEditBrand({ ...editBrand, name: e.target.value })}
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
            Brand Image URL:
            <input
              type="text"
              value={editBrand?.image || ""}
              onChange={(e) => setEditBrand({ ...editBrand, image: e.target.value })}
              placeholder="Paste image URL"
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
            Active:
            <select
              value={editBrand?.active ? "true" : "false"}
              onChange={(e) =>
                setEditBrand({ ...editBrand, active: e.target.value === "true" })
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: 4,
                border: "1px solid #ccc",
                marginTop: 4,
              }}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </label>

          <Button type="submit" label="Save" icon="pi pi-check" className="p-button-success" />
          {editBrand?.id && (
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
