"use client";

import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState({
    users: 0,
    brands: 0,
    bookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const endpoints = ["/api/v1/users", "/api/v1/brands", "/api/v1/bookings"];

        const results = await Promise.all(
          endpoints.map(async (url) => {
            try {
              const res = await fetch(url);
              if (!res.ok) return [];
              return await res.json().catch(() => []);
            } catch {
              return [];
            }
          })
        );

        const [users, brands, bookings] = results;

        setStats({
          users: Array.isArray(users) ? users.length : 0,
          brands: Array.isArray(brands) ? brands.length : 0,
          bookings: Array.isArray(bookings) ? bookings.length : 0,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const cards = [
    { title: "Users", icon: "pi pi-users", total: stats.users, url: "/admin/users" },
    { title: "Brands", icon: "pi pi-car", total: stats.brands, url: "/admin/brands" },
    { title: "Bookings", icon: "pi pi-calendar", total: stats.bookings, url: "/admin/bookings" },
    { title: "Settings", icon: "pi pi-cog", total: null, url: "/admin/settings" },
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

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <ProgressSpinner
            style={{ width: "50px", height: "50px" }}
            strokeWidth="6"
            animationDuration=".5s"
          />
          <p style={{ color: "#fff", fontSize: 18, marginTop: 16 }}>Loading stats...</p>
        </div>
      ) : (
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
              {card.total !== null ? (
                <h2 style={{ fontSize: 24, margin: "1rem 0", color: "#fff" }}>
                  Total: {card.total}
                </h2>
              ) : (
                <h2 style={{ fontSize: 24, margin: "1rem 0", color: "#fff" }}>—</h2>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
