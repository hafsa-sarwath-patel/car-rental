"use client";

import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { ProgressBar } from "primereact/progressbar";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function AdminBookingPage() {
  const toast = useRef(null);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
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
    },
  });

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 3000 });
  };

  /** Load bookings from API */
  const loadBookings = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API endpoint when booking API is ready
      // const query = new URLSearchParams({
      //   page: lazyParams.page,
      //   limit: lazyParams.rows,
      //   sortField: lazyParams.sortField || "",
      //   sortOrder: lazyParams.sortOrder || "",
      //   filters: JSON.stringify(lazyParams.filters),
      // }).toString();

      // const res = await fetch(`/api/v1/bookings?${query}`, { cache: "no-store" });
      // const json = await res.json();

      // if (!res.ok) throw new Error(json.error || "Load failed");

      // setBookings(json.data);
      // setTotalRecords(json.meta.total);

      // Temporary: Set empty data
      setBookings([]);
      setTotalRecords(0);
    } catch (err) {
      showToast("error", "Fetch Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lazyParams]);

  /** Status badge template */
  const statusTemplate = (row) => {
    const statusMap = {
      PENDING: { severity: "warning", label: "Pending" },
      CONFIRMED: { severity: "info", label: "Confirmed" },
      ACTIVE: { severity: "success", label: "Active" },
      COMPLETED: { severity: "success", label: "Completed" },
      CANCELLED: { severity: "danger", label: "Cancelled" },
    };

    const status = statusMap[row.status] || { severity: "secondary", label: row.status };
    return <Tag value={status.label} severity={status.severity} />;
  };

  /** Actions column */
  const actionTemplate = (row) => {
    return (
      <div className="flex gap-2 justify-center">
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-info p-button-sm"
          onClick={() => {
            showToast("info", "View Booking", `Viewing booking ${row.id}`);
          }}
          tooltip="View Details"
        />
      </div>
    );
  };

  // Derived counts from current page
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;
  const activeBookings = bookings.filter((b) => b.status === "ACTIVE").length;

  return (
    <div className="p-6">
      <Toast ref={toast} />
      {loading && <ProgressBar mode="indeterminate" style={{ height: "4px" }} className="mb-3" />}

      {/* Manage Bookings + Summary Card */}
      <Card className="shadow-2 mb-6">
        <div className="flex flex-wrap justify-between items-center gap-6">
          <h2 className="text-xl font-semibold">Manage Bookings</h2>

          <div className="flex gap-8 text-center">
            <div>
              <h3 className="text-sm font-semibold">Total</h3>
              <p className="text-lg">{totalRecords}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Pending</h3>
              <p className="text-lg text-yellow-600">{pendingBookings}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Active</h3>
              <p className="text-lg text-green-600">{activeBookings}</p>
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
          value={bookings}
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
          stripedRows
          className="rounded-2xl"
          emptyMessage="No bookings found. Booking functionality is not yet implemented."
        >
          <Column field="bookingId" header="Booking ID" sortable />
          <Column field="customerName" header="Customer" sortable />
          <Column field="vehicleName" header="Vehicle" sortable />
          <Column field="startDate" header="Start Date" sortable />
          <Column field="endDate" header="End Date" sortable />
          <Column field="status" header="Status" body={statusTemplate} sortable />
          <Column body={actionTemplate} header="Actions" style={{ width: "8rem", textAlign: "center" }} />
        </DataTable>
      </div>
    </div>
  );
}