"use client";
import { useState, useRef } from "react";
import { cars as initialCars } from "./data";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function AdminCarsPage() {
  const [cars, setCars] = useState(initialCars);
  const [editVisible, setEditVisible] = useState(false);
  const [editCar, setEditCar] = useState(null);
  const toast = useRef(null);

  // Edit existing car
  const handleEdit = (car) => {
    setEditCar(car);
    setEditVisible(true);
  };

  // Add new car
  const handleAddNew = () => {
    setEditCar({ id: null, name: "", model: "", price: "", logo: "" });
    setEditVisible(true);
  };

  // Save car (new or existing)
  const handleSave = (e) => {
    e.preventDefault();

    if (editCar.id) {
      setCars((prev) => prev.map((c) => (c.id === editCar.id ? editCar : c)));
      toast.current.show({
        severity: "success",
        summary: "Updated",
        detail: "Car updated successfully",
        life: 3000,
      });
    } else {
      const newCar = { ...editCar, id: Date.now() };
      setCars((prev) => [...prev, newCar]);
      toast.current.show({
        severity: "success",
        summary: "Added",
        detail: "New car added successfully",
        life: 3000,
      });
    }

    setEditVisible(false);
  };

  // Remove car
  const handleRemove = (carId) => {
    setCars((prev) => prev.filter((c) => c.id !== carId));
    toast.current.show({
      severity: "warn",
      summary: "Deleted",
      detail: "Car removed successfully",
      life: 3000,
    });
  };

  // Handle Logo Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditCar({ ...editCar, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
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
        <h1 style={{ fontWeight: 700, fontSize: 28 }}>Manage Car Listings</h1>
        <Button
          label="Add New Car"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={handleAddNew}
        />
      </div>

      {/* Car List */}
      <div
        style={{
          flex: 1,
          width: "100%",
          background: "#232946",
          padding: "2rem",
          boxSizing: "border-box",
        }}
      >
        {cars.map((car) => (
          <div
            key={car.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: "1px solid #444",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {car.logo && (
                <img
                  src={car.logo}
                  alt={car.name}
                  style={{ width: 80, height: 80, borderRadius: "50%" }}
                />
              )}
              <span>{car.name}</span>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <Button
                label="Edit"
                icon="pi pi-pencil"
                className="p-button-sm p-button-info"
                onClick={() => handleEdit(car)}
              />
              <button
                style={{
                  padding: "6px 12px",
                  background: "#f44336",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
                onClick={() => handleRemove(car.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar for Add/Edit */}
      <Sidebar
        visible={editVisible}
        onHide={() => setEditVisible(false)}
        position="right"
        style={{ width: "30rem" }}
      >
        <form
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          onSubmit={handleSave}
        >
          <h2>{editCar?.id ? `Edit Car: ${editCar.name}` : "Add New Car"}</h2>

          <label>
            Car Name:
            <input
              type="text"
              value={editCar?.name || ""}
              onChange={(e) =>
                setEditCar({ ...editCar, name: e.target.value })
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: 4,
                border: "1px solid #ccc",
                marginTop: 4,
              }}
              required
            />
          </label>

          <label>
            Model:
            <input
              type="text"
              value={editCar?.model || ""}
              onChange={(e) =>
                setEditCar({ ...editCar, model: e.target.value })
              }
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
            Price:
            <input
              type="number"
              value={editCar?.price || ""}
              onChange={(e) =>
                setEditCar({ ...editCar, price: e.target.value })
              }
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
            Car Logo:
            <input type="file" accept="image/*" onChange={handleLogoUpload} />
            {editCar?.logo && (
              <img
                src={editCar.logo}
                alt="Preview"
                style={{ marginTop: 10 }}
              />
            )}
          </label>

          <Button
            type="submit"
            label="Save"
            icon="pi pi-check"
            className="p-button-success"
            style={{ alignSelf: "flex-start" }}
          />
        </form>
      </Sidebar>
    </div>
  );
}
