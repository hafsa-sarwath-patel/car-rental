"use client";

import { useState, useRef } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function SettingsPage() {
  const [settings, setSettings] = useState([
    { id: 1, name: "Site Title", value: "My App", datatype: "String" },
    { id: 2, name: "Max Users", value: "100", datatype: "Number" },
    { id: 3, name: "Enable Feature X", value: "true", datatype: "Boolean" },
  ]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [editSetting, setEditSetting] = useState(null);
  const toast = useRef(null);

  const openAddSidebar = () => {
    setEditSetting({ id: null, name: "", value: "", datatype: "" });
    setSidebarVisible(true);
  };

  const openEditSidebar = (setting) => {
    setEditSetting(setting);
    setSidebarVisible(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editSetting.id) {
      setSettings((prev) =>
        prev.map((s) => (s.id === editSetting.id ? editSetting : s))
      );
      toast.current.show({ severity: "success", summary: "Updated", detail: "Setting updated successfully" });
    } else {
      const newSetting = { ...editSetting, id: Date.now() };
      setSettings((prev) => [...prev, newSetting]);
      toast.current.show({ severity: "success", summary: "Added", detail: "Setting added successfully" });
    }
    setSidebarVisible(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#a4aeedff", display: "flex", flexDirection: "column", color: "#fff" }}>
      <Toast ref={toast} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", background: "#232946" }}>
        <h1 style={{ fontWeight: 700, fontSize: 28 }}>Settings</h1>
        <Button label="Add New Setting" icon="pi pi-plus" className="p-button-success" onClick={openAddSidebar} />
      </div>

      {/* Table */}
      <div style={{ flex: 1, padding: "2rem", background: "#232946" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #444" }}>
              <th style={{ textAlign: "left", padding: "10px" }}>Name</th>
              <th style={{ textAlign: "left", padding: "10px" }}>Value</th>
              <th style={{ textAlign: "left", padding: "10px" }}>Datatype</th>
              <th style={{ textAlign: "center", padding: "10px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((setting) => (
              <tr key={setting.id} style={{ borderBottom: "1px solid #444" }}>
                <td style={{ padding: "10px" }}>{setting.name}</td>
                <td style={{ padding: "10px" }}>{setting.value}</td>
                <td style={{ padding: "10px" }}>{setting.datatype}</td>
                <td style={{ textAlign: "center", padding: "10px" }}>
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-info p-button-sm"
                    onClick={() => openEditSidebar(setting)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sidebar */}
      <Sidebar visible={sidebarVisible} onHide={() => setSidebarVisible(false)} position="right" style={{ width: "30rem" }}>
        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }} onSubmit={handleSave}>
          <h2>{editSetting?.id ? "Edit Setting" : "Add New Setting"}</h2>
          <label>
            Name:
            <input
              type="text"
              value={editSetting?.name || ""}
              onChange={(e) => setEditSetting({ ...editSetting, name: e.target.value })}
              required
              style={{ width: "100%", padding: "8px", borderRadius: 4, border: "1px solid #ccc", marginTop: 4 }}
            />
          </label>
          <label>
            Value:
            <input
              type="text"
              value={editSetting?.value || ""}
              onChange={(e) => setEditSetting({ ...editSetting, value: e.target.value })}
              required
              style={{ width: "100%", padding: "8px", borderRadius: 4, border: "1px solid #ccc", marginTop: 4 }}
            />
          </label>
          <label>
            Datatype:
            <select
              value={editSetting?.datatype || ""}
              onChange={(e) => setEditSetting({ ...editSetting, datatype: e.target.value })}
              required
              style={{ width: "100%", padding: "8px", borderRadius: 4, border: "1px solid #ccc", marginTop: 4 }}
            >
              <option value="" disabled>Select Datatype</option>
              <option value="String">String</option>
              <option value="Number">Number</option>
              <option value="Boolean">Boolean</option>
              <option value="Date">Date</option>
            </select>
          </label>
          <Button type="submit" label="Save" icon="pi pi-check" className="p-button-success" />
        </form>
      </Sidebar>
    </div>
  );
}
