"use client";
import { cars } from "./data";

export default function AdminCarsPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#a4aeedff",
        padding: "3rem 1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#fff",
      }}
    >
      <h1 style={{ marginBottom: 32, fontWeight: 700, fontSize: 32 }}>Manage Car Listings</h1>
      <div
        style={{
          width: "100%",
          maxWidth: 800,
          background: "#232946",
          borderRadius: 12,
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          padding: 24,
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
            <span>{car.name}</span>
            <div>
              <button
                style={{
                  marginRight: 8,
                  padding: "6px 12px",
                  background: "#4caf50",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
                onClick={() => alert(`Approved ${car.name}`)}
              >
                Approve
              </button>
              <button
                style={{
                  padding: "6px 12px",
                  background: "#f44336",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
                onClick={() => alert(`Removed ${car.name}`)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );  
}
