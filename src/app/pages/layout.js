"use client";

import "primereact/resources/themes/lara-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { TabMenu } from "primereact/tabmenu";
import { useRouter, usePathname } from "next/navigation";

export default function Layout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    {
      label: "Users",
      icon: "pi pi-users",
      command: () => router.push("/pages/users"),
      url: "/pages/users",
    },
    {
      label: "Cars",
      icon: "pi pi-car",
      command: () => router.push("/pages/cars"),
      url: "/pages/cars",
    },
    {
      label: "Contact",
      icon: "pi pi-envelope",
      command: () => router.push("/pages/contact"),
      url: "/pages/contact",
    },
    {
      label: "About",
      icon: "pi pi-info-circle",
      command: () => router.push("/pages/about"),
      url: "/pages/about",
    },
  ];

  // Find the active tab index based on the current path
  const activeIndex = items.findIndex((item) => pathname === item.url);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#181c32" }}>
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
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                flex: 1,
              }}
              pt={{
                menu: { style: { background: "transparent", border: "none" } },
                menuitem: { style: { color: "#fff" } },
                action: { style: { color: "#fff" } },
                inkbar: { style: { background: "#2a5298" } },
              }}
            />
          </div>
        </div>
        <main style={{ padding: "2rem", color: "#fff" }}>{children}</main>
      </body>
    </html>
  );
}