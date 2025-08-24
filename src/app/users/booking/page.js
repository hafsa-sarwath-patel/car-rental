"use client";

import { useState } from "react";

export default function BookingPage() {
  const [form, setForm] = useState({
    car: "",
    date: "",
    days: 1,
  });
  const [submitted, setSubmitted] = useState(false);

  const cars = [
    "Toyota Corolla",
    "Honda CR-V",
    "Ford Mustang",
    "Tesla Model 3",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send booking data to your backend
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "40px auto",
        background: "#232946",
        borderRadius: 12,
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        padding: 32,
        color: "#fff",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#2a5298", marginBottom: 24 }}>
        Book a Car
      </h2>
      {submitted ? (
        <div style={{ color: "#1e3c72", textAlign: "center" }}>
          Thank you! Your booking has been received.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="car" style={{ display: "block", marginBottom: 6 }}>
              Select Car
            </label>
            <select
              id="car"
              name="car"
              value={form.car}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid #b0b8c1",
                fontSize: 16,
              }}
            >
              <option value="">Choose a car</option>
              {cars.map((car) => (
                <option key={car} value={car}>
                  {car}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="date" style={{ display: "block", marginBottom: 6 }}>
              Start Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid #b0b8c1",
                fontSize: 16,
              }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="days" style={{ display: "block", marginBottom: 6 }}>
              Number of Days
            </label>
            <input
              type="number"
              id="days"
              name="days"
              min={1}
              value={form.days}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid #b0b8c1",
                fontSize: 16,
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px 0",
              background: "linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Book Now
          </button>
        </form>
      )}