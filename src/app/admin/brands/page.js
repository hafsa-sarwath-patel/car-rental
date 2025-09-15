"use client";

import { useEffect, useState, useRef } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;
  const toast = useRef(null);

  const totalPages = Math.ceil(brands.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBrands = brands.slice(indexOfFirst, indexOfLast);

  // Fetch brands from backend
  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/brands");
      if (!res.ok) throw new Error("Failed to fetch brands");
      const data = await res.json();
      setBrands(data);
    } catch (err) {
      console.error(err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch brands",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Open Add Brand Sidebar
  const openAddSidebar = () => {
    setEditBrand({ id: null, name: "", image: "", is_active: true });
    setSidebarVisible(true);
  };

  // Open Edit Brand Sidebar
  const openEditSidebar = (brand) => {
    setEditBrand(brand);
    setSidebarVisible(true);
  };

 // Save/Add Brand via API
const handleSave = async (e) => {
  e.preventDefault();
  setSaving(true);

  try {
    // Map front-end field to back-end expected field
    const payload = {
      name: editBrand.name,
      image: editBrand.image || null,
      isActive: editBrand.active,
    };

    const method = editBrand.id ? "PUT" : "POST";
    const url = editBrand.id
      ? `/api/v1/brands/${editBrand.id}`
      : "/api/v1/brands";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      // Prisma unique constraint error
      if (data.code === "P2002") {
        throw new Error("Brand name already exists");
      }
      throw new Error(data.message || "Failed to save brand");
    }

    toast.current.show({
      severity: "success",
      summary: editBrand.id ? "Updated" : "Added",
      detail: `Brand ${editBrand.id ? "updated" : "added"} successfully`,
      life: 3000,
    });

    setSidebarVisible(false);
    fetchBrands(); // Refresh the table
  } catch (err) {
    console.error("Error saving brand:", err);
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: err.message || "Failed to save brand",
      life: 3000,
    });
  } finally {
    setSaving(false);
  }
};

  // Delete Brand via API
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this brand?")) return;

    try {
      const res = await fetch(`/api/v1/brands/${editBrand.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete brand");

      toast.current.show({
        severity: "warn",
        summary: "Deleted",
        detail: "Brand deleted successfully",
        life: 3000,
      });

      setSidebarVisible(false);
      fetchBrands();
    } catch (err) {
      console.error(err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete brand",
        life: 3000,
      });
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#a4aeedff", color: "#fff", display: "flex", flexDirection: "column" }}>
      <Toast ref={toast} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", background: "#232946" }}>
        <h1 style={{ fontWeight: 700, fontSize: 28 }}>Brands</h1>
        <Button label="Add New Brand" icon="pi pi-plus" className="p-button-success" onClick={openAddSidebar} />
      </div>

      {/* Table */}
      <div style={{ flex: 1, padding: "2rem", background: "#232946" }}>
        {loading ? (
          <p>Loading brands...</p>
        ) : brands.length === 0 ? (
          <p>No brands found. Add a new brand.</p>
        ) : (
          <>
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
                      {brand.image ? <img src={brand.image} alt={brand.name} width={50} height={50} style={{ borderRadius: 8 }} /> : "No Image"}
                    </td>
                    <td style={{ padding: "10px" }}>{brand.name}</td>
                    <td style={{ padding: "10px" }}>{brand.is_active ? "Yes" : "No"}</td>
                    <td style={{ textAlign: "center", padding: "10px" }}>
                      <Button icon="pi pi-pencil" className="p-button-rounded p-button-info p-button-sm" onClick={() => openEditSidebar(brand)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
              <Button label="Prev" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)} className="p-button-text" />
              <span style={{ margin: "0 10px", alignSelf: "center" }}>Page {currentPage} of {totalPages || 1}</span>
              <Button label="Next" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage((prev) => prev + 1)} className="p-button-text" />
            </div>
          </>
        )}
      </div>

      {/* Sidebar (Add/Edit) */}
      <Sidebar visible={sidebarVisible} onHide={() => setSidebarVisible(false)} position="right" style={{ width: "30rem" }}>
        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }} onSubmit={handleSave}>
          <h2>{editBrand?.id ? "Edit Brand" : "Add New Brand"}</h2>

          <label>
            Brand Name:
            <input
              type="text"
              value={editBrand?.name || ""}
              onChange={(e) => setEditBrand({ ...editBrand, name: e.target.value })}
              required
              style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            />
          </label>

          <label>
            Brand Image URL:
            <input
              type="text"
              value={editBrand?.image || ""}
              onChange={(e) => setEditBrand({ ...editBrand, image: e.target.value })}
              placeholder="Paste image URL"
              style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            />
          </label>

          <label>
            Active:
            <select
              value={editBrand?.is_active ? "true" : "false"}
              onChange={(e) => setEditBrand({ ...editBrand, is_active: e.target.value === "true" })}
              style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </label>

          <Button type="submit" label={saving ? "Saving..." : "Save"} icon="pi pi-check" className="p-button-success" disabled={saving} />
          {editBrand?.id && <Button type="button" label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={handleDelete} />}
        </form>
      </Sidebar>
    </div>
  );
}
