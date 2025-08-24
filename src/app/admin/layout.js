"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-blue/theme.css"; // Theme (can be any)
import "primereact/resources/primereact.min.css"; // PrimeReact core styles
import "primeicons/primeicons.css";//layout.js
 

export default function AdminLayout({ children }) {
  const [visible, setVisible] = useState(false);
   const router = useRouter();

  const navigateTo = (path) => {
    setVisible(false); // close sidebar when navigating
    router.push(path);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#2c3e50",
          padding: "1rem",
          color: "#fff",
        }}
      >
        {/* Left - Hamburger Button */}
        <Button
          icon="pi pi-bars"
          className="p-button-text p-button-plain"
          onClick={() => setVisible(true)}
        />

        {/* Right - Logout Button */}
        <Button
          label="Logout"
          icon="pi pi-sign-out"
          className="p-button-danger"
          onClick={() => alert("Logging out...")}
        />
      </header>

      {/* Sidebar */}
      <Sidebar visible={visible} onHide={() => setVisible(false)} position="left">
        <h2>Menu</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
 <li>
            <Button
              label="Dashboard"
              className="p-button-text"
              onClick={() => navigateTo("/admin/dashboard")}
            />
          </li>
          <li>
            <Button
           label="Users"
            className="p-button-text" 
            onClick={() => navigateTo("/admin/users")}
            />
            </li>
     

             <li>
            <Button label="cars"
              className="p-button-text" 
              onClick={() => navigateTo("/admin/cars")}
              />
             </li>
             <li>
            
            <Button label="Bookings"
              className="p-button-text" 
              onClick={() => navigateTo("/admin/bookings")}
              />
</li>
 <li>
            <Button
              label="states"
              className="p-button-text"
              onClick={() => navigateTo("/admin/states")}
            />
          </li>
   <li>
            <Button label="Settings"
             className="p-button-text"
             onClick={() => navigateTo("/admin/settings")}
             />
             </li>
        </ul>
      </Sidebar>

      {/* Main Content */}
      <main style={{ padding: "2rem" }}>{children}</main>
    </div>
  );
}                                    