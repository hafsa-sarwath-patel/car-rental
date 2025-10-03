"use client";

import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { ProgressBar } from "primereact/progressbar";
import { FloatLabel } from "primereact/floatlabel";
import { Card } from "primereact/card";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function AdminUsersPage() {
  const toast = useRef(null);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [formUser, setFormUser] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
    filters: {
      global: { value: null, matchMode: "contains" },
      name: { value: null, matchMode: "contains" },
      username: { value: null, matchMode: "contains" },
      email: { value: null, matchMode: "contains" },
      role: { value: null, matchMode: "in" },
      isAvailable: { value: null, matchMode: "equals" },
    },
  });

  const currentUserRole = "ADMIN";

  const roleOptions = ["ADMIN", "USER", "DRIVER", "MECHANIC", "PROVIDER", "CUSTOMER"].map(
    (r) => ({ label: r, value: r })
  );

  const statusOptions = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 3000 });
  };

  /** Load users from API */
  const loadUsers = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: lazyParams.page,
        limit: lazyParams.rows,
        sortField: lazyParams.sortField || "",
        sortOrder: lazyParams.sortOrder || "",
        filters: JSON.stringify(lazyParams.filters),
      }).toString();

      const res = await fetch(`/api/v1/users?${query}`, { cache: "no-store" });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Load failed");

      setUsers(json.data);
      setTotalRecords(json.meta.total);
    } catch (err) {
      showToast("error", "Fetch Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lazyParams]);

  /** Save or update user */
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const method = formUser?.id ? "PUT" : "POST";
    const url = formUser?.id ? `/api/v1/users/${formUser.id}` : `/api/v1/users`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formUser),
      });
      if (!res.ok) throw new Error(`${method} failed`);

      showToast(
        "success",
        "Success",
        formUser?.id ? "User updated successfully" : "User added successfully"
      );

      setFormVisible(false);
      setFormUser(null);
      loadUsers();
    } catch (err) {
      showToast("error", "Save Failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  /** Actions column */
  const actionTemplate = (row) => {
    return (
      <div className="flex gap-2 justify-center">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-info p-button-sm"
          onClick={() => {
            setFormUser({ ...row, password: "" });
            setFormVisible(true);
          }}
        />
      </div>
    );
  };

  /** Sidebar Form */
  const SidebarForm = (
    <Sidebar
      visible={formVisible}
      onHide={() => setFormVisible(false)}
      position="right"
      style={{ width: "28rem" }}
      header={formUser?.id ? "Edit User" : "Add User"}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSave}>
        <FloatLabel>
          <InputText
            value={formUser?.name ?? ""}
            onChange={(e) => setFormUser({ ...formUser, name: e.target.value })}
            required
            className="w-full"
          />
          <label>Name</label>
        </FloatLabel>

        <FloatLabel>
          <InputText
            value={formUser?.username ?? ""}
            onChange={(e) => setFormUser({ ...formUser, username: e.target.value })}
            required
            className="w-full"
          />
          <label>Username</label>
        </FloatLabel>

        <FloatLabel>
          <InputText
            type="email"
            value={formUser?.email ?? ""}
            onChange={(e) => setFormUser({ ...formUser, email: e.target.value })}
            className="w-full"
          />
          <label>Email (optional)</label>
        </FloatLabel>

        <FloatLabel>
          <InputText
            type="password"
            value={formUser?.password ?? ""}
            onChange={(e) => setFormUser({ ...formUser, password: e.target.value })}
            required={!formUser?.id}
            className="w-full"
          />
          <label>Password {formUser?.id ? "(leave blank to keep)" : ""}</label>
        </FloatLabel>

        <FloatLabel>
          <Dropdown
            value={formUser?.role ?? ""}
            options={roleOptions}
            onChange={(e) => setFormUser({ ...formUser, role: e.value })}
            required
            className="w-full"
          />
          <label>Role</label>
        </FloatLabel>

        <FloatLabel>
          <Dropdown
            value={formUser?.isAvailable}
            options={statusOptions}
            onChange={(e) => setFormUser({ ...formUser, isAvailable: e.value })}
            optionLabel="label"
            optionValue="value"
            className="w-full"
          />
          <label>Status</label>
        </FloatLabel>

        <Button
          type="submit"
          label={saving ? "Saving..." : "Save"}
          icon="pi pi-check"
          className="p-button-success"
          disabled={saving}
        />
      </form>
    </Sidebar>
  );

  // Derived counts from current page
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isAvailable).length;
  const inactiveUsers = totalUsers - activeUsers;

  return (
    <div className="p-6">
      <Toast ref={toast} />
      {loading && <ProgressBar mode="indeterminate" style={{ height: "4px" }} className="mb-3" />}

      {/* Manage Users + Summary Card */}
      <Card className="shadow-2 mb-6">
        <div className="flex flex-wrap justify-between items-center gap-6">
          <h2 className="text-xl font-semibold">Manage Users</h2>

          <Button
            label="Add User"
            icon="pi pi-plus"
            className="p-button-success p-button-rounded"
            onClick={() => {
              setFormUser({ name: "", username: "", email: "", password: "", role: "", isAvailable: true });
              setFormVisible(true);
            }}
          />

          <div className="flex gap-8 text-center">
            <div>
              <h3 className="text-sm font-semibold">Total</h3>
              <p className="text-lg">{totalRecords}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Active</h3>
              <p className="text-lg text-green-600">{activeUsers}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Inactive</h3>
              <p className="text-lg text-red-600">{inactiveUsers}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                value={globalFilterValue}
                onChange={(e) => {
                  const value = e.target.value;
                  const _filters = { ...lazyParams.filters, global: { ...lazyParams.filters.global, value } };
                  setLazyParams({ ...lazyParams, filters: _filters, page: 1, first: 0 });
                  setGlobalFilterValue(value);
                }}
                placeholder="Keyword Search"
              />
            </span>
          </div>
        </div>
      </Card>

      <div className="p-card p-shadow-2">
        <DataTable
          value={users}
          paginator
          lazy
          totalRecords={totalRecords}
          loading={loading}
          first={lazyParams.first}
          rows={lazyParams.rows}
          sortField={lazyParams.sortField}
          sortOrder={lazyParams.sortOrder}
          onPage={(e) => setLazyParams({ ...lazyParams, first: e.first, rows: e.rows, page: e.page + 1 })}
          onSort={(e) => setLazyParams({ ...lazyParams, sortField: e.sortField, sortOrder: e.sortOrder })}
          filters={lazyParams.filters}
          onFilter={(e) => setLazyParams({ ...lazyParams, filters: e.filters, page: 1, first: 0 })}
          globalFilterFields={["name", "username", "email", "role"]}
          stripedRows
          className="rounded-2xl"
          emptyMessage="No users found."
        >
          <Column field="name" header="Name" sortable filter filterPlaceholder="Search name" />
          <Column field="username" header="Username" sortable filter filterPlaceholder="Search username" />
          <Column field="email" header="Email" sortable filter filterPlaceholder="Search email" />
          <Column
            field="role"
            header="Role"
            sortable
            filter
            showFilterMenu={false}
            filterElement={(opts) => (
              <MultiSelect
                value={opts.value}
                options={roleOptions}
                onChange={(e) => opts.filterApplyCallback(e.value)}
                placeholder="Select Roles"
                showClear
                className="w-full"
              />
            )}
          />
          <Column
            field="isAvailable"
            header="Status"
            body={(row) => (row.isAvailable ? "Active" : "Inactive")}
            sortable
            filter
            showFilterMenu={false}
            filterElement={(opts) => (
              <Dropdown
                value={opts.value}
                options={statusOptions}
                onChange={(e) => opts.filterApplyCallback(e.value)}
                placeholder="Select Status"
                showClear
                className="w-full"
              />
            )}
          />
          <Column body={actionTemplate} header="Actions" style={{ width: "8rem", textAlign: "center" }} />
        </DataTable>
      </div>

      {SidebarForm}
    </div>
  );
}
