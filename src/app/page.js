// src/app/page.js
"use client";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import NavigationBar from "../components/NavigationBar";

export default function Dashboard() {
  const router = useRouter();

  const cards = [
    { title: "Users", icon: "pi pi-users", 
      description: "Manage all users of the platform.",
       url: "/users" },

    { title: "Admin",
       icon: "pi pi-shield",
        description: "Admin dashboard and controls.", 
        url: "/admin" },

    { title: "Hosters",
       icon: "pi pi-home",
        description: "Manage car hosters and their listings.",
         url: "/hosters" },

    { title: "Mechanic", 
      icon: "pi pi-wrench",
       description: "Mechanic management and service requests.",
        url: "/mechanic" },
        
  ];

  return (
    <NavigationBar>
      <div
        style={{
          minHeight: "100vh",
          background: "transparent",
          padding: "3rem 1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1 style={{ color: "#fff", marginBottom: 32, fontWeight: 700, fontSize: 32 }}>
          Car Rental Screens
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
                color: "#fefefeff",
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
              <p style={{ color: "#edf1f5ff", marginTop: 12 }}>{card.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </NavigationBar>
  );
}
