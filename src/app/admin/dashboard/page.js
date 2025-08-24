"use client";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { cars } from "../cars/data";
import { users } from "../users/page";

export default function AdminDashboard() {
  const router = useRouter();

  const cards = [
    {
      title: "Users",
      icon: "pi pi-users",
      total: users.length,  // Count from users file
      url: "/admin/users",
    },
    {
      title: "Cars",
      icon: "pi pi-car",
      total: cars.length, // Count from cars file
      url: "/admin/cars",
    },
    {
      title: "Bookings",
      icon: "pi pi-calendar",
      total: 0, // You can create `bookings/data.js` later
      url: "/admin/bookings",
    },
    {
      title: "Settings",
      icon: "pi pi-cog",
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
              padding: "1rem",
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
            <h2 style={{ fontSize: 24, margin: "1rem 0", color: "#fff" }}>
              Total: {card.total}
            </h2>
          </Card>
        ))}
      </div>
    </div>
  );
}
