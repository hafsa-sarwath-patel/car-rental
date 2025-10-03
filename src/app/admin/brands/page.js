"use client";

import { useEffect, useState, useRef } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { Message } from "primereact/message";
import { Paginator } from "primereact/paginator";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { ProgressSpinner } from "primereact/progressspinner";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function AdminBrandsPage() {
  const[isclient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const [brands, setBrands] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;
  const toast = useRef(null);

  const indexOfFirst = currentPage * itemsPerPage;
  const indexOfLast = indexOfFirst + itemsPerPage;
  const currentBrands = brands.slice(indexOfFirst, indexOfLast);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/brands");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch brands");
      setBrands(data);
    } catch (err) {
      console.error(err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Failed to fetch brands",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const openAddSidebar = () => {
    setEditBrand({ id: null, name: "", image: "", isActive: true });
    setSidebarVisible(true);
  };

  const openEditSidebar = (brand) => {
    setEditBrand({ ...brand, isActive: brand.isActive ?? true });
    setSidebarVisible(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editBrand) return;

    setSaving(true);
    const payload = {
      name: editBrand.name,
      image: editBrand.image || null,
      isActive: editBrand.isActive,
    };

    const method = editBrand.id ? "PUT" : "POST";
    const url = editBrand.id ? `/api/v1/brands/${editBrand.id}` : "/api/v1/brands";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === "P2002") throw new Error("Brand name already exists");
        throw new Error(data.message || "Failed to save brand");
      }

      toast.current.show({
        severity: "success",
        summary: editBrand.id ? "Updated" : "Added",
        detail: `Brand ${editBrand.id ? "updated" : "added"} successfully`,
        life: 3000,
      });

      if (editBrand.id) {
        setBrands((prev) =>
          prev.map((b) => (b.id === editBrand.id ? { ...b, ...payload } : b))
        );
      } else {
        setBrands((prev) => [...prev, { id: data.id, ...payload }]);
      }

      setSidebarVisible(false);
    } catch (err) {
      console.error(err);
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

  const handleDelete = async () => {
    if (!editBrand?.id) return;
    try {
      const res = await fetch(`/api/v1/brands/${editBrand.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete brand");

      toast.current.show({
        severity: "warn",
        summary: "Deleted",
        detail: "Brand deleted successfully",
        life: 3000,
      });

      setBrands((prev) => prev.filter((b) => b.id !== editBrand.id));   
      setSidebarVisible(false);
    } catch (err) {
      console.error(err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Failed to delete brand",
        life: 3000,
      });
    }
  };

  const confirmDelete = () => {
    confirmDialog({
      message: "Are you sure you want to delete this brand?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: handleDelete,
    });
  };

  const activeOptions = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#1e1e2f", color: "#f5f5f5" }} className="p-d-flex p-flex-column">
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* Header */}
      <div className="p-d-flex p-jc-between p-ai-center p-p-3" style={{ background: "#232946", color: "#f5f5f5" }}>
        <h1 style={{ fontWeight: 700, fontSize: 28 }}>Brands</h1>
        <Button label="Add New Brand" icon="pi pi-plus" className="p-button-success" style={{ color: "#fff" }} onClick={openAddSidebar} />
      </div>

      {/* DataTable */}
      <div className="p-p-3" style={{ flex: 1, background: "#232946" }}>
        {loading ? (
          <div className="p-d-flex p-jc-center p-ai-center" style={{ height: "100%" }}>
            <ProgressSpinner />
          </div>
        ) : brands.length === 0 ? (
          <Message severity="warn" text="No brands found. Add a new brand." />
        ) : (
          <>
            <DataTable value={currentBrands} stripedRows  dataKey="id" style={{ color: "#f5f5f5" }}>
              <Column
                header="Image"
                body={(brand) =>
                  brand.image ? (
                    <img src={brand.image} alt={brand.name} width={50} height={50} style={{ borderRadius: 8 }} />
                  ) : (
                    <Tag value="No Image" severity="danger" />
                  )
                }
              />
              <Column field="name" header="Name" />
              <Column field="isActive" header="Active" body={(brand) => (brand.isActive ? "Yes" : "No")} />
              <Column
                header="Action"
                body={(brand) => (
                  <Button icon="pi pi-pencil" className="p-button-rounded p-button-info p-button-sm" onClick={() => openEditSidebar(brand)} />
                )}
              />
            </DataTable>

            <Paginator
              first={indexOfFirst}
              rows={itemsPerPage}
              totalRecords={brands.length}
              onPageChange={(e) => setCurrentPage(e.page)}
              template="PrevPageLink PageLinks NextPageLink"
              className="p-mt-3"
            />
          </>
        )}
      </div>

      {/* Sidebar */}
      <Sidebar visible={sidebarVisible} onHide={() => setSidebarVisible(false)} position="right" style={{ width: "30rem" }}>
        <div className="p-d-flex p-flex-column p-p-4 h-full" style={{ position: "relative" }}>
          <div className="p-d-flex p-jc-between p-ai-center p-mb-4">
            <h2 className="p-m-0">{editBrand?.id ? "Edit Brand" : "Add New Brand"}</h2>
            <Button icon="pi pi-times" className="p-button-rounded p-button-text" onClick={() => setSidebarVisible(false)} />
          </div>

          <form className="p-d-flex p-flex-column p-gap-4 flex-grow-1" onSubmit={handleSave}>
            {saving && (
              <div className="p-d-flex p-jc-center p-ai-center" style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.3)",
                zIndex: 10,
                pointerEvents: "none"
              }}>
                <ProgressSpinner />
              </div>
            )}

            <span className="p-float-label">
              <InputText id="brandName" value={editBrand?.name || ""} onChange={(e) => setEditBrand({ ...editBrand, name: e.target.value })} required />
              <label htmlFor="brandName">Brand Name</label>
            </span>

            <span className="p-float-label">
              <InputText
                id="brandImage"
                type="url"
                pattern="https?://.+"
                value={editBrand?.image || ""}
                onChange={(e) => setEditBrand({ ...editBrand, image: e.target.value })}
              />
              <label htmlFor="brandImage">Brand Image URL</label>
            </span>

            <Dropdown value={editBrand?.isActive ?? true} options={activeOptions} onChange={(e) => setEditBrand({ ...editBrand, isActive: e.value })} optionLabel="label" placeholder="Active" style={{ width: "100%" }} />

            <div className="p-d-flex p-flex-column p-gap-3 p-mt-4">
              <Button type="submit" label={saving ? "Saving..." : "Save"} icon="pi pi-check" className="p-button-primary" disabled={saving} />
              {editBrand?.id && <Button type="button" label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDelete} />}
            </div>
          </form>
        </div>
      </Sidebar>
    </div>
  );
}
