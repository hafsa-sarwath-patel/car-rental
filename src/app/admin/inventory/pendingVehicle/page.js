"use client";

import { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function PendingVehiclePage() {
  const [vehicles, setVehicles] = useState([
    { id: 1, name: "Hyundai i20", brand: "Hyundai", status: "Pending", regdNo: "MH12AB1234" },
    { id: 2, name: "Maruti Swift", brand: "Maruti", status: "Pending" },
    { id: 3, name: "Tata Nexon", brand: "Tata", status: "Pending" },
    { id: 4, name: "Kia Seltos", brand: "Kia", status: "Pending" },
    { id: 5, name: "Honda City", brand: "Honda", status: "Pending" },
  ]);

  const approveVehicle = (vehicle) => {
    alert(`Approved Vehicle: ${vehicle.name}`);
    setVehicles(vehicles.filter((v) => v.id !== vehicle.id));
  };

  return (
    <div>
      <h2 style={{ marginBottom: "1rem" }}>Pending Vehicles</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {vehicles.map((vehicle) => (
          <Card
            key={vehicle.id}
            title={vehicle.name}
            subTitle={vehicle.brand}
            className="shadow-2"
            style={{
              minHeight: "200px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRadius: "10px",
            }}
            footer={
              <Button
                label="Approve"
                icon="pi pi-check"
                className="p-button-success w-full"
                onClick={() => approveVehicle(vehicle)}
              />
            }
          >
            <p>Status: <strong>{vehicle.status}</strong></p>
          </Card>
        ))}
      </div>
    </div>
  );
}
