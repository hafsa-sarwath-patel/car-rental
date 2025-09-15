"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }

    try {
      const res = await fetch("/api/v1/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      let body;
      try {
        body = await res.json();
      } catch {
        const text = await res.text();
        console.error("Non-JSON response from API:", text);
        setError("Server returned an invalid response. Check console for details.");
        return;
      }

      if (!res.ok) {
        setError(body.message || "Login failed");
        return;
      }

      const token = body.data;
      localStorage.setItem("token", token);
      sessionStorage.setItem("token", token);

      router.push("/admin/dashboard");

    } catch (err) {
      console.error("Fetch error:", err);
      setError("Network error or server unreachable");
    }
  };

  return (
    <div
      style={{
        background: "#f0f4fa17",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: "350px",
          width: "100%",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          padding: "32px 24px",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#2a5298", marginBottom: 24 }}>Login</h2>
        <form onSubmit={handleLogin}>
          {error && (
            <div
              style={{
                background: "#f8d7da",
                color: "#721c24",
                padding: "10px",
                borderRadius: 6,
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="username" style={{ display: "block", marginBottom: 6, color: "#1e3c72" }}>
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            <label htmlFor="password" style={{ display: "block", marginBottom: 6, color: "#1e3c72" }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              color: "#ffffff",
              border: "none",
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Login
          </button>
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <span style={{ color: "#1e3c72" }}>If new user, </span>
            <button
              type="button"
              onClick={() => router.push("/admin/signup")}
              style={{
                background: "none",
                border: "none",
                color: "#2a5298",
                textDecoration: "underline",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 16,
                padding: 0,
                marginLeft: 4,
              }}
            >
              Signup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
