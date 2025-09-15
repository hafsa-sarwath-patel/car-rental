"use client";

import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState({
    users: 0,
    brands: 0,
    bookings: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, brandsRes, bookingsRes] = await Promise.all([
          fetch("/api/v1/users"),
          fetch("/api/v1/brands"),
          fetch("/api/v1/bookings"),
        ]);

        const [users, brands, bookings] = await Promise.all([
          usersRes.json(),
          brandsRes.json(),
          bookingsRes.json(),
        ]);

        setStats({
          users: users.length,
          brands: brands.length,
          bookings: bookings.length,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Users",
      icon: "pi pi-users",
      total: stats.users,
      url: "/admin/users",
    },
    {
      title: "Brands",
      icon: "pi pi-car",
      total: stats.brands,
      url: "/admin/brands",
    },
    {
      title: "Bookings",
      icon: "pi pi-calendar",
      total: stats.bookings,
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
