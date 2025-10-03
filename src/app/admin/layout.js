"use client";

import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function AdminLayout({ children }) {
  const items = [
    {
      label: "Home",
      icon: "pi pi-home",
      url: "/admin/dashboard",
    },
    {
      label: "Admin",
      icon: "pi pi-cog",
      items: [
        { label: "Users", icon: "pi pi-users", url: "/admin/users" },
        { label: "brands", icon: "pi pi-car", url: "/admin/brands" },
        { label: "Models", icon: "pi pi-box", url: "/admin/models" },
        { label: "variants", icon: "pi pi-box", url: "/admin/variants" },
        { label: "States", icon: "pi pi-map-marker", url: "/admin/states" },
        { label: "Cities", icon: "pi pi-map-marker", url: "/admin/cities" },
        { label: "Checklist Category", icon: "pi pi-tags", url: "/admin/checkCategory" },
        { label: "Checklist Options", icon: "pi pi-list", url: "/admin/checklist-options" },
        { label: "Settings", icon: "pi pi-cog", url: "/admin/settings" },
      ],
    },
    {
      label: "Inventory",
      icon: "pi pi-folder",
      items: [
        { label: "pending vehicle", url: "/admin/inventory/pendingVehicle" },
        { label: "available vehicle", command: () => alert("Sample Inventory Item") },
      ],
    },
    { label: "Bookings", icon: "pi pi-calendar", url: "/admin/bookings" },
    { label: "Providers", icon: "pi pi-briefcase", command: () => alert("Providers Page") },
    { label: "Customers", icon: "pi pi-users", command: () => alert("Customers Page") },
    { label: "Reports", icon: "pi pi-chart-line", command: () => alert("Reports Page") },
  ];

  const end = (
    <Button
      label="Logout"
      icon="pi pi-sign-out"
      className="p-button-danger"
      onClick={() => alert("Logging out...")}
    />
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Menubar model={items} end={end} />
      <main style={{ padding: "2rem" }}>{children}</main>
    </div>
  );
}
