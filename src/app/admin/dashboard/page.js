"use client";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const cards = [
    {
      title: "User Management",
      icon: "pi pi-users",
      description: "View and manage all users.",
      url: "/admin/users",
    },
    {
      title: "Car Listings",
      icon: "pi pi-car",
      description: "Approve or remove car listings.",
      url: "/admin/cars",
    },
    {
      title: "Bookings",
      icon: "pi pi-calendar",
      description: "Monitor and manage bookings.",
      url: "/admin/bookings",
    },
    {
      title: "settings",
      icon: "pi pi-chart-bar",
      description: "settings and configurations.",
      url: "/admin/settings",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#a4aeedff",
        padding: "3rem 1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ color: "#fff", marginBottom: 32, fontWeight: 700, fontSize: 32 }}>
        Admin Dashboard
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "2rem",
          width: "100%",
          maxWidth: 1000,
        }}
      >
        {cards.map((card) => (
          <Card
            key={card.title}
            title={
              <span style={{ color: "#2a5298", fontWeight: 600 }}>
                <i className={card.icon} style={{ marginRight: 10 }} />
                {card.title}
              </span>
            }
            style={{
              background: "#232946",
              color: "#fff",
              borderRadius: 12,
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
              border: "none",
              minHeight: 200,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            footer={
              <Button
                label="Go"
                icon="pi pi-arrow-right"
                className="p-button-sm"
                style={{
                  background: "linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)",
                  border: "none",
                  color: "#fff",
                  fontWeight: 600,
                  marginTop: 16,
                }}
                onClick={() => router.push(card.url)}
              />
            }
          >
            <p style={{ color: "#b0b8c1", marginTop: 12 }}>{card.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}