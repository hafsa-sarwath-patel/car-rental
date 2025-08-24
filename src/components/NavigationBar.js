// src/components/NavigationBar.js
"use client";

import "primereact/resources/themes/lara-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { TabMenu } from "primereact/tabmenu";
import { useRouter, usePathname } from "next/navigation";

export default function NavigationBar({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    { label: "Dashboard", icon: "pi pi-th-large", command: () => router.push("/") },
    { label: "Users", icon: "pi pi-users", command: () => router.push("/users") },
    { label: "Admin", icon: "pi pi-shield", command: () => router.push("/admin") },
    { label: "Hosters", icon: "pi pi-home", command: () => router.push("/hosters") },
    { label: "Mechanic", icon: "pi pi-wrench", command: () => router.push("/mechanic") },
  ];

  const activeIndex = items.findIndex((item) => {
    switch (item.label) {
      case "Dashboard":
        return pathname === "/";
      case "Users":
        return pathname.startsWith("/users");
      case "Admin":
        return pathname.startsWith("/admin");
      case "Hosters":
        return pathname.startsWith("/hosters");
      case "Mechanic":
        return pathname.startsWith("/mechanic");
      default:
        return false;
    }
  });

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Top Navigation Bar */}
      <div
        style={{
          background: "#232946",
          padding: "0 2rem",
          borderBottom: "1px solid #22223b",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", height: 64 }}>
          <TabMenu
            model={items}
            activeIndex={activeIndex === -1 ? 0 : activeIndex}
            style={{ background: "transparent", border: "none", color: "#fff", flex: 1 }}
            pt={{
              menu: { style: { background: "transparent", border: "none" } },
              menuitem: { style: { color: "#fff" } },
              action: { style: { color: "#fff" } },
              inkbar: { style: { background: "#2a5298" } },
            }}
          />
        </div>
      </div>

      {/* Page Content */}
      <main style={{ padding: "2rem", color: "#fff" }}>{children}</main>
    </div>
  );
}
