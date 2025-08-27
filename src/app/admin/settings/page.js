"use client";

import { useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // General Settings State
  const [siteName, setSiteName] = useState("My Admin Panel");
  const [logoUrl, setLogoUrl] = useState("");

  // Security Settings State
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  // API Keys Data
  const [apiKeys, setApiKeys] = useState([
    { id: 1, key: "abcd-1234-xyz", createdAt: "2025-08-01" },
    { id: 2, key: "efgh-5678-wxy", createdAt: "2025-08-10" },
  ]);

  // Logs Data
  const logs = [
    { id: 1, action: "User Admin logged in", date: "2025-08-18" },
    { id: 2, action: "API Key created", date: "2025-08-15" },
    { id: 3, action: "Password policy updated", date: "2025-08-10" },
  ];

  // Add new API key (Dummy)
  const addApiKey = () => {
    const newKey = { id: Date.now(), key: "newkey-" + Date.now(), createdAt: new Date().toISOString().split("T")[0] };
    setApiKeys([...apiKeys, newKey]);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f6fa" }}>
      {/* Sidebar Navigation */}
      <div style={{ width: "250px", background: "#232946", color: "#fff", padding: "1rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Settings</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ margin: "10px 0", cursor: "pointer", color: activeTab === "general" ? "#4CAF50" : "#fff" }}
              onClick={() => setActiveTab("general")}>General</li>
          <li style={{ margin: "10px 0", cursor: "pointer", color: activeTab === "security" ? "#4CAF50" : "#fff" }}
              onClick={() => setActiveTab("security")}>Security</li>
          <li style={{ margin: "10px 0", cursor: "pointer", color: activeTab === "api" ? "#4CAF50" : "#fff" }}
              onClick={() => setActiveTab("api")}>API Keys</li>
          <li style={{ margin: "10px 0", cursor: "pointer", color: activeTab === "logs" ? "#4CAF50" : "#fff" }}
              onClick={() => setActiveTab("logs")}>Logs</li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "2rem" }}>
        {activeTab === "general" && (
          <div>
            <h1>General Settings</h1>
            <div style={{ marginBottom: "1rem" }}>
              <label>Site Name</label>
              <InputText value={siteName} onChange={(e) => setSiteName(e.target.value)} className="p-inputtext-sm" />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label>Logo URL</label>
              <InputText value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="p-inputtext-sm" />
            </div>
            <Button label="Save Changes" icon="pi pi-check" className="p-button-success" />
          </div>
        )}

        {activeTab === "security" && (
          <div>
            <h1>Security Settings</h1>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ flex: 1 }}>Maintenance Mode</span>
              <InputSwitch checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.value)} />
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ flex: 1 }}>Two-Factor Authentication</span>
              <InputSwitch checked={twoFactorAuth} onChange={(e) => setTwoFactorAuth(e.value)} />
            </div>
            <Button label="Save Security Settings" icon="pi pi-shield" className="p-button-primary" />
          </div>
        )}

        {activeTab === "api" && (
          <div>
            <h1>API Keys</h1>
            <Button label="Generate New API Key" icon="pi pi-plus" className="p-button-success mb-3" onClick={addApiKey} />
            <DataTable value={apiKeys} responsiveLayout="scroll">
              <Column field="key" header="API Key"></Column>
              <Column field="createdAt" header="Created At"></Column>
            </DataTable>
          </div>
        )}

        {activeTab === "logs" && (
          <div>
            <h1>System Logs</h1>
            <ul>
              {logs.map((log) => (
                <li key={log.id}>{log.date} - {log.action}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Sidebar Example for Future (e.g., Edit API Key) */}
      <Sidebar visible={sidebarVisible} onHide={() => setSidebarVisible(false)} position="right" style={{ width: "30rem" }}>
        <h2>Sidebar Action</h2>
        <p>Use this for editing API keys, advanced settings, etc.</p>
      </Sidebar>
    </div>
  );
}
